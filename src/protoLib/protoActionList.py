# -*- coding: utf-8 -*-


#from django.db import models
#from protoField import TypeEquivalence

from django.http import HttpResponse
from django.utils.encoding import smart_str

from utilsBase import JSONEncoder, getReadableError 
from utilsBase import verifyStr, verifyList, list2dict    
#from utilsConvert import getTypedValue

from protoQbe import addQbeFilter
from protoAuth import getUserProfile, getModelPermissions

from usrDefProps import verifyUdpDefinition, readUdps 
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

        
#   Obtiene las filas del modelo 
    PrepareMeta2Load( protoMeta  )
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
    
    dataRows =  Qs.all()[ start: page*limit ]

    try:
        pList = Q2Dict(protoMeta , dataRows, fakeId  )
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
def Q2Dict (  protoMeta, dataRows, fakeId  ):
    """ 
        return the row list from given queryset  
    """

#    pStyle = protoMeta.get( 'pciStyle', '')        
    rows = []
    
    if protoMeta[ 'jsonField' ]: 
        jsonPrefix = protoMeta[ 'jsonField' ] + '__'
    else: jsonPrefix = ''  
    jPrefLen = len( jsonPrefix )
    
    #   Esta forma permite agregar las funciones entre ellas el __unicode__
    rowId = 0 
    for dataReg in dataRows:
        rowId += 1

        # Obtiene los campos base 
        rowdict = { k : v for k,v in dataReg.__dict__.iteritems() if k in protoMeta['fBase'] }
        rows.append(rowdict)

        # se asegura q tenga un id 
        if fakeId: 
            rowdict[ 'id'] = rowId 
        elif 'id' not in protoMeta['fBase']: 
            rowdict[ 'id'] = dataReg.pk 

        # str
        if protoMeta['getStr']: 
            try: 
                val = dataReg.__str__()
#                val = eval("'{0}'.format( rowdict['code']) ")
            except: val = '__str#' + verifyStr(dataReg.pk, '?')
            rowdict[ '__str__'] = val  


        for fName in protoMeta['fZooms']:
            val = getattr( dataReg, fName ,  fName + '?' )
            rowdict[ fName ]  = verifyStr(val , '' )

        for fName in protoMeta['fRels']:
            try: 
                val = eval( 'dataReg.' + fName.replace( '__', '.'))
            except: val = fName + '?'
            rowdict[ fName ]  = verifyStr(val , '' )

        # @   Evalua una funcion del modelo  ( dataReg.function ) 
        # @@  TODO: evalua una funcion almacenada 
        for fName, pName  in protoMeta['fEvals']:
            rowdict[ fName ]  = evalueFuncion( pName, dataReg ) 

        for fName in protoMeta['n2n']:
            try: 
                val = list( dataReg.__getattribute__( fName  ).values_list()) 
            except: val = '[]'
            rowdict[ fName ] = val

        if protoMeta['jsonField']:  
            try: 
                jDoc  = getattr( dataReg, protoMeta['jsonField'] , {} )
                for fName in protoMeta['fJson']:
                    val = jDoc.get( fName[ jPrefLen : ] )
                    #val = getTypedValue( val, fType )
                    rowdict[ fName ]  = val 
            except:  pass 


        if protoMeta[ 'udps' ]:
            readUdps( rowdict, dataReg , protoMeta[ 'cUDP' ], protoMeta[ 'udpList' ],  protoMeta[ 'udpTypes' ] )


        # construye un cache de los zooms invocados ( prototype )   
        for relName in protoMeta['relModels']:
            relModel = protoMeta['relModels'][ relName ]
            
            # Obtiene el id 
            relFKey = relModel.get( 'fkId', '') 
            relId = rowdict.get( relFKey ,  None  )
            if relId is None: continue 
             
            # Obtiene la fila    
            relRow = relModel[ 'rows' ].get( relId  , None )
            if relRow is None:  
                relRow =  getRowById( relModel['zoomModel'], relId )
                relModel[ 'rows' ][ relId  ] = relRow 
                relModel[ 'currentRow' ] = relRow
            else: 
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
    
                zoomReg = relModel[ 'currentRow' ]
                if zoomReg: 
                    if cpFromField.startswith( jsonPrefix ): 
                        try: 
                            jDoc  = getattr( zoomReg, protoMeta['jsonField'] , {} )
                            val = jDoc.get( cpFromField[ jPrefLen : ] )
                            rowdict[ fName ]  = val 
                        except:  pass 
                    else:
                        rowdict[ fName ] = getattr( zoomReg, cpFromField ,  '' )

#        if pStyle == 'tree':
#            rowdict[ 'viewEntity' ] = protoMeta.get('viewEntity', '')
#            rowdict[ 'leaf' ] = False; rowdict[ 'children' ] = []
    
    return rows

def getRowById( myModelName, myId ):
    """ Retorna un registro dado un modelo y un id  
    """
    model = getDjangoModel( myModelName )
    myQs = model.objects.filter( pk = myId )
    if len( myQs ) > 0: 
        return myQs[0]
    else:  return None  


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
    


def evalueFuncion( fName, dataReg ): 
    """ para evaluar las funciones @  declaradas en el modelo  
    """
    try: 
        expr = 'dataReg.' + fName[1:]
        val = eval(  expr  )
        val = verifyStr(val , '' )
    except: val =  fName + '?'
    return val 


def PrepareMeta2Load( protoMeta ):
    """IDenfifica los typos de campos para optimizar la carga de datos
    """

    #Nombre de la entidad de trabajo 
    viewEntity = protoMeta['viewEntity']

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
    else: 
        protoMeta[ 'udps' ] = False  
        protoMeta[ 'udpClass' ] = None  


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
        
        if (len( myZoomModel) > 0) and (myZoomModel != viewEntity) :
            #por q debe ser diferente del viewEntity, podria ser una autoreferencia, acaso viene cargada sin ser un zoom
            #Dgt! los cellZoom usan el zoomModel ( _str_ )  
            protoMeta['relModels'][ fName ] = { 
                               'zoomModel' : myZoomModel, 
                               'fkId' : lField.get( 'fkId', '') , 
                               'loaded' : False }     

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
            
        elif lField['type'] == 'foreigntext' :
            protoMeta['fZooms'].append( fName )
            # No aplica para  prototypos
            if not viewEntity.startswith( 'prototype.ProtoTable'):  
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
        if not relModel[ 'loaded']: 
            del protoMeta['relModels'][ relName ]
        else: relModel['rows'] = {}   
