# -*- coding: utf-8 -*-

from django.db import models
#from protoLib.models import get 


class Category(models.Model):
    nom = models.CharField(verbose_name=u'Nom', max_length=200 )
    parentCategory = models.ForeignKey('Category', blank = True, null = True)
    def __unicode__(self):
        
        return self.nom


class MotCle(models.Model):
    mot = models.CharField(verbose_name=u'Nom', max_length=200 )
    category = models.ManyToManyField( Category )

    def __unicode__(self):
        return self.mot 

#def getSchema( reg, parent, code, sce ):
#    if reg[ parent ]: 
        