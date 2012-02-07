# -*- coding: utf-8 -*-

#import sys
import operator

#from django import forms
#from django.contrib import messages
#from django.contrib.auth.decorators import login_required
#from django.contrib.auth.models import User
from django.db import models
#from django.db import transaction
#from django.forms.models import model_to_dict
from django.http import HttpResponse
#from django.http import HttpResponseRedirect
#from django.shortcuts import render_to_response, get_object_or_404
#from django.template import  Context
#from django.template import  RequestContext
#from django.template.loader import get_template 
#from django.utils.translation import gettext as __
#from django.conf import settings
from django.contrib.admin.sites import  site
#from django.db.models import Q

from protoLib import protoGrid
#from protoLib import utilsBase, utilsWeb  
from protoGrid import Q2Dict, getVisibleFields

from utilsBase import construct_search, addFilter


#from django.core import serializers
import django.utils.simplejson as json

def getDjangoModel( modelName ):
#   Obtiene el modelo 
    if modelName.count('.') == 1: 
        model = models.get_model( *modelName.split('.') )
    elif modelName.count('.') == 0:
        for m in models.get_models():
            if m._meta.object_name.lower() == modelName.lower():
                model = m
                break
    return model 


def protoGetPCI(request):
    """ return full metadata (columns, renderers, totalcount...)
        to be used in combination with protoExt.js
    """

    if request.method == 'GET':
        protoConcept = request.GET.get('protoConcept', '') 
        
        model = getDjangoModel(protoConcept)
        grid = protoGrid.ProtoGridFactory( model  )        

#       pRows = model.objects.filter(pk = 0)
        base_fields = grid.get_fields( None )
        protoDetails = grid.get_details()
        protoSheet = grid.protoAdmin.get( 'protoSheet', {}) 
        protoIcon  = 'icon-%s' % grid.protoAdmin.get( 'protoIcon', '1') 
        
        pSearchFields = grid.protoAdmin.get( 'searchFields', '') 
        if pSearchFields == '': pSearchFields = getVisibleFields( grid.storeFields, model )

        pSortFields = grid.protoAdmin.get( 'sortFields', '') 
        if pSortFields == '': pSortFields = pSearchFields

        # TODO: Vistas 
        protoViews = grid.protoAdmin.get( 'protoViews', []) 
        protoFilters = grid.protoAdmin.get( 'protoFilters', []) 

        # TODO: Este filtro deberia ser usado para la autocarga
        # El filtro de base no se lee aqui, pues se cargara cada vez q se solicite la info. 
        initialFilter = grid.protoAdmin.get( 'initialFilter', {})

        # TODO: Sort Info  ( para guardarlo como sorter q despues sea cargado igual )
        # Lista de campos precedidos con '-' para order desc
        #   ( 'campo1' , '-campo2' ) 
        initialSort = grid.protoAdmin.get( 'initialSort', ())
        sortInfo = []
        for sField in initialSort:
            sortOrder = 'ASC'
            if sField[0] == '-':
                sortOrder =  'DESC'
                sField = sField[1:]
            sortInfo.append({ 'property': sField, 'direction' : sortOrder })
        

        #busca el id en la META
#       id_field = model._meta.pk.name
        id_field = u'id'
            
#       
        pTitle = grid.protoAdmin.get( 'title', grid.title) 
        pDescription = grid.protoAdmin.get( 'description', pTitle) 
            
        jsondict = {
             'succes':True,
             'metaData':{
                 'root':'rows',
                 'totalProperty':'totalCount',
                 'successProperty':'success',
                 'shortTitle': pTitle,
                 'description': pDescription,
                 'storeFields': grid.storeFields, 
                 'searchFields': pSearchFields, 
                 'sortFields': pSortFields, 
                 'idProperty': id_field,
                 'fields': base_fields, 
                 'protoDetails': protoDetails, 
                 'protoIcon': protoIcon, 
                 'protoSheet': protoSheet, 
                 'initialSort': sortInfo,
                 'initialFilter': initialFilter,
                 'protoViews':protoViews ,     
                 'protoFilters': protoFilters,
                 },
            'rows':[],
            'totalCount': 0, 
        }
        context = json.dumps( jsondict)
        return HttpResponse(context, mimetype="application/json")

# protoGetPCI ----------------------------


def protoGetList(request):
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
            })
    
    return HttpResponse(context, mimetype="application/json")

