# -*- coding: utf-8 -*-

from django.db import models
from protoLib.models import ProtoModel, CustomDefinition  
from protoLib.fields import JSONField,  JSONAwareManager

PROTO_PREFIX = "prototype.ProtoTable."

"""
    la generacion de las VISTAS se hace como una creacion de una pcl,
    
    La pci contedra ahora : 
        - lista de campos desde los cuales heredar; 
        - detalles q puede definir; 
    
    el tipo de pcl definira la estructura
    
    La estructura se enviara desde el BackEnd cuando se requiera; 
    La validacion de la pci se hace en el backend
    La validacion de campos se hace con seguridad en el backend ) fieldLevel security  
    
    Configuarar los menus adicionales  ( parametricos?? )
        grupo, 
        boton 
        procedimiento
        tipo de ventana 
        datos 
        
    Menu de protipos permitira 
        Detalles 
        Campos absorbidos
    
    La edicion de la pcl cerrara y abrira la opcion

    Las acciones,
        General 
        Model ( dependen del modelo, no se requiere declararlas en el admin ) 
"""
   
class Domain(ProtoModel):
    """El dominio corresponde a un nivel conceptual corportativo MCCD"""
    code = models.CharField(verbose_name=u'Nom',blank = False, null = False, max_length=200  )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

    def __unicode__(self):
        return self.code 

    class Meta:
        unique_together = ( 'code', 'smOwningTeam' )
        #permissions = (( "read_domain", "Can read domain"), )        

    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "smOwningTeam"]      
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
        unique_together = ('domain', 'code', 'smOwningTeam' )
        
    unicode_sort = ('domain', 'code',  )

    def __unicode__(self):
        return self.code 
    
    protoExt = { 
        "actions": [{ "name": "doModelPrototype" }],        
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "smOwningTeam"]      
        }
    } 
    
    
    
class Entity(ProtoModel):
    """ 
    Entity corresponde a las entidades FISICA;  
    """    
    model = models.ForeignKey('Model', blank = False, null = False )
    code = models.CharField(verbose_name=u'Nom',blank = False, null = False, max_length=200 )
    
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

    def __unicode__(self):
        return self.model.code + '-' + self.code 

    unicode_sort = ('domain', 'code',  )

    class Meta:
        unique_together = ('model', 'code', 'smOwningTeam' )

    protoExt = { 
        "actions": [
            { "name": "doEntityPrototype", "selectionMode" : "single",  
              "actionParams": [{"name" : "viewCode", "type" : "string", "required": True, 
                                "tooltip" : "option de menu (msi)" }
                               ] 
            },
        ], 
        "protoDetails": [
        {
            "__ptType": "protoDetail",
            "menuText": "Properties",
            "conceptDetail": "prototype.Property",
            "detailName": "entity",
            "detailField": "entity__pk",
            "masterField": "pk"
        },{
            "__ptType": "protoDetail",
            "menuText": "Relationships",
            "conceptDetail": "prototype.Relationship",
            "detailName": "entity",
            "detailField": "entity__pk",
            "masterField": "pk"
        },{
            "__ptType": "protoDetail",
            "menuText": "Views",
            "conceptDetail": "prototype.ProtoView",
            "detailName": "entity",
            "detailField": "entity__pk",
            "masterField": "pk"
        }
        ], 
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "smOwningTeam"]      
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
    baseType = models.CharField( blank = True, null = True, max_length=50, choices = BASE_TYPES)
    prpLength = models.IntegerField(blank = True, null = True )

    """defaultValue: Puede variar en cada instancia """ 
    defaultValue = models.CharField( blank = True, null = True, max_length=50)
    
    """propertyChoices:  Lista de valores CSV ( idioma?? ) """ 
    propertyChoices = models.CharField( blank = True, null = True, max_length=200 )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

    """isSensitive: Indica si las propiedades requieren un nivel mayor de seguridad """  
    isSensitive = models.BooleanField()

    class Meta:
        abstract = True


