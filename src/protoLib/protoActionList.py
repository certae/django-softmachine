# -*- coding: utf-8 -*-


from django.contrib.admin.sites import  site
from django.db import models
from django.http import HttpResponse

from protoGrid import Q2Dict, getVisibleFields
from utilsBase import construct_search, addFilter, JSONEncoder 
from models import getDjangoModel 

import django.utils.simplejson as json
import operator


def protoList(request):
#   Vista simple para cargar la informacion, 
    
    PAGESIZE = 50
    
    if request.method == 'POST':

        protoConcept = request.POST.get('protoConcept', '')
        protoFilter = request.POST.get('protoFilter', '')
        protoFilterBase = request.POST.get('protoFilterBase', '')
        protostoreFields = request.POST.get('storeFields', '')
        
        start = int(request.POST.get('start', 0))
        page = int(request.POST.get('page', 1))
        limit = int(request.POST.get('limit', PAGESIZE ))

        sort = request.POST.get('sort', '')
        
    else: return 
    
#   Carga la info
    model = getDjangoModel(protoConcept)

#   Carga las definiciones  
    model_admin = site._registry.get( model )
    protoAdmin = getattr(model_admin, 'protoExt', {})
    
#   QSEt 
    baseFilter = protoAdmin.get( 'baseFilter', '') 
    Qs = model.objects.select_related(depth=1)
    Qs = addFilter( Qs, baseFilter )

#   Order by 
    orderBy = []
    if sort:
        sort = eval ( sort ) 
        for sField in sort: 
            if sField['direction'] == 'DESC': sField['property'] = '-' + sField['property']  
            orderBy.append( sField['property'] )
    orderBy = tuple( orderBy )

#   El filtro base viene en la configuracion MD 
    textFilter = protoFilterBase
    Qs = addFilter( Qs, protoFilterBase )


#   Busqueda Textual ( no viene con ningun tipo de formato solo el texto a buscar 
    if not protoFilter.startswith( '{' ) and (len( protoFilter) > 0) :
        pSearchFields = protoAdmin.get( 'searchFields', '') 
        if pSearchFields == '': pSearchFields = getVisibleFields( protostoreFields, model )

        if pSearchFields != '': 
            textFilter +=  ' '.join(pSearchFields)  + ':' + protoFilter
            orm_lookups = [construct_search(str(search_field))
                           for search_field in pSearchFields]
        
            for bit in protoFilter.split():
                or_queries = [models.Q(**{orm_lookup: bit})
                              for orm_lookup in orm_lookups]
                Qs = Qs.filter(reduce(operator.or_, or_queries))

        else:  
            textFilter = 'Error: ' + textFilter
            Qs = Qs.none()


#   Convierte el filtro en un diccionario 
    elif (len (protoFilter) > 0 ):
        Qs = addFilter( Qs, protoFilter )
        textFilter +=  ' ' + protoFilter

#   Obtiene las filas del modelo 
#   valiues, No permite llamar los metodos del modelo
    pRowsCount = Qs.count()

#   Cuando esta en la pagina el filtro continua en la pagina 2 y no muestra nada.     
#   if ( ( page -1 ) *limit >= pRowsCount ): page = 1
    
    if orderBy: 
        pRows =  Qs.order_by(*orderBy)[ start: page*limit ]
    else: pRows =  Qs[ start: page*limit ]


#   Prepara las cols del Query 
    pList = Q2Dict(protostoreFields , pRows, protoAdmin )

    context = json.dumps({
            "success": True,
            'totalCount': pRowsCount,
            'filter': protoFilter,
            'rows': pList,
            }, cls=JSONEncoder )
    
    return HttpResponse(context, mimetype="application/json")
