# -*- coding: utf-8 -*-


# from django.db import models
# from protoField import TypeEquivalence

from django.http import HttpResponse
<<<<<<< HEAD
=======
from django.contrib.admin.util import get_fields_from_path
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
from django.utils.encoding import smart_str

<<<<<<< HEAD
from utilsBase import JSONEncoder, getReadableError
from utilsBase import verifyStr, verifyList, list2dict
# from utilsConvert import getTypedValue

from protoQbe import addQbeFilter
from protoAuth import getUserProfile, getModelPermissions

from usrDefProps import verifyUdpDefinition, readUdps
from models import getDjangoModel

from utilsWeb import doReturn
from utilsBase import slugify
=======
from protoLib.utilsBase import JSONEncoder, getReadableError
from protoLib.utilsBase import verifyStr, verifyList, list2dict
from protoLib.utilsConvert import getTypedValue

from protoLib.protoQbe import getSearcheableFields, getQbeStmt
from protoLib.protoAuth import getUserProfile, getModelPermissions

from protoLib.usrDefProps import verifyUdpDefinition, readUdps
from protoLib.protoField import TypeEquivalence
from protoLib.models import getDjangoModel

from protoLib.utilsWeb import doReturn
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

import django.utils.simplejson as json
import traceback

from django.utils.html import escape


def protoList(request):
<<<<<<< HEAD
#   Vista simple para cargar la informacion,

=======
#   Vista simple para cargar la informacion
#   Simple vue pour charger les informations
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    PAGESIZE = 50
    message = ''

    if not request.user.is_authenticated():
        return doReturn({'success': False, 'message': 'readOnly User'})

    if request.method != 'POST':
        return doReturn({'success': False, 'message': 'invalid message'})

<<<<<<< HEAD
# Los objetos vienen textoJson y hay q hacer el load para construirlos
# como objetos.
    protoMeta = request.POST.get('protoMeta', '')
    protoMeta = json.loads(protoMeta)

#
=======
#   Los objetos vienen textoJson y hay q hacer el load para construirlos como objetos.
#   Objets de texte JSON et il ya q font le chargeur pour les construire comme des objets.
    protoMeta = request.POST.get('protoMeta', '')
    protoMeta = json.loads(protoMeta)

>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    protoFilter = request.POST.get('protoFilter', '')
    baseFilter = request.POST.get('baseFilter', '')
    sort = request.POST.get('sort', '')

    start = int(request.POST.get('start', 0))
    page = int(request.POST.get('page', 1))
    limit = int(request.POST.get('limit', PAGESIZE))

#   Obtiene las filas del modelo
<<<<<<< HEAD
    PrepareMeta2Load(protoMeta)
    Qs, orderBy, fakeId = getQSet(
        protoMeta, protoFilter, baseFilter, sort, request.user)
    pRowsCount = Qs.count()

#   Fix: Cuando esta en la pagina el filtro continua en la pagina 2 y no muestra nada.
=======
#   Obtenir le rang de modèle
    Qs, orderBy, fakeId = getQSet(protoMeta, protoFilter, baseFilter, sort, request.user)  # Ici
    pRowsCount = Qs.count()

#   Fix: Cuando esta en la pagina el filtro continua en la pagina 2 y no muestra nada.
#   Correction: Lorsque le filtre à la page suivante à la page 2 et ne montre rien.
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
#   if ( ( page -1 ) *limit >= pRowsCount ): page = 1

    if orderBy:
        try:
            Qs = Qs.order_by(*orderBy)
        except:
            pass

<<<<<<< HEAD
    if len(protoMeta['relZooms']) > 0:
        Qs = Qs.prefetch_related(*protoMeta['relZooms'])

    dataRows = Qs.all()[start: page * limit]

    try:
        pList = Q2Dict(protoMeta, dataRows, fakeId)
        bResult = True
    except Exception,  e:
=======
    pRows = Qs.all()[start: page*limit]

#   Prepara las cols del Query
    try:
        #TODO: improve performance
        pList = Q2Dict(protoMeta, pRows, fakeId)
        bResult = True
    except Exception as e:
        print('Caught exception')
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        traceback.print_exc()
        message = getReadableError(e)
        bResult = False
        pList = []

    context = json.dumps({
        'success': bResult,
        'message': message,
        'totalCount': pRowsCount,
        'filter': protoFilter,
        'rows': pList,
<<<<<<< HEAD
    }, cls=JSONEncoder)
