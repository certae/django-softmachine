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
 * Los objetos de tipo list contienen ademas  
 * 
 *       listOf
 * 
 * Tambien se puede aplicar un valor por defecto, por 
 * ejemplo en listDisplay  = ['__str__']
 * 
 *      defaultValue : ['__str__']
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
 
        
 * 
 */ 


//  FieldSet 
//  El layout column permite un manejo flexible 
//  fluid:  Si no se especifica el "columnWidth"  es flexible 
//  xCol :Dependiendo el numero de columnas el "columnWidth"  puede ser 1, 0.5, 0.33
//  fix  : Se especifica el "width"  ( si se especifica el width prima sobre la definicion ) 


function verifyMeta( oMeta,  ptType ) {

//    Verifica un objeto de acuerdo a la estructura      

    var __ptConfig = _MetaObjects[ ptType ]
    if ( ! __ptConfig ) 
        return oMeta ; 

    // Verifica las listas 
    if ( __ptConfig.lists &&  ( typeOf( __ptConfig.lists ) == 'array' ))  { 
        for ( var ix in __ptConfig.lists  ) {
            var sKey = __ptConfig.lists[ix]
            if ( typeof( sKey)  !=  'string' ) 
                continue ; 

            var listOfConf = _MetaObjects[ sKey ] || {}
            oMeta[ sKey ]  = verifyList (  oMeta[ sKey ], listOfConf.defaultValue  )            
        }
    } 

    // Verifica los Objetos ( no aplica los default, pues la config puede eliminarlos )  
    if ( __ptConfig.objects &&  ( typeOf( __ptConfig.objects  ) == 'array' ))  { 
        for ( var ix in __ptConfig.objects  ) {
            var sKey = __ptConfig.objects[ix]
            if ( typeof( sKey)  !=  'string' ) 
                continue ; 

            var myObj = oMeta[ sKey ]
            if ( typeOf( myObj ) != 'object' )  { 
                myObj = {} }

            oMeta[ sKey ] = verifyMeta( myObj,  sKey  )
        }
    } 

    // No es necesario verificar las propiedades pues se hace al momento de guardar la pcl  
    // if ( __ptConfig.properties  &&  ( typeOf( __ptConfig.properties  ) == 'array' ))  {

    return oMeta 

}; 


