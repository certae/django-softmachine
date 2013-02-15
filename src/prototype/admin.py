# This is an auto-generated model module by CeRTAE OMS PlugIn
# for project : "Modelibra.py" >


from models import Domain,  Model, Entity, Property,  Relationship
from models import PropertyDom, PropertyModel, ProtoTable
from actions import doModelPrototype

from django.contrib import admin


class MyModelAdmin( admin.ModelAdmin ):
    actions = [ doModelPrototype  ]

admin.site.register(Model, MyModelAdmin)
admin.site.register(Domain )
admin.site.register(Entity )
admin.site.register(Relationship )

admin.site.register(Property )
admin.site.register(PropertyDom )
admin.site.register(PropertyModel )

admin.site.register( ProtoTable )