=======
    },
        cls=JSONEncoder
    )
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    return HttpResponse(context, mimetype="application/json")


# Obtiene el diccionario basado en el Query Set
<<<<<<< HEAD
def Q2Dict(protoMeta, dataRows, fakeId):
=======
def Q2Dict(protoMeta, pRows, fakeId):
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    """
        return the row list from given queryset
    """

#    pStyle = protoMeta.get( 'pciStyle', '')
<<<<<<< HEAD
    rows = []

    if protoMeta['jsonField']:
        jsonPrefix = protoMeta['jsonField'] + '__'
    else:
        jsonPrefix = ''
    jPrefLen = len(jsonPrefix)

    #   Esta forma permite agregar las funciones entre ellas el __unicode__
    rowId = 0
    for dataReg in dataRows:
        rowId += 1

        # Obtiene los campos base
        rowdict = {
            k: v for k, v in dataReg.__dict__.iteritems() if k in protoMeta['fBase']}
        rows.append(rowdict)

        # se asegura q tenga un id
        if fakeId:
            rowdict['id'] = rowId
        elif 'id' not in protoMeta['fBase']:
            rowdict['id'] = dataReg.pk

        # str
        if protoMeta['getStr']:
            try:
                val = dataReg.__str__()
#                val = eval("'{0}'.format( rowdict['code']) ")
            except:
                val = '__str#' + verifyStr(dataReg.pk, '?')
            rowdict['__str__'] = val

        for fName in protoMeta['fZooms']:
            val = getattr(dataReg, fName,  fName + '?')
            rowdict[fName] = verifyStr(val, '')
=======
    JsonField = protoMeta.get('jsonField', '')
    if not isinstance(JsonField, (str, unicode)):
        JsonField = ''

    pUDP = protoMeta.get('usrDefProps', {})
    cUDP = verifyUdpDefinition(pUDP)
    rows = []

    # Tablas de zoom para absorcion de campos
    relModels = {}

    # Identifica las Udps para solo leer las definidas en la META
    if cUDP.udpTable:
        udpTypes = {}
        udpList = []
        for lField in protoMeta['fields']:
            fName = lField['name']
            if fName.startswith(cUDP.propertyPrefix + '__'):
                udpList.append(fName)
                udpTypes[fName] = lField['type']

    # Alimenta la coleccion de zooms, por cada campo pues hay q hacer un select para esto
    for lField in protoMeta['fields']:
        fName = lField['name']
        myZoomModel = lField.get('zoomModel', '')
        if (len(myZoomModel) > 0) and (myZoomModel != protoMeta['viewEntity']):
            relModels[fName] = {'zoomModel': myZoomModel, 'fkId': lField.get('fkId', ''), 'loaded': False}

    # Verifica si existen reemplazos por hacer ( cpFromField )
    # 1.  Marca los zooms q estan referenciados
    bCopyFromFld = False
    for lField in protoMeta['fields']:
        fName = lField['name']
        if (lField.get('cpFromField') is None or lField.get('cpFromZoom') is None):
            continue
        bCopyFromFld = True

        # Marca el campo
        lField['isAbsorbed'] = True

        # Marca el zoom
        try:
            relModel = relModels[lField.get('cpFromZoom')]
            relModel['loaded'] = True
        except:
            pass

    # 2.  borra los q no tienen marca
    for relName in relModels.keys():
        relModel = relModels[relName]
        if not relModel['loaded']:
            del relModels[relName]

    #   Esta forma permite agregar las funciones entre ellas el __unicode__
    rowId = 0
    for rowData in pRows:
        rowId += 1
        rowdict = {}

        # limpia los datos de tablas relacionadas
        for relName in relModels:
            relModel = relModels[relName]
            relModel['rowData'] = {}
            relModel['loaded'] = False

        # recorre los campos para obtener su valor
        for lField in protoMeta['fields']:
            fName = lField['name']
            pName = lField.get('physicalName', fName)

            if lField.get('crudType') == "screenOnly":
                continue

            # UDP Se evaluan despues
            if cUDP.udpTable and fName.startswith(cUDP.propertyPrefix + '__'):
                continue

            # N2N
            elif (lField['type'] == 'protoN2N'):
                try:
                    val = list(rowData.__getattribute__(fName).values_list())
                except:
                    val = '[]'
                rowdict[fName] = val
                continue

            # Si el campo es absorbido ( bCopyFromFld es un shortcut para evitar la evulacion en caso de q no haya ningun cpFromField )
            elif bCopyFromFld and isAbsorbedField(lField, protoMeta):
                continue

            rowdict[fName] = getFieldValue(pName, lField['type'], rowData, JsonField)

        if cUDP.udpTable:
            # rowDict : se actualizara con los datos de la UDP
            # rowData es el registro de base, en caso de q sea un MD la lectura es automatica rowData.udpTable...
            # udpTypes  : lista de Udps a leer
            readUdps(rowdict, rowData, cUDP, udpList, udpTypes)

        # Realiza la absorcion de datos provenientes de un zoom
        if bCopyFromFld:
            rowdict = copyValuesFromFields(protoMeta, rowdict, relModels, JsonField)
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

        for fName in protoMeta['fRels']:
            try:
                val = eval('dataReg.' + fName.replace('__', '.'))
            except:
                val = fName + '?'
            rowdict[fName] = verifyStr(val, '')

