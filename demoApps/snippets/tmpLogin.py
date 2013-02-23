# -*- encoding: UTF-8 -*-

from django.shortcuts import render_to_response, get_list_or_404
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.template import RequestContext


from django.conf import settings
from django.utils.translation import gettext as _
from django.contrib.auth.decorators import login_required



@publish
def logout(request):
    from django.contrib.auth import logout as dlogout
    dlogout(request)
    return HttpResponseRedirect('/')


def user_token(user):
    import hashlib
    salt = settings.SECRET_KEY
    hash = hashlib.md5(user.email + salt).hexdigest()
    return hash
    
@publish
@login_required
def changepassword(request):
    newpass1 = request.POST['new1']
    newpass2 = request.POST['new2']
    current = request.POST['current']
    if request.user.check_password(current):
        if newpass1==newpass2:
            request.user.set_password(newpass1)
            request.user.save()
            if request.user.email:
                try:
                    message = _(u'Votre mot de passe a été réinitialisé : ') + ' %s \n\n%s' % (newpass1, settings.HOST) 
                    request.user.email_user(_( 'Nouveau mot de passe'), message)
                except:
                    pass
            return utils.JsonSuccess()
    return utils.JsonError(_('Les mots de passe ne correspondent pas'))
    
 
    
   
   
@publish
def resetpassword(request):
    if request.GET.get('a') and request.GET.get('t'):
        u = User.objects.get(pk = request.GET['a'])
        token = user_token(u)
        if request.GET['t'] == token:
            newpass =  User.objects.make_random_password(length=8)
            u.set_password(newpass)
            u.save()
            message = _(u'Votre mot de passe a été réinitialisé ') +' : %s \n\n%s' % (newpass, settings.HOST) 
            u.email_user( _('Nouveau mot de passe'), message)
            # auto log user
            backend = get_backends()[0]
            u.backend = "%s.%s" % (backend.__module__, backend.__class__.__name__)
            authenticate(user = u)
            login(request, u)
    return HttpResponseRedirect('/')
    
@publish
def lostpassword(request):
    if request.POST.get('email'):
        try:
            u = User.objects.get(email = request.POST['email'])
            token = user_token(u)
            link = '%s/apps/login/resetpassword?a=%s&t=%s' % (settings.HOST, u.pk, token)
            message = _(u'Vous avez demandé à réinitialiser votre mot de passe.\n\nCliquez ici pour le réinitialiser ')
            message += '%s\n\n%s\n\n%s : %s' % (link, settings.HOST, _(u'Demande effectuée depuis'), request.META.get('REMOTE_ADDR', '?'))
            u.email_user( _('Nouveau mot de passe'), message)
            return utils.JsonSuccess()  
        except:
            return utils.JsonError(_("Email inconnu"))  
    
    return HttpResponseRedirect('/')



#  ********************************** ************************************


# -*- encoding: UTF-8 -*-


from django.conf import settings
from django.contrib.auth import authenticate, login, logout , get_backends

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Permission
from django.contrib.auth.models import User

from django.contrib.contenttypes.models import ContentType
from django.core.context_processors import csrf

from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, get_list_or_404
from django.template import  Context, RequestContext

from django.template.loader import get_template 
from django.utils.translation import gettext as _

from tools import template_config    
from decorators import publish

#------------------------------------------------------------------------------


def view_login(request):

    if request.method == 'POST':
        user = request.POST['login']
        apass = request.POST['password']
        user = authenticate(username=user, password=apass)
        if user is not None:
            if user.is_active:
                login(request, user)
                resp = utils.JsonSuccess({'redirect':request.GET.get('next', '/')  })
                resp = utils.set_cookie(resp, 'username', user.username)
                resp = utils.set_cookie(resp, 'email', user.email)
                return resp
            else:
                # Return a 'disabled account' error message
                return utils.JsonError(_(u"Cet utilisateur est desactiv&eacute;") )   
        else:
            # Return an 'invalid login' error message.
            return utils.JsonError(_("Mauvais utilisateur ou mot de passe") )  
        
        
#    template = get_template('login.html');
#    cfg = template_config(request)
#    cfg.section = 'a'
#    
#    variables = RequestContext( request,
#     {
#        'success':'true',
#        'cfg' : cfg
#      }                  
#    )
#    
#    if request.method == 'POST':
#        username = request.POST['username']
#        password = request.POST['password']
#        user = authenticate(username=username, password=password)
#        
#        if user is not None:
#            if user.is_active:
#                login(request,user)
#                base_url = site_config('base_url')
#                return HttpResponseRedirect( base_url )
#                # Redirect to a success page.
#            #else:
#            #   return HttpResponse('inactif')
#        else:
#            variables = RequestContext( request,
#             {
#                'success':'false',
#                'cfg' : cfg
#             }                  
#            )
#
#   
#    output = template.render(variables)
#        
#    return HttpResponse(output)
   
