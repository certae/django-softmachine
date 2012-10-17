# -*- coding: utf-8 -*-
import django.contrib.admin          

class PropertyAdmin(django.contrib.admin.ModelAdmin):
    verbose_name_plural = 'Éléments de données' 
    list_display =( 'code', 'category', 'concept')
    search_fields = ( 'code', 'category', 'concept' )

    protoExt = {'protoIcon': 'property' }
    protoExt[ 'title' ] = 'Éléments de données'
    protoExt[ 'listDisplay' ] = ( 'code', 'concept__model')

#   protoExt[ 'readOnlyFields' ] = ( 'code', 'concept__model' ) 

    protoExt[ 'searchFields' ] = ( 'code', 'concept__model' ) 
    protoExt[ 'sortFields' ] = ( 'code', 'concept__model' )
    protoExt[ 'baseFilter' ] = { 'isForeign': False  }
    
    # Valores iniciales ( initialFilter maneja el autoload )   
    protoExt[ 'initialSort' ] = ( 'code', 'concept__model', ) 
    protoExt[ 'initialFilter' ] = {}
    
    protoExt[ 'protoDetails' ] = [
         {'menuText': 'UDPs ', 
          'conceptDetail': 'protoExt.Udp', 
          'detailField': 'metaObj__pk', 
          'masterField': 'pk'}, 
        ]



    # Define el manejo de propiedades extendidas ( User defined properties 'UDP'
    # Debe existir una FKey en la tabla UDP apuntando hacia la tabla de base 
    # 'udpFk': 'metaObj',  'basePk': 'id', Son Mapeados por el ORM     
    protoExt[ 'protoUdp' ] =   { 
        'udpTable': 'udp', 
        'propertyName': 'code', 
        'propertyValue': 'valueUdp', 
        'propertyPrefix' : 'udp',           # Las referencias a los campos estaran precedidas por [prefix]__
         }

    protoExt[ 'protoFields' ] =  {        
        'code': {'header' : 'Éléments de données',  'minWidth': 200, 'flex': 1, 'fieldLabel' : 'Property' },
        'concept__model': {'header' : 'Vue',  'minWidth': 200 , 'flex': 1, 'cellLink' : True, 'zoomModel' : 'protoExt.Model', 'fkId' : 'concept__model_id' },  
        'concept__model_id': {'header' : 'VueId', },  
        'concept__model__category' : { 'fieldLabel' : 'Category' },                             

        'description': { 'storeOnly': True ,'header' : 'Description'  },
        'concept__code': { 'storeOnly': True ,'header' : 'Concept', 'minWidth': 200, 'flex': 1 , 'fieldLabel' : 'Entity' },
          
        'isNullable':{ 'header' : 'Is null'},
        'isRequired':{ 'fieldLabel' : 'Is Required' },
        'alias':{ 'fieldLabel' : 'Alias' },
        'baseType' : { 'fieldLabel' : 'Type' }, 
        'prpLength' : { 'fieldLabel' : 'Length'  },
         
        'udp__GABARIT': { 'fieldLabel' : 'Gabarit', 'type' : 'combo', 'choices' : [[ '0', 'cero'], [ '1', 'uno']]  },
        'udp__DOCUMENTDEREFERENCE' :{ 'fieldLabel' : 'Doc Reference'},

        'udp__VALIDATION': { 'fieldLabel' : 'Validation' , 'type': 'html'   },
        'udp__VALIDATIONSSURELEMENT': { 'fieldLabel' : 'Validation Elto' , 'type': 'html'  },
        'udp__VALIDATIONSINTERELEMENT': { 'fieldLabel' : 'Validation Reg' , 'type': 'html'  },
        'udp__VALIDATION_INTER-ENREGISTREMENT': { 'fieldLabel' : 'Validation Entt' , 'type': 'html'  },

        'udp__DEFINITION': { 'fieldLabel' : 'Definition' , 'type': 'html' },
        'udp__PRECISIONS': { 'fieldLabel' : 'Precision' , 'type': 'html' },
        'udp__DOMAINEDEVALEURS': { 'fieldLabel' : 'Domain Valuers', 'type': 'html' },
        'udp__DESCRIPTIONCN': { 'fieldLabel' : 'Description CN', 'type': 'html'  }, 
        
        'udp__SOURCEDEDONNEESEXTERNES': { 'fieldLabel' : 'Source Donnes'  },
        'udp__ELEMENTTRANSFORME': { 'fieldLabel' : 'Elto transforme'  },
        'udp__ELEMENTTRANSMIS': { 'fieldLabel' : 'Elto Transmis'  },
        'udp__ENTREEENVIGUEUR': { 'fieldLabel' : 'Entree en viguer'  },
        'udp__DATEDERNIREMODIFICATION': { 'fieldLabel' : 'Dt derniere modif' , 'type' : 'date' },
        'udp__REQUISPAR': { 'fieldLabel' : 'Rquis par'  },
        'udp__TRANSMISSION': { 'fieldLabel' : 'Transmission'  },
        'udp__STATUTELEMENTDEDONNEE': { 'fieldLabel' : 'Statut élément de donnée'  }, 
     }

