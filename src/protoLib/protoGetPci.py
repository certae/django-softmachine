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
#from utilsBase import _PROTOFN_ , verifyStr, verifyList, , verifyUdpDefinition, addFilter 
#import sys, 

from django.http import HttpResponse
from protoGrid import getSearcheableFields, getProtoViewName, setDefaultField
from protoLib import protoGrid
from protoField import  setFieldDict
from models import getDjangoModel, ProtoDefinition
from utilsBase import getReadableError 

import django.utils.simplejson as json



def protoGetPCI(request):
    """ return full metadata (columns, renderers, totalcount...)
    """

    
    if request.method != 'GET':
        return 
    
    protoOption = request.GET.get('protoOption', '') 
    protoConcept, view = getProtoViewName( protoOption )
    
    try: 
        model = getDjangoModel(protoConcept)
    except Exception,  e:
        jsondict = { 'success':False, 'message': getReadableError( e ) }
        context = json.dumps( jsondict)
        return HttpResponse(context, mimetype="application/json")
    
    # created : true  ( new ) is a boolean specifying whether a new object was created.
    protoDef, created = ProtoDefinition.objects.get_or_create(code = protoConcept, defaults={'code': protoConcept})
    
    # El default solo parece funcionar al insertar en la Db
    if created: protoDef.overWrite = True
    
    # Inicializa la meta  
    protoMeta = {} 
    
    # Si es nuevo o no esta activo lee Django 
    if created or ( not protoDef.active   ) :

        # Verifica si existe una propiedad ProtoMeta es la copia de la meta cargada a la Db,
        grid = protoGrid.ProtoGridFactory( model   )
        protoMeta = grid.protoAdmin.get( 'protoMeta', {} )
        
        if ( not protoMeta ): 
            protoMeta = createProtoMeta( model, grid, protoConcept, protoOption  )
        

        # Guarda la Meta si es nuevo o si se especifica overWrite
        if  created or protoDef.overWrite: 
            protoDef.metaDefinition = json.dumps( protoMeta ) 
            protoDef.description = protoMeta['description'] 
            protoDef.save()    


    else:
        protoMeta = json.loads( protoDef.metaDefinition ) 


    # Verifica la view y copia las propiedades necesarias, ( un protoView no sera editable ) 
    if view: 
        protoMeta = getProtoViewObj( protoMeta, view )    
    
    
    jsondict = {
        'success':True,
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


def createProtoMeta( model, grid, protoConcept , protoOption ):

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
         'protoConcept' : protoConcept,           
         'idProperty': id_field,
         'shortTitle': grid.protoAdmin.get( 'title', grid.title),
         'description': pDescription ,
         'protoIcon': protoIcon,

         'helpPath': grid.protoAdmin.get( 'helpPath',''),

         'protoMenuOpt': grid.protoAdmin.get( 'protoMenuOpt',''),
         'protoMenuIx':  grid.protoAdmin.get( 'protoMenuIx',''),

         'fields': grid.fields, 

        # Config de la grilla
         'gridConfig' : {
             'hideRowNumbers' : grid.protoAdmin.get( 'hideRowNumbers',False),  

             'initialSort': sortInfo,

             # Si no es autoload  -  '{"pk" : 0,}'            
             'initialFilter': grid.protoAdmin.get( 'initialFilter', {}),
             'baseFilter': grid.protoAdmin.get( 'baseFilter', {}),
             'filtersSet': grid.protoAdmin.get( 'filtersSet', []),

             'listDisplay' : grid.protoListDisplay,  
             'listDisplaySet':grid.protoAdmin.get( 'listDisplaySet', {}) ,     

             # En las protoViews existiran tambien las propiedades de campos ( y formas ) 
             'readOnlyFields' : grid.protoReadOnlyFields,
             'searchFields': pSearchFields, 
             'sortFields': pSortFields, 
             
             # TODO: Implementar  ( El listDisplay podra contener propiedades, hidden, flex, width,  ... 
             'hiddenFields': grid.protoAdmin.get( 'hiddenFields', ['id', ]),
         },


        # Propiedades extendidas   
         'protoDetails': grid.get_details() , 
         'protoForm': grid.getFieldSets(), 
         'protoUdp': grid.protoAdmin.get( 'protoUdp', {}), 

        # Vistas heredadas del modelo base, zooms,  etc ... 
         'protoViews': grid.protoAdmin.get( 'protoViews', {}), 
         
        # sheet html asociada ( diccionario MSSSQ  )  
         'sheetConfig' : {
            'protoSheets' : grid.protoAdmin.get( 'protoSheets', {} ), 
            'protoSheetSelector' : grid.protoAdmin.get( 'protoSheetSelector', ''), 
            'protoSheetProperties' : grid.protoAdmin.get( 'protoSheetProperties', ()), 
             }, 
         }

    return protoMeta 


