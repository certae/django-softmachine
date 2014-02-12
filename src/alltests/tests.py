# -*- encoding: UTF-8 -*-
# Pour rouler les tests a la ligne de commandes :

from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite

from testMetaDefinitions.ObjectsTest import * #StructureTestSuite                                      
from testMetaDefinitions.PropertiesTest import * #PropertiesTestSuite                                  
from testSampleProject.ViewCreationTest import * #ViewCreationTestSuite                                

from prototype.testprototype.testactions.ViewTemplateTest import * #BaseDefinitionTest                 

from prototype.testprototype.testmodels.TestSuiteUtils import * #prototypeModelsTestSuite
from prototype.testprototype.testactions.ViewDefinitionTest import * #ViewDefinitionTestSuite            
from prototype.testprototype.ProtoRulesTest import * #ProtoRulesTestSuite                               

from protoLib.testprotoLib.ModelsTest import protoLibModelsTestSuite                                    
from protoLib.testprotoLib.ProtoActionListTest import * #ProtoActionListTestSuite                       
from protoLib.testprotoLib.ProtoActionRepTest import * #ProtoActionRepTestSuite                         
from protoLib.testprotoLib.ProtoActionsTest import * #ProtoActionsTestSuite                             
from protoLib.testprotoLib.ProtoActionEditTest import * #ProtoActionEditTestSuite                       
from protoLib.testprotoLib.ProtoAuthTest import * #ProtoAuthTestSuite                                   
from protoLib.testprotoLib.ProtoMenuTest import * #ProtoMenuTestSuite                                   
from protoLib.testprotoLib.ProtoGetPciTest import * #ProtoGetPciTestSuite                               
from protoLib.testprotoLib.ProtoGetDetailsTest import * #ProtoGetDetailsTestSuite                       
from protoLib.testprotoLib.ProtoLoginTest import * #ProtoLoginTestSuite                                 

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