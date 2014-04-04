# -*- coding: utf-8 -*-

from django.http import HttpResponse
from utilsWeb import JsonError
from prototype.models import Entity, Relationship

import json, uuid

def getTableJSONDiagram(request):
    """ return metadata (columns, renderers, totalcount...)
    """
    selectedTables = []
    connectors = []
    table = {}
    try:
        entities = Entity.objects.filter(model__project_id=1)
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
        "userData": None,
        "cssClass": "draw2d_Connection",
        "stroke": 2,
        "color": "#5BCAFF",
        "policy": "draw2d.policy.line.LineSelectionFeedbackPolicy",
        "router": "draw2d.layout.connection.ManhattanConnectionRouter",
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