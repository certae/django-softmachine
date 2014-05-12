# -*- coding: utf-8 -*-

# This is an auto-generated model module by CeRTAE SoftMachine v13.12dgt
# for model : "rai"
# You'll have to do the following manually to clean this up:
#     * Add specific procedures  (WFlow)

from django.db import models
from protoLib.models import ProtoModel
from protoLib.utilsBase import slugify

class Specifications(ProtoModel):
    nom_specification = models.CharField(blank= False, null= False, max_length= 200)
    gabarit = models.CharField(blank= True, null= True, max_length= 200)
    longueur = models.CharField(blank= True, null= True, max_length= 200)
    type_de_base = models.CharField(blank= True, null= True, max_length= 200)
    notes = models.TextField(blank = True, null = True)
    source = models.CharField(blank= True, null= True, max_length= 200)
    uri_source = models.CharField(blank= True, null= True, max_length= 200)
    domaine_valeurs_spec = models.TextField(blank = True, null = True)
    norme_spec = models.ForeignKey('Norme', blank= True, null= True, related_name='specifications_norme_spec')

    def __unicode__(self):
        return slugify(self.nom_specification)

    class Meta:
        unique_together = ('nom_specification',)

class IndexDesDonnees(ProtoModel):
    nom_donnee = models.CharField(blank= False, null= False, max_length= 200)
    definition_donnee = models.TextField(blank = True, null = True)
    spec_index = models.ForeignKey('Specifications', blank= True, null= True, related_name='index_des_donnees_spec_index')

    def __unicode__(self):
        return slugify(self.nom_donnee)

    class Meta:
        unique_together = ('nom_donnee',)

class DomaineAffaires(ProtoModel):
    id_domaine_affaires = models.CharField(blank= False, null= False, max_length= 200)
    description = models.TextField(blank = True, null = True)

    def __unicode__(self):
        return slugify(self.id_domaine_affaires)

    class Meta:
        unique_together = ('id_domaine_affaires',)

class Projet(ProtoModel):
    domaff_projet = models.ForeignKey('DomaineAffaires', blank= False, null= False, related_name='projet_domaff_projet')
    nom_projet = models.CharField(blank= False, null= False, max_length= 200)
    description_projet = models.TextField(blank = True, null = True)

    def __unicode__(self):
        return slugify(str( self.domaff_projet) +  '.' + self.nom_projet)

    class Meta:
        unique_together = ('domaff_projet','nom_projet',)

class RegroupementDesModeles(ProtoModel):
    mod_regrou = models.ForeignKey('Modele', blank= False, null= False, related_name='regroupement_des_modeles_mod_regrou')
    projet_regro = models.ForeignKey('Projet', blank= False, null= False, related_name='regroupement_des_modeles_projet_regro')

    def __unicode__(self):
        return slugify(str( self.mod_regrou) +  '.' + str( self.projet_regro))

    class Meta:
        unique_together = ('mod_regrou','projet_regro',)

class Entite(ProtoModel):
    nom_entite = models.CharField(blank= False, null= False, max_length= 200)
    description_entite = models.TextField(blank = True, null = True)
    historique = models.BooleanField()
    entite_mod = models.ForeignKey('Modele', blank= False, null= False, related_name='entite_entite_mod')
    physical_name = models.CharField(blank= True, null= True, max_length= 200)

    def __unicode__(self):
        return slugify(self.nom_entite +  '.' + str( self.entite_mod))

    class Meta:
        unique_together = ('nom_entite','entite_mod',)

class ReglesGestion(ProtoModel):
    eledon_regles = models.ForeignKey('ElementDonnee', blank= False, null= False, related_name='regles_gestion_eledon_regles')
    id_regles_gestion = models.CharField(blank= False, null= False, max_length= 200)
    typere_regges = models.ForeignKey('TypeRegle', blank= True, null= True, related_name='regles_gestion_typere_regges')
    notes = models.TextField(blank = True, null = True)

    def __unicode__(self):
        return slugify(str( self.eledon_regles) +  '.' + self.id_regles_gestion)

    class Meta:
        unique_together = ('eledon_regles','id_regles_gestion',)

