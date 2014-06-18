from django.test import TestCase
from prototype.models import Model
from alltests.testPrototype.testmodels.TestUtilities import createTestModel


class ModelTest(TestCase):

    def setUp(self):
        self.model = createTestModel()

    def tearDown(self):
        self.model.delete()

    def test_creating_a_new_model_and_saving_it_to_the_database(self):
        model_in_database = Model.objects.all()
        self.assertEqual(len(model_in_database), 1)

    def test_verifying_model_attribute_project_in_database(self):
        model_in_database = Model.objects.all()
        only_entry_in_database = model_in_database[0]
        self.assertEqual(only_entry_in_database.project, self.model.project)

    def test_verifying_model_attribute_code_in_database(self):
        model_in_database = Model.objects.all()
        only_entry_in_database = model_in_database[0]
        self.assertEqual(only_entry_in_database.code, self.model.code)

    def test_verifying_model_attribute_category_in_database(self):
        model_in_database = Model.objects.all()
        only_entry_in_database = model_in_database[0]
        self.assertEqual(only_entry_in_database.category, self.model.category)

    def test_verifying_model_attribute_modelprefix_in_database(self):
        model_in_database = Model.objects.all()
        only_entry_in_database = model_in_database[0]
        self.assertEqual(only_entry_in_database.modelPrefix, self.model.modelPrefix)

    def test_verifying_model_attribute_description_in_database(self):
        model_in_database = Model.objects.all()
        only_entry_in_database = model_in_database[0]
        self.assertEqual(only_entry_in_database.description, self.model.description)

    def test_verifying_string_representation(self):
        self.assertEqual('testcode', str(self.model))