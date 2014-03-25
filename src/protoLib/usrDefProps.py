
from models import getDjangoModel
from protoQbe import addFilter
from utilsConvert import getTypedValue
from django.utils.encoding import smart_str

# Para pasar atributos en forma de clase
class cAux:
    pass


def verifyUdpDefinition(pUDP):
    """ Verifica q todos los valores tengan su definicion y retorna una clase  

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

    if (cUDP.udpTable) :
        cUDP.udpTable = smart_str(cUDP.udpTable)
        cUDP.propertyName = smart_str(pUDP.get('propertyName', 'code'))
        cUDP.propertyValue = smart_str(pUDP.get('propertyValue', 'valueUdp'))
        cUDP.propertyPrefix = smart_str(pUDP.get('propertyPrefix', 'udp'))

        cUDP.propertyRef = smart_str(pUDP.get('propertyRef', ''))
        cUDP.keyField = smart_str(pUDP.get('keyField', ''))

        if  len(cUDP.propertyRef) == 0 :
            raise Exception('UdpError: Undefined properteRef for: ' + cUDP.udpTable)

    else:
        cUDP.udpTable = None
        cUDP.keyField = None
        cUDP.propertyPrefix = ''

    return cUDP


def saveUDP(regBase, data, cUDP):

    try:
        UdpModel = getDjangoModel(cUDP.udpTable)
    except:
        raise Exception('UdpError: Invalid model ' + UdpModel)


    # si keyField no esta definido implica una relacion MD
    if not cUDP.keyField:
        try:
            Qs = eval ('regBase.' + cUDP.udpTable.lower() + '_set.all()')
        except:
            raise Exception('UdpError:  related_name  set not found ' + cUDP.udpTable.lower())

    else:
        keyValue = data.get(cUDP.keyField)
        keyValue = smart_str(keyValue)

        if not keyValue:
            raise Exception('UdpError: Key not found ' + cUDP.keyField + ' in masterReg')

        Qs = UdpModel.objects
        Qs = addFilter(Qs, { cUDP.propertyRef : keyValue  })


    for key in data:
        key = smart_str(key)
        if (not key.startswith(cUDP.propertyPrefix + '__')):
            continue
        UdpCode = key[ len(cUDP.propertyPrefix) + 2 : ]

        QsUdp = addFilter(Qs, { cUDP.propertyName : UdpCode  })
        if QsUdp.exists():
            rUdp = QsUdp[0]
        else:
            rUdp = UdpModel()
            if not cUDP.keyField:
                setattr(rUdp, cUDP.propertyRef, regBase)
            else:
                # Fix: deberia ser un parametro
                setattr(rUdp, cUDP.propertyRef + '_id', keyValue)

            setattr(rUdp, cUDP.propertyName , UdpCode)

        # Genera el ISO para la fecha y valores estandares para numeros y booleanos
        sAux = smart_str(data[key])
        if sAux == 'None':
            sAux = ''
        setattr(rUdp, cUDP.propertyValue , sAux)
        rUdp.save()


def readUdps(rowdict, regBase , cUDP, udpList, udpTypes):

    if cUDP.keyField:
        # si la creacion del detalle no es relacional,
        # se requiere hacer un verdadero Query sobre udpTable
        UdpModel = getDjangoModel(cUDP.udpTable)
        keyValue = rowdict.get(cUDP.keyField , '')
        if not keyValue:
            raise Exception('UdpError: Key not found ' + cUDP.keyField + ' in masterReg')

        keyValue = smart_str(keyValue)
        bAux = True
        Qs = UdpModel.objects
        Qs = addFilter(Qs, { cUDP.propertyRef  : keyValue  })
        cllUDP = Qs.all()


    else:
        # Si no hay keyField, hace el query basado en el registro maestro
        try:
            bAux = eval ('regBase.' + cUDP.udpTable.lower() + '_set.exists()')
            cllUDP = eval ('regBase.' + cUDP.udpTable.lower() + '_set.all()')
        except:
            raise Exception('UdpError:  related_name  set not found ' + cUDP.udpTable.lower())

    if bAux:

        for lUDP in cllUDP:
            udpName = cUDP.propertyPrefix + '__' + getattr(lUDP, cUDP.propertyName  , '')
            if udpName in udpList:
                sAux = getattr(lUDP, cUDP.propertyValue, '')
                sAux = getTypedValue (sAux , udpTypes[ udpName ])
                sAux = smart_str(sAux)

                if udpTypes[ udpName ] == 'html' and type(sAux).__name__ == 'string'  :
                    sAux = sAux.replace('\n', '<br>').replace('\r', '<br>')
                    sAux = sAux.replace('<br><br>', '<br>')
                    sAux = sAux.replace('<td><br>', '<td>').replace('</td><br>', '</td>')
                    sAux = sAux.replace('<th><br>', '<th>').replace('</th><br>', '</th>')
                    sAux = sAux.replace('<tr><br>', '<tr>').replace('</tr><br>', '</tr>')
                    sAux = sAux.replace('<br><td>', '<td>').replace('<br></td>', '</td>')
                    sAux = sAux.replace('<br><th>', '<th>').replace('<br></th>', '</th>')
                    sAux = sAux.replace('<br><tr>', '<tr>').replace('<br></tr>', '</tr>')

                rowdict[ udpName ] = sAux


