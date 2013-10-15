# -*- coding: utf-8 -*-

<<<<<<< HEAD
# Manejo de reportes basdaos en plantillas ( sheets )
# Dg 121105   --------------------------------------------------

from django.core.files import File
from settings import PPATH
=======
#Manejo de reportes basdaos en plantillas ( sheets )
#Les rapports de gestion basés sur des modèles
#Dg 121105   --------------------------------------------------

from django.core.files import File
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.utils.encoding import smart_str
#from django.utils.encoding import smart_unicode

<<<<<<< HEAD
from models import getDjangoModel, ProtoDefinition
from protoActionList import Q2Dict, getQSet, PrepareMeta2Load
from protoGrid import getBaseModelName
from utilsBase import getReadableError
from protoQbe import addFilter
from downloadFile import getFullPath

from utilsWeb import JsonError, JsonSuccess
=======
from protoLib.models import getDjangoModel
from protoLib.models import ProtoDefinition
from protoLib.protoActionList import Q2Dict
from protoLib.protoActionList import getQSet
from protoLib.protoGrid import getBaseModelName
from protoLib.utilsBase import getReadableError
from protoLib.protoQbe import addFilter
from protoLib.downloadFile import getFullPath

from protoLib.utilsWeb import JsonError
from protoLib.utilsWeb import JsonSuccess
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

import django.utils.simplejson as json
import os


def sheetConfigRep(request):
<<<<<<< HEAD
    """ Reporte basado en la definicion de plantillas ( sheets )
    """
=======
    """
        Reporte basado en la definicion de plantillas ( sheets )
        Rapport basé sur la définition de modèles
    """
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    if not request.user.is_authenticated():
        return JsonError('readOnly User')

    if request.method != 'POST':
        return JsonError('invalid message')

    """  1.
    Recibe  opcion, plantilla base,  Qs ( lista de ids )
    La plantilla de base sera solicitada al usuario, si se deja en blanco usara el sheetSelector o el default
    Los detalles no tienen selector, siempre se usara el template marcado en el detalle.
<<<<<<< HEAD
    """

