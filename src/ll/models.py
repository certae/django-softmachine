# -*- coding: utf-8 -*-

# This is an auto-generated model module by CeRTAE SoftMachine v13.12dgt
# for model : "ll"
# You'll have to do the following manually to clean this up:
#     * Add specific procedures  (WFlow)

from django.db import models
from protoLib.models import ProtoModel
from protoLib.utilsBase import slugify


WORKFLOW = {  'initialStatus' :   'I', 
                    'OkStatus' : 'Ok', 
                    'wfFilters' : [
                        {
                            'name': 'initial',
                            'menuText': 'À verifier',
                            'wfStatus' : 'I'
                        }, {
                            'name': 'ok',
                            'menuText': 'Accepté',
                            'wfStatus' : 'Ok'
                        }, {
                            'name': 'novalides',
                            'menuText': 'Refusé',
                            'wfStatus' : 'R'
                        }
                    ],

                    'transitions' : [
                         {
                            'name' : 'accept', 
                            'menuText' : 'Accepter', 
                            'viewIcon' : '', 
                            'descripion' : '', 
                            'methode' : '', 
                            'change' : ( 'I', 'Ok' ),
                            'setOwner' : True , 
                            'notifyOwner' : True , 
                            'emailNotification' : True,
                            'emailSubject' : 'Acceptation de la modification',
                            'emailTemplate' : 'Bonjour {User},\n\nNous avons accepté l\'enregistrement {sk} dans la table {concept}, en date du {date}.\nMerci.\n{admin}',  
                            'message' : 'Accepté' , 
                            'admMessagePropmt' : '',   
                        }, {
                            'name' : 'reject', 
                            'menuText' : 'Refuser', 
                            'methode' : '', 
                            'change' : ( 'I', 'R' ),
                            'setOwner' : False , 
                            'notifyOwner' : True , 
                            'emailNotification' : True,
                            'emailSubject' : 'Refus de la modification',
                            'emailTemplate' : 'Bonjour {User},\n\nDésolé nous avons refusé l\'enregistrement {sk} dans la table {concept}, en date du {date} parce que {admmessage}.\nMerci.\n{admin}',  
                            'admMessagePropmt' : 'Raison de refuse?',   
                        }
                    ] 
                  } 


class Logiciel(ProtoModel):
    nom_logiciel = models.CharField(blank= False, null= False, max_length= 255)
    uri_site_logiciel = models.CharField(blank= True, null= True, max_length= 255)
    uri_site_alternatif = models.CharField(blank= True, null= True, max_length= 255)
    description_logiciel = models.TextField(blank = True, null = True)
    recommande_gouv_quebec = models.BooleanField()
    uri_commu_gouv = models.CharField(blank= True, null= True, max_length= 255)
    fourlog = models.ForeignKey('Logiciel', blank= True, null= True)
    
    _WorkFlow =  WORKFLOW

    def __unicode__(self):
        return slugify(self.nom_logiciel)

    class Meta:
        unique_together = ('nom_logiciel',)

class LicenceAppliquee(ProtoModel):
    lic_licapp = models.ForeignKey('Licence', blank= False, null= False)
    log_licapp = models.ForeignKey('Logiciel', blank= False, null= False)

    def __unicode__(self):
        return slugify(str( self.lic_licapp) +  '.' + str( self.log_licapp))

    class Meta:
        unique_together = ('lic_licapp','log_licapp',)

class Licence(ProtoModel):
    achronyme_licence = models.CharField(blank= False, null= False, max_length= 255)
    nom_licence = models.CharField(blank= True, null= True, max_length= 255)
    type_licence = models.CharField(blank= True, null= True, max_length= 255)
    uri_licence = models.CharField(blank= True, null= True, max_length= 255)

    _WorkFlow =  WORKFLOW

    def __unicode__(self):
        return slugify(self.achronyme_licence)

    class Meta:
        unique_together = ('achronyme_licence',)

