from django.test import TestCase
from prototype.models import Service
from prototype.testprototype.testmodels.TestUtilities import createTestService


class ServiceTest(TestCase):

    def setUp(self):
        self.service = createTestService()

    def tearDown(self):
        self.service.delete()

    def test_creating_a_new_service_and_saving_it_to_the_database(self):
        service_in_database = Service.objects.all()
        self.assertEqual(len(service_in_database), 1)

    def test_verifying_service_attribute_model_in_database(self):
        service_in_database = Service.objects.all()
        only_entry_in_database = service_in_database[0]
        self.assertEqual(only_entry_in_database.model, self.service.model)

    def test_verifying_service_attribute_code_in_database(self):
        service_in_database = Service.objects.all()
        only_entry_in_database = service_in_database[0]
        self.assertEqual(only_entry_in_database.code, self.service.code)

    def test_verifying_service_attribute_binding_in_database(self):
        service_in_database = Service.objects.all()
        only_entry_in_database = service_in_database[0]
        self.assertEqual(only_entry_in_database.Binding, self.service.Binding)

    def test_verifying_service_attribute_typemessage_in_database(self):
        service_in_database = Service.objects.all()
        only_entry_in_database = service_in_database[0]
        self.assertEqual(only_entry_in_database.typeMessage, self.service.typeMessage)

    def test_verifying_service_attribute_description_in_database(self):
        service_in_database = Service.objects.all()
        only_entry_in_database = service_in_database[0]
        self.assertEqual(only_entry_in_database.description, self.service.description)

    def test_verifying_service_attribute_notes_in_database(self):
        service_in_database = Service.objects.all()
        only_entry_in_database = service_in_database[0]
        self.assertEqual(only_entry_in_database.notes, self.service.notes)

    def test_verifying_string_representation(self):
        self.assertEqual('testcode-testcode', str(self.service))
