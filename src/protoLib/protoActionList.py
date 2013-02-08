# -*- coding: utf-8 -*-


from django.db import models
from django.http import HttpResponse
from django.contrib.admin.util import  get_fields_from_path
from django.utils.encoding import smart_str
from django.db.models import Q

from protoQbe import construct_search, addFilter, getSearcheableFields, getQbeStmt
from utilsBase import JSONEncoder, getReadableError 
from utilsBase import _PROTOFN_ , verifyStr   
from protoUdp import verifyUdpDefinition, readUdps 
from protoField import TypeEquivalence
from models import getDjangoModel 

import django.utils.simplejson as json
import operator
import traceback


def protoList(request):
#   Vista simple para cargar la informacion, 
    
    PAGESIZE = 50
    message = ''
    
    if request.method != 'POST':
        return 

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
        pRows =  Qs.order_by(*orderBy)[ start: page*limit ]
    else: pRows =  Qs[ start: page*limit ]

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

    pUDP = protoMeta.get( 'protoUdp', {}) 
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
    copyValueFromField = False
    for lField  in protoMeta['fields']:
        fName = lField['name']
        if lField.get( 'cpFromField', '' ) <> '':  
            copyValueFromField = True

        # Alimenta la coleccion de zooms, los campos heredados de otras tablas deben hacer 
        # referencia a un campo de zoom, el contendra el modelo y la llave para acceder al registro  
        myZoomModel = lField.get( 'zoomModel', '')   
        if (len( myZoomModel ) > 0) and ( myZoomModel <> protoMeta['protoView']):
            # dos campos puede apuntar al mismo zoom, la llave es el campo, 
            # "cpFromModel"  contiene el campo q apunta al zoom y no el modelo    
            relModels[ fName ] = { 'zoomModel' : myZoomModel, 'fkId' : lField.get( 'fkId', '') , 'loaded' : False }     


    # recorre para borrar los zooms q no tienen referencias
    # 1. recorre los campos y verifica si alguno hace referencia y lo marca  
    for lField in protoMeta['fields']:
        if copyValueFromField and isAbsorbedField( lField, protoMeta  ) :
            try: 
                relModel = relModels[ lField.get( 'cpFromModel', '' ) ]
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

            # Valores absorbidos on select a otros modelos 
            elif copyValueFromField and isAbsorbedField( lField, protoMeta  ) :
                try: 
                    relModel = relModels[ lField.get( 'cpFromModel', '' ) ]
                except: 
                    relModel = { 'loaded': True, 'rowData' : {} }
                    
                if not relModel['loaded']: 
                    relModel['loaded']  =  True  
                    relModel['rowData'] =  getRowById( relModel['zoomModel'], relModel['fkId'] )

                rowdict[ fName ] = relModel['rowData'][ lField.get( 'cpFromField', '' ) ] 
                continue  
            
            rowdict[ fName ] = getFieldValue( fName, rowData, JsonField )
        
        if cUDP.udpTable:
            # rowDict : se actualizara con los datos de la UDP
            # rowData es el registro de base, en caso de q sea un MD la lectura es automatica rowData.udpTable...
            # udpTypes  : lista de Udps a leer  
            readUdps( rowdict, rowData , cUDP, udpList,  udpTypes )

                
        # REaliza la absorcion de datos provenientes de un zoom 
        if copyValueFromField:
            rowdict = copyValuesFromFields( protoMeta, rowdict  )

#        if pStyle == 'tree':
#            rowdict[ 'protoView' ] = protoMeta.get('protoOption', '')
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
    myList = model.objects.filter( pk = myId ).values()
    if len( myList ) > 0: 
        return myList[0]
    else:  return {}


def isAbsorbedField( lField , protoMeta ):
    """ Determina si el campo es heredado de un zoom,
    Pueden existir herencias q no tienen modelo, estas se manejar directamente por el ORM
    Las herencias manejadas aqui son las q implican un select adicional al otro registro, 
    utilizan la logica del zoom para traer la llave correspondiente 
    """
    if lField.get( 'cpFromField', '' ) <> '': return False  
    if lField.get( 'cpFromModel', '' ) <> '': return False
    
    # No debe ser del mismo modelo ( usa la vista q por defecto es el protoConcept menos en los prototipos 
    if lField['cpFromModel'] == protoMeta.get('protoView', ''): return False  
         
    return True 


def copyValuesFromFields( protoMeta, rowdict ):
    
    for lField  in protoMeta['fields']:
        cpFromField =  lField.get( 'cpFromField', None )
        if not cpFromField: continue 

        # Los datos ya fueron cargados es un campo heredado 
        if isAbsorbedField( lField , protoMeta ): continue   

        cpFromField = smart_str( cpFromField  )  
        fName = smart_str( lField['name'] ) 
        val = rowdict.get( fName, None )  
        if ( val ) and smart_str( val ).__len__() > 0: continue
        
        val = rowdict.get( cpFromField , None )
        if ( val ) : rowdict[ fName ] = val 

    return rowdict 


def getUserNodes( pUser ):
    try: 
        userProfile  = pUser.get_profile()
        userNodes = userProfile.userTree.split(',')   
    except: 
        userNodes = []
        
    return userNodes
        

def getQSet(  protoMeta, protoFilter, baseFilter , sort , pUser  ):
    
#   Decodifica los eltos 
    protoConcept = protoMeta.get('protoConcept', '')
    model = getDjangoModel(protoConcept)

#   modelo Administrado
    isProtoModel = hasattr( model , '_protoObj' )
    if isProtoModel: 
        userNodes = getUserNodes( pUser )

