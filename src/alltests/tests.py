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

from testprototype.testactions.ViewTemplateTest import BaseDefinitionTest
from testprototype.testactions.ViewDefinitionTest import GetViewCodeTest
from testprototype.testactions.ViewDefinitionTest import Property2FieldTest
from testprototype.testactions.ViewDefinitionTest import GetViewDefinitionTest
from testprototype.testactions.ViewDefinitionTest import GetFkIdTest

from testMetaDefinitions.ObjectsTest import *

from testViews.LoginTest import LoginTest


def suite():
    suite = TestSuite()

    suite.addTest(makeSuite(ProjectTest, 'test'))
    suite.addTest(makeSuite(ModelTest, 'test'))
    suite.addTest(makeSuite(EntityTest, 'test'))

    suite.addTest(makeSuite(PropertyBaseChildTest, 'test'))
    suite.addTest(makeSuite(PropertyTest, 'test'))
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

    suite.addTest(makeSuite(LoginTest, 'test'))

    suite.addTest(makeSuite(BaseDefinitionTest, 'test'))
    suite.addTest(makeSuite(GetViewCodeTest, 'test'))
    suite.addTest(makeSuite(Property2FieldTest, 'test'))
    suite.addTest(makeSuite(GetViewDefinitionTest, 'test'))
    suite.addTest(makeSuite(GetFkIdTest, 'test'))

    suite.addTest(makeSuite(ProjectStructureTest, 'test'))
    suite.addTest(makeSuite(ModelStructureTest, 'test'))
    suite.addTest(makeSuite(EntityStructureTest, 'test'))

    suite.addTest(makeSuite(PropertyStructureTest, 'test'))
    suite.addTest(makeSuite(ProjectStructureTest, 'test'))
    suite.addTest(makeSuite(RelationshipStructureTest, 'test'))
    suite.addTest(makeSuite(PropertyModelStructureTest, 'test'))
    suite.addTest(makeSuite(PropertyEquivalenceStructureTest, 'test'))
    suite.addTest(makeSuite(PrototypeStructureTest, 'test'))
    suite.addTest(makeSuite(ProtoTableStructureTest, 'test'))
    #suite.addTest(makeSuite(DiagramStructureTest, 'test'))  # Champ et valeur non present dans MetaObjects
    #suite.addTest(makeSuite(DiagramEntityStructureTest, 'test'))  # Aucun champ a valider
    #suite.addTest(makeSuite(ServiceStructureTest, 'test'))  # Champ et valeur non present dans MetaObjects
    #suite.addTest(makeSuite(ServiceRefStructureTest, 'test'))  # Aucun champ a valider

    return suite
