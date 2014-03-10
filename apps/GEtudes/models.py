# -*- coding: utf-8 -*-

# This is an auto-generated model module by CeRTAE SoftMachine v13.12dgt
# for model : "ll"
# You'll have to do the following manually to clean this up:
#     * Add specific procedures  (WFlow)

from django.db import models
from protoLib.models import ProtoModel
from protoLib.utilsBase import slugify


class ACTIVIT(models.Model):
    
    CODE_PHASE = models.ForeignKey('PHASE', null = False, related_name = "%(class)s_1")
    CODE_MEMBRE_EXTERN = models.ForeignKey('MEMBRE_1', related_name = "%(class)s_2")
    NO_STAGE  = models.ForeignKey('STAGE', related_name = "%(class)s_1")
    NO_PLAN_FORMATI = models.ForeignKey('PLAN_FO',related_name = "%(class)s_6")
    CODIR = models.ForeignKey('PROFESS', related_name = "%(class)s_7")
    NUMERO_D_EMPLO = models.ForeignKey('PROFESS', related_name = "%(class)s_8")
    #TRIMEST_ENTREE = models.ForeignKey('PLAN_FO', null = False, related_name = "%(class)s_4")
    TRIMEST_ENTREE = models.ForeignKey('FORMATI', related_name = "%(class)s_9")
    #NUMERO_PROGRAM = models.ForeignKey('PLAN_FO', null = False, related_name = "%(class)s_5")
    NUMERO_PROGRAM = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_10")
    #NUMERO_DE_DOSSIER = models.ForeignKey('PLAN_FO', null = False, related_name = "%(class)s_3")
    NUMERO_DE_DOSSIER = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_11")

    NO_ACTIVIT = models.CharField(null = False, max_length= 255)
    TITRE  = models.CharField(blank = True, null = True, max_length= 255)
    LANGUE = models.CharField(blank = True, null = True, max_length= 255)
    DATE_DEBUT = models.CharField(blank = True, null = True, max_length= 255)
    DATE_FIN  = models.CharField(blank = True, null = True, max_length= 255)
    TERMIN = models.CharField(blank = True, null = True, max_length= 255)
    REUSS = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('CODE_PHASE','NUMERO_DE_DOSSIER','TRIMEST_ENTREE','NUMERO_PROGRAM','NO_ACTIVIT')

#***********************************************************
#    Classe "AUTRE_S"
#***********************************************************

class AUTRE_S(models.Model):
    
    SIGLE = models.ForeignKey('DEPARTE', null = False, related_name = "%(class)s_1")
    NUMERO_PROGRAM = models.ForeignKey('CHEMINE', null = False, related_name = "%(class)s_2")
    CODE_CHEMINE = models.ForeignKey('CHEMINE', null = False, related_name = "%(class)s_3")
  
    class Meta:
        unique_together = ('NUMERO_PROGRAM','CODE_CHEMINE','SIGLE')
        
#***********************************************************
#    Classe "AVANCEM"
#***********************************************************

class AVANCEM(models.Model):
    
    CODE_PHASE = models.ForeignKey('PHASE', null = False, related_name = "%(class)s_1")
    NUMERO_DE_DOSSIER = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_2")
    TRIMEST_ENTREE = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_3")
    NUMERO_PROGRAM = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_4")   
    DATE_DEBUT = models.CharField(blank = True, null = True, max_length= 255)
    DATE_FIN = models.CharField(blank = True, null = True, max_length= 255)
    COMMENTA =  models.CharField(blank = True, null = True, max_length= 255)
 
    class Meta:
        unique_together = ('NUMERO_DE_DOSSIER','TRIMEST_ENTREE','NUMERO_PROGRAM','CODE_PHASE')
        
#***********************************************************
#    Classe "BLOC_CO"
#***********************************************************

class BLOC_CO(models.Model):
    
    NUMERO_D_EMPLO = models.ForeignKey('PROFESS', null = False, related_name = "%(class)s_1")
    CODE_BLOC_COURS = models.CharField(null = False, max_length= 255)
    NOM_BLOC_COURS = models.CharField(blank = True, null = True, max_length= 255)
    CREDITS_MAXI = models.CharField(blank = True, null = True, max_length= 255)
    CREDITS_MINI = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('CODE_BLOC_COURS',)
        
#***********************************************************
#    Classe "CAS_ET"
#***********************************************************

class CAS_ET(models.Model):
    
    NUMERO_PROGRAM = models.ForeignKey('PROGRAM', null = False, related_name = "%(class)s_1")
    NUMERO_DE_DOSSIER = models.ForeignKey('ETUDIAN', null = False, related_name = "%(class)s_2")
    DATE_DEBUT = models.CharField(blank = True, null = True, max_length= 255)
    DATE_FIN = models.CharField(blank = True, null = True, max_length= 255)
  
    class Meta:
        unique_together = ('NUMERO_DE_DOSSIER','NUMERO_PROGRAM',)
        
#***********************************************************
#    Classe "CHEMINE"
#***********************************************************

class CHEMINE(models.Model):

    SIGLE = models.ForeignKey('DEPARTE', null = False, related_name = "%(class)s_1")
    NUMERO_D_EMPLO = models.ForeignKey('PROFESS', null = False, related_name = "%(class)s_2")
    NUMERO_PROGRAM = models.ForeignKey('PROGRAM', null = False, related_name = "%(class)s_3")
  
    CODE_CHEMINE = models.CharField(null = False, max_length= 255)
    NOM           = models.CharField(blank = True, null = True, max_length= 255)
    DATE_ETABLIS = models.CharField(blank = True, null = True, max_length= 255)
    DATE_MODIFIC = models.CharField(blank = True, null = True, max_length= 255)
    VERSION       = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('NUMERO_PROGRAM','CODE_CHEMINE',)
        
#***********************************************************
#    Classe "CHOIX_BLOC"
#***********************************************************

class CHOIX_BLOC(models.Model):

    CODE_BLOC_COURS = models.ForeignKey('BLOC_CO', null = False, related_name = "%(class)s_1")
    NUMERO_DE_DOSSIER = models.ForeignKey('PLAN_FO', null = False, related_name = "%(class)s_2")
    TRIMEST_ENTREE = models.ForeignKey('PLAN_FO', null = False, related_name = "%(class)s_3")
    NUMERO_PROGRAM = models.ForeignKey('PLAN_FO', null = False, related_name = "%(class)s_4")
    NO_PLAN_FORMATI = models.ForeignKey('PLAN_FO', null = False, related_name = "%(class)s_5")
    REALISATION_CHEMP = models.ForeignKey('REALISA2', related_name = "%(class)s_6")
    CODE_CHEMINE = models.ForeignKey('REALISA2', related_name = "%(class)s_7")
    CODE_PHASE = models.ForeignKey('REALISA2', related_name = "%(class)s_8")
    REALISATION_CHEMCBC = models.ForeignKey('REALISA2', related_name = "%(class)s_9")

    class Meta:
        unique_together = ('NUMERO_DE_DOSSIER','TRIMEST_ENTREE','NUMERO_PROGRAM','NO_PLAN_FORMATI','CODE_BLOC_COURS',)
        
