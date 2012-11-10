# -*- coding: utf-8 -*-

#El modelo tendra dos campos para seleccionar fichas, pues hay un nivel de ficha a nivel de modelo que no
#coincide con el selector usado a nivel de elementods de datos ( properties )
#
#Categoria,       Modelo  
#SubCategoria     Para los elmentos de datos 


import django.contrib.admin          

class Model_Admin(django.contrib.admin.ModelAdmin):
    
    
    protoExt = {
    "__ptType": "pcl",
    "protoOption": "protoDict.Model",
    "description": "Description des vues",
    "protoConcept": "protoDict.Model",
    "protoIcon": "icon-model",
    "updateTime": "2012-11-09 17:44:45",
    "protoSheetSelector": "udp__Categorie",
    "idProperty": "id",
    "shortTitle": "Vues",
    "fields": [
        {
            "__ptType": "field",
            "flex": 100,
            "fieldLabel": "Nom de la vue",
            "name": "code",
            "header": "Nom de la vue",
            "width": 200,
            "fromModel": True,
            "sortable": True,
            "type": "string"
        },
        {
            "__ptType": "field",
            "header": "Catégorie",
            "type": "string",
            "name": "udp__Categorie",
            "flex": 30
        },
        {
            "__ptType": "field",
            "flex": 1,
            "fieldLabel": "Modèle",
            "name": "__str__",
            "fkId": "id",
            "zoomModel": "protoDict.Model",
            "cellLink": True,
            "header": "ModèLe",
            "readOnly": True,
            "type": "string"
        },
        {
            "__ptType": "field",
            "flex": 1,
            "name": "udp__ActeurPrincipal",
            "header": "Acteur principal",
            "wordWrap": True,
            "type": "text"
        },
        {
            "__ptType": "field",
            "header": "Version",
            "type": "string",
            "name": "udp__Version",
            "flex": 1
        },
        {
            "__ptType": "field",
            "header": "Sous-Catégorie",
            "type": "string",
            "name": "udp__Souscategorie",
            "flex": 0.5
        },
        {
            "__ptType": "field",
            "fieldLabel": "Catégorie",
            "name": "category",
            "header": "Catégorie",
            "width": 100,
            "fromModel": True,
            "type": "string"
        },
        {
            "__ptType": "field",
            "flex": 1,
            "name": "udp__AutresActeurs",
            "header": "Autres acteurs",
            "cellToolTip": True,
            "type": "text"
        },
        {
            "__ptType": "field",
            "flex": 1,
            "name": "udp__IntrantsDeclencheurs",
            "header": "Intrants déclencheurs",
            "wordWrap": True,
            "type": "text"
        },
        {
            "__ptType": "field",
            "header": "Auteur",
            "type": "string",
            "name": "udp__Auteurmodele",
            "flex": 1
        },
        {
            "__ptType": "field",
            "header": "udp__nomsibdm",
            "type": "udp",
            "name": "udp__nomsibdm"
        },
        {
            "__ptType": "field",
            "header": "udp__acronyme",
            "type": "udp",
            "name": "udp__acronyme"
        },
        {
            "__ptType": "field",
            "header": "udp__uniteadministrative",
            "type": "udp",
            "name": "udp__uniteadministrative"
        },
        {
            "__ptType": "field",
            "header": "udp__datecn",
            "type": "udp",
            "name": "udp__datecn"
        },
        {
            "__ptType": "field",
            "header": "udp__nomrealisateurcn",
            "type": "udp",
            "name": "udp__nomrealisateurcn"
        },
        {
            "__ptType": "field",
            "header": "udp__nomredacteurs",
            "type": "udp",
            "name": "udp__nomredacteurs"
        },
        {
            "__ptType": "field",
            "header": "udp__nomsecretariat",
            "type": "udp",
            "name": "udp__nomsecretariat"
        },
        {
            "__ptType": "field",
            "header": "udp__docureference",
            "type": "udp",
            "name": "udp__docureference"
        },
        {
            "__ptType": "field",
            "fkField": "domain",
            "zoomModel": "protoDict.Domain",
            "name": "domain_id",
            "header": "domain_id",
            "readOnly": True,
            "type": "foreignid"
        },
        {
            "__ptType": "field",
            "zoomModel": "protoDict.Domain",
            "name": "domain",
            "fkId": "domain_id",
            "cellLink": True,
            "header": "Domaine",
            "type": "foreigntext"
        },
        {
            "__ptType": "field",
            "flex": 300,
            "fieldLabel": "Description",
            "name": "udp__DescriptionModele",
            "header": "Description",
            "wordWrap": True,
            "type": "udp"
        }
    ],
    "actions": [],
    "protoDetails": [
        {
            "__ptType": "protoDetail",
            "detailTitleLbl": "Vue :",
            "detailField": "model__pk",
            "conceptDetail": "protoDict.Concept",
            "masterTitleField": "code",
            "menuText": "Entité",
            "masterField": "pk"
        },
        {
            "__ptType": "protoDetail",
            "conceptDetail": "protoDict.PropertyModel",
            "detailField": "model__pk",
            "masterTitleField": "code",
            "menuText": "Éléments de Données",
            "masterField": "pk"
        },
        {
            "__ptType": "protoDetail",
            "menuText": "Propriétés",
            "conceptDetail": "protoDict.UdpModel",
            "detailField": "model__pk",
            "masterField": "pk"
        }
    ],
    "protoSheets": [
        {
            "__ptType": "protoSheet",
            "title": "Fiche descriptive des actions terraines",
            "name": "AT",
            "template": "<table class=\"ficha\" cellpadding=\"3\"> <tr class=\"azul\"> <td class=\"negro\">Nom de l\'élément de donnée:</td> <td>{{code}}</td> </tr> <tr class=\"blanco\"> <td class=\"negro\">Description:</td> <td class=\"desc\">{{udp__DescriptionModele}}</td> </tr> <tr class=\"azul\"> <td class=\"negro\">Auteur de la vue</td> <td class=\"desc\">{{udp__Auteurmodele}}</td> </tr> <tr class=\"blanco\"> <td class=\"negro\">Version de la vue</td> <td class=\"desc\">{{udp__Version}}</td> </tr> <tr class=\"azul\"> <td class=\"negro\">Document de référence</td> <td>{{udp__docureference}}</td> </tr> <tr class=\"blanco\"> <td class=\"negro\">Acteur principal:</td> <td class=\"desc\">{{udp__ActeurPrincipal}}</td> </tr> <tr class=\"azul\"> <td class=\"negro\">Autres acteurs:</td> <td>{{udp__AutresActeurs}}</td> </tr> <tr class=\"blanco\"> <td class=\"negro\">Intrants déclencheurs:</td> <td class=\"desc\">{{udp__IntrantsDeclencheurs}}</td> </tr> </table>",
            "sheetDetails": []
        },
        {
            "__ptType": "protoSheet",
            "title": "Fiche descriptive des vues locales",
            "name": "Locale",
            "template": "<table class=\"ficha\" cellpadding=\"3\"> <tr class=\"azul\"> <td class=\"negro\">Nom de l\'élément de donnée:</td> <td>{{code}}</td> </tr> <tr class=\"blanco\"> <td class=\"negro\">Description:</td> <td class=\"desc\">{{udp__DescriptionModele}}</td> </tr> <tr class=\"azul\"> <td class=\"negro\">Auteur de la vue</td> <td class=\"desc\">{{udp__Auteurmodele}}</td> </tr> <tr class=\"blanco\"> <td class=\"negro\">Version de la vue</td> <td class=\"desc\">{{udp__Version}}</td> </tr> <tr class=\"azul\"> <td class=\"negro\">Document de référence:</td> <td>{{udp__docureference}}</td> </tr><tr class=\"blanco\"> <td class=\"negro\">Nom du système d\'information ou de la banque de données ministérielle:</td> <td class=\"desc\">{{udp__nomsibdm}}</td></tr><tr class=\"azul\"> <td class=\"negro\">Acronyme SI ou BDM</td> <td>{{udp__acronyme}}</td></tr><tr class=\"blanco\"> <td class=\"negro\">Nom unité administrative:</td> <td class=\"desc\">{{udp__uniteadministrative}}</td></tr><tr class=\"azul\"> <td class=\"negro\">Date du Cadre Normatif</td> <td>{{udp__datecn}}</td> </tr><tr class=\"blanco\"> <td class=\"negro\">Nom du réalisateur CN:</td> <td class=\"desc\">{{udp__nomrealisateurcn}}</td></tr></table>",
            "sheetDetails": []
        },
        {
            "__ptType": "protoSheet",
            "title": "Fiche descriptive des vues corporatives",
            "name": "Corporative",
            "template": "<table class=\"ficha\" cellpadding=\"3\"> <tr class=\"azul\"> <td class=\"negro\">Nom de l\'élément de donnée:</td> <td>{{code}}</td> </tr> <tr class=\"blanco\"> <td class=\"negro\">Description:</td> <td class=\"desc\">{{udp__DescriptionModele}}</td> </tr> <tr class=\"azul\"> <td class=\"negro\">Auteur de la vue</td> <td class=\"desc\">{{udp__Auteurmodele}}</td> </tr> <tr class=\"blanco\"> <td class=\"negro\">Version de la vue</td> <td class=\"desc\">{{udp__Version}}</td> </tr> <tr class=\"azul\"> <td class=\"negro\">Document de référence</td> <td>{{udp__docureference}}</td> </tr> </table>",
            "sheetDetails": []
        }
    ],
    "gridConfig": {
        "__ptType": "gridConfig",
        "hideRowNumbers": True,
        "listDisplay": [
            "code",
            "udp__Categorie",
            "udp__DescriptionModele"
        ],
        "searchFields": [
            "code"
        ],
        "sortFields": [
            "code"
        ],
        "hiddenFields": [],
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
        "initialSort": [
            {
                "sort": None,
                "direction": "ASC",
                "property": "code",
                "root": "data",
                "transform": None
            }
        ],
        "baseFilter": {},
        "initialFilter": {}
    },
    "protoForm": {
        "__ptType": "protoForm",
        "items": [
            {
                "__ptType": "fieldset",
                "fsLayout": "1col",
                "title": "Informations d\'ordre général",
                "items": [
                    {
                        "__ptType": "formField",
                        "zoomModel": "protoDict.Domain",
                        "fieldLabel": "Domaine",
                        "xtype": "protoZoom",
                        "fkId": "domain_id",
                        "name": "domain"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Nom de la vue",
                        "xtype": "textfield",
                        "name": "code"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Catégorie",
                        "xtype": "textfield",
                        "name": "udp__Categorie"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Sous-Catégorie",
                        "xtype": "textfield",
                        "name": "udp__Souscategorie"
                    },
                    {
                        "__ptType": "formField",
                        "name": "udp__Auteurmodele",
                        "fieldLabel": "Auteur de la vue",
                        "xtype": "textfield",
                        "tooltip": "Créateur de la vue"
                    },
                    {
                        "__ptType": "formField",
                        "name": "udp__Version",
                        "fieldLabel": "Version",
                        "xtype": "textfield",
                        "tooltip": "Version de la vue"
                    },
                    {
                        "__ptType": "formField",
                        "xtype": "textfield",
                        "fieldLabel": "Document de référence",
                        "name": "udp__docureference",
                        "tooltip": "Document de base pour la création de la vue"
                    },
                    {
                        "__ptType": "htmlset",
                        "items": [
                            {
                                "__ptType": "formField",
                                "fieldLabel": "Description",
                                "name": "udp__DescriptionModele",
                                "xtype": "textfield"
                            }
                        ]
                    }
                ]
            },
            {
                "__ptType": "fieldset",
                "fsLayout": "1col",
                "title": "Informations concernant le Cadre Normatif",
                "items": [
                    {
                        "__ptType": "formField",
                        "width": 510,
                        "fieldLabel": "Nom du système d\'information ou de la banque de données ministérielle",
                        "name": "udp__nomsibdm",
                        "xtype": "textfield"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Acronyme SI ou BDM",
                        "xtype": "textfield",
                        "name": "udp__acronyme"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Nom unité administrative",
                        "xtype": "textfield",
                        "name": "udp__uniteadministrative"
                    },
                    {
                        "__ptType": "formField",
                        "type": "date",
                        "fieldLabel": "Date du Cadre Normatif",
                        "name": "udp__datecn",
                        "xtype": "datefield"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Nom du réalisateur",
                        "xtype": "textfield",
                        "name": "udp__nomrealisateurcn"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Nom(s) des rédacteurs",
                        "xtype": "textfield",
                        "name": "udp__nomredacteurs"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Nom(s) secrétariat",
                        "xtype": "textfield",
                        "name": "udp__nomsecretariat"
                    }
                ]
            },
            {
                "__ptType": "fieldset",
                "fsLayout": "1col",
                "title": "Informations concernant les AT",
                "items": [
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Acteur principal",
                        "xtype": "textarea",
                        "name": "udp__ActeurPrincipal",
                        "height": 100,
                        "labelAlign": "top"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Autres acteurs",
                        "xtype": "textarea",
                        "name": "udp__AutresActeurs",
                        "height": 100,
                        "labelAlign": "top"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Intrants déclencheurs",
                        "xtype": "textarea",
                        "name": "udp__IntrantsDeclencheurs",
                        "height": 100,
                        "labelAlign": "top"
                    }
                ]
            }
        ]
    },
    "protoUdp": {
        "__ptType": "protoUdp",
        "propertyPrefix": "udp",
        "propertyRef": "model",
        "propertyName": "code",
        "propertyValue": "valueUdp",
        "udpTable": "udpModel"
    }
}