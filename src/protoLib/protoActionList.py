# -*- coding: utf-8 -*-

#from django.contrib.admin.sites import  site
#from protoGrid import Q2Dict,  getProtoViewName

from django.db import models
from django.http import HttpResponse

from django.contrib.admin.util import  get_fields_from_path

from protoGrid import Q2Dict, getSearcheableFields

from utilsBase import construct_search, addFilter, JSONEncoder, getReadableError 
from models import getDjangoModel 

import django.utils.simplejson as json
import operator


def protoList(request):
#   Vista simple para cargar la informacion, 
    
    PAGESIZE = 50
    message = ''
    
    if request.method == 'POST':

        protoMeta = request.POST.get('protoMeta', '')
        protoFilter = request.POST.get('protoFilter', '')
        baseFilter = request.POST.get('baseFilter', '')
        
        start = int(request.POST.get('start', 0))
        page = int(request.POST.get('page', 1))
        limit = int(request.POST.get('limit', PAGESIZE ))

        sort = request.POST.get('sort', '')
        
    else: return 
    
    
#   Decodifica los eltos 
    protoMeta = json.loads(protoMeta)
    
    protoFields = protoMeta.get('fields', {})
    gridConfig =  protoMeta.get('gridConfig', {})
    
    #protoOption = protoMeta.get('protoOption', '')
    protoConcept = protoMeta.get('protoConcept', '')
    
#   Carga la info
    model = getDjangoModel(protoConcept)

#   QSEt

    # TODO: baseFilter deberia sumar a los filtros q vienen definidos   
    # baseFilter = protoMeta.get( 'baseFilter', {})
     
    Qs = model.objects.select_related(depth=1)
    Qs = addFilter( Qs, baseFilter )

#   Order by 
    orderBy = []
    if sort:
        sort = eval ( sort ) 
        for sField in sort: 
            # FIX:  @@@  Verificar que el campo de sort haga parte de los campos del modelo   
            if sField['direction'] == 'DESC': sField['property'] = '-' + sField['property']  
            orderBy.append( sField['property'] )
    orderBy = tuple( orderBy )

#   El filtro base viene en la configuracion MD 
    textFilter = baseFilter
    Qs = addFilter( Qs, baseFilter )


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
    
#   Obtiene las filas del modelo 
#   valiues, No permite llamar los metodos del modelo
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
