# -*- coding: utf-8 -*-

from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
from django.utils.unittest import skip
from django.http import HttpRequest
from django.contrib.auth import authenticate

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
        self.request.user = authenticate(username=self.request.POST['login'], password=self.request.POST['password'])

    def tearDown(self):
        pass

    @skip("Test is not ready")
    def test_protomenu(self):
        pass
