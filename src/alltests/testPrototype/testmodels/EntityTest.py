from django.test import TestCase
from prototype.models import Entity
from alltests.testPrototype.testmodels.TestUtilities import createTestEntity


class EntityTest(TestCase):

    def setUp(self):
        self.entity = createTestEntity()

    def tearDown(self):
        self.entity.delete()

    def test_creating_a_new_entity_and_saving_it_to_the_database(self):
        entity_in_database = Entity.objects.all()
        self.assertEqual(len(entity_in_database), 1)

    def test_verifying_entity_attribute_model_in_database(self):
        entity_in_database = Entity.objects.all()
        only_entry_in_database = entity_in_database[0]
        self.assertEqual(only_entry_in_database.model, self.entity.model)

    def test_verifying_entity_attribute_code_in_database(self):
        entity_in_database = Entity.objects.all()
        only_entry_in_database = entity_in_database[0]
        self.assertEqual(only_entry_in_database.code, self.entity.code)

    def test_verifying_entity_attribute_dbname_in_database(self):
        entity_in_database = Entity.objects.all()
        only_entry_in_database = entity_in_database[0]
        self.assertEqual(only_entry_in_database.dbName, self.entity.dbName)

    def test_verifying_entity_attribute_description_in_database(self):
        entity_in_database = Entity.objects.all()
        only_entry_in_database = entity_in_database[0]
        self.assertEqual(only_entry_in_database.description, self.entity.description)

    def test_verifying_string_representation(self):
        self.assertEqual('testcode-testentitycode', str(self.entity))