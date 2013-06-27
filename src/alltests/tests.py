# -*- encoding: UTF-8 -*-

from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite

from testprototype.testmodels.TestSuiteUtils import ModelsTestSuite

from testprototype.testactions.ViewTemplateTest import BaseDefinitionTest
from testprototype.testactions.ViewDefinitionTest import ViewDefinitionTestSuite

from testMetaDefinitions.ObjectsTest import StructureTestSuite
from testMetaDefinitions.PropertiesTest import PropertiesTestSuite

from testViews.LoginTest import LoginTest
from testprototype.ProtoRulesTest import ProtoRulesTestSuite
from testSampleProject.ViewCreationTest import ViewCreationTestSuite
from testprotoLib.ProtoActionListTest import ProtoActionListTestSuite
from testprotoLib.ProtoActionRepTest import ProtoActionRepTestSuite
from testprotoLib.ProtoActionsTest import ProtoActionsTestSuite
from testprotoLib.ProtoActionEditTest import ProtoActionEditTestSuite
from testprotoLib.ProtoMenuTest import ProtoMenuTestSuite
from testprotoLib.ProtoGetPciTest import ProtoGetPciTestSuite


def suite():
    suite = TestSuite()

    suite.addTest(ModelsTestSuite())

    suite.addTest(makeSuite(BaseDefinitionTest, 'test'))

    suite.addTest(ViewDefinitionTestSuite())

    suite.addTest(StructureTestSuite())
    suite.addTest(PropertiesTestSuite())

    suite.addTest(ProtoRulesTestSuite())

    suite.addTest(makeSuite(LoginTest, 'test'))

    suite.addTest(ViewCreationTestSuite())

    suite.addTest(ProtoActionListTestSuite())
    suite.addTest(ProtoActionRepTestSuite())
    suite.addTest(ProtoActionsTestSuite())
    suite.addTest(ProtoActionEditTestSuite())
    suite.addTest(ProtoMenuTestSuite())
    suite.addTest(ProtoGetPciTestSuite())

    return suite