class PreRequis(ProtoModel):
    prere_log = models.ForeignKey('Logiciel', blank= False, null= False, related_name='prere0')
    prere_log2 = models.ForeignKey('Logiciel', blank= False, null= False, related_name='prere1')

    def __unicode__(self):
        return slugify(str( self.prere_log) +  '.' + str( self.prere_log2))

    class Meta:
        unique_together = ('prere_log','prere_log2',)

class Categorie(ProtoModel):
    nom_categorie = models.CharField(blank= False, null= False, max_length= 255)
    description_categorie = models.TextField(blank = True, null = True)
    grou_cat = models.ForeignKey('Groupe', blank= False, null= False)

    def __unicode__(self):
        return slugify(self.nom_categorie +  '.' + str( self.grou_cat))

    class Meta:
        unique_together = ('nom_categorie','grou_cat',)

class Groupe(ProtoModel):
    nom_groupe = models.CharField(blank= False, null= False, max_length= 255)
    description_groupe = models.TextField(blank = True, null = True)

    def __unicode__(self):
        return slugify(self.nom_groupe)

    class Meta:
        unique_together = ('nom_groupe',)

class Classification(ProtoModel):
    cat_class = models.ForeignKey('Categorie', blank= False, null= False)
    log_class = models.ForeignKey('Logiciel', blank= False, null= False)

    def __unicode__(self):
        return slugify(str( self.cat_class) +  '.' + str( self.log_class))

    class Meta:
        unique_together = ('cat_class','log_class',)

class LangageUtilise(ProtoModel):
    lan_lanuti = models.ForeignKey('Langage', blank= False, null= False)
    log_lanuti = models.ForeignKey('Logiciel', blank= False, null= False)

    def __unicode__(self):
        return slugify(str( self.lan_lanuti) +  '.' + str( self.log_lanuti))

    class Meta:
        unique_together = ('lan_lanuti','log_lanuti',)

class Langage(ProtoModel):
    nom_langage = models.CharField(blank= False, null= False, max_length= 255)

    _WorkFlow =  WORKFLOW

    def __unicode__(self):
        return slugify(self.nom_langage)

    class Meta:
        unique_together = ('nom_langage',)

class SystemeExploitation(ProtoModel):
    nom_systeme_exploitation = models.CharField(blank= False, null= False, max_length= 255)

    _WorkFlow =  WORKFLOW

    def __unicode__(self):
        return slugify(self.nom_systeme_exploitation)

    class Meta:
        unique_together = ('nom_systeme_exploitation',)

class Plateforme(ProtoModel):
    systeme_plateforme = models.ForeignKey('SystemeExploitation', blank= False, null= False)
    logiciel_plateforme = models.ForeignKey('Logiciel', blank= False, null= False)

    def __unicode__(self):
        return slugify(str( self.systeme_plateforme) +  '.' + str( self.logiciel_plateforme))

    class Meta:
        unique_together = ('systeme_plateforme','logiciel_plateforme',)

class OffreDeServices(ProtoModel):
    service_0ffre = models.ForeignKey('TypeDeService', blank= False, null= False)
    expertise_offre = models.ForeignKey('Expertise', blank= False, null= False)

    def __unicode__(self):
        return slugify(str( self.service_0ffre) +  '.' + str( self.expertise_offre))

    class Meta:
        unique_together = ('service_0ffre','expertise_offre',)

class TypeDeService(ProtoModel):
    nom_type_service = models.CharField(blank= False, null= False, max_length= 255)
    description_type_de_service = models.TextField(blank = True, null = True)

    def __unicode__(self):
        return slugify(self.nom_type_service)

    class Meta:
        unique_together = ('nom_type_service',)

class Expertise(ProtoModel):
    logiciel_expertise = models.ForeignKey('Logiciel', blank= False, null= False)
    fournisseur_expertise = models.ForeignKey('FournisseurDeServices', blank= False, null= False)

    def __unicode__(self):
        return slugify(str( self.logiciel_expertise) +  '.' + str( self.fournisseur_expertise))

    class Meta:
        unique_together = ('logiciel_expertise','fournisseur_expertise',)

