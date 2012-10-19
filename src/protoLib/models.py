# -*- coding: utf-8 -*-

#TODO: Django’s comments system (django.contrib.comments) uses it to “attach” comments to any installed model.

from datetime import datetime

from django.db import models
from django.contrib.auth.models import User, Group, Permission 
from django.contrib.sites.models import Site


class ProtoSite(Site):
# Esta tabla tiene un unico registro equivalente una serie de parametros comunes a la org
#   name = Site.name   ( viene del modelo base 'Site' ) 
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
    calemdarCode =  models.CharField( max_length=50,  null = True, blank = True)

    baseCurrencyCode  =  models.CharField( max_length=50,  null = True, blank = True)    
    baseLanguajeCode  =  models.CharField( max_length=50,  null = True, blank = True)

    fiscalPeriodType  =  models.CharField( max_length=50,  null = True, blank = True)
    fiscalCurrentYear  =  models.CharField( max_length=50,  null = True, blank = True)

    createdOn = models.DateTimeField( default=datetime.now )

    def __unicode__(self):
        return self.name 


class ProtoBussinesUnit(models.Model):
# Los BUnit representan la jerarquia funcional ( de seguridad ) de la app     
# Es la base de la seguridad por registro

    code = models.CharField(unique=True, blank = False, null = False, max_length=200 )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
    parentBUnit = models.ForeignKey( 'ProtoBussinesUnit', blank = True, null = True )
    protoSite = models.ForeignKey( 'ProtoSite' )

    def __unicode__(self):
        return self.code


     
class ProtoUser(User):
#Es necesario inlcuir el ususario en un BUnit, cada registro copiara el Bunit 
#del usuario para dar permisos tambien a la jerarquia ( ascendente )
   
#   username = User.username ( viene del modelo base 'User' )
    bussinesUnit = models.ForeignKey( ProtoBussinesUnit )
    protoSite = models.ManyToManyField( 'ProtoSite' )


#Es necesario inlcuir el ususario en BUnit, ademas los grupos son recursivos      
class ProtoGroup(Group):
#   name = Group.name  ( viene del modelo base 'Group' )
    bussinesUnit = models.ManyToManyField( ProtoBussinesUnit )
    parentGroup = models.ForeignKey( 'ProtoSite', blank = True, null = True )


#Tabla modelo para la creacion de entidades de usuario     
#related_name="%(app_label)s_%(class)s
class ProtoModel(models.Model):
    owningUser = models.ForeignKey( ProtoUser, related_name='+')
    owningBUnit = models.ForeignKey( ProtoBussinesUnit, related_name='+')

    createdBy = models.ForeignKey( ProtoUser, related_name='+')
    modifiedBy = models.ForeignKey( ProtoUser, related_name='+')
    wflowStatus =  models.CharField( max_length=50,  null = True, blank=True)
    regStatus =  models.CharField( max_length=50,  null = True, blank=True)
    createdOn = models.DateTimeField( default= datetime.now )
    modifiedOn = models.DateTimeField( default= datetime.now)

    ProtoObj = True 

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


