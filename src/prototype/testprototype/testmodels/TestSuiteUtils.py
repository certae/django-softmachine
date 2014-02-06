from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite

from prototype.testprototype.testmodels.ProjectTest import ProjectTest
from prototype.testprototype.testmodels.ModelTest import ModelTest
from prototype.testprototype.testmodels.EntityTest import EntityTest
from prototype.testprototype.testmodels.PropertyBaseTest import PropertyBaseChildTest
from prototype.testprototype.testmodels.PropertyTest import PropertyTest
from prototype.testprototype.testmodels.RelationshipTest import RelationshipTest
#from prototype.testprototype.testmodels.PropertyModelTest import PropertyModelTest
from prototype.testprototype.testmodels.PropertyEquivalenceTest import PropertyEquivalenceTest
from prototype.testprototype.testmodels.PrototypeTest import PrototypeTest
from prototype.testprototype.testmodels.ProtoTableTest import ProtoTableTest
from prototype.testprototype.testmodels.DiagramTest import DiagramTest
from prototype.testprototype.testmodels.DiagramEntityTest import DiagramEntityTest
from prototype.testprototype.testmodels.ServiceTest import ServiceTest
from prototype.testprototype.testmodels.ServiceRefTest import ServiceRefTest


def prototypeModelsTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(ProjectTest, 'test'))
    suite.addTest(makeSuite(ModelTest, 'test'))
    suite.addTest(makeSuite(EntityTest, 'test'))

    suite.addTest(makeSuite(PropertyBaseChildTest, 'test'))
    suite.addTest(makeSuite(PropertyTest, 'test'))
    suite.addTest(makeSuite(RelationshipTest, 'test'))

    #suite.addTest(makeSuite(PropertyModelTest, 'test'))
    suite.addTest(makeSuite(PropertyEquivalenceTest, 'test'))
    suite.addTest(makeSuite(PrototypeTest, 'test'))

    suite.addTest(makeSuite(ProtoTableTest, 'test'))
    suite.addTest(makeSuite(DiagramTest, 'test'))
    suite.addTest(makeSuite(DiagramEntityTest, 'test'))

    suite.addTest(makeSuite(ServiceTest, 'test'))
    suite.addTest(makeSuite(ServiceRefTest, 'test'))

    return suite
