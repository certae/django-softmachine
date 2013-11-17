# -*- coding: utf-8 -*-

#TODO: Django’s comments system (django.contrib.comments) uses it to “attach” comments to any installed model.

from django.db import models
from django.contrib.auth.models import User 
from django.contrib.sites.models import Site
from django.db.models.signals import post_save
from protoLib.fields import JSONField,  JSONAwareManager

class TeamHierarchy(models.Model):
# Jerarquia funcional ( de seguridad ) de la app     
# Es la base de la seguridad por registro

    code = models.CharField( unique=True, blank = False, null = False, max_length=200 )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)
    parentNode = models.ForeignKey( 'TeamHierarchy' , blank = True, null = True , related_name='downHierachy')
    site = models.ForeignKey( Site, blank = True, null = True)

    @property
    def fullPath(self):
        return getNodeHierarchy( self , 'parentNode',  'id', 'fullPath'  )

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
        super(TeamHierarchy, self).save(*args, **kwargs) 

    protoExt = { 'fields' : { 
          'fullPath': {'readOnly' : True},
          'treeHierarchy': {'readOnly' : True},
     }}



# here is the profile model
class UserProfile(models.Model):  
#Es necesario inlcuir el ususario en un BUnit, cada registro copiara el Bunit 
#del usuario para dar permisos tambien a la jerarquia ( ascendente )
    user = models.ForeignKey(User, unique=True)
    userTeam = models.ForeignKey( TeamHierarchy, blank = True, null = True )
    userTree  = models.CharField( blank = True, null = True, max_length= 500 )
    language  = models.CharField( blank = True, null = True, max_length= 500 )

    #TODO: si  el usuario pertenece a varios grupos podria cambiar su grupo de trabajo 
    #workigTeam = models.ForeignKey( TeamHierarchy, blank = True, null = True )
      
    def __unicode__(self):
        return  self.user.username 

def user_post_save(sender, instance, created, **kwargs):
    """Create a user profile when a new user account is created"""
    if ( created ) :
        p = UserProfile()
        p.user = instance
        p.save()

post_save.connect(user_post_save, sender=User)


class UserShare(models.Model):  
    # si el usuairo comparte otros permisos  
    user = models.ForeignKey( User )
    userTeam = models.ForeignKey( TeamHierarchy , related_name='userShares' )

    def __unicode__(self):
        return self.user.username + '-' + self.userTeam.code 


#Tabla modelo para la creacion de entidades de usuario     ( sm  security mark ) 
#related_name="%(app_label)s_%(class)s
class ProtoModel(models.Model):
    smOwningUser = models.ForeignKey( User, null = True, blank=True, related_name='+', editable = False )
    smOwningTeam = models.ForeignKey( TeamHierarchy, null = True, blank=True, related_name='+', editable = False)

    smCreatedBy = models.ForeignKey( User, null = True, blank=True,related_name='+', editable = False)
    smModifiedBy = models.ForeignKey( User, null = True, blank=True, related_name='+', editable = False)
    smRegStatus  =  models.CharField( max_length=50,  null = True, blank=True, editable = False)
    smWflowStatus =  models.CharField( max_length=50,  null = True, blank=True, editable = False)

    smCreatedOn = models.DateTimeField( auto_now=True , null = True, blank=True,editable = False)
    smModifiedOn = models.DateTimeField( auto_now=True , null = True, blank=True, editable = False)

    # Indicador para manejo de seguridad 
    _protoObj = True 

    class Meta:
        abstract = True


class EntityMap(models.Model):
    """
    TODO: Capa adicional para manejar permisos 
        a nivel de campo,
        vista
        acciones 
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
     
    se manejan referecias debiles por nombre para poder importar/exportar la info, de otra forma seria por contenttype 
           
    """
    appName = models.CharField(max_length=200, blank=False, null=False)
    modelName = models.CharField(max_length=200, blank=False, null=False)
    fieldLevelSecurity = models.BooleanField( default = True )

#    class Meta:
#        unique_together = ("appName", "modelName" )



class FieldMap(models.Model):
    #TODO: Implemenar con EntityMap 
    
    entity = models.ForeignKey(EntityMap, blank=False, null=False)
    fieldName  = models.CharField(max_length=200, blank=False, null=False)

    # Permisos a nivel de campo ( se marcan como enteros para sumarlos 0 = False )  
    canRead =  models.IntegerField( default = 0, blank=False, null=False )
    canIns  =  models.IntegerField( default = 0, blank=False, null=False )
    canUpd  =  models.IntegerField( default = 0, blank=False, null=False )

    class Meta:
        unique_together = ("entity", "fieldName")


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