#***********************************************************
#    Classe "CHOIX_COURS"
#***********************************************************

class CHOIX_COURS(models.Model):
    
    CODE_BLOC_COURS = models.ForeignKey('COMPOSI', null = False, related_name = "%(class)s_1")
    NUMERO_COURS = models.ForeignKey('COMPOSI', related_name = "%(class)s_2")  
    COURS_SESSION_NUMERO_DU_COURS = models.ForeignKey('COURS_SESSI', related_name = "%(class)s_3")
    TRIMEST = models.ForeignKey('COURS_SESSI', related_name = "%(class)s_4")   
    NUMERO_DE_DOSSIER = models.ForeignKey('CHOIX_BLOC', null = False, related_name = "%(class)s_5")
    TRIMEST_ENTREE = models.ForeignKey('CHOIX_BLOC', null = False, related_name = "%(class)s_6")
    NUMERO_PROGRAM = models.ForeignKey('CHOIX_BLOC', null = False, related_name = "%(class)s_7")
    NO_PLAN_FORMATI = models.ForeignKey('CHOIX_BLOC', null = False, related_name = "%(class)s_8")
    CODE_BLOC_COURS = models.ForeignKey('CHOIX_BLOC', null = False, related_name = "%(class)s_9") 
    NUMERO_DU_COURS = models.ForeignKey('COURS', null = False, related_name = "%(class)s_10")
    TRIME           = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('CODE_BLOC_COURS','NO_PLAN_FORMATI','NUMERO_PROGRAM','TRIMEST_ENTREE','NUMERO_DE_DOSSIER','NUMERO_DU_COURS',)
        
#***********************************************************
#    Classe "COLLEGE"
#***********************************************************

class COLLEGE(models.Model):
    
    CODE_COLLEGE_UNIVE  = models.CharField(null = False, max_length= 255)
    NOM_COLLEGE_UNIVER = models.CharField(blank = True, null = True, max_length= 255)
    NOM_ABREGE      = models.CharField(blank = True, null = True, max_length= 255)
    ADRESSE         = models.CharField(blank = True, null = True, max_length= 255)
    CONTACT         = models.CharField(blank = True, null = True, max_length= 255)
    
    class Meta:
        unique_together = ('CODE_COLLEGE_UNIVE',)
        
#***********************************************************
#    Classe "COMIT_PROG_ETUD"
#***********************************************************

class COMIT_PROG_ETUD(models.Model):
    
    NUMERO_DE_DOSSIER = models.ForeignKey('ETUDIAN', null = False, related_name = "%(class)s_1")
    NUMERO_D_EMPLO = models.ForeignKey('PROFESS', null = False, related_name = "%(class)s_2")  
    DATE_DEBUT      = models.CharField(blank = True, null = True, max_length= 255)
    DATE_FIN        = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('NUMERO_D_EMPLO','NUMERO_DE_DOSSIER',)
        
#***********************************************************
#    Classe "COMIT_PROG_PROF"
#***********************************************************

class COMIT_PROG_PROF(models.Model):
    
    NUMERO_PROGRAM = models.ForeignKey('PROGRAM', null = False, related_name = "%(class)s_1")
    NUMERO_D_EMPLO = models.ForeignKey('PROFESS', null = False, related_name = "%(class)s_2")
  
    class Meta:
        unique_together = ('NUMERO_PROGRAM','NUMERO_D_EMPLO',)
        
#***********************************************************
#    Classe "COMPOSI"
#***********************************************************

class COMPOSI(models.Model):

    NUMERO_COURS = models.ForeignKey('COURS', null = False, related_name = "%(class)s_1")
    CODE_BLOC_COURS = models.ForeignKey('BLOC_CO', null = False, related_name = "%(class)s_2")
    OBLIGAT         = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('CODE_BLOC_COURS','NUMERO_COURS',)
        
#***********************************************************
#    Classe "COMPO_C"
#***********************************************************

class COMPO_C(models.Model):

    NUMERO_PROGRAM = models.ForeignKey('PROGRAM', null = False, related_name = "%(class)s_1")
    NUMERO_D_EMPLO = models.ForeignKey('PROFESS', null = False, related_name = "%(class)s_2")
  
    DATE_DEBUT      = models.CharField(blank = True, null = True, max_length= 255)
    DATE_FIN        = models.CharField(blank = True, null = True, max_length= 255)
  
    class Meta:
        unique_together = ('NUMERO_D_EMPLO','NUMERO_PROGRAM',)
        
#***********************************************************
#    Classe "COMPO_C1"
#***********************************************************

class COMPO_C1(models.Model):

    NUMERO_PROGRAM = models.ForeignKey('PROGRAM', null = False, related_name = "%(class)s_1")
    NUMERO_D_EMPLO = models.ForeignKey('PROFESS', null = False, related_name = "%(class)s_2")
  
    class Meta:
        unique_together = ('NUMERO_D_EMPLO','NUMERO_PROGRAM',)
        
#***********************************************************
#    Classe "COMPTE"
#***********************************************************

class COMPTE(models.Model):
    
    NUMERO_DE_DOSSIER = models.ForeignKey('ETUDIAN', null = False, related_name = "%(class)s_1")
    NUMERO_FACTURA  = models.CharField(null = False, max_length= 255)
    DATE_FACTURA    = models.CharField(blank = True, null = True, max_length= 255)
    DATE_EC         = models.CharField(blank = True, null = True, max_length= 255)
    SOLDE           = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('NUMERO_FACTURA',)
        
#***********************************************************
#    Classe "CONCOM"
#***********************************************************

class CONCOM(models.Model):

    COURS_CON = models.ForeignKey('COURS', null = False, related_name = "%(class)s_1")
    NUMERO_DU_COURS = models.ForeignKey('COURS', null = False, related_name = "%(class)s_2")

    class Meta:
        unique_together = ('COURS_CON','NUMERO_DU_COURS',)
        
#***********************************************************
#    Classe "CONSTIT"
#***********************************************************

class CONSTIT(models.Model):
    
    CODE_PHASE = models.ForeignKey('PHASE', null = False, related_name = "%(class)s_1")
    NUMERO_PROGRAM = models.ForeignKey('PROGRAM', null = False, related_name = "%(class)s_2")
    OBLIGAT         = models.CharField(blank = True, null = True, max_length= 255)
  
    class Meta:
        unique_together = ('NUMERO_PROGRAM','CODE_PHASE',)
        
#***********************************************************
#    Classe "COURS"
#***********************************************************

