# -*- coding: utf-8 -*-

# TODO: Django’s comments system (django.contrib.comments) uses it to “attach” comments to any installed model.

from django.db import models
from django.contrib.auth.models import User
from django.contrib.sites.models import Site
from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_save

from protoLib.fields import JSONField, JSONAwareManager
from protoLib.utils.modelsTools import  getDjangoModel, getNodeHierarchy

class TeamHierarchy(models.Model):
# Jerarquia funcional ( de seguridad ) de la app
# Es la base de la seguridad por registro

    code = models.CharField(unique=True, blank=False, null=False, max_length=200)
    description = models.TextField(verbose_name=u'Descriptions', blank=True, null=True)
    parentNode = models.ForeignKey('TeamHierarchy', blank=True, null=True , related_name='downHierachy')
    site = models.ForeignKey(Site, blank=True, null=True)

    @property
    def fullPath(self):
        return getNodeHierarchy(self , 'parentNode', 'id', 'fullPath')

    @property
    def treeHierarchy(self):
        "Returns the full down-hierarchy"
        sTree = unicode(self.id)
        for item in self.downHierachy.all() :
            sTree += ',' + item.treeHierarchy
        return sTree

    def __unicode__(self):
        return self.code

    def save(self, *args, **kwargs):
        if self.parentNode is not None:
            self.site = self.parentNode.site
        super(TeamHierarchy, self).save(*args, **kwargs)

    protoExt = { 'fields' : {
          'fullPath': {'readOnly' : True},
          'treeHierarchy': {'readOnly' : True},
     }}



# here is the profile model
class UserProfile(models.Model):
# Es necesario inlcuir el ususario en un BUnit, cada registro copiara el Bunit
# del usuario para dar permisos tambien a la jerarquia ( ascendente )
    user = models.ForeignKey(User, unique=True)
    userTeam = models.ForeignKey(TeamHierarchy, blank=True, null=True, related_name =  'userTeam')
    language = models.CharField(blank=True, null=True, max_length=500)

    # System generated hierachie 
    userTree = models.CharField(blank=True, null=True, max_length=500)

    # DGT : si el usuario pertenece a varios (usrShar)  podria asignar su grupo de trabajo
    workigTeam = models.ForeignKey( TeamHierarchy, blank = True, null = True, related_name =  'workigTeam' )

    # DGT : Json space, preferencias de usuario ( menuClick, defaultVariables ..... )
    userConfig = models.TextField( blank = True, null = True)

    def __unicode__(self):
        return  self.user.username

def user_post_save(sender, instance, created, **kwargs):
    """Create a user profile when a new user account is created"""
    if created == True:
        p = UserProfile()
        p.user = instance
        p.save()

post_save.connect(user_post_save, sender=User)



class UserShare(models.Model):
    # DGT: si el usuairo comparte otros permisos
    user = models.ForeignKey(User)
    userTeam = models.ForeignKey(TeamHierarchy , related_name='userShares')

    def __unicode__(self):
        return self.user.username + '-' + self.userTeam.code



# Tabla modelo para la creacion de entidades de usuario     ( sm  security mark )
# related_name="%(app_label)s_%(class)s
class ProtoModel(models.Model):
    smOwningUser = models.ForeignKey(User, null=True, blank=True, related_name='+', editable=False)
    smOwningTeam = models.ForeignKey(TeamHierarchy, null=True, blank=True, related_name='+', editable=False)

    smCreatedBy = models.ForeignKey(User, null=True, blank=True, related_name='+', editable=False)
    smModifiedBy = models.ForeignKey(User, null=True, blank=True, related_name='+', editable=False)
    smRegStatus = models.CharField(max_length=50, null=True, blank=True, editable=False)
    smWflowStatus = models.CharField(max_length=50, null=True, blank=True, editable=False)

    smCreatedOn = models.DateTimeField(auto_now=True , null=True, blank=True, editable=False)
    smModifiedOn = models.DateTimeField(auto_now=True , null=True, blank=True, editable=False)

    # DGT: UUID 
    smUUID = models.CharField( max_length=32, null=True, blank=True, editable=False)

    # DGT: Doc Json con definiciones adicionales
    smConfig = models.TextField( blank = True, null = True)

    # Indicador para manejo de seguridad
    _protoObj = True

    class Meta:
        abstract = True


    def save(self, *args, **kwargs):
        """
        Get last value of Code and Number from database, and increment before save
        DGT: Upgrade to secuences 
        """
        if hasattr(self , "_autoIncrementField") and not self.pk:
            _autoIncrementField = getattr(self, "_autoIncrementField")
            model = self.__class__
            top = model.objects.order_by('-pk')
            if top:
                setattr(self, _autoIncrementField, top[0].pk + 1)
            else:
                setattr(self, _autoIncrementField, 1)

            super(ProtoModel, self).save(*args, **kwargs)
        else:
            super(ProtoModel, self).save(*args, **kwargs)