class TypeVersionDisponible(ProtoModel):
    derniere_version_connue_logiciel = models.CharField(blank= True, null= True, max_length= 10)
    log_typver = models.ForeignKey('Logiciel', blank= False, null= False)
    typver_tyverdis = models.ForeignKey('TypeVersion', blank= False, null= False)

    def __unicode__(self):
        return slugify(str( self.log_typver))

    class Meta:
        unique_together = ('log_typver',)

class LangueSupportee(ProtoModel):
    logiciel_langue = models.ForeignKey('Logiciel', blank= False, null= False)
    langue_langue_supportee = models.ForeignKey('Langue', blank= False, null= False)

    def __unicode__(self):
        return slugify(str( self.logiciel_langue) +  '.' + str( self.langue_langue_supportee))

    class Meta:
        unique_together = ('logiciel_langue','langue_langue_supportee',)

class MarcheDesservi(ProtoModel):
    marche_marche_desservi = models.ForeignKey('Marche', blank= False, null= False)
    fournisseur_marche_desservi = models.ForeignKey('FournisseurDeServices', blank= False, null= False)

    def __unicode__(self):
        return slugify(str( self.marche_marche_desservi) +  '.' + str( self.fournisseur_marche_desservi))

    class Meta:
        unique_together = ('marche_marche_desservi','fournisseur_marche_desservi',)

class TypeVersion(ProtoModel):
    nom_type_version = models.CharField(blank= False, null= False, max_length= 255)

    def __unicode__(self):
        return slugify(self.nom_type_version)

    class Meta:
        unique_together = ('nom_type_version',)

class Marche(ProtoModel):
    nom_marche = models.CharField(blank= False, null= False, max_length= 255)

    def __unicode__(self):
        return slugify(self.nom_marche)

    class Meta:
        unique_together = ('nom_marche',)

class Evaluation(ProtoModel):
    id_evaluation = models.IntegerField(blank = False, null = False)
    date_evaluation = models.DateField(blank = True, null = True)
    auteur_evaluation = models.CharField(blank= True, null= True, max_length= 255)
    resultat_evaluation = models.TextField(blank = True, null = True)
    indice_maturite = models.DecimalField(blank= True, null= True, max_digits=48, decimal_places= 0)
    description_evaluation = models.TextField(blank = True, null = True)
    log_eva = models.ForeignKey('Logiciel', blank= False, null= False)

    _autoIncrementField = 'id_evaluation'
    def __unicode__(self):
        return slugify(self.id_evaluation +  '.' + str( self.log_eva))

    class Meta:
        unique_together = ('id_evaluation','log_eva',)

class ClienteleFournisseur(ProtoModel):
    clientele_visee_clientele_fournisseur = models.ForeignKey('ClienteleVisee', blank= False, null= False)
    fournisseur_clientele_fournisseur = models.ForeignKey('FournisseurDeServices', blank= False, null= False)

    def __unicode__(self):
        return slugify(str( self.clientele_visee_clientele_fournisseur) +  '.' + str( self.fournisseur_clientele_fournisseur))

    class Meta:
        unique_together = ('clientele_visee_clientele_fournisseur','fournisseur_clientele_fournisseur',)

class ClienteleUsageSct(ProtoModel):
    clientele_cible_clientele_usage = models.ForeignKey('ClienteleCibleSct', blank= False, null= False)
    usage_clientele_usage = models.ForeignKey('UsageLogiciel', blank= False, null= False)

    def __unicode__(self):
        return slugify(str( self.clientele_cible_clientele_usage) +  '.' + str( self.usage_clientele_usage))

    class Meta:
        unique_together = ('clientele_cible_clientele_usage','usage_clientele_usage',)

class ClienteleCibleSct(ProtoModel):
    nom_clientele_cible = models.CharField(blank= False, null= False, max_length= 255)
    description_clientele_cible = models.TextField(blank = True, null = True)

    def __unicode__(self):
        return slugify(self.nom_clientele_cible)

    class Meta:
        unique_together = ('nom_clientele_cible',)

