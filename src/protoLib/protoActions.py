# -*- coding: utf-8 -*-

from django.contrib.admin.sites import  site
from django.contrib.auth.models import User
from protoGrid import getBaseModelName
from models import getDjangoModel 


import json

from utilsWeb import doReturn


def protoExecuteAction(request):
    """ Ejecuta una opcion
    """

#     def doWfAction(model, selectedKeys, parameters, actionDef, viewEntity, pUser):

    def doAdminAction(model, selectedKeys, parameters, actionDef, modelAdmin):

        for action in modelAdmin.actions:
            if action.__name__ == actionName: break;
    
        if not action:
            return doReturn ({'success':False, 'message' : 'Action notFound'})
    
    
        Qs = model.objects.select_related(depth=1)
        Qs = Qs.filter(pk__in=selectedKeys)
    
        try:
            returnObj = action(modelAdmin, request, Qs , parameters)
            return doReturn (returnObj)
    
        except Exception as e:
            return doReturn ({'success':False, 'message' : str(e) })


#   ----------------------------------------
    if not request.user.is_authenticated():
        return doReturn ({'success':False , 'message' : 'readOnly User'})

    if request.method != 'POST':
        return doReturn ({'success':False , 'message' : 'PostAction required'})

    actionName = request.POST.get('actionName', '')

    viewCode = request.POST.get('viewCode', '')
    viewEntity = getBaseModelName(viewCode)

    selectedKeys = request.POST.get('selectedKeys', [])
    selectedKeys = json.loads(selectedKeys)

    parameters = request.POST.get('parameters', [])
    parameters = json.loads(parameters)

    actionDef = request.POST.get('actionDef', {})
    actionDef = json.loads(actionDef)

    # hace el QSet de los registros seleccionados
    if actionDef.get('selectionMode', '') != 'none' and selectedKeys.__len__() == 0:
        return doReturn ({'success':False, 'message' : 'No record selected'})


    # Obtiene el modelo
    try:
        model = getDjangoModel(viewEntity)
        modelAdmin = site._registry.get(model)
    except :
        return doReturn ({'success':False, 'message' : 'Model notFound'})


    if actionDef.get('actionType', '') == 'wflow': 
#         return doWfAction(model, selectedKeys, parameters, actionDef, viewEntity, request.user)
        pass 
         
    elif hasattr(modelAdmin, 'actions'):          
        return doAdminAction (model, selectedKeys, parameters, actionDef, modelAdmin)

    else: 
        return doReturn ({'success':False, 'message' : 'Action notFound'})

