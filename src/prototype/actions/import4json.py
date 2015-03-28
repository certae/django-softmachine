# -*- coding: utf-8 -*-


# Import Database class
from prototype.models import  Entity, Property, Relationship, Prototype 

from protoLib.utilsConvert import toBoolean
from protoLib.utilsBase import reduceDict

from protoLib.protoActionEdit import setSecurityInfo 


#  Export 2 Json 
import json

def importProto4Json(request, pModel):

#   To set permissions 
    from protoLib.protoAuth import getUserProfile
    userProfile = getUserProfile( request.user, 'prototype', '' )

#   Get filename   
    fileName = request.POST.get( 'actionFiles', {}).get('file')  
# 
#   Get file data
    try: 
        json_data = open( fileName )   
        jModel = json.load(json_data) 
        json_data.close()
    except: 
        return 'load file error' 

#   entity      ==============================
    for jEntity in jModel[ 'entities' ]: 
 
        defAux = reduceDict ( jEntity , [ "code", "dbName", "description" ] )
 
        pEntity = Entity.objects.get_or_create( model = pModel, code = defAux['code'], defaults= defAux )[0]
        pModel.entity_set.add( pEntity )

#       property      ==============================
        for jAux in jEntity.get( 'property_set' ): 
            jAux["isForeign"] = False 

            pProp = Property.objects.get_or_create( entity = pEntity, code = jAux['code'], defaults= jAux )[0]
            pEntity.property_set.add( pProp )


#       Prototype      ==============================
        for jAux in jEntity.get( 'prototype_set' ): 
            jAux['metaDefinition']  = json.dump( jAux['metaDefinition'] )
            pProp = Prototype.objects.get_or_create( entity = pEntity, code = jAux['code'], defaults= jAux )[0]
            pEntity.prototype_set.add( pProp )


#   entity      ==============================
    for jRel in jModel[ 'relations' ]: 
 
        pEntity = Entity.objects.get( model = pModel, code = jRel['entity'] )
        pRefEntity = Entity.objects.get( model = pModel, code = jRel['refEntity'] )
 
        del jRel['entity']
        del jRel['refEntity']

        Relationship.objects.get_or_create( entity = pEntity, refEntity = pRefEntity, defaults = jAux )[0]


    return 'Ok'

#         # need for setSecurityInfo 
#         data = {}

        # try:
        #     setSecurityInfo(dModel, data, self.userProfile, True )
        #     dModel.save()
        # except:  
        #     self.__logger.info("Error dModel.save")
        #     return



