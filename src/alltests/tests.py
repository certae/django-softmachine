from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite

from testprototype.testmodels.TestSuiteUtils import ModelsTestSuite

from testprototype.testactions.ViewTemplateTest import BaseDefinitionTest
from testprototype.testactions.ViewDefinitionTest import ViewDefinitionTestSuite

from testMetaDefinitions.ObjectsTest import StructureTestSuite
from testMetaDefinitions.PropertiesTest import PropertiesTestSuite

from testViews.LoginTest import LoginTest

from testprototype.ProtoRulesTest import ProtoRulesTestSuite


def suite():
    suite = TestSuite()

    suite.addTest(ModelsTestSuite())

    suite.addTest(makeSuite(LoginTest, 'test'))
    suite.addTest(makeSuite(BaseDefinitionTest, 'test'))

    suite.addTest(ViewDefinitionTestSuite())

    suite.addTest(StructureTestSuite())

    suite.addTest(PropertiesTestSuite())

    suite.addTest(ProtoRulesTestSuite())

    return suite
