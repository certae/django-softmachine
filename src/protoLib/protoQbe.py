# -*- encoding: utf-8 -*-

from django.db.models import Q
<<<<<<< HEAD
from utilsConvert import isNumeric, toInteger
from django.contrib.admin.util import get_fields_from_path


from django.db import models
from protoField import TypeEquivalence
=======
from protoLib.utilsConvert import isNumeric, toInteger
import re
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

from utilsBase import verifyList
# from utilsConvert import getTypedValue

# from protoQbe import getSearcheableFields, getQbeStmt
import traceback
import re

<<<<<<< HEAD

=======
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
def addFilter(Qs, sFilter):
#   Agrega un filtro q viene en modo texto a un Qset
    if (len(sFilter) == 0):
        return Qs

    protoStmt = ''

    # Tipo array
<<<<<<< HEAD
    #if type(sFilter) == type([]):
    if sFilter.isInstance([]):
=======
#    if type(sFilter) == type([]):
    if sFilter.isinstance([]):
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        protoStmt = ''

    # Tipo dictionario viene conformado @property[_contain],  .....
    #elif type(sFilter) == type({}):
<<<<<<< HEAD
    elif sFilter.isInstance({}):
=======
    elif sFilter.isinstance({}):
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        protoStmt = sFilter

    # Filtro String
    else:
        try:
            protoStmt = eval(sFilter)
        except:
            return Qs

    # en caso de q halla un stmt lo evalua
    if (len(protoStmt) == 0):
        Qs = Qs.filter(**protoStmt)

    return Qs


def construct_search(field_name):
    if field_name.startswith('^'):
        return "%s__istartswith" % field_name[1:]

    elif field_name.startswith('='):
        return "%s__iexact" % field_name[1:]

    elif field_name.startswith('@'):
        return "%s__search" % field_name[1:]

    else:
        return "%s__icontains" % field_name


def getSearcheableFields(model):
<<<<<<< HEAD
# Obtiene los campos visibles del modelo base, se usa como valor por
# defecto para los searchFields
=======
# Obtiene los campos visibles del modelo base, se usa como valor por defecto para los searchFields
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    lFields = []
    filterableTypes = ['CharField', 'TextField',  'JSONField']
#    filterableTypes.extend( ['IntegerField', 'DecimalField', 'FloatField' ]
<<<<<<< HEAD
# filterableTypes.extend( [ 'DateField', 'TimeField', 'DateTimeField',
# 'BooleanField' ])
=======
#    filterableTypes.extend( [ 'DateField', 'TimeField', 'DateTimeField', 'BooleanField' ])
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    for field in model._meta._fields():
        if field.__class__.__name__ in filterableTypes:
            lFields.append(field.name)
<<<<<<< HEAD

    return lFields
=======
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    return lFields

<<<<<<< HEAD
def getQbeStmt(fieldName,  sQBE, sType):
=======

def getQbeStmt(fieldName, sQBE, sType):
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    QResult = Q()

    # Valida el tipo del criterio
    if type(sQBE).__name__ in ['str', 'unicode']:
        sQBE = sQBE.strip()

        # Verifica si es una funcion
        if (sQBE[0] == '@'):
            try:
                sQBE = doGenericFuntion(sQBE)
            except Exception as e:
<<<<<<< HEAD
                # TODO: Log error y seguimeinto para hacer nulo el Qs
=======
                #TODO: Log error y seguimeinto para hacer nulo el Qs
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
                return None

        if sQBE == '':
            return QResult

    elif type(sQBE).__name__ in ['int', 'long', 'float', 'decimal']:
        # es un numero, no hay criterios posibles solo =
<<<<<<< HEAD
        Qobj = {"{0}".format(fieldName):   sQBE}
=======
        Qobj = {"{0}".format(fieldName): sQBE}
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        return Q(**Qobj)

    else:
        sQBE = str(sQBE)

    #  Negacion del criterio
    bNot = False
    if sQBE.startswith('!'):
        sQBE = sQBE[1:]
        bNot = True

    #-- Para hacerlo recursivo lo que dbde controlar incialemente es el or
    if sQBE.find(";") > 0:

        lCondicion = sQBE.split(";")
        for sCondicion in lCondicion:
            if len(sCondicion) == 0:
                continue

            bAndConector = False
            if sCondicion.startswith('!'):
                bAndConector = True
                sCondicion = sCondicion[1:]

            Qtmp = getQbeStmt(fieldName, sCondicion, sType)
            if bAndConector:
                QResult = QResult & Qtmp
            else:
                QResult = QResult | Qtmp

        if bNot:
            QResult = ~ QResult
        return QResult

