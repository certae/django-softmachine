# -*- coding: utf-8 -*-

import django.contrib.admin

class protoDefinitionAdmin(django.contrib.admin.ModelAdmin):
    protoExt = {
    "description": "proto Definition",
    "viewEntity": "protoLib.ProtoDefinition",
    "viewIcon": "icon-1",
    "idProperty": "id",
    "viewCode": "protoLib.ProtoDefinition",
    "shortTitle": "Proto Definition",
    "metaVersion": "121001",
    "sheetConfig": [{
        "name": "DEFAULT",
        "template": "{{metaDefinition}}",
        "title": "meta"
    }],
    "usrDefProps": {},
    "gridConfig": {
        "baseFilter": [],
        "readOnlyFields": [],
        "sortFields": ["code"],
        "initialSort": [],
        "initialFilter": [],
        "hiddenFields": [],
        "listDisplay": ["code", "description", "active", "overWrite"],
        "searchFields": ["code", "description", "metaDefinition"],
    },
    "gridSets": {
        "filtersSet": [{
            "name": "prototype",
            "customFilter": [{
                "property": "code",
                "filterStmt": "^prototype"
            }]
        }],
    },
    "fields": [{
        "zoomModel": "@cellValue",
        "cellLink": True,
        "header": "code",

        "type": "string",
        "name": "code",
        "sortable": True
    }, {
        "header": "Descriptions",
        "vType": "plainText",
        "type": "text",
        "name": "description",

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

    }, {
        "header": "active",
        "type": "bool",
        "name": "active",

    }, {
        "header": "overWrite",
        "type": "bool",
        "name": "overWrite",

    }],
    "detailsConfig": [],
    "formConfig": {
        "__ptType": "formConfig",
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

