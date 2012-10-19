from models import *
from django.contrib  import admin           

class CompositionImageline(admin.TabularInline):
    model = CompositionImage
    fk_name = 'image'
    extra = 1
    readonly_fields = ('typeLogiciel', 'famille')
    fields = ('logiciel', 'commentaire', 'typeLogiciel', 'famille')

class DiscussionImageInline(admin.TabularInline):
    model = DiscussionImage
    fk_name = 'image'
    extra = 1


class ImageAdmin(admin.ModelAdmin):
    list_display = ('nom', 'description', )
    verbose_name_plural = 'Fiche Image'

    fieldsets = [
        (None, 
            {'fields': [('nom', 'description', ),]
             }),
                 ]
    inlines = [
        CompositionImageline,
        DiscussionImageInline, 
        ]

    protoExt = {}
