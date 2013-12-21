# -*- coding: utf-8 -*-

''' 
Exportar vistas
'''
  
from pttActionTools import getClassName, TypeEquivalence  
from protoLib.utilsBase import slugify, repStr
from cStringIO import StringIO


def exportProtoJson(request, pModel ):

    cViews = { 
      'code' :  pModel.code, 
      'model':  slugify(pModel.code, '_'), 
      'entities' : {},
    }

    for pEntity in pModel.entity_set.all():

        cEntity = { 
           'code'  : pEntity.code, 
           'concept' : getClassName( pEntity.code ), 
           'properties' : {},   
           'prototypes' : {},   
        } 

        cViews['entities'][ cEntity['code'] ]  = cEntity 

        for pProperty in pEntity.property_set.all():
            
            
            cProperty =  {
                'code'      : pProperty.code, 
                'property'  : slugify(pProperty.code, '_'),
                'isForeign' : pProperty.isForeign,  
                
                'baseType'   : pProperty.baseType,
                'prpLength'  : pProperty.prpLength,
                'prpScale'   : pProperty.prpScale,

                'isPrimary'   : pProperty.isPrimary,
                'isReadOnly'  : pProperty.isReadOnly,

                'isNullable'  : pProperty.isNullable,
                'isRequired'  : pProperty.isRequired,
                'isSensitive' : pProperty.isSensitive,
                'prpChoices'  : pProperty.prpChoices,
                'prpDefault'  : pProperty.prpDefault,
                'vType'       : pProperty.vType,

                'crudType'    : pProperty.crudType,
                'description' : pProperty.description,
                'notes'       : pProperty.notes,

                'dbName'      : pProperty.dbName,
                'isEssential' : pProperty.isEssential,
                'isLookUpResult' : pProperty.isLookUpResult,
            }

            #TODO: 'propertyModel'  :pProperty.propertyModel,
            
            if pProperty.isForeign:
                cProperty[ 'refEntity' ]    = pProperty.relationship.refEntity.code
                cProperty[ 'refCode' ]      = getClassName( pProperty.relationship.refEntity.code )
                 
                cProperty[ 'baseMax']       = pProperty.relationship.baseMax
                cProperty[ 'baseMin']       = pProperty.relationship.baseMin
                cProperty[ 'onRefDelete']   = pProperty.relationship.onRefDelete
                cProperty[ 'refMax']        = pProperty.relationship.refMax
                cProperty[ 'refMin']        = pProperty.relationship.refMin
                cProperty[ 'relatedName']   = pProperty.relationship.relatedName
                cProperty[ 'typeRelation']  = pProperty.relationship.typeRelation
                 
            cEntity['properties'][ cProperty['code'] ]  = cProperty  


        for pPrototype in pEntity.prototype_set.all():
            
            cPrototype =  {
                'code'           : pPrototype.code, 
                'prototype'      : slugify(pPrototype.code, '_'),
                'description'    : pPrototype.description,
                'notes'          : pPrototype.notes,
                'metaDefinition' : pPrototype.metaDefinition 
            } 
            
            cEntity['prototypes'][ cPrototype['code'] ]  = cPrototype  


    strAux = ''
    return strAux
  
