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

from django.http import HttpResponse
from protoGrid import getVisibleFields, getProtoViewName
from protoLib import protoGrid
from utilsBase import  verifyList 
from models import getDjangoModel, ProtoDefinition

import django.utils.simplejson as json



def protoGetPCI(request):
    """ return full metadata (columns, renderers, totalcount...)
        to be used in combination with protoExt.js
    """

    if request.method == 'GET':
        protoOption = request.GET.get('protoConcept', '') 
        protoConcept, view = getProtoViewName( protoOption )
            
        model = getDjangoModel(protoConcept)
        grid = protoGrid.ProtoGridFactory( model, view  )        

#       pRows = model.objects.filter(pk = 0)
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

        protoFilters = grid.protoAdmin.get( 'protoFilters', []) 
 
        # Diferentes configuraciones de columnas para una misma grilla 
        protoGridViews = grid.protoAdmin.get( 'protoGridViews', []) 

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


        protoMeta = { 
             'protoOption' : protoOption,           
             'protoIcon': protoIcon,
             'shortTitle': pTitle,
             'description': pDescription,
             'idProperty': id_field,
    
            # Valores iniciales 
             'initialSort': sortInfo,
             'initialFilter': initialFilter,
    
            # Campos definidos en  ProtoGridFactory
             'fields': grid.fields, 
             'storeFields': grid.storeFields, 
             'listDisplay' : grid.protoListDisplay,  
             'readOnlyFields' : grid.protoReadOnlyFields,
    
             'searchFields': pSearchFields, 
             'sortFields': pSortFields, 
             'hideRowNumbers' : hideRowNumbers,  
    
            # Propiedades extendidas   
             'protoDetails': protoDetails, 
             'protoFilters': protoFilters,
             'protoFieldSet': protoFieldSet, 
             'protoGridViews':protoGridViews ,     
             
            # sheet html asociada ( diccionario MSSSQ  )  
             'protoSheetSelector': protoSheetSelector, 
             'protoSheetProperties': protoSheetProperties, 
             'protoSheets': protoSheets, 
    
             }

        # Guarda la Meta 
        protoDef, created = ProtoDefinition.objects.get_or_create(code = protoOption, defaults={'code': protoOption})        
        protoDef.metaDefinition = json.dumps( protoMeta )
        protoDef.save()


        jsondict = {
            'succes':True,
            'message': '',
            'metaData':{
                # The name of the property which contains the Array of row objects. ...
                'root': 'rows',

                #Name of the property within a row object that contains a record identifier value. ...
                'idProperty': id_field,

                #Name of the property from which to retrieve the total number of records in t
                'totalProperty':'totalCount',

                #Name of the property from which to retrieve the success attribute. ...
                'successProperty':'success',
                
                #The name of the property which contains a response message. (optional)
                'messageProperty': 'message', 
                }, 
            'protoMeta': protoMeta,
            'rows':[],
            'totalCount': 0, 
        }
        
        
        context = json.dumps( jsondict)
        return HttpResponse(context, mimetype="application/json")

# protoGetPCI ----------------------------


