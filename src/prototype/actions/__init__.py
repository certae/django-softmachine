# -*- coding: utf-8 -*-

import traceback

from protoLib.utilsBase import slugify
from protoLib.downloadFile import getFullPath

from viewDefinition import getViewDefinition, getViewCode, getEntities


def doModelPrototype(modeladmin, request, queryset, parameters):
    """
    funcion para crear el prototipo sobre 'protoTable' con la definicion del diccionario
    a partir de Model
    """

#   El QSet viene con la lista de Ids
    if queryset.count() == 0:
        return {'success': False, 'message': 'No record selected'}

#   Mensaje de retorno
    returnMsg = ''

#   Recorre los registros selccionados
    for pModel in queryset:
        returnTmp = getEntities(pModel.entity_set.all(), request, None)
        returnMsg += 'Model : ' + pModel.code + ' Entts: ' + returnTmp + '; '

    return {'success': True, 'message': returnMsg}


def doEntityPrototype(modeladmin, request, queryset, parameters):

#   El QSet viene con la lista de Ids
    if queryset.count() != 1:
        return {'success': False, 'message': 'No record selected'}

    if len(parameters) != 1:
        return {'success': False, 'message': 'ViewName required!!'}

#   Recorre los registros selccionados
    returnTmp = 'Entt: ' + getEntities(queryset, request, parameters[0]['value'])
    return {'success': True, 'message': returnTmp}


def doPropertyModelJoin(modeladmin, request, queryset, parameters):
    """
    funcion para unir dos propertyModel
    """

    from propModelJoin import doPropModelJoin

#   El QSet viene con la lista de Ids
    if queryset.count() < 2:
        return {'success': False, 'message': 'Multiple selection required'}

    return doPropModelJoin(queryset)


# -----------  Models

def doModelGraph(modeladmin, request, queryset, parameters):
    """
    funcion para crear el modelo grafico
    a partir de Model ( doModel )
    el proyecto enviara la el QSet de todos los modelos
    """

    from graphModel import generateDotModels

#   El QSet viene con la lista de Ids
    if queryset.count() != 1:
        return {'success': False, 'message': 'No record selected'}

#   Envia el QSet con la lista de modelos,
    dotdata = generateDotModels(queryset)

#   Genera el archvivo dot
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

    return {'success': True, 'message': fileName, 'fileName': fileName}


# ----------------   Project

def doImportSchema(modeladmin, request, queryset, parameters):
    """
    funcion para Importar la def de una Db ( basado en inspectDb )
    """

    from reverseDb import getDbSchemaDef

#   El QSet viene con la lista de Ids
    if queryset.count() != 1:
        return {'success': False, 'message': 'No record selected'}

    try:
        getDbSchemaDef(queryset[0], request)
#        from multiprocessing import Process
#        p = Process (target= getDbSchemaDef ,args=( queryset[0] , request ))
#        p.start()

#   Recorre los registros selccionados
    except Exception as e:
        traceback.print_exc()
        return {'success': False, 'message': 'Load error'}
        pass

    return {'success': True, 'message': 'running ...'}
