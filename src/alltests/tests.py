# -*- encoding: UTF-8 -*-

from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite

from testprototype.testmodels.TestSuiteUtils import prototypeModelsTestSuite
from testprotoLib.ModelsTest import protoLibModelsTestSuite

from testprototype.testactions.ViewTemplateTest import BaseDefinitionTest
from testprototype.testactions.ViewDefinitionTest import ViewDefinitionTestSuite

from testMetaDefinitions.ObjectsTest import StructureTestSuite
from testMetaDefinitions.PropertiesTest import PropertiesTestSuite

from testSampleProject.ViewCreationTest import ViewCreationTestSuite

from testprototype.ProtoRulesTest import ProtoRulesTestSuite
from testprotoLib.ProtoActionListTest import ProtoActionListTestSuite
from testprotoLib.ProtoActionRepTest import ProtoActionRepTestSuite
from testprotoLib.ProtoActionsTest import ProtoActionsTestSuite
from testprotoLib.ProtoActionEditTest import ProtoActionEditTestSuite
from testprotoLib.ProtoAuthTest import ProtoAuthTestSuite
from testprotoLib.ProtoMenuTest import ProtoMenuTestSuite
from testprotoLib.ProtoGetPciTest import ProtoGetPciTestSuite
from testprotoLib.ProtoGetDetailsTest import ProtoGetDetailsTestSuite
from testprotoLib.ProtoLoginTest import ProtoLoginTestSuite


def suite():
    suite = TestSuite()

    suite.addTest(prototypeModelsTestSuite())
    suite.addTest(protoLibModelsTestSuite())

    suite.addTest(makeSuite(BaseDefinitionTest, 'test'))

    suite.addTest(ViewDefinitionTestSuite())

    suite.addTest(StructureTestSuite())
    suite.addTest(PropertiesTestSuite())

    suite.addTest(ProtoRulesTestSuite())

    suite.addTest(ViewCreationTestSuite())

    suite.addTest(ProtoActionListTestSuite())
    suite.addTest(ProtoActionRepTestSuite())
    suite.addTest(ProtoActionsTestSuite())
    suite.addTest(ProtoActionEditTestSuite())

    suite.addTest(ProtoAuthTestSuite())

    suite.addTest(ProtoMenuTestSuite())
    suite.addTest(ProtoGetPciTestSuite())
    suite.addTest(ProtoGetDetailsTestSuite())
    suite.addTest(ProtoLoginTestSuite())

    return suite
