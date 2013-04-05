# -*- coding: utf-8 -*-


from django.db import models
from django.http import HttpResponse
from django.contrib.admin.util import  get_fields_from_path
from django.utils.encoding import smart_str
from django.db.models import Q

from utilsBase import JSONEncoder, getReadableError 
from utilsBase import verifyStr, verifyList, list2dict    
#from utilsConvert import getTypedValue

from protoQbe import getSearcheableFields, getQbeStmt
from protoAuth import getUserProfile, getModelPermissions

from usrDefProps import verifyUdpDefinition, readUdps 
from protoField import TypeEquivalence
from models import getDjangoModel 

from utilsWeb import doReturn 
from utilsBase import slugify

import django.utils.simplejson as json
import traceback


def protoList(request):
#   Vista simple para cargar la informacion, 
    
    PAGESIZE = 50
    message = ''

    if not request.user.is_authenticated(): 
        return doReturn ({'success':False ,'message' : 'readOnly User'})
    
    if request.method != 'POST':
        return doReturn ({'success':False, 'message' : 'invalid message'}) 

#   Los objetos vienen textoJson y hay q hacer el load para construirlos como objetos. 
    protoMeta = request.POST.get('protoMeta', '')
    protoMeta = json.loads(protoMeta)

#     
    protoFilter = request.POST.get('protoFilter', '')
    baseFilter = request.POST.get('baseFilter', '')
    sort = request.POST.get('sort', '')
    
    start = int(request.POST.get('start', 0))
    page = int(request.POST.get('page', 1))
    limit = int(request.POST.get('limit', PAGESIZE ))


    # TODO: Prepara Query  ( agregar en otros modulos q laman  Q2Dict  
    PrepareMeta2Load( protoMeta  )
        
#   Obtiene las filas del modelo 
    Qs, orderBy, fakeId = getQSet( protoMeta, protoFilter, baseFilter , sort , request.user )
    pRowsCount = Qs.count()

#   Fix: Cuando esta en la pagina el filtro continua en la pagina 2 y no muestra nada.     
#   if ( ( page -1 ) *limit >= pRowsCount ): page = 1
    
    if orderBy: 
        try: 
            Qs =  Qs.order_by(*orderBy)
        except:  pass
    
    if len( protoMeta['relZooms'] ) > 0 : 
        Qs = Qs.prefetch_related( *protoMeta['relZooms'] )
    
    pRows =  Qs.all()[ start: page*limit ]

#   Prepara las cols del Query 
    try:
        pList = Q2Dict(protoMeta , pRows, fakeId  )
        bResult = True 
    except Exception,  e:
        traceback.print_exc()
        message = getReadableError( e ) 
        bResult = False  
        pList = []


    context = json.dumps({
            'success': bResult,
            'message': message,
            'totalCount': pRowsCount,
            'filter': protoFilter,
            'rows': pList,
            }, cls=JSONEncoder )
    
    return HttpResponse(context, mimetype="application/json")



# Obtiene el diccionario basado en el Query Set 
def Q2Dict (  protoMeta, pRows, fakeId  ):
    """ 
        return the row list from given queryset  
    """

#    pStyle = protoMeta.get( 'pciStyle', '')        
    rows = []
    
    #   Esta forma permite agregar las funciones entre ellas el __unicode__
    rowId = 0 
    for rowData in pRows:
        rowId += 1

        # Obtiene los campos base 
        rowdict = { k : v for k,v in rowData.__dict__.iteritems() if k in protoMeta['fBase'] }
        rows.append(rowdict)

        # se asegura q tenga un id 
        if fakeId: 
            rowdict[ 'id'] = rowId 
        elif 'id' not in protoMeta['fBase']: 
            rowdict[ 'id'] = rowData.pk 

        # str
        if protoMeta['getStr']: 
            try: 
                val = rowData.__str__()
