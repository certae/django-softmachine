# -*- coding: utf-8 -*-


def doWFlowResume(modeladmin, request, queryset, parameters):
    """ 
    Genera un resumen de las novedades para WFlow, 
    se apoya en la tabla de parametros para obtner las entidades wflow y la llave   
    """

    from protoLib.models import ParametersBase, getDjangoModel, WflowAdminResume
        
#   Mensaje de retorno
    returnMsg = '' 

#   Borra la tabla de resumen 
    WflowAdminResume.objects.all().delete()

#   Recorre los parametros para conocer las tablas de wFlow 
    Qs = ParametersBase.objects.filter(parameterKey='wflow')
    for pParam in Qs:
        modelName = getDjangoModel(pParam.parameterValue)
        wfStatus  = pParam.parameterTag or 'I'

        try:    
            wfModel =  getDjangoModel( modelName )
        except :
            continue 

        adminResume = WflowAdminResume()
        wfQs = wfModel.objects.filter( smWflowStatus = wfStatus ).count()
        
        adminResume.activityCount = wfQs
        adminResume.viewEntity = pParam.parameterValue
        
        adminResume.save()
        # TODO add returnMsg
    return {'success':True, 'message' : returnMsg }  
