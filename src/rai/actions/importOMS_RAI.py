# -*- coding: utf-8 -*-

# Version 1403 Dgt  
from xml.etree.ElementTree import ElementTree


# Import Database class
from rai.models import  Modele, Entite, ElementDonnee, Relation, ModeleRaccordement, Raccordement
from protoLib.protoActionEdit import setSecurityInfo 

from protoLib.utils.logger import protoLog

class importOMS_RAI():

    def __init__(self, userProfile, dProject):

        self.domaff_modele = dProject
        self.__filename = ""
        self.__tree = None

        self.userProfile = userProfile

        # Manejo del log
        self.__logger = protoLog(userProfile.user, userProfile.userTeam , 'RAI')

        
        # Errors Constants
        self.OK = 0
        self.ERROR_OPEN_FILE = 1
        self.ERR0R_PARSE_XML = 2
        self.OPERATIONAL_ERROR = 3
        self.ADDING_ERROR = 4
        self.ERROR = 5
        


        # tuples equivalence ( Champs modèle de données RIA, Champs d'OMS ) 
        self.MODELE = { 
            'code' : 'nom_modele',
            'idModel' : 'idModel',
            'idRef' : 'idRef',
        }

        self.ENTITE = { 
            'code'          : 'nom_entite',
            'description'   : 'description_entite',
            'physicalName'  : 'physical_name'
        }  

        self.ELEMENT_DONNEE = { 
          # 'entite'            : 'entite_elem', 
            'code'  : 'nom_element_donnee',
            'alias' : 'numero_elem_cn',
            'description'      : 'description',
        }  

        self.ELEMENT_DONNEE_PP = {
            'FORMAT'              : 'type_de_base',
            'DEFINITION'          : 'definition',
            'ELEMENTTRANSFORME'   : 'element_transforme',
            'GABARIT'             : 'gabarit',
            'ELEMENTTRANSMIS'     : 'element_transmis',
            'DOMAINEDEVALEURS'    : 'domaine_valeurs',
            'ENTREEENVIGUEUR'     : 'date_entree_vigueur',
            'DATEDELADERNIEREMODIFICATION': 'date_derniere_modification',
            'DESCRIPTIONCN'     : 'consignes_saisie',
            'PRECISIONS'        : 'pratiques_acceptees',
            'VALIDATIONSSURELEMENT' : 'validation_sur_element',
            'VALIDATIONSINTERELEMENT': 'validations_inter_elements',
            'VALIDATIONINTERENREGISTREMENT' : 'validations_inter_enregistrement',
            'REQUISPAR'         : 'requis_par'
        } 

        self.RELATION = {
          # 'entite'            : 'entite_rela1', 
          # 'ref'               : 'entite_rela2', 
            'code'              : 'nom_relation',

            'baseConcept'       : 'tmp_foreign',
            'alias'             : 'tmp_alias',

            'description'       : 'description',
            'baseMin'           : 'baseMin',
            'baseMax'           : 'baseMax',
            'refMin'            : 'refMin',
            'refMax'            : 'refMax',
        } 


        self.MODELE_RACCORDEMENT = {
            'code'          : 'nom_modele_raccordement',
            'source'        : 'tmp_modrac1',
            'destination'   : 'tmp_modrac2',
        } 

        self.RACCORDEMENT = {
            # modrac_rac    
            'code'              : 'no_raccordement',
            'sourceCol'         : 'tmp_rac1',
            'destinationCol'    : 'tmp_rac2',

            'alias'             : 'tmp_alias',
            'destinationText'   : 'tmp_destt',
        } 



    def doImport(self): 

        #     
        dictWrite = self.__write()
        if (dictWrite['state'] != self.OK):
            return dictWrite

       
        return {'state':self.OK, 'message': 'Ecriture effectuee base donnee'}


    # filename doit etre un fichier XML
    def loadFile(self, filename):
        # In oder to conserve the file
        self.__tree = ElementTree()
        
        # Logging info
        self.__logger.info("Chargement du fichier...")
        
        # self.__tree.parse(filename)
        try:
            self.__tree.parse(filename)
            self.__filename = filename
            
        except IOError:
            self.__logger.error("Impossible d ouvrir le fichier...")
            return self.ERROR_OPEN_FILE
        except:
            self.__logger.error("Erreur de traitement fichier...")
            return self.ERROR
        
        # Logging info
        self.__logger.info("Chargement du fichier effectue...")
        
        return self.OK
    
        
    def __write(self):

        # Logging info
        self.__logger.info("Ecriture dans la base de donnee...")

        

        # need for setSecurityInfo 
        data = {}

        # We populate the database
        if (self.__tree != None):  # A file has been loaded
        
            xProjects = self.__tree.getiterator("domain")
            
            # ------------------------------------------------------------------------------
            xModels = xProjects[0].getiterator("model")
            for xModel in xModels:
                dModel = Modele()
                dModel.domaff_modele = self.domaff_modele 

                for child in xModel:
                    if child.tag in self.MODELE:
                        setattr(dModel, self.MODELE[ child.tag ], child.text)

                try:
                    setSecurityInfo(dModel, data, self.userProfile, True)
                    dModel.save()
                except Exception, e: 
                    self.__logger.info("Error dModel.save " + str(e))
                    
                self.__logger.info("Model..." + dModel.__str__())

                # ------------------------------------------------------------------------------
                xEntitys = xModel.getiterator("concept")
                for xEntity in xEntitys:
                    dEntity = Entite()
                    dEntity.entite_mod = dModel
                    
                    for child in xEntity:
                        if (child.tag in self.ENTITE):
                            if child.text is not None:
                                setattr(dEntity, self.ENTITE[ child.tag ] , child.text)

                            elif type( child.attrib ) == dict and 'text' in child.attrib : 
                                setattr(dEntity, self.ENTITE[ child.tag ] , child.get( 'text' )) 
                        
                    try:              
                        setSecurityInfo(dEntity, data, self.userProfile, True)
                        dEntity.save()
                    except Exception, e: 
                        self.__logger.info("Error dEntity.save" + str(e))

                    self.__logger.info("Entity..." + dEntity.__str__())

                    # ------------------------------------------------------------------------------
                    xProperties = xEntity.getiterator("property")
                    for xProperty in xProperties:
                        
                        dProperty = ElementDonnee()
                        dProperty.entite_elem = dEntity

                        for child in xProperty:
                            if child.tag in self.ELEMENT_DONNEE:
                                if (child.text is not None):
                                    setattr(dProperty, self.ELEMENT_DONNEE[ child.tag ], child.text)

                                elif type( child.attrib ) == dict and 'text' in child.attrib : 
                                    setattr(dProperty, self.ELEMENT_DONNEE[ child.tag ], child.get( 'text' )) 
                                

                            elif child.tag == 'udps':
                                for xUdp in child:
                                    if xUdp.tag in self.ELEMENT_DONNEE_PP:
                                        setattr(dProperty, self.ELEMENT_DONNEE_PP[ xUdp.tag ] , xUdp.get('text'))


                        try: 
                            setSecurityInfo(dProperty, data, self.userProfile, True)
                            dProperty.save()
                        except Exception, e:  
                            self.__logger.info("Error prpDom.save" + str(e))


                    # Relationship -------------------------------------------------------------------
                    xForeigns = xEntity.getiterator("foreign")
                    for xForeign in xForeigns:
                        dForeign = Relation()

                        dForeign.entite_rela1 = dEntity 
                        dForeign.entite_rela2 = dEntity

                        for child in xForeign:
                            if child.tag in self.RELATION:
                                setattr(dForeign, self.RELATION[ child.tag ], child.text)

                        try:
                            setSecurityInfo(dForeign, data, self.userProfile, True)
                            dForeign.save()
                        except Exception, e: 
                            self.__logger.info("Error dForeign.save" + str(e))


