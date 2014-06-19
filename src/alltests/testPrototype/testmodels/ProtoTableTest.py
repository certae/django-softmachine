from django.test import TestCase
from prototype.models import ProtoTable
from alltests.testPrototype.testmodels.TestUtilities import createTestProtoTable


class ProtoTableTest(TestCase):

    def setUp(self):
        self.protoTable = createTestProtoTable()

    def tearDown(self):
        self.protoTable.delete()

    def test_creating_a_new_prototable_and_saving_it_to_the_database(self):
        prototable_in_database = ProtoTable.objects.all()
        self.assertEqual(len(prototable_in_database), 1)

    def test_verifying_prototable_attribute_entity_in_database(self):
        prototable_in_database = ProtoTable.objects.all()
        only_entry_in_database = prototable_in_database[0]
        self.assertEqual(only_entry_in_database.entity, self.protoTable.entity)

    def test_verifying_behavior_of_mystr(self):
        returnValue = self.protoTable.myStr(['val1', 'val2'])
        self.assertEqual('', returnValue)

    def test_verifying_string_representation(self):
        self.assertEqual('testEntityCode:{}', str(self.protoTable))