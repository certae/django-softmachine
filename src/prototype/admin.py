# This is an auto-generated model module by CeRTAE OMS PlugIn
# for project : "Modelibra.py" >


from models import PropertyEquivalence
from models import ProtoTable
# from models import Service #, ServiceRef

from django.contrib import admin

# -----------------------------------------   Model  
from actions import doModelPrototype, doModelGraph, doExportPrototype, doExportProtoJson  
from models import Project,  Model, Property,  Relationship  #, Prototype

class MyModelAdmin( admin.ModelAdmin ):
    actions = [ doModelPrototype, doModelGraph, doExportPrototype, doExportProtoJson  ]

admin.site.register(Model, MyModelAdmin)

# ------------------------------------------  Entity
from actions import  doEntityPrototype
from models import Entity

class MyEntityAdmin( admin.ModelAdmin ):
    actions = [ doEntityPrototype  ]

admin.site.register(Entity, MyEntityAdmin )


# ------------------------------------------  Entity
from actions import doImportSchema, doImportOMS

class MyProjectAdmin( admin.ModelAdmin ):
    actions = [ doImportSchema, doImportOMS  ]

admin.site.register(Project, MyProjectAdmin )


# ------------------------------------------

from models import Diagram, DiagramEntity

class MyDiagramAdmin( admin.ModelAdmin ):
    actions = [  doModelGraph  ]

admin.site.register(Diagram , MyDiagramAdmin)


admin.site.register(Property )
#admin.site.register(PropertyEquivalence )

admin.site.register(Relationship )
admin.site.register( ProtoTable )
#admin.site.register( Prototype )

#admin.site.register( Diagram )
#admin.site.register( DiagramEntity )

#admin.site.register( Service )
#admin.site.register( ServiceRef )
