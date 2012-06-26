from models import *
from django.contrib  import admin           


class ReferenceAdmin(admin.ModelAdmin):
    list_display = ('etiquette', 'commentaire',)
    fieldsets = [
        (None, 
            {'fields': [('etiquette', 'commentaire', ),
                        ('enregistrementBibTex')
                        ]
             }),
                 ]
    protoExt = { 
                'protoMenuIx': 3, 
                'protoMenuOpt' : 'Base' 
    }
    

class FamilleAdmin(admin.ModelAdmin):
    protoExt = { 
                'protoMenuIx': 1, 
                'protoMenuOpt' : 'Param' 
    }


class TypeLogicielAdmin(admin.ModelAdmin):
    protoExt = { 
                'protoMenuIx': 2, 
                'protoMenuOpt' : 'Param' 
    }

class NiveauAdmin(admin.ModelAdmin):
    protoExt = { 
                'protoMenuIx': 3, 
                'protoMenuOpt' : 'Param' 
    }
