from django.test import LiveServerTestCase
from selenium import webdriver


class LoginTest(LiveServerTestCase):

    def setUp(self):
        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(3)

    def tearDown(self):
        self.browser.quit()

    def test_can_display_page_with_empty_body_section(self):
        self.browser.get('http://localhost:8000/protoExt/')
        body = self.browser.find_element_by_tag_name('body')
        self.assertIn('', body.text)
