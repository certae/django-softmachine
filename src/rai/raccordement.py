# -*- coding: utf-8 -*-

from django.http import HttpResponse
from protoLib.utilsWeb import JsonError
from rai.models import ModeleRaccordement, Raccordement, ElementDonnee

import json
from datetime import datetime

def getModeleRaccordement(request):
    """ return all tables from project
    """
    modelID = request.GET['modelID']
    selectedModels = []

    try:
        model = ModeleRaccordement.objects.get(id=modelID)
        
        selectedModels.append({'id':model.mod_modrac1.id, 'modelName':model.mod_modrac1.nom_modele, 'attributes':getAttributesFromModel(model.mod_modrac1)})
        selectedModels.append({'id':model.mod_modrac2.id, 'modelName':model.mod_modrac2.nom_modele, 'attributes':getAttributesFromModel(model.mod_modrac2)})

        raccordements = appendRaccordementsFromModel(model)
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

def appendRaccordementsFromModel(model):
    raccordements = []
    for raccordement in model.raccordement_modrac_rac.all():
        racc = {'id':raccordement.id,
                'sourceId':raccordement.eledon_rac1.id,
                'sourceName':raccordement.eledon_rac1.nom_element_donnee,
                'targetId':raccordement.eledon_rac2.id,
                'targetName':raccordement.eledon_rac2.nom_element_donnee,
                'modelId':model.id,
                'modelName':model.nom_modele_raccordement}
        raccordements.append(racc)
    return raccordements
    
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
    user = request.user
    elements = json.loads(request.body)
    if type(elements) is list:
        for element in elements:
            saveRaccordement(element['modelId'], element['sourceId'], element['targetId'], user)
    else:
        saveRaccordement(elements['modelId'], elements['sourceId'], elements['targetId'], user)

    jsondict = {
        'success':True,
        'message': 'Raccordement saved',
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")

def saveRaccordement(modelId, sourceId, targetId, user):
    try:
        model = ModeleRaccordement.objects.get(id=modelId)
        source = ElementDonnee.objects.get(id=sourceId)
        target = ElementDonnee.objects.get(id=targetId)
        raccordement = Raccordement.objects.create(smOwningTeam=model.smOwningTeam,smOwningUser=user,smCreatedBy=user)
        raccordement.smModifiedBy = user
        raccordement.smCreatedOn = datetime.now()
        raccordement.smModifiedOn = datetime.now()
        raccordement.modrac_rac = model
        raccordement.eledon_rac1 = source
        raccordement.eledon_rac2 = target
        raccordement.save()
    except Exception as e:
        return JsonError(e)
       
def deleteRaccordement(request):
    ""
    elements = json.loads(request.body)
    if type(elements) is list:
        for element in elements:
            deleteRaccordementById(element['id'])
    else:
        deleteRaccordementById(elements['id'])

    jsondict = {
        'success':True,
        'message': 'Raccordement deleted',
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")

def deleteRaccordementById(raccordementId):
    try:
        raccordement = Raccordement.objects.get(id=raccordementId)
        raccordement.delete()
    except Exception as e:
        return JsonError(e)
    
def listRaccordement(request):
    ""
    modelID = request.GET['modelId']
    
    model = ModeleRaccordement.objects.get(id=modelID)
    raccordements = appendRaccordementsFromModel(model)
    
    jsondict = {
        'success':True,
        'message': 'Raccordements list',
        'raccordements': raccordements,
    }
    context = json.dumps(jsondict)
    return HttpResponse(context, content_type="application/json")