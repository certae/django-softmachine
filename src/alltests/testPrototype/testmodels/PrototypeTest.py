from django.test import TestCase
from prototype.models import Prototype
from alltests.testPrototype.testmodels.TestUtilities import createTestPrototype


class PrototypeTest(TestCase):

    def setUp(self):
        self.prototype = createTestPrototype()

    def tearDown(self):
        self.prototype.delete()

    def test_creating_a_new_prototype_and_saving_it_to_the_database(self):
        prototype_in_database = Prototype.objects.all()
        self.assertEqual(len(prototype_in_database), 1)

    def test_verifying_prototype_attribute_entity_in_database(self):
        prototype_in_database = Prototype.objects.all()
        only_entry_in_database = prototype_in_database[0]
        self.assertEqual(only_entry_in_database.entity, self.prototype.entity)

    def test_verifying_prototype_attribute_code_in_database(self):
        prototype_in_database = Prototype.objects.all()
        only_entry_in_database = prototype_in_database[0]
        self.assertEqual(only_entry_in_database.code, self.prototype.code)

    def test_verifying_prototype_attribute_description_in_database(self):
        prototype_in_database = Prototype.objects.all()
        only_entry_in_database = prototype_in_database[0]
        self.assertEqual(only_entry_in_database.description, self.prototype.description)

    def test_verifying_prototype_attribute_notes_in_database(self):
        prototype_in_database = Prototype.objects.all()
        only_entry_in_database = prototype_in_database[0]
        self.assertEqual(only_entry_in_database.notes, self.prototype.notes)

    def test_verifying_prototype_attribute_metadefinition_in_database(self):
        prototype_in_database = Prototype.objects.all()
        only_entry_in_database = prototype_in_database[0]
        self.assertEqual(only_entry_in_database.metaDefinition, self.prototype.metaDefinition)

    def test_verifying_string_representation(self):
        self.assertEqual('testcode', str(self.prototype))