# -*- coding: utf-8 -*-

from django.http import HttpResponse

import json

def getTableJSONDiagram(request):
    """ return full metadata (columns, renderers, totalcount...)
    """
    
#     viewCode = request.POST.get('viewCode', '') 
#     viewEntity = getBaseModelName(viewCode)
    
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