# -*- coding: utf-8 -*-


def doWFlowResume(modeladmin, request, queryset, parameters):
    """ 
    Genera un resumen de las novedades para WFlow, 
    se apoya en la tabla de parametros para obtner las entidades wflow y la llave   
    """
        
#   Mensaje de retorno
    returnMsg = '' 

    from protoLib.models import ParametersBase 

    Qs = ParametersBase.objects.filter(parameterKey='wflow')
    for pParam in Qs:
        pass 

    return {'success':True, 'message' : returnMsg }  
