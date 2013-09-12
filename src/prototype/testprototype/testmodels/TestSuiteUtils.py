from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite

from testprototype.testmodels.ProjectTest import ProjectTest
from testprototype.testmodels.ModelTest import ModelTest
from testprototype.testmodels.EntityTest import EntityTest
from testprototype.testmodels.PropertyBaseTest import PropertyBaseChildTest
from testprototype.testmodels.PropertyTest import PropertyTest
from testprototype.testmodels.RelationshipTest import RelationshipTest
from testprototype.testmodels.PropertyModelTest import PropertyModelTest
from testprototype.testmodels.PropertyEquivalenceTest import PropertyEquivalenceTest
from testprototype.testmodels.PrototypeTest import PrototypeTest
from testprototype.testmodels.ProtoTableTest import ProtoTableTest
from testprototype.testmodels.DiagramTest import DiagramTest
from testprototype.testmodels.DiagramEntityTest import DiagramEntityTest
from testprototype.testmodels.ServiceTest import ServiceTest
from testprototype.testmodels.ServiceRefTest import ServiceRefTest


def prototypeModelsTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(ProjectTest, 'test'))
    suite.addTest(makeSuite(ModelTest, 'test'))
    suite.addTest(makeSuite(EntityTest, 'test'))

    suite.addTest(makeSuite(PropertyBaseChildTest, 'test'))
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
