# -*- coding: utf-8 -*-
import django.contrib.admin          

class PropertyAdmin(django.contrib.admin.ModelAdmin):
    verbose_name_plural = 'Éléments de données' 
    list_display =( 'code', 'category', 'concept')
    search_fields = ( 'code', 'category', 'concept' )


    protoExt= {
    "sheetConfig": {
        "protoSheets": [{
            "name": "DEFAULT",
            "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de l'\u00e9l\u00e9ment de donn\u00e9e: </td><td>{{code}}</td></tr><tr class=\"blanco\"><td class=\"negro\"> Nom de la vue de l'\u00e9l\u00e9ment de donn\u00e9e:</td><td>{{concept__model}}</td></tr><tr class=\"azul\"><td class=\"negro\">Description: </td><td class=\"desc\">{{description}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Statut \u00e9l\u00e9ment de donn\u00e9e:</td><td class=\"desc\">{{udp__STATUTELEMENTDEDONNEE}}</td></tr></table>",
            "title": "Fiche descriptive de l'\u00e9l\u00e9ment de donn\u00e9e"
        }, {
            "name": "AT",
            "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de l'\u00e9l\u00e9ment de donn\u00e9e: </td><td>{{code}}</td></tr><tr class=\"blanco\"><td class=\"negro\"> Nom de la vue de l'\u00e9l\u00e9ment de donn\u00e9e:</td><td>{{concept__model}}</td></tr><tr class=\"azul\"><td class=\"negro\">Description: </td><td class=\"desc\">{{description}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Statut \u00e9l\u00e9ment de donn\u00e9e:</td><td class=\"desc\">{{udp__STATUTELEMENTDEDONNEE}}</td></tr></table>",
            "title": "Fiche descriptive de l'\u00e9l\u00e9ment de donn\u00e9e - AT"
        }, {
            "name": "CN",
            "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de l'\u00e9l\u00e9ment de donn\u00e9e: </td><td>{{code}}</td></tr><tr class=\"blanco\"><td class=\"negro\"> Nom de la vue de l'\u00e9l\u00e9ment de donn\u00e9e:</td><td>{{concept__model}}</td></tr><tr class=\"azul\"><td class=\"negro\"> Document de r\u00e9f\u00e9rence: </td><td class=\"desc\">{{udp__DOCUMENTDEREFERENCE}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Num\u00e9ro de l'\u00e9l\u00e9ment de donn\u00e9e au CN: </td><td class=\"desc\">{{alias}}</td></tr><tr class=\"azul\"><td class=\"negro\">Type de donn\u00e9e: </td><td class=\"desc\">{{baseType}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Longueur: </td><td class=\"desc\">{{prpLength}}</td></tr><tr class=\"azul\"><td class=\"negro\">Gabarit: </td><td class=\"desc\">{{udp__GABARIT}}</td></tr><tr class=\"blanco\"><td class=\"negro\">D\u00e9finition: </td><td class=\"desc\">{{udp__DEFINITION}}</td></tr><tr class=\"azul\"><td class=\"negro\">Description: </td><td class=\"desc\">{{udp__DESCRIPTIONCN}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Pr\u00e9cisions: </td><td class=\"desc\">{{udp__PRECISIONS}}</td></tr><tr class=\"azul\"><td class=\"negro\">Validations sur l'\u00e9l\u00e9ment: </td><td class=\"desc\">{{udp__VALIDATIONSSURELEMENT}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Validations inter-\u00e9l\u00e9ments: </td><td class=\"desc\">{{udp__VALIDATIONSINTERELEMENT}}</td></tr><tr class=\"azul\"><td class=\"negro\">Validation inter-enregistrement: </td><td class=\"desc\">{{udp__VALIDATION_INTER-ENREGISTREMENT}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Source de donn\u00e9es externes: </td><td class=\"desc\">{{udp__SOURCEDEDONNEESEXTERNES}}</td></tr><tr class=\"azul\"><td class=\"negro\">\u00c9l\u00e9ment transform\u00e9: </td><td class=\"desc\">{{udp__ELEMENTTRANSFORME}}</td></tr><tr class=\"blanco\"><td class=\"negro\">\u00c9l\u00e9ment transmis: </td><td class=\"desc\">{{udp__ELEMENTTRANSMIS}}</td></tr><tr class=\"azul\"><td class=\"negro\">Domaine de valeurs: </td><td class=\"desc\">{{udp__DOMAINEDEVALEURS}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Entr\u00e9e en vigueur: </td><td class=\"desc\">{{udp__ENTREEENVIGUEUR}}</td></tr><tr class=\"azul\"><td class=\"negro\">Date de la derni\u00e8re modification: </td><td class=\"desc\">{{udp__DATEDERNIREMODIFICATION}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Valeur nulle possible (oui,non)</td><td class=\"desc\">{{isNullable}}</td></tr><tr class=\"azul\"><td class=\"negro\">Validation: </td><td class=\"desc\">{{udp__VALIDATION}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Requis par: </td><td class=\"desc\">{{udp__REQUISPAR}}</td></tr><tr class=\"azul\"><td class=\"negro\">Transmission: </td><td class=\"desc\">{{udp__TRANSMISSION}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Statut \u00e9l\u00e9ment de donn\u00e9e:</td><td class=\"desc\">{{udp__STATUTELEMENTDEDONNEE}}</td></tr></table>",
            "title": "Fiche descriptive de l'\u00e9l\u00e9ment de donn\u00e9e - Cadre Normatif"
        }],
        "protoSheetSelector": "concept__model__category",
        "protoSheetProperties": ["code", "concept__model", "isNullable", "alias", "baseType", "prpLength", "description", "udp__DOCUMENTDEREFERENCE", "udp__GABARIT", "udp__DEFINITION", "udp__DESCRIPTIONCN", "udp__PRECISIONS", "udp__VALIDATION", "udp__VALIDATIONSSURELEMENT", "udp__VALIDATIONSINTERELEMENT", "udp__VALIDATION_INTER-ENREGISTREMENT", "udp__SOURCEDEDONNEESEXTERNES", "udp__ELEMENTTRANSFORME", "udp__ELEMENTTRANSMIS", "udp__DOMAINEDEVALEURS", "udp__ENTREEENVIGUEUR", "udp__DATEDERNIREMODIFICATION", "udp__REQUISPAR", "udp__TRANSMISSION", "udp__STATUTELEMENTDEDONNEE"]
    },
    "protoMenuIx": "",
    "description": "\u00c9l\u00e9ments de donn\u00e9es",
    "protoConcept": "protoExt.Property",
    "protoIcon": "icon-property",
    "protoUdp": {
        "propertyPrefix": "udp",
        "propertyName": "code",
        "propertyValue": "valueUdp",
        "udpTable": "udp"
    },
    "helpPath": "",
    "idProperty": "id",
    "gridConfig": {
        "baseFilter": {
            "isForeign": False
        },
        "hideRowNumbers": False,
        "readOnlyFields": [],
        "sortFields": ["code", "concept__model"],
        "initialSort": [{
            "direction": "ASC",
            "property": "code",
            "root": "data"
        }, {
            "direction": "ASC",
            "property": "concept__model",
            "root": "data"
        }],
        "initialFilter": {},
        "hiddenFields": ["id"],
        "listDisplay": ["code", "concept__model"],
        "filterSetABC": "code",
        "filtersSet": [],
        "searchFields": ["code", "concept__model"]
    },
    "protoOption": "protoExt.Property",
    "shortTitle": "\u00c9l\u00e9ments de donn\u00e9es",
    "fields": [{
        "flex": 1,
        "fieldLabel": "Property",
        "name": "code",
        "width": 200,
        "tooltip": "Codigo o Identificador principal del objeto",
        "minWidth": 200,
        "header": "\u00c9l\u00e9ments de donn\u00e9es",
        "fromModel": True,
        "type": "string",
        "allowBlank": False
    }, {
        "flex": 1,
        "name": "__str__",
        "fkId": "id",
        "zoomModel": "protoExt.Property",
        "cellLink": True,
        "header": "\u00c9L\u00e9Ments De Donn\u00e9Es",
        "readOnly": True,
        "type": "string",
        "allowBlank": True
    }, {
        "header": "VueId",
        "readOnly": True,
        "name": "concept__model_id",
        "type": "string"
    }, {
        "type": "html",
        "fieldLabel": "Definition",
        "name": "udp__DEFINITION",
        "header": "udp__DEFINITION"
    }, {
        "fieldLabel": "Elto transforme",
        "name": "udp__ELEMENTTRANSFORME",
        "type": "string",
        "header": "udp__ELEMENTTRANSFORME"
    }, {
        "readOnly": True,
        "fieldLabel": "Category",
        "name": "concept__model__category",
        "type": "string",
        "header": "concept__model__category"
    }, {
        "fieldLabel": "Doc Reference",
        "name": "udp__DOCUMENTDEREFERENCE",
        "type": "string",
        "header": "udp__DOCUMENTDEREFERENCE"
    }, {
        "fieldLabel": "Source Donnes",
        "name": "udp__SOURCEDEDONNEESEXTERNES",
        "type": "string",
        "header": "udp__SOURCEDEDONNEESEXTERNES"
    }, {
        "type": "string",
        "fieldLabel": "Type",
        "name": "baseType",
        "fromModel": True,
        "header": "Type de Base"
    }, {
        "type": "html",
        "fieldLabel": "Precision",
        "name": "udp__PRECISIONS",
        "header": "udp__PRECISIONS"
    }, {
        "header": "Is null",
        "type": "bool",
        "name": "isNullable",
        "fromModel": True
    }, {
        "storeOnly": True,
        "flex": 1,
        "fieldLabel": "Entity",
        "name": "concept__code",
        "minWidth": 200,
        "header": "Concept",
        "readOnly": True,
        "type": "string"
    }, {
        "fieldLabel": "Elto Transmis",
        "name": "udp__ELEMENTTRANSMIS",
        "type": "string",
        "header": "udp__ELEMENTTRANSMIS"
    }, {
        "zoomModel": "protoExt.Model",
        "name": "concept__model",
        "fkId": "concept__model_id",
        "flex": 1,
        "cellLink": True,
        "minWidth": 200,
        "header": "Vue",
        "readOnly": True,
        "type": "string"
    }, {
        "storeOnly": True,
        "flex": 1,
        "vType": "plainText",
        "name": "description",
        "header": "Description",
        "fromModel": True,
        "type": "text"
    }, {
        "fieldLabel": "Rquis par",
        "name": "udp__REQUISPAR",
        "type": "string",
        "header": "udp__REQUISPAR"
    }, {
        "type": "html",
        "fieldLabel": "Validation Elto",
        "name": "udp__VALIDATIONSSURELEMENT",
        "header": "udp__VALIDATIONSSURELEMENT"
    }, {
        "type": "bool",
        "fieldLabel": "Is Required",
        "name": "isRequired",
        "fromModel": True,
        "header": "isRequired"
    }, {
        "type": "date",
        "fieldLabel": "Dt derniere modif",
        "name": "udp__DATEDERNIREMODIFICATION",
        "header": "udp__DATEDERNIREMODIFICATION"
    }, {
        "type": "combo",
        "fieldLabel": "Gabarit",
        "name": "udp__GABARIT",
        "choices": [
            ["0", "cero"],
            ["1", "uno"]
        ],
        "header": "udp__GABARIT"
    }, {
        "fieldLabel": "Statut \u00e9l\u00e9ment de donn\u00e9e",
        "name": "udp__STATUTELEMENTDEDONNEE",
        "type": "string",
        "header": "udp__STATUTELEMENTDEDONNEE"
    }, {
        "type": "decimal",
        "fieldLabel": "Length",
        "name": "prpLength",
        "fromModel": True,
        "header": "prpLength"
    }, {
        "fieldLabel": "Entree en viguer",
        "name": "udp__ENTREEENVIGUEUR",
        "type": "string",
        "header": "udp__ENTREEENVIGUEUR"
    }, {
        "type": "html",
        "fieldLabel": "Validation",
        "name": "udp__VALIDATION",
        "header": "udp__VALIDATION"
    }, {
        "type": "html",
        "fieldLabel": "Description CN",
        "name": "udp__DESCRIPTIONCN",
        "header": "udp__DESCRIPTIONCN"
    }, {
        "type": "html",
        "fieldLabel": "Validation Entt",
        "name": "udp__VALIDATION_INTER-ENREGISTREMENT",
        "header": "udp__VALIDATION_INTER-ENREGISTREMENT"
    }, {
        "type": "html",
        "fieldLabel": "Validation Reg",
        "name": "udp__VALIDATIONSINTERELEMENT",
        "header": "udp__VALIDATIONSINTERELEMENT"
    }, {
        "type": "html",
        "fieldLabel": "Domain Valuers",
        "name": "udp__DOMAINEDEVALEURS",
        "header": "udp__DOMAINEDEVALEURS"
    }, {
        "type": "string",
        "fieldLabel": "Alias",
        "name": "alias",
        "fromModel": True,
        "header": "Alias"
    }, {
        "fieldLabel": "Transmission",
        "name": "udp__TRANSMISSION",
        "type": "string",
        "header": "udp__TRANSMISSION"
    }],
    "protoMenuOpt": "",
    "protoDetails": [{
        "menuText": "UDPs ",
        "conceptDetail": "protoExt.Udp",
        "detailField": "metaObj__pk",
        "masterField": "pk"
    }],
    "protoForm": {
        "items": [{
            "items": [{
                "name": "code",
                "__ptType": "formField"
            }],
            "fsLayout": "2col",
            "__ptType": "fieldset"
        }, {
            "items": [{
                "name": "isNullable",
                "__ptType": "formField"
            }, {
                "name": "isRequired",
                "__ptType": "formField"
            }],
            "fsLayout": "2col",
            "__ptType": "fieldset"
        }, {
            "items": [{
                "name": "concept__model_id",
                "__ptType": "formField"
            }, {
                "name": "udp__DEFINITION",
                "__ptType": "formField"
            }, {
                "name": "udp__ELEMENTTRANSFORME",
                "__ptType": "formField"
            }, {
                "name": "concept__model__category",
                "__ptType": "formField"
            }, {
                "name": "udp__DOCUMENTDEREFERENCE",
                "__ptType": "formField"
            }, {
                "name": "udp__SOURCEDEDONNEESEXTERNES",
                "__ptType": "formField"
            }, {
                "name": "baseType",
                "__ptType": "formField"
            }, {
                "name": "udp__PRECISIONS",
                "__ptType": "formField"
            }, {
                "name": "udp__ELEMENTTRANSMIS",
                "__ptType": "formField"
            }, {
                "name": "concept__model",
                "__ptType": "formField"
            }, {
                "name": "udp__REQUISPAR",
                "__ptType": "formField"
            }, {
                "name": "udp__VALIDATIONSSURELEMENT",
                "__ptType": "formField"
            }, {
                "name": "udp__DATEDERNIREMODIFICATION",
                "__ptType": "formField"
            }, {
                "name": "udp__GABARIT",
                "__ptType": "formField"
            }, {
                "name": "udp__STATUTELEMENTDEDONNEE",
                "__ptType": "formField"
            }, {
                "name": "prpLength",
                "__ptType": "formField"
            }, {
                "name": "udp__ENTREEENVIGUEUR",
                "__ptType": "formField"
            }, {
                "name": "udp__VALIDATION",
                "__ptType": "formField"
            }, {
                "name": "udp__DESCRIPTIONCN",
                "__ptType": "formField"
            }, {
                "name": "udp__VALIDATION_INTER-ENREGISTREMENT",
                "__ptType": "formField"
            }, {
                "name": "udp__VALIDATIONSINTERELEMENT",
                "__ptType": "formField"
            }, {
                "name": "udp__DOMAINEDEVALEURS",
                "__ptType": "formField"
            }, {
                "name": "alias",
                "__ptType": "formField"
            }, {
                "name": "udp__TRANSMISSION",
                "__ptType": "formField"
            }],
            "fsLayout": "2col",
            "__ptType": "fieldset"
        }]
    }
}