class ElementDonnee(ProtoModel):
    nom_element_donnee = models.CharField(blank= False, null= False, max_length= 200)
    historique = models.BooleanField()
    numero_elem_cn = models.CharField(blank= True, null= True, max_length= 200)
    type_de_base = models.CharField(blank= True, null= True, max_length= 200)
    definition = models.TextField(blank = True, null = True)
    cle_etrangere = models.BooleanField()
    cle_primaire = models.BooleanField()
    longueur = models.CharField(blank= True, null= True, max_length= 200)
    element_transforme = models.TextField(blank = True, null = True)
    gabarit = models.CharField(blank= True, null= True, max_length= 200)
    element_transmis = models.CharField(blank= True, null= True, max_length= 200)
    domaine_valeurs = models.TextField(blank = True, null = True)
    date_entree_vigueur = models.DateField(blank = True, null = True)
    obligation = models.CharField(blank= True, null= True, max_length= 200)
    mode_attribution = models.CharField(blank= True, null= True, max_length= 200)
    provenance_reference = models.TextField(blank = True, null = True)
    exceptions = models.TextField(blank = True, null = True)
    statut_element = models.CharField(blank= True, null= True, max_length= 200)
    si_provenance = models.CharField(blank= True, null= True, max_length= 200)
    methode_transfert = models.CharField(blank= True, null= True, max_length= 200)
    date_derniere_modification = models.DateField(blank = True, null = True)
    consignes_saisie = models.TextField(blank = True, null = True)
    pratiques_acceptees = models.TextField(blank = True, null = True)
    contexte_particulier = models.TextField(blank = True, null = True)
    reference_foire_questions = models.TextField(blank = True, null = True)
    element_provenance = models.TextField(blank = True, null = True)
    methode_transformation = models.CharField(blank= True, null= True, max_length= 200)
    date_trans_bdm = models.DateField(blank = True, null = True)
    type_mode_attribution = models.CharField(blank= True, null= True, max_length= 200)
    date_creation = models.DateField(blank = True, null = True)
    notes = models.TextField(blank = True, null = True)
    eledon_spec = models.ForeignKey('Specifications', blank= True, null= True, related_name='element_donnee_eledon_spec')
    eledon_index = models.ForeignKey('IndexDesDonnees', blank= True, null= True, related_name='element_donnee_eledon_index')
    entite_elem = models.ForeignKey('Entite', blank= False, null= False, related_name='element_donnee_entite_elem')
    elements_de_source = models.TextField(blank = True, null = True)
    validation_sur_element = models.TextField(blank = True, null = True)
    validations_inter_elements = models.TextField(blank = True, null = True)
    validations_inter_enregistrement = models.TextField(blank = True, null = True)
    requis_par = models.CharField(blank= True, null= True, max_length= 200)
    volumetrie = models.CharField(blank= True, null= True, max_length= 200)

    def __unicode__(self):
        return slugify(self.nom_element_donnee +  '.' + str( self.entite_elem))

    class Meta:
        unique_together = ('nom_element_donnee','entite_elem',)

class PorteeRegleGestion(ProtoModel):
    eledon_portee = models.ForeignKey('ElementDonnee', blank= False, null= False, related_name='portee_regle_gestion_eledon_portee')
    portee_regles = models.ForeignKey('ReglesGestion', blank= True, null= True, related_name='portee_regle_gestion_portee_regles')

    def __unicode__(self):
        return slugify(str( self.eledon_portee))

    class Meta:
        unique_together = ('eledon_portee',)

class Raccordement(ProtoModel):
    eledon_rac1 = models.ForeignKey('ElementDonnee', blank= False, null= False, related_name='raccordement_eledon_rac1')
    eledon_rac2 = models.ForeignKey('ElementDonnee', blank= True, null= True, related_name='raccordement_eledon_rac2')
    modrac_rac = models.ForeignKey('ModeleRaccordement', blank= True, null= True, related_name='raccordement_modrac_rac')
    no_raccordement = models.CharField(blank= False, null= False, max_length= 200)

    def __unicode__(self):
        return slugify(self.no_raccordement)

    class Meta:
        unique_together = ('no_raccordement',)

