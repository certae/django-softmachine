# -*- coding: utf-8 -*-
import django.contrib.admin          

class PropertyAdmin(django.contrib.admin.ModelAdmin):

    protoExt= {
    "protoOption": "protoExt.Property",
    "description": "Éléments de données",
    "shortTitle": "Éléments de données",
    "protoIcon": "icon-property",
    "protoConcept": "protoExt.Property",
    "version": "4.23",
    "helpPath": "",
    "idProperty": "id",
    "sheetConfig": {
        "protoSheetSelector": "concept__model__category",
        "protoSheets": [
            {
                "name": "DEFAULT",
                "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de l\'élément de donnée: </td><td>{{code}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Description: </td><td class=\"desc\">{{description}}</td></tr><tr class=\"azul\"><td class=\"negro\">Statut élément de donnée:</td><td class=\"desc\">{{udp__STATUTELEMENTDEDONNEE}}</td></tr></table>",
                "title": "Fiche descriptive de l\'élément de donnée"
            },
            {
                "name": "AT",
                "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de l\'élément de donnée: </td><td>{{code}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Description: </td><td class=\"desc\">{{description}}</td></tr><tr class=\"azul\"><td class=\"negro\">Statut élément de donnée:</td><td class=\"desc\">{{udp__STATUTELEMENTDEDONNEE}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Acteur principal: </td><td class=\"desc\">{{udp__ActeurPrincipal}}</td></tr><tr class=\"azul\"><td class=\"negro\">Autres acteurs: </td><td>{{udp__AutresActeurs}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Intrants déclencheurs: </td><td class=\"desc\">{{udp__IntrantsDeclencheurs}}</td></tr></table>",
                "title": "Fiche descriptive de l\'élément de donnée - AT"
            },
            {
                "name": "CN",
                "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de l\'élément de donnée: </td><td>{{code}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Numéro de l\'élément de donnée au CN: </td><td class=\"desc\">{{udp__numelement}}</td></tr><tr class=\"azul\"><td class=\"negro\">Type de donnée: </td><td class=\"desc\">{{baseType}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Longueur: </td><td class=\"desc\">{{prpLength}}</td></tr><tr class=\"azul\"><td class=\"negro\">Gabarit: </td><td class=\"desc\">{{udp__GABARIT}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Définition: </td><td class=\"desc\">{{udp__DEFINITION}}</td></tr><tr class=\"azul\"><td class=\"negro\">Description: </td><td class=\"desc\">{{udp__DESCRIPTIONCN}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Précisions: </td><td class=\"desc\">{{udp__PRECISIONS}}</td></tr><tr class=\"azul\"><td class=\"negro\">Validations sur l\'élément: </td><td class=\"desc\">{{udp__VALIDATIONSSURELEMENT}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Validations inter-éléments: </td><td class=\"desc\">{{udp__VALIDATIONSINTERELEMENT}}</td></tr><tr class=\"azul\"><td class=\"negro\">Validation inter-enregistrement: </td><td class=\"desc\">{{udp__VALIDATION_INTER-ENREGISTREMENT}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Source de données externes: </td><td class=\"desc\">{{udp__SOURCEDEDONNEESEXTERNES}}</td></tr><tr class=\"azul\"><td class=\"negro\">Élément transformé: </td><td class=\"desc\">{{udp__ELEMENTTRANSFORME}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Éléments de source: </td><td class=\"desc\">{{udp__elementssource}}</td></tr><tr class=\"azul\"><td class=\"negro\">Méthode de transformation: </td><td class=\"desc\">{{udp__methodetransf}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Élément transmis: </td><td class=\"desc\">{{udp__ELEMENTTRANSMIS}}</td></tr><tr class=\"azul\"><td class=\"negro\">Domaine de valeurs: </td><td class=\"desc\">{{udp__DOMAINEDEVALEURS}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Entrée en vigueur: </td><td class=\"desc\">{{udp__ENTREEENVIGUEUR}}</td></tr><tr class=\"azul\"><td class=\"negro\">Date de la dernière modification: </td><td class=\"desc\">{{udp__DATEDERNIREMODIFICATION}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Validation: </td><td class=\"desc\">{{udp__VALIDATION}}</td></tr><tr class=\"azul\"><td class=\"negro\">Requis par: </td><td class=\"desc\">{{udp__REQUISPAR}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Transmission: </td><td class=\"desc\">{{udp__TRANSMISSION}}</td></tr><tr class=\"azul\"><td class=\"negro\">Statut élément de donnée:</td><td class=\"desc\">{{udp__STATUTELEMENTDEDONNEE}}</td></tr></table>",
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
            "udp__STATUTELEMENTDEDONNEE",
            "udp__elementssource",
            "udp__methodetransf",
            "udp__numelement"
        ]
    },
    "gridConfig": {
        "hideRowNumbers": False,
        "filterSetABC": "code",
        "searchFields": [
            "code",
            "concept__model"
        ],
        "baseFilter": {
            "isForeign": False
        },
        "listDisplay": [
            "code",
            "concept__model"
        ],
        "hiddenFields": [],
        "filtersSet": [],
        "readOnlyFields": [],
        "sortFields": [
            "code",
            "concept__model"
        ],
        "initialSort": [
            {
                "direction": "ASC",
                "property": "code"
            },
            {
                "direction": "ASC",
                "property": "concept__model"
            }
        ],
        "initialFilter": {}
    },
    "fields": [
        {
            "flex": 1,
            "fieldLabel": "Property",
            "name": "code",
            "header": "Élément de données",
            "tooltip": "Codigo o Identificador principal del objeto",
            "minWidth": 200,
            "width": 200,
            "fromModel": True,
            "type": "string",
            "allowBlank": False
        },
        {
            "flex": 1,
            "fieldLabel": "Éléments de Données",
            "allowBlank": True,
            "fkId": "id",
            "zoomModel": "protoExt.Property",
            "cellLink": True,
            "header": "Éléments de Données",
            "readOnly": True,
            "hidden": True,
            "type": "string",
            "name": "__str__"
        },
        {
            "header": "VueId",
            "readOnly": True,
            "type": "string",
            "name": "concept__model_id"
        },
        {
            "header": "udp__DEFINITION",
            "fieldLabel": "Definition",
            "name": "udp__DEFINITION",
            "checked": True,
            "type": "html"
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__elementssource",
            "readOnly": False,
            "type": "udp",
            "name": "udp__elementssource"
        },
        {
            "header": "udp__ELEMENTTRANSFORME",
            "type": "bool",
            "name": "udp__ELEMENTTRANSFORME",
            "checked": True,
            "fieldLabel": "Elto transforme"
        },
        {
            "fieldLabel": "Category",
            "readOnly": True,
            "type": "string",
            "name": "concept__model__category",
            "header": "concept__model__category"
        },
        {
            "header": "udp__DOCUMENTDEREFERENCE",
            "type": "string",
            "name": "udp__DOCUMENTDEREFERENCE",
            "checked": True,
            "fieldLabel": "Doc Reference"
        },
        {
            "header": "udp__SOURCEDEDONNEESEXTERNES",
            "type": "string",
            "name": "udp__SOURCEDEDONNEESEXTERNES",
            "checked": True,
            "fieldLabel": "Source Donnes"
        },
        {
            "type": "string",
            "fieldLabel": "Type",
            "name": "baseType",
            "fromModel": True,
            "header": "Type de Base"
        },
        {
            "header": "udp__PRECISIONS",
            "fieldLabel": "Precision",
            "name": "udp__PRECISIONS",
            "checked": True,
            "type": "html"
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
            "xtype": "combobox",
            "choices": "xxxxxx, yyyyyy, zzzz",
            "header": "udp__ELEMENTTRANSMIS",
            "checked": True,
            "type": "string",
            "name": "udp__ELEMENTTRANSMIS"
        },
        {
            "zoomModel": "protoExt.Model",
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
            "header": "udp__REQUISPAR",
            "type": "string",
            "name": "udp__REQUISPAR",
            "checked": True,
            "fieldLabel": "Rquis par"
        },
        {
            "header": "udp__VALIDATIONSSURELEMENT",
            "fieldLabel": "Validation Elto",
            "name": "udp__VALIDATIONSSURELEMENT",
            "checked": True,
            "type": "html"
        },
        {
            "type": "bool",
            "fieldLabel": "Is Required",
            "name": "isRequired",
            "fromModel": True,
            "header": "isRequired"
        },
        {
            "header": "udp__DATEDERNIREMODIFICATION",
            "fieldLabel": "Dt derniere modif",
            "name": "udp__DATEDERNIREMODIFICATION",
            "checked": True,
            "type": "date"
        },
        {
            "header": "udp__GABARIT",
            "fieldLabel": "Gabarit",
            "name": "udp__GABARIT",
            "checked": True,
            "type": "combo"
        },
        {
            "header": "udp__STATUTELEMENTDEDONNEE",
            "type": "string",
            "name": "udp__STATUTELEMENTDEDONNEE",
            "checked": True,
            "fieldLabel": "Statut élément de donnée"
        },
        {
            "type": "decimal",
            "fieldLabel": "Length",
            "name": "prpLength",
            "fromModel": True,
            "header": "prpLength"
        },
        {
            "header": "udp__ENTREEENVIGUEUR",
            "type": "string",
            "name": "udp__ENTREEENVIGUEUR",
            "checked": True,
            "fieldLabel": "Entree en viguer"
        },
        {
            "header": "Is null",
            "type": "bool",
            "name": "isNullable",
            "fromModel": True
        },
        {
            "header": "udp__DESCRIPTIONCN",
            "fieldLabel": "Description CN",
            "name": "udp__DESCRIPTIONCN",
            "checked": True,
            "type": "html"
        },
        {
            "header": "udp__VALIDATION",
            "fieldLabel": "Validation",
            "name": "udp__VALIDATION",
            "checked": True,
            "type": "html"
        },
        {
            "header": "udp__VALIDATION_INTER-ENREGISTREMENT",
            "fieldLabel": "Validation Entt",
            "name": "udp__VALIDATION_INTER-ENREGISTREMENT",
            "checked": True,
            "type": "html"
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
            "header": "udp__DOMAINEDEVALEURS",
            "fieldLabel": "Domain Valuers",
            "name": "udp__DOMAINEDEVALEURS",
            "checked": True,
            "type": "html"
        },
        {
            "type": "string",
            "fieldLabel": "Alias",
            "name": "alias",
            "fromModel": True,
            "header": "Alias"
        },
        {
            "header": "udp__TRANSMISSION",
            "type": "string",
            "name": "udp__TRANSMISSION",
            "checked": True,
            "fieldLabel": "Transmission"
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__methodetransf",
            "readOnly": False,
            "type": "udp",
            "name": "udp__methodetransf"
        },
        {
            "header": "udp__numelement",
            "readOnly": False,
            "type": "udp",
            "name": "udp__numelement",
            "allowBlank": True
        }
    ],
    "protoUdp": {
        "propertyPrefix": "udp",
        "propertyName": "code",
        "propertyRef": "metaObj",
        "propertyValue": "valueUdp",
        "udpTable": "udp"
    },
    "protoDetails": [
        {
            "menuText": "Propriétés ",
            "conceptDetail": "protoExt.Udp",
            "detailField": "metaObj__pk",
            "masterField": "pk"
        }
    ],
    "protoForm": {
        "__ptType": "protoForm",
        "title": "nnn",
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
                        "xtype": "textfield",
                        "__ptType": "formField",
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
                        "fieldLabel": "Numéro de l\'élément de données",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "readOnly": False,
                        "allowBlank": True,
                        "type": "int",
                        "name": "udp__numelement"
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
                        "fieldLabel": "Gabarit",
                        "xtype": "combobox",
                        "__ptType": "formField",
                        "name": "udp__GABARIT"
                    },
                    {
                        "collapsed": False,
                        "__ptType": "htmlset",
                        "height": 800,
                        "items": [
                            {
                                "fieldLabel": "Définition",
                                "xtype": "textarea",
                                "collapsed": False,
                                "__ptType": "formField",
                                "height": 100,
                                "labelAlign": "top",
                                "name": "udp__DEFINITION"
                            },
                            {
                                "fieldLabel": "Description",
                                "xtype": "textarea",
                                "name": "udp__DESCRIPTIONCN",
                                "__ptType": "formField",
                                "height": 100,
                                "labelAlign": "top"
                            },
                            {
                                "fieldLabel": "Précisions",
                                "xtype": "textarea",
                                "collapsed": False,
                                "__ptType": "formField",
                                "height": 100,
                                "labelAlign": "top",
                                "name": "udp__PRECISIONS"
                            },
                            {
                                "fieldLabel": "Validations sur l\'élément",
                                "xtype": "textarea",
                                "name": "udp__VALIDATIONSSURELEMENT",
                                "__ptType": "formField",
                                "height": 100,
                                "labelAlign": "top"
                            },
                            {
                                "fieldLabel": "Validations inter-élément",
                                "xtype": "textarea",
                                "name": "udp__VALIDATIONSINTERELEMENT",
                                "__ptType": "formField",
                                "height": 100,
                                "labelAlign": "top"
                            },
                            {
                                "fieldLabel": "Source de données externes",
                                "xtype": "textfield",
                                "__ptType": "formField",
                                "name": "udp__SOURCEDEDONNEESEXTERNES"
                            },
                            {
                                "fieldLabel": "Validations inter-enregistrement",
                                "xtype": "textarea",
                                "name": "udp__VALIDATION_INTER-ENREGISTREMENT",
                                "__ptType": "formField",
                                "height": 100,
                                "labelAlign": "top"
                            }
                        ]
                    },
                    {
                        "fsLayout": "1col",
                        "__ptType": "fieldset",
                        "items": [
                            {
                                "flex": None,
                                "fieldLabel": "Élément transformé?",
                                "xtype": "checkbox",
                                "__ptType": "formField",
                                "choices": "",
                                "type": "bool",
                                "name": "udp__ELEMENTTRANSFORME"
                            },
                            {
                                "fieldLabel": "Éléments de source",
                                "xtype": "textfield",
                                "__ptType": "formField",
                                "name": "udp__elementssource",
                                "readOnly": False,
                                "allowBlank": True
                            },
                            {
                                "fieldLabel": "Méthode de transformation",
                                "xtype": "textfield",
                                "__ptType": "formField",
                                "name": "udp__methodetransf",
                                "readOnly": False,
                                "allowBlank": True
                            }
                        ]
                    },
                    {
                        "fieldLabel": "Élément transmis",
                        "xtype": "combobox",
                        "__ptType": "formField",
                        "choices": "Oui est transmis et est incorporé à la banque de données ministérielle, Oui est transmis mais n\'est pas incorporé à la banque de données ministérielle, Non n\'est pas transmis",
                        "type": "string",
                        "name": "udp__ELEMENTTRANSMIS"
                    },
                    {
                        "__ptType": "htmlset",
                        "items": [
                            {
                                "fieldLabel": "Domaine de valuers",
                                "xtype": "textarea",
                                "name": "udp__DOMAINEDEVALEURS",
                                "__ptType": "formField",
                                "height": 100,
                                "labelAlign": "left"
                            }
                        ]
                    },
                    {
                        "fieldLabel": "Entrée en vigueur",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "udp__ENTREEENVIGUEUR"
                    },
                    {
                        "xtype": "datefield",
                        "fieldLabel": "Date de dernière modification",
                        "name": "udp__DATEDERNIREMODIFICATION",
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