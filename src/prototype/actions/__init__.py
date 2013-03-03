# -*- coding: utf-8 -*-

from viewDefinition import getViewDefinition, getViewCode, getEntities
from propModelJoin import doPropModelJoin 

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

def doPropertyModelJoin( modeladmin, request, queryset, parameters):
    """ 
    funcion para unir dos propertyModel 
    """

#   El QSet viene con la lista de Ids  
    if queryset.count() < 2:
        return 'Multiple selection required' 

    if len( parameters ) != 1: 
        return 'New PropertyModel Name is required!!'         

    return doPropModelJoin ( queryset, parameters[0]['value']  )

doPropertyModelJoin.short_description = "Join PropModel"
doPropertyModelJoin.selectionMode = "multiple"
    