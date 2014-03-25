
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

