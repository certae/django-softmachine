# -*- encoding: UTF-8 -*-
# Pour rouler les tests a la ligne de commandes :

from testMetaDefinitions.ObjectsTest import * #StructureTestSuite                                      
from testMetaDefinitions.PropertiesTest import * #PropertiesTestSuite                                  
from testSampleProject.ViewCreationTest import * #ViewCreationTestSuite                                

from prototype.testprototype.testactions.ViewTemplateTest import * #BaseDefinitionTest                 
from prototype.testprototype.testactions.ViewDefinitionTest import * #ViewDefinitionTestSuite  
from prototype.testprototype.testmodels.TestSuiteUtils import * #prototypeModelsTestSuite
          
from prototype.testprototype.ProtoRulesTest import * #ProtoRulesTestSuite                               

from protoLib.testprotoLib.ModelsTest import * #protoLibModelsTestSuite      
from protoLib.testprotoLib.ProtoActionEditTest import * #ProtoActionEditTestSuite                                
from protoLib.testprotoLib.ProtoActionListTest import * #ProtoActionListTestSuite                       
from protoLib.testprotoLib.ProtoActionRepTest import * #ProtoActionRepTestSuite                         
from protoLib.testprotoLib.ProtoActionsTest import * #ProtoActionsTestSuite                             
from protoLib.testprotoLib.ProtoAuthTest import * #ProtoAuthTestSuite   
from protoLib.testprotoLib.ProtoGetDetailsTest import * #ProtoGetDetailsTestSuite
from protoLib.testprotoLib.ProtoGetPciTest import * #ProtoGetPciTestSuite    
from protoLib.testprotoLib.ProtoLoginTest import * #ProtoLoginTestSuite                                  
from protoLib.testprotoLib.ProtoMenuTest import * #ProtoMenuTestSuite                                   