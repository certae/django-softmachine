# -*- encoding: UTF-8 -*-

from django.test import TestCase
from django.test.client import RequestFactory
from django.http import HttpRequest
from dbDesigner.protoDiagram import getEntitiesJSONDiagram, synchDiagramFromDB, getElementsDiagramFromSelectedTables, synchDBFromDiagram, getDefaultDiagram
from dbDesigner.protoDiagramEntity import listDiagrams, openDiagram, createDiagram, saveDiagram, deleteDiagram
from alltests.testPrototype.testmodels.TestUtilities import createTestDiagram, createTestEntity, createTestRelationship
from requests import Request
from django.contrib.auth import authenticate
import json, uuid, unicodedata

def CreateBasicRequest():
    request = HttpRequest()
    request.method = 'POST'
    request.POST['login'] = 'adube'
    request.POST['password'] = '123'
    request.user = authenticate(username=request.POST['login'], password=request.POST['password'])
    request.POST['projectID'] = 1
    
    return request

def CreatePreparedRequest():
    data = '[{"id":"465bf0b2-a50f-f6cb-fdf0-0cbf142d239b","tableName":"Document"}]'
    req = Request('GET', 'http://url', headers=None, files=None, data=data, params="id=1", auth=None, cookies=None, hooks=None)
    return req.prepare()

def CreatePreparedAuthRequest():
    
    factory = RequestFactory()
    data = '[{"type":"dbModel.shape.DBTable","id":"10eeb1fa-ca72-84d1-82a3-d9cbf75715b0","x":20,"y":20,"width":99,"height":57.84375,"userData":{},"cssClass":"DBTable","bgColor":"#DBDDDE","color":"#D7D7D7","stroke":1,"alpha":1,"radius":3,"tableName":"TableName10","tablePorts":[],"attributes":[{"text":"new attribute0","id":"b3177ad1-b220-805e-e748-be12434e578d","datatype":"string","pk":true,"fk":false,"isRequired":true,"isNullable":false}]}]'
    auth = authenticate(username='adube', password='123')

    request = factory.request()
    request._body = data
    request._get = {"projectID":1, "diagramID":1}
    request.user = auth
    
    return request

def CreatePreparedAuthPostRequest():
    
    factory = RequestFactory()
    auth = authenticate(username='adube', password='123')

    request = factory.post("/protoLib/createDiagram", {u'diagrams': [u'{"projectID":1,"id":"1","code":"test","smUUID":""}']})
    request.user = auth
    
    return request

class ProtoDiagramTest(TestCase):

    def setUp(self):
        self.diagram = createTestDiagram()
        self.basic_request = CreateBasicRequest()
        self.auth_request = CreatePreparedAuthRequest()

    def tearDown(self):
        self.diagram.delete()
        
    def test_verifying_diagram_entities_in_database(self):
        response = json.loads(getEntitiesJSONDiagram(self.basic_request).content)
        self.assertTrue(response['success'])

    def test_synchDiagramFromDB(self):
        response = json.loads(synchDiagramFromDB(self.basic_request).content)
        self.assertTrue(response['success'])
        
    def test_synchDBFromDiagram(self):
        response = json.loads(synchDBFromDiagram(self.auth_request).content)
        self.assertTrue(response['success'])
        
    def test_getDefaultDiagram(self):
        response = json.loads(getDefaultDiagram(self.auth_request).content)
        self.assertTrue(response['success'])

class ProtoDiagramEntityTest(TestCase):
    def setUp(self):
        self.entity = createTestEntity()
        self.diagram = createTestDiagram()
        self.basic_request = CreateBasicRequest()
        self.prepped_request = CreatePreparedRequest()
        self.auth_request = CreatePreparedAuthRequest()
        
        self.testRelationShip = createTestRelationship()

    def tearDown(self):
        self.entity.delete()
        self.diagram.delete()
        self.testRelationShip.delete()

    def test_getEntitiesJSONDiagram_thenReturnEntity(self):
        response = json.loads(getEntitiesJSONDiagram(self.basic_request).content)
        tab = response['tables'][0]
        tabName = unicodedata.normalize('NFKD', tab['tableName']).encode('ascii','ignore')
        self.assertEqual(self.entity.code, tabName)
        
    def test_getElementsDiagramFromSelectedTables(self):
        response = json.loads(getElementsDiagramFromSelectedTables(self.prepped_request).content)
        smUUID = uuid.UUID(response['tables'][0]['id']).hex
        self.assertEqual(self.entity.smUUID, smUUID)
        
    def test_listDiagrams(self):
        response = json.loads(listDiagrams(self.auth_request).content)
        self.assertTrue(response['success'])
        
    def test_openDiagram(self):
        response = json.loads(openDiagram(self.auth_request).content)
        self.assertTrue(response['success'])
    
    def test_saveDiagram(self):
        response = json.loads(saveDiagram(self.auth_request).content)
        self.assertTrue(response['success'])
        
    def test_createDiagram(self):
        request = CreatePreparedAuthPostRequest()
        response = json.loads(createDiagram(request).content)
        self.assertTrue(response['success'])
        
    def test_deleteDiagram(self):
        request = CreatePreparedAuthPostRequest()
        response = json.loads(deleteDiagram(request).content)
        self.assertTrue(response['success'])