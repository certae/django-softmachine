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
    

    protoExt = {}
    protoExt[ 'description' ] = 'Esta es la description del concpeto concepto'
    protoExt[ 'menu_index' ] = 0
    
    # El concept detail es el nmbre del modelo con su app de base [app].[modelo]
    protoExt[ 'protoDetails' ] = [
        {'menuText': 'Elements De Donnees', 'conceptDetail': 'protoExt.Property', 'detailField': 'concept__pk', 'masterField': 'pk'}, 
        {'menuText': 'Associations', 'conceptDetail': 'protoExt.Relationship', 'detailField': 'concept__pk', 'masterField': 'pk'}, 
        {'menuText': 'Udp', 'conceptDetail': 'protoExt.Udp', 'detailField': 'metaObj__pk', 'masterField': 'pk'}, 
        ]

    # Define la apariencia de los campos en la grilla,  
    # model__code es un campo proveniente de un FK, ( absorbido, join ) 
    # upd__format es un campo proveniente de una propiedad personalizada ( UDP )  
    protoExt[ 'protoFields' ] =  {        
          'code': {'header' : 'Concept', 'type': 'CharField' ,  'sortable' : True, 'filterable' : True, 'width': 300 },
          'model__code': {'header' : 'Model', 'type': 'CharField' ,  'sortable' : True, 'filterable' : True, 'width': 300 },  
            
          'udp__format': {'header' : 'Format', 'type': 'CharField' , 'width': 300 },  
          'udp__alias': {'header' : 'Alias', },  
     }

    protoExt['protoViews'] = [
            { 'viewName': 'default', 
              'viewFields': ( 'model__code', 'code',  'description',  'udp__format', 'udp__gabarit'  )},
            { 'viewName': 'resume', 
              'viewFields': ( 'model__code', 'code',  )},
                                ]
    
    TEMPLATE =  '<b>Fiche Techinique<b><br>' 
    TEMPLATE += 'Codigo: {{code}}<br>'
    TEMPLATE += 'Description {{description}}<br>'  
    TEMPLATE += 'Gabarit : {{udp_gabarit}}'
    
    protoExt[ 'protoSheet' ] =  {        
          'properties': ( 'code', 'description', 'udp__format', 'udp__gabarit' ),   
          'template': TEMPLATE }  
    
