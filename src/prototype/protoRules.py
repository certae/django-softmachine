# -*- coding: utf-8 -*-

import traceback

ONDELETE_TYPES = (
    ('CASCADE', 'Cascade deletes; the default'),
    ('PROTECT', 'Prevent deletion of the referenced object by raising ProtectedError, a subclass of django.db.IntegrityError'),
    ('SET_NULL', 'Set the ForeignKey null; this is only possible if null is True'),
    ('SET_DEFAULT', 'Set the ForeignKey to its default value; a default for the ForeignKey must be set.  @function si possible'),
    ('DO_NOTHING', 'Use default Db constraint')
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


def updatePropInfo(myBase, propBase, modelBase, inherit):
    """
    self     :  propiedad q genera el cambio
    propBase :  campo de referencia a la entidad de base
    propModel:  modelo al cual copiar
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
    if inherit is True:
        del defValues['smOwningUser']
        del defValues['smCreatedBy']
        defValues['smModifiedBy'] = myBase.smModifiedBy

        #if myBase._meta.object_name == 'PropertyModel' :
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
    }

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


def updProPropModel(Property):
    # recorre todas las props y las toca
    for pProp in Property.objects.filter(propertyModel=None):
        pProp.save()
