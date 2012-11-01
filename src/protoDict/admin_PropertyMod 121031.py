# -*- coding: utf-8 -*-
import django.contrib.admin          

class PropertyAdmin(django.contrib.admin.ModelAdmin):

    protoExt= {
    "protoOption": "protoDict.PropertyModel",
    "description": "Éléments de données",
    "shortTitle": "Éléments de données",
    "protoIcon": "icon-property",
    "protoConcept": "protoDict.PropertyModel",
    "version": "4.23",
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
        "filterSetABC": "code",
        "searchFields": [
            "model__code",
            "propertyDom__code"
        ],
        "baseFilter": {},
        "listDisplay": [
            "model__code",
            "propertyDom__code",
            "udp__DOCUMENTDEREFERENCE"
        ],
        "hiddenFields": [],
        "filtersSet": [],
        "readOnlyFields": [],
        "sortFields": [
            "model__category",
            "model__code",
            "propertyDom__code"
        ],
        "initialSort": [],
        "initialFilter": {}
    },
    "fields": [
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
            "header": "udp__PRECISIONS",
            "fieldLabel": "Precision",
            "name": "udp__PRECISIONS",
            "checked": True,
            "type": "html"
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
            "header": "udp__ENTREEENVIGUEUR",
            "type": "string",
            "name": "udp__ENTREEENVIGUEUR",
            "checked": True,
            "fieldLabel": "Entree en viguer"
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
            "type": "udp",
            "name": "udp__methodetransf"
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__numelement",
            "type": "udp",
            "name": "udp__numelement"
        },
        {
            "header": "Type de Base",
            "readOnly": True,
            "type": "string",
            "name": "propertyDom__baseType",
            "allowBlank": True
        },
        {
            "header": "prpLength",
            "readOnly": True,
            "type": "decimal",
            "name": "propertyDom__prpLength",
            "allowBlank": True
        },
        {
            "flex": 1,
            "fieldLabel": "Éléments de Données",
            "name": "__str__",
            "fkId": "id",
            "zoomModel": "protoDict.PropertyDom",
            "cellLink": True,
            "header": "Éléments de Données",
            "readOnly": True,
            "hidden": True,
            "type": "string",
            "allowBlank": True
        },
        {
            "sortable": True,
            "name": "model__category",
            "header": "category",
            "readOnly": True,
            "type": "string",
            "allowBlank": True
        },
        {
            "fkField": "model",
            "zoomModel": "protoDict.Model",
            "name": "model_id",
            "readOnly": True,
            "type": "foreignid"
        },
        {
            "fkField": "propertyDom",
            "zoomModel": "protoDict.PropertyDom",
            "name": "propertyDom_id",
            "readOnly": True,
            "type": "foreignid"
        },
        {
            "zoomModel": "protoDict.PropertyDom",
            "name": "propertyDom",
            "fkId": "propertyDom_id",
            "header": "propertyDom",
            "type": "foreigntext"
        },
        {
            "zoomModel": "protoDict.Model",
            "name": "model",
            "fkId": "model_id",
            "header": "model",
            "type": "foreigntext"
        },
        {
            "sortable": True,
            "name": "model__code",
            "header": "Model",
            "readOnly": True,
            "type": "string",
            "allowBlank": True
        },
        {
            "sortable": True,
            "name": "propertyDom__code",
            "header": "Property",
            "readOnly": True,
            "type": "string",
            "allowBlank": True
        }
    ],
    "protoUdp": {
        "propertyPrefix": "udp",
        "propertyReference": "propertyDom",
        "propertyRef": "propertyDom",
        "propertyName": "code",
        "propertyValue": "valueUdp",
        "keyField": "propertyDom_id",
        "udpTable": "UdpPropertyDom"
    },
    "protoDetails": [
        {
            "menuText": "Propriétés",
            "conceptDetail": "protoDict.UdpPropertyDom",
            "detailField": "propertyDom",
            "masterField": "propertyDom_id"
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
                        "name": "code",
                        "fieldLabel": "Élément de donnée",
                        "__ptType": "formField",
                        "xtype": "textfield"
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
                        "__ptType": "htmlset",
                        "height": 800,
                        "items": [
                            {
                                "fieldLabel": "Définition",
                                "xtype": "textarea",
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
                                "fieldLabel": "Élément transformé?",
                                "xtype": "checkbox",
                                "__ptType": "formField",
                                "type": "bool",
                                "name": "udp__ELEMENTTRANSFORME"
                            },
                            {
                                "fieldLabel": "Éléments de source",
                                "xtype": "textfield",
                                "__ptType": "formField",
                                "name": "udp__elementssource",
                                "allowBlank": True
                            },
                            {
                                "fieldLabel": "Méthode de transformation",
                                "xtype": "textfield",
                                "__ptType": "formField",
                                "name": "udp__methodetransf",
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
    },
    "updateTime": "2012-11-01 00:26:12"
}