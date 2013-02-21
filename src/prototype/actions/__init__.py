# -*- coding: utf-8 -*-

import django.utils.simplejson as json

from django.contrib import admin
from prototype.models import Model, Entity,  ProtoView

from protoLib.models import CustomDefinition
from protoLib.protoActionEdit import setSecurityInfo 
from protoLib.utilsBase import JSONEncoder, stripAccents
from protoLib.protoAuth import getUserProfile

from viewDefinition import getViewDefinition, getViewCode

PROTO_PREFIX = "prototype.ProtoTable."



def doModelPrototype( modeladmin, request, queryset, parameters):
    """ 
    funcion para crear el prototipo sobre 'protoTable' con la definicion del diccionario
    a partir de Model  
    """

#   El QSet viene con la lista de Ids  
    if queryset.count() == 0:
        return 'No record selected' 

#   Mensaje de retorno
    returnMsg = '' 

#   Recorre los registros selccionados   
    for pModel in queryset:
        returnTmp = getEntities( pModel.entity_set.all() , request , None  )
        returnMsg += 'Model : ' + pModel.code + ' Entts: ' + returnTmp + '; '    

    return returnMsg

doModelPrototype.short_description = "Create prototypes for the model"
doModelPrototype.selectionMode = "multiple"


def doEntityPrototype( modeladmin, request, queryset, parameters ):

#   El QSet viene con la lista de Ids  
    if queryset.count() != 1:
        return 'No record selected' 

    if len( parameters ) != 1: 
        return 'ViewName required!!'         

#   Recorre los registros selccionados   
    returnTmp = getEntities( queryset , request, parameters[0]['value']  )
    return ' Entt: ' + returnTmp
    


# --------------------------------------------------------------------------------

def getEntities( queryset , request, viewTitle  ):

    userProfile = getUserProfile( request.user, 'prototype', '' ) 
    returnMsg = '' 

#   Recorre los registros selccionados   
    for pEntity in queryset:
        returnMsg += pEntity.code  + ','    
        createView(  pEntity , getViewCode( pEntity, viewTitle ) , userProfile )

    return returnMsg


def createView( pEntity, viewTitle, userProfile ):

    viewName    = stripAccents( viewTitle )
    infoEntity  = getViewDefinition( pEntity , viewTitle  )

    # Debe corresponder al protoOptiongenerado en el template ( infoEntity[protoOption] ) 
    protoOption = PROTO_PREFIX + viewName
    
    try:
        rec = CustomDefinition.objects.get(code = protoOption, smOwningTeam = userProfile.userTeam )
        created = False 
    except CustomDefinition.DoesNotExist:
        created = True 
        rec = CustomDefinition( code = protoOption )
    
    rec.metaDefinition = json.dumps( infoEntity, cls=JSONEncoder ) 
    rec.description = infoEntity['description'] 
    rec.active = True 
    
    setSecurityInfo( rec, {}, userProfile, created   )
    rec.save()

    # Crea el ProtoView ( mismo nombre q la vista : necesario para los zooms y los detalles automaticos  ) 
    ProtoView.objects.get_or_create( entity = pEntity, code = viewName, smOwningTeam = userProfile.userTeam )


# ----
   


    