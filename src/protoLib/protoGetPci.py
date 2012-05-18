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
from protoGrid import getSearcheableFields, getProtoViewName
from protoLib import protoGrid
from models import getDjangoModel, ProtoDefinition

import django.utils.simplejson as json



def protoGetPCI(request):
    """ return full metadata (columns, renderers, totalcount...)
        to be used in combination with protoExt.js
    """

    if request.method != 'GET':
        return 
    
    protoOption = request.GET.get('protoConcept', '') 
    protoConcept, view = getProtoViewName( protoOption )
    model = getDjangoModel(protoConcept)

    # created : true  ( new ) is a boolean specifying whether a new object was created.
    protoDef, created = ProtoDefinition.objects.get_or_create(code = protoOption, defaults={'code': protoOption})
    
    # El default solo parece funcionar al insertar en la Db
    if created: protoDef.overWrite = True
    
    # Inicializa la meta  
    protoMeta = {} 
    
    # Si es nuevo o no esta activo lee Django 
    if created or ( not protoDef.active   ) :

        grid = protoGrid.ProtoGridFactory( model, view  )        

        protoIcon  = 'icon-%s' % grid.protoAdmin.get( 'protoIcon', '1') 

        pSearchFields = grid.protoAdmin.get( 'searchFields', []) 
        if pSearchFields == '': pSearchFields = getSearcheableFields( model )

        pSortFields = grid.protoAdmin.get( 'sortFields', []) 
        if pSortFields == '': pSortFields = pSearchFields

        # Lista de campos precedidos con '-' para order desc  ( 'campo1' , '-campo2' ) 
        initialSort = grid.protoAdmin.get( 'initialSort', ())
        sortInfo = []
        for sField in initialSort:
            sortOrder = 'ASC'
            if sField[0] == '-':
                sortOrder =  'DESC'
                sField = sField[1:]
            sortInfo.append({ 'property': sField, 'direction' : sortOrder })


        pDescription = grid.protoAdmin.get( 'description', '')
        if len(pDescription) == 0:  pDescription = grid.protoAdmin.get( 'title', grid.title)
        

        #FIX: busca el id en la META  ( id_field = model._meta.pk.name ) 
        id_field = u'id'


        protoMeta = { 
             'protoOption' : protoOption,           
             'idProperty': id_field,
             'shortTitle': grid.protoAdmin.get( 'title', grid.title),
             'description': pDescription ,
             'protoIcon': protoIcon,
             'helpPath': grid.protoAdmin.get( 'helpPath',''),

             'fields': grid.fields, 

            # Config de la grilla
             'gridConfig' : {
                 'initialSort': sortInfo,
                 'initialFilter': grid.protoAdmin.get( 'initialFilter', {}),
                 'hideRowNumbers' : grid.protoAdmin.get( 'hideRowNumbers',False),  

                 'protoFilterBase': grid.protoAdmin.get( 'protoFilterBase', {}),
                 'protoFilters': grid.protoAdmin.get( 'protoFilters', []),

                 'listDisplay' : grid.protoListDisplay,  
                 'listDisplaySet':grid.protoAdmin.get( 'listDisplaySet', []) ,     

                 'readOnlyFields' : grid.protoReadOnlyFields,
                 'hiddenFields': grid.protoAdmin.get( 'hiddenFields', []),
                 'searchFields': pSearchFields, 
                 'sortFields': pSortFields, 
             },
    
    
            # Propiedades extendidas   
             'protoDetails': grid.get_details() , 
             'protoForm': grid.getFieldSets(), 
             'protoUdp': grid.protoAdmin.get( 'pUDP', {}), 
             
            # sheet html asociada ( diccionario MSSSQ  )  
             'sheetsConfig' : {
                'protoSheets' : grid.protoAdmin.get( 'protoSheets', []), 
                'protoSheetSelector' : grid.protoAdmin.get( 'protoSheetSelector', ''), 
                'protoSheetProperties' : grid.protoAdmin.get( 'protoSheetProperties', ()), 
                 }, 
             }

        # Guarda la Meta si es nuevo o si se especifica overWrite
        if  created or protoDef.overWrite: 
            protoDef.metaDefinition = json.dumps( protoMeta ) 
            protoDef.description = pDescription 
            protoDef.save()


    else:
        protoMeta = json.loads( protoDef.metaDefinition ) 


    # EndIF  GetOrCreate ProtoDef  
    
    
    jsondict = {
        'succes':True,
        'message': '',
        'metaData':{
            # The name of the property which contains the Array of row objects. ...
            'root': 'rows',

            #Name of the property within a row object that contains a record identifier value. ...
            'idProperty': protoMeta['idProperty'],

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
    
    # Codifica el mssage json 
    context = json.dumps( jsondict)
    return HttpResponse(context, mimetype="application/json")

# protoGetPCI ----------------------------


