# -*- coding: utf-8 -*-

from django.test import TestCase
from django.http import HttpRequest
from django.contrib.auth import authenticate
import json


class SheetConfigRepTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        self.request = HttpRequest()
        self.request.method = 'POST'
        self.request.POST['login'] = 'adube'
        self.request.POST['password'] = '123'
        self.request.user = authenticate(username=self.request.POST['login'], password=self.request.POST['password'])
        self.request.POST['viewCode'] = 't_project'

    def tearDown(self):
        pass

    def test_sheetconfig(self):
        self.assertTrue(self.request.user.is_authenticated())


class ProtoCSVTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        self.request = HttpRequest()
        self.request.method = 'POST'
        self.request.POST['login'] = 'adube'
        self.request.POST['password'] = '123'
        self.request.user = authenticate(username=self.request.POST['login'], password=self.request.POST['password'])
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

    def tearDown(self):
        pass

    def test_protocsv(self):
        self.assertTrue(self.request.user.is_authenticated())
