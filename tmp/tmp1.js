a = [{
    "autoscroll" : true,
    "xtype" : "fieldset",
    "__ptType" : "fieldset",
    "title" : "Description",
    "items" : [{
        "labelAlign" : "left",
        "allowBlank" : true,
        "fieldLabel" : "description",
        "__ptType" : "formField",
        "xtype" : "textfield",
        "name" : "0"
    }, {
        "labelAlign" : "left",
        "allowBlank" : true,
        "fieldLabel" : "Commentaire",
        "__ptType" : "formField",
        "xtype" : "textfield",
        "name" : "7"
    }],
    "defaultType" : "textfield",
    "layout" : "column",
    "defaults" : {
        "padding" : "2 2"
    },
    "fieldDefaults" : {}
}, {
    "xtype" : "panel",
    "layout" : "fit",
    "__ptType" : "panel",
    "items" : [{
        "xtype" : "protoGrid",
        "menuText" : "Equivalence:logiciel",
        "protoOption" : "TCO.Equivalence",
        "masterField" : "pk",
        "detailField" : "logiciel__pk",
        "detailTitleLbl" : null,
        "detailTitlePattern" : null,
        "__ptType" : "protoGrid",
        "name" : "0",
        "items" : []
    }]
}]