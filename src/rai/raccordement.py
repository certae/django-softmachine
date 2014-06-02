# -*- coding: utf-8 -*-

from django.http import HttpResponse
from protoLib.utilsWeb import JsonError
from rai.models import ModeleRaccordement

import json

def getModeleRaccordement(request):
    """ return all tables from project
    """
    modelID = request.GET['modelID']
    selectedModels = []

    try:
        model = ModeleRaccordement.objects.get(id=modelID)
        
        selectedModels.append({'id':model.mod_modrac1.id, 'modelName':model.mod_modrac1.nom_modele, 'attributes':getAttributesFromModel(model.mod_modrac1)})
        selectedModels.append({'id':model.mod_modrac2.id, 'modelName':model.mod_modrac2.nom_modele, 'attributes':getAttributesFromModel(model.mod_modrac2)})

        raccordements = []
        for raccordement in model.raccordement_modrac_rac.all():
            racc = {'id':raccordement.id, 
                    'sourceName':raccordement.eledon_rac1.nom_element_donnee, 
                    'targetName':raccordement.eledon_rac2.nom_element_donnee,
                    'modelName':model.nom_modele_raccordement}
            raccordements.append(racc)
        selectedModels.append({'id':model.id, 'nomModele':model.nom_modele_raccordement, 'raccordements':raccordements})
        
    except Exception as e:
        print(e)
        return JsonError("Entity non trouvé")

    jsondict = {
        'success':True,
        'message': '',
        'models': selectedModels,
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")

def getAttributesFromModel(model):
    attributes = []
    for entity in model.entite_entite_mod.all():
        for pProperty in entity.element_donnee_entite_elem.all():
            attrib = {'id':pProperty.id, 
                      'attributeName':pProperty.nom_element_donnee, 
                      'entityId':entity.id, 
                      'entityName':entity.nom_entite}
            attributes.append(attrib)
    return attributes

def createRaccordement(request):
    ""