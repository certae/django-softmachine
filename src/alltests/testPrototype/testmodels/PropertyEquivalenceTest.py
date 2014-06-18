from django.test import TestCase
from prototype.models import PropertyEquivalence
from alltests.testPrototype.testmodels.TestUtilities import createTestPropertyEquivalence


class PropertyEquivalenceTest(TestCase):

    def setUp(self):
        self.propertyequivalence = createTestPropertyEquivalence()

    def tearDown(self):
        self.propertyequivalence.delete()
        
    def test_creating_a_new_propertyequivalence_and_saving_it_to_the_database(self):
        propertyequivalence_in_database = PropertyEquivalence.objects.all()
        self.assertEqual(len(propertyequivalence_in_database), 1)

    def test_verifying_propertyequivalence_attribute_sourceproperty_in_database(self):
        propertyequivalence_in_database = PropertyEquivalence.objects.all()
        only_entry_in_database = propertyequivalence_in_database[0]
        self.assertEqual(only_entry_in_database.sourceProperty, self.propertyequivalence.sourceProperty)

    def test_verifying_propertyequivalence_attribute_targetproperty_in_database(self):
        propertyequivalence_in_database = PropertyEquivalence.objects.all()
        only_entry_in_database = propertyequivalence_in_database[0]
        self.assertEqual(only_entry_in_database.targetProperty, self.propertyequivalence.targetProperty)

    def test_verifying_propertyequivalence_attribute_description_in_database(self):
        propertyequivalence_in_database = PropertyEquivalence.objects.all()
        only_entry_in_database = propertyequivalence_in_database[0]
        self.assertEqual(only_entry_in_database.description, self.propertyequivalence.description)

    def test_verifying_string_representation(self):
        self.assertEqual('', str(self.propertyequivalence))
