# -*- coding: utf-8 -*-

from prototype.models import Relationship
import uuid

class JSONAssembler:
        
    def getJSONElements(self, entities, selectedTables, connectors):
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
            self.addOutputPorts(entity, table, connectors)
            for pProperty in entity.property_set.all().order_by('-isPrimary','code'):
                table['attributes'].append({'text':pProperty.code, 
                                            'id':str(uuid.UUID(pProperty.smUUID)), 
                                            'datatype':pProperty.baseType, 
                                            'pk':pProperty.isPrimary, 
                                            'fk':pProperty.isForeign, 
                                            'isNullable':pProperty.isNullable, 
                                            'isRequired':pProperty.isRequired})
                if (pProperty.isForeign):
                    self.addConnectors(pProperty.relationship, table, connectors)
        
            selectedTables.append(table)
            
    def addOutputPorts(self, entity, table, connectors):
        relationships = Relationship.objects.filter(refEntity=entity)
        for port in relationships:
            if port.refEntity != port.entity:
                outputPortName = "output"+str(port.id)
                table['tablePorts'].append( {
                    "type": "draw2d_OutputPort",
                    "name": outputPortName,
                    "position": "right"
                     })
                self.appendConnector(port, outputPortName, "input"+str(port.id), connectors)
        
    def addConnectors(self, relationship, table, connectors):
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
        self.appendConnector(relationship, outputPortName, inputPortName, connectors)
        
    def appendConnector(self, relationship, outputPortName, inputPortName, connectors):
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