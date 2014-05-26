# -*- coding: utf-8 -*-

from django.test import TestCase
from django.http import HttpRequest
from django.contrib.auth import authenticate
import json

from protoLib.protoActionList import protoList

class ProtoActionListTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        self.request = HttpRequest()
        self.request.POST['login'] = 'marieme'
        self.request.POST['password'] = '1'
        self.request.user = authenticate(username=self.request.POST['login'], password=self.request.POST['password'])
        
    def tearDown(self):
        pass
    
    def test_method_user_is_not_authenticated(self):  
        self.request.user = authenticate(username=self.request.POST['login'], password='')
        response = protoList(self.request)
        
        data = json.loads(response.content)
        self.assertFalse(data['success'])
        
    def test_method_is_not_POST(self):
        self.request.method = 'GET'
        
        self.assertTrue(self.request.user.is_authenticated())
        self.assertNotEqual(self.request.method, 'POST')

        response = protoList(self.request)
        data = json.loads(response.content)
        self.assertFalse(data['success'])

    def test_user_is_authenticated_and_method_is_POST(self):
        self.request.method = 'POST'
        self.request.POST['start'] = 0
        self.request.POST['page'] = 1
        self.request.POST['limit'] = 50
        self.request.POST['viewCode'] = 'prototype.project'
        self.request.POST['baseFilter'] = []
        self.request.POST['protoFilter'] = []
        self.request.POST['sort'] = []
        self.request.POST['protoMeta'] = json.dumps({
            "viewCode": "prototype.Project",
            "viewEntity": "prototype.Project",
            "localSort": False,
            "protoEntityId": None,
            "jsonField": "",
            "idProperty": "id",
            "gridConfig": {
                "searchFields": ["smRegStatus", "smWflowStatus", "code", "description"]
            },
            "fields": [{
                "name": "__str__",
                "fkId": "id",
                "zoomModel": "prototype.Project",
                "type": "string"
            }, {
                "name": "code",
                "type": "string"
            }, {
                "name": "description",
                "type": "text"
            }, {
                "name": "id",
                "type": "autofield"
            }, {
                "name": "smCreatedBy",
                "type": "foreigntext"
            }, {
                "name": "smCreatedOn",
                "type": "datetime"
            }, {
                "name": "smModifiedBy",
                "type": "foreigntext"
            }, {
                "name": "smModifiedOn",
                "type": "datetime"
            }, {
                "name": "smOwningTeam",
                "type": "foreigntext"
            }, {
                "name": "smOwningUser",
                "type": "foreigntext"
            }, {
                "name": "smRegStatus",
                "type": "string"
            }, {
                "name": "smWflowStatus",
                "type": "string"
            }],
            "usrDefProps": {"__ptType": "usrDefProps"}
        })

        response = protoList(self.request)
        data = json.loads(response.content)
        self.assertTrue(data['success'])
        


    