#                val = eval("'{0}'.format( rowdict['code']) ")
            except: val = '__str#' + verifyStr(rowData.pk, '?')
            rowdict[ '__str__'] = val  


        for fName in protoMeta['fZooms']:
            val = getattr( rowData, fName ,  fName + '?' )
            rowdict[ fName ]  = verifyStr(val , '' )

        for fName in protoMeta['fRels']:
            try: 
                val = eval( 'rowData.' + fName.replace( '__', '.'))
            except: val = fName + '?'
            rowdict[ fName ]  = verifyStr(val , '' )

        # @   Evalua una funcion del modelo  ( rowData.function ) 
        # @@  TODO: evalua una funcion almacenada 
        for fName, pName  in protoMeta['fEvals']:
            rowdict[ fName ]  = evalueFuncion( pName, rowData ) 

        for fName in protoMeta['n2n']:
            try: 
                val = list( rowData.__getattribute__( fName  ).values_list()) 
            except: val = '[]'
            rowdict[ fName ] = val

        if protoMeta['jsonField']:  
            try: 
                #jDoc  = rowData.__getattribute__( protoMeta['jsonField']  )
                jDoc  = getattr( rowData, protoMeta['jsonField'] , {} )
                jPref = len( protoMeta['jsonField'] + '__')
                for fName in protoMeta['fJson']:
                    val = jDoc.get( fName[ jPref : ] )
                    #val = getTypedValue( val, fType )
                    rowdict[ fName ]  = val 
            except:  pass 


        if protoMeta[ 'udps' ]:
            readUdps( rowdict, rowData , protoMeta[ 'cUDP' ], protoMeta[ 'udpList' ],  protoMeta[ 'udpTypes' ] )


        # construye un cache de los zooms invocados ( prototype )   
        for relName in protoMeta['relModels']:
            relModel = protoMeta['relModels'][ relName ]
            
            # Obtiene el id 
            relFKey = relModel['fkId']
            relId = getattr( rowData, relFKey ,  None  )
            relModel[ 'currentRow' ] = {}
            if relId is None: continue 
             
            # Obtiene la fila    
            relRow = getattr( relModel[ 'rows' ], relId  , None )
            if relRow is None:  
                relRow =  getRowById( relModel['zoomModel'], relId )
                relModel[ 'rows' ][ relId  ] = relRow 
                relModel[ 'currentRow' ] = relRow


        # Realiza la absorcion de datos provenientes de un zoom 
        for fName in protoMeta['fCopys']:
            
            # Verificar si hay un dict 
            lField = protoMeta['fieldsDict'][ fName ]

            # Solo los campos son slugify, los modelos no 
            cpFromField =  slugify( lField.get( 'cpFromField' ) ) 
            cpFromZoom = lField.get( 'cpFromZoom', '' )
    
            if len( cpFromZoom ) == 0:   
                # Es un copy q puede ser resuelto a partir del modelo objeto 
                # esta es la situacion normal cuando no se idetifica un modelo y se cargan los datos por jerarquia
                # se requiere q el campo este precargado en el modelo
                
                # Se uso para copiar de discretas,  respeta el vr por defecto el vr en el campo     
                val = rowdict.get( fName, '' )  
                if smart_str( val ).__len__() > 0: continue
                
                rowdict[ fName ] = rowdict.get( cpFromField , '' )
    
            else:

                # Esta es la situacion de los prototipos q requieren el cpFromZoom,
                # se toman los datos del cache  
                try: 
                    relModel = protoMeta['relModels'][ cpFromZoom ]
                except: continue 
    
                rowData = relModel[ 'currentRow' ]
                rowdict[ fName ] = rowData.get( cpFromField , '' )
             
#        if pStyle == 'tree':
#            rowdict[ 'viewEntity' ] = protoMeta.get('viewEntity', '')
#            rowdict[ 'leaf' ] = False; rowdict[ 'children' ] = []

    
    return rows

