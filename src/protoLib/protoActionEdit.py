# -*- coding: utf-8 -*-

from django.forms.models import model_to_dict
from django.utils import simplejson as json
from django.http import HttpResponse 

from models import getDjangoModel
from protoActions import ERR_EXIST, ERR_NOEXIST,  ERR_UPD, ERR_DEL 
from utilsConvert import toInteger, toDate,toDateTime,toTime, toFloat, toDecimal, toBoolean


def protoCreate(request):
    myAction = { 'INS': True, 'UPD': False, 'DEL': False }
    return protoEdit(request, myAction ) 

def protoUpdate(request):
    myAction = { 'UPD': True, 'INS': False, 'DEL': False }
    return protoEdit(request, myAction )

def protoDelete(request):
    myAction = { 'DEL': True, 'INS': False, 'UPD': False  }
    return protoEdit(request, myAction )


def protoEdit(request, myAction ):
    
    if request.method == 'POST':
        protoConcept = request.GET.get('protoConcept', '')
        protostoreFields = request.GET.get('storeFields', '')
    else: return 

#   Carga la info
    model = getDjangoModel(protoConcept)

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
                if myAction['INS'] and key == 'id': continue
                setRegister( model,  rec, key,  data[key] )
                
            try:
                rec.save()
                data = model_to_dict(rec, fields=[field.name for field in rec._meta.fields])
    
    #            TODO: Guardar las Udps 
    #            for key in data:
    #                if key.startby( 'udp__' ): continue
                
            except: 
                data['_ptStatus'] =  ERR_UPD
        
        else:  # Action Delete
            try:
                rec.delete()
                data['_ptStatus'] =  ''
            except: 
                data['_ptStatus'] =  ERR_DEL
        
        pList.append( data )
                
        
    context = {
        'total': pList.__len__(),
        'data': pList,
        'success': True 
    }
    return HttpResponse(json.dumps(context), mimetype="application/json")

# ---------------

def setRegister( model,  rec, key,  value  ):

    try: 
        field = model._meta.get_field( key )
    except: return  
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
