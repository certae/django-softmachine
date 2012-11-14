# -*- coding: utf-8 -*-


from django.db import models
from django.http import HttpResponse

from django.contrib.admin.util import  get_fields_from_path

from protoGrid import getSearcheableFields

from utilsBase import construct_search, addFilter, JSONEncoder, getReadableError 
from utilsBase import _PROTOFN_ , verifyStr   
from protoUdp import verifyUdpDefinition, readUdps 
from django.utils.encoding import smart_str

from models import getDjangoModel 

import django.utils.simplejson as json
import operator


def protoList(request):
#   Vista simple para cargar la informacion, 
    
    PAGESIZE = 50
    message = ''
    
    if request.method != 'POST':
        return 

    protoMeta = request.POST.get('protoMeta', '')
    protoMeta = json.loads(protoMeta)

    protoFilter = request.POST.get('protoFilter', '')
    baseFilter = request.POST.get('baseFilter', '')
    
    start = int(request.POST.get('start', 0))
    page = int(request.POST.get('page', 1))
    limit = int(request.POST.get('limit', PAGESIZE ))

    sort = request.POST.get('sort', '')
        
#   Obtiene las filas del modelo 
    Qs, orderBy = getQSet( protoMeta, protoFilter, baseFilter , sort  )
    pRowsCount = Qs.count()

#   Cuando esta en la pagina el filtro continua en la pagina 2 y no muestra nada.     
#   if ( ( page -1 ) *limit >= pRowsCount ): page = 1
    
    if orderBy: 
        pRows =  Qs.order_by(*orderBy)[ start: page*limit ]
    else: pRows =  Qs[ start: page*limit ]


#   Prepara las cols del Query 
    try:
        pList = Q2Dict(protoMeta , pRows  )
        bResult = True 
    except Exception,  e:
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
def Q2Dict (  protoMeta, pRows  ):
    """ 
        return the row list from given queryset  
    """

    pStyle = protoMeta.get( 'pciStyle', '')        
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
    for item in pRows:
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


def getQSet(  protoMeta, protoFilter, baseFilter , sort   ):
    
#   Decodifica los eltos 
    gridConfig =  protoMeta.get('gridConfig', {})
    protoConcept = protoMeta.get('protoConcept', '')
    
#   Carga la info
    model = getDjangoModel(protoConcept)

#   QSEt
    Qs = model.objects.select_related(depth=1)

#   El filtro base viene en la configuracion MD 
    textFilter = baseFilter
    Qs = addFilter( Qs, baseFilter )

#   Order by 
    orderBy = []
    if sort:
        sort = json.loads(  sort ) 
        for sField in sort: 
            # FIX:  @@@  Verificar que el campo de sort haga parte de los campos del modelo   
            if sField['direction'] == 'DESC': sField['property'] = '-' + sField['property']  
            orderBy.append( sField['property'] )
    orderBy = tuple( orderBy )


#   Busqueda Textual ( no viene con ningun tipo de formato solo el texto a buscar
#   Si no trae nada deja el Qs con el filtro de base
#   Si trae algo y comienza por  "{" trae la estructura del filtro   
    if  (len( protoFilter) > 0): 
        
        #  Convierte el filtro en un diccionario 
        if (  protoFilter.startswith( '{' ) ) :
            Qs = addFilter( Qs, protoFilter )
            textFilter +=  ' ' + protoFilter

        #  Solo tra el texto y hay q crear el filtro sobre  la lista de campos 
        else: 
        
            pSearchFields = gridConfig.get( 'searchFields', []) 
    
            # Si solo viene el texto, se podria tomar la "lista" de campos "mostrados"
            # ya los campos q veo deben coincidir con el criterio, q pasa con los __str__ ?? 
            # Se busca sobre los campos del combo ( filtrables  )
            
            if len( pSearchFields )  == 0: 
                pSearchFields = getSearcheableFields( model  )
    
            if len( pSearchFields )  > 0: 

                # Se permite marcar todo tipo de campo como filtrable, pero solo se hace textSearch sobre 
                # los campos con tipos validos     
                
                textSearchFlds = []
                textFilterTypes  = [ 'CharField', 'TextField', 'IntegerField', 'DecimalField', 'FloatField',  ]
                for fName  in pSearchFields:
                    try: 
                        field = get_fields_from_path( model, fName)[-1]

                        #field = model._meta.get_field( fName )
                        #model = field.rel.to
                        #model.famille.field.related.parent_model
                    except: continue  

                    if field.__class__.__name__ in textFilterTypes:
                        textSearchFlds.append( fName )   
                
                textFilter +=  ' '.join(textSearchFlds)  + ':' + protoFilter
                orm_lookups = [construct_search(str(search_field))
                               for search_field in textSearchFlds]
            
                for bit in protoFilter.split():
                    or_queries = [models.Q(**{orm_lookup: bit})
                                  for orm_lookup in orm_lookups]
                    Qs = Qs.filter(reduce(operator.or_, or_queries))
    
            else:  
                message = 'Error: ' + textFilter
                Qs = Qs.none()
                
    return Qs, orderBy 