=======

    Recevez option s'appuie sur les modèles Qs (liste des identifiants)
    Le modèle de base sera appliqué à l'utilisateur, s'il est laissé vide ou utilisé le sheetSelector par défaut
    Les détails n'ont pas de sélecteur, toujours utilisé le modèle marqué en détail.
    """
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    viewCode = request.POST.get('viewCode', '')
    sheetName = request.POST.get('sheetName', '')
    selectedKeys = request.POST.get('selectedKeys', [])

    selectedKeys = json.loads(selectedKeys)

    protoMeta, Qs = getReportBase(viewCode)

    # Si no hay lista, los trae todos
<<<<<<< HEAD
    #if type(selectedKeys).__name__ == type([]).__name__ and selectedKeys.__len__() > 0:
    if selectedKeys.isInstance([]) and len(selectedKeys) > 0:
=======
    # S'il n'y a pas de liste, apporte toute
    #if type(selectedKeys).__name__ == type([]).__name__ and selectedKeys.__len__() > 0:
    if selectedKeys.isinstance([]) and len(selectedKeys) > 0:
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        pFilter = {'pk__in': selectedKeys}
        Qs = addFilter(Qs, pFilter)

    #  template FirstPage
    pSheet = getSheetConf(protoMeta, sheetName)
    sheetName = pSheet.get('name', 'Auto')

<<<<<<< HEAD
    #  Obtiene el template FirstPage
    templateFp = pSheet.get(
        'templateFp', '<span ' + sheetName + '.firstPage></span>')
    templateFp = templateFp + \
        pSheet.get('templateBb', '<span ' +
                   sheetName + '.BeforeBlock></span>')

    templateLp = pSheet.get(
        'templateAb', '<span ' + sheetName + '.AfterBlock></span>')
    templateLp = templateLp + \
        pSheet.get('templateLp', '<span ' + sheetName + '.lastPage></span>')

    templateEr = pSheet.get('templateEr', pSheet.get('template', ''))

    #  Variables de titulo
    templateFp = getReport(['reportTitle'], templateFp, {
                           'reportTitle': pSheet.get('title', sheetName)})

    # Crea la clase del reporte
    MyReport = SheetReportFactory()

    # Envia al reporte la hoja para manejar los detalles, el QSet, y los
    # templates
    MyReport.getReport(Qs, templateFp, templateEr,
                       templateLp, protoMeta, pSheet.get('sheetDetails', []))

    # retorna el reporte
    return HttpResponse(MyReport.myReport)


    #------------
=======
    # Obtiene el template FirstPage
    # Obtient le modèle de la première page
    templateFp = pSheet.get('templateFp', '<span ' + sheetName + '.firstPage></span>')
    templateFp = templateFp + pSheet.get('templateBb', '<span ' + sheetName + '.BeforeBlock></span>')

    templateLp = pSheet.get('templateAb', '<span ' + sheetName + '.AfterBlock></span>')
    templateLp = templateLp + pSheet.get('templateLp', '<span ' + sheetName + '.lastPage></span>')

    templateEr = pSheet.get('templateEr', pSheet.get('template', ''))

    # Variables de titulo
    # Variables titre
    templateFp = getReport(['reportTitle'], templateFp, {'reportTitle': pSheet.get('title', sheetName)})

    # Crea la clase del reporte
    # Créer une classe de rapport
    MyReport = SheetReportFactory()

    # Envia al reporte la hoja para manejar los detalles, el QSet, y los templates
    # Envoyer la fiche de rapport pour gérer les détails, le QSet et modèles
    MyReport.getReport(Qs, templateFp, templateEr, templateLp, protoMeta, pSheet.get('sheetDetails', []))

    # retorna el reporte
    # renvoie le rapport
    return HttpResponse(MyReport.myReport)


>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
def getSheetConf(protoMeta, sheetName):
    """ Obtiene un sheetConfig dado su nombre
        recibe  la definicion ( protoMeta ) y el nombre ( str )
        retorna sheetConfig ( obj )
<<<<<<< HEAD
=======

        Obtient une sheetConfig donné son nom
        reçoit la définition (protoMeta) et le nom (str)
        Retours sheetConfig (obj)
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    """

    try:
        pSheets = protoMeta.get('sheetConfig', [])
    except Exception as e:
        return {}

<<<<<<< HEAD
    # Los recorre todos pero se queda con el primero
    # en caso de no encotrarl el nombre seleccionado
    pSheet = None
    for item in pSheets:
        if pSheet is None:
            pSheet = item
        if item.get('name', '') == sheetName:
            pSheet = item
            break

    if pSheet is None:
        pSheet = {}
    return pSheet
=======
    # Los recorre todos pero se queda con el primero en caso de no encotrarl el nombre seleccionado
    # Les pistes tous, mais reste avec le premier cas, de ne pas trouver le nom sélectionné
    pSheet = None
    for item in pSheets:
        if pSheet is None:
            pSheet = item
        if item.get('name', '') == sheetName:
            pSheet = item
            break

    if pSheet is None:
        pSheet = {}
    return pSheet

>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

def getReportBase(viewCode):

    viewEntity = getBaseModelName(viewCode)

<<<<<<< HEAD
def getReportBase(viewCode):

    viewEntity = getBaseModelName(viewCode)

    # Obtiene el modelo
=======
    # Obtiene el modelo
    # Obtient le modèle
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    try:
        model = getDjangoModel(viewEntity)
    except Exception as e:
        pass

    # Obtiene la definicion
<<<<<<< HEAD
=======
    # Obtient la définition
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    try:
        protoDef = ProtoDefinition.objects.get(code=viewCode)
        protoMeta = json.loads(protoDef.metaDefinition)
    except Exception as e:
        pass

    # hace el QSet de los registros seleccionados
<<<<<<< HEAD
    PrepareMeta2Load(protoMeta)
=======
    # rend le QSet des enregistrements sélectionnés
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    Qs = model.objects.select_related(depth=1)

    return protoMeta, Qs


class SheetReportFactory(object):
<<<<<<< HEAD

    """ Construye un reporte basado en templates ( sheets )
