# -*- coding: utf-8 -*-

from pprint import pprint
from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
from django.http import HttpRequest
from django.contrib.auth import authenticate
import django.utils.simplejson as json

from protoLib.protoGetDetails import protoGetDetailsTree


def ProtoGetDetailsTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(ProtoGetDetailsTreeTest, 'test'))

    return suite


class ProtoGetDetailsTreeTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        self.request = HttpRequest()
        self.request.method = 'POST'
        self.request.POST['login'] = 'adube'
        self.request.POST['password'] = '123'
        self.request.user = authenticate(username=self.request.POST['login'], password=self.request.POST['password'])
        self.request.POST['viewCode'] = 'prototype.Project'
        self.request.POST['id'] = 'root'
        self.request.POST['node'] = 'root'

    def tearDown(self):
        pass

    def test_protogetdetailstree(self):
        response = json.loads(protoGetDetailsTree(self.request).content)
        self.assertEqual(response[0]['id'], 'Model.project')