# -*- coding: utf-8 -*-

#import sys

# Importa el sitio con las collecciones admin ya definidas 
from django.contrib.admin.sites import  site

from django.conf import settings

from django.http import HttpResponse
import django.utils.simplejson as json

## Obtiene la coleccion ProtoExt de cualquier objeto 
#def getProtoExt( objBase   ):
#    try: protoExt = objBase.protoExt 
#    except: protoExt = {} 
#    return protoExt 


def protoGetMenuData(request):
    """
    Displays the main admin index page, which lists all of the installed
    apps that have been registered in this site.
    """
    
    app_dict = {}
    ixApp = 1 
    ixMod = 1
     
#   user = request.user
    for model, model_admin in site._registry.items():

#       protoModel = getattr(model, 'protoExt', {})
        protoAdmin = getattr(model_admin, 'protoExt', {}) 

        # El menuIx determina tambien si aparece o no en el menu 
        ixModAux = protoAdmin.get( 'protoMenuIx', ixMod)
        if ixModAux < 0: continue 

        appCode = model._meta.app_label
        menuLabel = protoAdmin.get('app_name', appCode )

#       Obtiene el menu de settigs.PROTO_APP          
        try: menuDefinition = settings.PROTO_APP.get( 'app_menu', {}).get( menuLabel, {} ) 
        except: menuDefinition = {}
            
        if menuDefinition.get('hidden', False ): continue 

        # Icono por defecto
        protoIcon = 'icon-%s' % protoAdmin.get( 'protoIcon',  '1')

        model_dict = {
            'id': appCode + '.' + model._meta.object_name,
            'text': model._meta.verbose_name.title() ,
            'index': ixModAux ,
            'iconCls': protoIcon ,
            'leaf': True,
        }
        if menuLabel in app_dict:
            app_dict[menuLabel]['children'].append(model_dict)

        else:
            app_dict[menuLabel] = {
                'text': menuDefinition.get('title', menuLabel )  ,
                'expanded': menuDefinition.get('expanded', True) ,
                'index': menuDefinition.get('menu_index', ixApp ),
                'children': [model_dict],
            }

            ixApp += 1
             
        ixMod += 1 

    # Sort the apps alphabetically.
    app_list = app_dict.values()
    app_list.sort(key=lambda x: x['index'])

    # Sort the models alphabetically within each app.
    for app in app_list:
        app['children'].sort(key=lambda x: x['index'])

    context = json.dumps( app_list ) 

    return HttpResponse( context, mimetype="application/json")
