# -*- coding: utf-8 -*-

import traceback
<<<<<<< HEAD
#from protoLib.utilsBase import  getReadableError
=======
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e


ONDELETE_TYPES = (
    ('CASCADE', 'Cascade deletes; the default'),
    ('PROTECT', 'Prevent deletion of the referenced object by raising ProtectedError, a subclass of django.db.IntegrityError'),
    ('SET_NULL', 'Set the ForeignKey null; this is only possible if null is True'),
    ('SET_DEFAULT', 'Set the ForeignKey to its default value; a default for the ForeignKey must be set.  @function si possible'),
    ('DO_NOTHING', 'Use default Db constraint')
<<<<<<< HEAD
    )

BASE_TYPES = (('string', 'string'),
              ('text', 'text'),
              ('bool', 'bool'),
              ('int', 'int'),
              ('secuence', 'secuence'),
              ('decimal', 'decimal'),
              ('money', 'money'),
              ('combo', 'combo'),
              ('date',  'date'),
              ('datetime', 'datetime'),
              ('time', 'time')
              )

CRUD_TYPES = (('storeOnly', 'No se presentan nunca (los id, jsonTypes, etc )'),
              ('readOnly',  'No se guarda nunca (usado por reglas de gestion)'),
              ('insertOnly', 'No se actualiza (un campo absorbido al momento de la creacion, ej:direccion de envio'),
              ('updateOnly', 'Al insertar nulo o VrDefault, (estado inicial fijo)'),
              )

DB_ENGINE = (('sqlite3', 'sqlLite3'),
             ('postgres',  'Postgress'),
             ('mysql', 'mySQL'),
             )
=======
)

BASE_TYPES = (
    ('string', 'string'),
    ('text', 'text'),
    ('bool', 'bool'),
    ('int', 'int'),
    ('secuence', 'secuence'),
    ('decimal', 'decimal'),
    ('money', 'money'),
    ('combo', 'combo'),
    ('date',  'date'),
    ('datetime', 'datetime'),
    ('time', 'time')
)

CRUD_TYPES = (
    ('storeOnly', 'No se presentan nunca (los id, jsonTypes, etc )'),
    ('readOnly',  'No se guarda nunca (usado por reglas de gestion)'),
    ('insertOnly', 'No se actualiza (un campo absorbido al momento de la creacion, ej:direccion de envio'),
    ('updateOnly', 'Al insertar nulo o VrDefault, (estado inicial fijo)'),
)

DB_ENGINE = (
    ('sqlite3', 'sqlLite3'),
    ('postgres',  'Postgress'),
    ('mysql', 'mySQL'),
)
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e


def updatePropInfo(myBase, propBase, modelBase, inherit):
    """
    self     :  propiedad q genera el cambio
<<<<<<< HEAD
    propBase :  campo de referencia a la entidad de base ( property normalmente )
=======
    propBase :  campo de referencia a la entidad de base
    propModel:  modelo al cual copiar
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    inherit  :  heredar ( si es descendente Dom, Model, ...  )
    """

    defValues = {
        'baseType': myBase.baseType,
        'prpLength': myBase.prpLength,
        'prpScale': myBase.prpScale,

        'vType': myBase.vType,
        'prpDefault': myBase.prpDefault,
        'prpChoices': myBase.prpChoices,
        'isSensitive': myBase.isSensitive,

        'description': myBase.description,

        'smOwningUser': myBase.smOwningUser,
        'smCreatedBy': myBase.smCreatedBy
    }

<<<<<<< HEAD
    # Crea los PropertyProject correspondientes
    if (propBase is None) and (myBase._meta.object_name in ['Property', 'Relationship']):

        pName = myBase.entity.code + '_' + myBase.code
        if myBase.isForeign:
            defValues['conceptType'] = 'ref'
            if myBase._meta.object_name == 'Property':
                pName = myBase.relationship.refEntity.code + '_pk'
            if myBase._meta.object_name == 'Relationship':
                pName = myBase.refEntity.code + '_pk'

        pMod = modelBase.objects.get_or_create(
            project=myBase.entity.model.project,
            code=pName,
            smOwningTeam=myBase.smOwningTeam,
            defaults=defValues)[0]
        myBase.propertyProject = pMod

    # Se asegura q sea heredable  y actualiza los Property asociados
    #if inherit == True:
=======
    # Crea los PropertyModel correspondientes
    if (propBase is None) and (myBase._meta.object_name in ['Property', 'Relationship']):

        if myBase.isForeign:
            defValues['conceptType'] = 'ref'
            if myBase._meta.object_name == 'Property':
                pName = myBase.relationship.refEntity.code + '.pk'
            if myBase._meta.object_name == 'Relationship':
                pName = myBase.refEntity.code + '.pk'
        else:
            pName = myBase.entity.code + '.' + myBase.code
        pMod = modelBase.objects.get_or_create(model=myBase.entity.model, code=pName, smOwningTeam=myBase.smOwningTeam, defaults=defValues)[0]
        myBase.propertyModel = pMod

    # Se asegura q sea heredable  y actualiza los Property asociados
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    if inherit is True:
        del defValues['smOwningUser']
        del defValues['smCreatedBy']
        defValues['smModifiedBy'] = myBase.smModifiedBy

<<<<<<< HEAD
        #if myBase._meta.object_name == 'PropertyProject' :
=======
        #if myBase._meta.object_name == 'PropertyModel' :
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        myBase.property_set.update(**defValues)


def twoWayPropEquivalence(propEquiv, modelBase, deleted):
    """La actualizacion doble sobre la misma tabla plante un acertijo intersante
    cada vez q se crea o actualiza un registro, genera los eventos q inicial
    la creacion o actualizacion de su gemelo,  no importa en q evento ( senal )
    se conecte, siempre habra un loop infinito

    Django maneja metodo update q no genera eventos de actualizacion
    """

    updKeys = {
        'sourceProperty': propEquiv.targetProperty,
        'targetProperty': propEquiv.sourceProperty,
        'smOwningTeam': propEquiv.smOwningTeam
<<<<<<< HEAD
        }
=======
    }
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    if deleted:
        modelBase.objects.filter(**updKeys).delete()
        return

    updDefaults = {
        'description': propEquiv.description,
        'smOwningUser': propEquiv.smOwningUser,
        'smCreatedBy': propEquiv.smCreatedBy,

        'smModifiedBy': propEquiv.smModifiedBy,
        'smRegStatus': propEquiv.smRegStatus,
        'smWflowStatus': propEquiv.smWflowStatus,

        'smCreatedOn': propEquiv.smCreatedOn,
        'smModifiedOn': propEquiv.smModifiedOn
    }

    try:
        # lo busca
        obj = modelBase.objects.get(**updKeys)

        # lo actualiza
        modelBase.objects.filter(pk=obj.pk).update(**updDefaults)

    except modelBase.DoesNotExist:
        # lo crea
        updKeys.update(updDefaults)
        obj = modelBase(**updKeys)
        obj.save()

    except Exception as e:
        traceback.print_exc()
        raise e


<<<<<<< HEAD
def updPropertyProject(Property):
    # recorre todas las props y las toca para q refresquen el PropertyProject
    for pProp in Property.objects.filter(propertyProject=None):
=======
def updProPropModel(Property):
    # recorre todas las props y las toca
    for pProp in Property.objects.filter(propertyModel=None):
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        pProp.save()
