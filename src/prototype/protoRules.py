# -*- coding: utf-8 -*-

import traceback
from protoLib.utilsBase import  getReadableError


ONDELETE_TYPES = (  
        ('CASCADE', 'Cascade deletes; the default' ), 
        ('PROTECT', 'Prevent deletion of the referenced object by raising ProtectedError, a subclass of django.db.IntegrityError'),
        ('SET_NULL', 'Set the ForeignKey null; this is only possible if null is True'), 
        ('SET_DEFAULT', 'Set the ForeignKey to its default value; a default for the ForeignKey must be set.  @function si possible'), 
        ('DO_NOTHING', 'Use default Db constraint')
    ) 

BASE_TYPES = ( ( 'string', 'string' ),
               ( 'text', 'text' ),  
               ( 'bool', 'bool' ), 
               ( 'int', 'int' ),
               ( 'secuence', 'secuence' ),
               ( 'decimal', 'decimal' ), 
               ( 'money', 'money' ), 
               ( 'combo', 'combo' ),  
               ( 'date',  'date' ),
               ( 'datetime', 'datetime' ), 
               ( 'time', 'time' )
              ) 

CRUD_TYPES = (  
                ('storeOnly', 'No se presentan nunca (los id, jsonTypes, etc )' ),  
                ('readOnly',  'No se guarda nunca (usado por reglas de gestion)' ), 
                ('insertOnly','No se actualiza (un campo absorbido al momento de la creacion, ej:direccion de envio'),
                ('updateOnly','Al insertar nulo o VrDefault, (estado inicial fijo)'),  
              ) 

# -----------------------------------------------------------------


def updatePropInfo( reg, propBase, modelBase, inherit  ):
    """
    self     :  propiedad q genera el cambio 
    propBase :  campo de referencia a la entidad de base 
    propModel:  modelo al cual copiar
    inherit  :  heredar ( si es descendente Dom, Model, ...  )
    
    Solo actualiza subiendo de prop a model a dom 
    """

    defValues = {
        'baseType' : reg.baseType, 
        'prpLength' : reg.prpLength,
        'prpDefault' : reg.prpDefault,
        'prpChoices' : reg.prpChoices,
        'isSensitive' : reg.isSensitive, 
        'description' : reg.description, 
        
        'smOwningUser' : reg.smOwningUser,
        'smOwningTeam' : reg.smOwningTeam,
        'smCreatedBy' : reg.smCreatedBy
    }
    
    if ( propBase is None ) and ( not modelBase is None ):
        # Crea los padres  
        if reg._meta.object_name == 'Property' : 
            pMod = modelBase.objects.get_or_create( model = reg.entity.model, code = reg.code, defaults=defValues  )[0]
            reg.propertyModel = pMod 

        elif reg._meta.object_name == 'PropertyModel' : 
            pDom = modelBase.objects.get_or_create( project = reg.model.project, code = reg.code, defaults=defValues  )[0]
            reg.propertyDom = pDom 

    # Se asegura q sea verdadero    
    if inherit == True :

        del defValues['smOwningUser']
        del defValues['smOwningTeam'] 
        del defValues['smCreatedBy'] 
        defValues['smModifiedBy'] = reg.smModifiedBy
             
        if reg._meta.object_name == 'PropertyDom' :
            # el update no genera eventos en los hijos 
            reg.propertymodel_set.update( **defValues )
            for pMod in reg.propertymodel_set.all():
                pMod.property_set.update( **defValues ) 
                            
        elif reg._meta.object_name == 'PropertyModel' : 
            reg.property_set.update( **defValues )



def twoWayPropEquivalence( propEquiv, modelBase, deleted ):
    """La actualizacion doble sobre la misma tabla plante un acertijo intersante
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

