# -*- coding: utf-8 -*-

#import sys

# Importa el sitio con las collecciones admin ya definidas 
from django.contrib.admin.sites import  site
from django.conf import settings
from django.http import HttpResponse

#from protoGetPci import getProtoViewObj

import django.utils.simplejson as json

from models import CustomDefinition  
from protoActionEdit import setSecurityInfo
from protoAuth import getUserProfile, getModelPermissions
from utilsWeb import JsonError, JsonSuccess 

class cAux: pass 


def protoGetMenuData(request):
    """
    Cada grupo tiene su propio menu q se construye con las app a las cuales tiene derecho 
    se guarda siempre por grupo en customDefinition,  
    
    Cada usuario tendra una rama de  favoritos para sus opciones frecuentes, 
    el menu es a nivel de grupo  
    """

    if request.method != 'POST': 
        return JsonError( 'invalid message' ) 
    
    currentUser  = request.user
    userProfile = getUserProfile( currentUser, 'getMenu', ''  ) 

    app_dict = {}

    appAux = cAux()
    appAux.ixApp = 1 
    appAux.ixMod = 1
    

    def getMenuItem( protoAdmin, model, menuNode ):
    
        try: appCode = model.protoExt["menuApp"]
        except: appCode = model._meta.app_label
        
        # Verifica q el usuairo tenga permiso, considera el admin 
        if not getModelPermissions( currentUser, model, 'menu' ) : return  
        
        # Define la rama del menu 
        menuLabel = protoAdmin.get('protoMenuOpt', appCode )
        
        pTitle = protoAdmin.get('title', model._meta.verbose_name.title() )
    
        # Obtiene el menu de settigs.PROTO_APP          
        try: menuDefinition = settings.PROTO_APP.get( 'app_menu', {}).get( menuLabel, {} ) 
        except: menuDefinition = {}
            
        if menuDefinition.get('hidden', False ): return  
    
        # Icono por defecto
        viewIcon = 'icon-%s' % protoAdmin.get( 'viewIcon',  '1')
    
        model_dict = {
            'id': appCode + '.' + menuNode ,
            'text': pTitle ,
            'index': appAux.ixMod ,
            'iconCls': viewIcon ,
            'leaf': True,
        }
        if menuLabel in app_dict:
            app_dict[menuLabel]['children'].append(model_dict)
    
        else:
            app_dict[menuLabel] = {
                'text': menuDefinition.get('title', menuLabel )  ,
                'expanded': menuDefinition.get('expanded', False) ,
                'index': menuDefinition.get('menu_index', appAux.ixApp ),
                'children': [model_dict],
            }
    
            appAux.ixApp += 1
             
        appAux.ixMod += 1 
    

#-- Lectura de la Db ------------------------------------------------------------- 

    forceDefault = request.POST.get('forceDefault', '') 

    viewCode = '__menu'
    protoDef = CustomDefinition.objects.get_or_create(
           code = viewCode, smOwningTeam = userProfile.userTeam, 
           defaults= {'active': False, 'code' : viewCode, 'smOwningTeam' : userProfile.userTeam }
           )[0]

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
        protoOpts = CustomDefinition.objects.filter( code__startswith = 'prototype.ProtoTable.', smOwningTeam = userProfile.userTeam )
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
                'viewCode': option.code,
                'index': 'prOtoTyPe.' + option.code,
                'leaf': True 
                 })

            ix += 1 

        # decodifica en string 
        context = json.dumps( app_list ) 

        # Lo guarda  ( created : true  --> new
        protoDef.metaDefinition = context  
        protoDef.active = True  
        protoDef.description = 'Menu' 

        setSecurityInfo( protoDef, {}, userProfile,  True  )

        protoDef.save()
    

    return HttpResponse( context, mimetype="application/json")


#   ---------------------------------------------------------------------------


