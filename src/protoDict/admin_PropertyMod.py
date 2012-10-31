# -*- coding: utf-8 -*-
import django.contrib.admin          

class PropertyAdmin(django.contrib.admin.ModelAdmin):

    protoExt= {
    "protoOption": "protoDict.PropertyModel",
    "description": "Éléments de données",
    "protoConcept": "protoDict.PropertyModel",
    "protoIcon": "icon-property",
    "shortTitle": "Éléments de données",
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
        "baseFilter": {},
        "readOnlyFields": [],
        "sortFields": [],
        "initialSort": {},
        "initialFilter": {},
        "hiddenFields": [],
        "listDisplay": [
            "model__code",
            "propertyDom__code"
        ],
        "filtersSet": [],
        "searchFields": [
            "code",
            "concept__model"
        ]
    },
    "fields": [
        {
            "header": "udp__DEFINITION",
            "type": "html",
            "name": "udp__DEFINITION",
            "checked": True,
            "fieldLabel": "Definition"
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
            "fieldLabel": "Elto transforme",
            "name": "udp__ELEMENTTRANSFORME",
            "checked": True,
            "type": "bool"
        },
        {
            "header": "udp__DOCUMENTDEREFERENCE",
            "fieldLabel": "Doc Reference",
            "name": "udp__DOCUMENTDEREFERENCE",
            "checked": True,
            "type": "string"
        },
        {
            "header": "udp__SOURCEDEDONNEESEXTERNES",
            "fieldLabel": "Source Donnes",
            "name": "udp__SOURCEDEDONNEESEXTERNES",
            "checked": True,
            "type": "string"
        },
        {
            "header": "udp__PRECISIONS",
            "type": "html",
            "name": "udp__PRECISIONS",
            "checked": True,
            "fieldLabel": "Precision"
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
            "fieldLabel": "Rquis par",
            "name": "udp__REQUISPAR",
            "checked": True,
            "type": "string"
        },
        {
            "header": "udp__VALIDATIONSSURELEMENT",
            "type": "html",
            "name": "udp__VALIDATIONSSURELEMENT",
            "checked": True,
            "fieldLabel": "Validation Elto"
        },
        {
            "header": "udp__DATEDERNIREMODIFICATION",
            "type": "date",
            "name": "udp__DATEDERNIREMODIFICATION",
            "checked": True,
            "fieldLabel": "Dt derniere modif"
        },
        {
            "header": "udp__GABARIT",
            "type": "combo",
            "name": "udp__GABARIT",
            "checked": True,
            "fieldLabel": "Gabarit"
        },
        {
            "header": "udp__STATUTELEMENTDEDONNEE",
            "fieldLabel": "Statut élément de donnée",
            "name": "udp__STATUTELEMENTDEDONNEE",
            "checked": True,
            "type": "string"
        },
        {
            "header": "udp__ENTREEENVIGUEUR",
            "fieldLabel": "Entree en viguer",
            "name": "udp__ENTREEENVIGUEUR",
            "checked": True,
            "type": "string"
        },
        {
            "header": "udp__DESCRIPTIONCN",
            "type": "html",
            "name": "udp__DESCRIPTIONCN",
            "checked": True,
            "fieldLabel": "Description CN"
        },
        {
            "header": "udp__VALIDATION",
            "type": "html",
            "name": "udp__VALIDATION",
            "checked": True,
            "fieldLabel": "Validation"
        },
        {
            "header": "udp__VALIDATION_INTER-ENREGISTREMENT",
            "type": "html",
            "name": "udp__VALIDATION_INTER-ENREGISTREMENT",
            "checked": True,
            "fieldLabel": "Validation Entt"
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
            "type": "html",
            "name": "udp__DOMAINEDEVALEURS",
            "checked": True,
            "fieldLabel": "Domain Valuers"
        },
        {
            "header": "udp__TRANSMISSION",
            "fieldLabel": "Transmission",
            "name": "udp__TRANSMISSION",
            "checked": True,
            "type": "string"
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
            "checked": True,
            "name": "udp__numelement",
            "header": "udp__numelement",
            "readOnly": False,
            "type": "udp",
            "allowBlank": True
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
            "cellLink": True,
            "header": "Éléments de Données",
            "readOnly": True,
            "name": "__str__",
            "zoomModel": "protoDict.PropertyDom",
            "fieldLabel": "Éléments de Données",
            "allowBlank": True,
            "fkId": "id",
            "hidden": True,
            "type": "string"
        },
        {
            "header": "category",
            "readOnly": True,
            "type": "string",
            "name": "model__category",
            "allowBlank": True
        },
        {
            "fkField": "model",
            "zoomModel": "protoDict.Model",
            "name": "model_id",
            "readOnly": True,
            "type": "foreignid",
            "allowBlank": False
        },
        {
            "fkField": "propertyDom",
            "zoomModel": "protoDict.PropertyDom",
            "name": "propertyDom_id",
            "readOnly": True,
            "type": "foreignid",
            "allowBlank": False
        },
        {
            "zoomModel": "protoDict.PropertyDom",
            "name": "propertyDom",
            "fkId": "propertyDom_id",
            "header": "propertyDom",
            "readOnly": False,
            "type": "foreigntext",
            "allowBlank": False
        },
        {
            "zoomModel": "protoDict.Model",
            "name": "model",
            "fkId": "model_id",
            "header": "model",
            "readOnly": False,
            "type": "foreigntext",
            "allowBlank": False
        },
        {
            "header": "Nom",
            "readOnly": True,
            "type": "string",
            "name": "model__code",
            "allowBlank": True
        },
        {
            "header": "Nom",
            "readOnly": True,
            "type": "string",
            "name": "propertyDom__code",
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
            "conceptDetail": "protoDict.Udp",
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
                        "xtype": "textfield",
                        "fieldLabel": "Élément de donnée",
                        "name": "code",
                        "__ptType": "formField",
                        "allowBlank": False
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