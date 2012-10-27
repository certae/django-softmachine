# -*- coding: utf-8 -*-

#El modelo tendra dos campos para seleccionar fichas, pues hay un nivel de ficha a nivel de modelo que no
#coincide con el selector usado a nivel de elementods de datos ( properties )
#
#Categoria,       Modelo  
#SubCategoria     Para los elmentos de datos 

from models import *

import django.contrib.admin          
 
class ConceptInline(django.contrib.admin.TabularInline):
    model = Concept 
    fk_name = 'model'
    extra = 1
    fields = ('code', 'description')


class Model_Admin(django.contrib.admin.ModelAdmin):
    verbose_name_plural = 'Modèles' 
    list_display =(  'code',  'category')
    list_filter =( 'code',  'category' )
    search_fields =('code',  'category' )
    

    
    protoXExt = {
    "sheetConfig": {
        "protoSheets": [
            {
                "name": "DEFAULT",
                "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de la vue: </td><td>{{code}}</td></tr><tr class=\"azul\"><td class=\"negro\">Catégorie: </td><td>{{udp__Categorie}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Sous-Catégorie:</td><td>{{udp__Souscategorie}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Auteur de la vue:</td><td>{{udp__Auteurmodele}}</td></tr><tr class=\"azul\"><td class=\"negro\">Version de la vue: </td><td>{{udp__Version}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Description: </td><td class=\"desc\">{{udp__Descriptionmodele}}</td></tr></table>",
                "title": "Fiche descriptive des vues corporatives"
            },
            {
                "name": "AT",
                "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de la vue: </td><td>{{code}}</td></tr><tr class=\"azul\"><td class=\"negro\">Catégorie: </td><td>{{udp__Categorie}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Sous-Catégorie:</td><td>{{udp__Souscategorie}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Auteur de la vue:</td><td>{{udp__Auteurmodele}}</td></tr><tr class=\"azul\"><td class=\"negro\">Version de la vue: </td><td>{{udp__Version}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Description: </td><td class=\"desc\">{{udp__Descriptionmodele}}</td></tr><tr class=\"azul\"><td class=\"negro\">Acteur principal: </td><td>{{udp__ActeurPrincipal}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Autres acteurs: </td><td>{{udp__AutresActeurs}}</td></tr><tr class=\"azul\"><td class=\"negro\">Intrants declencheurs: </td><td>{{udp__IntrantsDeclencheurs}}</td></tr></table>",
                "title": "Fiche descriptive des actions terraines"
            },
            {
                "name": "locale",
                "template": "<table class=\"ficha\" cellpadding=\"3\"><tr class=\"azul\"><td class=\"negro\">Nom de la vue: </td><td>{{code}}</td></tr><tr class=\"azul\"><td class=\"negro\">Catégorie: </td><td>{{udp__Categorie}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Sous-Catégorie:</td><td>{{udp__Souscategorie}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Auteur de la vue:</td><td>{{udp__Auteurmodele}}</td></tr><tr class=\"azul\"><td class=\"negro\">Version de la vue: </td><td>{{udp__Version}}</td></tr><tr class=\"blanco\"><td class=\"negro\">Description: </td><td class=\"desc\">{{udp__Descriptionmodele}}</td></tr></table>",
                "title": "Fiche descriptive des vues locales"
            }
        ],
        "protoSheetSelector": "udp__Categorie",
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
        "searchFields": [
            "code"
        ],
        "baseFilter": {},
        "hideRowNumbers": False,
        "listDisplay": [
            "code",
            "category",
            "udp__Descriptionmodele"
        ],
        "hiddenFields": [
            "id"
        ],
        "filterSetABC": "",
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
        "initialFilter": {}
    },
    "protoOption": "protoExt.Model",
    "protoMenuIx": "",
    "description": "Description du modèle",
    "shortTitle": "Vues",
    "protoIcon": "icon-model",
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
            "flex": 1,
            "checked": True
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
            "header": "Acteur principal",
            "type": "text",
            "wordWrap": True,
            "name": "udp__ActeurPrincipal",
            "flex": 1,
            "checked": True
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
            "header": "Description Modèle",
            "vType": "htmlText",
            "type": "text",
            "name": "udp__Descriptionmodele",
            "flex": 6,
            "checked": True
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
            "header": "Autres acteurs",
            "type": "text",
            "name": "udp__AutresActeurs",
            "cellToolTip": True,
            "flex": 1,
            "checked": True
        },
        {
            "header": "Intrants déclencheurs",
            "type": "text",
            "wordWrap": True,
            "name": "udp__IntrantsDeclencheurs",
            "flex": 1,
            "checked": True
        },
        {
            "header": "Auteur",
            "type": "string",
            "name": "udp__Auteurmodele",
            "flex": 1,
            "checked": True
        },
        {
            "name": "udp__nomsibdm",
            "type": "udp",
            "readOnly": False,
            "allowBlank": True,
            "header": "udp__nomsibdm",
            "checked": True
        },
        {
            "name": "udp__acronyme",
            "type": "udp",
            "readOnly": False,
            "allowBlank": True,
            "header": "udp__acronyme",
            "checked": True
        },
        {
            "name": "udp__uniteadministrative",
            "type": "udp",
            "readOnly": False,
            "allowBlank": True,
            "header": "udp__uniteadministrative",
            "checked": True
        },
        {
            "name": "udp__datecn",
            "type": "udp",
            "readOnly": False,
            "allowBlank": True,
            "header": "udp__datecn",
            "checked": True
        },
        {
            "name": "udp__nomrealisateurcn",
            "type": "udp",
            "readOnly": False,
            "allowBlank": True,
            "header": "udp__nomrealisateurcn"
        },
        {
            "name": "udp__nomredacteurs",
            "type": "udp",
            "readOnly": False,
            "allowBlank": True,
            "header": "udp__nomredacteurs"
        },
        {
            "name": "udp__nomsecretariat",
            "type": "udp",
            "readOnly": False,
            "allowBlank": True,
            "header": "udp__nomsecretariat"
        }
    ],
    "protoConcept": "protoExt.Model",
    "protoMenuOpt": "",
    "protoUdp": {
        "propertyPrefix": "udp",
        "propertyName": "code",
        "udpTable": "udp",
        "propertyValue": "valueUdp"
    },
    "helpPath": "",
    "protoDetails": [
        {
            "detailTitleLbl": "Vue :",
            "conceptDetail": "protoExt.Concept",
            "detailField": "model__pk",
            "masterTitleField": "code",
            "menuText": "Entité",
            "masterField": "pk"
        },
        {
            "detailTitleLbl": " ",
            "conceptDetail": "protoExt.Property",
            "detailField": "concept__model__pk",
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
    "protoForm": [
        {
            "__ptType": "fieldset",
            "title": "Informations d\'ordre général",
            "fsLayout": "1col",
            "items": [
                {
                    "allowBlank": False,
                    "fieldLabel": "Nom de la vue",
                    "__ptType": "formField",
                    "xtype": "textfield",
                    "name": "code"
                },
                {
                    "fieldLabel": "Catégorie",
                    "__ptType": "formField",
                    "xtype": "textfield",
                    "name": "udp__Categorie"
                },
                {
                    "fieldLabel": "Sous-Catégorie",
                    "__ptType": "formField",
                    "xtype": "textfield",
                    "name": "udp__Souscategorie"
                },
                {
                    "fieldLabel": "Auteur de la vue",
                    "__ptType": "formField",
                    "xtype": "textfield",
                    "name": "udp__Auteurmodele"
                },
                {
                    "fieldLabel": "Version",
                    "xtype": "textfield",
                    "__ptType": "formField",
                    "name": "udp__Version"
                },
                {
                    "__ptType": "htmlset",
                    "items": [
                        {
                            "fieldLabel": "Description",
                            "xtype": "textarea",
                            "height": 100,
                            "labelAlign": "top",
                            "__ptType": "formField",
                            "name": "udp__Descriptionmodele"
                        }
                    ]
                }
            ]
        },
        {
            "__ptType": "fieldset",
            "title": "Informations concernant le Cadre Normatif",
            "fsLayout": "1col",
            "items": [
                {
                    "readOnly": False,
                    "allowBlank": True,
                    "fieldLabel": "Nom du système d\'information ou de la banque de données minitérielle",
                    "__ptType": "formField",
                    "xtype": "textfield",
                    "name": "udp__nomsibdm",
                    "width": 510
                },
                {
                    "readOnly": False,
                    "allowBlank": True,
                    "fieldLabel": "Acronyme SI ou BDM",
                    "__ptType": "formField",
                    "xtype": "textfield",
                    "name": "udp__acronyme"
                },
                {
                    "readOnly": False,
                    "allowBlank": True,
                    "fieldLabel": "Nom unité administrative",
                    "__ptType": "formField",
                    "xtype": "textfield",
                    "name": "udp__uniteadministrative"
                },
                {
                    "readOnly": False,
                    "allowBlank": True,
                    "fieldLabel": "Date du Cadre Normatif",
                    "__ptType": "formField",
                    "xtype": "textfield",
                    "name": "udp__datecn"
                },
                {
                    "readOnly": False,
                    "allowBlank": True,
                    "fieldLabel": "Nom du réalisateur",
                    "__ptType": "formField",
                    "xtype": "textfield",
                    "name": "udp__nomrealisateurcn"
                },
                {
                    "readOnly": False,
                    "allowBlank": True,
                    "fieldLabel": "Nom(s) des rédacteurs",
                    "__ptType": "formField",
                    "xtype": "textfield",
                    "name": "udp__nomredacteurs"
                },
                {
                    "readOnly": False,
                    "allowBlank": True,
                    "fieldLabel": "Nom(s) secrétariat",
                    "__ptType": "formField",
                    "xtype": "textfield",
                    "name": "udp__nomsecretariat"
                }
            ]
        },
        {
            "__ptType": "fieldset",
            "title": "Informations concernant les AT",
            "fsLayout": "1col",
            "items": [
                {
                    "fieldLabel": "Acteur principal",
                    "xtype": "textarea",
                    "height": 100,
                    "labelAlign": "top",
                    "__ptType": "formField",
                    "name": "udp__ActeurPrincipal"
                },
                {
                    "fieldLabel": "Autres acteurs",
                    "xtype": "textarea",
                    "height": 100,
                    "labelAlign": "top",
                    "__ptType": "formField",
                    "name": "udp__AutresActeurs"
                },
                {
                    "fieldLabel": "Intrants déclencheurs",
                    "xtype": "textarea",
                    "height": 100,
                    "labelAlign": "top",
                    "__ptType": "formField",
                    "name": "udp__IntrantsDeclencheurs"
                }
            ]
        }
    ],
    "idProperty": "id"
}