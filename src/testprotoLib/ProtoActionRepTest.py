# -*- coding: utf-8 -*-

from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
from django.http import HttpRequest
from django.contrib.auth import authenticate
import django.utils.simplejson as json

from protoLib.protoActionRep import sheetConfigRep


def ProtoActionRepTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(SheetConfigRepTest, 'test'))

    return suite


class SheetConfigRepTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        self.request = HttpRequest()
        self.request.method = 'POST'
        self.request.POST['login'] = 'adube'
        self.request.POST['password'] = '123'
        self.request.user = authenticate(username=self.request.POST['login'], password=self.request.POST['password'])
        #self.request.PPOST['viewCode'] =
        #self.request.PPOST['sheetName'] =
        #self.request.PPOST['selectedKeys'] =

    def tearDown(self):
        pass

    def test_sheetconfig(self):
        self.assertTrue(self.request.user.is_authenticated())
        response = sheetConfigRep(self.request)