#------------------------------------------------------------------------------


def main(request):
    section = 'accueil'
    
    response = before_execute_view(request)
    if not response == True:
        return response
    
    #user = User.objects.create_user('test_user', 'lennon@thebeatles.com', '123456')
    
    #user = User.objects.filter(username='pgrimard')
    #user.is_superuser = True
    #user.save()
    
    
    #user = User.objects.get(username__exact='pgrimard')
    #user.is_superuser = True
    #user.save() 
   
    template = get_template('pages/default.html');
    cfg = template_config(request)
    cfg.section = section
   
    variables = RequestContext( request,
      {
         'cfg': cfg
      }                  
    )
   
    output = template.render(variables);
    return HttpResponse(output)

#------------------------------------------------------------------------------

def invalid_right(request):
    #user = User.objects.get(username__exact='pgrimard')
    #user.is_superuser = True
    #user.save() 
   
    template = get_template('pages/invalid_right.html');
    cfg = template_config(request)
    cfg.section = 'a'
   
    variables = RequestContext( request,
      {
        'cfg': cfg
     }                  
    )
   
    output = template.render(variables);
    return HttpResponse(output)

   
def view_logout(request):
    logout(request)
    return HttpResponseRedirect(base_url + 'login')
   



@publish
def default(request):
    if request.user.is_authenticated() and request.GET.get('next'):
        return HttpResponseRedirect(request.GET['next'])
    
    from django.template import RequestContext
    if request.method == 'POST':
        user = request.POST['login']
        apass = request.POST['password']
        user = authenticate(username=user, password=apass)
        if user is not None:
            if user.is_active:
                login(request, user)
                resp = utils.JsonSuccess({'redirect':request.GET.get('next', '/')  })
                resp = utils.set_cookie(resp, 'username', user.username)
                resp = utils.set_cookie(resp, 'email', user.email)
                return resp
            else:
                # Return a 'disabled account' error message
                return utils.JsonError(_(u"Cet utilisateur est desactiv&eacute;") )   
        else:
            # Return an 'invalid login' error message.
            return utils.JsonError(_("Mauvais utilisateur ou mot de passe") )  

    params = {}
    params['username'] = utils.get_cookie(request, 'username') or ''
    params['email'] = utils.get_cookie(request, 'email') or ''
    response = render_to_response('login.html', params, context_instance=RequestContext(request))
    return response


@publish
def logout(request):
    from django.contrib.auth import logout as dlogout
    dlogout(request)
    return HttpResponseRedirect('/')


def user_token(user):
    import hashlib
    salt = settings.SECRET_KEY
    hash = hashlib.md5(user.email + salt).hexdigest()
    return hash
    
@publish
@login_required
def changepassword(request):
    newpass1 = request.POST['new1']
    newpass2 = request.POST['new2']
    current = request.POST['current']
    if request.user.check_password(current):
        if newpass1==newpass2:
            request.user.set_password(newpass1)
            request.user.save()
            if request.user.email:
                try:
                    message = _(u'Votre mot de passe a été réinitialisé : ') + ' %s \n\n%s' % (newpass1, settings.HOST) 
                    request.user.email_user(_( 'Nouveau mot de passe'), message)
                except:
                    pass
            return utils.JsonSuccess()
    return utils.JsonError(_('Les mots de passe ne correspondent pas'))
    
 
    
   
   
@publish
def resetpassword(request):
    if request.GET.get('a') and request.GET.get('t'):
        u = User.objects.get(pk = request.GET['a'])
        token = user_token(u)
        if request.GET['t'] == token:
            newpass =  User.objects.make_random_password(length=8)
            u.set_password(newpass)
            u.save()
            message = _(u'Votre mot de passe a été réinitialisé ') +' : %s \n\n%s' % (newpass, settings.HOST) 
            u.email_user( _('Nouveau mot de passe'), message)
            # auto log user
            backend = get_backends()[0]
            u.backend = "%s.%s" % (backend.__module__, backend.__class__.__name__)
            authenticate(user = u)
            login(request, u)
    return HttpResponseRedirect('/')
    
@publish
def lostpassword(request):
    if request.POST.get('email'):
        try:
            u = User.objects.get(email = request.POST['email'])
            token = user_token(u)
            link = '%s/apps/login/resetpassword?a=%s&t=%s' % (settings.HOST, u.pk, token)
            message = _(u'Vous avez demandé à réinitialiser votre mot de passe.\n\nCliquez ici pour le réinitialiser ')
            message += '%s\n\n%s\n\n%s : %s' % (link, settings.HOST, _(u'Demande effectuée depuis'), request.META.get('REMOTE_ADDR', '?'))
            u.email_user( _('Nouveau mot de passe'), message)
            return utils.JsonSuccess()  
        except:
            return utils.JsonError(_("Email inconnu"))  
    
    return HttpResponseRedirect('/')