class Contrat(ProtoModel):
    date_entree_en_viguer = models.CharField(blank= True, null= True, max_length= 255)
    date_expiration = models.CharField(blank= True, null= True, max_length= 255)
    identifiant_contrat = models.CharField(blank= False, null= False, max_length= 255)
    objet_contrat = models.TextField(blank = True, null = True)
    fournisseur_contrat = models.ForeignKey('FournisseurDeServices', blank= False, null= False)
    usage_contrat = models.ForeignKey('UsageLogiciel', blank= True, null= True)

    def __unicode__(self):
        return slugify(self.identifiant_contrat +  '.' + str( self.fournisseur_contrat))

    class Meta:
        unique_together = ('identifiant_contrat','fournisseur_contrat',)

class PersonneRessource(ProtoModel):
    identifiant_contact = models.IntegerField(blank = False, null = False)
    date_debut_mandat = models.CharField(blank= True, null= True, max_length= 255)
    nom = models.CharField(blank= True, null= True, max_length= 255)
    role = models.CharField(blank= True, null= True, max_length= 255)
    telephone_personne_ressource = models.CharField(blank= True, null= True, max_length= 255)
    courriel = models.CharField(blank= True, null= True, max_length= 255)
    nom_direction = models.CharField(blank= True, null= True, max_length= 255)
    telephone_direction_contact = models.CharField(blank= True, null= True, max_length= 255)
    date_fin_mandat = models.CharField(blank= True, null= True, max_length= 255)
    organisme_personne_ressource = models.ForeignKey('OrganismePublic', blank= False, null= False)

    _autoIncrementField = 'identifiant_contact'
    def __unicode__(self):
        return slugify(str( self.identifiant_contact) +  '.' + str( self.organisme_personne_ressource))

    class Meta:
        unique_together = ('identifiant_contact','organisme_personne_ressource',)

class ClienteleVisee(ProtoModel):
    nom_clientele_visee = models.CharField(blank= False, null= False, max_length= 255)

    def __unicode__(self):
        return slugify(self.nom_clientele_visee)

    class Meta:
        unique_together = ('nom_clientele_visee',)

class FournisseurDeServices(ProtoModel):
    nom_fournisseur = models.CharField(blank= False, null= False, max_length= 255)
    numero_entreprise = models.CharField(blank= True, null= True, max_length= 255)
    adresse = models.CharField(blank= True, null= True, max_length= 255)
    telecopieur = models.CharField(blank= True, null= True, max_length= 255)
    telephone = models.CharField(blank= True, null= True, max_length= 255)
    courriel = models.CharField(blank= True, null= True, max_length= 255)
    site_internet = models.CharField(blank= True, null= True, max_length= 255)
    dirigeant_principal = models.CharField(blank= True, null= True, max_length= 255)
    annee_de_fondation = models.IntegerField(blank = True, null = True)
    nombre_employes = models.IntegerField(blank = True, null = True)
    principales_activites = models.TextField(blank = True, null = True)
    personne_ressource_fds = models.CharField(blank= True, null= True, max_length= 255)

    def __unicode__(self):
        return slugify(self.nom_fournisseur)

    class Meta:
        unique_together = ('nom_fournisseur',)

class Expert(ProtoModel):
    nom = models.CharField(blank= True, null= True, max_length= 255)
    identifiant_expert = models.IntegerField(blank = False, null = False)
    courriel = models.CharField(blank= True, null= True, max_length= 255)
    date_debut_mandat = models.CharField(blank= True, null= True, max_length= 255)
    date_fin_mandat = models.CharField(blank= True, null= True, max_length= 255)
    nom_direction = models.CharField(blank= True, null= True, max_length= 255)
    role = models.CharField(blank= True, null= True, max_length= 255)
    telephone_direction_contact = models.CharField(blank= True, null= True, max_length= 255)
    telephone_expert = models.CharField(blank= False, null= False, max_length= 255)
    usage_personne_expert = models.ForeignKey('UsageLogiciel', blank= False, null= False)

    _autoIncrementField = 'identifiant_expert'
    def __unicode__(self):
        return slugify(str( self.identifiant_expert) +  '.' + self.telephone_expert +  '.' + str( self.usage_personne_expert))

    class Meta:
        unique_together = ('identifiant_expert','telephone_expert','usage_personne_expert',)