class COURS(models.Model):

    SIGLE = models.ForeignKey('DEPARTE', related_name = "%(class)s_1")
 
    NUMERO_DU_COURS = models.CharField(primary_key = True, null = False, max_length= 255)
    TYPEC           = models.CharField(blank = True, null = True, max_length= 255)
    NOMBRE_DE_CREDITS = models.CharField(blank = True, null = True, max_length= 255)
    DESCRIP         = models.CharField(blank = True, null = True, max_length= 255)
    OBJECTI         = models.CharField(blank = True, null = True, max_length= 255)
    VERSION         = models.CharField(blank = True, null = True, max_length= 255)
    SYLLABU         = models.CharField(blank = True, null = True, max_length= 255)
    TYPE_DE_RESULTA = models.CharField(blank = True, null = True, max_length= 255)
    OFFRE_PERMANE   = models.CharField(blank = True, null = True, max_length= 255)
    NOM_COURS       = models.CharField(blank = True, null = True, max_length= 255)
    MODIFI_TITRE    = models.CharField(blank = True, null = True, max_length= 255)
    MODIFI_CREDIT   = models.CharField(blank = True, null = True, max_length= 255)
    AUTOMN          = models.CharField(blank = True, null = True, max_length= 255)
    HIVER           = models.CharField(blank = True, null = True, max_length= 255)
    ETE             = models.CharField(blank = True, null = True, max_length= 255)
    R               = models.CharField(blank = True, null = True, max_length= 255)
    OFFRE_EXTERN    = models.CharField(blank = True, null = True, max_length= 255)
    FORMUL          = models.CharField(blank = True, null = True, max_length= 255)
    PR1             = models.CharField(blank = True, null = True, max_length= 255)
    PR2             = models.CharField(blank = True, null = True, max_length= 255)
    PR3             = models.CharField(blank = True, null = True, max_length= 255)
    PRE             = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('NUMERO_DU_COURS',)
        
#***********************************************************
#    Classe "COURS_S"
#***********************************************************

class COURS_S(models.Model):

    SECTION_NUMERO_DU_COURS = models.ForeignKey('SECTION', related_name = "%(class)s_1")
    SECTION_TRIMEST = models.ForeignKey('SECTION', related_name = "%(class)s_2")
    NUMERO_SECTION = models.ForeignKey('SECTION', related_name = "%(class)s_3")        
    C1 = models.ForeignKey('FORMATI', related_name = "%(class)s_4")
    C2 = models.ForeignKey('FORMATI', related_name = "%(class)s_5")
    C3 = models.ForeignKey('FORMATI', related_name = "%(class)s_6")   
    CODE_PHASE = models.ForeignKey('ACTIVIT', related_name = "%(class)s_7")
    TRIMEST = models.ForeignKey('INSCRIP', null = False, related_name = "%(class)s_15")           
    NUMERO_DU_COURS = models.ForeignKey('COURS', null = False, related_name = "%(class)s_16")
    C_NUMERO_DU_COURS = models.ForeignKey('CHOIX_COURS', related_name = "%(class)s_17")
    CHOIX_COURS2 = models.ForeignKey('CHOIX_COURS', null = False, related_name = "%(class)s_18")
    CHOIX_COURS3 = models.ForeignKey('CHOIX_COURS', null = False, related_name = "%(class)s_19")
    CHOIX_COURS4 = models.ForeignKey('CHOIX_COURS', null = False, related_name = "%(class)s_20")
    NO_PLAN_FORMATI = models.ForeignKey('CHOIX_COURS', null = False, related_name = "%(class)s_21")
    CODE_BLOC_COURS = models.ForeignKey('CHOIX_COURS', null = False, related_name = "%(class)s_22")
    NO_ACTIVIT = models.ForeignKey('ACTIVIT', related_name = "%(class)s_11")
            
    #NUMERO_DE_DOSSIER = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_8")
    NUMERO_DE_DOSSIER = models.ForeignKey('INSCRIP', null = False, related_name = "%(class)s_12")
    
    #TRIMEST_ENTREE = models.ForeignKey('ACTIVIT' and 'INSCRIP', null = False, related_name = "%(class)s_9")
    TRIMEST_ENTREE = models.ForeignKey('INSCRIP', null = False, related_name = "%(class)s_13")
        
    #NUMERO_PROGRAM = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_10")
    NUMERO_PROGRAM = models.ForeignKey('INSCRIP', null = False, related_name = "%(class)s_14")       

    EVALUAT         = models.CharField(blank = True, null = True, max_length= 255)
    REVISIO_EVALUAT = models.CharField(blank = True, null = True, max_length= 255)
    DATE_EVALUAT    = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('NUMERO_DE_DOSSIER','TRIMEST_ENTREE','NUMERO_PROGRAM','TRIMEST','NUMERO_DU_COURS',)
        
#***********************************************************
#    Classe "COURS_SESSI"
#***********************************************************

class COURS_SESSI(models.Model):

    TRIMEST = models.ForeignKey('TRIMES', null = False, related_name = "%(class)s_1")
    NUMERO_DU_COURS = models.ForeignKey('COURS', null = False, related_name = "%(class)s_2")

    NB_SECTI        = models.CharField(blank = True, null = True, max_length= 255)
    DEMI_SECTIO     = models.CharField(blank = True, null = True, max_length= 255)
    DATE_DEBUT      = models.CharField(blank = True, null = True, max_length= 255)
    DATE_FIN        = models.CharField(blank = True, null = True, max_length= 255)
  
    class Meta:
        unique_together = ('TRIMEST','NUMERO_DU_COURS',)
        
#***********************************************************
#    Classe "CREDIT_"
#***********************************************************

class CREDIT_(models.Model):

    NUMERO_DE_DOSSIER = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_1")
    TRIMEST_ENTREE = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_2")
    NUMERO_PROGRAM = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_3")
    CODE_COLLEGE_UNIVE = models.ForeignKey('COLLEGE', related_name = "%(class)s_4")
  
    NO_CREDIT_EXTERNE = models.CharField(null = False, max_length= 255)
    NOM             = models.CharField(blank = True, null = True, max_length= 255)
    NB_CREDITS      = models.CharField(blank = True, null = True, max_length= 255)
    SYLLABU         = models.CharField(blank = True, null = True, max_length= 255)
    APPROBA         = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('NUMERO_DE_DOSSIER','TRIMEST_ENTREE','NUMERO_PROGRAM','NO_CREDIT_EXTERNE',)
        
#***********************************************************
#    Classe "DEMANDE"
#***********************************************************

class DEMANDE(models.Model):

    CODE_FAMILLE_EVE = models.ForeignKey('FAMILLE', related_name = "%(class)s_1")
    Report1NUM = models.ForeignKey('DEMANDE', related_name = "%(class)s_2")
    Report1TRIM = models.ForeignKey('DEMANDE', related_name = "%(class)s_3")
    NUMERO_DE_DOSSIER = models.ForeignKey('ETUDIAN', null = False,related_name = "%(class)s_4")

    TRIMEST_ENTREE = models.CharField(null = False, max_length= 255)
    DATE_RECEPTI   = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('NUMERO_DE_DOSSIER','TRIMEST_ENTREE',)
        
