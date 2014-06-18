# -*- coding: utf-8 -*-

from django.test import TestCase
from django.http import HttpRequest
from django.contrib.auth import authenticate

from protoLib.protoActionEdit import protoCreate, json, protoUpdate, protoDelete

def protoMetaInitialize():
    return json.dumps({
        'viewCode': 'prototype.Project',
        'viewEntity': 'prototype.Project',
        'localSort': False,
        'protoEntityId': None,
        'jsonField': '',
        'idProperty': 'id',
        'gridConfig': {
            'searchFields': ['smRegStatus', 'smWflowStatus', 'code', 'description']
        },
        'fields': [{
            'name': '__str__',
            'fkId': 'id',
            'zoomModel': 'prototype.Project',
            'type': 'string'
        }, {
            'name': 'code',
            'type': 'string'
        }, {
            'name': 'description',
            'type': 'text'
        }, {
            'name': 'id',
            'type': 'autofield'
        }, {
            'name': 'smCreatedBy',
            'type': 'foreigntext'
        }, {
            'name': 'smCreatedOn',
            'type': 'datetime'
        }, {
            'name': 'smModifiedBy',
            'type': 'foreigntext'
        }, {
            'name': 'smModifiedOn',
            'type': 'datetime'
        }, {
            'name': 'smOwningTeam',
            'type': 'foreigntext'
        }, {
            'name': 'smOwningUser',
            'type': 'foreigntext'
        }, {
            'name': 'smRegStatus',
            'type': 'string'
        }, {
            'name': 'smWflowStatus',
            'type': 'string'
        }],
        'usrDefProps': {'__ptType': 'usrDefProps'}
    })

def CreateAddRequest():
    request = HttpRequest()
    request.method = 'POST'
    request.POST['login'] = 'adube'
    request.POST['password'] = '123'
    request.user = authenticate(username=request.POST['login'], password=request.POST['password'])
    request.POST['baseFilter'] = []
    request.POST['protoFilter'] = []
    request.POST['sort'] = []
    request.POST['viewCode'] = 'prototype.Project'
    request.POST['protoMeta'] = protoMetaInitialize()
    request.POST['rows'] = json.dumps([{
        '__str__': '',
        'code': 't2_project',
        'description': '',
        'id': None,
        'smCreatedBy': '',
        'smCreatedOn': '',
        'smModifiedBy': '',
        'smModifiedOn': '',
        'smOwningTeam': '',
        'smOwningUser': '',
        'smRegStatus': '',
        'smWflowStatus': '',
        '_ptStatus': '',
        '_ptId': ''
    }])

    return request


class ProtoCreateTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        self.request = CreateAddRequest()

    def tearDown(self):
        pass

    def test_protocreate(self):
        response = json.loads(protoCreate(self.request).content)
        self.assertTrue(response['success'])


class ProtoUpdateTest(TestCase):
    fixtures = ['auth.json']
    def setUp(self):

        self.request_add = CreateAddRequest()
        protoCreate(self.request_add)

        self.request = HttpRequest()
        self.request.method = 'POST'
        self.request.POST['login'] = 'adube'
        self.request.POST['password'] = '123'
        self.request.user = authenticate(username=self.request.POST['login'], password=self.request.POST['password'])
        self.request.POST['baseFilter'] = []
        self.request.POST['protoFilter'] = []
        self.request.POST['sort'] = []
        self.request.POST['viewCode'] = 'prototype.Project'
        self.request.POST['protoMeta'] = protoMetaInitialize()
        self.request.POST['rows'] = json.dumps([{
            "__str__": "t2-project",
            "code": "t2_project",
            "description": "",
            "id": 26,
            "smCreatedBy": "adube",
            "smCreatedOn": "",
            "smModifiedBy": "",
            "smModifiedOn": "2013-07-03T14:02:08.168618",
            "smOwningTeam": "",
            "smOwningUser": "adube",
            "smRegStatus": "0",
            "smWflowStatus": "",
            "_ptStatus": None,
            "_ptId": ""
        }])

    def tearDown(self):
        pass

    def test_protoupdate(self):
        response = json.loads(protoUpdate(self.request).content)
        self.assertTrue(response['success'])


class ProtoDeleteTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        self.request_add = CreateAddRequest()
        protoCreate(self.request_add)

        self.request = HttpRequest()
        self.request.method = 'POST'
        self.request.POST['login'] = 'adube'
        self.request.POST['password'] = '123'
        self.request.user = authenticate(username=self.request.POST['login'], password=self.request.POST['password'])
        self.request.POST['baseFilter'] = []
        self.request.POST['protoFilter'] = []
        self.request.POST['sort'] = []
        self.request.POST['viewCode'] = 'prototype.Project'
        self.request.POST['protoMeta'] = protoMetaInitialize()
        self.request.POST['rows'] = json.dumps([{
            "__str__": "t2-project",
            "code": "t2_project",
            "description": "",
            "id": 26,
            "smCreatedBy": "adube",
            "smCreatedOn": "2013-07-03T14:03:44.587265",
            "smModifiedBy": "adube",
            "smModifiedOn": "2013-07-03T14:03:44.587285",
            "smOwningTeam": "proto",
            "smOwningUser": "adube",
            "smRegStatus": "0",
            "smWflowStatus": "",
            "_ptStatus": None,
            "_ptId": ""
        }])

    def tearDown(self):
        pass

    def test_protodelete(self):
        response = json.loads(protoDelete(self.request).content)
        self.assertTrue(response['success'])
