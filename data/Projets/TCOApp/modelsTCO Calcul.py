'''
Created on 2011-08-23

@author: dario
'''

from django.db import models
from django.utils.encoding import force_unicode 


class TCO(models.Model):
    Annee = models.CharField(verbose_name=u'Annee',max_length=50, blank=True, null=True, db_index=True)
    TCO = models.CharField(verbose_name=u'TCO',max_length=50)
    CoutAcquisition = models.DecimalField(verbose_name=u'Cout acquisition',max_digits=20, decimal_places=2)
    CoutMaintenance = models.DecimalField(verbose_name=u'Cout maintenance',max_digits=20, decimal_places=2)
    CoutFormation = models.DecimalField(verbose_name=u'Cout formation',max_digits=20, decimal_places=2)
    CoutSupport = models.DecimalField(verbose_name=u'Cout support',max_digits=20, decimal_places=2)
    CoutAdheranceOS = models.DecimalField(verbose_name=u'Cout adherance  OS',max_digits=20, decimal_places=2)
    CoutAdheranceGeneral = models.DecimalField(verbose_name=u'Cout adherance general',max_digits=20, decimal_places=2)
    CoutAdheranceMaitierAcquis = models.DecimalField(verbose_name=u'Cout adherance Maitier acquis',max_digits=20, decimal_places=2)
    CoutAdheranceMaitierMaison = models.DecimalField(verbose_name=u'Cout adherance Maitier maison',max_digits=20, decimal_places=2)
    Logiciel = models.ForeignKey('Logiciel')
    Scenario = models.ForeignKey('Scenario')
    def __unicode__(self):
        return force_unicode(self.Annee) + ' ' + force_unicode(self.Scenario) + ' ' + force_unicode(self.Logiciel)
    class Meta: 
        unique_together= (("Annee", "Scenario", "Logiciel", ),)



class CompositionScenario(models.Model):
    AnneeDebut = models.IntegerField(verbose_name=u'Annee debut',blank=True, null=True, db_index=True)
    AnneeFin = models.IntegerField(verbose_name=u'Annee fin',)
    nombre = models.CharField(verbose_name=u'nombre',max_length=50)
    Image = models.ForeignKey('Image')
    Scenario = models.ForeignKey('Scenario')
    def __unicode__(self):
        return force_unicode(self.AnneeDebut) + ' ' + force_unicode(self.Scenario) + ' ' + force_unicode(self.Image)
    class Meta: 
        unique_together= (("AnneeDebut", "Scenario", "Image", ),)

class Scenario(models.Model):
    Nom = models.CharField(verbose_name=u'Nom',max_length=50, blank=True, null=True, db_index=True)
    Version = models.CharField(verbose_name=u'Version',max_length=50, blank=True, null=True, db_index=True)
    Duree = models.IntegerField(verbose_name=u'Duree',)
    Description = models.CharField(verbose_name=u'Description',max_length=500)
    Niveau = models.ForeignKey('Niveau')
    TypeLogiciel = models.ForeignKey('TypeLogiciel')
    Organisation = models.ForeignKey('Organisation')
    def __unicode__(self):
        return force_unicode(self.Nom) + ' ' + force_unicode(self.Version) + ' ' + force_unicode(self.Organisation)
    class Meta: 
        unique_together= (("Nom", "Version", "Organisation", ),)


class SpecificationLogiciel(models.Model):
    DateDebut = models.DateField(verbose_name=u'Date debut',blank=True, null=True, db_index=True)
    DateFin = models.DateField(verbose_name=u'Date fin',blank=True, null=True,)
    Nombre = models.CharField(verbose_name=u'Nombre',max_length=50,blank=True, null=True)
    CoutAcquisition = models.DecimalField(verbose_name=u'Cout acquisition',max_digits=20, decimal_places=2,blank=True, null=True)
    CoutMaintenance = models.DecimalField(verbose_name=u'Cout maintenance',max_digits=20, decimal_places=2)
    CoutSupport = models.DecimalField(verbose_name=u'Cout support',max_digits=20, decimal_places=2)
    CoutFormation = models.DecimalField(verbose_name=u'Cout formation',max_digits=20, decimal_places=2)
    CoutAdheranceOS = models.DecimalField(verbose_name=u'Cout adherance OS',max_digits=20, decimal_places=2)
    CoutAdheranceGeneral = models.DecimalField(verbose_name=u'Cout adherance general',max_digits=20, decimal_places=2)
    CoutAdheranceMetierAcquis = models.DecimalField(verbose_name=u'Cout adherance Metier acquis',max_digits=20, decimal_places=2)
    CoutAdheranceMetierMaison = models.DecimalField(verbose_name=u'Cout adherance Metier maison',max_digits=20, decimal_places=2)
    Logiciel = models.ForeignKey('Logiciel')
    Scenario = models.ForeignKey('Scenario')
    def __unicode__(self):
        return force_unicode(self.DateDebut) + ' ' + force_unicode(self.Scenario) + ' ' + force_unicode(self.Logiciel)
    class Meta: 
        unique_together= (("DateDebut", "Scenario", "Logiciel", ),)


