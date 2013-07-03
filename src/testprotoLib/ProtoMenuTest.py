# -*- coding: utf-8 -*-

from pprint import pprint
from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
from django.utils.unittest import skip
from django.http import HttpRequest
from django.contrib.auth import authenticate
import django.utils.simplejson as json

from protoLib.protoMenu import protoGetMenuData


def ProtoMenuTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(ProtoMenuTest, 'test'))

    return suite


class ProtoMenuTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        self.request = HttpRequest()
        self.request.method = 'POST'
        self.request.POST['login'] = 'adube'
        self.request.POST['password'] = '123'
        self.request.POST['forceDefault'] = 0
        self.request.POST['id'] = 'root'
        self.request.POST['node'] = 'root'
        self.request.user = authenticate(username=self.request.POST['login'], password=self.request.POST['password'])

    def tearDown(self):
        pass

    # Trouver un meilleur critere a tester...
    def test_protogetmenudata(self):
        returnMessage = json.loads(protoGetMenuData(self.request).content)
        self.assertTrue(len(returnMessage) > 0)
