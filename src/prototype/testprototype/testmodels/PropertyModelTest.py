from django.test import TestCase
from django.utils.unittest import skip
from prototype.models import PropertyModel
from prototype.testprototype.testmodels.TestUtilities import createTestPropertyModel


class PropertyModelTest(TestCase):

    def setUp(self):
        self.propertymodel = createTestPropertyModel()

    def tearDown(self):
        self.propertymodel.delete()
        
    @skip('regarder')
    def test_creating_a_new_propertymodel_and_saving_it_to_the_database(self):
        propertymodel_in_database = PropertyModel.objects.all()
        self.assertEqual(len(propertymodel_in_database), 1)
        
    @skip('regarder')
    def test_verifying_propertymodel_attribute_model_in_database(self):
        propertymodel_in_database = PropertyModel.objects.all()
        only_entry_in_database = propertymodel_in_database[0]
        self.assertEqual(only_entry_in_database.model, self.propertymodel.model)
        
    @skip('regarder')
    def test_verifying_propertymodel_attribute_inherit_in_database(self):
        propertymodel_in_database = PropertyModel.objects.all()
        only_entry_in_database = propertymodel_in_database[0]
        self.assertEqual(only_entry_in_database.inherit, self.propertymodel.inherit)
        
    @skip('regarder')
    def test_verifying_propertymodel_attribute_conceptType_in_database(self):
        propertymodel_in_database = PropertyModel.objects.all()
        only_entry_in_database = propertymodel_in_database[0]
        self.assertEqual(only_entry_in_database.conceptType, self.propertymodel.conceptType)
        
    @skip('regarder')
    def test_verifying_string_representation(self):
        self.assertEqual('testcode', str(self.propertymodel))