#    Al momento de cargar la finca verifico el campo @criteriaField@ y lo busco en las diferentes fichas, 
#    la ficha 'DEFAULT' se usa si no hay otra definicion, el campo de criterio se define aparte  

    protoExt[ 'protoSheetSelector' ] = 'concept__model__category'
    protoExt[ 'protoSheetProperties' ] = (   'code',
                            'concept__model',
                            'isNullable',
                            'alias',
                            'baseType',
                            'prpLength',
                            'description', 
                            'udp__DOCUMENTDEREFERENCE',
                            'udp__GABARIT',
                            'udp__DEFINITION',
                            'udp__DESCRIPTIONCN',
                            'udp__PRECISIONS',
                            'udp__VALIDATION',
                            'udp__VALIDATIONSSURELEMENT',
                            'udp__VALIDATIONSINTERELEMENT',
                            'udp__VALIDATION_INTER-ENREGISTREMENT',
                            'udp__SOURCEDEDONNEESEXTERNES',
                            'udp__ELEMENTTRANSFORME',
                            'udp__ELEMENTTRANSMIS',
                            'udp__DOMAINEDEVALEURS',
                            'udp__ENTREEENVIGUEUR',
                            'udp__DATEDERNIREMODIFICATION',
                            'udp__REQUISPAR',
                            'udp__TRANSMISSION',
                            'udp__STATUTELEMENTDEDONNEE'
                            )


    TEMPLATE = '<table class="ficha" cellpadding="3">'
    TEMPLATE += '<tr class="azul"><td class="negro">Nom de l\'élément de donnée: </td><td>{{code}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro"> Nom de la vue de l\'élément de donnée:</td><td>{{concept__model}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro"> Document de référence: </td><td class="desc">{{udp__DOCUMENTDEREFERENCE}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Numéro de l\'élément de donnée au CN: </td><td class="desc">{{alias}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Type de donnée: </td><td class="desc">{{baseType}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Longueur: </td><td class="desc">{{prpLength}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Gabarit: </td><td class="desc">{{udp__GABARIT}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Définition: </td><td class="desc">{{udp__DEFINITION}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Description: </td><td class="desc">{{udp__DESCRIPTIONCN}}</td></tr>'

    TEMPLATE += '<tr class="blanco"><td class="negro">Précisions: </td><td class="desc">{{udp__PRECISIONS}}</td></tr>'   
    TEMPLATE += '<tr class="azul"><td class="negro">Validations sur l\'élément: </td><td class="desc">{{udp__VALIDATIONSSURELEMENT}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Validations inter-éléments: </td><td class="desc">{{udp__VALIDATIONSINTERELEMENT}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Validation inter-enregistrement: </td><td class="desc">{{udp__VALIDATION_INTER-ENREGISTREMENT}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Source de données externes: </td><td class="desc">{{udp__SOURCEDEDONNEESEXTERNES}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Élément transformé: </td><td class="desc">{{udp__ELEMENTTRANSFORME}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Élément transmis: </td><td class="desc">{{udp__ELEMENTTRANSMIS}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Domaine de valeurs: </td><td class="desc">{{udp__DOMAINEDEVALEURS}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Entrée en vigueur: </td><td class="desc">{{udp__ENTREEENVIGUEUR}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Date de la dernière modification: </td><td class="desc">{{udp__DATEDERNIREMODIFICATION}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Valeur nulle possible (oui,non)</td><td class="desc">{{isNullable}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Validation: </td><td class="desc">{{udp__VALIDATION}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Requis par: </td><td class="desc">{{udp__REQUISPAR}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Transmission: </td><td class="desc">{{udp__TRANSMISSION}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Statut élément de donnée:</td><td class="desc">{{udp__STATUTELEMENTDEDONNEE}}</td></tr>'
    TEMPLATE += '</table>'

    TEMPLATE_CN = TEMPLATE 


    TEMPLATE = '<table class="ficha" cellpadding="3">'
    TEMPLATE += '<tr class="azul"><td class="negro">Nom de l\'élément de donnée: </td><td>{{code}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro"> Nom de la vue de l\'élément de donnée:</td><td>{{concept__model}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Description: </td><td class="desc">{{description}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Statut élément de donnée:</td><td class="desc">{{udp__STATUTELEMENTDEDONNEE}}</td></tr>'
    TEMPLATE += '</table>'

    TEMPLATE_DEFAULT = TEMPLATE 

    TEMPLATE = '<table class="ficha" cellpadding="3">'
    TEMPLATE += '<tr class="azul"><td class="negro">Nom de l\'élément de donnée: </td><td>{{code}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro"> Nom de la vue de l\'élément de donnée:</td><td>{{concept__model}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Description: </td><td class="desc">{{description}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Statut élément de donnée:</td><td class="desc">{{udp__STATUTELEMENTDEDONNEE}}</td></tr>'
    TEMPLATE += '</table>'

    TEMPLATE_ATELEM = TEMPLATE
    
    protoExt[ 'protoSheets' ] =  {        
          'DEFAULT' : {                        
              'title'   : "Fiche descriptive de l'élément de donnée",                        
              'template': TEMPLATE_DEFAULT  
              },
          'AT' : {                        
              'title'   : "Fiche descriptive de l'élément de donnée - AT",                        
              'template': TEMPLATE_ATELEM
              },
          'CN' : {                        
              'title'   : "Fiche descriptive de l'élément de donnée - Cadre Normatif",                        
              'template': TEMPLATE_CN  
              }
            } 


    # Fix: Permitira implementar el list_filter de admin
    # Los tipos podran ser 'ABC' para alfabetico, 'Date', ''   
    # ie.   [{ 'field' : 'code', 'type' : 'ABC' }]
    protoExt['filterSetABC'] = ['code'] 
    


