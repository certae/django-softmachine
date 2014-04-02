# -*- coding: utf-8 -*-

from django.http import HttpResponse
from utilsWeb import JsonError
from prototype.models import Entity, Project, Model, Prototype

import json, uuid

def getTableJSONDiagram(request):
    """ return full metadata (columns, renderers, totalcount...)
    """
    
    try:
        entities = Entity.objects.filter(model__project_id=16)
        
        for entity in entities:
            print(entity)
            id = str(uuid.uuid3(uuid.NAMESPACE_DNS, 'tableName'))
            for pProperty in entity.property_set.all():
                print(pProperty)
                # code > attribute_name
                # baseType
                # isForeign > fk
                # isNullable
                # isPrimary > pk
                # isRequired
            
    except Exception as e:
        print(e)
        return JsonError("Entity non trouvé")  
    
    jsondict = {
        'success':True,
        'message': '',
        'table':{
            "type": "dbModel.shape.DBTable",
            "id": "63c0f27a-716e-804c-6873-cd99b945b64g",
            "x": 80,
            "y": 200,
            "width": 98,
            "height": 81.265625,
            "userData": "",
            "cssClass": "DBTable",
            "bgColor": "#DBDDDE",
            "color": "#D7D7D7",
            "stroke": 1,
            "alpha": 1,
            "radius": 3,
            "tableName": "Custom",
            "tablePorts": [
                {
                    "type": "draw2d_InputPort",
                    "name": "input0",
                    "position": "default"
                },
                {
                    "type": "draw2d_OutputPort",
                    "name": "output0",
                    "position": "default"
                }
            ],
            "attributes": [
              {
                "text": "blubber",
                "id": "49be7d78-4dcf-38ab-3733-b4108701fce4",
                "datatype": "Integer",
                "pk": True,
                "unique": True
              }
            ]
        },
    }
    
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")