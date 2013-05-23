from django.test import TestCase

from prototype.models import Project


class ProtoExtModelTest(TestCase):

    def setUp(self):
        self.project = Project()

        self.project.code = 'a'
        self.project.description = 'Project used for tests'
        self.project.dbEngine = 'MySQL'
        self.project.dbName = 'testDatabase'
        self.project.dbUser = 'testdbUser'
        self.project.dbPassword = 'testdbPassword'
        self.project.dbHost = 'testlocalhost'
        self.project.dbPort = 'testPort'

        self.project.save()

    def tearDown(self):
        self.project.delete()

    def test_creating_a_new_project_and_saving_it_to_the_database(self):
        project_in_database = Project.objects.all()
        self.assertEqual(len(project_in_database), 1)

    def test_verifying_project_attribute_code_in_database(self):
        project_in_database = Project.objects.all()
        only_entry_in_database = project_in_database[0]
        self.assertEqual(only_entry_in_database.code, self.project.code)

    def test_verifying_project_attribute_description_in_database(self):
        project_in_database = Project.objects.all()
        only_entry_in_database = project_in_database[0]
        self.assertEqual(only_entry_in_database.description, self.project.description)

    def test_verifying_project_attribute_dbEngine_in_database(self):
        project_in_database = Project.objects.all()
        only_entry_in_database = project_in_database[0]
        self.assertEqual(only_entry_in_database.dbEngine, self.project.dbEngine)

    def test_verifying_project_attribute_dbName_in_database(self):
        project_in_database = Project.objects.all()
        only_entry_in_database = project_in_database[0]
        self.assertEqual(only_entry_in_database.dbName, self.project.dbName)

    def test_verifying_project_attribute_dbUser_in_database(self):
        project_in_database = Project.objects.all()
        only_entry_in_database = project_in_database[0]
        self.assertEqual(only_entry_in_database.dbUser, self.project.dbUser)

    def test_verifying_project_attribute_dbPassword_in_database(self):
        project_in_database = Project.objects.all()
        only_entry_in_database = project_in_database[0]
        self.assertEqual(only_entry_in_database.dbPassword, self.project.dbPassword)

    def test_verifying_project_attribute_dbHost_in_database(self):
        project_in_database = Project.objects.all()
        only_entry_in_database = project_in_database[0]
        self.assertEqual(only_entry_in_database.dbHost, self.project.dbHost)

    def test_verifying_project_attribute_dbPort_in_database(self):
        project_in_database = Project.objects.all()
        only_entry_in_database = project_in_database[0]
        self.assertEqual(only_entry_in_database.dbPort, self.project.dbPort)