#***********************************************************
#    Classe "DEM_ADM"
#***********************************************************

class DEM_ADM(models.Model):

    CODE_CHEMINE = models.ForeignKey('CHEMINE', related_name = "%(class)s_1")
    #NUMERO_PROGRAM = models.ForeignKey('CHEMINE', null = False, related_name = "%(class)s_2")
    NUMERO_PROGRAM = models.ForeignKey('PROGRAM', null = False, related_name = "%(class)s_3")
    TRIMEST_ENTREE = models.ForeignKey('DEMANDE', null = False, related_name = "%(class)s_4")

    NUMERO_DE_DOSSIER = models.ForeignKey('DEMANDE', null = False, related_name = "%(class)s_5")
    #NUMERO_DE_DOSSIER = models.ForeignKey('ETUDIAN', null = False, related_name = "%(class)s_6")
 
    DATE_ENVOI      = models.CharField(blank = True, null = True, max_length= 255)
    DATE_REPONSE    = models.CharField(blank = True, null = True, max_length= 255)
    DATE_ACCUS_RECEP = models.CharField(blank = True, null = True, max_length= 255)
    DATE_RELANCE    = models.CharField(blank = True, null = True, max_length= 255)
    REPONSE         = models.CharField(blank = True, null = True, max_length= 255)
    COMMENTA        = models.CharField(blank = True, null = True, max_length= 255)
    BR_60_ET_BR_60  = models.CharField(blank = True, null = True, max_length= 255)
    CV              = models.CharField(blank = True, null = True, max_length= 255)
    NOTES_1_CYCLE   = models.CharField(blank = True, null = True, max_length= 255)
    RECOM           = models.CharField(blank = True, null = True, max_length= 255)
    DOC_COMPL__PHD_1 = models.CharField(blank = True, null = True, max_length= 255)
    NOTES_2_CYCLE   = models.CharField(blank = True, null = True, max_length= 255)
   
    class Meta:
        unique_together = ('NUMERO_DE_DOSSIER','TRIMEST_ENTREE','NUMERO_PROGRAM',)
        
#***********************************************************
#    Classe "DEPARTE"
#***********************************************************

class DEPARTE(models.Model):

    SIGLE = models.CharField(null = False, max_length= 255)
    NOM_DEPARTEMENT = models.CharField(blank = True, null = True, max_length= 255)
    
    class Meta:
        unique_together = ('SIGLE',)
        
#***********************************************************
#    Classe "DISPENS"
#***********************************************************

class DISPENS(models.Model):
    
    NUMERO_DU_COURS = models.ForeignKey('COURS', null = False, related_name = "%(class)s_1")
    NUMERO_D_EMPLO = models.ForeignKey('PROFESS', null = False, related_name = "%(class)s_2")

    class Meta:
        unique_together = ('NUMERO_D_EMPLO','NUMERO_DU_COURS',)
        
#***********************************************************
#    Classe "EQUIVAL"
#***********************************************************

class EQUIVAL(models.Model):
    
    COURS6NUM = models.ForeignKey('COURS', null = False, related_name = "%(class)s_1")
    NUMERO_DU_COURS = models.ForeignKey('COURS', null = False, related_name = "%(class)s_2")
    
    class Meta:
        unique_together = ('NUMERO_DU_COURS','COURS6NUM',)
        

#***********************************************************
#    Classe "ETUDIAN"
#***********************************************************

class ETUDIAN(models.Model):

    NUMERO_DE_DOSSIER = models.CharField(null = False, max_length= 255)
    NOM_ETUDIANT    = models.CharField(blank = True, null = True, max_length= 255)
    PRENOM_ETUDIANT = models.CharField(blank = True, null = True, max_length= 255)
    ADRESSE         = models.CharField(blank = True, null = True, max_length= 255)
    DATE_DE_NAISSAN = models.CharField(blank = True, null = True, max_length= 255)
    TELEPHO_TRAVAIL = models.CharField(blank = True, null = True, max_length= 255)
    TELEPHO_MAISON  = models.CharField(blank = True, null = True, max_length= 255)
    LANGUE_MATERNE  = models.CharField(blank = True, null = True, max_length= 255)
    LANGUE_D_USAGE  = models.CharField(blank = True, null = True, max_length= 255)
    LIEU_DE_NAISSAN = models.CharField(blank = True, null = True, max_length= 255)
    HANDICA         = models.CharField(blank = True, null = True, max_length= 255)
    CODE_PERMANE_ETUDI = models.CharField(blank = True, null = True, max_length= 255)
    DEC_1            = models.CharField(blank = True, null = True, max_length= 255)
    PUBLICA         = models.CharField(blank = True, null = True, max_length= 255)
    STATUT          = models.CharField(blank = True, null = True, max_length= 255)
 
    class Meta:
        unique_together = ('NUMERO_DE_DOSSIER',)    

#***********************************************************
#    Classe "EVENEME"
#***********************************************************

class EVENEME(models.Model):

    CODE_TYPE_EVENEME = models.ForeignKey('TYPE_EV', related_name = "%(class)s_1")
    
    CODE_PHASE = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_2")
    NUMERO_DE_DOSSIER = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_3")
    TRIMEST_ENTREE = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_4")
    NUMERO_PROGRAM = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_5")
    NO_ACTIVIT = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_6")
        
    FAMILLE_EVENEMENT3 = models.ForeignKey('FAMILLE1', null = False, related_name = "%(class)s_7")
    CODE_FAMILLE_EVE = models.ForeignKey('FAMILLE1', null = False, related_name = "%(class)s_8")
    
    NUMERO_EVEACT   = models.CharField(null = False, max_length= 255)
    DATE_EN         = models.CharField(blank = True, null = True, max_length= 255)
    DATE_FE         = models.CharField(blank = True, null = True, max_length= 255)
    DATE_ALARME     = models.CharField(blank = True, null = True, max_length= 255)
    COMPLET         = models.CharField(blank = True, null = True, max_length= 255)
    COMMENTA        = models.CharField(blank = True, null = True, max_length= 255)
    DATE1           = models.CharField(blank = True, null = True, max_length= 255)
    DATE2           = models.CharField(blank = True, null = True, max_length= 255)
    DATE3           = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR1         = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR2         = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR3         = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('CODE_PHASE','NUMERO_DE_DOSSIER','TRIMEST_ENTREE','NUMERO_PROGRAM','NO_ACTIVIT','NUMERO_EVEACT',)
        
#***********************************************************
#    Classe "EVENEME2"
#***********************************************************

