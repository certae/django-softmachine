# -*- coding: utf-8 -*-

from django.db import models
from django.http import HttpResponse
from django.contrib.admin.util import  get_fields_from_path
from django.utils.encoding import smart_str
from django.db.models import Q

from utilsBase import JSONEncoder, getReadableError
from utilsBase import verifyStr, verifyList, list2dict
from utilsConvert import getTypedValue

from protoQbe import getSearcheableFields, getQbeStmt
from protoAuth import  getModelPermissions, getUserNodes

from usrDefProps import verifyUdpDefinition, readUdps
from protoField import TypeEquivalence
from models import getDjangoModel

from utilsWeb import doReturn

import json
import traceback


REFONLY = 'REF_ONLY'

def protoList(request):
#   Vista simple para cargar la informacion,

    PAGESIZE = 50
    message = ''

    if not request.user or not request.user.is_authenticated():
        return doReturn ({'success':False , 'message' : 'readOnly User'})

    if request.method != 'POST':
        return doReturn ({'success':False, 'message' : 'invalid message'})

#   Los objetos vienen textoJson y hay q hacer el load para construirlos como objetos.
    protoMeta = request.POST.get('protoMeta', '')
    protoMeta = json.loads(protoMeta)

#
    protoFilter = request.POST.get('protoFilter', '')
    baseFilter = request.POST.get('baseFilter', '')
    sort = request.POST.get('sort', '')

    start = int(request.POST.get('start', 0))
    page = int(request.POST.get('page', 1))
    limit = int(request.POST.get('limit', PAGESIZE))


#   Obtiene las filas del modelo
    Qs, orderBy, fakeId, refAllow = getQSet(protoMeta, protoFilter, baseFilter , sort , request.user)
    pRowsCount = Qs.count()


#   Fix: Cuando esta en la pagina el filtro continua en la pagina 2 y no muestra nada.
#   if ( ( page -1 ) *limit >= pRowsCount ): page = 1

#   En el sitio en produccion, el pRows pasaba sin asignar; no entiendo el porq?
    if orderBy:
        try:
            pRows = Qs.order_by(*orderBy)[ start: page * limit ]
        except:
            pRows = Qs.all()[ start: page * limit ]
    else: 
        pRows = Qs.all()[ start: page * limit ]


    # Verifica los nodos validos 
    if refAllow: 
        userNodes = getUserNodes(request.user, protoMeta.get('viewEntity', ''))
    else: 
        userNodes = []

#   Prepara las cols del Query
    try:
        # TODO: improve performance
        pList = Q2Dict(protoMeta , pRows, fakeId, userNodes)
        bResult = True
    except Exception, e:
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
            }, cls=JSONEncoder)


    return HttpResponse(context, content_type="application/json")



# Obtiene el diccionario basado en el Query Set
def Q2Dict (protoMeta, pRows, fakeId, userNodes=[]):
    """
        userNodes : Para el manejo de refAllow : contiene los Id de los teams validos  
        return the row list from given queryset
    """

#    pStyle = protoMeta.get( 'pciStyle', '')
    JsonField = protoMeta.get('jsonField', '')
    if not isinstance(JsonField, (str, unicode)): 
        JsonField = ''

    pUDP = protoMeta.get('usrDefProps', {})
    cUDP = verifyUdpDefinition(pUDP)
    rows = []

    # Tablas de zoom para absorcion de campos
    relModels = {}

    # Identifica las Udps para solo leer las definidas en la META
    if cUDP.udpTable :
        udpTypes = {} 
        udpList = []
        for lField  in protoMeta['fields']:
            fName = lField['name']
            if fName.startswith(cUDP.propertyPrefix + '__'):
                udpList.append(fName)
                udpTypes[ fName ] = lField['type']


    # Alimenta la coleccion de zooms, por cada campo pues hay q hacer un select para esto
    for lField  in protoMeta['fields']:
        fName = lField['name']
        myZoomModel = lField.get('zoomModel', '')
        if (len(myZoomModel) > 0) and (myZoomModel != protoMeta['viewEntity']):
            relModels[ fName ] = { 'zoomModel' : myZoomModel, 'fkId' : lField.get('fkId', '') , 'loaded' : False }


    # Verifica si existen reemplazos por hacer ( cpFromField )
    # 1.  Marca los zooms q estan referenciados
    bCopyFromFld = False
    for lField  in protoMeta['fields']:
        fName = lField['name']
        if (lField.get('cpFromField') is None or lField.get('cpFromZoom') is None): 
            continue
        bCopyFromFld = True

        # Marca el campo
        lField[ 'isAbsorbed' ] = True

        # Marca el zoom
        try:
            relModel = relModels[ lField.get('cpFromZoom') ]
            relModel['loaded'] = True
        except: 
            pass


    # 2.  borra los q no tienen marca
    for relName in relModels.keys():
        relModel = relModels[ relName ]
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
            relModel[ 'rowData'] = {}
            relModel[ 'loaded'] = False

        # recorre los campos para obtener su valor
        for lField  in protoMeta['fields']:
            fName = lField['name']
            pName = lField.get('physicalName', fName)

            if lField.get('crudType') == "screenOnly" : 
                continue

            # UDP Se evaluan despues
            if cUDP.udpTable and fName.startswith(cUDP.propertyPrefix + '__'):
                continue

            elif (lField['type'] == 'protoN2N'):
                continue

            # Si el campo es absorbido ( bCopyFromFld es un shortcut para evitar la evulacion en caso de q no haya ningun cpFromField )
            elif bCopyFromFld and isAbsorbedField(lField, protoMeta) :
                continue

            rowdict[ fName ] = getFieldValue(pName, lField[ 'type'], rowData, JsonField)

        if cUDP.udpTable:
            # rowDict : se actualizara con los datos de la UDP
            # rowData es el registro de base, en caso de q sea un MD la lectura es automatica rowData.udpTable...
            # udpTypes  : lista de Udps a leer
            readUdps(rowdict, rowData , cUDP, udpList, udpTypes)


        # REaliza la absorcion de datos provenientes de un zoom
        if bCopyFromFld:
            rowdict = copyValuesFromFields(protoMeta, rowdict, relModels, JsonField)

