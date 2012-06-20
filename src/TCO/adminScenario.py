from models import *
from django.contrib  import admin

class SIOInline(admin.TabularInline):
    model = SIO
    fk_name = 'organisation'
    extra = 1

class OrganisationAdmin(admin.ModelAdmin):
    list_display = ('nom', 'description', )
    verbose_name_plural = 'Fiche Organisation'

    fieldsets = [
        (None, 
            {'fields': [('nom', 'description', ),]
             }),
                 ]
    inlines = [
        SIOInline,
        ]
