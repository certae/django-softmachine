from django.test import TestCase
from django.test.client import RequestFactory
from django.test.client import Client

from protoLib.protoLogin import protoGetUserRights


class LoginTest(TestCase):

    def setUp(self):
        self.factory = RequestFactory()

    def tearDown(self):
        pass

    def test_can_send_login_information(self):
        data = {'login': 'e', 'password': '1'}
        request = self.factory.post('/protoLib/protoGetUserRights/', data)
        response = protoGetUserRights(request)
        self.assertEqual(response.status_code, 200)

    def test_can_retrieve_javascript_app_files(self):
        client = Client(enforce_csrf_checks=False)
        response = client.get('/static/js/app.js')
        self.assertEqual(response.status_code, 200)
