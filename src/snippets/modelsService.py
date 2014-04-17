
from protoLib.models import ProtoModel
from django.db import models
from protoLib.fields import JSONField,  JSONAwareManager
from protoLib.utilsBase import slugify

class Service(ProtoModel):
    """ 
    TODO: Servicios entre modelos ( entidades virtuales )    
    """    
    model = models.ForeignKey('Model', blank = False, null = False )
    code = models.CharField(blank = False, null = False, max_length=200 )

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
        return slugify( self.model.code + '-' +  self.code ) 

    class Meta:
        unique_together = ('model', 'code', 'smOwningTeam' )

    protoExt = { 
        "menuApp" : "roadMap",
        } 


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
        return slugify( self.model.code + '-' +  self.service.code ) 

    class Meta:
        unique_together = ('model', 'service', 'smOwningTeam' )





class Languaje(models.Model):
    """ TODO : Manejar una tabla con los diferentes lenguajes en formato Json    
        { 'es' : 'incio', 'en' : 'start', .....  }
        se aprovecha la pseudo definicion como en prototipos  
    """

    code = models.CharField(blank=False, null=False, max_length=200 , unique=True)

    # to handle a variable name usr
    alias = models.CharField(blank=False, null=False, max_length=200)

    info = JSONField(default={})

    def __unicode__(self):
        return self.code + '.' + self.info.__str__()

    objects = JSONAwareManager(json_fields=['info'])



