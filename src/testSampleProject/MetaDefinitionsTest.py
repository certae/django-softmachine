# -*- coding: utf-8 -*-

from pprint import pprint
from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite

from prototype.models import *


def MetaDefinitionsTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(MetaDefinitionsTest, 'test'))

    return suite


class MetaDefinitionsTest(TestCase):
    fixtures = ['auth.json', 'protoLib.json', 'prototype.json']

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_project_meta(self):
        for entry in Project.objects.all():
            pprint(entry.protoExt)

    def test_model_meta(self):
        for entry in Model.objects.all():
            pprint(entry.protoExt)

    def test_entity_meta(self):
        for entry in Entity.objects.all():
            pprint(entry.protoExt)

    def test_property_meta(self):
        for entry in Property.objects.all():
            pprint(entry.protoExt)

    def test_relationship_meta(self):
        for entry in Relationship.objects.all():
            pprint(entry.protoExt)

    def test_propertymodel_meta(self):
        for entry in PropertyModel.objects.all():
            pprint(entry.protoExt)

    def test_propertyequivalence_meta(self):
        for entry in PropertyEquivalence.objects.all():
            pprint(entry.protoExt)

    def test_prototype_meta(self):
        for entry in Prototype.objects.all():
            pprint(entry.protoExt)

    def test_prototable_meta(self):
        for entry in ProtoTable.objects.all():
            pprint(entry.protoExt)

    def test_diagram_meta(self):
        for entry in Diagram.objects.all():
            pprint(entry.protoExt)

    def test_diagramentity_meta(self):
        for entry in DiagramEntity.objects.all():
            pprint(entry.protoExt)

    def test_service_meta(self):
        for entry in Service.objects.all():
            pprint(entry.protoExt)

    def test_serviceref_meta(self):
        for entry in ServiceRef.objects.all():
            pprint(entry.protoExt)
