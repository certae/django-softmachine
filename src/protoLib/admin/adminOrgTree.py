import django.contrib.admin

class orgTreeAdmin(django.contrib.admin.ModelAdmin):

    protoExt = {
    "__ptType": "pcl",
    "description": "Organisation Tree",
    "viewEntity": "protoLib.TeamHierarchy",
    "viewIcon": "icon-1",
    "metaVersion": "13.0111",
    "idProperty": "id",
    "viewCode": "protoLib.TeamHierarchy",
    "shortTitle": "Organisation Tree",
    "fields": [{
        "__ptType": "field",
        "header": "code",
        "required": True,
        "type": "string",
        "name": "code",

        "sortable": True
    }, {
        "__ptType": "field",
        "header": "Descriptions",
        "vType": "plainText",
        "type": "text",
        "name": "description",

        "sortable": True
    }, {
        "__ptType": "field",
        "flex": 1,
        "name": "__str__",
        "fkId": "id",
        "zoomModel": "protoLib.TeamHierarchy",
        "cellLink": True,
        "header": "Organisation Tree",
        "readOnly": True,
        "type": "string"
    }, {
        "__ptType": "field",
        "fkField": "site",
        "hidden": True,
        "type": "foreignid",
        "name": "site_id",
        "readOnly": True
    }, {
        "__ptType": "field",
        "zoomModel": "sites.Site",
        "name": "site",
        "fkId": "site_id",
        "required": True,
        "header": "site",

        "type": "foreigntext"
    }, {
        "__ptType": "field",
        "zoomModel": "protoLib.TeamHierarchy",
        "name": "parentNode",
        "fkId": "parentNode_id",
        "header": "parentNode",

        "type": "foreigntext"
    }, {
        "__ptType": "field",
        "fkField": "parentNode",
        "hidden": True,
        "type": "foreignid",
        "name": "parentNode_id",
        "readOnly": True
    }, {
        "__ptType": "field",
        "header": "ID",
        "readOnly": True,
        "type": "autofield",
        "name": "id",

        "hidden": True
    }],
    "actions": [],
    "detailsConfig": [{
        "__ptType": "detailDef",
        "menuText": "TeamHierarchy.parentNode",
        "conceptDetail": "protoLib.TeamHierarchy",
        "detailName": "parentNode",
        "detailField": "parentNode__pk",
        "masterField": "pk"
    }, {
        "__ptType": "detailDef",
        "menuText": "Userprofile.userTeam",
        "conceptDetail": "protoLib.UserProfile",
        "detailName": "userTeam",
        "detailField": "userTeam__pk",
        "masterField": "pk"
    }],
    "gridConfig": {
        "__ptType": "gridConfig",
        "listDisplay": ["code", "description", "site", "parentNode"],
        "baseFilter": [],
        "initialFilter": [],
        "initialSort": [],
        "searchFields": ["code", "description", "site", "parentNode"],
        "sortFields": ["code", "description"],
        "hiddenFields": ["id"],
        "readOnlyFields": ["__str__"],
    },
    "formConfig": {
        "__ptType": "formConfig",
        "items": [{
            "__ptType": "fieldset",
            "fsLayout": "2col",
            "items": [{
                "__ptType": "formField",
                "name": "code"
            }, {
                "__ptType": "formField",
                "name": "site"
            }]
        }, {
            "__ptType": "fieldset",
            "fsLayout": "2col",
            "items": [{
                "__ptType": "formField",
                "name": "parentNode"
            }]
        }, {
            "__ptType": "fieldset",
            "fsLayout": "1col",
            "items": [{
                "__ptType": "formField",
                "name": "description"
            }]
        }]
    },
    "updateTime": "2013-01-28 07:46:04"
}
