# -*- coding: utf-8 -*-

from django.contrib.admin.sites import  site
from protoGrid import getBaseModelName
from models import getDjangoModel, WflowUserReponse

import django.utils.simplejson as json

from datetime import datetime
from utilsWeb import doReturn
from protoAuth import getUserProfile


def protoExecuteAction(request):
    """ Ejecuta una opcion
    """

    def doWfAction(model, selectedKeys, parameters, actionDef, viewEntity, pUser):

        userProfile = getUserProfile(pUser, 'wflow', viewEntity)
        try:

            changeSt = actionDef.get('change', [])
            stInitial = changeSt[0]                  
            stFinal = changeSt[1]
                              
            Qs = model.objects.filter(pk__in=selectedKeys)
            Qs = Qs.filter(smWflowStatus=stInitial)

            # TODO transaction??? 
            if actionDef.get('notifyOwner', False) : 
                for wfRow in Qs :
                
                    if len (parameters) > 0: 
                        strMsg = parameters[0].get('value')
                    else : strMsg = actionDef.get('message', '') 

                    UserReponse = WflowUserReponse()
                    UserReponse.viewEntity = viewEntity
                    UserReponse.strKey = wfRow.__str__()
                    UserReponse.wfAction = actionDef.get('name')
                    UserReponse.adminMsg = strMsg
                   
                    try:
                        setattr(UserReponse, 'smOwningUser', wfRow.smOwningUser )
                        setattr(UserReponse, 'smOwningTeam', wfRow.smOwningTeam )
                        setattr(UserReponse, 'smCreatedBy', userProfile.user)
                        setattr(UserReponse, 'smRegStatus', '0')
                        setattr(UserReponse, 'smCreatedOn', datetime.now())
                    except :
                        pass 

                    UserReponse.save()            

            if actionDef.get('setOwner', False)  : 
                Qs.update(smWflowStatus=stFinal, smOwningTeam=userProfile.userTeam)
                
            else : 
                Qs.update(smWflowStatus=stFinal)
                
                if actionDef.get('emailNotification', False) :
                    if len (parameters) > 0: 
                        strMsg = parameters[0].get('value')
                    else : strMsg = actionDef.get('message', '') 
                    
                    for wfRow in Qs :
                        if wfRow.smOwningUser.email :
                            try:
                                message = actionDef.get('emailTemplate', '') % (wfRow.smOwningUser, viewEntity, wfRow.__str__(), wfRow.smCreatedOn, strMsg, userProfile.user)
                                wfRow.smOwningUser.email_user(_( 'Modification refusée'), message)             
                            except:
                                pass
                            

            return doReturn ({'success':True, 'message' : 'WfAction Ok'})
         
        except Exception as e:
            return doReturn ({'success':False, 'message' : str(e) })
    
    
#   ----------------------------------------
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
        return doWfAction(model, selectedKeys, parameters, actionDef, viewEntity, request.user)
         
    elif hasattr(modelAdmin, 'actions'):          
        return doAdminAction (model, selectedKeys, parameters, actionDef, modelAdmin)

    else: 
        return doReturn ({'success':False, 'message' : 'Action notFound'})



#   ----------------------------------------

        