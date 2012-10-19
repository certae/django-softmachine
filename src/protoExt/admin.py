# This is an auto-generated model module by CeRTAE OMS PlugIn
# for project : "Modelibra.py" >


from models import Concept, Domain, MetaLink, MetaLinkModel, MetaObj, Model, Property, Relationship, Udp, UdpDefinition
from django.contrib import admin
import django.contrib.admin
#---------------


from admin_Domain import DomainAdmin 
admin.site.register(Domain, DomainAdmin)

#---------------

from admin_Model import Model_Admin 
admin.site.register(Model, Model_Admin)

#---------------

from admin_Concept import Concept_Admin 
admin.site.register(Concept, Concept_Admin)

#---------------
#DGT: Invocacion de llave a 2 niveles  
#    list_filter y search_fields permiten  __lookup syntax, 
#    list_display obliga la definicion ya sea en el modelo o como funcion    


from admin_Property import PropertyAdmin
admin.site.register(Property, PropertyAdmin)

#---------------  

class RelationshipAdmin(django.contrib.admin.ModelAdmin):
    verbose_name_plural = 'Associations' 
    list_display =( 'concept', 'baseConcept', 'code',  'alias')
    list_filter = ( 'concept', )
    search_fields = ( 'baseConcept', 'code',  'description', 'alias')
    protoExt = { 'protoMenuIx': -1 }


admin.site.register(Relationship, RelationshipAdmin)



from admin_Udp import UdpAdmin 
admin.site.register(Udp, UdpAdmin)

class MetaLinkAdmin(django.contrib.admin.ModelAdmin):
    verbose_name_plural = 'Modeles de liens Detail' 
    list_display =( 'metaLinkModel' , 'code', 'alias', 'destinationText', 'sourceCol', 'destinationCol')
    list_filter = ( 'metaLinkModel' , )
    search_fields = ( 'code', 'alias', 'destinationText', 'sourceCol', 'destinationCol')

#    protoExt = {}
#    protoExt = { 'protoMenuIx': -1 }
#    protoExt[ 'protoMenuOpt' ] = 'Liens'


admin.site.register(MetaLink, MetaLinkAdmin)


class MetaLinkModelAdmin(django.contrib.admin.ModelAdmin):
    verbose_name_plural = 'Modeles de liens' 
#    list_display =( 'metaLinkModel' , 'code', 'alias', 'destinationText', 'sourceCol', 'destinationCol')
#    list_filter = ( 'metaLinkModel' , )
#    search_fields = ( 'code', 'alias', 'destinationText', 'sourceCol', 'destinationCol')


admin.site.register(MetaLinkModel, MetaLinkModelAdmin)


class UdpAdminDefinition(django.contrib.admin.ModelAdmin):
#   N'est pas inclu dans le menu 
    protoExt = { 'protoMenuIx': -1 }

admin.site.register(UdpDefinition, UdpAdminDefinition)


#admin.site.register(PropertyChoice)
#admin.site.register(NavigationLink)
#admin.site.register(EntryPoints)
#admin.site.register(Menu)
#admin.site.register(ModelGraphic)
#admin.site.register(Traduction)



class MetaObjAdmin(admin.ModelAdmin):
    list_display =( 'id', 'code', 'objType', 'description', 'category'  )
    readonly_fields = ('objType', )

    #Add = False  
    def has_add_permission(self, request):
        return False

    #Delete = False 
    def has_delete_permission(self, request, obj=None):
        return False

    #Update = False 
    def has_change_permission(self, request, obj=None):
        return True
                
#admin.site.register(MetaObj, MetaObjAdmin)
#admin.site.register(MetaObj)
