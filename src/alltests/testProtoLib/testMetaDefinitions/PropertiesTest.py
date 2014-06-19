# -*- coding: utf-8 -*-

import re, os
from django.test import TestCase
import json

from protoLib.models import TeamHierarchy, ProtoDefinition, CustomDefinition, DiscreteValue

PossibleTypes = ['list', 'string']
module_dir = os.path.dirname(__file__)  # get current directory
file_path = os.path.join(module_dir, 'MetaObjects.dat')
MetaObjects = json.loads(open(file_path).read())
file_path = os.path.join(module_dir, 'MetaProperties.dat')
MetaProperties = json.loads(open(file_path).read())

DataTypes = dict()
for fields in MetaProperties:
    if '.type' in fields:
        outcomeType = MetaProperties[fields]
        field = re.sub(r'\.type$', '', fields)
        DataTypes[field] = outcomeType


def getFields(modelclass):
    fields = []
    for value in modelclass.protoExt:
        fields.append(value)
        
    return fields


def getObjectType(field, value):
    outcomeType = None
    if 'lists' in MetaObjects[field] and value in MetaObjects[field]['lists']:
        outcomeType = 'list'
    elif 'properties' in MetaObjects[field] and value in MetaObjects[field]['properties']:
        outcomeType = DataTypes[value]

    return outcomeType


def getFieldType(field, value, modelclass):
    outcomeType = None
    if field in MetaObjects['pcl']['lists']:
        outcomeType = 'list'
    elif field in MetaObjects['pcl']['properties']:
        outcomeType = DataTypes[value]
    elif field in MetaObjects['pcl']['objects']:
        outcomeType = getObjectType(field, value)

    if outcomeType is None:
        outcomeType = 'string'
    return outcomeType



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