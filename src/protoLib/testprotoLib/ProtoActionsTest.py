# -*- coding: utf-8 -*-

from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
from django.utils.unittest import skip
from django.http import HttpRequest
from django.contrib.auth import authenticate
import json

from protoLib.protoActions import protoExecuteAction


def ProtoActionsTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(ProtoExecuteActionTest, 'test'))

    return suite


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
        self.request.POST['selectedKeys'] = '[23]'
        self.request.POST['viewCode'] = 'prototype.Model'

    def tearDown(self):
        pass

    @skip("modelAdmin is None")
    def test_protoexecuteaction(self):
        response = json.loads(protoExecuteAction(self.request).content)
        print(response)
        self.assertTrue(False)