#        Dont delete  ( Dgt ) 
#        if pStyle == 'tree':
#            rowdict[ 'viewEntity' ] = protoMeta.get('viewEntity', '')
#            rowdict[ 'leaf' ] = False; rowdict[ 'children' ] = []

        # Agrega el Id Siempre como idInterno ( no representa una col, idProperty )
        rowdict['id'] = rowData.pk
        if fakeId:
            rowdict['id'] = rowId


        # Verifica el refAllow 
        if len(userNodes) > 0  and  not (str(rowData.smOwningTeam_id) in userNodes) :
            rowdict['_ptStatus'] = REFONLY 
        
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


def isAbsorbedField(lField , protoMeta):
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

    for lField  in protoMeta['fields']:
        cpFromField = lField.get('cpFromField')
        if not cpFromField: 
            continue

        fName = smart_str(lField['name'])
        cpFromField = smart_str(cpFromField)

        if not isAbsorbedField(lField , protoMeta):
            # Es un copy q puede ser resuelto a partir del modelo objeto
            # esta es la situacion normal cuando no se idetifica un modelo y se cargan los datos por jerarquia
            # por ahora requiere q el campo este tambien en el modelo ( se puede cambiar si hay la necesidad )

            # Se uso para copiar cosas de discretas,  debia poner por defecto el vr en el campo
            # Si ya contiene algun valor, sale, solo copia cuando es nulo.
            val = rowdict.get(fName, None)
            if (val) and smart_str(val).__len__() > 0: 
                continue

            val = rowdict.get(cpFromField , None)
            if (val is None) : 
                val = ''

        else:
            # Esta es la situacion de los prototipos q requieren el cpFromZoom,
            # se hace un select adicional para obtner el registro relacionado

            cpFromZoom = lField.get('cpFromZoom')

            try:
                relModel = relModels[ cpFromZoom ]
            except:
                # para envitar volverlo a leer, si son varios campos del mismo registro
                relModel = { 'loaded': True, 'rowData' : None   }

            if not relModel['loaded']:
                # Obtiene el id
                rowId = rowdict[ relModel['fkId'] ]
                if rowId:
                    relModel['rowData'] = getRowById(relModel['zoomModel'], rowId)
                else:
                    relModel['rowData'] = None
                relModel['loaded'] = True

            rowData = relModel['rowData']
            if rowData is not None  :
                # interpreta los datos del registro
                val = getFieldValue(cpFromField, lField[ 'type'], rowData  , JsonField)
            else: 
                val = ''

        rowdict[ fName ] = val

    return rowdict


def getQSet(protoMeta, protoFilter, baseFilter , sort , pUser):

#   Decodifica los eltos
    viewEntity = protoMeta.get('viewEntity', '')
    model = getDjangoModel(viewEntity)

#   Autentica '
    if not getModelPermissions(pUser, model, 'list'):
        return model.objects.none(), [], False, False 

#   modelo Administrado
    isProtoModel = hasattr(model , '_protoObj')
    if isProtoModel:
        userNodes = getUserNodes(pUser, viewEntity)

#   WorkFlow Model 
    hasWFlow = hasattr(model , '_WorkFlow')
    if hasWFlow: 
        WFlowControl = getattr(model, '_WorkFlow', {})
        OkStatus = WFlowControl.get('OkStatus', 'Ok')
        
#   JsonField
    JsonField = protoMeta.get('jsonField', '')
    if not isinstance(JsonField, (str, unicode)): 
        JsonField = ''

#   QSEt
#   Qs = model.objects.select_related(depth=1)
    Qs = model.objects

#   Permite la lectura de todos los registros 
    refAllow = getModelPermissions(pUser, model, 'refallow')
    

#   Solamenete valida si es     
    if isProtoModel and not pUser.is_superuser :

        # Si no tiene wflow y tampoco permiso de referencia, se limita a los nodos de su equipo    
        if not refAllow :
            Qs = Qs.filter(smOwningTeam__in=userNodes)

        # Si tiene permiso de referencia y ademas WF, trae todos los propios o los demas en estado valido 
        elif hasWFlow:
            Qs = Qs.filter(Q(smOwningTeam__in=userNodes) | Q(~Q(smOwningTeam__in=userNodes) , Q(smWflowStatus=OkStatus))) 

