from django.test import TestCase
from prototype.models import Diagram
from alltests.testPrototype.testmodels.TestUtilities import createTestDiagram


class DiagramTest(TestCase):

    def setUp(self):
        self.diagram = createTestDiagram()

    def tearDown(self):
        self.diagram.delete()

    def test_creating_a_new_diagram_and_saving_it_to_the_database(self):
        diagram_in_database = Diagram.objects.all()
        self.assertEqual(len(diagram_in_database), 1)

    def test_verifying_diagram_attribute_model_in_database(self):
        diagram_in_database = Diagram.objects.all()
        only_entry_in_database = diagram_in_database[0]
        self.assertEqual(only_entry_in_database.project, self.diagram.project)

    def test_verifying_diagram_attribute_code_in_database(self):
        diagram_in_database = Diagram.objects.all()
        only_entry_in_database = diagram_in_database[0]
        self.assertEqual(only_entry_in_database.code, self.diagram.code)

    def test_verifying_diagram_attribute_description_in_database(self):
        diagram_in_database = Diagram.objects.all()
        only_entry_in_database = diagram_in_database[0]
        self.assertEqual(only_entry_in_database.description, self.diagram.description)

    def test_verifying_diagram_attribute_notes_in_database(self):
        diagram_in_database = Diagram.objects.all()
        only_entry_in_database = diagram_in_database[0]
        self.assertEqual(only_entry_in_database.notes, self.diagram.notes)

    def test_verifying_string_representation(self):
        self.assertEqual('testcode-testcode', str(self.diagram))