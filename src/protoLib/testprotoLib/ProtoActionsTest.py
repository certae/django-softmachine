# -*- coding: utf-8 -*-

from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
from django.utils.unittest import skip
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
    
    @skip("modelAdmin is None")
    def test_protoexecuteaction_action(self):
        self.request.POST['actionDef'] = '{"name" : "accept", "menuText" : "Accepter",  "viewIcon" : "", "descripion" : "", "methode" : "","change" : ( "I", "Ok" ), "setOwner" : True , "notifyOwner" : True , "emailNotification" : True, "emailSubject" : "modification", "emailTemplate" : "Email notif", "message" : "Accepté" , "admMessagePropmt" : ""}'
        
        response = json.loads(protoExecuteAction(self.request).content)
        self.assertFalse(response['success'])
        

        