<<<<<<< HEAD
        # @   Evalua una funcion del modelo  ( dataReg.function )
        # @@  TODO: evalua una funcion almacenada
        for fName, pName in protoMeta['fEvals']:
            rowdict[fName] = evalueFuncion(pName, dataReg)

        for fName in protoMeta['n2n']:
            try:
                val = list(dataReg.__getattribute__(fName).values_list())
            except:
                val = '[]'
            rowdict[fName] = val

        if protoMeta['jsonField']:
            try:
                jDoc = getattr(dataReg, protoMeta['jsonField'], {})
                for fName in protoMeta['fJson']:
                    val = jDoc.get(fName[jPrefLen:])
                    # val = getTypedValue( val, fType )
                    rowdict[fName] = val
            except:
                pass

        if protoMeta['udps']:
            readUdps(rowdict, dataReg, protoMeta['cUDP'], protoMeta[
                     'udpList'],  protoMeta['udpTypes'])

        # construye un cache de los zooms invocados ( prototype )
        for relName in protoMeta['relModels']:
            relModel = protoMeta['relModels'][relName]

            # Obtiene el id
            relFKey = relModel.get('fkId', '')
            relId = rowdict.get(relFKey,  None)
            if relId is None:
                continue

            # Obtiene la fila
            relRow = relModel['rows'].get(relId, None)
            if relRow is None:
                relRow = getRowById(relModel['zoomModel'], relId)
                relModel['rows'][relId] = relRow
                relModel['currentRow'] = relRow
            else:
                relModel['currentRow'] = relRow

        # Realiza la absorcion de datos provenientes de un zoom
        for fName in protoMeta['fCopys']:

            # Verificar si hay un dict
            lField = protoMeta['fieldsDict'][fName]

            # Solo los campos son slugify, los modelos no
            cpFromField = slugify(lField.get('cpFromField'))
            cpFromZoom = lField.get('cpFromZoom', '')

            if len(cpFromZoom) == 0:
                # Es un copy q puede ser resuelto a partir del modelo objeto
                # esta es la situacion normal cuando no se idetifica un modelo y se cargan los datos por jerarquia
                # se requiere q el campo este precargado en el modelo

                # Se uso para copiar de discretas,  respeta el vr por defecto
                # el vr en el campo
                val = rowdict.get(fName, '')
                if smart_str(val).__len__() > 0:
                    continue

                rowdict[fName] = rowdict.get(cpFromField, '')

            else:

                # Esta es la situacion de los prototipos q requieren el cpFromZoom,
                # se toman los datos del cache
                try:
                    relModel = protoMeta['relModels'][cpFromZoom]
                except:
                    continue

                zoomReg = relModel['currentRow']
                if zoomReg:
                    if cpFromField.startswith(jsonPrefix):
                        try:
                            jDoc = getattr(
                                zoomReg, protoMeta['jsonField'], {})
                            val = jDoc.get(cpFromField[jPrefLen:])
                            rowdict[fName] = val
                        except:
                            pass
                    else:
                        rowdict[fName] = getattr(zoomReg, cpFromField,  '')

