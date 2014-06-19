# -*- coding: utf-8 -*-

from django.test import TestCase
from django.http import HttpRequest
from django.contrib.auth import authenticate
import json

from protoLib.protoGetDetails import protoGetDetailsTree


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
