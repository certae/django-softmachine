# -*- coding: utf-8 -*-

import random
from django.test import TestCase

from pprint import pprint

from protoLib.utilsBase import slugify
from prototype.actions.viewDefinition import getViewCode
from prototype.actions.viewDefinition import property2Field
from prototype.actions.viewDefinition import getViewDefinition
from testprototype.Utils import random_string_generator
from testprototype.testmodels.TestUtilities import createTestEntity


class GetViewDefinitionTest(TestCase):
    def setUp(self):
        self.pEntity = createTestEntity()
        self.infoEntity = getViewDefinition(self.pEntity, 'someViewTitle')

    def test_GetViewDefinition_returns_valid_gridconfig_and_basefilter_values(self):
        self.assertEqual(self.infoEntity['gridConfig']['baseFilter'], [{'property': 'entity', 'filterStmt':  '=' + str(self.pEntity.id)}])

    def test_GetViewDefinition_returns_valid_fields_values(self):
        pass
        #print(self.infoEntity)
        #print('\n')
        #print('fields 0')
        #print(self.infoEntity['fields'][0])
        #print('fields 1')
        #print(self.infoEntity['fields'][1])
        #print('fields 2')
        #print(self.infoEntity['fields'][2])
        #print('fields 3')
        #print(self.infoEntity['fields'][3])
        #print('fields 4')
        #print(self.infoEntity['fields'][4])
        #print('fields 5')
        #print(self.infoEntity['fields'][5])
        #print('fields 6')
        #print(self.infoEntity['fields'][6])
        #print('fields 7')
        #print(self.infoEntity['fields'][7])
        #print('\n')
        #print('gridConfig, listDisplay')
        #print(self.infoEntity['gridConfig']['listDisplay'])
        #print('gridConfig, sortFields')
        #print(self.infoEntity['gridConfig']['sortFields'])
        #print('fromConfig, items, 0, items')
        #print(self.infoEntity['formConfig']['items'][0]['items'])
        #print('detailsConfig')
        #print(self.infoEntity['detailsConfig'])
        #print('\n')


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
