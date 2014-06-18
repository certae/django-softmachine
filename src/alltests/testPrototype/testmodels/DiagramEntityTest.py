from django.test import TestCase
from prototype.models import DiagramEntity
from alltests.testPrototype.testmodels.TestUtilities import createTestDiagramEntity


class DiagramEntityTest(TestCase):

    def setUp(self):
        self.diagramEntity = createTestDiagramEntity()

    def tearDown(self):
        self.diagramEntity.delete()

    def test_creating_a_new_diagramentity_and_saving_it_to_the_database(self):
        diagramentity_in_database = DiagramEntity.objects.all()
        self.assertEqual(len(diagramentity_in_database), 1)

    def test_verifying_diagramentity_attribute_diagram_in_database(self):
        diagramentity_in_database = DiagramEntity.objects.all()
        only_entry_in_database = diagramentity_in_database[0]
        self.assertEqual(only_entry_in_database.diagram, self.diagramEntity.diagram)

    def test_verifying_diagramentity_attribute_entity_in_database(self):
        diagramentity_in_database = DiagramEntity.objects.all()
        only_entry_in_database = diagramentity_in_database[0]
        self.assertEqual(only_entry_in_database.entity, self.diagramEntity.entity)

    def test_verifying_string_representation(self):
        self.assertEqual('testcode-testentitycode', str(self.diagramEntity))