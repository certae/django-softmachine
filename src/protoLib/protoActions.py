# -*- coding: utf-8 -*-

from django.contrib.admin.sites import  site
from django.contrib.auth.models import User
from protoGrid import getBaseModelName
from models import getDjangoModel, WflowUserReponse

import json

from datetime import datetime
from time import strftime
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
                    else :
                        strMsg = actionDef.get('message', '')

                    UserReponse = WflowUserReponse()
                    UserReponse.viewEntity = viewEntity
                    UserReponse.strKey = wfRow.__str__()
                    UserReponse.wfAction = actionDef.get('name')
                    UserReponse.adminMsg = strMsg

                    try:
                        setattr(UserReponse, 'smOwningUser', wfRow.smOwningUser)
                        setattr(UserReponse, 'smOwningTeam', wfRow.smOwningTeam)
                        setattr(UserReponse, 'smCreatedBy', userProfile.user)
                        setattr(UserReponse, 'smRegStatus', '0')
                        setattr(UserReponse, 'smCreatedOn', datetime.now())
                    except :
                        pass

                    UserReponse.save()
                    if actionDef.get('emailNotification', False):

                        user = User.objects.get(username=wfRow.smOwningUser.username)
                        if user.email :
                            try:
                                subject = actionDef.get('emailSubject', '')
                                message = actionDef.get('emailTemplate', '')
                                variableFormat = {
                                                  'sk' : wfRow.__str__(),
                                                  'concept' : viewEntity,
                                                  'admmessage': strMsg ,
                                                  'admin' : userProfile.user.username.title(),
                                                  'date' : strftime('%d/%m/%Y', wfRow.smCreatedOn.timetuple()),
                                                  'User' : wfRow.smOwningUser.username.title()
                                                  }
                                message = message.format(**variableFormat)
                                user.email_user(subject, message)
                            except :
                                pass

            if actionDef.get('setOwner', False)  :
                Qs.update(smWflowStatus=stFinal, smOwningTeam=userProfile.userTeam)
            else :
                Qs.update(smWflowStatus=stFinal)


            return doReturn ({'success':True, 'message' : 'WfAction Ok'})

        except Exception as e:
            return doReturn ({'success':False, 'message' : str(e) })


#   ----------------------------------------
    def doAdminAction(model, selectedKeys, parameters, actionDef, modelAdmin):

        for action in modelAdmin.actions:
            if action.__name__ == actionName:
                break

        if not action:
            return doReturn ({'success':False, 'message' : 'Action notFound'})


        Qs = model.objects.select_related()
        Qs = Qs.filter(pk__in=selectedKeys)

        try:
            returnObj = action(modelAdmin, request, Qs , parameters)
            return doReturn (returnObj)

        except Exception as e:
            return doReturn ({'success':False, 'message' : str(e) })



#   ----------------------------------------
    def doAdminDetailAction(model, selectedKeys, detKeys, parameters, actionDef, modelAdmin ):

        for action in modelAdmin.actions:
            if action.__name__ == actionName:
                break

        if not action:
            return doReturn ({'success':False, 'message' : 'Action notFound'})

        try:
            returnObj = action( modelAdmin, request, selectedKeys, detKeys, parameters )
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


    # details
    if actionDef.get('selectionMode', '') == 'details':
        detKeys = request.POST.get('detKeys', {} )
        detKeys = json.loads(detKeys)

        return doAdminDetailAction(model, selectedKeys, detKeys, parameters, actionDef, modelAdmin )

    elif actionDef.get('actionType', '') == 'wflow':
        return doWfAction(model, selectedKeys, parameters, actionDef, viewEntity, request.user)

    elif hasattr(modelAdmin, 'actions'):
        return doAdminAction (model, selectedKeys, parameters, actionDef, modelAdmin)

    else:
        return doReturn ({'success':False, 'message' : 'Action notFound'})



#   ----------------------------------------