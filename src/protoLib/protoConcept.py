# -*- coding: utf-8 -*-

import sys

from django import forms
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import models
from django.db import transaction
from django.forms.models import model_to_dict
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from django.template import  Context
from django.template import  RequestContext
from django.template.loader import get_template 
from django.utils.translation import gettext as __

from protoLib import protoGrid, utilsBase, utilsWeb  
from protoLib.forms import ExtJsForm, getExtJsModelForm

from django.conf import settings



from django.core import serializers
import django.utils.simplejson as json

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


def protoGetPCI(request):
    """ return full metadata (columns, renderers, totalcount...)
        to be used in combination with protoExt.js
    """

    if request.method == 'GET':
        protoConcept = request.GET.get('protoConcept', '') 
        
        model = getDjangoModel(protoConcept)
        grid = protoGrid.ProtoGridFactory( model  )        

#       pRows = model.objects.filter(pk = 0)
        pRows = []
        pRowsCount = 0

        base_fields = grid.get_fields( None )
        protoDetails = grid.get_details()
        
        #TODO : Debe ser buscao en la META
        id_field = model._meta.pk.name
            
        jsondict = {
             'succes':True,
             'metaData':{
                 'root':'rows',
                 'totalProperty':'totalCount',
                 'successProperty':'success',
                 'shortTitle': grid.title,
                 'description': grid.title,
                 'queryFields': grid.QFields, 

                 'idProperty':id_field,
                 'sortInfo':{
                   "field": id_field, 
                   "direction": 'DESC'
                },
                'fields': base_fields, 
#                'protoTabs':[{'T1': ['Col1','Col2']},  {'T2': ['Col3','Col2']},],     
                'protoDetails': protoDetails, 
            },
            'rows':[],
            'totalCount': pRowsCount, 
        }

        context = json.dumps( jsondict)
        return HttpResponse(context, mimetype="application/json")

# protoGetPCI ----------------------------



def protoGetList(request):
#   Vista simple para cargar la informacion, 
    
    if request.method == 'POST':

        protoConcept = request.POST.get('protoConcept', '')
        protoFilter = request.POST.get('protoFilter', '')
        protoFilterBase = request.POST.get('protoFilterBase', '')
        protoQFields = request.POST.get('queryFields', '')
        
        start = int(request.POST.get('start', 0))
        limit = int(request.POST.get('limit', 100))
        page = int(request.POST.get('page', 1))

        sort = request.POST.get('sort', 'id')
        sort_dir = request.POST.get('dir', 'ASC')
        
        
#   Carga la info
    model = getDjangoModel(protoConcept)
    
#   Convierte el filtro en un diccionario 
    if (len (protoFilter) > 0 ):
        try: protoStmt = eval( protoFilter )
        except: protoStmt = {'pk':0}
    else: 
        protoStmt = {}

#   El filtro base viene en la configuracion MD 
    if (len (protoFilterBase) > 0 ):
        try: protoStmtBase = eval( protoFilterBase )
        except: protoStmtBase = {'pk':0}
    else: 
        protoStmtBase = {}

#   Obtiene las filas del modelo 
    pRowsCount = model.objects.select_related(protoQFields).filter(**protoStmt ).filter(**protoStmtBase ).count()
    pRows = model.objects.select_related(protoQFields).filter(**protoStmt ).filter(**protoStmtBase ).order_by('id')[start: page*limit ]


    pList = []
    for reg in pRows:
        pList.append(model_to_dict(reg, fields=[field.name for field in reg._meta.fields]))

#    pList = [{'id':1,'first':"Fred",'last':"Flintstone",'email':"fred@flintstone.com"},{'id':2,'first':"Wilma",'last':"Flintstone",'email':"wilma@flintstone.com"},{'id':3,'first':"Pebbles",'last':"Flintstone",'email':"pebbles@flintstone.com"},{'id':4,'first':"Barney",'last':"Rubble",'email':"barney@rubble.com"},{'id':5,'first':"Betty",'last':"Rubble",'email':"betty@rubble.com"},{'id':6,'first':"BamBam",'last':"Rubble",'email':"bambam@rubble.com"}]
    
    context = json.dumps({
            "success": True,
            'totalCount': pRowsCount,
            'rows': pList,
            })
    
    return HttpResponse(context, mimetype="application/json")

