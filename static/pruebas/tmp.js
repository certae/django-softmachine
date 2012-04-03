[ {
	"flex" : 1,
	"fieldLabel" : "Property",
	"name" : "code",
	"width" : 200,
	"minWidth" : 200,
	"header" : "\u00c9l\u00e9ments de donn\u00e9es",
	"type" : "CharField"
}, {
	"fieldLabel" : "Definition",
	"name" : "udp__DEFINITION"
}, {
	"fieldLabel" : "Elto transforme",
	"name" : "udp__ELEMENTTRANSFORME"
}, {
	"fieldLabel" : "Category",
	"name" : "concept__model__category"
}, {
	"fkField" : "concept",
	"name" : "concept_id",
	"xtype" : "protoId"
}, {
	"flex" : 1,
	"fieldLabel" : "Vue",
	"name" : "concept__model__code",
	"minWidth" : 200,
	"header" : "Vue",
	"type" : "CharField"
}, {
	"fieldLabel" : "Source Donnes",
	"name" : "udp__SOURCEDEDONNEESEXTERNES"
}, {
	"type" : "CharField",
	"fieldLabel" : "Type",
	"name" : "baseType",
	"header" : "Type de Base"
}, {
	"name" : "concept",
	"fkId" : "concept_id",
	"header" : "concept",
	"query_code" : "concept__code",
	"fkName" : "concept_protoFn___unicode__",
	"type" : "ForeignKey",
	"xtype" : "protoZoom "
}, {
	"fieldLabel" : "Precision",
	"name" : "udp__PRECISIONS"
}, {
	"xtype" : "booleancolumn",
	"type" : "BooleanField",
	"fieldLabel" : "Is null",
	"name" : "isNullable",
	"header" : "isNullable"
}, {
	"storeOnly" : true,
	"flex" : 1,
	"fieldLabel" : "Entity",
	"name" : "concept__code",
	"minWidth" : 200,
	"header" : "Concept",
	"type" : "CharField"
}, {
	"fieldLabel" : "Elto Transmis",
	"name" : "udp__ELEMENTTRANSMIS"
}, {
	"fieldLabel" : "Doc Reference",
	"name" : "udp__DOCUMENTDEREFERENCE"
}, {
	"storeOnly" : true,
	"flex" : 1,
	"fieldLabel" : "Description",
	"name" : "description",
	"header" : "Descriptions",
	"type" : "TextField"
}, {
	"fieldLabel" : "Rquis par",
	"name" : "udp__REQUISPAR"
}, {
	"fieldLabel" : "Validation Elto",
	"name" : "udp__VALIDATIONSSURELEMENT"
}, {
	"xtype" : "booleancolumn",
	"type" : "BooleanField",
	"fieldLabel" : "Is Required",
	"name" : "isRequired",
	"header" : "isRequired"
}, {
	"fieldLabel" : "Dt derniere modif",
	"xtype" : "datecolumn",
	"name" : "udp__DATEDERNIREMODIFICATION"
}, {
	"fieldLabel" : "Gabarit",
	"name" : "udp__GABARIT"
}, {
	"fieldLabel" : "Length",
	"xtype" : "numbercolumn ",
	"header" : "prpLength",
	"renderer" : "function(v) {return (v.toFixed && v.toFixed(2) || 0);}",
	"type" : "DecimalField",
	"name" : "prpLength"
}, {
	"fieldLabel" : "Entree en viguer",
	"name" : "udp__ENTREEENVIGUEUR"
}, {
	"fieldLabel" : "Validation",
	"name" : "udp__VALIDATION"
}, {
	"fieldLabel" : "Description CN",
	"name" : "udp__DESCRIPTIONCN"
}, {
	"fieldLabel" : "Validation Entt",
	"name" : "udp__VALIDATION_INTER-ENREGISTREMENT"
}, {
	"fieldLabel" : "Validation Reg",
	"name" : "udp__VALIDATIONSINTERELEMENT"
}, {
	"fieldLabel" : "Domain Valuers",
	"name" : "udp__DOMAINEDEVALEURS"
}, {
	"type" : "CharField",
	"fieldLabel" : "Alias",
	"name" : "alias",
	"header" : "Alias"
}, {
	"fieldLabel" : "Transmission",
	"name" : "udp__TRANSMISSION"
} ]