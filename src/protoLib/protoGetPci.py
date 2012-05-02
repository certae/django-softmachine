# -*- coding: utf-8 -*-

#from django import forms
#from django.conf import settings
#from django.core import serializers
#from django.contrib import messages
#from django.contrib.auth.decorators import login_required
#from django.contrib.auth.models import User
#from django.db import transaction
#from django.db.models import Q
#from django.forms.models import model_to_dict
#from django.http import HttpResponseRedirect
#from django.shortcuts import render_to_response, get_object_or_404
#from django.template import  Context
#from django.template import  RequestContext
#from django.template.loader import get_template
#from django.utils.translation import gettext as __
#from protoLib import utilsBase, utilsWeb
#import sys, 

from django.contrib.admin.sites import  site
from django.db import models
from django.http import HttpResponse
from protoGrid import getVisibleFields
from protoLib import protoGrid
from utilsBase import construct_search, addFilter, JSONEncoder, verifyList 
from models import getDjangoModel 

import django.utils.simplejson as json
import datetime, operator, decimal



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
        protoFieldSet = grid.getFieldSets()
        
        protoSheets = grid.protoAdmin.get( 'protoSheets', {})
        protoSheetSelector = grid.protoAdmin.get( 'protoSheetSelector', '')
        protoSheetProperties = grid.protoAdmin.get( 'protoSheetProperties', ())
         
        protoIcon  = 'icon-%s' % grid.protoAdmin.get( 'protoIcon', '1') 
        hideRowNumbers  = grid.protoAdmin.get( 'hideRowNumbers',False) 
        
        pSearchFields = grid.protoAdmin.get( 'searchFields', '') 
        if pSearchFields == '': pSearchFields = getVisibleFields( grid.storeFields, model )

        pSortFields = grid.protoAdmin.get( 'sortFields', '') 
        if pSortFields == '': pSortFields = pSearchFields

        # Vistas
        gridColumns = verifyList( grid.protoAdmin.get( 'gridColumns', []) )
        if len( gridColumns ) == 0: 
            gridColumns = verifyList( getattr(grid.model_admin , 'list_display', []))
 
        
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
                 'hideRowNumbers' : hideRowNumbers,  
                 'protoSheets': protoSheets, 
                 'protoSheetSelector': protoSheetSelector, 
                 'protoSheetProperties': protoSheetProperties, 
                 'initialSort': sortInfo,
                 'initialFilter': initialFilter,
                 'protoViews':protoViews ,     
                 'protoFilters': protoFilters,
                 'protoFieldSet': protoFieldSet, 
                 'gridColumns' : gridColumns,
                 'readOnlyFields' : grid.protoReadOnlyFields,
                 },
            'rows':[],
            'totalCount': 0, 
        }
        context = json.dumps( jsondict)
        return HttpResponse(context, mimetype="application/json")

# protoGetPCI ----------------------------