=======
    """ Construye un reporte basado en templates ( sheets )
        Construire un rapport basé sur des modèles
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    """

    def __init__(self):

<<<<<<< HEAD
        self.myReport = ''              # Cuerpo del reporte
        self.rowCount = 0               # Conteo general de filas

    def getReport(self, Qs, templateBefore, templateERow, templateAfter, protoMeta, sheetDetails):
        """ Construye el reporte en bloques recursivos ( basado en sheetDetails )
        # recibe :
        # myReport      : Reporte en curso
        # Qs            : QuerySet ya preparado
        # Templates     : Los templates son diferentes dependiendo la definicion del modelo
        # protoMeta     : Se requiere para llamar Q2Dict
        # sheetDetails  : Detalles a iterar
        """

        # Inicializa el conteo de filas del Bloque
        blockRowCount = 0

        # Envia el QSet  obtiene una lista
        pList = Q2Dict(protoMeta, Qs, False)

        # prepara las variables q participan en cada template
        bfProps = getProperties(protoMeta['fields'], templateBefore)
        erProps = getProperties(protoMeta['fields'], templateERow)
        afProps = getProperties(protoMeta['fields'], templateAfter)

        # Al comenzar lee  template  beforeDetail
        if pList.__len__() > 0:
=======
        self.myReport = ''              # Cuerpo del reporte -- Corps du rapport
        self.rowCount = 0               # Conteo general de filas -- Nombre global de lignes

    def getReport(self, Qs, templateBefore, templateERow, templateAfter, protoMeta, sheetDetails):
        """
        Construye el reporte en bloques recursivos ( basado en sheetDetails )
        recibe :
        myReport      : Reporte en curso
        Qs            : QuerySet ya preparado
        Templates     : Los templates son diferentes dependiendo la definicion del modelo
        protoMeta     : Se requiere para llamar Q2Dict
        sheetDetails  : Detalles a iterar

        Construire le rapport récursif de bloc (basé sur sheetDetails)
         # Reçu:
         # MyReport: Rapport en cours
         # Qs: QuerySet déjà préparé
         # Modèles: Les modèles diffèrent selon la définition du modèle
         # ProtoMeta: Obligation d'appeler Q2Dict
         # SheetDetails: Détails d'itérer
        """

        # Inicializa el conteo de filas del Bloque
        # Initialise le nombre de lignes dans le bloc
        blockRowCount = 0

        # Envia el QSet  obtiene una lista
        # Envoyer QSet obtient une liste
        pList = Q2Dict(protoMeta, Qs, False)

        # prepara las variables q participan en cada template
        # prépare les variables intervenant dans chaque gabarit
        bfProps = getProperties(protoMeta['fields'], templateBefore)
        erProps = getProperties(protoMeta['fields'], templateERow)
        afProps = getProperties(protoMeta['fields'], templateAfter)

        # Al comenzar lee  template  beforeDetail
        # Lorsque vous commencez la lecture de modèle avant de Détail
        if len(pList) > 0:
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
            row = pList[0]
        else:
            row = {}
        self.myReport += getReport(bfProps, templateBefore, row)

        # Recorre los registros
<<<<<<< HEAD
=======
        # Parcourir les dossiers
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        for row in pList:

            blockRowCount += 1
            self.rowCount += 1

<<<<<<< HEAD
            # Lee registro a registro y  remplaza el template html con la info
            # correspondiente
            self.myReport += getReport(erProps, templateERow, row)

            # Loop Se Procesan cada uno de los detalles( M-D segun la
            # definciion del detalle de la opcion, segun el criterio de
            # sortIndicado. campo1, campo2-
