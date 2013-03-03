# -*- coding: utf-8 -*-

from django.contrib.admin.sites import  site
from protoGrid import getProtoViewName
from models import getDjangoModel

import django.utils.simplejson as json
from utilsWeb import doReturn 

def protoExecuteAction(request):
    """ Ejecuta una opcion  
    """

    if request.method != 'POST':
        return doReturn ({'success':False ,'message' : 'PostAction required'})

    actionName   = request.POST.get('actionName', '') 
    
    viewCode  = request.POST.get('viewCode', '') 
    viewEntity  = getProtoViewName( viewCode )

    selectedKeys = request.POST.get('selectedKeys', [])
    selectedKeys = json.loads( selectedKeys )

    parameters = request.POST.get('parameters', [])
    parameters = json.loads( parameters )
    
    # Obtiene el modelo 
    try: 
        model = getDjangoModel(viewEntity)
        modelAdmin = site._registry.get( model )
    except Exception as e:
        return doReturn ({'success':False, 'message' : 'Model notFound'}) 

    for action in modelAdmin.actions: 
        if action.__name__ == actionName: break; 
        
    if not action: 
        return doReturn ({'success':False, 'message' : 'Action notFound'}) 

    
    # hace el QSet de los registros seleccionados
    if selectedKeys.__len__() == 0:
        return doReturn ({'success':False, 'message' : 'No record selected'}) 
    
    Qs = model.objects.select_related(depth=1)
    Qs = Qs.filter( pk__in = selectedKeys  )

    try:
        returnObj  = action( modelAdmin, request, Qs , parameters )
        return doReturn ( returnObj ) 

    except Exception as e:
        return doReturn ({'success':False, 'message' : str( e ) }) 
        


