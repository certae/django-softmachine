from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite

from testprototype.ProjectTest import ProjectTest
from testprototype.ModelTest import ModelTest
from testprototype.EntityTest import EntityTest
from testprototype.PropertyBaseTest import PropertyBaseChildTest
from testprototype.PropertyTest import PropertyTest
from testprototype.RelationshipTest import RelationshipTest
from testprototype.PropertyModelTest import PropertyModelTest
from testprototype.PropertyEquivalenceTest import PropertyEquivalenceTest
from testprototype.PrototypeTest import PrototypeTest
from testprototype.ProtoTableTest import ProtoTableTest
from testprototype.DiagramTest import DiagramTest
from testprototype.DiagramEntityTest import DiagramEntityTest
from testprototype.ServiceTest import ServiceTest
from testprototype.ServiceRefTest import ServiceRefTest

#from testViews.LoginTest import LoginTest

from testViews.AuthentificationTest import AuthenticationTest

from testViews.BaseDefinitionTest import BaseDefinitionTest


def suite():
    suite = TestSuite()

    suite.addTest(makeSuite(ProjectTest, 'test'))
    suite.addTest(makeSuite(ModelTest, 'test'))
    suite.addTest(makeSuite(EntityTest, 'test'))

    suite.addTest(makeSuite(PropertyBaseChildTest, 'test'))
    suite.addTest(makeSuite(ProjectTest, 'test'))
    suite.addTest(makeSuite(RelationshipTest, 'test'))

    suite.addTest(makeSuite(PropertyModelTest, 'test'))
    suite.addTest(makeSuite(PropertyEquivalenceTest, 'test'))
    suite.addTest(makeSuite(PrototypeTest, 'test'))

    suite.addTest(makeSuite(ProtoTableTest, 'test'))
    suite.addTest(makeSuite(DiagramTest, 'test'))
    suite.addTest(makeSuite(DiagramEntityTest, 'test'))

    suite.addTest(makeSuite(ServiceTest, 'test'))
    suite.addTest(makeSuite(ServiceRefTest, 'test'))

    #suite.addTest(makeSuite(LoginTest, 'test'))

    suite.addTest(makeSuite(AuthenticationTest, 'test'))

    suite.addTest(makeSuite(BaseDefinitionTest, 'test'))

    return suite
