'''
Created on 2011-08-25

@author: dario
'''


# class Equivalence(models.Model):
# ** Je crois q ce n'est pas necesaire, on a toute l'info dans cout d'adherence ==
#    logiciel = models.ForeignKey('Logiciel')
#    logicielRef = models.ForeignKey('Logiciel', related_name='+')
#    
#    def famille(self):
#        return self.logiciel.famille 
#    famille.admin_order_field = 'logiciel__famille'
#    
#    def __unicode__(self):
#        return force_unicode(self.logiciel) + '-' + force_unicode(self.logicielRef)
#    class Meta: 
#        unique_together= (("logiciel","logicielRef" ),)


# class EquivalencesInline(admin.TabularInline):
#    model = Equivalence
#    fk_name = 'logiciel'
#    extra = 1
# 
#    readonly_fields = ('famille',)
#    fields = ('logicielRef', 'famille')
#    
# 
#    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
#        field = super(EquivalencesInline, self).formfield_for_foreignkey(db_field, request, **kwargs)
# 
#        if db_field.name == 'logicielRef':
#            if request._obj_ is not None:
#                _famille = request._obj_.famille
#                field.queryset = Logiciel.objects.filter(famille = _famille ).exclude( pk = request._obj_.id )   
#            else:
#                field.queryset = field.queryset.none()
#        return field
#    
#===============================================================================

