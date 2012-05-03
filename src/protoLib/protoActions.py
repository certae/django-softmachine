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



# Error Constants 
ERR_NOEXIST = '<b>ErrType:</b> KeyNotFound<br>The specifique record does not exist'

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

