# -*- coding: utf-8 -*-

from django.test import TestCase
from django.http import HttpRequest
from django.contrib.auth import authenticate
import json

from protoLib.protoActions import protoExecuteAction


class ProtoExecuteActionTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        self.request = HttpRequest()
        self.request.method = 'POST'
        self.request.POST['login'] = 'adube'
        self.request.POST['password'] = '123'
        self.request.user = authenticate(username=self.request.POST['login'], password=self.request.POST['password'])

        self.request.POST['actionName'] = 'doModelPrototype'
        self.request.POST['parameters'] = '[]'
        self.request.POST['actionDef'] = '{}'
        self.request.POST['selectedKeys'] = '[23]'
        self.request.POST['viewCode'] = 'prototype.Model'

    def tearDown(self):
        pass


    def test_protoexecuteaction_action_none(self):
        response = json.loads(protoExecuteAction(self.request).content)
        self.assertFalse(response['success'])
        
    def test_protoexecuteaction_selection_none(self):
        self.request.POST['selectedKeys'] = '[]'
        response = json.loads(protoExecuteAction(self.request).content)
        self.assertFalse(response['success'])

    def test_protoexecuteaction_model_none(self):
        self.request.POST['viewCode'] = ''
        response = json.loads(protoExecuteAction(self.request).content)
        self.assertFalse(response['success'])
        