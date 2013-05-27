from django.test import TestCase

from protoLib.models import ProtoModel

from prototype.models import Diagram
from prototype.models import DiagramEntity
from prototype.models import Entity
from prototype.models import Model
from prototype.models import Project
from prototype.models import Property
from prototype.models import PropertyBase
from prototype.models import PropertyModel
from prototype.models import PropertyEquivalence
from prototype.models import Prototype
from prototype.models import ProtoTable
from prototype.models import Relationship
from prototype.models import Service
from prototype.models import ServiceRef


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
    testEntity.model = testModel
    testEntity.code = 'testEntityCode'
    testEntity.dbName = 'testEntitydbName'
    testEntity.description = 'testEntityDescription'

    return testEntity


# PropertyBase est une classe abstraite
#def createTestPropertyBase():
    #testPropertyBase = PropertyBase()
    #testPropertyBase.code = 'testCode'
    #testPropertyBase.baseType = 'testBaseType'
    #testPropertyBase.prpLength = 'testPrpLength'
    #testPropertyBase.prpScale = 'testPrpScale'
    #testPropertyBase.vType = 'testVType'
    #testPropertyBase.prpDefault = 'testPrpDefault'
    #testPropertyBase.prpChoices = 'testPrpChoises'
    #testPropertyBase.isSensitive = True
    #testPropertyBase.description = 'testDescription'
    #testPropertyBase.notes = 'testNotes'

    #return testPropertyBase


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


def createTestRelationship():
    testEntity = createTestEntity()
    testEntity.save()

    testRelationShip = Relationship()
    testRelationShip.refEntity = testEntity
    testRelationShip.relatedName = 'testRelatedName'
    testRelationShip.baseMin = 'testBaseMin'
    testRelationShip.baseMax = 'testBaseMax'
    testRelationShip.refMin = 'testRefMin'
    testRelationShip.refMax = 'testRefMax'
    testRelationShip.onRefDelete = 'testOnRefDelete'
    testRelationShip.typeRelation = 'testTypeRelation'

    return testRelationShip


def createTestPropertyEquivalence():
    testPropertyModel1 = createTestPropertyModel()
    testPropertyModel1.save()
    testPropertyModel2 = createTestPropertyModel()
    testPropertyModel2.save()

    testPropertyEquivalence = PropertyEquivalence()
    testPropertyEquivalence.sourceProperty = testPropertyModel1
    testPropertyEquivalence.targetProperty = testPropertyModel2
    testPropertyEquivalence.description = 'testDescription'

    return testPropertyEquivalence


def createTestPrototype():
    testEntity = createTestEntity()
    testEntity.save()

    testPrototype = Prototype()
    testPrototype.entity = testEntity
    testPrototype.code = 'testCode'
    testPrototype.description = 'testDescription'
    testPrototype.notes = 'testNotes'
    testPrototype.metaDefinition = 'testMetaDefinition'

    return testPrototype


def createTestDiagram():
    testModel = createTestModel()
    testModel.save()

    testDiagram = Diagram()
    testDiagram.model = testModel
    testDiagram.code = 'testCode'
    testDiagram.description = 'testDescription'
    testDiagram.notes = 'testNotes'

    return testDiagram


def createTestDiagramEntity():
    testDiagram = createTestDiagram()
    testDiagram.save()

    testEntity = createTestEntity()
    testEntity.save()

    testDiagramEntity = DiagramEntity()
    testDiagramEntity.diagram = testDiagram
    testDiagramEntity.entity = testEntity

    return testDiagramEntity


def createTestService():
    testModel = createTestModel()
    testModel.save()

    testService = Service()
    testService.model = testModel
    testService.code = 'testCode'
    testService.Binding = 'testBinding'
    testService.typeMessage = 'testMessage'
    testService.description = 'testDescription'
    testService.notes = 'testNotes'

    return testService


def createTestServiceRef():
    testModel = createTestModel()
    testModel.save()

    testService = createTestService()
    testService.save()

    testServiceRef = ServiceRef()
    testServiceRef.model = testModel
    testServiceRef.service = testService
    testServiceRef.endpoint = 'testEndPoint'
    testServiceRef.description = 'testDescription'
    testServiceRef.notes = 'testNotes'

    return testServiceRef


def createTestProtoTable():
    testEntity = createTestEntity()
    testEntity.save()

    testProtoTable = ProtoTable()
    testProtoTable.entity = testEntity


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
        self.model = createTestModel()
        self.model.save()

    def tearDown(self):
        self.model.delete()

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


