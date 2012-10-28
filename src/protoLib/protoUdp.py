
from models import getDjangoModel
from utilsBase import addFilter


# Para pasar atributos en forma de clase   
class cAux: pass 


def verifyUdpDefinition( pUDP ):
    """ Verifica q todos los valores tengan su definicion y retorna una clase  

    @udpTable         : Nombre de la tabla q aloja las UDPs ( obligatoria )  
    @propertyName     : Nombre de la UDP
    @propertyValue    : Valor str donde se almacenara la Udp  
    @propertyReference: Valor de referencia del objeto base que contiene la cll de Udps ( tabla base )   
    @propertyPrefix   : prefijo usado en el recordSet para diferenciar los campos provenientes de UDP
    @keyField         : keyField ( nombre del campo ) sobre el registro de base,cuando la udp no es un maestroDetalle,
    
    La busqueda normalmente se hace por el registro asociado del ORM esto es mas eficiente, en este caso no 
    se rquiere el keyField pero es posible q la UdpTable no tenga una relacion directa con su tabla base, 
    en este caso debe haber un Id q permita hacer la manipulacion de las UDPs
    """  

    cUDP = cAux()

    if ( pUDP ) : 
        cUDP.udpTable          = pUDP.get( 'udpTable', 'udp' )  
        cUDP.propertyName      = pUDP.get( 'propertyName', 'code')
        cUDP.propertyValue     = pUDP.get( 'propertyValue', 'valueUdp')
        cUDP.propertyPrefix    = pUDP.get( 'propertyPrefix', 'udp')

        cUDP.propertyReference = pUDP.get( 'propertyReference', '')
        cUDP.keyField          = pUDP.get( 'keyField', '')
    else: 
        cUDP.udpTable          = ''  
        cUDP.propertyName      = ''
        cUDP.propertyValue     = ''
        cUDP.propertyReference = ''
        cUDP.propertyPrefix    = ''
        cUDP.keyField          = ''
    
    return cUDP    


def saveUDP( rec,  data, cUDP  ):

    UdpModel = getDjangoModel( cUDP.udpTable )
    
    # si keyField no esta definido implica una relacion MD  
    if not cUDP.keyField: 
        keyValue = rec.id
    else: 
        keyValue = rec.get( cUDP.keyField  )

    Qs = UdpModel.objects
    Qs = addFilter( Qs, { cUDP.propertyReference : keyValue  } )

    for key in data:
        if (not key.startswith( cUDP.propertyPrefix + '__')): continue 

        UdpCode = key.lstrip( cUDP.propertyPrefix + '__' ) 
        
        QsUdp = addFilter( Qs, { cUDP.propertyName : UdpCode  } )
        if QsUdp.exists():
            rUdp = QsUdp[0]
        else: 
            rUdp = UdpModel()
            setattr( rUdp, cUDP.propertyReference, rec )
            setattr( rUdp, cUDP.propertyName , UdpCode)
            
        setattr( rUdp, cUDP.propertyValue , data[key])

        rUdp.save()

def readUdps( rowdict, regBase , cUDP, udpProps ):

    # Intenta con el maestro detalle
    try: 
        bAux = eval ( 'regBase.' + cUDP.udpTable + '_set.exists()' ) 
        if bAux: cllUDP = eval ( 'regBase.' + cUDP.udpTable + '_set.all()' ) 
    except: 
        bAux = False


    if ( not bAux ) and ( cUDP.keyField ) : 
        UdpModel = getDjangoModel( cUDP.udpTable )
        keyValue = rowdict.get( cUDP.keyField , '' )
    
        if keyValue:
            bAux = True
            Qs = UdpModel.objects
            Qs = addFilter( Qs, { cUDP.propertyReference : keyValue  } )
            cllUDP = Qs.all()

    
    # y hace el query basado en el registro maestro 
    # si la creacion del detalle no es relacional, 
    # se requiere hacer un verdadero Query sobre udpTable                    
    if bAux: 
        
        for lUDP in cllUDP:
            prpGridName = cUDP.propertyPrefix + '__' + getattr( lUDP, cUDP.propertyName  , '') 
            if prpGridName in udpProps:
                sAux = getattr( lUDP, cUDP.propertyValue, '' ).replace( '\n', '<br>').replace( '\r', '<br>')  
                sAux = sAux.replace( '<br><br>', '<br>')
                sAux = sAux.replace( '<td><br>', '<td>').replace( '</td><br>', '</td>')
                sAux = sAux.replace( '<th><br>', '<th>').replace( '</th><br>', '</th>')
                sAux = sAux.replace( '<tr><br>', '<tr>').replace( '</tr><br>', '</tr>')
    
                sAux = sAux.replace( '<br><td>', '<td>').replace( '<br></td>', '</td>')
                sAux = sAux.replace( '<br><th>', '<th>').replace( '<br></th>', '</th>')
                sAux = sAux.replace( '<br><tr>', '<tr>').replace( '<br></tr>', '</tr>')
    
                rowdict[ prpGridName ] =  sAux 
