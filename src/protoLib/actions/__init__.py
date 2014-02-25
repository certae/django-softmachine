# -*- coding: utf-8 -*-


def doWFlowResume(modeladmin, request, queryset, parameters):
    """ 
    Genera un resumen de las novedades para WFlow, 
    se apoya en la tabla de parametros para obtner las entidades wflow y la llave   
    """

    from protoLib.models import ParametersBase, getDjangoModel, WflowAdminResume
    from django.db.models import Count
    from datetime import datetime

#   Mensaje de retorno
    returnMsg = ''

#   Borra la tabla de resumen
    WflowAdminResume.objects.all().delete()

#   Recorre los parametros para conocer las tablas de wFlow
    Qs = ParametersBase.objects.filter(parameterKey='wflow')
    for pParam in Qs:

        try:
            wfModel = getDjangoModel(pParam.parameterValue)
        except :
            continue
        wfStatus = pParam.parameterTag or 'I'

        QsResume = wfModel.objects.filter(smWflowStatus=wfStatus).values('smOwningTeam').order_by().annotate(regCount=Count('smOwningTeam'))
        for regResume in QsResume:
            adminResume = WflowAdminResume()
            adminResume.viewEntity = pParam.parameterValue
            adminResume.activityCount = regResume.get('regCount')
            adminResume.smOwningTeam_id = regResume.get('smOwningTeam')

            try:
                setattr(adminResume, 'smOwningUser', request.user)
                setattr(adminResume, 'smCreatedBy', request.user)
                setattr(adminResume, 'smRegStatus', '0')
                setattr(adminResume, 'smCreatedOn', datetime.now())
            except :
                pass

            adminResume.save()


    # TODO add returnMsg
    return {'success':True, 'message' : returnMsg }



def doFindReplace( modeladmin, request, queryset, parameters):
    """ 
    find and replace sobre la tabla actual 
    parameters   campo,  findText, replaceText 
    """

#   El QSet viene con la lista de Ids  
    if queryset.count() < 1:
        return  {'success':False, 'message' : 'Multiple selection required'}

    if len( parameters ) != 3: 
        return  {'success':False, 'message' : 'required: fieldName, findText, replaceText' }

    from findReplace import actionFindReplace
    return actionFindReplace( request,  queryset, parameters )

