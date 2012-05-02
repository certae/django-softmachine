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
ERR_EXIST = 'ERR_EXIST'
ERR_NOEXIST = 'ERR_NOEXIST'
ERR_ADD = 'ERR_ADD'
ERR_UPD = 'ERR_UPD'
ERR_DEL = 'ERR_DEL'



#import tools as utils


def main(request):

    if not request.user.is_authenticated():
        return direct_to_template( request , 'login.html' )
    
    return direct_to_template( request , 'gridWriter.html' )




def protoUpdate(request):
    
    list = []
    success = True
    message = '' 

    if not request.POST:
        return 
    
    dataList = json.loads(request.POST.keys()[0])['data']
    if type(dataList).__name__=='dict':
        dataList = [dataList]

    for data in dataList: 

        try:
            contact = Contact.objects.get( pk = data['id']  )
    
            #DGT: Solo vienen los atributos q se actualizaron, el resto no!!  
            contact.name = data['name']
            contact.email = data['email']
            contact.phone = data['phone']

            try:
                contact.save()
                
                data = model_to_dict(contact, fields=[field.name for field in contact._meta.fields])
                data['_ptStatus'] =  ''

                #OJO Dgt Prueba 
                if data['name'] == '1':
                    data['_ptStatus'] =  ERR_UPD

                list.append(data)
                
            except: 
                data['_ptStatus'] =  ERR_UPD
                list.append( data )

        except:
            data['_ptStatus'] =  ERR_NOEXIST
            list.append( data )


    context = {
        'total': list.__len__(),
        'data': list,
        'success': success, 
        'message' : message 
    }
    return HttpResponse(json.dumps(context), mimetype="application/json")


def protoDelete(request):

    list = []
    success = True
    message = '' 

    if not request.POST:
        return 
    
    dataList = json.loads(request.POST.keys()[0])['data']
    if type(dataList).__name__=='dict':
        dataList = [dataList]

    for data in dataList: 
        try:
            contact = Contact.objects.get( pk = data['id']  )

            try:
                
                #OJO Dgt Prueba 
                if data['name'] == '1':
                    data['_ptStatus'] =  ERR_DEL
                else:
                    contact.delete()
                    data['_ptStatus'] =  ''
                
                list.append( data )

#                list.append(model_to_dict(contact, fields=[field.name for field in contact._meta.fields]))
            except: 
                data['_ptStatus'] =  ERR_DEL
                list.append( data )

        except:
            data['_ptStatus'] =  ERR_NOEXIST
            list.append( data )

    context = {
        'total': list.__len__(),
        'data': list,
        'success': success, 
        'message' : message 
    }
    return HttpResponse(json.dumps(context), mimetype="application/json")




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

