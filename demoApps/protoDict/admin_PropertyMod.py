# -*- coding: utf-8 -*-
import django.contrib.admin          
from actions import createNewModel

class PropertyAdmin(django.contrib.admin.ModelAdmin):

    actions = [ createNewModel ]

    protoExt= {
    "__ptType": "pcl",
    "description": "Éléments de données",
    "protoConcept": "protoDict.PropertyModel",
    "protoIcon": "icon-property",
    "metaVersion": "12.1108",
    "idProperty": "id",
    "protoOption": "protoDict.PropertyModel",
    "shortTitle": "Éléments de données",
    "protoSheetSelector": "model__category",
    "updateTime": "2012-11-11 09:24:52",
    "fields": [
        {
            "__ptType": "field",
            "flex": 200,
            "fieldLabel": "Définition",
            "name": "udp__DEFINITION",
            "header": "Définition",
            "wordWrap": True,
            "type": "html",
            "width": 400
        },
        {
            "__ptType": "field",
            "header": "prpLength",
            "readOnly": True,
            "type": "decimal",
            "name": "propertyDom__prpLength"
        },
        {
            "__ptType": "field",
            "flex": 1,
            "cellLink": True,
            "header": "Éléments de Données",
            "readOnly": True,
            "zoomModel": "protoDict.PropertyDom",
            "fieldLabel": "Éléments de Données",
            "name": "__str__",
            "fkId": "id",
            "hidden": True,
            "type": "string"
        },
        {
            "__ptType": "field",
            "header": "udp__elementssource",
            "type": "udp",
            "name": "udp__elementssource"
        },
        {
            "__ptType": "field",
            "flex": 100,
            "fieldLabel": "Élément de données",
            "name": "propertyDom__code",
            "header": "Élément de données",
            "type": "string"
        },
        {
            "__ptType": "field",
            "header": "udp__ELEMENTTRANSFORME",
            "type": "bool",
            "name": "udp__ELEMENTTRANSFORME",
            "fieldLabel": "Elto transforme"
        },
        {
            "__ptType": "field",
            "header": "Document de référence",
            "type": "string",
            "name": "udp__DOCUMENTDEREFERENCE",
            "fieldLabel": "Document de référence"
        },
        {
            "__ptType": "field",
            "header": "udp__SOURCEDEDONNEESEXTERNES",
            "type": "string",
            "name": "udp__SOURCEDEDONNEESEXTERNES",
            "fieldLabel": "Source Donnes"
        },
        {
            "__ptType": "field",
            "header": "Descriptions",
            "readOnly": True,
            "type": "text",
            "name": "model__description"
        },
        {
            "__ptType": "field",
            "fieldLabel": "Catégorie",
            "name": "model__category",
            "header": "Catégorie",
            "readOnly": True,
            "type": "string"
        },
        {
            "__ptType": "field",
            "flex": 100,
            "fieldLabel": "Nom de la vue",
            "name": "model__code",
            "header": "Nom de la vue",
            "type": "string"
        },
        {
            "__ptType": "field",
            "header": "udp__PRECISIONS",
            "fieldLabel": "Precision",
            "name": "udp__PRECISIONS",
            "type": "html"
        },
        {
            "__ptType": "field",
            "fieldLabel": "Elto Transmis",
            "xtype": "combobox",
            "choices": "xxxxxx, yyyyyy, zzzz",
            "header": "udp__ELEMENTTRANSMIS",
            "type": "string",
            "name": "udp__ELEMENTTRANSMIS"
        },
        {
            "__ptType": "field",
            "fkField": "model",
            "zoomModel": "protoDict.Model",
            "name": "model_id",
            "header": "model_id",
            "readOnly": True,
            "type": "foreignid"
        },
        {
            "__ptType": "field",
            "header": "udp__REQUISPAR",
            "type": "string",
            "name": "udp__REQUISPAR",
            "fieldLabel": "Rquis par"
        },
        {
            "__ptType": "field",
            "header": "udp__VALIDATIONSSURELEMENT",
            "fieldLabel": "Validation Elto",
            "name": "udp__VALIDATIONSSURELEMENT",
            "type": "html"
        },
        {
            "__ptType": "field",
            "zoomModel": "protoDict.PropertyDom",
            "name": "propertyDom",
            "fkId": "propertyDom_id",
            "required": True,
            "cellLink": True,
            "header": "propertyDom",
            
            "type": "foreigntext"
        },
        {
            "__ptType": "field",
            "header": "Type de Base",
            "readOnly": True,
            "type": "string",
            "name": "propertyDom__baseType"
        },
        {
            "__ptType": "field",
            "header": "udp__DATEDERNIREMODIFICATION",
            "fieldLabel": "Dt derniere modif",
            "name": "udp__DATEDERNIREMODIFICATION",
            "type": "date"
        },
        {
            "__ptType": "field",
            "header": "udp__GABARIT",
            "fieldLabel": "Gabarit",
            "name": "udp__GABARIT",
            "type": "combo"
        },
        {
            "__ptType": "field",
            "header": "udp__STATUTELEMENTDEDONNEE",
            "type": "string",
            "name": "udp__STATUTELEMENTDEDONNEE",
            "fieldLabel": "Statut élément de donnée"
        },
        {
            "__ptType": "field",
            "header": "udp__ENTREEENVIGUEUR",
            "type": "string",
            "name": "udp__ENTREEENVIGUEUR",
            "fieldLabel": "Entree en viguer"
        },
        {
            "__ptType": "field",
            "header": "udp__VALIDATION",
            "fieldLabel": "Validation",
            "name": "udp__VALIDATION",
            "type": "html"
        },
        {
            "__ptType": "field",
            "flex": 300,
            "fieldLabel": "Description",
            "name": "udp__DESCRIPTIONCN",
            "header": "Description",
            "wordWrap": True,
            "type": "html"
        },
        {
            "__ptType": "field",
            "fkField": "propertyDom",
            "zoomModel": "protoDict.PropertyDom",
            "name": "propertyDom_id",
            "header": "propertyDom_id",
            "readOnly": True,
            "type": "foreignid"
        },
        {
            "__ptType": "field",
            "header": "udp__VALIDATION_INTER-ENREGISTREMENT",
            "fieldLabel": "Validation Entt",
            "name": "udp__VALIDATION_INTER-ENREGISTREMENT",
            "type": "html"
        },
        {
            "__ptType": "field",
            "fieldLabel": "Validations inter-élément",
            "name": "udp__VALIDATIONSINTERELEMENT",
            "header": "udp__VALIDATIONSINTERELEMENT",
            "type": "html",
            "labelAlign": "left"
        },
        {
            "__ptType": "field",
            "header": "udp__DOMAINEDEVALEURS",
            "fieldLabel": "Domain Valuers",
            "name": "udp__DOMAINEDEVALEURS",
            "type": "html"
        },
        {
            "__ptType": "field",
            "header": "udp__TRANSMISSION",
            "type": "string",
            "name": "udp__TRANSMISSION",
            "fieldLabel": "Transmission"
        },
        {
            "__ptType": "field",
            "header": "udp__numelement",
            "type": "udp",
            "name": "udp__numelement"
        },
        {
            "__ptType": "field",
            "zoomModel": "protoDict.Model",
            
            "name": "model",
            "fkId": "model_id",
            "flex": 100,
            "type": "foreigntext",
            "header": "model",
            "required": True,
            "cellLink": True
        },
        {
            "__ptType": "field",
            "header": "udp__methodetransf",
            "type": "udp",
            "name": "udp__methodetransf"
        }
    ],
    "actions": [],
    "protoDetails": [
        {
            "__ptType": "protoDetail",
            "menuText": "Propriétés",
            "conceptDetail": "protoDict.UdpPropertyDom",
            "detailField": "propertyDom",
            "masterField": "propertyDom_id"
        }
    ],
    "protoSheets": [
        {
            "__ptType": "protoSheet",
            "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de l\'élément de donnée: </td><td>{{model__code}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Description: </td><td class=\"desc\">{{description}}</td></tr><tr class=\"azul\"><td class=\"negro\">Statut élément de donnée:</td><td class=\"desc\">{{udp__STATUTELEMENTDEDONNEE}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Acteur principal: </td><td class=\"desc\">{{udp__ActeurPrincipal}}</td></tr><tr class=\"azul\"><td class=\"negro\">Autres acteurs: </td><td>{{udp__AutresActeurs}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Intrants déclencheurs: </td><td class=\"desc\">{{udp__IntrantsDeclencheurs}}</td></tr></table>",
            "name": "AT",
            "title": "Fiche descriptive de l\'élément de donnée",
            "sheetDetails": []
        },
        {
            "__ptType": "protoSheet",
            "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de l\'élément de donnée: </td><td>{{model__code}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Numéro de l\'élément de donnée au CN: </td><td class=\"desc\">{{udp__numelement}}</td></tr><tr class=\"azul\"><td class=\"negro\">Type de donnée: </td><td class=\"desc\">{{propertyDom__baseType}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Longueur: </td><td class=\"desc\">{{propertyDom__prpLength}}</td></tr><tr class=\"azul\"><td class=\"negro\">Gabarit: </td><td class=\"desc\">{{udp__GABARIT}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Définition: </td><td class=\"desc\">{{udp__DEFINITION}}</td></tr><tr class=\"azul\"><td class=\"negro\">Description: </td><td class=\"desc\">{{udp__DESCRIPTIONCN}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Précisions: </td><td class=\"desc\">{{udp__PRECISIONS}}</td></tr><tr class=\"azul\"><td class=\"negro\">Validations sur l\'élément: </td><td class=\"desc\">{{udp__VALIDATIONSSURELEMENT}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Validations inter-éléments: </td><td class=\"desc\">{{udp__VALIDATIONSINTERELEMENT}}</td></tr><tr class=\"azul\"><td class=\"negro\">Validation inter-enregistrement: </td><td class=\"desc\">{{udp__VALIDATION_INTER-ENREGISTREMENT}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Source de données externes: </td><td class=\"desc\">{{udp__SOURCEDEDONNEESEXTERNES}}</td></tr><tr class=\"azul\"><td class=\"negro\">Élément transformé: </td><td class=\"desc\">{{udp__ELEMENTTRANSFORME}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Éléments de source: </td><td class=\"desc\">{{udp__elementssource}}</td></tr><tr class=\"azul\"><td class=\"negro\">Méthode de transformation: </td><td class=\"desc\">{{udp__methodetransf}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Élément transmis: </td><td class=\"desc\">{{udp__ELEMENTTRANSMIS}}</td></tr><tr class=\"azul\"><td class=\"negro\">Domaine de valeurs: </td><td class=\"desc\">{{udp__DOMAINEDEVALEURS}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Entrée en vigueur: </td><td class=\"desc\">{{udp__ENTREEENVIGUEUR}}</td></tr><tr class=\"azul\"><td class=\"negro\">Date de la dernière modification: </td><td class=\"desc\">{{udp__DATEDERNIREMODIFICATION}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Validation: </td><td class=\"desc\">{{udp__VALIDATION}}</td></tr><tr class=\"azul\"><td class=\"negro\">Requis par: </td><td class=\"desc\">{{udp__REQUISPAR}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Transmission: </td><td class=\"desc\">{{udp__TRANSMISSION}}</td></tr><tr class=\"azul\"><td class=\"negro\">Statut élément de donnée:</td><td class=\"desc\">{{udp__STATUTELEMENTDEDONNEE}}</td></tr></table>",
            "name": "CN",
            "title": "Fiche descriptive de l\'élément de donnée - Cadre Normatif",
            "sheetDetails": []
        },
        {
            "__ptType": "protoSheet",
            "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de l\'élément de donnée: </td><td>{{model__code}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Description: </td><td class=\"desc\">{{description}}</td></tr><tr class=\"azul\"><td class=\"negro\">Statut élément de donnée:</td><td class=\"desc\">{{udp__STATUTELEMENTDEDONNEE}}</td></tr></table>",
            "name": "CORPORATIVE",
            "title": "Fiche descriptive de l\'élément de donnée",
            "sheetDetails": []
        }
    ],
    "gridConfig": {
        "__ptType": "gridConfig",
        "hideRowNumbers": True,
        "filterSetABC": "code",
        "listDisplay": [
            "model__code",
            "propertyDom__code",
            "udp__DEFINITION"
        ],
        "searchFields": [
            "model__category",
            "model__code",
            "propertyDom__code",
            "model__description"
        ],
        "sortFields": [
            "tag",
            "description"
        ],
        "hiddenFields": [
            "id"
        ],
        "filtersSet": [],
        "readOnlyFields": [],
        "initialSort": [],
        "baseFilter": [],
        "initialFilter": []
    },
    "protoForm": {
        "__ptType": "protoForm",
        "title": "nnn",
        "items": [
            {
                "__ptType": "fieldset",
                "fsLayout": "1col",
                "title": "Informations du chapitre 3 du Cadre Normatif",
                "items": [
                    {
                        "__ptType": "formField",
                        "zoomModel": "protoDict.PropertyDom",
                        "fieldLabel": "Domaine",
                        "xtype": "protoZoom",
                        "fkId": "propertyDom_id",
                        "name": "propertyDom"
                    },
                    {
                        "__ptType": "formField",
                        "zoomModel": "protoDict.Model",
                        "fieldLabel": "Nom de la vue",
                        "xtype": "protoZoom",
                        "fkId": "model_id",
                        "name": "model"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Élément de données",
                        "xtype": "textfield",
                        "name": "propertyDom__code"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Catégorie",
                        "xtype": "textfield",
                        "name": "model__category"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Numéro de l\'élément de données",
                        "type": "int",
                        "xtype": "textfield",
                        "name": "udp__numelement"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Format",
                        "xtype": "textfield",
                        "name": "propertyDom__baseType"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Longueur",
                        "xtype": "textfield",
                        "name": "propertyDom__prpLength"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Gabarit",
                        "xtype": "combobox",
                        "name": "udp__GABARIT"
                    },
                    {
                        "__ptType": "htmlset",
                        "height": 800,
                        "items": [
                            {
                                "__ptType": "formField",
                                "fieldLabel": "Définition",
                                "xtype": "textarea",
                                "name": "udp__DEFINITION",
                                "height": 100,
                                "labelAlign": "top"
                            },
                            {
                                "__ptType": "formField",
                                "fieldLabel": "Description",
                                "xtype": "textarea",
                                "name": "udp__DESCRIPTIONCN",
                                "height": 100,
                                "labelAlign": "top"
                            },
                            {
                                "__ptType": "formField",
                                "fieldLabel": "Précisions",
                                "xtype": "textarea",
                                "name": "udp__PRECISIONS",
                                "height": 100,
                                "labelAlign": "top"
                            },
                            {
                                "__ptType": "formField",
                                "fieldLabel": "Validations sur l\'élément",
                                "xtype": "textarea",
                                "name": "udp__VALIDATIONSSURELEMENT",
                                "height": 100,
                                "labelAlign": "top"
                            },
                            {
                                "__ptType": "formField",
                                "fieldLabel": "Validations inter-élément",
                                "xtype": "textarea",
                                "name": "udp__VALIDATIONSINTERELEMENT",
                                "height": 100,
                                "labelAlign": "top"
                            },
                            {
                                "__ptType": "formField",
                                "fieldLabel": "Validations inter-enregistrement",
                                "xtype": "textarea",
                                "name": "udp__VALIDATION_INTER-ENREGISTREMENT",
                                "height": 100,
                                "labelAlign": "top"
                            }
                        ]
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Source de données externes",
                        "xtype": "textfield",
                        "name": "udp__SOURCEDEDONNEESEXTERNES"
                    },
                    {
                        "__ptType": "fieldset",
                        "fsLayout": "1col",
                        "items": [
                            {
                                "__ptType": "formField",
                                "fieldLabel": "Élément transformé?",
                                "type": "bool",
                                "xtype": "checkbox",
                                "name": "udp__ELEMENTTRANSFORME"
                            },
                            {
                                "__ptType": "formField",
                                "fieldLabel": "Éléments de source",
                                "name": "udp__elementssource",
                                "xtype": "textfield"
                            },
                            {
                                "__ptType": "formField",
                                "fieldLabel": "Méthode de transformation",
                                "name": "udp__methodetransf",
                                "xtype": "textfield"
                            }
                        ]
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Élément transmis",
                        "xtype": "combobox",
                        "choices": "Oui est transmis et est incorporé à la banque de données ministérielle, Oui est transmis mais n\'est pas incorporé à la banque de données ministérielle, Non n\'est pas transmis",
                        "type": "string",
                        "name": "udp__ELEMENTTRANSMIS"
                    },
                    {
                        "__ptType": "htmlset",
                        "items": [
                            {
                                "__ptType": "formField",
                                "fieldLabel": "Domaine de valuers",
                                "xtype": "textarea",
                                "name": "udp__DOMAINEDEVALEURS",
                                "height": 100,
                                "labelAlign": "left"
                            }
                        ]
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Entrée en vigueur",
                        "xtype": "textfield",
                        "name": "udp__ENTREEENVIGUEUR"
                    },
                    {
                        "__ptType": "formField",
                        "name": "udp__DATEDERNIREMODIFICATION",
                        "fieldLabel": "Date de dernière modification",
                        "xtype": "datefield",
                        "format": "Y/m/d"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Statut d\'élément de donnée",
                        "xtype": "textfield",
                        "name": "udp__STATUTELEMENTDEDONNEE"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Domaine",
                        "xtype": "textfield",
                        "name": "propertyDom_id"
                    }
                ]
            }
        ]
    },
    "protoUdp": {
        "__ptType": "protoUdp",
        "propertyPrefix": "udp",
        "keyField": "propertyDom_id",
        "propertyRef": "propertyDom",
        "propertyName": "code",
        "propertyValue": "valueUdp",
        "udpTable": "UdpPropertyDom"
    }
}