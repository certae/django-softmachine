# -*- coding: utf-8 -*-

#TODO: Django’s comments system (django.contrib.comments) uses it to “attach” comments to any installed model.

from datetime import datetime

from django.db import models
from django.contrib.auth.models import User 
from django.contrib.sites.models import Site
from django.db.models.signals import post_save

class OrganisationTree(models.Model):
# Jerarquia funcional ( de seguridad ) de la app     
# Es la base de la seguridad por registro

    code = models.CharField(unique=True, blank = False, null = False, max_length=200 )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
    parentNode = models.ForeignKey( 'OrganisationTree', blank = True, null = True )
    site = models.ForeignKey( Site )

    def __unicode__(self):
        return self.code


# here is the profile model
class UserProfile(models.Model):  
#Es necesario inlcuir el ususario en un BUnit, cada registro copiara el Bunit 
#del usuario para dar permisos tambien a la jerarquia ( ascendente )
    user = models.ForeignKey(User, unique=True)
    userHierarchy = models.ForeignKey( OrganisationTree, blank = True, null = True )
    userSites = models.ManyToManyField( Site ,blank = True, null = True)

    def __unicode__(self):
#        return self.user.get_full_name() or self.user.username 
        return  self.user.username 

def user_post_save(sender, instance, created, **kwargs):
    """Create a user profile when a new user account is created"""
    if created == True:
        p = UserProfile()
        p.user = instance
        p.save()

post_save.connect(user_post_save, sender=User)


#Tabla modelo para la creacion de entidades de usuario     
#related_name="%(app_label)s_%(class)s
class ProtoModel(models.Model):
    owningUser = models.ForeignKey( User, related_name='owningUsers', editable = False )
    owningHierachy = models.ForeignKey( OrganisationTree, related_name='owningHierachies', editable = False)

    createdBy = models.ForeignKey( User, related_name='createdBy', editable = False)
    modifiedBy = models.ForeignKey( User, related_name='modifiedBy', editable = False)
    wflowStatus =  models.CharField( max_length=50,  null = True, blank=True, editable = False)
    regStatus =  models.CharField( max_length=50,  null = True, blank=True, editable = False)
    createdOn = models.DateTimeField( default= datetime.now , editable = False)
    modifiedOn = models.DateTimeField( default= datetime.now, editable = False)

    # Indicador para manejo de seguridad 
    _protoObj = True 

    class Meta:
        abstract = True


# -------------------------------------------


class ProtoDefinition(models.Model):
    # Esta tabla guarda las definiciones de las pcls y del menu,
    # es un contenedor generico para manejar documentos json modificados de lo q 
    # en principio es la definicion de base de los modelos Django. 
    code = models.CharField(unique=True, blank = False, null = False, max_length=200 )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
    metaDefinition = models.TextField( blank = True, null = True)
    
    # Si esta activo toma la definicion de la Db, si no esta activa usa la definicion por defecto  
    active = models.BooleanField( default = False )
    
    # Elto de control para sobre escribir,  podria ser un error el solo hecho de inactivarlo
    overWrite = models.BooleanField( default = True  )
    
    def __unicode__(self):
        return self.code 



def getDjangoModel( modelName ):
#   Obtiene el modelo 
    if modelName.count('.') == 1: 
        model = models.get_model( *modelName.split('.') )
    elif modelName.count('.') == 0:
        for m in models.get_models( include_auto_created = True ):
            if m._meta.object_name.lower() == modelName.lower():
                model = m
                break
    return model 



def getFullPath( record, parentField,  codeField, pathFunction  ):
    "Returns the full hierarchy path."

    pRec  = record.__getattribute__(  parentField )
    if pRec   : 
        return pRec.__getattribute__( pathFunction  ) + '.' + record.__getattribute__(  codeField  ) 
    else: 
        return record.__getattribute__(  codeField )


