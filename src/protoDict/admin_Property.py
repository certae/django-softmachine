# -*- coding: utf-8 -*-
import django.contrib.admin          

class PropertyAdmin(django.contrib.admin.ModelAdmin):
    verbose_name_plural = 'Éléments de données' 

    protoDic= {
    "protoOption": "protoDic.PropertyDom",
    "protoMenuIx": "",
    "description": "Éléments de données",
    "shortTitle": "Éléments de données",
    "protoIcon": "icon-property",
    "protoConcept": "protoDic.PropertyDom",
    "protoMenuOpt": "",
    "helpPath": "",
    "idProperty": "id",
    "sheetConfig": {
        "protoSheetSelector": "concept__model__category",
        "protoSheets": [
            {
                "name": "DEFAULT",
                "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de l\'élément de donnée: </td><td>{{code}}</td></tr><tr class=\"blanco\"><td class=\"negro\"> Nom de la vue de l\'élément de donnée:</td><td>{{concept__model}}</td></tr><tr class=\"azul\"><td class=\"negro\">Description: </td><td class=\"desc\">{{description}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Statut élément de donnée:</td><td class=\"desc\">{{udp__STATUTELEMENTDEDONNEE}}</td></tr></table>",
                "title": "Fiche descriptive de l\'élément de donnée"
            },
            {
                "name": "AT",
                "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de l\'élément de donnée: </td><td>{{code}}</td></tr><tr class=\"blanco\"><td class=\"negro\"> Nom de la vue de l\'élément de donnée:</td><td>{{concept__model}}</td></tr><tr class=\"azul\"><td class=\"negro\">Description: </td><td class=\"desc\">{{description}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Statut élément de donnée:</td><td class=\"desc\">{{udp__STATUTELEMENTDEDONNEE}}</td></tr></table>",
                "title": "Fiche descriptive de l\'élément de donnée - AT"
            },
            {
                "name": "CN",
                "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de l\'élément de donnée: </td><td>{{code}}</td></tr><tr class=\"blanco\"><td class=\"negro\"> Nom de la vue de l\'élément de donnée:</td><td>{{concept__model}}</td></tr><tr class=\"azul\"><td class=\"negro\"> Document de référence: </td><td class=\"desc\">{{udp__DOCUMENTDEREFERENCE}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Numéro de l\'élément de donnée au CN: </td><td class=\"desc\">{{alias}}</td></tr><tr class=\"azul\"><td class=\"negro\">Type de donnée: </td><td class=\"desc\">{{baseType}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Longueur: </td><td class=\"desc\">{{prpLength}}</td></tr><tr class=\"azul\"><td class=\"negro\">Gabarit: </td><td class=\"desc\">{{udp__GABARIT}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Définition: </td><td class=\"desc\">{{udp__DEFINITION}}</td></tr><tr class=\"azul\"><td class=\"negro\">Description: </td><td class=\"desc\">{{udp__DESCRIPTIONCN}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Précisions: </td><td class=\"desc\">{{udp__PRECISIONS}}</td></tr><tr class=\"azul\"><td class=\"negro\">Validations sur l\'élément: </td><td class=\"desc\">{{udp__VALIDATIONSSURELEMENT}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Validations inter-éléments: </td><td class=\"desc\">{{udp__VALIDATIONSINTERELEMENT}}</td></tr><tr class=\"azul\"><td class=\"negro\">Validation inter-enregistrement: </td><td class=\"desc\">{{udp__VALIDATION_INTER-ENREGISTREMENT}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Source de données externes: </td><td class=\"desc\">{{udp__SOURCEDEDONNEESEXTERNES}}</td></tr><tr class=\"azul\"><td class=\"negro\">Élément transformé: </td><td class=\"desc\">{{udp__ELEMENTTRANSFORME}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Élément transmis: </td><td class=\"desc\">{{udp__ELEMENTTRANSMIS}}</td></tr><tr class=\"azul\"><td class=\"negro\">Domaine de valeurs: </td><td class=\"desc\">{{udp__DOMAINEDEVALEURS}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Entrée en vigueur: </td><td class=\"desc\">{{udp__ENTREEENVIGUEUR}}</td></tr><tr class=\"azul\"><td class=\"negro\">Date de la dernière modification: </td><td class=\"desc\">{{udp__DATEDERNIREMODIFICATION}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Valeur nulle possible (oui,non)</td><td class=\"desc\">{{isNullable}}</td></tr><tr class=\"azul\"><td class=\"negro\">Validation: </td><td class=\"desc\">{{udp__VALIDATION}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Requis par: </td><td class=\"desc\">{{udp__REQUISPAR}}</td></tr><tr class=\"azul\"><td class=\"negro\">Transmission: </td><td class=\"desc\">{{udp__TRANSMISSION}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Statut élément de donnée:</td><td class=\"desc\">{{udp__STATUTELEMENTDEDONNEE}}</td></tr></table>",
                "title": "Fiche descriptive de l\'élément de donnée - Cadre Normatif"
            }
        ],
        "protoSheetProperties": [
            "code",
            "baseType",
            "prpLength",
            "description",
            "udp__DOCUMENTDEREFERENCE",
            "udp__GABARIT",
            "udp__DEFINITION",
            "udp__DESCRIPTIONCN",
            "udp__PRECISIONS",
            "udp__VALIDATION",
            "udp__VALIDATIONSSURELEMENT",
            "udp__VALIDATIONSINTERELEMENT",
            "udp__VALIDATION_INTER-ENREGISTREMENT",
            "udp__SOURCEDEDONNEESEXTERNES",
            "udp__ELEMENTTRANSFORME",
            "udp__ELEMENTTRANSMIS",
            "udp__DOMAINEDEVALEURS",
            "udp__ENTREEENVIGUEUR",
            "udp__DATEDERNIREMODIFICATION",
            "udp__REQUISPAR",
            "udp__TRANSMISSION",
            "udp__STATUTELEMENTDEDONNEE"
        ]
    },
    "gridConfig": {
        "hideRowNumbers": False,
        "filterSetABC": "code",
        "hiddenFields": [
            "__str__"
        ],
        "listDisplay": [
            "code",
            "concept__model"
        ],
        "baseFilter": {
            "isForeign": False
        },
        "initialFilter": {},
        "filtersSet": [],
        "readOnlyFields": [],
        "sortFields": [
            "code",
            "concept__model"
        ],
        "initialSort": [
            {
                "sort": None,
                "direction": "ASC",
                "property": "code",
                "root": "data",
                "transform": None
            },
            {
                "sort": None,
                "direction": "ASC",
                "property": "concept__model",
                "root": "data",
                "transform": None
            }
        ],
        "searchFields": [
            "code",
            "concept__model"
        ]
    },
    "fields": [
        {
            "flex": 1,
            "fieldLabel": "Property",
            "name": "code",
            "width": 200,
            "tooltip": "Codigo o Identificador principal del objeto",
            "minWidth": 200,
            "header": "Élément de données",
            "fromModel": True,
            "type": "string",
            "allowBlank": False
        },
        {
            "flex": 1,
            "fieldLabel": "Éléments de Données",
            "name": "__str__",
            "fkId": "id",
            "zoomModel": "protoDic.PropertyDom",
            "cellLink": True,
            "header": "Éléments de Données",
            "readOnly": True,
            "type": "string",
            "allowBlank": True,
            "hidden": True
        },
        {
            "header": "VueId",
            "readOnly": True,
            "type": "string",
            "name": "concept__model_id"
        },
        {
            "type": "html",
            "fieldLabel": "Definition",
            "name": "udp__DEFINITION",
            "checked": True,
            "header": "udp__DEFINITION"
        },
        {
            "fieldLabel": "Elto transforme",
            "type": "bool",
            "name": "udp__ELEMENTTRANSFORME",
            "checked": True,
            "header": "udp__ELEMENTTRANSFORME"
        },
        {
            "fieldLabel": "Category",
            "readOnly": True,
            "type": "string",
            "name": "concept__model__category",
            "header": "concept__model__category"
        },
        {
            "fieldLabel": "Doc Reference",
            "type": "string",
            "name": "udp__DOCUMENTDEREFERENCE",
            "checked": True,
            "header": "udp__DOCUMENTDEREFERENCE"
        },
        {
            "fieldLabel": "Source Donnes",
            "type": "string",
            "name": "udp__SOURCEDEDONNEESEXTERNES",
            "checked": True,
            "header": "udp__SOURCEDEDONNEESEXTERNES"
        },
        {
            "type": "string",
            "fieldLabel": "Type",
            "name": "baseType",
            "fromModel": True,
            "header": "Type de Base"
        },
        {
            "type": "html",
            "fieldLabel": "Precision",
            "name": "udp__PRECISIONS",
            "checked": True,
            "header": "udp__PRECISIONS"
        },
        {
            "header": "Is null",
            "type": "bool",
            "name": "isNullable",
            "fromModel": True
        },
        {
            "storeOnly": True,
            "flex": 1,
            "fieldLabel": "Entity",
            "name": "concept__code",
            "minWidth": 200,
            "header": "Concept",
            "readOnly": True,
            "type": "string"
        },
        {
            "fieldLabel": "Elto Transmis",
            "type": "string",
            "name": "udp__ELEMENTTRANSMIS",
            "checked": True,
            "header": "udp__ELEMENTTRANSMIS"
        },
        {
            "zoomModel": "protoDic.Model",
            "name": "concept__model",
            "fkId": "concept__model_id",
            "flex": 1,
            "cellLink": True,
            "minWidth": 200,
            "header": "Vue",
            "readOnly": True,
            "type": "string"
        },
        {
            "storeOnly": True,
            "flex": 1,
            "vType": "plainText",
            "name": "description",
            "header": "Description",
            "fromModel": True,
            "type": "text"
        },
        {
            "fieldLabel": "Rquis par",
            "type": "string",
            "name": "udp__REQUISPAR",
            "checked": True,
            "header": "udp__REQUISPAR"
        },
        {
            "type": "html",
            "fieldLabel": "Validation Elto",
            "name": "udp__VALIDATIONSSURELEMENT",
            "checked": True,
            "header": "udp__VALIDATIONSSURELEMENT"
        },
        {
            "type": "bool",
            "fieldLabel": "Is Required",
            "name": "isRequired",
            "fromModel": True,
            "header": "isRequired"
        },
        {
            "type": "date",
            "fieldLabel": "Dt derniere modif",
            "name": "udp__DATEDERNIREMODIFICATION",
            "checked": True,
            "header": "udp__DATEDERNIREMODIFICATION"
        },
        {
            "type": "combo",
            "fieldLabel": "Gabarit",
            "name": "udp__GABARIT",
            "checked": True,
            "header": "udp__GABARIT"
        },
        {
            "fieldLabel": "Statut élément de donnée",
            "type": "string",
            "name": "udp__STATUTELEMENTDEDONNEE",
            "checked": True,
            "header": "udp__STATUTELEMENTDEDONNEE"
        },
        {
            "type": "decimal",
            "fieldLabel": "Length",
            "name": "prpLength",
            "fromModel": True,
            "header": "prpLength"
        },
        {
            "fieldLabel": "Entree en viguer",
            "type": "string",
            "name": "udp__ENTREEENVIGUEUR",
            "checked": True,
            "header": "udp__ENTREEENVIGUEUR"
        },
        {
            "type": "html",
            "fieldLabel": "Validation",
            "name": "udp__VALIDATION",
            "checked": True,
            "header": "udp__VALIDATION"
        },
        {
            "type": "html",
            "fieldLabel": "Description CN",
            "name": "udp__DESCRIPTIONCN",
            "checked": True,
            "header": "udp__DESCRIPTIONCN"
        },
        {
            "type": "html",
            "fieldLabel": "Validation Entt",
            "name": "udp__VALIDATION_INTER-ENREGISTREMENT",
            "checked": True,
            "header": "udp__VALIDATION_INTER-ENREGISTREMENT"
        },
        {
            "checked": True,
            "name": "udp__VALIDATIONSINTERELEMENT",
            "header": "udp__VALIDATIONSINTERELEMENT",
            "fieldLabel": "Validations inter-élément",
            "type": "html",
            "labelAlign": "left"
        },
        {
            "type": "html",
            "fieldLabel": "Domain Valuers",
            "name": "udp__DOMAINEDEVALEURS",
            "checked": True,
            "header": "udp__DOMAINEDEVALEURS"
        },
        {
            "type": "string",
            "fieldLabel": "Alias",
            "name": "alias",
            "fromModel": True,
            "header": "Alias"
        },
        {
            "fieldLabel": "Transmission",
            "type": "string",
            "name": "udp__TRANSMISSION",
            "checked": True,
            "header": "udp__TRANSMISSION"
        },
        {
            "header": "udp__elementssource",
            "readOnly": False,
            "type": "udp",
            "name": "udp__elementssource",
            "allowBlank": True
        },
        {
            "header": "udp__methodetransf",
            "readOnly": False,
            "type": "udp",
            "name": "udp__methodetransf",
            "allowBlank": True
        }
    ],
    "protoUdp": {
        "propertyPrefix": "udp",
        "propertyName": "code",
        "propertyValue": "valueUdp",
        "udpTable": "udp"
    },
    "protoDetails": [
        {
            "menuText": "UDPs ",
            "conceptDetail": "protoDic.UdpPropertyDom",
            "detailField": "propertyDom",
            "masterField": "propertyDom_id"
        }
    ],
    "protoForm": {
        "title": "nnn",
        "__ptType": "protoForm",
        "items": [
            {
                "fsLayout": "1col",
                "__ptType": "fieldset",
                "title": "Informations du chapitre 3 du Cadre Normatif",
                "items": [
                    {
                        "readOnly": True,
                        "fieldLabel": "Nom de la vue",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "concept__model"
                    },
                    {
                        "allowBlank": False,
                        "fieldLabel": "Élément de donnée",
                        "__ptType": "formField",
                        "xtype": "textfield",
                        "name": "code"
                    },
                    {
                        "readOnly": True,
                        "fieldLabel": "Category",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "concept__model__category"
                    },
                    {
                        "fieldLabel": "Numéro de l\'élément",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "alias"
                    },
                    {
                        "fieldLabel": "Format",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "baseType"
                    },
                    {
                        "decimalPrecision": 2,
                        "fieldLabel": "Longueur",
                        "xtype": "numberfield",
                        "allowDecimals": True,
                        "format": "0,000.00",
                        "__ptType": "formField",
                        "name": "prpLength"
                    },
                    {
                        "selectOnTab": True,
                        "fieldLabel": "Gabarit",
                        "xtype": "combobox",
                        "lazyRender": True,
                        "listClass": "x-combo-list-small",
                        "__ptType": "formField",
                        "typeAhead": True,
                        "triggerAction": "all",
                        "store": None,
                        "name": "udp__GABARIT"
                    },
                    {
                        "__ptType": "htmlset",
                        "items": [
                            {
                                "xtype": "textarea",
                                "fieldLabel": "Définition",
                                "name": "udp__DEFINITION",
                                "__ptType": "formField",
                                "height": 100,
                                "labelAlign": "top"
                            }
                        ]
                    },
                    {
                        "__ptType": "htmlset",
                        "items": [
                            {
                                "xtype": "textarea",
                                "fieldLabel": "Description",
                                "name": "udp__DESCRIPTIONCN",
                                "__ptType": "formField",
                                "height": 100,
                                "labelAlign": "top"
                            }
                        ]
                    },
                    {
                        "__ptType": "htmlset",
                        "items": [
                            {
                                "xtype": "textarea",
                                "fieldLabel": "Précisions",
                                "name": "udp__PRECISIONS",
                                "__ptType": "formField",
                                "height": 100,
                                "labelAlign": "top"
                            }
                        ]
                    },
                    {
                        "__ptType": "htmlset",
                        "items": [
                            {
                                "xtype": "textarea",
                                "fieldLabel": "Validations sur l\'élément",
                                "name": "udp__VALIDATIONSSURELEMENT",
                                "__ptType": "formField",
                                "height": 100,
                                "labelAlign": "top"
                            }
                        ]
                    },
                    {
                        "__ptType": "htmlset",
                        "items": [
                            {
                                "xtype": "textarea",
                                "fieldLabel": "Validations inter-élément",
                                "name": "udp__VALIDATIONSINTERELEMENT",
                                "__ptType": "formField",
                                "height": 100,
                                "labelAlign": "top"
                            }
                        ]
                    },
                    {
                        "__ptType": "htmlset",
                        "items": [
                            {
                                "xtype": "textarea",
                                "fieldLabel": "Validations inter-enregistrement",
                                "name": "udp__VALIDATION_INTER-ENREGISTREMENT",
                                "__ptType": "formField",
                                "height": 100,
                                "labelAlign": "top"
                            }
                        ]
                    },
                    {
                        "fieldLabel": "Source de données externes",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "udp__SOURCEDEDONNEESEXTERNES"
                    },
                    {
                        "fsLayout": "1col",
                        "__ptType": "fieldset",
                        "items": [
                            {
                                "selectOnTab": True,
                                "fieldLabel": "Élément transformé?",
                                "xtype": "combobox",
                                "lazyRender": True,
                                "listClass": "x-combo-list-small",
                                "__ptType": "formField",
                                "typeAhead": True,
                                "triggerAction": "all",
                                "store": None,
                                "name": "udp__ELEMENTTRANSFORME"
                            },
                            {
                                "xtype": "textfield",
                                "fieldLabel": "Élements de source",
                                "name": "udp__elementssource",
                                "__ptType": "formField",
                                "readOnly": False,
                                "allowBlank": True
                            },
                            {
                                "xtype": "textfield",
                                "fieldLabel": "Méthode de transformation",
                                "name": "udp__methodetransf",
                                "__ptType": "formField",
                                "readOnly": False,
                                "allowBlank": True
                            }
                        ]
                    },
                    {
                        "fieldLabel": "Élément transmis",
                        "xtype": "checkbox",
                        "__ptType": "formField",
                        "name": "udp__ELEMENTTRANSMIS"
                    },
                    {
                        "xtype": "textarea",
                        "fieldLabel": "Domaine de valuers",
                        "name": "udp__DOMAINEDEVALEURS",
                        "__ptType": "formField",
                        "height": 100,
                        "labelAlign": "left"
                    },
                    {
                        "fieldLabel": "Entrée en vigueur",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "udp__ENTREEENVIGUEUR"
                    },
                    {
                        "name": "udp__DATEDERNIREMODIFICATION",
                        "fieldLabel": "Date de dernière modification",
                        "xtype": "datefield",
                        "__ptType": "formField",
                        "format": "Y/m/d"
                    },
                    {
                        "fieldLabel": "Statut d\'élément de donnée",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "udp__STATUTELEMENTDEDONNEE"
                    }
                ]
            }
        ]
    }
}