class EntityMap(models.Model):
    """
    DGT: Capa adicional para manejar 
        parametros de workflow 
        autonumericos y secuencias         
        permisos a nivel de campo ( fieldLevelSecurity ),
        documentacion 
        acciones 
        replicar conttenttype
        etc 
        
    Para manejar las vstas, se maneja directamente la protoOpcion,  (se prodria crear un conttenttype ) 
     
    ?Exluyente - Incluyente 
    El nvel de acceso al ser excluyente, no podria sumar los permisos de los grupos, 
    seria necesario asignar un unico grupo ( Django group ) q defina los accesos a nivel de campos, 
    de tal forma q los grupos de Django seran de dos tipos,    
    ** Debe ser incluyente para poder sumar, 
    ** No todas las tablas manejaran esta restriccion 

    * Procedimiento 
    Por defecto se tienen todos los permisos; Las tablas; 
    La forma de registrarlos es de todas maneras sumando permisos; entonces
    - se definen explicitamente las tablas q manejen fieldLevel securty  ( EntityMap )
    - se definen permisos por grupos   
     
    se manejan referecias debiles por nombre para poder importar/exportar la info, 
    de otra forma seria por contenttype 
           
    """
    appName = models.CharField(max_length=200, blank=False, null=False)
    modelName = models.CharField(max_length=200, blank=False, null=False)

    # DGT: Doc Json con definiciones adicionales,  WorkFlow, Autonumeric, ... 
    entityConfig = models.TextField( blank = True, null = True)
    description = models.TextField( blank = True, null = True)

    # DGT : Apunta a la tabla fisica 
    contentType = models.ForeignKey(ContentType, blank=True, null=True, on_delete=models.SET_NULL)

    class Meta:
        unique_together = ("appName", "modelName")



class FieldMap(models.Model):

    # DGT : Implemenar con EntityMap
    entity = models.ForeignKey(EntityMap, blank=False, null=False)
    fieldName = models.CharField(max_length=200, blank=False, null=False)

    # DGT: Doc Json con definiciones adicionales,  WorkFlow, Autonumeric, ... 
    fieldConfig = models.TextField( blank = True, null = True)
    description = models.TextField( blank = True, null = True)

    class Meta:
        unique_together = ("entity", "fieldName")



# DGT : Permisos a nivel de campo ( se marcan como enteros para sumarlos 0 = False )
    # Itersection FieldMap - Group? Team?
    # canRead = models.IntegerField(default=0, blank=False, null=False)
    # canIns = models.IntegerField(default=0, blank=False, null=False)
    # canUpd = models.IntegerField(default=0, blank=False, null=False)


# -------------------------------------------


class ProtoDefinition(models.Model):
    # Esta tabla guarda las definiciones de las pcls y del menu,
    # es un contenedor generico para manejar documentos json modificados de lo q
    # en principio es la definicion de base de los modelos Django.
    code = models.CharField(unique=True, blank=False, null=False, max_length=200)
    description = models.TextField(verbose_name=u'Descriptions', blank=True, null=True)

    metaDefinition = models.TextField(blank=True, null=True)

    # Si esta activo toma la definicion de la Db, si no esta activa usa la definicion por defecto
    active = models.BooleanField(default=False)

    # Elto de control para sobre escribir,  podria ser un error el solo hecho de inactivarlo
    overWrite = models.BooleanField(default=True)

    # DGT : For entity clasification  ( V14.01 )
    entityMap = models.ForeignKey(EntityMap, blank=True, null=True)


    def __unicode__(self):
        return self.code

    protoExt = {
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "active", "overWrite"],
            "others": {
                "filtersSet": [{
                    "name": "prototype",
                    "customFilter": [{
                        "property": "code",
                        "filterStmt": "^prototype"
                    }]
                }],
            }
        }
    }



class CustomDefinition(ProtoModel):
    # maneja las definiciones por grupo
    # aqui se guardan los menus personalizados, y las customOptions
    # DGT: por ahora el manejo es solo a nivel de grupos, pero dependiendo el nivel de amdin, se guardara como grupo o usuario
    code = models.CharField(blank=False, null=False, max_length=200)
    description = models.TextField(verbose_name=u'Descriptions', blank=True, null=True)

    metaDefinition = models.TextField(blank=True, null=True)

    # Compatibilidad con ProtoDefinition
    active = models.BooleanField(default=True)
    overWrite = models.BooleanField(default=False)

    def __unicode__(self):
        return self.code
    class Meta:
        unique_together = ('smOwningTeam', 'code',)

    protoExt = {
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "smOwningTeam"]
        }
    }




