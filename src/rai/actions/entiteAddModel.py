# -*- coding: utf-8 -*-



def extractModel(request, queryset, parameters):
    """
    Copiar entidades seleccionadas en una lista sobre un modelo existente
    - Si la entidad existe, toma la siguiente
    - Si la entidad viene del mismo project, crea el modelos de raccordement
        - Si no, solo la crea
    - Se copiaran todos los elementos de datos de la entidad

    parameters  : entite_mod, entite_mod_id
    queryset    : entite
    """

    if queryset.count() == 0:
        return 'No record selected'

    # get destination model and project
    from rai.models import Modele,  Entite, ElementDonnee, Relation  
    lModele = Modele.objects.get( id = parameters[1]['value']  )
    
    #   es invocada desde propertyModel ( el Qset es propModel )
    for sEntite in queryset:

        dEntite  = Entite.objects.get_or_create( entite_mod = lModele, nom_entite = sEntite.nom_entite )[1]

        dEntite.description_entite = sEntite.description_entite
        dEntite.historique = sEntite.historique
        dEntite.physical_name = sEntite.physical_name
        dEntite.save()

        for sElto in sEntite.element_donnee_entite_elem.all():

            dElto = ElementDonnee.objects.get_or_create( entite_elem = sElto, nom_element_donnee = sElto.nom_element_donnee )[1]


        for sRel in sEntite.relation_entite_rela2.all():

            dElto = ElementDonnee.objects.get_or_create( entite_elem = sElto, nom_element_donnee = sElto.nom_element_donnee )[1]

            
            
#         dPropDom = objPropModel.propertyDom
#         if dModel == None :
#             dModel = getModel( dPropDom.domain, 'New Model' )
# 
#         dPropModel = PropertyModel()
#         dPropModel.model = dModel
#         dPropModel.propertyDom = dPropDom
#         dPropModel.save()

    return
