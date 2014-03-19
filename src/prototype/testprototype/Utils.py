# -*- coding: utf-8 -*-

import string
import random


def random_string_generator(size=6, chars=string.ascii_uppercase):
    return ''.join(random.choice(chars) for x in range(size))