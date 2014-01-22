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
        wfStatus  = pParam.parameterValue or '0'

        try:    
            wfModel =  getDjangoModel( modelName )
        except :
            continue 
        
        wfQs = wfModel.objects.filter( smWflowStatus = wfStatus ).count()

    return {'success':True, 'message' : returnMsg }  