#   TODO: Agregar solomente los campos definidos en el safeMeta  ( only,  o defer )
#   Qs.query.select_fields = [f1, f2, .... ]


#   Le pega la meta al modelo para tomar por ejemplo searchFields
    model.protoMeta = protoMeta

#   El filtro base viene en la configuracion MD
    try:
        Qs = addQbeFilter(baseFilter, model, Qs , JsonField)
    except Exception as e:
        traceback.print_exc()
        getReadableError(e)

#   Order by
    localSort = protoMeta.get('localSort', False)
    orderBy = []
    if not localSort :
        sort = verifyList(sort)
        for sField in sort:

            # Verificar que el campo de sort haga parte de los campos del modelo
            # blacklist = [f.name for f in instance._meta.fields] + ['id', 'user']

            # Unicode sort
            if sField['property'] == '__str__' :
                try:
                    unicodeSort = getUnicodeFields(model)
                    for sAux in unicodeSort:
                        if sField['direction'] == 'DESC': 
                            sAux = '-' + sAux
                        orderBy.append(sAux)
                except Exception as e:
                    pass 
                
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
    fakeId = hasattr(model , '_fakeId')

    # Solo retorna refAllow si este es valido para la tabla ( no es un super usuario y es un modelo manejado por sm )  
    refAllow = refAllow and isProtoModel and not pUser.is_superuser 

    return Qs, orderBy, fakeId, refAllow

def getUnicodeFields(model):
    unicodeSort = ()
    if hasattr(model , 'unicode_sort'):
        unicodeSort = model.unicode_sort
    elif hasattr(model._meta , 'unique_together') and len(model._meta.unique_together) > 0:
        unicodeSort = model._meta.unique_together[0]
    else: 
        unicodeSort = [ model._meta.pk.name, ]  

    return unicodeSort


def addQbeFilter(protoFilter, model, Qs, JsonField):

    # No hay criterios
    if len(protoFilter) == 0:
        return Qs

    protoFilter = verifyList(protoFilter)

    for sFilter in protoFilter:

        if sFilter[ 'property' ] == '_allCols':
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


    return Qs



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
        except :
            return Q()

    QStmt = getQbeStmt(fieldName , sFilter['filterStmt'], sType)

    return QStmt


def getTextSearch(sFilter, model , JsonField):

    #   Busqueda Textual ( no viene con ningun tipo de formato solo el texto a buscar
    #   Si no trae nada deja el Qs con el filtro de base
    #   Si trae algo y comienza por  "{" trae la estructura del filtro

    # Si solo viene el texto, se podria tomar la "lista" de campos "mostrados"
    # ya los campos q veo deben coincidir con el criterio, q pasa con los __str__ ??
    # Se busca sobre los campos del combo ( filtrables  )

    QStmt = None

    try:
        pSearchFields = model.protoMeta['gridConfig']['searchFields']
        fieldsDict = list2dict(model.protoMeta[ 'fields' ], 'name')
    except:
        pSearchFields = getSearcheableFields(model)
        fieldsDict = {}


    for fName in pSearchFields:
        fAux = fieldsDict.get(fName, {})
        if fAux.get('type', '')  not in [ 'string', 'text', 'jsonfield' ]: 
            continue

        QTmp = addQbeFilterStmt({'property': fName, 'filterStmt': sFilter['filterStmt'] } , model, JsonField)

        if QStmt is None:  
            QStmt = QTmp
        else: 
            QStmt = QStmt | QTmp

    return QStmt


def getFieldValue(fName, fType, rowData, JsonField):

    # Es una funcion
    if (fName == '__str__'):
        try:
            val = eval('rowData.__str__()')
            val = verifyStr(val , '')
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
            val = json.dumps(val , cls=JSONEncoder)

    elif fName.startswith(JsonField + '__'):
        # JSon fields
        try:
            val = rowData.__getattribute__(JsonField)
            val = val.get(fName[ len(JsonField + '__'):])
            val = getTypedValue(val, fType)

        except: 
            val = ''


    elif ('__' in fName):
        # Campo Absorbido modo objeto
        try:
            val = eval('rowData.' + fName.replace('__', '.'))
            val = verifyStr(val , '')
        except: 
            val = '__?'


    # Campo del modelo
    else:
        try:
            val = getattr(rowData, fName)
            # Si es una referencia ( fk ) es del tipo model
            if isinstance(val, models.Model):
                val = verifyStr(val , '')
        except: 
            val = 'vr?'

        # Evita el valor null en el el frontEnd
        if val is None: 
            val = ''


    return val


def evalueFuncion(fName, rowData):
    """ para evaluar las funciones @  declaradas en el modelo
    """

    # obtener el titulo y los parametros y enviar la tupla

    try:
        expr = 'rowData.' + fName[1:]
        val = eval(expr)
        val = verifyStr(val , '')
    except: 
        val = fName + '?'

    return val
