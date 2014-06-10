# -*- coding: utf-8 -*-

from prototype.models import Entity, Relationship, Property
import uuid

def addOrUpdateEntity(model, user, owningTeam, deletedConnectors, element, elementUUID):
    UUIDAttributeList = []
    try:
        entity = Entity.objects.get(smUUID=elementUUID)
        entity.code = element['tableName']
        entity = saveAttributes(element, entity, UUIDAttributeList, user, owningTeam)
        excluded = entity.property_set.exclude(smUUID__in=UUIDAttributeList)
        for item in excluded:
            if item.isForeign:
                deletedConnectors.append(item.relationship.smUUID)
        
        entity.property_set.exclude(smUUID__in=UUIDAttributeList).delete()
        entity.save()
    except Exception as e:
        print e, 'Creating a new one'
        entity = Entity.objects.create(code=element['tableName'], model=model, smUUID=elementUUID)
        entity.smCreatedBy = user
        entity.smOwningTeam = owningTeam
        entity.save()
        entity = saveAttributes(element, entity, UUIDAttributeList, user, owningTeam)
        entity.save()


def addOrUpdateConnector(element, elementUUID, refEntity, connEntity):
    try:
        connector = Relationship.objects.get(smUUID=elementUUID)
        connector.code = element['name']
        connector.isPrimary = element['userData']['isPrimary']
        connector.refEntity = refEntity
        connector.connEntity = connEntity
        connector.save()
    except Exception as e:
        print e, 'Creating a new one'
        connector = Relationship.objects.create(code=element['name'], smUUID=elementUUID, refEntity_id=refEntity.id, entity_id=connEntity.id, isPrimary=element['userData']['isPrimary'], isLookUpResult=True, isNullable=True, isRequired=False, isReadOnly=False, isEssential=False)
        connector.save()


def saveAttributes(element, entity, UUIDAttributeList, user, owningTeam):
    for attribute in element['attributes']:
        attribUUID = uuid.UUID(attribute['id']).hex
        datatype = attribute['datatype']
        isFK = attribute['fk']
        isNullable = attribute['isNullable']
        isRequired = attribute['isRequired']
        isPK = attribute['pk']
        attributeName = attribute['text']
        UUIDAttributeList.append(attribUUID)
        try:
            pProperty = Property.objects.get(smUUID=attribUUID)
            pProperty.code = attributeName
            pProperty.baseType = datatype
            pProperty.isPrimary = isPK
            pProperty.isForeign = isFK
            pProperty.isNullable = isNullable
            pProperty.isRequired = isRequired
            pProperty.save()
        except Exception as e:
            print e, 'Creating a new one'
            if not isFK:
                pProperty = Property.objects.create(code=attributeName, entity=entity, smUUID=attribUUID, isSensitive=False, isPrimary=isPK, isLookUpResult=True, isNullable=isNullable, isRequired=isRequired, isReadOnly=False, isEssential=False)
                pProperty.smCreatedBy = user
                pProperty.smOwningTeam = owningTeam
                pProperty.isForeign = isFK
                pProperty.save()
    
    return entity