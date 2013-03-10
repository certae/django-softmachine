# -*- coding: utf-8 -*-

from datetime import datetime
from protoLib.utilsBase import slugify

PROTO_PREFIX = "prototype.ProtoTable."

def baseDefinition( pEntity , entityName, viewTitle  ):
    """ protoEntity: Es la traza de la generacion del protipo  dominio.modelo.entidad  
    """ 
    
    viewName   = slugify( viewTitle  )

    return  {
    "__ptType": "pcl",
    "viewEntity": "prototype.ProtoTable",
    "viewCode" : PROTO_PREFIX + viewName,
    "protoEntity" : entityName,  
    "protoEntityId" : pEntity.id,  
    "description" : pEntity.description ,
    "jsonField"   : "info" ,
    "viewIcon"   : "icon-proto",
    "localSort"   : True, 
    "shortTitle"  : viewTitle,
    "updateTime"  : datetime.now(),
    "metaVersion" : "13.0301",
    "idProperty"  : "id",
    "fields": [
        {
            "name": "id",
            "readOnly": True,
            "hidden": True,
            "type": "autofield"
        },
        {
            "name": "entity",
            "readOnly": True,
            "hidden": True,
        },
        {
            "name": "entity_id",
            "readOnly": True,
            "hidden": True,
            "prpDefault" : pEntity.id, 
        },
        {
            "name": "info",
            "searchable": True,
            "readOnly": True,
            "hidden": True,
            "type": "jsonfield",
        },               
        {
            "name": "smOwningUser",
            "readOnly": True,
            "type": "foreigntext"
        },
        {
            "name": "smOwningTeam",
            "readOnly": True,
            "type": "foreigntext"
        },
        {
            "name": "smCreatedOn",
            "readOnly": True,
            "type": "datetime"
        },
#        {
#            "name": "smModifiedOn",
#            "readOnly": True,
#            "type": "datetime"
#        },
#        {
#            "zoomModel": "auth.User",
#            "name": "smModifiedBy",
#            "readOnly": True,
#            "type": "foreigntext"
#        },
#        {
#            "name": "smRegStatus",
#            "readOnly": True,
#            "type": "string"
#        },
#        {
#            "zoomModel": "auth.User",
#            "name": "smCreatedBy",
#            "readOnly": True,
#            "type": "foreigntext"
#        },
#        {
#            "name": "smWflowStatus",
#            "readOnly": True,
#            "type": "string"
#        }
    ],
    "detailsConfig": [],
    "gridConfig": {
        "listDisplay": [],
        "baseFilter": [],
        "searchFields": [ "info",],
        "sortFields": [],
        "hiddenFields": [ "id", "info", "entity_id" ],
        "readOnlyFields": [],
    },
    "formConfig": {
        "__ptType": "formConfig",
        "items": [
            {
                "__ptType": "fieldset",
                "fsLayout": "2col",
                "items": []
            },
#            {
#                "__ptType": "fieldset",
#                "collapsible": True,
#                "title": "Admin",
#                "collapsed": True,
#                "fsLayout": "2col",
#                "items": [
#                    {
#                        "__ptType": "formField",
#                        "name": "smOwningUser"
#                    },
#                    {
#                        "__ptType": "formField",
#                        "name": "smOwningTeam"
#                    },
#                    {
#                        "__ptType": "formField",
#                        "name": "smModifiedBy"
#                    },
#                    {
#                        "__ptType": "formField",
#                        "name": "smCreatedBy"
#                    },
#                    {
#                        "__ptType": "formField",
#                        "name": "smModifiedOn"
#                    },
#                    {
#                        "__ptType": "formField",
#                        "name": "smCreatedOn"
#                    },
#                    {
#                        "__ptType": "formField",
#                        "name": "smRegStatus"
#                    },
#                    {
#                        "__ptType": "formField",
#                        "name": "smWflowStatus"
#                    }
#                ]
#            }
        ]
    }
}    
