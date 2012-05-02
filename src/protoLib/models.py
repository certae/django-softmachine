# -*- coding: utf-8 -*-


from django.db import models


def getDjangoModel( modelName ):
#   Obtiene el modelo 
    if modelName.count('.') == 1: 
        model = models.get_model( *modelName.split('.') )
    elif modelName.count('.') == 0:
        for m in models.get_models():
            if m._meta.object_name.lower() == modelName.lower():
                model = m
                break
    return model 

