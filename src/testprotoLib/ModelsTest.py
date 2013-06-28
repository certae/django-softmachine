# -*- coding: utf-8 -*-

from pprint import pprint
from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite

from django.contrib.auth.models import User
from django.contrib.sites.models import Site

from protoLib.models import *


def protoLibModelsTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(TeamHierarchyTest, 'test'))
    #suite.addTest(makeSuite(UserProfileTest, 'test'))

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
        userprofiledata = {
            'user': None,
            'userTeam': None,
            'userTree': '',
            'language': ''
        }

        self.userProfile = UserProfile(**userprofiledata)
        self.userProfile.save()

    def tearDown(self):
        self.userProfile.delete()

    def test_verifying_string_representation(self):
        self.assertEqual(self.userProfile.user.username, str(self.teamHierarchy))
