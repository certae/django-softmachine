# -*- encoding: UTF-8 -*-

from django.test import TestCase
from django.test.client import RequestFactory
from django.test.client import Client

from django.contrib.auth import authenticate
from django.contrib.auth import login

from protoLib.protoLogin import protoGetUserRights


class LoginTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        factory = RequestFactory()
        data = {'login': 'e', 'password': '1'}

        self.user = authenticate(username=data['login'], password=data['password'])

        self.request = factory.post('/protoLib/protoGetUserRights/', data)
        #self.response = protoGetUserRights(request)

    def tearDown(self):
        pass

    def test_can_authenticate_valid_user(self):
        self.assertTrue(self.user.is_active)

    def test_fails_to_authenticate_invalid_user(self):
        user = authenticate(username='WrongUsername', password='InvalidPassword')
        self.assertTrue(user is None)

    def test_can_login_user(self):
        if hasattr(self.request, 'session'):
            login(self.request, self.user)
        else:
            pass