def getRowById( myModelName, myId ):
    """ Retorna un registro dado un modelo y un id  
    """
    model = getDjangoModel( myModelName )
    myList = model.objects.filter( pk = myId ).values()
    if len( myList ) > 0: 
        return myList[0]
    else:  return {} 


def getUserNodes( pUser, viewEntity ):
    userProfile = getUserProfile( pUser, 'list', viewEntity  ) 
    userNodes = userProfile.userTree.split(',')   
        
    return userNodes
        

def getQSet(  protoMeta, protoFilter, baseFilter , sort , pUser  ):
    
#   Decodifica los eltos 
    viewEntity = protoMeta.get('viewEntity', '')
    model = getDjangoModel(viewEntity)

#   Autentica '
    if not getModelPermissions( pUser, model, 'list' ):
        return model.objects.none(), [], False 

#   modelo Administrado
    isProtoModel = hasattr( model , '_protoObj' )
    if isProtoModel: 
        userNodes = getUserNodes( pUser, viewEntity )

#   JsonField
    JsonField = protoMeta.get( 'jsonField', '')
    if not isinstance( JsonField, ( str, unicode) ): JsonField = ''  

#   QSEt
    Qs = model.objects

#   Filtros por seguridad ( debe ser siempre a nivel de grupo ) 
    if isProtoModel and not pUser.is_superuser:  
#       Qs = Qs.filter( Q( smOwningTeam__in = userNodes ) | Q( smOwningUser = pUser  ) )
        Qs = Qs.filter( smOwningTeam__in = userNodes ) 


#   FIX??  Le pega la meta al modelo para tomar por ejemplo searchFields 
    model.protoMeta = protoMeta

#   El filtro base viene en la configuracion MD 
    try:
        Qs = addQbeFilter( baseFilter, model, Qs , JsonField )
    except Exception as e:
        traceback.print_exc()
        getReadableError( e ) 

#   Order by 
    localSort = protoMeta.get('localSort', False)
    orderBy = []
    if not localSort :
        sort = verifyList( sort )
        for sField in sort: 
    
            # Verificar que el campo de sort haga parte de los campos del modelo   
            # blacklist = [f.name for f in instance._meta.fields] + ['id', 'user']
            
            # Unicode sort 
            if sField['property'] == '__str__' : 
                unicodeSort = getUnicodeFields( model ) 
                for sAux in unicodeSort:
                    if sField['direction'] == 'DESC': sAux = '-' + sAux
                    orderBy.append( sAux )
                    
            else:
                if sField['direction'] == 'DESC': sField['property'] = '-' + sField['property']
                orderBy.append( sField['property'] )
                
    orderBy = tuple( orderBy )

    try:
        Qs = addQbeFilter( protoFilter, model, Qs, JsonField )
    except Exception as e:
        traceback.print_exc()
        getReadableError( e ) 

    # DbFirst en caso de q no exista una llave primaria   
    fakeId = hasattr( model , '_fakeId' ) 

    return Qs, orderBy, fakeId


def getUnicodeFields( model ):
    unicodeSort = () 
    # TODO: Se debe redefinir para cargarse en la meta 
#    if hasattr( model , 'unicode_sort' ): 
#        unicodeSort = model.unicode_sort
#    elif hasattr( model._meta , 'unique_together' ): 
#        unicodeSort = model._meta.unique_together[0]
    return unicodeSort 
    

def addQbeFilter( protoFilter, model, Qs, JsonField ):

    # No hay criterios 
    if len( protoFilter) == 0: 
        return Qs

    protoFilter =  verifyList(  protoFilter )

    for sFilter in protoFilter: 
        
        if sFilter[ 'property' ] == '_allCols':
            # debe descomponer la busqueda usando el objeto Q 
            QTmp = getTextSearch( sFilter, model, model.protoMeta )
            if QTmp is None:  QTmp = models.Q()

            try:
                Qs = Qs.filter( QTmp  )
            except:
                traceback.print_exc()

        else: 
            # Los campos simples se filtran directamente, se require para el JSonField 
            QTmp = addQbeFilterStmt( sFilter, model, JsonField )
            QTmp = dict((x, y) for x, y in QTmp.children)
            try:
                Qs = Qs.filter( **QTmp  )
            except:
                traceback.print_exc()
    

    return Qs


