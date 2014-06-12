# -*- coding: utf-8 -*-

from protoLib.utilsBase import copyModelProps
from protoLib.protoActionEdit import setSecurityInfo 

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


    ixEntite = [
        'description_entite', 
        'historique', 
        'physical_name' 
    ]

    ixElto = [
        'cle_etrangere',
        'cle_primaire',
        'consignes_saisie',
        'contexte_particulier',
        'date_creation',
        'date_derniere_modification',
        'date_entree_vigueur',
        'date_trans_bdm',
        'definition',
        'domaine_valeurs',
        'element_provenance',
        'element_transforme',
        'element_transmis',
        'elements_de_source',
        'exceptions',
        'gabarit',
        'historique',
        'longueur',
        'methode_transfert',
        'methode_transformation',
        'mode_attribution',
        'nom_element_donnee',
        'notes',
        'numero_elem_cn',
        'obligation',
        'pratiques_acceptees',
        'provenance_reference',
        'reference_foire_questions',
        'requis_par',
        'si_provenance',
        'statut_element',
        'type_de_base',
        'type_mode_attribution',
        'validation_sur_element',
        'validations_inter_elements',
        'validations_inter_enregistrement',
        'volumetrie',              
    ]

    ixRelation = [
        'baseMax',
        'baseMin',
        'dependance',
        'description',
        'nom_relation',
        'refMax',
        'refMin',
    ]

    from protoLib.protoAuth import getUserProfile
    userProfile = getUserProfile( request.user, 'prototype', '' )

    # get destination model and project
    from rai.models import Modele,  Entite, ElementDonnee, Relation  
    from rai.models import ModeleRaccordement, Raccordement 
    
    lModele = Modele.objects.get( id = parameters[1]['value']  )

    # get source Entities      
    for sEntite in queryset:
        dEntite  = Entite.objects.get_or_create( entite_mod = lModele, nom_entite = sEntite.nom_entite )[0]
        dEntite = copyModelProps ( sEntite, dEntite, ixEntite) 

        setSecurityInfo(dEntite, {}, userProfile, True)
        dEntite.save()

        # Modele de racc ( same DomAff ) 
        dMRacc = None 
        if sEntite.entite_mod.domaff_modele == lModele.domaff_modele : 
            dMRacc = ModeleRaccordement.objects.get_or_create( mod_modrac1 = sEntite.entite_mod, mod_modrac2 = lModele )[0]
            
            setSecurityInfo(dMRacc, {}, userProfile, True)
            dMRacc.save()


        for sElto in sEntite.element_donnee_entite_elem.all():

            dElto = ElementDonnee.objects.get_or_create( entite_elem = dEntite, nom_element_donnee = sElto.nom_element_donnee )[0]
            dElto = copyModelProps( sElto, dElto, ixElto )
            
            setSecurityInfo(dElto, {}, userProfile, True)
            dElto.save()

            if dMRacc: 
                dRacc = Raccordement.objects.get_or_create( 
                            modrac_rac = dMRacc, 
                            eledon_rac1 = sElto,  
                            eledon_rac2 = dElto,  
                            )[0]
                
                setSecurityInfo(dRacc, {}, userProfile, True)
                dRacc.save()

    # new loop because relation need all entities  
    for sEntite in queryset:
        dEntite  = Entite.objects.get_or_create( entite_mod = lModele, nom_entite = sEntite.nom_entite )[0]

        for sRel in sEntite.relation_entite_rela1.all():

            # get refEntity  
            try:
                rEntite  = Entite.objects.get( entite_mod = lModele, nom_entite = sRel.entite_rela2.nom_entite )
            except Exception:
                continue 

            # get or Create relation  
            dRel = Relation.objects.get_or_create( entite_rela1 = dEntite, entite_rela2 = rEntite )[0]
            dRel = copyModelProps( sRel, dRel, ixRelation )

            setSecurityInfo(dRel, {}, userProfile, True)
            dRel.save()



    return
