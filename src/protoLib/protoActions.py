# -*- coding: utf-8 -*-

from django.contrib.admin.sites import site
<<<<<<< HEAD
from protoGrid import getBaseModelName
from models import getDjangoModel

import django.utils.simplejson as json
from utilsWeb import doReturn


def protoExecuteAction(request):
    """ Ejecuta una opcion
=======
from protoLib.protoGrid import getBaseModelName
from protoLib.models import getDjangoModel

import django.utils.simplejson as json
from protoLib.utilsWeb import doReturn


def protoExecuteAction(request):
    """
        Ejecuta una opcion
        Exécute une option
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    """

    if not request.user.is_authenticated():
        return doReturn({'success': False, 'message': 'readOnly User'})

    if request.method != 'POST':
        return doReturn({'success': False, 'message': 'PostAction required'})
<<<<<<< HEAD

    actionName = request.POST.get('actionName', '')

=======

    actionName = request.POST.get('actionName', '')

>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    viewCode = request.POST.get('viewCode', '')
    viewEntity = getBaseModelName(viewCode)

    selectedKeys = request.POST.get('selectedKeys', [])
    selectedKeys = json.loads(selectedKeys)

    parameters = request.POST.get('parameters', [])
    parameters = json.loads(parameters)

    # Obtiene el modelo
<<<<<<< HEAD
    try:
        model = getDjangoModel(viewEntity)
        modelAdmin = site._registry.get(model)
    except Exception as e:
        return doReturn({'success': False, 'message': 'Model notFound'})
=======
    # Obtient le modèle
    try:
        model = getDjangoModel(viewEntity)
        print('\n')
        print(model)
        modelAdmin = site._registry.get(model)
        print(modelAdmin)
        print('\n')
    except Exception as e:
        return doReturn({'success': False, 'message': 'Model notFound'})

    if not modelAdmin:
        return doReturn({'success': False, 'message': 'modelAdmin is undefined'})
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    for action in modelAdmin.actions:
        if action.__name__ == actionName:
            break

    if not action:
        return doReturn({'success': False, 'message': 'Action notFound'})
<<<<<<< HEAD

    Qs = model.objects.select_related(depth=1)
=======
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    # hace el QSet de los registros seleccionados
    # rend le QSet des enregistrements sélectionnés
    if selectedKeys.__len__() == 0:
<<<<<<< HEAD
        selectedKeys = [-1]
=======
        return doReturn({'success': False, 'message': 'No record selected'})

    Qs = model.objects.select_related(depth=1)
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    Qs = Qs.filter(pk__in=selectedKeys)

    try:
        returnObj = action(modelAdmin, request, Qs, parameters)
        return doReturn(returnObj)

    except Exception as e:
        return doReturn({'success': False, 'message': str(e)})
