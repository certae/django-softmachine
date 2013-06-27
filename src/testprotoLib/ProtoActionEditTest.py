# -*- coding: utf-8 -*-

from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
from django.utils.unittest import skip
from django.http import HttpRequest
from django.contrib.auth import authenticate

from protoLib.protoActionEdit import *


def ProtoActionEditTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(ProtoCreateTest, 'test'))
    suite.addTest(makeSuite(ProtoUpdateTest, 'test'))
    suite.addTest(makeSuite(ProtoDeleteTest, 'test'))

    return suite


class ProtoCreateTest(TestCase):
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
    def test_protocreate(self):
        #pass
        returnMessage = protoCreate(self.request)
        print(returnMessage)


class ProtoUpdateTest(TestCase):
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
    def test_protoupdate(self):
        pass


class ProtoDeleteTest(TestCase):
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
    def test_protodelete(self):
        pass