class EVENEME2(models.Model):
    
    CODE_MEMBRE_EXTERN = models.ForeignKey('MEMBRE_1', null = False, related_name = "%(class)s_1")
    NUMERO_D_EMPLO = models.ForeignKey('PROFESS', related_name = "%(class)s_2")
    CODE_TYPE_EVENEME = models.ForeignKey('TYPE_EV', related_name = "%(class)s_3")
    
    CODE_PHASE = models.ForeignKey('EVENEME', null = False, related_name = "%(class)s_4")
    NUMERO_DE_DOSSIER = models.ForeignKey('EVENEME', null = False, related_name = "%(class)s_5")
    TRIMEST_ENTREE = models.ForeignKey('EVENEME', null = False, related_name = "%(class)s_6")
    NUMERO_PROGRAM = models.ForeignKey('EVENEME', null = False, related_name = "%(class)s_7")
    NO_ACTIVIT = models.ForeignKey('EVENEME', null = False, related_name = "%(class)s_8")
    NUMERO_EVEACT = models.ForeignKey('EVENEME', null = False, related_name = "%(class)s_9")
    
    SOUSEVENEMENT = models.ForeignKey('SOUS_', null = False, related_name = "%(class)s_10")
    SOUS_EVENEMENT_CTE = models.ForeignKey('SOUS_', null = False, related_name = "%(class)s_11")
    CODE_FAMILLE_EVE = models.ForeignKey('SOUS_', null = False, related_name = "%(class)s_12")
    NUMERO_EVEPER   = models.CharField(blank = True, null  = False, max_length= 255)
    DATE_EN         = models.CharField(blank = True, null = True, max_length= 255)
    DATE_FE         = models.CharField(blank = True, null = True, max_length= 255)
    DATE_ALARME     = models.CharField(blank = True, null = True, max_length= 255)
    COMPLET         = models.CharField(blank = True, null = True, max_length= 255)
    COMMENTA        = models.CharField(blank = True, null = True, max_length= 255)
    DATE1           = models.CharField(blank = True, null = True, max_length= 255)
    DATE2           = models.CharField(blank = True, null = True, max_length= 255)
    DATE3           = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR1         = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR2         = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR3         = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('CODE_PHASE','NUMERO_DE_DOSSIER','TRIMEST_ENTREE','NUMERO_PROGRAM','NO_ACTIVIT','NUMERO_EVEACT','NUMERO_EVEPER',)
        
#***********************************************************
#    Classe "EVENEME3"
#***********************************************************

class EVENEME3(models.Model):

    CODE_TYPE_EVENEME = models.ForeignKey('TYPE_EV', null = False, related_name = "%(class)s_1")
    
    NUMERO_DE_DOSSIER = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_2")
    TRIMEST_ENTREE = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_3")
    NUMERO_PROGRAM = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_4")
    
    CODE_FAMILLE_EVE = models.ForeignKey('FAMILLE1', related_name = "%(class)s_5")
    FAMILLE_EVENEMENT2 = models.ForeignKey('FAMILLE1', related_name = "%(class)s_6")
      
    NUMERO_EVEFOR   = models.CharField(null = False, max_length= 255)
    DATE_EN         = models.CharField(blank = True, null = True, max_length= 255)
    DATE_FE         = models.CharField(blank = True, null = True, max_length= 255)
    DATE_ALARME     = models.CharField(blank = True, null = True, max_length= 255)
    COMPLET         = models.CharField(blank = True, null = True, max_length= 255)
    COMMENTA        = models.CharField(blank = True, null = True, max_length= 255)
    DATE1           = models.CharField(blank = True, null = True, max_length= 255)
    DATE2           = models.CharField(blank = True, null = True, max_length= 255)
    DATE3           = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR1         = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR2         = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR3         = models.CharField(blank = True, null = True, max_length= 255)
      
    class Meta:
        unique_together = ('NUMERO_DE_DOSSIER','TRIMEST_ENTREE','NUMERO_PROGRAM','NUMERO_EVEFOR',)

#***********************************************************
#    Classe "EVENEME4"
#***********************************************************

class EVENEME4(models.Model):

    #NUMERO_DE_DOSSIER = models.ForeignKey('DEM_ADM', null = False, related_name = "%(class)s_1")
    #NUMERO_DE_DOSSIER = models.ForeignKey('REPONDA', null = False, related_name = "%(class)s_4")
    NUMERO_DE_DOSSIER = models.ForeignKey('DEMANDE', null = False, related_name = "%(class)s_6")
    
    TRIMEST_ENTREE = models.ForeignKey('DEMANDE', null = False, related_name = "%(class)s_7")
    #TRIMEST_ENTREE = models.ForeignKey('DEM_ADM', null = False, related_name = "%(class)s_2")
    #TRIMEST_ENTREE = models.ForeignKey('REPONDA', null = False, related_name = "%(class)s_5") 
    
    NUMERO_PROGRAM = models.ForeignKey('DEM_ADM', related_name = "%(class)s_1")      
    CODE_TYPE_EVENEME = models.ForeignKey('TYPE_EV', null = False, related_name = "%(class)s_3")   
    NO_REPONDA = models.ForeignKey('REPONDA', related_name = "%(class)s_1")
    CODE_FAMILLE_EVE = models.ForeignKey('FAMILLE1', related_name = "%(class)s_8")
    FAMILLE_EVENEMENT2 = models.ForeignKey('FAMILLE1', related_name = "%(class)s_9")

    NUMERO_EVEADM   = models.CharField(null = False, max_length= 255)
    DATE_EN         = models.CharField(blank = True, null = True, max_length= 255)
    DATE_FE         = models.CharField(blank = True, null = True, max_length= 255)
    DATE_ALARME     = models.CharField(blank = True, null = True, max_length= 255)
    COMPLET         = models.CharField(blank = True, null = True, max_length= 255)
    COMMENTA        = models.CharField(blank = True, null = True, max_length= 255)
    DATE1           = models.CharField(blank = True, null = True, max_length= 255)
    DATE2           = models.CharField(blank = True, null = True, max_length= 255)
    DATE3           = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR1         = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR2         = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR3         = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('NUMERO_DE_DOSSIER','TRIMEST_ENTREE','NUMERO_EVEADM',)

#***********************************************************
#    Classe "EVENEME5"
#***********************************************************