#  ******************************


#from tco.app_admin.template_config import *
from models import  *
from django.http import HttpResponseRedirect, HttpResponse
from tco.settings import BASE_URL

table_perm = 'app_admin_permissionadmin'
base_admin_url =  BASE_URL + 'administration'

def before_execute_view(request, section = ''):
    
    base_url = BASE_URL
    #base_url = site_config('base_url')
    if not request.user.is_authenticated():
        return HttpResponseRedirect( base_url + 'login')
    
    
    
    if (section == 'administration' and not request.user.is_superuser):
        return HttpResponseRedirect( base_url + 'invalid_right')
        
    else: 
        perm = list(PermissionAdmin.objects.filter(user=request.user.id))
        if (len(perm) == 0):
            return HttpResponseRedirect( base_url + 'invalid_right')
        elif (len(perm) == 1):
            if  (section == 'tco'):
                if (perm[0].tco_right_read == 0):
                    return HttpResponseRedirect( base_url + 'invalid_right')
                elif ( request.method == 'POST' and perm[0].tco_right_write == 0   ):
                    return HttpResponseRedirect( base_url + 'invalid_right')
            if  (section == 'profil'):
                if (perm[0].profil_right_read == 0):
                    return HttpResponseRedirect( base_url + 'invalid_right')
                elif ( request.method == 'POST' and perm[0].profil_right_write == 0   ):
                    return HttpResponseRedirect( base_url + 'invalid_right')
            if  (section == 'scenario'):
                if (perm[0].scenario_right_read == 0):
                    return HttpResponseRedirect( base_url + 'invalid_right')
                elif ( request.method == 'POST' and perm[0].scenario_right_write == 0   ):
                    return HttpResponseRedirect( base_url + 'invalid_right')
            if  (section == 'mesure'):
                if (perm[0].mesure_right_read == 0):
                    return HttpResponseRedirect( base_url + 'invalid_right')
                elif ( request.method == 'POST' and perm[0].mesure_right_write == 0   ):
                    return HttpResponseRedirect( base_url + 'invalid_right')
            if  (section == 'rapports'):
                if (perm[0].rapport_right_read == 0):
                    return HttpResponseRedirect( base_url + 'invalid_right')
            
    
    return True

def getUserRights(user_id):
    perm = list(PermissionAdmin.objects.filter(user=user_id))
    if (len(perm) == 1):
        return perm[0]
    else:
        return PermissionAdmin()



********************************


# Create your views here.

from django.http import HttpResponse
from django.template import  Context, RequestContext
from django.template.loader import get_template 
from tco.app_admin.security import *
from tco.app_admin.template_config import *    
from django.contrib.auth import authenticate, login, logout
from django.core.context_processors import csrf
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission

from tco.app_admin.forms import *
from django.contrib.auth.models import Permission
from tco.app_admin.models import *
from django.forms.formsets import formset_factory
from tco.app_admin.security import *
from django.contrib.auth.models import User

def main(request):
   section = 'profil'
    
   response = before_execute_view(request)
   if not response == True:
        return response
    
   template = get_template('pages/profil/default.html');
   cfg = template_config(request)
   cfg.section = section
   
   variables = RequestContext( request,
     {
        'cfg': cfg
     }                  
   )
   
   output = template.render(variables);
   return HttpResponse(output)

def view_changepassword(request):
   section = 'profil'
    
   response = before_execute_view(request)
   if not response == True:
        return response
    
   template = get_template('pages/profil/changepassword.html');
   cfg = template_config(request)
   cfg.section = section
   
   success = 0
   
   if request.method == 'POST':
        user = User.objects.get(pk=request.user.id)
        success = 1
        password =  request.REQUEST['password']
        user.set_password(password)
        user.save()
   
   variables = RequestContext( request,
     {
        'cfg': cfg,
        'success': success
     }                  
   )
   
   output = template.render(variables);
   return HttpResponse(output)


def checkbox_good_value(value):
    if (value == True or value == 'True'):
        return 'on'
    
    return ''

