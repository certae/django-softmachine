/*
 *  Variables Globales
 *
 */

_SM = {};

// Estados en cada fila de la grilla al iteractuar con el BackEnd
_SM._ROW_ST = {
    REFONLY   : 'REF_ONLY',
    ERROR     : 'ROWST_ERR',
    NEWROW     : 'ROWST_NEW'
   };

// afterLabelTextTpl: _SM._requiredField,
_SM._requiredField = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

_SM._versionProto = 'Version 1.00.' + _versionMeta;
_SM._siteTitle = 'CeRTAE';
_SM._siteTitleCollapsed = false;

// Strings and messages moved to locale
_SM.__language = {};

// Config Variables
_SM._PConfig =  {
    urlMenu         : 'protoLib/protoGetMenuData/',
    urlGetPCI         : 'protoLib/protoGetPCI/',
    urlSaveProtoObj         : 'protoLib/protoSaveProtoObj/',
    urlGetFieldTree : 'protoLib/protoGetFieldTree/',
    urlGetDetailsTree : 'protoLib/protoGetDetailsTree/',
    urlGetUserRights : 'protoLib/protoGetUserRights/',
    urlGetPasswordRecovery : 'protoLib/protoGetPasswordRecovery/', 
    urlSubmitChangePassword : 'protoLib/submitChangePassword/',
    urlGetSheetReport : 'protoLib/sheetConfigRep/',
    urlGetProtoCsv : 'protoLib/protoCsv/',
    urlDoAction   : 'protoLib/protoDoActions/',
    urlHelpQbe: 'protoLib/protoGetHelpQbe/',
    urlLogOut:  'protoLib/protoLogout/',
    urlGetNextIncrement: 'protoLib/getFieldIncrement/',
    urlGetEntitiesJSONDiagram: 'protoLib/getEntitiesJSONDiagram/',
    synchDBFromDiagram: 'protoLib/synchDBFromDiagram/',
    synchDiagramFromDB: 'protoLib/synchDiagramFromDB/',
    getElementsDiagramFromSelectedTables: 'protoLib/getElementsDiagramFromSelectedTables/',

    clsBaseModel: 'ProtoUL.model.'
};

_SM._HELPpath = 'resources/help/index.html';


// Collection of PCL's ( Proto Concept Definition )
_SM._cllPCI = {};


// Define los tipos para el manejo de edicion  (type => xtype)
_SM._gridTypeEditor = {
    'int'   : 'numberfield',
    'float'  : 'numberfield',
    'string' : 'textfield',
    'text'   : 'textarea',
    'date'  : 'datefield',
    'boolean' : 'checkbox'
};

// PageSize par default
_SM._PAGESIZE = 50;

_SM._ComboPageSize = [
                  ['25'],
                  ['50'],
                  ['100'],
                  ['500']
            ];


// Autoload entites
// _SM._AUTOLOAD_PCI = [ 'protoDict.Model', 'protoDict.PropertyModel' ]
_SM._AUTOLOAD_PCI = [ ];
_SM._MENU_COLLAPSED = false ;


_SM._defaultViewIcon = 'default_view';


// Windows Position
_SM._mainWin = null;
_SM._winX = 10;
_SM._winY = 10;


// *  Configuracion del metodo por defecto
// Ext.data.Connection.prototype.method = 'POST';
// Ext.data.Connection.method = 'POST';


