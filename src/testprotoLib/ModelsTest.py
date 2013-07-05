# -*- coding: utf-8 -*-

from pprint import pprint
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

    return suite


class TeamHierarchyTest(TestCase):
    def setUp(self):
        teamhierarchydata = {
            'code': 'SomeValue',
            'description': 'Description of TeamHierarchy',
            'parentNode': None,
            'site': Site()
        }

        self.teamHierarchy = TeamHierarchy(**teamhierarchydata)
        self.teamHierarchy.save()

    def tearDown(self):
        self.teamHierarchy.delete()

    def test_verifying_string_representation(self):
        self.assertEqual(self.teamHierarchy.code, str(self.teamHierarchy))


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
