from prototype.models import Project, Model, Entity, Property, Relationship, PropertyEquivalence, Prototype, ProtoTable, Diagram, DiagramEntity

def createTestProject():

    projectdata = {
        'code': 'testCode',
        'description': 'Project used for tests',
        'dbEngine': 'MySQL',
        'dbName': 'testDatabase',
        'dbUser': 'testdbUser',
        'dbPassword': 'testdbPassword',
        'dbHost': 'testlocalhost',
        'dbPort': 'testPort'
    }

    testProject = Project(**projectdata)
    testProject.save()

    return testProject


def createTestModel():
    testProject = createTestProject()
    testProject.save()

    modeldata = {
        'project': testProject,
        'code': 'testCode',
        'category': 'testCategory',
        'modelPrefix': 'testPrefix',
        'description': 'Model used for tests'
    }

    testModel = Model(**modeldata)
    testModel.save()

    return testModel


def createTestEntity():
    testModel = createTestModel()
    testModel.save()

    entitydata = {
        'model': testModel,
        'code': 'testEntityCode',
        'dbName': 'testEntitydbName',
        'description': 'testEntityDescription',
        'smUUID': '465bf0b2a50ff6cbfdf00cbf142d239b'
    }

    testEntity = Entity(**entitydata)
    testEntity.save()

    return testEntity



def createTestProperty():
    testEntity = createTestEntity()
    testEntity.save()

    propertydata = {
        'entity': testEntity,
        'isPrimary': True,
        'isLookUpResult': True,
        'isNullable': True,
        'isRequired': True,
        'isReadOnly': True,
        'isEssential': True,
        'isForeign': False,
        'isSensitive' : True,
        'crudType': 'testCrudType',
        'dbName': 'testDbName'
    }

    testProperty = Property(**propertydata)
    testProperty.save()

    return testProperty


def createTestRelationship():
    testEntity1 = createTestEntity()
    testEntity1.save()

    testEntity2 = createTestEntity()
    testEntity2.save()

    relationshipdata = {
        'refEntity': testEntity1,
        'relatedName': 'testPropertyModel',
        'baseMin': 'testBaseMin',
        'baseMax': 'testBaseMax',
        'refMin': 'testRefMin',
        'refMax': 'testRefMax',
        'onRefDelete': 'testOnRefDelete',
        'typeRelation': 'testTypeRelation',

        'entity': testEntity2,
        'isPrimary': True,
        'isLookUpResult': True,
        'isNullable': True,
        'isRequired': True,
        'isReadOnly': True,
        'isEssential': True,
        'isForeign': False,
        'isSensitive' : False,
        'crudType': 'testCrudType',
        'dbName': 'testDbName'
    }

    testRelationShip = Relationship(**relationshipdata)
    testRelationShip.save()

    return testRelationShip



def createTestPropertyEquivalence():
    testPropertyModel1 = createTestProperty()
    testPropertyModel1.save()
    testPropertyModel2 = createTestProperty()
    testPropertyModel2.save()

    propertyequivalencedata = {
        'sourceProperty': testPropertyModel1,
        'targetProperty': testPropertyModel2,
        'description': 'testDescription'
    }

    testPropertyEquivalence = PropertyEquivalence(**propertyequivalencedata)
    testPropertyEquivalence.save()

    return testPropertyEquivalence


def createTestPrototype():
    testEntity = createTestEntity()
    testEntity.save()

    prototypedata = {
        'entity': testEntity,
        'code': 'testCode',
        'description': 'testDescription',
        'notes': 'testNotes',
        'metaDefinition': 'testMetaDefinition'
    }

    testPrototype = Prototype(**prototypedata)
    testPrototype.save()

    return testPrototype


def createTestDiagram():
    projectModel = createTestProject()
    projectModel.save()

    diagramdata = {
        'project': projectModel,
        'code': 'testCode',
        'description': 'testDescription',
        'notes': 'testNotes'
    }

    testDiagram = Diagram(**diagramdata)
    testDiagram.save()

    return testDiagram


def createTestDiagramEntity():
    testDiagram = createTestDiagram()
    testDiagram.save()

    testEntity = createTestEntity()
    testEntity.save()

    diagramentitydata = {
        'diagram': testDiagram,
        'entity': testEntity
    }

    testDiagramEntity = DiagramEntity(**diagramentitydata)
    testDiagramEntity.save()

    return testDiagramEntity


def createTestProtoTable():
    testEntity = createTestEntity()
    testEntity.save()

    prototabledata = {
        'entity': testEntity
    }

    testProtoTable = ProtoTable(**prototabledata)
    testProtoTable.save()

    return testProtoTable