class Entity_ModelTest(TestCase):

    def setUp(self):
        self.entity = createTestEntity()
        self.entity.save()

    def tearDown(self):
        self.entity.delete()

    def test_creating_a_new_entity_and_saving_it_to_the_database(self):
        entity_in_database = Entity.objects.all()
        self.assertEqual(len(entity_in_database), 1)

    def test_verifying_entity_attribute_model_in_database(self):
        entity_in_database = Entity.objects.all()
        only_entry_in_database = entity_in_database[0]
        self.assertEqual(only_entry_in_database.model, self.entity.model)

    def test_verifying_entity_attribute_code_in_database(self):
        entity_in_database = Entity.objects.all()
        only_entry_in_database = entity_in_database[0]
        self.assertEqual(only_entry_in_database.code, self.entity.code)

    def test_verifying_entity_attribute_dbname_in_database(self):
        entity_in_database = Entity.objects.all()
        only_entry_in_database = entity_in_database[0]
        self.assertEqual(only_entry_in_database.dbName, self.entity.dbName)

    def test_verifying_entity_attribute_description_in_database(self):
        entity_in_database = Entity.objects.all()
        only_entry_in_database = entity_in_database[0]
        self.assertEqual(only_entry_in_database.description, self.entity.description)


# PropertyBase est une classe abstraite. Doit etre testee differemment
#class PropertyBase_ModelTest(TestCase):

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


class Property_ModelTest(TestCase):

    def setUp(self):
        self.property = createTestProperty()
        self.property.save()

    def tearDown(self):
        self.property.delete()

    def test_creating_a_new_property_and_saving_it_to_the_database(self):
        property_in_database = Property.objects.all()
        self.assertEqual(len(property_in_database), 1)

    def test_verifying_property_attribute_entity_in_database(self):
        property_in_database = Property.objects.all()
        only_entry_in_database = property_in_database[0]
        self.assertEqual(only_entry_in_database.entity, self.property.entity)

    def test_verifying_property_attribute_propertyModel_in_database(self):
        property_in_database = Property.objects.all()
        only_entry_in_database = property_in_database[0]
        self.assertEqual(only_entry_in_database.propertyModel, self.property.propertyModel)

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


# Error with save()
#class Relationship_ModelTest(TestCase):

    #def setUp(self):
        #self.relationship = createTestRelationship()
        #self.relationship.save()

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


class PropertyModel_ModelTest(TestCase):

    def setUp(self):
        self.propertymodel = createTestPropertyModel()
        self.propertymodel.save()

    def tearDown(self):
        self.propertymodel.delete()

    def test_creating_a_new_propertymodel_and_saving_it_to_the_database(self):
        propertymodel_in_database = PropertyModel.objects.all()
        self.assertEqual(len(propertymodel_in_database), 1)

    def test_verifying_propertymodel_attribute_model_in_database(self):
        propertymodel_in_database = PropertyModel.objects.all()
        only_entry_in_database = propertymodel_in_database[0]
        self.assertEqual(only_entry_in_database.model, self.propertymodel.model)

    def test_verifying_propertymodel_attribute_inherit_in_database(self):
        propertymodel_in_database = PropertyModel.objects.all()
        only_entry_in_database = propertymodel_in_database[0]
        self.assertEqual(only_entry_in_database.inherit, self.propertymodel.inherit)

    def test_verifying_propertymodel_attribute_conceptType_in_database(self):
        propertymodel_in_database = PropertyModel.objects.all()
        only_entry_in_database = propertymodel_in_database[0]
        self.assertEqual(only_entry_in_database.conceptType, self.propertymodel.conceptType)


class PropertyEquivalence_ModelTest(TestCase):

    def setUp(self):
        self.propertyequivalence = createTestPropertyEquivalence()
        self.propertyequivalence.save()

    def tearDown(self):
        self.propertyequivalence.delete()

    def test_creating_a_new_propertyequivalence_and_saving_it_to_the_database(self):
        propertyequivalence_in_database = PropertyEquivalence.objects.all()
        self.assertEqual(len(propertyequivalence_in_database), 2)

    def test_verifying_propertyequivalence_attribute_sourceproperty_in_database(self):
        propertyequivalence_in_database = PropertyEquivalence.objects.all()
        only_entry_in_database = propertyequivalence_in_database[0]
        self.assertEqual(only_entry_in_database.sourceProperty, self.propertyequivalence.sourceProperty)

    def test_verifying_propertyequivalence_attribute_targetproperty_in_database(self):
        propertyequivalence_in_database = PropertyEquivalence.objects.all()
        only_entry_in_database = propertyequivalence_in_database[0]
        self.assertEqual(only_entry_in_database.targetProperty, self.propertyequivalence.targetProperty)

    def test_verifying_propertyequivalence_attribute_description_in_database(self):
        propertyequivalence_in_database = PropertyEquivalence.objects.all()
        only_entry_in_database = propertyequivalence_in_database[0]
        self.assertEqual(only_entry_in_database.description, self.propertyequivalence.description)


