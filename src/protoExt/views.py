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



from django.core import serializers
import django.utils.simplejson as json




def protoGetConceptModel(request):

    context = {
            "success": True,
            'totalCount': 0,
            'rows': [],
            "metaData": {
                "conceptName": "Contact",
                "shortTitle": "Contact",
                "description": "Contact",
                "idProperty": "id",
                "sortInfo": {
                    "field": "id",
                    "direction": "ASC"
                },
                "fields": [{
                    "dataIndex": "id",
                    "type": "string",
                    "header": "id",
                    "hidden": True,
                    "width": 160,
                    "allowBlank": False,
                    "allowFilter": False,
                    "sortable": False,
                    "editPolicy": 0,
                    "defaultValue": "",
                    "baseConcept": "",
                    "flex": 0, 
                    'tooltip': 'ID',

                }, {
                    "header": "code",
                    "allowFilter": False,
                    "sortable": False,
                    "dataIndex": "code",
                    "type": "string",
                }, {
                    "header": "description",
                    "sortable": False,
                    "dataIndex": "description",
                    "width": 160,
                    "flex": 1, 
                }],
                "protoDetails": [{
                    "conceptDetail": "Model", 
                    "masterFilter": "id",
                    "detailFilter": "domain__id"
                    },{
                    "conceptDetail": "UDP", 
                    "masterFilter": "id",
                    "detailFilter": "domain__id"
                    }],
                "protoViews":[{
                    "viewTitle": "Esentials", 
                    "visibleProp": ["code","description"]
                    },{
                    "viewTitle": "All", 
                    "visibleProp": ["id" "code","description"]
                    }] 
            }
        }
    
    
    context = {
        "success": True,
        "totalCount": 55,
        "rows": [{
            "email": "fred@flintstone.com",
            "last": "Flintstone",
            "id": 1,
            "first": "Fred"
        }, {
            "email": "wilma@flintstone.com",
            "last": "Flintstone",
            "id": 2,
            "first": "Wilma"
        }, {
            "email": "pebbles@flintstone.com",
            "last": "Flintstone",
            "id": 3,
            "first": "Pebbles"
        }, {
            "email": "barney@rubble.com",
            "last": "Rubble",
            "id": 4,
            "first": "Barney"
        }, {
            "email": "betty@rubble.com",
            "last": "Rubble",
            "id": 5,
            "first": "Betty"
        }, {
            "email": "bambam@rubble.com",
            "last": "Rubble",
            "id": 6,
            "first": "BamBam"
        }],
    }
    
    return HttpResponse(json.dumps(context), mimetype="application/json")


