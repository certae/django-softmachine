// @Author : Dario Gomez /  Certae U. Laval Quebec, Qc, Canada
    // Objetos utilizados por la pci,
    // El marcador ( atrr ) del objeto corresponde al "__ptType"
   

 

//  FieldSet 
//  El layout column permite un manejo flexible 
//  fluid:  Si no se especifica el "columnWidth"  es flexible 
//  xCol :Dependiendo el numero de columnas el "columnWidth"  puede ser 1, 0.5, 0.33
//  fix  : Se especifica el "width"   


DesignerProperties =  {
    "allowBlank": true,
    "allowBlank.help": "permite blancos en la forma, es diferente al nulo de la Db",
    "allowDecimals.help": "NO USAR : si permite o no decimales, si decimalPReciosion = 0 implica falso",
    "autoscroll": true,
    "autoscroll.help": "t/f",
    
    "collapsed": false,
    "collapsed.help": "t/f aparece contraido",
    "collapsible": false,
    "collapsible.help": "t/f",
    
    "decimalPrecision": 0,
    "decimalPrecision.help": "Cantidad de decimales permitidos ( 0 para enteros 2 para decimales )",
    "defaultValue.help": "valor por defecto",
    
    "fieldLabel.help": "label en la forma",
    "format.help": "mascara del campo ( automatico para las fechas, horas y numeros )",
    "fsLayout": "fluid",
    "fsLayout.choices": ["fluid", "1col", "2col", "3col", "fix"],
    "fsLayout.help": "distribucion de los campos en el contenedor",
    "height.help": "The height value in pixels",
    "helpPath.help": "se define como : /help/xxxx.html  esta en: /static/help",
    "hidden": false,
    "hidden.help": "componente oculto",

    "hideLabel": false,
    "hideLabel.help": "presenta los campos sin label, util cuando se configura grupos como firstName, lastName",

    "labelAlign": "left",
    "labelAlign.choices": ["left", "top"],
    "labelAlign.help": "opciones left top",

    "labelWidth.help": "ancho del label",

    "maxHeight.help": "The max value in pixels",
    "maxWidth.help": "The max value in pixels",
    "minHeight.help": "The minimum value in pixels",
    "minWidth.help": "The minimum value in pixels", 
    "protoIcon.help": "icono de la opcion, correponde a los iconos definidos en app.cs",
    "readOnly": false,
    "readOnly.help": "campo de solo lectura",
    "title.help": "Titulo del componente",
    "tooltip.help": "microayuda del componente ",
    "width.help": "The width value in pixels",
    "wordWrap": false,
    "wordWrap.help": "ver el contenido en mas de una linea"
    }

DesignerObjects =  {

    "protoForm": {
        "description": "definicion de la meta",
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