# -*- coding: utf-8 -*-

#DGT : Verificar 

from prototype.models import Model  
from protoLib.protoAuth import getUserProfile


def doEttyChangeModel( request,  queryset , parameters ):
    """
    Permite cambiar una entidad de modelo,  inicialmente se hace al momento de hacer instrospeccion 
    de una Db, luego cada modelo se relocaliza para poder analizarlo 

    DGT :  esto no es necesario, pues se podran crear diagramas particulares sin importar el modelo 

    """ 

    newModelName = parameters[0]['value']
    dProject = None
        
    # Obtiene el proyecto y se asegura q sean todas de un mismo proyecto 
    for dEntity in queryset:
        if  dProject is None :   dProject = dEntity.model.project 
        if dProject.pk  <>  dEntity.model.project.pk: 
            return  {'success':False, 'message' : 'Must be in the same project' }


    userProfile = getUserProfile( request.user, 'prototype', '' ) 
    defValues = {
        'smOwningTeam' : userProfile.userTeam,
        'smOwningUser' : userProfile.user,
        'smCreatedBy' :  userProfile.user
    }

    # crea u obtiene el  modelo 
    dModel = Model.objects.get_or_create( project = dProject, 
            code =  newModelName, 
            smOwningTeam = userProfile.userTeam, 
            defaults = defValues 
        )[0]


    # 
    for dEntity in queryset:
        dEntity.model = dModel
        dEntity.save()

    return  {'success':True , 'message' :  'Ok' }

