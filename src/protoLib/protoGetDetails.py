# -*- coding: utf-8 -*-

from django.http import HttpResponse
from protoField import TypeEquivalence
from models import getDjangoModel 
from utilsBase import getReadableError, verifyStr
from protoGrid import  getProtoViewName

import django.utils.simplejson as json


def protoGetDetailsTree(request):
    """ return full field tree 
    """

    if request.method != 'GET':
        return 
    
    protoOption = request.GET.get('protoOption', '') 
    protoConcept, view = getProtoViewName( protoOption )
    
    try: 
        model = getDjangoModel(protoConcept)
    except Exception,  e:
        jsondict = { 'success':False, 'message': getReadableError( e ) }
        context = json.dumps( jsondict)
        return HttpResponse(context, mimetype="application/json")
    
    
    detailList = []
    
    # Se cargan los detalles ( related objects )  
    for detail in model._meta.get_all_related_objects(): # + opts.get_all_related_many_to_many_objects():
        
        # Este es el campo por el que voy a filtrar el modelo, 
        # debe ser el nombre del fk q corresponde + pk para apuntar al ix del maestro 
        # si los nombres del modelo padre y del fk no corresponde q pasa? 
        detailField =  detail.field.attname
        addDetailToList( detailList,  detail , detailField  )

        
    # Codifica el mssage json 
    context = json.dumps( detailList)
    return HttpResponse(context, mimetype="application/json")



def addDetailToList(  detailList , detail, detailField   ):
    """ return parcial detail tree  ( Called from protoGetFieldTree ) 
    """

    model = detail.model 
    oMeta = model._meta 
    modelName = oMeta.app_label + '.' + oMeta.object_name

    # Agrega el campo solicitado
    menuDetail = {
        "menuText"      : oMeta.verbose_name.title() + '.' + detail.field.name , 
        "conceptDetail" : modelName, 
        "id"            : modelName + '.' + detailField , 
        "detailField"   : detailField,                    
        "masterField"   : 'pk',                                                #  oMeta.pk.name ,
        "leaf"          : True 
        }
    
    detailList.append( menuDetail ) 
    
    # Evita demasiada recursividad ( 5 niveles debe ser mas q suficiente )
    # Si el mismo campo ya aparece en el camino seguramente es una autoreferencia 
    if detailField.count( '__') > 5 or detailField.count( '__' + detail.field.name + '__' ) > 0:
        return 

    else: 
        detailChild= []
    
        for sDetail in model._meta.get_all_related_objects(): 
            sDetailField = sDetail.field.name + '__' + detailField 
            addDetailToList( detailChild,  sDetail , sDetailField  )
    
        # Si el modelo de base es el modelo de trabajo, no entro al loop 
        if len( detailChild ) > 0:  
            menuDetail['leaf'] = False 
            menuDetail['children'] = detailChild
            