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

    def tearDown(self):
        pass

    def test_getentities(self):
        request = HttpRequest()
        request.user = 26
        viewTitleString = 'testViewTitle'
        returnMessage = getEntities(self.entity, request, viewTitleString)
        self.assertEqual(self.entity[0].code + ',' + self.entity[1].code + ',', returnMessage)


class DoModelPrototypeTest(TestCase):
    fixtures = ['auth.json', 'protoLib.json', 'prototype.json']

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_DoModelPrototype_NonEmptyQuerySet(self):
        model = Model.objects.all()
        request = HttpRequest()
        request.user = 26
        returnMessage = doModelPrototype('', request, model, '')
        self.assertEqual(returnMessage['message'], 'Model : t_model Entts: t_entity,t_other_entity,; ')
        self.assertTrue(returnMessage['success'])

    def test_DoModelPrototype_EmptyQuerySet(self):
        request = HttpRequest()
        request.user = 26

        model = Model.objects.all()
        for entries in model:
            entries.delete()
        model = Model.objects.all()
        self.assertTrue(model.count() == 0)

        returnMessage = doModelPrototype('', request, model, '')
        self.assertEqual(returnMessage['message'], 'No record selected')
        self.assertFalse(returnMessage['success'])


class DoEntityPrototypeTest(TestCase):
    fixtures = ['auth.json', 'protoLib.json', 'prototype.json']

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_DoEntityPrototype_validquery_validparameters(self):
        request = HttpRequest()
        request.user = 26

        model = Model.objects.all()

        parameters = []
        parameters.append({'value': 'valueOfParameter'})

        for pModel in model:
            pModel.entity_set.all()[1].delete()  # Doit avoir seulement 1 entity
            returnMessage = doEntityPrototype('', request, pModel.entity_set.all(), parameters)
            self.assertTrue(returnMessage['success'])

    def test_DoEntityPrototype_validquery_invalidparameters(self):
        request = HttpRequest()
        request.user = 26

        model = Model.objects.all()

        for pModel in model:
            pModel.entity_set.all()[1].delete()  # Doit avoir seulement 1 entity
            returnMessage = doEntityPrototype('', request, pModel.entity_set.all(), '')
            self.assertFalse(returnMessage['success'])