# RAC 
            # ------------------------------------------------------------------------------
            xLinkModels = xProjects[0].getiterator("linkModel")
            for xLinkModel in xLinkModels:
                dLinkModel = ModeleRaccordement()
                dLinkModel.tmp_domaff = self.domaff_modele 

                for child in xLinkModel:
                    if child.tag in self.MODELE_RACCORDEMENT:
                        setattr(dLinkModel, self.MODELE_RACCORDEMENT[ child.tag ], child.text)

                try:
                    setSecurityInfo(dLinkModel, data, self.userProfile, True)
                    dLinkModel.save()
                except Exception, e: 
                    self.__logger.info("Error dLinkModel.save" + dLinkModel.__str__() + str(e))
                    
                self.__logger.info("LinkModel..." + dLinkModel.__str__())

                # ------------------------------------------------------------------------------
                xLinks = xLinkModel.getiterator("link")
                for xLink in xLinks:
                    dLink = Raccordement()
                    dLink.modrac_rac = dLinkModel
                    
                    for child in xLink:
                        if (child.tag in self.RACCORDEMENT) and (child.text is not None):
                            setattr(dLink, self.RACCORDEMENT[ child.tag ] , child.text)
                    try:              
                        setSecurityInfo(dLink, data, self.userProfile, True)
                        dLink.save()
                    except  Exception, e:  
                        self.__logger.info("Error dLink.save" + str(e))

        
        # Logging info
        self.__logger.info("Ecriture dans la base de donnee effectuee...")
        return {'state':self.OK, 'message': 'Ecriture effectuee'}


    def doFkMatch(self):

        # from prototype.models import Project
        # self.dProject = Project.objects.get( code = "test1120")      
                
        # Recorre las llaves para asociar los FK 
        for dForeign in Relation.objects.filter(
            entite_rela1__entite_mod__domaff_modele=self.domaff_modele 
            ):
            
            try: 
                dReference = Entite.objects.get(entite_mod=dForeign.entite_rela1.entite_mod ,
                                                nom_entite=dForeign.tmp_foreign)
            except: 
                continue
            
            dForeign.entite_rela2 = dReference

            try: 
                dForeign.save()
            except Exception, e: 
                self.__logger.info("Error dForeign.save" + str(e))
                continue 
                
        # Logging info
        self.__logger.info("Fk mathc effectuee...")
        

    def doRacMatch(self):
        
        # Recorre las llaves para asociar los FK  ---------------------------------- 
        for dModRec in ModeleRaccordement.objects.filter(
            tmp_domaff=self.domaff_modele 
            ):
            
            try: 
                dReference1 = Modele.objects.get(
                    domaff_modele=self.domaff_modele,
                    nom_modele=dModRec.tmp_modrac1)

                dReference2 = Modele.objects.get(
                    domaff_modele=self.domaff_modele,
                    nom_modele=dModRec.tmp_modrac2)
            except: 
                continue
            
            
            dModRec.mod_modrac1 = dReference1
            dModRec.mod_modrac2 = dReference2

            try: 
                dModRec.save()
            except Exception, e: 
                self.__logger.info("Error dModRec.save" + str(e))
                continue 
            
            
            for dRac in Raccordement.objects.filter(
                modrac_rac=dModRec
                ):
            
                try: 
                    dReference1 = ElementDonnee.objects.filter(
                        entite_elem__entite_mod=dModRec.mod_modrac1,
                        nom_element_donnee=dRac.tmp_rac1)[0]

                    dReference2 = ElementDonnee.objects.filter(
                        entite_elem__entite_mod=dModRec.mod_modrac2,
                        nom_element_donnee=dRac.tmp_rac2)[0]
    
                except: 
                    continue
                
                
                dRac.eledon_rac1 = dReference1
                dRac.eledon_rac2 = dReference2
                    
                try: 
                    dRac.save()
                except Exception, e: 
                    self.__logger.info("Error dRac.save" + str(e))
                    continue 
            
                
        # Logging info
        self.__logger.info("Rac mathc effectuee...")
        
