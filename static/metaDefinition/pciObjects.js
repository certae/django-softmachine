// @Author : Dario Gomez /  Certae U. Laval Quebec, Qc, Canada
    

/* Objetos utilizados por la pci,
 *
 * Sirve para generar y validar la estructura de un json a partir de la definicion q se haga aqui 
 * tambien debe servir para la creacion del arbol de la plc y las validaciones necesarias  
 *
 * El marcador ( atrr ) del objeto corresponde al "__ptType" y es el nombre del objeto aqui definido 
 * 
 * La definicion tiene las siguientes propiedades
 * 
 *      description 
 *      lists                       
 *      objects
 *      properties              # Son valores simples: string, number, bool 
 *      roProperties            # readOnly en la pcl, deben preexistir en properties 
 *  
 * Los objetos de tipo list contienen ademas, esto permite agregar instancias en la pcl   
 * 
 *       listOf
 * 
 * Tambien se puede aplicar un valor por defecto, por 
 * ejemplo en listDisplay  = ['__str__']
 * 
 *      prpDefault : ['__str__']
 * 
 * Si se desea cambiar el tipo de definicion: 
 * 
 *       __ptType  lleva a la definicion correcta   
 * 
 * Para la edicion en la pcl contienen 
 * 
 *       __ptStyle  [ jsonText, colList ]
 * 
 * --- Una plantilla de la form  
 
    "": {
        "description": "Lista de acciones backend", 
        "listOf" : "actionDef"
        "properties": [
          ], 
        "roProperties" : [
          ], 
        "objects": [
            ],
        "lists": [
            ],
        "roProperties": []  
        },

-- Determina el nombre del nodo en las listas 
 
        "nodeName" : "filterName", 

-- Permite agregar un template en caso de nodos json  
    "__ptStyle" : "jsonText"
    "addTemplate" : "{\"listDisplay\":{},\"name\": \"@name\"}",
    

--  Creacion de nodos 

        "allowAdd" : true            //  requiere un listOf  
        "listOf" : "filtersSetDef",
    
    
 */ 


//  FieldSet 
//  El layout column permite un manejo flexible 
//  fluid:  Si no se especifica el "columnWidth"  es flexible 
//  xCol :Dependiendo el numero de columnas el "columnWidth"  puede ser 1, 0.5, 0.33
//  fix  : Se especifica el "width"  ( si se especifica el width prima sobre la definicion ) 


function verifyMeta( oMeta,  ptType, tNode ) {

//  Verifica un objeto de acuerdo a la estructura
//  Si es un objeto asociado a un arbol tNode es el nodo base,       

    var __ptConfig = _MetaObjects[ ptType ]
    if ( ! __ptConfig ) 
        return oMeta ; 

    // Verifica las listas 
    if ( __ptConfig.lists &&  ( _SM.typeOf( __ptConfig.lists ) == 'array' ))  { 
        for ( var ix in __ptConfig.lists  ) {
            var sKey = __ptConfig.lists[ix]
            if ( typeof( sKey)  !=  'string' ) 
                continue ; 

            var listOfConf = _MetaObjects[ sKey ] || {}
            oMeta[ sKey ]  = _SM.verifyList (  oMeta[ sKey ], listOfConf.prpDefault  )

            if ( tNode ) { 
                // agrega una nueva lista al arbol 
                var nBranch =  {
                    'text'     :  sKey,
                    '__ptType' :  sKey, 
                    '__ptConfig':  { '__ptType' : sKey }, 
                    'children' : [] }
                    
                tNode.children.push( nBranch )
            }
                        
        }
    } 

    // Verifica los Objetos ( no aplica los default, pues la config puede eliminarlos )  
    if ( __ptConfig.objects &&  ( _SM.typeOf( __ptConfig.objects  ) == 'array' ))  { 
        for ( var ix in __ptConfig.objects  ) {
            var sKey = __ptConfig.objects[ix]
            if ( typeof( sKey)  !=  'string' ) 
                continue ; 

            var myObj = oMeta[ sKey ]
            if ( _SM.typeOf( myObj ) != 'object' )  { 
                myObj = {} }

            if ( tNode ) { 
                
                // agrega un nuevo objeto al arbol 
                var nBranch  = getNodeBase( sKey, sKey, { '__ptType' : sKey } )
                tNode.children.push( nBranch )
                
                // Agrega los hijos tambein al arbol 
                oMeta[ sKey ] = verifyMeta( myObj,  sKey, nBranch   )    

            } else {
            
                oMeta[ sKey ] = verifyMeta( myObj,  sKey  )    
            }

        }
    } 

    // No es necesario verificar las propiedades pues se hace al momento de guardar la pcl  
    // if ( __ptConfig.properties  &&  ( _SM.typeOf( __ptConfig.properties  ) == 'array' ))  {

    return oMeta 

}; 


