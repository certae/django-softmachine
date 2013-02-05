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

    pStyle = protoMeta.get( 'pciStyle', '')        
    JsonField = protoMeta.get( 'jsonField', '')
    if not isinstance( JsonField, ( str, unicode) ): JsonField = ''  

    pUDP = protoMeta.get( 'protoUdp', {}) 
    cUDP = verifyUdpDefinition( pUDP )
    rows = []

    # Identifica las Udps para solo leer las definidas en la META
    if cUDP.udpTable :
        udpTypes =  {}
        udpList =  []
        for lField  in protoMeta['fields']:
            fName = lField['name']
            if fName.startswith( cUDP.propertyPrefix + '__'): 
                udpList.append( fName )
                udpTypes[ fName ]  =  lField['type'] 
               

    # Verifica si existen reemplazos por hacer ( fromField )
    copyValueFromField = False
    for lField  in protoMeta['fields']:
        if lField.get( 'fromField', None ):  
            copyValueFromField = True
            break 
    

#   Esta forma permite agregar las funciones entre ellas el __unicode__
    rowId = 0 
    for item in pRows:
        rowId += 1
        rowdict = {}
        for lField  in protoMeta['fields']:
            fName = lField['name']


            # UDP Se evaluan despues 
            if cUDP.udpTable and fName.startswith( cUDP.propertyPrefix + '__'): 
                continue  
            
            #Es una funcion 
            if ( fName  == '__str__'   ):
                try: 
                    val = eval( 'item.__str__()'  )
                    val = verifyStr(val , '' )
                except: 
                    val = 'Id#' + verifyStr(item.pk, '?')

            elif ( _PROTOFN_ in fName ):
                try: 
                    val = eval( 'item.' + fName.replace( _PROTOFN_,'.') + '()'  )
                    val = verifyStr(val , '' )
                except: val = 'fn?'

            # Master JSonField ( se carga texto ) 
            elif ( fName  == JsonField   ):
                try: 
                    val = item.__getattribute__( fName  ) 
                except: val = {}
                if isinstance(val, dict):
                    val = json.dumps( val , cls=JSONEncoder )

            # JSon fields 
            elif fName.startswith( JsonField + '__'): 
                try: 
                    val = item.__getattribute__( JsonField  ) 
                    if isinstance(val, dict):
                        val = val.get( fName[ len( JsonField + '__'):] , '')
                        if isinstance(val, dict):
                            val = json.dumps( val , cls=JSONEncoder )
                except: val = ''

            #TODO:  Campo Absorbido  JSON  ( info_client.nom  ) 
            elif ( '.' in fName ) and fName.startswith( JsonField + '__'):
                try: 
                    val = eval( 'item.' + fName.replace( '__', '.'))
                    val = verifyStr(val , '' )
                except: val = '__?'

                
            # Campo Absorbido
            elif ( '__' in fName ):
                try: 
                    val = eval( 'item.' + fName.replace( '__', '.'))
                    val = verifyStr(val , '' )
                except: val = '__?'

            # N2N
            elif ( lField['type'] == 'protoN2N' ):
                try: 
                    val = list( item.__getattribute__( fName  ).values_list()) 
                except: val = '[]'

            # Campo del modelo                 
            else:
                try:
                    val = getattr( item, fName  )
                    # Si es una referencia ( fk ) es del tipo model 
                    if isinstance( val, models.Model): 
                        val = verifyStr(val , '' )
                except: val = 'vr?'
                
                # Evita el valor null en el el frontEnd 
                if val is None: val = ''
                
            rowdict[ fName ] = val
            
        
        if cUDP.udpTable:

            # rowDict : se actualizara con los datos de la UDP
            # item es el registro de base, en caso de q sea un MD la lectura es automatica item.udpTable...
            # cUDP
            # udpTypes  : lista de Udps a leer  
            readUdps( rowdict, item , cUDP, udpList,  udpTypes )

                
        # REaliza la absorcion de datos provenientes de un zoom 
        if copyValueFromField:
            rowdict = copyValuesFromFields( protoMeta, rowdict  )

        if pStyle == 'tree':
            rowdict[ 'protoView' ] = protoMeta.get('protoOption', '')
            rowdict[ 'leaf' ] = False 
            rowdict[ 'children' ] = []


        # Agrega el Id Siempre como idInterno ( no representa una col, idProperty )
        rowdict[ 'id'] = item.pk 
        if fakeId:
            rowdict[ 'id'] = rowId 
        
        # Agrega la fila al diccionario
        rows.append(rowdict)


    return rows

def copyValuesFromFields( protoMeta, rowdict ):
    
    for lField  in protoMeta['fields']:
        fromField =  lField.get( 'fromField', None )
        if not fromField: continue 

        fromField = smart_str( fromField  )  
        fName = smart_str( lField['name'] ) 
        val = rowdict.get( fName, None )  
        if ( val ) and smart_str( val ).__len__() > 0: continue
        
        val = rowdict.get( fromField , None )
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
        except Exception,  e:
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


