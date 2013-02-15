# -*- coding: utf-8 -*-

from django.db import models
from protoLib.models import ProtoModel 

from protoLib.fields import JSONField,  JSONAwareManager

   
class Domain(ProtoModel):
    """El dominio corresponde a un nivel conceptual corportativo MCCD"""
    code = models.CharField(verbose_name=u'Nom',blank = False, null = False, max_length=200, unique = True )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
    
    def __unicode__(self):
        return self.code 

    class Meta:
        permissions = (
            ( "read_domain", "Can read domain"),
        )

    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "smOwningTeam", "smCreatedOn"]      
        }
    } 


class Model(ProtoModel):
    """
    Los modelos corresponde a una solucion especifica,  
    varios modelos pueden estar enmarcados en un dominio
    
    Los modelos son la unidad para generar una solucion ejecutable, 
    los modelos pueden tener prefijos especificos para todas sus componentes ( entidades ) 
    """
    domain = models.ForeignKey('Domain', verbose_name=u'Domaine', blank = False, null = False )
    code = models.CharField(verbose_name=u'Nom',blank = False, null = False, max_length=200 )

    category = models.CharField(max_length=50, blank = True, null = True )
    modelPrefix = models.CharField(verbose_name=u'modelPrefix', blank = True, null = True, max_length=50)
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

    class Meta:
        unique_together = ('domain', 'code',  )
        
    unicode_sort = ('domain', 'code',  )

    def __unicode__(self):
        return self.code 
    
    protoExt = { 
        "actions": [
            { "name": "doModelPrototype", "actionParams": [] }, 
        ], 
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "smOwningTeam", "smCreatedOn"]      
        }
    } 
    
    
    
class Entity(ProtoModel):
    """ 
    Entity corresponde a las entidades, puede tener asociado un elto fisico;  
    
    """    
    model = models.ForeignKey('Model' )
    code = models.CharField(verbose_name=u'Nom',blank = False, null = False, max_length=200 )
    
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

    def __unicode__(self):
        return self.model.code + '.' + self.code 

    unicode_sort = ('domain', 'code',  )

    class Meta:
        unique_together = ('model', 'code',  )

    protoExt = { 
        "actions": [
            { "name": "doEntityPrototype", "actionParams": [] }, 
        ], 
        "protoDetails": [
        {
            "__ptType": "protoDetail",
            "menuText": "Properties",
            "conceptDetail": "prototype.Property",
            "detailName": "entity",
            "detailField": "entity__pk",
            "masterField": "pk"
        },
        {
            "__ptType": "protoDetail",
            "menuText": "Relationships",
            "conceptDetail": "prototype.Relationship",
            "detailName": "entity",
            "detailField": "entity__pk",
            "masterField": "pk"
        }
        ], 
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "smOwningTeam", "smCreatedOn"]      
        }
    } 


BASE_TYPES = ( ( 'string', 'string' ),
               ( 'text', 'text' ),  
               ( 'bool', 'bool' ), 
               ( 'int', 'int' ),
               ( 'decimal', 'decimal' ), 
               ( 'combo', 'combo' ),  
               ( 'date',  'date' ),
               ( 'datetime', 'datetime' ), 
               ( 'time', 'time' )
              ) 

class PropertyBase(ProtoModel):

    code = models.CharField(verbose_name=u'Nom',blank = False, null = False, max_length=200 )

    """baseType, prpLength:  Caracteristicas generales q definen el campo """
    baseType = models.CharField(verbose_name=u'Type de Base', blank = True, null = True, max_length=50, choices = BASE_TYPES)
    prpLength = models.DecimalField(blank = True, null = True, decimal_places =2 ,max_digits = 6)

    """defaultValue: Puede variar en cada instancia """ 
    defaultValue = models.CharField( blank = True, null = True, max_length=50)
    
    """propertyChoices:  Lista de valores CSV ( idioma?? ) """ 
    propertyChoices = models.CharField( blank = True, null = True, max_length=200 )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

    """isSensitive: Indica si las propiedades requieren un nivel mayor de seguridad """  
    isSensitive = models.BooleanField()

    class Meta:
        abstract = True



CRUD_TYPES = (  ('screenOnly','screenOnly' ), 
                ('storeOnly', 'storeOnly' ),  
                ('readOnly',  'readOnly' ), 
                ('insertOnly','insertOnly'  ),
                ('updateOnly','updateOnly'  ),  
                ('linked',    'linked' ), 
                ('copied',    'copied' ), 
              ) 


