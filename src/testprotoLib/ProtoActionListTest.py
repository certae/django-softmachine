# -*- coding: utf-8 -*-

from pprint import pprint
from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
from django.http import HttpRequest
from django.contrib.auth import authenticate
import django.utils.simplejson as json

from protoLib.protoActionList import protoList


def ProtoActionListTestSuite():
    suite = TestSuite()

    suite.addTest(makeSuite(ProtoActionListTest, 'test'))

    return suite


class ProtoActionListTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        self.request = HttpRequest()
        self.request.POST['login'] = 'adube'
        self.request.POST['password'] = '123'
        self.request.user = authenticate(username=self.request.POST['login'], password=self.request.POST['password'])

    def tearDown(self):
        pass

    def test_method_is_not_POST(self):
        self.request.method = 'GET'

        self.assertTrue(self.request.user.is_authenticated())
        self.assertNotEqual(self.request.method, 'POST')

        response = protoList(self.request)
        data = json.loads(response.content)
        self.assertFalse(data['success'])

    def test_user_is_authenticated_and_method_is_POST(self):
        self.request.method = 'POST'
        self.request.POST['start'] = 0
        self.request.POST['page'] = 1
        self.request.POST['limit'] = 50
        self.request.POST['protoMeta'] = json.dumps({
            'viewCode': 'prototype.Project',
            'viewEntity': 'prototype.Project',
            'localSort': True,
            'protoEntityId': None,
            'jsonField': '',
            'idProperty': 'id',
            'gridConfig': {
                'searchFields': ['smRegStatus', 'smWflowStatus', 'code', 'description']
            },
            'fields': [
                {
                    'name': '__str__',
                    'fkId': 'id',
                    'zoomModel': 'prototype.Project',
                    'type': 'string'
                },
                {
                    'name': 'code',
                    'type': 'string'
                },
                {
                    'name': 'description',
                    'type': 'text'
                },
                {
                    'name': 'id',
                    'type': 'autofield'
                },
                {
                    'name': 'smCreatedBy',
                    'type': 'foreigntext'
                },
                {
                    'name': 'smCreatedOn',
                    'type': 'datetime'
                },
                {
                    'name': 'smModifiedBy',
                    'type': 'foreigntext'
                },
                {
                    'name': 'smModifiedOn',
                    'type': 'datetime'
                },
                {
                    'name': 'smOwningTeam',
                    'type': 'foreigntext'
                },
                {
                    'name': 'smOwningUser',
                    'type': 'foreigntext'
                },
                {
                    'name': 'smRegStatus',
                    'type': 'string'
                },
                {
                    'name': 'smWflowStatus',
                    'type': 'string'
                }
            ],
            'usrDefProps': {'__ptType': 'usrDefProps'}
        })

        response = protoList(self.request)
        data = json.loads(response.content)
        self.assertTrue(data['success'])
