# -*- coding: utf-8 -*-

from datetime import datetime
import logging
from prototype.models import PropertyModel


def doPropModelJoin(queryset):

    logging.info('File : propModelJoin.py -- doPropModelJoin()')
    logging.info(queryset)

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
            sAux = 'References are not machable :' + propModel.code
            return {'success': False, 'message': sAux}

        sAux += '-' + propModel.code

        if myBase is None:
            myBase = propModel
            continue

        if myBase.model.code != propModel.model.code:
            sAux = 'model mistMach :' + myBase.model.code + '-' + propModel.model.code
            return {'success': False, 'message': sAux}

    # Crea el nuevo propModel
    # TODO: Implementar la seguridad real, esta copiando del registro base

    if len(sAux) > 40:
        sAux = sAux[:40] + str(datetime.now())

    defValues = {
        'code': sAux[1:],
        'model': myBase.model,

        'baseType': myBase.baseType,
        'prpLength': myBase.prpLength,
        'prpScale': myBase.prpScale,

        'vType': myBase.vType,
        'prpDefault': myBase.prpDefault,
        'prpChoices': myBase.prpChoices,
        'isSensitive': myBase.isSensitive,

        'description': myBase.description,

        'smOwningTeam': myBase.smOwningTeam,
        'smOwningUser': myBase.smOwningUser,
        'smCreatedBy': myBase.smCreatedBy,

        'smModifiedBy': myBase.smModifiedBy,
        'smRegStatus': myBase.smRegStatus,
        'smWflowStatus': myBase.smWflowStatus,

        'smCreatedOn': myBase.smCreatedOn,
        'smModifiedOn': myBase.smModifiedOn
    }

    myBase = PropertyModel(**defValues)
    myBase.save()

    # Actualiza las Property dependeientes
    for propModel in queryset:
        propModel.property_set.update(propertyModel=myBase)
        sAux += ' ' + propModel.code

    # Borra las propModels
    queryset.delete()

    return {'success': True, 'message': sAux}
