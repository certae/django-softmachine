# -*- coding: utf-8 -*-

from django.http import HttpResponse
from protoLib.utilsWeb import JsonError
from prototype.models import Project, Model, Entity, Relationship, Property, Diagram
from protoLib.utilsBase import JSONEncoder

import json, uuid

def getEntitiesJSONDiagram(request):
    """ return all tables from project
    """
    projectID = request.POST['projectID']
    selectedTables = []
    
    try:
        entities = Entity.objects.filter(model__project_id=projectID)
        table = {}
        for entity in entities:
            table = {
                'id':str(uuid.UUID(entity.smUUID)), 
                'tableName':entity.code}
        
            selectedTables.append(table)
                
    except Exception as e:
        print(e)
        return JsonError("Entity non trouvé")  
    
    jsondict = {
        'success':True,
        'message': '',
        'tables': selectedTables,
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")

def getElementsDiagramFromSelectedTables(request):
    """ Creates diagram objects from selected tables in LiveSearchGrid
    """
    selectedTables = []
    connectors = []
    jsondict = {}
    
    objects = json.loads(request.body)
    UUIDAttributeList = []
    for element in objects:
        elementUUID = uuid.UUID(element['id']).hex
        UUIDAttributeList.append(elementUUID)
        
    try:
        entities = Entity.objects.filter(smUUID__in=UUIDAttributeList)
        getJSONElements(entities, selectedTables, connectors)
                
        jsondict = {
            'success':True,
            'message': '',
            'tables': selectedTables,
            'connectors': connectors,
        }
    except Exception as e:
        print(e)
        jsondict = {
            'success':False,
            'message': e.message,
        }
        context = json.dumps(jsondict)
        return HttpResponse(context, content_type="application/json", status=500)
    
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")

def getJSONElements(entities, selectedTables, connectors):
    table = {}
    x = 20
    y = 20
    for entity in entities:
        table = {'type':'dbModel.shape.DBTable', 
            'id':str(uuid.UUID(entity.smUUID)), 
            'x':x, 
            'y':y, 
            'width':98, 
            'height':81.265625, 
            'userData':'', 
            'cssClass':'DBTable', 
            'bgColor':'#DBDDDE', 
            'color':'#D7D7D7', 
            'stroke':1, 
            'alpha':1, 
            'radius':3, 
            'tableName':entity.code, 
            'tablePorts':[], 
            'attributes':[]}
        x += 30
        y += 30
        addOutputPorts(entity, table, connectors)
        for pProperty in entity.property_set.all().order_by('-isPrimary','code'):
            table['attributes'].append({'text':pProperty.code, 'id':str(uuid.UUID(pProperty.smUUID)), 'datatype':pProperty.baseType, 'pk':pProperty.isPrimary, 'fk':pProperty.isForeign, 'isNullable':pProperty.isNullable, 'isRequired':pProperty.isRequired})
            if (pProperty.isForeign):
                addConnectors(pProperty.relationship, table, connectors)
        
        selectedTables.append(table)

def addOutputPorts(entity, table, connectors):
    relationships = Relationship.objects.filter(refEntity=entity)
    for port in relationships:
        if port.refEntity != port.entity:
            outputPortName = "output"+str(port.id)
            table['tablePorts'].append( {
                "type": "draw2d_OutputPort",
                "name": outputPortName,
                "position": "right"
                 })
            appendConnector(port, outputPortName, "input"+str(port.id), connectors)
            
def addConnectors(relationship, table, connectors):
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
        "position": "left"
         })
    appendConnector(relationship, outputPortName, inputPortName, connectors)

def appendConnector(relationship, outputPortName, inputPortName, connectors):
    connector = {
        "type": "dbModel.shape.TableConnection",
        "name": relationship.code,
        "id": str(uuid.UUID(relationship.smUUID)),
        "userData": {"isPrimary":relationship.isPrimary, "useDecorators": False},
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
    if connector not in connectors:
        connectors.append(connector)
    
def synchDiagramFromDB(request):
    """ Updates diagram objects from database
    """
    projectID = request.POST['projectID']
    selectedTables = []
    connectors = []
    
    try:
        entities = Entity.objects.filter(model__project_id=projectID)
        getJSONElements(entities, selectedTables, connectors)
                
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
    

def synchDBFromDiagram(request):
    """ Create and synchronize elements in database
    """
    projectID = request.GET['projectID']
    try:
        project = Project.objects.get(id=projectID)
        user = request.user

        model = Model.objects.filter(project=project)
        if not model:
            model = Model.objects.create(project=project,code='default',smOwningTeam=project.smOwningTeam,smCreatedBy=user,smOwningUser=user)
        else:
            model = model[0]

        owningTeam = model.smOwningTeam
    except Exception as e:
        return JsonError(e)
    
    objects = json.loads(request.body)
    deletedConnectors = []
    UUIDList = []
    for element in objects:
        elementUUID = uuid.UUID(element['id']).hex
        if element['type'] == 'dbModel.shape.DBTable':
            UUIDList.append(elementUUID)
            addOrUpdateEntity(model, user, owningTeam, deletedConnectors, element, elementUUID)
        else:
            if elementUUID not in deletedConnectors:
                sourceUUID = uuid.UUID(element['source']['node']).hex
                targetUUID = uuid.UUID(element['target']['node']).hex
                try:
                    refEntity = Entity.objects.get(smUUID=sourceUUID)
                    connEntity = Entity.objects.get(smUUID=targetUUID)
                except Exception as e:
                    return JsonError(e)
                
                addOrUpdateConnector(element, elementUUID, refEntity, connEntity)
    
    # Return the updated JSON model
    selectedTables = []
    connectors = []
    try:
        entities = Entity.objects.filter(smUUID__in=UUIDList)
        getJSONElements(entities, selectedTables, connectors)
                
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


def getDefaultDiagram(request):
    projectID = request.GET['projectID']
    user = request.user
    try:
        project = Project.objects.get(id=projectID)
        diagrams = Diagram.objects.filter(project_id=projectID)
        if not diagrams:
            diagram,created = Diagram.objects.get_or_create(project=project,code='default',smOwningTeam=project.smOwningTeam)
            diagram.smOwningUser = user
            diagram.smCreatedBy = user
            diagram.save()
        else:
            diagram = diagrams[0]
    except Exception as e:
        return JsonError(e)
    
    jsonDiagram = diagram.info
    if isinstance(jsonDiagram, dict):
            jsonDiagram = json.dumps(jsonDiagram , cls=JSONEncoder)
            
    jsondict = {
        'success':True,
        'message': '',
        'diagramID': diagram.id,
        'diagramCode': diagram.code,
        'diagram': jsonDiagram,
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")

