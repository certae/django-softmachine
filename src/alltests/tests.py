from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite

from testprototype.testmodels.TestSuiteUtils import ModelsTestSuite

from testprototype.testactions.ViewTemplateTest import BaseDefinitionTest
from testprototype.testactions.ViewDefinitionTest import *

from testMetaDefinitions.ObjectsTest import StructureTestSuite
from testMetaDefinitions.PropertiesTest import PropertiesTestSuite

from testViews.LoginTest import LoginTest


def suite():
    suite = TestSuite()

    suite.addTest(ModelsTestSuite())

    suite.addTest(makeSuite(LoginTest, 'test'))

    suite.addTest(makeSuite(BaseDefinitionTest, 'test'))

    suite.addTest(makeSuite(GetViewCodeTest, 'test'))
    suite.addTest(makeSuite(Property2FieldTest, 'test'))
    suite.addTest(makeSuite(GetViewDefinitionTest, 'test'))
    suite.addTest(makeSuite(GetFkIdTest, 'test'))

    suite.addTest(StructureTestSuite())

    suite.addTest(PropertiesTestSuite())

    return suite
