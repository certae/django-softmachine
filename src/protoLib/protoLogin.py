# -*- encoding: UTF-8 -*-

import django.utils.simplejson as json

from django.http import HttpResponse
from django.contrib.auth import login, authenticate
<<<<<<< HEAD

from protoAuth import getUserProfile
from utilsWeb import JsonError, JsonSuccess


def protoGetUserRights(request):
    """ return usr rihts
    """

=======

from protoLib.protoAuth import getUserProfile
from protoLib.utilsWeb import JsonError, JsonSuccess


def protoGetUserRights(request):
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
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
<<<<<<< HEAD

            # Si es login retorna la lengua del usuario
            language = getUserProfile(pUser, 'login', userName)

        else:
            # Return a 'disabled account' error message
            errMsg = "Cet utilisateur est desactiv&eacute;"

    else:
        # Return an 'invalid login' error message.
=======
            language = getUserProfile(pUser, 'login', userName)
        else:
            errMsg = "Cet utilisateur est desactiv&eacute;"

    else:
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        errMsg = "Mauvais utilisateur ou mot de passe"

    jsondict = {
        'success': success,
        'message': errMsg,
        'userInfo': userInfo,
        'language': language
    }

<<<<<<< HEAD
    # Codifica el mssage json
=======
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    context = json.dumps(jsondict)
    return HttpResponse(context, mimetype="application/json")
