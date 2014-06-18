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

# ------------------

from prototype.models import Project, Model, Entity, Property, Relationship, PropertyEquivalence, ProtoTable, Prototype


class ProjectPropertiesTest(TestCase):
    def test_structure(self):
        fields = getFields(Project)
        for field in fields:
            for value in Project.protoExt[field]:
                fieldtype = getFieldType(field, value, Project)
                self.assertIn(fieldtype, PossibleTypes)


class ModelPropertiesTest(TestCase):
    def test_structure(self):
        fields = getFields(Model)
        for field in fields:
            for value in Model.protoExt[field]:
                fieldtype = getFieldType(field, value, Model)
                self.assertIn(fieldtype, PossibleTypes)


class EntityPropertiesTest(TestCase):
    def test_structure(self):
        fields = getFields(Entity)
        for field in fields:
            for value in Entity.protoExt[field]:
                fieldtype = getFieldType(field, value, Entity)
                self.assertIn(fieldtype, PossibleTypes)


class PropertyPropertiesTest(TestCase):
    def test_structure(self):
        fields = getFields(Property)
        for field in fields:
            for value in Property.protoExt[field]:
                fieldtype = getFieldType(field, value, Property)
                self.assertIn(fieldtype, PossibleTypes)


class RelationshipPropertiesTest(TestCase):
    def test_structure(self):
        fields = getFields(Relationship)
        for field in fields:
            if field is 'exclude':
                continue
            for value in Relationship.protoExt[field]:
                fieldtype = getFieldType(field, value, Relationship)
                self.assertIn(fieldtype, PossibleTypes)



class PropertyEquivalencePropertiesTest(TestCase):
    def test_structure(self):
        fields = getFields(PropertyEquivalence)
        for field in fields:
            for value in PropertyEquivalence.protoExt[field]:
                fieldtype = getFieldType(field, value, PropertyEquivalence)
                self.assertIn(fieldtype, PossibleTypes)


class PrototypePropertiesTest(TestCase):
    def test_structure(self):
        fields = getFields(Prototype)
        for field in fields:
            for value in Prototype.protoExt[field]:
                fieldtype = getFieldType(field, value, Prototype)
                self.assertIn(fieldtype, PossibleTypes)


class ProtoTablePropertiesTest(TestCase):
    def test_structure(self):
        fields = getFields(ProtoTable)
        for field in fields:
            for value in ProtoTable.protoExt[field]:
                fieldtype = getFieldType(field, value, ProtoTable)
                self.assertIn(fieldtype, PossibleTypes)




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