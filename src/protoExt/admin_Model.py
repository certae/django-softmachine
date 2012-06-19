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
    

    
    protoExt = {'protoIcon' : 'model',  }

#   Esta es la lista de cmapos visibles en la grilla      
    protoExt[ 'listDisplay' ] = ( 'code',  'category', 
        'udp__Descriptionmodele', 
        )
    
    protoExt[ 'excludeFields' ] = ( 'description', )           
    protoExt[ 'searchFields' ] = ( 'code',  ) 
    protoExt[ 'sortFields' ] = ( 'code',  ) 
    protoExt[ 'initialSort' ] = ( 'code', ) 
    protoExt[ 'title' ] = 'Vues'



#   -------------------------------------------------------------------------------------------------

    protoExt[ 'protoUdp' ] =   { 
        'udpTable': 'udp', 
        'propertyName': 'code', 
        'propertyValue': 'valueUdp', 
        'propertyPrefix' : 'udp',           # Las referencias a los campos estaran precedidas por [prefix]__
         }


    
    protoExt[ 'protoDetails' ] = [
        {'menuText': 'Entite', 
         'conceptDetail': 'protoExt.Concept', 
         'detailField': 'model__pk', 
         'masterField': 'pk',
         'detailTitleLbl': 'Vue :',
         'detailTitlePattern': 'code'}, 
        {'menuText': 'Éléments de Données', 
         'conceptDetail': 'protoExt.property', 
         'detailField': 'concept__model__pk', 
         'masterField': 'pk', 
         'detailTitleLbl': ' ',
         'detailTitlePattern': 'code'}, 
         {'menuText': 'UDPs ', 
          'conceptDetail': 'protoExt.Udp', 
          'detailField': 'metaObj__pk', 
          'masterField': 'pk'}, 
        ]

#   Estos son todos los campos de mi modelo ( store ) 
    protoExt[ 'protoFields' ] =  {        
        'code': {'header' : 'Vues', 'type': 'CharField' ,  'width': 200, 'flex': 1 },  
        'udp__Descriptionmodele': { 'header' : 'Description Modele', 'type': 'text' , 'vType': 'htmlText' , 'flex': 2 },
        'udp__ActeurPrincipal': { 'header' : 'Acteur Princ', 'type': 'text', 'wordWrap': True , 'flex': 1  },
        'udp__AutresActeurs': { 'header' : 'Autres acteurs', 'type': 'text', 'cellToolTip' : True , 'flex': 1  },
        'udp__IntrantsDeclencheurs': { 'header' : 'Intrants Declan', 'type': 'text' , 'wordWrap': True , 'flex': 1 },

        'udp__Auteurmodele' : { 'header' : 'Auteur' , 'flex': 1 },
        'udp__Version': { 'header' : 'Version' , 'flex': 1 },

        'udp__Categorie':     { 'header' : 'Catégorie' , 'flex': 1 },
        'udp__Souscategorie': { 'header' : 'Sous-Catégorie' , 'flex': 1 },
     }


#     ------------------------------------------------------------------------------------

    TEMPLATE = '<table class="ficha" cellpadding="3">'
    TEMPLATE += '<tr class="azul"><td class="negro">Nom de la vue: </td><td>{{code}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Catégorie: </td><td>{{udp__Categorie}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Sous-Catégorie:</td><td>{{udp__Souscategorie}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Auteur de la vue:</td><td>{{udp__Auteurmodele}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Version de la vue: </td><td>{{udp__Version}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Description: </td><td class="desc">{{udp__Descriptionmodele}}</td></tr>'
    
    TEMPLATE += '<tr class="azul"><td class="negro">Acteur principal: </td><td>{{udp__ActeurPrincipal}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Autres acteurs: </td><td>{{udp__AutresActeurs}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Intrants declencheurs: </td><td>{{udp__IntrantsDeclencheurs}}</td></tr>'
    TEMPLATE += '</table>'
    
    TEMPLATE_AT = TEMPLATE
    
    TEMPLATE = '<table class="ficha" cellpadding="3">'
    TEMPLATE += '<tr class="azul"><td class="negro">Nom de la vue: </td><td>{{code}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Catégorie: </td><td>{{udp__Categorie}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Sous-Catégorie:</td><td>{{udp__Souscategorie}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Auteur de la vue:</td><td>{{udp__Auteurmodele}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Version de la vue: </td><td>{{udp__Version}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Description: </td><td class="desc">{{udp__Descriptionmodele}}</td></tr>'
    TEMPLATE += '</table>'
    
    TEMPLATE_corporative = TEMPLATE
    
    TEMPLATE = '<table class="ficha" cellpadding="3">'
    TEMPLATE += '<tr class="azul"><td class="negro">Nom de la vue: </td><td>{{code}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Catégorie: </td><td>{{udp__Categorie}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Sous-Catégorie:</td><td>{{udp__Souscategorie}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Auteur de la vue:</td><td>{{udp__Auteurmodele}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Version de la vue: </td><td>{{udp__Version}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Description: </td><td class="desc">{{udp__Descriptionmodele}}</td></tr>'
    TEMPLATE += '</table>'
    
    TEMPLATE_locale = TEMPLATE    

    protoExt[ 'protoSheetProperties' ] = (   'code',
                            'udp__Categorie',
                            'udp__Souscategorie',
                            'udp__Auteurmodele',
                            'udp__Version',
                            'udp__Descriptionmodele',
                            'udp__ActeurPrincipal', 
                            'udp__AutresActeurs',
                            'udp__IntrantsDeclencheurs',
                            )

    protoExt[ 'protoSheetSelector' ] = 'udp__Categorie'
    protoExt[ 'protoSheets' ] =  {        
          'DEFAULT' : {                        
              'title'   : "Fiche descriptive des vues corporatives",                        
              'template': TEMPLATE_corporative  
              },
          'AT' : {                        
              'title'   : "Fiche descriptive des actions terraines",                        
              'template': TEMPLATE_AT  
              },
          'locale' : {                        
              'title'   : "Fiche descriptive des vues locales",                         
              'template': TEMPLATE_locale  
              }
            } 
     

#     -------------------------------------------------------------------------------------------------

    protoExt['filtersSet'] = []
    protoExt['filtersSet'].append ( 
                { 'name': 'Vue AT', 
                  'filter': { 'code__istartswith': 'AT'}, 
                  }
        ) 

    protoExt['filtersSet'].append ( 
                { 'name': 'Vue corportative', 
                  'filter': { 'code__istartswith': 'Vue Corporative'}, 
                  }
        ) 

    protoExt['filtersSet'].append ( 
                { 'name': 'Vue locale', 
                  'filter': { 'code__istartswith': 'Vue locale'}, 
                  }
        ) 

    protoExt['filtersSet'].append ( 
                { 'name': ' Tous ', 
                  'filter': {}, 
                  }
        ) 
