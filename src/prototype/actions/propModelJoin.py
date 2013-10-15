# -*- coding: utf-8 -*-

<<<<<<< HEAD
from prototype.models import PropertyProject
=======
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
from datetime import datetime
from prototype.models import PropertyModel


def doPropModelJoin(queryset):
    """
<<<<<<< HEAD
    todo se factoriza a nivel de proeyecto, es importante saber
    la vision de un analista sea limitada a proyectos especificos
    de todas formas se puede establecer equivalencias entre proProject
    """
    myBase = None
    sAux = ''
=======
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
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    # Verifica si todos son del mismo modelo y del mismo tipo
    for propProject in queryset:
        if propProject.conceptType == 'ref':
            sAux = 'References are not machable :' + propProject.code
            return {'success': False, 'message': sAux}

        sAux += '-' + propProject.code

        if myBase is None:
<<<<<<< HEAD
            myBase = propProject
            continue

        if myBase.project.code != propProject.project.code:
            sAux = 'model mistMach :' + \
                myBase.model.code + '-' + propProject.model.code
=======
            myBase = propModel
            continue

        if myBase.model.code != propModel.model.code:
            sAux = 'model mistMach :' + myBase.model.code + '-' + propModel.model.code
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
            return {'success': False, 'message': sAux}

    # Crea el nuevo propProject
    # TODO: Implementar la seguridad real, esta copiando del registro base
<<<<<<< HEAD
=======

>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    if len(sAux) > 40:
        sAux = sAux[:40] + str(datetime.now())

    defValues = {
        'code': sAux[1:],
<<<<<<< HEAD
        'project': myBase.project,
=======
        'model': myBase.model,
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

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

<<<<<<< HEAD
    myBase = PropertyProject(**defValues)
    myBase.save()

    # Actualiza las Property dependeientes
    for propProject in queryset:
        propProject.property_set.update(propertyProject=myBase)
        sAux += ' ' + propProject.code
=======
    myBase = PropertyModel(**defValues)
    myBase.save()

    # Actualiza las Property dependeientes
    for propModel in queryset:
        propModel.property_set.update(propertyModel=myBase)
        sAux += ' ' + propModel.code
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    # Borra las propModels
    queryset.delete()

    return {'success': True, 'message': sAux}
