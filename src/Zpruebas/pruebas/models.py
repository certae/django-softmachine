# -*- coding: utf-8 -*-

from django.db import models


class Papa(models.Model):
    # Maestro REcursivo  
    prCode = models.CharField(verbose_name=u'Codigo',blank = True, null = True, max_length=200 , default = 'Codigo', unique = True )
    superPapa = models.ForeignKey('Papa', verbose_name=u'SuperPapa')
    def __unicode__(self):
        return self.prCode 

    class Meta:
        verbose_name = 'Papa' 

class PruebaM(models.Model):
    # Maestro para pruebas 
    prCode = models.CharField(verbose_name=u'Codigo',blank = True, null = True, max_length=200 , default = 'Codigo', unique = True )
    prDescription = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
    prPapa1 = models.ForeignKey('Papa', related_name = 'papa1')
    prPapa2 = models.ForeignKey('Papa', related_name = 'papa2')

    def __unicode__(self):
        return self.prCode + '-' + self.prDescription

    class Meta:
        verbose_name = 'Maestro' 


class Prueba(models.Model):
    OBJTYPE  = (('Domain', 'Domain'),('Model', 'Model'),('Concept', 'Concept'),('Property', 'Porperty'),('?', 'Unknown'),)
    
    prCode = models.CharField(verbose_name=u'Codigo',blank = True, null = True, max_length=200 , default = 'Codigo', unique = True )
    prDescription = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
    prInteger = models.IntegerField(blank = True, null = True)
    prChoice = models.CharField(max_length=50, choices= OBJTYPE)
    
    prBoolean = models.BooleanField(verbose_name=u'Active', default = True)
    prDate  = models.DateField(blank = True, null = True)
    prTime  = models.TimeField(blank = True, null = True, default = '06:00')
    prDecimal = models.DecimalField(blank = True, null = True, max_digits=5, decimal_places=2, default = 0.00)

    prMaestro1 = models.ForeignKey('PruebaM', verbose_name=u'Maestro1', blank = True, null = True, related_name = 'prMaestro1')
    prMaestro2 = models.ForeignKey('PruebaM', verbose_name=u'Maestro2', blank = True, null = True, related_name = 'prMaestro2')

    def __unicode__(self):
        return self.prCode 
#    + '-' + self.prDescription

    class Meta:
        verbose_name = 'Detalle' 
#        unique_together = ('prDecimal', 'prInteger',)



# ********************************* ManyToMany N2N 
#https://docs.djangoproject.com/en/1.4/topics/db/examples/many_to_many/

class Publication(models.Model):
    title = models.CharField(max_length=30)

    def __unicode__(self):
        return self.title

    class Meta:
        ordering = ('title',)

class Author(models.Model):
    name = models.CharField(max_length=128)

    def __unicode__(self):
        return self.name


class Article(models.Model):
    headline = models.CharField(max_length=100)
    publications = models.ManyToManyField(Publication)
    author = models.ForeignKey(Author)

    def __unicode__(self):
        return self.headline

    class Meta:
        ordering = ('headline',)
        
        

# https://docs.djangoproject.com/en/1.4/topics/db/models/#intermediary-manytomany


class Person(models.Model):
    name = models.CharField(max_length=128)

    def __unicode__(self):
        return self.name

class Group(models.Model):
    name = models.CharField(max_length=128)
    members = models.ManyToManyField(Person, through='Membership')

    def __unicode__(self):
        return self.name

class Membership(models.Model):
    person = models.ForeignKey(Person)
    group = models.ForeignKey(Group)
    date_joined = models.DateField()
    invite_reason = models.CharField(max_length=64)