#        if pStyle == 'tree':
#            rowdict[ 'viewEntity' ] = protoMeta.get('viewEntity', '')
#            rowdict[ 'leaf' ] = False; rowdict[ 'children' ] = []

    return rows


def getRowById(myModelName, myId):
    """ Retorna un registro dado un modelo y un id
    """
    model = getDjangoModel(myModelName)
    myQs = model.objects.filter(pk=myId)
    if len(myQs) > 0:
        return myQs[0]
    else:
        return None


def getUserNodes(pUser, viewEntity):
    userProfile = getUserProfile(pUser, 'list', viewEntity)
    userNodes = userProfile.userTree.split(',')

=======
        # Agrega el Id Siempre como idInterno ( no representa una col, idProperty )
        rowdict['id'] = rowData.pk
        if fakeId:
            rowdict['id'] = rowId

        # Agrega la fila al diccionario
        rows.append(rowdict)

    return rows


def getRowById(myModelName, myId):

    """
    Retorna un registro dado un modelo y un id
    """

#   Obtiene los datos
    model = getDjangoModel(myModelName)
    myList = model.objects.filter(pk=myId)
    if len(myList) > 0:
        return myList[0]
    else:
        return None


def isAbsorbedField(lField, protoMeta):

    """ Determina si el campo es heredado de un zoom,
    Pueden existir herencias q no tienen modelo, estas se manejar directamente por el ORM
    Las herencias manejadas aqui son las q implican un select adicional al otro registro,
    utilizan la logica del zoom para traer la llave correspondiente
    """

    # Si esta marcado lo retorna
    if (lField.get('isAbsorbed', False)):
        return True
    return False


def copyValuesFromFields(protoMeta, rowdict, relModels, JsonField):

    """
    Permite copiar campos q vienen de los zooms,
    En el caso de prototipos hace un select a la instancia relacionada
    """

    for lField in protoMeta['fields']:
        cpFromField = lField.get('cpFromField')
        if not cpFromField:
            continue

        fName = smart_str(lField['name'])
        cpFromField = smart_str(cpFromField)

        if not isAbsorbedField(lField, protoMeta):
            # Es un copy q puede ser resuelto a partir del modelo objeto
            # esta es la situacion normal cuando no se idetifica un modelo y se cargan los datos por jerarquia
            # por ahora requiere q el campo este tambien en el modelo ( se puede cambiar si hay la necesidad )

            # Se uso para copiar cosas de discretas,  debia poner por defecto el vr en el campo
            # Si ya contiene algun valor, sale, solo copia cuando es nulo.
            val = rowdict.get(fName, None)
            if (val) and smart_str(val).__len__() > 0:
                continue

            val = rowdict.get(cpFromField, None)
            if (val is None):
                val = ''

        else:
            # Esta es la situacion de los prototipos q requieren el cpFromZoom,
            # se hace un select adicional para obtner el registro relacionado

            cpFromZoom = lField.get('cpFromZoom')

            try:
                relModel = relModels[cpFromZoom]
            except:
                # para envitar volverlo a leer, si son varios campos del mismo registro
                relModel = {'loaded': True, 'rowData': None}

            if not relModel['loaded']:
                # Obtiene el id
                rowId = rowdict[relModel['fkId']]
                relModel['rowData'] = getRowById(relModel['zoomModel'], rowId)
                relModel['loaded'] = True

            rowData = relModel['rowData']
            if rowData is not None:
                # interpreta los datos del registro
                val = getFieldValue(cpFromField, lField['type'], rowData, JsonField)
            else:
                val = ''

        rowdict[fName] = val

    return rowdict


def getUserNodes(pUser, viewEntity):

    userProfile = getUserProfile(pUser, 'list', viewEntity)
    userNodes = userProfile.userTree.split(',')

>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    return userNodes


def getQSet(protoMeta, protoFilter, baseFilter, sort, pUser):

#   Decodifica los eltos
    viewEntity = protoMeta.get('viewEntity', '')
    model = getDjangoModel(viewEntity)

#   Autentica '
    if not getModelPermissions(pUser, model, 'list'):
        return model.objects.none(), [], False

#   modelo Administrado
    isProtoModel = hasattr(model, '_protoObj')
    if isProtoModel:
        userNodes = getUserNodes(pUser, viewEntity)

