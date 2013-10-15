# -*- coding: utf-8 -*-

import traceback

from protoLib.utilsBase import slugify
from protoLib.downloadFile import getFullPath

from prototype.actions.viewDefinition import getViewDefinition, getViewCode, getEntities


def doModelPrototype(modeladmin, request, queryset, parameters):
    """
<<<<<<< HEAD
    funcion para crear el prototipo sobre 'protoTable' con la definicion del diccionario
    a partir de Model
    """

#   El QSet viene con la lista de Ids
=======
    Funcion para crear el prototipo sobre 'protoTable' con la definicion del diccionario a partir de Model
    Fonction pour créer le prototype sur «protoTable» avec la définition du dictionnaire du modèle
    """

#   El QSet viene con la lista de Ids
#   Le QSet est livré avec une liste d'ID
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    if queryset.count() == 0:
        return {'success': False, 'message': 'No record selected'}

#   Mensaje de retorno
<<<<<<< HEAD
    returnMsg = ''

#   Recorre los registros selccionados
=======
#   Message de retour
    returnMsg = ''

#   Recorre los registros selccionados
#   Parcourir les dossiers sélectionnés
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    for pModel in queryset:
        returnTmp = getEntities(pModel.entity_set.all(), request, None)
        returnMsg += 'Model : ' + pModel.code + ' Entts: ' + returnTmp + '; '

    return {'success': True, 'message': returnMsg}


def doEntityPrototype(modeladmin, request, queryset, parameters):

#   El QSet viene con la lista de Ids
<<<<<<< HEAD
=======
#   Le QSet est livré avec une liste d'ID
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    if queryset.count() != 1:
        return {'success': False, 'message': 'No record selected'}

    if len(parameters) != 1:
        return {'success': False, 'message': 'ViewName required!!'}

#   Recorre los registros selccionados
<<<<<<< HEAD
    returnTmp = 'Entt: ' + \
        getEntities(queryset, request, parameters[0]['value'])
    return {'success': True, 'message':  returnTmp}


def doPropertyProjectJoin(modeladmin, request, queryset, parameters):
    """
    funcion para unir dos propertyProject
=======
#   Parcourir les dossiers sélectionnés
    returnTmp = 'Entt: ' + getEntities(queryset, request, parameters[0]['value'])
    return {'success': True, 'message': returnTmp}


def doPropertyModelJoin(modeladmin, request, queryset, parameters):
    """
    Funcion para unir dos propertyModel
    Fonctionner à rejoindre le propertyModel
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    """

    from propModelJoin import doPropModelJoin

#   El QSet viene con la lista de Ids
<<<<<<< HEAD
    if queryset.count() < 2:
        return {'success': False, 'message': 'Multiple selection required'}

    return doPropModelJoin(queryset)


def doPropertyProjectPurge(modeladmin, request, queryset, parameters):
    """
    funcion para unir dos propertyProject
    """

    from django.db.models import Count
    from prototype.models import PropertyProject

    PropertyProject.objects.annotate(
        n_prop=Count('property')).filter(n_prop=0).delete()
=======
#   Le QSet est livré avec une liste d'ID
    if queryset.count() < 2:
        return {'success': False, 'message': 'Multiple selection required'}

    return doPropModelJoin(queryset)
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    return {'success': True, 'message': 'Ok'}

<<<<<<< HEAD

# -----------  Models

def doModelGraph(modeladmin, request, queryset, parameters):
    """
    funcion para crear el modelo grafico
    a partir de Model ( doModel )
    el proyecto enviara la el QSet de todos los modelos
=======
# -----------  Models

def doModelGraph(modeladmin, request, queryset, parameters):
    """
    funcion para crear el modelo grafico
    a partir de Model ( doModel )
    el proyecto enviara la el QSet de todos los modelos

    fonctionner pour créer le modèle graphique
    à partir du modèle (DOMODEL)
    le projet envoyer le QSet de tous les modèles
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    """

    from graphModel import generateDotModels

#   El QSet viene con la lista de Ids
<<<<<<< HEAD
    if queryset.count() < 1:
        return {'success': False, 'message': 'No record selected'}

#   Envia el QSet con la lista de modelos,
    dotdata = generateDotModels(queryset)

#   Genera el archvivo dot
=======
#   Le QSet est livré avec une liste d'ID
    if queryset.count() != 1:
        return {'success': False, 'message': 'No record selected'}

#   Envia el QSet con la lista de modelos,
#   Envoyer QSet avec la liste des modèles,
    dotdata = generateDotModels(queryset)

#   Genera el archvivo .dot
#   Génère le fichier .dot
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    fileName = 'gm_' + slugify(queryset[0].code) + '.dot'
    fullPath = getFullPath(request, fileName)

    fo = open(fullPath, "wb")
    fo.write(dotdata.encode('utf-8'))
    fo.close()

    try:
        import pygraphviz
        fileNamePdf = fileName.replace('.dot', '.pdf')
        fullPathPdf = getFullPath(request, fileNamePdf)

        graph = pygraphviz.AGraph(fullPath)
        graph.layout(prog='dot')
        graph.draw(fullPathPdf, format='pdf')

        fileName = fileNamePdf
    except ImportError:
        pass

<<<<<<< HEAD
    return {'success': True, 'message': fileName,  'fileName': fileName}


def doAutoForeingEntity(modeladmin, request, queryset, parameters):
    """
    funcion para generar las entidades foraneas ( invitadas ) y definir
    su comportamiento en el grafico
    """

    if queryset.count() < 1:
        return {'success': False, 'message': 'No record selected'}
=======
    return {'success': True, 'message': fileName, 'fileName': fileName}
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    from modelActions import actionAutoForeingEntity

<<<<<<< HEAD
    return actionAutoForeingEntity(queryset)


# ----------------   Project

def doImportSchema(modeladmin, request, queryset, parameters):
    """
    funcion para Importar la def de una Db ( basado en inspectDb )
=======
# ----------------   Project

def doImportSchema(modeladmin, request, queryset, parameters):
    """
    funcion para Importar la def de una Db ( basado en inspectDb )
    def Importer fonction à un dB (basé sur inspectdb)
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    """

    from reverseDb import getDbSchemaDef

#   El QSet viene con la lista de Ids
<<<<<<< HEAD
=======
#   Le QSet est livré avec une liste d'ID
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    if queryset.count() != 1:
        return {'success': False, 'message': 'No record selected'}

    try:
        getDbSchemaDef(queryset[0], request)
#        from multiprocessing import Process
#        p = Process (target= getDbSchemaDef ,args=( queryset[0] , request ))
#        p.start()

#   Recorre los registros selccionados
<<<<<<< HEAD
=======
#   Parcourir les dossiers sélectionnés
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    except Exception as e:
        traceback.print_exc()
        return {'success': False, 'message': 'Load error'}
        pass

    return {'success': True, 'message': 'running ...'}
<<<<<<< HEAD


# ----------------   Entity


def doEntityChangeModel(modeladmin, request, queryset, parameters):
    """
    funcion para cambiar el model de una entidad
    """

    from entityActions import doEttyChangeModel

#   El QSet viene con la lista de Ids
    if queryset.count() < 1:
        return {'success': False, 'message': 'Multiple selection required'}

    if len(parameters) != 1:
        return {'success': False, 'message': 'ViewName required!!'}

    return doEttyChangeModel(request,  queryset, parameters)
=======
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
