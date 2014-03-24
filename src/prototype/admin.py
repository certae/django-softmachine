# This is an auto-generated model module by CeRTAE OMS PlugIn
# for project : "Modelibra.py" >


from models import Project,  Model, Entity, Property,  Relationship  #, Prototype
from models import PropertyEquivalence
from models import ProtoTable
#from models import Diagram #, DiagramEntity
# from models import Service #, ServiceRef

from django.contrib import admin


# -----------------------------------------   Model  
from actions import doModelPrototype, doModelGraph, doExportPrototype, doExportProtoJson  

class MyModelAdmin( admin.ModelAdmin ):
    actions = [ doModelPrototype, doModelGraph, doExportPrototype, doExportProtoJson  ]

admin.site.register(Model, MyModelAdmin)

# ------------------------------------------  Entity
from actions import  doEntityPrototype

class MyEntityAdmin( admin.ModelAdmin ):
    actions = [ doEntityPrototype  ]

admin.site.register(Entity, MyEntityAdmin )


# ------------------------------------------  Entity
from actions import doImportSchema, doImportOMS

class MyProjectAdmin( admin.ModelAdmin ):
    actions = [ doImportSchema, doImportOMS  ]

admin.site.register(Project, MyProjectAdmin )


# ------------------------------------------


# class MyDiagramAdmin( admin.ModelAdmin ):
#     actions = [  doModelGraph  ]

# admin.site.register(Diagram , MyDiagramAdmin)


admin.site.register(Property )
#admin.site.register(PropertyEquivalence )

admin.site.register(Relationship )
admin.site.register( ProtoTable )
#admin.site.register( Prototype )

#admin.site.register( Diagram )
#admin.site.register( DiagramEntity )

#admin.site.register( Service )
#admin.site.register( ServiceRef )
