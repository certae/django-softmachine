# The core system of my application

# Import XML module
from xml.etree.ElementTree import ElementTree
import xml.parsers.expat as expat
import xml.etree.ElementTree as Xml

# Conf Django 
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'proto.settings'

from django.core import management
import settings as settings 
management.setup_environ(settings)


# Import the logger
import logging

#Import Database class
from protoExt.models import *  


def toInteger(s , iDefault = None):
    """
    Conversion a entero,  utilizada antes de cargar la Db 
    """
    try:
        iResult = int(s)
        return iResult 
    except ValueError:
        return iDefault

def toBoolean(s):
    """
    Conversion a boolean,  utilizada antes de cargar la Db 
    """
    return ( s.lower()[0] in ("y", "t", "o", "s", "1") ) 


class importXML():
    def __init__(self):
        self.__filename = ""
        self.__tree = None
        self.__session = None

        
        self.__logger = logging.getLogger("Convert XML Database")
        self.__logger.setLevel(logging.DEBUG)
        
        formatter = logging.Formatter('[%(levelname)s] %(message)s')
        handler = logging.StreamHandler()
        handler.setFormatter(formatter)
        self.__logger.addHandler(handler)
        
        
        # Errors Constants
        self.OK = 0
        self.ERROR_OPEN_FILE = 1
        self.ERR0R_PARSE_XML = 2
        self.OPERATIONAL_ERROR = 3
        self.ADDING_ERROR = 4
        self.ERROR = 5
        
    # PRECONDITIONS : filename doit etre un fichier XML
    def loadFile(self, filename):
        # In oder to conserve the file
        self.__tree = ElementTree()
        
        #Logging info
        self.__logger.info("Chargement du fichier...")
        
        #self.__tree.parse(filename)
        try:
            self.__tree.parse(filename)
            self.__filename = filename
            
        except IOError:
            self.__logger.critical("Impossible d ouvrir le fichier...")
            return self.ERROR_OPEN_FILE
        except expat.ExpatError:
            self.__logger.critical("Erreur de parsage du fichier...")
            return self.ERR0R_PARSE_XML
        except:
            self.__logger.critical("Erreur de traitement fichier...")
            return self.ERROR
        
        #Logging info
        self.__logger.info("Chargement du fichier effectue...")
        
        return self.OK
        
        
    #RETOUR : le nom d un fichier XML
    def getFilename(self):
        return self.__filename
    
    # Transform XML Element  to text
    def getContentFile(self):
        
        #Logging info
        self.__logger.info("Obtention du contenu du fichier...")
        
        contenu = None
        if (self.__tree == None):
            contenu = ""
        else:
            contenu = Xml.tostring(self.__tree.getroot())
            
        #Logging info
        self.__logger.info("Obtention du contenu du fichier effectuee...")    
        return contenu
    
        
    def __write(self):

        #Logging info
        self.__logger.info("Ecriture dans la base de donnee...")

        #Listas 
#        fdsDomain = [field.name for field in Domain._meta.fields]
#        fdsModel= [field.name for field in Model._meta.fields]
#        fdsConcept= [field.name for field in Concept._meta.fields]
#        fdsProperty= [field.name for field in Property._meta.fields]
#        fdsForeign= [field.name for field in Relationship._meta.fields]

#        fdsLinkModel= [field.name for field in MetaLinkModel._meta.fields]
#        fdsLink = [field.name for field in MetaLink._meta.fields]
#        fdsUdpDefinition = [field.name for field in UdpDefinition._meta.fields]
#        field = None

        # Los elementos superXXX son referencias de tipo caracter,
        fdsDomain = ( 'code', 'category', 'description',  'origin', 'superDomain', 'alias', 'physicalName' )

        fdsModel= ( 'code', 'category', 'description',  'modelPrefix', 'superModel', 'alias', 'physicalName' )
        intModel= ( 'idModel', 'idRef' )
        
        fdsConcept= ( 'code', 'category', 'description',  'superConcept', 'alias', 'physicalName')
        
        fdsProperty = ( 'code', 'category', 'description',  'baseType', 'defaultValue', 'superProperty', 'alias', 'physicalName')
        booProperty = ( 'isNullable', 'isRequired', 'isSensitive', 'isEssential', 'isUnique', 'isForeign')
        intProperty = ( 'prpLength', 'conceptPosition', )
        
        fdsForeign= ( 'code', 'category', 'description', 'baseMin', 'baseMax', 'refMin', 'refMax', 'superProperty', 'baseConcept', 'alias', 'physicalName')

        fdsLinkModel= ['code', 'source', 'destination']
        fdsLink = ['code', 'alias', 'destinationText', 'sourceCol', 'destinationCol']
        fdsUdpDefinition = ['code', 'baseType', 'alias', 'description']
        
        # We populate the database
