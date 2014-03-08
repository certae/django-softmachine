# -*- coding: utf-8 -*-

from django.db import models
from django.db.models.signals import post_save, post_delete 

from protoLib.models import ProtoModel   
from protoLib.fields import JSONField,  JSONAwareManager


"""

DGT: Tablas adicionales para automatizacion de tareas 

"""

class DiscreteValue(models.Model):
    # TODO : Manejo de discretas
    # Ahora se hace como un arbol para por ejemplo manejar el idioma fr.ca  es.ca
    # Arrancar con filtro inicial discreteValue = None

    code = models.CharField(blank=False, null=False, max_length=200)
    value = models.CharField(blank=False, null=False, max_length=200)

    description = models.TextField(blank=True, null=True)
    title = models.ForeignKey('DiscreteValue', blank=True, null=True)

    def __unicode__(self):
        if self.title is None:
            return self.code
        else: return self.title.code + '.' + self.code

    class Meta:
        unique_together = ('title', 'value',)

    protoExt = {
        "gridConfig" : {
            "listDisplay": ["__str__", "description" ]
        }
    }


class Languaje(models.Model):
    """ TODO : Manejar una tabla con los diferentes lenguajes en formato Json    
        { 'es' : 'incio', 'en' : 'start', .....  }
        se aprovecha la pseudo definicion como en prototipos  
    """

    code = models.CharField(blank=False, null=False, max_length=200 , unique=True)

    # para manejar un nombre de variable usr
    alias = models.CharField(blank=False, null=False, max_length=200)

    info = JSONField(default={})

    def __unicode__(self):
        return self.code + '.' + self.info.__str__()

    objects = JSONAwareManager(json_fields=['info'])



class PtFunction(models.Model):
    """ TODO : En esta tabla se guardan funciones q seran ejectudas dinamicamente
        deben reespetar la syntaxis python y se precargaran con funcione de base 
        por ejemplo el perfil de usuario y el acceso a modelos 
        
        Siempre deb retornar algo
    """

    # nombre de la funcion
    code = models.CharField(blank=False, null=False, max_length=200 , unique=True)

    # este modelo se importa y se ofrece a la funcion
    modelName = models.CharField(blank=False, null=False, max_length=200)

    # lista separada por comas de los nombres de los argumentos
    arguments = models.CharField(blank=False, null=False, max_length=400)

    functionBody = models.TextField(blank=True, null=True)

    tag = models.CharField(blank=False, null=False, max_length=200)
    description = models.TextField(verbose_name=u'Descriptions', blank=True, null=True)


    def __unicode__(self):
        return self.code + '.' + self.tag


class ParametersBase(ProtoModel):
    parameterKey = models.CharField(max_length=250 , blank=False, null=False)
    parameterTag = models.CharField(max_length=250 , blank=False, null=False)
    parameterValue = models.CharField(max_length=250 , blank=False, null=False)

    def __unicode__(self):
        return self.parameterKey + '.' + self.parameterValue




class WflowAdminResume(ProtoModel):
    """  Contiene el resumen las novedades que requieren accion del administrador
         Al crear un registro de WFlow se puede crear una instancia de esta tabla o incrementar el contador 
         Tambien tendra una accion para recorrer las tablas de wFlow ( parameter = wFlowEntities ) 
         y contara los estados a verificar ( parameterTag  = 0 ) 
    """

    viewEntity = models.CharField(max_length=250 , blank=False, null=False)
    activityCount = models.IntegerField(blank=False, null=False)

    def __unicode__(self):
        return self.viewEntity + '.' + self.smOwningTeam.__str__()

    protoExt = {
        "actions": [
            { "name": "doWFlowResume",
              "selectionMode" : "none",
              "refreshOnComplete" : True
            },
        ]
    }


class WflowUserReponse(ProtoModel):
    """  Contiene los resultados de las acciones del administrador 
    """

    viewEntity = models.CharField(max_length=250 , blank=False, null=False)
    wfAction = models.CharField(max_length=250 , blank=False, null=False)
    strKey = models.CharField(max_length=250 , blank=False, null=False)
    adminMsg = models.CharField(max_length=250 , blank=False, null=False)

    def __unicode__(self):
        return self.viewEntity

