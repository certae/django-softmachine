# -*- coding: utf-8 -*-

from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
from django.utils.unittest import skip
from django.http import HttpRequest
from django.contrib.auth import authenticate

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

    def tearDown(self):
        pass

    @skip("Test is not ready")
    def test_protogetpci(self):
        pass


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