=======
            # Lee registro a registro y  remplaza el template html con la info correspondiente
            # Lire ligne par ligne et remplace le modèle HTML avec des informations pertinentes
            self.myReport += getReport(erProps, templateERow, row)

            # Loop Se Procesan cada uno de los detalles( M-D segun la definciion del detalle de la opcion, segun el criterio de sortIndicado. campo1, campo2-
            # Boucle Elle traite chacun des détails (détail MD definciion selon l'option, selon le critère de sortIndicado. Champ1, champ2-
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
            for detail in sheetDetails:

                detailName = detail.get('name')
                detailName = detail.get('detailName', detailName)

<<<<<<< HEAD
                templateBb = detail.get(
                    'templateBb', '<span ' + detailName + '.BeforeDet></span>')
                templateAb = detail.get(
                    'templateAb', '<span ' + detailName + '.AfterDet></span>')
                templateEr = detail.get(
                    'templateEr', '<span ' + detailName + '.EveryRow></span>')

                # Obtiene la conf del detalle
=======
                templateBb = detail.get('templateBb', '<span ' + detailName + '.BeforeDet></span>')
                templateAb = detail.get('templateAb', '<span ' + detailName + '.AfterDet></span>')
                templateEr = detail.get('templateEr', '<span ' + detailName + '.EveryRow></span>')

                # Obtiene la conf del detalle
                # Obtient le détail conf
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
                detailConf = getDetailConf(protoMeta, detailName)
                if detailConf is None:
                    continue

                # Obtiene la meta y el QSet
<<<<<<< HEAD
                protoMetaDet, QsDet = getReportBase(
                    detailConf['conceptDetail'])

                # filtra el QSet de acuardo a los criterios del detalle
=======
                # Obtient la cible et QSet
                protoMetaDet, QsDet = getReportBase(detailConf['conceptDetail'])

                # filtra el QSet de acuardo a los criterios del detalle
                # Définissez des filtres selon les critères de détails
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
                masterField = detailConf['masterField']
                idMaster = row[masterField.replace('pk', 'id')]
                pFilter = {detailConf['detailField']: idMaster}
                QsDet = addFilter(QsDet, pFilter)

<<<<<<< HEAD
                self.getReport(
                    QsDet, templateBb, templateEr, templateAb, protoMetaDet, detail['sheetDetails'])

        # Al finalizar el template AfterDetail
        self.myReport += getReport(afProps, templateAfter, row)


def getProperties(fields, template):
    # Obtiene las propiedades de un template para no recorrer props inutiles

    template = smart_str(template)
    if not template.__contains__('{{'):
        return []

    properties = ['id']
    for field in fields:
        fName = smart_str(field['name'])
        if template.__contains__('{{' + fName + '}}'):
            properties.append(fName)

    # Retorna y elimina los duplicados
    return set(properties)

=======
                self.getReport(QsDet, templateBb, templateEr, templateAb, protoMetaDet, detail['sheetDetails'])

        # Al finalizar el template AfterDetail
        # Après la fin de AfterDetail
        self.myReport += getReport(afProps, templateAfter, row)


def getProperties(fields, template):
    # Obtiene las propiedades de un template para no recorrer props inutiles
    # Obtient les propriétés d'un modèle afin d'éviter des accessoires inutiles aller

    template = smart_str(template)
    if not template.__contains__('{{'):
        return []

    properties = ['id']
    for field in fields:
        fName = smart_str(field['name'])
        if template.__contains__('{{' + fName + '}}'):
            properties.append(fName)

    # Retorna y elimina los duplicados
    # Retours et supprime les doublons
    return set(properties)
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

def getDetailConf(protoMeta, detailName):

<<<<<<< HEAD
=======
def getDetailConf(protoMeta, detailName):

