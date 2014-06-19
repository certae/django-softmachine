# -*- coding: utf-8 -*-

from django.test import TestCase

from protoLib.utilsBase import slugify
from prototype.actions.viewTemplate import baseDefinition

from alltests.testPrototype.Utils import random_string_generator
from alltests.testPrototype.testmodels.TestUtilities import createTestEntity


class baseDefinitionTest(TestCase):

    def setUp(self):
        self.pEntity = createTestEntity()
        self.entityName = random_string_generator(10)
        self.viewTitle = random_string_generator(3) + str(' ') + random_string_generator(4)
        self.baseDef = baseDefinition(self.pEntity, self.entityName, self.viewTitle)

    def test_basedefinition_returns_correct_viewCode(self):
        viewName = slugify(self.viewTitle)
        # La constante globale ne peut pas etre utilisee ici. Devrait etre modifie.
        self.assertEqual(self.baseDef['viewCode'], 'prototype.ProtoTable.' + viewName)

    def test_basedefinition_returns_correct_protoEntity(self):
        self.assertEqual(self.baseDef['protoEntity'], self.entityName)

    def test_basedefinition_returns_correct_protoEntityId(self):
        self.assertEqual(self.baseDef['protoEntityId'], self.pEntity.id)

    def test_basedefinition_returns_correct_description(self):
        self.assertEqual(self.baseDef['description'], self.pEntity.description)

    def test_basedefinition_returns_correct_shortTitle(self):
        self.assertEqual(self.baseDef['shortTitle'], self.viewTitle)

    def test_basedefinition_returns_correct_fields_prpDefault(self):
        self.assertEqual(self.baseDef['fields'][2]['prpDefault'], self.pEntity.id)