def getProtoViewObj( protoMeta, view   ):
#   Copia las propiedades de la vista en el protoMeta ( La meta resultante no es editable ) 

    protoView = {}
    if view:
        # intenta leer la definicion de la vista             
        protoViews  = protoMeta.get( 'protoViews', {})
        if protoViews:  
            protoView  = protoViews.get(  view, {})

    if protoView:
        protoCopy = protoMeta.copy()
        for key in protoView: 
            # evitar recursividad en vistas 
            if key == 'protoViews': continue 
            protoCopy[ key ] = protoView[ key ]
          
        return protoCopy

    else: 
        return protoMeta


# ------------------------------------------------------------------------


def protoSavePCI(request):
    """ Save full metadata
    """

    if request.method != 'POST':
        return 
    
    protoOption = request.POST.get('protoOption', '') 
    sMeta = request.POST.get('protoMeta', '')
    protoMeta = json.loads( sMeta )
    
    protoConcept, view = getProtoViewName( protoOption )
    
    try: 
        model = getDjangoModel(protoConcept)
    except Exception,  e:
        jsondict = { 'success':False, 'message': getReadableError( e ) }
        context = json.dumps( jsondict)
        return HttpResponse(context, mimetype="application/json")
    

    # created : true  ( new ) is a boolean specifying whether a new object was created.
    protoDef, created = ProtoDefinition.objects.get_or_create(code = protoConcept, defaults={'code': protoConcept})
    
    # El default solo parece funcionar al insertar en la Db
    protoDef.active = True 
    protoDef.overWrite = False 
    protoDef.metaDefinition = sMeta 
    protoDef.description = protoMeta['description'] 
    protoDef.save()    

    jsondict = {
        'success':True,
        'message': 'Ok',
    }
    
    # Codifica el mssage json 
    context = json.dumps( jsondict)
    return HttpResponse(context, mimetype="application/json")



def protoGetFieldTree(request):
    """ return full field tree 
    """

    if request.method != 'GET':
        return 
    
    protoOption = request.GET.get('protoOption', '') 
#    protoUdp = request.GET.get('protoUpd', {})
#    cUDP = verifyUdpDefinition( protoUdp )
     
    protoConcept, view = getProtoViewName( protoOption )
    
    try: 
        model = getDjangoModel(protoConcept)
    except Exception,  e:
        jsondict = { 'success':False, 'message': getReadableError( e ) }
        context = json.dumps( jsondict)
        return HttpResponse(context, mimetype="application/json")
    
    
    fieldList = []
    
    # Se crean los campos con base al modelo ( trae todos los campos del modelo 
    for field in model._meta._fields():
        addFiedToList( fieldList,  field , '', [] )
        
    # Add __str__ 
    myField = { 
        'id'        : '__str__' ,  
        'text'      : protoConcept , 
        'checked'   : False,       
        'leaf'      : True 
     }
    
    # Defaults values
    setDefaultField( myField, model )
    
    # FormLink redefinition to original view 
    myField['zoomModel'] =  protoOption  

    
    fieldList.append( myField )

    # Las udps se agregan manualmente, pues habria q crear una tabla para manejar la dependecia con cada tabla  
    # addUpdToList( fieldList,  cUDP )

        
    # Codifica el mssage json 
    context = json.dumps( fieldList )
    return HttpResponse(context, mimetype="application/json")