#   JsonField
    JsonField = protoMeta.get( 'jsonField', '')
    if not isinstance( JsonField, ( str, unicode) ): JsonField = ''  

#   QSEt
    Qs = model.objects.select_related(depth=1)

#   Filtros por seguridad ( debe ser siempre a nivel de grupo ) 
    if isProtoModel and not pUser.is_superuser:  
#       Qs = Qs.filter( Q( owningHierachy__in = userNodes ) | Q( owningUser = pUser  ) )
        Qs = Qs.filter( owningHierachy__in = userNodes ) 

#   TODO: Agregar solomente los campos definidos en el safeMeta  ( only,  o defer ) 
#   Qs.query.select_fields = [f1, f2, .... ]     

#   El filtro base viene en la configuracion MD 
    try:
        Qs = addQbeFilter( baseFilter, model, Qs , JsonField)
    except Exception as e:
#        getReadableError( e ) 
        traceback.print_exc()

#   Order by 
    orderBy = []
    if sort:
        sort = json.loads(  sort ) 
        for sField in sort: 
            # FIX:  Verificar que el campo de sort haga parte de los campos del modelo   
            if sField['direction'] == 'DESC': sField['property'] = '-' + sField['property']  
            orderBy.append( sField['property'] )
    orderBy = tuple( orderBy )

    try:
        Qs = addQbeFilter( protoFilter, model, Qs, JsonField )
    except Exception,  e:
#        getReadableError( e ) 
        traceback.print_exc()

    # DbFirst en caso de q no exista una llave primaria   
    fakeId = hasattr( model , '_fakeId' ) 

    return Qs, orderBy, fakeId



def addQbeFilter( protoFilter, model, Qs, JsonField ):

    # No hay criterios 
    if len( protoFilter) == 0: 
        return Qs

    protoFilter =  json.loads(  protoFilter )

    if len( protoFilter) == 1: 
        QTmp = addQbeFilterStmt( protoFilter[0], model, JsonField )
        QTmp = dict((x, y) for x, y in QTmp.children)
        Qs = Qs.filter( **QTmp  )

    else:     
        QStmt = None 
    
        for sFilter in protoFilter: 
            
            if sFilter[ 'property' ] == '_allCols':
                QTmp = getTextSearch( sFilter, model  )
            
            else: 
                QTmp = addQbeFilterStmt( sFilter, model, JsonField )
    
            if QStmt is None:  QStmt = QTmp
            else: QStmt = QStmt & QTmp 
    
        if QStmt is None:  QStmt = models.Q()
    
        try:
            Qs = Qs.filter( QStmt  )
        except:
            traceback.print_exc()
            return Qs 

    return Qs



def addQbeFilterStmt( sFilter, model, JsonField ):

    fieldName  =  sFilter['property']
    
    if fieldName.endswith('__pk') or fieldName.endswith('_id') or fieldName == 'pk': 
        sType = 'int' 

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

def getTextSearch( sFilter, model ):        

    #   Busqueda Textual ( no viene con ningun tipo de formato solo el texto a buscar
    #   Si no trae nada deja el Qs con el filtro de base
    #   Si trae algo y comienza por  "{" trae la estructura del filtro   

    # Si solo viene el texto, se podria tomar la "lista" de campos "mostrados"
    # ya los campos q veo deben coincidir con el criterio, q pasa con los __str__ ?? 
    # Se busca sobre los campos del combo ( filtrables  )
    
    QStmt = None 
    
    pSearchFields = getSearcheableFields( model  )
    for fName  in pSearchFields:

        QTmp = addQbeFilterStmt( {'property': fName, 'filterStmt': sFilter['filterStmt'] }  , model )

        if QStmt is None:  QStmt = QTmp
        else: QStmt = QStmt | QTmp 

    return QStmt 


def getFieldValue( fName, rowData, JsonField ):

    #Es una funcion 
    if ( fName  == '__str__'   ):
        try: 
            val = eval( 'rowData.__str__()'  )
            val = verifyStr(val , '' )
        except: 
            val = 'Id#' + verifyStr(rowData.pk, '?')

    elif ( _PROTOFN_ in fName ):
        try: 
            val = eval( 'rowData.' + fName.replace( _PROTOFN_,'.') + '()'  )
            val = verifyStr(val , '' )
        except: val = 'fn?'

    # Master JSonField ( se carga texto ) 
    elif ( fName  == JsonField   ):
        try: 
            val = rowData.__getattribute__( fName  ) 
        except: val = {}
        if isinstance(val, dict):
            val = json.dumps( val , cls=JSONEncoder )

    # JSon fields 
    elif fName.startswith( JsonField + '__'): 
        try: 
            val = rowData.__getattribute__( JsonField  ) 
            if isinstance(val, dict):
                val = val.get( fName[ len( JsonField + '__'):] , '')
                if isinstance(val, dict):
                    val = json.dumps( val , cls=JSONEncoder )
        except: val = ''

#            Campo Absorbido  JSON  ( info_client.nom  )
#            Un campo absorbido debe indicar de q entidad viene, se podria hacer un un punto, 
#            q podria se de modo general para indicar  app.entidad.vista; la vista solo se usara 
#            en el caso de los prototipos, de resto solo sera app.entidad, 
#            para el prototipo puede ser simplificada como  entidad.vista 
#            
    elif ( '.' in fName ) and fName.startswith( JsonField + '__'):
        try: 
            val = eval( 'rowData.' + fName.replace( '__', '.'))
            val = verifyStr(val , '' )
        except: val = '__?'

        
    # Campo Absorbido
    elif ( '__' in fName ):
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
