from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
from testViews.LoginTest import LoginTest


def suite():
    suite = TestSuite()

    suite.addTest(makeSuite(LoginTest, 'test'))

    return suite
