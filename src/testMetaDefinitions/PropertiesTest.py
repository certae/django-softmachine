# -*- coding: utf-8 -*-

from pprint import pprint
import re
from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
import django.utils.simplejson as json

from prototype.models import *


def PropertiesTestSuite():
    suite = TestSuite()
    suite.addTest(makeSuite(ProjectPropertiesTest, 'test'))
    suite.addTest(makeSuite(ModelPropertiesTest, 'test'))
    suite.addTest(makeSuite(EntityPropertiesTest, 'test'))
    suite.addTest(makeSuite(PropertyPropertiesTest, 'test'))
    suite.addTest(makeSuite(RelationshipPropertiesTest, 'test'))
    suite.addTest(makeSuite(PropertyModelPropertiesTest, 'test'))
    suite.addTest(makeSuite(PropertyEquivalencePropertiesTest, 'test'))
    suite.addTest(makeSuite(PrototypePropertiesTest, 'test'))
    suite.addTest(makeSuite(ProtoTablePropertiesTest, 'test'))
    return suite


def getFields(modelclass):
    fields = []
    for value in modelclass.protoExt:
            fields.append(value)
    return fields


def getFieldType(field, modelclass, metaobjects, metaproperties):
    if field in metaobjects['pcl']['lists']:
        return 'list'
    elif field in metaobjects['pcl']['properties']:
        if field in metaproperties:
            print('MetaProperty : ')
            print(metaproperties['field'])
        return 'property'
    elif field in metaobjects['pcl']['objects']:
        if 'properties' in metaobjects[field]:
            object_properties = metaobjects[field]['properties']
            for values in object_properties:
                if values in modelclass.protoExt[field]:
                    return 'property'

        if 'lists' in metaobjects[field]:
            object_lists = metaobjects[field]['lists']
            for values in object_lists:
                if values in modelclass.protoExt[field]:
                    return 'list'

        if 'objects' in metaobjects[field]:
            object_objects = metaobjects[field]['objects']
            for values in object_objects:
                if values in modelclass.protoExt[field]:
                    return None


class ProjectPropertiesTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

        MetaProperties = json.loads(open('src/testMetaDefinitions/MetaProperties.dat').read())
        self.datatypes = dict()

        for fields in MetaProperties:
            if '.type' in fields:
                type = MetaProperties[fields]
                field = re.sub(r'\.type$', '', fields)
                self.datatypes[field] = type

    def test_structure(self):
        fields = getFields(Project)
        for field in fields:
            fieldtype = getFieldType(field, Project, self.MetaObjects, self.datatypes)
            self.assertIn(fieldtype, ['list'])


class ModelPropertiesTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

        MetaProperties = json.loads(open('src/testMetaDefinitions/MetaProperties.dat').read())
        self.datatypes = dict()

        for fields in MetaProperties:
            if '.type' in fields:
                type = MetaProperties[fields]
                field = re.sub(r'\.type$', '', fields)
                self.datatypes[field] = type

    def test_structure(self):
        fields = getFields(Model)
        for field in fields:
            fieldtype = getFieldType(field, Project, self.MetaObjects, self.datatypes)
            self.assertIn(fieldtype, ['list'])


class EntityPropertiesTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

        MetaProperties = json.loads(open('src/testMetaDefinitions/MetaProperties.dat').read())
        self.datatypes = dict()

        for fields in MetaProperties:
            if '.type' in fields:
                type = MetaProperties[fields]
                field = re.sub(r'\.type$', '', fields)
                self.datatypes[field] = type

    def test_structure(self):
        fields = getFields(Entity)
        for field in fields:
            fieldtype = getFieldType(field, Project, self.MetaObjects, self.datatypes)
            self.assertIn(fieldtype, ['list'])


class PropertyPropertiesTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

        MetaProperties = json.loads(open('src/testMetaDefinitions/MetaProperties.dat').read())
        self.datatypes = dict()

        for fields in MetaProperties:
            if '.type' in fields:
                type = MetaProperties[fields]
                field = re.sub(r'\.type$', '', fields)
                self.datatypes[field] = type

    def test_structure(self):
        fields = getFields(Property)
        for field in fields:
            fieldtype = getFieldType(field, Project, self.MetaObjects, self.datatypes)
            self.assertIn(fieldtype, ['list'])


class RelationshipPropertiesTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

        MetaProperties = json.loads(open('src/testMetaDefinitions/MetaProperties.dat').read())
        self.datatypes = dict()

        for fields in MetaProperties:
            if '.type' in fields:
                type = MetaProperties[fields]
                field = re.sub(r'\.type$', '', fields)
                self.datatypes[field] = type

    def test_structure(self):
        fields = getFields(Relationship)
        for field in fields:
            if field is 'exclude':
                continue
            fieldtype = getFieldType(field, Project, self.MetaObjects, self.datatypes)
            self.assertIn(fieldtype, ['list'])


class PropertyModelPropertiesTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

        MetaProperties = json.loads(open('src/testMetaDefinitions/MetaProperties.dat').read())
        self.datatypes = dict()

        for fields in MetaProperties:
            if '.type' in fields:
                type = MetaProperties[fields]
                field = re.sub(r'\.type$', '', fields)
                self.datatypes[field] = type

    def test_structure(self):
        fields = getFields(PropertyModel)
        for field in fields:
            fieldtype = getFieldType(field, Project, self.MetaObjects, self.datatypes)
            self.assertIn(fieldtype, ['list'])


class PropertyEquivalencePropertiesTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

        MetaProperties = json.loads(open('src/testMetaDefinitions/MetaProperties.dat').read())
        self.datatypes = dict()

        for fields in MetaProperties:
            if '.type' in fields:
                type = MetaProperties[fields]
                field = re.sub(r'\.type$', '', fields)
                self.datatypes[field] = type

    def test_structure(self):
        fields = getFields(PropertyEquivalence)
        for field in fields:
            fieldtype = getFieldType(field, Project, self.MetaObjects, self.datatypes)
            self.assertIn(fieldtype, ['list'])


class PrototypePropertiesTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

        MetaProperties = json.loads(open('src/testMetaDefinitions/MetaProperties.dat').read())
        self.datatypes = dict()

        for fields in MetaProperties:
            if '.type' in fields:
                type = MetaProperties[fields]
                field = re.sub(r'\.type$', '', fields)
                self.datatypes[field] = type

    def test_structure(self):
        fields = getFields(Prototype)
        for field in fields:
            fieldtype = getFieldType(field, Project, self.MetaObjects, self.datatypes)
            self.assertIn(fieldtype, ['list'])


class ProtoTablePropertiesTest(TestCase):
    def setUp(self):
        self.MetaObjects = json.loads(open('src/testMetaDefinitions/MetaObjects.dat').read())

        MetaProperties = json.loads(open('src/testMetaDefinitions/MetaProperties.dat').read())
        self.datatypes = dict()

        for fields in MetaProperties:
            if '.type' in fields:
                type = MetaProperties[fields]
                field = re.sub(r'\.type$', '', fields)
                self.datatypes[field] = type

    def test_structure(self):
        fields = getFields(ProtoTable)
        for field in fields:
            fieldtype = getFieldType(field, Project, self.MetaObjects, self.datatypes)
            self.assertIn(fieldtype, ['list'])
