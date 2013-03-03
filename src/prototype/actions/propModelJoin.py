# -*- coding: utf-8 -*-

from prototype.models import PropertyModel 

def doPropModelJoin( queryset ):

    
    """
    No se pueden crear props de diferentes modelos, pues el modelo hace parte de la llave
    y aunq yo pienso q deberia factorisarse todo a nivel de proeyecto, es importante saber 
    saber cual es el modelo, es posible q la vision de un analista sea limitada a modelos especificos
    de todas formas se puede establecer equivalencias entre proModel 
    """ 
    myBase = None 
    
    # Verifica si todos son del mismo modelo y del mismo tipo    
    for propModel in queryset:
        if myBase is None: 
            myBase = propModel 
            continue 

        if propModel.conceptType == 'ref':
            return 'References are not machable :' +  propModel.code
         
        if myBase.model.code != propModel.model.code:
            return 'model mistMach :' + myBase.model.code + '-' + propModel.model.code 

            

    # Crea el nuevo propModel
    # TODO: Implementar la seguridad real, esta copiando del registro base 
    defValues = {
        'code' : myBase.code, 
        'model' : myBase.model, 

        'baseType' : myBase.baseType, 
        'prpLength' : myBase.prpLength,
        'prpScale' : myBase.prpScale,

        'vType' : myBase.vType,
        'prpDefault' : myBase.prpDefault,
        'prpChoices' : myBase.prpChoices,
        'isSensitive' : myBase.isSensitive,
         
        'description' : myBase.description, 

        'smOwningUser' : myBase.smOwningUser,
        'smCreatedBy'  : myBase.smCreatedBy,

        'smModifiedBy' : myBase.smModifiedBy ,
        'smRegStatus'  : myBase.smRegStatus ,
        'smWflowStatus' : myBase.smWflowStatus ,
        
        'smCreatedOn' : myBase.smCreatedOn ,
        'smModifiedOn' : myBase.smModifiedOn 
    }
    
    myBase = PropertyModel( **defValues )
    
    # Actualiza las Property dependeientes
    returnMsg = ''
    for propModel in queryset:
        propModel.property_set.update(propertyModel= myBase  )
        returnMsg +=  ' ' + propModel.code    

    
    # Borra las propModels
    queryset.delete()

    return returnMsg