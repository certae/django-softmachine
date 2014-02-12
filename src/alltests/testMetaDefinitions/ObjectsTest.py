# -*- coding: utf-8 -*-

from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
import json

from prototype.models import *
from protoLib.models import *

def StructureTestSuite():
    suite = TestSuite()
    suite.addTest(makeSuite(ProjectStructureTest, 'test'))
    suite.addTest(makeSuite(ModelStructureTest, 'test'))
    suite.addTest(makeSuite(EntityStructureTest, 'test'))
    suite.addTest(makeSuite(PropertyStructureTest, 'test'))
    suite.addTest(makeSuite(RelationshipStructureTest, 'test'))
    suite.addTest(makeSuite(PropertyModelStructureTest, 'test'))
    suite.addTest(makeSuite(PropertyEquivalenceStructureTest, 'test'))
    suite.addTest(makeSuite(PrototypeStructureTest, 'test'))
    suite.addTest(makeSuite(ProtoTableStructureTest, 'test'))

    suite.addTest(makeSuite(TeamHierarchyStructureTest, 'test'))
    suite.addTest(makeSuite(ProtoDefinitionStructureTest, 'test'))
    suite.addTest(makeSuite(CustomDefinitionStructureTest, 'test'))
    suite.addTest(makeSuite(DiscreteValueStructureTest, 'test'))

    return suite


#DataTree = json.loads(open(PPATH + '/src/testMetaDefinitions/MetaObjects.dat').read())
import os
module_dir = os.path.dirname(__file__)  # get current directory
file_path = os.path.join(module_dir, 'MetaObjects.dat')
DataTree = json.loads(open(file_path).read())


def getFields(modelclass):
    fields = []
    for value in modelclass.protoExt:
            #print(value)
            fields.append(value)
    return fields


def getValue(modelclass, field):
        if type(modelclass.protoExt[field]) != list:
            for values in modelclass.protoExt[field]:
                return values
        else:
            for values in modelclass.protoExt[field][0]:
                return values


def validatePair(field, value):
    status = False
    for items in DataTree['pcl']:
        if field in DataTree['pcl'][items]:
            status = True
            break

    if field is 'exclude':
        return True

    if status is False:
        return False

    if 'listOf' in DataTree[field]:
        field = DataTree[field]['listOf']

    status = False
    if 'lists' in DataTree[field] and value in DataTree[field]['lists']:
        status = True
    elif 'properties' in DataTree[field] and value in DataTree[field]['properties']:
        status = True

    return status


def checkAllFields(modelclass):
    fields = getFields(modelclass)

    for index in range(0, len(fields)):
        value = getValue(modelclass, fields[index])
        if validatePair(fields[index], value) is False:
            return False

    return True


class ProjectStructureTest(TestCase):
    def test_field_and_value(self):
        self.assertTrue(checkAllFields(Project))


class ModelStructureTest(TestCase):
    def test_field_and_value(self):
        self.assertTrue(checkAllFields(Model))


class EntityStructureTest(TestCase):
    def test_field_and_value(self):
        self.assertTrue(checkAllFields(Entity))


class PropertyStructureTest(TestCase):
    def test_field_and_value(self):
        self.assertTrue(checkAllFields(Property))


class RelationshipStructureTest(TestCase):
    def test_field_and_value(self):
        self.assertTrue(checkAllFields(Relationship))


class PropertyModelStructureTest(TestCase):
    def test_field_and_value(self):
        self.assertTrue(checkAllFields(PropertyModel))


class PropertyEquivalenceStructureTest(TestCase):
    def test_field_and_value(self):
        self.assertTrue(checkAllFields(PropertyEquivalence))


class PrototypeStructureTest(TestCase):
    def test_field_and_value(self):
        self.assertTrue(checkAllFields(Prototype))


class ProtoTableStructureTest(TestCase):
    def test_field_and_value(self):
        self.assertTrue(checkAllFields(ProtoTable))


class TeamHierarchyStructureTest(TestCase):
    def test_field_and_value(self):
        self.assertFalse(checkAllFields(TeamHierarchy))  # Value is not in MetaObjects


class ProtoDefinitionStructureTest(TestCase):
    def test_field_and_value(self):
        self.assertTrue(checkAllFields(ProtoDefinition))


class CustomDefinitionStructureTest(TestCase):
    def test_field_and_value(self):
        self.assertTrue(checkAllFields(CustomDefinition))


class DiscreteValueStructureTest(TestCase):
    def test_field_and_value(self):
        self.assertTrue(checkAllFields(DiscreteValue))
