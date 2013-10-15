# -*- coding: utf-8 -*-

from django.http import HttpResponse
<<<<<<< HEAD
from models import getDjangoModel
from utilsBase import getReadableError
from protoGrid import getBaseModelName, getModelDetails
from utilsWeb import JsonError, JsonSuccess
=======
from protoLib.protoField import TypeEquivalence
from protoLib.models import getDjangoModel
from protoLib.utilsBase import getReadableError, verifyStr
from protoLib.protoGrid import getBaseModelName, getModelDetails
from protoLib.utilsWeb import JsonError, JsonSuccess
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

import django.utils.simplejson as json

PROTO_PREFIX = "prototype.ProtoTable."


def protoGetDetailsTree(request):
    """ return full field tree
    """

    if not request.user.is_authenticated():
        return JsonError('readOnly User')

    if request.method != 'POST':
        return JsonError('invalid message')

    viewCode = request.POST.get('viewCode', '')
    viewEntity = getBaseModelName(viewCode)

    try:
        model = getDjangoModel(viewEntity)
<<<<<<< HEAD
    except Exception,  e:
=======
    except Exception as e:
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        jsondict = {'success': False, 'message': getReadableError(e)}
        context = json.dumps(jsondict)
        return HttpResponse(context, mimetype="application/json")

    detailList = []
    if viewCode.startswith(PROTO_PREFIX) and viewCode != viewEntity:
<<<<<<< HEAD
        # -------------------------------------------------------------------------  Prototipos
=======
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        protoEntityId = request.POST.get('protoEntityId')
        if not protoEntityId >= 0:
            return JsonError('invalid idEntity')

        try:
<<<<<<< HEAD
            from prototype.actions.viewDefinition import GetDetailsConfigTreeById
            detailList = GetDetailsConfigTreeById(protoEntityId)
=======
            from prototype.actions.viewDefinition import GetDetailsConfigTree
            detailList = GetDetailsConfigTree(protoEntityId)
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        except:
            return JsonError('invalid idEntity')

    else:
        modelDetails = getModelDetails(model)
        for detail in modelDetails:
<<<<<<< HEAD
            addDetailToList(detailList,  detail,  '')

    # Codifica el mssage json
    context = json.dumps(detailList)
    return HttpResponse(context, mimetype="application/json")
=======
            addDetailToList(detailList, detail, '')
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    context = json.dumps(detailList)
    return HttpResponse(context, mimetype="application/json")

<<<<<<< HEAD
def addDetailToList(detailList, detail,  detailPath):
=======

def addDetailToList(detailList, detail, detailPath):
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    """ return parcial detail tree  ( Called from protoGetFieldTree )

    detailList    : Lista con los detalles
    detail        : registro del detalle
    detailField   : jerarquia vista desde el campo
    detailPath    : jerarquia inversa vista desde el maestro
    """

    if len(detailPath) > 0:
        detailPath += '/'
    detailPath += detail['menuText']

    # Agrega el campo solicitado
    menuDetail = {
        "id": detailPath,
        "conceptDetail": detail['conceptDetail'],
        "detailField": detail['detailField'],
        "masterField": 'pk',
        "leaf": True
    }

    detailList.append(menuDetail)

    # Evita demasiada recursividad ( 5 niveles debe ser mas q suficiente )
<<<<<<< HEAD
    # Si el mismo campo ya aparece en el camino seguramente es una
    # autoreferencia
=======
    # Si el mismo campo ya aparece en el camino seguramente es una autoreferencia
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    detailField = detail['detailField']
    if detailField.count('__') > 5 or detailField.count('__' + detail['detailName'] + '__') > 0:
        return

    else:
        detailChild = []
        model = getDjangoModel(detail['conceptDetail'])
        modelDetails = getModelDetails(model)
        for sDetail in modelDetails:
<<<<<<< HEAD
            sDetail['detailField'] = sDetail[
                'detailName'] + '__' + detail['detailField']
            addDetailToList(detailChild,  sDetail,  detailPath)
=======
            sDetail['detailField'] = sDetail['detailName'] + '__' + detail['detailField']
            addDetailToList(detailChild, sDetail, detailPath)
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

        # Si el modelo de base es el modelo de trabajo, no entro al loop
        if len(detailChild) > 0:
            menuDetail['leaf'] = False
            menuDetail['children'] = detailChild
