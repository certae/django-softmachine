# -*- encoding: UTF-8 -*-

import django.utils.simplejson as json

from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, get_backends

from models import UserProfile

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
        pUser = authenticate(username = userName, password = userPwd )
    except:
        pUser = None
        

    userInfo = { 'userName' : userName } 
                 
    if pUser is not None:
        if pUser.is_active:
            login(request, pUser)
            success = True
            userInfo[ 'isStaff' ] = pUser.is_staff  
            userInfo[ 'isSuperUser' ] = pUser.is_superuser  
            userInfo[ 'fullName' ] = pUser.get_full_name()  

            # Profile 
            uProfile, created = UserProfile.objects.get_or_create(user = pUser)
            if uProfile.userHierarchy is not None:
                uOrgTree = uProfile.userHierarchy.treeHierarchy
            else:  uOrgTree = ''

            # permisos adicionales 
            for item in pUser.usershare_set.all() :
                uOrgTree += ',' + item.userHierarchy.treeHierarchy
            
            # Organiza los ids 
            uProfile.userTree = ','.join( set( uOrgTree.split(',')))
            uProfile.save()
            
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


