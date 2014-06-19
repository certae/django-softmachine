# -*- coding: utf-8 -*-

import random

from django.test import TestCase

from prototype.actions.viewDefinition import getViewDefinition, slugify, getViewCode, property2Field, getFkId, GetProtoFieldsTree, GetDetailsConfigTree

from alltests.testPrototype.Utils import random_string_generator
from alltests.testPrototype.testmodels.TestUtilities import createTestEntity
from alltests.testPrototype.testmodels.TestUtilities import createTestRelationship


class GetViewDefinitionTest(TestCase):
    def setUp(self):
        self.pEntity = createTestEntity()
        self.testRelationShip = createTestRelationship()
        self.testRelationShip.refEntity = createTestEntity()
        self.testRelationShip.code = 'GVD_TestCode'
        self.testRelationShip.entity = self.pEntity
        self.testRelationShip.save()

    def test_GetViewDefinition_gridconfig_and_basefilter(self):
        infoEntity = getViewDefinition(self.pEntity, 'someViewTitle')
        self.assertEqual(infoEntity['gridConfig']['baseFilter'], [{'property': 'entity', 'filterStmt':  '=' + str(self.pEntity.id)}])

    def test_GetViewDefinition_IsForeignTrue(self):
        self.testRelationShip.isForeign = True
        self.testRelationShip.save()

        self.assertTrue(self.pEntity.property_set.get(isForeign=True).isForeign)

        infoEntity = getViewDefinition(self.pEntity, 'someViewTitle')
        self.assertEqual(infoEntity['fields'][-2]['type'], 'foreigntext')

    def test_GetViewDefinition_IsEssentialTrue(self):
        self.testRelationShip.isEssential = True
        self.testRelationShip.save()

        #self.assertTrue(self.pEntity.property_set.get(isEssential=True).isEssential)

        infoEntity = getViewDefinition(self.pEntity, 'someViewTitle')
        self.assertEqual(''.join(infoEntity['gridConfig']['listDisplay']), 'info__' + slugify(self.testRelationShip.code))
    
    def test_GetViewDefinition_IsPrimaryTrue(self):
        self.testRelationShip.isPrimary = True
        self.testRelationShip.save()

        self.assertTrue(self.pEntity.property_set.get(isPrimary=True).isPrimary)

        infoEntity = getViewDefinition(self.pEntity, 'someViewTitle')
        self.assertEqual(infoEntity['fields'][-1]['physicalName'], '@myStr("info__' + slugify(self.testRelationShip.code) + '")')

    def test_GetViewCode_AnyCombination(self):
        infoEntity = getViewDefinition(self.pEntity, 'someViewTitle')
        self.assertEqual(infoEntity['gridConfig']['sortFields'][-1], '__str__')


class GetViewCodeTest(TestCase):
    def setUp(self):
        self.pEntity = createTestEntity()

    def test_GetViewCode_with_viewtitle_none(self):
        viewCode = getViewCode(self.pEntity)
        self.assertEqual(viewCode, slugify(self.pEntity.model.code + '-' + self.pEntity.code))

    def test_GetViewCode_with_viewtitle_not_none(self):
        viewTitle = random_string_generator(5)
        viewCode = getViewCode(self.pEntity, viewTitle)
        self.assertEqual(viewCode, slugify(self.pEntity.model.code + '-' + viewTitle))


class Property2FieldTest(TestCase):
    def setUp(self):
        self.fName = random_string_generator(5)
        self.fBase = random_string_generator(5)

    def test_Property2Field_with_nonempty_arguments(self):
        self.propDict = {
            'code': self.fName,
            'isReadOnly': True,
            'isPrimary': True,
            'isRequired': True,
            'description': random_string_generator(5),
            'vType': random_string_generator(5),
            'baseType': random_string_generator(5),
            'prpChoices': random_string_generator(5),
            'prpDefault': random_string_generator(5),
            'prpLength': random.randrange(0, 10),
            'prpScale': random.randrange(0, 10),
            'crudType': random_string_generator(5)
        }

        self.infoField = True

        testField = property2Field(self.fName, self.propDict, self.infoField, self.fBase)

        self.assertEqual(testField['name'], self.fName)
        self.assertEqual(testField['header'], self.propDict['code'])
        self.assertEqual(testField['id'], self.fBase + '__' + self.fName)
        self.assertEqual(testField['text'], self.fName)

    def test_Property2Field_with_empty_arguments(self):
        self.propDict = dict([])

        testField = property2Field(self.fName, self.propDict)

        self.assertEqual(testField['name'], self.fName)
        self.assertEqual(testField['header'], self.fName)


class GetFkIdTest(TestCase):
    def setUp(self):
        self.name = random_string_generator(5)
        self.base = random_string_generator(5)

    def test_GetFkId_InfoField_Any(self):
        fields = getFkId(self.name)
        self.assertEqual(fields['fkField'], self.name + '_id')
        self.assertEqual(fields['name'], self.name + '_id')

    def test_GetFkId_InfoField_True(self):
        fields = getFkId(self.name, True, self.base)
        self.assertEqual(fields['id'], self.base + self.name + '_id')

    def test_GetFkId_InfoField_False(self):
        fields = getFkId(self.name, False, self.base)
        self.assertNotIn('id', fields)


class GetProtoFieldsTreeTest(TestCase):
    def setUp(self):
        self.pEntity = createTestEntity()

    def test_GetProtoFieldsTree_Valid(self):
        returnMessage = GetProtoFieldsTree(1)
        self.assertTrue(len(returnMessage) > 0)

    def test_GetProtoFieldsTree_Invalid(self):
        returnMessage = GetProtoFieldsTree(2)
        self.assertTrue(len(returnMessage) is 0)


class GetDetailsConfigTreeTest(TestCase):
    def test_GetDetailsConfigTree_Empty(self):
        self.assertEqual(len(GetDetailsConfigTree(1)), 0)

    def test_GetDetailsConfigTree_SingleEntry(self):
        testRelationShip = createTestRelationship()
        testRelationShip.save()

        self.assertEqual(len(GetDetailsConfigTree(1)), 1)

# TODO  Do not delete 
# class addProtoFieldToListTest(TestCase):
#     def setUp(self):
#         self.testRelationShip = createTestRelationship()
#         self.testRelationShip.isForeign = True
#         self.testRelationShip.save()
#  
#     def tearDown(self):
#         self.testRelationShip.delete()
 
#     @skip('Must redefine testRelationShip')
#     def test_addprotoFieldToList_non_empty_fieldbase(self):
#         fieldList = []
#         pEntity = Entity.objects.all()[0]
#  
#         pprint(dir(pEntity.property_set))
#         #pprint(dir(pEntity))
#  
#         self.assertTrue(len(pEntity.property_set.all()) > 0)
#  
#         for pProperty in pEntity.property_set.all():
#             self.assertTrue(pProperty.isForeign)
#  
#         addProtoFieldToList(fieldList, pEntity, 'anyString', '')
#         self.assertNotEqual(fieldList, [])
# 
#     @skip('Currently debugging other test')
#     def test_addprotoFieldToList_empty_fieldbase(self):
#         fieldList = []
#         pEntity = Entity.objects.get(id=1)
# 
#         self.assertTrue(len(pEntity.property_set.all()) > 0)
# 
#         for pProperty in pEntity.property_set.all():
#             self.assertTrue(pProperty.isForeign)
# 
#         addProtoFieldToList(fieldList, pEntity, '', '')
#         self.assertNotEqual(fieldList, [])
