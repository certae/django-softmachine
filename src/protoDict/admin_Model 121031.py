# -*- coding: utf-8 -*-

#El modelo tendra dos campos para seleccionar fichas, pues hay un nivel de ficha a nivel de modelo que no
#coincide con el selector usado a nivel de elementods de datos ( properties )
#
#Categoria,       Modelo  
#SubCategoria     Para los elmentos de datos 

from models import *

import django.contrib.admin          
 

class Model_Admin(django.contrib.admin.ModelAdmin):
    
    protoExt = {
    "protoOption": "protoDict.Model",
    "description": "Description des vues",
    "shortTitle": "Vues",
    "protoIcon": "icon-model",
    "protoConcept": "protoDict.Model",
    "version": "121030",
    "idProperty": "id",
    "sheetConfig": {
        "protoSheetSelector": "udp__Categorie",
        "protoSheets": [
            {
                "name": "DEFAULT",
                "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de la vue: </td><td>{{code}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Catégorie: </td><td>{{category}}</td></tr><tr class=\"azul\"><td class=\"negro\">Auteur de la vue:</td><td>{{udp__Auteurmodele}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Version de la vue: </td><td>{{udp__Version}}</td></tr><tr class=\"azul\"><td class=\"negro\">Document de réréfence: </td><td class=\"desc\">{{udp__docureference}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Description: </td><td>{{udp__Descriptionmodele}}</td></tr></table>",
                "title": "Fiche descriptive des vues corporatives"
            },
            {
                "name": "AT",
                "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de l\'élément de donnée: </td><td>{{code}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Description: </td><td class=\"desc\">{{description}}</td></tr><tr class=\"azul\"><td class=\"negro\">Statut élément de donnée:</td><td class=\"desc\">{{udp__STATUTELEMENTDEDONNEE}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Acteur principal: </td><td class=\"desc\">{{udp__ActeurPrincipal}}</td></tr><tr class=\"azul\"><td class=\"negro\">Autres acteurs: </td><td>{{udp__AutresActeurs}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Intrants déclencheurs: </td><td class=\"desc\">{{udp__IntrantsDeclencheurs}}</td></tr></table>",
                "title": "Fiche descriptive des actions terraines"
            },
            {
                "name": "locale",
                "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de la vue: </td><td>{{code}}</td></tr><tr class=\"azul\"><td class=\"negro\">Catégorie: </td><td>{{udp__Categorie}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Sous-Catégorie:</td><td>{{udp__Souscategorie}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Auteur de la vue:</td><td>{{udp__Auteurmodele}}</td></tr><tr class=\"azul\"><td class=\"negro\">Version de la vue: </td><td>{{udp__Version}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Description: </td><td class=\"desc\">{{udp__Descriptionmodele}}</td></tr></table>",
                "title": "Fiche descriptive des vues locales"
            }
        ],
        "protoSheetProperties": [
            "code",
            "udp__Souscategorie",
            "udp__Auteurmodele",
            "udp__Version",
            "udp__Descriptionmodele",
            "udp__ActeurPrincipal",
            "udp__AutresActeurs",
            "udp__IntrantsDeclencheurs",
            "category",
            "udp__docureference"
        ]
    },
    "gridConfig": {
        "searchFields": [
            "code"
        ],
        "hiddenFields": [],
        "listDisplay": [
            "code",
            "udp__Descriptionmodele"
        ],
        "baseFilter": {},
        "filtersSet": [
            {
                "filter": {
                    "code__istartswith": "AT"
                },
                "name": "Vue AT"
            },
            {
                "filter": {
                    "code__istartswith": "Vue Corporative"
                },
                "name": "Vue corportative"
            },
            {
                "filter": {
                    "code__istartswith": "Vue locale"
                },
                "name": "Vue locale"
            },
            {
                "filter": {},
                "name": " Tous "
            }
        ],
        "readOnlyFields": [],
        "sortFields": [
            "code"
        ],
        "initialSort": [
            {
                "direction": "ASC",
                "property": "code"
            }
        ],
        "initialFilter": {}
    },
    "fields": [
        {
            "flex": 1,
            "fieldLabel": "Nom de la vue",
            "header": "Nom de la vue",
            "width": 200,
            "fromModel": True,
            "type": "string",
            "name": "code",
            "sortable": True
        },
        {
            "header": "Catégorie",
            "type": "string",
            "name": "udp__Categorie",
            "flex": 1,
            "checked": True
        },
        {
            "flex": 1,
            "fieldLabel": "Modèle",
            "name": "__str__",
            "fkId": "id",
            "zoomModel": "protoDict.Model",
            "cellLink": True,
            "header": "ModèLe",
            "readOnly": True,
            "type": "string",
            "allowBlank": True
        },
        {
            "flex": 1,
            "checked": True,
            "name": "udp__ActeurPrincipal",
            "header": "Acteur principal",
            "wordWrap": True,
            "type": "text"
        },
        {
            "header": "Version",
            "type": "string",
            "name": "udp__Version",
            "flex": 1,
            "checked": True
        },
        {
            "header": "Sous-Catégorie",
            "type": "string",
            "name": "udp__Souscategorie",
            "flex": 0.5,
            "checked": True
        },
        {
            "flex": 6,
            "vType": "htmlText",
            "fieldLabel": "Description",
            "name": "udp__Descriptionmodele",
            "header": "Description",
            "checked": True,
            "type": "text"
        },
        {
            "fieldLabel": "Catégorie",
            "name": "category",
            "width": 100,
            "header": "Catégorie",
            "fromModel": True,
            "type": "string"
        },
        {
            "flex": 1,
            "checked": True,
            "name": "udp__AutresActeurs",
            "header": "Autres acteurs",
            "cellToolTip": True,
            "type": "text"
        },
        {
            "flex": 1,
            "checked": True,
            "name": "udp__IntrantsDeclencheurs",
            "header": "Intrants déclencheurs",
            "wordWrap": True,
            "type": "text"
        },
        {
            "header": "Auteur",
            "type": "string",
            "name": "udp__Auteurmodele",
            "flex": 1,
            "checked": True
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__nomsibdm",
            "type": "udp",
            "name": "udp__nomsibdm"
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__acronyme",
            "type": "udp",
            "name": "udp__acronyme"
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__uniteadministrative",
            "type": "udp",
            "name": "udp__uniteadministrative"
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__datecn",
            "type": "udp",
            "name": "udp__datecn"
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__nomrealisateurcn",
            "type": "udp",
            "name": "udp__nomrealisateurcn"
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__nomredacteurs",
            "type": "udp",
            "name": "udp__nomredacteurs"
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__nomsecretariat",
            "type": "udp",
            "name": "udp__nomsecretariat"
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__docureference",
            "type": "udp",
            "name": "udp__docureference"
        },
        {
            "fkField": "domain",
            "zoomModel": "protoDict.Domain",
            "name": "domain_id",
            "header": "domain_id",
            "readOnly": True,
            "type": "foreignid"
        },
        {
            "zoomModel": "protoDict.Domain",
            "name": "domain",
            "fkId": "domain_id",
            "cellLink": True,
            "header": "Domaine",
            "type": "foreigntext"
        }
    ],
    "protoUdp": {
        "propertyPrefix": "udp",
        "propertyReference": "model",
        "propertyRef": "model",
        "propertyName": "code",
        "propertyValue": "valueUdp",
        "udpTable": "udpModel"
    },
    "protoDetails": [
        {
            "detailTitleLbl": "Vue :",
            "conceptDetail": "protoDict.Concept",
            "detailField": "model__pk",
            "masterTitleField": "code",
            "menuText": "Entité",
            "masterField": "pk"
        },
        {
            "detailField": "model__pk",
            "conceptDetail": "protoDict.PropertyModel",
            "masterTitleField": "code",
            "menuText": "Éléments de Données",
            "masterField": "pk"
        },
        {
            "menuText": "Propriétés",
            "conceptDetail": "protoDict.UdpModel",
            "detailField": "model__pk",
            "masterField": "pk"
        }
    ],
    "protoForm": {
        "__ptType": "protoForm",
        "items": [
            {
                "fsLayout": "1col",
                "__ptType": "fieldset",
                "title": "Informations d\'ordre général",
                "items": [
                    {
                        "zoomModel": "protoDict.Domain",
                        "fieldLabel": "Domaine",
                        "xtype": "protoZoom",
                        "fkId": "domain_id",
                        "__ptType": "formField",
                        "name": "domain"
                    },
                    {
                        "xtype": "textfield",
                        "fieldLabel": "Nom de la vue",
                        "name": "code",
                        "__ptType": "formField"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Catégorie",
                        "name": "category",
                        "tooltip": "CN, AT ou défault",
                        "xtype": "textfield"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Auteur de la vue",
                        "name": "udp__Auteurmodele",
                        "tooltip": "Le nom du créateur de la vue",
                        "xtype": "textfield"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Version",
                        "name": "udp__Version",
                        "tooltip": "Numéro de version de la vue",
                        "xtype": "textfield"
                    },
                    {
                        "fieldLabel": "Document de référence",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "udp__docureference",
                        "tooltip": "Type de document utilisé pour créer la vue",
                        "allowBlank": True
                    },
                    {
                        "__ptType": "htmlset",
                        "items": [
                            {
                                "fieldLabel": "Description",
                                "xtype": "textarea",
                                "name": "udp__Descriptionmodele",
                                "__ptType": "formField",
                                "height": 100,
                                "labelAlign": "top"
                            }
                        ]
                    }
                ]
            },
            {
                "fsLayout": "1col",
                "__ptType": "fieldset",
                "title": "Informations concernant le Cadre Normatif",
                "items": [
                    {
                        "fieldLabel": "Nom du système d\'information ou de la banque de données ministérielle",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "width": 510,
                        "allowBlank": True,
                        "name": "udp__nomsibdm"
                    },
                    {
                        "fieldLabel": "Acronyme SI ou BDM",
                        "allowBlank": True,
                        "__ptType": "formField",
                        "name": "udp__acronyme",
                        "xtype": "textfield"
                    },
                    {
                        "fieldLabel": "Nom unité administrative",
                        "allowBlank": True,
                        "__ptType": "formField",
                        "name": "udp__uniteadministrative",
                        "xtype": "textfield"
                    },
                    {
                        "fieldLabel": "Date du Cadre Normatif",
                        "xtype": "datefield",
                        "__ptType": "formField",
                        "allowBlank": True,
                        "type": "date",
                        "name": "udp__datecn"
                    },
                    {
                        "fieldLabel": "Nom du réalisateur",
                        "allowBlank": True,
                        "__ptType": "formField",
                        "name": "udp__nomrealisateurcn",
                        "xtype": "textfield"
                    },
                    {
                        "fieldLabel": "Nom(s) des rédacteurs",
                        "allowBlank": True,
                        "__ptType": "formField",
                        "name": "udp__nomredacteurs",
                        "xtype": "textfield"
                    },
                    {
                        "fieldLabel": "Nom(s) secrétariat",
                        "allowBlank": True,
                        "__ptType": "formField",
                        "name": "udp__nomsecretariat",
                        "xtype": "textfield"
                    }
                ]
            },
            {
                "fsLayout": "1col",
                "__ptType": "fieldset",
                "title": "Informations concernant les AT",
                "items": [
                    {
                        "fieldLabel": "Acteur principal",
                        "xtype": "textarea",
                        "name": "udp__ActeurPrincipal",
                        "__ptType": "formField",
                        "height": 100,
                        "labelAlign": "top"
                    },
                    {
                        "fieldLabel": "Autres acteurs",
                        "xtype": "textarea",
                        "name": "udp__AutresActeurs",
                        "__ptType": "formField",
                        "height": 100,
                        "labelAlign": "top"
                    },
                    {
                        "fieldLabel": "Intrants déclencheurs",
                        "xtype": "textarea",
                        "name": "udp__IntrantsDeclencheurs",
                        "__ptType": "formField",
                        "height": 100,
                        "labelAlign": "top"
                    }
                ]
            }
        ]
    },
    "updateTime": "2012-11-01 00:04:45"
}