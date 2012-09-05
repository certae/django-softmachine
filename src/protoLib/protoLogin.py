
from django.http import HttpResponse
from protoGrid import getSearcheableFields, getProtoViewName, setDefaultField
from protoLib import protoGrid
from protoField import  setFieldDict
from models import getDjangoModel, ProtoDefinition
from utilsBase import getReadableError 

import django.utils.simplejson as json



def protoGetUserRights(request):
    """ return usr rihts 
    """
    
    if request.method != 'POST':
        return 

    usr = request.POST['login']
    pwd = request.POST['password']
    
    success = ( usr == pwd )
    
    jsondict = {
        'success': success,
        'message': '',
        'metaData':{
            'usr': usr,
            'pwd': pwd,

            #Name of the property from which to retrieve the success attribute. ...
            'successProperty':'success',
            
            #The name of the property which contains a response message. (optional)
            'messageProperty': 'message', 
            }, 
        'rows':[],
        'totalCount': 0, 
    }
    
    # Codifica el mssage json 
    context = json.dumps( jsondict)
    return HttpResponse(context, mimetype="application/json")


