# This is an auto-generated model module by CeRTAE OMS PlugIn
# for project : "Modelibra.py" >


from models import Project,  Model, Entity, Property #,  Relationship
from models import PropertyModel, PropertyEquivalence
#from models import ProtoTable, ProtoView
from models import Diagram #, DiagramEntity
from models import Service #, ServiceRef


from actions import doModelPrototype, doEntityPrototype

from django.contrib import admin


class MyModelAdmin( admin.ModelAdmin ):
    actions = [ doModelPrototype  ]

class MyEntityAdmin( admin.ModelAdmin ):
    actions = [ doEntityPrototype  ]

admin.site.register(Project )

admin.site.register(Model, MyModelAdmin)
admin.site.register(Entity, MyEntityAdmin )


admin.site.register(Property )
admin.site.register(PropertyModel )
admin.site.register(PropertyEquivalence )

#admin.site.register(Relationship )
#admin.site.register( ProtoTable )
#admin.site.register( ProtoView )

admin.site.register( Diagram )
#admin.site.register( DiagramEntity )

admin.site.register( Service )
#admin.site.register( ServiceRef )