class EVENEME5(models.Model):
    
    CODE_TYPE_EVENEME = models.ForeignKey('TYPE_EV', null = False, related_name = "%(class)s_1")
    NUMERO_D_EMPLO = models.ForeignKey('PROFESS', null = False, related_name = "%(class)s_2")
    
    NUMERO_DE_DOSSIER = models.ForeignKey('EVENEME4', null = False, related_name = "%(class)s_3")
    TRIMEST_ENTREE = models.ForeignKey('EVENEME4', null = False, related_name = "%(class)s_4")
    NUMERO_EVEADM = models.ForeignKey('EVENEME4', null = False, related_name = "%(class)s_5")
        
    SOUSEVENEMENT = models.ForeignKey('SOUS_', related_name = "%(class)s_6")
    CODE_FAMILLE_EVE = models.ForeignKey('SOUS_', related_name = "%(class)s_7")
    SOUS_EVENEMENT_CTE = models.ForeignKey('SOUS_', related_name = "%(class)s_8")
    
    NUMERO_EVEADMP  = models.CharField(null = False, max_length= 255)
    DATE_ALARME     = models.CharField(blank = True, null = True, max_length= 255)
    COMPLET         = models.CharField(blank = True, null = True, max_length= 255)
    COMMENTA        = models.CharField(blank = True, null = True, max_length= 255)
    DATE1           = models.CharField(blank = True, null = True, max_length= 255)
    DATE2           = models.CharField(blank = True, null = True, max_length= 255)
    DATE3           = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR1         = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR2         = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR3         = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('NUMERO_DE_DOSSIER','TRIMEST_ENTREE','NUMERO_EVEADM','NUMERO_EVEADMP',)

#***********************************************************
#    Classe "FAMILLE"
#***********************************************************

class FAMILLE(models.Model):

    CODE_FAMILLE_EVE = models.CharField(null = False, max_length= 255)
    NOM_FAMILLE_EVE = models.CharField(blank = True, null = True, max_length= 255)
    
    class Meta:
        unique_together = ('CODE_FAMILLE_EVE',)
        
#***********************************************************
#    Classe "FAMILLE1"
#***********************************************************

class FAMILLE1(models.Model):

    CODE_TYPE_EVENEM = models.ForeignKey('TYPE_EV', null = False, related_name = "%(class)s_1")
    CODE_FAMILLE_EVE = models.ForeignKey('FAMILLE', null = False, related_name = "%(class)s_2")
  
    OBLIG           = models.CharField(blank = True, null = True, max_length= 255)
    
    class Meta:
        unique_together = ('CODE_FAMILLE_EVE','CODE_TYPE_EVENEM',)
        
#***********************************************************
#    Classe "FORMATI"
#***********************************************************

class FORMATI(models.Model):
    
    NUMERO_D_EMPLO = models.ForeignKey('PROFESS', related_name = "%(class)s_1")
    CODE_FAMILLE_EVE = models.ForeignKey('FAMILLE', related_name = "%(class)s_2")
    TRIMEST_ENTREE = models.ForeignKey('DEM_ADM', null = False, related_name = "%(class)s_3")
    NUMERO_PROGRAM = models.ForeignKey('DEM_ADM', null = False, related_name = "%(class)s_4")
    
    NUMERO_DE_DOSSIER = models.ForeignKey('DEM_ADM', null = False, related_name = "%(class)s_5")
    #NUMERO_DE_DOSSIER = models.ForeignKey('ETUDIAN', null = False, related_name = "%(class)s_6")

    DATE_DI         = models.CharField(blank = True, null = True, max_length= 255)
    STATUT          = models.CharField(blank = True, null = True, max_length= 255)
   
    class Meta:
        unique_together = ('NUMERO_DE_DOSSIER','TRIMEST_ENTREE','NUMERO_PROGRAM',)
        
#***********************************************************
#    Classe "INSCRIP"
#***********************************************************

class INSCRIP(models.Model):
    
    NUMERO_DE_DOSSIER = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_1")
    TRIMEST_ENTREE = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_2")
    NUMERO_PROGRAM = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_3")
    
    TRIMEST            = models.CharField(null = False, max_length= 255)
    
    class Meta:
        unique_together = ('NUMERO_DE_DOSSIER','TRIMEST_ENTREE','NUMERO_PROGRAM','TRIMEST',)
        
#***********************************************************
#    Classe "MEMBRE_"
#***********************************************************

class MEMBRE_(models.Model):

    CODE_PHASE = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_1")
    NUMERO_DE_DOSSIER = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_2")
    TRIMEST_ENTREE = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_3")
    NUMERO_PROGRAM = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_4")
    NO_ACTIVIT = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_5")
    NUMERO_D_EMPLO = models.ForeignKey('PROFESS', null = False, related_name = "%(class)s_6")
    
    class Meta:
        unique_together = ('NUMERO_D_EMPLO','CODE_PHASE','NUMERO_DE_DOSSIER',
                           'TRIMEST_ENTREE','NUMERO_PROGRAM','NO_ACTIVIT',)
        
#***********************************************************
#    Classe "MEMBRE_1"
#***********************************************************

class MEMBRE_1(models.Model):

    CODE_MEMBRE_EXTERN  = models.CharField(null = False, max_length= 255)
    NOM_EXTERNE      = models.CharField(unique = True, null = False, max_length= 255)
    PRENOM_EXTERNE  = models.CharField(blank = True, null = True, max_length= 255)
    HABILIT__1       = models.CharField(blank = True, null = True, max_length= 255)
    TELEPHO_TRAVAIL = models.CharField(blank = True, null = True, max_length= 255)
    TELEPHO_MAISON  = models.CharField(blank = True, null = True, max_length= 255)
    NUMERO_FAX      = models.CharField(blank = True, null = True, max_length= 255)
    ADRESSE_INTERNE = models.CharField(blank = True, null = True, max_length= 255)
    ADRESSE         = models.CharField(blank = True, null = True, max_length= 255)
    DATE_HABILIT    = models.CharField(blank = True, null = True, max_length= 255)
    
    class Meta:
        unique_together = ('CODE_MEMBRE_EXTERN','NOM_EXTERNE',)

#***********************************************************
#    Classe "MEMBRE_2"
#***********************************************************

class MEMBRE_2(models.Model):
    
    CODE_PHASE = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_1")
    NO_ACTIVIT = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_2")
    NUMERO_PROGRAM = models.ForeignKey('ACTIVIT', null = False,related_name = "%(class)s_3")
    TRIMEST_ENTREE = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_4")
    NUMERO_DE_DOSSIER = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_5")  
    CODE_MEMBRE_EXTERN = models.ForeignKey('MEMBRE_1', null = False, related_name = "%(class)s_6")
    
    class Meta:
        unique_together = ('CODE_MEMBRE_EXTERN', 'CODE_PHASE', 'NUMERO_DE_DOSSIER',
                           'TRIMEST_ENTREE','NUMERO_PROGRAM','NO_ACTIVIT',)
        
#***********************************************************
#    Classe "PHASE"
#***********************************************************

class PHASE(models.Model):
    
    CODE_FAMILLE_EVE = models.ForeignKey('FAMILLE', related_name = "%(class)s_1")
    
    CODE_PHASE      = models.CharField(null = False, max_length= 255)
    NOM_PHASE       = models.CharField(blank = True, null = True, max_length= 255)
    TYPE_ACTIVIT    = models.CharField(blank = True, null = True, max_length= 255)
    DUREE           = models.CharField(blank = True, null = True, max_length= 255)
    NB_CRED         = models.CharField(blank = True, null = True, max_length= 255)
    NB_CRED1        = models.CharField(blank = True, null = True, max_length= 255)
    JURY_1           = models.CharField(blank = True, null = True, max_length= 255)
    NOTE_1           = models.CharField(blank = True, null = True, max_length= 255)
    
    CODE_FAMILLE_EVE = models.CharField(blank = True, null = True, max_length= 255)
    
    REGLE           = models.CharField(blank = True, null = True, max_length= 255)
    
    class Meta:
        unique_together = ('CODE_PHASE',)
        
