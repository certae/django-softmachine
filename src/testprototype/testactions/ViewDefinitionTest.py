# -*- coding: utf-8 -*-

import random
from django.test import TestCase

from protoLib.utilsBase import slugify
from prototype.actions.viewDefinition import getViewCode
from prototype.actions.viewDefinition import property2Field
from prototype.actions.viewDefinition import getViewDefinition
from protoLib.utilsBase import slugify
from testprototype.Utils import random_string_generator
from testprototype.testmodels.TestUtilities import createTestEntity
from testprototype.testmodels.TestUtilities import createTestRelationship
from prototype.models import Property
from prototype.models import Entity


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

        self.assertTrue(self.pEntity.property_set.get(isEssential=True).isEssential)

        infoEntity = getViewDefinition(self.pEntity, 'someViewTitle')
        self.assertEqual(''.join(infoEntity['gridConfig']['listDisplay']), 'info__' + slugify(self.testRelationShip.code))

    def test_GetViewDefinition_IsPrimaryTrue(self):
        self.testRelationShip.isPrimary = True
        self.testRelationShip.save()

        self.assertTrue(self.pEntity.property_set.get(isPrimary=True).isPrimary)

        infoEntity = getViewDefinition(self.pEntity, 'someViewTitle')
        self.assertEqual(infoEntity['fields'][-1]['physicalName'], '@myStr("info__' + slugify(self.testRelationShip.code) + '")')

    def test_autre(self):
        print('Start')
        self.testRelationShip.isEssential = False
        self.testRelationShip.code = 'SomeVeryVeryLongCodeToTriggerConditionInProdCode'
        self.testRelationShip.save()
        infoEntity = getViewDefinition(self.pEntity, 'someViewTitle')
        print(infoEntity['gridConfig']['listDisplay'])
        print('End')

    def test_GetViewCode_AnyCombination(self):
        infoEntity = getViewDefinition(self.pEntity, 'someViewTitle')
        self.assertEqual(infoEntity['gridConfig']['sortFields'][-1], '__str__')


class GetViewCodeTest(TestCase):
    def setUp(self):
        pass
        self.pEntity = createTestEntity()

    def test_GetViewCode_with_viewtitle_none(self):
        viewCode = getViewCode(self.pEntity)
        self.assertEqual(viewCode, slugify(self.pEntity.model.code + '-' + self.pEntity.code))

    def test_GetViewCode_with_viewtitle_not_none(self):
        viewTitle = random_string_generator(5)
        viewCode = getViewCode(self.pEntity, viewTitle)
        self.assertEqual(viewCode, slugify(self.pEntity.model.code + '-' + viewTitle))


# fName, propDict, infoField=False, fBase=''
# Test with values. Another test with defaults
class Property2FieldTest(TestCase):
    def setUp(self):
        self.fName = random_string_generator(5)
        self.fBase = random_string_generator(5)

    def test_Property2Field_with_nonempty_arguments(self):
        self.propDict = dict(
            [
                ('code', self.fName),
                ('isReadOnly', True),
                ('isPrimary', True),
                ('isRequired', True),
                ('description', random_string_generator(5)),
                ('vType', random_string_generator(5)),
                ('baseType', random_string_generator(5)),
                ('prpChoices', random_string_generator(5)),
                ('prpDefault', random_string_generator(5)),
                ('prpLength', random.randrange(0, 10)),
                ('prpScale', random.randrange(0, 10)),
                ('crudType', random_string_generator(5))
            ]
        )
        self.infoField = True

        testField = property2Field(self.fName, self.propDict, self.infoField, self.fBase)

        self.assertEqual(testField['name'], self.fName)
        self.assertEqual(testField['header'], self.propDict['code'])
        self.assertEqual(testField['readOnly'], self.propDict['isReadOnly'])
        self.assertEqual(testField['primary'], self.propDict['isPrimary'])
        self.assertEqual(testField['required'], self.propDict['isRequired'])
        self.assertEqual(testField['tooltip'], self.propDict['description'])
        self.assertEqual(testField['vType'], self.propDict['vType'])
        self.assertEqual(testField['type'], self.propDict['baseType'])
        self.assertEqual(testField['choices'], self.propDict['prpChoices'])
        self.assertEqual(testField['prpDefault'], self.propDict['prpDefault'])
        self.assertEqual(testField['prpLength'], self.propDict['prpLength'])
        self.assertEqual(testField['prpScale'], self.propDict['prpScale'])
        self.assertEqual(testField['crudType'], self.propDict['crudType'])
        self.assertEqual(testField['id'], self.fBase + '__' + self.fName)
        self.assertEqual(testField['text'], self.fName)
        self.assertEqual(testField['leaf'], True)
        self.assertEqual(testField['checked'], False)

    def test_Property2Field_with_empty_arguments(self):
        self.propDict = dict([])

        testField = property2Field(self.fName, self.propDict)

        self.assertEqual(testField['name'], self.fName)
        self.assertEqual(testField['header'], self.fName)
        self.assertEqual(testField['readOnly'], False)
        self.assertEqual(testField['primary'], False)
        self.assertEqual(testField['required'], False)
        self.assertEqual(testField['tooltip'], '')
        self.assertEqual(testField['vType'], '')
        self.assertEqual(testField['type'], 'string')
        self.assertEqual(testField['choices'], '')
        self.assertEqual(testField['prpDefault'], '')
        self.assertEqual(testField['prpLength'], '')
        self.assertEqual(testField['prpScale'], '')
        self.assertEqual(testField['crudType'], '')
