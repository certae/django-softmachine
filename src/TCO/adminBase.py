from models import *
from django.contrib  import admin           


class ReferenceAdmin(admin.ModelAdmin):
    list_display = ('etiquette', 'description',)
    fieldsets = [
        (None, 
            {'fields': [('etiquette', 'description', ),
                        ('enregistrementBibTex')
                        ]
             }),
                 ]
    app_name = 'Base'

class FamilleAdmin(admin.ModelAdmin):
    app_name = 'Base'

class TypeLogicielAdmin(admin.ModelAdmin):
    app_name = 'Base'

class NiveauAdmin(admin.ModelAdmin):
    app_name = 'Base'
