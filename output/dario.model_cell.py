# -*- coding: utf-8 -*-

# This is an auto-generated model module by CeRTAE SoftMachine v13.12dgt
# for model : "cell"
# You'll have to do the following manually to clean this up:
#     * Add specific procedures  (WFlow)

from protoLib.models import ProtoModel
from django.utils.encoding import force_unicode

class Logiciel(ProtoModel):
    nom_logiciel = models.CharField(blank= FALSE, null= FALSE, max_length= 200)
    uri_site_logiciel = models.CharField(blank= TRUE, null= TRUE, max_length= 300)
    uri_site_alternatif = models.CharField(blank= TRUE, null= TRUE, max_length= 300)
    description = models.TextField(blank = TRUE, null = TRUE)
    recommande_gouv_quebec = models.BooleanField(blank = TRUE, null = TRUE)
    uri_commu_gouv = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    fourlogic = models.ForeignKey('Logiciel', blank= TRUE, null= TRUE, related_name='+')

    def __unicode__(self):
        return slugify(self.nom_logiciel)

    class Meta:
        unique_together('nom_logiciel')

class TypeVersion(ProtoModel):
    nom_type_version = models.CharField(blank= FALSE, null= FALSE, max_length= 200)

    def __unicode__(self):
        return slugify(self.nom_type_version)

    class Meta:
        unique_together('nom_type_version')

class Langage(ProtoModel):
    nom_langage = models.CharField(blank= FALSE, null= FALSE, max_length= 200)

    def __unicode__(self):
        return slugify(self.nom_langage)

    class Meta:
        unique_together('nom_langage')

class LangageUtilise(ProtoModel):
    langage_utilise = models.ForeignKey('Langage', blank= FALSE, null= FALSE, related_name='+')
    log_langage = models.ForeignKey('Logiciel', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.langage_utilise) +  '.' + str( self.log_langage))

    class Meta:
        unique_together('langage_utilise','log_langage')

class Plateforme(ProtoModel):
    systeme_d_exploitation_supportee = models.ForeignKey('SystemeExploitation', blank= FALSE, null= FALSE, related_name='+')
    log_plate = models.ForeignKey('Logiciel', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.systeme_d_exploitation_supportee) +  '.' + str( self.log_plate))

    class Meta:
        unique_together('systeme_d_exploitation_supportee','log_plate')

class SystemeExploitation(ProtoModel):
    nom_systeme_exploitation = models.CharField(blank= FALSE, null= FALSE, max_length= 200)

    def __unicode__(self):
        return slugify(self.nom_systeme_exploitation)

    class Meta:
        unique_together('nom_systeme_exploitation')

class SupportParLesTiers(ProtoModel):
    type_de_support_disponible = models.ForeignKey('TypeSupport', blank= FALSE, null= FALSE, related_name='+')
    tiers_offrant = models.ForeignKey('FournisseurServices', blank= FALSE, null= FALSE, related_name='+')
    log_suptiers = models.ForeignKey('Logiciel', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.type_de_support_disponible) +  '.' + str( self.tiers_offrant) +  '.' + str( self.log_suptiers))

    class Meta:
        unique_together('type_de_support_disponible','tiers_offrant','log_suptiers')

class TypeSupport(ProtoModel):
    nom_type_support = models.CharField(blank= FALSE, null= FALSE, max_length= 200)

    def __unicode__(self):
        return slugify(self.nom_type_support)

    class Meta:
        unique_together('nom_type_support')

class OffreServices(ProtoModel):
    competence_du_fournisseur = models.ForeignKey('TypeSupport', blank= FALSE, null= FALSE, related_name='+')
    fournisseur_offrant = models.ForeignKey('FournisseurServices', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.competence_du_fournisseur) +  '.' + str( self.fournisseur_offrant))

    class Meta:
        unique_together('competence_du_fournisseur','fournisseur_offrant')

class FournisseurServices(ProtoModel):
    nom_fournisseur = models.CharField(blank= FALSE, null= FALSE, max_length= 200)
    numero_entreprise = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    adresse = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    telephone = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    telecopieur = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    adresse_courriel = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    adresse_site_internet = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    dirigeant_principal = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    annee_fondation = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    nombre_employes = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    principales_activites = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    secteurs_activites_vises = models.CharField(blank= TRUE, null= TRUE, max_length= 200)

    def __unicode__(self):
        return slugify(self.nom_fournisseur)

    class Meta:
        unique_together('nom_fournisseur')

class LangueSupportee(ProtoModel):
    langue_humaine = models.ForeignKey('Langue', blank= FALSE, null= FALSE, related_name='+')
    log_lansup = models.ForeignKey('Logiciel', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.langue_humaine) +  '.' + str( self.log_lansup))

    class Meta:
        unique_together('langue_humaine','log_lansup')