#   JsonField
    JsonField = protoMeta.get('jsonField', '')
    if not isinstance(JsonField, (str, unicode)):
        JsonField = ''

#   QSEt
    Qs = model.objects

#   Filtros por seguridad ( debe ser siempre a nivel de grupo )
    if isProtoModel and not pUser.is_superuser:
<<<<<<< HEAD
# Qs = Qs.filter( Q( smOwningTeam__in = userNodes ) | Q( smOwningUser =
# pUser  ) )
        Qs = Qs.filter(smOwningTeam__in=userNodes)

#   FIX??  Le pega la meta al modelo para tomar por ejemplo searchFields
=======
#       Qs = Qs.filter( Q( smOwningTeam__in = userNodes ) | Q( smOwningUser = pUser  ) )
        Qs = Qs.filter(smOwningTeam__in=userNodes)

#   TODO: Agregar solomente los campos definidos en el safeMeta  ( only,  o defer )
#   Qs.query.select_fields = [f1, f2, .... ]

#   Le pega la meta al modelo para tomar por ejemplo searchFields
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    model.protoMeta = protoMeta

#   El filtro base viene en la configuracion MD
    try:
        Qs = addQbeFilter(baseFilter, model, Qs, JsonField)
    except Exception as e:
        traceback.print_exc()
        getReadableError(e)

#   Order by
    localSort = protoMeta.get('localSort', False)
    orderBy = []
    if not localSort:
        sort = verifyList(sort)
        for sField in sort:

            # Verificar que el campo de sort haga parte de los campos del modelo
<<<<<<< HEAD
            # blacklist = [f.name for f in instance._meta.fields] + ['id',
            # 'user']
=======
            # blacklist = [f.name for f in instance._meta.fields] + ['id', 'user']
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

            # Unicode sort
            if sField['property'] == '__str__':
                unicodeSort = getUnicodeFields(model)
                for sAux in unicodeSort:
                    if sField['direction'] == 'DESC':
                        sAux = '-' + sAux
                    orderBy.append(sAux)

            else:
                if sField['direction'] == 'DESC':
                    sField['property'] = '-' + sField['property']
                orderBy.append(sField['property'])

    orderBy = tuple(orderBy)

    try:
        Qs = addQbeFilter(protoFilter, model, Qs, JsonField)
    except Exception as e:
        traceback.print_exc()
        getReadableError(e)

    # DbFirst en caso de q no exista una llave primaria
    fakeId = hasattr(model, '_fakeId')

    return Qs, orderBy, fakeId


def getUnicodeFields(model):
<<<<<<< HEAD
    unicodeSort = ()
    # TODO: Se debe redefinir para cargarse en la meta
#    if hasattr( model , 'unicode_sort' ):
#        unicodeSort = model.unicode_sort
#    elif hasattr( model._meta , 'unique_together' ):
#        unicodeSort = model._meta.unique_together[0]
    return unicodeSort


def evalueFuncion(fName, dataReg):
    """ para evaluar las funciones @  declaradas en el modelo
    """
    try:
        expr = 'dataReg.' + fName[1:]
        val = eval(expr)
        val = verifyStr(val, '')
    except:
        val = fName + '?'
    return val


def PrepareMeta2Load(protoMeta):
    """IDenfifica los typos de campos para optimizar la carga de datos
    """

    # Nombre de la entidad de trabajo
    viewEntity = protoMeta['viewEntity']

    protoMeta['fieldsDict'] = list2dict(protoMeta['fields'], 'name')
=======

    unicodeSort = ()
    if hasattr(model, 'unicode_sort'):
        unicodeSort = model.unicode_sort
    elif hasattr(model._meta, 'unique_together'):
        unicodeSort = model._meta.unique_together[0]
    return unicodeSort


