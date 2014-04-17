# -*- encoding: UTF-8 -*-

from django.test import TestCase
from django.http import HttpRequest
from protoLib.protoDiagram import getEntitiesJSONDiagram, synchDiagramFromDB
import json

def CreateBasicRequest():
    request = HttpRequest()
    request.method = 'POST'
    request.POST['projectID'] = 1

    return request


class ProtoDiagramTest(TestCase):

    def setUp(self):
        self.basic_request = CreateBasicRequest()

    def test_verifying_diagram_entities_in_database(self):
        response = json.loads(getEntitiesJSONDiagram(self.basic_request).content)
        self.assertTrue(response['success'])

    def test_synchDiagramFromDB(self):
        response = json.loads(synchDiagramFromDB(self.basic_request).content)
        self.assertTrue(response['success'])
