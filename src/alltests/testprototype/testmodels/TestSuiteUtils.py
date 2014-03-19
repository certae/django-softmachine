from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite

from alltests.testprototype.testmodels.ProjectTest import * #ProjectTest
from alltests.testprototype.testmodels.ModelTest import * #ModelTest
from alltests.testprototype.testmodels.EntityTest import * #EntityTest
from alltests.testprototype.testmodels.PropertyTest import * #PropertyTest
from alltests.testprototype.testmodels.RelationshipTest import * #RelationshipTest

from alltests.testprototype.testmodels.PropertyModelTest import * #PropertyModelTest #
from alltests.testprototype.testmodels.PropertyEquivalenceTest import * #PropertyEquivalenceTest
from alltests.testprototype.testmodels.PrototypeTest import * #PrototypeTest
from alltests.testprototype.testmodels.ProtoTableTest import * #ProtoTableTest
from alltests.testprototype.testmodels.DiagramTest import * #DiagramTest
from alltests.testprototype.testmodels.DiagramEntityTest import *#DiagramEntityTest
from alltests.testprototype.testmodels.ServiceTest import * #ServiceTest
from alltests.testprototype.testmodels.ServiceRefTest import *#ServiceRefTest


def prototypeModelsTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(ProjectTest, 'test'))
    suite.addTest(makeSuite(ModelTest, 'test'))
    suite.addTest(makeSuite(EntityTest, 'test'))
    suite.addTest(makeSuite(PropertyTest, 'test'))
    suite.addTest(makeSuite(RelationshipTest, 'test'))
    suite.addTest(makeSuite(PropertyModelTest, 'test'))
    suite.addTest(makeSuite(PropertyEquivalenceTest, 'test'))
    suite.addTest(makeSuite(PrototypeTest, 'test'))
    suite.addTest(makeSuite(ProtoTableTest, 'test'))
    suite.addTest(makeSuite(DiagramTest, 'test'))
    suite.addTest(makeSuite(DiagramEntityTest, 'test'))
    suite.addTest(makeSuite(ServiceTest, 'test'))
    suite.addTest(makeSuite(ServiceRefTest, 'test'))

    return suite