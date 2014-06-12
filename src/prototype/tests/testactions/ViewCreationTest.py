# -*- coding: utf-8 -*-

from django.test import TestCase
from django.http import HttpRequest

from prototype.models import *
from prototype.actions.viewDefinition import getViewDefinition, getViewCode, createView, getUserProfile, getEntities
from prototype.actions.__init__ import doModelPrototype
from prototype.actions.__init__ import doEntityPrototype


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
        self.assertIn(self.entity[0].code + ',' + self.entity[1].code + ',', returnMessage)


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
            for ii in range(0, len(pModel.entity_set.all())-1):
                pModel.entity_set.all()[0].delete()
            returnMessage = doEntityPrototype('', self.request, pModel.entity_set.all(), parameters)
            self.assertTrue(returnMessage['success'])

    def test_DoEntityPrototype_validquery_invalidparameters(self):
        for pModel in self.model:
            for ii in range(0, len(pModel.entity_set.all())-1):
                pModel.entity_set.all()[0].delete()
                
            returnMessage = doEntityPrototype('', self.request, pModel.entity_set.all(), '')
            self.assertFalse(returnMessage['success'])