def addQbeFilterStmt( sFilter, model, JsonField ):
    """ Verifica casos especiales y obtiene el QStmt 
        retorna un objeto Q
    """
    fieldName  =  sFilter['property'].replace( '.', '__')
    
    if JsonField: JsonFieldName = JsonField
    else: JsonField = ''  
    
    if fieldName.endswith('__pk') or fieldName.endswith('_id') or fieldName == 'pk': 
        # Los id por ahora son numericos 
        sType = 'int' 

    elif fieldName == '__str__': 
        # El campo especial __str__ debe ser descompuesto en los seachFields en forma explicita  
        return Q()

    elif fieldName.startswith( JsonFieldName + '__'):  
        sType = 'string'

    else:
        try: 
            # Obtiene el tipo de dato, si no existe la col retorna elimina la condicion
            field = get_fields_from_path( model, fieldName )[-1]
            sType = TypeEquivalence.get( field.__class__.__name__, 'string')
        except :
            return Q()
        
    QStmt = getQbeStmt( fieldName , sFilter['filterStmt'], sType  )
    
    return QStmt 


def getTextSearch( sFilter, model , protoMeta ):        
    #   Busqueda Textual ( no viene con ningun tipo de formato solo el texto a buscar
    #   Si no trae nada deja el Qs con el filtro de base
    #   Si trae algo y comienza por  "{" trae la estructura del filtro   

    # Si solo viene el texto, se podria tomar la "lista" de campos "mostrados"
    # ya los campos q veo deben coincidir con el criterio, q pasa con los __str__ ?? 
    # Se busca sobre los campos del combo ( filtrables  )

    QStmt = None 
    try: 
        pSearchFields = protoMeta['gridConfig']['searchFields']
    except: 
        pSearchFields = getSearcheableFields( model  )

    fieldsDict = protoMeta[ 'fieldsDict' ]    
    JsonField = protoMeta[ 'jsonField']    

    for fName in pSearchFields:
        fAux = fieldsDict.get( fName, {})
        if fAux.get( 'type', '' )  not in [ 'string', 'text',  'jsonfield' ]: continue   
            
        QTmp = addQbeFilterStmt( {'property': fName, 'filterStmt': sFilter['filterStmt'] } , model, JsonField )

        if QStmt is None:  QStmt = QTmp
        else: QStmt = QStmt | QTmp 

    return QStmt 


def evalueFuncion( fName, rowData ): 
    """ para evaluar las funciones @  declaradas en el modelo  
    """
    try: 
        expr = 'rowData.' + fName[1:]
        val = eval(  expr  )
        val = verifyStr(val , '' )
    except: val =  fName + '?'
    return val 


