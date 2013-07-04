# -*- coding: utf-8 -*-

from pprint import pprint
from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
from django.utils.unittest import skip
from django.http import HttpRequest
from django.contrib.auth import authenticate
import django.utils.simplejson as json

from protoLib.protoGetPci import protoGetPCI, protoSaveProtoObj, protoGetFieldTree


def ProtoGetPciTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(ProtoGetPciTest, 'test'))
    suite.addTest(makeSuite(ProtoSaveProtoObjTest, 'test'))
    suite.addTest(makeSuite(ProtoGetFieldTreeTest, 'test'))

    return suite


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

    def tearDown(self):
        pass

    @skip("Test is not ready")
    def test_protosaveprotoobj(self):
        pass


class ProtoGetFieldTreeTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        self.request = HttpRequest()
        self.request.method = 'POST'
        self.request.POST['login'] = 'adube'
        self.request.POST['password'] = '123'
        self.request.user = authenticate(username=self.request.POST['login'], password=self.request.POST['password'])

    def tearDown(self):
        pass

    @skip("Test is not ready")
    def test_protogetfieldtree(self):
        pass
