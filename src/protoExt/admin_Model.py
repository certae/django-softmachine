# -*- coding: utf-8 -*-

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
    
#    fieldsets = (
#        (None, {
#            'fields': [('code', 'category', 'domain'),  ]
#        }),
#                        "udp__DescriptionModele",
#                        "udp__ActeurPrincipal",
#                        "udp__AutresActeurs",
#                        "udp__IntrantsDeclencheurs",
#    )
#    inlines = [
#        ConceptInline,
#        ]


    
    protoExt = {'protoIcon' : 'model',  }
    protoExt[ 'gridColumns' ] = ( 'code',  
        'udp__DescriptionModele', 
        'udp__ActeurPrincipal',
        'udp__AutresActeurs',
#        'udp__IntrantsDeclencheurs'
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
        {'menuText': 'Entite', 'conceptDetail': 'protoExt.Concept', 'detailField': 'model__pk', 'masterField': 'pk',
         'detailTitleLbl': 'Vue :',
         'detailTitlePattern': 'code'}, 
        {'menuText': 'Éléments de Données', 
         'conceptDetail': 'protoExt.property', 
         'detailField': 'concept__model__pk', 
         'masterField': 'pk', 
         'detailTitleLbl': ' ',
         'detailTitlePattern': 'code'}, 
        ]

    protoExt[ 'protoFields' ] =  {        
        'code': {'header' : 'Vues', 'type': 'CharField' ,  'width': 200, 'flex': 1 },  
        'category': {'storeOnly': True },

        'udp__DescriptionModele': { 'header' : 'Description Modele', 'type': 'text' ,  'flex': 2 },
        'udp__ActeurPrincipal': { 'header' : 'Acteur Princ', 'wordWrap': True , 'flex': 1  },
        'udp__AutresActeurs': { 'header' : 'Autres acteurs', 'cellToolTip' : True , 'flex': 1  },
        'udp__IntrantsDeclencheurs': { 'header' : 'Intrants Declan' , 'wordWrap': True , 'flex': 1 },
          
     }




#   -------------------------------------------------------------------------------------------------

    protoExt['protoFilters'] = []
    protoExt['protoFilters'].append ( 
                { 'filterName': 'AT', 
                  'filter': { 'code__istartswith': 'AT'}, 
                  }
        ) 

    protoExt['protoFilters'].append ( 
                { 'filterName': 'Vue corportative', 
                  'filter': { 'code__istartswith': 'Vue Corporative'}, 
                  }
        ) 

    protoExt['protoFilters'].append ( 
                { 'filterName': 'Vue locale', 
                  'filter': { 'code__istartswith': 'Vue locale'}, 
                  }
        ) 

    protoExt['protoFilters'].append ( 
                { 'filterName': ' Tous ', 
                  'filter': {}, 
                  }
        ) 
