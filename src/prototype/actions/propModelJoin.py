# -*- coding: utf-8 -*-

from prototype.models import PropertyProject 
from datetime import datetime

def doPropModelJoin( queryset ):
    """
    todo se factoriza a nivel de proeyecto, es importante saber 
    la vision de un analista sea limitada a proyectos especificos
    de todas formas se puede establecer equivalencias entre proProject 
    """ 
    myBase = None 
    sAux = ''
    
    # Verifica si todos son del mismo modelo y del mismo tipo    
    for propProject in queryset:
        if propProject.conceptType == 'ref':
            sAux = 'References are not machable :' +  propProject.code
            return {'success':False , 'message' : sAux } 

        sAux += '-' + propProject.code

        if myBase is None: 
            myBase = propProject 
            continue 
         
        if myBase.project.code != propProject.project.code:
            sAux = 'model mistMach :' + myBase.model.code + '-' + propProject.model.code 
            return {'success':False , 'message' : sAux } 


    # Crea el nuevo propProject
    # TODO: Implementar la seguridad real, esta copiando del registro base
    
    if len( sAux ) > 40: sAux = sAux[:40] + str( datetime.now() ) 
     
    defValues = {
        'code' : sAux[1:], 
        'project' : myBase.project, 

        'baseType' : myBase.baseType, 
        'prpLength' : myBase.prpLength,
        'prpScale' : myBase.prpScale,

        'vType' : myBase.vType,
        'prpDefault' : myBase.prpDefault,
        'prpChoices' : myBase.prpChoices,
        'isSensitive' : myBase.isSensitive,
         
        'description' : myBase.description, 

        'smOwningTeam' : myBase.smOwningTeam,
        'smOwningUser' : myBase.smOwningUser,
        'smCreatedBy'  : myBase.smCreatedBy,

        'smModifiedBy' : myBase.smModifiedBy ,
        'smRegStatus'  : myBase.smRegStatus ,
        'smWflowStatus' : myBase.smWflowStatus ,
        
        'smCreatedOn' : myBase.smCreatedOn ,
        'smModifiedOn' : myBase.smModifiedOn 
    }
    
    myBase = PropertyProject( **defValues )
    myBase.save()
    
    # Actualiza las Property dependeientes
    for propProject in queryset:
        propProject.property_set.update(propertyProject= myBase  )
        sAux +=  ' ' + propProject.code    

    # Borra las propModels
    queryset.delete()

    return {'success':True , 'message' : sAux } 