class HistoriqueUtilisateurs(ProtoModel):
    date_renseignements = models.CharField(blank= True, null= True, max_length= 255)
    date_de_saisie = models.DateTimeField(blank = True, null = True)
    identifiant_nombre_utilisateurs = models.IntegerField(blank = False, null = False)
    nombre_utilisateurs = models.IntegerField(blank = True, null = True)
    usage_nombre_utilisateurs = models.ForeignKey('UsageLogiciel', blank= False, null= False)

    _autoIncrementField = 'identifiant_nombre_utilisateurs'
    def __unicode__(self):
        return slugify(str( self.identifiant_nombre_utilisateurs) +  '.' + str( self.usage_nombre_utilisateurs))

    class Meta:
        unique_together = ('identifiant_nombre_utilisateurs','usage_nombre_utilisateurs',)

class HistoriqueInstances(ProtoModel):
    date_de_saisie = models.DateTimeField(blank = True, null = True)
    date_renseignements = models.CharField(blank= True, null= True, max_length= 255)
    identifiant_nombre_instances = models.IntegerField(blank = False, null = False)
    nombre_instances = models.IntegerField(blank = True, null = True)
    usage_nombre_instances = models.ForeignKey('UsageLogiciel', blank= False, null= False)

    _autoIncrementField = 'identifiant_nombre_instances'
    def __unicode__(self):
        return slugify(str( self.identifiant_nombre_instances) +  '.' + str( self.usage_nombre_instances))

    class Meta:
        unique_together = ('identifiant_nombre_instances','usage_nombre_instances',)

class ReferenceDocumentContrat(ProtoModel):
    identifiant_reference_document = models.IntegerField(blank = False, null = False)
    nom_document = models.TextField(blank = True, null = True)
    type_document = models.CharField(blank= True, null= True, max_length= 255)
    auteur_derniere_mise_a_jour = models.CharField(blank= True, null= True, max_length= 255)
    auteur_document = models.CharField(blank= True, null= True, max_length= 255)
    date_creation_document = models.CharField(blank= True, null= True, max_length= 255)
    date_derniere_mise_a_jour = models.CharField(blank= True, null= True, max_length= 255)
    description_document = models.TextField(blank = True, null = True)
    format_document = models.CharField(blank= True, null= True, max_length= 255)
    uri_document = models.CharField(blank= True, null= True, max_length= 255)
    contrat_document = models.ForeignKey('Contrat', blank= False, null= False)

    _autoIncrementField = 'identifiant_reference_document'
    def __unicode__(self):
        return slugify(str( self.identifiant_reference_document) +  '.' + str( self.contrat_document))

    class Meta:
        unique_together = ('identifiant_reference_document','contrat_document',)

class ReferenceDocumentUsage(ProtoModel):
    auteur_derniere_mise_a_jour = models.CharField(blank= True, null= True, max_length= 255)
    auteur_document = models.CharField(blank= True, null= True, max_length= 255)
    date_creation_document = models.CharField(blank= True, null= True, max_length= 255)
    date_derniere_mise_a_jour = models.CharField(blank= True, null= True, max_length= 255)
    description_document = models.TextField(blank = True, null = True)
    format_document = models.CharField(blank= True, null= True, max_length= 255)
    identifiant_reference_document = models.IntegerField(blank = False, null = False)
    nom_document = models.TextField(blank = True, null = True)
    type_document = models.CharField(blank= True, null= True, max_length= 255)
    uri_document = models.CharField(blank= True, null= True, max_length= 255)
    usage_document = models.ForeignKey('UsageLogiciel', blank= False, null= False)

    _autoIncrementField = 'identifiant_reference_document'
    def __unicode__(self):
        return slugify(str( self.identifiant_reference_document) +  '.' + str( self.usage_document))

    class Meta:
        unique_together = ('identifiant_reference_document','usage_document',)