<<<<<<< HEAD
    # String:  \iexact, \icontains, \istartswith, isnull, search, TODO:
    # \iendswith, \iregex
    if sType in (['string', 'text', 'jsonfield']):
        if sQBE.startswith('^'):
            Qobj = {"{0}__istartswith".format(fieldName):  sQBE[1:]}
=======
    # String:  \iexact, \icontains, \istartswith, isnull, search, TODO: \iendswith, \iregex
    if sType in (['string', 'text', 'jsonfield']):
        if sQBE.startswith('^'):
            Qobj = {"{0}__istartswith".format(fieldName): sQBE[1:]}
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

        elif sQBE == '=':
            Qobj = {"{0}__isnnull".format(fieldName): True}

        elif sQBE.startswith('='):
<<<<<<< HEAD
            Qobj = {"{0}__iexact".format(fieldName):  sQBE[1:]}

        elif sQBE.startswith('@'):
            Qobj = {"{0}__search".format(fieldName):  sQBE[1:]}

        else:
            Qobj = {"{0}__icontains".format(fieldName):  sQBE}
=======
            Qobj = {"{0}__iexact".format(fieldName): sQBE[1:]}

        elif sQBE.startswith('@'):
            Qobj = {"{0}__search".format(fieldName): sQBE[1:]}

        else:
            Qobj = {"{0}__icontains".format(fieldName): sQBE}
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

        QResult = Q(**Qobj)

    # TODO: Verificar q sea numerico (
    # foreignText es una simple representacion, es siempre el id
    # Numericos : gt, gte, lt, lte,   TODO: in,   range,
<<<<<<< HEAD
    elif sType in (['int', 'foreignid', 'foreigntext',  'decimal']):

        if sQBE.startswith(">="):
            Qobj = {"{0}__gte".format(fieldName):  sQBE[2:]}
        elif sQBE.startswith("<="):
            Qobj = {"{0}__lte".format(fieldName):  sQBE[2:]}
        elif sQBE.startswith("<>") | sQBE.startswith("!="):
            bNot = ~ bNot
            Qobj = {"{0}".format(fieldName):  sQBE[2:]}

        elif sQBE.startswith(">"):
            Qobj = {"{0}__gt".format(fieldName):  sQBE[1:]}
        elif sQBE.startswith("<"):
            Qobj = {"{0}__lt".format(fieldName):  sQBE[1:]}
        elif sQBE.startswith("="):
            Qobj = {"{0}".format(fieldName):  sQBE[1:]}
        else:
            Qobj = {"{0}".format(fieldName):  toInteger(sQBE)}
=======
    elif sType in (['int', 'foreignid', 'foreigntext', 'decimal']):

        if sQBE.startswith(">="):
            Qobj = {"{0}__gte".format(fieldName): sQBE[2:]}
        elif sQBE.startswith("<="):
            Qobj = {"{0}__lte".format(fieldName): sQBE[2:]}
        elif sQBE.startswith("<>") | sQBE.startswith("!="):
            bNot = ~ bNot
            Qobj = {"{0}".format(fieldName): sQBE[2:]}
        elif sQBE.startswith(">"):
            Qobj = {"{0}__gt".format(fieldName): sQBE[1:]}
        elif sQBE.startswith("<"):
            Qobj = {"{0}__lt".format(fieldName): sQBE[1:]}
        elif sQBE.startswith("="):
            Qobj = {"{0}".format(fieldName): sQBE[1:]}
        else:
            Qobj = {"{0}".format(fieldName): toInteger(sQBE)}
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

        if not isNumeric(re.sub(r'[=><!]', '', sQBE)):
            return QResult

        QResult = Q(**Qobj)

#    TODO: if sType == 'bool':
#    Fechas: year, month, day,
#    TODO: if sType in ( [ 'date''datetime', 'time' ]) :

    if bNot:
        QResult = ~ QResult
    return QResult