def view_rights(request):
   section = 'profil'
    
   response = before_execute_view(request)
   if not response == True:
        return response
    
   template = get_template('pages/profil/rights.html');
   cfg = template_config(request)
   
   user_id = request.user.id
   user = User.objects.get(pk=user_id)
   perms= list(PermissionAdmin.objects.filter(user=user))
   
   if (len(perms) == 1):
        perm = perms[0]
   else:
        perm = PermissionAdmin()
   
   success = 0
   
   base_url = site_config('base_url')
   cfg.section = section
   data = { 
            'username': user.username ,
            'password' : user.password,
            'email': user.email ,
            'superuser': checkbox_good_value(user.is_superuser),
            'tco_right_read' : checkbox_good_value(perm.tco_right_read),
            'tco_right_write' : checkbox_good_value(perm.tco_right_write),
            'param_right_read' : checkbox_good_value(perm.param_right_read),
            'param_right_write' : checkbox_good_value(perm.param_right_write),
            'profil_right_read' : checkbox_good_value(perm.profil_right_read),
            'profil_right_write' : checkbox_good_value(perm.profil_right_write),
            'scenario_right_read' :checkbox_good_value(perm.scenario_right_read),
            'scenario_right_write' : checkbox_good_value(perm.scenario_right_write),
            'mesure_right_read' : checkbox_good_value(perm.mesure_right_read),
            'mesure_right_write' : checkbox_good_value(perm.mesure_right_write),
            'rapport_right_read' : checkbox_good_value(perm.rapport_right_read),
            
            }
   form = UserForm( initial=data )
   
   variables = RequestContext( request,
     {
        'cfg': cfg,
        'form' : form,
        'success' : success,
        'perm' : perm
     })
   
   output = template.render(variables);
   return HttpResponse(output) 
   
   
   
   ************************************************
   
   
#from tco.app_admin.template_config import *
from models import  *
from django.http import HttpResponseRedirect, HttpResponse
from tco.settings import BASE_URL

table_perm = 'app_admin_permissionadmin'
base_admin_url =  BASE_URL + 'administration'

def before_execute_view(request, section = ''):
    
    base_url = BASE_URL
    #base_url = site_config('base_url')
    if not request.user.is_authenticated():
        return HttpResponseRedirect( base_url + 'login')
    
    
    
    if (section == 'administration' and not request.user.is_superuser):
        return HttpResponseRedirect( base_url + 'invalid_right')
        
    else: 
        perm = list(PermissionAdmin.objects.filter(user=request.user.id))
        if (len(perm) == 0):
            return HttpResponseRedirect( base_url + 'invalid_right')
        elif (len(perm) == 1):
            if  (section == 'tco'):
                if (perm[0].tco_right_read == 0):
                    return HttpResponseRedirect( base_url + 'invalid_right')
                elif ( request.method == 'POST' and perm[0].tco_right_write == 0   ):
                    return HttpResponseRedirect( base_url + 'invalid_right')
            if  (section == 'profil'):
                if (perm[0].profil_right_read == 0):
                    return HttpResponseRedirect( base_url + 'invalid_right')
                elif ( request.method == 'POST' and perm[0].profil_right_write == 0   ):
                    return HttpResponseRedirect( base_url + 'invalid_right')
            if  (section == 'scenario'):
                if (perm[0].scenario_right_read == 0):
                    return HttpResponseRedirect( base_url + 'invalid_right')
                elif ( request.method == 'POST' and perm[0].scenario_right_write == 0   ):
                    return HttpResponseRedirect( base_url + 'invalid_right')
            if  (section == 'mesure'):
                if (perm[0].mesure_right_read == 0):
                    return HttpResponseRedirect( base_url + 'invalid_right')
                elif ( request.method == 'POST' and perm[0].mesure_right_write == 0   ):
                    return HttpResponseRedirect( base_url + 'invalid_right')
            if  (section == 'rapports'):
                if (perm[0].rapport_right_read == 0):
                    return HttpResponseRedirect( base_url + 'invalid_right')
            
    
    return True

def getUserRights(user_id):
    perm = list(PermissionAdmin.objects.filter(user=user_id))
    if (len(perm) == 1):
        return perm[0]
    else:
        return PermissionAdmin()   



def proxy_GetToPost(request):
    """ transfer the GET into a POST form then submit to $target url """
    data = request.GET.copy()
    uri = data.get('target')
    del data['target']
    html  = '<body><form name=form method=POST action="%s" >' % uri
    for item in data.keys():
        html += '<input type=hidden name="%s" value="%s">' % (item, data[item])
    html += '</form><script language="javascript">document.form.submit()</script></body>'
    return HttpResponse(html)
    
    
def getUrl(url, data = None, method = 'GET', headers = {}):
    #print 'getUrl', url
    import urllib, urllib2
    if data:
        data = urllib.urlencode(data)
        if method == 'GET':
            url += '?%s' % data
            data = None
    #print 'getUrl', url , data
    req = urllib2.Request(url, data, headers)
    #try:
    response = urllib2.urlopen(req)
    #except urllib2.HTTPError, _code:
    #    return _code
    
    return response.read()


    