from django.test import TestCase
from prototype.models import *
from snippets.modelsService import *
from snippets.modelsPropModel import *


# class PropertyModelStructureTest(TestCase):
#     def test_field_and_value(self):
#         self.assertTrue(checkAllFields(PropertyModel))


# class PropertyModelPropertiesTest(TestCase):
#     def test_structure(self):
#         fields = getFields(PropertyModel)
#         for field in fields:
#             for value in PropertyModel.protoExt[field]:
#                 fieldtype = getFieldType(field, value, PropertyModel)
#                 self.assertIn(fieldtype, PossibleTypes)
        
def createTestProject():

    projectdata = {
        'code': 'testCode',
        'description': 'Project used for tests',
        'dbEngine': 'MySQL',
        'dbName': 'testDatabase',
        'dbUser': 'testdbUser',
        'dbPassword': 'testdbPassword',
        'dbHost': 'testlocalhost',
        'dbPort': 'testPort'
    }

    testProject = Project(**projectdata)
    testProject.save()

    return testProject

class LanguajeTest(TestCase):
    def setUp(self):
        languajedata = {
            'code': 'test_code',
            'alias': 'alias of languaje',
            'info': dict({'information': 'quelque chose'})
        }
        self.langaje = Languaje(**languajedata)
        self.langaje.save()

    def tearDown(self):
        self.langaje.delete()

    def test_verifying_string_representation(self):
        self.assertEqual(self.langaje.code + '.' + str(self.langaje.info), str(self.langaje))

       
def createTestPropertyBaseChild():
    propertyBaseChilddata = {
        'code' : 'testcode',
        'baseType' : 'testbaseType',
        'prpLength' : 15,
        'prpScale' : 12,
        'vType' : 'testvType',
        'prpDefault' : 'testprpDefault',
        'prpChoices' : 'testprpChoices',
        'isSensitive' : True,
        'description' : '',
        'notes' : ''
    }
    
    testProperty = PropertyBaseChild(**propertyBaseChilddata)
    testProperty.save()

    return testProperty


def createTestModel():
    testProject = createTestProject()
    testProject.save()

    modeldata = {
        'project': testProject,
        'code': 'testCode',
        'category': 'testCategory',
        'modelPrefix': 'testPrefix',
        'description': 'Model used for tests'
    }

    testModel = Model(**modeldata)
    testModel.save()

    return testModel

def createTestPropertyModel():
    testModel = createTestModel()
    testModel.save()

    propertymodeldata = {
        'model': testModel,
        'inherit': False,
        'conceptType': 'testConceptType',
        'isSensitive' : False
    }

    testPropertyModel = PropertyModel(**propertymodeldata)
    testPropertyModel.save()

    return testPropertyModel


def createTestService():
    testModel = createTestModel()
    testModel.save()

    servicedata = {
        'model': testModel,
        'code': 'testCode',
        'Binding': 'testBinding',
        'typeMessage': 'testMessage',
        'description': 'testDescription',
        'notes': 'testNotes'
    }

    testService = Service(**servicedata)
    testService.save()

    return testService


def createTestServiceRef():
    testModel = createTestModel()
    testModel.save()

    testService = createTestService()
    testService.save()

    servicerefdata = {
        'model': testModel,
        'service': testService,
        'endpoint': 'testEndPoint',
        'description': 'testDescription',
        'notes': 'testNotes'
    }

    testServiceRef = ServiceRef(**servicerefdata)
    testServiceRef.save()

    return testServiceRef