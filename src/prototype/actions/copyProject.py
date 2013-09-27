# -*- coding: utf-8 -*-
#

#  Debe ser  copyProject   ( lo modelos son clasificaciones simplemente  )


# from django.contrib import admin
# from django.core.exceptions import PermissionDenied
# from django.contrib.admin import helpers
# from django.contrib.admin.util import get_deleted_objects, model_ngettext
# from django.db import router
# from django.utils.encoding import force_unicode
# from django.utils.translation import ugettext_lazy, ugettext as _
# from models import *
#
#
# def createNewModel( modeladmin, request, queryset):
#    """
#    funcion de pannier para crear un nuevo modelo,
#    """
#
# El QSet viene con la lista de Ids de PropertyProject
#    if queryset.count() == 0:
#        return 'No record selected'
#
#    opts = modeladmin.opts
#    dModel = None
#
# es invocada desde PropertyProject ( el Qset es propProject )
#    for objPropModel  in queryset:
#
#        dPropDom = objPropModel.propertyDom
#        if dModel == None :
#            dModel = getModel( dPropDom.domain, 'New Model' )
#
#        dPropModel = PropertyProject()
#        dPropModel.model = dModel
#        dPropModel.propertyDom = dPropDom
#        dPropModel.save()
#
#    return
#
# createNewModel.short_description = "Create a new model whit the selected properties"
#
#
# def getModel( objDomain, modelCode  ):
#    """ Obtiene un modelo, dado el dominio y el codigo
#    """
#    dModel, created  = Model.objects.get_or_create( domain = objDomain, code = modelCode )
#    return dModel
