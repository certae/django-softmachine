from django.test import LiveServerTestCase
from pyvirtualdisplay import Display
from selenium import webdriver


class LoginTest(LiveServerTestCase):

    def setUp(self):
        self.display = Display(visible=0, size=(1024, 768))
        self.display.start()
        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(3)

    def tearDown(self):
        self.browser.quit()
        self.display.stop()

    def test_can_display_page_with_empty_body_section(self):
        self.browser.get('http://localhost:8000/protoExt/')
        body = self.browser.find_element_by_tag_name('body')
        self.assertIn('', body.text)
