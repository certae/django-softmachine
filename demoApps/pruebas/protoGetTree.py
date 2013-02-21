# -*- coding: utf-8 -*-

"""
    El desarrollo de este modulo se suspendio, tenia por objeto :
    Generacion automatica de un arbol a partir de las relaciones de las tablas
    Navegando desde un padre en forma jerarquica ( recursiva ) hacia sus detalles definidos 

""" 
from django.http import HttpResponse
from protoGrid import  getProtoViewName, setDefaultField
from protoField import  setFieldDict
from models import getDjangoModel  
from utilsBase import getReadableError 

import django.utils.simplejson as json



    
#----

def setTreeDefinition( protoMeta ):
        # Los campos base minimos son :   
        #     Id          : id del registro  ( automatico ) 
        #     __str__     : valor semantico del registro   
        #     protoView   : permite redefinir el panel de detalles y la navegacion 
    
        #    El arbol se defina a medida q el usuario haga drill-down en cada detalle, 
        #    la construccion del arbol es responsabilidad del frontEnd 

    pFields =  []
    pFields.append ( { "name": "__str__","type": "string"} )
    pFields.append ( { "name": "protoView","type": "string"} )
    pFields.append ( { "name":"id", "type":"autofield" } )

    protoMeta['fields'] = pFields 
    protoMeta['hiddenFields'] = ["id"]
    protoMeta['listDisplay'] = ["__str__", "protoView"]
    

def getProtoViewObj( protoMeta, view   ):
#   Copia las propiedades de la vista en el protoMeta ( La meta resultante no es editable ) 

    protoView = {}
    if view:
        # intenta leer la definicion de la vista             
        protoViews  = protoMeta.get( 'protoViews', {})
        if protoViews:  
            protoView  = protoViews.get(  view, {})

    if protoView:
        protoCopy = protoMeta.copy()
        for key in protoView: 
            # evitar recursividad en vistas 
            if key == 'protoViews': continue 
            protoCopy[ key ] = protoView[ key ]
          
        return protoCopy

    else: 
        return protoMeta
