# -*- coding: utf-8 -*-

import traceback

from django.utils import simplejson as json
from django.http import HttpResponse
from django.db import models

from datetime import datetime
<<<<<<< HEAD
from models import getDjangoModel
from protoActionList import Q2Dict, PrepareMeta2Load
from utilsConvert import toInteger, toDate, toDateTime, toTime, toFloat, toDecimal, toBoolean
from utilsBase import JSONEncoder, getReadableError, list2dict
from usrDefProps import verifyUdpDefinition, saveUDP
from django.utils.encoding import smart_str
from protoAuth import getUserProfile, getModelPermissions
from utilsWeb import doReturn

# Error Constants
ERR_NOEXIST = '<b>ErrType:</b> KeyNotFound<br>The specifique record does not exist'
=======
from protoLib.models import getDjangoModel
from protoLib.protoActionList import Q2Dict
from protoLib.utilsConvert import toInteger, toDate, toDateTime, toTime, toFloat, toDecimal, toBoolean
from protoLib.utilsBase import JSONEncoder, getReadableError, list2dict
from protoLib.usrDefProps import verifyUdpDefinition, saveUDP
from django.utils.encoding import smart_str
from protoLib.protoAuth import getUserProfile, getModelPermissions
from protoLib.utilsWeb import doReturn

# Error Constants
ERR_NOEXIST = '<b>ErrType:</b> KeyNotFound<br>The specific record does not exist'
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e


def protoCreate(request):
    myAction = 'add'
    msg = _protoEdit(request, myAction)
    return msg


def protoUpdate(request):
    myAction = 'change'
    return _protoEdit(request, myAction)


def protoDelete(request):
    myAction = 'delete'
    return _protoEdit(request, myAction)


def _protoEdit(request, myAction):

    if not request.user.is_authenticated():
        return doReturn({'success': False, 'message': 'readOnly User'})

    if request.method != 'POST':
        return doReturn({'success': False, 'message': 'invalid message'})

    message = ''

    # Carga el modelo
    # Chargez le modèle
    protoMeta = request.POST.get('protoMeta', '')
    protoMeta = json.loads(protoMeta)
    viewEntity = protoMeta.get('viewEntity', '')
    model = getDjangoModel(viewEntity)

<<<<<<< HEAD
#   Autentica
=======
    # Autentica
    # Authentification
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    if not getModelPermissions(request.user, model, myAction):
        return doReturn({'success': False, 'message': 'No ' + myAction + 'permission'})

    userProfile = getUserProfile(request.user, 'edit', viewEntity)

#   Decodifica los eltos
    rows = request.POST.get('rows', [])
    rows = json.loads(rows)

<<<<<<< HEAD
    PrepareMeta2Load(protoMeta)
    fieldsDict = protoMeta['fieldsDict']

#   JsonField
    jsonField = protoMeta['jsonField']
    if not jsonField:
        jsonField = ''

#   Genera la clase UDP
    cUDP = protoMeta['udpClass']

#   TOOD: Log
# activityLog ( myAction, request.user , viewEntity,  {  'protoMeta' :
# protoMeta , 'rows' : rows })

    # Verifica q sea una lista de registros, (no deberia pasar, ya desde Extjs
    # se controla )
=======
    fieldsDict = list2dict(protoMeta['fields'], 'name')

#   JsonField
    jsonField = protoMeta.get('jsonField', '')
    if not isinstance(jsonField, (str, unicode)):
        jsonField = ''

    # Genera la clase UDP
    # Génère classe UDP
    pUDP = protoMeta.get('usrDefProps', {})
    cUDP = verifyUdpDefinition(pUDP)

    # Verifica q sea una lista de registros, (no deberia pasar, ya desde Extjs se controla )
    # Vérifiez que c'est une liste de dossiers (ne devrait pas arriver, car Extjs est contrôlé)
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    if type(rows).__name__ == 'dict':
        rows = [rows]

    # Verfica si es un protoModel ( maneja TeamHierarchy )
<<<<<<< HEAD
=======
    # Vérifiez s'il s'agit d'un protoModel (gère l'équipe hiérarchie)
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    isProtoModel = hasattr(model, '_protoObj')

    pList = []
    for data in rows:

        data['_ptStatus'] = ''

        if myAction == 'add':
            rec = model()
        else:
            try:
                rec = model.objects.get(pk=data['id'])
            except:
