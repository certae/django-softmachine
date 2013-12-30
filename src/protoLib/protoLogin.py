# -*- encoding: UTF-8 -*-

import django.utils.simplejson as json
from django.contrib.auth.models import User

from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, authenticate, logout 
from django.conf import settings

from protoAuth import getUserProfile
from utilsWeb import JsonError, JsonSuccess 
from django.utils.translation import gettext as _

def protoGetUserRights(request):
    """ return usr rihts 
    """
    
    if request.method != 'POST':
        return JsonError( 'invalid message' ) 

    userName = request.POST['login']
    userPwd  = request.POST['password']

    errMsg = ''
    success = False
    language = None   

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

            # Si es login retorna la lengua del usuario  
            language = getUserProfile( pUser, 'login', userName ) 
            
        else:
            # Return a 'disabled account' error message
            errMsg =  "Cet utilisateur est desactiv&eacute;"   

    else:
        # Return an 'invalid login' error message.
        errMsg =  "Mauvais utilisateur ou mot de passe"  
    
    
    jsondict = {
        'success': success,
        'message': errMsg,
        'userInfo' : userInfo,
        'language' : language  
    }
    
    # Codifica el mssage json 
    context = json.dumps( jsondict)
    return HttpResponse(context, mimetype="application/json")

def protoGetPasswordRecovery(request):
    if request.POST.get('email'):
        try:
            u = User.objects.get(email = request.POST['email'])
            token = user_token(u)
            link = '%s/protoLib/resetpassword?a=%s&t=%s' % (request.META['HTTP_HOST'], u.pk, token)
            newpass =  User.objects.make_random_password(length=8)
            u.set_password(newpass)
            u.save()
            # Your password has been reset : 
            message = _(u'Your password has been reseted ') +' : %s \n\nClick here to change your password ' % (newpass) 
            message += '%s\n\n%s\n\n%s : %s' % (link, request.META['HTTP_HOST'], _(u'Request made from'), request.META.get('REMOTE_ADDR', '?'))
            u.email_user( _('New password'), message)
            return JsonSuccess()  
        except:
            return JsonError(_("Email unknown"))  
    
    return HttpResponseRedirect('/')

def resetpassword(request):
    link = '../../protoExt'
    if request.GET.get('a') and request.GET.get('t'):
        u = User.objects.get(pk = request.GET['a'])
        token = user_token(u)
        if request.GET['t'] == token:
            link = '../changePassword'
    return HttpResponseRedirect(link)

def changepassword(request):
    
    if request.method != 'POST':
        return JsonError( 'invalid message' ) 
    
    newpass1 = request.POST['newPassword1']
    newpass2 = request.POST['newPassword2']
    userName = request.POST['login']
    userPwd  = request.POST['current']

    try:
        pUser = authenticate(username = userName, password = userPwd )
    except:
        pUser = None
        
    if pUser is not None:
        if newpass1==newpass2:
            user = User.objects.get(username = userName)
            user.set_password(newpass1)
            user.save()
            if user.email:
                try:
                    message = _(u'Your password has been changed : ') + ' %s \n\n%s' % (newpass1, settings.HOST) 
                    user.email_user(_( 'Password changed'), message)
                except:
                    pass
            return JsonSuccess()
    return JsonError(_('Passwords do not match'))

def user_token(user):
    import hashlib
    salt = settings.SECRET_KEY
    localHash = hashlib.md5(user.email + salt).hexdigest()
    return localHash

def protoLogout(request):
    
    logout(request)
    return JsonSuccess( { 'message': 'Ok' } )

#     from django.views.generic.simple import direct_to_template

#     from django.shortcuts import render_to_response
#     return render_to_response("protoExt.html")
     
