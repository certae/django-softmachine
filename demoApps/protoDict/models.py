# -*- coding: utf-8 -*-

from django.db import models

from protoLib.utilsBase import  strNotNull
from protoLib.models import ProtoModel

#    code = models.CharField(verbose_name=u'Nom',blank = False, null = False, max_length=200 )
#    
#    category = models.CharField(max_length=50, blank = True, null = True )
#    alias = models.CharField(verbose_name=u'Alias',blank = True, null = True, max_length=50)
#    physicalName = models.CharField(blank = True, null = True, max_length=200)
#    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
#
#    def __unicode__(self):
#        return self.code 

   
class Domain(ProtoModel):
    """El dominio corresponde a un nivel conceptual corportativo MCCD"""
#    code = models.CharField(verbose_name=u'Nom',blank = False, null = False, max_length=200 , unique = True)
    code = models.CharField(verbose_name=u'Nom',blank = False, null = False, max_length=200 )

    category = models.CharField(max_length=50, blank = True, null = True )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
    
    def __unicode__(self):
        return self.code 


class Model(models.Model):
    """Los modelos pueden ser abstractos ( conceptuales ) o fisicos 
    * en caso de modelos fisicos el conectionPath puede ser el conection string o la ruta de acceso
    * los modelos pueden tener prefijos especificos para todas sus entidades ( conceptos ) 
    """
    domain = models.ForeignKey('Domain', verbose_name=u'Domaine', blank = False, null = False )
    code = models.CharField(verbose_name=u'Nom',blank = False, null = False, max_length=200 )

    category = models.CharField(max_length=50, blank = True, null = True )
    modelPrefix = models.CharField(verbose_name=u'modelPrefix', blank = True, null = True, max_length=50)
    conectionPath = models.CharField(blank = True, null = True, max_length=200)
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

#    class Meta:
#        unique_together = ('domain', 'code',  )

    def __unicode__(self):
        return self.code 
    
    protoExt = { 'protoUdp' : { 'udpTable' : 'UdpModel' }}



class Concept(models.Model):
    """ Concept corresponde a las entidades, puede tener asociado un elto fisico 
    """    
    model = models.ForeignKey('Model' )
    code = models.CharField(verbose_name=u'Nom',blank = False, null = False, max_length=200 )
    
    category = models.CharField(max_length=50, blank = True, null = True )
    physicalName = models.CharField(blank = True, null = True, max_length=200)
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

    def __unicode__(self):
        return self.code 

#    class Meta:
#        unique_together = ('model', 'code',  )

class PropertyDom(models.Model):
    """ Propiedades a nivel de dominio,  
    * definicion semantica del problema
    """
    code = models.CharField(verbose_name=u'Nom',blank = False, null = False, max_length=200 )

    domain = models.ForeignKey('Domain' ,  primary_key=True)

    """ Caracteristicas generales q definen el campo """
    baseType = models.CharField(verbose_name=u'Type de Base', blank = True, null = True, max_length=50)
    prpLength = models.DecimalField(blank = True, null = True, decimal_places =2 ,max_digits = 6)

    """ defaultValue: Puede variar en cada instancia """ 
    defaultValue = models.CharField( blank = True, null = True, max_length=50)
    
    """ Lista de valores CSV ( idioma?? ) """ 
    propertyChoices = models.CharField( blank = True, null = True, max_length=200)
    
    category = models.CharField(max_length=50, blank = True, null = True )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

    def __unicode__(self):
        return self.code 

#    class Meta:
#        unique_together = ('domain', 'code',  )
#    protoExt = { 'protoUdp' : { 'udpTable' : 'UdpPropertyDom' }}


class PropertyModel(models.Model):
    """
    * Propiedades por modelo, subdominio de propiedades a nivel de modelo, es solo informativo 
    * se requiere para el diccionario MSSQ, podria generarse navegando model-concept-prop 
    * pero el primer paso en la metodologia implica la definicion semantica de propiedades por modelo, 
    * este concepto permite organizar esta informacion. 
    
    * La derivacion de prpConcpeto se toma desde el dominio, pues esta tabla es importante solo en la metodologia de 
    * definicion semantica,   
    """

    model = models.ForeignKey('Model' )
    propertyDom = models.ForeignKey('PropertyDom' )

    tag = models.CharField(blank = True, null = True, max_length=50)
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

    def __unicode__(self):
        return unicode( self.model.code ) + ' - ' +  unicode( self.propertyDom.code )

