# -*- coding: utf-8 -*-

from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
from prototype.models import Project
from prototype.models import PropertyModel
from prototype.models import Model
from prototype.models import Entity
from prototype.protoRules import updatePropInfo


def protoRulesTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(UpdatePropInfoTest, 'test'))

    return suite


class UpdatePropInfoTest(TestCase):
    def setUp(self):
        project_values = {
            'code': 'projectCode'
        }
        testProject = Project(**project_values)
        testProject.save()

        model_values = {
            'project': testProject
        }
        testModel = Model(**model_values)
        testModel.save()

        entity_values = {
            'code': 'thisEntity',
            'model': testModel
        }
        testEntity = Entity(**entity_values)
        testEntity.save()

        refEntity_values = {
            'code': 'thisRefEntity',
            'model': testModel
        }
        testRefEntity = Entity(**refEntity_values)
        testRefEntity.save()

        propertymodel_values = {
            'model': testModel,
            'baseType': 'valueInPropertyModel',
            'isSensitive' : True
        }
        
        self.myBase = PropertyModel(**propertymodel_values)
        self.myBase.save()
        
    #@skip('à faire')
    def test_PropertyModel_isForeign_false_inherit_True(self):
        updatePropInfo(self.myBase, None, PropertyModel, False)
#       pprint(dir(self.myBase.property_set))