class ReferenceDocumentInstallation(ProtoModel):
    auteur_derniere_mise_a_jour = models.CharField(blank= True, null= True, max_length= 255)
    auteur_document = models.CharField(blank= True, null= True, max_length= 255)
    date_creation_document = models.CharField(blank= True, null= True, max_length= 255)
    date_derniere_mise_a_jour = models.CharField(blank= True, null= True, max_length= 255)
    description_document = models.TextField(blank = True, null = True)
    format_document = models.CharField(blank= True, null= True, max_length= 255)
    identifiant_reference_document = models.IntegerField(blank = False, null = False)
    nom_document = models.TextField(blank = True, null = True)
    type_document = models.CharField(blank= True, null= True, max_length= 255)
    uri_document = models.CharField(blank= True, null= True, max_length= 255)
    installation_document = models.ForeignKey('Installation', blank= False, null= False)
    langue_document_installation = models.ForeignKey('Langue', blank= True, null= True)

    _autoIncrementField = 'identifiant_reference_document'
    def __unicode__(self):
        return slugify(str( self.identifiant_reference_document) +  '.' + str( self.installation_document))

    class Meta:
        unique_together = ('identifiant_reference_document','installation_document',)

class CompositionInstallation(ProtoModel):
    installation_composition = models.ForeignKey('Installation', blank= False, null= False)
    logiciel_composition = models.ForeignKey('Logiciel', blank= False, null= False)

    def __unicode__(self):
        return slugify(str( self.installation_composition) +  '.' + str( self.logiciel_composition))

    class Meta:
        unique_together = ('installation_composition','logiciel_composition',)

class Installation(ProtoModel):
    nom_installation = models.CharField(blank= False, null= False, max_length= 255)
    description_installation = models.TextField(blank = True, null = True)

    def __unicode__(self):
        return slugify(self.nom_installation)

    class Meta:
        unique_together = ('nom_installation',)

class ReferenceDocumentEvaluation(ProtoModel):
    auteur_derniere_mise_a_jour = models.CharField(blank= True, null= True, max_length= 255)
    auteur_document = models.CharField(blank= True, null= True, max_length= 255)
    date_creation_document = models.CharField(blank= True, null= True, max_length= 255)
    date_derniere_mise_a_jour = models.CharField(blank= True, null= True, max_length= 255)
    description_document = models.TextField(blank = True, null = True)
    format_document = models.CharField(blank= True, null= True, max_length= 255)
    identifiant_reference_document = models.IntegerField(blank = False, null = False)
    nom_document = models.TextField(blank = True, null = True)
    type_document = models.CharField(blank= True, null= True, max_length= 255)
    uri_document = models.CharField(blank= True, null= True, max_length= 255)
    evaluation_document = models.ForeignKey('Evaluation', blank= False, null= False)

    _autoIncrementField = 'identifiant_reference_document'
    def __unicode__(self):
        return slugify(str( self.identifiant_reference_document) +  '.' + str( self.evaluation_document))

    class Meta:
        unique_together = ('identifiant_reference_document','evaluation_document',)

class ReferenceDocumentLogiciel(ProtoModel):
    auteur_derniere_mise_a_jour = models.CharField(blank= True, null= True, max_length= 255)
    auteur_document = models.CharField(blank= True, null= True, max_length= 255)
    date_creation_document = models.CharField(blank= True, null= True, max_length= 255)
    date_derniere_mise_a_jour = models.CharField(blank= True, null= True, max_length= 255)
    description_document = models.TextField(blank = True, null = True)
    format_document = models.CharField(blank= True, null= True, max_length= 255)
    identifiant_reference_document = models.IntegerField(blank = False, null = False)
    nom_document = models.TextField(blank = True, null = True)
    type_document = models.CharField(blank= True, null= True, max_length= 255)
    uri_document = models.CharField(blank= True, null= True, max_length= 255)
    logiciel_document = models.ForeignKey('Logiciel', blank= False, null= False)
    langue_document_logiciel = models.ForeignKey('Langue', blank= True, null= True)

    _autoIncrementField = 'identifiant_reference_document'
    def __unicode__(self):
        return slugify(str( self.identifiant_reference_document) +  '.' + str( self.logiciel_document))

    class Meta:
        unique_together = ('identifiant_reference_document','logiciel_document',)

