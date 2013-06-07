# -*- coding: utf-8 -*-

from pprint import pprint
from django.test import TestCase
import django.utils.simplejson as json

from prototype.models import *


def getFields(modelclass):
    fields = []
    for value in modelclass.protoExt:
            #print(value)
            fields.append(value)
    return fields


def getValue(modelclass, field):
        if type(modelclass.protoExt[field]) != list:
            for values in Project.protoExt[field]:
                return values
        else:
            for values in modelclass.protoExt[field][0]:
                return values


def validatePair(field, value, datatree):
    status = False
    for items in datatree['pcl']:
        if field in datatree['pcl'][items]:
            status = True
            break

    if field is 'exclude':
        return True

    if 'listOf' in datatree[field]:
        field = datatree[field]['listOf']

    if status is False:
        return False

    status = False
    if 'lists' in datatree[field] and value in datatree[field]['lists']:
        status = True
    elif 'properties' in datatree[field] and value in datatree[field]['properties']:
        status = True

    return status


def checkAllFields(modelclass, datatree):
    fields = getFields(modelclass)

    for index in range(0, len(fields)):
        value = getValue(modelclass, fields[index])
        if validatePair(fields[index], value, datatree) is False:
            return False

    return True


class ProjectStructureTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

    def test_field_and_value(self):
        self.assertTrue(checkAllFields(Project, self.MetaObjects))


class ModelStructureTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

    def test_field_and_value(self):
        self.assertTrue(checkAllFields(Model, self.MetaObjects))


class EntityStructureTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

    def test_field_and_value(self):
        self.assertTrue(checkAllFields(Entity, self.MetaObjects))


class PropertyStructureTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

    def test_field_and_value(self):
        self.assertTrue(checkAllFields(Property, self.MetaObjects))


class RelationshipStructureTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

    def test_field_and_value(self):
        self.assertTrue(checkAllFields(Relationship, self.MetaObjects))


class PropertyModelStructureTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

    def test_field_and_value(self):
        self.assertTrue(checkAllFields(PropertyModel, self.MetaObjects))


class PropertyEquivalenceStructureTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

    def test_field_and_value(self):
        self.assertTrue(checkAllFields(PropertyEquivalence, self.MetaObjects))


class PrototypeStructureTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

    def test_field_and_value(self):
        self.assertTrue(checkAllFields(Prototype, self.MetaObjects))


class ProtoTableStructureTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

    def test_field_and_value(self):
        self.assertTrue(checkAllFields(ProtoTable, self.MetaObjects))


class DiagramStructureTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

    def test_field_and_value(self):
        self.assertTrue(checkAllFields(Diagram, self.MetaObjects))


class DiagramEntityStructureTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

    def test_field_and_value(self):
        self.assertTrue(checkAllFields(DiagramEntity, self.MetaObjects))


class ServiceStructureTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

    def test_field_and_value(self):
        self.assertTrue(checkAllFields(Service, self.MetaObjects))


class ServiceRefStructureTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

    def test_field_and_value(self):
        self.assertTrue(checkAllFields(ServiceRef, self.MetaObjects))
