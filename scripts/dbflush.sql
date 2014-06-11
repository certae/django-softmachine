BEGIN;

DELETE FROM "prototype_diagram";
DELETE FROM "prototype_diagramentity";
DELETE FROM "prototype_diagramrefentity";
DELETE FROM "prototype_entity";
DELETE FROM "prototype_model";
DELETE FROM "prototype_project";
DELETE FROM "prototype_property";
DELETE FROM "prototype_propertyequivalence";
DELETE FROM "prototype_prototable";
DELETE FROM "prototype_prototype";
DELETE FROM "prototype_relationship";
DELETE FROM "prototype_service";
DELETE FROM "prototype_serviceref";

COMMIT;
