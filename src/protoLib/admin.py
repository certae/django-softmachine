# -*- coding: utf-8 -*-

from models import ProtoDefinition, ProtoBussinesUnit, ProtoGroup, ProtoSite, ProtoUser
from django.contrib  import admin           

import django.contrib.admin

class protoDefinitionAdmin(django.contrib.admin.ModelAdmin):

    protoExt = {
    "description": "proto Definition",
    "protoConcept": "protoLib.ProtoDefinition",
    "protoIcon": "icon-1",
    "idProperty": "id",
    "protoOption": "protoLib.ProtoDefinition",
    "shortTitle": "Proto Definition",
    "metaVersion": "121001",
    "protoSheets": [{
        "name": "DEFAULT",
        "template": "{{metaDefinition}}",
        "title": "meta"
    }],
    "protoUdp": {},
    "gridConfig": {
        "baseFilter": {},
        "readOnlyFields": [],
        "sortFields": ["code"],
        "initialSort": [],
        "initialFilter": {},
        "hiddenFields": [],
        "listDisplay": ["code", "description", "active", "overWrite"],
        "filtersSet": [{
            "filter": {
                "code__startswith": "protoDict"
            },
            "name": "protoDict"
        }],
        "searchFields": ["code", "description", "metaDefinition"]
    },
    "fields": [{
        "zoomModel": "@cellValue",
        "cellLink": True,
        "header": "code",
        "fromModel": True,
        "type": "string",
        "name": "code",
        "sortable": True
    }, {
        "header": "Descriptions",
        "vType": "plainText",
        "type": "text",
        "name": "description",
        "fromModel": True
    }, {
        "flex": 1,
        "name": "__str__",
        "fkId": "id",
        "zoomModel": "protoLib.ProtoDefinition",
        "cellLink": True,
        "header": "Proto Definition",
        "readOnly": True,
        "type": "string"
    }, {
        "header": "metaDefinition",
        "vType": "plainText",
        "type": "text",
        "name": "metaDefinition",
        "fromModel": True
    }, {
        "header": "active",
        "type": "bool",
        "name": "active",
        "fromModel": True
    }, {
        "header": "overWrite",
        "type": "bool",
        "name": "overWrite",
        "fromModel": True
    }],
    "protoDetails": [],
    "protoForm": {
        "__ptType": "protoForm",
        "items": [{
            "fsLayout": "2col",
            "__ptType": "fieldset",
            "items": [{
                "name": "code",
                "__ptType": "formField"
            }]
        }, {
            "fsLayout": "2col",
            "__ptType": "fieldset",
            "items": [{
                "name": "active",
                "__ptType": "formField"
            }, {
                "name": "overWrite",
                "__ptType": "formField"
            }]
        }, {
            "fsLayout": "1col",
            "__ptType": "fieldset",
            "items": [{
                "name": "description",
                "__ptType": "formField"
            }, {
                "name": "metaDefinition",
                "__ptType": "formField"
            }]
        }]
    },
    "updateTime": "2012-11-01 11:54:02"
}


admin.site.register(ProtoDefinition, protoDefinitionAdmin)


admin.site.register(ProtoBussinesUnit)
admin.site.register(ProtoGroup)
admin.site.register(ProtoSite)
admin.site.register(ProtoUser)