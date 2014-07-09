# -*- encoding: UTF-8 -*-

from django.test import TestCase
from protoLib.utilsConvert import getTypedValue

class UtilsConvertTest(TestCase):

    def test_verifying_getTypedValue_boolean(self):
        outcome = getTypedValue('true','bool')
        self.assertTrue(outcome == True)
        
    def test_verifying_getTypedValue_integer(self):
        outcome = getTypedValue('1','int')
        self.assertTrue(outcome == 1)
        
    def test_verifying_getTypedValue_decimal(self):
        outcome = getTypedValue('1.5','decimal')
        self.assertTrue(outcome == 1.5)
        
    def test_verifying_getTypedValue_date(self):
        outcome = getTypedValue('2012-01-12','date')
        self.assertTrue(outcome.day == 12)
        
    def test_verifying_getTypedValue_datetime(self):
        outcome = getTypedValue('2012-01-12T8:9:10','datetime')
        self.assertTrue(outcome.day == 12)
        
    def test_verifying_getTypedValue_time(self):
        outcome = getTypedValue('2012-01-12T8:9:10','time')
        self.assertTrue(outcome.minute == 9)