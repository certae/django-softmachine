# This is an auto-generated model module by CeRTAE OMS PlugIn
# for project : "Modelibra.py" >

<<<<<<< HEAD
from models import Project,  Model, Entity, Property,  Relationship
from models import PropertyProject, PropertyEquivalence
from models import ProtoTable
from models import Diagram
from models import Service
=======
from prototype.models import Project,  Model, Entity, Property,  Relationship
from prototype.models import PropertyModel, PropertyEquivalence
from prototype.models import ProtoTable
from prototype.models import Diagram
from prototype.models import Service
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

from django.contrib import admin


# -----------------------------------------   Model
<<<<<<< HEAD
from actions import doModelPrototype, doModelGraph, doAutoForeingEntity


class MyModelAdmin(admin.ModelAdmin):
    actions = [doModelPrototype, doModelGraph, doAutoForeingEntity]
=======
from prototype.actions import doModelPrototype, doModelGraph


class MyModelAdmin(admin.ModelAdmin):
    actions = [doModelPrototype, doModelGraph]
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

admin.site.register(Model, MyModelAdmin)

# ------------------------------------------  Entity
<<<<<<< HEAD

from actions import doEntityPrototype, doEntityChangeModel
from protoLib.actions import doFindReplace

=======
from prototype.actions import doEntityPrototype


class MyEntityAdmin(admin.ModelAdmin):
    actions = [doEntityPrototype]

admin.site.register(Entity, MyEntityAdmin)
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

class MyEntityAdmin(admin.ModelAdmin):
    actions = [doEntityPrototype, doEntityChangeModel, doFindReplace]

<<<<<<< HEAD
admin.site.register(Entity, MyEntityAdmin)

# ------------------------------------------  PropertyProject

from actions import doPropertyProjectJoin, doPropertyProjectPurge


class MyPropertyProjectAdmin(admin.ModelAdmin):
    actions = [doPropertyProjectJoin, doPropertyProjectPurge]

admin.site.register(PropertyProject, MyPropertyProjectAdmin)

# ------------------------------------------  Project
from actions import doImportSchema

=======
from prototype.actions import doPropertyModelJoin


class MyPropertyModelAdmin(admin.ModelAdmin):
    actions = [doPropertyModelJoin]

admin.site.register(PropertyModel, MyPropertyModelAdmin)

# ------------------------------------------  Entity
from prototype.actions import doImportSchema

>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

class MyProjectAdmin(admin.ModelAdmin):
    actions = [doImportSchema]

admin.site.register(Project, MyProjectAdmin)

# ------------------------------------------


admin.site.register(Property)
#admin.site.register(PropertyEquivalence )

admin.site.register(Relationship)
admin.site.register(ProtoTable)
#admin.site.register( Prototype )

#admin.site.register( Diagram )
#admin.site.register( DiagramEntity )

#admin.site.register( Service )
#admin.site.register( ServiceRef )
