# -*- coding: utf-8 -*-

from pprint import pprint
import random
from django.test import TestCase
from django.utils.unittest.suite import TestSuite
from django.utils.unittest.loader import makeSuite
from django.utils.unittest import skip
from prototype.models import Project
from prototype.models import Property
from prototype.models import Model
from prototype.models import Entity
from prototype.models import Relationship
from prototype.testprototype.Utils import random_string_generator


def ProtoRulesTestSuite():
    suite = TestSuite()
    return suite

