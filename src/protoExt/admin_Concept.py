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
    protoExt[ 'protoDetails' ] = [
        {'menuText': 'Elements De Donnees', 'conceptDetail': 'protoExt.Property', 'detailField': 'concept__pk', 'masterField': 'pk'}, 
        {'menuText': 'Associations', 'conceptDetail': 'protoExt.Relationship', 'detailField': 'concept__pk', 'masterField': 'pk'}, 
        {'menuText': 'Udp', 'conceptDetail': 'protoExt.Udp', 'detailField': 'metaObj__pk', 'masterField': 'pk'}, 
        ]
    