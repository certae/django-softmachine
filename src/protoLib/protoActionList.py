# -*- coding: utf-8 -*-


from django.db import models
from django.http import HttpResponse
from django.contrib.admin.util import  get_fields_from_path
from django.utils.encoding import smart_str
from django.db.models import Q

from utilsBase import JSONEncoder, getReadableError 
from utilsBase import verifyStr, verifyList, list2dict    
from utilsConvert import getTypedValue

from protoQbe import getSearcheableFields, getQbeStmt
from protoAuth import getUserProfile, getModelPermissions

from usrDefProps import verifyUdpDefinition, readUdps 
from protoField import TypeEquivalence
from models import getDjangoModel 

from utilsWeb import doReturn 

import django.utils.simplejson as json
import traceback


def protoList(request):
#   Vista simple para cargar la informacion, 
    
    PAGESIZE = 50
    message = ''
    
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
    Qs, orderBy, fakeId = getQSet( protoMeta, protoFilter, baseFilter , sort , request.user )
    pRowsCount = Qs.count()


#   Fix: Cuando esta en la pagina el filtro continua en la pagina 2 y no muestra nada.     
#   if ( ( page -1 ) *limit >= pRowsCount ): page = 1
    
    if orderBy: 
        try: 
            pRows =  Qs.order_by(*orderBy)[ start: page*limit ]
        except: 
            pRows =  Qs.all()[ start: page*limit ]
    else: pRows =  Qs.all()[ start: page*limit ]

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
    JsonField = protoMeta.get( 'jsonField', '')
    if not isinstance( JsonField, ( str, unicode) ): JsonField = ''  

    pUDP = protoMeta.get( 'usrDefProps', {}) 
    cUDP = verifyUdpDefinition( pUDP )
    rows = []

    # Tablas de zoom para absorcion de campos 
    relModels = {}

    # Identifica las Udps para solo leer las definidas en la META
    if cUDP.udpTable :
        udpTypes =  {}; udpList =  []
        for lField  in protoMeta['fields']:
            fName = lField['name']
            if fName.startswith( cUDP.propertyPrefix + '__'): 
                udpList.append( fName )
                udpTypes[ fName ]  =  lField['type'] 


    # Verifica si existen reemplazos por hacer ( cpFromField )
    bCopyFromFld = False
    for lField  in protoMeta['fields']:
        fName = lField['name']
        if lField.get( 'cpFromField' ) is not None: bCopyFromFld = True

        # Alimenta la coleccion de zooms, los campos heredados de otras tablas deben hacer 
        # referencia a un campo de zoom, el contendra el modelo y la llave para acceder al registro  
        myZoomModel = lField.get( 'zoomModel', '')   
        if (len( myZoomModel ) > 0) and ( myZoomModel <> protoMeta['viewEntity']):
            # dos campos puede apuntar al mismo zoom, la llave es el campo, 
            # "cpFromZoom"  contiene el campo q apunta al zoom y no el modelo    
            relModels[ fName ] = { 'zoomModel' : myZoomModel, 'fkId' : lField.get( 'fkId', '') , 'loaded' : False }     


    # recorre para borrar los zooms q no tienen referencias
    # 1. recorre los campos y verifica si alguno hace referencia y lo marca  
    for lField in protoMeta['fields']:
        if bCopyFromFld and isAbsorbedField( lField, protoMeta  ) :
            try: 
                relModel = relModels[ lField.get( 'cpFromZoom' ) ]
                relModel[ 'loaded']  = True  
            except: pass
             
    # 2.  borra los q no tienen marca   
    for relName in relModels.keys():
        relModel = relModels[ relName ] 
        if not relModel[ 'loaded']: del relModels[ relName ]  
    
    #   Esta forma permite agregar las funciones entre ellas el __unicode__
    rowId = 0 
    for rowData in pRows:
        rowId += 1
        rowdict = {}

        # limpia los datos de tablas relacionadas
        for relName in relModels:
            relModel = relModels[ relName ] 
            relModel[ 'rowData']  = {}
            relModel[ 'loaded']  = False 
        
        # recorre los campos para obtener su valor 
        for lField  in protoMeta['fields']:
            fName = lField['name']
            pName = lField.get( 'physicalName', fName )  
            
            if lField.get( 'crudType' ) == "screenOnly" : continue 

            # UDP Se evaluan despues 
            if cUDP.udpTable and fName.startswith( cUDP.propertyPrefix + '__'): 
                continue  

            # N2N
            elif ( lField['type'] == 'protoN2N' ):
                try: 
                    val = list( rowData.__getattribute__( fName  ).values_list()) 
                except: val = '[]'
                rowdict[ fName ] = val
                continue 

            # Si el campo es absorbido ( bCopyFromFld es un shortcut para evitar la evulacion en caso de q no haya ningun cpFromField )    
            elif bCopyFromFld and isAbsorbedField( lField, protoMeta  ) :
                continue 
            
            rowdict[ fName ] = getFieldValue( pName, lField[ 'type'], rowData, JsonField )
        
        if cUDP.udpTable:
            # rowDict : se actualizara con los datos de la UDP
            # rowData es el registro de base, en caso de q sea un MD la lectura es automatica rowData.udpTable...
            # udpTypes  : lista de Udps a leer  
            readUdps( rowdict, rowData , cUDP, udpList,  udpTypes )

                
        # REaliza la absorcion de datos provenientes de un zoom 
        if bCopyFromFld:
            rowdict = copyValuesFromFields( protoMeta, rowdict, relModels, JsonField  )

