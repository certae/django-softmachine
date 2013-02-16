# This is an auto-generated model module by CeRTAE OMS PlugIn
# for project : "Modelibra.py" >


from models import Domain,  Model, Entity, Property,  Relationship
from models import PropertyDom, PropertyModel, ProtoTable, ProtoView
from actions import doModelPrototype, doEntityPrototype

from django.contrib import admin


class MyModelAdmin( admin.ModelAdmin ):
    actions = [ doModelPrototype  ]

class MyEntityAdmin( admin.ModelAdmin ):
    actions = [ doEntityPrototype  ]

admin.site.register(Domain )

admin.site.register(Model, MyModelAdmin)
admin.site.register(Entity, MyEntityAdmin )

admin.site.register(Relationship )

admin.site.register(Property )
admin.site.register(PropertyDom )
admin.site.register(PropertyModel )

admin.site.register( ProtoTable )
admin.site.register( ProtoView )
