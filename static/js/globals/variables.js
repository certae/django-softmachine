/*
 *  Variables Globales  
 *  
 */

// Estados en cada fila de la grilla al iteractuar con el BackEnd  
_ROW_ST = { 
    ERROR     : 'ROWST_ERR',
    NEWROW     : 'ROWST_NEW'
    }

// afterLabelTextTpl: _requiredField,
_requiredField = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';


// _siteTitle = 'ART Atelier de Référentiel pour Togaf'_versionMeta = '12.1108'
_versionProto = 'Version 1.00.' + _versionMeta
_siteTitle = 'Promigas S.A. E.S.P.'
_siteTitleCollapsed = false 

_detailViewNewTab = __language.Msg_View_In_New_Tab
_gridBbPerPage = __language.Label_Pagging_by_Page
_gridBbShow = __language.Label_Pagging_Result
_gridBbOf = __language.Label_Pagging_From
_gridBbPage = __language.Label_Pagging_Page

_gridFirstText = __language.Label_Pagging_First_Page,
_gridNextText = __language.Label_Pagging_Next_Page,
_gridPrevText = __language.Label_Pagging_Previous_Page,
_gridLastText = __language.Label_Pagging_Last_Page,
_gridRefreshText = __language.Text_Button_Upd_Grid,

    
_tbSearchClearFilter = __language.Text_Toolbar_Remove_Filters
    
//user_prueba

_UserInfo = {
    fullName: __language.Text_UserInfo_Fullname,
    userName: ""

};
    
// Config Variables 
_PConfig =  {
    urlMenu         : 'protoLib/protoGetMenuData/', 
    urlGetPCI         : 'protoLib/protoGetPCI/', 
    urlSavePCI         : 'protoLib/protoSavePCI/', 
    urlGetFieldTree : 'protoLib/protoGetFieldTree/', 
    urlGetDetailsTree : 'protoLib/protoGetDetailsTree/', 
    urlGetUserRights : 'protoLib/protoGetUserRights/', 
    urlGetSheetReport : 'protoLib/protoSheetRep/', 
    urlGetProtoCsv : 'protoLib/protoCsv/', 
    urlDoAction   : 'protoLib/protoDoActions/', 
    urlHelpQbe: 'protoLib/protoGetHelpQbe/',
   
    clsBaseModel: 'ProtoUL.model.' 
}; 

__HELPpath = '/resources/help/index.html'


// Globally changing the text of Cancel and Save buttons;

Ext.grid.RowEditor.prototype.saveBtnText = 'Enregistrer'; 
Ext.grid.RowEditor.prototype.cancelBtnText = 'Canceler';


// Collection of PCL's ( Proto Concept Definition )  

_cllPCI = [];


// Define los tipos para el manejo de edicion  (type => xtype)
_gridTypeEditor = {
    'int'   : 'numberfield',
    'float'  : 'numberfield',
    'string' : 'textfield',
    'text'   : 'textarea',
    'date'  : 'datefield',
    'boolean' : 'checkbox'
};

// PageSize par default 
_PAGESIZE = 50; 

_ComboPageSize = [
                  ['25'],
                  ['50'],
                  ['100'],
                  ['500']
            ]; 
            

// Autoload entites
// _AUTOLOAD_PCI = [ 'protoDict.Model', 'protoDict.PropertyModel' ]
_AUTOLOAD_PCI = [ ]
_MENU_COLLAPSED = false 

// ProtoUL.view.ProtoMasterDetail 
_ComboFilterOp = []

// _ComboFilterOp = [
            // ['iexact', __language.Text_ComboFilterOp_Equal],
            // ['icontains', __language.Text_ComboFilterOp_Containing],
            // ['iendswith', __language.Text_ComboFilterOp_Finishing],
            // ['istartswith', __language.Text_ComboFilterOp_Starting],
            // ['--', ''],
            // ['gt', __language.Text_ComboFilterOp_PlusThan],
            // ['gte', __language.Text_ComboFilterOp_PlusEqualThan],
            // ['lt', __language.Text_ComboFilterOp_LessThan],
            // ['lte', __language.Text_ComboFilterOp_LessEqualThan],
            // ['range', '(..)'],
            // ['in', '(_,_)'],
            // ['--', ''],
            // ['day', 'jour'],
            // ['month', 'mois'],
            // ['week_day', 'jour de la semaine'],
            // ['year', 'année
            // ['--', ''],
            // ['isnull', __language.Text_ComboFilterOp_Null_Value], 
            // ['iregex', 'regex'],
    // ]; 
 

_defaultViewText = __language.Text_Default_view;
_defaultViewIcon = 'default_view' 
 

// Windows Position

_mainWin = null
 
_winX = 10
_winY = 10  
 

 
  // *  Configuracion del metodo por defecto  
  // Ext.data.Connection.prototype.method = 'GET';
 