function clearPhantonProps( __ptConfig ,  __ptType ) {
    /* Borra las propieades q no hacen parte de la config de base 
     */ 
    var objConfig = _MetaObjects[ __ptType ] || {}
    for (var ix in __ptConfig ) {   
        if ( ! objConfig.properties ) continue; 
        if ( !( ix  in _SM.objConv( objConfig.properties.concat ( ['name', '__ptValue', '__ptList', '__ptType' ] )))) {
            console.log( ix )
            delete __ptConfig[ ix ]
        }
    } 
    return __ptConfig 
}; 


_versionMeta = '13.0111'

_MetaObjects =  {

    "pcl": {
        "description": "definicion de la meta",
        "properties": [
            "viewCode", 
            "viewEntity" ,
            "viewIcon",
            "description" ,
            "shortTitle" ,
            "localSort", 
            "pageSize", 
            "sheetSelector",
            "pciStyle", 
            "helpPath", 
            "idProperty", 
            "jsonField",
            "returnField",
            "updateTime", 
            "metaVersion", 
            "userVersion",
            "protoEntity" ,
            "protoEntityId" ,
            // "sql",
            "pciType" 
            ],
        "objects": [
            "gridConfig", 
            "gridSets", 
            "formConfig", 
            "usrDefProps", 
            "custom", 
            "businessRules"
            ],
        "lists": [
            "fields", 
            "fieldsBase", 
            "fieldsAdm", 
            "actions",
            "detailsConfig", 
            "sheetConfig"
            ],
        "roProperties": [ "viewCode", "viewEntity", "idProperty" , "updateTime", "metaVersion", "protoEntity", "protoEntityId"]  
        },


    "fields": {
        "description": "Definicion de los campos del store", 
        "listOf" : "field" 
    },

    "fieldsBase": {
        "description": "Definicion de los campos admon", 
        "listOf" : "field" 
    },

    "fieldsAdm": {
        "description": "Definicion de los campos admon", 
        "listOf" : "field" 
    },


    "field": {
        "description": "A store field element",
        "properties": [
            "name", 
            "required",
            "prpLength", 
            "prpScale", 
            "prpDefault",
            "fieldLabel",
            "format",
            "header" ,
            "sortable", 
            "searchable",
            "flex", 
            // "height","maxHeight","minHeight",
            // "width", "maxWidth","minWidth",
            // "hideLabel",
            // "labelAlign","labelWidth",
            
            "tooltip", 
            // "cellToolTip",
            // "qbeHelp",
            "cellLink",  
            "wordWrap",

            // manejo
            "crudType", 
            "readOnly",
            "hidden",

            // Para el combo
            "choices",

            // Para el zoom 
            "fkId", 
            "fkField",
            "cellLink", 
            "zoomModel", 
            "zoomFilter", 

            // Definien como heredar datos de otro campo ( ya se a de un zoom o del mismo rset ) 
            "cpFromField", 
            "cpFromZoom", 
                        
            // Para los N2N
            // "conceptDetail", 
            // "relatedN2N",
            // "detailField",
            // "masterField",                                     
            "physicalName", 
            "type", 
            "xtype",
            "vType" 
            ],
        "roProperties": [ ]  
    },

    "formField": {
        "description": "A field element",
        "properties": [
            "name", 
            "tooltip", 
            "fieldLabel",
            "labelWidth","labelAlign","hideLabel",
            "required",
            "readOnly",
            "hidden",
            "prpDefault",
            // "height","maxHeight","minHeight",
            // "width", "maxWidth","minWidth",
            
            "format",
            "prpLength", 

            // Para los campos del htmlSet            
            "collapsed",   
            
            // Para el combo
            "choices",

            // Para el zoom 
            "fkId", 
            "fkField",
            "zoomModel", 
            "zoomFilter", 
            "cellLink",

            // Para los N2N
            // "conceptDetail", 
            // "relatedN2N",
            // "detailField",
            // "masterField",                                     

            // tipos              
            "type", 
            "xtype", 
            "vType"
            ], 
        "roProperties": [ "type "]  
            
    }, 

    "gridConfig": {
        "description": "Propiedades de configuracion de la grilla",
        "properties": [ 
            'hideRowNumbers', 
            // 'hideCheckSelect', 
            'gridSelectionMode', 
            // "exportCsv",  
            'hideSheet', 
            'denyAutoPrint', 
            'filterSetABC'
             ], 
        "lists": [
            "listDisplay",
            "baseFilter", 
            "initialFilter", 
            "initialSort", 

        // TODO: Eliminar de aqui y pasar a obj  colShortcuts             
            "searchFields",     // TODO: Cambiar por sercheable
            "sortFields",       // TODO: Cambiar por sortable
            "hiddenFields",
            "readOnlyFields"
            
            ],
        "objects": [
         // "colShortcuts" 
            ]
            
    },

    // TODO: Caundo se agrega aqui, al guardar actualiza fieldDefinition,
    // el agregar o borrar prevalece sobre la condicion del campo. 
    "colShortcuts": {
        "description": "Column configuration shortcuts",
        "lists": [
            "searchFields",     // TODO: Cambiar por sercheable
            "sortFields",       // TODO: Cambiar por sortable
            "hiddenFields",
            "readOnlyFields"
            
            // qbeAllowFields
            // textSearchFields  
            ]
    },


    // Estos son actualizados por el staf ( admin de grupo )
    "gridSets": {
        "description": "Configuraciones de adicionales ( filters, sorters, userViews )",
        "lists": [
            "listDisplaySet",
            "filtersSet",
            "sortersSet"
            ]
    },

    // Estos son actualizados por los usuarios de base 
    "custom": {
        "description": "Configuraciones de usuario",
        "lists": [
            "listDisplay",
            "listDisplaySet",
            "filtersSet",
            "sortersSet"
            ]
    },


    "baseFilter": {
        "description": "Filtro de base. Se adiciona a cualquier filtro posterior, no modificable por el usuario",
        "listOf" : "filterDef",
        "allowAdd" : true 
    },

    "customFilter": {
        "description": "Filtro predefinido ",
        "listOf" : "filterDef",
        "allowAdd" : true 
    },


    "initialFilter": {
        "description": "Filtro inicial, reescribible al seleccionar otro filtro  Ej: { \"status__exact\":\"0\" } ",
        "listOf" : "filterDef",
        "allowAdd" : true 
    },

    "initialSort": {
        "description": "Ordenamiento por defecto  Ej: [{\"direction\":\"ASC\",\"property\":\"code\"}, ... ] ",
        "listOf" : "sorterDef",
        "allowAdd" : true 
    },


    "sorterDef": {
        "description": "Definicion de ordenamiento  ",
        "addPrompt" : "Please enter the name of the property for your sorter:", 
        "allowDel" : true,
        "nodeName" : "property", 
        "properties": [
            "property", 
            "direction" 
        ] 
    },

    "sortersSet": {
        "description": "Conjunto de ordenamientos predefinidos ",
        "listOf" : "sortersSetDef",
        "allowAdd" : true 
    },

    "sortersSetDef": {
        "description": "Ordenamientos predefinidos  ",
        "addPrompt" : "Please enter the name of the sorter:", 
        "allowDel" : true,
        "properties": [
            "name", 
            "description" 
        ], 
        "lists": [
            "customSort" 
        ]
    },

    "customSort": {
        "description": "Ordenamiento predefinido",
        "listOf" : "sorterDef",
        "allowAdd" : true 
    },


    "filterDef": {
        "description": "Filtro predefinido  ",
        "addPrompt" : "Please enter the name of the property for your filter:", 
        "allowDel" : true,
        "nodeName" : "property", 
        "properties": [
            "property", 
            "filterStmt" 
        ] 
    },


    "filtersSet": {
        "description": "Conjunto de filtros predefinidos ( *x*, ><=, !=,  aa:bb ) ",
        "listOf" : "filtersSetDef",
        "allowAdd" : true 
    },

    "filtersSetDef": {
        "description": "Filtros predefinidos  ",
        "addPrompt" : "Please enter the name of the filterSet:", 
        "allowDel" : true,
        "properties": [
            "name" 
        ], 
        "lists": [
            "customFilter" 
        ]
    },


    "listDisplaySet": {
        "description": "Configuraciones alternativas para la grilla  ( Aparecen bajo el icono 'ViewCols' de la barra principal )",
        "listOf" : "listDisplayDef",
        "allowAdd" : true 
    },

    // El esquema no soporta una lista de listas, tiene q ser un objeto para poder nombralo 
    "listDisplayDef": {
        "description": "listDisplay predefinidos ",
        "addPrompt" : "Please enter the name of the columnSet:", 
        "allowDel" : true, 
        "properties": [
            "name", 
            'hideRowNumbers', 
            // 'hideCheckSelect', 
            "description" 
        ], 
        "lists" : [
            "listDisplay" 
        ]
         
    },


    "hiddenFields": {
        "description": "Lista de campos ocultos  ( TODO: hidden = true or not at all? )",
        "__ptStyle": "colList" 
    },

    "listDisplay": {
        "description": "Lista de campos a desplegar en la grilla",
        // "prpDefault" : ["__str__"], 
        "addPrompt" : "Please enter the name for your alternative listDisplay:", 
        "__ptStyle": "colList" 
    },


    "readOnlyFields": {
        "description": "Lista de campos a marcar como readOnly ( tambien se puede utilzar la prop ReadOnly es igual )",
        "__ptStyle": "colList" 
    },


    "searchFields": {
        "description": "Campos habilitados para busqueda",
        "__ptStyle": "colList" 
    },

    "sortFields": {
        "description": "Campos habilitados para ordenamiento",
        "__ptStyle": "colList" 
    },


    "detailsConfig": {
        "description": "Detalles en una relacion Master-Detail",
        "listOf": "detailDef",
        "allowAdd" : true 
    },


    "detailDef": {
        "description": "Detalle en una relacion Master-Detail",
        "properties": [
            "menuText", 
            "conceptDetail",
            "masterField",
            "detailField", 
            "detailName", 
            "detailTitleLbl", 
            "masterTitleField", 
            "detailTitleField"
        ], 
        "addPrompt" : "Please enter the name for your detail:", 
        "allowDel" : true  
        
    },

    "usrDefProps": {
        "description": "User defined properties ( se utilizan como campos y son creados por usr a voluntad, no participan en search, sort)",
        "properties": [
            "udpTable", 
            "propertyRef", 
            "keyField",
            "propertyPrefix", 
            "propertyName",
            "propertyValue"
        ]
    },

    "sheetConfig": {
        "description": "Lista de plantillas",
        "listOf": "sheetDef",
        "allowAdd" : true       
    },

    "sheetDef": {
        "description": "Plantilla ( el nombre corresponde al selector )",
        "properties": [
            "name", 
            "template", 
            "title", 
            "viewIcon", 
            "sheetType", 
            "templateFp",  
            "templateBb",  
            "templateEr", 
            "templateAb",  
            "templateLp"  
        ], 
        "lists" : [
            "sheetDetails" 
        ], 
        "addPrompt" : "Please enter the name for your sheet:", 
        "allowDel" : true  
    },

    "sheetDetails": {
        "description": "Lista de detalles por hoja ( sheet )",
        "listOf": "sheetDetail", 
        "allowAdd" : true
    },

    "sheetDetail": {
        "description": "Detalles por hoja ( sheet )",
        "properties": [
            "name", 
            "detailName", 
            "detailSort", 
            "templateBb",  
            "templateEr",  
            "templateAb" 
        ], 
        "lists" : [
            "sheetDetails" 
        ], 
        "addPrompt" : "Please enter the detailName:", 
        "allowDel" : true
    },


    "formConfig": {
        "hideItems" : true,  
        "description": "definicion de formas",
        "properties": [
            "title", "tooltip", 
            "height","maxHeight","minHeight",
            "width", "maxWidth","minWidth",
            "viewIcon","helpPath" ]
        },
    
    "fieldset": {
        "hideItems" : true,  
        "description": "A Fieldset, containing field elements",
        "properties": [
            "title", 
            "fsLayout",
            "autoscroll",
            "border",
            "collapsible", "collapsed", 
            "labelWidth","labelAlign","hideLabel",
            "height","maxHeight","minHeight"
            // "width", "maxWidth","minWidth"
        ]
    },

    "htmlset": {
        "hideItems" : true,  
        "description": "A Fieldset, containing HtmlField elements",
        "properties": [
            "title", 
            "collapsible", "collapsed", 
            "flex", 
            "height","maxHeight","minHeight"
            // "width", "maxWidth","minWidth"
        ]
    },

    "protoGrid": {
        "description": "A detail grid",
        "properties": [
            "viewCode",  
            "height","maxHeight","minHeight"
            // ,"width", "maxWidth","minWidth"
            ]
    }, 


    "panel": {
        "hideItems" : true,  
        "description": "A simple panel with fit layout",
        "properties": [
            "title",
            "height","maxHeight","minHeight"
            // ,"width", "maxWidth","minWidth"
            ]
    }, 
    

  "tabpanel": { 
        "hideItems" : true,  
        "description": "A Tab Container with many tabs",
        "properties": [
            "layout", "activeItem", 
            "height","maxHeight","minHeight"
            // ,"width", "maxWidth","minWidth"
            ]
    }, 
    
    "actions": {
        "description": "Lista de acciones backend", 
        "listOf" : "actionDef",
        "allowAdd" : true  
    },

    "actionDef" : {
        "description": "Actions backend",
        "properties": [
          "name", 
          "title", 
          "actionType", 
          "selectionMode", 
          "refreshOnComplete"
          ], 
        "lists": [
            "actionParams"
          ], 
        "addPrompt" : "Please enter the name for your action:", 
        "allowDel" : true  
         
    }, 

    "actionParams": {
        "description": "Propiedades de las actions backend",
        "listOf" : "actionParam", 
        "allowAdd" : true  
    }, 

    "actionParam": {
        "properties": [
            "name", 
            "tooltip", 
            "fieldLabel",
            "prpDefault",
            
            "required",
            "readOnly",
            "format",

            // Para el combo
            "choices",

            // Para el zoom 
            "fkId", 
            "fkField",
            "zoomModel", 
            "zoomFilter", 
            "cellLink",

            // tipos              
            "type", 
            "xtype", 
            "vType"
          ], 
        "addPrompt" : "Parametros de acciones", 
        "allowDel" : true
        }, 


    "businessRules": {
      "properties": [
            "dblClick",

            "afterCellUpdate",
            "afterRowDelete",
            "afterSave",

            "beforeCellEdit",
            "beforeCellUpdate",
            "beforeRowDelete",
            "beforeRowInsert",
            "beforeOpSave",
            "beforeValidate",

            "zoomConfigure",
            "zoomReturn",
            "issRowLoad",
            "reposition",
            "getLinkFilter",
            "validationComplete"
      ]
    },


    "businessRule": {
        "properties": [
          "name", 
          "handler",
          "src",
          "type",
          "field"
          ], 
        "addPrompt" : "Parametros de acciones", 
        "allowDel" : true
        }, 


  "businessRulesText": {
      "description": "business rules",
      "properties": [
            "afterCellUpdate",
            "afterRowDelete",
            "BeforeCellEdit",
            "BeforeCellUpdate",
            "BeforeRowDelete",
            "BeforeRowInsert",
            "dblClick",
            "issZoomConfigure",
            "issBeforeVslidateVr",
            "issHelpReturn",
            "issRowLoad",
            "reposition",
            "getLinkFilter",
            "afterOpSave",
            "beforeOpSave",
            "issValidationComplete"
      ]
  }

    
    
};



