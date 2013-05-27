from django.test import TestCase
from prototype.models import Relationship
from testprototype.TestUtilities import createTestRelationship


# Error with save()
class RelationshipTest(TestCase):

    def setUp(self):
        print('\n' + __file__ + 'Erreur dans le fichier prototype/protoRules.py ligne 73. \n')
        #self.relationship = createTestRelationship()
        #self.relationship.save()

    def tearDown(self):
        pass
        #self.relationship.delete()

    def test_annule(self):
        pass

    #def test_creating_a_new_relationship_and_saving_it_to_the_database(self):
        #relationship_in_database = Relationship.objects.all()
        #self.assertEqual(len(relationship_in_database), 1)

    #refEntity = models.ForeignKey('Entity', related_name = 'refEntity_set')
    #relatedName = models.CharField( blank = True, null = True, max_length=50)
    #baseMin = models.CharField( blank = True, null = True, max_length=50)
    #baseMax = models.CharField( blank = True, null = True, max_length=50)
    #refMin = models.CharField( blank = True, null = True, max_length=50)
    #refMax = models.CharField( blank = True, null = True, max_length=50)
    #onRefDelete = models.CharField( blank = True, null = True, max_length=50, choices = ONDELETE_TYPES)
    #typeRelation = models.CharField( blank = True, null = True, max_length=50)
