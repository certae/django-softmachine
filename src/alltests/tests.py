# -*- encoding: UTF-8 -*-
# Pour rouler les tests a la ligne de commandes :

from testMetaDefinitions.ObjectsTest import * #structureTestSuite                                     
from testMetaDefinitions.PropertiesTest import * #propertiesTestSuite                                  
from testSampleProject.ViewCreationTest import * #viewCreationTestSuite                                

from testprototype.testactions.ViewTemplateTest import * #baseDefinitionTest                 
from testprototype.testactions.ViewDefinitionTest import * #viewDefinitionTestSuite  
from testprototype.testmodels.TestSuiteUtils import * #prototypeModelsTestSuite
from testprototype.testmodels.PropertyBaseTest import * #protoRulesTestSuite    
from testprototype.ProtoRulesTest import * #protoRulesTestSuite                               

from testprotoLib.ModelsTest import * # protoLibModelsTestSuite      
from testprotoLib.ProtoActionEditTest import * #protoActionEditTestSuite                                
from testprotoLib.ProtoActionListTest import * #protoActionListTestSuite                       
from testprotoLib.ProtoActionRepTest import * #protoActionRepTestSuite                         
from testprotoLib.ProtoActionsTest import * #protoActionsTestSuite                    
from testprotoLib.ProtoAuthTest import * #protoAuthTestSuite   
from testprotoLib.ProtoGetDetailsTest import * #protoGetDetailsTestSuite
from testprotoLib.ProtoGetPciTest import * #protoGetPciTestSuite    
from testprotoLib.ProtoLoginTest import * #protoLoginTestSuite                                  
from testprotoLib.ProtoMenuTest import * #protoMenuTestSuite                                   

'''def suiteDeTest():
    
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
'''
    

