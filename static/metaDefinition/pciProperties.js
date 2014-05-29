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
 *  EL nombre de la propiedad contiene el prpDefault q solo se aplcia 
 *  si no existe y es requerida  
 * 
 */

// La defincion de tipos es   xxx.type = [ 'boolean' | 'date' | 'string' | 'number' ] 


function getSimpleProperties(oData, ptType) {
    // Retorna los valores simples, verificando los tipos de cada propiedad

    // Solo deben llegar objetos, si llega un array no hay props q mostrar
    if (_SM.typeOf(oData) == 'array') {
        return [];
    }

    // Inicializa con el type
    var cData = {}, cValue;
    
    if (ptType) {
        cData.__ptType = ptType;
    }

    for (var lKey in oData ) {
        cValue = oData[lKey];

        // Los objetos o arrays son la imagen del arbol y no deben ser tenidos en cuenta, generarian recursividad infinita
        if (_SM.typeOf(cValue) in _SM.objConv(['object', 'array'])) {
            continue;
        }

        // Si son valores codificados, los decodifica y los agrega
        if ( lKey in _SM.objConv(['__ptValue', '__ptList'])) {
            try {
                cData = Ext.decode(cValue);
            } catch (e) {
                // console.log( "Error de encodage", cValue )
            }

        } else {
            cValue = verifyPrpType(lKey, cValue);
            if (cValue) {
                cData[lKey] = cValue;
            }
        }
    }
    return cData;

};

function verifyPrpType(  lKey,  cValue ) {
    /* Verifica los tipos de las  propiedades
     * recibe el valor y el tipo y verifica si 
     * corresponden entre si
     * 
     * Intenta la conversion, sin no regresa nulo 
     */ 
    
    var pType = _MetaProperties[ lKey + '.type' ]; 
    if ( ! pType )  { 
        if ( typeof ( cValue ) == 'string') { return cValue.replace(/~+$/, '');  }
        else { return cValue; }      
    }
    
    if ( pType == typeof( cValue ) ) 
    { return cValue;  }    
    
    switch ( pType ) {
    case "boolean":
        if  ( (typeof( cValue ) == 'number') ){ cValue = cValue.toString(); }
        if  ( (typeof( cValue ) == 'string') ){
            if ( cValue.substr(0,1).toLowerCase()  in _SM.objConv([ 'y', 's', '1','o', 't' ]) )
            { return true; } else { return false; } 
        } else { return false; }  
    case "number":
        return parseFloat( cValue );
    case "null":
        return null; 
    default:
        return cValue;
    }
}



