# -*- coding: utf-8 -*-

from django.contrib.admin.sites import  site
from django.http import HttpResponse
from protoGrid import getProtoViewName, setDefaultField , getProtoAdmin
from protoLib import protoGrid
from protoField import  setFieldDict
from models import getDjangoModel, ProtoDefinition
from utilsBase import  getReadableError  
from protoQbe import addFilter  

import django.utils.simplejson as json


def protoExecuteAction(request):
    """ Ejecuta una opcion  
    """

    if request.method != 'POST':
        return doReturn ({'success':False ,'error' : 'PostAction required'})

    actionName   = request.POST.get('actionName', '') 
    
    protoOption  = request.POST.get('protoOption', '') 
    protoConcept  = getProtoViewName( protoOption )

    selectedKeys = request.POST.get('selectedKeys', [])
    selectedKeys = json.loads( selectedKeys )
    
    # Obtiene el modelo 
    try: 
        model = getDjangoModel(protoConcept)
        modelAdmin = site._registry.get( model )
    except Exception as e:
        return doReturn ({'success':False, 'error' : 'Model notFound'}) 

    for action in modelAdmin.actions: 
        if action.__name__ == actionName: break; 
        
    if not action: 
        return doReturn ({'success':False, 'error' : 'Action notFound'}) 

    
    # hace el QSet de los registros seleccionados
    if selectedKeys.__len__() == 0:
        return doReturn ({'success':False, 'error' : 'No record selected'}) 
    
    pFilter = { 'pk__in' : selectedKeys }
         
    Qs = model.objects.select_related(depth=1)
    Qs = addFilter( Qs, pFilter   )


    try:        
        action( modelAdmin, request, Qs )
    except Exception as e:
        return doReturn ({'success':False, 'error' : str( e ) }) 
        
    
    return doReturn ({'success':True }) 


def doReturn( jsonDict ):
    # Codifica el mssage json 
    context = json.dumps( jsonDict )
    return HttpResponse(context, mimetype="application/json")
