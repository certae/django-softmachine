# -*- encoding: UTF-8 -*-

from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, get_backends

import django.utils.simplejson as json



def protoGetUserRights(request):
    """ return usr rihts 
    """
    
    if request.method != 'POST':
        return 

    userName = request.POST['login']
    userPwd  = request.POST['password']

    errMsg = ''
    success = False  

    try:
        user = authenticate(username = userName, password = userPwd )
    except:
        user = None
        

    userInfo = { 'userName' : userName } 
                 
    if user is not None:
        if user.is_active:
            login(request, user)
            success = True
            userInfo[ 'isStaff' ] = user.is_staff  
            userInfo[ 'isSuperUser' ] = user.is_superuser  
            userInfo[ 'fullName' ] = user.get_full_name()  
            
        else:
            # Return a 'disabled account' error message
            errMsg =  "Cet utilisateur est desactiv&eacute;"   

    elif userName == '':
        userInfo[ 'fullName' ] = 'readOnly User'
        success = True

    else:
        # Return an 'invalid login' error message.
        errMsg =  "Mauvais utilisateur ou mot de passe"  
    
    
    jsondict = {
        'success': success,
        'message': errMsg,
        'metaData':{
            'successProperty':'success',
            'messageProperty': 'message', 
            },
        'userInfo' : userInfo, 
        'rows':[],
        'totalCount': 0, 
    }
    
    # Codifica el mssage json 
    context = json.dumps( jsondict)
    return HttpResponse(context, mimetype="application/json")


