# -*- coding: utf-8 -*-

from pprint import pprint
from django.test import TestCase
import django.utils.simplejson as json

from prototype.models import Project


def validatePair(key, value):
    pass


class ProjectStructureTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())
        pprint(self.MetaObjects)

    def test_field_actions(self):
        pass
