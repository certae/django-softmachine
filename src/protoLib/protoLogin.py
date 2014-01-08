# -*- encoding: UTF-8 -*-

import django.utils.simplejson as json
from django.contrib.auth.models import User

from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, authenticate, logout
from django.conf import settings
from django.template import loader

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
    
    # Encode json 
    context = json.dumps( jsondict)
    return HttpResponse(context, mimetype="application/json")

def protoGetPasswordRecovery(request):
    if request.POST.get('email') and request.POST.get('login'):
        try:
            u = User.objects.get(email = request.POST['email'], username = request.POST['login'])
            token = user_token(u)
            link = 'http://%s/protoLib/resetpassword?a=%s&t=%s' % (request.META['HTTP_HOST'], u.pk, token)
            
            email_template_name = 'recovery/recovery_email.txt'
            body = loader.render_to_string(email_template_name).strip()
            message = _(body)
            message += ' %s\n\n%s : %s' % (link, _(u'Utilisateur'), request.POST['login'])
            message += ' \n\n%s' % (_(u'Si vous ne voulez pas réinitialiser votre mot de passe, il suffit d\'ignorer ce message et il va rester inchangé'))
            u.email_user( _('Nouveau mot de passe'), message)
            return JsonSuccess()  
        except:
            return JsonError(_("Utilisateur non trouvé"))  
    
    return HttpResponseRedirect('/')

def resetpassword(request):
    link = '../../protoExt'
    if request.GET.get('a') and request.GET.get('t'):
        u = User.objects.get(pk = request.GET['a'])
        token = user_token(u)
        if request.GET['t'] == token:
            newpass =  User.objects.make_random_password(length=8)
            u.set_password(newpass)
            u.save()
            message = _(u'Votre mot de passe a été réinitialisé ') +' : %s' % (newpass) 
            message += ' \n\n%s : %s' % (_(u'Utilisateur'), u)
            u.email_user( _('Nouveau mot de passe'), message)
            response = HttpResponseRedirect(link)
            response.set_cookie('isPasswordReseted', True)
            return response
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
    
    errMsg =  "Mauvais utilisateur ou mot de passe"
    if pUser is not None:
        if newpass1==newpass2:
            user = User.objects.get(username = userName)
            user.set_password(newpass1)
            user.save()
            if user.email:
                try:
                    message = _(u'Votre mot de passe a été changé : ') + ' %s \n\n%s' % (newpass1, settings.HOST) 
                    user.email_user(_( 'Nouveau mot de passe'), message)
                except:
                    pass
            return JsonSuccess()
        else:
            errMsg = 'Les mots de passe ne correspondent pas!'
    return JsonError(_(errMsg))

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