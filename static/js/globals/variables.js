/*
 *  Variables Globales  
 *  
 */


_siteTitle = 'Dictionnaire de données de la Santé et des Services sociaux'
_versionProto = 'Version 0.93a'

_detailViewNewTab 	= 'Voir dans un nouvel onglet'
_gridBbPerPage 		= ' par page'
_gridBbShow  = 'Résultats' 
_gridBbOf = 'de' 
_gridBbPage = 'Page'

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


// Collection of ProtoConcept Definition 

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
//_AUTOLOAD_PCI = ['protoExt.Model', 'protoExt.Property'  ]
_AUTOLOAD_PCI = ['protoExt.Prueba'  ]
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
 
 
 
 /*
  *  Configuracion del metodo por defecto  
  */
  // Ext.data.Connection.prototype.method = 'GET';
 
 
 /*
  * There are two ways to add new properties to an object:

var obj = {
    key1: value1,
    key2: value2
};
Using dot notation:

obj.key3 = "value3";
Using square bracket notation:

obj["key3"] = "value3";
The first form is used when you know the name of the property. The second form is used when the name of the property is dynamically determined. Like in this example:

var getProperty = function (propertyName) {
    return obj[propertyName];
};

getProperty("key1");

  */
