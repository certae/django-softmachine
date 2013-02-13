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

    code = models.CharField( unique=True, blank = False, null = False, max_length=200 )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
    parentNode = models.ForeignKey( 'OrganisationTree', blank = True, null = True , related_name='downHierachy')
    site = models.ForeignKey( Site, blank = True, null = True)

    @property
    def fullPath(self):
        return getFullPath( self , 'parentNode',  'id', 'fullPath'  )

    @property
    def treeHierarchy(self):
        "Returns the full down-hierarchy"
        sTree = unicode( self.id )
        for item in self.downHierachy.all() :
            sTree += ',' + item.treeHierarchy
        return sTree     

    def __unicode__(self):
        return self.code

    def save(self, *args, **kwargs ):
        if self.parentNode is not None: 
            self.site = self.parentNode.site
#        if self.site is None:
#            raise Exception( 'site required')
        super(OrganisationTree, self).save(*args, **kwargs) 

    protoExt = { 'fields' : { 
          'fullPath': {'readOnly' : True},
          'treeHierarchy': {'readOnly' : True},
     }}




# here is the profile model
class UserProfile(models.Model):  
#Es necesario inlcuir el ususario en un BUnit, cada registro copiara el Bunit 
#del usuario para dar permisos tambien a la jerarquia ( ascendente )
    user = models.ForeignKey(User, unique=True)
    userGroup = models.ForeignKey( OrganisationTree, blank = True, null = True )
    userTree  = models.CharField( blank = True, null = True, max_length= 500 )
    language  = models.CharField( blank = True, null = True, max_length= 500 )
      
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
    # si el usuairo comparte otros permisos  
    user = models.ForeignKey( User )
    userGroup = models.ForeignKey( OrganisationTree , related_name='userShares' )

    def __unicode__(self):
        return self.user.username + '-' + self.userGroup.code 


#Tabla modelo para la creacion de entidades de usuario     ( sm  security mark ) 
#related_name="%(app_label)s_%(class)s
class ProtoModel(models.Model):
    smOwningUser = models.ForeignKey( User, null = True, blank=True, related_name='+', editable = False )
    smOwningGroup = models.ForeignKey( OrganisationTree, null = True, blank=True, related_name='+', editable = False)

    smCreatedBy = models.ForeignKey( User, null = True, blank=True,related_name='+', editable = False)
    smCreatedOn = models.DateTimeField( auto_now=True , null = True, blank=True,editable = False)
    smModifiedBy = models.ForeignKey( User, null = True, blank=True, related_name='+', editable = False)
    smModifiedOn = models.DateTimeField( auto_now=True , null = True, blank=True, editable = False)
    smRegStatus  =  models.CharField( max_length=50,  null = True, blank=True, editable = False)
    smWflowStatus =  models.CharField( max_length=50,  null = True, blank=True, editable = False)

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


class CustomDefinition( ProtoModel ):
    # maneja las definiciones por grupo 
    # aqui se guardan los menus personalizados, y las customOptions 
    # DGT: por ahora el manejo es solo a nivel de grupos, pero dependiendo el nivel de amdin, se guardara como grupo o usuario  
    code = models.CharField(unique=True, blank = False, null = False, max_length=200 )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

    metaDefinition = models.TextField( blank = True, null = True)

    # Compatibilidad con ProtoDefinition
    active = models.BooleanField( default = True )
    overWrite = models.BooleanField( default = False   )
    
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

    elif modelName.count(".") == 2:
        model = models.get_model( *modelName.split(".")[0:2] )
            
    return model 



def getFullPath( record, parentField,  codeField, pathFunction  ):
    "Returns the full hierarchy path."

    pRec  = record.__getattribute__(  parentField )
    if pRec   : 
        return pRec.__getattribute__( pathFunction  ) + ',' + unicode( record.__getattribute__(  codeField  ) ) 
    else: 
        return unicode( record.__getattribute__(  codeField ) )

