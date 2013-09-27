# -*- coding: utf-8 -*-

from prototype.models import Relationship, ForeignEntity


def actionAutoForeingEntity(queryset):
    """
    Lista de entidades foraneas del modelo,
    permite determinar el comportamineto grafico y documentacion de analisis
    """

    # Obtiene el proyecto y se asegura q sean todas de un mismo proyecto
    for dModel in queryset:

        # Busca las relaciones del modelo q apuntan a entidades q no son del
        # modelo
        qsRef = Relationship.objects.filter(
            entity__model=dModel, smOwningTeam=dModel.smOwningTeam).exclude(refEntity__model=dModel)

        defValues = {
            'smOwningTeam': dModel.smOwningTeam,
            'smOwningUser': dModel.smOwningUser,
            'smCreatedBy':  dModel.smCreatedBy,
            'hideEntity': True
        }

        for dRef in qsRef:
            ForeignEntity.objects.get_or_create(
                model=dModel, entity=dRef.refEntity, smOwningTeam=dModel.smOwningTeam, defaults=defValues)

    return {'success': True, 'message': 'Ok'}
