# -*- encoding: UTF-8 -*-

from pprint import pprint
from django.test import TestCase
from django.test.client import Client

from django.http import HttpRequest
from django.contrib.auth import authenticate
from django.contrib.auth import login

from protoLib.protoLogin import protoGetUserRights


class LoginTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        # Utiliser HttpRequest object
        data = {'login': 'adube', 'password': '123'}

        self.user = authenticate(username=data['login'], password=data['password'])

        self.request = HttpRequest()
        self.request.method = 'POST'
        self.request.POST = data

    def tearDown(self):
        pass

    def test_can_authenticate_valid_user(self):
        self.assertTrue(self.user.is_active)

    def test_fails_to_authenticate_invalid_user(self):
        user = authenticate(username='WrongUsername', password='InvalidPassword')
        self.assertTrue(user is None)

    def test_can_login_user(self):
        pass

    def test_can_retrieve_user_rights(self):
        pass
