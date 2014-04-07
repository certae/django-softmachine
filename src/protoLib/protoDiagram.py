# -*- coding: utf-8 -*-

from django.http import HttpResponse
from utilsWeb import JsonError
from prototype.models import Model, Entity, Relationship, Property

import json, uuid

def getEntitiesJSONDiagram(request):
    """ return metadata (columns, renderers, totalcount...)
    """
    modelID = request.POST['modelID']
    selectedTables = []
    connectors = []
    table = {}
    try:
        entities = Entity.objects.filter(model_id=modelID)
        x = 20
        y = 20
        for entity in entities:
            table = {
                'type': 'dbModel.shape.DBTable',
                'id': str(uuid.UUID(entity.smUUID)),
                'x': x,
                'y': y,
                'width': 98,
                'height': 81.265625,
                'userData': None,
                'cssClass': 'DBTable',
                'bgColor': '#DBDDDE',
                'color': '#D7D7D7',
                'stroke': 1,
                'alpha': 1,
                'radius': 3,
                'tableName': entity.code,
                'tablePorts': [],
                'attributes': [] 
            }
            x += 30
            y += 30 
            addOutputPorts(entity, table)
            
            for pProperty in entity.property_set.all():
                table['attributes'].append( {
                    'text':  pProperty.code,
                    'id': str(uuid.UUID(pProperty.smUUID)),
                    'datatype': pProperty.baseType,
                    'pk': pProperty.isPrimary,
                    'fk':  pProperty.isForeign,
                    'isNullable': pProperty.isNullable,
                    'isRequired': pProperty.isRequired
                     })
                if (pProperty.isForeign):
                    addConnectors(pProperty, table, connectors)
            
            selectedTables.append(table)
                
    except Exception as e:
        print(e)
        return JsonError("Entity non trouvé")  
    
    jsondict = {
        'success':True,
        'message': '',
        'tables': selectedTables,
        'connectors': connectors,
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")

def addOutputPorts(entity, table):
    relationships = Relationship.objects.filter(refEntity=entity)
    for port in relationships:
        if port.refEntity != port.entity:
            outputPortName = "output"+str(port.id)
            table['tablePorts'].append( {
                "type": "draw2d_OutputPort",
                "name": outputPortName,
                "position": "default"
                 })
            
def addConnectors(pProperty, table, connectors):
    relationship = pProperty.relationship
    inputPortName = "input"+str(relationship.id)
    outputPortName = "output"+str(relationship.id)
    if relationship.refEntity == relationship.entity:
        outputPortName = "hybrid0"
        table['tablePorts'].append( {
            "type": "draw2d_HybridPort",
            "name": outputPortName,
            "position": "bottom"
             })
    table['tablePorts'].append( {
        "type": "draw2d_InputPort",
        "name": inputPortName,
        "position": "default"
         })
    connector = {
        "type": "dbModel.shape.TableConnection",
        "name": relationship.code,
        "id": str(uuid.UUID(relationship.smUUID)),
        "userData": {"isRequired":relationship.isRequired},
        "cssClass": "draw2d_Connection",
        "stroke": 2,
        "color": "#5BCAFF",
        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",
        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",
        "source": {
            "node": str(uuid.UUID(relationship.refEntity.smUUID)),
            "port": outputPortName
        },
        "target": {
            "node": str(uuid.UUID(relationship.entity.smUUID)),
            "port": inputPortName
        }
    }
    connectors.append(connector)
    
def synchDBFromDiagram(request):
    """ synchronyze JSON File with database
    """
    modelID = request.REQUEST['modelID']
    try:
        model = Model.objects.get(id=modelID)
        user = request.user
        owningTeam = model.smOwningTeam
    except Exception as e:
        return JsonError(e)
    
    objects = json.loads(request.body)
    for element in objects:
        elementUUID = uuid.UUID(element['id']).hex
        if element['type'] == 'dbModel.shape.DBTable':
            try:
                entity = Entity.objects.get(smUUID=elementUUID)
                entity.code = element['tableName']
                UUIDAttributeList = []
                entity = saveAttributes(element, entity, UUIDAttributeList, user, owningTeam)
                
                entity.property_set.exclude(smUUID__in=UUIDAttributeList).delete()
                    
                entity.save()
            except Exception as e:
                print e, 'Creating a new one'
                entity = Entity.objects.create(code=element['tableName'],model=model,smUUID=elementUUID)
                entity.smCreatedBy = user
                entity.smOwningTeam = owningTeam
                entity.save()
        else:
            sourceUUID = uuid.UUID(element['source']['node']).hex
            targetUUID = uuid.UUID(element['target']['node']).hex
            try:
                refEntity = Entity.objects.get(smUUID=sourceUUID)
                connEntity = Entity.objects.get(smUUID=targetUUID)
            except Exception as e:
                return JsonError(e)
            
            try:
                connector = Relationship.objects.get(smUUID=elementUUID)
                connector.code = element['name']
                connector.isRequired = element['userData']['isRequired']
                connector.isPrimary = connector.isRequired
                connector.refEntity = refEntity
                connector.connEntity = connEntity
                connector.save()
            except Exception as e:
                print e, 'Creating a new one'
                connector = Relationship.objects.create(code=element['name'], smUUID=elementUUID, refEntity_id=refEntity.id, entity_id=connEntity.id, isPrimary=element['userData']['isRequired'], isLookUpResult=True, isNullable=True, isRequired=element['userData']['isRequired'], isReadOnly=False, isEssential=False)
                connector.save()
    
    context = {
        'message': 'message',
        'success': True
    }

    return HttpResponse(json.dumps(context), content_type="application/json")

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
            pProperty = Property.objects.create(code=attributeName, entity=entity, smUUID=attribUUID, isSensitive=False, isPrimary=isPK, isLookUpResult=True, isNullable=isNullable, isRequired=isRequired, isReadOnly=False, isEssential=False)
            pProperty.smCreatedBy = user
            pProperty.smOwningTeam = owningTeam
            pProperty.isForeign = isFK
            pProperty.save()
    
    return entity

