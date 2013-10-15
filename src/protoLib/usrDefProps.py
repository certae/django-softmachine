from protoLib.models import getDjangoModel
from protoLib.protoQbe import addFilter
from protoLib.utilsConvert import getTypedValue
from django.utils.encoding import smart_str

<<<<<<< HEAD
# Para pasar atributos en forma de clase


class cAux:
    pass


def verifyUdpDefinition(pUDP):
    """ Verifica q todos los valores tengan su definicion y retorna una clase

=======

# Para pasar atributos en forma de clase
class cAux:
    pass


def verifyUdpDefinition(pUDP):
    """ Verifica q todos los valores tengan su definicion y retorna una clase

>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    @udpTable         : Tabla q aloja las UDPs o el set del objeto padre
    @propertyName     : Nombre de la UDP
    @propertyValue    : Valor str donde se almacenara la Udp
    @propertyRef      : Valor de referencia del objeto base que contiene la cll de Udps ( tabla base )
    @propertyPrefix   : prefijo usado en el recordSet para diferenciar los campos provenientes de UDP
    @keyField         : keyField ( nombre del campo ) sobre el registro de base,cuando la udp no es un maestroDetalle,

    La busqueda normalmente se hace por el registro asociado del ORM esto es mas eficiente, en este caso no
    se rquiere el keyField pero es posible q la UdpTable no tenga una relacion directa con su tabla base,
    en este caso debe haber un Id q permita hacer la manipulacion de las UDPs
    """

    cUDP = cAux()
    cUDP.udpTable = pUDP.get('udpTable', None)

    if (cUDP.udpTable):
        cUDP.udpTable = smart_str(cUDP.udpTable)
        cUDP.propertyName = smart_str(pUDP.get('propertyName', 'code'))
<<<<<<< HEAD
        cUDP.propertyValue = smart_str(
            pUDP.get('propertyValue', 'valueUdp'))
=======
        cUDP.propertyValue = smart_str(pUDP.get('propertyValue', 'valueUdp'))
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        cUDP.propertyPrefix = smart_str(pUDP.get('propertyPrefix', 'udp'))

        cUDP.propertyRef = smart_str(pUDP.get('propertyRef', ''))
        cUDP.keyField = smart_str(pUDP.get('keyField', ''))

        if len(cUDP.propertyRef) == 0:
<<<<<<< HEAD
            raise Exception(
                'UdpError: Undefined properteRef for: ' + cUDP.udpTable)
=======
            raise Exception('UdpError: Undefined properteRef for: ' + cUDP.udpTable)
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    else:
        cUDP.udpTable = None
        cUDP.keyField = None
        cUDP.propertyPrefix = ''

    return cUDP


<<<<<<< HEAD
def saveUDP(regBase,  data, cUDP):
=======
def saveUDP(regBase, data, cUDP):
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    try:
        UdpModel = getDjangoModel(cUDP.udpTable)
    except:
        raise Exception('UdpError: Invalid model ' + UdpModel)
<<<<<<< HEAD

    # si keyField no esta definido implica una relacion MD
    if not cUDP.keyField:
        try:
            Qs = eval('regBase.' + cUDP.udpTable.lower() + '_set.all()')
        except:
            raise Exception(
                'UdpError:  related_name  set not found ' + cUDP.udpTable.lower())

    else:
        keyValue = data.get(cUDP.keyField)
        keyValue = smart_str(keyValue)

        if not keyValue:
            raise Exception(
                'UdpError: Key not found ' + cUDP.keyField + ' in masterReg')

=======

    # si keyField no esta definido implica una relacion MD
    if not cUDP.keyField:
        try:
            Qs = eval('regBase.' + cUDP.udpTable.lower() + '_set.all()')
        except:
            raise Exception('UdpError: related_name set not found ' + cUDP.udpTable.lower())

    else:
        keyValue = data.get(cUDP.keyField)
        keyValue = smart_str(keyValue)

        if not keyValue:
            raise Exception('UdpError: Key not found ' + cUDP.keyField + ' in masterReg')

>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        Qs = UdpModel.objects
        Qs = addFilter(Qs, {cUDP.propertyRef: keyValue})

    for key in data:
        key = smart_str(key)
        if (not key.startswith(cUDP.propertyPrefix + '__')):
            continue
        UdpCode = key[len(cUDP.propertyPrefix) + 2:]

        QsUdp = addFilter(Qs, {cUDP.propertyName: UdpCode})
        if QsUdp.exists():
            rUdp = QsUdp[0]
        else:
            rUdp = UdpModel()
            if not cUDP.keyField:
                setattr(rUdp, cUDP.propertyRef, regBase)
            else:
<<<<<<< HEAD
                # Fix: deberia ser un parametro
=======
                #Fix: deberia ser un parametro
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
                setattr(rUdp, cUDP.propertyRef + '_id', keyValue)

            setattr(rUdp, cUDP.propertyName, UdpCode)

<<<<<<< HEAD
        # Genera el ISO para la fecha y valores estandares para numeros y
        # booleanos
=======
        # Genera el ISO para la fecha y valores estandares para numeros y booleanos
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        sAux = smart_str(data[key])
        if sAux == 'None':
            sAux = ''
        setattr(rUdp, cUDP.propertyValue, sAux)
        rUdp.save()


<<<<<<< HEAD
def readUdps(rowdict, regBase, cUDP, udpList,  udpTypes):

    if cUDP.keyField:
        # si la creacion del detalle no es relacional,
        # se requiere hacer un verdadero Query sobre udpTable
        UdpModel = getDjangoModel(cUDP.udpTable)
        keyValue = rowdict.get(cUDP.keyField, '')
        if not keyValue:
            raise Exception(
                'UdpError: Key not found ' + cUDP.keyField + ' in masterReg')

=======
def readUdps(rowdict, regBase, cUDP, udpList, udpTypes):

    if cUDP.keyField:
        # si la creacion del detalle no es relacional,
        # se requiere hacer un verdadero Query sobre udpTable
        UdpModel = getDjangoModel(cUDP.udpTable)
        keyValue = rowdict.get(cUDP.keyField, '')
        if not keyValue:
            raise Exception('UdpError: Key not found ' + cUDP.keyField + ' in masterReg')

>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        keyValue = smart_str(keyValue)
        bAux = True
        Qs = UdpModel.objects
        Qs = addFilter(Qs, {cUDP.propertyRef: keyValue})
        cllUDP = Qs.all()

    else:
        # Si no hay keyField, hace el query basado en el registro maestro
        try:
            bAux = eval('regBase.' + cUDP.udpTable.lower() + '_set.exists()')
            cllUDP = eval('regBase.' + cUDP.udpTable.lower() + '_set.all()')
        except:
<<<<<<< HEAD
            raise Exception(
                'UdpError:  related_name  set not found ' + cUDP.udpTable.lower())
=======
            raise Exception('UdpError:  related_name  set not found ' + cUDP.udpTable.lower())
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    if bAux:

        for lUDP in cllUDP:
<<<<<<< HEAD
            udpName = cUDP.propertyPrefix + '__' + \
                getattr(lUDP, cUDP.propertyName, '')
=======
            udpName = cUDP.propertyPrefix + '__' + getattr(lUDP, cUDP.propertyName, '')
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
            if udpName in udpList:
                sAux = getattr(lUDP, cUDP.propertyValue, '')
                sAux = getTypedValue(sAux, udpTypes[udpName])
                sAux = smart_str(sAux)

                if udpTypes[udpName] == 'html' and type(sAux).__name__ == 'string':
                    sAux = sAux.replace('\n', '<br>').replace('\r', '<br>')
                    sAux = sAux.replace('<br><br>', '<br>')
<<<<<<< HEAD
                    sAux = sAux.replace('<td><br>', '<td>').replace(
                        '</td><br>', '</td>')
                    sAux = sAux.replace('<th><br>', '<th>').replace(
                        '</th><br>', '</th>')
                    sAux = sAux.replace('<tr><br>', '<tr>').replace(
                        '</tr><br>', '</tr>')
                    sAux = sAux.replace('<br><td>', '<td>').replace(
                        '<br></td>', '</td>')
                    sAux = sAux.replace('<br><th>', '<th>').replace(
                        '<br></th>', '</th>')
                    sAux = sAux.replace('<br><tr>', '<tr>').replace(
                        '<br></tr>', '</tr>')
=======
                    sAux = sAux.replace('<td><br>', '<td>').replace('</td><br>', '</td>')
                    sAux = sAux.replace('<th><br>', '<th>').replace('</th><br>', '</th>')
                    sAux = sAux.replace('<tr><br>', '<tr>').replace('</tr><br>', '</tr>')
                    sAux = sAux.replace('<br><td>', '<td>').replace('<br></td>', '</td>')
                    sAux = sAux.replace('<br><th>', '<th>').replace('<br></th>', '</th>')
                    sAux = sAux.replace('<br><tr>', '<tr>').replace('<br></tr>', '</tr>')
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

                rowdict[udpName] = sAux
