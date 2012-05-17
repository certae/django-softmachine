# -*- coding: utf-8 -*-

# Importa el sitio con las collecciones admin ya definidas 
from django.contrib.admin.sites import  site
from django.conf import settings
from django.http import HttpResponse

from protoGrid import getProtoViewObj

import django.utils.simplejson as json

from models import getDjangoModel, ProtoDefinition

class cAux: pass 


def protoGetFields(request):
    """
    Displays the main admin index page, which lists all of the installed
    apps that have been registered in this site.
    """

    app_dict = {}
    
    appAux = cAux()
    appAux.ixApp = 1 
    appAux.ixMod = 1

    def getMenuItem( protoAdmin, model, menuNode ):
    
        # El menuIx determina tambien si aparece o no en el menu 
        ixModAux = protoAdmin.get( 'protoMenuIx', appAux.ixMod)
        if ixModAux < 0: return 
    
        appCode = model._meta.app_label
        menuLabel = protoAdmin.get('app_name', appCode )
        
        pTitle = protoAdmin.get('title', model._meta.verbose_name.title() )
    
    #       Obtiene el menu de settigs.PROTO_APP          
        try: menuDefinition = settings.PROTO_APP.get( 'app_menu', {}).get( menuLabel, {} ) 
        except: menuDefinition = {}
            
        if menuDefinition.get('hidden', False ): return  
    
        # Icono por defecto
        protoIcon = 'icon-%s' % protoAdmin.get( 'protoIcon',  '1')
    
        model_dict = {
            'id': appCode + '.' + menuNode ,
            'text': pTitle ,
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
                'index': menuDefinition.get('menu_index', appAux.ixApp ),
                'children': [model_dict],
            }
    
            appAux.ixApp += 1
             
        appAux.ixMod += 1 
    
     
#---user = request.user
    for model, model_admin in site._registry.items():
        
        protoAdmin = getattr(model_admin, 'protoExt', {}) 
        protoViews = protoAdmin.get( 'protoViews' )

        menuNode = model._meta.object_name
        getMenuItem( protoAdmin, model, menuNode )
         
        if protoViews: 
            # si existen vistas,  carga una opcion de menu para cada una             
            for view in protoViews: 
                menuNode = model._meta.object_name + '.' + view
                protoOpcion =  getProtoViewObj( protoAdmin, view   )
                getMenuItem( protoOpcion, model, menuNode )


    # Sort the apps alphabetically.
    app_list = app_dict.values()
    app_list.sort(key=lambda x: x['index'])

    # Sort the models alphabetically within each app.
    for app in app_list:
        app['children'].sort(key=lambda x: x['index'])

    context = json.dumps( app_list ) 


    # Lo guarda  ( created : true  --> new
    protoOption = '__menu'
    protoDef, created = ProtoDefinition.objects.get_or_create(code = protoOption, defaults={'code': protoOption})
    protoDef.metaDefinition = context  
    protoDef.description = 'Menu' 
    protoDef.save()
    

    return HttpResponse( context, mimetype="application/json")


