# -*- coding: utf-8 -*-

AdminUser = {
    "__ptType": "pcl",
    "viewCode": "auth.User",
    "description": "Utilisateur",
    "viewEntity": "auth.User",
    "viewIcon": "icon-1",
    "shortTitle": "Utilisateur",
    "metaVersion": "13.0111",
    "idProperty": "id",
    "updateTime": "2013-02-13 13:21:30",
    "fields": [{
        "__ptType": "field",
        "sortable": True,
        "name": "username",
        "searchable": True,
        "header": "nom d\'utilisateur",
        "type": "string"
    }, {
        "__ptType": "field",
        "header": "prénom",
        "sortable": True,
        "type": "string",
        "name": "first_name",
        "searchable": True
    }, {
        "__ptType": "field",
        "header": "nom",
        "sortable": True,
        "type": "string",
        "name": "last_name",
        "searchable": True
    }, {
        "__ptType": "field",
        "flex": 1,
        "sortable": True,
        "name": "__str__",
        "fkId": "id",
        "zoomModel": "auth.User",
        "cellLink": True,
        "header": "Utilisateur",
        "readOnly": True,
        "type": "string",
    }, {
        "__ptType": "field",
        "header": "statut équipe",
        "sortable": True,
        "type": "bool",
        "name": "is_staff",
        "searchable": True
    }, {
        "__ptType": "field",
        "header": "adresse électronique",
        "sortable": True,
        "type": "string",
        "name": "email",
        "searchable": True
    }, {
        "__ptType": "field",
        "header": "actif",
        "sortable": True,
        "type": "bool",
        "name": "is_active",
        "searchable": True
    }, {
        "__ptType": "field",
        "header": "statut super-utilisateur",
        "sortable": True,
        "type": "bool",
        "name": "is_superuser",
        "searchable": True
    }, {
        "__ptType": "field",
        "name": "user_permissions",
        "header": "permissions de l\'utilisateur",

    }, {
        "__ptType": "field",
        "sortable": True,
        "name": "last_login",
        "searchable": True,
        "required": True,
        "header": "dernière connexion",
        "type": "datetime",

    }, {
        "__ptType": "field",
        "sortable": True,
        "name": "date_joined",
        "searchable": True,
        "required": True,
        "header": "date d\'inscription",
        "type": "datetime",

    }],
    "actions": [],
    "detailsConfig": [{
        "__ptType": "detailDef",
        "menuText": "Message.user",
        "conceptDetail": "auth.Message",
        "detailName": "user",
        "detailField": "user__pk",
        "masterField": "pk"
    }, {
        "__ptType": "detailDef",
        "menuText": "Logentry.user",
        "conceptDetail": "admin.LogEntry",
        "detailName": "user",
        "detailField": "user__pk",
        "masterField": "pk"
    }, {
        "__ptType": "detailDef",
        "menuText": "Userprofile.user",
        "conceptDetail": "protoLib.UserProfile",
        "detailName": "user",
        "detailField": "user__pk",
        "masterField": "pk"
    }, {
        "__ptType": "detailDef",
        "menuText": "Usershare.user",
        "conceptDetail": "protoLib.UserShare",
        "detailName": "user",
        "detailField": "user__pk",
        "masterField": "pk"
    }, {
        "__ptType": "detailDef",
        "detailField": "user__pk",
        "conceptDetail": "auth.User_groups",
        "detailName": "user",
        "menuText": "User_groups",
        "masterField": "pk"
    }, {
        "__ptType": "detailDef",
        "detailField": "user__pk",
        "conceptDetail": "auth.User_user_permissions",
        "detailName": "user",
        "menuText": "User_user_permissions",
        "masterField": "pk"
    }],
    "sheetConfig": [],
    "gridConfig": {
        "__ptType": "gridConfig",
        "listDisplay": ["username", "email", "first_name", "last_name", "is_staff", "is_active", "is_superuser"],
        "baseFilter": [],
        "initialFilter": [],
        "initialSort": [],
        "searchFields": ["username", "first_name", "last_name", "password", "is_staff", "is_active", "is_superuser", "last_login", "date_joined"],
        "sortFields": ["username", "first_name", "last_name", "password", "is_staff", "is_active", "is_superuser", "last_login", "date_joined"],
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
                "name": "username"
            }]
        }, {
            "__ptType": "fieldset",
            "fsLayout": "2col",
            "title": "Information personnelle",
            "items": [{
                "__ptType": "formField",
                "name": "first_name"
            }, {
                "__ptType": "formField",
                "name": "last_name"
            }, {
                "__ptType": "formField",
                "name": "email"
            }]
        }, {
            "__ptType": "fieldset",
            "fsLayout": "2col",
            "title": "Permissions",
            "items": [{
                "__ptType": "formField",
                "name": "is_active"
            }, {
                "__ptType": "formField",
                "name": "is_staff"
            }, {
                "__ptType": "formField",
                "name": "is_superuser"
            }]
        }, {
            "__ptType": "fieldset",
            "fsLayout": "2col",
            "title": "Dates importantes",
            "items": [{
                "__ptType": "formField",
                "name": "last_login"
            }, {
                "__ptType": "formField",
                "name": "date_joined"
            }]
        }]
    },
    "custom": {
        "filtersSet": [],
        "listDisplaySet": [],
        "sortersSet": []
    }
}