#        if pStyle == 'tree':
#            rowdict[ 'viewEntity' ] = protoMeta.get('viewEntity', '')
#            rowdict[ 'leaf' ] = False; rowdict[ 'children' ] = []

        # Agrega el Id Siempre como idInterno ( no representa una col, idProperty )
        rowdict[ 'id'] = rowData.pk 
        if fakeId:
            rowdict[ 'id'] = rowId 
        
        # Agrega la fila al diccionario
        rows.append(rowdict)


    return rows

def getRowById( myModelName, myId ):
    """
    Retorna un registro dado un modelo y un id  
    """

#   Obtiene los datos 
    model = getDjangoModel( myModelName )
    myList = model.objects.filter( pk = myId )
    if len( myList ) > 0: 
        return myList[0]
    else:  return None 


def isAbsorbedField( lField , protoMeta ):
    """ Determina si el campo es heredado de un zoom,
    Pueden existir herencias q no tienen modelo, estas se manejar directamente por el ORM
    Las herencias manejadas aqui son las q implican un select adicional al otro registro, 
    utilizan la logica del zoom para traer la llave correspondiente 
    """
    if ( lField.get( 'isAbsorbed' )  ): return True 
    
    lField[ 'isAbsorbed' ] = False 
    if ( lField.get( 'cpFromField' ) is None ): return False  
    if ( lField.get( 'cpFromZoom' ) is None ): return False
    lField[ 'isAbsorbed' ] = True 

    return True 


def copyValuesFromFields( protoMeta, rowdict, relModels, JsonField):
    """ 
    Permite copiar campos q vienen de los zooms, 
    En el caso de prototipos hace un select a la instancia relacionada 
    """
    
    for lField  in protoMeta['fields']:
        cpFromField =  lField.get( 'cpFromField' )
        if not cpFromField: continue 

        fName = smart_str( lField['name'] ) 
        cpFromField = smart_str( cpFromField  )  

        if not isAbsorbedField( lField , protoMeta ):    
            # Es un copy q puede ser resuelto a partir del modelo objeto 
            # esta es la situacion normal cuando no se idetifica un modelo y se cargan los datos por jerarquia
            # por ahora requiere q el campo este tambien en el modelo ( se puede cambiar si hay la necesidad )
            
            # Se uso para copiar cosas de discretas y debia mostrar y al editar deberia guardar el valor    
            # Si ya contiene algun valor, sale, solo copia cuando es nulo. 
            val = rowdict.get( fName, None )  
            if ( val ) and smart_str( val ).__len__() > 0: continue
            
            val = rowdict.get( cpFromField , None )
            if ( val is None ) : val = '' 

        else:
            # Esta es la situacion de los prototipos q requieren el cpFromZoom,
            # se hace un select adicional para obtner el registro relacionado 

            cpFromZoom = lField.get( 'cpFromZoom' )
             
            try: 
                relModel = relModels[ cpFromZoom ]
            except: 
                # para envitar volverlo a leer, si son varios campos del mismo registro   
                relModel = { 'loaded': True, 'rowData' : None   }

            if not relModel['loaded']: 
                # Obtiene el id 
                rowId = rowdict[ relModel['fkId'] ]
                relModel['rowData'] =  getRowById( relModel['zoomModel'], rowId )
                relModel['loaded']  =  True  

            rowData = relModel['rowData']
            if rowData is not None  : 
                # interpreta los datos del registro 
                val  =  getFieldValue( cpFromField, lField[ 'type'], rowData  , JsonField )
            else: val = 'pt??'
             
        rowdict[ fName ] = val 

    return rowdict 


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
#   Qs = model.objects.select_related(depth=1)
    Qs = model.objects

#   Filtros por seguridad ( debe ser siempre a nivel de grupo ) 
    if isProtoModel and not pUser.is_superuser:  