def addQbeFilter(protoFilter, model, Qs, JsonField):

    # No hay criterios
    if len(protoFilter) == 0:
        return Qs

    protoFilter = verifyList(protoFilter)

    for sFilter in protoFilter:

        if sFilter['property'] == '_allCols':
            # debe descomponer la busqueda usando el objeto Q
            QTmp = getTextSearch(sFilter, model, JsonField)
            if QTmp is None:
                QTmp = models.Q()

            try:
                Qs = Qs.filter(QTmp)
            except:
                traceback.print_exc()

        else:
            # Los campos simples se filtran directamente, se require para el JSonField
            QTmp = addQbeFilterStmt(sFilter, model, JsonField)
            QTmp = dict((x, y) for x, y in QTmp.children)
            try:
                Qs = Qs.filter(**QTmp)
            except:
                traceback.print_exc()
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    pUDP = protoMeta.get('usrDefProps', {})
    cUDP = verifyUdpDefinition(pUDP)

    # Identifica las Udps para solo leer las definidas en la META
    # Verificar el modulo  Django-EAV
    if cUDP.udpTable:
        udpTypes = {}
        udpList = []
        for lField in protoMeta['fields']:
            fName = lField['name']
            if fName.startswith(cUDP.propertyPrefix + '__'):
                udpList.append(fName)
                udpTypes[fName] = lField['type']
        protoMeta['udpList'] = udpList
        protoMeta['udpTypes'] = udpTypes
        protoMeta['udpClass'] = cUDP
        protoMeta['udps'] = True
    else:
        protoMeta['udps'] = False
        protoMeta['udpClass'] = None

<<<<<<< HEAD
    # Alimenta la coleccion de zooms, por cada campo pues hay q hacer un select para esto
    # Determina el tipo de campo para no estar haciendo verificacion en todos
    # lados
    protoMeta['getStr'] = False

    JsonField = protoMeta.get('jsonField', '')
    if len(JsonField) == 0:
        protoMeta['jsonField'] = False
    else:
        protoMeta['jsonField'] = JsonField

    protoMeta['fBase'] = []
        # directos de la Db ( solo se aplican los valores )
    protoMeta['fZooms'] = []     # el __str__ del fk
    protoMeta['fRels'] = []      # provenientes de un fk ( __ , . )
    protoMeta['fJson'] = []      # sub campos en un doc json
    protoMeta['fEvals'] = []     # calculados python
    protoMeta['fCopys'] = []     # Copiados ( necesario en prototypos )
    protoMeta['n2n'] = []
        # lista relacionada, esto se debe cargar en un objeto aparte

    protoMeta['relZooms'] = []   # los zooms a los q debe hacer prefetch
    protoMeta['relModels'] = {}
        # los zooms a los q debe llamar manualmente ( prototipos )

    for lField in protoMeta['fields']:
        """"el manejo de physical name permite definir funciones,
            por ejemplo la redefinicion de un _str__ o
            calculos en el backEnd
        """
        fName = lField['name']
        pName = lField.get('pyEval', '')

        myZoomModel = lField.get('zoomModel', '')

        if (len(myZoomModel) > 0) and (myZoomModel != viewEntity):
            # por q debe ser diferente del viewEntity, podria ser una autoreferencia, acaso viene cargada sin ser un zoom
            # Dgt! los cellZoom usan el zoomModel ( _str_ )
            protoMeta['relModels'][fName] = {
                'zoomModel': myZoomModel,
                'fkId': lField.get('fkId', ''),
                'loaded': False}

        # Separar los tipos de campo para evaluacion
        # ------------------------------------------------------
        if lField.get('crudType') == "screenOnly":
            pass

        elif (lField['type'] == 'protoN2N'):
            pass

        elif (fName == JsonField):
            pass

        elif (fName == '__str__'):
            if not pName.startswith('@'):
                protoMeta['getStr'] = True
=======
def addQbeFilterStmt(sFilter, model, JsonField):

    """ Verifica casos especiales y obtiene el QStmt
        retorna un objeto Q
    """
    fieldName = sFilter['property'].replace('.', '__')

    if fieldName.endswith('__pk') or fieldName.endswith('_id') or fieldName == 'pk':
        # Los id por ahora son numericos
        sType = 'int'

    elif fieldName == '__str__':
        # El campo especial __str__ debe ser descompuesto en los seachFields en forma explicita
        return Q()

    elif fieldName.startswith(JsonField + '__'):
        sType = 'string'

    else:
        try:
            # Obtiene el tipo de dato, si no existe la col retorna elimina la condicion
            field = get_fields_from_path(model, fieldName)[-1]
            sType = TypeEquivalence.get(field.__class__.__name__, 'string')
        except:
            return Q()

    QStmt = getQbeStmt(fieldName, sFilter['filterStmt'], sType)

    return QStmt