class CustomDefinition( ProtoModel ):
    # maneja las definiciones por grupo 
    # aqui se guardan los menus personalizados, y las customOptions 
    # DGT: por ahora el manejo es solo a nivel de grupos, pero dependiendo el nivel de amdin, se guardara como grupo o usuario  
    code = models.CharField( blank = False, null = False, max_length=200 )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)

    metaDefinition = models.TextField( blank = True, null = True)

    # Compatibilidad con ProtoDefinition
    active = models.BooleanField( default = True )
    overWrite = models.BooleanField( default = False   )
    
    def __unicode__(self):
        return self.code 
    class Meta:
        unique_together = ('smOwningTeam', 'code',  )

    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "description", "smOwningTeam"]      
        }
    } 


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
            
    if model is None: 
        raise Exception( 'model not found:' + modelName )  
                
    return model 



def getNodeHierarchy( record, parentField,  codeField, pathFunction  ):
    "Returns the full hierarchy path."

    pRec  = record.__getattribute__(  parentField )
    if pRec   : 
        return pRec.__getattribute__( pathFunction  ) + ',' + unicode( record.__getattribute__(  codeField  ) ) 
    else: 
        return unicode( record.__getattribute__(  codeField ) )



class DiscreteValue( models.Model ):
    # TODO : Manejo de discretas  
    # Ahora se hace como un arbol para por ejemplo manejar el idioma fr.ca  es.ca
    # Arrancar con filtro inicial discreteValue = None   

    code = models.CharField( blank = False, null = False, max_length=200 )
    value = models.CharField( blank = False, null = False, max_length=200 )

    description = models.TextField( blank = True, null = True)
    title = models.ForeignKey('DiscreteValue',  blank = True, null = True)

    def __unicode__(self):
        if self.title is None:  
            return self.code
        else: return self.title.code + '.' + self.code 

    class Meta:
        unique_together = ('title', 'value',  )

    protoExt = { 
        "gridConfig" : {
            "listDisplay": ["__str__", "description" ]      
        }
    } 


class Languaje( models.Model ):
    """ TODO : Manejar una tabla con los diferentes lenguajes en formato Json    
        { 'es' : 'incio', 'en' : 'start', .....  }
        se aprovecha la pseudo definicion como en prototipos  
    """  

    code = models.CharField( blank = False, null = False, max_length=200 , unique = True )

    # para manejar un nombre de variable usr   
    alias = models.CharField( blank = False, null = False, max_length=200 )

    info = JSONField( default = {} )

    def __unicode__(self):
        return self.code + '.' + self.info.__str__()  
    
    objects = JSONAwareManager(json_fields = ['info'])



class PtFunction( models.Model ):
    """ TODO : En esta tabla se guardan funciones q seran ejectudas dinamicamente
        deben reespetar la syntaxis python y se precargaran con funcione de base 
        por ejemplo el perfil de usuario y el acceso a modelos 
        
        Siempre deb retornar algo
    """  

    # nombre de la funcion     
    code = models.CharField( blank = False, null = False, max_length=200 , unique = True )

    # este modelo se importa y se ofrece a la funcion 
    modelName = models.CharField( blank = False, null = False, max_length=200 )
    
    # lista separada por comas de los nombres de los argumentos 
    arguments = models.CharField( blank = False, null = False, max_length=400 )

    functionBody = models.TextField( blank = True, null = True )

    tag = models.CharField( blank = False, null = False, max_length=200 )
    description = models.TextField( verbose_name=u'Descriptions',blank = True, null = True)


    def __unicode__(self):
        return self.code + '.' + self.tag  

    
#class sb2reglesentite(models.Model):
#    description = models.CharField(max_length=250 ,blank=True)
#    declancheur = models.CharField(max_length=5 ,blank=True)
#    sequence = models.IntegerField(null=True ,blank=True)
#    typeregle = models.CharField(max_length=50 ,blank=True)
#    regle = models.CharField(max_length=50 ,blank=True)
#    messageok = models.CharField(max_length=50 ,blank=True)
#    messageerr = models.CharField(max_length=50)
#    actionerr = models.CharField(max_length=50 ,blank=True)
#    statut = models.CharField(max_length=10)
#    entite = models.ForeignKey(sb1entites)
#    
    