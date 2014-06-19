from django.test import TestCase
from prototype.models import Property
from alltests.testPrototype.testmodels.TestUtilities import createTestProperty


class PropertyTest(TestCase):

    def setUp(self):
        self.property = createTestProperty()

    def tearDown(self):
        self.property.delete()
        
    def test_creating_a_new_property_and_saving_it_to_the_database(self):
        property_in_database = Property.objects.all()
        self.assertEqual(len(property_in_database), 1)

    def test_verifying_property_attribute_entity_in_database(self):
        property_in_database = Property.objects.all()
        only_entry_in_database = property_in_database[0]
        self.assertEqual(only_entry_in_database.entity, self.property.entity)

    def test_verifying_property_attribute_isPrimary_in_database(self):
        property_in_database = Property.objects.all()
        only_entry_in_database = property_in_database[0]
        self.assertEqual(only_entry_in_database.isPrimary, self.property.isPrimary)

    def test_verifying_property_attribute_isLookUpResult_in_database(self):
        property_in_database = Property.objects.all()
        only_entry_in_database = property_in_database[0]
        self.assertEqual(only_entry_in_database.isLookUpResult, self.property.isLookUpResult)

    def test_verifying_property_attribute_isNullable_in_database(self):
        property_in_database = Property.objects.all()
        only_entry_in_database = property_in_database[0]
        self.assertEqual(only_entry_in_database.isNullable, self.property.isNullable)

    def test_verifying_property_attribute_isRequired_in_database(self):
        property_in_database = Property.objects.all()
        only_entry_in_database = property_in_database[0]
        self.assertEqual(only_entry_in_database.isRequired, self.property.isRequired)

    def test_verifying_property_attribute_isReadOnly_in_database(self):
        property_in_database = Property.objects.all()
        only_entry_in_database = property_in_database[0]
        self.assertEqual(only_entry_in_database.isReadOnly, self.property.isReadOnly)

    def test_verifying_property_attribute_isEssential_in_database(self):
        property_in_database = Property.objects.all()
        only_entry_in_database = property_in_database[0]
        self.assertEqual(only_entry_in_database.isEssential, self.property.isEssential)

    def test_verifying_property_attribute_isForeign_in_database(self):
        property_in_database = Property.objects.all()
        only_entry_in_database = property_in_database[0]
        self.assertEqual(only_entry_in_database.isForeign, self.property.isForeign)
        
    def test_verifying_property_attribute_crudType_in_database(self):
        property_in_database = Property.objects.all()
        only_entry_in_database = property_in_database[0]
        self.assertEqual(only_entry_in_database.crudType, self.property.crudType)

    def test_verifying_property_attribute_dbName_in_database(self):
        property_in_database = Property.objects.all()
        only_entry_in_database = property_in_database[0]
        self.assertEqual(only_entry_in_database.dbName, self.property.dbName)
        
    def test_verifying_string_representation(self):
        self.assertEqual('testentitycode', str(self.property))
