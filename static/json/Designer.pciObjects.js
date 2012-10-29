// @Author : Dario Gomez /  Certae U. Laval Quebec, Qc, Canada
    // Objetos utilizados por la pci,
    // El marcador ( atrr ) del objeto corresponde al "__ptType"
   

//  FieldSet 
//  El layout column permite un manejo flexible 
//  fluid:  Si no se especifica el "columnWidth"  es flexible 
//  xCol :Dependiendo el numero de columnas el "columnWidth"  puede ser 1, 0.5, 0.33
//  fix  : Se especifica el "width"  ( si se especifica el width prima sobre la definicion ) 



DesignerObjects =  {

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
            "version"
            ],
        "roProperties": [ "protoOption", "protoConcept", "idProperty" ]  
        },

    "fields": {
        "description": "Definicion de los campos del store",
        "properties": [ { 'name': '__ptType' , 'value': 'fields'} ] 
    },


    "field": {
        "description": "A store field element",
        "properties": [
            "allowBlank",
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
            "allowBlank",
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
            'hideSheet', 
            'filterSetABC'
             ] 
    },

    "baseFilter": {
        "description": "Filtro de base adicional a cualquier filtro definido, no modificable por el usuario Ej: { \"status__exact\":\"0\" } ",
        "__ptStyle": "jsonText" 
    },


    "filtersSet": {
        "description": "Conjunto de filtros predefinidos ( Aparecen bajo el icono 'Filter' de la barra principal )",
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
        "properties": [ { 'name': '__ptType' , 'value': 'protoDetails'} ] 
    },


    "protoDetail": {
        "description": "Detalle en una relacion Master-Detail",
        "properties": [
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
            "propertyPrefix", 
            "propertyName",
            "propertyValue",
            "propertyReference", 
            "keyField",
            "udpTable" 
        ]
    },

    "sheetConfig": {
        "description": "Plantillas de info html que son alimentadas por los datos de la Db",
        "properties": [
            "protoSheetSelector" 
        ]
    },

    "protoSheetProperties": {
        "description": "Lista de campos utilizados en las plantillas",
        "__ptStyle": "colList" 
    },

    "protoSheets": {
        "description": "Lista de plantillas",
        "properties": [ { 'name': '__ptType' , 'value': 'protoSheets'} ] 
    },

    "protoSheet": {
        "description": "Plantilla ( el nombre corresponde al selector )",
        "properties": [
            "template", 
            "title" 
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