#    class Meta:
#        unique_together = ('model', 'propertyDom',  )

class PropertyConcept(models.Model):
    """
    * Propiedades por tabla, definicion a nivel de modelo de datos. 
    """
    concept = models.ForeignKey('Concept', related_name = 'pConcept')
    propertyDom = models.ForeignKey('PropertyDom' )

    """ 
    * alias:  Es el nombre en el concpeto, una especie de sinonimo en caso de q existan varias ocurrencias del mismo
    * physicalName : mapea el nombre real de la Db   
    """
    alias = models.CharField(verbose_name=u'Alias',blank = True, null = True, max_length=50)
    physicalName = models.CharField(blank = True, null = True, max_length=200)

    """ caracteristicas propias de la instancia """ 
    isNullable = models.BooleanField()
    isRequired = models.BooleanField()
    isSensitive = models.BooleanField()
    isEssential = models.BooleanField()
    isUnique = models.BooleanField()
 
    defaultValue = models.CharField( blank = True, null = True, max_length=50)
    
    isForeign = models.BooleanField()
    """No se puede crear el vinculo inmediato, pues es posible q no este aun creado""" 
    foreignConcept = models.CharField( blank = True, null = True, max_length=50)
    foreignFilter = models.CharField( blank = True, null = True, max_length=50)

    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

#    class Meta:
#        unique_together = ('concept', 'propertyDom',  )

    def __unicode__(self):
        return self.concept.code + '.' +  strNotNull( self.alias, self.propertyDom.code )     


class Relationship(models.Model):
    """
    * El proposito fundamental de esta clase es poder mapear la informacion grafica de origen
    * la definicion de la cardinlaidad y otras se maneja aqui,
    * La relaciones son en realidad campos q apuntan a otro concepto  
    """
    code = models.CharField(verbose_name=u'Alias',blank = True, null = True, max_length=50)

    refConcept = models.ForeignKey('Concept', related_name = 'bConcept')

    """No se puede crear el vinculo inmediato, pues es posible q no este aun creado""" 
    baseConcept = models.CharField( blank = True, null = True, max_length=50)

    """ Nombre del set en la tabla base ( related_name de Django ) """
    """ Nombre del campo referenciado (fKey) """
    baseName = models.CharField( blank = True, null = True, max_length=50)
    refName = models.CharField( blank = True, null = True, max_length=50)

    baseMin = models.CharField( blank = True, null = True, max_length=50)
    baseMax = models.CharField( blank = True, null = True, max_length=50)
    refMin = models.CharField( blank = True, null = True, max_length=50)
    refMax = models.CharField( blank = True, null = True, max_length=50)

    alias = models.CharField(verbose_name=u'Alias',blank = True, null = True, max_length=50)
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

    def __unicode__(self):
        return unicode( self.baseConcept  ) + ' -> ' + unicode( self.refConcept.code ) 


class PropertyEquivalence(models.Model):
#   * Los dos deben pertenecer al mismo dominio, pero puedo agregar al zoom el filtro del campo de base sourceProp__domain 
#   domain = models.ForeignKey('Domain')

    sourceProperty = models.ForeignKey('PropertyDom', blank = True, null = True, related_name = 'sourcePrp')
    targetProperty = models.ForeignKey('PropertyDom', blank = True, null = True, related_name = 'targetPrp')

    code = models.CharField(verbose_name=u'Alias',blank = True, null = True, max_length=50)
    alias = models.CharField(verbose_name=u'Alias',blank = True, null = True, max_length=50)
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
    tag = models.CharField(blank = True, null = True, max_length=50)

    def __unicode__(self):
        return self.sourceProperty.code + ' - ' + self.targetProperty.code   

    class Meta:
        unique_together = ('sourceProperty', 'targetProperty',  )



# ---------------------------

class UdpModel(models.Model):
    model = models.ForeignKey('Model')
    code = models.CharField(max_length=50)
    valueUdp = models.TextField(blank = True, null = True, max_length=200)

    def __unicode__(self):
        return self.model.code  + '.' + self.code   

#    class Meta:
#        unique_together = ('model', 'code',)


class UdpPropertyDom(models.Model):
    propertyDom = models.ForeignKey('PropertyDom')
    code = models.CharField(max_length=50)
    valueUdp = models.TextField(blank = True, null = True, max_length=200)

    def __unicode__(self):
        return self.propertyDom.code + '.' + self.code   

#    class Meta:
#        unique_together = ('propertyDom', 'code',)

