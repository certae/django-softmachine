/* 
 * Definicion de las propiedades, 
 * 
 * las propiedades tienen 
 * 
 *      help         : description 
 *      type    
 *      choices      : lista de valores en caso de ser string 
 *      required     : 
 * 
 *  EL nombre de la propiedad contiene el defaultValue q solo se aplcia 
 *  si no existe y es requerida  
 * 
 */

// La defincion de tipos es   xxx.type = [ 'boolean' | 'date' | 'string' | 'number' ] 


function verifyPrpType(  lKey,  cValue ) {
    /* Verifica los tipos de las  propiedades
     * recibe el valor y el tipo y verifica si 
     * corresponden entre si
     * 
     * Intenta la conversion, sin no regresa nulo 
     */ 
    
    var pType = _MetaProperties[ lKey + '.type' ] 
    if ( ! pType )  { 
        if ( typeof ( cValue ) == 'string') { return cValue.trimRight()  }
        else { return cValue }      
    }
    
    if ( pType == typeof( cValue ) ) 
    { return cValue  }    
    
    switch ( pType ) {
    case "boolean":
        if  ( (typeof( cValue ) == 'number') ){ cValue = cValue.toString() }
        if  ( (typeof( cValue ) == 'string') ){
            if ( cValue.substr(1,1).toLowerCase()  in oc([ 'y', 's', '1','o' ]) )
            { return true } else { return false } 
        } else { return false }  
    case "number":
        return parseFloat( cValue );
    case "null":
        return null 
    default:
        return cValue
    }
}



_MetaProperties =  {

    "metaVersion.help" : "Version interna de la meta", 
    "userVersion.help" : "Version de usuario ( editable )",
     
    "exportCsv.help"   : "Permite exportar la definicion de fields en formato csv",   
    "exportCsv.type" : "boolean", 

    
//  Types
    "required.type" : "boolean", 
    "fromModel.type"  : "boolean",
    "hideRowNumbers.type"  : "boolean",
    "multiSelect.type"  : "boolean",
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

    "denyAutoPrint.type" : "boolean", 
    "denyAutoPrint.help" : "Impide la impresion automatica de la grilla", 

// Detalles 
    "masterField" : "pk",

    "menuText.help"         : "titulo en el menu ( toolbar )", 
    "detailName.help"       : "key del detalle usada para encadenar los reportes ", 
    
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

    "templateFp.help": "Templante FirstPage", 
    "templateLp.help": "Templante LastPage",
     
    "templateBb.help": "Templante BeforeBlock", 
    "templateAb.help": "Templante AfterBlock", 

    "templateBb": "<spam>------------------------------------</spam><br>", 
    "templateAb": "<spam>====================================</spam><br>", 

    "templateEr.help": "EveryRow", 

    "templateFp": '<!DOCTYPE html>' + 
        '<html>' +
          '<head>' +
           '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />' +
           '<link href="/static/css/print.css" rel="stylesheet" type="text/css" media="screen,print" />' +
           '<title>PtReport : {{reportTitle}}</title>' +
          '</head>' +
        '<body>',  

    "templateLp": '</body>' +
                  '</html>',  


// 
    "required": false,
    "required.help": "Requiere valores la forma",
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
    
    "hidden.help": "componente oculto",
    "hidden.type": "boolean",

    "hideLabel.help": "presenta los campos sin label, util cuando se configura grupos como firstName, lastName",
    "hideSheet.help" : "Oculta la ficha descriptiva", 
    "hideRowNumbers.help" : "Oculta la columna que numera los campos", 
    "multiSelect.help" : "Permite seleccionar multiples registros", 

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

    "type.help" : "Tipo de dato de la Db ", 
    "type.choices" : [ "", "string", "text", "bool", "int", "decimal", "combo", "date",  "datetime", "time", "autofield", "html", "foreignid",  "foreigntext"  ],             

    "vType.help" : "TODO: Tipo de dato de validacion  ", 
    "vType.choices" : [ "", "email", "ip4", "ip6", "tel", "postalCodeCA", "postalCodeUSA"  ],             
    
    "width.help": "The width value in pixels",
    
    "wordWrap.type": "boolean",
    "wordWrap.help": "ver el contenido en mas de una linea", 

    "sheetType.help" : "Tipo de hoja ( usada para reportes ) ", 
    "sheetType.choices" : [ "", "printerOnly", "gridOnly"], 
    
    "detailName.help" : "Nombre correspondiente a un detalle declarado en la opcionBase correspondiente ( padre )",              

    "actionType.help" : "Tipo de accion ( metodos backend ) ", 
    "actionType.choices" : [ "", "report", "wflow", "edicion"], 

    "refreshOnComplete.type": "boolean",
    
    "actionParamType.help" : "Tipo de dato del parametro", 
    "actionParamType.choices" : [ "", "string", "bool", "number"], 
    
    "fromField.help" : "Copia el contenido de un campo en otro, en el caso de zooms o valores por defecto" 
    

};