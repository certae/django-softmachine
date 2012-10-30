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
    "protoOption": "protoExt.Model",
    "description": "Description des vues",
    "shortTitle": "Vues",
    "protoIcon": "icon-model",
    "protoConcept": "protoExt.Model",
    "version": "121030",
    "helpPath": "",
    "idProperty": "id",
    "sheetConfig": {
        "protoSheetSelector": "udp__Categorie",
        "protoSheets": [
            {
                "name": "DEFAULT",
                "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de la vue: </td><td>{{code}}</td></tr><tr class=\"azul\"><td class=\"negro\">Catégorie: </td><td>{{udp__Categorie}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Sous-Catégorie:</td><td>{{udp__Souscategorie}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Auteur de la vue:</td><td>{{udp__Auteurmodele}}</td></tr><tr class=\"azul\"><td class=\"negro\">Version de la vue: </td><td>{{udp__Version}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Description: </td><td class=\"desc\">{{udp__Descriptionmodele}}</td></tr></table>",
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
            "udp__Categorie",
            "udp__Souscategorie",
            "udp__Auteurmodele",
            "udp__Version",
            "udp__Descriptionmodele",
            "udp__ActeurPrincipal",
            "udp__AutresActeurs",
            "udp__IntrantsDeclencheurs"
        ]
    },
    "gridConfig": {
        "hideRowNumbers": True,
        "filterSetABC": "",
        "baseFilter": {},
        "listDisplay": [
            "code",
            "udp__Descriptionmodele"
        ],
        "hiddenFields": [],
        "initialFilter": {},
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
                "sort": None,
                "direction": "ASC",
                "property": "code",
                "root": "data",
                "transform": None
            }
        ],
        "searchFields": [
            "code"
        ]
    },
    "fields": [
        {
            "flex": 1,
            "allowBlank": False,
            "width": 200,
            "tooltip": "Codigo o Identificador principal del objeto",
            "header": "Vues",
            "fromModel": True,
            "type": "string",
            "name": "code"
        },
        {
            "header": "Catégorie",
            "type": "string",
            "name": "udp__Categorie",
            "checked": True,
            "flex": 1
        },
        {
            "flex": 1,
            "fieldLabel": "Modèle",
            "name": "__str__",
            "fkId": "id",
            "zoomModel": "protoExt.Model",
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
            "checked": True,
            "flex": 1
        },
        {
            "header": "Sous-Catégorie",
            "type": "string",
            "name": "udp__Souscategorie",
            "checked": True,
            "flex": 0.5
        },
        {
            "flex": 6,
            "vType": "htmlText",
            "checked": True,
            "name": "udp__Descriptionmodele",
            "header": "Description Modèle",
            "type": "text"
        },
        {
            "fieldLabel": "Catégorie",
            "name": "category",
            "header": "Catégorie",
            "width": 100,
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
            "checked": True,
            "flex": 1
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__nomsibdm",
            "readOnly": False,
            "type": "udp",
            "name": "udp__nomsibdm"
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__acronyme",
            "readOnly": False,
            "type": "udp",
            "name": "udp__acronyme"
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__uniteadministrative",
            "readOnly": False,
            "type": "udp",
            "name": "udp__uniteadministrative"
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__datecn",
            "readOnly": False,
            "type": "udp",
            "name": "udp__datecn"
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__nomrealisateurcn",
            "readOnly": False,
            "type": "udp",
            "name": "udp__nomrealisateurcn"
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__nomredacteurs",
            "readOnly": False,
            "type": "udp",
            "name": "udp__nomredacteurs"
        },
        {
            "checked": True,
            "allowBlank": True,
            "header": "udp__nomsecretariat",
            "readOnly": False,
            "type": "udp",
            "name": "udp__nomsecretariat"
        },
        {
            "checked": True,
            "name": "udp__docureference",
            "header": "udp__docureference",
            "readOnly": False,
            "type": "udp",
            "allowBlank": True
        },
        {
            "fkField": "domain",
            "zoomModel": "protoExt.Domain",
            "name": "domain_id",
            "header": "domain_id",
            "readOnly": True,
            "type": "foreignid",
            "allowBlank": False
        },
        {
            "header": "ID",
            "readOnly": True,
            "type": "int",
            "name": "domain__id",
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
            "detailTitleLbl": "Vue :",
            "detailField": "model__pk",
            "conceptDetail": "protoExt.Concept",
            "masterTitleField": "code",
            "menuText": "Entité",
            "masterField": "pk"
        },
        {
            "detailTitleLbl": " ",
            "detailField": "concept__model__pk",
            "conceptDetail": "protoExt.Property",
            "masterTitleField": "code",
            "menuText": "Éléments de Données",
            "masterField": "pk"
        },
        {
            "menuText": "Propriétés ",
            "conceptDetail": "protoExt.Udp",
            "detailField": "metaObj__pk",
            "masterField": "pk"
        }
    ],
    "protoForm": {
        "__ptType": "protoForm",
        "title": "",
        "items": [
            {
                "fsLayout": "1col",
                "__ptType": "fieldset",
                "title": "Informations d\'ordre général",
                "items": [
                    {
                        "fieldLabel": "domain_id",
                        "allowBlank": True,
                        "defaultValue": "1",
                        "__ptType": "formField",
                        "name": "domain_id",
                        "readOnly": False,
                        "xtype": "textfield"
                    },
                    {
                        "xtype": "textfield",
                        "fieldLabel": "Nom de la vue",
                        "name": "code",
                        "__ptType": "formField",
                        "allowBlank": False
                    },
                    {
                        "fieldLabel": "Catégorie",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "category"
                    },
                    {
                        "fieldLabel": "Sous-Catégorie",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "udp__Souscategorie"
                    },
                    {
                        "fieldLabel": "Auteur de la vue",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "udp__Auteurmodele"
                    },
                    {
                        "fieldLabel": "Version",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "udp__Version"
                    },
                    {
                        "fieldLabel": "Document de référence",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "udp__docureference",
                        "readOnly": False,
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
                        "name": "udp__nomsibdm",
                        "width": 510,
                        "readOnly": False,
                        "allowBlank": True
                    },
                    {
                        "fieldLabel": "Acronyme SI ou BDM",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "udp__acronyme",
                        "readOnly": False,
                        "allowBlank": True
                    },
                    {
                        "fieldLabel": "Nom unité administrative",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "udp__uniteadministrative",
                        "readOnly": False,
                        "allowBlank": True
                    },
                    {
                        "fieldLabel": "Date du Cadre Normatif",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "udp__datecn",
                        "readOnly": False,
                        "type": "date",
                        "allowBlank": True
                    },
                    {
                        "fieldLabel": "Nom du réalisateur",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "udp__nomrealisateurcn",
                        "readOnly": False,
                        "allowBlank": True
                    },
                    {
                        "fieldLabel": "Nom(s) des rédacteurs",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "udp__nomredacteurs",
                        "readOnly": False,
                        "allowBlank": True
                    },
                    {
                        "fieldLabel": "Nom(s) secrétariat",
                        "xtype": "textfield",
                        "__ptType": "formField",
                        "name": "udp__nomsecretariat",
                        "readOnly": False,
                        "allowBlank": True
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
    }
}