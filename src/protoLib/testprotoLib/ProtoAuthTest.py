# -*- coding: utf-8 -*-

from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite

from protoLib.protoAuth import getUserProfile
from protoLib.protoAuth import activityLog


def protoAuthTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(GetUserProfileTest, 'test'))
    suite.addTest(makeSuite(ActivityLogTest, 'test'))

    return suite


class GetUserProfileTest(TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_method_with_user_none(self):
        self.assertIsNone(getUserProfile(None, '', ''))


class ActivityLogTest(TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_method_with_user_none(self):
        self.assertIsNone(activityLog('', '', '', ''))
