# -*- coding: utf-8 -*-

import string
import random


def random_string_generator(size=6, chars=string.ascii_uppercase):
    return ''.join(random.choice(chars) for x in range(size))


class pEntityForTest():
    def __init__(self):
        self.id = random_string_generator(1)
        self.description = random_string_generator(10)
        self.code = random_string_generator(5)
        self.model = modelForTest()


class modelForTest():
    def __init__(self):
        self.code = random_string_generator(5)