_SM.DesignerPanels = {
"tbar" : [{
        "tooltip" : "Update definition",
        "iconCls" : "icon-save",
        "itemId" : "save"
    },{
        "iconCls" : "icon-update",
        "tooltip" : "Redraw",
        "itemId" : "redraw"

    },"-",{
        "tooltip" : "Delete curren node",
        "iconCls" : "icon-nodeDelete",
        "disabled": false,
        "itemId" : "delete"


    },"->",{
        "iconCls" : "icon-error",
        "tooltip" : "Show or hide(clear) error tab",
        "itemId" : "error",
        "hidden" : true,
        "enableToggle" : true,
        "errors" : [],
        "errorCount" : 0,
        "maxErrors" : 60
//    },{
//        "iconCls" : "icon-options",
//        "itemId"  : "options",
//        "tooltip" : "Show options"
//    },{
//        "iconCls" : "icon-help",
//        "itemId"  : "help",
//        "tooltip" : "Show help"
    }
    ],


"toolsTabs" : [{
        "xtype" : "tabpanel",
        "activeTab" : 0,
        "border" : false,
        "defaults": { "layout" : "fit" },
        "items" : [{
            "title" : "Tools",
            "itemId" : "toolsTree",
            "tooltip" : "Design your ui by selecting elements from this tab",
            "layout" : "fit",
            "autoScroll": true
        },
        {
            "title" : "Properties",
            "tooltip" : "Object properties",
            "itemId" : "properties",
            "autoScroll": true,
            "border" : false
        }]
    }],


// ----------------------------------------------------------------------------


"toolsTree" : [
        {
            "text": "Fields",
            "children": []
        }, {

        "text": "Containers",
        "children": [
            {
                "text": "fieldset",
                "qtip": "A Fieldset, containing other form elements",
                "__ptType": "fieldset",
                "children": [],
                "__ptConfig": {
                    "__ptType": "fieldset"
                }
            }, {
                "text": "htmlset",
                "qtip": "A Fieldset, containing HML elements",
                "__ptType": "htmlset",
                "children": [],
                "__ptConfig": {
                    "__ptType": "htmlset"
                }

            }
        ]
    }, {
        "text": "Details",
        "children": []
    }, {
        "text": "DetailsButtons",
        "children": []
    }]
};


/* ********   Propiedades comunes
    maxHeight
    minHeight
    Height

    maxWidth
    minWidth
    width
 */


// --------------  Containers

            // }, {
                // "text": "Panel",
                // "qtip": "A simple panel with default layout",
                // "__ptType" : "panel",
                // "children": [],
                // "__ptConfig": {
                    // "layout": "fit",
                    // "xtype": "panel",
                    // "__ptType" : "panel"
                // }
            // }, {
                // "text": "Tab Container",
                // "qtip": "A panel with many tabs",
                // "__ptType": "tabpanel",
                // "children": [],
                // "__ptConfig": {
                    // "__ptType" : "tabpanel",
                    // "layout": "fit",
                    // "title": "",
                    // "activeItem": 0
                // }
            // }, {
                // "text": "Tab Panel",
                // "qtip": "A tab panel",
                // "__ptType": "tab",
                // "children": [],
                // "__ptConfig": {
                    // "__ptType": "tab",
                    // "layout": "fit",
                    // "title": ""
                // }
            // }, {
                // "text": "Accordion Panel",
                // "qtip": "Layout as accordion",
                // "__ptType": "accordion",
                // "children": [],
                // "__ptConfig": {
                    // "__ptType" : "accordion",
                    // "layout": "fit",
                    // "title": "",
                    // "activeItem": 0
                // }
            // }, {
                // "text": "fieldcontainer",
                // "qtip": "A Fieldset, containing field elements",
                // "__ptType": "fieldcontainer",
                // "children": [],
                // "__ptConfig": {
                    // "__ptType": "fieldcontainer"
                    // }


// -----------  Details

    // }, {
        // "text": "Others",
        // "children": [
            // {
                // "text": "Label",
                // "qtip": "A textlabel",
                // "leaf": true,
                // "__ptConfig": {
                    // "xtype": "label",
                    // "text": "Label"
                // }
            // }, {
                // "text": "Button",
                // "qtip": "A button",
                // "leaf": true,
                // "__ptConfig": {
                    // "xtype": "button",
                    // "text": "Ok"
                // }
            // }
        // ]
        