<<<<<<< HEAD
                data['_ptStatus'] = data['_ptStatus'] + ERR_NOEXIST + '<br>'
=======
                data['_ptStatus'] = ERR_NOEXIST + '<br>'
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
                pList.append(data)
                continue

        if not (myAction == 'delete'):
            # Upd, Ins
            for key in data:
                key = smart_str(key)
                if key in ['id', '_ptStatus', '_ptId', '__str__']:
                    continue

                vFld = fieldsDict[key]
<<<<<<< HEAD
                if vFld.get('crudType') in ["screenOnly", "linked"]:
=======
                if vFld.get('crudType') in ['screenOnly', 'linked']:
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
                    continue

                # Los campos de seguridad se manejan a nivel registro
                # Domaines de sécurité sont traitées lors de l'inscription
                if isProtoModel:
<<<<<<< HEAD
                    if key in [
                        'smOwningUser', 'smOwningTeam', 'smCreatedBy', 'smModifiedBy',
                        'smWflowStatus', 'smRegStatus', 'smCreatedOn', 'smModifiedOn',
                            'smOwningUser_id', 'smOwningTeam_id', 'smCreatedBy_id', 'smModifiedBy_id']:
                        continue

                #  Udps
                if cUDP:
                    if key.startswith(cUDP.propertyPrefix + '__'):
                        continue
=======
                    if key in ['smOwningUser', 'smOwningTeam', 'smCreatedBy',
                               'smModifiedBy', 'smWflowStatus', 'smRegStatus',
                               'smCreatedOn', 'smModifiedOn', 'smOwningUser_id',
                               'smOwningTeam_id', 'smCreatedBy_id', 'smModifiedBy_id']:
                        continue

                #  Udps
                if (cUDP.udpTable and key.startswith(cUDP.propertyPrefix + '__')):
                    continue
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

                #  JsonField
                if key == jsonField:
                    continue
                if key.startswith(jsonField + '__'):
                    continue
<<<<<<< HEAD

                # FKeys
                if key.endswith('_id'):
                    key = key[:-3]

                try:
                    setRegister(model,  rec, key,  data)
                except Exception as e:
                    data['_ptStatus'] = data[
                        '_ptStatus'] + getReadableError(e)
=======

                try:
                    setRegister(model, rec, key, data)
                except Exception as e:
                    data['_ptStatus'] = data['_ptStatus'] + getReadableError(e)
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

            if isProtoModel:
                setSecurityInfo(rec, data, userProfile, (myAction == 'add'))

            if len(jsonField) > 0:
                jsonInfo = {}
                for key in data:
                    if not key.startswith(jsonField + '__'):
                        continue
<<<<<<< HEAD
                    jKey = key[len(jsonField) + 2:]
=======
                    jKey = key[len(jsonField)+2:]
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
                    jsonInfo[jKey] = data[key]
                setattr(rec, jsonField, jsonInfo)

            # Guarda el idInterno para concatenar registros nuevos en la grilla
<<<<<<< HEAD
=======
            # Conserve l'identifiant interne de concaténer de nouveaux records dans la grille
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
            try:
                _ptId = data['_ptId']
            except:
                _ptId = ''

            try:
                rec.save()

                # Guardar las Udps
<<<<<<< HEAD
                if cUDP:
=======
                # Enregistrer l'UDPS
                if cUDP.udpTable:
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
                    try:
                        saveUDP(rec, data, cUDP)
                    except Exception as e:
                        raise Exception('UdpError: saveActiob')

<<<<<<< HEAD
                # -- Los tipos complejos ie. date, generan un error, es necesario hacerlo detalladamente
                # Convierte el registro en una lista y luego toma solo el
                # primer elto de la lista resultado.
=======
                # Los tipos complejos ie. date, generan un error, es necesario hacerlo detalladamente
                # Convierte el registro en una lista y luego toma solo el primer elto de la lista resultado.

                # Les types complexes de l'IE. jour, de générer une erreur, il est nécessaire de faire détaillée
                # Convertir le dossier dans une liste, puis prenez seulement la première liste de résultats elto.
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
                data = Q2Dict(protoMeta, [rec], False)[0]
                data['_ptId'] = _ptId

            except Exception as e:
                data['_ptStatus'] = data['_ptStatus'] + getReadableError(e)
                data['_ptId'] = _ptId
<<<<<<< HEAD
                # traceback.print_exc()
                # return doReturn ({'success':False ,'message' : str( e )})
