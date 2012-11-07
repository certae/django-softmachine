# -*- coding: utf-8 -*-

import traceback

from django.utils import simplejson as json
from django.http import HttpResponse 

#from django.contrib.admin.sites import  site


from models import getDjangoModel
from protoActionList import Q2Dict
from utilsConvert import toInteger, toDate,toDateTime,toTime, toFloat, toDecimal, toBoolean
from utilsBase import JSONEncoder, getReadableError
from protoUdp import verifyUdpDefinition, saveUDP



# Error Constants 
ERR_NOEXIST = '<b>ErrType:</b> KeyNotFound<br>The specifique record does not exist'


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
    
    message = '' 
    if request.method != 'POST':  return

    protoMeta = request.POST.get('protoMeta', '')
    rows = request.POST.get('rows', [])

#   Decodifica los eltos 
    protoMeta = json.loads( protoMeta )
    rows = json.loads( rows )

    #protoOption = protoMeta.get('protoOption', '')
    protoConcept = protoMeta.get('protoConcept', '')
    

#   Carga el modelo
    model = getDjangoModel(protoConcept)

#   Genera la clase UPD
    pUDP = protoMeta.get('protoUdp', {})
    cUDP = verifyUdpDefinition( pUDP )

    # Verifica q sea una lista de registros, (no deberia pasar, ya desde Extjs se controla )  
    if type(rows).__name__=='dict':
        rows = [rows]
        
    pList = []
    for data in rows: 
        
        data['_ptStatus'] =  ''

        if myAction['INS']:
            rec = model()
        else: 
            try:
                rec = model.objects.get( pk = data['id']  )
            except:
                data['_ptStatus'] = data['_ptStatus'] +  ERR_NOEXIST + '<br>'
                pList.append( data )
                continue 

        if not myAction['DEL']:
            for key in data:
                if  key == 'id' or key == '_ptStatus' or key == '_ptId': continue
                if (cUDP.udpTable and key.startswith( cUDP.propertyPrefix + '__')): continue 
                try:
                    setRegister( model,  rec, key,  data )
                except Exception,  e:
                    data['_ptStatus'] = data['_ptStatus'] +  getReadableError( e ) 

            # Guarda el idInterno para concatenar registros nuevos en la grilla 
            try:
                _ptId = data['_ptId']
            except: 
                _ptId = ''

            try:
                rec.save()
                
                # Guardar las Udps
                if cUDP.udpTable:  
                    saveUDP( rec, data, cUDP  )

                # -- Los tipos complejos ie. date, generan un error, es necesario hacerlo detalladamente 
                # Convierte el registro en una lista y luego toma solo el primer elto de la lista resultado. 
                data = Q2Dict(protoMeta , [rec] )[0]


            except Exception,  e:
                data['_ptStatus'] =  data['_ptStatus'] +  getReadableError( e ) 
                traceback.print_exc()
            finally: 
                data['_ptId'] =  _ptId
                
        else:  # Action Delete
            try:
                rec.delete()

            except Exception,  e:
                data['_ptStatus'] = data['_ptStatus'] +  getReadableError( e ) 
        
        pList.append( data )
        
        if data.get('_ptStatus', ''): 
            message += data['_ptStatus']  + ';' 
    
                

    context = {
        'totalCount': pList.__len__(),
        'message': message,
        'rows': pList,
        'success': True 
    }

    return json.dumps(context, cls=JSONEncoder)



# ---------------------

def setRegister( model,  rec, key,  data   ):

    try: 
        field = model._meta.get_field( key )
    except: return  

    # Tipo de attr 
    cName = field.__class__.__name__

    if getattr( field, 'editable', False ) == False: return   
    if  cName == 'AutoField': return
    
    # Obtiene el valor 
    value = data[key]
    
    try: 

        if cName == 'CharField' or cName == 'TextField':
            setattr( rec, key, value  )
            return 
         
        elif  cName  == 'ForeignKey':
            keyId = key + '_id'
            value = data[keyId]
            exec( 'rec.' + keyId + ' =  ' + str( value ) )
            return 

        elif cName == 'DateField':     value = toDate( value  )
        elif cName == 'TimeField':     value = toTime( value )
        elif cName == 'DateTimeField': value = toDateTime( value )

        elif cName == 'BooleanField':  value = toBoolean( value )
        elif cName == 'IntegerField':  value = toInteger( value )
        elif cName == 'DecimalField':  value = toDecimal( value )
        elif cName == 'FloatField':    value = toFloat( value )

        setattr( rec, key, value  ) 

    except:
        raise   
