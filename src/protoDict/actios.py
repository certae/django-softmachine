
from django.contrib import admin
from models import * 


def createNewModel( modeladmin, request, queryset):
    """ funcion de pannier para crear un nuevo modelo  
    """
    
#    Recorre el QSet, puede ser una lista de ids de PropertyModel o de PropertyDom, 
#    si el modelo no corresponde no hace nada. 
    queryset.update(status='p')


    
createNewModel.short_description = "Create a new model whit the selected properties"

