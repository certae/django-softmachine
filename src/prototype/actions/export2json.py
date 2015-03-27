# -*- coding: utf-8 -*-

#  Export 2 Json 
import json  

def exportPrototype2Json(request, pModel):

    jEntities = []
    jRelations = []

    for pEntity in pModel.entity_set.all():

        jPropertySet = []
        jPrototypeSet = []

        jEntity = { 
            "code" : pEntity.code, 
            "dbName" : pEntity.dbName ,
            "description" : pEntity.description, 

            "property_set" : jPropertySet,
            "prototype_set" : jPrototypeSet,
            }
        jEntities.append( jEntity )


        for pProperty in pEntity.property_set.all():
            if pProperty.isForeign: 
                addRelation ( pProperty, jRelations  )
            else :
                addProperty ( pProperty, jPropertySet )


        for pPrototype in pEntity.prototype_set.all():
            addPrototype ( pPrototype, jPrototypeSet  )


    return json.dumps( { 'entities' : jEntities, 'relations': jRelations }, sort_keys=True, indent=2)


def getProperty( pProperty ):

    return  {
      "code" :  pProperty.code,
      "baseType" : pProperty.baseType,
      "prpLength" : pProperty.prpLength,
      "prpScale" : pProperty.prpScale,
      "prpDefault" : pProperty.prpDefault,
      "prpChoices" : pProperty.prpChoices,
      "vType" : pProperty.vType,

      "isReadOnly" : pProperty.isReadOnly,
      "isRequired" : pProperty.isRequired,
      "isNullable" : pProperty.isNullable,
      "isPrimary" : pProperty.isPrimary,
      "isLookUpResult" : pProperty.isLookUpResult,
      "isSensitive" : pProperty.isSensitive,
      "isEssential" : pProperty.isEssential,
      "crudType" : pProperty.crudType,
      "dbName" : pProperty.dbName,
      "description" : pProperty.description,
      "notes" : pProperty.notes
    }


def addProperty ( pProperty, jPropertySet ):

    jPropertySet.append( getProperty( pProperty ))


def addRelation( pProperty, jRelations  ): 

    jProperty = getProperty( pProperty )

    pRelation = pProperty.relationship

    jRelation =  { 
        "entity" : pProperty.entity.code, 
        "refEntity"  : pRelation.refEntity.code , 

        "relatedName" :pRelation.relatedName, 
        "baseMin" : pRelation.baseMin, 
        "baseMax" : pRelation.baseMax, 
        "refMin" : pRelation.refMin, 
        "refMax" : pRelation.refMax, 
        "onRefDelete" : pRelation.onRefDelete, 
        "typeRelation" :pRelation.typeRelation, 

    }

    jRelation.update( jProperty )
    jRelations.append( jRelation ) 

def addPrototype( pPrototype, jPrototypeSet  ): 

    jPrototype =  { 
      "code" :  pPrototype.code,
      "description" : pPrototype.description,
      "notes" : pPrototype.notes, 
      "metaDefinition" : json.loads( pPrototype.metaDefinition ) 
    }

    jPrototypeSet.append( jPrototype  ) 