def getTextSearch(sFilter, model, JsonField):

    #   Busqueda Textual ( no viene con ningun tipo de formato solo el texto a buscar
    #   Si no trae nada deja el Qs con el filtro de base
    #   Si trae algo y comienza por  "{" trae la estructura del filtro

    # Si solo viene el texto, se podria tomar la "lista" de campos "mostrados"
    # ya los campos q veo deben coincidir con el criterio, q pasa con los __str__ ??
    # Se busca sobre los campos del combo ( filtrables  )

    QStmt = None

    try:
        pSearchFields = model.protoMeta['gridConfig']['searchFields']
        fieldsDict = list2dict(model.protoMeta['fields'], 'name')
    except:
        pSearchFields = getSearcheableFields(model)
        fieldsDict = {}

    for fName in pSearchFields:
        fAux = fieldsDict.get(fName, {})
        if fAux.get('type', '') not in ['string', 'text', 'jsonfield']:
            continue

        QTmp = addQbeFilterStmt({'property': fName, 'filterStmt': sFilter['filterStmt']}, model, JsonField)

        if QStmt is None:
            QStmt = QTmp
        else:
            QStmt = QStmt | QTmp

    return QStmt


def getFieldValue(fName, fType, rowData, JsonField):

    #Es una funcion
    if (fName == '__str__'):
        try:
            val = eval('rowData.__str__()')
            val = verifyStr(val, '')
        except:
            val = 'Id#' + verifyStr(rowData.pk, '?')

    elif fName.startswith('@'):
        val = evalueFuncion(fName, rowData)

    elif (fName == JsonField):
        # Master JSonField ( se carga texto )
        try:
            val = rowData.__getattribute__(fName)
        except:
            val = {}
        if isinstance(val, dict):
            val = json.dumps(val, cls=JSONEncoder)

    elif fName.startswith(JsonField + '__'):
        # JSon fields
        try:
            val = rowData.__getattribute__(JsonField)
            val = val.get(fName[len(JsonField + '__'):])
            val = getTypedValue(val, fType)

        except:
            val = ''

    elif ('__' in fName):
        # Campo Absorbido modo objeto
        try:
            val = eval('rowData.' + fName.replace('__', '.'))
            val = verifyStr(val, '')
        except:
            val = '__?'

    # Campo del modelo
    else:
        try:
            val = getattr(rowData, fName)
            # Si es una referencia ( fk ) es del tipo model
            if isinstance(val, models.Model):
                val = verifyStr(val, '')
        except:
            val = 'vr?'

        # Evita el valor null en el el frontEnd
        if val is None:
            val = ''

    return val
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

        elif fName.startswith(JsonField + '__'):
            protoMeta['fJson'].append(fName)

<<<<<<< HEAD
        elif lField['type'] == 'foreigntext':
            protoMeta['fZooms'].append(fName)
            # No aplica para  prototypos
            if not viewEntity.startswith('prototype.ProtoTable'):
                protoMeta['relZooms'].append(fName)

        elif ('__' in fName or '.' in fName):
            protoMeta['fRels'].append(fName)

        else:
            protoMeta['fBase'].append(fName)

        # cp from field ( respeta el default )
        if len(lField.get('cpFromField', '')) > 0:
            protoMeta['fCopys'].append(fName)

        # phisicalName
        if pName.startswith('@'):
            protoMeta['fEvals'].append((fName, pName))

    # Verifica si existen reemplazos por hacer ( cpFromField )
    # 1.  Marca los zooms q estan referenciados
    for lField in protoMeta['fields']:
        fName = lField['name']
        if (lField.get('cpFromField') is None or lField.get('cpFromZoom') is None):
            continue
        try:
            relModel = protoMeta['relModels'][lField.get('cpFromZoom')]
            relModel['loaded'] = True
        except:
            pass

    # 2.  borra los q no tienen marca pues no se usan
    for relName in protoMeta['relModels'].keys():
        relModel = protoMeta['relModels'][relName]
        if not relModel['loaded']:
            del protoMeta['relModels'][relName]
        else:
            relModel['rows'] = {}
=======
def evalueFuncion(fName, rowData):

    """ para evaluar las funciones @  declaradas en el modelo
    """

    # obtener el titulo y los parametros y enviar la tupla

    try:
        expr = 'rowData.' + fName[1:]
        val = eval(expr)
        val = verifyStr(val, '')
    except:
        val = fName + '?'

    return val
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
