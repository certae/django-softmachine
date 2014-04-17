# # -*- coding: utf-8 -*-

# from django.contrib import admin
# from django.core.exceptions import PermissionDenied
# from django.contrib.admin import helpers
# from django.contrib.admin.util import get_deleted_objects, model_ngettext
# from django.db import router
# from django.utils.encoding import force_unicode
# from django.utils.translation import ugettext_lazy, ugettext as _
# from models import * 


# def createNewModel( modeladmin, request, queryset):
#     """ 
#     Copiar elementos de manera generica en la jerarquia, 
#     definir un arbol q se recorra secuencialmente 
#        con las propiedades y lo hjos q se deseen tomar; 
#        puede ser un arbol sin estructura 
#        cada rama solo define sus propiedades; 
#     """

#   El QSet viene con la lista de Ids de PropertyModel     
    
#    if queryset.count() == 0:
#        return 'No record selected' 

#    opts = modeladmin.opts 
#    dModel = None 

# #   es invocada desde propertyModel ( el Qset es propModel )  
#    for objPropModel  in queryset:

#        dPropDom = objPropModel.propertyDom
#        if dModel == None :   
#            dModel = getModel( dPropDom.domain, 'New Model' )

#        dPropModel = PropertyModel()
#        dPropModel.model = dModel
#        dPropModel.propertyDom = dPropDom
#        dPropModel.save() 
       
#    return 
   
# createNewModel.short_description = "Create a new model whit the selected properties"


# def getModel( objDomain, modelCode  ):
#     """ Obtiene un modelo, dado el dominio y el codigo 
#     """ 
#     dModel, created  = Model.objects.get_or_create( domain = objDomain, code = modelCode )
#     return dModel


