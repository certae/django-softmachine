# -*- coding: utf-8 -*-

#import sys

# Importa el sitio con las collecciones admin ya definidas 
from django.contrib.admin.sites import  site
from django.conf import settings
from django.http import HttpResponse

#from protoGetPci import getProtoViewObj

import django.utils.simplejson as json

from models import getDjangoModel, ProtoDefinition, CustomDefinition  

class cAux: pass 


def protoGetMenuData(request):
    """
    Displays the main admin index page, which lists all of the installed
    apps that have been registered in this site.
    """

    app_dict = {}
    
    appAux = cAux()
    appAux.ixApp = 1 
    appAux.ixMod = 1


#-- Lectura de la Db ------------------------------------------------------------- 

    forceDefault = request.GET.get('forceDefault', '') 
    
    try: 
        userProfile = request.user.get_profile()
    except: return  

    protoOption = '__menu'
    protoDef = CustomDefinition.objects.get_or_create(
           code = protoOption, smOwningGroup = userProfile.userGroup, 
           defaults= {'active': False, 'code' : protoOption, 'smOwningGroup' : userProfile.userGroup }
           )[:1]

    # El default solo parece funcionar al insertar en la Db
    if protoDef.active and ( forceDefault == '0') :  
        context = protoDef.metaDefinition 

    else:

        for model, model_admin in site._registry.items():
            protoAdmin = getattr(model_admin, 'protoExt', {}) 
            menuNode = model._meta.object_name
            getMenuItem( protoAdmin, model, menuNode )

    
        # Sort the apps alphabetically.
        app_list = app_dict.values()
        app_list.sort(key=lambda x: x['index'])
    
        # Sort the models alphabetically within each app.
        for app in app_list:
            app['children'].sort(key=lambda x: x['index'])


        # lee las opciones del prototipo 
        protoOpts = CustomDefinition.objects.filter( code__startswith = 'prototype.ProtoTable.', smOwningGroup = userProfile.userGroup )
        ix = 0 
        for option in protoOpts:

            if ix == 0 :
                prNodes = {  
                    'id': 'prototype.auto.nodes' ,
                    'text': 'ProtoOptions' ,
                    'expanded': True ,
                    'index': 1000 ,
                    'children': [],
                    'leaf': False 
                }
                app_list.append( prNodes )

            nodeName = option.code.replace( 'prototype.ProtoTable.', '')
            
            prNodes['children'].append( {
                'text':  nodeName,
                'expanded': True ,
                'protoOption': option.code,
                'index': 'prOtoTyPe.' + option.code,
                'leaf': True 
                 })

            ix += 1 

        # decodifica en string 
        context = json.dumps( app_list ) 

        # Lo guarda  ( created : true  --> new
        protoDef.metaDefinition = context  
        protoDef.description = 'Menu' 
        protoDef.save()
    

    return HttpResponse( context, mimetype="application/json")


#   ---------------------------------------------------------------------------

    def getMenuItem( protoAdmin, model, menuNode ):
    
        # El menuIx determina tambien si aparece o no en el menu 
        ixModAux = protoAdmin.get( 'protoMenuIx', appAux.ixMod)
        if ixModAux < 0: return 
    
        appCode = model._meta.app_label
        
        # Define la rama del menu 
        menuLabel = protoAdmin.get('protoMenuOpt', appCode )
        
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
    

