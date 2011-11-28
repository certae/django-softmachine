/*
 *  Variables Globales  
 *  
 */


// Config Variables 
_PConfig =  {
    urlMenu : 'protoExt/protoGetMenuData/', 
    urlProtoDefinition : 'protoExt/protoGetPCI/', 
   
    clsBaseModel: 'ProtoUL.model.', 
}; 



// Collection of ProtoConcept Definition 

_cllPCI = [];


// Define los tipos para el manejo de edicion  (type => xtype)
_gridTypeEditor = {
    'int' : 'numberfield',
    'float' : 'numberfield',
    'string' : 'textfield',
    'date' : 'datefield',
    'boolean' : 'checkbox',
};

// PageSize par default 
_PAGESIZE = 100; 


// Autoload entites
_AUTOLOAD_PCI = ['protoExt.Model',  ]

// ProtoUL.view.ProtoMasterDetail 
_ComboFilterOp = [
            ['iexact', '='],
            ['icontains', '*_*'],
            ['iendswith', '*_'],
            ['istartswith', '_*'],
            ['--', ''],

            ['gt', '>'],
            ['gte', '>='],
            ['lt', '<'],
            ['lte', '<='],
            // ['range', '(..)'],
            // ['in', '(_,_)'],
            ['--', ''],

            ['day', 'DD'],
            ['month', 'MM'],
            ['week_day', 'WD'],
            ['year', 'YY'],
            ['--', ''],

            ['isnull', 'null'],
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
