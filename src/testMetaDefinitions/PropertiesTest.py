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


def getObjectType(field, value, metaobjects, metaproperties):
    type = None
    if 'lists' in metaobjects[field] and value in metaobjects[field]['lists']:
        type = 'list'
    elif 'properties' in metaobjects[field] and value in metaobjects[field]['properties']:
        type = metaproperties[value]

    return type


def getFieldType(field, value, modelclass, metaobjects, metaproperties):
    #value = modelclass.protoExt[field]
    #print(len(value))
    #for element in value:
        #value = element
        #break
    type = None
    if field in metaobjects['pcl']['lists']:
        type = 'list'
    elif field in metaobjects['pcl']['properties']:
        type = metaproperties[value]
    elif field in metaobjects['pcl']['objects']:
        type = getObjectType(field, value, metaobjects, metaproperties)
    return type


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
            for value in Project.protoExt[field]:
                fieldtype = getFieldType(field, value, Project, self.MetaObjects, self.datatypes)
                #print(fieldtype)
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
            for value in Model.protoExt[field]:
                fieldtype = getFieldType(field, value, Model, self.MetaObjects, self.datatypes)
                #print(fieldtype)
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
            for value in Entity.protoExt[field]:
                fieldtype = getFieldType(field, value, Entity, self.MetaObjects, self.datatypes)
                #print(fieldtype)
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
            for value in Property.protoExt[field]:
                fieldtype = getFieldType(field, value, Property, self.MetaObjects, self.datatypes)
                #print(fieldtype)
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
            for value in Relationship.protoExt[field]:
                fieldtype = getFieldType(field, value, Relationship, self.MetaObjects, self.datatypes)
                #print(fieldtype)
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
            for value in PropertyModel.protoExt[field]:
                fieldtype = getFieldType(field, value, PropertyModel, self.MetaObjects, self.datatypes)
                #print(fieldtype)
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
            for value in PropertyEquivalence.protoExt[field]:
                fieldtype = getFieldType(field, value, PropertyEquivalence, self.MetaObjects, self.datatypes)
                #print(fieldtype)
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
            for value in Prototype.protoExt[field]:
                fieldtype = getFieldType(field, value, Prototype, self.MetaObjects, self.datatypes)
                #print(fieldtype)
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
            for value in ProtoTable.protoExt[field]:
                fieldtype = getFieldType(field, value, ProtoTable, self.MetaObjects, self.datatypes)
                #print(fieldtype)
                self.assertIn(fieldtype, ['list'])