class Langue(ProtoModel):
    nom_langue = models.CharField(blank= FALSE, null= FALSE, max_length= 200)

    def __unicode__(self):
        return slugify(self.nom_langue)

    class Meta:
        unique_together('nom_langue')

class Marche(ProtoModel):
    nom_marche = models.CharField(blank= FALSE, null= FALSE, max_length= 200)

    def __unicode__(self):
        return slugify(self.nom_marche)

    class Meta:
        unique_together('nom_marche')

class MarcheDesservi(ProtoModel):
    marche_geographique = models.ForeignKey('Marche', blank= FALSE, null= FALSE, related_name='+')
    fournisseur_present = models.ForeignKey('FournisseurServices', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.marche_geographique) +  '.' + str( self.fournisseur_present))

    class Meta:
        unique_together('marche_geographique','fournisseur_present')

class DocumentationEvaluation(ProtoModel):
    document_issu_de_l_evaluation = models.ForeignKey('ReferenceDocument', blank= FALSE, null= FALSE, related_name='+')
    eva_doceva = models.ForeignKey('Evaluation', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.document_issu_de_l_evaluation) +  '.' + str( self.eva_doceva))

    class Meta:
        unique_together('document_issu_de_l_evaluation','eva_doceva')

class ReferenceDocument(ProtoModel):
    nom_document = models.CharField(blank= FALSE, null= FALSE, max_length= 200)
    type_document = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    date_creation_document = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    auteur_document = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    uri_document = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    format_document = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    description_document = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    date_derniere_mise_a_jour = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    auteur_derniere_mise_a_jour = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    langue_du_document = models.ForeignKey('Langue', blank= TRUE, null= TRUE, related_name='+')
    id_document = models.CharField(blank= FALSE, null= FALSE, max_length= 200)

    def __unicode__(self):
        return slugify(self.id_document)

    class Meta:
        unique_together('id_document')

class DocumentationUsage(ProtoModel):
    document_sur_l_usage = models.ForeignKey('ReferenceDocument', blank= FALSE, null= FALSE, related_name='+')
    usalog_docusa = models.ForeignKey('UsageLogiciel', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.document_sur_l_usage) +  '.' + str( self.usalog_docusa))

    class Meta:
        unique_together('document_sur_l_usage','usalog_docusa')

class DocumentationContrat(ProtoModel):
    contrat_documente = models.ForeignKey('Contrat', blank= FALSE, null= FALSE, related_name='+')
    docuemnt_sur_le_contrat = models.ForeignKey('ReferenceDocument', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.contrat_documente) +  '.' + str( self.docuemnt_sur_le_contrat))

    class Meta:
        unique_together('contrat_documente','docuemnt_sur_le_contrat')

class DocumentationFournisseur(ProtoModel):
    fournisseur_sujet = models.ForeignKey('FournisseurServices', blank= FALSE, null= FALSE, related_name='+')
    document_relatif_au_fournisseur = models.ForeignKey('ReferenceDocument', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.fournisseur_sujet) +  '.' + str( self.document_relatif_au_fournisseur))

    class Meta:
        unique_together('fournisseur_sujet','document_relatif_au_fournisseur')

class ClienteleCible(ProtoModel):
    nom_clientele_cible = models.CharField(blank= FALSE, null= FALSE, max_length= 200)
    description_clientele_cible = models.CharField(blank= TRUE, null= TRUE, max_length= 200)

    def __unicode__(self):
        return slugify(self.nom_clientele_cible)

    class Meta:
        unique_together('nom_clientele_cible')

class ClienteleUsage(ProtoModel):
    clientele_beneficiaire = models.ForeignKey('ClienteleCible', blank= FALSE, null= FALSE, related_name='+')
    usalog_cliusa = models.ForeignKey('UsageLogiciel', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.clientele_beneficiaire) +  '.' + str( self.usalog_cliusa))

    class Meta:
        unique_together('clientele_beneficiaire','usalog_cliusa')

class ClienteleVisee(ProtoModel):
    nom_clientele_visee = models.CharField(blank= FALSE, null= FALSE, max_length= 200)

    def __unicode__(self):
        return slugify(self.nom_clientele_visee)

    class Meta:
        unique_together('nom_clientele_visee')

class ClienteleFournisseur(ProtoModel):
    fournisseur_visant = models.ForeignKey('FournisseurServices', blank= FALSE, null= FALSE, related_name='+')
    type_clientele = models.ForeignKey('ClienteleVisee', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.fournisseur_visant) +  '.' + str( self.type_clientele))

    class Meta:
        unique_together('fournisseur_visant','type_clientele')

