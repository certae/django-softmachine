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
    "__ptType": "pcl",
    "protoOption": "protoDict.Model",
    "description": "Description des vues",
    "protoConcept": "protoDict.Model",
    "protoIcon": "icon-model",
    "updateTime": "2012-11-11 09:31:51",
    "protoSheetSelector": "udp__Categorie",
    "metaVersion": "12.1108",
    "idProperty": "id",
    "shortTitle": "Vues",
    "fields": [
        {
            "__ptType": "field",
            "header": "udp__docureference",
            "type": "udp",
            "name": "udp__docureference"
        },
        {
            "__ptType": "field",
            "zoomModel": "protoDict.Domain",
            "name": "domain",
            "fkId": "domain_id",
            "required": True,
            "cellLink": True,
            "header": "Domaine",
            
            "type": "foreigntext"
        },
        {
            "__ptType": "field",
            "flex": 100,
            "fieldLabel": "Nom de la vue",
            "name": "code",
            "header": "Nom de la vue",
            "required": True,
            "width": 200,
            
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
            "header": "Sous-Catégorie",
            "type": "string",
            "name": "udp__Souscategorie",
            "flex": 0.5
        },
        {
            "__ptType": "field",
            "fkField": "domain",
            "name": "domain_id",
            "header": "domain_id",
            "readOnly": True,
            "hidden": True,
            "type": "foreignid"
        },
        {
            "__ptType": "field",
            "fieldLabel": "Catégorie",
            "name": "category",
            "width": 100,
            "header": "Catégorie",
            
            "type": "string"
        },
        {
            "__ptType": "field",
            "header": "udp__nomredacteurs",
            "type": "udp",
            "name": "udp__nomredacteurs"
        },
        {
            "__ptType": "field",
            "header": "udp__uniteadministrative",
            "type": "string",
            "name": "udp__uniteadministrative"
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
            "flex": 300,
            "fieldLabel": "Description",
            "name": "udp__DescriptionModele",
            "header": "Description",
            "wordWrap": True,
            "type": "udp"
        },
        {
            "__ptType": "field",
            "header": "Date",
            "type": "date",
            "name": "udp__datecn",
            "fieldLabel": "Date"
        },
        {
            "__ptType": "field",
            "header": "udp__nomrealisateurcn",
            "type": "udp",
            "name": "udp__nomrealisateurcn"
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
            "header": "udp__nomsecretariat",
            "type": "udp",
            "name": "udp__nomsecretariat"
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
            "header": "udp__versioncn",
            "type": "udp",
            "name": "udp__versioncn"
        },
        {
            "__ptType": "field",
            "header": "Auteur",
            "type": "string",
            "name": "udp__Auteurmodele",
            "flex": 1
        }
    ],
    "actions": [
        {
            "__ptType": "actionDef",
            "name": "aaa",
            "actionParams": []
        }
    ],
    "protoDetails": [
        {
            "__ptType": "protoDetail",
            "detailTitleLbl": "Vue :",
            "conceptDetail": "protoDict.Concept",
            "detailField": "model__pk",
            "masterTitleField": "code",
            "menuText": "Entité",
            "masterField": "pk"
        },
        {
            "__ptType": "protoDetail",
            "detailField": "model__pk",
            "conceptDetail": "protoDict.PropertyModel",
            "detailName": "elementsdonnees",
            "menuText": "Éléments de Données",
            "masterTitleField": "code",
            "masterField": "pk"
        },
        {
            "__ptType": "protoDetail",
            "conceptDetail": "protoDict.UdpModel",
            "detailField": "model__pk",
            "detailName": "proprietes",
            "menuText": "Propriétés",
            "masterField": "pk"
        }
    ],
    "protoSheets": [
        {
            "__ptType": "protoSheet",
            "sheetType": "gridOnly",
            "name": "AT",
            "title": "Fiche descriptive des actions terraines",
            "templateFp": "<!DOCTYPE html> <html> <head> <meta name=\"generator\" content=\"HTML Tidy for Linux (vers 25 March 2009), see www.w3.org\"> <meta charset=\"utf-8\"> <title>{{reportTitle}}</title> <link href=\"static/css/mainsc.css\" rel=\"stylesheet\" type=\"text/css\"> <link href=\"static/css/print.css\" rel=\"stylesheet\" type=\"text/css\" media=\"print\"> </head> <body>",
            "template": "<table class=\"ficha\" cellpadding=\"3\"> <tr class=\"azul\"> <td class=\"negro\">Nom de l\'élément de donnée:</td> <td>{{code}}</td> </tr> <tr class=\"blanco\"> <td class=\"negro\">Description:</td> <td class=\"desc\">{{udp__DescriptionModele}}</td> </tr> <tr class=\"azul\"> <td class=\"negro\">Auteur de la vue</td> <td class=\"desc\">{{udp__Auteurmodele}}</td> </tr> <tr class=\"blanco\"> <td class=\"negro\">Version de la vue</td> <td class=\"desc\">{{udp__Version}}</td> </tr> <tr class=\"azul\"> <td class=\"negro\">Document de référence</td> <td>{{udp__docureference}}</td> </tr> <tr class=\"blanco\"> <td class=\"negro\">Acteur principal:</td> <td class=\"desc\">{{udp__ActeurPrincipal}}</td> </tr> <tr class=\"azul\"> <td class=\"negro\">Autres acteurs:</td> <td>{{udp__AutresActeurs}}</td> </tr> <tr class=\"blanco\"> <td class=\"negro\">Intrants déclencheurs:</td> <td class=\"desc\">{{udp__IntrantsDeclencheurs}}</td> </tr> </table>",
            "templateEr": "<div class=\"pagebreakbefore\"></div><div class=\"margepage\"><h3>Fiche descriptive de l\'action terrain: {{code}}</h3><table class=\"tabla\"> <caption>Ministère de la Santé et des Services sociaux</caption> <colgroup> <col class=\"coltabla\"/> <col /> </colgroup><tbody> <tr> <td>Nom de l\'élément de donnée:</td> <td>{{code}}</td> </tr> <tr> <td>Description:</td> <td>{{udp__DescriptionModele}}</td> </tr> <tr> <td>Auteur de la vue</td> <td>{{udp__Auteurmodele}}</td> </tr> <tr> <td>Version de la vue</td> <td>{{udp__Version}}</td> </tr> <tr> <td>Document de référence</td> <td>{{udp__docureference}}</td> </tr> <tr> <td>Acteur principal:</td> <td>{{udp__ActeurPrincipal}}</td> </tr> <tr> <td>Autres acteurs:</td> <td>{{udp__AutresActeurs}}</td> </tr> <tr> <td>Intrants déclencheurs:</td> <td>{{udp__IntrantsDeclencheurs}}</td> </tr> </tbody> </table> </div>",
            "sheetDetails": []
        },
        {
            "__ptType": "protoSheet",
            "title": "Fiche descriptive des vues locales",
            "name": "Locale",
            "template": "<table class=\"ficha\" cellpadding=\"3\"> <tr class=\"azul\"> <td class=\"negro\">Nom de l\'élément de donnée:</td> <td>{{code}}</td> </tr> <tr class=\"blanco\"> <td class=\"negro\">Description:</td> <td class=\"desc\">{{udp__DescriptionModele}}</td> </tr> <tr class=\"azul\"> <td class=\"negro\">Auteur de la vue</td> <td class=\"desc\">{{udp__Auteurmodele}}</td> </tr> <tr class=\"blanco\"> <td class=\"negro\">Version de la vue</td> <td class=\"desc\">{{udp__Version}}</td> </tr> <tr class=\"azul\"> <td class=\"negro\">Document de référence:</td> <td>{{udp__docureference}}</td> </tr><tr class=\"blanco\"> <td class=\"negro\">Nom du système d\'information ou de la banque de données ministérielle:</td> <td class=\"desc\">{{udp__nomsibdm}}</td></tr><tr class=\"azul\"> <td class=\"negro\">Acronyme SI ou BDM</td> <td>{{udp__acronyme}}</td></tr><tr class=\"blanco\"> <td class=\"negro\">Nom unité administrative:</td> <td class=\"desc\">{{udp__uniteadministrative}}</td></tr><tr class=\"azul\"> <td class=\"negro\">Date du Cadre Normatif</td> <td>{{udp__datecn}}</td> </tr><tr class=\"blanco\"> <td class=\"negro\">Nom du réalisateur CN:</td> <td class=\"desc\">{{udp__nomrealisateurcn}}</td></tr></table>",
            "templateFp": "<!DOCTYPE html> <html> <head> <meta name=\"generator\" content=\"HTML Tidy for Linux (vers 25 March 2009), see www.w3.org\"> <meta charset=\"utf-8\"> <title>{{reportTitle}}</title> <link href=\"static/css/mainsc.css\" rel=\"stylesheet\" type=\"text/css\"> <link href=\"static/css/print.css\" rel=\"stylesheet\" type=\"text/css\" media=\"print\"> </head> <body>",
            "templateEr": "<div class=\"pagebreakbefore\"></div><div class=\"margepage\"> <h3>Fiche descriptive de l\'action terrain: {{code}}</h3> <table class=\"tabla\"> <caption>Ministère de la Santé et des Services sociaux</caption> <colgroup> <col class=\"coltabla\" /> <col /> </colgroup> <tbody> <tr> <td>Nom de la vue:</td> <td>{{code}}</td> </tr> <tr> <td>Catégorie:</td> <td>{{udp__Categorie}}</td> </tr> <tr> <td>Description:</td> <td>{{udp__DescriptionModele}}</td> </tr> <tr> <td>Auteur de la vue</td> <td>{{udp__Auteurmodele}}</td> </tr> <tr> <td>Version de la vue</td> <td>{{udp__Version}}</td> </tr></tbody></table> </div>",
            "sheetDetails": []
        },
        {
            "__ptType": "protoSheet",
            "templateEr": "<div class=\"pagebreakbefore\"></div><div class=\"margepage\"> <h3>Fiche descriptive de l\'action terrain: {{code}}</h3> <table class=\"tabla\"> <caption>Ministère de la Santé et des Services sociaux</caption> <colgroup> <col class=\"coltabla\" /> <col /> </colgroup> <tbody> <tr> <td>Nom de la vue:</td> <td>{{code}}</td> </tr> <tr> <td>Catégorie:</td> <td>{{udp__Categorie}}</td> </tr> <tr> <td>Description:</td> <td>{{udp__DescriptionModele}}</td> </tr> <tr> <td>Auteur de la vue</td> <td>{{udp__Auteurmodele}}</td> </tr> <tr> <td>Version de la vue</td> <td>{{udp__Version}}</td> </tr></tbody></table> </div>",
            "title": "Fiche descriptive des vues corporatives",
            "templateFp": "<!DOCTYPE html> <html> <head> <meta name=\"generator\" content=\"HTML Tidy for Linux (vers 25 March 2009), see www.w3.org\"> <meta charset=\"utf-8\"> <title>{{reportTitle}}</title> <link href=\"static/css/mainsc.css\" rel=\"stylesheet\" type=\"text/css\"> <link href=\"static/css/print.css\" rel=\"stylesheet\" type=\"text/css\" media=\"print\"> </head> <body>",
            "template": "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01//EN\"> <html> <head> <title></title> </head> <body> <table class=\"ficha\" cellpadding=\"3\"> <tr class=\"azul\"> <td class=\"negro\">Nom de l\'élément de donnée:</td> <td>{{code}}</td> </tr> <tr class=\"blanco\"> <td class=\"negro\">Description:</td> <td class=\"desc\">{{udp__DescriptionModele}}</td> </tr> <tr class=\"azul\"> <td class=\"negro\">Auteur de la vue</td> <td class=\"desc\">{{udp__Auteurmodele}}</td> </tr> <tr class=\"blanco\"> <td class=\"negro\">Version de la vue</td> <td class=\"desc\">{{udp__Version}}</td> </tr> </table> </body> </html>",
            "name": "Corporative",
            "sheetDetails": []
        },
        {
            "__ptType": "protoSheet",
            "templateBb": "<div class=\"margepage\"> <div class=\"tete\"><img src=\"/static/img/app/en_tete.png\" alt=\"cadre normatif entete\" width=\"818\" height=\"241\" class=\"entete\"></div> <div class=\"maincontent\"> <div class=\"titrecentre\"> <h2 class=\"maj\">Cadre normatif</h2> <h3 class=\"maj\">pour {{udp__nomsibdm}}</h3> </div> <div class=\"titre2centre\"> <h2>Système d\'information {{udp__acronyme}}</h2> <h3>{{udp__uniteadministrative}}</h3> <h3>Ministère de la Santé et des Services sociaux</h3> </div> <div class=\"versioncentre\"> <h4>Version {{udp__versioncn}}</h4> <h5>{{udp__datecn}}</h5> </div> </div> <div class=\"footer\"><img src=\"/static/img/app/footer.png\" alt=\"cadre normatif footer\" width=\"818\" height=\"211\" class=\"footer\"></div> <div class=\"pagebreakbefore\"></div>",
            "name": "Cadre Normatif",
            "title": "Chapitre 3: description des éléments",
            "templateFp": "<!DOCTYPE html> <html> <head> <meta name=\"generator\" content=\"HTML Tidy for Linux (vers 25 March 2009), see www.w3.org\"> <meta charset=\"utf-8\"> <title>{{reportTitle}}</title> <link href=\"static/css/mainsc.css\" rel=\"stylesheet\" type=\"text/css\"> <link href=\"static/css/print.css\" rel=\"stylesheet\" type=\"text/css\" media=\"print\"> </head> <body>",
            "templateLp": "</body></html>",
            "templateEr": "<h3>Informations général: {{code}}</h3><table class=\"tabla\"><tr> <td>Nom de la vue:</td><td>{{code}}</td></tr><tr><td>Description:</td><td>{{udp__DescriptionModele}}</td></tr><tr><td>Auteur de la vue</td><td>{{udp__Auteurmodele}}</td></tr><tr><td>Version de la vue</td><td>{{udp__Version}}</td></tr><tr><td>Document de référence:</td><td>{{udp__docureference}}</td></tr><tr><td>Nom du système d\'information ou de la banque de données ministérielle:</td> <td>{{udp__nomsibdm}}</td></tr><tr><td>Acronyme SI ou BDM</td> <td>{{udp__acronyme}}</td></tr><tr><td>Nom unité administrative:</td> <td>{{udp__uniteadministrative}}</td></tr><tr><td>Date du Cadre Normatif</td> <td>{{udp__datecn}}</td></tr><tr><td>Nom du réalisateur CN:</td> <td>{{udp__nomrealisateurcn}}</td></tr><tr><td>Noms de rédacteurs:</td> <td>{{udp__nomredacteurs}}</td></tr><tr><td>Nom(s) secrétariat:</td> <td>{{udp__nomsecretariat}}</td></tr></table>",
            "sheetDetails": [
                {
                    "__ptType": "sheetDetail",
                    "templateBb": "<div class=\"pagebreakbefore\"></div><div class=\"margepage\"> <h3>Liste des éléments</h3> <table class=\"tabla\"><th> <tr> <td>Nom de l\'élément de données</td> <td>Numéro de l\'élément de données</td> </tr> </th>",
                    "name": "liste",
                    "detailName": "elementsdonnees",
                    "templateAb": "</table> </div>",
                    "templateEr": "<tr> <td>{{propertyDom__code}}</td> <td>{{udp__numelement}}</td> </tr>",
                    "sheetDetails": []
                },
                {
                    "__ptType": "sheetDetail",
                    "templateBb": "<div class=\"margepage\">",
                    "name": "elements",
                    "detailName": "elementsdonnees",
                    "templateAb": "</div>",
                    "templateEr": "<div class=\"pagebreakbefore\"></div> <table class=\"elemtete\" cellspacing=\"10\"> <tr> <td>Chapitre</td> <td>3</td> <td>Description des éléments</td> </tr> </table> <br /> <table class=\"tabla\"><colgroup class=\"coltabla\"> <col /> </colgroup><tr> <td>Nom de l\'élément de donnée:</td> <td>{{propertyDom__code}}</td> </tr> <tr> <td>Numéro de l\'élément de donnée au CN:</td> <td>{{udp__numelement}}</td> </tr> <tr> <td>Type de donnée:</td> <td>{{propertyDom__baseType}}</td> </tr> <tr> <td>Longueur:</td> <td>{{propertyDom__prpLength}}</td> </tr> <tr> <td>Gabarit:</td> <td>{{udp__GABARIT}}</td> </tr> <tr> <td>Définition:</td> <td>{{udp__DEFINITION}}</td> </tr> <tr> <td>Description:</td> <td>{{udp__DESCRIPTIONCN}}</td> </tr> <tr> <td>Précisions:</td> <td>{{udp__PRECISIONS}}</td> </tr> <tr> <td>Validations sur l\'élément:</td> <td>{{udp__VALIDATIONSSURELEMENT}}</td> </tr> <tr> <td>Validations inter-éléments:</td> <td>{{udp__VALIDATIONSINTERELEMENT}}</td> </tr> <tr> <td>Validation inter-enregistrement:</td> <td>{{udp__VALIDATION_INTER-ENREGISTREMENT}}</td> </tr> <tr> <td>Source de données externes:</td> <td>{{udp__SOURCEDEDONNEESEXTERNES}}</td> </tr> <tr> <td>Élément transformé:</td> <td>{{udp__ELEMENTTRANSFORME}}</td> </tr> <tr> <td>Éléments de source:</td> <td>{{udp__elementssource}}</td> </tr> <tr> <td>Méthode de transformation:</td> <td>{{udp__methodetransf}}</td> </tr> <tr> <td>Élément transmis:</td> <td>{{udp__ELEMENTTRANSMIS}}</td> </tr> <tr> <td>Domaine de valeurs:</td> <td>{{udp__DOMAINEDEVALEURS}}</td> </tr> <tr> <td>Entrée en vigueur:</td> <td>{{udp__ENTREEENVIGUEUR}}</td> </tr> <tr> <td>Date de la dernière modification:</td> <td>{{udp__DATEDERNIREMODIFICATION}}</td> </tr> <tr> <td>Validation:</td> <td>{{udp__VALIDATION}}</td> </tr> <tr> <td>Requis par:</td> <td>{{udp__REQUISPAR}}</td> </tr> <tr> <td>Transmission:</td> <td>{{udp__TRANSMISSION}}</td> </tr> <tr> <td>Statut élément de donnée:</td> <td>{{udp__STATUTELEMENTDEDONNEE}}</td> </tr></table>",
                    "sheetDetails": []
                }
            ]
        }
    ],
    "gridConfig": {
        "__ptType": "gridConfig",
        "hideRowNumbers": True,
        "multiSelect": True,
        "denyAutoPrint": True,
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
        "hiddenFields": [
            "id"
        ],
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
        "baseFilter": [],
        "initialFilter": []
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
                        "tooltip": "Créateur de la vue",
                        "fieldLabel": "Auteur de la vue",
                        "name": "udp__Auteurmodele",
                        "xtype": "textfield"
                    },
                    {
                        "__ptType": "formField",
                        "tooltip": "Version de la vue",
                        "fieldLabel": "Version",
                        "name": "udp__Version",
                        "xtype": "textfield"
                    },
                    {
                        "__ptType": "formField",
                        "tooltip": "Document de base pour la création de la vue",
                        "fieldLabel": "Document de référence",
                        "xtype": "textfield",
                        "name": "udp__docureference"
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
                        "type": "string",
                        "xtype": "textfield",
                        "name": "udp__uniteadministrative"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Version",
                        "xtype": "textfield",
                        "name": "udp__versioncn"
                    },
                    {
                        "__ptType": "formField",
                        "fieldLabel": "Date du Cadre Normatif",
                        "type": "date",
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