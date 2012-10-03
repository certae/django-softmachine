/*
 *  Variables Globales  
 *  
 */

// Estados en cada fila de la grilla al iteractuar con el BackEnd  
_ROW_ST = { 
    ERROR     : 'ROWST_ERR',
    NEWROW     : 'ROWST_NEW'
    }


_siteTitle = 'ART Atelier de Référentiel pour Togaf'
_versionProto = 'Version 0.13k'

_detailViewNewTab     = 'Voir dans un nouvel onglet'
_gridBbPerPage         = ' par page'
_gridBbShow  = 'Résultats' 
_gridBbOf = 'de' 
_gridBbPage = 'Page'

_gridFirstText = 'Première page',  
_gridNextText = 'Page suivante', 
_gridPrevText = 'Page précédente', 
_gridLastText = 'Dernière page', 
_gridRefreshText = 'Actualiser',  
    
_tbSearchClearFilter = 'Supprimer les filtres'
    
// Config Variables 
_PConfig =  {
    urlMenu         : 'protoLib/protoGetMenuData/', 
    urlGetPCI         : 'protoLib/protoGetPCI/', 
    urlSavePCI         : 'protoLib/protoSavePCI/', 
    urlGetFieldTree : 'protoLib/protoGetFieldTree/', 
    urlGetDetailsTree : 'protoLib/protoGetDetailsTree/', 
    urlGetUserRights : 'protoLib/protoGetUserRights/', 
   
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
//_AUTOLOAD_PCI = ['protoExt.Model', 'protoExt.Property' , 'pruebas.Prueba', 'protoLib.ProtoDefinition' , 'TCO.Logiciel'  ]
_AUTOLOAD_PCI = [ ]
_MENU_COLLAPSED = false 

// ProtoUL.view.ProtoMasterDetail 
_ComboFilterOp = [
            ['iexact', 'égal'],
            ['icontains', 'qui contient'],
            ['iendswith', 'qui finisse par'],
            ['istartswith', 'qui commence par'],
            ['--', ''],

            ['gt', 'plus grand que'],
            ['gte', 'plus grand ou égal que'],
            ['lt', 'plus petit que'],
            ['lte', 'plus petit ou égal que'],
            // ['range', '(..)'],
            // ['in', '(_,_)'],

//            ['--', ''],
//            ['day', 'jour'],
//            ['month', 'mois'],
//            ['week_day', 'jour de la semaine'],
//            ['year', 'année'],
            ['--', ''],

            ['isnull', 'valeur nulle']
            // ['iregex', 'regex'],
    ]; 
 

_defaultViewText = 'Default';
_defaultViewIcon = 'default_view' 
 

// Windows Position

_mainWin = null
 
_winX = 10
_winY = 10  
 
  // *  Configuracion del metodo por defecto  
  // Ext.data.Connection.prototype.method = 'GET';
 