class Contrat(ProtoModel):
    date_entree_en_viguer = models.DateField(blank = TRUE, null = TRUE)
    date_expiration = models.DateField(blank = TRUE, null = TRUE)
    objet_contrat = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    fournisseur_prestataire = models.ForeignKey('FournisseurServices', blank= FALSE, null= FALSE, related_name='+')
    usalog_contr = models.ForeignKey('UsageLogiciel', blank= TRUE, null= TRUE, related_name='+')
    id_contrat = models.CharField(blank= FALSE, null= FALSE, max_length= 20)

    def __unicode__(self):
        return slugify(str( self.fournisseur_prestataire) +  '.' + self.id_contrat)

    class Meta:
        unique_together('fournisseur_prestataire','id_contrat')

class Groupe(ProtoModel):
    nom_groupe = models.CharField(blank= FALSE, null= FALSE, max_length= 100)
    description_groupe = models.TextField(blank = TRUE, null = TRUE)

    def __unicode__(self):
        return slugify(self.nom_groupe)

    class Meta:
        unique_together('nom_groupe')

class Categorie(ProtoModel):
    nom_categorie = models.CharField(blank= FALSE, null= FALSE, max_length= 200)
    description_categorie = models.TextField(blank = TRUE, null = TRUE)
    cat_grou = models.ForeignKey('Groupe', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(self.nom_categorie +  '.' + str( self.cat_grou))

    class Meta:
        unique_together('nom_categorie','cat_grou')

class Installation(ProtoModel):
    nom_installation = models.CharField(blank= FALSE, null= FALSE, max_length= 200)
    description_installation = models.TextField(blank = TRUE, null = TRUE)

    def __unicode__(self):
        return slugify(self.nom_installation)

    class Meta:
        unique_together('nom_installation')

class Classification(ProtoModel):
    log_classi = models.ForeignKey('Logiciel', blank= FALSE, null= FALSE, related_name='+')
    cat_class = models.ForeignKey('Categorie', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.log_classi) +  '.' + str( self.cat_class))

    class Meta:
        unique_together('log_classi','cat_class')

class PreRequis(ProtoModel):
    log_prere = models.ForeignKey('Logiciel', blank= FALSE, null= FALSE, related_name='+')
    log_prereq2 = models.ForeignKey('Logiciel', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.log_prere) +  '.' + str( self.log_prereq2))

    class Meta:
        unique_together('log_prere','log_prereq2')

class Composition(ProtoModel):
    log_compo = models.ForeignKey('Logiciel', blank= FALSE, null= FALSE, related_name='+')
    inst_compo = models.ForeignKey('Installation', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.log_compo) +  '.' + str( self.inst_compo))

    class Meta:
        unique_together('log_compo','inst_compo')

class DocumentationInstallation(ProtoModel):
    inst_docinsta = models.ForeignKey('Installation', blank= FALSE, null= FALSE, related_name='+')
    refdoc_docinst = models.ForeignKey('ReferenceDocument', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.inst_docinsta) +  '.' + str( self.refdoc_docinst))

    class Meta:
        unique_together('inst_docinsta','refdoc_docinst')

class LicenceAppliquee(ProtoModel):
    log_licapp = models.ForeignKey('Logiciel', blank= FALSE, null= FALSE, related_name='+')
    lic_licapp = models.ForeignKey('Licence', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.log_licapp) +  '.' + str( self.lic_licapp))

    class Meta:
        unique_together('log_licapp','lic_licapp')

class Licence(ProtoModel):
    nom_licence = models.CharField(blank= FALSE, null= FALSE, max_length= 200)
    achronyme_licence = models.CharField(blank= FALSE, null= FALSE, max_length= 100)
    type_licence = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    uri_licence = models.CharField(blank= TRUE, null= TRUE, max_length= 300)

    def __unicode__(self):
        return slugify(self.achronyme_licence)

    class Meta:
        unique_together('achronyme_licence')

class DocumentationLogiciel(ProtoModel):
    log_doclog = models.ForeignKey('Logiciel', blank= FALSE, null= FALSE, related_name='+')
    document_relatif_au_logiciel = models.ForeignKey('ReferenceDocument', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.log_doclog) +  '.' + str( self.document_relatif_au_logiciel))

    class Meta:
        unique_together('log_doclog','document_relatif_au_logiciel')

class Evaluation(ProtoModel):
    date_evaluation = models.DateField(blank = TRUE, null = TRUE)
    auteur_evaluation = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    resultat_evaluation = models.TextField(blank = TRUE, null = TRUE)
    indice_maturite = models.DecimalField(blank= TRUE, null= TRUE, max_digits=48, decimal_places= 0)
    description_evaluation = models.TextField(blank = TRUE, null = TRUE)
    log_eva = models.ForeignKey('Logiciel', blank= TRUE, null= TRUE, related_name='+')
    id_evaluation = models.CharField(blank= FALSE, null= FALSE, max_length= 200)

    def __unicode__(self):
        return slugify(self.id_evaluation)

    class Meta:
        unique_together('id_evaluation')

