from models import *

import django.contrib.admin          
 
class ConceptInline(django.contrib.admin.TabularInline):
    model = Concept 
    fk_name = 'model'
    extra = 1
    fields = ('code', 'description',  'superConcept')


class Model_Admin(django.contrib.admin.ModelAdmin):
    app_name = 'Dictionnaire de donnees'
    verbose_name_plural = 'Modeles' 
    list_display =(  'code', 'description','superModel', 'physicalName')
    list_filter =(  'superModel', )
    search_fields =('code', 'description', 'superModel', 'physicalName' )
    
    fieldsets = (
        (None, {
            'fields': [('code', 'description', 'domain')]
        }),
    )
    inlines = [
        ConceptInline,
        ]
    
    protoExt = {'protoIcon' : 'model',  }
    protoExt[ 'searchFields' ] = ( 'code', 'domain_code' ) 
    protoExt[ 'sortFields' ] = ( 'code', 'domain_code' ) 
    
    
    protoExt[ 'protoDetails' ] = [
        {'menuText': 'Entite', 'conceptDetail': 'protoExt.Concept', 'detailField': 'model__pk', 'masterField': 'pk'},
        {'menuText': 'Udp', 'conceptDetail': 'protoExt.Udp', 'detailField': 'metaObj__pk', 'masterField': 'pk'}, 
        ]

    protoExt[ 'protoFields' ] =  {        
          'domain__code': {'header' : 'domain', 'type': 'CharField' ,  'width': 300 },  
     }

    protoExt[ 'searchFields' ] =  ( 'code', 'description', 'domain__code' )        

