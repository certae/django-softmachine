# -*- coding: utf-8 -*-

from django.db import transaction
from django.http import HttpResponse
from django.template import RequestContext
from django.forms.models import model_to_dict
from django.shortcuts import render_to_response, get_object_or_404
from django.utils.translation import gettext as __
from django.contrib import messages
from django.contrib.auth.decorators import login_required

from models import getDjangoModel
from django.core import serializers
from django.utils import simplejson as json


from django.views.generic.simple import direct_to_template
from django.http import Http404, HttpResponse, HttpResponseRedirect



#import tools as utils

def main(request):

    if not request.user.is_authenticated():
        return direct_to_template( request , 'login.html' )
    
    return direct_to_template( request , 'gridWriter.html' )



from django.contrib.auth import authenticate, login, logout , get_backends


def loginPt(request):

    success = True
    message = '' 

    if not request.POST:
        return 

    userN = request.POST['login']
    passK = request.POST['password']
    
    user = authenticate(username=userN, password= passK)

    if user is not None:
        if user.is_active:
            login( request, user)
        else:
            success = False
            message = 'Cet utilisateur est desactiv&eacute;' 
    else:
        success = False
        message = 'Mauvais utilisateur ou mot de passe' 

    context = {
        'success': success, 
        'message' : message 
    }
    return HttpResponse(json.dumps(context), mimetype="application/json")





#  *********************

try:
    from functools import wraps
except ImportError:
    from django.utils.functional import wraps  # Python 2.4 fallback.

from django.utils.translation import ugettext as _
from django.contrib.admin.forms import AdminAuthenticationForm
from django.contrib.auth.views import login
from django.contrib.auth import REDIRECT_FIELD_NAME

def staff_member_required(view_func):
    """
    Decorator for views that checks that the user is logged in and is a staff
    member, displaying the login page if necessary.
    """
    def _checklogin(request, *args, **kwargs):
        if request.user.is_active and request.user.is_staff:
            # The user is valid. Continue to the admin page.
            return view_func(request, *args, **kwargs)

        assert hasattr(request, 'session'), "The Django admin requires session middleware to be installed. Edit your MIDDLEWARE_CLASSES setting to insert 'django.contrib.sessions.middleware.SessionMiddleware'."
        defaults = {
            'template_name': 'admin/login.html',
            'authentication_form': AdminAuthenticationForm,
            'extra_context': {
                'title': _('Log in'),
                'app_path': request.get_full_path(),
                REDIRECT_FIELD_NAME: request.get_full_path(),
            },
        }
        return login(request, **defaults)
    return wraps(view_func)(_checklogin)

