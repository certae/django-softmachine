# -*- coding: utf-8 -*-

from pprint import pprint
from django.test import TestCase
import django.utils.simplejson as json


class ProjectPropertiesTest(TestCase):
    def setUp(self):
        self.MetaProperties = json.loads(open('src/testMetaDefinitions/MetaProperties.dat').read())

    def test_field_and_value(self):
        #self.assertTrue(checkAllFields(Project, self.MetaObjects))
        pprint(self.MetaProperties)
