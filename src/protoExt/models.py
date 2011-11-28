# This is an auto-generated model module by CeRTAE OMS PlugIn
# for project : "Modelibra" > 
# You'll have to do the following manually to clean this up:
#     * Rearrange models' order

from django.db import models
from django.utils.encoding import force_unicode

from django.contrib import admin

#datamodel name="Relational Data Model" idmodel="1" idref="0">



def strNotNull(  sValue ):
    if (sValue is None): 
        return "_"
    else: return sValue 



class MetaObj(models.Model):
    #OBJTYPE  = (('Domain', 'Domain'),('Model', 'Model'),('Concept', 'Concept'),('Property', 'Porperty'),('?', 'Unknown'),)
    code = models.CharField(verbose_name=u'Nom',blank = True, null = True, max_length=200 )
    objType = models.CharField(max_length=50)
    category = models.CharField(max_length=50, blank = True, null = True )
    alias = models.CharField(blank = True, null = True, max_length=50)
    physicalName = models.CharField(blank = True, null = True, max_length=200)
    description = models.TextField( blank = True, null = True, max_length=200)

    code.help_text = 'Codigo o Identificador principal del objeto'
    code.allowFilter = True
    
    description.sortable = False 
    description.protoExt = {}
    description.protoExt[ 'flex' ] = 1

    code.protoExt = {}
    code.protoExt[ 'width' ] = 200



    def __unicode__(self):
        return self.code 

    class Meta:
        verbose_name = 'MetaObj' 

   
class Domain(MetaObj):
    #DOMAINTYPE=(('Analyses',(('MCD','Modeleconceptualdedonnes'),('MLD','Modellogique'),('MPD','Modelphisique'),)),('Interface',(('MSI','Modeledespecificaciond''interface'),('MSR','Modeledespecificacionderapports'),)),('unknown','Unknown'),)
    origin = models.CharField(verbose_name=u'origin', blank = True, null = True, max_length=50)
    superDomain = models.ForeignKey('Domain', blank = True, null = True)

    def save(self, *args, **kwargs ):
        self.objType = "Domain"
        super(Domain, self).save(*args, **kwargs) # Call the "real" save() method.
    
    def __unicode__(self):
        return self.code 

    class Meta:
        verbose_name = 'Domaine'


#DGT: Como manejar la seleccion de opciones dependiendo del padre, implementar el manejo de discretas 
class Model(MetaObj):
    #MODELTYPE=(('Analyses',(('MCD','Modeleconceptualdedonnes'),('MLD','Modellogique'),('MPD','Modelphisique'),)),('Interface',(('MSI','Modeledespecificaciond''interface'),('MSR','Modeledespecificacionderapports'),)),('unknown','Unknown'),)
    modelPrefix = models.CharField(verbose_name=u'modelPrefix', blank = True, null = True, max_length=50)
    idModel = models.CharField(verbose_name=u'Ix', blank = True, null = True, max_length=50)
    idRef = models.CharField(verbose_name=u'IxRef', blank = True, null = True, max_length=50)
    domain = models.ForeignKey('Domain', verbose_name=u'Domaine')
    
#   superModel = models.ForeignKey('Model', blank = True, null = True)
    superModel = models.CharField( blank = True, null = True, max_length=50)

    def save(self, *args, **kwargs ):
        self.objType = "Model"
        super(Model, self).save(*args, **kwargs) # Call the "real" save() method.
    
    def __unicode__(self):
        return self.code 

    protoExt = {}
    protoExt[ 'description' ] = 'Esta es la description del concpeto concepto'


class Concept(MetaObj):
    model = models.ForeignKey('Model', verbose_name=u'Nom du modele')
    
#   superConcept = models.ForeignKey('Concept', blank = True, null = True)
    superConcept = models.CharField( verbose_name=u'Super table',blank = True, null = True, max_length=50)
    def __unicode__(self):
        return self.code 

    def save(self, *args, **kwargs ):
        self.objType = "Concept"
        super(Concept, self).save(*args, **kwargs) # Call the "real" save() method.

    class Meta:
        verbose_name = 'Entite'

    protoExt = {}
    protoExt[ 'description' ] = 'Esta es la description del concpeto concepto'


class Property(MetaObj):
    baseType = models.CharField(verbose_name=u'Type de Base', blank = True, null = True, max_length=50)
    length = models.IntegerField(blank = True, null = True)
    decLength = models.IntegerField(blank = True, null = True)

    isNullable = models.BooleanField()
    isRequired = models.BooleanField()
    isUnique = models.BooleanField()
    isForeign = models.BooleanField()
    foreignConcept = models.CharField(max_length=200,blank = True, null = True)

    defaultValue = models.CharField( blank = True, null = True, max_length=50)

    #DGT: La derivacion deberia ser una referencia pero en la carga no es posible hacer la referencia se requiere un campo texto 
    # pero el mantenimiento deberia ser con la referencia, podria guardarse en discretas y un procedimiento posterior 
    # agregaria las referencias reales 

#    derivationType = models.CharField( blank = True, null = True, max_length=50)
#    derivationRule = models.CharField( blank = True, null = True, max_length=50)
#    derivationConcept = models.CharField(max_length=200,blank = True, null = True)
#    derivationProperty = models.CharField(max_length=200,blank = True, null = True)

    concept = models.ForeignKey('Concept')
