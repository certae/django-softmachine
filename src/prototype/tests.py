#from testprototype.ProjectTest import ProjectTest
#from testprototype.ModelTest import ModelTest
#from testprototype.EntityTest import EntityTest
#from testprototype.PropertyBaseTest import PropertyBaseChildTest
#from testprototype.PropertyTest import PropertyTest

#from testprototype.RelationshipTest import RelationshipTest

#from testprototype.PropertyModelTest import PropertyModelTest
#from testprototype.PropertyEquivalenceTest import PropertyEquivalenceTest
#from testprototype.PrototypeTest import PrototypeTest
#from testprototype.ProtoTableTest import ProtoTableTest
#from testprototype.DiagramTest import DiagramTest
#from testprototype.DiagramEntityTest import DiagramEntityTest
#from testprototype.ServiceTest import ServiceTest
#from testprototype.ServiceRefTest import ServiceRefTest

# Probleme car Project herite de protoModel et non de models.Model

# Le probleme vient de issubclass()


from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
from testprototype.ProjectTest import ProjectTest


def suite():
    suite = TestSuite()

    suite.addTest(makeSuite(ProjectTest, 'test'))

    return suite