#       try: 
        if (self.__tree != None):  # A file has been loaded
        
            xDomains = self.__tree.getiterator("domain")
            
            for xDomain in xDomains:
                lDomain = Domain()
                for child in xDomain:
                    if child.tag in fdsDomain:
                        setattr( lDomain, child.tag, child.text ) 
                        
                try: 
                    lDomain.save()
                except:  pass 


                
                self.__logger.info("Domain..."  + lDomain.code)

                xUdpDefinitions = xDomain.getiterator("udpDefinition")
                for xUdpDefinition in xUdpDefinitions:
                    dUdpDefinition = UdpDefinition()
                    dUdpDefinition.domain = lDomain

                    for child in xUdpDefinition:
                        if child.tag in fdsUdpDefinition:
                            setattr( dUdpDefinition, child.tag, child.text ) 

                    try: 
                        dUdpDefinition.save()
                    except:  pass 

                
                xModels = xDomain.getiterator("model")
                for xModel in xModels:
                    dModel = Model()
                    dModel.domain = lDomain
                    udps = []

                    for child in xModel:
                        if child.tag in fdsModel:
                            setattr( dModel, child.tag, child.text )
                             
                        elif child.tag in intModel:
                            iValue = toInteger(child.text , 0)
                            setattr( dModel, child.tag, iValue ) 
                            
                        elif child.tag == 'udps':
                            for xUdp in child:
                                udps.append( (xUdp.tag, xUdp.get('text') ) )
                        else:
                            udps.append( (child.tag, child.text) )


                    for sKey in xModel.attrib:
                        if sKey in intModel:
                            iValue = toInteger(xModel.get(sKey) , 0)
                            setattr( dModel, sKey, iValue ) 
                            
                    dModel.save()
                    if len( udps ) > 0: self.saveUdps( udps, dModel.metaobj_ptr )
                    
                    self.__logger.info("Model..."  + dModel.code)

                    xConcepts = xModel.getiterator("concept")
                    for xConcept in xConcepts:
                        concept = Concept()
                        concept.model = dModel
                        
                        for child in xConcept:
                            if (child.tag in fdsConcept):
                                if (child.text is not None):
                                    setattr( concept, child.tag, child.text )
                                elif  ( child.tag == 'description' ):
                                    setattr( concept, child.tag, child.get('text'))

                            elif child.tag == 'udps':
                                for xUdp in child:
                                    udps.append( (xUdp.tag, xUdp.get('text') ) )
                            else:
                                udps.append( (child.tag, child.text) )
    
                        try:              
                            concept.save()
                        except: pass

                        if len( udps ) > 0: self.saveUdps( udps, concept.metaobj_ptr )
                        
                        self.__logger.info("Concept..."  + concept.code)

                        xPropertys = xConcept.getiterator("property")
                        for xProperty in xPropertys:
                            lProperty = Property()
                            lProperty.concept = concept

                            # Inicializa el diccionaccionario para las UDPS 
                            udps = []

                            for child in xProperty:
                                if child.tag in fdsProperty:
                                    if (child.text is not None):
                                        setattr( lProperty, child.tag, child.text )
                                    elif  ( child.tag == 'description' ):
                                        setattr( lProperty, child.tag, child.get('text'))
                                elif child.tag in intProperty:
                                    iValue = toInteger(child.text , 0)
                                    setattr( lProperty, child.tag, iValue )
                                elif child.tag in booProperty:
                                    bValue = toBoolean(child.text )
                                    setattr( lProperty, child.tag, bValue )
                                    
                                elif child.tag == 'udps':
                                    for xUdp in child:
                                        udps.append( (xUdp.tag, xUdp.get('text') ) )
                                else:
                                    udps.append( (child.tag, child.text) )
                                       
                            try: 
                                lProperty.save()
                            except: pass

                            if len( udps ) > 0: self.saveUdps( udps, lProperty.metaobj_ptr )


                        xForeigns = xConcept.getiterator("foreign")
                        for xForeign in xForeigns:
                            dForeign = Relationship()
                            dForeign.concept = concept

                            for child in xForeign:
                                if child.tag in fdsForeign:
                                    setattr( dForeign, child.tag, child.text)

                            for sKey in xForeign.attrib:
                                if sKey in fdsForeign:
                                    setattr( dForeign, sKey, xForeign.get(sKey) )
                                    
                            try:
                                dForeign.save()
                            except: pass

                xLinkModels = xDomain.getiterator("linkModel")
                for xLinkModel in xLinkModels:
                    dLinkModel = MetaLinkModel()
                    dLinkModel.domain = lDomain

                    for child in xLinkModel:
                        if child.tag in fdsLinkModel:
                            setattr( dLinkModel, child.tag, child.text ) 
                            
                    try:
                        dLinkModel.save()
                    except: pass
                    
                    self.__logger.info("LinkModel..."  + dLinkModel.code)

                    xLinks = xLinkModel.getiterator("link")
                    for xLink in xLinks:
                        dLink = MetaLink()
                        dLink.metaLinkModel = dLinkModel

                        for child in xLink:
                            if child.tag in fdsLink:
                                setattr( dLink, child.tag, child.text)
                                        
                        try:
                            dLink.save()
                        except: pass

                    

#        except KeyError, e:
#            #Logging critical
#            self.__logger.critical("Erreur d attribut.")
#            return {'state':self.ADDING_ERROR, 'message': 'Erreur attribut :'+str(e)} 
#                         
#        except Exception, e:
#            #Logging critical
#            self.__logger.critical("Impossible d ecrire dans la base de donnee.")
#            return {'state':self.ADDING_ERROR, 'message': str(e)} 
        
        #Logging info
        self.__logger.info("Ecriture dans la base de donnee effectuee...")
        
        return {'state':self.OK, 'message': 'Ecriture effectuee'}
    
    def writeDatabase(self): 
        # We write in the database
        dictWrite = self.__write()
        if (dictWrite['state'] != self.OK):
            return dictWrite
                
        return {'state':self.OK, 'message': 'Ecriture effectuee base donnee'}
    
    def saveUdps(self, udps, idMetaObj ):
        # Save Upds within de MetaObj 
        for key, value  in udps:
            dUdp = Udp()
            dUdp.metaObj = idMetaObj
            dUdp.code = key
            dUdp.valueUdp = value
            try:
                dUdp.save()
            except: pass