=======
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

        else:  # Action Delete
            try:
                rec.delete()

<<<<<<< HEAD
            except Exception,  e:
=======
            except Exception as e:
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
                data['_ptStatus'] = data['_ptStatus'] + getReadableError(e)
                pass

        pList.append(data)

        if data.get('_ptStatus', ''):
            message += data['_ptStatus'] + ';'

    context = {
        'totalCount': pList.__len__(),
        'message': message,
        'rows': pList,
        'success': True
    }

<<<<<<< HEAD
    return HttpResponse(json.dumps(context, cls=JSONEncoder), mimetype="application/json")
=======
    return HttpResponse(json.dumps(context, cls=JSONEncoder), mimetype='application/json')
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e


def setSecurityInfo(rec, data, userProfile, insAction):
    """
<<<<<<< HEAD
    rec      : registro al q se agrega la info de seguridad
    data     : objeto buffer q puede ser {} utilizado para retornar la info guardad
    insAction: True if insert,  False if update
    """
    setProtoData(rec, data,  'smModifiedBy',  userProfile.user)
    setProtoData(rec, data,  'smModifiedOn', datetime.now())

    if insAction:
        setProtoData(rec, data,  'smOwningUser', userProfile.user)
        setProtoData(rec, data,  'smOwningTeam', userProfile.userTeam)
        setProtoData(rec, data,  'smCreatedBy',  userProfile.user)
        setProtoData(rec, data,  'smRegStatus', '0')
        setProtoData(rec, data,  'smCreatedOn',  datetime.now())
=======
    rec: registro al q se agrega la info de seguridad
    data: objeto buffer q puede ser {} utilizado para retornar la info guardad
    insAction: True if insert,  False if update

    rec: enregistrement qui ajoute des informations de sécurité
    data: buffer objet q {} peut être utilisée pour retourner les informations dont vous garderez
    insAction: True if insert,  False if update
    """
    setProtoData(rec, data, 'smModifiedBy', userProfile.user)
    setProtoData(rec, data, 'smModifiedOn', datetime.now())
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    if insAction:
        setProtoData(rec, data, 'smOwningUser', userProfile.user)
        setProtoData(rec, data, 'smOwningTeam', userProfile.userTeam)
        setProtoData(rec, data, 'smCreatedBy',  userProfile.user)
        setProtoData(rec, data, 'smRegStatus', '0')
        setProtoData(rec, data, 'smCreatedOn',  datetime.now())


def setProtoData(rec, data, key, value):
    setattr(rec, key, value)
    if not isinstance(value, models.Model):
        data[key] = value


<<<<<<< HEAD
def setRegister(model,  rec, key,  data):
=======
def setRegister(model, rec, key, data):
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    try:
        field = model._meta.get_field(key)
    except:
        return

    # Tipo de attr
<<<<<<< HEAD
    cName = field.__class__.__name__

    # Si es definido como no editable en el modelo
=======
    # Type d'attribut
    cName = field.__class__.__name__

    # Si es definido como no editable en el modelo
    # Si elle est définie comme étant modifiables dans le modèle
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    if getattr(field, 'editable', False) is False:
        return
    if cName == 'AutoField':
        return
<<<<<<< HEAD

    # Obtiene el valor

    try:

        if cName == 'ForeignKey':
=======

    # Obtiene el valor
    # Obtient la valeur
    value = data[key]

    try:

        if cName == 'CharField' or cName == 'TextField':
            setattr(rec, key, value)
            return
        elif cName == 'ForeignKey':
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
            keyId = key + '_id'
            value = data[keyId]
            exec('rec.' + keyId + ' =  ' + smart_str(value))
            return
<<<<<<< HEAD

        value = data[key]
        if cName == 'CharField' or cName == 'TextField':
            setattr(rec, key, value)
            return

=======
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        elif cName == 'DateField':
            value = toDate(value)
        elif cName == 'TimeField':
            value = toTime(value)
        elif cName == 'DateTimeField':
            value = toDateTime(value)
<<<<<<< HEAD

=======
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        elif cName == 'BooleanField':
            value = toBoolean(value)
        elif cName == 'IntegerField':
            value = toInteger(value)
        elif cName == 'DecimalField':
            value = toDecimal(value)
        elif cName == 'FloatField':
            value = toFloat(value)

        setattr(rec, key, value)

    except Exception:
        raise Exception
