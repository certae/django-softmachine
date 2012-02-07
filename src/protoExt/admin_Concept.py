# -*- coding: utf-8 -*-
from models import *

import django.contrib.admin          
 
class PropertyInline(django.contrib.admin.TabularInline):
    model = Property 
    fk_name = 'concept'
    extra = 1
    fields = ('code', 'description', 'baseType')

class RelationshipInline(django.contrib.admin.TabularInline):
    model = Relationship 
    fk_name = 'concept'
    extra = 1
    fields = ('code', 'description',  'baseConcept')


class Concept_Admin(django.contrib.admin.ModelAdmin):
    list_display =( 'model', 'code',  'description',  'superConcept', )
    list_filter = ( 'model', 'superConcept', )
    search_fields = ( 'code', 'description',  'superConcept')

    fieldsets = (
        (None, {
            'fields': [('code', 'description', 'superConcept', 'model')]
        }),
    )
    inlines = [
        UpdInline,
        PropertyInline,
        RelationshipInline,
        ]
    

    protoExt = {'protoIcon': 'concept', }
    protoExt[ 'title' ] = 'Éntite'
    protoExt[ 'description' ] = 'Concept, Table, Entity'
    protoExt[ 'menu_index' ] = 1
    
#Definir cual debe llamar a las tablas superiores     
    protoExt[ 'searchFields' ] = ( 'code', 'model__code' ) 
    protoExt[ 'sortFields' ] = ( 'model__code', 'code',  ) 

    protoExt[ 'initialSort' ] = ( 'model__code', 'code',  ) 

    
    # El concept detail es el nmbre del modelo con su app de base [app].[modelo]
    protoExt[ 'protoDetails' ] = [
        {'menuText': 'Éléments de Données', 'conceptDetail': 'protoExt.Property', 'detailField': 'concept__pk', 'masterField': 'pk'}, 
        {'menuText': 'Associations', 'conceptDetail': 'protoExt.Relationship', 'detailField': 'concept__pk', 'masterField': 'pk'}, 
        ]

    # Define la apariencia de los campos en la grilla,  
    # model__code es un campo proveniente de un FK, ( absorbido, join ) 
    # upd__format es un campo proveniente de una propiedad personalizada ( UDP )  
    protoExt[ 'protoFields' ] =  {        
          'code': {'header' : 'Nom Éntite', 'type': 'CharField' , 'width': 200 },
          'model__code': {'header' : 'Vue', 'type': 'CharField' , 'width': 200 },  
          'description': { 'wordWrap': True, 'minWidth': 200, 'flex': 1 },
     }


    protoExt['protoViews'] = [
            { 'viewName': 'default', 
              'viewFields': ( 'model__code', 'code',  'description',  'udp__format', 'udp__gabarit'  )},
            { 'viewName': 'resume', 
              'viewFields': ( 'model__code', 'code',  )},
                                ]

    protoExt['protoFilters'] = []
    for nFiltre in ['A','B','C','D','E','É','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']:
    
        protoExt['protoFilters'].append ( 
                { 'filterName': nFiltre, 
                  'filter': { 'code__istartswith': nFiltre }, 
#                 'icon' : 'icon-?'
                  }
        ) 

    
