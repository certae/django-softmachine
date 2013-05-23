from django.test import TestCase

from prototype.models import Project
from prototype.models import Model
from protoLib.models import ProtoModel
from prototype.models import PropertyBase


def createTestProject():
    testProject = Project()
    testProject.code = 'testCode'
    testProject.description = 'Project used for tests'
    testProject.dbEngine = 'MySQL'
    testProject.dbName = 'testDatabase'
    testProject.dbUser = 'testdbUser'
    testProject.dbPassword = 'testdbPassword'
    testProject.dbHost = 'testlocalhost'
    testProject.dbPort = 'testPort'

    return testProject


def createTestModel():
    testProject = createTestProject()
    testProject.save()

    testModel = Model()
    testModel.project = testProject
    testModel.code = 'testCode'
    testModel.category = 'testCategory'
    testModel.modelPrefix = 'testPrefix'
    testModel.description = 'Model used for tests'

    return testModel


def createTestEntity():
    testModel = createTestModel()
    testModel.save()

    testEntity = Entity()
    testEntity.model = self.model
    testEntity.code = 'testEntityCode'
    testEntity.dbName = 'testEntitydbName'
    testEntity.description = 'testEntityDescription'

    return testEntity


def createTestPropertyBase():
    testPropertyBase = PropertyBase()
    testPropertyBase.code = 'testCode'
    testPropertyBase.baseType = 'testBaseType'
    testPropertyBase.prpLength = 'testPrpLength'
    testPropertyBase.prpScale = 'testPrpScale'
    testPropertyBase.vType = 'testVType'
    testPropertyBase.prpDefault = 'testPrpDefault'
    testPropertyBase.prpChoices = 'testPrpChoises'
    testPropertyBase.isSensitive = True
    testPropertyBase.description = 'testDescription'
    testPropertyBase.notes = 'testNotes'

    return testPropertybase


def createTestPropertyModel():
    testModel = createTestModel()
    testModel.save()

    testPropertyModel = PropertyModel()
    testPropertyModel.model = testModel
    testPropertyModel.inherit = False
    testPropertyModel.conceptType = 'testConceptType'

    return testPropertyModel


def createTestProperty():
    testEntity = createTestEntity()
    testEntity.save()

    testPropertyModel = createTestPropertyModel()
    testPropertyModel.save()

    testProperty = Property()
    testProperty.entity = testEntity
    testProperty.propertyModel = testPropertyModel
    testProperty.isPrimary = True
    testProperty.isLookUpResult = True
    testProperty.isNullable = True
    testProperty.isRequired = True
    testProperty.isReadOnly = True
    testProperty.isEssential = True
    testProperty.isForeign = False
    testProperty.crudType = 'testCrudType'
    testProperty.dbName = 'testDbName'

    return testProperty


class Project_ModelTest(TestCase):

    def setUp(self):
        self.project = createTestProject()
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


class Model_ModelTest(TestCase):

    def setUp(self):
        self.project = createTestProject()
        self.project.save()

        self.model = createTestModel()
        self.model.save()

    def tearDown(self):
        self.model.delete()
        self.project.delete()

    def test_creating_a_new_model_and_saving_it_to_the_database(self):
        model_in_database = Model.objects.all()
        self.assertEqual(len(model_in_database), 1)

    def test_verifying_model_attribute_project_in_database(self):
        model_in_database = Model.objects.all()
        only_entry_in_database = model_in_database[0]
        self.assertEqual(only_entry_in_database.project, self.model.project)

    def test_verifying_model_attribute_code_in_database(self):
        model_in_database = Model.objects.all()
        only_entry_in_database = model_in_database[0]
        self.assertEqual(only_entry_in_database.code, self.model.code)

    def test_verifying_model_attribute_category_in_database(self):
        model_in_database = Model.objects.all()
        only_entry_in_database = model_in_database[0]
        self.assertEqual(only_entry_in_database.category, self.model.category)

    def test_verifying_model_attribute_modelprefix_in_database(self):
        model_in_database = Model.objects.all()
        only_entry_in_database = model_in_database[0]
        self.assertEqual(only_entry_in_database.modelPrefix, self.model.modelPrefix)

    def test_verifying_model_attribute_description_in_database(self):
        model_in_database = Model.objects.all()
        only_entry_in_database = model_in_database[0]
        self.assertEqual(only_entry_in_database.description, self.model.description)


