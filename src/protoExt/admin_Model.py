# -*- coding: utf-8 -*-

from models import *

import django.contrib.admin          
 
class ConceptInline(django.contrib.admin.TabularInline):
    model = Concept 
    fk_name = 'model'
    extra = 1
    fields = ('code', 'description')


class Model_Admin(django.contrib.admin.ModelAdmin):
    verbose_name_plural = 'Modeles' 
    list_display =(  'code', 'description')
    list_filter =(  'code', 'description', )
    search_fields =('code', 'description', )
    
    fieldsets = (
        (None, {
            'fields': [('code', 'description')]
        }),
    )
    inlines = [
        ConceptInline,
        ]
    
    protoExt = {'protoIcon' : 'model',  }
    protoExt[ 'searchFields' ] = ( 'code', 'description' ) 
    protoExt[ 'sortFields' ] = ( 'code', 'description' ) 
    
    
    protoExt[ 'protoDetails' ] = [
#       {'menuText': 'Entite', 'conceptDetail': 'protoExt.Concept', 'detailField': 'model__pk', 'masterField': 'pk'},
        {'menuText': 'Éléments des Données', 'conceptDetail': 'protoExt.property', 'detailField': 'concept__model__pk', 'masterField': 'pk'}, 
        ]

    protoExt[ 'protoFields' ] =  {        
          'code': {'header' : 'Vues', 'type': 'CharField' ,  'width': 300 },  
     }

    protoExt[ 'searchFields' ] =  ( 'code', 'description' )        

