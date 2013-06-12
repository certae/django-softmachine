# -*- coding: utf-8 -*-

import random
from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite

from prototype.models import Project
from prototype.models import PropertyModel
from prototype.models import Model
from prototype.models import Entity
from prototype.models import Relationship
from prototype.protoRules import updatePropInfo
from testprototype.Utils import random_string_generator


def ProtoRulesTestSuite():
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
            'model': testModel
        }
        testPropertyModel = PropertyModel(**propertymodel_values)
        testPropertyModel.save()

        relationship_values = {
            'isForeign': True,
            'entity': testEntity,
            'refEntity': testRefEntity,
            'propertyModel': testPropertyModel
        }

        self.myBase = Relationship(**relationship_values)
        self.myBase.save()

    def test_isForeign_true_inherit_false(self):
        updatePropInfo(self.myBase, None, PropertyModel, False)
        self.assertEqual(str(self.myBase.propertyModel), self.myBase.refEntity.code.lower() + '-pk')
