from django.test import TestCase
from prototype.models import ServiceRef
from testprototype.TestUtilities import createTestServiceRef


class ServiceRefTest(TestCase):

    def setUp(self):
        self.serviceRef = createTestServiceRef()

    def tearDown(self):
        self.serviceRef.delete()

    def test_creating_a_new_serviceref_and_saving_it_to_the_database(self):
        serviceref_in_database = ServiceRef.objects.all()
        self.assertEqual(len(serviceref_in_database), 1)

    def test_verifying_serviceref_attribute_model_in_database(self):
        serviceref_in_database = ServiceRef.objects.all()
        only_entry_in_database = serviceref_in_database[0]
        self.assertEqual(only_entry_in_database.model, self.serviceRef.model)

    def test_verifying_serviceref_attribute_service_in_database(self):
        serviceref_in_database = ServiceRef.objects.all()
        only_entry_in_database = serviceref_in_database[0]
        self.assertEqual(only_entry_in_database.service, self.serviceRef.service)

    def test_verifying_serviceref_attribute_endpoint_in_database(self):
        serviceref_in_database = ServiceRef.objects.all()
        only_entry_in_database = serviceref_in_database[0]
        self.assertEqual(only_entry_in_database.endpoint, self.serviceRef.endpoint)

    def test_verifying_serviceref_attribute_description_in_database(self):
        serviceref_in_database = ServiceRef.objects.all()
        only_entry_in_database = serviceref_in_database[0]
        self.assertEqual(only_entry_in_database.description, self.serviceRef.description)

    def test_verifying_serviceref_attribute_notes_in_database(self):
        serviceref_in_database = ServiceRef.objects.all()
        only_entry_in_database = serviceref_in_database[0]
        self.assertEqual(only_entry_in_database.notes, self.serviceRef.notes)
