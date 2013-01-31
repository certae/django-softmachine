# -*- coding: utf-8 -*-
from datetime import datetime
from django.contrib import admin

from models import Model, Entity 
from protoLib.models import ProtoDefinition, CustomDefinition 

def doModelPrototype( modeladmin, request, queryset):
    """ 
    funcion para crear el prototipo sobre 'protoTable' con la definicion del diccionario
    a partir de Model  
    """

#   El QSet viene con la lista de Ids  
    if queryset.count() == 0:
        return 'No record selected' 

#    opts = modeladmin.opts 

#   Recorre los registros selccionados   
    for pModel in queryset:
        getProtoEntityDefinition ( pModel.entity )
        
    return 
    
doModelPrototype.short_description = "Create prototypes for the model"


def getProtoEntityDefinition( pEntity, viewName ):
    
    infoEntity = baseDefinition( pEntity )
    return infoEntity


def getModel( objDomain, modelCode  ):
    """ Obtiene un modelo, dado el dominio y el codigo 
    """ 
    dModel, created  = Model.objects.get_or_create( domain = objDomain, code = modelCode )
    return dModel


def baseDefinition( pEntity ):
    
    return  {
    "__ptType": "pcl",
    "protoConcept": "prototype.ProtoTable",
    "protoOption" : "prototype.ProtoTable." + pEntity.code,
    "description" : pEntity.description ,
    "protoIcon"   : "icon-1",
    "shortTitle"  : pEntity.code,
    "updateTime"  : datetime.now(),
    "metaVersion" : "13.0131",
    "idProperty"  : "id",
    "fields": [
        {
            "name": "id",
            "readOnly": True,
            "fromModel": True,
            "hidden": True,
            "type": "autofield"
        },
        {
            "name": "entity",
            "readOnly": True,
            "fromModel": True,
            "hidden": True,
            "default" : pEntity.code, 
        },
        {
            "name": "info",
            "searchable": True,
            "readOnly": True,
            "fromModel": True,
            "hidden": True,
            "type": "text",
        },               
        {
            "zoomModel": "auth.User",
            "name": "owningUser",
            "fkId": "owningUser_id",
            "required": True,
            "readOnly": True,
            "fromModel": True,
            "type": "foreigntext"
        },
        {
            "sortable": True,
            "name": "modifiedOn",
            "readOnly": True,
            "fromModel": True,
            "type": "datetime"
        },
        {
            "fkField": "createdBy",
            "name": "createdBy_id",
            "readOnly": True,
            "hidden": True,
            "type": "foreignid"
        },
        {
            "fkField": "owningUser",
            "name": "owningUser_id",
            "readOnly": True,
            "hidden": True,
            "type": "foreignid"
        },
        {
            "zoomModel": "protoLib.OrganisationTree",
            "name": "owningHierachy",
            "fkId": "owningHierachy_id",
            "required": True,
            "header": "owningHierachy",
            "readOnly": True,
            "fromModel": True,
            "type": "foreigntext"
        },
        {
            "sortable": True,
            "name": "createdOn",
            "header": "createdOn",
            "readOnly": True,
            "fromModel": True,
            "type": "datetime"
        },
        {
            "zoomModel": "auth.User",
            "name": "modifiedBy",
            "fkId": "modifiedBy_id",
            "required": True,
            "header": "modifiedBy",
            "readOnly": True,
            "fromModel": True,
            "type": "foreigntext"
        },
        {
            "sortable": True,
            "name": "regStatus",
            "header": "regStatus",
            "readOnly": True,
            "fromModel": True,
            "type": "string"
        },
        {
            "zoomModel": "auth.User",
            "name": "createdBy",
            "fkId": "createdBy_id",
            "required": True,
            "header": "createdBy",
            "readOnly": True,
            "fromModel": True,
            "type": "foreigntext"
        },
        {
            "fkField": "owningHierachy",
            "name": "owningHierachy_id",
            "readOnly": True,
            "hidden": True,
            "type": "foreignid"
        },
        {
            "fkField": "modifiedBy",
            "name": "modifiedBy_id",
            "readOnly": True,
            "hidden": True,
            "type": "foreignid"
        },
        {
            "sortable": True,
            "name": "wflowStatus",
            "header": "wflowStatus",
            "readOnly": True,
            "fromModel": True,
            "type": "string"
        }
    ],
    "protoDetails": [
        {
            "__ptType": "protoDetail",
            "detailField": "domain__pk",
            "conceptDetail": "prototype.Model",
            "detailName": "domain",
            "menuText": "Model.domain",
            "masterField": "pk"
        }
    ],
    "gridConfig": {
        "listDisplay": [
        ],
        "baseFilter": [],
        "initialFilter": [],
        "initialSort": [],
        "searchFields": [
            "info",
        ],
        "sortFields": [
        ],
        "hiddenFields": [
            "id", "info", "entity"
        ],
        "readOnlyFields": [
        ],
    },
    "protoForm": {
        "__ptType": "protoForm",
        "items": [
            {
                "__ptType": "fieldset",
                "fsLayout": "2col",
                "items": [
                    {
                        "__ptType": "formField",
                        "name": "code"
                    }
                ]
            },
            {
                "__ptType": "fieldset",
                "collapsible": True,
                "title": "Admin",
                "collapsed": True,
                "fsLayout": "2col",
                "items": [
                    {
                        "__ptType": "formField",
                        "name": "owningUser"
                    },
                    {
                        "__ptType": "formField",
                        "name": "owningHierachy"
                    },
                    {
                        "__ptType": "formField",
                        "name": "modifiedBy"
                    },
                    {
                        "__ptType": "formField",
                        "name": "createdBy"
                    },
                    {
                        "__ptType": "formField",
                        "name": "modifiedOn"
                    },
                    {
                        "__ptType": "formField",
                        "name": "createdOn"
                    },
                    {
                        "__ptType": "formField",
                        "name": "regStatus"
                    },
                    {
                        "__ptType": "formField",
                        "name": "wflowStatus"
                    }
                ]
            }
        ]
    }
}    
    