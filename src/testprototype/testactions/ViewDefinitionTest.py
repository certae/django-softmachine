# -*- coding: utf-8 -*-

import random
from django.test import TestCase

from protoLib.utilsBase import slugify
from prototype.actions.viewDefinition import getViewCode
from prototype.actions.viewDefinition import property2Field
from Utils import random_string_generator
from Utils import pEntityForTest


class GetViewCodeTest(TestCase):
    def setUp(self):
        self.pEntity = pEntityForTest()

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
