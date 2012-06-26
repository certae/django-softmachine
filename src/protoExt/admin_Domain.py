from models import *

import django.contrib.admin          


 
class ModelInline(django.contrib.admin.TabularInline):
    model = Model
    fk_name = 'domain'
    extra = 1
    fields =  ('code', 'description', 'superModel', 'domain')


class DomainAdmin(django.contrib.admin.ModelAdmin):
    list_display =( 'code', 'description', )
    fieldsets = (
        (None, {
            'fields': [('code', 'description','origin', 'superDomain',)]
        }),
    )
    inlines = [
        ModelInline,
        ]
    index = 0