_MetaProperties =  {

    "metaVersion.help" : "Internal meta version", 
    "userVersion.help" : "Application version",
     
    "exportCsv.help"   : "Csv export enabled?",   
    "exportCsv.type" : "boolean", 

    "localSort.help" : "local sort?, (n/a for prototypes)", 
    "localSorttype" : "boolean",
     
    "pageSize,help" : "Page size", 
    "pageSize.type": "number", 

//QBE    
    "qbeHelp.type":"boolean",
    "qbeHelp.help": "visible trigger for select distinct (interne)",

//  Types
    "required.type" : "boolean", 
    "readOnly.type"  : "boolean",
    "primary.type" : "boolean", 
    
// PCI
    "viewEntity.help" : "Backend model (Django)",
    "viewCode.help"  : "Definicion de view code -  app.model.view", 
    "description.help"  : "Description", 
    "viewIcon.help"  : "iconName  (css name)",
    "shortTitle.help" : "Menu and form title" ,
    "idProperty.help" : "Id property (future use)",

    "protoEntity.help" : "Default prototype entity ( prototype.protoTable.xxx )  (Internal use with protoEntityId)",
     
    "pciStyle" : "grid", 
    "pciStyle.help" : "Presentation mode [ form,  grid, tree]", 
    "pciStyle.choices": ["grid", "form", "tree"],

    "gridSelectionMode.choices": ["multi", "simple", "single" ], 
    "gridSelectionMode.help":  "multi*: multiple selection with check; simple: selection on/off ; single: Last selected", 

    "denyAutoPrint.type" : "boolean", 
    "denyAutoPrint.help" : "deny auto print (future use)", 

// Detalles 
    "masterField" : "pk",

    "menuText.help"         : "Menu title ( toolbar )", 
    "detailName.help"       : "Detail key (for report detail)", 
    
    "conceptDetail.help"    : "Detail concept ( [App.]Model o [App.]Model.View )",
    "masterField.help"      : "Master field for MD navigation (normaly Pk)",
    "detailField.help"      : "Detail field for filter (normaly conceptName)", 
    "detailTitleLbl.help"   : "Detail title for filter", 

    "masterTitleField.help" : "Master field title (filter name)", 
    "detailTitleField.help" : "Master field title (copy from master title in detail edition)", 

//  Udps 
    "propertyPrefix" : "udp", 
    "propertyPrefix.help" : "udp prefix (upd__xxxxx)", 
    "propertyName.help" : "udp property name",
    "propertyValue.help" : "udp property value",

    "propertyRef.help" : "udp concept ref",    
    "keyField.help" : "udp source<br>** Only for non MD udp (internal use)",
    "udpTable.help" : "udp concept name , <strong>** if direct link then related_name, normaly udpTable</strong>", 

// sheets
    "sheetSelector.help": "field sheet selecto, null for DEFAULT sheet",
    "template.help": "template definition", 

    "templateFp.help": "Templante FirstPage", 
    "templateLp.help": "Templante LastPage",
     
    "templateBb.help": "Templante BeforeBlock", 
    "templateAb.help": "Templante AfterBlock", 

    "templateBb": "<spam>------------------------------------</spam><br>", 
    "templateAb": "<spam>====================================</spam><br>", 

    "templateEr.help": "EveryRow", 

    "templateFp":'<!DOCTYPE html><html><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type" /><link href="/static/css/print.css" rel="stylesheet" type="text/css" media="screen,print" /><title>PtReport : {{reportTitle}}</title></head><body>',
    "templateLp":'</body></html>',

    "direction": "sort order",
    "direction.choices": ["ASC", "DESC" ],

//  Fields
    "physicalName.help" : "phisical name or function  @str( f1,f2 )", 
    "required": false,
    "required.help": "Required field",
    "allowDecimals.help": "Dont use!!! : allow decimal (internal use)",
    "autoscroll": true,
    "autoscroll.help": "t/f",

    "choices.help": "comma separed values for combo selection",
    
    "collapsed": false,
    "collapsed.help": "t/f collapsed",
    "collapsed.type": "boolean",

    "zoomMultiple": false, 
    "zoomMultiple.type": "boolean", 
    "zoomMultiple.help": "Multiple selection on add",

    "collapsible": false,
    "collapsible.help": "t/f",
    "collapsible.type": "boolean",

    "cellToolTip.help": "Use this field form line tooltip",
    "cellToolTip.type": "boolean",

    "cellLink.help": "Is a cellLink?",
    "cellLink.type": "boolean",

    "xtype.help" : "frontend widget (use vType also)",
    "xtype.choices": ["", "textfield", "combobox", "checkbox", "numberfield", "textarea", "datefield" ],
    
    "prpScale": 0,
    "prpScale.help": "Decimal scale ( 0 int, 2 dec )",
    "prpDefault.help": "Default value",
    
    "fieldLabel.help": "Field label (in form)",
    "format.help": "input mask (automatic for date, time and numbers) (future use)",
    "fsLayout": "1col",
    "fsLayout.choices": ["fluid", "1col", "2col", "3col" ],
    "fsLayout.help": "Automatic layout distribution",

    "header.help" : "Column header (grid)  default for fieldLabel" ,

    "height.type": "number",
    "height.help": "The height value in pixels",
    "helpPath.help": "/help/xxxx.html  real: /static/help",
    
    "hidden.help": "Hiden field (future use)",
    "hidden.type": "boolean",

    "hideLabel.help": "Hide label? (ex: firstName, lastName)",
    "hideSheet.help" : "Hide sheet?", 
    
    "hideRowNumbers.help" : "Hide row numbers?", 
    "hideRowNumbers.type"  : "boolean",
    
    "hideCheckSelect.type"  : "boolean",
    "hideCheckSelect.help" : "Hide check select?", 

    "filterSetABC.help" : "Auto alphabetic filter", 

    "labelAlign": "left",
    "labelAlign.choices": ["left", "top"],
    "labelAlign.help": "Label align (left, top)",

    "labelWidth.help": "Label width",

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
    "flex.help": "Flex width eqivalence", 

    "readOnly": false,
    "readOnly.help": "ReadOnly field?",
    "title.help": "Title",
    "tooltip.help": "Microhelp",
 
    "sortable.help": "Sortable?",
    "sortable.type": "boolean",

    "searchable.help": "Searchable?",
    "searchable.type": "boolean",

    "type.help" : "Field type", 
    "type.choices" : [ "", "string", "text", "bool", "int", "decimal", "combo", "date",  "datetime", "time", "autofield", "html", "foreignid",  "foreigntext"  ],             

    "vType.help" : "Validation type", 
    "vType.choices" : [ "", "email", "ip4", "ip6", "tel", "postalCodeCA", "postalCodeUSA"  ],             
    
    "width.help": "The width value in pixels",
    
    "wordWrap.type": "boolean",
    "wordWrap.help": "Auto wordWrap (more than one line)", 

    "sheetType.help" : "Sheet type (Grid, Report)", 
    "sheetType.choices" : [ "", "printerOnly", "gridOnly"], 
    
    "detailName.help" : "Detail name (used in MD definition)",              

    "actionType.help" : "Action type (backend function)", 
    // Solo las acciones de tipo "user" son presentadas  en el menu
    // los triggers pueden ser escritos directamente en el modelo y no pasar por protoExt 
    "actionType.choices" : [ "user", "insTrigger", "updTrigger", "delTrigger", "wflow"], 
    "refreshOnComplete.type": "boolean",
    
    "paramType.help" : "Parameter type", 
    "paramType.choices" : [ "", "string", "bool", "number"], 

    "cpFromField.help" : "Derived by copy",  
    "cpFromZoom.help" : "Derived form zoom (fk property)? ", 
    
    "crudType.help" : "Crud type", 
    // editable      : es un campo estandar de la Db ( default )  
    // screenOnly    : ninguna iteraccion con la db, funciones calculadas en el frontEnd, o campos de procesamiento intermedio para generar otros campos     
    // storeOnly     : leido de la Db,  no se despliega en el frontEnd, se usa como resultado de campos calculados, usado para manejar subSets ( implica definir baseFilter, vrDefault  )
    // insertOnly    : campos invariables ( ej: nro documento, )      
    // updateOnly    : nulo al inicio, requerido en modificacion       
        
    // linked        : no es editable, no se guarda en la Db, requiere cpFromField,  cpFromZoom* ( *para prototipos, o zooms no relacionales )  
    // copied        : toma el vr por defecto de cpFromField o cpFromZoom ( similar a linked + editable )      
    "crudType.choices" : [ "", "editable", "screenOnly", "storeOnly", "insertOnly", "updateOnly", "linked", "copied" ], 
    
    "selectionMode.help" : "Grid selection mode for actions",
    // none : Envia la accion sin QSet 
    // single : Exige un unico reg 
    // multiple : Exige al menos un reg       
    // details : Envia la seleccion de detalles 
    "selectionMode.choices" : [ "none", "single", "multiple", "details" ], 

    "addDetailForm.help" : "Shortcut to the add form", 
    "addDetailForm.type" : "boolean"

};