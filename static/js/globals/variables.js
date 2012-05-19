/*
 *  Variables Globales  
 *  
 */

// Estados en cada fila de la grilla al iteractuar con el BackEnd  
_ROW_ST = { 
	ERROR 	: 'ROWST_ERR',
	NEWROW 	: 'ROWST_NEW'
	}


_siteTitle = 'Dictionnaire de données de la Santé et des Services sociaux'
_versionProto = 'Version 0.93a'

_detailViewNewTab 	= 'Voir dans un nouvel onglet'
_gridBbPerPage 		= ' par page'
_gridBbShow  = 'Résultats' 
_gridBbOf = 'de' 
_gridBbPage = 'Page'

_gridFirstText = 'Première page',  
_gridNextText = 'Page suivante', 
_gridPrevText = 'Page précédente', 
_gridLastText = 'Dernière page', 
_gridRefreshText = 'Actualiser',  
	
_tbSearchClearFilter = '<b>Supprimer les filtres<b>'
	
// Config Variables 
_PConfig =  {
    urlMenu : 'protoExt/protoGetMenuData/', 
    urlProtoDefinition : 'protoExt/protoGetPCI/', 
   
    clsBaseModel: 'ProtoUL.model.' 
}; 


// Globally changing the text of Cancel and Save buttons;

Ext.grid.RowEditor.prototype.saveBtnText = 'Enregistrer'; 
Ext.grid.RowEditor.prototype.cancelBtnText = 'Canceler';


// Collection of PCL's ( Proto Concept Definition )  

_cllPCI = [];


// Define los tipos para el manejo de edicion  (type => xtype)
_gridTypeEditor = {
    'int' : 'numberfield',
    'float' : 'numberfield',
    'string' : 'textfield',
    'date' : 'datefield',
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
//_AUTOLOAD_PCI = ['protoExt.Model', 'protoExt.Property' , 'pruebas.Prueba'  ]
_AUTOLOAD_PCI = ['protoLib.ProtoDefinition'  ]
_MENU_COLLAPSED = true 

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
 
 
 
  // *  Configuracion del metodo por defecto  
  // Ext.data.Connection.prototype.method = 'GET';
 
