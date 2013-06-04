from django.test import TestCase
from django.test.client import RequestFactory
from django.views.generic import TemplateView

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
