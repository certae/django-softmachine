# -*- encoding: UTF-8 -*-

from django.test import TestCase
from protoLib.utilsBase import parseEmailAddress

class UtilsBaseTest(TestCase):

    def test_verifying_parseEmailAddress_ThenReturnSplited(self):
        outcome = parseEmailAddress('Julien Bouquillon <julien@bouquillon.com>')
        self.assertTrue(outcome[1] == 'julien@bouquillon.com')