// @Author : Dario Gomez /  Certae U. Laval Quebec, Qc, Canada
    // Objetos utilizados por la pci,
    // El marcador ( atrr ) del objeto corresponde al "__ptType"
   

 

//  FieldSet 
//  El layout column permite un manejo flexible 
//  fluid:  Si no se especifica el "columnWidth"  es flexible 
//  xCol :Dependiendo el numero de columnas el "columnWidth"  puede ser 1, 0.5, 0.33
//  fix  : Se especifica el "width"   


DesignerObjects =  {

    "pcl": {
        "description": "definicion de la meta",
        "microHelp": {
            "shortTitle.help": "titulo del menu  y de la forma",
            "description.help": "microayuda del menu ",
            "protoIcon.help": "icono de la opcion, correponde a los iconos definidos en app.cs",
            "helpPath.help": "se define como : /help/xxxx.html  esta en: /static/help"
        },
        "ptConfig": {
            "shortTitle": "",
            "description": "",
            "protoIcon": "",
            "helpPath": ""
        },
        "readOnlyProps": ["__ptType"]
    },
    
    "fieldset": {
        "description": "A Fieldset, containing field elements",
        "microHelp": {
            "title": "Titulo del fieldset",
            "layout": "distribucion de los campos en el contenedor",
            "autoscroll": "t/f",
            "collapsible": "t/f",
            "collapsed": "t/f aparece contraido",
            "height": "The height value in pixels",
            "maxHeight": "The max value in pixels",
            "minHeight": "The minimum value in pixels",
            "width": "The width value in pixels",
            "maxWidth": "The max value in pixels",
            "minWidth": "The minimum value in pixels"
        },
        "__ptConfig": {
            "__ptType": "fieldset",
            "title": "",
            "layout": "fluid",
            "autoscroll": true,
            "collapsible": false,
            "collapsed": false,
            "height": null,
            "maxHeight": null,
            "minHeight": null,
            "width": null,
            "maxWidth": null,
            "minWidth": null
        },
        "__ptCombos": {
            "layout": ["fluid", "1col", "2col", "3col", "fix"]
        }
    },

    "formFields": {
        "description": "A field element",
        "__ptConfig": {
            "__ptType": "formField",
            "tooltip": "",
            "fieldLabel": "",
            "labelWidth": 100,
            "labelAlign": "left",
            "hideLabel": false,
            "allowBlank": true,
            "readOnly": false,
            "hidden": false,
            "defaultValue": null,
            "width": null,
            "maxWidth": null,
            "minWidth": null,
            "wordWrap": false,
            "format": "",
            "allowDecimals": false,
            "decimalPrecision": 0
        },
        "__ptCombos": {
            "labelAlign": ["left", "top"]
        }
    }
}



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
        "text": "Panel",
        "qtip": "A simple panel with default layout",
        "children": [], 
        "__ptType": "panel",
        "__ptConfig": {
            "xtype": "panel",
            "title": "Panel"
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