class ReferenceDocumentExpertise(ProtoModel):
    auteur_derniere_mise_a_jour = models.CharField(blank= True, null= True, max_length= 255)
    auteur_document = models.CharField(blank= True, null= True, max_length= 255)
    date_creation_document = models.CharField(blank= True, null= True, max_length= 255)
    date_derniere_mise_a_jour = models.CharField(blank= True, null= True, max_length= 255)
    description_document = models.TextField(blank = True, null = True)
    format_document = models.CharField(blank= True, null= True, max_length= 255)
    identifiant_reference_document = models.IntegerField(blank = False, null = False)
    nom_document = models.TextField(blank = True, null = True)
    type_document = models.CharField(blank= True, null= True, max_length= 255)
    uri_document = models.CharField(blank= True, null= True, max_length= 255)
    expertise_document = models.ForeignKey('Expertise', blank= False, null= False)
    langue_document_expertise = models.ForeignKey('Langue', blank= True, null= True)

    _autoIncrementField = 'identifiant_reference_document'
    def __unicode__(self):
        return slugify(str( self.identifiant_reference_document) +  '.' + str( self.expertise_document))

    class Meta:
        unique_together = ('identifiant_reference_document','expertise_document',)

class Langue(ProtoModel):
    nom_langue = models.CharField(blank= False, null= False, max_length= 255)

    def __unicode__(self):
        return slugify(self.nom_langue)

    class Meta:
        unique_together = ('nom_langue',)

class UsageLogiciel(ProtoModel):
    commentaire_fin_usage = models.TextField(blank = True, null = True)
    date_debut_usage = models.CharField(blank= True, null= True, max_length= 255)
    date_fin_usage = models.CharField(blank= True, null= True, max_length= 255)
    description_usage = models.TextField(blank = True, null = True)
    identifiant_usage_logiciel = models.IntegerField(blank = False, null = False)
    plate_forme_sct = models.CharField(blank= True, null= True, max_length= 255)
    potentiel_partage_sct = models.CharField(blank= True, null= True, max_length= 255)
    version_logiciel_utilise = models.CharField(blank= True, null= True, max_length= 255)
    type_version_usage = models.ForeignKey('TypeVersion', blank= True, null= True)
    logiciel_usage = models.ForeignKey('Logiciel', blank= False, null= False)
    organisme_usage = models.ForeignKey('OrganismePublic', blank= False, null= False)

    _autoIncrementField = 'identifiant_usage_logiciel'
    def __unicode__(self):
        return slugify(str( self.identifiant_usage_logiciel) +  '.' + str( self.logiciel_usage) +  '.' + str( self.organisme_usage))

    class Meta:
        unique_together = ('identifiant_usage_logiciel','logiciel_usage','organisme_usage',)

    def save(self, *args, **kwargs):
        organismeUsage = self.organisme_usage
        if self.smOwningTeam == organismeUsage.smOwningTeam:
            super(UsageLogiciel, self).save(*args, **kwargs)
        else:
            from django.core.exceptions import PermissionDenied
            raise PermissionDenied('Votre compte n\'appartient pas à l\'organisme public sélectioné.')

class OrganismePublic(ProtoModel):
    acronyme = models.CharField(blank= False, null= False, max_length= 255)
    nom = models.CharField(blank= True, null= True, max_length= 255)
    mission = models.TextField(blank = True, null = True)
    numero_sct = models.CharField(blank= True, null= True, max_length= 255)

    _WorkFlow =  WORKFLOW
    def __unicode__(self):
        return slugify(self.acronyme)

    class Meta:
        unique_together = ('acronyme',)