class Entity_ModelTest(ProtoModel):

    def setUp(self):
        self.project = createTestProject()
        self.project.save()

        self.model = createTestModel()
        self.model.save()

        self.entity = createTestEntity()
        self.entity.save()

    def tearDown(self):
        self.entity.delete()
        self.model.delete()
        self.project.delete()


class PropertyBase_ModelTest(ProtoModel):

    def setUp(self):
        self.propertybase = createTestPropertyBase()
        self.propertybase.save()

    def tearDown(self):
        self.PropertyBase.delete()


class Property_ModelTest(PropertyBase):

    def setUp(self):
        self.project = createTestProject()
        self.project.save()

        self.model = createTestModel()
        self.model.save()

        self.entity = createTestEntity()
        self.entity.save()

        self.propertymodel = createTestPropertyModel()
        self.propertymodel.save()

        self.property = createTestProperty()
        self.property.save()

    def tearDown(self):
        self.property.delete()
        self.propertymodel.delete()
        self.entity.delete()
        self.model.delete()
        self.project.delete()

#class Relationship_ModelTest(Property):
    #refEntity = models.ForeignKey('Entity', related_name = 'refEntity_set')
    #relatedName = models.CharField( blank = True, null = True, max_length=50)
    #baseMin = models.CharField( blank = True, null = True, max_length=50)
    #baseMax = models.CharField( blank = True, null = True, max_length=50)
    #refMin = models.CharField( blank = True, null = True, max_length=50)
    #refMax = models.CharField( blank = True, null = True, max_length=50)
    #onRefDelete = models.CharField( blank = True, null = True, max_length=50, choices = ONDELETE_TYPES)
    #typeRelation = models.CharField( blank = True, null = True, max_length=50)


class PropertyModel_ModelTest(PropertyBase):

    def setUp(self):
        self.project = createTestProject()
        self.project.save()

        self.model = createTestModel()
        self.model.save()

        self.propertymodel = createTestPropertyModel()
        self.propertymodel.save()

    def tearDown(self):
        self.propertymodel.delete()
        self.model.delete()
        self.project.delete()

#class PropertyEquivalence_ModelTest(ProtoModel):
    #sourceProperty = models.ForeignKey('PropertyModel', blank = True, null = True, related_name = 'sourcePrp')
    #targetProperty = models.ForeignKey('PropertyModel', blank = True, null = True, related_name = 'targetPrp')
    #description = models.TextField( blank = True, null = True)


#class Prototype_ModelTest(ProtoModel):
    #entity = models.ForeignKey( Entity, blank = False, null = False )
    #code   = models.CharField( blank = False, null = False, max_length=200, editable = False )
    #description = models.TextField( blank = True, null = True)
    #notes  = models.TextField( blank = True, null = True)
    #metaDefinition = models.TextField( blank = True, null = True)


#class ProtoTable_ModelTest(ProtoModel):
    #entity = models.ForeignKey( Entity, blank = False, null = False )


#class Diagram_ModelTest(ProtoModel):
    #model = models.ForeignKey('Model', blank = False, null = False )
    #code = models.CharField(blank = False, null = False, max_length=200 )
    #description = models.TextField( blank = True, null = True)
    #notes  = models.TextField( blank = True, null = True)


#class DiagramEntity_ModelTest(ProtoModel):
    #diagram = models.ForeignKey('Diagram', blank = False, null = False )
    #entity = models.ForeignKey( Entity, blank = False, null = False )


#class Service_ModelTest(ProtoModel):
    #model = models.ForeignKey('Model', blank = False, null = False )
    #code = models.CharField(blank = False, null = False, max_length=200 )
    #Binding =  models.CharField(  blank = True, null = True, max_length = 20 )
    #typeMessage = models.CharField(  blank = True, null = True, max_length = 20 )
    #description = models.TextField( blank = True, null = True)
    #notes  = models.TextField( blank = True, null = True)


#class ServiceRef_ModelTest(ProtoModel):
    #model = models.ForeignKey('Model', blank = False, null = False )
    #service = models.ForeignKey('Service', blank = False, null = False )
    #endpoint = models.CharField(  blank = True, null = True, max_length = 200 )
    #description = models.TextField( blank = True, null = True)
    #notes  = models.TextField( blank = True, null = True)
