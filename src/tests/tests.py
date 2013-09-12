# -*- encoding: UTF-8 -*-
# Pour rouler les tests a la ligne de commandes :
#  python src/manage.py test alltests

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
    alltests = TestSuite()

    alltests.addTest(prototypeModelsTestSuite())
    alltests.addTest(protoLibModelsTestSuite())

    alltests.addTest(makeSuite(BaseDefinitionTest, 'test'))

    alltests.addTest(ViewDefinitionTestSuite())

    alltests.addTest(StructureTestSuite())
    alltests.addTest(PropertiesTestSuite())

    alltests.addTest(ProtoRulesTestSuite())

    alltests.addTest(ViewCreationTestSuite())

    alltests.addTest(ProtoActionListTestSuite())
    alltests.addTest(ProtoActionRepTestSuite())
    alltests.addTest(ProtoActionsTestSuite())
    alltests.addTest(ProtoActionEditTestSuite())

    alltests.addTest(ProtoAuthTestSuite())

    alltests.addTest(ProtoMenuTestSuite())
    alltests.addTest(ProtoGetPciTestSuite())
    alltests.addTest(ProtoGetDetailsTestSuite())
    alltests.addTest(ProtoLoginTestSuite())

    return alltests
