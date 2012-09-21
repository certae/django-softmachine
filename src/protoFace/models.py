# -*- coding: utf-8 -*-

from django.db import models
from protoLib.models import  getFullPath 


class Person(models.Model):
    nom = models.CharField(verbose_name=u'Nom', max_length=200 )
    sex = models.CharField(verbose_name=u'sex', max_length=200 )
    birthDate = models.DateField(blank=True, null=True)

    def __unicode__(self):
        return self.nom


class Contact(models.Model):
    person = models.ForeignKey('Person', blank = True, null = True, related_name = 'personBase')
    related = models.ForeignKey('Person', blank = True, null = True, related_name = 'relatedPers')
    typeRelation = models.CharField( max_length=200 )

    def __unicode__(self):
        return self.person + ' ' + self.related 


class Post(models.Model):
    person = models.ForeignKey('Person', blank = True, null = True )
    title  = models.TextField( max_length=200 )
    post  = models.TextField( max_length=200 )

    def __unicode__(self):
        return self.person + ' ' + self.title 
