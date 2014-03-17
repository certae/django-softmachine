# -*- encoding: UTF-8 -*-
# Pour rouler les tests a la ligne de commandes :
from django.utils.unittest.suite import * #TestSuite
from django.utils.unittest.loader import * #makeSuite

from testMetaDefinitions.ObjectsTest import * #structureTestSuite                                     
from testMetaDefinitions.PropertiesTest import * #propertiesTestSuite                                  
from testSampleProject.ViewCreationTest import * #viewCreationTestSuite                                

from prototype.testprototype.testactions.ViewTemplateTest import * #baseDefinitionTest                 
from prototype.testprototype.testactions.ViewDefinitionTest import * #viewDefinitionTestSuite  
from prototype.testprototype.testmodels.TestSuiteUtils import * #prototypeModelsTestSuite
          
from prototype.testprototype.ProtoRulesTest import * #protoRulesTestSuite                               

from protoLib.testprotoLib.ModelsTest import * #protoLibModelsTestSuite      
from protoLib.testprotoLib.ProtoActionEditTest import * #protoActionEditTestSuite                                
from protoLib.testprotoLib.ProtoActionListTest import * #protoActionListTestSuite                       
from protoLib.testprotoLib.ProtoActionRepTest import * #protoActionRepTestSuite                         
from protoLib.testprotoLib.ProtoActionsTest import * #protoActionsTestSuite                    
from protoLib.testprotoLib.ProtoAuthTest import * #protoAuthTestSuite   
from protoLib.testprotoLib.ProtoGetDetailsTest import * #protoGetDetailsTestSuite
from protoLib.testprotoLib.ProtoGetPciTest import * #protoGetPciTestSuite    
from protoLib.testprotoLib.ProtoLoginTest import * #protoLoginTestSuite                                  
from protoLib.testprotoLib.ProtoMenuTest import * #protoMenuTestSuite                                   

def suiteDeTest():
    
    suite = TestSuite()
 
    suite.addTest(makeSuite(structureTestSuite, 'test'))
    suite.addTest(makeSuite(propertiesTestSuite, 'test'))
    suite.addTest(makeSuite(viewCreationTestSuite , 'test'))
 
    suite.addTest(makeSuite(baseDefinitionTest, 'test'))
    suite.addTest(makeSuite(viewDefinitionTestSuite, 'test'))
    suite.addTest(makeSuite(prototypeModelsTestSuite, 'test'))
    
    suite.addTest(makeSuite(protoRulesTestSuite , 'test'))
    
    suite.addTest(makeSuite(protoLibModelsTestSuite, 'test'))
    suite.addTest(makeSuite(protoActionEditTestSuite, 'test'))
    suite.addTest(makeSuite(protoActionRepTestSuite, 'test'))
    suite.addTest(makeSuite(protoActionListTestSuite, 'test'))
    suite.addTest(makeSuite(protoActionsTestSuite, 'test'))
    
    suite.addTest(makeSuite(protoAuthTestSuite, 'test'))
    suite.addTest(makeSuite(protoGetDetailsTestSuite, 'test'))
    suite.addTest(makeSuite(protoGetPciTestSuite, 'test'))
    suite.addTest(makeSuite(protoLoginTestSuite, 'test'))
    suite.addTest(makeSuite(protoMenuTestSuite, 'test'))   
    
    return suite

    
if __name__ == '__main__':

    runner = unittest.TextTestRunner()

    test_suite = suiteDeTest()

    runner.run (test_suite)
