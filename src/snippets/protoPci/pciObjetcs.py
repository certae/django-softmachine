'''
Created on 2014-02-11

@author: dario
'''

_METAVERSION = "140212"
_METAOBJECTS = {

    "pcl" : {
        "description" : "Meta definition",
        "properties" : ["viewCode", "viewEntity", "viewIcon", "description", "shortTitle", "localSort", "pageSize", "sheetSelector", "pciStyle", "helpPath", "idProperty", "jsonField", "returnField", "updateTime", "metaVersion", "userVersion", "protoEntity", "protoEntityId", "pciType"], 
        "roProperties" : ["viewCode", "viewEntity", "idProperty", "updateTime", "metaVersion", "protoEntity", "protoEntityId"], 
        "objects" : ["gridConfig", "gridSets", "formConfig", "usrDefProps", "custom", "businessRules"], 
        "lists" : ["fields", "fieldsBase", "fieldsAdm", "actions", "detailsConfig", "sheetConfig"],
    },

    "fields" : {
        "description" : "Store fields definition",
        "listOf" : "field"
    },

    "fieldsBase" : {
        "description" : "Base store fields definition",
        "listOf" : "field"
    },

    "fieldsAdm" : {
        "description" : "Admin store fields definition",
        "listOf" : "field"
    },

    "field" : {
        "description" : "A store field element",
        "properties" : ["name", "required", "prpLength", "prpScale",
                        "prpDefault", "fieldLabel", "format", "header", "sortable", "searchable", "flex",
                        "tooltip",
                        "cellLink", "wordWrap",
                        "primary", "crudType", "readOnly", "hidden",
                        "choices",
                        "fkId", "fkField", "cellLink", "zoomModel", "zoomFilter", "zoomMultiple",
                        "cpFromField", "cpFromZoom",
                        "physicalName", "type", "xtype", "vType"
                    ],
        "roProperties" : []
    },

    "formField" : {
        "description" : "A field element",
        "properties" : ["name", "tooltip", "fieldLabel", "labelWidth", "labelAlign", "hideLabel", "required", "readOnly", "hidden", "prpDefault",
        "format", "prpLength",
        "collapsed",
        "choices",
        "fkId", "fkField", "zoomModel", "zoomFilter", "zoomMultiple", "cellLink",
        "type", "xtype", "vType"],
        "roProperties" : ["type "]

    },

    "gridConfig" : {
        "description" : "Grid configuration properties",
        "properties" : ['hideRowNumbers',
        'gridSelectionMode', "exportCsv", 'hideSheet', 'denyAutoPrint', 'filterSetABC'],
        "lists" : ["listDisplay", "baseFilter", "initialFilter", "initialSort",
        "searchFields",
        "sortFields",
        "hiddenFields", "readOnlyFields"],
        "objects" : []
    },


    "colShortcuts" : {
        "description" : "Column configuration shortcuts",
        "lists" : ["searchFields",
        "sortFields",
        "hiddenFields", "readOnlyFields"
        ]
    },

    "gridSets" : {
        "description" : "Additional settings ( filters, sorters, userViews )",
        "lists" : ["listDisplaySet", "filtersSet", "sortersSet"]
    },

    "custom" : {
        "description" : "custom user configurations",
        "lists" : ["listDisplay", "listDisplaySet", "filtersSet", "sortersSet"]
    },

    "baseFilter" : {
        "description" : "Default defined filter. No user-modifiable, e.g. { \"status__exact\":\"0\" } ",
        "listOf" : "filterDef",
        "allowAdd" : True
    },

    "customFilter" : {
        "description" : "Predefined filter ",
        "listOf" : "filterDef",
        "allowAdd" : True
    },

    "initialFilter" : {
        "description" : "Initial filter  Ej: { \"status__exact\":\"0\" } ",
        "listOf" : "filterDef",
        "allowAdd" : True
    },

    "initialSort" : {
        "description" : "Default ordering  Ej: [{\"direction\":\"ASC\",\"property\":\"code\"}, ... ] ",
        "listOf" : "sorterDef",
        "allowAdd" : True
    },

    "sorterDef" : {
        "description" : "Sort definition",
        "addPrompt" : "Please enter the name of the property for your sorter:",
        "allowDel" : True,
        "nodeName" : "property",
        "properties" : ["property", "direction"]
    },

    "sortersSet" : {
        "description" : "Sorter set",
        "listOf" : "sortersSetDef",
        "allowAdd" : True
    },

    "sortersSetDef" : {
        "description" : "Sorter set definition",
        "addPrompt" : "Please enter the name of the sorter:",
        "allowDel" : True,
        "properties" : ["name", "description"],
        "lists" : ["customSort"]
    },

    "customSort" : {
        "description" : "User ordering",
        "listOf" : "sorterDef",
        "allowAdd" : True
    },

    "filterDef" : {
        "description" : "Predefined filter definition",
        "addPrompt" : "Please enter the name of the property for your filter:",
        "allowDel" : True,
        "nodeName" : "property",
        "properties" : ["property", "filterStmt"]
    },

    "filtersSet" : {
        "description" : "Predefined filter set ( *x*, ><=, !=,  aa:bb ) ",
        "listOf" : "filtersSetDef",
        "allowAdd" : True
    },

    "filtersSetDef" : {
        "description" : "Filter set definition",
        "addPrompt" : "Please enter the name of the filterSet:",
        "allowDel" : True,
        "properties" : ["name", "menuText"],
        "lists" : ["customFilter"]
    },

    "listDisplaySet" : {
        "description" : "Alternative configuration for the grid ( it appears under the icon 'ViewCols' of the main bar )",
        "listOf" : "listDisplayDef",
        "allowAdd" : True
    },

    "listDisplayDef" : {
        "description" : "Predefined column set (view)",
        "addPrompt" : "Please enter the name of the columnSet:",
        "allowDel" : True,
        "properties" : ["name", 'hideRowNumbers', "description"],
        "lists" : ["listDisplay"]

    },

    "hiddenFields" : {
        "description" : "List of hidden fields",
        "__ptStyle" : "colList"
    },

    "listDisplay" : {
        "description" : "List of fields to display in the grid",
        "addPrompt" : "Please enter the name for your alternative listDisplay:",
        "__ptStyle" : "colList"
    },

    "readOnlyFields" : {
        "description" : "List of fields to marked as ReadOnly ( the property ReadOnly can also be used )",
        "__ptStyle" : "colList"
    },

    "searchFields" : {
        "description" : "Search-enabled fields",
        "__ptStyle" : "colList"
    },

    "sortFields" : {
        "description" : "Order-enabled fields",
        "__ptStyle" : "colList"
    },

    "detailsConfig" : {
        "description" : "Details definition (Master-Detail relationship)",
        "listOf" : "detailDef",
        "allowAdd" : True
    },

    "detailDef" : {
        "description" : "Master-Detail relationship definition",
        "properties" : ["menuText", "conceptDetail", "masterField", "detailField", "detailName", "detailTitleLbl", "masterTitleField", "detailTitleField"],
        "addPrompt" : "Please enter the name for your detail:",
        "allowDel" : True

    },

    "usrDefProps" : {
        "description" : "User defined properties ( Fields created by the user, they do not participe in search and sort)",
        "properties" : ["udpTable", "propertyRef", "keyField", "propertyPrefix", "propertyName", "propertyValue"]
    },

    "sheetConfig" : {
        "description" : "Information templates in HTML that are fed by data from the database",
        "listOf" : "sheetDef",
        "allowAdd" : True
    },

    "sheetDef" : {
        "description" : "Templates definition ( the name is the selector )",
        "properties" : ["name", "template", "title", "viewIcon", "sheetType", "templateFp", "templateBb", "templateEr", "templateAb", "templateLp"],
        "lists" : ["sheetDetails"],
        "addPrompt" : "Please enter the name for your sheet:",
        "allowDel" : True
    },

    "sheetDetails" : {
        "description" : "Lista de detalles por hoja ( sheet )",
        "listOf" : "sheetDetail",
        "allowAdd" : True
    },

    "sheetDetail" : {
        "description" : "Sheet detail configuration",
        "properties" : ["name", "detailName", "detailSort", "templateBb", "templateEr", "templateAb"],
        "lists" : ["sheetDetails"],
        "addPrompt" : "Please enter the detailName:",
        "allowDel" : True
    },

    "formConfig" : {
        "hideItems" : True,
        "description" : "Form definition",
        "properties" : ["title", "tooltip", "height", "maxHeight", "minHeight", "width", "maxWidth", "minWidth", "viewIcon", "helpPath"]
    },

    "fieldset" : {
        "hideItems" : True,
        "description" : "A Fieldset, containing field elements",
        "properties" : ["title", "fsLayout", "autoscroll", "border", "collapsible", "collapsed", "labelWidth", "labelAlign", "hideLabel", "height", "maxHeight", "minHeight"
        ]
    },

    "htmlset" : {
        "hideItems" : True,
        "description" : "A Fieldset, containing HtmlField elements",
        "properties" : ["title", "collapsible", "collapsed", "flex", "height", "maxHeight", "minHeight"
        ]
    },

    "protoGrid" : {
        "description" : "A detail grid",
        "properties" : ["viewCode", "menuText", "height", "maxHeight", "minHeight", "minWidth"
        ]
    },

    "panel" : {
        "hideItems" : True,
        "description" : "A simple panel with fit layout",
        "properties" : ["title", "height", "maxHeight", "minHeight"
        ]
    },

    "tabpanel" : {
        "hideItems" : True,
        "description" : "A Tab Container with many tabs",
        "properties" : ["layout", "activeItem", "height", "maxHeight", "minHeight"
        ]
    },

    "actions" : {
        "description" : "Actions list (Actions menu)",
        "listOf" : "actionDef",
        "allowAdd" : True
    },

    "actionDef" : {
        "description" : "Actions definition (backend)",
        "properties" : ["name", "title", "actionType", "selectionMode", "refreshOnComplete"],
        "lists" : ["actionParams"],
        "addPrompt" : "Please enter the name for your action:",
        "allowDel" : True

    },

    "actionParams" : {
        "description" : "Actions definition parameters",
        "listOf" : "actionParam",
        "allowAdd" : True
    },

    "actionParam" : {
        "properties" : ["name", "tooltip", "fieldLabel", "prpDefault", "required", "readOnly", "format",
        "choices",
        "fkId", "fkField", "zoomModel", "zoomFilter", "cellLink",
        "type", "xtype", "vType"],
        "addPrompt" : "Action parameter",
        "allowDel" : True
    },

    "businessRules" : {
        "properties" : ["dblClick", "afterCellUpdate", "afterRowDelete", "afterSave", "beforeCellEdit", "beforeCellUpdate", "beforeRowDelete", "beforeRowInsert", "beforeOpSave", "beforeValidate", "zoomConfigure", "zoomReturn", "issRowLoad", "reposition", "getLinkFilter", "validationComplete"]
    },

    "businessRule" : {
        "properties" : ["name", "handler", "src", "type", "field"],
        "addPrompt" : "Action parameters",
        "allowDel" : True
    },

    "businessRulesText" : {
        "description" : "Business rules",
        "properties" : ["afterCellUpdate", "afterRowDelete", "BeforeCellEdit", "BeforeCellUpdate", "BeforeRowDelete", "BeforeRowInsert", "dblClick", "issZoomConfigure", "issBeforeVslidateVr", "issHelpReturn", "issRowLoad", "reposition", "getLinkFilter", "afterOpSave", "beforeOpSave", "issValidationComplete"]
    }

};