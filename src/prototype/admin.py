# This is an auto-generated model module by CeRTAE OMS PlugIn
# for project : "Modelibra.py" >


from models import Project,  Model, Entity, Property,  Relationship #, Prototype
from models import PropertyProject, PropertyEquivalence
from models import ProtoTable
from models import Diagram #, DiagramEntity
from models import Service #, ServiceRef

from django.contrib import admin


# -----------------------------------------   Model  
from actions import doModelPrototype, doModelGraph, doAutoForeingEntity

class MyModelAdmin( admin.ModelAdmin ):
    actions = [ doModelPrototype, doModelGraph, doAutoForeingEntity  ]

admin.site.register(Model, MyModelAdmin)

# ------------------------------------------  Entity

from actions import  doEntityPrototype, doEntityChangeModel
from protoLib.actions import doFindReplace


class MyEntityAdmin( admin.ModelAdmin ):
    actions = [ doEntityPrototype, doEntityChangeModel , doFindReplace  ]

admin.site.register(Entity, MyEntityAdmin )

# ------------------------------------------  PropertyProject

from actions import doPropertyProjectJoin, doPropertyProjectPurge

class MyPropertyProjectAdmin( admin.ModelAdmin ):
    actions = [ doPropertyProjectJoin , doPropertyProjectPurge ]

admin.site.register(PropertyProject, MyPropertyProjectAdmin )

# ------------------------------------------  Project 
from actions import doImportSchema 

class MyProjectAdmin( admin.ModelAdmin ):
    actions = [ doImportSchema  ]

admin.site.register(Project, MyProjectAdmin )

# ------------------------------------------


admin.site.register(Property )
#admin.site.register(PropertyEquivalence )

admin.site.register(Relationship )
admin.site.register( ProtoTable )
#admin.site.register( Prototype )

#admin.site.register( Diagram )
#admin.site.register( DiagramEntity )

#admin.site.register( Service )
#admin.site.register( ServiceRef )
