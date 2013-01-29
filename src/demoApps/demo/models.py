# -*- coding: utf-8 -*-

from django.db import models

class Comunidad(models.Model):
    nombre = models.CharField(max_length=50, blank = True, null = True )
    tipo = models.CharField(max_length=100, blank = True, null = True )
    tipoArea = models.CharField(max_length=100, blank = True, null = True )
    viviendas = models.IntegerField( blank = True, null = True)
    habitantes = models.IntegerField( blank = True, null = True)
    habitanArea = models.IntegerField( blank = True, null = True)
    concentracionAlta = models.TextField(blank = True, null = True )
    fuente = models.DecimalField(blank = True, null = True, decimal_places =2 ,max_digits = 6)

    municipio = models.CharField(max_length=50, blank = True, null = True )
    departamento = models.CharField(max_length=100, blank = True, null = True )

    vivienAreaInf = models.DecimalField(blank = True, null = True, decimal_places =2 ,max_digits = 6)
    ubicacionComu = models.TextField(blank = True, null = True )
    entEduc = models.CharField(max_length=100, blank = True, null = True )
    entSalud = models.CharField(max_length=100, blank = True, null = True )
    indust = models.CharField(max_length=100, blank = True, null = True )
    orgComunit = models.CharField(max_length=100, blank = True, null = True )

    descripcion = models.TextField(blank = True, null = True )
    observaciones = models.TextField(blank = True, null = True )
    fecProceso = models.DateField( blank=True, null=True)
    usuario = models.CharField(max_length=100, blank = True, null = True )

    def __unicode__(self):
        return self.nombre 
    

class Proyecto(models.Model):
    proyecto = models.CharField(max_length=100 )
    fundacion = models.CharField(max_length=100, blank = True, null = True )
    observaciones = models.TextField(blank = True, null = True )
    valor = models.DecimalField(blank = True, null = True, decimal_places =2 ,max_digits = 6)
    comunidad = models.ForeignKey('Comunidad',  blank = False, null = False )

    def __unicode__(self):
        return self.proyecto 
    
    
class Colegio(models.Model):
    nombre = models.CharField(max_length=100 )
    comunidad = models.ForeignKey('Comunidad',  blank = False, null = False )

    def __unicode__(self):
        return self.nombre     