
// La defincion de tipos es   xxx.type = [ 'boolean' | 'date' | 'string' | 'number' ] 


DesignerProperties =  {


//  Types
    "allowBlank.type" : "boolean", 
    "fromModel.type"  : "boolean",
    "hideRowNumbers.type"  : "boolean",
    "readOnly.type"  : "boolean",
    
// PCI
    "protoConcept.help" : "Opcion de base de la pci (apunta directamente al modelo Django  app.modelo)",
    "protoOption.help"  : "Definicion de view interface - puede ser = al protoConcpeto o definir un nivel adicional app.modelo.vista", 
    "description.help"  : "Text descriptivo", 
    "protoIcon.help"  : "iconName tal como se define en el css",
    "shortTitle.help" : "Titulo del menu y de la forma" ,
    "idProperty.help" : "Campo q sirve como Id en el modelo, Django definie por defecto un Id, no es necesario definirlo explitamente",
     
    "pciStyle" : "grid", 
    "pciStyle.help" : "Presentacion de la pci [ form,  grid, tree]", 
    "pciStyle.choices": ["grid", "form", "tree"],

    "version.help" : "Cofigo de version", 


// Detalles 

    "masterField" : "pk",

    "menuText.help"         : "titulo en el menu ( toolbar )", 
    "conceptDetail.help"    : "Entidad detalle de la relacion ( [App.]Model o [App.]Model.View )",
    "masterField.help"      : "Campo en el maestro para q contiene el criterio para el filtro del detalle, (normalmente Pk si es un detalle directo)",
    "detailField.help"      : "Campo del detalle para hacer el filtro, normalmente el nombre de la tabla padre en minuscula", 
    "detailTitleLbl.help"   : "Titulo en el detalle para indicar el filtro actual", 

    "masterTitleField.help" : "Campo en el maestro que se utiliza para construir el titulo de la vista filtrada en el detalle", 
    "detailTitleField.help" : "Campo en el detalle donde se copia el valor del titulo del maestro ( default de la llave padre en la edicion )", 

//  Udps 
    "propertyPrefix" : "udp", 
    "propertyPrefix.help" : "prefijo de las propiedades definidas por el usuario ( en el nombre del campo aparencen upd__xxxxx)", 
    "propertyName.help" : "campo que contiene la llave de la propiedad",
    "propertyValue.help" : "campo que contiene el valor",

    "propertyRef.help" : "REQUERIDO: Campo en la udp q apunta a la tabla base",    
    "keyField.help" : "Campo leido del registro de base<br>** Solo se debe setear cuando la udp no es un MD",
    "udpTable.help" : "Tabla que contiene las upds, <b>** Si es un vinculo directo corresponde al related_name q es el set de detalles, normalmente la tablaUdp comenzando por minuscula", 

// sheets
    "protoSheetSelector.help": "Campo de criterio para seleccionar el template, vacio para una unica plantilla por defecto DEFAULT",
    "template.help": "Definicion de la plantilla", 

// 
    "allowBlank": true,
    "allowBlank.help": "permite blancos en la forma, es diferente al nulo de la Db",
    "allowDecimals.help": "NO USAR : si permite o no decimales, si decimalPReciosion = 0 implica falso",
    "autoscroll": true,
    "autoscroll.help": "t/f",

    "choices.help": "lista de valores separados por coma para el combobox",
    
    "collapsed": false,
    "collapsed.help": "t/f aparece contraido",
    "collapsed.type": "boolean",

    "collapsible": false,
    "collapsible.help": "t/f",
    "collapsible.type": "boolean",

    "cellToolTip.help": "Presenta contenido del campo como micro ayuda",
    "cellToolTip.type": "boolean",

    "cellLink.help": "Presenta contenido del campo como micro ayuda",
    "cellLink.type": "boolean",

    "fromModel.help" : "Pertenece al modelo de base",  
    "xtype.help" : "Tipo de objeto en el frontEnd ( puede ser manipulado con el vType)",
    "xtype.choices": ["", "textfield", "combobox", "checkbox", "numberfield", "textarea", "datefield" ],
    
    "decimalPrecision": 0,
    "decimalPrecision.help": "Cantidad de decimales permitidos ( 0 para enteros 2 para decimales )",
    "defaultValue.help": "valor por defecto",
    
    "fieldLabel.help": "label en la forma",
    "format.help": "mascara del campo ( automatico para las fechas, horas y numeros )",
    "fsLayout": "fluid",
    "fsLayout.choices": ["fluid", "1col", "2col", "3col" ],
    "fsLayout.help": "distribucion de los campos en el contenedor",

    "header.help" : "Encabezado de la collumna en modo grilla ( default para fieldLabel ) " ,

    "height.type": "number",
    "height.help": "The height value in pixels",
    "helpPath.help": "se define como : /help/xxxx.html  esta en: /static/help",
    
    "hidden": false,
    "hidden.help": "componente oculto",
    "hidden.type": "boolean",

    "hideLabel": false,
    "hideLabel.help": "presenta los campos sin label, util cuando se configura grupos como firstName, lastName",

    "hideSheet" : false, 
    "hideSheet.help" : "Oculta la ficha descriptiva", 

    "hideRowNumbers" : false, 
    "hideRowNumbers.help" : "Oculta la columna que numera los campos", 

    "filterSetABC.help" : "Genera automaticamente filtro alfabetico sobre la columna seleccionada", 

    "labelAlign": "left",
    "labelAlign.choices": ["left", "top"],
    "labelAlign.help": "opciones left top",

    "labelWidth.help": "ancho del label",

    "maxHeight.help": "The max value in pixels",
    "maxWidth.help": "The max value in pixels",

    "maxHeight.type": "number",
    "maxWidth.type": "number",

    "minHeight.help": "The minimum value in pixels",
    "minWidth.help": "The minimum value in pixels", 

    "minHeight.type": "number",
    "minWidth.type": "number", 

    "height.type": "number",
    "width.type": "number", 

    "flex.type": "number", 
    "flex.help": "Recalcula el ancho en funcion de la forma y el peso ( flex) asignado", 

    "readOnly": false,
    "readOnly.help": "campo de solo lectura",
    "title.help": "Titulo del componente",
    "tooltip.help": "microayuda del componente ",
 
    "sortable.help": "t/f",
    "sortable.type": "boolean",

 
    "type" : "string",    
    "type.help" : "Tipo de dato de la Db ", 
    "type.choices" : [ "", "string", "text", "bool", "int", "decimal", "combo", "date",  "datetime", "time", "autofield", "html", "foreignid",  "foreigntext"  ],             

    "vType.help" : "TODO: Tipo de dato de validacion  ", 
    "vType.choices" : [ "", "email", "ip4", "ip6", "tel", "postalCodeCA", "postalCodeUSA"  ],             
    
    "width.help": "The width value in pixels",
    
    "wordWrap.type": "boolean",
    "wordWrap.help": "ver el contenido en mas de una linea"
    
};