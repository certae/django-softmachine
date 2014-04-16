# -*- coding: utf-8 -*-

import re, os
from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
import json

#from prototype.models import *
from protoLib.models import *

PossibleTypes = ['list', 'string']
module_dir = os.path.dirname(__file__)  # get current directory
file_path = os.path.join(module_dir, 'MetaObjects.dat')
MetaObjects = json.loads(open(file_path).read())
file_path = os.path.join(module_dir, 'MetaProperties.dat')
MetaProperties = json.loads(open(file_path).read())

DataTypes = dict()
for fields in MetaProperties:
    if '.type' in fields:
        type = MetaProperties[fields]
        field = re.sub(r'\.type$', '', fields)
        DataTypes[field] = type


def getFields(modelclass):
    fields = []
    for value in modelclass.protoExt:
        fields.append(value)
        
    return fields


def getObjectType(field, value):
    type = None
    if 'lists' in MetaObjects[field] and value in MetaObjects[field]['lists']:
        type = 'list'
    elif 'properties' in MetaObjects[field] and value in MetaObjects[field]['properties']:
        type = DataTypes[value]

    return type


def getFieldType(field, value, modelclass):
    type = None
    if field in MetaObjects['pcl']['lists']:
        type = 'list'
    elif field in MetaObjects['pcl']['properties']:
        type = DataTypes[value]
    elif field in MetaObjects['pcl']['objects']:
        type = getObjectType(field, value)

    if type is None:
        type = 'string'
    return type



class TeamHierarchyPropertiesTest(TestCase):
    def test_structure(self):
        fields = getFields(TeamHierarchy)
        for field in fields:
            for value in TeamHierarchy.protoExt[field]:
                fieldtype = getFieldType(field, value, TeamHierarchy)
                self.assertIn(fieldtype, PossibleTypes)


class ProtoDefinitionPropertiesTest(TestCase):
    def test_structure(self):
        fields = getFields(ProtoDefinition)
        for field in fields:
            for value in ProtoDefinition.protoExt[field]:
                fieldtype = getFieldType(field, value, ProtoDefinition)
                self.assertIn(fieldtype, PossibleTypes)


class CustomDefinitionPropertiesTest(TestCase):
    def test_structure(self):
        fields = getFields(CustomDefinition)
        for field in fields:
            for value in CustomDefinition.protoExt[field]:
                fieldtype = getFieldType(field, value, CustomDefinition)
                self.assertIn(fieldtype, PossibleTypes)


class DiscreteValuePropertiesTest(TestCase):
    def test_structure(self):
        fields = getFields(DiscreteValue)
        for field in fields:
            for value in DiscreteValue.protoExt[field]:
                fieldtype = getFieldType(field, value, DiscreteValue)
                self.assertIn(fieldtype, PossibleTypes)