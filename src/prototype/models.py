# -*- coding: utf-8 -*-

from django.db import models
from django.db.models.signals import post_save, post_delete

from protoLib.models import ProtoModel
from protoLib.fields import JSONField,  JSONAwareManager

from protoRules import updatePropInfo, twoWayPropEquivalence, updProPropModel
from protoRules import ONDELETE_TYPES, BASE_TYPES, CRUD_TYPES, DB_ENGINE


from protoLib.utilsBase import slugify

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


class Project(ProtoModel):

    """Corresponde a un nivel conceptual corportativo MCCD"""
    code = models.CharField(blank=False, null=False, max_length=200)
    description = models.TextField(blank=True, null=True)

    """Info de la Db """
    dbEngine = models.CharField(blank=True, null=True, max_length=20, choices=DB_ENGINE, default='sqlite3')
    dbName = models.CharField(blank=True, null=True, max_length=200)
    dbUser = models.CharField(blank=True, null=True, max_length=200)
    dbPassword = models.CharField(blank=True, null=True, max_length=200)
    dbHost = models.CharField(blank=True, null=True, max_length=200)
    dbPort = models.CharField(blank=True, null=True, max_length=200)

    def __unicode__(self):
        return slugify(self.code)

    class Meta:
        unique_together = ('code', 'smOwningTeam')
        #permissions = (( "read_domain", "Can read project"), )

    protoExt = {
        "actions": [{"name": "doImportSchema"}, ],
        "gridConfig": {
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
    project = models.ForeignKey('Project', blank=False, null=False)
    code = models.CharField(blank=False, null=False, max_length=200)

    category = models.CharField(max_length=50, blank=True, null=True)
    modelPrefix = models.CharField(blank=True, null=True, max_length=50)
    description = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('project', 'code', 'smOwningTeam')

    unicode_sort = ('project', 'code',)

    def __unicode__(self):
        return slugify(self.code)

    protoExt = {
        "actions": [{"name": "doModelPrototype"}, {"name": "doModelGraph"}],
        "gridConfig": {
            "listDisplay": ["__str__", "description", "smOwningTeam"]
        }
    }


class Entity(ProtoModel):
    """
    Entity corresponde a las entidades FISICA;
    """
    model = models.ForeignKey('Model', blank=False, null=False, related_name='entity_set')
    code = models.CharField(blank=False, null=False, max_length=200)

    dbName = models.CharField(blank=True, null=True, max_length=200)
    description = models.TextField(blank=True, null=True)

    # Propieadad para ordenar el __str__
    unicode_sort = ('model', 'code',)

    def __unicode__(self):
        return slugify(self.model.code + '-' + self.code)

    class Meta:
        unique_together = ('model', 'code', 'smOwningTeam')

    protoExt = {
        "actions": [
            {"name": "doEntityPrototype",
             "selectionMode": "single",
             "actionParams": [{"name": "viewCode", "type": "string", "required": True,
             "tooltip": "option de menu (msi)"}]
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
        }, {
            "__ptType": "detailDef",
            "menuText": "Relationships",
            "conceptDetail": "prototype.Relationship",
            "detailName": "entity",
            "detailField": "entity__pk",
            "masterField": "pk"
        }, {
            "__ptType": "detailDef",
            "menuText": "Views",
            "conceptDetail": "prototype.Prototype",
            "detailName": "entity",
            "detailField": "entity__pk",
            "masterField": "pk"
        }
        ],
        "gridConfig": {
            "listDisplay": ["__str__", "description", "smOwningTeam"]
        }
    }


class PropertyBase(ProtoModel):

    code = models.CharField(blank=False, null=False, max_length=200)

    """baseType, prpLength:  Caracteristicas generales q definen el campo """
    baseType = models.CharField(blank=True, null=True, max_length=50, choices=BASE_TYPES, default='string')
    prpLength = models.IntegerField(blank=True, null=True)
    prpScale = models.IntegerField(blank=True, null=True)

    """vType : validation type ( formatos predefinidos email, .... ) """
    vType = models.CharField(blank=True, null=True, max_length=50, choices=BASE_TYPES, default='string')

    """prpDefault: Puede variar en cada instancia """
    prpDefault = models.CharField(blank=True, null=True, max_length=50)

    """prpChoices:  Lista de valores CSV ( idioma?? ) """
    prpChoices = models.TextField(blank=True, null=True)

    """isSensitive: Indica si las propiedades requieren un nivel mayor de seguridad """
    isSensitive = models.BooleanField()

    description = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        abstract = True


class Property(PropertyBase):
    """
    Propiedades por tabla, definicion a nivel de modelo de datos.
    Las relaciones heredan de las propriedades y definien la cardinalidad
    """
    entity = models.ForeignKey('Entity', related_name='property_set')

    """propertyModel : corresponde a la especificacion en el modelo ( metodologia: user history )"""
    propertyModel = models.ForeignKey('PropertyModel', blank=True, null=True, on_delete=models.SET_NULL)

    # -----------  caracteristicas propias de la instancia
    """isPrimary : en el prototipo siempre es artificial, implica isLookUpResult"""
    isPrimary = models.BooleanField()
    isLookUpResult = models.BooleanField()

    """isNullable: tiene q ver con la Db"""
    isNullable = models.BooleanField()

    """isRequired: tiene q ver con el llenado de datos"""
    isRequired = models.BooleanField()

    """isReadOnly: ReadOnly field ( frontEnd"""
    isReadOnly = models.BooleanField()

    """isEssential: Indica si las propiedades saldran en la vista por defecto """
    isEssential = models.BooleanField()

    """isForeign: indica si la propiedad ha sido definida en  Relationship"""
    isForeign = models.BooleanField(editable=False, default=False)

    crudType = models.CharField(blank=True, null=True, max_length=20, choices=CRUD_TYPES)
    dbName = models.CharField(blank=True, null=True, max_length=200)

    """solo para ordenar los campos en la entidad"""
    #secuence = models.IntegerField(blank = True, null = True,)

    def save(self, *args, **kwargs):
        if self.isPrimary:
            self.isRequired = True
            self.isLookUpResult = True

        updatePropInfo(self,  self.propertyModel, PropertyModel, False)
        super(Property, self).save(*args, **kwargs)

    class Meta:
        unique_together = ('entity', 'code', 'smOwningTeam')

    def __unicode__(self):
        return slugify(self.entity.code + '.' + self.code)

    unicode_sort = ('entity', 'code',)

    protoExt = {
        "gridConfig": {
            "listDisplay": ["__str__", "description", "smOwningTeam"]
        }
    }


class Relationship(Property):
    """
    * Tipo particula de propiedad q define las relaciones,  la definicion de la cardinlaidad y otras
    """

    """refEntity : entidad referenciada"""
    refEntity = models.ForeignKey('Entity', related_name='refEntity_set')

    """relatedName:  Nombre del set en la tabla primaria ( modelacion objeto )  """
    relatedName = models.CharField(blank=True, null=True, max_length=50)

    # Cardanlidad
    baseMin = models.CharField(blank=True, null=True, max_length=50)
    baseMax = models.CharField(blank=True, null=True, max_length=50)

    refMin = models.CharField(blank=True, null=True, max_length=50)
    refMax = models.CharField(blank=True, null=True, max_length=50)

    # Comportamiento en la db ( typeRelation : Fort, Info )
    onRefDelete = models.CharField(blank=True, null=True, max_length=50, choices=ONDELETE_TYPES)
    typeRelation = models.CharField(blank=True, null=True, max_length=50)

    def __unicode__(self):
        return slugify(self.entity.code + '.' + self.code)

    def save(self, *args, **kwargs):
        self.isForeign = True
        super(Relationship, self).save(*args, **kwargs)

    protoExt = {
        "gridConfig": {
            "listDisplay": ["__str__", "description", "smOwningTeam"]
        },
        "exclude": ["baseType", "prpLength", "prpDefault", "prpChoices"]
    }


class PropertyModel(PropertyBase):
    """ A nivel conceptual encontraremos la lista de propiedadaes
        qu corresponde a la definicion semantica del problema;

        1. Estas propiedades normalmente se definien a nivel de modelo
        cuando el usuario ( piloto ) describe su problematica,

        2. Si la definicion la realiza un modelizador, se hara a nivel de entidad,

    * podria generarse navegando model-entity-prop
    * pero el primer paso en podria implicar la definicion semantica de propiedades por modelo,

    """
    model = models.ForeignKey('Model', blank=False, null=False)
    inherit = models.BooleanField(default=False)
    conceptType = models.CharField(blank=True, null=True, max_length=50, editable=False)

    def __unicode__(self):
        return slugify(self.model.code + '.' + self.code)

    class Meta:
        unique_together = ('model', 'code', 'smOwningTeam')

    def save(self, *args, **kwargs):
        # Envia el heredado y se asegura q sea Falso siempre
        updatePropInfo(self, None, PropertyModel, self.inherit)
        self.inherit = False
        super(PropertyModel, self).save(*args, **kwargs)

    protoExt = {
        #"menuApp" : "dictionary",
        "actions": [
            {
                "name": "doPropertyModelJoin",
                "selectionMode": "multiple",
                "refreshOnComplete": True
            },
        ],
        "gridConfig": {
        "listDisplay": ["__str__", "description", "inherit", "conceptType", "smOwningTeam"]
        },

        "detailsConfig": [
            {
                "menuText": "Properties",
                "conceptDetail": "prototype.Property",
                "detailName": "propertyModel",
                "detailField": "propertyModel__pk",
                "masterField": "pk"
            }, {
                "menuText": "Equivalences",
                "conceptDetail": "prototype.PropertyEquivalence",
                "detailName": "sourceProperty",
                "detailField": "sourceProperty__pk",
                "masterField": "pk"
            }],

    }


def propModel_post_delete(sender, instance, **kwargs):
    # En el postSave ya el registro de hijos no existe,
    # la solucion mas simple las props con propMod = None y tocarlos
    updProPropModel(Property)
    pass

post_delete.connect(propModel_post_delete, sender=PropertyModel)


class PropertyEquivalence(ProtoModel):
    """
    Matriz de equivalencias "semantica"  entre propiedades

    Este es un caso particular de relacion donde en usa sola busqueda quisiera
    obtener donde es source y donde es target,

    se podria agregar un manejador q hicer:   where = sourse UNION where target,
    o q al momento de guardar generara la relacion inversa y actualizara simpre los dos ( privilegiada )
    """

    sourceProperty = models.ForeignKey('PropertyModel', blank=True, null=True, related_name='sourcePrp')
    targetProperty = models.ForeignKey('PropertyModel', blank=True, null=True, related_name='targetPrp')

    description = models.TextField(blank=True, null=True)

    def __unicode__(self):
        return slugify(self.sourceProperty.code + ' - ' + self.targetProperty.code)

    class Meta:
        unique_together = ('sourceProperty', 'targetProperty', 'smOwningTeam')

    def delete(self, *args, **kwargs):
        twoWayPropEquivalence(self, PropertyEquivalence, True)
        super(PropertyEquivalence, self).delete(*args, **kwargs)

    protoExt = {
        #"menuApp" : "dictionary",
        "gridConfig": {
            "listDisplay": ["__str__", "description", "smOwningTeam"]
        }
    }


def propEquivalence_post_save(sender, instance, created, **kwargs):
    twoWayPropEquivalence(instance, PropertyEquivalence, False)

post_save.connect(propEquivalence_post_save, sender=PropertyEquivalence)


#This way when the save() method is called,
#it never fires another post_save signal because we've disconnected it.
#
#def do_stuff(sender, **kwargs):
#    post_save.disconnect(do_stuff, sender=User)
#    kwargs['instance'].save()
#    post_save.connect(do_stuff, sender=User)
#
#post_save.connect(do_stuff, sender=User)

#   --------------------------------------------------------------------------------


class Prototype(ProtoModel):
    """
    Esta tabla manejar la lista de  prototypos almacenados en customDefinicion,
    Genera la "proto" pci;  con la lista de campos a absorber y los detalles posibles
    """
    entity = models.ForeignKey(Entity, blank=False, null=False)

    """Nombre (str) de la vista a buscar en protoDefinition  """
    code = models.CharField(blank=False, null=False, max_length=200, editable=False)

    description = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    metaDefinition = models.TextField(blank=True, null=True)

    def __unicode__(self):
        return slugify(self.code)

    protoExt = {
        "gridConfig": {
            "listDisplay": ["__str__", "entity", "smOwningTeam"]
        }
    }

    class Meta:
        unique_together = ('code', 'smOwningTeam')


class ProtoTable(ProtoModel):
    """
    Esta es el store de los prototipos
    """
    entity = models.ForeignKey(Entity, blank=False, null=False)
    info = JSONField(default={})

    def __unicode__(self):
        return self.entity.code + ':' + self.info.__str__()

    def myStr(self, *args, **kwargs):
        # Evalua el string de prototipos
        val = ''
        for arg in args:
            try:
                val = val + '.' + str(self.info.get(arg[6:]))
            except:
                pass
        return val[1:]

    objects = JSONAwareManager(json_fields=['info'])
    protoExt = {'jsonField': 'info'}

    protoExt = {
        "gridConfig": {
            "listDisplay": ["__str__", "smOwningTeam"]
        }
    }

#   --------------------------------------------------------------------------------


class Diagram(ProtoModel):
    """
    TODO: Diagrama o subModelo
    """
    model = models.ForeignKey('Model', blank=False, null=False)
    code = models.CharField(blank=False, null=False, max_length=200)

    description = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    """Information graphique  ( labels, etc... ) """
    info = JSONField(default={})
    objects = JSONAwareManager(json_fields=['info'])

    # Propieadad para ordenar el __str__
    unicode_sort = ('model', 'code',)

    def __unicode__(self):
        return slugify(self.model.code + '-' + self.code)

    class Meta:
        unique_together = ('model', 'code', 'smOwningTeam')

    protoExt = {
        "menuApp": "roadMap",
    }


class DiagramEntity(ProtoModel):
    """
    TODO: Entidades del diagrama  ( Relationship )
    """
    diagram = models.ForeignKey('Diagram', blank=False, null=False)
    entity = models.ForeignKey(Entity, blank=False, null=False)

    """Information graphique ( position, color, ... )  """
    info = JSONField(default={})
    objects = JSONAwareManager(json_fields=['info'])

    # Propieadad para ordenar el __str__
    unicode_sort = ('diagram', 'entity',)

    def __unicode__(self):
        return slugify(self.diagram.code + '-' + self.entity.code)

    class Meta:
        unique_together = ('diagram', 'entity', 'smOwningTeam')


#   --------------------------------------------------------------------------------




class Service(ProtoModel):
    """
    TODO: Servicios entre modelos ( entidades virtuales )
    """
    model = models.ForeignKey('Model', blank=False, null=False)
    code = models.CharField(blank=False, null=False, max_length=200)

    """Binding : SOAP, RPC, REST, DCOM, CORBA, DDS, RMI, WCF """
    Binding = models.CharField(blank=True, null=True, max_length=20)
    typeMessage = models.CharField(blank=True, null=True, max_length=20)

    description = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    """REST subtypes ( POST, GET ),  notation ( XML, JSON ), etc  ... """
    infoMesage = JSONField(default={})

    """Message information """
    infoRequest = JSONField(default={})
    infoReponse = JSONField(default={})
    objects = JSONAwareManager(json_fields=['infoMesage', 'infoRequest', 'infoReponse'])

    # Propieadad para ordenar el __str__
    unicode_sort = ('model', 'code',)

    def __unicode__(self):
        return slugify(self.model.code + '-' + self.code)

    class Meta:
        unique_together = ('model', 'code', 'smOwningTeam')

    protoExt = {
        "menuApp": "roadMap",
    }


class ServiceRef(ProtoModel):
    """
    TODO: Cliente Servicios entre modelos ( entidades virtuales )
    """
    model = models.ForeignKey('Model', blank=False, null=False)
    service = models.ForeignKey('Service', blank=False, null=False)

    endpoint = models.CharField(blank=True, null=True, max_length=200)

    description = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    # Propieadad para ordenar el __str__
    unicode_sort = ('model', 'service',)

    def __unicode__(self):
        return slugify(self.model.code + '-' + self.service.code)

    class Meta:
        unique_together = ('model', 'service', 'smOwningTeam')
