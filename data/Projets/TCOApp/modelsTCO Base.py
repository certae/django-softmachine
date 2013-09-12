#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.db import models
from django.utils.encoding import force_unicode 


class TypeLogiciel(models.Model):
    """
    Les logiciels sont de 3 types : général, propriétaire, libre.
    Un logiciel général ne spécifie pas un logiciel en particulier. Il est utilisé pour définir
    les composantes des portefeuilles facilement réutilisables. Un logiciel général se concrétise par
    un ou plusieurs logiciels libres ou propriétaires (par les équivalences)
    """
    typeLogiciel = models.CharField(max_length=50,  db_index=True)

    typeLogiciel.help_text = __doc__ 
    typeLogiciel.verbose_name = u'Type logiciel'
    
    def __unicode__(self):
        return force_unicode(self.typeLogiciel)
    class Meta: 
        unique_together= (("typeLogiciel", ),)
        verbose_name = 'Type Logiciel'
        verbose_name_plural = 'Type Logiciel'

class Famille(models.Model):
    """
    Les logiciels sont répartis en 3 familles :
    les logiciels **d'infrastructure
    les logiciels **généraux utilisés par les membres de l'organisation
    les logiciels **métiers.
    """
    famille = models.CharField(max_length=50, db_index=True)
    
    famille.verbose_name=u'famille'
    famille.help_text = __doc__ 
     
    def __unicode__(self):
        return force_unicode(self.famille)
    class Meta: 
        unique_together= (("famille", ),)
        verbose_name = 'Famille'
        verbose_name_plural = 'Familles'


class Niveau(models.Model):
    """
    niveau :petit, moyen, eleve
    """
    niveau = models.CharField(verbose_name=u'Niveau',max_length=50, db_index=True)
    niveau.help_text = "niveau :petit, moyen, eleve"
    
    def __unicode__(self):
        return force_unicode(self.niveau)
    class Meta: 
        unique_together= (("niveau", ),)

        verbose_name = 'Niveau'
        verbose_name_plural = 'Niveaux'



# References bibliographiques pour soutenir un commentaire ou des couts.
class Reference(models.Model):
    """
    Etiquette et enregistrement bibtex 
    prevoir un module bibtex pour la saisie et la visualisation
    """
    etiquette = models.CharField(verbose_name=u'Etiquette',max_length=50, blank=True, null=True, db_index=True)
    description = models.CharField(verbose_name=u'description',max_length=500 , blank=True, null=True,)
    enregistrementBibTex = models.TextField(verbose_name=u'Enregistrement BibTex')
    def __unicode__(self):
        return force_unicode(self.etiquette)
    class Meta: 
        ordering = ['etiquette']
        verbose_name = 'Reference'
        verbose_name_plural = 'References'


#------------------------------------------------------------------------------------------------


class Logiciel(models.Model):
    """
    La base de connaissance est constituée de fiches logiciel et de composantes standard (profils) des
    portefeuilles de logiciel des organisations.
    """
    nom = models.CharField(verbose_name=u'Nom',max_length=50, blank=True, null=True )
    dureeCycle = models.IntegerField(verbose_name=u'Duree cycle', blank=True, null=True,default = 3)
    description = models.CharField(verbose_name=u'description',max_length=500 , blank=True, null=True,)
    fonction = models.CharField(verbose_name=u'Fonction',max_length=50, blank=True, null=True,)
    commentaire = models.CharField(verbose_name=u'Commentaire',max_length=500, blank=True, null=True)
    editeur = models.CharField(verbose_name=u'Editeur',max_length=50, blank=True, null=True,)
    categorie = models.CharField(verbose_name=u'Categorie',max_length=50, blank=True, null=True,)
    nature = models.CharField(verbose_name=u'Nature',max_length=50, blank=True, null=True,)
    coutDeIntroduction = models.DecimalField(verbose_name=u'Cout de Introduction',max_digits=20, decimal_places=2, blank=True, null=True,default = 0)

    typeLogiciel = models.ForeignKey('TypeLogiciel')
    famille = models.ForeignKey('Famille')

    nom.help_text = u"Nom generique (pas de version)"
    nom.description = u"Un logiciel d'un éditeur qui change de nom mais qui assure la même fonction est considéré comme le même logiciel"
    
    dureeCycle.help_text = u"cycle d'évolution (années)"
    fonction.help_text = u"fonction generique"
    editeur.help_text = u"editeur ou organisation"
    categorie.help_text = u'paramètré, ad-hoc, ...'
    nature.help_text = u'individuel, partagé, ...'
    coutDeIntroduction.help_text = u"coûts dans l'année d'introduction"
    
 
    def __unicode__(self):
        return force_unicode(self.nom)
    class Meta: 
        unique_together= (("nom", ),)
#        managed = False
#        db_table = 'TCO_Logiciel'

