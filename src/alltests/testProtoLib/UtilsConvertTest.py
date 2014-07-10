# -*- encoding: UTF-8 -*-

from django.test import TestCase
from protoLib.utilsConvert import getTypedValue, toFloat, isNumeric, isinteger

class UtilsConvertTest(TestCase):

    def test_verifying_getTypedValue_booleanThenReturnTrue(self):
        outcome = getTypedValue('true','bool')
        self.assertTrue(outcome == True)

    def test_verifying_getTypedValue_booleanNumberThenReturnTrue(self):
        outcome = getTypedValue(1,'bool')
        self.assertTrue(outcome == True)

    def test_verifying_getTypedValue_booleanTrueThenReturnTrue(self):
        outcome = getTypedValue(True,'bool')
        self.assertTrue(outcome == True)
        
    def test_verifying_getTypedValue_integerThenReturnInteger(self):
        outcome = getTypedValue('1','int')
        self.assertTrue(outcome == 1)
        
    def test_verifying_getTypedValue_decimalThenReturnDecimal(self):
        outcome = getTypedValue('1.5','decimal')
        self.assertTrue(outcome == 1.5)
        
    def test_verifying_getTypedValue_dateThenReturnDay(self):
        outcome = getTypedValue('2012-01-12','date')
        self.assertTrue(outcome.day == 12)

    def test_verifying_getTypedValue_dateUsingOtherDateFormat(self):
        outcome = getTypedValue('12/01/2012','date')
        self.assertTrue(outcome.day == 12)
                
    def test_verifying_getTypedValue_dateUsingDatetime(self):
        outcome = getTypedValue('12/01/2012 8:9:10','date')
        self.assertTrue(outcome.day == 12)
                
    def test_verifying_getTypedValue_datetime(self):
        outcome = getTypedValue('2012-01-12T8:9:10','datetime')
        self.assertTrue(outcome.day == 12)
        
    def test_verifying_getTypedValue_time(self):
        outcome = getTypedValue('2012-01-12T8:9:10','time')
        self.assertTrue(outcome.minute == 9)
    
    def test_verifying_getTypedValue_foreigntext(self):
        outcome = getTypedValue('None','foreigntext')
        self.assertTrue(outcome is '')
            
    def test_verifying_toFloatThenReturnFloat(self):
        outcome = toFloat('1.5')
        self.assertTrue(outcome == 1.5)
        
    def test_verifying_isNumericThenReturnFalse(self):
        outcome = isNumeric('string')
        self.assertFalse(outcome)
        
    def test_verifying_isNumericThenReturnTrue(self):
        outcome = isNumeric('1.5')
        self.assertTrue(outcome)
        
    def test_verifying_isIntegerThenReturnTrue(self):
        outcome = isinteger('1')
        self.assertTrue(outcome)
        
    def test_verifying_isIntegerThenReturnFalse(self):
        outcome = isinteger('1x')
        self.assertFalse(outcome)