_MetaObjects =  {

    "actions": {
        "description": "Lista de acciones backend", 
        "listOf" : "actionDef"
    },

    "actionDef" : {
        "description": "Actions backend",
        "properties": [
          "name", 
          "title", 
          "actionType", 
          "refreshOnComplete"
          ], 
        "lists": [
            "actionParams"
          ], 
        "__ptStyle": "obj" 
    }, 

    "actionParams": {
        "description": "Propiedades de las actions backend",
        "listOf" : "actionParam"
    }, 

    "actionParam": {
        "properties": [
          "name", 
          "title", 
          "protoIcon", 
          "description",  
          "vrDefault", 
          "choices", 
          "actionParamType",
          "required"
          ]
        }, 

    "pcl": {
        "description": "definicion de la meta",
        "properties": [
            "protoOption", 
            "description" ,
            "protoConcept" , 
            "protoIcon",
            "shortTitle" ,
            "helpPath", 
            "idProperty", 
            "pciStyle", 
            "updateTime", 
            "version"
            ],
        "objects": [
            "sheetConfig", 
            "gridConfig", 
            "protoUdp", 
            "protoForm"
            ],
        "lists": [
            "fields", 
            "protoDetails", 
            "actions"
            ],
        "roProperties": [ "protoOption", "protoConcept", "idProperty" , "updateTime"]  
        },


    "fields": {
        "description": "Definicion de los campos del store", 
        "listOf" : "field"
    },


    "field": {
        "description": "A store field element",
        "properties": [
            "required",
            "decimalPrecision", 
            "defaultValue",
            "fieldLabel",
            "format",
            "header" ,
            "sortable", 
            "flex", 
            "height","maxHeight","minHeight",
            "width", "maxWidth","minWidth",
            "hidden",
            "hideLabel",
            "labelAlign","labelWidth",
            "readOnly",
            "tooltip", 
            "cellToolTip",
            "storeOnly", 
            "cellLink",  
            "wordWrap",
            "fromModel",
            
            // Para los campos del htmlSet            
            "collapsed",   
            // Para el combo
            "choices",

            // Para el zoom 
            "fkId", 
            "fkField",
            "zoomModel", 
            "zoomFilter", 
            "zoomReturn", 
            "cellLink", 

            // Para los N2N
            // "conceptDetail", 
            // "relatedN2N",
            // "detailField",
            // "masterField",                                     
            
            "type", 
            "xtype",
            "vType" 
            ],
        "roProperties": [ "fromModel" ]  
    },

    "formField": {
        "description": "A field element",
        "properties": [
            "tooltip", 
            "fieldLabel",
            "labelWidth","labelAlign","hideLabel",
            "required",
            "readOnly",
            "hidden",
            "defaultValue",
            "height","maxHeight","minHeight","width", "maxWidth","minWidth",
            "flex", 
            "format",
            "decimalPrecision", 

            // Para los campos del htmlSet            
            "collapsed",   
            // Para el combo
            "choices",

            // Para el zoom 
            "fkId", 
            "fkField",
            "zoomModel", 
            "zoomFilter", 
            "zoomReturn",
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
            'multiSelect', 
            'hideSheet', 
            'filterSetABC'
             ], 
        "objects": [
            "baseFilter", 
            "initialFilter"
            ],
        "lists": [
            "listDisplay",
            "searchFields",
            "hiddenFields",
            "filtersSet",
            "readOnlyFields",
            "initialSort"
            ],
    },

    "baseFilter": {
        "description": "Filtro de base adicional a cualquier filtro definido, no modificable por el usuario Ej: { \"status__exact\":\"0\" } ",
        "__ptStyle": "jsonText" 
    },


    "filtersSet": {
        "description": "Conjunto de filtros predefinidos ( __[iexact,icontains,iendswith,istartswith,gt,gte,lt,lte]) ",
        "properties": [ { 'name': '__ptType' , 'value': 'filtersSet'} ] 
    },

    "filterDef": {
        "description": "Filtro predefinido definido ",
        "__ptStyle": "jsonText" 
    },

    "initialFilter": {
        "description": "Filtro inicial, reescribible al seleccionar otro filtro  Ej: { \"status__exact\":\"0\" } ",
        "__ptStyle": "jsonText" 
    },

    "initialSort": {
        "description": "Ordenamiento por defecto  Ej: [{\"direction\":\"ASC\",\"property\":\"code\"}, ... ] ",
        "__ptStyle": "jsonText" 
    },

    "hiddenFields": {
        "description": "Lista de campos ocultos  ( TODO: hidden = true or not at all? )",
        "__ptStyle": "colList" 
    },

    "listDisplay": {
        "description": "Lista de campos a desplegar en la grilla",
        "defaultValue" : ["__str__"], 
        "__ptStyle": "colList" 
    },

    "listDisplaySet": {
        "description": "Configuraciones alternativas para la grialla  ( Aparecen bajo el icono 'ViewCols' de la barra principal )",
        "properties": [ { 'name': '__ptType' , 'value': 'listDisplaySet'} ] 
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


    "protoDetails": {
        "description": "Detalles en una relacion Master-Detail",
        "listOf": "protoDetails" 
    },


    "protoDetail": {
        "description": "Detalle en una relacion Master-Detail",
        "properties": [
            "name", 
            "menuText", 
            "conceptDetail",
            "masterField",
            "detailField", 
            "detailTitleLbl", 
            "masterTitleField", 
            "detailTitleField"
        ]
    },

    "protoUdp": {
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
        "description": "Plantillas de info html que son alimentadas por los datos de la Db",
        "properties": [
            "protoSheetSelector" 
        ], 
        "lists" : [
            "protoSheets", 
            "protoSheetProperties"
        ]
    },

    "protoSheetProperties": {
        "description": "Lista de campos utilizados en las plantillas",
        "listOf": "colList",  
        "__ptStyle": "colList" 
    },

    "protoSheets": {
        "description": "Lista de plantillas",
        "listOf": "protoSheet" 
    },

    "protoSheet": {
        "description": "Plantilla ( el nombre corresponde al selector )",
        "properties": [
            "name", 
            "template", 
            "title", 
            "sheetType" 
        ], 
        "lists" : [
            "sheetDetails" 
        ]
    },

    "sheetDetails": {
        "description": "Lista de detalles por hoja ( sheet )",
        "listOf": "sheetDetail" 
    },

    "sheetDetail": {
        "description": "Detalles por hoja ( sheet )",
        "properties": [
            "name", 
            "detailView", 
            "template", 
            "sheetDetails" 
        ]
    },

    "protoForm": {
        "description": "definicion de formas",
        "properties": [
            "title", "tooltip", 
            "height","maxHeight","minHeight",
            "width", "maxWidth","minWidth",
            "protoIcon","helpPath" ]
        },
    
    "fieldset": {
        "description": "A Fieldset, containing field elements",
        "properties": [
            "title", 
            "fsLayout",
            "autoscroll",
            "collapsible", "collapsed", 
            "labelWidth","labelAlign","hideLabel",
            "height","maxHeight","minHeight","width", "maxWidth","minWidth"
        ]
    },

    "htmlset": {
        "description": "A Fieldset, containing HtmlField elements",
        "properties": [
            "title", 
            "collapsible", "collapsed", 
            "flex", 
            "height","maxHeight","minHeight","width", "maxWidth","minWidth"
        ]
    },


    "protoGrid": {
        "description": "A detail grid",
        "properties": [
            "protoOption",  
            "height","maxHeight","minHeight","width", "maxWidth","minWidth"
            ]
    }, 


    "panel": {
        "description": "A simple panel with fit layout",
        "properties": [
            "title",
            "height","maxHeight","minHeight","width", "maxWidth","minWidth"
            ]
    }, 
    
    

  "tabpanel": { 
        "description": "A Tab Container with many tabs",
        "properties": [
            "layout", "activeItem", 
            "height","maxHeight","minHeight","width", "maxWidth","minWidth"
            ]
    }
    
    
};



