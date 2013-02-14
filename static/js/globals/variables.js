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


// _siteTitle = 'ART Atelier de Référentiel pour Togaf'_versionProto = 'Version 1.00.' + _versionMeta
_siteTitle = 'CeRTAE'
_siteTitleCollapsed = false 


// place holder para los titulos con datos basicos del login  
__language = {
    'Text_Validate_Login_Button' : 'check',
    'Text_Forgotten_Password' : 'lost password',
    'Textfield_User_Login' : 'user',
    'Textfield_Password_Login' : 'password',
    'Title_Window_Email_Request' : 'your email',
    
    'Message_Enter_Email' : 'Enter your email',
    'Message_Success' : 'Success',
    'Message_Email_Forgotten_Password' : 'An email has been sent with the instructions',
    'Message_Error' : 'Error',
    'Message_Error_Login' : 'Impossible'
}
    
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
    urlLogOut:'/Login/cerrarSesion',
   
    clsBaseModel: 'ProtoUL.model.' 
}; 

__HELPpath = '/resources/help/index.html'


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


_defaultViewIcon = 'default_view' 
 

// Windows Position
_mainWin = null
_winX = 10
_winY = 10  
 
 
  // *  Configuracion del metodo por defecto  
  // Ext.data.Connection.prototype.method = 'GET';
 
