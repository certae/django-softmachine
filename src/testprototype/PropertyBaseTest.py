from django.test import TestCase
from prototype.models import PropertyBase
from testprototype.TestUtilities import createTestPropertyBase


# PropertyBase est une classe abstraite. Doit etre testee differemment. Voir apres la classe.
#class PropertyBaseTest(TestCase):

    #def setUp(self):
        #self.propertybase = createTestPropertyBase()
        #self.propertybase.save()

    #def tearDown(self):
        #self.propertybase.delete()

    #def test_creating_a_new_propertybase_and_saving_it_to_the_database(self):
        #propertybase_in_database = PropertyBase.objects.all()
        #self.assertEqual(len(propertybase_in_database), 1)

    #def test_verifying_propertybase_attribute_code_in_database(self):
        #entity_in_database = Entity.objects.all()
        #only_entry_in_database = entity_in_database[0]
        #self.assertEqual(only_entry_in_database.code, self.entity.code)

    #def test_verifying_propertybase_attribute_baseType_in_database(self):
        #entity_in_database = Entity.objects.all()
        #only_entry_in_database = entity_in_database[0]
        #self.assertEqual(only_entry_in_database.baseType, self.entity.baseType)

    #def test_verifying_propertybase_attribute_prpLength_in_database(self):
        #entity_in_database = Entity.objects.all()
        #only_entry_in_database = entity_in_database[0]
        #self.assertEqual(only_entry_in_database.prpLength, self.entity.prpLength)

    #def test_verifying_propertybase_attribute_prpScale_in_database(self):
        #entity_in_database = Entity.objects.all()
        #only_entry_in_database = entity_in_database[0]
        #self.assertEqual(only_entry_in_database.prpScale, self.entity.prpScale)

    #def test_verifying_propertybase_attribute_vType_in_database(self):
        #entity_in_database = Entity.objects.all()
        #only_entry_in_database = entity_in_database[0]
        #self.assertEqual(only_entry_in_database.vType, self.entity.vType)

    #def test_verifying_propertybase_attribute_prpDefault_in_database(self):
        #entity_in_database = Entity.objects.all()
        #only_entry_in_database = entity_in_database[0]
        #self.assertEqual(only_entry_in_database.prpDefault, self.entity.prpDefault)

    #def test_verifying_propertybase_attribute_prpChoices_in_database(self):
        #entity_in_database = Entity.objects.all()
        #only_entry_in_database = entity_in_database[0]
        #self.assertEqual(only_entry_in_database.prpChoices, self.entity.prpChoices)

    #def test_verifying_propertybase_attribute_isSensitive_in_database(self):
        #entity_in_database = Entity.objects.all()
        #only_entry_in_database = entity_in_database[0]
        #self.assertEqual(only_entry_in_database.isSensitive, self.entity.isSensitive)

    #def test_verifying_propertybase_attribute_description_in_database(self):
        #entity_in_database = Entity.objects.all()
        #only_entry_in_database = entity_in_database[0]
        #self.assertEqual(only_entry_in_database.description, self.entity.description)

    #def test_verifying_propertybase_attribute_notes_in_database(self):
        #entity_in_database = Entity.objects.all()
        #only_entry_in_database = entity_in_database[0]
        #self.assertEqual(only_entry_in_database.notes, self.entity.notes)
