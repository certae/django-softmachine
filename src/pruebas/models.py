# -*- coding: utf-8 -*-

from django.db import models


class PruebaM(models.Model):
    # Maestro para pruebas 
    prCode = models.CharField(verbose_name=u'Codigo',blank = True, null = True, max_length=200 , default = 'Codigo', unique = True )
    prDescription = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

    def __unicode__(self):
        return self.prCode + '-' + self.prDescription

    class Meta:
        verbose_name = 'Maestro' 


class Prueba(models.Model):
    OBJTYPE  = (('Domain', 'Domain'),('Model', 'Model'),('Concept', 'Concept'),('Property', 'Porperty'),('?', 'Unknown'),)
    
    prCode = models.CharField(verbose_name=u'Codigo',blank = True, null = True, max_length=200 , default = 'Codigo', unique = True )
    prDescription = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
    prInteger = models.IntegerField(blank = True, null = True)
    
#    prChoice = models.CharField(max_length=50, choices= OBJTYPE)
#    prBoolean = models.BooleanField(verbose_name=u'Active', default = True)
#    prDate  = models.DateField(blank = True, null = True)
#    prTime  = models.TimeField(blank = True, null = True, default = '06:00')
#    prDecimal = models.DecimalField(blank = True, null = True, max_digits=5, decimal_places=2, default = 0.00)

    prMaestro1 = models.ForeignKey('PruebaM', verbose_name=u'Maestro1', blank = True, null = True, related_name = '+')
    
#    prMaestro2 = models.ForeignKey('PruebaM', verbose_name=u'Maestro2', blank = True, null = True, related_name = '+')

    def __unicode__(self):
        return self.prCode 
#    + '-' + self.prDescription

    class Meta:
        verbose_name = 'Detalle' 
#        unique_together = ('prDecimal', 'prInteger',)

