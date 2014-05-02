# -*- coding: utf-8 -*-

from datetime import datetime

from protoLib.models import ProtoModel
from prototype.models import Property
from django.db import models
from prototype.protoRules import  BASE_TYPES
from protoLib.utilsBase import slugify
from django.db.models.signals import post_delete
import traceback

class PropertyBase(ProtoModel):

    code = models.CharField(blank = False, null = False, max_length=200 )

    """baseType, prpLength:  Caracteristicas generales q definen el campo """
    baseType = models.CharField( blank = True, null = True, max_length=50, choices = BASE_TYPES, default = 'string')
    prpLength = models.IntegerField(blank = True, null = True )
    prpScale = models.IntegerField(blank = True, null = True )

    """vType : validation type ( formatos predefinidos email, .... ) """
    vType = models.CharField( blank = True, null = True, max_length=50, choices = BASE_TYPES, default = 'string')

    """prpDefault: Puede variar en cada instancia """ 
    prpDefault = models.CharField( blank = True, null = True, max_length=50)
    
    """prpChoices:  Lista de valores CSV ( idioma?? ) """ 
    prpChoices = models.TextField( blank = True, null = True)

    """isSensitive: Indica si las propiedades requieren un nivel mayor de seguridad """  
    isSensitive = models.BooleanField()

    description = models.TextField( blank = True, null = True)
    notes  = models.TextField( blank = True, null = True)

    class Meta:
        abstract = True


# PropertyBase est une classe abstraite et doit Ãªtre testÃ©e diffÃ©remment.
# Cette classe est utilisee seulement a des fins de tests
class PropertyBaseChild(PropertyBase):
    def save(self, *args, **kwargs):
        super(PropertyBaseChild, self).save(*args, **kwargs)