#    protoExt['protoForm'] =  [{
#            "fsLayout": "2col",
#            "__ptType": "fieldset",
#            "title": "Fiche descriptive de l'élement de données",
#            "items": [
#                {
#                    "fieldLabel": "Nom",
#                    "name": "code",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "concept__model",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "udp__DOCUMENTDEREFERENCE",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "alias",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "baseType",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "prpLength",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "udp__GABARIT",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "isNullable",
#                    "__ptType": "formField"
#                }
#            ]
#        },
#        {
#            "collapsible": False,
#            "title": "",
#            "collapsed": False,
#            "fsLayout": "1col",
#            "__ptType": "fieldset",
#            "items": [
#                {
#                    "name": "udp__DEFINITION",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "udp__DESCRIPTIONCN",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "udp__PRECISIONS",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "udp__DOMAINEDEVALEURS",
#                    "__ptType": "formField"
#                }
#            ]
#        },
#        {
#            "fsLayout": "2col",
#            "__ptType": "fieldset",
#            "title": "Validations",
#            "items": [
#                {
#                    "name": "udp__VALIDATIONSSURELEMENT",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "udp__VALIDATIONSINTERELEMENT",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "udp__VALIDATION_INTER-ENREGISTREMENT",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "udp__VALIDATION",
#                    "__ptType": "formField"
#                }
#            ]
#        },
#        {
#            "fsLayout": "1col",
#            "__ptType": "fieldset",
#            "items": [
#                {
#                    "name": "udp__SOURCEDEDONNEESEXTERNES",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "udp__ELEMENTTRANSFORME",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "udp__ELEMENTTRANSMIS",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "udp__ENTREEENVIGUEUR",
#                    "__ptType": "formField"
#                }
#            ]
#        },
#        {
#            "fsLayout": "1col",
#            "__ptType": "fieldset",
#            "items": [
#                {
#                    "name": "udp__REQUISPAR",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "udp__TRANSMISSION",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "udp__STATUTELEMENTDEDONNEE",
#                    "__ptType": "formField"
#                },
#                {
#                    "name": "udp__DATEDERNIREMODIFICATION",
#                    "__ptType": "formField"
#                }
#            ]
#        }
#    ]
    
    
    