#***********************************************************
#    Classe "PHASE_C"
#***********************************************************

class PHASE_C(models.Model):

    CODE_PHASE = models.ForeignKey('PHASE', null = False, related_name = "%(class)s_1")
    NUMERO_PROGRAM = models.ForeignKey('CHEMINE', null = False, related_name = "%(class)s_2")
    CODE_CHEMINE = models.ForeignKey('CHEMINE', null = False, related_name = "%(class)s_3")

    OBLIGAT         = models.CharField(blank = True, null = True, max_length= 255)
    CREDITS_MINI    = models.CharField(blank = True, null = True, max_length= 255)
    CREDITS_MAXI    = models.CharField(blank = True, null = True, max_length= 255)
    DUREE_MAXI      = models.CharField(blank = True, null = True, max_length= 255)
   
    class Meta:
        unique_together = ('NUMERO_PROGRAM','CODE_CHEMINE','CODE_PHASE',)
        
#***********************************************************
#    Classe "PLANI_COURS"
#***********************************************************

class PLANI_COURS(models.Model):

    NUMERO_DU_COURS = models.ForeignKey('COURS_SESSI', null = False, related_name = "%(class)s_1")
    TRIMEST = models.ForeignKey('COURS_SESSI', null = False, related_name = "%(class)s_2")
    NUMERO_D_EMPLO = models.ForeignKey('PROFESS', null = False, related_name = "%(class)s_3")
    
    class Meta:
        unique_together = ('NUMERO_D_EMPLO','TRIMEST','NUMERO_DU_COURS',)
        
#***********************************************************
#    Classe "PLAN_FO"
#***********************************************************

class PLAN_FO(models.Model):

    CODE_PHASE = models.ForeignKey('PHASE', null = False, related_name = "%(class)s_1")
    NUMERO_DE_DOSSIER = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_2")
    TRIMEST_ENTREE = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_3")
    NUMERO_PROGRAM = models.ForeignKey('FORMATI', null = False, related_name = "%(class)s_4")
 
    NO_PLAN_FORMATI   = models.CharField(null = False, max_length= 255)
    TRIMEST_DEBUT   = models.CharField(blank = True, null = True, max_length= 255)
    TRIMEST_FIN     = models.CharField(blank = True, null = True, max_length= 255)

    
    class Meta:
        unique_together = ('NUMERO_DE_DOSSIER','TRIMEST_ENTREE','NUMERO_PROGRAM','NO_PLAN_FORMATI',)
        
#***********************************************************
#    Classe "PRE_CAT"
#***********************************************************

class PRE_CAT(models.Model):

    NUMERO_DU_COURS = models.ForeignKey('COURS', null = False, related_name = "%(class)s_1")
    COURS12NUM = models.ForeignKey('COURS', null = False, related_name = "%(class)s_2")
    
    class Meta:
        unique_together = ('COURS12NUM','NUMERO_DU_COURS',)

#***********************************************************
#    Classe "PROFESS"
#***********************************************************

class PROFESS(models.Model):

    SIGLE = models.ForeignKey('DEPARTE', null = False, related_name = "%(class)s_1")

    NUMERO_D_EMPLO  = models.CharField(null = False, max_length= 255)
    N_A_S_1          = models.CharField(unique = True, null = False, max_length= 255)
    NOM_PROF        = models.CharField(unique = True, null = False, max_length= 255)
    PRENOM_PROF     = models.CharField(blank = True, null = True, max_length= 255)
    ADRESSE_INTERNE = models.CharField(blank = True, null = True, max_length= 255)
    QUALIFI         = models.CharField(blank = True, null = True, max_length= 255)
    NUMERO_FAX      = models.CharField(blank = True, null = True, max_length= 255)
    ADRESSE         = models.CharField(blank = True, null = True, max_length= 255)
    NUMERO_TEL__MAISON = models.CharField(blank = True, null = True, max_length= 255)
    NUMERO_TEL__TRAVAI = models.CharField(blank = True, null = True, max_length= 255)
    DIRECTE         = models.CharField(blank = True, null = True, max_length= 255)
    NUMERO_BUREAU   = models.CharField(blank = True, null = True, max_length= 255)
    DATE_AFFECTA    = models.CharField(blank = True, null = True, max_length= 255)
    INTER_DE_RECHE  = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('NUMERO_D_EMPLO',)
        
#***********************************************************
#    Classe "PROGRAM"
#***********************************************************

class PROGRAM(models.Model):

    NUMERO_PROGRAM  = models.CharField(null = False, max_length= 255)
    NOM_PROGRAMME   = models.CharField(blank = True, null = True, max_length= 255)
    TYPEP           = models.CharField(blank = True, null = True, max_length= 255)
    CYCLE           = models.CharField(blank = True, null = True, max_length= 255)
    NB_CRED         = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('NUMERO_PROGRAM',)

#***********************************************************
#    Classe "PROVE_ETUD"
#***********************************************************

class PROVE_ETUD(models.Model):

    NUMERO_DE_DOSSIER = models.ForeignKey('ETUDIAN', null = False, related_name = "%(class)s_1")
    CODE_COLLEGE_UNIVE = models.ForeignKey('COLLEGE', null = False, related_name = "%(class)s_2")
    
    class Meta:
        unique_together = ('NUMERO_DE_DOSSIER','CODE_COLLEGE_UNIVE',)

#***********************************************************
#    Classe "REALISA"
#***********************************************************

class REALISA(models.Model):

    NUMERO_DU_COURS = models.ForeignKey('COURS', null = False,related_name = "%(class)s_1")
    CODE_PHASE = models.ForeignKey('PHASE', null = False, related_name = "%(class)s_2")

    OBLIGAT         = models.CharField(blank = True, null = True, max_length= 255)
 
    class Meta:
        unique_together = ('CODE_PHASE','NUMERO_DU_COURS',)

#***********************************************************
#    Classe "REALISA2"
#***********************************************************

class REALISA2(models.Model):

    CODE_BLOC_COURS = models.ForeignKey('BLOC_CO', null = False, related_name = "%(class)s_1")
    NUMERO_PROGRAM = models.ForeignKey('PHASE_C', null = False,related_name = "%(class)s_2")
    CODE_CHEMINE = models.ForeignKey('PHASE_C', null = False,related_name = "%(class)s_3")
    CODE_PHASE = models.ForeignKey('PHASE_C', null = False,related_name = "%(class)s_4")
  
    OBLIGAT         = models.CharField(blank = True, null = True, max_length= 255)
    CREDITS_MINI    = models.CharField(blank = True, null = True, max_length= 255)
    CREDITS_MAXI    = models.CharField(blank = True, null = True, max_length= 255)
    TYPE_1           = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('NUMERO_PROGRAM','CODE_CHEMINE','CODE_PHASE','CODE_BLOC_COURS',)

