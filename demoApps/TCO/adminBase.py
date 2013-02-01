from models import *
from django.contrib  import admin           


class ReferenceAdmin(admin.ModelAdmin):
    list_display = ('etiquette', 'commentaire', 'enregistrementBibTex')
    fieldsets = [
        (None, 
            {'fields': [('etiquette', 'commentaire', ),
                        ('enregistrementBibTex')
                        ]
             }),
                 ]
    

class FamilleAdmin(admin.ModelAdmin):
    protoExt = {}


class TypeLogicielAdmin(admin.ModelAdmin):
    protoExt = {}

class NiveauAdmin(admin.ModelAdmin):
    protoExt = {}
