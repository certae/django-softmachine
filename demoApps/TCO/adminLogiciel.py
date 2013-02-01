from models import *
from django.contrib  import admin           



class CoutAnnuelInline(admin.TabularInline):
    model = CoutAnnuel
    fk_name = 'logiciel'
    extra = 1


#class CoutAdheranceInline(admin.TabularInline):
#    model = CoutAdherance
#    fk_name = 'logiciel'
#    extra = 1
#    fields = ('logicielRef', 'niveau', 'coutEvolution', 'coutSubstitution')
#    
#
#    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
#        field = super(CoutAdheranceInline, self).formfield_for_foreignkey(db_field, request, **kwargs)
#
#        if db_field.name == 'logicielRef':
#            if request._obj_ is not None:
#                _famille = request._obj_.famille
#                field.queryset = Logiciel.objects.filter(famille = _famille ).exclude( pk = request._obj_.id )  
#            else:
#                field.queryset = field.queryset.none()
#        return field
    

class DiscussionLogicielInline(admin.TabularInline):
    model = DiscussionLogiciel
    fk_name = 'logiciel'
    extra = 1


class SourceslInline(admin.TabularInline):
#class SourceslInline(admin.StackedInline):
    model = Sources
    fk_name = 'logiciel'
    extra = 1
    readonly_fields = ('description',)
    fields = ('reference', 'description')



class LogicielAdmin(admin.ModelAdmin):
    verbose_name_plural = 'Fiche Logiciel'
    list_display = ('nom', 
                    'famille', 'typeLogiciel', 'editeur'
                    )
    fieldsets = [
        (None, 
            {'fields': [('nom', 
                         'famille','typeLogiciel' 
                         ),]
             }),
        ('Description', 
            {'fields': [('description',),
                        ('categorie','fonction','dureeCycle',),
                        ('nature','editeur','coutDeIntroduction' ),
                        ('commentaire',), 
                        ],
             'classes': ['collapse']
             }),
                 ]
    inlines = [
        CoutAnnuelInline,
#        CoutAdheranceInline,
        DiscussionLogicielInline, 
        SourceslInline, 
        # On peut voir les equivalences sur la fiche CoutAdhereance 
        #EquivalencesInline,
        ]

    protoExt = { 
        'protoFields' : {        
            'description': {},
            'description':{},
            'categorie': {},
            'fonction': {},
            'dureeCycle': {},
            'nature': {},
            'editeur': {},
            'coutDeIntroduction': {},
            'commentaire' : {}
            }
    }


    def get_form(self, request, obj=None, **kwargs):
        # just save obj reference for future processing in Inline
        request._obj_ = obj
        return super(LogicielAdmin, self).get_form(request, obj, **kwargs)

#    class Media:
#        js = ['js/collapsed_stacked_inlines.js',]
