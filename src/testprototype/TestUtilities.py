from prototype.models import *


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

    return testPropertyBase


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

    return testProtoTable
