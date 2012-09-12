# -*- coding: utf-8 -*-

#TODO: Django’s comments system (django.contrib.comments) uses it to “attach” comments to any installed model.

from django.db import models
from django.contrib.auth.models import User, Group, Permission 
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic


class MetaObj(models.Model):
    objType = models.CharField(max_length=50)
    def __unicode__(self):
        return self.code 

    class Meta:
        abstract = True


class Udp(models.Model):
    content_type = models.ForeignKey(ContentType)
    code = models.CharField(max_length=50)
    valueUdp = models.TextField(blank = True, null = True, max_length=200)
    indexUdp = models.IntegerField(blank = True, null = True)

    def __unicode__(self):
        return (strNotNull(self.code) + '.' + strNotNull(self.code))

    class Meta:
        unique_together = ('metaObj', 'code',)


class TaggedItem(models.Model):
    tag = models.SlugField()
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    content_object = generic.GenericForeignKey('content_type', 'object_id')

    def __unicode__(self):
        return self.tag

# Esta tabla tiene un unico registro equivalente una serie de parametros comunes a la org
class Organization(models.Model):
    name = models.CharField(unique=True, blank = False, null = False, max_length=200 )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
    calemdarCode = models.CharField(_null = True, blank = True)

    baseCurrencyCode  = models.CharField(_null = True, blank = True)    
    baseLanguajeCode  = models.CharField(_null = True, blank = True)

    fiscalPeriodType  = models.CharField(_null = True, blank = True)
    fiscalCurrentYear  = models.CharField(_null = True, blank = True)

    createdOn = models.DateTimeField(_default=datetime.datetime.now )


class BussinesUnit(models.Model):
    code = models.CharField(unique=True, blank = False, null = False, max_length=200 )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
    bussinesUnit = models.ForeignKey( 'BussinesUnit' )

    
class UserExt(User):
    bussinesUnit = models.ForeignKey( BussinesUnit )
    
    
class ProtoModel(models.Model):
    owningUser = models.ForeignKey( UserExt )
    owningBUnit = models.ForeignKey( BussinesUnit )
    createdBy = models.ForeignKey( UserExt )
    modifiedBy = models.ForeignKey( UserExt )
    wflowStatus = models.CharField(_null = True, blank=True)
    regStatus = models.CharField(_null = True, blank=True)
    createdOn = models.DateTimeField(_default=datetime.datetime.now )
    modifiedOn = models.DateTimeField(_default=datetime.datetime.now )
    

# -------------------------------------------



class ProtoDefinition(models.Model):
    code = models.CharField(unique=True, blank = False, null = False, max_length=200 )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
    metaDefinition = models.TextField( blank = True, null = True)
    
    # Si esta activo toma la definicion de la Db 
    active = models.BooleanField( default = False )
    
    # Elto de control para sobre escribir,  podria ser un error el solo hecho de inactivarlo
    overWrite = models.BooleanField( default = True  )
    
    def __unicode__(self):
        return self.code 


# *** Model inheritance 

#  There are three styles of inheritance that are possible in Django.
#
#  Often, you will just want to use the parent class to hold information that you don't want to have 
#  to type out for each child model. This class isn't going to ever be used in isolation, so 
#  ---->  Abstract  base classes are what you're after.

#  If you're subclassing an existing model (perhaps something from another application entirely) and
#  want each model to have its own database table, ----->  Multi-table inheritance is the way to go.
 
#  Finally, if you only want to modify the Python-level behavior of a model, without changing the models
#  fields in any way, you can use Proxy models.


# *** ForeignKey.on_delete¶

#   The possible values for on_delete are found in django.db.models:

#   CASCADE: Cascade deletes; the default.
#   PROTECT: Prevent deletion of the referenced object by raising django.db.models.ProtectedError, a subclass of django.db.IntegrityError.
#   SET_NULL: Set the ForeignKey null; this is only possible if null is True.
#   SET_DEFAULT: Set the ForeignKey to its default value; a default for the ForeignKey must be set.
#   SET(): Set the ForeignKey to the value passed to SET(), or if a callable is passed in, the result of calling it. In most cases, passing a callable will be necessary to avoid executing queries at the time your models.py is imported:
#   
#   --- Ej1
#   user = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL)
#   
#   --- EJ2
#   def get_sentinel_user():
#       return User.objects.get_or_create(username='deleted')[0]
#   
#   class MyModel(models.Model):
#       user = models.ForeignKey(User, on_delete=models.SET(get_sentinel_user))





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
