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
            "protoMenuOpt",  
            "protoMenuIx",  
            "protoIcon",
            "shortTitle" ,
            "helpPath", 
            "idProperty", 
            "pciStyle" 
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
            "fromModel",  "xtype",
            "type", 
            "vType" 
            ],
        "roProperties": [ "type", "fromModel" ]  
    },

    "gridConfig": {
        "description": "Propiedades de configuracion de la grilla",
        "properties": [ 
            'hideRowNumbers' 
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
            "detailTitlePattern"
        ]
    },

    "protoUdp": {
        "description": "User defined properties ( se utilizan como campos y son creados por usr a voluntad, no participan en search, sort)",
        "properties": [
            "propertyPrefix", 
            "propertyName",
            "propertyValue",
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
            "protoIcon","helpPath" ]
        },
    
    "fieldset": {
        "description": "A Fieldset, containing field elements",
        "properties": [
            "title", 
            "fsLayout",
            "autoscroll",
            "collapsible", "collapsed", 
            "height","maxHeight","minHeight","width", "maxWidth","minWidth"
        ]
    },

    "formField": {
        "description": "A field element",
        "properties": [
            "tooltip", 
            "fieldLabel",
            "labelWidth",
            "labelAlign",
            "hideLabel",
            "allowBlank",
            "readOnly",
            "hidden",
            "defaultValue",
            "height","maxHeight","minHeight","width", "maxWidth","minWidth",
            "format",
            "decimalPrecision"
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
    }
    
};





/* 
    FieldContainer implements the Labelable mixin. 
    Varios campos son presentados con un label y un sitio comun para los mensajes de error 
    A common use is for grouping a set of related fields under a single label in a form.
    FieldContainer Inherit itself and  can pass fieldDefaults to any fields it may itself contain 
    Otros:  Ext.form.CheckboxGroup or Ext.form.RadioGroup 
    
    -- Props adicionales 
    hideLabels      :  Oculta  todos los labels de los campos
    
    -- Props fijas    
    combineErrors   : true 
    autoScroll      : true
    
    --- Comentarios 
    title corresponde al label del grupo
     

        // "choices": '',
        // "align": "right",

        // TODO: BackEnd, Grid, No 
        "sortable": oData.sortable || false

        // FIX:  Q es esto por q 3 propiedades q pueden ser las misma vaina  readOnly, editable   
        // "editable": false,
        // "editMode": false,
        
        // "name": oData.name ,
        // "zoomModel": oData.zoomModel 
        // "cellLink": oData.cellLink ,
        // "fkField":  oData.fkField, 
        // "fkId": oData.fkId,


        "labelWidth" : 'ancho del label',
        "labelAlign" : "left",
        "labelWidth" : 75,
        "labelAlign" : "left",
        "labelAlign" : [ "top", "left"]
    

    }, {
    
        "text": "Field Set",
        "qtip": "A Fieldset, containing other form elements",
        "children": [], 
        "__ptConfig": {
            "xtype": "fieldset",
            "title": "Legend",
            "autoHeight": true
        }
    }, {
        "text": "Tab Container",
        "qtip": "A panel with many tabs",
        "children": [], 
        "__ptType": "tabpanel",
        "__ptConfig": {
            "layout": "fit",
            "title": "",
            "activeItem": 0
        }
    }, {
        "text": "Tab Panel",
        "qtip": "A tab panel",
        "children": [], 
        "__ptType": "tab",
        "__ptConfig": {
            "layout": "fit",
            "title": ""
        }
    }, {
        "text": "Absolute Layout",
        "qtip": "Layout containing many elements, absolutely positionned with x/y values",
        "children": [], 
        "__ptConfig": {
            "layout": "absolute",
            "title": "AbsoluteLayout Container"
        }
    }, {
        "text": "Accordion Panel",
        "qtip": "Layout as accordion",
        "children": [], 
        "wizard": "wizard/accordion-wiz.json"
    }, {
        "text": "Column Layout",
        "qtip": "Layout of columns",
        "children": [], 
        "wizard": "wizard/column-wiz.json"
    }, {
        "text": "Border Layout",
        "qtip": "Layout with regions",
        "children": [], 
        "wizard": "wizard/border-wiz.json"
    }


        {
            "text": "Label",
            "qtip": "A textlabel",
            "leaf": true,
            "__ptConfig": {
                "xtype": "label",
                "text": "Label"
            }
        }, {
            "text": "Button",
            "qtip": "A button",
            "leaf": true,
            "__ptConfig": {
                "xtype": "button",
                "text": "Ok"
            }
        }

*/