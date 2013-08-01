# -*- encoding: UTF-8 -*-

import django.utils.simplejson as json

from django.http import HttpResponse
from django.contrib.auth import login, authenticate

from protoLib.protoAuth import getUserProfile
from protoLib.utilsWeb import JsonError, JsonSuccess


def protoGetUserRights(request):
    if request.method != 'POST':
        return JsonError('invalid message')

    userName = request.POST['login']
    userPwd = request.POST['password']

    errMsg = ''
    success = False
    language = None

    try:
        pUser = authenticate(username=userName, password=userPwd)
    except:
        pUser = None

    userInfo = {'userName': userName}

    if pUser is not None:
        if pUser.is_active:
            login(request, pUser)
            success = True
            userInfo['isStaff'] = pUser.is_staff
            userInfo['isSuperUser'] = pUser.is_superuser
            userInfo['fullName'] = pUser.get_full_name()
            language = getUserProfile(pUser, 'login', userName)
        else:
            errMsg = "Cet utilisateur est desactiv&eacute;"

    else:
        errMsg = "Mauvais utilisateur ou mot de passe"

    jsondict = {
        'success': success,
        'message': errMsg,
        'userInfo': userInfo,
        'language': language
    }

    context = json.dumps(jsondict)
    return HttpResponse(context, mimetype="application/json")
