from models import *

import django.contrib.admin          
 
class ConceptInline(django.contrib.admin.TabularInline):
    model = Concept 
    fk_name = 'model'
    extra = 1
    fields = ('code', 'description',  'superConcept')


fdsModel= ( 'code', 'category', 'description',  'modelPrefix', 'superModel', 'alias', 'physicalName' )
intModel= ( 'idModel', 'idRef' )

class Model_Admin(django.contrib.admin.ModelAdmin):
    app_name = 'Dictionnaire de donnees'
    verbose_name_plural = 'Modeles' 
    list_display =(  'code', 'description','superModel', 'domain', 'physicalName')
    list_filter =(  'domain', 'superModel', )
    search_fields =('code', 'description', 'superModel', 'physicalName' )
    
    fieldsets = (
        (None, {
            'fields': [('code', 'description', 'domain')]
        }),
    )
    inlines = [
        ConceptInline,
        ]
    
    protoExt = {}
    protoExt[ 'protoDetails' ] = [
        {'menuText': 'Entite', 'conceptDetail': 'protoExt.Concept', 'detailField': 'model__pk', 'masterField': 'pk'},
        {'menuText': 'Udp', 'conceptDetail': 'protoExt.Udp', 'detailField': 'metaObj__pk', 'masterField': 'pk'}, 
        ]