class Prototype_ModelTest(TestCase):

    def setUp(self):
        self.prototype = createTestPrototype()
        self.prototype.save()

    def tearDown(self):
        self.prototype.delete()

    def test_creating_a_new_prototype_and_saving_it_to_the_database(self):
        prototype_in_database = Prototype.objects.all()
        self.assertEqual(len(prototype_in_database), 1)

    def test_verifying_prototype_attribute_entity_in_database(self):
        prototype_in_database = Prototype.objects.all()
        only_entry_in_database = prototype_in_database[0]
        self.assertEqual(only_entry_in_database.entity, self.prototype.entity)

    def test_verifying_prototype_attribute_code_in_database(self):
        prototype_in_database = Prototype.objects.all()
        only_entry_in_database = prototype_in_database[0]
        self.assertEqual(only_entry_in_database.code, self.prototype.code)

    def test_verifying_prototype_attribute_description_in_database(self):
        prototype_in_database = Prototype.objects.all()
        only_entry_in_database = prototype_in_database[0]
        self.assertEqual(only_entry_in_database.description, self.prototype.description)

    def test_verifying_prototype_attribute_notes_in_database(self):
        prototype_in_database = Prototype.objects.all()
        only_entry_in_database = prototype_in_database[0]
        self.assertEqual(only_entry_in_database.notes, self.prototype.notes)

    def test_verifying_prototype_attribute_metadefinition_in_database(self):
        prototype_in_database = Prototype.objects.all()
        only_entry_in_database = prototype_in_database[0]
        self.assertEqual(only_entry_in_database.metaDefinition, self.prototype.metaDefinition)

#
# AttributeError: 'NoneType' object has no attribute 'save'
#class ProtoTable_ModelTest(TestCase):

    #def setUp(self):
        #self.protoTable = createTestProtoTable()
        #self.protoTable.save()

    #def tearDown(self):
        #self.protoTable.delete()

    #def test_creating_a_new_prototable_and_saving_it_to_the_database(self):
        #prototable_in_database = ProtoTable.objects.all()
        #self.assertEqual(len(prototable_in_database), 1)


class Diagram_ModelTest(TestCase):

    def setUp(self):
        self.diagram = createTestDiagram()
        self.diagram.save()

    def tearDown(self):
        self.diagram.delete()

    def test_creating_a_new_diagram_and_saving_it_to_the_database(self):
        diagram_in_database = Diagram.objects.all()
        self.assertEqual(len(diagram_in_database), 1)

    def test_verifying_diagram_attribute_model_in_database(self):
        diagram_in_database = Diagram.objects.all()
        only_entry_in_database = diagram_in_database[0]
        self.assertEqual(only_entry_in_database.model, self.diagram.model)

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


class DiagramEntity_ModelTest(TestCase):

    def setUp(self):
        self.diagramEntity = createTestDiagramEntity()
        self.diagramEntity.save()

    def tearDown(self):
        self.diagramEntity.delete()

    def test_creating_a_new_diagramentity_and_saving_it_to_the_database(self):
        diagramentity_in_database = DiagramEntity.objects.all()
        self.assertEqual(len(diagramentity_in_database), 1)


class Service_ModelTest(TestCase):

    def setUp(self):
        self.service = createTestService()
        self.service.save()

    def tearDown(self):
        self.service.delete()

    def test_creating_a_new_service_and_saving_it_to_the_database(self):
        service_in_database = Service.objects.all()
        self.assertEqual(len(service_in_database), 1)


class ServiceRef_ModelTest(TestCase):

    def setUp(self):
        self.serviceRef = createTestServiceRef()
        self.serviceRef.save()

    def tearDown(self):
        self.serviceRef.delete()

    def test_creating_a_new_serviceref_and_saving_it_to_the_database(self):
        serviceref_in_database = ServiceRef.objects.all()
        self.assertEqual(len(serviceref_in_database), 1)