def doGenericFuntion(sQBE):
    """
    Se define una tabla de funciones genericas q seran ejectua dinamicamente por pyton
    se ejectuan en el contexto actual, se deberia pasar algunas rutinas basicas en la medida q sean necesarias
        getModels

    Esta rutina servira tambien para desencadenar reglas de gestion sobre modelos y podria ser la base
    de la ejecucion del wKflow

    """
<<<<<<< HEAD
    from utilsBase import explode
=======
    from protoLib.utilsBase import explode
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    # obtiene los parametros
    fCall = explode(sQBE[1:])

    # obtiene la definicion de la funcion
    from models import PtFunction, getDjangoModel
    fBase = PtFunction.objects.get(code=fCall[0])

    # Construyte las variables de entorno
    myVars = {'model': getDjangoModel(fBase.modelName)}
<<<<<<< HEAD

    arguments = fBase.arguments.split(',')
    params = fCall[1].split(',')
    for i in range(0, len(arguments)):
        myVars[arguments[i]] = params[i]

    # ejecta y toma la base
    exec(fBase.functionBody, myVars)
    return myVars['ret']


def addQbeFilter(protoFilter, model, Qs, JsonField):

    # No hay criterios
    if len(protoFilter) == 0:
        return Qs

    protoFilter = verifyList(protoFilter)

    for sFilter in protoFilter:

        if sFilter['property'] == '_allCols':
            # debe descomponer la busqueda usando el objeto Q
            QTmp = getTextSearch(sFilter, model, model.protoMeta)
            if QTmp is None:
                QTmp = models.Q()

            try:
                Qs = Qs.filter(QTmp)
            except:
                traceback.print_exc()

        else:
            # Los campos simples se filtran directamente, se require para el
            # JSonField
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

    if JsonField:
        JsonFieldName = JsonField
    else:
        JsonFieldName = ''

    if fieldName.endswith('__pk') or fieldName.endswith('_id') or fieldName == 'pk':
        # Los id por ahora son numericos
        sType = 'int'

    elif fieldName == '__str__':
        # El campo especial __str__ debe ser descompuesto en los seachFields en
        # forma explicita
        return Q()

    elif fieldName.startswith(JsonFieldName + '__'):
        sType = 'string'

    else:
        try:
            # Obtiene el tipo de dato, si no existe la col retorna elimina la
            # condicion
            field = get_fields_from_path(model, fieldName)[-1]
            sType = TypeEquivalence.get(field.__class__.__name__, 'string')
        except:
            return Q()

    QStmt = getQbeStmt(fieldName, sFilter['filterStmt'], sType)

    return QStmt


def getTextSearch(sFilter, model, protoMeta):
    #   Busqueda Textual ( no viene con ningun tipo de formato solo el texto a buscar
    #   Si no trae nada deja el Qs con el filtro de base
    #   Si trae algo y comienza por  "{" trae la estructura del filtro

    # Si solo viene el texto, se podria tomar la "lista" de campos "mostrados"
    # ya los campos q veo deben coincidir con el criterio, q pasa con los __str__ ??
    # Se busca sobre los campos del combo ( filtrables  )

    QStmt = None
    try:
        pSearchFields = protoMeta['gridConfig']['searchFields']
    except:
        pSearchFields = getSearcheableFields(model)

    fieldsDict = protoMeta['fieldsDict']
    JsonField = protoMeta['jsonField']

    for fName in pSearchFields:
        fAux = fieldsDict.get(fName, {})
        if fAux.get('type', '') not in ['string', 'text',  'jsonfield']:
            continue

        QTmp = addQbeFilterStmt(
            {'property': fName, 'filterStmt': sFilter['filterStmt']}, model, JsonField)

        if QStmt is None:
            QStmt = QTmp
        else:
            QStmt = QStmt | QTmp

    return QStmt
=======

    arguments = fBase.arguments.split(',')
    params = fCall[1].split(',')
    for i in range(0, len(arguments)):
        myVars[arguments[i]] = params[i]

    # ejecta y toma la base
    exec(fBase.functionBody, myVars)
    return myVars['ret']
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
