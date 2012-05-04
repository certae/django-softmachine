# -*- coding: utf-8 -*-

from django.utils import simplejson as json
from django.http import HttpResponse 
from django.contrib.admin.sites import  site


from models import getDjangoModel
from protoGrid import Q2Dict
from protoActions import ERR_NOEXIST  
from utilsConvert import toInteger, toDate,toDateTime,toTime, toFloat, toDecimal, toBoolean
from utilsBase import JSONEncoder, getReadableError, addFilter, verifyUdpDefinition 


def protoCreate(request):
    myAction = { 'INS': True, 'UPD': False, 'DEL': False }
    jContext = protoEdit(request, myAction ) 
    return HttpResponse(jContext, mimetype="application/json")

def protoUpdate(request):
    myAction = { 'UPD': True, 'INS': False, 'DEL': False }
    jContext = protoEdit(request, myAction ) 
    return HttpResponse(jContext, mimetype="application/json")

def protoDelete(request):
    myAction = { 'DEL': True, 'INS': False, 'UPD': False  }
    jContext = protoEdit(request, myAction ) 
    return HttpResponse(jContext, mimetype="application/json")

def protoEdit(request, myAction ):
    
    if request.method == 'POST':
        protoConcept = request.GET.get('protoConcept', '')
        protostoreFields = request.GET.get('storeFields', '')
    else: return 

#   Carga la info
    model = getDjangoModel(protoConcept)
    model_admin = site._registry.get( model )
    protoAdmin = getattr(model_admin, 'protoExt', {})
    
    pUDP = protoAdmin.get( 'protoUdp', {})
    if pUDP: 
        pUDP = verifyUdpDefinition( pUDP )
        prpPrefix = pUDP['propertyPrefix']

    # Verifica q sea una lista de registros, (no deberia pasar, ya desde Extjs se controla )  
    dataList = json.loads(request.POST.keys()[0])['rows']
    if type(dataList).__name__=='dict':
        dataList = [dataList]
        
    pList = []
    for data in dataList: 
        if myAction['INS']:
            rec = model()
        else: 
            try:
                rec = model.objects.get( pk = data['id']  )
            except:
                data['_ptStatus'] =  ERR_NOEXIST
                pList.append( data )
                continue 

        if not myAction['DEL']:
            for key in data:
                if  key == 'id' or key == '_ptStatus' or key == '_ptId': continue
                if (pUDP and key.startswith( prpPrefix + '__')): continue 
                setRegister( model,  rec, key,  data[key] )

            # Guarda el idInterno para concatenar registros nuevos en la grilla 
            try:
                _ptId = data['_ptId']
            except: 
                _ptId = ''

            try:
                rec.save()
                
                # Guardar las Udps
                if pUDP:  saveUDP( rec, data, pUDP  )

                # -- Los tipos complejos ie. date, generan un error, 
                #    de las UDPS y evaluar las posible funciones  
                #    data = model_to_dict(rec, fields=[field.name for field in rec._meta.fields])

                # Convierte el registro en una lista y luego toma solo el primer elto de la lista resultado. 
                data = Q2Dict(protostoreFields , [rec], pUDP )[0]
                data['_ptStatus'] =  ''


            except Exception,  e:
                data['_ptStatus'] =  getReadableError( e ) 
            finally: 
                data['_ptId'] =  _ptId
                
        else:  # Action Delete
            try:
                rec.delete()
                data['_ptStatus'] =  ''

            except Exception,  e:
                data['_ptStatus'] =  getReadableError( e ) 
        
        pList.append( data )
                

    context = {
        'totalCount': pList.__len__(),
        'rows': pList,
        'success': True 
    }
#   return HttpResponse(json.dumps(context), mimetype="application/json")
    return json.dumps(context, cls=JSONEncoder)

# ---------------



def saveUDP( rec,  data, pUDP  ):

    UdpModel = getDjangoModel( pUDP['udpTable'] )

    Qs = UdpModel.objects
    Qs = addFilter( Qs, { pUDP['propertyReference'] : rec.id  } )

    for key in data:
        if (not key.startswith( pUDP['propertyPrefix'] + '__')): continue 

        UdpCode = key.lstrip( pUDP['propertyPrefix'] + '__' ) 
        
        QsUdp = addFilter( Qs, { pUDP['propertyName'] : UdpCode  } )
        if QsUdp.exists():
            rUdp = QsUdp[0]
        else: 
            rUdp = UdpModel()
            setattr( rUdp, pUDP['propertyReference'], rec )
            setattr( rUdp, pUDP['propertyName'] , UdpCode)
            
        setattr( rUdp, pUDP['propertyValue'] , data[key])

        rUdp.save()


# ---------------------

def setRegister( model,  rec, key,  value  ):

    try: 
        field = model._meta.get_field( key )
    except: return  

    if getattr( field, 'editable', False ) == False: return   
    if  field.__class__.__name__ == 'AutoField': return
    
    try: 
#        if field.__class__.__name__ == 'CharField':
#        if field.__class__.__name__ == 'TextField':
        
#        TODO: Implementar la logica de FKeys
#        elif  field.__class__.__name__ == 'ForeignKey':

        if  field.__class__.__name__ == 'DateField':
            value = toDate( value  )
        elif  field.__class__.__name__ == 'DateTimeField':
            value = toDateTime( value )
        elif  field.__class__.__name__ == 'TimeField':
            value = toTime( value )

        elif field.__class__.__name__ == 'IntegerField':
            value = toInteger( value )
        elif field.__class__.__name__ == 'DecimalField':
            value = toDecimal( value )
        elif field.__class__.__name__ == 'FloatField':
            value = toFloat( value )

        elif field.__class__.__name__ == 'BooleanField':
            value = toBoolean( value )

        setattr( rec, key, value  ) 

    except: return  
