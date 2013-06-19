# -*- coding: utf-8 -*-

from pprint import pprint
from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite


def MetaDefinitionsTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(MetaDefinitionsTest, 'test'))

    return suite


class MetaDefinitionsTest(TestCase):
    #fixtures = ['prototype.json']

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_some_property(self):
        pass
