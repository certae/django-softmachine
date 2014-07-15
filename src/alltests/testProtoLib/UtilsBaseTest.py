# -*- encoding: UTF-8 -*-

from django.test import TestCase
from django.http import HttpResponse
from protoLib.utilsBase import parseEmailAddress, verifyList, unique_id, reduceDict, dict2tuple, CleanFilePath, ReadFile, PathToList, strip_html, strip_accents, strip_euro, DateFormatConverter
from protoLib.utilsWeb import set_cookie, DownloadLocalFile
import os

def CreateBasicResponse():
    response = HttpResponse()
    return response

class UtilsBaseTest(TestCase):

    def test_verifyingListUsingStringThenReturnEmptyList(self):
        outcome = verifyList('Julien Bouquillon')
        self.assertTrue(outcome == [])
        
    def test_verifyingUniqueIDThenReturnRandomNumber(self):
        outcome = unique_id()
        self.assertTrue(outcome.count(".") > 0)

    def test_verifying_parseEmailAddress_ThenReturnSplited(self):
        outcome = parseEmailAddress('Julien Bouquillon <julien@bouquillon.com>')
        self.assertTrue(outcome[1] == 'julien@bouquillon.com')
        
    def test_verifyingReduceDictThenReturnShorterDict(self):
        new_dict = dict()
        new_dict['a'] = 1
        new_dict['b'] = 2
        new_dict['c'] = 3
        keys = ['a','c']
        outcome = reduceDict(new_dict, keys)
        self.assertTrue(len(outcome) == 2)
 
    def test_verifyingDict2TupleThenReturnTuple(self):
        new_dict = dict()
        new_dict['a'] = 1
        new_dict['b'] = 2
        outcome = dict2tuple(new_dict)
        self.assertTrue(len(outcome) == 2)
               
    def test_verifyingCleanPathThenReturnFilename(self):
        outcome = CleanFilePath('/test_file.txt')
        self.assertTrue(outcome == 'test_file.txt')
        
    def test_verifyingReadFileThenReturnContents(self):
        #providing name for the file to be created
        filename = 'test_file.txt'
        target = open (filename, 'w') ## a will append, w will over-write 
        line1 = "line 1: "
        target.write(line1)
        target.write("n")
        target.close()

        outcome = ReadFile(filename)
        self.assertTrue(outcome == 'line 1: n')

    def test_verifyingPathToListThenReturnList(self):
        outcome = PathToList(os.path.dirname(os.path.dirname(__file__)))
        self.assertTrue(len(outcome) > 0)

    def test_strip_htmlThenReturnNoHtml(self):
        outcome = strip_html('<br><p>text</p>')
        self.assertTrue(outcome == '\ntext\n\n')

    def test_strip_accentsThenReturnString(self):
        outcome = strip_accents('ete')
        self.assertTrue(outcome == 'ete')

    def test_strip_euroThenReturnString(self):
        outcome = strip_euro('1 euro(s)')
        self.assertTrue(outcome == '1 euro(s)')

    def test_DateFormatConverterThenReturnString(self):
        outcome = DateFormatConverter('12/01/2012%')
        self.assertTrue(outcome == '12/01/2012')

class UtilsWebTest(TestCase):
    
    def test_verifyingSetCookieThenReturnCookie(self):
        key = "key"
        value = "data"
        outcome = set_cookie(CreateBasicResponse(), key, value)
        cookie = outcome.cookies[key].value
        self.assertTrue(cookie == value)
        
    def test_verifyDownloadLocalFileThenReturnResponse(self):
        filename = 'test_file.txt'
        target = open (filename, 'w') ## a will append, w will over-write 
        line1 = "line 1: "
        target.write(line1)
        target.close()
        outcome = DownloadLocalFile(filename)
        self.assertTrue(outcome.content == line1)