>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    try:
        pDetails = protoMeta.get('detailsConfig', [])
    except Exception as e:
        return None

<<<<<<< HEAD
    # Los recorre todos pero se queda con el primero
    # en caso de no encotrarl el nombre seleccionado
=======
    # Los recorre todos pero se queda con el primero en caso de no encotrarl el nombre seleccionado
    # Les pistes tous, mais reste avec le premier cas, de ne pas trouver le nom sélectionné
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    for item in pDetails:
        itemName = item.get('detailName', '')
        if itemName == '':
            itemName = item.get('menuText ', '')
        if itemName == detailName:
            return item

    return None


def getReport(props, template, row):
    # Remmplaza las propieades en el template
<<<<<<< HEAD
=======
    # Remplace les propriétés dans le modèle
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    sAux = smart_str(template[0:])
    for prop in props:
        rValue = smart_str(row.get(prop, ''))
        sAux = sAux.replace('{{' + smart_str(prop) + '}}', rValue)

    return sAux


<<<<<<< HEAD
# ------------------------------------------------------------------------

def getLineCsv(line):
    sAux = u''
    for e in line:
        sAux = sAux + ',"' + smart_unicode(e) + '"'
=======
def getLineCsv(line):
    sAux = u''
    for e in line:
        #sAux = sAux + ',"' + smart_unicode(e) + '"'  # No need for unicode in Python3
        sAux = sAux + ',"' + smart_str(e) + '"'
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    return sAux[1:] + '\n'


def protoCsv(request):
<<<<<<< HEAD
    # Create the HttpResponse object with the appropriate CSV header, based of
    # fieldDefinition
=======
    # Create the HttpResponse object with the appropriate CSV header, based on fieldDefinition
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    if not request.user.is_authenticated():
        return JsonError('readOnly User')

    if request.method != 'POST':
        return JsonError('invalid message')

    protoMeta = request.POST.get('protoMeta', '')
    protoMeta = json.loads(protoMeta)

    protoFilter = request.POST.get('protoFilter', '')
    baseFilter = request.POST.get('baseFilter', '')
    sort = request.POST.get('sort', '')

<<<<<<< HEAD
#   Obtiene las filas del modelo
    PrepareMeta2Load(protoMeta)
    Qs, orderBy, fakeId = getQSet(
        protoMeta, protoFilter, baseFilter, sort, request.user)
=======
    # Obtiene las filas del modelo
    # Obtenir le rang de modèle
    Qs, orderBy, fakeId = getQSet(protoMeta, protoFilter, baseFilter, sort, request.user)
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    if orderBy:
        pRows = Qs.order_by(*orderBy)
    else:
        pRows = Qs.all()

<<<<<<< HEAD
#   Prepara las cols del Query
    try:
        pList = Q2Dict(protoMeta, pRows, fakeId)
    except Exception,  e:
=======
    # Prepara las cols del Query
    # Préparer la requête cols
    try:
        pList = Q2Dict(protoMeta, pRows, fakeId)
        print('type of pList is  : ')
        print(type(pList))
        print('length of pList is  : ')
        print(len(pList))

    except Exception as e:
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        message = getReadableError(e)
        pList = [message]

    filename = protoMeta.get('viewCode', '') + '.csv'
    fullpath = getFullPath(request, filename)

#    ---  No maneja utf-8
#    import csv
#    with open( fullpath , 'wb') as f:
#        writer = csv.writer(f)
#        writer.writerow( pList[0].keys() )
#        for row in pList:
#            writer.writerow( row.values() )

    import codecs
    with codecs.open(fullpath, 'w', 'utf-8') as outfile:
        outfile.write(getLineCsv(pList[0].keys()))
        for row in pList:
            outfile.write(getLineCsv(row.values()))

<<<<<<< HEAD
    return JsonSuccess({'message':  filename})
=======
    return JsonSuccess({'message': filename})
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
