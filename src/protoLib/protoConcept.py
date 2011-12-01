# -*- coding: utf-8 -*-

import sys
import operator

from django import forms
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import models
from django.db import transaction
from django.forms.models import model_to_dict
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from django.template import  Context
from django.template import  RequestContext
from django.template.loader import get_template 
from django.utils.translation import gettext as __
from django.conf import settings
from django.contrib.admin.sites import  site
from django.db.models import Q

from protoLib import protoGrid, utilsBase, utilsWeb  
from protoGrid import Q2Dict, getVisibleFields

from utilsBase import construct_search


from django.core import serializers
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
        pRows = []
        pRowsCount = 0

        base_fields = grid.get_fields( None )
        protoDetails = grid.get_details()
        
        #busca el id en la META
#       id_field = model._meta.pk.name
        id_field = u'id'
            
        jsondict = {
             'succes':True,
             'metaData':{
                 'root':'rows',
                 'totalProperty':'totalCount',
                 'successProperty':'success',
                 'shortTitle': grid.title,
                 'description': grid.title,
                 'queryFields': grid.QFields, 

                 'idProperty': id_field,
                 'sortInfo':{
                   "field": id_field, 
                   "direction": 'DESC'
                },
                'fields': base_fields, 
#                'protoTabs':[{'T1': ['Col1','Col2']},  {'T2': ['Col3','Col2']},],     
                'protoDetails': protoDetails, 
            },
            'rows':[],
            'totalCount': pRowsCount, 
        }

        context = json.dumps( jsondict)
        return HttpResponse(context, mimetype="application/json")

# protoGetPCI ----------------------------



def protoGetList(request):
#   Vista simple para cargar la informacion, 
    
    if request.method == 'POST':

        protoConcept = request.POST.get('protoConcept', '')
        protoFilter = request.POST.get('protoFilter', '')
        protoFilterBase = request.POST.get('protoFilterBase', '')
        protoQFields = request.POST.get('queryFields', '')
        
        start = int(request.POST.get('start', 0))
        limit = int(request.POST.get('limit', 100))
        page = int(request.POST.get('page', 1))

        sort = request.POST.get('sort', 'id')
        sort_dir = request.POST.get('dir', 'ASC')
        
    else: return 
    
#   Carga la info
    model = getDjangoModel(protoConcept)

#   QSEt 
    Qs = model.objects.select_related(depth=1)
    qsFilter = ''

#   El filtro base viene en la configuracion MD 
    if (len (protoFilterBase) > 0 ):
        try: 
            protoStmtBase = eval( protoFilterBase )
            Qs = Qs.filter(**protoStmtBase )
            qsFilter = protoFilterBase
        except: 
            qsFilter = 'Error: ' + qsFilter
            Qs = Qs.none()


#   Busqueda Textual ( no viene con ningun tipo de formato solo el texto a buscar 
    if not protoFilter.startswith( '{' ) and (len( protoFilter) > 0) :
        model_admin = site._registry.get( model )
        protoAdmin = getattr(model_admin, 'protoExt', {})
        pSearchFields = protoAdmin.get( 'searchFields', '') 

        if pSearchFields == '': 
            pSearchFields = getVisibleFields( protoQFields, model )

        if pSearchFields != '': 
            qsFilter +=  ' '.join(pSearchFields)  + ':' + protoFilter
            orm_lookups = [construct_search(str(search_field))
                           for search_field in pSearchFields]
        
            for bit in protoFilter.split():
                or_queries = [models.Q(**{orm_lookup: bit})
                              for orm_lookup in orm_lookups]
                Qs = Qs.filter(reduce(operator.or_, or_queries))

        else:  
            qsFilter = 'Error: ' + qsFilter
            Qs = Qs.none()


#   Convierte el filtro en un diccionario 
    elif (len (protoFilter) > 0 ):
        try: 
            protoStmt = eval( protoFilter )
            Qs = Qs.filter(**protoStmt )             
            qsFilter +=  ' ' + protoFilter
        except:
            qsFilter = 'Error: ' + qsFilter
            Qs = Qs.none()

#   Obtiene las filas del modelo 
#   valiues, No permite llamar los metodos del modelo
    pRowsCount = Qs.count()
    pRows =  Qs.order_by('id')[ start: page*limit ]

#   Prepara las cols del Query 
    pList = Q2Dict(protoQFields , pRows )

    context = json.dumps({
            "success": True,
            'totalCount': pRowsCount,
            'filter': protoFilter,
            'rows': pList,
            })
    
    return HttpResponse(context, mimetype="application/json")

