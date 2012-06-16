
DesignerProperties =  {
// PCI
    "protoConcept.help" : "Opcion de base de la pci (apunta directamente al modelo Django  app.modelo)",
    "protoOption.help"  : "Definicion de view interface - puede ser = al protoConcpeto o definir un nivel adicional app.modelo.vista", 
    "description.help"  : "Text descriptivo", 
    "protoIcon.help"  : "iconName tal como se define en el css",
    "shortTitle.help" : "Titulo del menu y de la forma" ,
    "idProperty.help" : "Campo q sirve como Id en el modelo, Django definie por defecto un Id, no es necesario definirlo explitamente",
     
    "pciStyle" : "grid", 
    "pciStyle.help" : "Presentacion de la pci [ form,  grid]", 
    "pciStyle.choices": ["grid", "form"],

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
    "fsLayout.choices": ["fluid", "1col", "2col", "3col" ],
    "fsLayout.help": "distribucion de los campos en el contenedor",

    "header.help" : "Encabezado de la collumna en modo grilla ( default para fieldLabel ) " ,


    "height.help": "The height value in pixels",
    "helpPath.help": "se define como : /help/xxxx.html  esta en: /static/help",
    "hidden": false,
    "hidden.help": "componente oculto",

    "hideLabel": false,
    "hideLabel.help": "presenta los campos sin label, util cuando se configura grupos como firstName, lastName",

    "hideRowNumbers" : false, 
    "hideRowNumbers.help" : "Oculta la columna que numera los campos", 

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
 
    "type" : "string",    
    "type.help" : "data type [string, text, bool, int, decimal, combo, date, datetime, time, autofield, foreignid, foreigntext]", 
    "type.choices" : [ "string", "text", "bool", "int", "decimal", "combo", "date",  "datetime", "time", "autofield", "foreignid",  "foreigntext"  ],             
    
    "width.help": "The width value in pixels",
    "wordWrap": false,
    "wordWrap.help": "ver el contenido en mas de una linea"
    
    }