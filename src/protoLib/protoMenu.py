# -*- coding: utf-8 -*-


# Importa el sitio con las collecciones admin ya definidas
from django.db import models
from django.conf import settings
from django.http import HttpResponse


import json

from models import CustomDefinition, ProtoDefinition
from protoActionEdit import setSecurityInfo
from protoAuth import getUserProfile, getModelPermissions
from utilsWeb import JsonError
from utilsBase import verifyList

from prototype.models import Prototype 
PROTO_PREFIX = "prototype.ProtoTable."

class cAux: 
    pass 


# Ix tree 
ix = 0 

def protoGetMenuData(request):
    """
    Cada grupo tiene su propio menu q se construye con las app a las cuales tiene derecho 
    se guarda siempre por grupo en customDefinition,  
    
    Cada usuario tendra una rama de  favoritos para sus opciones frecuentes, 
    el menu es a nivel de grupo  
    """
    
    global ix 

    if not request.user.is_authenticated(): 
        return JsonError('readOnly User')

    if request.method != 'POST': 
        return JsonError('invalid message') 
    
    currentUser = request.user
    userProfile = getUserProfile(currentUser, 'getMenu', '') 

    app_dict = {}

    appAux = cAux()
    appAux.ixApp = 1 
    appAux.ixMod = 1
    

    def getMenuItem(protoAdmin, model, menuNode):
    
        appCode = model._meta.app_label
        
        # Define la rama del menu 
        try:
            menuLabel = model.protoExt["menuApp"]
        except:
            menuLabel = appCode  
        
        if menuLabel in ['contenttypes', 'sites']:
            menuLabel = 'auth' 
        
        # Verifica q el usuairo tenga permiso, considera el admin 
        if not getModelPermissions(currentUser, model, 'menu') :
            return  
        
        pTitle = protoAdmin.get('title', model._meta.verbose_name.title())
    
        # Obtiene el menu de settigs.PROTO_APP          
        try:
            menuDefinition = settings.PROTO_APP.get('app_menu', {}).get(menuLabel, {}) 
        except:
            menuDefinition = {}
            
        if menuDefinition.get('hidden', False):
            return  
    
        # Icono por defecto
        viewIcon = protoAdmin.get('viewIcon', 'icon-1')
    
        model_dict = {
            'viewCode': appCode + '.' + menuNode ,
            'text': pTitle ,
            'index': appAux.ixMod ,
            'iconCls': viewIcon ,
            'leaf': True,
        }
        if menuLabel in app_dict:
            app_dict[menuLabel]['children'].append(model_dict)
    
        else:
            app_dict[menuLabel] = {
                'text': menuDefinition.get('title', menuLabel)  ,
                'expanded': menuDefinition.get('expanded', False) ,
                'index': menuDefinition.get('menu_index', appAux.ixApp),
                'children': [model_dict],
            }
    
            appAux.ixApp += 1
             
        appAux.ixMod += 1 
    

#-- Lectura de la Db ------------------------------------------------------------- 

    forceDefault = request.POST.get('forceDefault', '') 

    viewCode = '__menu'
    protoDef = CustomDefinition.objects.get_or_create(
           code=viewCode, smOwningTeam=userProfile.userTeam,
           defaults={'active': False, 'code' : viewCode, 'smOwningTeam' : userProfile.userTeam }
           )[0]

    # El default solo parece funcionar al insertar en la Db
    if protoDef.active and (forceDefault == '0') :  
        context = protoDef.metaDefinition 

    else:

        for model in models.get_models(include_auto_created=True):
        # for model, model_admin in site._registry.items():
            # protoAdmin = getattr(model_admin, 'protoExt', {})
            menuNode = model._meta.object_name
            protoAdmin = getattr(model, 'protoExt', {}) 
            getMenuItem(protoAdmin, model, menuNode)
    
        # Sort the apps alphabetically.
        app_list = app_dict.values()
        app_list.sort(key=lambda x: x['index'])
    
        # Sort the models alphabetically within each app.
        for app in app_list:
            app['children'].sort(key=lambda x: x['index'])


        # lee las opciones del prototipo -----------------------------------------------
        prototypes = Prototype.objects.filter(smOwningTeam=userProfile.userTeam)
        prNodes = {  
            'text': 'ProtoOptions' ,
            'expanded': True ,
            'index': 1000 ,
            'children': [],
            'leaf': False 
        }
        app_list.append(prNodes)

        ix = 0 
        for option in prototypes:

            prBase = getNodeBaseProto(prNodes, option)
            prBase['children'].append({
                'text':  option.code,
                'expanded': True ,
                'viewCode': PROTO_PREFIX + option.code,
                'iconCls': 'icon-proto',
                'index':  ix,
                'leaf': True 
                 })

            ix += 1 

        # lee las vistas 
        prototypes = ProtoDefinition.objects.all()
        prNodes = {  
            'text': 'ProtoViews' ,
            'expanded': True ,
            'index': 2000 ,
            'children': [],
            'leaf': False 
        }
        app_list.append(prNodes)

        ix = 0 
        for option in prototypes:

            prBase = getNodeBaseViews(prNodes, option)
            prBase['children'].append({
                'text':  option.code,
                'expanded': True ,
                'viewCode': option.code,
                'iconCls': 'icon-1',
                'index':  ix,
                'leaf': True 
                 })

            ix += 1 

        # Pega el menu sobre la definicion anterior  
        try: 
            menuAux = []
            menuTmp = verifyList(json.loads(protoDef.metaDefinition))
            for menuOp in menuTmp:
                if menuOp.get( 'text', '') != 'AutoMenu':
                    menuAux.append (menuOp) 

            menuAux.append({
                    'id': 'prototype.auto.nodes' ,
                    'text': 'AutoMenu' ,
                    'expanded': True,
                    'index': 1000 ,
                    'children': app_list,
                    'leaf': False 
            })
        except: 
            menuAux = app_list 

        context = json.dumps(menuAux) 

        # Lo guarda  ( created : true  --> new
        protoDef.metaDefinition = context  
        protoDef.active = True  
        protoDef.description = 'Menu' 

        setSecurityInfo(protoDef, {}, userProfile, True)

        protoDef.save()
    

    return HttpResponse(context, content_type="application/json")



def getNodeBaseProto(prNodes, option):

    prNBase = getMenuNode(prNodes, option.entity.model.project.code)
    prNBase = getMenuNode(prNBase, option.entity.model.code)
    prNBase = getMenuNode(prNBase, option.entity.code)
    
    return prNBase
    

def getNodeBaseViews(prNodes, option):

    lApp, lMod = option.code.split(".")[0:2]
    
    prNBase = getMenuNode(prNodes, lApp)
    prNBase = getMenuNode(prNBase, lMod)
    return prNBase


def getMenuNode(prNodes, optText):

    global ix 

    for lNode in prNodes[ 'children' ]: 
        if lNode['text'] == optText and not lNode[ 'leaf' ]: 
            return lNode 
    
    prNBase = {  
        'text': optText  ,
        'expanded': False ,
        'index': ix  ,
        'children': [],
        'leaf': False 
    }

    ix += 1

    prNodes['children'].append(prNBase)
    
    return prNBase  