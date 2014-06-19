from django.test import TestCase
from prototype.models import Relationship
from alltests.testPrototype.testmodels.TestUtilities import createTestRelationship


class RelationshipTest(TestCase):

    def setUp(self):
        self.relationship = createTestRelationship()

    def tearDown(self):
        self.relationship.delete()

    def test_creating_a_new_relationship_and_saving_it_to_the_database(self):
        relationship_in_database = Relationship.objects.all()
        self.assertEqual(len(relationship_in_database), 1)
        
    def test_verifying_relationship_attribute_refentity_in_database(self):
        relationship_in_database = Relationship.objects.all()
        only_entry_in_database = relationship_in_database[0]
        self.assertEqual(only_entry_in_database.refEntity, self.relationship.refEntity)

    def test_verifying_relationship_attribute_relatedname_in_database(self):
        relationship_in_database = Relationship.objects.all()
        only_entry_in_database = relationship_in_database[0]
        self.assertEqual(only_entry_in_database.relatedName, self.relationship.relatedName)

    def test_verifying_relationship_attribute_basemin_in_database(self):
        relationship_in_database = Relationship.objects.all()
        only_entry_in_database = relationship_in_database[0]
        self.assertEqual(only_entry_in_database.baseMin, self.relationship.baseMin)

    def test_verifying_relationship_attribute_basemax_in_database(self):
        relationship_in_database = Relationship.objects.all()
        only_entry_in_database = relationship_in_database[0]
        self.assertEqual(only_entry_in_database.baseMax, self.relationship.baseMax)
    
    def test_verifying_relationship_attribute_refmin_in_database(self):
        relationship_in_database = Relationship.objects.all()
        only_entry_in_database = relationship_in_database[0]
        self.assertEqual(only_entry_in_database.refMin, self.relationship.refMin)

    def test_verifying_relationship_attribute_refmax_in_database(self):
        relationship_in_database = Relationship.objects.all()
        only_entry_in_database = relationship_in_database[0]
        self.assertEqual(only_entry_in_database.refMax, self.relationship.refMax)

    def test_verifying_relationship_attribute_onrefdelete_in_database(self):
        relationship_in_database = Relationship.objects.all()
        only_entry_in_database = relationship_in_database[0]
        self.assertEqual(only_entry_in_database.onRefDelete, self.relationship.onRefDelete)

    def test_verifying_relationship_attribute_typerelation_in_database(self):
        relationship_in_database = Relationship.objects.all()
        only_entry_in_database = relationship_in_database[0]
        self.assertEqual(only_entry_in_database.typeRelation, self.relationship.typeRelation)

    def test_verifying_string_representation(self):
        self.assertEqual('testentitycode', str(self.relationship))
