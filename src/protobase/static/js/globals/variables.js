/*
 *  Global variables
 *
 */

// Grid row state
_SM._ROW_ST = {
    REFONLY: 'REF_ONLY',
    ERROR: 'ROWST_ERR',
    NEWROW: 'ROWST_NEW'
};

// Strings and messages moved to locale
_SM.__language = {};

// Config Variables
_SM._PConfig = {
    urlMenu: 'protoLib/protoGetMenuData/',
    urlGetPCI: 'protoLib/protoGetPCI/',
    urlSaveProtoObj: 'protoLib/protoSaveProtoObj/',
    urlGetFieldTree: 'protoLib/protoGetFieldTree/',
    urlGetDetailsTree: 'protoLib/protoGetDetailsTree/',
    urlGetUserRights: 'protoLib/protoGetUserRights/',
    urlGetPasswordRecovery: 'protoLib/protoGetPasswordRecovery/',
    urlSubmitChangePassword: 'protoLib/submitChangePassword/',
    urlGetSheetReport: 'protoLib/sheetConfigRep/',
    urlGetProtoCsv: 'protoLib/protoCsv/',
    urlDoAction: 'protoLib/protoDoActions/',
    urlHelpQbe: 'protoLib/protoGetHelpQbe/',
    urlLogOut: 'protoLib/protoLogout/',
    urlGetNextIncrement: 'protoLib/getFieldIncrement/',
    urlLoadFile: 'protoLib/loadFile/',
    urlGetEntitiesJSONDiagram: 'protoDiagram/getEntitiesJSONDiagram/',
    synchDBFromDiagram: 'protoDiagram/synchDBFromDiagram/',
    synchDiagramFromDB: 'protoDiagram/synchDiagramFromDB/',
    getElementsDiagramFromSelectedTables: 'protoDiagram/getElementsDiagramFromSelectedTables/',
    getDefaultDiagram: 'protoDiagram/getDefaultDiagram/',
    saveDiagram: 'protoDiagram/saveDiagram/',
    openDiagram: 'protoDiagram/openDiagram/',
    createDiagram: 'protoDiagram/createDiagram/',
    listDiagrams: 'protoDiagram/listDiagrams/',
    updateDiagram: 'protoDiagram/updateDiagram/',
    deleteDiagram: 'protoDiagram/deleteDiagram/',

    clsBaseModel: 'ProtoUL.model.'
};

// Collection of PCL's ( Proto Concept Definition )
_SM._cllPCI = {};

_SM._gridTypeEditor = {
    'int': 'numberfield',
    'float': 'numberfield',
    'string': 'textfield',
    'text': 'textarea',
    'date': 'datefield',
    'boolean': 'checkbox'
};

// PageSize par default
_SM._PAGESIZE = 50;

_SM._ComboPageSize = [['25'], ['50'], ['100'], ['500']];

// Autoload entites
_SM._AUTOLOAD_PCI = [];
_SM._MENU_COLLAPSED = false;

_SM._defaultViewIcon = 'default_view';

// Windows Position
_SM._mainWin = null;
_SM._winX = 10;
_SM._winY = 10;

// *  Configuracion del metodo por defecto
// Ext.data.Connection.prototype.method = 'POST';
// Ext.data.Connection.method = 'POST';

_SM.DesignerPanels = {
    "tbar": [{
        "tooltip": "Update definition",
        "iconCls": "icon-save",
        "itemId": "save"
    }, {
        "iconCls": "icon-update",
        "tooltip": "Redraw",
        "itemId": "redraw"

    }, "-", {
        "tooltip": "Delete curren node",
        "iconCls": "icon-nodeDelete",
        "disabled": false,
        "itemId": "delete"

    }, "->", {
        "iconCls": "icon-error",
        "tooltip": "Show or hide(clear) error tab",
        "itemId": "error",
        "hidden": true,
        "enableToggle": true,
        "errors": [],
        "errorCount": 0,
        "maxErrors": 60
    }],

    "toolsTabs": [{
        "xtype": "tabpanel",
        "activeTab": 0,
        "border": false,
        "defaults": {
            "layout": "fit"
        },
        "items": [{
            "title": "Tools",
            "itemId": "toolsTree",
            "tooltip": "Design your ui by selecting elements from this tab",
            "layout": "fit",
            "autoScroll": true
        }, {
            "title": "Properties",
            "tooltip": "Object properties",
            "itemId": "properties",
            "autoScroll": true,
            "border": false
        }]
    }],

    // ----------------------------------------------------------------------------

    "toolsTree": [{
        "text": "Fields",
        "children": []
    }, {

        "text": "Containers",
        "children": [{
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

        }]
    }, {
        "text": "Details",
        "children": []
    }, {
        "text": "DetailsButtons",
        "children": []
    }]
}; 