#In order to test
import unittest

#The module to be tested
import importXML

"""
Yo must test individually the testfunctions!
 
Content of testFile
------------------------------------------------------------------------------
filename :"/home/dario/Documents/FichierXml/Exemple de raccordement2.xml"
Content :

<project name="Exemple de raccordement" >
  <datamodel name="Modele Conceptuel Corporatif" idmodel="1" idref="0">
    <table name="CONTACT" alias="" physicalName="" superTable="Table" >
      <column name="Identifiant contact" >
        <type></type>
        <nullAllowed>False</nullAllowed>
        <fullDisplayName>Exemple de raccordement COMPLET.sms: Modele Conceptuel Corporatif.CONTACT.Identifiant contact</fullDisplayName>
      </column>
      
    </table>
   
  </datamodel>
  
</project>
------------------------------------------------------------------------------
filename : /home/dario/Documents/FichierXml/Exemple de raccordement3.xml
Content :

<project name="Exemple de raccordement" >
  <datamodel name="Modele Conceptuel Corporatif" idmodel="1" idref="0">
    <table name="CONTACT" alias="" physicalName="" superTable="Table" >
      <column name="Identifiant contact" >
        <type></type>
        <nullAllowed>False</nullAllowed>
        <fullDisplayName>Exemple de raccordement COMPLET.sms: Modele Conceptuel Corporatif.CONTACT.Identifiant contact</fullDisplayName>
      </column>
      
    </table>
   

  
</project>
------------------------------------------------------------------------------
"""

class testSystemApp(unittest.TestCase):
    

    def setUp(self):
        self.__systemCore = importXML.importXML()
    
    def testLoadFilenameFichierValide(self):
        filename1 = "/home/dario/Documents/FichierXml/Exemple de raccordement2.xml"
        returnValue = self.__systemCore.loadFile(filename1)
        
        # We verify the equality
        self.assertEqual(returnValue, self.__systemCore.OK)
        
        # We verify the equality
        self.assertEqual(self.__systemCore.getFilename(), filename1)
        
        # We verify the equality
        contentFile = '<project name="Exemple de raccordement">\n'+'<datamodel idmodel="1" idref="0" name="Modele Conceptuel Corporatif">\n'+'<table alias="" name="CONTACT" physicalName="" superTable="Table">\n'+'<column name="Identifiant contact">\n'+'<type />\n'+'<nullAllowed>False</nullAllowed>\n'+'<fullDisplayName>Exemple de raccordement COMPLET.sms: Modele Conceptuel Corporatif.CONTACT.Identifiant contact</fullDisplayName>\n'+'</column>\n'+'</table>\n'+'</datamodel>\n'+'</project>'
        self.assertEqual(self.__systemCore.getContentFile(),contentFile)
      
        
    def testLoadFilenameFichierVide(self):
        filename2 = ""
        returnValue = self.__systemCore.loadFile(filename2)
        
        # We verify the equality
        self.assertEqual(returnValue, self.__systemCore.ERROR_OPEN_FILE)
         
    
    def testLoadFilenameFichierNonValide(self):
        filename = "/home/dario/Documents/FichierXml/Exemple de raccordement3.xml"
        returnValue = self.__systemCore.loadFile(filename)
        
        # we verify the equality
        self.assertEqual(returnValue, self.__systemCore.ERR0R_PARSE_XML)
        
        
    def testWriteDatabaseConnexion(self):
        filename = "/home/dario/Documents/FichierXml/Exemple de raccordement2.xml"
        dict = self.__systemCore.loadFile(filename)
        user = "hepot10"
        password = "ikioioi"
        host = "localhost"
        port = "5432"
        database = "openmodelxml"
        
        dict = self.__systemCore.writeDatabase(user, password, host, port, database)
        
        # Verify the equality
        self.assertEqual(dict['state'], self.__systemCore.OPERATIONAL_ERROR)
     
    def testVerifyWriteDatabase(self):
        
        filename = "/home/dario/Documents/FichierXml/Exemple de raccordement2.xml"
        dict = self.__systemCore.loadFile(filename)
        
        user = "hepot10"
        password = "admin13"
        host = "localhost"
        port = "5432"
        database = "openmodelxml"
        
        dict = self.__systemCore.writeDatabase(user, password, host, port, database)
        
        # Verify the equality
        self.assertEqual(dict['state'], self.__systemCore.OK)
        
        content = ""
        content += "projet Exemple de raccordement\n" 
        content += "datamodel 1, Modele Conceptuel Corporatif, 0\n"
        content += "table CONTACT, , , Table\n"
        content += "column Identifiant contact, None, False, Exemple de raccordement COMPLET.sms: Modele Conceptuel Corporatif.CONTACT.Identifiant contact, None, \n"
        
        self.assertEqual(content, self.__systemCore.getLastInsertedRow(user, password, host, port, database))
        
          
if __name__ == '__main__':
    unittest.main()
    