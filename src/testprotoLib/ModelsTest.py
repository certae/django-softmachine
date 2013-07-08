# -*- coding: utf-8 -*-

from pprint import pprint
from datetime import datetime

from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
from django.utils.unittest import skip

from django.contrib.auth.models import User
from django.contrib.sites.models import Site

from protoLib.models import *


def protoLibModelsTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(TeamHierarchyTest, 'test'))
    suite.addTest(makeSuite(UserProfileTest, 'test'))
    suite.addTest(makeSuite(UserShareTest, 'test'))
    suite.addTest(makeSuite(ProtoDefinitionTest, 'test'))
    suite.addTest(makeSuite(CustomDefinitionTest, 'test'))
    suite.addTest(makeSuite(DiscreteValueTest, 'test'))
    suite.addTest(makeSuite(LanguajeTest, 'test'))
    suite.addTest(makeSuite(PtFunctionTest, 'test'))

    return suite


class TeamHierarchyTest(TestCase):
    def setUp(self):
        teamhierarchydata = {
            'code': 'SomeValue',
            'description': 'Description of TeamHierarchy',
            'parentNode': TeamHierarchy(),
            'site': Site()
        }

        self.teamHierarchy = TeamHierarchy(**teamhierarchydata)
        self.teamHierarchy.save()

    def tearDown(self):
        self.teamHierarchy.delete()

    def test_verifying_string_representation(self):
        self.assertEqual(self.teamHierarchy.code, str(self.teamHierarchy))

    @skip('unicode is not callable')
    def test_fullpath(self):
        returnValue = self.teamHierarchy.fullPath()
        print(returnValue)

    @skip('unicode is not callable')
    def test_treehierarchy(self):
        returnValue = self.teamHierarchy.treeHierarchy()
        print(returnValue)


class UserProfileTest(TestCase):
    def setUp(self):
        userdata = {
            'username': 'test_user',
            'first_name': 'Bob',
            'last_name': 'Tremblay',
            'email': 'bob.tremblay@courriel.ca'
        }

        self.user_test = User(**userdata)
        self.user_test.save()

        for values in UserProfile.objects.all():
            print(values.user)
            print(values.user_id)

        userprofiledata = {
            'user': self.user_test,
            'userTeam': None,
            'userTree': '',
            'language': ''
        }

        self.userProfile = UserProfile(**userprofiledata)
        self.userProfile.save()

    def tearDown(self):
        self.user_test.delete()
        self.userProfile.delete()

    @skip('Impossible de creer un UserProfile')
    def test_verifying_string_representation(self):
        self.assertEqual(self.userProfile.user.username, str(self.userProfile))


class UserShareTest(TestCase):
    def setUp(self):
        userdata = {
            'username': 'test_user',
            'first_name': 'Bob',
            'last_name': 'Tremblay',
            'email': 'bob.tremblay@courriel.ca'
        }

        self.user_test = User(**userdata)
        self.user_test.save()

        teamhierarchydata = {
            'code': 'SomeValue',
            'description': 'Description of TeamHierarchy',
            'parentNode': None,
            'site': Site()
        }

        self.teamHierarchy = TeamHierarchy(**teamhierarchydata)
        self.teamHierarchy.save()

        usersharedata = {
            'user': self.user_test,
            'userTeam': self.teamHierarchy
        }

        self.userShare = UserShare(**usersharedata)
        self.userShare.save()

    def tearDown(self):
        self.userShare.delete()
        self.teamHierarchy.delete()
        self.user_test.delete()

    def test_verifying_string_representation(self):
        self.assertEqual(self.userShare.user.username + '-' + self.userShare.userTeam.code, str(self.userShare))


class ProtoDefinitionTest(TestCase):
    def setUp(self):
        protodefinitiondata = {
            'code': 'test_code',
            'description': 'description protodefinition',
            'metaDefinition': 'metadef',
            'active': True,
            'overWrite': True
        }
        self.protoDefinition = ProtoDefinition(**protodefinitiondata)
        self.protoDefinition.save()

    def tearDown(self):
        self.protoDefinition.delete()

    def test_verifying_string_representation(self):
        self.assertEqual('test_code', str(self.protoDefinition))


class CustomDefinitionTest(TestCase):
    def setUp(self):
        customdefinitiondata = {
            'code': 'test_code',
            'description': 'description protodefinition',
            'metaDefinition': 'metadef',
            'active': True,
            'overWrite': True
        }
        self.customDefinition = CustomDefinition(**customdefinitiondata)
        self.customDefinition.save()

    def tearDown(self):
        self.customDefinition.delete()

    def test_verifying_string_representation(self):
        self.assertEqual('test_code', str(self.customDefinition))


class DiscreteValueTest(TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_verifying_string_representation_with_title_as_none(self):
        discretevaluedata = {
            'code': 'test_code',
            'value': 'test_value',
            'description': 'description of discrete value',
            'title': None
        }
        self.discreteValue = DiscreteValue(**discretevaluedata)
        self.discreteValue.save()

        self.assertEqual('test_code', str(self.discreteValue))

        self.discreteValue.delete()

    def test_verifying_string_representation_with_title_not_none(self):
        discretevaluedata = {
            'code': 'test_code',
            'value': 'test_value',
            'description': 'description of discrete value',
            'title': DiscreteValue()
        }
        self.discreteValue = DiscreteValue(**discretevaluedata)
        self.discreteValue.save()

        self.assertEqual('.test_code', str(self.discreteValue))

        self.discreteValue.delete()


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


class PtFunctionTest(TestCase):
    def setUp(self):
        ptfunctiondata = {
            'code': 'test_code',
            'modelName': 'name of model',
            'arguments': 'test arguments',
            'functionBody': 'body of function',
            'tag': 'test tag',
            'description': 'description of function'
        }
        self.ptFunction = PtFunction(**ptfunctiondata)
        self.ptFunction.save()

    def tearDown(self):
        self.ptFunction.delete()

    def test_verifying_string_representation(self):
        self.assertEqual(self.ptFunction.code + '.' + self.ptFunction.tag, str(self.ptFunction))