#   superProperty = models.ForeignKey('Property', blank = True, null = True)
    superProperty= models.CharField( blank = True, null = True, max_length=50, verbose_name=u'Propriete pere')
    
    concept.query_code = 'concept__code'
     
    concept.protoExt = {} 
    concept.protoExt[ 'query_code' ] = 'concept__code' 

    protoExt = {}
    protoExt[ 'description' ] = 'Esta es la description del concpeto concepto'


    def model_concept(self):
        return self.concept.model
    
    model_concept.short_description = 'model'

    def save(self, *args, **kwargs ):
        self.objType = "Property"
        super(Property, self).save(*args, **kwargs) # Call the "real" save() method.

    def __unicode__(self):
        sConcept = strNotNull(self.concept.code)
        sProperty = strNotNull(self.code)
        return self.concept.model.code + '.' + sConcept + '.' + sProperty    

    class Meta:
        verbose_name = 'Elements de donnees'


class Relationship(MetaObj):
    """
    * La relaciones son o no un campo?  (heredan de campo)
    Si son un campo, van a repetirse cada vez q se generen, si no son un campo pueden ser generadas
    de manera automatica como campos con el codigo correspondiente y un attr  isForeign 
    * La generacion debe hacerse para poder manejar el prototypo, los atributos del la relacion solo perteneces a la relacion 
    """
    
    baseMin = models.CharField( blank = True, null = True, max_length=50)
    baseMax = models.CharField( blank = True, null = True, max_length=50)
    refMin = models.CharField( blank = True, null = True, max_length=50)
    refMax = models.CharField( blank = True, null = True, max_length=50)

    concept = models.ForeignKey('Concept')
    """concept corresponde al concepto referencia"""
#   superProperty = models.ForeignKey('Property', blank = True, null = True)

    #DGT: deberia ser una referencia pero en la carga no es posible hacer la referencia se requiere un campo texto
     
    baseConcept = models.CharField(max_length=50, blank = True, null = True,)

    def save(self, *args, **kwargs ):
        self.objType = "Relationship"
        super(Relationship, self).save(*args, **kwargs) # Call the "real" save() method.

    def __unicode__(self):
        return self.code

    class Meta:
        verbose_name = 'Associations'


class UdpDefinition(models.Model):
    code = models.CharField(max_length=50)
    baseType = models.CharField(blank = True, null = True, max_length=50)
    alias = models.CharField(blank = True, null = True, max_length=50)
    description = models.TextField(blank = True, null = True, max_length=200)
    def __unicode__(self):
        return self.code

class Udp(models.Model):
    code = models.CharField(max_length=50)
    valueUdp = models.TextField(blank = True, null = True, max_length=200)
    indexUdp = models.IntegerField(blank = True, null = True)
    metaObj = models.ForeignKey('MetaObj')

    def objType(self):
        return self.metaObj.objType

    def __unicode__(self):
        return (strNotNull(self.metaObj.code) + '.' + strNotNull(self.code))

#    Esto deberia ser la tabla de titulos de UPS ( un maesrto ) 
#    udpTarget = models.CharField(verbose_name=u'udpTarget', blank = True, null = True, max_length=50)
#    udpType = models.CharField(verbose_name=u'udpType', blank = True, null = True, max_length=50)
#    udpRule = models.CharField(verbose_name=u'udpRule', blank = True, null = True, max_length=50)

class UpdInline(admin.TabularInline):
    model = Udp 
    fk_name = 'metaObj'
    extra = 1
    fields = ('code', 'valueUdp')


class MetaLinkModel(models.Model):
    code = models.CharField(max_length=50)
    source = models.CharField(max_length=50)
    destination = models.CharField(max_length=50)
    domain = models.ForeignKey('Domain')

    def __unicode__(self):
        return self.code 

class MetaLink(models.Model):
    code = models.CharField(max_length=50)
    alias = models.CharField(max_length=50)
    destinationText = models.CharField(max_length=50)
    sourceCol = models.CharField(max_length=50)
    destinationCol = models.CharField(max_length=50)

    metaLinkModel = models.ForeignKey('MetaLinkModel')

    def __unicode__(self):
        return self.code 

    class Meta:
        verbose_name = 'Modeles de liens'


#fdsDomain = ( 'code', 'category', 'description',  'origin', 'superDomain', 'alias', 'physicalName' )
#
#fdsModel= ( 'code', 'category', 'description',  'modelPrefix', 'superModel', 'alias', 'physicalName' )
#intModel= ( 'idModel', 'idRef' )
#
#fdsConcept= ( 'model', 'code', 'category', 'description',  'superConcept', 'alias', 'physicalName')
#
#fdsProperty = ( 'concept', 'code', 'category', 'description',  'baseType', 'defaultValue', 'superProperty', 'alias', 'physicalName')
#booProperty = ( 'isNullable', 'isRequired', 'isSensitive', 'isEssential', 'isUnique', 'isForeign')
#intProperty = ( 'length', 'decLength', 'conceptPosition', )
#
#fdsForeign= ( 'code', 'category', 'description', 'baseMin', 'baseMax', 'refMin', 'refMax', 'superProperty', 'baseConcept', 'alias', 'physicalName')
#
#fdsLinkModel= ['code', 'source', 'destination']
#fdsLink = ['code', 'alias', 'destinationText', 'sourceCol', 'destinationCol']
#fdsUdpDefinition = ['code', 'baseType', 'alias', 'description']

