# -*- coding: utf-8 -*-

from django.db import models
from django.contrib import admin

from protoLib.utilsBase import  strNotNull


class MetaObj(models.Model):
    code = models.CharField(verbose_name=u'Nom',blank = False, null = False, max_length=200 )
    category = models.CharField(max_length=50, blank = True, null = True )
    alias = models.CharField(verbose_name=u'Alias',blank = True, null = True, max_length=50)
    physicalName = models.CharField(blank = True, null = True, max_length=200)
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

    def __unicode__(self):
        return self.code 

    class Meta:
        abstract = True


   
class Domain(MetaObj):
    origin = models.CharField(verbose_name=u'origin', blank = True, null = True, max_length=50)
    superDomain = models.ForeignKey('Domain', blank = True, null = True)

#    def __unicode__(self):
#        return self.code 


class Model(MetaObj):
    modelPrefix = models.CharField(verbose_name=u'modelPrefix', blank = True, null = True, max_length=50)
    idModel = models.CharField(verbose_name=u'Ix', blank = True, null = True, max_length=50)
    idRef = models.CharField(verbose_name=u'IxRef', blank = True, null = True, max_length=50)
    domain = models.ForeignKey('Domain', verbose_name=u'Domaine')
    
    def __unicode__(self):
        return self.code 

    protoExt = { 'udpTable' : 'UdpModel' }


class UdpModel(models.Model):
    code = models.CharField(max_length=50)
    valueUdp = models.TextField(blank = True, null = True, max_length=200)
    model = models.ForeignKey('Model')

    def __unicode__(self):
        return strNotNull(self.model.code) + '.' + strNotNull(self.code)   

    class Meta:
        unique_together = ('model', 'code',)


class Concept(MetaObj):
    model = models.ForeignKey('Model' )

    def __unicode__(self):
        return self.code 


class PropertyDom(MetaObj):
    """
    * Propiedades a nivel de dominio,  definicion semantica del problema
    """
    
    baseType = models.CharField(verbose_name=u'Type de Base', blank = True, null = True, max_length=50)
    prpLength = models.DecimalField(blank = True, null = True, decimal_places =2 ,max_digits = 6)

    domain = models.ForeignKey('Domain' )

    def __unicode__(self):
        return strNotNull(self.code)    

    protoExt = { 'udpTable' : 'UdpPropertyDom' }


class UdpPropertyDom(models.Model):
    code = models.CharField(max_length=50)
    valueUdp = models.TextField(blank = True, null = True, max_length=200)
    propertyDom = models.ForeignKey('PropertyDom')

    def __unicode__(self):
        return self.propertyDom.code + '.' + self.code   

    class Meta:
        unique_together = ('propertyDom', 'code',)



class PropertyConcept(MetaObj):
    """
    * Propiedades por tabla, definicion a nivel de modelo de datos. 
    """

    propertyDom = models.ForeignKey('PropertyDom' )
    concept = models.ForeignKey('Concept', related_name = 'pConcept')

    isNullable = models.BooleanField()
    isRequired = models.BooleanField()
    isUnique = models.BooleanField()
    defaultValue = models.CharField( blank = True, null = True, max_length=50)
    
    isForeign = models.BooleanField()
    foreignConcept = models.ForeignKey('PropertyDom',blank = True, null = True, related_name = 'fConcept')


    def __unicode__(self):
        return self.concept.code + '.' +  self.code    



class Relationship(MetaObj):
    """
    * La relaciones son tambien campos, la definicion de la cardinlaidad y otras se maneja aqui,
    * La idea es poder mapear la informacion grafica de origen
    """
    
    baseMin = models.CharField( blank = True, null = True, max_length=50)
    baseMax = models.CharField( blank = True, null = True, max_length=50)
    refMin = models.CharField( blank = True, null = True, max_length=50)
    refMax = models.CharField( blank = True, null = True, max_length=50)

    """ Nombre del campo FKey """
    refName = models.CharField( blank = True, null = True, max_length=50)

    """ Nombre del set en la tabla base ( related_name de Django ) """
    relatedName = models.CharField( blank = True, null = True, max_length=50)

    concept = models.ForeignKey('Concept', related_name = 'fConcept')
    baseConcept = models.ForeignKey('Concept', related_name = 'bConcept')

    def __unicode__(self):
        return self.code



class MetaLinkModel(models.Model):
    code = models.CharField(max_length=50)
    source = models.CharField(max_length=50)
    destination = models.CharField(max_length=50)

    sourceRef = models.ForeignKey('Model', blank = True, null = True, related_name = 'sourceModel')
    destinationRef = models.ForeignKey('Model', blank = True, null = True, related_name = 'destModel')

    domain = models.ForeignKey('Domain')


    def __unicode__(self):
        return self.code 

class MetaLink(models.Model):
    code = models.CharField(max_length=50)
    alias = models.CharField(max_length=50)
    destinationText = models.CharField(max_length=50)
    sourceCol = models.CharField(max_length=50)
    destinationCol = models.CharField(max_length=50)

    sourceColRef = models.ForeignKey('Property', blank = True, null = True, related_name = 'sourceCol')
    destinationColRef = models.ForeignKey('Property', blank = True, null = True, related_name = 'destCol')

    metaLinkModel = models.ForeignKey('MetaLinkModel')
    

    def __unicode__(self):
        return self.code 

    class Meta:
        verbose_name = 'Modeles de liens'