#       Qs = Qs.filter( Q( smOwningTeam__in = userNodes ) | Q( smOwningUser = pUser  ) )
        Qs = Qs.filter( smOwningTeam__in = userNodes ) 

#   TODO: Agregar solomente los campos definidos en el safeMeta  ( only,  o defer ) 
#   Qs.query.select_fields = [f1, f2, .... ]     


#   Le pega la meta al modelo para tomar por ejemplo searchFields 
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
    if hasattr( model , 'unicode_sort' ): 
        unicodeSort = model.unicode_sort
    else: unicodeSort = model._meta.unique_together[0]
    return unicodeSort 
    

def addQbeFilter( protoFilter, model, Qs, JsonField ):

    # No hay criterios 
    if len( protoFilter) == 0: 
        return Qs

    protoFilter =  verifyList(  protoFilter )

    for sFilter in protoFilter: 
        
        if sFilter[ 'property' ] == '_allCols':
            # debe descomponer la busqueda usando el objeto Q 
            QTmp = getTextSearch( sFilter, model, JsonField  )
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
    fieldName  =  sFilter['property']
    
    if fieldName.endswith('__pk') or fieldName.endswith('_id') or fieldName == 'pk': 
        # Los id por ahora son numericos 
        sType = 'int' 

    elif fieldName == '__str__': 
        # El campo especial __str__ debe ser descompuesto en los seachFields en forma explicita  
        return Q()

    elif fieldName.startswith( JsonField + '__'): 
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


def getTextSearch( sFilter, model , JsonField):        

    #   Busqueda Textual ( no viene con ningun tipo de formato solo el texto a buscar
    #   Si no trae nada deja el Qs con el filtro de base
    #   Si trae algo y comienza por  "{" trae la estructura del filtro   

    # Si solo viene el texto, se podria tomar la "lista" de campos "mostrados"
    # ya los campos q veo deben coincidir con el criterio, q pasa con los __str__ ?? 
    # Se busca sobre los campos del combo ( filtrables  )
    
    QStmt = None 
    
    try: 
        pSearchFields = model.protoMeta['gridConfig']['searchFields']
        fieldsDict = list2dict( model.protoMeta[ 'fields' ], 'name')    
    except: 
        pSearchFields = getSearcheableFields( model  )
        fieldsDict = {}


    for fName in pSearchFields:
        fAux = fieldsDict.get( fName, {})
        if fAux.get( 'type', '' )  not in [ 'string', 'text',  'protojson' ]: continue   
            
        QTmp = addQbeFilterStmt( {'property': fName, 'filterStmt': sFilter['filterStmt'] } , model, JsonField )

        if QStmt is None:  QStmt = QTmp
        else: QStmt = QStmt | QTmp 

    return QStmt 


def getFieldValue( fName, fType, rowData, JsonField ):

    #Es una funcion 
    if ( fName  == '__str__'   ):
        try: 
            val = eval( 'rowData.__str__()'  )
            val = verifyStr(val , '' )
        except: 
            val = 'Id#' + verifyStr(rowData.pk, '?')

    elif fName.startswith( '@'):
        val = evalueFuncion( fName, rowData ) 

    elif ( fName  == JsonField   ):
        # Master JSonField ( se carga texto ) 
        try: 
            val = rowData.__getattribute__( fName  ) 
        except: val = {}
        if isinstance(val, dict):
            val = json.dumps( val , cls=JSONEncoder )

    elif fName.startswith( JsonField + '__'): 
        # JSon fields 
        try: 
            val = rowData.__getattribute__( JsonField  ) 
            val = val.get( fName[ len( JsonField + '__'):] )
            val = getTypedValue( val, fType )
            
        except: val = ''

        
    elif ( '__' in fName ):
        # Campo Absorbido modo objeto 
        try: 
            val = eval( 'rowData.' + fName.replace( '__', '.'))
            val = verifyStr(val , '' )
        except: val = '__?'


    # Campo del modelo                 
    else:
        try:
            val = getattr( rowData, fName  )
            # Si es una referencia ( fk ) es del tipo model 
            if isinstance( val, models.Model): 
                val = verifyStr(val , '' )
        except: val = 'vr?'
        
        # Evita el valor null en el el frontEnd 
        if val is None: val = ''


    return val 


def evalueFuncion( fName, rowData ): 
    """ para evaluar las funciones @  declaradas en el modelo  
    """
    
    # obtener el titulo y los parametros y enviar la tupla 
    
    try: 
        expr = 'rowData.' + fName[1:]
        val = eval(  expr  )
        val = verifyStr(val , '' )
    except: val =  fName + '?'
    
    return val 
    


