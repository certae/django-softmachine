# The core system 
# Version 121020  trabaja con protoDict 

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
from protoDict.models import *  



class importDict():
    def __init__(self):
        self.__filename = ""
        self.__tree = None
        self.__session = None

        # Manejo del log 
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
#        fdsProject = [field.name for field in Project._meta.fields]
#        fdsModel= [field.name for field in Model._meta.fields]
#        fdsConcept= [field.name for field in Concept._meta.fields]
#        fdsProperty= [field.name for field in Property._meta.fields]
#        fdsForeign= [field.name for field in Relationship._meta.fields]

#        fdsLinkModel= [field.name for field in MetaLinkModel._meta.fields]
#        fdsLink = [field.name for field in MetaLink._meta.fields]
#        fdsUdpDefinition = [field.name for field in UdpDefinition._meta.fields]
#        field = None

        # Los elementos superXXX son referencias de tipo caracter,
        # fds  Field Description 
        # eqv  equivalences ( tupla con valores importados , vrCarga 
        fdsProject = ( 'code', 'category', 'description' )
        #eqvProject = ( ('origin', 'description')  )

        fdsModel= ( 'code', 'category',  'modelPrefix', 'conectionPath',  )
        
        fdsConcept= ( 'code', 'category',  'physicalName' )

        
        fdsPropertyConcept = ( 'alias', 'physicalName', 'foreignConcept' )
        booPropertyConcept = ( 'isNullable', 'isRequired', 'isSensitive', 'isEssential',  'isForeign')
        
        fdsRelationship = ( 'baseConcept', 'code', 'baseMin', 'baseMax', 'refMin', 'refMax', )

        fdsPropertyEquivalence = ('code', 'alias', 'description', )

        # We populate the database
        if (self.__tree != None):  # A file has been loaded
        
            xProjects = self.__tree.getiterator("domain")
            
            for xProject in xProjects:
                dProject = Project()
                for child in xProject:
                    if child.tag in fdsProject:
                        setattr( dProject, child.tag, child.text ) 
                        
                try: 
                    dProject.save()
                except:  
                    self.__logger.info("Error dProject.save")
                    return
                
                self.__logger.info("Project..."  + dProject.code)


                # ------------------------------------------------------------------------------
                xModels = xProject.getiterator("model")
                for xModel in xModels:
                    dModel = Model()
                    dModel.domain = dProject
                    modelUdps = []

                    for child in xModel:
                        if child.tag in fdsModel:
                            setattr( dModel, child.tag, child.text )
                        elif child.tag == 'udps':
                            for xUdp in child:
                                modelUdps.append( (xUdp.tag, xUdp.get('text') ) )

                    try:
                        dModel.save()
                    except:  
                        self.__logger.info("Error dModel.save")
                        return
                        
                    if len( modelUdps ) > 0: 
                        self.saveModelUdps( modelUdps, dModel )
                    
                    self.__logger.info("Model..."  + dModel.code)

                    # ------------------------------------------------------------------------------
                    xConcepts = xModel.getiterator("concept")
                    for xConcept in xConcepts:
                        dConcept = Concept()
                        dConcept.model = dModel
                        
                        for child in xConcept:
                            if (child.tag in fdsConcept):
                                if (child.text is not None):
                                    setattr( dConcept, child.tag, child.text )
                            elif  ( child.tag == 'description' ):
                                setattr( dConcept, child.tag, child.get('text'))
                            
                        try:              
                            dConcept.save()
                        except: 
                            self.__logger.info("Error dConcept.save")
                            return

                        self.__logger.info("Concept..."  + dConcept.code)

                        # ------------------------------------------------------------------------------
                        xPropertys = xConcept.getiterator("property")
                        for xProperty in xPropertys:
                            sCode = xProperty.find( 'code' ).text  
                            
                            prpConcept = PropertyConcept()
                            prpConcept.concept = dConcept

                            # Inicializa el diccionaccionario para las UDPS 
                            prpUdps = []

                            for child in xProperty:
                                if  ( child.tag == 'description' ):
                                    setattr( prpDom, child.tag, child.get('text'))

                                elif child.tag in fdsPropertyConcept:
                                    if (child.text is not None):
                                        setattr( prpConcept, child.tag, child.text )
                                    
                                elif child.tag in booPropertyConcept:
                                    bValue = toBoolean(child.text )
                                    setattr( prpConcept, child.tag, bValue )

                                elif child.tag == 'udps':
                                    for xUdp in child:
                                        prpUdps.append( (xUdp.tag, xUdp.get('text') ) )

                                       
                            try: 
                                prpDom.save()
                                prpConcept.save()
                            except: 
                                self.__logger.info("Error prpDom.save")
                                return

                            if len( prpUdps ) > 0: self.savePrpUdps( prpUdps, prpDom )

                        # Relationship -------------------------------------------------------------------
#                        xForeigns = xConcept.getiterator("foreign")
#                        for xForeign in xForeigns:
#                            dForeign = Relationship()
#                            dForeign.refConcept = dConcept
#
#                            for child in xForeign:
#                                if child.tag in fdsRelationship:
#                                    setattr( dForeign, child.tag, child.text)
#
#                            try:
#                                dForeign.save()
#                            except Exception, e: 
#                                self.__logger.info("Error dForeign.save"  + str(e))
#                                return

                # ------------------------------------------------------------------------------
#                xLinkModels = xProject.getiterator("linkModel")
#                for xLinkModel in xLinkModels:
#
#                    xLinks = xLinkModel.getiterator("link")
#
#                    for xLink in xLinks:
#                        dLink = PropertyEquivalence()
#
#                        #Obtiene las refs
#                        oAux = getPrpRef( dProject , xLink.find( 'sourceCol' ).text )
#                        if oAux:  dLink.sourceProperty = oAux  
#    
#                        oAux = getPrpRef( dProject , xLink.find( 'destinationCol').text )
#                        if oAux:  dLink.targetProperty = oAux  
#
#                        for child in xLink:
#                            if child.tag in fdsPropertyEquivalence:
#                                setattr( dLink, child.tag, child.text)
#                                        
#                        try:
#                            dLink.save()
#                        except: 
#                            self.__logger.info("Error dForeign.save")
#                            return

        
        #Logging info
        self.__logger.info("Ecriture dans la base de donnee effectuee...")
        return {'state':self.OK, 'message': 'Ecriture effectuee'}
    
        
    def writeDatabase(self): 
        # We write in the database
        dictWrite = self.__write()
        if (dictWrite['state'] != self.OK):
            return dictWrite
                
        return {'state':self.OK, 'message': 'Ecriture effectuee base donnee'}
    
    def saveModelUdps(self, udps, dModel ):
        for key, value  in udps:
            dUdp = UdpModel()
            dUdp.model = dModel
            dUdp.code = key
            dUdp.valueUdp = value
            try:
                dUdp.save()
            except: 
                pass

    def savePrpUdps(self, udps, dPrp ):
        for key, value  in udps:
            pass


def getModelRef( dProject, modelName  ):
    mAux = Model.objects.filter( domain = dProject, code = modelName )
    if mAux: 
        return mAux[0] 

def getPrpRef( dProject , propName  ):
    pass

def getConceptRef( dModel , cName  ):
    mAux = Concept.objects.filter( model = dModel, code = cName  )
    if mAux: 
        return mAux[0] 