def addFiedToList(  fieldList , field, fieldBase, fieldOcurrences  ):
    """ return parcial field tree  ( Called from protoGetFieldTree ) 
    """

    fieldId = fieldBase + field.name

    # DEfinicion proveniente del dict ( setFieldDict )  
    protoFields = {}
    setFieldDict ( protoFields , field )
    pField = protoFields[ field.name ]
    
    # fieldBase indica campos de llaves foraneas       
    if fieldBase != '': 
        pField[ 'readOnly' ] = True 
        pField[ 'allowBlank' ] = True 

        if pField['type'] == 'autofield':
            pField['type'] = 'int'
        
    
    #TODO :  Choices armar un string y descomponer al otro lado 
    myField = { 
        'id'         : fieldId , 
        'text'       : field.name, 
        'checked'    : False, 
        'readOnly'   : pField.get( 'readOnly' , False ) , 
        'allowBlank' : pField.get( 'allowBlank' , True  ),  
        'tooltip'    : pField.get( 'tooltip', ''  ),  
        'header'     : pField.get( 'header',  field.name  ),   
        'type'       : pField.get( 'type',  'string'  )  
     }

    # Atributos adicionales de edicion 
    if fieldBase == '': 
        if hasattr( pField, 'defaultValue' ): 
            myField['defaultValue'] = pField['defaultValue'] 

        if hasattr( pField, 'vType'): 
            myField['vType'] = pField['vType'] 

#        if pField['type'] == 'combo':
#            myField['choices'] = pField['choices'] 

    # Recursividad Fk 
    if pField['type'] != 'foreigntext':
        myField['leaf'] = True

    else:

        # Crea el Id para el fk 
        myFieldId = protoFields[ pField['fkId'] ]

        # Agrega los eltos particulares  
        if ( fieldBase == '') :  
            myField['fkId'] = pField['fkId']

        else:      
            myField['fkId'] = fieldBase + pField['fkId'] 
            myFieldId['fkField']  = myField['id']                    

        # Agrega los eltos del zoom ademas del FkId ( No importa si es base ) 
        if ( True or fieldBase == '') :  
            myField['zoomModel'] = pField['zoomModel']                    
    
            myFieldId['id' ]        = myField['fkId']
            myFieldId['zoomModel']  = myField['zoomModel']                    
            myFieldId['leaf'] = True
            myFieldId['readOnly'] = True
            myFieldId['checked'] = False
            myFieldId['text'] =  pField['fkId']  
            myFieldId['allowBlank'] = myField['allowBlank']  
            myFieldId['type'] =  myFieldId['type']  
    
            fieldList.append( myFieldId )


        # Evita el mismo campo recursivo sobre si mismo.  
        # TODO:  Un mimsmo objeto puede ser refecenciado varias veces, ie  ciudad, etc, la solucion seria solo cortar la recurividad?? 
        if fieldOcurrences.count( field.name ) > 1:
            myField['leaf'] = True
        
        # Evita demasiada recursividad ( 5 niveles debe ser mas q suficiente ) 
        elif len ( fieldOcurrences ) > 5:
            myField['leaf'] = True
            
        else: 
            fieldOcurrences.append( field.name )

            fkFieldList= []
            model = field.rel.to
            for field in model._meta._fields():
                addFiedToList( fkFieldList,  field , fieldId + '__' , fieldOcurrences)
    
            myField['leaf'] = False 
            myField['children'] = fkFieldList
    

    fieldList.append( myField )
    
    
# --------------------------------------------------------------------------

