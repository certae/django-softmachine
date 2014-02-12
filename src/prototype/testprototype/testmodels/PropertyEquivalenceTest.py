from django.test import TestCase
from django.utils.unittest import skip
from prototype.models import PropertyEquivalence
from prototype.testprototype.testmodels.TestUtilities import createTestPropertyEquivalence


class PropertyEquivalenceTest(TestCase):

    def setUp(self):
        self.propertyequivalence = createTestPropertyEquivalence()

    def tearDown(self):
        self.propertyequivalence.delete()
        
    @skip('regarder')
    def test_creating_a_new_propertyequivalence_and_saving_it_to_the_database(self):
        propertyequivalence_in_database = PropertyEquivalence.objects.all()
        self.assertEqual(len(propertyequivalence_in_database), 2)

    @skip('regarder')
    def test_verifying_propertyequivalence_attribute_sourceproperty_in_database(self):
        propertyequivalence_in_database = PropertyEquivalence.objects.all()
        only_entry_in_database = propertyequivalence_in_database[0]
        self.assertEqual(only_entry_in_database.sourceProperty, self.propertyequivalence.sourceProperty)

    @skip('regarder')
    def test_verifying_propertyequivalence_attribute_targetproperty_in_database(self):
        propertyequivalence_in_database = PropertyEquivalence.objects.all()
        only_entry_in_database = propertyequivalence_in_database[0]
        self.assertEqual(only_entry_in_database.targetProperty, self.propertyequivalence.targetProperty)

    @skip('regarder')
    def test_verifying_propertyequivalence_attribute_description_in_database(self):
        propertyequivalence_in_database = PropertyEquivalence.objects.all()
        only_entry_in_database = propertyequivalence_in_database[0]
        self.assertEqual(only_entry_in_database.description, self.propertyequivalence.description)

    @skip('regarder')
    def test_verifying_string_representation(self):
        self.assertEqual('', str(self.propertyequivalence))