class Property(PropertyBase):
    """ 
    Propiedades por tabla, definicion a nivel de modelo de datos.
    Las relaciones heredan de las propriedades y definien la cardinalidad 
    """

    entity = models.ForeignKey('Entity', related_name = 'propertySet')
    
    """propertyModel : corresponde a la especificacion en el modelo ( metodologia: user history )"""
    propertyModel = models.ForeignKey('PropertyModel', blank = True, null = True )

    # -----------  caracteristicas propias de la instancia
    """isPrimary : La llave primaria siempre es artificial, se deja con propositos academicos, implica isUnique """  
    isPrimary = models.BooleanField()
    isUnique = models.BooleanField()

    """isNullable: tiene q ver con la Db"""    
    isNullable = models.BooleanField()
    
    """isRequired: tiene q ver con el llenado de datos"""
    isRequired = models.BooleanField()

    """isReadOnly: ReadOnly field"""
    isReadOnly = models.BooleanField()

    """isEssential: Indica si las propiedades saldran en la vista por defecto """ 
    isEssential = models.BooleanField()

    """isForeign: indica si la propiedad ha sido definida en  Relationship"""
    isForeign = models.BooleanField( editable = False, default = False )


    """cpFrom____ : permite definir como heredar campos complejos (absorber JsonFields)"""
#    crudType    = models.CharField( blank = True, null = True, max_length=200, choices = CRUD_TYPES)
    cpFromModel = models.CharField( blank = True, null = True, max_length=200)
    cpFromField = models.CharField( blank = True, null = True, max_length=200)

    class Meta:
        unique_together = ('entity', 'code',  )

    def __unicode__(self):
        return self.entity.code + '.' +  self.code     

    unicode_sort = ('entity', 'code',  )

    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "smOwningTeam", "smCreatedOn"]      
        }
    } 


class Relationship(Property):
    """
    * Es un tipo particula de propiedad q define las relaciones,  la definicion de la cardinlaidad y otras
    """

    """refEntity : entidad referenciada""" 
    refEntity = models.ForeignKey('Entity', related_name = 'fKeysRefSet')

    """relatedName:  Nombre del set en la tabla primaria ( modelacion objeto )  """
    relatedName = models.CharField( blank = True, null = True, max_length=50)

    # Caridanlidad 
    baseMin = models.CharField( blank = True, null = True, max_length=50)
    baseMax = models.CharField( blank = True, null = True, max_length=50)
    
    refMin = models.CharField( blank = True, null = True, max_length=50)
    refMax = models.CharField( blank = True, null = True, max_length=50)

    def __unicode__(self):
        return self.entity.code + '.' +  self.code     

    def save(self, *args, **kwargs ):
        self.isForeign = True 
        super(Relationship, self).save(*args, **kwargs) 

    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "smOwningTeam", "smCreatedOn"]      
        }, 
        # Propiedades de propertyBase q no se usan aqui.
        "exclude": [ "baseType","prpLength","defaultValue","propertyChoices"]
        }



# ---------------------------

class PropertyDom(PropertyBase):
    """ A nivel conceptual encontraremos la lista de propiedadaes 
        qu corresponde a la definicion semantica del problema; 
        
        1. Estas propiedades normalmente se definien a nivel de modelo 
        cuando el usuario ( piloto ) describe su problematica, 
        
        2. Si la definicion la realiza un modelizador, se hara a nivel de entidad, 
        
        En cualquier caso, la propiedad se copiara a sus instancias superiores 
            1. PropertyDom 
            2. PropertyModel 
            3. Property 
    """
    domain = models.ForeignKey('Domain' )

    def __unicode__(self):
        return self.domain.code + '.' + self.code 

    class Meta:
        unique_together = ('domain', 'code',  )

    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "smOwningTeam", "smCreatedOn"]      
        }
    } 



class PropertyModel(PropertyBase):
    """
    * Propiedades por modelo, subdominio de propiedades a nivel de modelo, es solo informativo 
    * se requiere para el diccionario MSSQ, podria generarse navegando model-entity-prop 
    * pero el primer paso en la metodologia implica la definicion semantica de propiedades por modelo, 
    * este entidad permite organizar esta informacion. 
    
    * La derivacion de prpConcpeto se toma desde el dominio, pues esta tabla es importante solo en la metodologia de 
    * definicion semantica,   
    """
    model = models.ForeignKey('Model' )
    propertyDom = models.ForeignKey('PropertyDom' )

    def __unicode__(self):
        return self.model.code + '.' +  self.code

    class Meta:
        unique_together = ('model', 'code',  )

    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "smOwningTeam", "smCreatedOn"]      
        }
    } 


class ProtoTable(ProtoModel):
    """
    Esta tabla contiene los datos de los prototipos,  
    """
    entity = models.CharField( blank = False, null = False, max_length=200  )
    info = JSONField( default = {} )

    def __unicode__(self):
        return self.entity + '.' + self.info.__str__()  
    
    objects = JSONAwareManager(json_fields = ['info'])
    protoExt = { 'jsonField' : 'info' }
   
    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "smOwningTeam", "smCreatedOn"]      
        }
    } 
