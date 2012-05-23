# -*- coding: utf-8 -*-
import django.contrib.admin          

class PropertyAdmin(django.contrib.admin.ModelAdmin):
    verbose_name_plural = 'Éléments de données' 
    list_display =( 'code', 'category', 'concept')
    search_fields = ( 'code', 'category', 'concept' )

    protoExt = {'protoIcon': 'property' }
    protoExt[ 'title' ] = 'Éléments de données'
    protoExt[ 'listDisplay' ] = ( 'code', 'concept__model__code')

#   protoExt[ 'readOnlyFields' ] = ( 'code', 'concept__model__code' ) 

    protoExt[ 'searchFields' ] = ( 'code', 'concept__model__code' ) 
    protoExt[ 'sortFields' ] = ( 'code', 'concept__model__code' )
    protoExt[ 'baseFilter' ] = { 'isForeign': False  }
    
    # Valores iniciales ( initialFilter maneja el autoload )   
    protoExt[ 'initialSort' ] = ( 'code', 'concept__model__code', ) 
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
        'concept__model__code': {'header' : 'Vue',  'minWidth': 200 , 'flex': 1, 'fieldLabel' : 'Vue', 'cellLink' : True },  
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
        'udp__DEFINITION': { 'fieldLabel' : 'Definition'  },
        'udp__PRECISIONS': { 'fieldLabel' : 'Precision' },
        'udp__VALIDATION': { 'fieldLabel' : 'Validation'  },
        'udp__VALIDATIONSSURELEMENT': { 'fieldLabel' : 'Validation Elto'  },
        'udp__VALIDATIONSINTERELEMENT': { 'fieldLabel' : 'Validation Reg'   },
        'udp__VALIDATION_INTER-ENREGISTREMENT': { 'fieldLabel' : 'Validation Entt'   },
        'udp__SOURCEDEDONNEESEXTERNES': { 'fieldLabel' : 'Source Donnes'  },
        'udp__ELEMENTTRANSFORME': { 'fieldLabel' : 'Elto transforme'  },
        'udp__ELEMENTTRANSMIS': { 'fieldLabel' : 'Elto Transmis'  },
        'udp__DOMAINEDEVALEURS': { 'fieldLabel' : 'Domain Valuers' },
        'udp__ENTREEENVIGUEUR': { 'fieldLabel' : 'Entree en viguer'  },
        'udp__DATEDERNIREMODIFICATION': { 'fieldLabel' : 'Dt derniere modif' , 'type' : 'date' },
        'udp__REQUISPAR': { 'fieldLabel' : 'Rquis par'  },
        'udp__TRANSMISSION': { 'fieldLabel' : 'Transmission'  },
        'udp__DESCRIPTIONCN': { 'fieldLabel' : 'Description CN'  }, 
        'udp__STATUTELEMENTDEDONNEE': { 'fieldLabel' : 'Statut élément de donnée'  }, 
     }

#    Al momento de cargar la finca verifico el campo @criteriaField@ y lo busco en las diferentes fichas, 
#    la ficha 'DEFAULT' se usa si no hay otra definicion, el campo de criterio se define aparte  

    protoExt[ 'protoSheetSelector' ] = 'concept__model__category'
    protoExt[ 'protoSheetProperties' ] = (   'code',
                            'concept__model__code',
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
    TEMPLATE += '<tr class="blanco"><td class="negro"> Nom de la vue de l\'élément de donnée:</td><td>{{concept__model__code}}</td></tr>'
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
    TEMPLATE += '<tr class="blanco"><td class="negro"> Nom de la vue de l\'élément de donnée:</td><td>{{concept__model__code}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Description: </td><td class="desc">{{description}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Statut élément de donnée:</td><td class="desc">{{udp__STATUTELEMENTDEDONNEE}}</td></tr>'
    TEMPLATE += '</table>'

    TEMPLATE_DEFAULT = TEMPLATE 

    TEMPLATE = '<table class="ficha" cellpadding="3">'
    TEMPLATE += '<tr class="azul"><td class="negro">Nom de l\'élément de donnée: </td><td>{{code}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro"> Nom de la vue de l\'élément de donnée:</td><td>{{concept__model__code}}</td></tr>'
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

#    protoExt['listDisplaySet'] = [
#            { 'viewName': 'default', 
#              'viewFields': (  'code', 'concept__model__code',  ), 
#              'icon' : 'icon-1'},
#            { 'viewName': 'all', 
#              'viewFields': ( 'code', 'concept__code', 'concept__model__code' )},
#                        ]


    protoExt['filtersSet'] = []
    for nFiltre in ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']:
    
        protoExt['filtersSet'].append ( 
                { 'filterName': nFiltre, 
                  'filter': { 'code__istartswith': nFiltre }, 
#                 'icon' : 'icon-?'
                  }
        ) 

    protoExt['filtersSet'].append ( 
                { 'filterName': ' Tous ', 
                  'filter': {}, 
                  }
        ) 

    protoExt['protoForm'] = [{
          "style" : 'VBox',
          "labelWidth" : 200,
          "items": [ 
              {"title" : 'Basicas ',
                   "style" : 'Section',
                    "collapsible" : False,
                    "formFields" : [
                                 "code", 
                                 "baseType", "isNullable" , 
                                 "alias", "prpLength", 
                                 "description",
                        ]
               },
              {"title" : 'Hierarchie ',
                   "style" : 'Section',
                    "collapsible" : True,
                    "formFields" : [ 
                                "concept", 
                                "concept__code", 
                                "concept__model__code", 
                                "concept__model__category" , 
                        ]
                    },
              {"title" : 'Udps ',
                   "style" : 'Section',
                    "collapsible" : True,
                    "formFields" : [ 
                        "udp__DATEDERNIREMODIFICATION", 
                        "udp__DESCRIPTIONCN",
                        "udp__DOCUMENTDEREFERENCE",
                        "udp__DOMAINEDEVALEURS",
                        "udp__ELEMENTTRANSMIS",
                        "udp__ENTREEENVIGUEUR",
                        "udp__GABARIT",
                        "udp__PRECISIONS",
                        "udp__REQUISPAR",
                        "udp__SOURCEDEDONNEESEXTERNES",
                        "udp__TRANSMISSION",
                        "udp__VALIDATION",
                        "udp__VALIDATION_INTER-ENREGISTREMENT",
                        "udp__VALIDATIONSINTERELEMENT",
                        "udp__VALIDATIONSSURELEMENT",
                        "udp__DEFINITION",
                        "udp__ELEMENTTRANSFORME",
                        ]
                    }
                  ]
              }] 
                    
