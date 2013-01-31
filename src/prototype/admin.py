# This is an auto-generated model module by CeRTAE OMS PlugIn
# for project : "Modelibra.py" >

from models import Domain,  Model, Entity, Property,  Relationship
from models import PropertyDom, PropertyModel, ProtoTable, ProtoViews 

from django.contrib import admin


admin.site.register(Model)
admin.site.register(Domain )
admin.site.register(Entity )
admin.site.register(Relationship )

admin.site.register(Property )
admin.site.register(PropertyDom )
admin.site.register(PropertyModel )

admin.site.register( ProtoViews )
admin.site.register( ProtoTable )



#from django.contrib.admin import ModelAdmin
#from actions import createNewModel
#class PropertyAdmin(ModelAdmin):
#    actions = [ createNewModel ]
#admin.site.register(PropertyModel, PropertyAdmin)