CRUD_TYPES = (  
                ('storeOnly', 'No se presentan nunca (los id, jsonTypes, etc )' ),  
                ('readOnly',  'No se guarda nunca (usado por reglas de gestion)' ), 
                ('insertOnly','No se actualiza (un campo absorbido al momento de la creacion, ej:direccion de envio'),
                ('updateOnly','Al insertar nulo o VrDefault, (estado inicial fijo)'),  
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

    """isReadOnly: ReadOnly field ( frontEnd"""
    isReadOnly = models.BooleanField()

    """isEssential: Indica si las propiedades saldran en la vista por defecto """ 
    isEssential = models.BooleanField()

    """isForeign: indica si la propiedad ha sido definida en  Relationship"""
    isForeign = models.BooleanField( editable = False, default = False )


    """cpFrom____ : permite definir como heredar campos complejos (absorber JsonFields)

    ** Ya no se usan pues aqui solo se mapean las entidades fisicas, 
       las copias se manejaran desde la generacion de la pcl;  
       
    cpFromModel = models.CharField( blank = True, null = True, max_length=200)
    cpFromField = models.CharField( blank = True, null = True, max_length=200)
       
    """
    crudType    = models.CharField( blank = True, null = True, max_length=20, choices = CRUD_TYPES)

    """solo para ordenar los campos en la entidad"""
    secuence = models.IntegerField(blank = True, null = True,)


    class Meta:
        unique_together = ('entity', 'code', 'smOwningTeam' )

    def __unicode__(self):
        return self.entity.code + '.' +  self.code     

    unicode_sort = ('entity', 'code',  )

    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "smOwningTeam"]      
        }
    } 


ONDELETE_TYPES = (  
        ('CASCADE', 'Cascade deletes; the default' ), 
        ('PROTECT', 'Prevent deletion of the referenced object by raising ProtectedError, a subclass of django.db.IntegrityError'),
        ('SET_NULL', 'Set the ForeignKey null; this is only possible if null is True'), 
        ('SET_DEFAULT', 'Set the ForeignKey to its default value; a default for the ForeignKey must be set.  @function si possible'), 
        ('DO_NOTHING', 'Use default Db constraint')
    ) 

class Relationship(Property):
    """
    * Tipo particula de propiedad q define las relaciones,  la definicion de la cardinlaidad y otras
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

    onRefDelete = models.CharField( blank = True, null = True, max_length=50, choices = ONDELETE_TYPES)

    def __unicode__(self):
        return self.entity.code + '.' +  self.code     

    def save(self, *args, **kwargs ):
        self.isForeign = True 
        super(Relationship, self).save(*args, **kwargs) 

    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "smOwningTeam" ]      
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
        unique_together = ('domain', 'code', 'smOwningTeam' )

    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "smOwningTeam" ]      
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
        unique_together = ('model', 'code', 'smOwningTeam' )

    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "smOwningTeam"]      
        }
    } 


class ProtoTable(ProtoModel):
    """
    Esta es el store de los prototipos   
    """
    entity = models.CharField( blank = False, null = False, max_length=200  )
    info = JSONField( default = {} )

    def __unicode__(self):
        return self.entity + '.' + self.info.__str__()  
    
    objects = JSONAwareManager(json_fields = ['info'])
    protoExt = { 'jsonField' : 'info' }
   
    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "smOwningTeam"]      
        }
    } 

#   --------------------------------------------------------------------------------


class ProtoView(ProtoModel):
    """
    Esta tabla manejar la lista de  prototypos almacenados en customDefinicion, 
    Genera la "proto" pci;  con la lista de campos a absorber y los detalles posibles        
    """
    entity = models.ForeignKey( Entity, blank = False, null = False )
    
    """Nombre (str) de la vista a buscar en protoDefinition  """
    code   = models.CharField( blank = False, null = False, max_length=200, editable = False )

    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

    def __unicode__(self):
        return self.code  
    
    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "entty", "smOwningTeam"]      
        }
    } 

    class Meta:
        unique_together = ( 'code', 'smOwningTeam' )


    def delete(self, *args, **kwargs):
        #Borra las ocurrencias en customDefinition
        viewName = PROTO_PREFIX + self.code          
        CustomDefinition.objects.filter( code = viewName ).delete()
        super(ProtoView, self).delete(*args, **kwargs)
        