# -*- coding: utf-8 -*-

from django.contrib.admin.sites import  site
from django.http import HttpResponse
from protoGrid import getProtoViewName
from models import getDjangoModel

import django.utils.simplejson as json
from utilsBase import JSONEncoder

def protoExecuteAction(request):
    """ Ejecuta una opcion  
    """

    if request.method != 'POST':
        return doReturn ({'success':False ,'message' : 'PostAction required'})

    actionName   = request.POST.get('actionName', '') 
    
    protoOption  = request.POST.get('protoOption', '') 
    protoConcept  = getProtoViewName( protoOption )

    selectedKeys = request.POST.get('selectedKeys', [])
    selectedKeys = json.loads( selectedKeys )

    parameters = request.POST.get('parameters', [])
    parameters = json.loads( parameters )
    
    # Obtiene el modelo 
    try: 
        model = getDjangoModel(protoConcept)
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
        returnMsg  = action( modelAdmin, request, Qs , parameters )
        return doReturn ({'success':True, 'message' : returnMsg }) 

    except Exception as e:
        return doReturn ({'success':False, 'message' : str( e ) }) 
        


def doReturn( jsonDict ):
    # Codifica el mssage json 
    context = json.dumps( jsonDict, cls=JSONEncoder )
    return HttpResponse(context, mimetype="application/json")