class PropertyModel(PropertyBase):
    """ A nivel conceptual encontraremos la lista de propiedadaes 
        qu corresponde a la definicion semantica del problema; 
        
        1. Estas propiedades normalmente se definien a nivel de modelo 
        cuando el usuario ( piloto ) describe su problematica, 
        
        2. Si la definicion la realiza un modelizador, se hara a nivel de entidad, 

    * podria generarse navegando model-entity-prop 
    * pero el primer paso en podria implicar la definicion semantica de propiedades por modelo, 
    
    """
    model = models.ForeignKey('Model', blank = False, null = False )
    inherit = models.BooleanField( default = False )
    conceptType = models.CharField( blank = True, null = True, max_length=50, editable=False )

    def __unicode__(self):
        return slugify( self.model.code + '.' + self.code )

    class Meta:
        unique_together = ('model', 'code', 'smOwningTeam' )

    def save(self, *args, **kwargs ):
        # Envia el heredado y se asegura q sea Falso siempre 
        #updatePropInfo( self,  None, PropertyModel, self.inherit   )
        self.inherit = False 
        super(PropertyModel, self).save(*args, **kwargs) 
        
    protoExt = { 
#    "menuApp" : "dictionary", 
    "actions": [
        { "name": "doPropertyModelJoin", 
          "selectionMode" : "multiple",  
          "refreshOnComplete" : True
        },
    ],
    "gridConfig" : {
        "listDisplay": ["__str__", "description", "inherit", "conceptType", "smOwningTeam"]      
    }, 

    "detailsConfig": [{
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
    updProPropModel( Property )
    

post_delete.connect(propModel_post_delete, sender = PropertyModel)



# ----------------------------------------------------------------------------------


    

# def propEquivalence_post_save(sender, instance, created, **kwargs):
#     twoWayPropEquivalence( instance, PropertyEquivalence, False )

# post_save.connect(propEquivalence_post_save, sender = PropertyEquivalence)



def updatePropInfo( myBase, propBase, modelBase, inherit  ):
    """
    self     :  propiedad q genera el cambio 
    propBase :  campo de referencia a la entidad de base 
    propModel:  modelo al cual copiar
    inherit  :  heredar ( si es descendente Dom, Model, ...  )
    """


    defValues = {
        'baseType' : myBase.baseType, 
        'prpLength' : myBase.prpLength,
        'prpScale' : myBase.prpScale,

        'vType' : myBase.vType,
        'prpDefault' : myBase.prpDefault,
        'prpChoices' : myBase.prpChoices,
        'isSensitive' : myBase.isSensitive, 
        
        'description' : myBase.description, 
        
        'smOwningUser' : myBase.smOwningUser,
        'smCreatedBy' : myBase.smCreatedBy
    }

    
    # Crea los PropertyModel correspondientes  
    # Si el propertyModel ( propBase ) viene nulo y 
    # si es un objeto pertinente ( Property, Relationship ) Historico, para manejar las diferentes niveles de props.  
    if ( propBase is None ) and ( myBase._meta.object_name in ['Property', 'Relationship'] ):
        
        pName = myBase.entity.code + '.' + myBase.code
        if myBase.isForeign: 
            defValues['conceptType'] = 'ref'
            if myBase._meta.object_name == 'Property':
                pName = myBase.relationship.refEntity.code + '.pk'
            if myBase._meta.object_name == 'Relationship':  
                pName = myBase.refEntity.code + '.pk'

        pMod=modelBase.objects.get_or_create(model=myBase.entity.model,code=pName,smOwningTeam=myBase.smOwningTeam,defaults=defValues)[0]
        myBase.propertyModel = pMod 

    # Se asegura q sea heredable  y actualiza los Property asociados    
    if inherit == True :
        del defValues['smOwningUser']
        del defValues['smCreatedBy'] 
        defValues['smModifiedBy'] = myBase.smModifiedBy
                            
        #if myBase._meta.object_name == 'PropertyModel' : 
        myBase.property_set.update( **defValues )


def twoWayPropEquivalence( propEquiv, modelBase, deleted ):
    """La actualizacion doble sobre la misma tabla ( Equivalencia a->b b->a) plante un acertijo intersante
    cada vez q se crea o actualiza un registro, genera los eventos q inicial 
    la creacion o actualizacion de su gemelo,  no importa en q evento ( senal ) 
    se conecte, siempre habra un loop infinito 
    
    Django maneja metodo update q no genera eventos de actualizacion  
    """
    
    updKeys = {
        'sourceProperty' : propEquiv.targetProperty, 
        'targetProperty' : propEquiv.sourceProperty, 
        'smOwningTeam' : propEquiv.smOwningTeam
        }
    
    if deleted : 
        modelBase.objects.filter( **updKeys ).delete() 
        return 
    
    updDefaults = { 
        'description'    : propEquiv.description,
        'smOwningUser' : propEquiv.smOwningUser,
        'smCreatedBy'  : propEquiv.smCreatedBy,

        'smModifiedBy' : propEquiv.smModifiedBy ,
        'smRegStatus'  : propEquiv.smRegStatus ,
        'smWflowStatus' : propEquiv.smWflowStatus ,
        
        'smCreatedOn' : propEquiv.smCreatedOn ,
        'smModifiedOn' : propEquiv.smModifiedOn 
    }

    try:
        # lo busca
        obj = modelBase.objects.get( **updKeys)
        
        # lo actualiza 
        modelBase.objects.filter( pk = obj.pk ).update( **updDefaults ) 
        
    except modelBase.DoesNotExist:
        # lo crea 
        updKeys.update( updDefaults )
        obj = modelBase( **updKeys )
        obj.save()

    except Exception as e:
        traceback.print_exc()
        raise e 


def updProPropModel( Property ):
    # recorre todas las props y las toca
    for pProp in Property.objects.filter( propertyModel = None  ): 
        pProp.save()




def doPropModelJoin( queryset ):

    
    """
    No se pueden crear props de diferentes modelos, pues el modelo hace parte de la llave
    y aunq yo pienso q deberia factorisarse todo a nivel de proeyecto, es importante saber 
    saber cual es el modelo, es posible q la vision de un analista sea limitada a modelos especificos
    de todas formas se puede establecer equivalencias entre proModel 
    """ 
    myBase = None 
    sAux = ''
    
    # Verifica si todos son del mismo modelo y del mismo tipo    
    for propModel in queryset:
        if propModel.conceptType == 'ref':
            sAux = 'References are not machable :' +  propModel.code
            return {'success':False , 'message' : sAux } 

        sAux += '-' + propModel.code

        if myBase is None: 
            myBase = propModel 
            continue 
         
        if myBase.model.code != propModel.model.code:
            sAux = 'model mistMach :' + myBase.model.code + '-' + propModel.model.code 
            return {'success':False , 'message' : sAux } 


    # Crea el nuevo propModel
    # TODO: Implementar la seguridad real, esta copiando del registro base
    
    if len( sAux ) > 40:
        sAux = sAux[:40] + str( datetime.now() ) 
     
    defValues = {
        'code' : sAux[1:], 
        'model' : myBase.model, 

        'baseType' : myBase.baseType, 
        'prpLength' : myBase.prpLength,
        'prpScale' : myBase.prpScale,

        'vType' : myBase.vType,
        'prpDefault' : myBase.prpDefault,
        'prpChoices' : myBase.prpChoices,
        'isSensitive' : myBase.isSensitive,
         
        'description' : myBase.description, 

        'smOwningTeam' : myBase.smOwningTeam,
        'smOwningUser' : myBase.smOwningUser,
        'smCreatedBy'  : myBase.smCreatedBy,

        'smModifiedBy' : myBase.smModifiedBy ,
        'smRegStatus'  : myBase.smRegStatus ,
        'smWflowStatus' : myBase.smWflowStatus ,
        
        'smCreatedOn' : myBase.smCreatedOn ,
        'smModifiedOn' : myBase.smModifiedOn 
    }
    
    myBase = PropertyModel( **defValues )
    myBase.save()
    
    # Actualiza las Property dependeientes
    for propModel in queryset:
        propModel.property_set.update(propertyModel= myBase  )
        sAux +=  ' ' + propModel.code    

    # Borra las propModels
    queryset.delete()

    return {'success':True , 'message' : sAux } 
