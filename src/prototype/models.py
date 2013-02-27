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

    # Propieadad para ordenar el __str__ 
    unicode_sort = ('model', 'code',  )

    def __unicode__(self):
        return self.model.code + '-' + self.code 

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
        "detailsConfig": [
        {
            "__ptType": "detailDef",
            "menuText": "Properties",
            "conceptDetail": "prototype.Property",
            "detailName": "entity",
            "detailField": "entity__pk",
            "masterField": "pk"
        },{
            "__ptType": "detailDef",
            "menuText": "Relationships",
            "conceptDetail": "prototype.Relationship",
            "detailName": "entity",
            "detailField": "entity__pk",
            "masterField": "pk"
        },{
            "__ptType": "detailDef",
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

    """isSensitive: Indica si las propiedades requieren un nivel mayor de seguridad """  
    isSensitive = models.BooleanField()

    description = models.TextField( blank = True, null = True)
    notes  = models.TextField( blank = True, null = True)

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
    propertyModel = models.ForeignKey('PropertyModel', blank = True, null = True, on_delete=models.SET_NULL )

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
       
    cpFromZoom = models.CharField( blank = True, null = True, max_length=200)
    cpFromField = models.CharField( blank = True, null = True, max_length=200)
    """
    crudType    = models.CharField( blank = True, null = True, max_length=20, choices = CRUD_TYPES)

    """solo para ordenar los campos en la entidad"""
    secuence = models.IntegerField(blank = True, null = True,)

    def save(self, *args, **kwargs ):
        updatePropInfo( self,  self.propertyModel, False )
        super(Property, self).save(*args, **kwargs) 

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

def updatePropInfo( prop, propBase, inherit  ):
    """
    self     :  propiedad q genera el cambio 
    propBase :  campo de referencia a la entidad de base 
    propModel:  modelo al cual copiar
    inherit  :  heredar ( si es descendente Dom, Model, ...  )
    
    Solo actualiza subiendo de prop a model a dom 
    """

    defValues = {
        'baseType' : prop.baseType, 
        'prpLength' : prop.prpLength,
        'defaultValue' : prop.defaultValue,
        'propertyChoices' : prop.propertyChoices,
        'isSensitive' : prop.isSensitive, 
        'description' : prop.description, 
        
        'smOwningUser' : prop.smOwningUser,
        'smOwningTeam' : prop.smOwningTeam,
        'smCreatedBy' : prop.smCreatedBy
    }
    
    if propBase is None:
        # Crea los padres  
        if prop._meta.object_name == 'Property' : 
            pMod = PropertyModel.objects.get_or_create( model = prop.entity.model, code = prop.code, defaults=defValues  )[0]
            prop.propertyModel = pMod 

        elif prop._meta.object_name == 'PropertyModel' : 
            pDom = PropertyDom.objects.get_or_create( domain = prop.model.domain, code = prop.code, defaults=defValues  )[0]
            prop.propertyDom = pDom 

    # Se asegura q sea verdadero    
    if inherit == True :

        del defValues['smOwningUser']
        del defValues['smOwningTeam'] 
        del defValues['smCreatedBy'] 
        defValues['smModifiedBy'] = prop.smModifiedBy
             
        if prop._meta.object_name == 'PropertyDom' :
            # el update no genera eventos en los hijos 
            prop.propertymodel_set.update( **defValues )
            for pMod in prop.propertymodel_set.all():
                pMod.property_set.update( **defValues ) 
                            
        elif prop._meta.object_name == 'PropertyModel' : 
            prop.property_set.update( **defValues )

# -----------------------------------------------------------------

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

    # Cardanlidad 
    baseMin = models.CharField( blank = True, null = True, max_length=50)
    baseMax = models.CharField( blank = True, null = True, max_length=50)
    
    refMin = models.CharField( blank = True, null = True, max_length=50)
    refMax = models.CharField( blank = True, null = True, max_length=50)

    # Comportamiento en la db ( typeRelation : Fort, Info )   
    onRefDelete = models.CharField( blank = True, null = True, max_length=50, choices = ONDELETE_TYPES)
    typeRelation = models.CharField( blank = True, null = True, max_length=50)

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
    #code ( propertyBase ) 
    inherit = models.BooleanField( default = False )

    def __unicode__(self):
        return self.domain.code + '.' + self.code 

    class Meta:
        unique_together = ('domain', 'code', 'smOwningTeam' )

    def save(self, *args, **kwargs ):
        # Envia el heredado y se asegura q sea Falso siempre 
        updatePropInfo( self, self, self.inherit   )
        self.inherit = False 
        super(PropertyDom, self).save(*args, **kwargs) 

    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "inherit", "smOwningTeam" ]      
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
    #code ( propertyBase ) 

    propertyDom = models.ForeignKey('PropertyDom',blank = True, null = True, on_delete=models.SET_NULL )
    inherit = models.BooleanField( default = False )

    def __unicode__(self):
        return self.model.code + '.' +  self.code

    class Meta:
        unique_together = ('model', 'code', 'smOwningTeam' )

    def save(self, *args, **kwargs ):
        # Envia el heredado y se asegura q sea Falso siempre 
        updatePropInfo( self,  self.propertyDom, self.inherit   )
        self.inherit = False 
        super(PropertyModel, self).save(*args, **kwargs) 
        
    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "inherit", "smOwningTeam"]      
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

    description = models.TextField( blank = True, null = True)
    notes  = models.TextField( blank = True, null = True)

    def __unicode__(self):
        return self.code  
    
    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "entity", "smOwningTeam"]      
        }
    } 

    class Meta:
        unique_together = ( 'code', 'smOwningTeam' )


    def delete(self, *args, **kwargs):
        #Borra las ocurrencias en customDefinition
        viewName = PROTO_PREFIX + self.code          
        CustomDefinition.objects.filter( code = viewName ).delete()
        super(ProtoView, self).delete(*args, **kwargs)
        

#   --------------------------------------------------------------------------------


class Diagram(ProtoModel):
    """ 
    TODO: Diagrama o subModelo   
    """    
    model = models.ForeignKey('Model', blank = False, null = False )
    code = models.CharField(verbose_name=u'Nom',blank = False, null = False, max_length=200 )
    
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
    notes  = models.TextField( blank = True, null = True)

    """Information graphique  ( labels, etc... ) """
    info = JSONField( default = {} )
    objects = JSONAwareManager(json_fields = ['info'])

    # Propieadad para ordenar el __str__ 
    unicode_sort = ('model', 'code',  )

    def __unicode__(self):
        return self.model.code + '-' + self.code 

    class Meta:
        unique_together = ('model', 'code', 'smOwningTeam' )


class DiagramEntity(ProtoModel):
    """ 
    TODO: Entidades del diagrama  ( Relationship )    
    """    
    diagram = models.ForeignKey('Diagram', blank = False, null = False )
    entity = models.ForeignKey( Entity, blank = False, null = False )

    """Information graphique ( position, color, ... )  """
    info = JSONField( default = {} )
    objects = JSONAwareManager(json_fields = ['info'])

    # Propieadad para ordenar el __str__ 
    unicode_sort = ('diagram', 'entity',  )

    def __unicode__(self):
        return self.diagram.code + '-' + self.entity.code 

    class Meta:
        unique_together = ('diagram', 'entity', 'smOwningTeam' )

    
#   --------------------------------------------------------------------------------
        

class Service(ProtoModel):
    """ 
    TODO: Servicios entre modelos ( entidades virtuales )    
    """    
    model = models.ForeignKey('Model', blank = False, null = False )
    code = models.CharField(verbose_name=u'Service',blank = False, null = False, max_length=200 )

    """Binding : SOAP, RPC, REST, DCOM, CORBA, DDS, RMI, WCF """
    Binding =  models.CharField(  blank = True, null = True, max_length = 20 )
    typeMessage = models.CharField(  blank = True, null = True, max_length = 20 )
       
    description = models.TextField( blank = True, null = True)
    notes  = models.TextField( blank = True, null = True)

    """REST subtypes ( POST, GET ),  notation ( XML, JSON ), etc  ... """ 
    infoMesage = JSONField( default = {} )

    """Message information """
    infoRequest = JSONField( default = {} )
    infoReponse = JSONField( default = {} )
    objects = JSONAwareManager(json_fields = ['infoMesage', 'infoRequest', 'infoReponse' ])

    # Propieadad para ordenar el __str__ 
    unicode_sort = ('model', 'code',  )

    def __unicode__(self):
        return self.model.code + '-' + self.code 

    class Meta:
        unique_together = ('model', 'code', 'smOwningTeam' )


class ServiceRef(ProtoModel):
    """ 
    TODO: Cliente Servicios entre modelos ( entidades virtuales )    
    """    
    model = models.ForeignKey('Model', blank = False, null = False )
    service = models.ForeignKey('Service', blank = False, null = False )

    endpoint = models.CharField(  blank = True, null = True, max_length = 200 )

    description = models.TextField( blank = True, null = True)
    notes  = models.TextField( blank = True, null = True)

    # Propieadad para ordenar el __str__ 
    unicode_sort = ('model', 'service',  )

    def __unicode__(self):
        return self.model.code + '-' + self.service.code 

    class Meta:
        unique_together = ('model', 'service', 'smOwningTeam' )

    