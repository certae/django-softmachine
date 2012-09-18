# -*- coding: utf-8 -*-

from django.db import models
from protoLib.models import  getFullPath 


class Category(models.Model):
    nom = models.CharField(verbose_name=u'Nom', max_length=200 )
    parentCategory = models.ForeignKey('Category', blank = True, null = True)

    @property
    def fullPath(self):
        return getFullPath( self , 'parentCategory',  'nom', 'fullPath'  )
        
    def __unicode__(self):
        return self.fullPath





class Category2(models.Model):
    nom = models.CharField(verbose_name=u'Nom', max_length=200 )
    parentCategory = models.ForeignKey('Category2', blank = True, null = True)

    schema = models.CharField(verbose_name=u'Schema', max_length=500, editable = False )
        
    def __unicode__(self):
        return self.schema 

    def save(self, *args, **kwargs ):
        self.schema = getFullPath( self , 'parentCategory',  'nom', 'schema'  )
        super(Category2, self).save(*args, **kwargs) 


#    protoExt = { 'protoFields' : { 
#          'fullPath': {'readOnly' : True},
#     }}



class MotCle(models.Model):
    mot = models.CharField(verbose_name=u'Nom', max_length=200 )
    category = models.ManyToManyField( Category )

    def __unicode__(self):
        return self.mot 

        
        
