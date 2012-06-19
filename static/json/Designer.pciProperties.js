
// La defincion de tipos es   xxx.type = [ 'boolean' | 'date' | 'string' | 'number' ] 


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

// Detalles 

    "masterField" : "pk",

    "menuText.help"         : "titulo en el menu ( toolbar )", 
    "conceptDetail.help"    : "Entidad detalle de la relacion ( App.Model App.Model.View? )",
    "masterField.help"      : "Campo en el maestro para q sirve de criterio para el filtro del detalle, por ahora solo el ID (Pk)",
    "detailField.help"      : "Campo del detalle para hacer el filtro", 
    "detailTitleLbl.help"   : "Titulo en el detalle para indicar el filtro actual", 
    "detailTitlePattern.help" : "Campo en el maestro que se utiliza para construir el titulo de la vista filtrada en el detalle", 

//  Udps 
    "propertyPrefix" : "udp", 
    "propertyPrefix.help" : "prefijo de las propiedades definidas por el usuario ( en el nombre del campo aparencen upd__xxxxx)", 
    "propertyName.help" : "En la tabla de udps el nombre del campo que contiene la llave de la propiedad",
    "propertyValue.help" : "En la tabla de udps el nombre del campo que contiene el valor",
    "udpTable.help" : "Tabla que contiene las upds", 


// sheets

    "protoSheetSelector.help": "Campo de criterio para seleccionar el template, vacio para una unica plantilla por defecto DEFAULT",
    "template.help": "Definicion de la plantilla", 
    

// 
    "allowBlank": true,
    "allowBlank.help": "permite blancos en la forma, es diferente al nulo de la Db",
    "allowDecimals.help": "NO USAR : si permite o no decimales, si decimalPReciosion = 0 implica falso",
    "autoscroll": true,
    "autoscroll.help": "t/f",
    
    "collapsed": false,
    "collapsed.help": "t/f aparece contraido",

    "collapsible": false,
    "collapsible.help": "t/f",
    "collapsible.type": "boolean",

    "cellToolTip.help": "Presenta contenido del campo como micro ayuda",
    "cellToolTip.type": "boolean",

    "cellLink.help": "Presenta contenido del campo como micro ayuda",

    "fromModel.help" : "Pertenece al modelo de base",  
    "xtype" : "Tipo de objeto en el frontEnd ( puede ser manipulado con el vType)",
    
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
    "type.help" : "Tipo de dato de la Db ", 
    "type.choices" : [ "string", "text", "bool", "int", "decimal", "combo", "date",  "datetime", "time", "autofield", "foreignid",  "foreigntext"  ],             

    "vType.help" : "Tipo de dato de presentacion ( por defecto igual a 'type') ", 
    "vType.choices" : [ "string", "text", "bool", "int", "decimal", "combo", "date",  "datetime", "time", "autofield", "foreignid",  "foreigntext"  ],             
    
    "width.help": "The width value in pixels",
    "wordWrap": false,
    "wordWrap.help": "ver el contenido en mas de una linea"
    
    }