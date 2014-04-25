# -*- coding: utf-8 -*-

from django.http import HttpResponse
from utilsWeb import JsonError
from prototype.models import Project, Model, Entity, Relationship, Property, Diagram
from utilsBase import JSONEncoder

import json, uuid

def listDiagrams(request):
    projectID = request.GET['projectID']
    
    resultset = Diagram.objects.filter(project_id=projectID)
        
    diagrams = [ob.as_json() for ob in resultset]
    
    jsondict = {
        'success':True,
        'message': 'Diagram saved',
        'diagrams': diagrams,
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")


def createDiagram(request):
    test = request
    # {u'diagrams': [u'{"projectID":1,"id":"","code":"TestDiagram","smUUID":""}']}


def saveDiagram(request):
    diagramID = request.REQUEST['diagramID']
    
    jsonFile = json.loads(request.body)
    jsonString = JSONEncoder().encode(jsonFile)
    jsonString = '{"objects":'+jsonString+'}'
    try:
        diagram = Diagram.objects.get(id=diagramID)
        diagram.info = jsonString
        diagram.save()
    except Exception as e:
        return JsonError(e)
    
    jsondict = {
        'success':True,
        'message': 'Diagram saved',
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")