#***********************************************************
#    Classe "REPONDA"
#***********************************************************

class REPONDA(models.Model):

    NUMERO_DE_DOSSIER = models.ForeignKey('DEMANDE', null = False, related_name = "%(class)s_1")
    TRIMEST_ENTREE = models.ForeignKey('DEMANDE', null = False, related_name = "%(class)s_2")

    NO_REPONDA      = models.CharField(null = False, max_length= 255)
    NOM_REPONDANT   = models.CharField(blank = True, null = True, max_length= 255)
    PRENOM_REPONDANT = models.CharField(blank = True, null = True, max_length= 255)
    ADRESSE         = models.CharField(blank = True, null = True, max_length= 255)
    NUMERO_TEL_1     = models.CharField(blank = True, null = True, max_length= 255)
    NOTE            = models.CharField(blank = True, null = True, max_length= 255)
    COMPAGN         = models.CharField(blank = True, null = True, max_length= 255)
    DATE_ENVOI_LETTRE = models.CharField(blank = True, null = True, max_length= 255)
    DATE_RECEPTI_LETTR = models.CharField(blank = True, null = True, max_length= 255)
    
    class Meta:
        unique_together = ('NUMERO_DE_DOSSIER','TRIMEST_ENTREE','NO_REPONDA',)
        
#***********************************************************
#    Classe "SECTION"
#***********************************************************

class SECTION(models.Model):

    NUMERO_D_EMPLO = models.ForeignKey('PROFESS', related_name = "%(class)s_1")
    NUMERO_DU_COURS = models.ForeignKey('COURS_SESSI', null = False, related_name = "%(class)s_2")
    TRIMEST = models.ForeignKey('COURS_SESSI', null = False, related_name = "%(class)s_3") 
    NUMERO_SECTION  = models.CharField(primary_key = True, null = False, max_length= 255)

    class Meta:
        unique_together = ('NUMERO_SECTION','TRIMEST','NUMERO_DU_COURS',)
        
#***********************************************************
#    Classe "SEJOUR_"
#***********************************************************

class SEJOUR_(models.Model):

    CODE_COLLEGE_UNIVE = models.ForeignKey('COLLEGE', related_name = "%(class)s_1")
    CODE_PHASE        = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_2")
    NUMERO_DE_DOSSIER = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_3")
    TRIMEST_ENTREE    = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_4")
    NUMERO_PROGRAM    = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_5")
    NO_ACTIVIT        = models.ForeignKey('ACTIVIT', null = False, related_name = "%(class)s_6")
    
    ORGANIS           = models.CharField(blank = True, null = True, max_length= 255)
    ADRESSE           = models.CharField(blank = True, null = True, max_length= 255)
    REPONDA           = models.CharField(blank = True, null = True, max_length= 255)
    TYPE_ORGANIS      = models.CharField(blank = True, null = True, max_length= 255)

    class Meta:
        unique_together = ('CODE_PHASE','NUMERO_DE_DOSSIER','TRIMEST_ENTREE','NUMERO_PROGRAM','NO_ACTIVIT',)

#***********************************************************
#    Classe "SOUS_"
#***********************************************************

class SOUS_(models.Model):

    SOUSEVENEMENT = models.ForeignKey('TYPE_EV', null = False, related_name = "%(class)s_1")
    CODE_FAMILLE_EVE = models.ForeignKey('FAMILLE1', null = False, related_name = "%(class)s_2")
    CODE_TYPE_EVENEME = models.ForeignKey('FAMILLE1', null = False, related_name = "%(class)s_3")
    
    SOUS_EVENEME    = models.CharField(blank = True, null = True, max_length= 255)
    OBLIG           = models.CharField(blank = True, null = True, max_length= 255)
    
    class Meta:
        unique_together = ('SOUSEVENEMENT','CODE_TYPE_EVENEME','CODE_FAMILLE_EVE',)

#***********************************************************
#    Classe "STAGE"
#***********************************************************

class STAGE(models.Model):

    NO_STAGE        = models.CharField(null = False, max_length= 255)
    TITRE_STAGE     = models.CharField(blank = True, null = True, max_length= 255)
    DATE_SOUMISS    = models.CharField(blank = True, null = True, max_length= 255)
    DATE_DEBUT      = models.CharField(blank = True, null = True, max_length= 255)
    DATE_FIN        = models.CharField(blank = True, null = True, max_length= 255)
    REPONDA         = models.CharField(blank = True, null = True, max_length= 255)
    ADRESSE_REPONDA = models.CharField(blank = True, null = True, max_length= 255)
    
    class Meta:
        unique_together = ('NO_STAGE',)

#***********************************************************
#    Classe "TRIMES"
#***********************************************************        
class TRIMES(models.Model):

    TRIMEST         = models.CharField(null = False, max_length= 255)
    DATE_DEBUT      = models.CharField(blank = True, null = True, max_length= 255)
    DATE_FIN        = models.CharField(blank = True, null = True, max_length= 255)
    DATE_MI_SESSIO  = models.CharField(blank = True, null = True, max_length= 255)
    
    class Meta:
        unique_together = ('TRIMEST',)
        
#***********************************************************
#    Classe "TYPE_EV"
#***********************************************************

class TYPE_EV(models.Model):
    
    CODE_TYPE_EVENEME = models.CharField(null = False, max_length= 255)
    NOM_TYPE_EVENEME = models.CharField(blank = True, null = True, max_length= 255)
    COMME           = models.CharField(blank = True, null = True, max_length= 255)
    DATE1           = models.CharField(blank = True, null = True, max_length= 255)
    REGLE_DATE1     = models.CharField(blank = True, null = True, max_length= 255)
    DATE2           = models.CharField(blank = True, null = True, max_length= 255)
    REGLE_DATE2     = models.CharField(blank = True, null = True, max_length= 255)
    DATE3           = models.CharField(blank = True, null = True, max_length= 255)
    REGLE_DATE3     = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR1         = models.CharField(blank = True, null = True, max_length= 255)
    REGLE_VALEUR1   = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR2         = models.CharField(blank = True, null = True, max_length= 255)
    REGLE_VALEUR2   = models.CharField(blank = True, null = True, max_length= 255)
    VALEUR3         = models.CharField(blank = True, null = True, max_length= 255)
    REGLE_VALEUR3   = models.CharField(blank = True, null = True, max_length= 255)
    
    class Meta:
        unique_together = ('CODE_TYPE_EVENEME',)
