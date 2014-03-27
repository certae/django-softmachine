#
#  Variables Globales
#
from pciObjects import _METAVERSION

SM = {};

# Estados en cada fila de la grilla al iteractuar con el BackEnd
SM_ROW_ST = {
    'REFONLY'   : 'REF_ONLY',
    'ERROR'     : 'ROWST_ERR',
    'NEWROW'    : 'ROWST_NEW'
   }

# afterLabelTextTpl: SM_requiredField,
SM_requiredField = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

SM_versionProto = 'Version 1.00.' + _METAVERSION;
SM_siteTitle = 'CeRTAE';
SM_siteTitleCollapsed = False;

# Strings and messages moved to locale
SM__language = {};

# Config Variables
SM_PConfig =  {
    'urlMenu' : 'protoLib/protoGetMenuData/',
    'urlGetPCI' : 'protoLib/protoGetPCI/',
    'urlSaveProtoObj' : 'protoLib/protoSaveProtoObj/',
    'urlGetFieldTree' : 'protoLib/protoGetFieldTree/',
    'urlGetDetailsTree' : 'protoLib/protoGetDetailsTree/',
    'urlGetUserRights' : 'protoLib/protoGetUserRights/',
    'urlGetPasswordRecovery' : 'protoLib/protoGetPasswordRecovery/', 
    'urlSubmitChangePassword' : 'protoLib/submitChangePassword/',
    'urlGetSheetReport' : 'protoLib/sheetConfigRep/',
    'urlGetProtoCsv' : 'protoLib/protoCsv/',
    'urlDoAction' : 'protoLib/protoDoActions/',
    'urlHelpQbe': 'protoLib/protoGetHelpQbe/',
    'urlLogOut': 'protoLib/protoLogout/',
    'urlGetNextIncrement': 'protoLib/getFieldIncrement/',

    'clsBaseModel': 'ProtoUL.model.'
};

SM_HELPpath = 'resources/help/index.html'


# Collection of PCL's ( Proto Concept Definition )
SM_cllPCI = {}


# Define los tipos para el manejo de edicion  (type => xtype)
SM_gridTypeEditor = {
    'int'   : 'numberfield',
    'float'  : 'numberfield',
    'string' : 'textfield',
    'text'   : 'textarea',
    'date'  : 'datefield',
    'boolean' : 'checkbox'
};

# PageSize par default
SM_PAGESIZE = 50

SM_ComboPageSize = [
                  ['25'],
                  ['50'],
                  ['100'],
                  ['500']
            ]


# Autoload entites
# SM_AUTOLOAD_PCI = [ 'protoDict.Model', 'protoDict.PropertyModel' ]
SM_AUTOLOAD_PCI = [ ]
SM_MENU_COLLAPSED = False 


SM_defaultViewIcon = 'default_view'

# Windows Position
SM_mainWin = None
SM_winX = 10
SM_winY = 10


# *  Configuracion del metodo por defecto
# Ext.data.Connection.prototype.method = 'POST';
# Ext.data.Connection.method = 'POST';


SMDesignerPanels = {
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
        "disabled": False,
        "itemId" : "delete"


    },"->",{
        "iconCls" : "icon-error",
        "tooltip" : "Show or hide(clear) error tab",
        "itemId" : "error",
        "hidden" : True,
        "enableToggle" : True,
        "errors" : [],
        "errorCount" : 0,
        "maxErrors" : 60
#    },{
#        "iconCls" : "icon-options",
#        "itemId"  : "options",
#        "tooltip" : "Show options"
#    },{
#        "iconCls" : "icon-help",
#        "itemId"  : "help",
#        "tooltip" : "Show help"
    }
    ],


"toolsTabs" : [{
        "xtype" : "tabpanel",
        "activeTab" : 0,
        "border" : False,
        "defaults": { "layout" : "fit" },
        "items" : [{
            "title" : "Tools",
            "itemId" : "toolsTree",
            "tooltip" : "Design your ui by selecting elements from this tab",
            "layout" : "fit",
            "autoScroll": True
        },
        {
            "title" : "Properties",
            "tooltip" : "Object properties",
            "itemId" : "properties",
            "autoScroll": True,
            "border" : False
        }]
    }],


# ----------------------------------------------------------------------------


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
}

