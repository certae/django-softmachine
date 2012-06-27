a = {
    "gridConfig" : {
        "searchFields" : [],
        "baseFilter" : {},
        "hideRowNumbers" : false,
        "listDisplay" : ["nom", "famille", "typeLogiciel", "editeur"],
        "hiddenFields" : ["__str__", "id"],
        "filtersSet" : [],
        "listDisplaySet" : {},
        "readOnlyFields" : [],
        "sortFields" : [],
        "initialSort" : [],
        "initialFilter" : {}
    },
    "sheetConfig" : {
        "protoSheets" : {},
        "protoSheetSelector" : "",
        "protoSheetProperties" : []
    },
    "protoOption" : "TCO.Logiciel",
    "protoMenuIx" : 1,
    "shortTitle" : "Logiciel",
    "protoConcept" : "TCO.Logiciel",
    "protoIcon" : "icon-3",
    "fields" : [{
        "header" : "Categorie",
        "type" : "string",
        "name" : "categorie",
        "fromModel" : true
    }, {
        "header" : "Commentaire",
        "type" : "string",
        "name" : "commentaire",
        "fromModel" : true
    }, {
        "header" : "Cout de Introduction",
        "defaultValue" : 0,
        "type" : "decimal",
        "name" : "coutDeIntroduction",
        "fromModel" : true
    }, {
        "header" : "description",
        "type" : "string",
        "name" : "description",
        "fromModel" : true
    }, {
        "header" : "Duree cycle",
        "defaultValue" : 3,
        "type" : "int",
        "name" : "dureeCycle",
        "fromModel" : true
    }, {
        "header" : "Editeur",
        "type" : "string",
        "name" : "editeur",
        "fromModel" : true
    }, {
        "zoomModel" : "TCO.Famille",
        "name" : "famille",
        "fkId" : "famille_id",
        "header" : "famille",
        "fromModel" : true,
        "type" : "foreigntext",
        "allowBlank" : false
    }, {
        "fkField" : "famille",
        "header" : "famille_id",
        "readOnly" : true,
        "type" : "foreignid",
        "name" : "famille_id"
    }, {
        "header" : "Fonction",
        "type" : "string",
        "name" : "fonction",
        "fromModel" : true
    }, {
        "header" : "Nature",
        "type" : "string",
        "name" : "nature",
        "fromModel" : true
    }, {
        "header" : "Nom",
        "type" : "string",
        "name" : "nom",
        "fromModel" : true
    }, {
        "zoomModel" : "TCO.TypeLogiciel",
        "name" : "typeLogiciel",
        "fkId" : "typeLogiciel_id",
        "header" : "typeLogiciel",
        "fromModel" : true,
        "type" : "foreigntext",
        "allowBlank" : false
    }, {
        "fkField" : "typeLogiciel",
        "header" : "typeLogiciel_id",
        "readOnly" : true,
        "type" : "foreignid",
        "name" : "typeLogiciel_id"
    }, {
        "header" : "metaDescription",
        "readOnly" : true,
        "type" : "string",
        "hidden" : true,
        "name" : "__str__"
    }],
    "protoMenuOpt" : "Base",
    "protoUdp" : {},
    "helpPath" : "",
    "protoDetails" : [{
        "menuText" : "Compositionimage:logiciel",
        "conceptDetail" : "TCO.CompositionImage",
        "detailField" : "logiciel__pk",
        "masterField" : "pk"
    }, {
        "menuText" : "Coutannuel:logiciel",
        "conceptDetail" : "TCO.CoutAnnuel",
        "detailField" : "logiciel__pk",
        "masterField" : "pk"
    }, {
        "menuText" : "Discussionlogiciel:logiciel",
        "conceptDetail" : "TCO.DiscussionLogiciel",
        "detailField" : "logiciel__pk",
        "masterField" : "pk"
    }, {
        "menuText" : "Equivalence:logiciel",
        "conceptDetail" : "TCO.Equivalence",
        "detailField" : "logiciel__pk",
        "masterField" : "pk"
    }, {
        "menuText" : "Sources:logiciel",
        "conceptDetail" : "TCO.Sources",
        "detailField" : "logiciel__pk",
        "masterField" : "pk"
    }, {
        "menuText" : "Specificationlogiciel:Logiciel",
        "conceptDetail" : "TCO.SpecificationLogiciel",
        "detailField" : "Logiciel__pk",
        "masterField" : "pk"
    }, {
        "menuText" : "Tco:Logiciel",
        "conceptDetail" : "TCO.TCO",
        "detailField" : "Logiciel__pk",
        "masterField" : "pk"
    }],
    "protoForm" : [{
        "items" : [{
            "name" : "categorie",
            "__ptType" : "formField"
        }, {
            "name" : "famille",
            "__ptType" : "formField"
        }, {
            "name" : "nom",
            "__ptType" : "formField"
        }, {
            "name" : "typeLogiciel",
            "__ptType" : "formField"
        }],
        "__ptType" : "fieldset",
        "title" : "Base"
    }, {
        "items" : [{
            "name" : "commentaire",
            "__ptType" : "formField"
        }, {
            "name" : "coutDeIntroduction",
            "__ptType" : "formField"
        }, {
            "name" : "description",
            "__ptType" : "formField"
        }, {
            "name" : "dureeCycle",
            "__ptType" : "formField"
        }, {
            "name" : "editeur",
            "__ptType" : "formField"
        }, {
            "name" : "fonction",
            "__ptType" : "formField"
        }, {
            "name" : "nature",
            "__ptType" : "formField"
        }],
        "collapsible" : true,
        "__ptType" : "fieldset",
        "title" : "Description"
    }],
    "idProperty" : "id",
    "description" : "Logiciel"
}