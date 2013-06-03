from django.test import TestCase
from prototype.models import PropertyBaseChild
from testprototype.testmodels.TestUtilities import createTestPropertyBaseChild


class PropertyBaseChildTest(TestCase):

    def setUp(self):
        self.propertybasechild = createTestPropertyBaseChild()

    def tearDown(self):
        self.propertybasechild.delete()

    def test_creating_a_new_propertybase_and_saving_it_to_the_database(self):
        propertybasechild_in_database = PropertyBaseChild.objects.all()
        self.assertEqual(len(propertybasechild_in_database), 1)

    def test_verifying_propertybasechild_attribute_code_in_database(self):
        propertybasechild_in_database = PropertyBaseChild.objects.all()
        only_entry_in_database = propertybasechild_in_database[0]
        self.assertEqual(only_entry_in_database.code, self.propertybasechild.code)

    def test_verifying_propertybasechild_attribute_baseType_in_database(self):
        propertybasechild_in_database = PropertyBaseChild.objects.all()
        only_entry_in_database = propertybasechild_in_database[0]
        self.assertEqual(only_entry_in_database.baseType, self.propertybasechild.baseType)

    def test_verifying_propertybasechild_attribute_prpLength_in_database(self):
        propertybasechild_in_database = PropertyBaseChild.objects.all()
        only_entry_in_database = propertybasechild_in_database[0]
        self.assertEqual(only_entry_in_database.prpLength, self.propertybasechild.prpLength)

    def test_verifying_propertybasechild_attribute_prpScale_in_database(self):
        propertybasechild_in_database = PropertyBaseChild.objects.all()
        only_entry_in_database = propertybasechild_in_database[0]
        self.assertEqual(only_entry_in_database.prpScale, self.propertybasechild.prpScale)

    def test_verifying_propertybasechild_attribute_vType_in_database(self):
        propertybasechild_in_database = PropertyBaseChild.objects.all()
        only_entry_in_database = propertybasechild_in_database[0]
        self.assertEqual(only_entry_in_database.vType, self.propertybasechild.vType)

    def test_verifying_propertybasechild_attribute_prpDefault_in_database(self):
        propertybasechild_in_database = PropertyBaseChild.objects.all()
        only_entry_in_database = propertybasechild_in_database[0]
        self.assertEqual(only_entry_in_database.prpDefault, self.propertybasechild.prpDefault)

    def test_verifying_propertybasechild_attribute_prpChoices_in_database(self):
        propertybasechild_in_database = PropertyBaseChild.objects.all()
        only_entry_in_database = propertybasechild_in_database[0]
        self.assertEqual(only_entry_in_database.prpChoices, self.propertybasechild.prpChoices)

    def test_verifying_propertybasechild_attribute_isSensitive_in_database(self):
        propertybasechild_in_database = PropertyBaseChild.objects.all()
        only_entry_in_database = propertybasechild_in_database[0]
        self.assertEqual(only_entry_in_database.isSensitive, self.propertybasechild.isSensitive)

    def test_verifying_propertybasechild_attribute_description_in_database(self):
        propertybasechild_in_database = PropertyBaseChild.objects.all()
        only_entry_in_database = propertybasechild_in_database[0]
        self.assertEqual(only_entry_in_database.description, self.propertybasechild.description)

    def test_verifying_propertybasechild_attribute_notes_in_database(self):
        propertybasechild_in_database = PropertyBaseChild.objects.all()
        only_entry_in_database = propertybasechild_in_database[0]
        self.assertEqual(only_entry_in_database.notes, self.propertybasechild.notes)