class ModeleRaccordement(ProtoModel):
    mod_modrac1 = models.ForeignKey('Modele', blank= True, null= True, related_name='modele_raccordement_mod_modrac1')
    mod_modrac2 = models.ForeignKey('Modele', blank= True, null= True, related_name='modele_raccordement_mod_modrac2')
    nom_modele_raccordement = models.CharField(blank= False, null= False, max_length= 200)
    notes_modele_raccordement = models.TextField(blank = True, null = True)

    def __unicode__(self):
        return slugify(self.nom_modele_raccordement)

    class Meta:
        unique_together = ('nom_modele_raccordement',)

class Relation(ProtoModel):
    entite_rela1 = models.ForeignKey('Entite', blank= False, null= False, related_name='relation_entite_rela1')
    entite_rela2 = models.ForeignKey('Entite', blank= False, null= False, related_name='relation_entite_rela2')
    nom_relation = models.CharField(blank= False, null= False, max_length= 200)
    dependence = models.BooleanField()
    description = models.TextField(blank = True, null = True)

    def __unicode__(self):
        return slugify(str( self.entite_rela1) +  '.' + str( self.entite_rela2) +  '.' + self.nom_relation)

    class Meta:
        unique_together = ('entite_rela1','entite_rela2','nom_relation',)

class Modele(ProtoModel):
    domaff_modele = models.ForeignKey('DomaineAffaires', blank= False, null= False, related_name='modele_domaff_modele')
    nom_modele = models.CharField(blank= False, null= False, max_length= 200)
    type_modele = models.CharField(blank= True, null= True, max_length= 200)
    version_modele = models.CharField(blank= True, null= True, max_length= 200)
    auteur_modele = models.CharField(blank= True, null= True, max_length= 200)
    nom_si_bdm = models.CharField(blank= True, null= True, max_length= 200)
    document_reference = models.CharField(blank= True, null= True, max_length= 200)
    acronyme_si_bdm = models.CharField(blank= True, null= True, max_length= 200)
    date_doc_reference = models.CharField(blank= True, null= True, max_length= 200)
    version_doc_reference = models.CharField(blank= True, null= True, max_length= 200)
    description_modele = models.TextField(blank = True, null = True)
    date_creation_modele = models.DateField(blank = True, null = True)
    date_derniere_modif_modele = models.DateField(blank = True, null = True)
    physical_name = models.CharField(blank= True, null= True, max_length= 200)
    acteur_principal = models.CharField(blank= True, null= True, max_length= 200)
    autres_acteurs = models.CharField(blank= True, null= True, max_length= 200)
    intrants_declencheurs = models.CharField(blank= True, null= True, max_length= 200)

    def __unicode__(self):
        return slugify(str( self.domaff_modele) +  '.' + self.nom_modele)

    class Meta:
        unique_together = ('domaff_modele','nom_modele',)

class Norme(ProtoModel):
    code_norme = models.CharField(blank= False, null= False, max_length= 200)
    nom_norme = models.CharField(blank= True, null= True, max_length= 200)
    notes_norme = models.CharField(blank= True, null= True, max_length= 200)
    version_norme = models.CharField(blank= True, null= True, max_length= 200)

    def __unicode__(self):
        return slugify(self.code_norme)

    class Meta:
        unique_together = ('code_norme',)

class TypeRegle(ProtoModel):
    code_type_regle = models.CharField(blank= False, null= False, max_length= 200)
    description_type = models.TextField(blank = True, null = True)

    def __unicode__(self):
        return slugify(self.code_type_regle)

    class Meta:
        unique_together = ('code_type_regle',)

class CodageNormalise(ProtoModel):
    codnor_norme = models.ForeignKey('Norme', blank= True, null= True, related_name='codage_normalise_codnor_norme')
    codnor_inddon = models.ForeignKey('IndexDesDonnees', blank= True, null= True, related_name='codage_normalise_codnor_inddon')
    codnor_spec = models.ForeignKey('Specifications', blank= True, null= True, related_name='codage_normalise_codnor_spec')

    def __unicode__(self):
        return 'NoKey'