#------------------------------------------------------------------------------------------------
        
        
class CoutAnnuel(models.Model):
    """
    Tableau pour la duree du cycle (annee, acquisition, maintenance, formation, support
    """
    annee = models.IntegerField(verbose_name=u'Annee',db_index=True)
    coutAcquisition = models.DecimalField(verbose_name=u'Cout acquisition',max_digits=20, decimal_places=2, null=True, db_index=True, default = 0)
    coutMaintenance = models.DecimalField(verbose_name=u'Cout maintenance',max_digits=20, decimal_places=2, null=True, db_index=True, default = 0)
    coutFormation = models.DecimalField(verbose_name=u'Cout formation',max_digits=20, decimal_places=2, null=True, db_index=True, default = 0)
    coutSupport = models.DecimalField(verbose_name=u'Cout support',max_digits=20, decimal_places=2, null=True, db_index=True, default = 0)
    logiciel = models.ForeignKey('Logiciel')
    def __unicode__(self):
        return force_unicode(self.annee) + ' ' + force_unicode(self.logiciel)
    class Meta: 
        unique_together= (("annee", "logiciel", ),)

        verbose_name = 'Cout Annuel'
        verbose_name_plural = 'Cout Annuel'


class CoutAdherance(models.Model):
    """
    tableau (logiciel initial, coßt Øvolution, coßt substitution, niveau (petit, moyen, ØlevØ)
    """
    logiciel = models.ForeignKey('Logiciel')
    logicielRef = models.ForeignKey('Logiciel', related_name='+' )
    niveau = models.ForeignKey('Niveau')
    coutEvolution = models.DecimalField(verbose_name=u'Cout evolution',max_digits=20, decimal_places=2,null=True, db_index=True, default = 0)
    coutSubstitution = models.DecimalField(verbose_name=u'Cout substitution',max_digits=20, decimal_places=2,null=True, db_index=True, default = 0)
    
    def __unicode__(self):
        return force_unicode(self.logiciel) + ' ' + force_unicode(self.logicielRef) + ' ' +force_unicode(self.niveau)
    class Meta: 
        unique_together= (("logiciel", "logicielRef", "niveau", ),)

        verbose_name = 'Cout Adherance'
        verbose_name_plural = 'Cout Adherance'

#------------------------------------------------------------------------------------------------
        

class DiscussionLogiciel(models.Model):
    date = models.DateField(verbose_name=u'date',blank=True, null=True, db_index=True)
    commentaireModif = models.CharField(verbose_name=u'commentaire modif',max_length=500)
    logiciel = models.ForeignKey('Logiciel')
    def __unicode__(self):
        return force_unicode(self.date) + ' ' + force_unicode(self.Logiciel)

    class Meta: 
        ordering = ['-date']
        verbose_name = 'Discussion Logiciel'
        verbose_name_plural = 'Discussion Logiciel'


class Sources(models.Model):
    reference = models.ForeignKey('Reference')
    logiciel = models.ForeignKey('Logiciel')
    
    def description(self):
        return self.reference.description 
    description.admin_order_field = 'reference__description'
    
    def __unicode__(self):
        return force_unicode(self.logiciel) + ' ' + force_unicode(self.reference)

    class Meta: 
        unique_together= (("logiciel", "reference", ),)

        
#------------------------------------------------------------------------------------------------


class Image(models.Model):
    """
    Une simple page contenant le nom, la description et la liste des logiciels (nom, type, categorie,
    nature, cycle). On doit pouvoir filtrer la liste par type (gØnØral, libre, propriØtaire ou tous)
    """
    nom = models.CharField(verbose_name=u'Nom',max_length=50,  db_index=True)
    description = models.CharField(verbose_name=u'Description',max_length=500, blank=True, null=True,)
    def __unicode__(self):
        return force_unicode(self.nom)
    class Meta: 
        verbose_name = 'Image'
        verbose_name_plural = 'Image'


class CompositionImage(models.Model):
    image = models.ForeignKey('Image')
    logiciel = models.ForeignKey('Logiciel')
    commentaire = models.CharField(verbose_name=u'Commentaire',max_length=500, blank=True, null=True,)

    #herites de logiciel 
    def typeLogiciel(self):
        return self.logiciel.typeLogiciel 
    typeLogiciel.admin_order_field = 'logiciel__typeLogiciel'

    def famille(self):
        return self.logiciel.famille 
    famille.admin_order_field = 'logiciel__famille'
    
    def __unicode__(self):
        return force_unicode(self.image) + ' ' + force_unicode(self.logiciel)
    class Meta: 
        unique_together= (("image", "logiciel", ),)
        verbose_name = 'Image'
        verbose_name_plural = 'Image'

        
class DiscussionImage(models.Model):
    image = models.ForeignKey('Image')
    date = models.DateField(verbose_name=u'Date', db_index=True)
    commentaire = models.CharField(verbose_name=u'commentaire discussion image',max_length=500)
    def __unicode__(self):
        return force_unicode(self.image) + ' ' + force_unicode(self.logiciel)
    class Meta: 
        ordering = ['-date']
        verbose_name = 'Discussion Image'
        verbose_name_plural = 'DiscussionImage'


#------------------------------------------------------------------------------------------------
# Organisation et inventaire de images 

class Organisation(models.Model):
    nom = models.CharField(verbose_name=u'Nom',max_length=50, db_index=True)
    description = models.CharField(verbose_name=u'Description',max_length=500, blank=True, null=True,)
    def __unicode__(self):
        return force_unicode(self.nom)
    class Meta:
        verbose_name = 'Organisation'
        verbose_name_plural = 'Organisations'


class SIO(models.Model):
    organisation = models.ForeignKey('Organisation')
    image = models.ForeignKey('Image')
    nombre = models.IntegerField(verbose_name=u'Nombre',max_length=50, default = 0)
    def __unicode__(self):
        return force_unicode(self.image) + ' ' + force_unicode(self.organisation)
    class Meta:
        unique_together= (("image", "organisation", ),)



