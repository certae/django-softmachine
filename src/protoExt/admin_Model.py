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
    list_display =(  'code', 'description', 'category')
    list_filter =( 'code', 'description', 'category' )
    search_fields =('code', 'description', 'category' )
    
    fieldsets = (
        (None, {
            'fields': [('code', 'category'), 'description']
        }),
    )
    inlines = [
        ConceptInline,
        ]


    
    protoExt = {'protoIcon' : 'model',  }
    protoExt[ 'searchFields' ] = ( 'code', 'description' ) 
    protoExt[ 'sortFields' ] = ( 'code', 'description' ) 
    protoExt[ 'initialSort' ] = ( 'code', ) 
    protoExt[ 'title' ] = 'Vues'
    
    protoExt[ 'protoDetails' ] = [
#       {'menuText': 'Entite', 'conceptDetail': 'protoExt.Concept', 'detailField': 'model__pk', 'masterField': 'pk'},
        {'menuText': 'Éléments de Données', 'conceptDetail': 'protoExt.property', 'detailField': 'concept__model__pk', 'masterField': 'pk'}, 
        ]

    protoExt[ 'protoFields' ] =  {        
          'code': {'header' : 'Vues', 'type': 'CharField' ,  'width': 300 },  
          'description': { 'wordWrap': True },
          'category': {'storeOnly': True },
     }

    protoExt[ 'searchFields' ] =  ( 'code', 'description' )        

    protoExt['protoFilters'] = []
    for nFiltre in ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']:
    
        protoExt['protoFilters'].append ( 
                { 'filterName': nFiltre, 
                  'filter': { 'code__istartswith': nFiltre }, 
#                 'icon' : 'icon-?'
                  }
        ) 