def PrepareMeta2Load( protoMeta ):
    """IDenfifica los typos de campos para optimizar la carga de datos
    """

    protoMeta[ 'fieldsDict' ] = list2dict( protoMeta[ 'fields' ], 'name')    

    pUDP = protoMeta.get( 'usrDefProps', {}) 
    cUDP = verifyUdpDefinition( pUDP )

    # Identifica las Udps para solo leer las definidas en la META
    # Verificar el modulo  Django-EAV 
    if cUDP.udpTable :
        udpTypes =  {}; udpList =  []
        for lField  in protoMeta['fields']:
            fName = lField['name']
            if fName.startswith( cUDP.propertyPrefix + '__'): 
                udpList.append( fName )
                udpTypes[ fName ]  =  lField['type'] 
        protoMeta[ 'udpList' ] = udpList
        protoMeta[ 'udpTypes' ] = udpTypes
        protoMeta[ 'udpClass' ] = cUDP 
        protoMeta[ 'udps' ] = True 
    else: protoMeta[ 'udps' ] = False  


    # Alimenta la coleccion de zooms, por cada campo pues hay q hacer un select para esto
    # Determina el tipo de campo para no estar haciendo verificacion en todos lados   
    protoMeta['getStr'] = False 

    JsonField = protoMeta.get( 'jsonField', '')
    if len( JsonField ) == 0 :
        protoMeta['jsonField'] = False 
    else:  protoMeta['jsonField'] = JsonField   

    protoMeta['fBase'] = []      # directos de la Db ( solo se aplican los valores )  
    protoMeta['fZooms'] = []     # el __str__ del fk   
    protoMeta['fRels'] = []      # provenientes de un fk ( __ , . ) 
    protoMeta['fJson'] = []      # sub campos en un doc json 
    protoMeta['fEvals'] = []     # calculados python 
    protoMeta['fCopys'] = []     # Copiados ( necesario en prototypos )  
    protoMeta['n2n'] = []        # lista relacionada, esto se debe cargar en un objeto aparte  

    protoMeta['relZooms'] = []   # los zooms a los q debe hacer prefetch
    protoMeta['relModels'] = {}  # los zooms a los q debe llamar manualmente ( prototipos )


    for lField  in protoMeta['fields']:
        """"el manejo de physical name permite definir funciones, 
            por ejemplo la redefinicion de un _str__ o 
            calculos en el backEnd 
        """
        fName = lField['name']
        pName = lField.get( 'pyEval', '' )  

        myZoomModel = lField.get( 'zoomModel', '')   
        if (len( myZoomModel ) > 0) and  ( myZoomModel <> protoMeta['viewEntity']):
            protoMeta['relModels'][ fName ] = { 'zoomModel' : myZoomModel, 'fkId' : lField.get( 'fkId', '') , 'loaded' : False }     

        #Separar los tipos de campo para evaluacion 
        # ------------------------------------------------------
        if lField.get( 'crudType' ) == "screenOnly" : 
            pass 

        elif ( lField['type'] == 'protoN2N' ):
            pass 

        elif ( fName  == JsonField   ):
            pass  

        elif ( fName  == '__str__'   ) :
            if not pName.startswith( '@'):  protoMeta['getStr'] = True  

        elif fName.startswith( JsonField + '__'): 
            protoMeta['fJson'].append( fName )
            
        elif lField['type'] == 'foreigntext':
            protoMeta['fZooms'].append( fName ) 
            if not myZoomModel.startswith( 'prototype.ProtoTable') : 
                protoMeta['relZooms'].append( fName )

        elif ( '__' in fName or '.' in fName )   :
            protoMeta['fRels'].append( fName )

        else :
            protoMeta['fBase'].append( fName ) 

        # cp from field ( respeta el default ) 
        if len( lField.get( 'cpFromField', '' )) > 0:   
            protoMeta['fCopys'].append( fName ) 

        # phisicalName    
        if pName.startswith( '@'):                         
            protoMeta['fEvals'].append( ( fName, pName ) ) 
        

    # Verifica si existen reemplazos por hacer ( cpFromField ) 
    # 1.  Marca los zooms q estan referenciados 
    for lField  in protoMeta['fields']:
        fName = lField['name']
        if ( lField.get( 'cpFromField' ) is None or lField.get( 'cpFromZoom' ) is None ): continue  
        try:          
            relModel = protoMeta['relModels'][ lField.get( 'cpFromZoom' ) ]
            relModel[ 'loaded']  = True  
        except: pass
             
    # 2.  borra los q no tienen marca pues no se usan    
    for relName in protoMeta['relModels'].keys():
        relModel = protoMeta['relModels'][ relName ] 
        if not relModel[ 'loaded']: del protoMeta['relModels'][ relName ]  