#    La definicion de la forma  tiene la siguiente interface 
#    objeto  ( o array de objetos ) 
#        - __ptType 
#        - __ptConfig 
#        - items u objetos 




#{
#    "protoOption": "protoExt.Property",
#    "protoMenuIx": "",
#    "shortTitle": "Éléments de données",
#    "protoConcept": "protoExt.Property",
#    "protoIcon": "icon-property",
#    "protoMenuOpt": "",
#    "helpPath": "",
#    "idProperty": "id",
#    "description": "Éléments de données",
#    "gridConfig": {
#        "hideRowNumbers": false,
#        "searchFields": [
#            "code",
#            "concept__model"
#        ],
#        "baseFilter": {
#            "isForeign": false
#        },
#        "listDisplay": [
#            "code",
#            "concept__model"
#        ],
#        "hiddenFields": [
#            "id"
#        ],
#        "filterSetABC": [
#            {
#                "__ptType": "filterSetABC"
#            }
#        ],
#        "filtersSet": [],
#        "readOnlyFields": [],
#        "sortFields": [
#            "code",
#            "concept__model"
#        ],
#        "initialSort": [
#            {
#                "direction": "ASC",
#                "property": "code",
#                "root": "data",
#                "transform": null,
#                "sort": null
#            },
#            {
#                "direction": "ASC",
#                "property": "concept__model",
#                "root": "data",
#                "transform": null,
#                "sort": null
#            }
#        ],
#        "initialFilter": {}
#    },
#    "sheetConfig": {
#        "protoSheetSelector": "concept__model__category",
#        "protoSheets": {
#            "protoSheet": {
#                "template": "<table class='ficha" cellpadding="3">Nom de l'élément de donnée: {{code}} Nom de la vue de l'élément de donnée:{{concept__model}} Document de référence: {{udp__DOCUMENTDEREFERENCE}}Numéro de l'élément de donnée au CN: {{alias}}Type de donnée: {{baseType}}Longueur: {{prpLength}}Gabarit: {{udp__GABARIT}}Définition: {{udp__DEFINITION}}Description: {{udp__DESCRIPTIONCN}}Précisions: {{udp__PRECISIONS}}Validations sur l'élément: {{udp__VALIDATIONSSURELEMENT}}Validations inter-éléments: {{udp__VALIDATIONSINTERELEMENT}}Validation inter-enregistrement: {{udp__VALIDATION_INTER-ENREGISTREMENT}}Source de données externes: {{udp__SOURCEDEDONNEESEXTERNES}}Élément transformé: {{udp__ELEMENTTRANSFORME}}Élément transmis: {{udp__ELEMENTTRANSMIS}}Domaine de valeurs: {{udp__DOMAINEDEVALEURS}}Entrée en vigueur: {{udp__ENTREEENVIGUEUR}}Date de la dernière modification: {{udp__DATEDERNIREMODIFICATION}}Valeur nulle possible (oui,non){{isNullable}}Validation: {{udp__VALIDATION}}Requis par: {{udp__REQUISPAR}}Transmission: {{udp__TRANSMISSION}}Statut élément de donnée:{{udp__STATUTELEMENTDEDONNEE}}",
#                "title": "Fiche descriptive de l'élément de donnée - Cadre Normatif"
#            }
#        },
#        "protoSheetProperties": [
#            "code",
#            "concept__model",
#            "isNullable",
#            "alias",
#            "baseType",
#            "prpLength",
#            "description",
#            "udp__DOCUMENTDEREFERENCE",
#            "udp__GABARIT",
#            "udp__DEFINITION",
#            "udp__DESCRIPTIONCN",
#            "udp__PRECISIONS",
#            "udp__VALIDATION",
#            "udp__VALIDATIONSSURELEMENT",
#            "udp__VALIDATIONSINTERELEMENT",
#            "udp__VALIDATION_INTER-ENREGISTREMENT",
#            "udp__SOURCEDEDONNEESEXTERNES",
#            "udp__ELEMENTTRANSFORME",
#            "udp__ELEMENTTRANSMIS",
#            "udp__DOMAINEDEVALEURS",
#            "udp__ENTREEENVIGUEUR",
#            "udp__DATEDERNIREMODIFICATION",
#            "udp__REQUISPAR",
#            "udp__TRANSMISSION",
#            "udp__STATUTELEMENTDEDONNEE"
#        ]
#    },
#    "fields": [
#        {
#            "flex": 1,
#            "fieldLabel": "Property",
#            "name": "code",
#            "header": "Éléments de données",
#            "tooltip": "Codigo o Identificador principal del objeto",
#            "minWidth": 200,
#            "width": 200,
#            "fromModel": true,
#            "type": "string",
#            "allowBlank": false
#        },
#        {
#            "flex": 1,
#            "name": "__str__",
#            "fkId": "id",
#            "zoomModel": "protoExt.Property",
#            "cellLink": true,
#            "header": "ÉLéMents De DonnéEs",
#            "readOnly": true,
#            "type": "string",
#            "allowBlank": true
#        },
#        {
#            "header": "VueId",
#            "readOnly": true,
#            "type": "string",
#            "name": "concept__model_id"
#        },
#        {
#            "type": "string",
#            "fieldLabel": "Definition",
#            "name": "udp__DEFINITION",
#            "header": "udp__DEFINITION"
#        },
#        {
#            "type": "string",
#            "fieldLabel": "Elto transforme",
#            "name": "udp__ELEMENTTRANSFORME",
#            "header": "udp__ELEMENTTRANSFORME"
#        },
#        {
#            "type": "string",
#            "readOnly": true,
#            "fieldLabel": "Category",
#            "name": "concept__model__category",
#            "header": "concept__model__category"
#        },
#        {
#            "type": "string",
#            "fieldLabel": "Doc Reference",
#            "name": "udp__DOCUMENTDEREFERENCE",
#            "header": "udp__DOCUMENTDEREFERENCE"
#        },
#        {
#            "type": "string",
#            "fieldLabel": "Source Donnes",
#            "name": "udp__SOURCEDEDONNEESEXTERNES",
#            "header": "udp__SOURCEDEDONNEESEXTERNES"
#        },
#        {
#            "fieldLabel": "Type",
#            "type": "string",
#            "name": "baseType",
#            "fromModel": true,
#            "header": "Type de Base"
#        },
#        {
#            "type": "string",
#            "fieldLabel": "Precision",
#            "name": "udp__PRECISIONS",
#            "header": "udp__PRECISIONS"
#        },
#        {
#            "header": "Is null",
#            "type": "bool",
#            "name": "isNullable",
#            "fromModel": true
#        },
#        {
#            "storeOnly": true,
#            "flex": 1,
#            "fieldLabel": "Entity",
#            "name": "concept__code",
#            "minWidth": 200,
#            "header": "Concept",
#            "readOnly": true,
#            "type": "string"
#        },
#        {
#            "type": "string",
#            "fieldLabel": "Elto Transmis",
#            "name": "udp__ELEMENTTRANSMIS",
#            "header": "udp__ELEMENTTRANSMIS"
#        },
#        {
#            "zoomModel": "protoExt.Model",
#            "name": "concept__model",
#            "fkId": "concept__model_id",
#            "flex": 1,
#            "cellLink": true,
#            "minWidth": 200,
#            "header": "Vue",
#            "readOnly": true,
#            "type": "string"
#        },
#        {
#            "storeOnly": true,
#            "flex": 1,
#            "vType": "plainText",
#            "name": "description",
#            "header": "Description",
#            "fromModel": true,
#            "type": "text"
#        },
#        {
#            "type": "string",
#            "fieldLabel": "Rquis par",
#            "name": "udp__REQUISPAR",
#            "header": "udp__REQUISPAR"
#        },
#        {
#            "type": "string",
#            "fieldLabel": "Validation Elto",
#            "name": "udp__VALIDATIONSSURELEMENT",
#            "header": "udp__VALIDATIONSSURELEMENT"
#        },
#        {
#            "fieldLabel": "Is Required",
#            "type": "bool",
#            "name": "isRequired",
#            "fromModel": true,
#            "header": "isRequired"
#        },
#        {
#            "fieldLabel": "Dt derniere modif",
#            "type": "date",
#            "name": "udp__DATEDERNIREMODIFICATION",
#            "header": "udp__DATEDERNIREMODIFICATION"
#        },
#        {
#            "fieldLabel": "Gabarit",
#            "header": "udp__GABARIT",
#            "type": "combo",
#            "name": "udp__GABARIT"
#        },
#        {
#            "type": "string",
#            "fieldLabel": "Statut élément de donnée",
#            "name": "udp__STATUTELEMENTDEDONNEE",
#            "header": "udp__STATUTELEMENTDEDONNEE"
#        },
#        {
#            "fieldLabel": "Length",
#            "type": "decimal",
#            "name": "prpLength",
#            "fromModel": true,
#            "header": "prpLength"
#        },
#        {
#            "type": "string",
#            "fieldLabel": "Entree en viguer",
#            "name": "udp__ENTREEENVIGUEUR",
#            "header": "udp__ENTREEENVIGUEUR"
#        },
#        {
#            "type": "string",
#            "fieldLabel": "Validation",
#            "name": "udp__VALIDATION",
#            "header": "udp__VALIDATION"
#        },
#        {
#            "type": "string",
#            "fieldLabel": "Description CN",
#            "name": "udp__DESCRIPTIONCN",
#            "header": "udp__DESCRIPTIONCN"
#        },
#        {
#            "type": "string",
#            "fieldLabel": "Validation Entt",
#            "name": "udp__VALIDATION_INTER-ENREGISTREMENT",
#            "header": "udp__VALIDATION_INTER-ENREGISTREMENT"
#        },
#        {
#            "type": "string",
#            "fieldLabel": "Validation Reg",
#            "name": "udp__VALIDATIONSINTERELEMENT",
#            "header": "udp__VALIDATIONSINTERELEMENT"
#        },
#        {
#            "type": "string",
#            "fieldLabel": "Domain Valuers",
#            "name": "udp__DOMAINEDEVALEURS",
#            "header": "udp__DOMAINEDEVALEURS"
#        },
#        {
#            "fieldLabel": "Alias",
#            "type": "string",
#            "name": "alias",
#            "fromModel": true,
#            "header": "Alias"
#        },
#        {
#            "type": "string",
#            "fieldLabel": "Transmission",
#            "name": "udp__TRANSMISSION",
#            "header": "udp__TRANSMISSION"
#        }
#    ],
#    "protoUdp": {
#        "propertyPrefix": "udp",
#        "propertyName": "code",
#        "udpTable": "udp",
#        "propertyValue": "valueUdp"
#    },
#    "protoDetails": [
#        {
#            "menuText": "UDPs ",
#            "conceptDetail": "protoExt.Udp",
#            "detailField": "metaObj__pk",
#            "masterField": "pk"
#        }
#    ],
#}