from django.test import TestCase
from django.test.client import RequestFactory
from django.test.client import Client

from protoLib.protoLogin import protoGetUserRights

#user = authenticate(username='e', password='1')
#self.assertTrue(user.is_active)
#print(type(user))


class LoginTest(TestCase):
    fixtures = ['auth.json']

    def setUp(self):
        self.factory = RequestFactory()
        data = {'login': 'e', 'password': '1'}
        request = self.factory.post('/protoLib/protoGetUserRights/', data)
        self.response = protoGetUserRights(request)

    def tearDown(self):
        pass

    def test_can_send_login_information(self):
        self.assertEqual(self.response.status_code, 200)

    #def test_field_success_present_in_response(self):
        #self.assertIn('success', self.response.content)

    #def test_field_message_present_in_response(self):
        #self.assertIn('message', self.response.content)

    #def test_field_userinfo_present_in_response(self):
        #self.assertIn('userInfo', self.response.content)

    #def test_field_language_present_in_response(self):
        #self.assertIn('language', self.response.content)
