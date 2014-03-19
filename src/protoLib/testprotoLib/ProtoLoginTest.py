# -*- encoding: UTF-8 -*-

from django.test import TestCase
import json

from django.http import HttpRequest
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.sessions.backends.base import SessionBase

from protoLib.protoLogin import protoGetUserRights

class MySession(SessionBase):
    def cycle_key(self):
        pass


class LoginTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        userdata = {
            'login': 'adube',
            'password': '123'
        }

        self.user = authenticate(username=userdata['login'], password=userdata['password'])

        self.request = HttpRequest()
        self.request.method = 'POST'
        self.request.POST = userdata

        self.request.session = MySession()

    def tearDown(self):
        pass

    def test_can_authenticate_valid_user(self):
        self.assertTrue(self.user.is_active)

    def test_fails_to_authenticate_invalid_user(self):
        user = authenticate(username='WrongUsername', password='InvalidPassword')
        self.assertTrue(user is None)

    def test_can_login_user(self):
        status = False
        self.assertTrue(self.user.is_active)
        self.assertTrue(self.user is not None)
        try:
            login(self.request, self.user)
            status = True
        except:
            pass
        self.assertTrue(status)

    def test_can_retrieve_user_rights(self):
        returnMessage = json.loads(protoGetUserRights(self.request).content)
        self.assertTrue(returnMessage['success'])

    def test_returns_error_when_user_does_not_exist(self):
        userdata = {
            'login': 'Bob',
            'password': 'BobPasswd'
        }

        self.user = authenticate(username=userdata['login'], password=userdata['password'])
        self.request.POST = userdata
        returnMessage = json.loads(protoGetUserRights(self.request).content)
        self.assertFalse(returnMessage['success'])

    def test_returns_error_when_method_is_not_post(self):
        self.request.method = 'GET'
        returnMessage = json.loads(protoGetUserRights(self.request).content)
        self.assertFalse(returnMessage['success'])
