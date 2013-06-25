# -*- coding: utf-8 -*-

from pprint import pprint
from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
from django.http import HttpRequest

from prototype.models import *
from prototype.actions.viewDefinition import *

from prototype.actions.__init__ import doModelPrototype
from prototype.actions.__init__ import doEntityPrototype

from protoLib.protoAuth import getUserProfile
from protoLib.utilsBase import slugify


def ViewCreationTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(GetViewDefinitionTest, 'test'))
    suite.addTest(makeSuite(GetViewCodeTest, 'test'))
    suite.addTest(makeSuite(CreateViewTest, 'test'))
    suite.addTest(makeSuite(GetEntitiesTest, 'test'))
    suite.addTest(makeSuite(DoModelPrototypeTest, 'test'))
    suite.addTest(makeSuite(DoEntityPrototypeTest, 'test'))

    return suite


class GetViewDefinitionTest(TestCase):
    fixtures = ['auth.json', 'protoLib.json', 'prototype.json']

    def setUp(self):
        self.entity = Entity.objects.all()

    def tearDown(self):
        pass

    def test_protoentity_value_contains_entity_name(self):
        for entries in self.entity:
            infoEntity = getViewDefinition(entries, 'metaTestView')
            self.assertEqual(slugify(entries.model.code + '-' + entries.code), infoEntity['protoEntity'])


class GetViewCodeTest(TestCase):
    fixtures = ['auth.json', 'protoLib.json', 'prototype.json']

    def setUp(self):
        self.entity = Entity.objects.all()

    def tearDown(self):
        pass

    def test_viewtitle_none(self):
        for entries in self.entity:
            returnValue = getViewCode(entries)
            self.assertEqual(slugify(entries.model.code + '-' + entries.code), returnValue)

    def test_viewtitle_specified(self):
        titleString = 'viewTitleViewTest'
        for entries in self.entity:
            returnValue = getViewCode(entries, titleString)
            self.assertEqual(slugify(entries.model.code + '-' + titleString), returnValue)


class CreateViewTest(TestCase):
    fixtures = ['auth.json', 'protoLib.json', 'prototype.json']

    def setUp(self):
        self.entity = Entity.objects.all()

    def tearDown(self):
        pass

    def test_ViewCreation(self):
        for entries in self.entity:
            createView(entries, getViewCode(entries), getUserProfile(26, 'prototype', ''))
        self.assertTrue(len(Prototype.objects.all()) > 0)


class GetEntitiesTest(TestCase):
    fixtures = ['auth.json', 'protoLib.json', 'prototype.json']

    def setUp(self):
        self.entity = Entity.objects.all()
        self.request = HttpRequest()
        self.request.user = 26
        self.viewTitleString = 'testViewTitle'

    def tearDown(self):
        pass

    def test_getentities(self):
        returnMessage = getEntities(self.entity, self.request, self.viewTitleString)
        self.assertEqual(self.entity[0].code + ',' + self.entity[1].code + ',', returnMessage)


class DoModelPrototypeTest(TestCase):
    fixtures = ['auth.json', 'protoLib.json', 'prototype.json']

    def setUp(self):
        self.model = Model.objects.all()
        self.request = HttpRequest()
        self.request.user = 26

    def tearDown(self):
        pass

    def test_DoModelPrototype_NonEmptyQuerySet(self):
        returnMessage = doModelPrototype('', self.request, self.model, '')
        self.assertEqual(returnMessage['message'], 'Model : t_model Entts: t_entity,t_other_entity,; ')
        self.assertTrue(returnMessage['success'])

    def test_DoModelPrototype_EmptyQuerySet(self):
        for entries in self.model:
            entries.delete()
        self.model = Model.objects.all()
        self.assertTrue(self.model.count() == 0)

        returnMessage = doModelPrototype('', self.request, self.model, '')
        self.assertEqual(returnMessage['message'], 'No record selected')
        self.assertFalse(returnMessage['success'])


class DoEntityPrototypeTest(TestCase):
    fixtures = ['auth.json', 'protoLib.json', 'prototype.json']

    def setUp(self):
        self.request = HttpRequest()
        self.request.user = 26

        self.model = Model.objects.all()

    def tearDown(self):
        pass

    def test_DoEntityPrototype_validquery_validparameters(self):
        parameters = []
        parameters.append({'value': 'valueOfParameter'})

        for pModel in self.model:
            pModel.entity_set.all()[1].delete()  # Doit avoir seulement 1 entity
            returnMessage = doEntityPrototype('', self.request, pModel.entity_set.all(), parameters)
            self.assertTrue(returnMessage['success'])

    def test_DoEntityPrototype_validquery_invalidparameters(self):
        for pModel in self.model:
            pModel.entity_set.all()[1].delete()  # Doit avoir seulement 1 entity
            returnMessage = doEntityPrototype('', self.request, pModel.entity_set.all(), '')
            self.assertFalse(returnMessage['success'])
