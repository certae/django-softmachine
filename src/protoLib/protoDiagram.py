# -*- coding: utf-8 -*-

from django.http import HttpResponse
from utilsWeb import JsonError
from prototype.models import Entity, Project, Model, Prototype

import json, uuid

def getTableJSONDiagram(request):
    """ return full metadata (columns, renderers, totalcount...)
    """
    selectedTables = []
    table = {}
    try:
        entities = Entity.objects.filter(model__project_id=16)
        x = 20
        y = 20
        for entity in entities:
            table = {
                'type': 'dbModel.shape.DBTable',
                'id': str(uuid.uuid4()),
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
            for pProperty in entity.property_set.all():
                table['attributes'].append( {
                    'text':  pProperty.code,
                    'id': str(uuid.uuid4()),
                    'datatype': pProperty.baseType,
                    'pk': pProperty.isPrimary,
                    'fk':  pProperty.isForeign,
                    'isNullable': pProperty.isNullable,
                    'isRequired': pProperty.isRequired
                     })
                if (pProperty.isForeign):
                    connector = pProperty.relationship
                    # TODO create a connector list
             
            selectedTables.append(table)
                
    except Exception as e:
        print(e)
        return JsonError("Entity non trouvé")  
    
#     jsondict = {
#         'success':True,
#         'message': '',
#         'table':{
#             "type": "dbModel.shape.DBTable",
#             "id": "63c0f27a-716e-804c-6873-cd99b945b64g",
#             "x": 80,
#             "y": 200,
#             "width": 98,
#             "height": 81.265625,
#             "userData": "",
#             "cssClass": "DBTable",
#             "bgColor": "#DBDDDE",
#             "color": "#D7D7D7",
#             "stroke": 1,
#             "alpha": 1,
#             "radius": 3,
#             "tableName": "Custom",
#             "tablePorts": [
#                 {
#                     "type": "draw2d_InputPort",
#                     "name": "input0",
#                     "position": "default"
#                 },
#                 {
#                     "type": "draw2d_OutputPort",
#                     "name": "output0",
#                     "position": "default"
#                 }
#             ],
#             "attributes": [
#               {
#                 "text": "blubber",
#                 "id": "49be7d78-4dcf-38ab-3733-b4108701fce4",
#                 "datatype": "Integer",
#                 "pk": True,
#                 "unique": True
#               }
#             ]
#         },
#     }
    jsondict = {
        'success':True,
        'message': '',
        'table': selectedTables,
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")