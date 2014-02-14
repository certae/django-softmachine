import django.contrib.admin

class usrProfileAdmin(django.contrib.admin.ModelAdmin):

    protoExt = {
    "__ptType": "pcl",
    "description": "User Profile",
    "viewEntity": "protoLib.UserProfile",
    "viewIcon": "icon-1",
    "metaVersion": "13.0111",
    "idProperty": "id",
    "viewCode": "protoLib.UserProfile",
    "shortTitle": "User Profile",
    "fields": [{
        "__ptType": "field",
        "name": "userSites",
        "header": "userSites"
    }, {
        "__ptType": "field",
        "fkField": "user",
        "hidden": True,
        "type": "foreignid",
        "name": "user_id",
        "readOnly": True
    }, {
        "__ptType": "field",
        "flex": 1,
        "name": "__str__",
        "fkId": "id",
        "zoomModel": "protoLib.UserProfile",
        "cellLink": True,
        "header": "User Profile",
        "readOnly": True,
        "type": "string"
    }, {
        "__ptType": "field",
        "fkField": "userTeam",
        "hidden": True,
        "type": "foreignid",
        "name": "userTeam_id",
        "readOnly": True
    }, {
        "__ptType": "field",
        "zoomModel": "auth.User",
        "name": "user",
        "fkId": "user_id",
        "required": True,
        "header": "user",

        "type": "foreigntext"
    }, {
        "__ptType": "field",
        "header": "ID",
        "readOnly": True,
        "type": "autofield",
        "name": "id",
        "hidden": True
    }, {
        "__ptType": "field",
        "zoomModel": "protoLib.TeamHierarchy",
        "name": "userTeam",
        "fkId": "userTeam_id",
        "header": "userTeam",
        "type": "foreigntext"
    }],
    "actions": [],
    "detailsConfig": [{
        "__ptType": "detailDef",
        "detailField": "userprofile__pk",
        "conceptDetail": "protoLib.UserProfile_userSites",
        "detailName": "userprofile",
        "menuText": "UserProfile_userSites",
        "masterField": "pk"
    }],
    "gridConfig": {
        "__ptType": "gridConfig",
        "listDisplay": ["user", "userTeam"],
        "baseFilter": [],
        "initialFilter": [],
        "initialSort": [],
        "searchFields": [],
        "sortFields": [],
        "hiddenFields": ["id"],
        "readOnlyFields": [],
    },
    "formConfig": {
        "__ptType": "formConfig",
        "items": [{
            "__ptType": "fieldset",
            "fsLayout": "2col",
            "items": [{
                "__ptType": "formField",
                "name": "user"
            }]
        }, {
            "__ptType": "fieldset",
            "fsLayout": "2col",
            "items": [{
                "__ptType": "formField",
                "name": "userTeam"
            }]
        }, {
            "__ptType": "fieldset",
            "fsLayout": "1col",
            "items": [{
                "__ptType": "formField",
                "name": "userSites"
            }]
        }]
    },
    "usrDefProps": {
        "__ptType": "usrDefProps"
    },
    "custom": {
        "__ptType": "custom",
        "filtersSet": [],
        "listDisplaySet": [],
        "sortersSet": []
    },
    "businessRules": {
        "__ptType": "businessRules"
    },
    "updateTime": "2013-01-28 07:56:18"
}
