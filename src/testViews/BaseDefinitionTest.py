from django.test import TestCase
from datetime import datetime
import string
import random


def random_string_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))


class pEntityForTest():
    def __init__(self):
        self.id = random_string_generator(1)
        self.description = random_string_generator(10)


class BaseDefinitionTest(TestCase):

    def setUp(self):
        self.pEntity = pEntityForTest()

    def test_authentification_wih_valid_user(self):
        print(self.pEntity.id, self.pEntity.description)
        self.assertTrue(True)