class TypeVersionDisponible(ProtoModel):
    derniere_version_connue_logiciel = models.CharField(blank= TRUE, null= TRUE, max_length= 10)
    type_de_version = models.ForeignKey('TypeVersion', blank= FALSE, null= FALSE, related_name='+')
    log_typver = models.ForeignKey('Logiciel', blank= FALSE, null= FALSE, related_name='+')

    def __unicode__(self):
        return slugify(str( self.type_de_version) +  '.' + str( self.log_typver))

    class Meta:
        unique_together('type_de_version','log_typver')

class HistoriqueNombreInstances(ProtoModel):
    date_historique = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    nombre_instances_installation = models.IntegerField(blank = TRUE, null = TRUE)
    date_saisie = models.DateTimeField(blank = TRUE, null = TRUE)
    usalog_hisinst = models.ForeignKey('UsageLogiciel', blank= FALSE, null= FALSE, related_name='+')
    id_historique_nombre_instances = models.CharField(blank= FALSE, null= FALSE, max_length= 200)

    def __unicode__(self):
        return slugify(str( self.usalog_hisinst) +  '.' + self.id_historique_nombre_instances)

    class Meta:
        unique_together('usalog_hisinst','id_historique_nombre_instances')

class HistoriqueNombreUtilisateurs(ProtoModel):
    date_historique = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    date_saisie = models.DateTimeField(blank = TRUE, null = TRUE)
    nombre_utilisateurs = models.IntegerField(blank = TRUE, null = TRUE)
    usalog_hisuti = models.ForeignKey('UsageLogiciel', blank= FALSE, null= FALSE, related_name='+')
    id_historique_nombre_utilisateurs = models.CharField(blank= FALSE, null= FALSE, max_length= 200)

    def __unicode__(self):
        return slugify(str( self.usalog_hisuti) +  '.' + self.id_historique_nombre_utilisateurs)

    class Meta:
        unique_together('usalog_hisuti','id_historique_nombre_utilisateurs')

class Contact(ProtoModel):
    role = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    date_debut = models.DateField(blank = TRUE, null = TRUE)
    date_fin = models.DateField(blank = TRUE, null = TRUE)
    usalog_conta = models.ForeignKey('UsageLogiciel', blank= FALSE, null= FALSE, related_name='+')
    nom_direction_op = models.CharField(blank= TRUE, null= TRUE, max_length= 50)
    telephone_direction_op = models.CharField(blank= TRUE, null= TRUE, max_length= 15)
    nom_personne = models.CharField(blank= TRUE, null= TRUE, max_length= 50)
    telephone_personne = models.CharField(blank= TRUE, null= TRUE, max_length= 15)
    adresse_courriel_personne = models.CharField(blank= TRUE, null= TRUE, max_length= 50)
    id_contact = models.IntegerField(blank = FALSE, null = FALSE)

    def __unicode__(self):
        return slugify(str( self.usalog_conta) +  '.' + str( self.id_contact))

    class Meta:
        unique_together('usalog_conta','id_contact')

class OrganismePublic(ProtoModel):
    nom_organisme_public = models.CharField(blank= TRUE, null= TRUE, max_length= 300)
    mission_organisme = models.TextField(blank = TRUE, null = TRUE)
    numero_op = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    acronyme_organisme_public = models.CharField(blank= FALSE, null= FALSE, max_length= 200)

    def __unicode__(self):
        return slugify(self.acronyme_organisme_public)

    class Meta:
        unique_together('acronyme_organisme_public')

class UsageLogiciel(ProtoModel):
    version_logiciel_utilise = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    date_debut_usage = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    date_fin_usage = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    description_usage = models.TextField(blank = TRUE, null = TRUE)
    commentaire_fin_usage = models.TextField(blank = TRUE, null = TRUE)
    plate_forme_sct = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    typver_usalog = models.ForeignKey('TypeVersion', blank= TRUE, null= TRUE, related_name='+')
    log_usalog = models.ForeignKey('Logiciel', blank= FALSE, null= FALSE, related_name='+')
    op_usalog = models.ForeignKey('OrganismePublic', blank= FALSE, null= FALSE, related_name='+')
    potentiel_partage_sct = models.CharField(blank= TRUE, null= TRUE, max_length= 200)
    id_usage_logiciel = models.CharField(blank= FALSE, null= FALSE, max_length= 30)

    def __unicode__(self):
        return slugify(str( self.log_usalog) +  '.' + str( self.op_usalog) +  '.' + self.id_usage_logiciel)

    class Meta:
        unique_together('log_usalog','op_usalog','id_usage_logiciel')
