# -*- coding: utf-8 -*-

from django.test import TestCase
from django.http import HttpRequest
from django.contrib.auth import authenticate
import json

from protoLib.protoGetPci import protoGetPCI, protoSaveProtoObj, protoGetFieldTree

class ProtoGetPciTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        self.request = HttpRequest()
        self.request.method = 'POST'
        self.request.POST['login'] = 'adube'
        self.request.POST['password'] = '123'
        self.request.user = authenticate(username=self.request.POST['login'], password=self.request.POST['password'])
        self.request.POST['viewCode'] = 'prototype.Project'
        self.returnMessage = json.loads(protoGetPCI(self.request).content)

    def tearDown(self):
        pass

    def test_protogetpci_success(self):
        self.assertTrue(self.returnMessage['success'])

    def test_protogetpci_viewcode(self):
        self.assertEqual(self.request.POST['viewCode'], self.returnMessage['protoMeta']['viewCode'])

    def test_protogetpci_viewentity(self):
        self.assertEqual(self.request.POST['viewCode'], self.returnMessage['protoMeta']['viewEntity'])


class ProtoSaveProtoObjTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        self.request = HttpRequest()
        self.request.method = 'POST'
        self.request.POST['login'] = 'adube'
        self.request.POST['password'] = '123'
        self.request.user = authenticate(username=self.request.POST['login'], password=self.request.POST['password'])

        self.request.POST['viewCode'] = '__menu'# custom = True
        self.request.POST['protoMeta'] = json.dumps({
            "text": "prototype",
            "qtip": "",
            "qtitle": "",
            "iconCls": "",
            "id": "protoMenu-ext-gen1448",
            "index": 0,
            "expanded": True,
            "children": [{
                "text": "Relationship",
                "qtip": "",
                "qtitle": "",
                "iconCls": "icon-1",
                "id": "protoMenu-ext-gen1449",
                "index": 0,
                "expanded": False,
                "children": [],
                "leaf": True,
                "viewCode": "prototype.Relationship"
            }, {
                "text": "Entity",
                "qtip": "",
                "qtitle": "",
                "iconCls": "icon-1",
                "id": "protoMenu-ext-gen1450",
                "index": 1,
                "expanded": False,
                "children": [],
                "leaf": True,
                "viewCode": "prototype.Entity"
            }, {
                "text": "Property",
                "qtip": "",
                "qtitle": "",
                "iconCls": "icon-1",
                "id": "protoMenu-ext-gen1451",
                "index": 2,
                "expanded": False,
                "children": [],
                "leaf": True,
                "viewCode": "prototype.Property"
            }, {
                "text": "Project",
                "qtip": "",
                "qtitle": "",
                "iconCls": "icon-1",
                "id": "protoMenu-ext-gen1452",
                "index": 3,
                "expanded": False,
                "children": [],
                "leaf": True,
                "viewCode": "prototype.Project"
            }, {
                "text": "Model",
                "qtip": "",
                "qtitle": "",
                "iconCls": "icon-1",
                "id": "protoMenu-ext-gen1453",
                "index": 4,
                "expanded": False,
                "children": [],
                "leaf": True,
                "viewCode": "prototype.Model"
            }],
            "leaf": False,
            "viewCode": "protoMenu-ext-gen4397"
        })

    def tearDown(self):
        pass

    def test_protosaveprotoobj_with_method_not_post(self):
        self.request.method = 'GET'
        response = json.loads(protoSaveProtoObj(self.request).content)
        self.assertFalse(response['success'])

    def test_protosaveprotoobj_custom_viewcode(self):
        response = json.loads(protoSaveProtoObj(self.request).content)
        self.assertTrue(response['success'])

    def test_protosaveprotoobj_prototype_viewcode(self):
        self.request.POST['viewCode'] = 'prototype.ProtoTable.t-model-t-other-entity'  # prototype = True
        response = json.loads(protoSaveProtoObj(self.request).content)
        self.assertFalse(response['success'])


class ProtoGetFieldTreeTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        self.request = HttpRequest()
        self.request.method = 'POST'
        self.request.POST['login'] = 'adube'
        self.request.POST['password'] = '123'
        self.request.user = authenticate(username=self.request.POST['login'], password=self.request.POST['password'])
        self.request.POST['id'] = 'root'
        self.request.POST['node'] = 'root'
        self.request.POST['sort'] = json.dumps({"property": "text", "direction": "ASC"})
        self.request.POST['viewCode'] = 'prototype.Project'

    def tearDown(self):
        pass

    def test_protogetfieldtree(self):
        response = json.loads(protoGetFieldTree(self.request).content)
        # pprint(response)
        for element in response:
            self.assertFalse(element['checked'])
