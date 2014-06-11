/*
Copyright(c) 2012 CeRTAE
*/
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
* Los objetos de tipo list contienen ademas, esto permite agregar instancias en la pcl
*
*       listOf
*
* Tambien se puede aplicar un valor por defecto, por
* ejemplo en listDisplay  = ['__str__']
*
*      prpDefault : ['__str__']
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

-- Determina el nombre del nodo en las listas

"nodeName" : "filterName",

-- Permite agregar un template en caso de nodos json
"__ptStyle" : "jsonText"
"addTemplate" : "{\"listDisplay\":{},\"name\": \"@name\"}",

--  Creacion de nodos

"allowAdd" : true            //  requiere un listOf
"listOf" : "filtersSetDef",

*/

//  FieldSet
//  El layout column permite un manejo flexible
//  fluid:  Si no se especifica el "columnWidth"  es flexible
//  xCol :Dependiendo el numero de columnas el "columnWidth"  puede ser 1, 0.5, 0.33
//  fix  : Se especifica el "width"  ( si se especifica el width prima sobre la definicion )

/*global Ext */
/*global _SM */
/*global ProtoUL */
/*global _MetaObjects */

function verifyMeta(oMeta, ptType, tNode) {

    //  Verifica un objeto de acuerdo a la estructura
    //  Si es un objeto asociado a un arbol tNode es el de base,

    var __ptConfig = _MetaObjects[ptType];
    var listOfConf, sKey, nBranch, myObj, ix;

    if (!__ptConfig) {
        return oMeta;
    }

    // Verifica las listas
    if (__ptConfig.lists && (_SM.typeOf(__ptConfig.lists) == 'array' )) {
        for (ix in __ptConfig.lists  ) {
            sKey = __ptConfig.lists[ix];
            if ( typeof (sKey) != 'string') {
                continue;
            }

            listOfConf = _MetaObjects[sKey] || {};
            oMeta[sKey] = _SM.verifyList(oMeta[sKey], listOfConf.prpDefault);

            if (tNode) {
                // agrega una nueva lista al arbol
                nBranch = {
                    'text' : sKey,
                    '__ptType' : sKey,
                    '__ptConfig' : {
                        '__ptType' : sKey
                    },
                    'children' : []
                };

                tNode.children.push(nBranch);
            }

        }
    }

    // Verifica los Objetos ( no aplica los default, pues la config puede eliminarlos )
    if (__ptConfig.objects && (_SM.typeOf(__ptConfig.objects) == 'array' )) {
        for (ix in __ptConfig.objects  ) {
            sKey = __ptConfig.objects[ix];
            if ( typeof (sKey) != 'string') {
                continue;
            }

            myObj = oMeta[sKey];
            if (_SM.typeOf(myObj) != 'object') {
                myObj = {};
            };

            if (tNode) {

                // agrega un nuevo objeto al arbol
                nBranch = getNodeBase(sKey, sKey, {
                    '__ptType' : sKey
                });
                tNode.children.push(nBranch);

                // Agrega los hijos tambein al arbol
                oMeta[sKey] = verifyMeta(myObj, sKey, nBranch);

            } else {

                oMeta[sKey] = verifyMeta(myObj, sKey);
            }

        }
    }

    // No es necesario verificar las propiedades pues se hace al momento de guardar la pcl
    // if ( __ptConfig.properties  &&  ( _SM.typeOf( __ptConfig.properties  ) == 'array' ))  {

    return oMeta;

}

function clearPhantonProps(__ptConfig, __ptType) {
    /* Borra las propieades q no hacen parte de la config de base
     */
    var objConfig = _MetaObjects[__ptType] || {};
    for (var ix in __ptConfig ) {
        if (!objConfig.properties) {
            continue;
        }
        if (!( ix in _SM.objConv(objConfig.properties.concat(['name', '__ptValue', '__ptList', '__ptType'])))) {
            // console.log( ix )
            delete __ptConfig[ix];
        }
    }
    return __ptConfig;
}

_versionMeta = '14.0201';

_MetaObjects = {

    "pcl" : {
        "description" : "Meta definition",
        "properties" : [
                "viewCode", "viewEntity", "viewIcon", "description", "shortTitle", 
                "localSort", "pageSize", 
                "sheetSelector", "pciStyle", "helpPath", "idProperty", 
                "jsonField", "returnField", "updateTime", 
                "metaVersion", "userVersion", "protoEntity", "protoEntityId", "pciType"
                ],
        "objects" : ["gridConfig", "gridSets", "formConfig", "usrDefProps", "custom", "businessRules"],
        "lists" : ["fields", "fieldsBase", "fieldsAdm", "actions", "detailsConfig", "sheetConfig"],
        "roProperties" : ["viewEntity", "idProperty", "updateTime", "metaVersion", "protoEntity", "protoEntityId"]
    },

    "fields" : {
        "description" : "Store fields definition",
        "listOf" : "field"
    },

    "fieldsBase" : {
        "description" : "Base store fields definition",
        "listOf" : "field"
    },

    "fieldsAdm" : {
        "description" : "Admin store fields definition",
        "listOf" : "field"
    },

    "field" : {
        "description" : "A store field element",
        "properties" : ["name", "required", "prpLength", "prpScale", "prpDefault", "fieldLabel", "format", "header", "sortable", "searchable", "flex",
        // "height","maxHeight","minHeight",
        // "width", "maxWidth","minWidth",
        // "hideLabel",
        // "labelAlign","labelWidth",

        "tooltip",
        // "cellToolTip",
        // "qbeHelp",
        "cellLink", "wordWrap",

        // manejo
        "primary", "crudType", "readOnly", "hidden",

        // Para el combo
        "choices",

        // Para el zoom
        "fkId", "fkField", "cellLink", "zoomModel", "zoomFilter", "zoomMultiple",

        // Definien como heredar datos de otro campo ( ya se a de un zoom o del mismo rset )
        "cpFromField", "cpFromZoom",

        // Para los N2N
        // "conceptDetail",
        // "relatedN2N",
        // "detailField",
        // "masterField",
        "physicalName", "type", "xtype", "vType"],
        "roProperties" : []
    },

    "formField" : {
        "description" : "A field element",
        "properties" : ["name", "tooltip", "fieldLabel", "labelWidth", "labelAlign", "hideLabel", "required", "readOnly", "hidden", "prpDefault",
        // "height","maxHeight","minHeight",
        // "width", "maxWidth","minWidth",

        "format", "prpLength",

        // Para los campos del htmlSet
        "collapsed",

        // Para el combo
        "choices",

        // Para el zoom
        "fkId", "fkField", "zoomModel", "zoomFilter", "zoomMultiple", "cellLink",

        // Para los N2N
        // "conceptDetail",
        // "relatedN2N",
        // "detailField",
        // "masterField",

        // tipos
        "type", "xtype", "vType"],
        "roProperties" : ["type "]

    },

    "gridConfig" : {
        "description" : "Grid configuration properties",
        "properties" : [
            'hideRowNumbers',
            // 'hideCheckSelect',
            'gridSelectionMode', "exportCsv", 'hideSheet', 'denyAutoPrint', 'filterSetABC', 
            'groupCol'
        ],

        "lists" : ["listDisplay", "baseFilter", "initialFilter", "initialSort",

        // TODO: Eliminar de aqui y pasar a obj  colShortcuts
        "searchFields", // TODO: Cambiar por sercheable
        "sortFields", // TODO: Cambiar por sortable
        "hiddenFields", "readOnlyFields"],
        "objects" : [
        // "colShortcuts"
        ]

    },

    // TODO: Caundo se agrega aqui, al guardar actualiza fieldDefinition,
    // el agregar o borrar prevalece sobre la condicion del campo.
    "colShortcuts" : {
        "description" : "Column configuration shortcuts",
        "lists" : ["searchFields", // TODO: Cambiar por sercheable
        "sortFields", // TODO: Cambiar por sortable
        "hiddenFields", "readOnlyFields"

        // qbeAllowFields
        // textSearchFields
        ]
    },

    // Estos son actualizados por el staf ( admin de grupo )
    "gridSets" : {
        "description" : "Additional settings ( filters, sorters, userViews )",
        "lists" : ["listDisplaySet", "filtersSet", "sortersSet"]
    },

    // Estos son actualizados por los usuarios de base
    "custom" : {
        "description" : "custom user configurations",
        "lists" : ["listDisplay", "listDisplaySet", "filtersSet", "sortersSet"]
    },

    "baseFilter" : {
        "description" : "Default defined filter. No user-modifiable, e.g. { \"status__exact\":\"0\" } ",
        "listOf" : "filterDef",
        "allowAdd" : true
    },

    "customFilter" : {
        "description" : "Predefined filter ",
        "listOf" : "filterDef",
        "allowAdd" : true
    },

    "initialFilter" : {
        "description" : "Initial filter  Ej: { \"status__exact\":\"0\" } ",
        "listOf" : "filterDef",
        "allowAdd" : true
    },

    "initialSort" : {
        "description" : "Default ordering  Ej: [{\"direction\":\"ASC\",\"property\":\"code\"}, ... ] ",
        "listOf" : "sorterDef",
        "allowAdd" : true
    },

    "sorterDef" : {
        "description" : "Sort definition",
        "addPrompt" : "Please enter the name of the property for your sorter:",
        "allowDel" : true,
        "nodeName" : "property",
        "properties" : ["property", "direction"]
    },

    "sortersSet" : {
        "description" : "Sorter set",
        "listOf" : "sortersSetDef",
        "allowAdd" : true
    },

    "sortersSetDef" : {
        "description" : "Sorter set definition",
        "addPrompt" : "Please enter the name of the sorter:",
        "allowDel" : true,
        "properties" : ["name", "description"],
        "lists" : ["customSort"]
    },

    "customSort" : {
        "description" : "User ordering",
        "listOf" : "sorterDef",
        "allowAdd" : true
    },

    "filterDef" : {
        "description" : "Predefined filter definition",
        "addPrompt" : "Please enter the name of the property for your filter:",
        "allowDel" : true,
        "nodeName" : "property",
        "properties" : ["property", "filterStmt"]
    },

    "filtersSet" : {
        "description" : "Predefined filter set ( *x*, ><=, !=,  aa:bb ) ",
        "listOf" : "filtersSetDef",
        "allowAdd" : true
    },

    "filtersSetDef" : {
        "description" : "Filter set definition",
        "addPrompt" : "Please enter the name of the filterSet:",
        "allowDel" : true,
        "properties" : ["name", "menuText"],
        "lists" : ["customFilter"]
    },

    "listDisplaySet" : {
        "description" : "Alternative configuration for the grid ( it appears under the icon 'ViewCols' of the main bar )",
        "listOf" : "listDisplayDef",
        "allowAdd" : true
    },

    // El esquema no soporta una lista de listas, tiene q ser un objeto para poder nombralo
    "listDisplayDef" : {
        "description" : "Predefined column set (view)",
        "addPrompt" : "Please enter the name of the columnSet:",
        "allowDel" : true,
        "properties" : ["name", 'hideRowNumbers', "description"],
        "lists" : ["listDisplay"]

    },

    "hiddenFields" : {
        "description" : "List of hidden fields",
        "__ptStyle" : "colList"
    },

    "listDisplay" : {
        "description" : "List of fields to display in the grid",
        // "prpDefault" : ["__str__"],
        "addPrompt" : "Please enter the name for your alternative listDisplay:",
        "__ptStyle" : "colList"
    },

    "readOnlyFields" : {
        "description" : "List of fields to marked as ReadOnly ( the property ReadOnly can also be used )",
        "__ptStyle" : "colList"
    },

    "searchFields" : {
        "description" : "Search-enabled fields",
        "__ptStyle" : "colList"
    },

    "sortFields" : {
        "description" : "Order-enabled fields",
        "__ptStyle" : "colList"
    },

    "detailsConfig" : {
        "description" : "Details definition (Master-Detail relationship)",
        "listOf" : "detailDef",
        "allowAdd" : true
    },

    "detailDef" : {
        "description" : "Master-Detail relationship definition",
        "properties" : ["menuText", "conceptDetail", "masterField", "detailField", "detailName", "detailTitleLbl", "masterTitleField", "detailTitleField"],
        "addPrompt" : "Please enter the name for your detail:",
        "allowDel" : true
    },

    "usrDefProps" : {
        "description" : "User defined properties ( Fields created by the user, they do not participe in search and sort)",
        "properties" : ["udpTable", "propertyRef", "keyField", "propertyPrefix", "propertyName", "propertyValue"]
    },

    "sheetConfig" : {
        "description" : "Information templates in HTML that are fed by data from the database",
        "listOf" : "sheetDef",
        "allowAdd" : true
    },

    "sheetDef" : {
        "description" : "Templates definition ( the name is the selector )",
        "properties" : ["name", "template", "title", "viewIcon", "sheetType", "templateFp", "templateBb", "templateEr", "templateAb", "templateLp"],
        "lists" : ["sheetDetails"],
        "addPrompt" : "Please enter the name for your sheet:",
        "allowDel" : true
    },

    "sheetDetails" : {
        "description" : "Lista de detalles por hoja ( sheet )",
        "listOf" : "sheetDetail",
        "allowAdd" : true
    },

    "sheetDetail" : {
        "description" : "Sheet detail configuration",
        "properties" : ["name", "detailName", "detailSort", "templateBb", "templateEr", "templateAb"],
        "lists" : ["sheetDetails"],
        "addPrompt" : "Please enter the detailName:",
        "allowDel" : true
    },

    "formConfig" : {
        "hideItems" : true,
        "description" : "Form definition",
        "properties" : ["title", "tooltip", "height", "maxHeight", "minHeight", "width", "maxWidth", "minWidth", "viewIcon", "helpPath"]
    },

    "fieldset" : {
        "hideItems" : true,
        "description" : "A Fieldset, containing field elements",
        "properties" : ["title", "fsLayout", "autoscroll", "border", "collapsible", "collapsed", "labelWidth", "labelAlign", "hideLabel", "height", "maxHeight", "minHeight"
        // "width", "maxWidth","minWidth"
        ]
    },

    "htmlset" : {
        "hideItems" : true,
        "description" : "A Fieldset, containing HtmlField elements",
        "properties" : ["title", "collapsible", "collapsed", "flex", "height", "maxHeight", "minHeight"
        // "width", "maxWidth","minWidth"
        ]
    },

    "protoGrid" : {
        "description" : "A detail grid",
        "properties" : ["viewCode", "menuText", "height", "maxHeight", "minHeight", "minWidth"
        // ,"width", "maxWidth"
        ]
    },

    "detailButton" : {
        "description" : "A button link to detail",
        "properties" : [ "viewCode", "text", "addDetailForm" ]
    },


    "panel" : {
        "hideItems" : true,
        "description" : "A simple panel with fit layout",
        "properties" : ["title", "height", "maxHeight", "minHeight"
        // ,"width", "maxWidth","minWidth"
        ]
    },

    "tabpanel" : {
        "hideItems" : true,
        "description" : "A Tab Container with many tabs",
        "properties" : ["layout", "activeItem", "height", "maxHeight", "minHeight"
        // ,"width", "maxWidth","minWidth"
        ]
    },

    "actions" : {
        "description" : "Actions list (Actions menu)",
        "listOf" : "actionDef",
        "allowAdd" : true
    },

    "actionDef" : {
        "description" : "Actions definition (backend)",
        "properties" : ["name", "title", "actionType", "selectionMode", "refreshOnComplete" ],
        "lists" : ["actionParams"],

        "addPrompt" : "Please enter the name for your action:",
        "allowDel" : true

    },

    "actionParams" : {
        "description" : "Actions definition parameters",
        "listOf" : "actionParam",
        "allowAdd" : true
    },

    "actionParam" : {
        "properties" : ["name", "tooltip", "fieldLabel", "prpDefault", "required", "readOnly", "format",

        // Para el combo
        "choices",

        // Para el zoom
        "fkId", "fkField", "zoomModel", "zoomFilter", "cellLink",

        // tipos
        "type", "xtype", "vType"],
        "addPrompt" : "Action parameter",
        "allowDel" : true
    },

    "businessRules" : {
        "properties" : ["dblClick", "afterCellUpdate", "afterRowDelete", "afterSave", "beforeCellEdit", "beforeCellUpdate", "beforeRowDelete", "beforeRowInsert", "beforeOpSave", "beforeValidate", "zoomConfigure", "zoomReturn", "issRowLoad", "reposition", "getLinkFilter", "validationComplete"]
    },

    "businessRule" : {
        "properties" : ["name", "handler", "src", "type", "field"],
        "addPrompt" : "Action parameters",
        "allowDel" : true
    },

    "businessRulesText" : {
        "description" : "Business rules",
        "properties" : ["afterCellUpdate", "afterRowDelete", "BeforeCellEdit", "BeforeCellUpdate", "BeforeRowDelete", "BeforeRowInsert", "dblClick", "issZoomConfigure", "issBeforeVslidateVr", "issHelpReturn", "issRowLoad", "reposition", "getLinkFilter", "afterOpSave", "beforeOpSave", "issValidationComplete"]
    }

};


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
// Definicion del modelo,

/*global Ext */
/*global _SM */
/*global ProtoUL */

_SM.typeOf=function (value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (Object.prototype.toString.call(value) == '[object Array]') {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
};

_SM.objConv=function ( a ){
    // Object converter: Para testear si un elto hace parte de un array se convierte el array en objeto
  var o = {};
  if ( ! a ) {
      // console.log( '_SM.objConv : no list!!! ')
      return o ;
  }
  for(var i=0;i<a.length;i++)
  {
    o[a[i]]='';
  }
  return o;
};

_SM.OpenFile = function (fileName) {

    // TODO: Los templates de las finchas deberian ser leidos de un archivo
    // fh = window.open( fileName , 0);     // Open the file for reading
    // if(fh!=-1)                          // If the file has been successfully opened
    // {
        // length = flength(fh);           // Get the length of the file
        // str = fread(fh, length);        // Read in the entire file
        // fclose(fh);                     // Close the file
    // }
    // return str
};

_SM.copyProps = function (oBase, oRef, overWrite, lstInclude, lstExclude ){

    if ( !overWrite ) overWrite = true;

    var oResult = _SM.clone(oBase, 0, lstExclude);
    for(var i in oRef)
    {
        if (  overWrite ||  ! oBase[i]  ) {
            if ( !lstInclude ||  i in _SM.objConv(lstInclude) ) {
                oResult[i] = oRef[i];
            }
        }
    }
    return oResult;
};

_SM.clone = function (obj, auxRec, exclude, include) {
    /*
 * @obj     : obj to _SM.clone
 * @auxRec  : Control de recursividad  ( no debe pasar de un max de nivles ie 5 )
 * @exclude : permite excluir propiedades de un diccionario
 */

    // Verificacion de nivel de recursividad en la copia de objetos
    if ( auxRec )  {  auxRec = auxRec + 1 } else { auxRec = 1 }
    if ( auxRec > 5 )  return obj

    // si es un tipo simple,
    if (null == obj || "object" != typeof obj)
        return obj;

    if (obj instanceof Date) {
        // los objetos tipo date no son tipos de base
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    else if (obj instanceof Array) {
        // Los array son copiados elto by elto.
        var copy = [];
        var len = obj.length;
        for (var i = 0; i < len; ++i) {
            copy[i] = _SM.clone(obj[i], auxRec, exclude , include );
        }
        return copy;
    }
    else if ( obj.$class ) {
        // Si es una clase, solo copia el initialConfig y un nombre de clase
        var copy = {};
        if (obj.hasOwnProperty('initialConfig')) {
            copy.initialConfig = _SM.clone( obj.initialConfig, auxRec, exclude , include )
        }
        // if (obj.__proto__.$className ) {copy.className = obj.__proto__.$className}
        return copy;
    }

    else if (obj instanceof Object) {
        // Si es un objeto recorre las propiedades y las clona una a una
        var copy = {};
        for (var attr in obj) {
            if ( attr in _SM.objConv( ['events', 'renderer'] )) continue;
            if (( exclude ) && ( attr in _SM.objConv( exclude ))) continue;
            if (( include ) && ! ( attr in _SM.objConv( include ))) continue;

            if (obj.hasOwnProperty(attr)) {
                // console.log ( auxRec,  obj, attr, obj[attr] )
                copy[attr] = _SM.clone(obj[attr], auxRec, exclude, include);
            }
        }
        return copy;
    }
    else  {
        // console.log ( 'N/A')
        // var copy = obj.constructor();
        // for (var attr in obj) {
            // if (obj.hasOwnProperty(attr))  copy[attr] = obj[attr];
            // else copy[attr] = _SM.clone( obj[attr] );
        // }
        // return copy;
    }
};

_SM.FormatJSON = function (oData, sIndent) {
    // Indenta un string JSON no formateado
    // Tools.FormatJSon  CERTAE U. Laval 2012/02
    // @oData    :  Unformated JSon string
    // @sIndent  :  Optional spaces string  or  [&nbsp;  ]
    // sIndent = ' '  encode text

    var sIndentStyle = "&nbsp; &nbsp; ";
    var BR = "<br>";

    if (! sIndent ){ sIndent = "" }
    else if ( sIndent  == ' ') { sIndentStyle = ''; BR = '' }

    var sDataType = _SM.typeOf(oData);

    // open object
    if (sDataType == "array") {
        if (oData.length == 0) {
            return "[]";
        }
        var sHTML = "[";
    } else {
        var iCount = 0;
        for (var attr in oData) {
            iCount++;
            break;
        };
        if (iCount == 0) { // object is empty
            return "{}";
        }
        var sHTML = "{";
    }

    // loop through items
    var iCount = 0;

    for (var sKey in oData) {
        var vValue = oData[ sKey  ]
        if (iCount > 0) {
            sHTML += ",";
        }
        if (sDataType == "array") {
            sHTML += (BR + sIndent + sIndentStyle);
        } else {
            sHTML += (BR + sIndent + sIndentStyle + "\"" + sKey + "\"" + ": ");
        }

        // display relevant data type
        switch (_SM.typeOf(vValue)) {
            case "array":
            case "object":
                sHTML += _SM.FormatJSON(vValue, (sIndent + sIndentStyle));
                break;
            case "boolean":
                if ( vValue ) { sHTML += "true" } else { sHTML += "false" }
                break;
            case "number":
                sHTML += vValue.toString();
                break;
            case "null":
                 sHTML += "null";  //  None
                break;
            case "string":
                vValue = vValue.replace( /'/g, '\\\'').replace( /"/g, '\\"')
                if ( sIndent  != ' ') {
                    vValue = vValue.replace( /</g, '&lt;').replace( />/g, '&gt;')
                }

                sHTML += ("\"" + vValue + "\"");
                break;
            default:
                sHTML += ("TYPEOF: " + _SM.typeOf(vValue));
        }

        // loop
        iCount++;
    };

    // close object
    if (sDataType == "array") {
        sHTML += (BR + sIndent + "]");
    } else {
        sHTML += (BR + sIndent + "}");
    }

    // return
    return sHTML;
};

_SM.VerifyLast = function (sAux, sChar) {

    // Elimina condicionalmente el  ultima caracter
    if ( ! sChar ) sChar = ',';
    if ( sAux[sAux.length - 1] == sChar ) {
         sAux = sAux.substring(0, sAux.length-1);
    }
    return sAux;
};

_SM.FormatJsonStr = function (sData) {
    var oData = {};

    // Verifica q no venga vacio
    if ( ! sData ) return oData;

    // Separado para debuguer
    try {
        oData = Ext.decode( sData );
    } catch(e) {}

    var sAux  = _SM.FormatJSON( oData );
    return     sAux;
};

_SM.charCount = function (sData, sChar) {
    // Cuenta las ocurrencias de un caracter en una cadena
    if ( sData ) {
        return sData.split(sChar).length;
    }  else { return 0; }
};


_SM.clearProps = function (obj) {
    // Borra las propiedades con valores nulos no definidos o blancos

    for (var ix in obj) {
        if ( ! obj[ix] &&  obj[ix] != false) {
            delete obj[ix];
        } else if ( _SM.typeOf(obj[ix])  == 'string'  && obj[ix].trim() == '' ) {
            delete obj[ix];
        }
    }

    return obj;
};

_SM.errorMessage = function (errTitle, errMsg) {

    // TODO: Log de errores, ya sea en stBar o en un panel del menu, habilitar un clear .
    _SM.__StBar.showError( errMsg , errTitle );

    // Ext.MessageBox.show({
        // title: errTitle,
        // msg: errMsg,
        // icon: Ext.Msg.ERROR,
        // buttons: Ext.Msg.OK
    // });
};

_SM.updateWinPosition = function (myWidth, myHeight) {

    _SM._winX += 40; _SM._winY += 20;
    if ((_SM._winX + myWidth) > _SM._mainWin.width || (_SM._winY + myHeight) > _SM._mainWin.height) {
        _SM._winX = 10; _SM._winY = 10;
    }
};

_SM.savePclCache = function (viewCode, protoMeta, reOpen ) {

   // Asigna la llave, pues si se hace una copia seguiria trayendo la misma viewCode de base
   // console.log(protoMeta);
    if ( viewCode.substring(0, protoMeta.viewEntity.length ) !== protoMeta.viewEntity ) {
        viewCode =  protoMeta.viewEntity + '.' + protoMeta.viewCode;
    }

    protoMeta.viewCode = viewCode

    _SM.DefineProtoModel(protoMeta );

    // Guarda el cache de  pcl's
    _SM._cllPCI[viewCode] = protoMeta;

    // Cierra todas las instancias de esta pcl
    if ( reOpen ) {
        _SM.CloseProtoTab( viewCode );
        _SM._mainWin.loadPciFromMenu( viewCode );
    }

};

_SM.getModelName = function (viewCode) {
    // En principio traia un modelo de base q servia para todas las vistas construidas
    // con el nuevo esquema de creacion dinamica, es mejor q el modelo corresponda a la
    // opcion, pues las definiciones pueden ser totalmente diferentes.


    // var modelName = viewCode;
    // Cuenta los "."
    // if ( _SM.charCount( viewCode, ".")  > 2  ) {
        // var n = viewCode.split(".", 2)
        // modelName = n[0] + '.' + n[1]
    // }


    return _SM._PConfig.clsBaseModel + viewCode;
};

_SM.getSafeMeta = function (myMeta) {

    // prepara la meta q retorna al BackEnd
    var safeMeta = {
        "viewCode"  : myMeta.viewCode,
        "viewEntity" : myMeta.viewEntity,
        "localSort" :  myMeta.localSort || false,
        "protoEntityId": myMeta.protoEntityId,
        "jsonField"    : myMeta.jsonField || ''  ,
        // "pciStyle"     : myMeta.pciStyle,
        // "sql"          : myMeta.sql,
        "idProperty"   : myMeta.idProperty,
        "gridConfig"   : {
            "searchFields": _SM.clone( myMeta.gridConfig.searchFields  )
        },
        "fields": _SM.clone( myMeta.fields, 0, [],  [
            'name', 'type',
            'zoomModel', 'fkId',
            'crudType', 'cpFromField', 'cpFromZoom', 'physicalName'
            ] ),
        "usrDefProps": _SM.clone( myMeta.usrDefProps )
    } ;

    return Ext.encode( safeMeta );
};

_SM.getGridColumn = function (myGrid, dataIndex) {
    for ( var ix in myGrid.myColumns ) {
        var myCol = myGrid.myColumns[ix];
        if ( myCol.dataIndex == dataIndex )  return myCol;
    }
};

_SM.showConfig = function (title, myConf) {

        var msgBox =  Ext.create('Ext.window.MessageBox', {
            minHeight: 200,
            maxHeight: 500,
            defaultMinHeight: 200,
            defaultMaxHeight: 500,
            defaultTextHeight : 250,
            styleHtmlContent : true
        });

        // msgBox.maxHeight = 600
        // msgBox.minHeight = 200

        var sValue = _SM.FormatJSON( myConf , ' ');

        msgBox.show({
           width : 800,
           multiline : true,
           // msg va arriba de la caja de texto y se estila html y el html no sirve de nada
           // msg: sValue,
           // html: sValue,
           value: sValue,
           title: title
        });
};

_SM.getCurrentTime = function () {
    return Ext.Date.format( new Date() , "Y-m-d H:i:s" );
};

_SM.verifyList = function (myList, defList) {

    // verifica el default
    if (( ! defList ) || ( _SM.typeOf( defList ) != 'array' )) { defList = []; }

    // Verifica q sea una lista
    if ( _SM.typeOf( myList ) != 'array' ) {
        myList = defList; }
    else if ( myList.length  == 0 ) {
        myList  = defList; }

    return myList;
};

_SM.verifyObj = function (myObj, defObj) {

    // verifica el default
    if (( ! defObj ) || ( _SM.typeOf( defObj ) != 'object' )) { defObj = {}; }

    // Verifica q sea un objeto
    if ( _SM.typeOf( myObj ) != 'object' )   {
        myObj = defObj; }

    else  {
        // Aplica el objeto real sobre el vr por defecto
        myObj  = Ext.apply( defObj, myObj ); }

    return myObj;
};

_SM.obj2tx = function( myObj ) {
    // recibe un obj y garantiza q retorne un texto ( con un array )
    var sAux = typeof myObj;
    if ( sAux == 'string' ) { sAux = myObj; }
    else{ try { sAux  = Ext.encode( myObj );
        } catch(e) {sAux = '[]'; }
    }
    return sAux;
};


_SM.ptPrompt = function (title, msg) {

    return prompt( msg )
    // Ext.Msg.prompt(title, msg, function(btn, pName){
        // if (btn != 'ok') return ''
        // return pName
    // })
};

//Eventos :

_SM.openScript = function (url) {
    //permite cargar script de un archivo
    //'../../static/aplications/GIS/factura_dblclick.js'
    var scrpt = document.createElement('script');
    scrpt.src = url;
    document.head.appendChild(scrpt);
};

_SM.fireEvent = function (type, myMeta, eventData, scope, fn) {
    me = scope;
    var code = myMeta.businessRules[type] || null;
    // console.log(code + "-->" + type);
    eventData.type = type;
    _SM.eventData = eventData;
    _SM.eventData.cancel = false;
    if (code != null) {

        if (type == "DblClick" || type == "default") {

            _SM.eventData.HDataField = scope._extGrid.columns[_SM.eventData.cellIndex].dataIndex;
        }
        eval(code);
        if (!_SM.eventData.cancel) {
            fn();
        }
    } else {
        fn();
    }

};

_SM.GetRowValue = function (cellName) {
    try {
        var data = _SM.eventData.record.get(cellName);
        return data;
    } catch (e) {
        return null;
    }

};


_SM.CloseProtoTab = function( name  ) {

    // Cierra las instancias de una pcl
    _SM.__TabContainer.closeProtoTab( name );

};

_SM.Product  = function (list) {
    var first = list[0];
    var rest = list.slice(1);

    if (first) {
        var output = [];

        if (rest.length > 0) {
            var prod_rest = _SM.Product(rest);

            for (var i = 0; i < prod_rest.length; i++) {
                for (var j = 0; j < first.length; j++) {
                    output.push([first[j]].concat(prod_rest[i]));
                }
            }
        } else {
            for (var j = 0; j < first.length; j++) {
                output.push([first[j]]);
            }
        }

        return output;
    } else {
        return [];
    }
};


// DIAGRAM DESIGNER
var dbModel = {
    shape: {},
	locator: {}
};
var jsonDocument = [];


function loadJsFilesSequentially(scriptsCollection, startIndex, librariesLoadedCallback) {
    if (scriptsCollection[startIndex]) {
    	if (filesadded.indexOf("[" + scriptsCollection[startIndex] + "]") === -1){
	        var fileref = document.createElement('script');
	        fileref.setAttribute("type", "text/javascript");
	        fileref.setAttribute("src", scriptsCollection[startIndex]);
	        fileref.onload = function() {
	            startIndex = startIndex + 1;
	            loadJsFilesSequentially(scriptsCollection, startIndex, librariesLoadedCallback);
	        };
	
	        document.getElementsByTagName("head")[0].appendChild(fileref);
	        filesadded += "[" + scriptsCollection[startIndex] + "]";
    	} else {
    		startIndex = startIndex + 1;
	        loadJsFilesSequentially(scriptsCollection, startIndex, librariesLoadedCallback);
    	}
    } else {
        librariesLoadedCallback();
    }
}

// An array of scripts you want to load in order
var scriptLibrary = [];
//list of files already added
var filesadded = "";

function displayJSON(canvas) {
    var writer = new draw2d.io.json.Writer();
    writer.marshal(canvas, function(json) {
        $("#json").text(JSON.stringify(json, null, 2));
    });
}

function createJSFilesLibrary() {
    scriptLibrary.push("static/js2db/lib/jquery-1.10.2.min.js");
    scriptLibrary.push("static/js2db/lib/jquery.autoresize.js");
    scriptLibrary.push("static/js2db/lib/jquery-touch_punch.js");
    scriptLibrary.push("static/js2db/lib/jquery.contextmenu.js");

    scriptLibrary.push("static/js2db/lib/shifty.js");

    scriptLibrary.push("static/js2db/lib/raphael.js");
    scriptLibrary.push("static/js2db/lib/rgbcolor.js");
    scriptLibrary.push("static/js2db/lib/canvg.js");

    scriptLibrary.push("static/js2db/lib/Class.js");

    scriptLibrary.push("static/js2db/lib/json2.js");

    scriptLibrary.push("static/js2db/lib/pathfinding-browser.min.js");
	
	scriptLibrary.push("static/js2db/draw2d/src/draw2d-all.js");
	
    scriptLibrary.push("static/js2db/lib/jquery.browser.js");
    scriptLibrary.push("static/js2db/lib/jquery-ui-1.8.23.custom.min.js");
    scriptLibrary.push("static/js2db/lib/jquery.layout.js");

    scriptLibrary.push("static/js2db/dbModel/View.js");
    scriptLibrary.push("static/js2db/dbModel/locator/PortRightLocator.js");
    scriptLibrary.push("static/js2db/dbModel/locator/PortLeftLocator.js");
    scriptLibrary.push("static/js2db/dbModel/shape/DBTable.js");
    scriptLibrary.push("static/js2db/dbModel/shape/ManhattanRightConnectionLocator.js");
    scriptLibrary.push("static/js2db/dbModel/shape/ManhattanLeftConnectionLocator.js");
    scriptLibrary.push("static/js2db/dbModel/shape/TableConnection.js");
    scriptLibrary.push("static/js2db/dbModel/shape/CustomLabel.js");

}

/*
 * Clase generica para el manejo del Store

 Ext.define('ProtoUL.core.ProtoStore', {
 extend: 'Ext.data.Store',

 * El manejo de la clase tiene un problema interno:
 * en grid.store.data  mantiene la definicion del primer store cargado,
 * mientras q en grid.store.raw tiene los datos correctos,
 *
 * solucion: una funcion q retorne el store definido
 *
 */

/*
 "use strict";
 */
/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */
/*global ProtoUL */
/*global verifyMeta */

_SM.getStoreDefinition = function(stDef) {

    var myStore = Ext.create('Ext.data.Store', {
        viewCode : stDef.viewCode,

        model : _SM.getModelName(stDef.viewCode),
        autoLoad : stDef.autoLoad,
        pageSize : stDef.pageSize,

        remoteSort : !(stDef.localSort || false),
        sorters : stDef.sorters,
        defaultSortDirection : 'ASC',
        groupField : stDef.groupCol || '',

        sortOnLoad : true,
        autoSync : true,

        proxy : _SM.getProxyDefinition(stDef),
        storeDefinition : stDef,

        // Redefinicion de metodos
        // sort: function ( sorters ) {
        // Redefine el metodo, siempre pasa por aqui
        // },

        myLoadData : function(myFilter, mySorter, myMasterId) {
            // Centraliza  los llamados para refrescar la grilla

            // Para la navegacion md
            if (myMasterId) {
                this.protoMasterId = myMasterId;
            }

            if (myFilter) {
                this.clearFilter();
                this.getProxy().extraParams.protoFilter = _SM.obj2tx(myFilter);
                this.load();

            } else if (mySorter) {
                this.sort(mySorter);
            }

        },

        mySetBaseFilter : function(myFilter) {
            // Desde el zoom, para agregar el zoomFilter que debe ser parte de la base
            // pues no debe modeficarse con el filtro de usuario
            // recibe el filtro y lo mezcla con el baseFilter ( por ejemplo un estado )

            this.clearFilter();
            this.getProxy().extraParams.protoFilter = _SM.obj2tx([]);
            this.getProxy().extraParams.baseFilter = _SM.obj2tx(myFilter.concat(this.storeDefinition.baseFilter));
            this.load();

        },

        listeners : {

            // Fires before a request is made for a new data object. ...
            beforeload : function(store, operation, eOpts) {
                _SM.__StBar.showBusy(_SM.__language.StatusBar_Message_Loading + store.viewCode, 'beforeLoad');
            },

            // Fired before a call to sync is executed. Return false from any listener to cancel the sync
            beforesync : function(options, eOpts) {
                _SM.__StBar.showBusy(_SM.__language.StatusBar_Message_Sync + this.viewCode, 'beforeSync');
            },

            // Fires whenever the records in the Store have changed in some way - this could include adding or removing records, or ...
            datachanged : function(store, eOpts) {
                _SM.__StBar.clear(store.viewCode, 'dataChanged');

                // Guarda la info de sort
                try {
                    var mySort = _SM.clone(store.getSorters(), 0, [], ['property', 'direction']);
                    store.proxy.extraParams.sort = Ext.encode(mySort);
                } catch (e) {
                }

            },

            // Fired when a Model instance has been added to this Store ...
            // add: function ( store, records,  index,  eOpts ) {

            //  Fires before a prefetch occurs. Return false to cancel.
            // beforeprefetch: function ( store, operation, eOpts ) {

            // Fires whenever records have been prefetched
            // prefetch: function ( store, records, successful, operation,  eOpts ) {

            // Fired after the removeAll method is called. ...
            // clear: function ( store,  eOpts ) {

            // Fires whenever the store reads data from a remote data source. ...
            // load: function ( store, records,  successful,  eOpts ) {

            // Fired when a Model instance has been removed from this Store ...
            // remove: function (  store,  record,  index,  eOpts ) {

            // Fires when a Model instance has been updated ...\
            // update: function ( store,  record,  sOperation,  eOpts ) {

            // Fires whenever a successful write has been made via the configured Proxy
            write : function(store, operation, eOpts) {

                var ix;
                for (ix in operation.records) {
                    var recResult = operation.resultSet.records[ix], recOrigin = operation.records[ix];

                    // Si existe un resultSet
                    if (recResult) {

                        if (operation.action == 'create') {
                            //Cuando son varios inserts, Extjs no es capaz hacer la actualizacion de los registros en la grilla.

                            // Copia la data resultado sobre la data de base
                            // Tengo un campo para mandar el Id, para efectos de control, podria ser elimiando en la prox version
                            recOrigin.data = recResult.data;

                        }// End create
                        else if (operation.action == 'destroy') {
                            //Dgt:  Restaura los registros q no pudieron ser borrados, ie Integridad referencial
                            if (recResult.data._ptStatus !== '') {
                                store.insert(0, recResult);
                            }

                        }
                        // En Delete

                    }

                    // Marca los registros segun el estado
                    var stRec = recOrigin.get('_ptStatus');
                    if (stRec) {
                        recOrigin.dirty = true;
                        if (!recOrigin.getId()) {
                            recOrigin.phantom = true;
                        }
                    }
                }
            }
        }
    });

    return myStore;

};

_SM.getProxyDefinition = function(stDef) {

    return {
        type : 'ajax',
        batchActions : true,
        batchOrder : "create,update,destroy",
        api : {
            read : 'protoLib/protoList/',
            create : 'protoLib/protoAdd/',
            update : 'protoLib/protoUpd/',
            destroy : 'protoLib/protoDel/'
        },
        actionMethods : {
            create : 'POST',
            read : 'POST',
            update : 'POST',
            destroy : 'POST'
        },
        reader : {
            type : 'json',
            root : 'rows',
            successProperty : 'success',
            totalProperty : 'totalCount',
            messageProperty : 'message'
        },

        writer : {
            type : 'json',
            root : 'rows',
            allowSingle : false,
            writeAllFields : true,
            // Incluye los parametros en el post ( por defecto en el get )
            encode : true,
            messageProperty : 'message'
        },

        // Parametros String para la conexion al backEnd
        extraParams : {
            viewCode : stDef.viewCode,
            protoFilter : _SM.obj2tx(stDef.protoFilter),
            baseFilter : _SM.obj2tx(stDef.baseFilter),
            protoMeta : _SM.obj2tx(stDef.sProtoMeta)
        },

        listeners : {

            // 'load' :  function(store,records,options) { this.loaded = true }
            'exception' : function(proxy, response, operation) {
                // var msg = operation.request.scope.reader.jsonData["message"] ;
                var msg, myErr = operation.getError();
                if ( typeof (myErr ) == 'string') {
                    msg = myErr;
                } else {
                    msg = 'REMOTE EXCEPTION: (' + myErr.status + ') ' + myErr.statusText;
                }
                _SM.__StBar.showError(msg, 'storeException');
            }
        }

        // afterRequest: function( request, success ){
        // var title = 'afterRequest :' + request.method + '.' + request.action, msg = ''
        // try {
        // if ( request.operation.response.status != 200 ) {
        // if ( 'jsonData' in request.scope.reader ) {
        // var jsData = request.scope.reader.jsonData;
        // msg = request.scope.reader.getMessage()
        // }
        // }
        // } catch(e) {
        // msg = e.message
        // }
        // }

    };

};

_SM.getTreeStoreDefinition = function(stDef) {

    var myStore = Ext.create('Ext.data.TreeStore', {
        viewCode : stDef.viewCode,
        model : _SM.getModelName(stDef.viewCode),
        autoLoad : stDef.autoLoad,
        pageSize : stDef.pageSize,
        sorters : stDef.sorters,
        proxy : _SM.getProxyDefinition(stDef),

        remoteSort : true,
        autoSync : true,

        root : {
            // text:'details',
            expanded : true
        }

        // listeners: {
        // // Fires before a request is made for a new data object. ...
        // beforeload: function(  store,  operation,  eOpts ) {
        // _SM.__StBar.showBusy( 'loading ..' + store.viewCode, 'beforeLoad' );
        // },
        // // Fired before a call to sync is executed. Return false from any listener to cancel the sync
        // beforesync: function ( options, eOpts ) {
        // _SM.__StBar.showBusy( 'sync ..' + this.viewCode, 'beforeSync'  );
        // },
        // // Fires whenever the records in the Store have changed in some way - this could include adding or removing records, or ...
        // datachanged: function( store,  eOpts ) {
        // _SM.__StBar.clear( store.viewCode , 'dataChanged' );
        // }
        // }

    });

    return myStore;

};

_SM.getNewRecord = function(myMeta, myStore) {

    function setDefaults() {

        var vDefault = {}, ix, vFld;

        for (ix in myMeta.fields ) {
            vFld = myMeta.fields[ix];
            if (!vFld.prpDefault) {
                continue;
            }
            vDefault[vFld.name] = vFld.prpDefault;
        }
        return vDefault;
    }

    var myRecord = new myStore.model(setDefaults());

    // Lo asocia al store
    myRecord.store = myStore;
    return myRecord;

};

_SM.getRecordByDataIx = function(myStore, fieldName, value) {
    var ix = myStore.findExact(fieldName, value);
    if (ix === -1) {
        return;
    }
    return myStore.getAt(ix);
};

_SM.IsAdmField = function(vFld, myMeta) {

    // Oculta las llaves de zooms
    if (/_id$/.test(vFld.name)) {
        return true;
    }

    // Oculta el jsonField
    if (myMeta.jsonField == vFld.name) {
        return true;
    }

    // prototipos
    if (myMeta.protoEntityId) {

        // 'smOwningUser','smOwningTeam', 'smModifiedOn',
        if (vFld.name in _SM.objConv(['smCreatedBy', 'smModifiedBy', 'smCreatedOn', 'smWflowStatus', 'smRegStatus'])) {
            return true;
        }

        if (vFld.name == 'id') {
            return true;
        }
        if (vFld.name == 'entity') {
            return true;
        }

    }

    return false;
};

_SM.DefineProtoModel = function(myMeta) {

    // dateFormat: 'Y-m-d'
    // type: 'date', 'float', 'int', 'number'

    // useNull : vFld.allowNull,  ( solo para numeros, si no puede hacer la conversion )
    // prpDefault: vFld.prpDefault,
    // persist: vFld.editPolicy,        ( falso = NoUpdate )

    // type: 'hasMany',
    // autoLoad: true
    // convert :  Campo Virtual calculado,  Apunta a una funcion q  genera el valor

    // Verifica la conf del objeto de base
    myMeta = verifyMeta(myMeta, 'pcl');

    var myModelFields = [];
    // model Fields

    // Separacion de campos para facilidad del administrador
    var fieldsBase = [], fieldsAdm = [], mField = {};

    for (var ix in myMeta.fields ) {
        var vFld = myMeta.fields[ix];

        if (_SM.IsAdmField(vFld, myMeta)) {
            fieldsAdm.push(vFld);
        } else {
            fieldsBase.push(vFld);
        }

        if (!vFld.type) {
            vFld.type = 'string';
        }

        // modelField
        mField = {
            name : vFld.name,
            type : vFld.type
            //TODO:  useNull : true / false    ( NullAllowed, IsNull,  NotNull )
        };

        // Tipos validos
        if (!vFld.type in _SM.objConv(['string', 'text', 'html', 'bool', 'int', 'decimal', 'combo', 'date', 'datetime', 'time', 'protoN2N', 'autofield', 'foreignid', 'foreigntext'])) {

            vFld.type = 'string';
            mField.type = 'string';
            mField.readOnly = true;
        }

        //
        if (vFld.name in _SM.objConv(myMeta.gridConfig.hiddenFields)) {
            mField.hidden = true;
            vFld.hidden = true;
        }

        if (vFld.name in _SM.objConv(myMeta.gridConfig.readOnlyFields)) {
            mField.readOnly = true;
            vFld.readOnly = true;
        }

        if (vFld.name in _SM.objConv(myMeta.gridConfig.sortFields)) {
            vFld.sortable = true;
        }

        // Determina el xType y otros parametros
        switch( vFld.type ) {
            case 'decimal':
                mField.type = 'number';
                break;

            case 'jsonfield':
                mField.readOnly = true;
                mField.type = 'json';
                break;

            case 'date':
                mField.type = 'date';
                mField.dateFormat = 'Y-m-d';
                break;

            case 'datetime':
                mField.type = 'string';
                // DGT: ISO Format  ( utilsBase.py  JsonEncoder datetime)
                // mField.type = 'date';
                // mField.dateFormat = 'Y-m-d\\TH:i:sP';
                break;
            case 'time':
                mField.type = 'string';
                // DGT 
                // mField.type = 'date';
                // mField.dateFormat = 'H:i:s';
                break;

        }

        // Asigna el modelo y el diccionario
        myModelFields.push(mField);

    }

    // Agrega el status y el interna ID
    mField = {
        name : '_ptStatus',
        type : 'string'
    };
    myModelFields.push(mField);

    mField = {
        name : '_ptId',
        type : 'string'
    };
    myModelFields.push(mField);

    // myModelFields = [{"name":"id","type":"int","useNull":true},{"name":"first","type":"string"}]
    Ext.define(_SM.getModelName(myMeta.viewCode), {
        extend : 'Ext.data.Model',
        fields : myModelFields

        //TODO: Validation, Validaciones
        //    validations: [{ type: 'length', field: 'name', min: 1 }]

    });

    // Adiciona las dos colecciones
    myMeta.fieldsBase = fieldsBase;
    myMeta.fieldsAdm = fieldsAdm;

};

_SM.getFieldDict = function(myMeta) {
    // For indexing fields
    var ptDict = {};
    for (var ix in myMeta.fields ) {
        var vFld = myMeta.fields[ix];

        // Lo marca con la grilla de donde viene
        vFld.idProtoGrid = myMeta.idProtoGrid;

        ptDict[vFld.name] = vFld;
    }
    return ptDict;
};

_SM.getColDefinition = function(vFld) {

    if (!vFld.header) {
        vFld.header = vFld.name;
    }

    var colDefinition, lstProps, editor;

    colDefinition = {
        dataIndex : vFld.name,
        text : vFld.header
    };

    // Propiedades q seran copiadas a las columnas de la grilla
    lstProps = ['flex', 'width', 'minWidth', 'sortable', 'hidden', 'xtype', 'readOnly', 'render', 'align', 'format', 'tooltip', 'idProtoGrid'];

    colDefinition = _SM.copyProps(colDefinition, vFld, true, lstProps);

    // Copia las propiedades de base al editor
    lstProps = ['prpDefault',

    // string
    'required', 'readOnly', 'minLength', 'minLengthText', 'maxLength', 'maxLengthText',

    // int, decimal
    'step',

    // int, decimal, date, datime, time
    'minValue', 'minText', 'maxValue', 'maxText',

    // date, datime
    'disabledDays', 'disabledDaysText', // [0, 6]

    /*@zoomModel : Contiene el modelo del FK, se carga automaticamente,
     * puede ser modificado para cargar una vista particular,
     * una buena practica es dejar los modelos de base para los zooms y generar vistas
     * para las opciones de trabajo
     */
    'zoomModel', 'zoomMultiple',

    //@fkId : Llave correspondiente al zoom
    'fkId',

    //@zoomFilter : Filtro de base fijo para el zoom ( puede venir definido en zoomView )
    'zoomFilter',

    //@fromField :  Campos q sera heredados a la entidad base
    'cpFromField', 'cpFromZoom', 'idProtoGrid'];
    editor = _SM.copyProps({}, vFld, true, lstProps);

    // Requerido
    if (vFld.required === true) {
        colDefinition.allowBlank = false;
        editor.allowBlank = false;

        colDefinition.allowOnlyWhitespace = false;
        editor.allowOnlyWhitespace = false;

    }

    //TODO: vType ( eMail, IpAdress, etc ... )
    // editor.vtype = 'email'

    // Determina el xType y otros parametros
    if (!vFld.type) {
        vFld.type = 'string';
    }
    if (vFld.choices && vFld.choices.split(",").length > 1) {
        vFld.type = 'combo';
    }

    switch( vFld.type ) {
        case 'string':
            if (!colDefinition.flex) {
                colDefinition.flex = 1;
            }
            break;

        case 'text':
            if (!colDefinition.flex) {
                colDefinition.flex = 2;
            }
            colDefinition.renderer = columnWrap;
            break;

        case 'int':
        case 'secuence':
            colDefinition['xtype'] = 'numbercolumn';
            colDefinition['align'] = 'right';
            colDefinition['format'] = '0,000';

            editor.xtype = 'numberfield';
            editor.format = colDefinition['format'];
            editor.align = 'right';
            editor.allowDecimals = false;
            break;

        case 'decimal':
        case 'money':
            colDefinition['xtype'] = 'numbercolumn';
            colDefinition['align'] = 'right';
            colDefinition['format'] = '0,000.00';
            // vFld['renderer'] = 'usMoney'

            editor.xtype = 'numberfield';
            editor.format = colDefinition['format'];
            editor.align = 'right';
            editor.allowDecimals = true;
            editor.decimalPrecision = 2;
            break;

        case 'date':
            colDefinition['xtype'] = 'datecolumn';
            colDefinition['format'] = 'Y/m/d';

            editor.xtype = 'datefield';
            editor.format = colDefinition['format'];
            break;

        case 'datetime':
            // colDefinition['xtype'] = 'datecolumn'
            // colDefinition['format'] = 'Y/m/d H:i:s'
            // editor.xtype = 'datefield'
            // editor.format = 'Y/m/d'
            // editor.timeFormat = 'H:i'
            break;

        case 'time':
            //TODO:  En la edicion de grilla, al regresar cambia el formato
            colDefinition['xtype'] = 'datecolumn';
            colDefinition['format'] = 'H:i';
            //  'H:i:s'

            editor.xtype = 'timefield';
            editor.format = colDefinition['format'];
            break;

        case 'bool':
            colDefinition['xtype'] = 'mycheckcolumn';
            colDefinition['editable'] = false;
            colDefinition['inGrid'] = true;

            editor.xtype = 'checkbox';
            // editor.cls = 'x-grid-checkheader-editor'
            break;

        case 'combo':
            editor.xtype = 'combobox';
            editor.typeAhead = true;
            editor.triggerAction = 'all';
            editor.selectOnTab = true;

            // Lo normal es q venga como una lista de opciones ( string )
            var cbChoices = vFld.choices;
            if (_SM.typeOf(cbChoices) == 'string') {
                cbChoices = cbChoices.split(",");
            } else {
                cbChoices = [];
            }

            editor.store = cbChoices;
            editor.lazyRender = true;
            editor.listClass = 'x-combo-list-small';
            break;

        case 'foreigntext':
            // El zoom se divide en 2 cols el texto ( _unicode ) y el ID ( foreignid )
            if (!colDefinition.flex) {
                colDefinition.flex = 1;
            }

            vFld.cellLink = true;
            editor.xtype = 'protoZoom';
            editor.editable = false;
            break;

        case 'foreignid':
            // El zoom id debe estar oculto
            // colDefinition['hidden']= true
            editor.xtype = 'numberfield';
            editor.hidden = true;
            break;

        case 'autofield':
            break;

    }

    // Ancho minimo
    if (!colDefinition.minWidth) {
        colDefinition.minWidth = 70;
    }

    // verificacion de xtype
    switch( colDefinition.xtype  ) {
        case 'mycheckcolumn':
        case 'datecolumn':
        case 'numbercolumn' :
            break;
        case 'checkbox':
            colDefinition.xtype = 'mycheckcolumn';
            break;
        case 'datefield':
            colDefinition.xtype = 'datecolumn';
            break;
        case 'numberfield':
            colDefinition.xtype = 'numbercolumn';
            break;
        default:
            delete colDefinition.xtype;
    };

    // Asigna las coleccoiones de presentacion
    // El foreignid puede ser editable directamente,
    if (((vFld.type == 'autofield' ) || vFld.readOnly  ) && (vFld.type != 'bool'  )) {
        colDefinition.renderer = cellReadOnly;
    } else {
        colDefinition['editor'] = editor;
    }

    // WordWrap
    if (vFld.wordWrap === true) {
        colDefinition.renderer = columnWrap;
    }

    // Agrega un tool tip con el contenido de la celda
    if (vFld.cellToolTip) {
        colDefinition.renderer = cellToolTip;
    }

    // Formatea el contenido como un hiperLink, TODO: la logica debe estar en otra propiedad
    if (vFld.cellLink) {
        colDefinition.renderer = cellLink;
    }

    // Maneja los subtipos
    if (vFld.vType) {
        // vType stopLigth  Maneja el codigo de colores para un semaforo con 3 indicadores, 2 limites Red-Yellow; Yellow-Green
        if (vFld.vType == 'stopLight') {
            colDefinition.renderer = cellStopLight;
        }
    }

    // sortable por defecto
    if (!colDefinition.sortable) {
        colDefinition['sortable'] = false;
    }

    return colDefinition;

    //
    function columnWrap(value) {
        return '<div style="white-space:normal; text-align:justify !important";>' + value + "</div>";
    }

    function cellToolTip(value, metaData, record, rowIndex, colIndex, store, view) {
        metaData.tdAttr = 'data-qtip="' + value + '"';
        return value;
    }

    function cellReadOnly(value, metaData, record, rowIndex, colIndex, store, view) {
        return '<span style="color:grey;">' + value + '</span>';
    };

    function cellLink(value) {
        return '<a href="#">' + value + '</a>';
    };

    function cellStopLight(value, metaData, record, rowIndex, colIndex, store, view) {
        /*
         TODO: Leer las propiedades stopLightRY y  stopLightYG  para comparar,

         vType stopLigth  Maneja el codigo de colores para un semaforo con 3 indicadores,
         stopLightRY : valor limite  de Rojo a Amarillo
         stopLightYG : valor limite  de Amarillo a Verde
         si el valor RY > YG se asume una secuencia inversa.
         los valores son comparados estrictamente mayor  X > RY -->  Y

         */

        var cssPrefix = Ext.baseCSSPrefix, cls = [];

        if (value > 66) {
            cls.push(cssPrefix + 'grid-stopligth-green');
        } else if (value > 33) {
            cls.push(cssPrefix + 'grid-stopligth-yellow');
        } else if (value > 0) {
            cls.push(cssPrefix + 'grid-stopligth-red');
        }

        //TODO: Probar <span>  en vez de <div>
        // return '<span style="color:green;">' + val + '</span>';

        return '<div class="' + cls.join(' ') + '">&#160;' + value + '</div>';
    }

};

_SM.getFormFieldDefinition = function(vFld) {

    var colDefinition = _SM.getColDefinition(vFld), formEditor = {
        readOnly : true
    };

    // Se inicializa ro, en caso de q no se encuentre en el dict

    if (colDefinition.editor) {
        formEditor = colDefinition.editor;
    }

    // Field Label
    formEditor.name = vFld.name;
    formEditor.fieldLabel = vFld.fieldLabel || vFld.header || vFld.name;
    formEditor.fieldLabel = formEditor.fieldLabel.replace('<strong>', '').replace('</strong>', '');
    formEditor.fieldLabel = formEditor.fieldLabel.replace('<b>', '').replace('</b>', '');
    if (vFld.required) {
        formEditor.fieldLabel = '<strong>' + formEditor.fieldLabel + '</strong>';
    }
    if (vFld.primary) {
        formEditor.afterLabelTextTpl = _SM._requiredField;
    }
    formEditor.fieldLabel = Ext.util.Format.capitalize(formEditor.fieldLabel);

    // Add listener to avoid whitespaces
    // This works fine with ExtJS 4.2.2
    // Fix : error when  butoonDetail.addForm 
    if (vFld.required && !vFld.fkId) {
        formEditor.listeners = {
            // blur : function() {
                // this.setValue(Ext.String.trim(this.getValue()));
            // },
            render : function(field) {
            }
        };
    }
    
    // Casos especiales
    switch( vFld.type ) {
        case 'text':
            formEditor.xtype = 'textarea';
            formEditor.height = 100;
            formEditor.labelAlign = 'top';
            // grow, growMax, growMin
            break;

        case 'html':
            formEditor.xtype = 'textarea';
            formEditor.height = 100;
            formEditor.labelAlign = 'top';
            break;
		
		case 'filefield':
			formEditor.xtype = 'filefield';
            formEditor.buttonText = 'Select file...';
			break;
        // case 'protoN2N':
        // formEditor.xtype = 'protoList'
        // formEditor.checkStyle = false
        // formEditor.columnList = [
        // { dataIndex : 'id' , hidden : false },
        // { dataIndex : 'data', text : formEditor.fieldLabel , flex : 1 }
        // ]
        // formEditor.height = 100
        // // formEditor.labelAlign = 'top'
        // break;
    }

    // Inicializa los tipos
    formEditor.__ptType = 'formField';
    if (!formEditor.xtype) {
        formEditor.xtype = 'textfield';
    }
    return formEditor;

};

// *********************************************************

_SM.loadPci = function(viewCode, loadIfNot, options) {
    // TODO: refactor,  ne pas besoin de retourner true/false; retourner toujour option.xx.call( )

    options = options || {};

    // Verificar si la opcion esta creada
    var myMeta = _SM._cllPCI[viewCode];

    // Verifica modelo
    if (myMeta && Ext.ClassManager.isCreated(_SM.getModelName(viewCode))) {

        // Asigna la llave, pues si se hace una copia seguiria trayendo la misma viewCode de base
        myMeta.viewCode = viewCode;
        return true;

    } else {

        // Solo retorna algo cuando se usa para evaluar
        if (!loadIfNot) {
            return false;
        }

        Ext.applyIf(options, {
            scope : this,
            success : Ext.emptyFn,
            failure : Ext.emptyFn
        });

        Ext.Ajax.request({
            method : 'POST',
            url : _SM._PConfig.urlGetPCI,
            params : {
                viewCode : viewCode
            },
            scope : this,
            success : function(result, request) {

                var myResult = Ext.decode(result.responseText);
                if (myResult.success) {
                    _SM.savePclCache(viewCode, myResult.protoMeta);
                    _SM._UserInfo.perms[viewCode] = myResult.permissions;
                    options.success.call(options.scope, result, request);
                } else {
                    _SM.errorMessage('loadPC', myResult.message);
                    options.failure.call(options.scope, result, request);
                }
            },
            failure : function(result, request) {
                _SM.errorMessage('loadPC', '');
                options.failure.call(options.scope, result, request);
            }
        });

        return false;

    }

};

_SM.savePci = function(protoMeta, options) {

    if (!protoMeta) {
        return;
    }

    var viewCode = protoMeta.viewCode;
    protoMeta.updateTime = _SM.getCurrentTime();

    if (protoMeta.fieldsBase) {
        // Excluye las colecciones auxiliares de campos
        protoMeta = _SM.clone(protoMeta);
        delete protoMeta.fieldsBase;
        delete protoMeta.fieldsAdm;
        delete protoMeta.custom;
    }

    var sMeta = Ext.encode(protoMeta);
    _SM.saveProtoObj(viewCode, sMeta, options);

};

_SM.saveProtoObj = function(viewCode, sMeta, options) {

    options = options || {};
    Ext.applyIf(options, {
        scope : this,
        success : Ext.emptyFn,
        failure : Ext.emptyFn
    });

    Ext.Ajax.request({
        method : 'POST',
        url : _SM._PConfig.urlSaveProtoObj,
        params : {
            viewCode : viewCode,
            protoMeta : sMeta
        },

        success : function(result, request) {
            var myResult = Ext.decode(result.responseText);
            if (myResult.success) {
                options.success.call(options.scope, result, request);
            } else {
                options.failure.call(options.scope, result, request);
                _SM.errorMessage(_SM.__language.Message_Error_SaveProtoObj, myResult.message);
            }
        },
        failure : function(result, request) {
            _SM.errorMessage(_SM.__language.Message_Error_SaveProtoObj, result.status + ' ' + result.statusText);
            options.failure.call(options.scope, result, request);
        },
        scope : this,
        timeout : 30000
    });

};

_SM.loadJsonConfig = function(fileName, options) {

    options = options || {};
    Ext.applyIf(options, {
        scope : this,
        success : Ext.emptyFn,
        failure : Ext.emptyFn
    });

    Ext.Ajax.request({
        method : 'POST',
        url : '/resources/' + fileName,
        scope : options.scope,
        success : function(result, request) {
            options.success.call(options.scope, result, request);
        },
        failure : function(result, request) {
            _SM.errorMessage('LoadJsonConfig', result.status + ' ' + result.statusText);
            options.failure.call(options.scope, result, request);
        }
    });

};

_SM.defineProtoPclTreeModel = function() {

    // Definicion del modelo para los arboles de la PCL

    Ext.define('Proto.PclTreeNode', {
        extend : 'Ext.data.Model',
        fields : [{
            name : '__ptType',
            type : 'string'
        }, {
            name : 'text',
            type : 'string'
        }, {
            name : 'id',
            type : 'string'
        },
        // {name: 'iconCls', type: 'string', prpDefault: null, persist: false },
        // {name: 'ptValue', type: 'string'},

        // Referencia al modelo de base
        {
            name : '__ptConfig'
        }]
    });

};

_SM.getSheeReport = function(viewCode, sheetName, selectedKeys, options) {

    options = options || {};
    Ext.applyIf(options, {
        scope : this,
        success : Ext.emptyFn,
        failure : Ext.emptyFn
    });

    Ext.Ajax.request({
        method : 'POST',
        url : _SM._PConfig.urlGetSheetReport,
        params : {
            viewCode : viewCode,
            sheetName : sheetName,
            selectedKeys : Ext.encode(selectedKeys)
        },

        success : function(result, request) {
            options.success.call(options.scope, result, request);
        },
        failure : function(result, request) {
            _SM.errorMessage(_SM.__language.Message_Error_Reporting, result.status + ' ' + result.statusText);
            options.failure.call(options.scope, result, request);
        },
        scope : this,
        timeout : 60000
    });
};

_SM.doProtoActions = function(viewCode, actionName, selectedKeys, detKeys, parameters, actionDef, options) {

    parameters = parameters || [];
    options = options || {};

    Ext.applyIf(options, {
        scope : this,
        success : Ext.emptyFn,
        failure : Ext.emptyFn
    });

    Ext.Ajax.request({
        method : 'POST',
        url : _SM._PConfig.urlDoAction,
        params : {
            viewCode : viewCode,
            actionName : actionName,
            parameters : Ext.encode(parameters),
            actionDef : Ext.encode(actionDef),
            selectedKeys : Ext.encode(selectedKeys), 
            detKeys : Ext.encode(detKeys)
        },

        success : function(result, request) {
            options.success.call(options.scope, result, request);
        },
        failure : function(result, request) {
            _SM.errorMessage('ActionReport Failed', result.status + ' ' + result.statusText);
            options.failure.call(options.scope, result, request);
        },
        scope : this,
        timeout : 60000
    });

};

_SM.sortObjByName = function(a, b) {
    var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
    //sort string ascending
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
    //default return value (no sorting)
};

_SM.getDetailDefinition = function(myMeta, viewCode) {
    var ixD, lDet;

    for (ixD in myMeta.detailsConfig ) {
        lDet = myMeta.detailsConfig[ixD];
        if (lDet.conceptDetail === viewCode) {
            return lDet;
        }
    }

    return {}; 

};
/**
 * @author Giovanni Victorette
 */
// basic i18n for login screen, only used where it's impossible to get string values from Django server
_SM.__language = {
    'Text_Validate_Login_Button' : 'se connecter',
    'Text_change_Password_Button' : 'changer le mot de passe',
    'Text_Forgotten_Password' : 'mot de passe perdu',
    'Textfield_User_Login' : 'utilisateur',
    'Textfield_User_Email' : 'courriel',
    'Textfield_Password_Login' : 'mot de passe',
    'Textfield_New_Password' : 'nouveau mot de passe',
    'Textfield_Confirm_Password' : 'confirmer le mot de passe',
    'Title_Window_Email_Request' : 'Récupérer le mot de passe perdu',
    'Title_Window_Password_Change':'Changez votre mot de passe',
    
    'Text_Send_Button' : 'Envoyer',
    
    'Message_Enter_Email' : 'Entrez votre courriel',
    'Message_Success' : 'Succès',
    'Message_Email_Forgotten_Password' : 'Un courriel a été envoyé avec les instructions',
    'Message_Email_New_Password' : 'Un courriel a été envoyé avec votre nouveau mot de passe',
    'Message_Success_Password_Change':'Le mot de passe a été changé avec succès',
    'Message_Error' : 'Error',
    'Message_Error_Login' : 'Impossible de se connecter',
    
    'StatusBar_Message_Loading' : 'Loading'
};
/**
 * @class ProtoUL.ux.MDLinkController
 * @author  Dario Gomez

 * Helper class for control link behavior

 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */
/*global ProtoUL */
/*global getSimpleProperties */

Ext.define('ProtoUL.UI.MDLinkController', {
    extend: 'Ext.Base',

    masterRowData: null,
    masterId: -1,

    constructor: function(config) {
        Ext.apply(this, config || {});
    },

    setMasterData: function(masterRowData) {

        var me = this;
        me.masterRowData = masterRowData;

        if (!masterRowData) {
            me.masterId = -1;
        } else {
            me.masterId = masterRowData['id'];
        }

    },

    getDetailLink: function(detDefinition) {
        // after setMasterData

        var me = this, 
            detFilter, detTitle = '', masterTitleField = '', masterKey ;

        detDefinition.masterField = detDefinition.masterField || 'pk'; 
        if ( detDefinition.masterField === 'pk') {
            if ( ! me.masterId ) {
                me.masterId = -1;
            }
            masterKey = me.masterId; 
        } else {
            masterKey = me.masterRowData[ detDefinition.masterField ];
        }
        
        // Filter
        detFilter = [{
            "property": detDefinition.detailField,
            "filterStmt": masterKey
        }];

        // Title
        if (me.masterRowData) {
            masterTitleField = detDefinition.masterTitleField || '__str__';
            detTitle = me.masterRowData[masterTitleField];
        }

        // Return
        return {
            'detFilter': detFilter,
            'detTitle': detTitle
        };

    },

    setDetailDefaults: function(detDefinition, detFieldDict) {
        // after setMasterData

        var me = this, 
            nField, myDetField, myTitleField, masterTitleField;

        // nfield : campo en el detalle q apunta al maestro ( semanticKey )
        nField = detDefinition.detailField.replace(/__pk$/, '_id');
        myDetField = detFieldDict[nField];

        // parent key not found' puede ocurrir en detalles de mas de un nivel
        if (!myDetField) {
            return;
        }

        // Master Id
        myDetField['prpDefault'] = me.masterId;

        // Obtiene el titulo del filtro para heredarlo
        nField = detDefinition.masterTitleField || nField.replace(/_id$/, '');
        myTitleField = detFieldDict[nField];
        if (myTitleField) {
            masterTitleField = detDefinition.masterTitleField || '__str__';
            myTitleField['readOnly'] = true;

            if (me.masterRowData) {
                myTitleField['prpDefault'] = me.masterRowData[masterTitleField];
            } else {
                myTitleField['prpDefault'] = '?';
            }
        }
    }

});

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.UI.ConfigController', {
    extend: 'Ext.Base',
    myMeta: null,
    constructor: function(config) {
        Ext.apply(this, config || {});
        this.getProtoConfigBar();
    },

    getProtoConfigBar: function() {
        var me = this;
        function onClickConfigAction(btn) {
            me.configAction(btn.prCfgAction);
        }

        function myActionConfig(action, name, icon) {
            var myAction = Ext.create('Ext.Action', {
                text: name,
                iconCls: icon,
                prCfgAction: action,
                scope: me,
                handler: onClickConfigAction
            });
            return myAction;
        }

        // @formatter:off
        var myConfigOpts = [], 
            __MasterDetail = this.__MasterDetail;
        // @formatter:on

        this.viewCode = this.myMeta.viewCode;
        var perms = _SM._UserInfo.perms[this.viewCode];

        if (perms.config) {
            myConfigOpts.push(myActionConfig('Form', _SM.__language.MetaConfig_Form_Config, 'icon-configForm'));
            myConfigOpts.push(myActionConfig('Fields', _SM.__language.MetaConfig_Add_Fields, 'icon-configFields'));
            myConfigOpts.push(myActionConfig('Details', _SM.__language.MetaConfig_Add_Details, 'icon-configDetails'));
            myConfigOpts.push(myActionConfig('Config', _SM.__language.MetaConfig_Base_Config, 'icon-configCustom'));
            myConfigOpts.push(myActionConfig('Meta', _SM.__language.MetaConfig_Meta_Config, 'icon-configMeta'));

        } else if (perms.custom) {
            myConfigOpts.push(myActionConfig('Custom', _SM.__language.MetaConfig_Custom_Config, 'icon-configCustom'));
        }

        // Modificacion del entorno
        if (myConfigOpts.length > 0) {

            __MasterDetail.tbConfigOpts = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden: true,
                enableOverflow: true,
                items: [{
                    xtype: 'tbtext',
                    text: '<strong>' + _SM.__language.Text_Config + ':</strong>'
                }]
            });

            __MasterDetail.tbConfigOpts.add(myConfigOpts);
            __MasterDetail.myConfigOpts = myConfigOpts;
            __MasterDetail.protoMasterGrid.addDocked(__MasterDetail.tbConfigOpts);

        }
    },

    configAction: function(prCfgAction) {

        switch(prCfgAction) {
            case 'Meta':
                this.showMetaConfig();
                break;
            case 'Custom':
                this.showCustomConfig(false);
                break;
            case 'Config':
                this.showCustomConfig(true);
                break;
            case 'Form':
                this.showProtoDesigner();
                break;
            case 'Fields':
                this.showFieldTree();
                break;
            case 'Details':
                this.showDetailsTree();
                break;
        }

    },

    showMetaConfig: function() {

        var myMeta = _SM._cllPCI[this.viewCode];
        if (!myMeta) {
            return;
        }

        var myPcl = Ext.widget('protoPcl', {
            myMeta: myMeta,
            editable: true
        });

        this.showConfigWin(myPcl);

    },

    showCustomConfig: function(metaConfig) {
        var myMeta = _SM._cllPCI[this.viewCode], title;

        if (!myMeta) {
            return;
        }

        var myPcl = Ext.widget('protoPcl', {
            myMeta: myMeta,
            custom: true,
            metaConfig: metaConfig,
            editable: true
        });

        if (metaConfig) {
            title = 'Base Config';
        } else {
            title = 'Custom Config';
        }

        this.showConfigWin(myPcl);
    },

    showFieldTree: function() {

        var myMeta = _SM._cllPCI[this.viewCode];
        if (!myMeta) {
            return;
        }

        var fieldsTree = Ext.create('ProtoUL.proto.ProtoFieldSelector', {
            viewCode: this.viewCode,
            myMeta: myMeta
        });

        this.showConfigWin(fieldsTree);

    },

    showProtoDesigner: function() {

        var myMeta = _SM._cllPCI[this.viewCode];
        if (!myMeta) {
            return;
        }

        var protoDesigner = Ext.widget('protoDesigner', {
            myMeta: myMeta,
            viewCode: this.viewCode
        });

        this.showConfigWin(protoDesigner);
    },

    showDetailsTree: function() {

        var myMeta = _SM._cllPCI[this.viewCode];
        if (!myMeta) {
            return;
        };

        var detailsTree = Ext.create('ProtoUL.proto.ProtoDetailSelector', {
            myMeta: myMeta,
            viewCode: this.viewCode
        });

        this.showConfigWin(detailsTree);

    },

    showConfigWin: function(CnfgItems, title) {

        if (!title) {
            title = 'MetaDefinition';
        }

        var myWin = Ext.widget('window', {
            constrain: true,
            title: title + ' [ ' + this.viewCode + ' ]',
            // closeAction: 'hide',
            width: 900,
            height: 600,
            minHeight: 400,
            minWidth: 400,
            layout: 'fit',

            constrainHeader: true,
            resizable: true,
            maximizable: true,

            collapsible: true,
            // modal: true,
            items: CnfgItems
        });

        myWin.show();

    }

});
/**
 * @class ProtoUL.ux.FormController
 * @author  Dario Gomez

 * Helper class for instancing ProtoForm

 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */
/*global ProtoUL */
/*global getSimpleProperties */

Ext.define('ProtoUL.UI.FormController', {
    extend : 'Ext.Base',

    // requires: [ 'ProtoUL.view.ProtoForm' ],
    // Required if linked,  retrived if zoom
    myMeta : null,

    // metaDict : contiene las metas de los detalles
    myMetaDict : null,

    // Entry point if zoom
    viewCode : null,

    // if ReadOnly
    isReadOnly : false,

    // Si la forma fue cargada correctamente
    formLoaded : false,

    // Win dimension
    myWidth : 620,
    myHeight : 460,

    newForm : false,

    constructor : function(config) {
        Ext.apply(this, config || {});
        this.myMetaDict = {};
    },

    _loadFormDefinition : function() {
        // antes de cargar la forma, requiere la carga de detalles
        // llama a waitForDetails q llama a newProtoForm

        function loadDetailDefinition(me, detCode) {

            // Opciones del llamado AJAX para precargar los detalles
            var options = {
                scope : me,
                success : function(obj, result, request) {
                    me._waitForDetails(me, detCode);
                },
                failure : function(obj, result, request) {
                    me._waitForDetails(me, detCode);
                    _SM.errorMessage('ProtoDefinition Error :', detCode + ': protoDefinition not found');
                }
            };

            // PreCarga los detalles
            if (_SM.loadPci(detCode, true, options)) {
                me._waitForDetails(me, detCode);
            }

        }

        // This increase performance.
        Ext.suspendLayouts();

        // lo marca como cargado
        this.myMetaDict[this.myMeta.viewCode] = false;

        // Carga el dictionario de detalles
        var me = this, detConfig = me.myMeta.detailsConfig, ixV, pDetail, detCode;

        for (ixV in detConfig  ) {
            pDetail = detConfig[ixV];
            this.myMetaDict[pDetail.conceptDetail] = false;
        }

        // ahora carga las definiciones
        me.loaded = false;
        for (detCode in me.myMetaDict  ) {
            if ( detCode in _SM._cllPCI) {
                me.myMetaDict[detCode] = true;
            } else {
                loadDetailDefinition(me, detCode);
            }
        }

        // si np esta cargada la manda en nulo para forzar la carga
        if (!me.loaded) {
            me._waitForDetails(me);
        }
        Ext.resumeLayouts(true);
    },

    _waitForDetails : function(me, detCode) {

        if (detCode) {
            me.myMetaDict[detCode] = true;
        }

        // espera todas las definiciones
        for (detCode in me.myMetaDict  ) {
            if (!me.myMetaDict[detCode]) {
                return;
            }
        }

        if (me.loaded) {
            return;
        }

        me.loaded = true;
        me.newProtoForm.call(me);

        // ---------------

        me.myForm.setActiveRecord(this.myRecordBase);
        me.myForm.store = this.myRecordBase.store;

        // Si la forma es visible no salen los tools
        // if ( me.isReadOnly ) {me.myWin.tools = [{type: 'readOnly', tooltip: 'readOnly'}, {type: 'gear', scope: me.myForm, handler: me.myForm.showProtoForm }] me.myWin.addTools() };

        // Si la forma no esta visible no puede desactivar los headers
        if (me.isReadOnly) {
            me.myForm.setFormReadOnly(true);
        } else {
            me.myForm.setReadOnlyFields(true, me.myMeta.gridConfig.readOnlyFields);
        }

        me.newWindowLoad.call(me, me);
        me.myWin.show();
        me.myForm.setDetailsTilte();
    },

    newProtoForm : function() {
        // llamado tambien desde formConfig  (protoDesigner)

        var me = this;
        if (!me.myFieldDict) {
            me.myFieldDict = _SM.getFieldDict(me.myMeta);
        }

        this.defineFormLayout();
        this.myForm = Ext.widget('protoform', {
            myMeta : this.myMeta,
            newForm : this.newForm,
            myFormController : this,
            prFormLayout : this.prFormLayout
        });

        return this.myForm;

    },

    newWindow : function(me) {
        me._loadFormDefinition();
    },

    newWindowLoad : function(me) {

        _SM.updateWinPosition(me.myWidth, me.myHeight);

        var strEditing = '';
        if (me.newForm) {
            strEditing = ' *';
        }

        me.myForm.setZoomEditMode(me.myForm);

        me.myWin = Ext.widget('window', {
            title : me.myMeta.viewCode + strEditing,
            closeAction : 'hide',
            width : me.myWidth,
            height : me.myHeight,
            style : 'z-index: -1;',
            x : _SM._winX,
            y : _SM._winY,
            minHeight : 400,
            minWidth : 400,
            layout : 'fit',

            constrainHeader : true,
            maximizable : true,
            resizable : true,
            modal : true,

            items : me.myForm
        });

        // Los eventos controlan la ventana
        me.myForm.on({
            'close' : function() {
                me.myWin.close();

                // if ( me.newForm ) {
                // function doAgain( btn ){
                // if(btn == 'yes') { me.openNewForm( me.myStore );}}
                // Ext.MessageBox.confirm('AddRecord', 'Add another?', doAgain  );
                // }
            },
            'hide' : function() {
                me.myWin.hide();
            },
            scope : me
        });

        // Tools this.myWin.tools = [{type: 'readOnly', tooltip: 'readOnly'}] this.myWin.addTools(

    },

    openNewForm : function(myStore) {

        this.isReadOnly = false;
        this.newForm = true;
        this.myStore = myStore;

        var myRecord = _SM.getNewRecord(this.myMeta, myStore);
        this.openForm(myRecord);
    },

    openLinkedForm : function(myRecord, isReadOnly) {
        this.newForm = false;
        this.isReadOnly = isReadOnly;
        this.openForm(myRecord);
    },

    openForm : function(myRecord) {

        // Verifica la edicion
        if (!myRecord) {
            _SM.errorMessage('Form Error', 'Undefined input record');
            return;
        }

        this.myRecordBase = myRecord;
        this.newWindow(this);

    },

    openProtoForm : function(myZoomModel, myRecordId, bEditable) {

        this.viewCode = myZoomModel;
        this.isReadOnly = !bEditable;

        if (!myRecordId) {
            _SM.errorMessage('LinkedForm Error : ' + myZoomModel, 'not fkId field definition found');
            return;
        }

        // Obtiene la meta ( async )
        this._getFormDefinition(myRecordId);

    },

    _getFormDefinition : function(myRecordId) {

        // Opciones del llamado AJAX
        var options = {
            scope : this,
            success : function(obj, result, request) {
                this._openAndLoad(this.viewCode, myRecordId);
            },
            failure : function(obj, result, request) {
                _SM.errorMessage('ProtoDefinition Error :', this.viewCode + ': protoDefinition not found');
            }
        };
        if (_SM.loadPci(this.viewCode, true, options)) {
            this._openAndLoad(this.viewCode, myRecordId);
        }

    },

    _openAndLoad : function(viewCode, myRecordId) {

        this.myMeta = _SM.clone(_SM._cllPCI[viewCode]);

        this.formLoaded = true;
        this._loadFormData(myRecordId);
    },

    _loadFormData : function(myRecordId) {

        var me = this, myFilter, storeDefinition, myStore, myRecord;

        // Form is not ready
        if (!me.formLoaded) {
            return;
        }

        // TODO: LinkFilter
        myFilter = [{
            "property" : "pk",
            "filterStmt" : myRecordId
        }];
        storeDefinition = {
            viewCode : this.viewCode,
            autoLoad : true,
            baseFilter : myFilter,
            sProtoMeta : _SM.getSafeMeta(this.myMeta)
        };
        myStore = _SM.getStoreDefinition(storeDefinition);

        if (myRecordId !== -1) {
            myStore.load();
            myStore.on({
                'load' : function(store, records, successful, options) {

                    // Fix:  Esta entrando dos veces  porq????
                    if (this.myWin) {
                        return;
                    }

                    // The form is now linked to  store
                    this.openLinkedForm(records[0], this.isReadOnly);
                },
                scope : this
            });

        } else {

            this.newForm = true;
            me.myFieldDict = _SM.getFieldDict(me.myMeta);

            if (me.linkController) {
                me.detailLink = me.linkController.getDetailLink(me.detailDefinition);
                me.linkController.setDetailDefaults(me.detailDefinition, me.myFieldDict);
                me.baseFilter = me.detailLink.detFilter;
                me.detailTitle = me.detailLink.detTitle;
            }

            myRecord = _SM.getNewRecord(this.myMeta, myStore);
            this.openForm(myRecord);
        }
    },

    defineFormLayout : function() {

        function setFieldDefaults(prLayout, key) {
            // Asigna los fieldDefaults q vienen en los contenedores
            var sAux = prLayout[key];
            if (sAux) {
                prLayout.fieldDefaults[key] = sAux;
            }
        }

        function defineProtoFormItem(me, parent, protoObj, protoIx) {

            var myFld, prLayout, template, __ptType, sDataType = _SM.typeOf(protoObj);

            if (sDataType === "object") {

                // Configura el objeto
                if (!protoObj.__ptConfig) {
                    protoObj.__ptConfig = getSimpleProperties(protoObj);
                }
                if (!protoObj.__ptConfig.name) {
                    protoObj.__ptConfig.name = protoIx;
                }

                __ptType = protoObj.__ptConfig.__ptType || protoObj.__ptType;

                if (!__ptType) {
                    // console.log( 'El objeto no tiene tipo definido' , protoObj )
                    return {};

                } else if (__ptType === 'formField') {

                    // protoIx es el field Name, si no viene debe buscarlo en __ptConfig [ name ]
                    protoIx = protoObj.name || protoObj.__ptConfig.name;

                    myFld = me.myFieldDict[protoIx];
                    if (myFld) {
                        template = getTemplate(__ptType, true, myFld);

                        if (myFld.required && !myFld.fkId && me.newForm) {
	                        template.__ptConfig.listeners.render = function(field) {
		                        Ext.Ajax.request({
			                        url : _SM._PConfig.urlGetNextIncrement,
			                        method : 'GET',
			                        params : {
				                        fieldName : myFld.name,
				                        viewEntity : me.myMeta.viewEntity
			                        },
			                        success : function(result, request) {
				                        var jsonData = Ext.decode(result.responseText);
				                        if (jsonData.increment) {
				                        	field.setValue(jsonData.increment);
				                        }
			                        },
			                        failure : function() {
			                        	console.log('failure on get increment');
			                        }
		                        });
	                        };
                        }

                        prLayout = Ext.apply(template.__ptConfig, protoObj.__ptConfig);

                        // ReadOnlyCls
                        if (prLayout['xtype'] === 'protoZoom') {
                            prLayout['readOnlyCls'] = 'protoLink';
                        } else if (prLayout['xtype'] !== 'checkbox') {
                            prLayout['readOnlyCls'] = 'protofield-readonly';
                        }

                    } else {

                        // El campo no existe en la definicion:  es un label
                        // Incluso los campos calculados deben existir en la definicion
                        // console.log( 'invalid formField,name  :' , protoObj )
                        prLayout = {
                            text : protoIx,
                            xtype : 'label',
                            margin : '4',
                            padding : '4',
                            border : 1,
                            tooltip : 'field definition not found',
                            style : {
                                borderColor : 'red',
                                borderStyle : 'solid',
                                bodyStyle : ';border-right:none;border-left:none;border-top:none;'
                            }
                        };
                    };

                } else if (__ptType == 'protoGrid') {

                    if (_SM.loadPci(protoObj.viewCode, false)) {

                        template = getTemplate(__ptType, true);
                        prLayout = Ext.apply(template.__ptConfig, protoObj.__ptConfig);

                        if ((!prLayout.minWidth) || (prLayout.minWidth < 100)) {
                            prLayout.minWidth = 250;
                        }
                        // Inicia la grilla sin datos
                        prLayout.initialFilter = [{
                            'property' : 'pk',
                            'filterStmt' : -1
                        }];
                        delete protoObj.__ptConfig.name;
                    } else {
                        prLayout = {
                            xtype : 'label',
                            margin : '4',
                            padding : '4',
                            border : 1,
                            text : 'ERROR: grid definition not found ' + protoObj.viewCode,
                            style : {
                                borderColor : 'red',
                                borderStyle : 'solid',
                                bodyStyle : ';border-right:none;border-left:none;border-top:none;'
                            }
                        };
                        _SM.errorMessage('defineProtoFormItem', protoObj.viewCode + ' not found!!');
                    }
                } else if (__ptType == 'htmlset') {

                    template = getTemplate(__ptType, true);
                    prLayout = Ext.apply(template.__ptConfig, protoObj.__ptConfig);

                    prLayout.htlmFields = protoObj.items;
                    delete protoObj.__ptConfig.name;

                } else if (__ptType == 'detailButton') {

                    template = getTemplate(__ptType, true);
                    prLayout = Ext.apply(template.__ptConfig, protoObj.__ptConfig);
                    prLayout.minWidth = 100;

                } else {

                    template = getTemplate(__ptType, true);
                    prLayout = Ext.apply(template.__ptConfig, protoObj.__ptConfig);

                    // Agrega los items
                    prLayout.items = [];
                    var prItems, ix, prVar, prFld;
                    prItems = protoObj.items;

                    for (ix in prItems ) {
                        if (ix.indexOf("__pt") == 0) {
                            continue;
                        }

                        prVar = prItems[ix];
                        prFld = defineProtoFormItem(me, protoObj, prVar, ix);
                        if (prFld) {
                            prLayout.items.push(prFld);
                        }

                    }

                }

                // Establece el layout  ( Columns )
                var sAux, ix;
                sAux = prLayout['fsLayout'];
                if (sAux) {

                    prLayout.defaultType = 'textfield';
                    prLayout.layout = 'column';
                    prLayout.defaults = {
                        padding : '2 2'
                    };

                    if (sAux == "1col") {
                        prLayout.defaults.columnWidth = 1;
                    } else if (sAux == "2col") {
                        prLayout.defaults.columnWidth = 0.5;
                    } else if (sAux == "3col") {
                        prLayout.defaults.columnWidth = 0.33;
                    }
                    delete prLayout.fsLayout;

                    // Parametros de labels
                    prLayout.fieldDefaults = {};
                    setFieldDefaults(prLayout, 'labelAlign');
                    setFieldDefaults(prLayout, 'labelWidth');
                    setFieldDefaults(prLayout, 'hideLabel');

                }

                // Tooltip
                if (prLayout['tooltip']) {

                    prLayout['listeners'] = {
                        render : function(c) {
                            Ext.create('Ext.tip.ToolTip', {
                                target : c.getEl(),
                                trackMouse : true,
                                html : prLayout['tooltip']
                            });
                        }
                    };

                }

                // El fieldContainer requiere!!  el defaultType
                // prFld.xtype = 'fieldcontainer';
                // prFld.defaultType = 'textfield'
                // prFld.combineErrors = true;
                // prFld.layout = 'hbox';
                // prFld.margins = 0;
                // prFld.pad = 0;
                // prFld.frame = false;
                // prFld.defaults = {flex : 1}

            } else if (sDataType == "array") {
                var prVar, prFld;
                prLayout = [];
                for (ix in protoObj ) {
                    prVar = protoObj[ix];

                    // Si es un array el padre es ../..
                    prFld = defineProtoFormItem(me, parent, prVar, ix);
                    if (prFld) {
                        prLayout.push(prFld);
                    }
                }

            }

            return prLayout;

        }

        // @formatter:off
        var me = this, myFormDefinition, myMeta, ixV, lObj, prItem;
        // @formatter:on

        myFormDefinition = _SM.clone(this.myMeta.formConfig);
        myMeta = this.myMeta;

        me.prFormLayout = [];

        for (ixV in myFormDefinition.items) {
            lObj = myFormDefinition.items[ixV];

            // Envia el contenedor y el objeto
            prItem = defineProtoFormItem(me, {
                __ptType : 'panel'
            }, lObj);
            me.prFormLayout.push(prItem);
        }

    }
});
/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */
/*global ProtoUL */

Ext.define('ProtoUL.UI.GridController', {
    extend : 'Ext.Base',

    // Parametros de entrada
    myMeta : null,
    myGrid : null,
    store : null,

    constructor : function(config) {
        Ext.apply(this, config || {});
    },

    addNavigationPanel : function() {
        /*
         * Configuracion del NavigationPanel, tiene en cuenta el manejo de detalles
         * y agrega el maximo del almacenamiento local.
         *
         */

        var me = this, myGrid = this.myGrid, navPanel = ['-'], myNavPanel, comboPageSize;

        comboPageSize = Ext.create('Ext.form.ComboBox', {
            name : 'perpage',
            width : 60,
            store : Ext.create('Ext.data.ArrayStore', {
                fields : ['id'],
                data : _SM._ComboPageSize
            }),
            mode : 'local',
            value : '50',
            listWidth : 60,
            triggerAction : 'all',
            displayField : 'id',
            valueField : 'id',
            editable : false,
            forceSelection : true
        });

        comboPageSize.on('select', function(combo, record) {
            myGrid.store.pageSize = parseInt(combo.getValue(), 10);
            myGrid.store.load();
            if (myGrid.store.currentPage != 1) {
                myGrid.store.loadPage(1);
            }
        }, myGrid);

        // Extraccion de grilla detalle
        if (myGrid.protoIsDetailGrid) {
            navPanel.push({
                text : _SM.__language.GridNav_In_New_Tab,
                iconCls : 'icon-promote',
                scope : me,
                handler : onMenuPromoteDetail
            });
        }

        navPanel.push(comboPageSize, _SM.__language.GridNav_PageSize);

        myNavPanel = {
            xtype : 'pagingtoolbar',
            border : false,
            dock : 'bottom',
            store : myGrid.store,
            displayInfo : true,
            items : navPanel,
            afterPageText : _SM.__language.GridNav_Total + ' {0}',
            beforePageText : _SM.__language.GridNav_Page,

            firstText : _SM.__language.GridNav_First_Page,
            nextText : _SM.__language.GridNav_Next_Page,
            prevText : _SM.__language.GridNav_Previous_Page,
            lastText : _SM.__language.GridNav_Last_Page,
            refreshText : _SM.__language.GridNav_Refresh,

            displayMsg : _SM.__language.GridNav_Current + ' : {0} - {1} ' + _SM.__language.GridNav_Total + ' {2}'
            // emptyMsg: "No register to display"
        };

        myGrid.addDocked(myNavPanel);

        function onMenuPromoteDetail() {
            _SM.__TabContainer.addTabPanel(myGrid.viewCode, myGrid.mdFilter, myGrid.detailTitle);
        }

    },

    addGridTools: function( editMode ) {

        var hideTool = ! editMode, editTools;  

        editTools = [{
            itemId : 'toolFormAdd',
            tooltip : _SM.__language.GridBtn_Ttip_Add_Form,
            type : 'formAdd',
            width : 20,
            hidden: hideTool,
            scope : this,
            handler : this.onEditAction
        }, {
            itemId : 'toolFormUpd',
            tooltip : _SM.__language.GridBtn_Ttip_Edit_Form,
            hidden: hideTool,
            type : 'formUpd',
            width : 20,
            scope : this,
            handler : this.onEditAction
        }, {
            itemId : 'toolRowDel',
            type : 'rowDel',
            tooltip : _SM.__language.GridBtn_Ttip_Del_Record,
            hidden: hideTool,
            width : 30,
            scope : this,
            handler : this.onEditAction
        }, {
            itemId: 'toolFormView',
            tooltip: _SM.__language.GridBtn_Ttip_Read_Only,
            type: 'formView',
            width: 20,
            scope: this,
            handler: this.onEditAction
            // },{
            // itemId: 'toolRowAdd',
            // tooltip: _SM.__language.GridBtn_Ttip_Add_Row,
            // type: 'rowAdd',
            // hidden: true,
            // width : 20,
            // scope: this,
            // handler: this.onEditAction
        }, {
            itemId : 'toolRowCopy',
            tooltip : _SM.__language.GridBtn_Ttip_Copy_Row,
            type : 'rowCopy',
            hidden: hideTool,
            width : 20,
            scope : this,
            handler : this.onEditAction
        },{
        	itemId : 'toolDiagramEdit',
            tooltip : _SM.__language.GridBtn_Ttip_Edit_Diagram,
            type : 'diagramEdit',
            hidden : true,
            width : 20,
            scope : this,
            handler : this.onEditAction
        }
        ];

        this.myGrid.addTools(editTools);
        this.setEditMode( editMode );

    },

    setToolMode : function(myToolBt, bEdit) {
        var myExtGrid = this.myGrid._extGrid;

        if (bEdit) {
            myExtGrid.down(myToolBt).show();
        } else {
            myExtGrid.down(myToolBt).hide();
        }
    },

    setEditMode : function(bEdit) {

        var me = this, bRef, record, stRec, perms, myExtGrid;

        perms = _SM._UserInfo.perms[this.myMeta.viewCode] || [];
        myExtGrid = me.myGrid._extGrid;
        this.myGrid.editable = bEdit;


        if (!(perms['add'] || perms['change'] || perms['delete'] )) {
            bRef = false; 
        } else { 
			var itemSelected = false;
			if (typeof me.myGrid.selected !== 'undefined') {
				itemSelected = me.myGrid.selected;
			}
            bRef = bEdit && itemSelected;
            if (bRef) {
                record = me.myGrid.selected;
                stRec = record.get('_ptStatus');
                bRef = !(stRec && stRec === _SM._ROW_ST.REFONLY);
            }

        }    
        this.setEditToolBar(bEdit, bRef, perms);

    },

    setEditToolBar : function(bEdit, bRef, perms) {

        var me = this;

        me.setToolMode('#toolRowCopy', bEdit && perms['add']);
        me.setToolMode('#toolFormAdd', bEdit && perms['add']);

        me.setToolMode('#toolFormUpd', bRef && perms['change']);

        me.setToolMode('#toolRowDel', bRef && perms['delete']);
        
        if (me.myMeta.viewCode === "prototype.Project" || me.myMeta.viewCode === "prototype.Diagram") {
			me.setToolMode('#toolDiagramEdit', bRef && perms['add']);
		}

        // Dont Delete
        // setToolMode ( myExtGrid, '#toolRowAdd', bEdit && perms['add'])
        // setToolMode ( myExtGrid, '#toolMetaConfig',  !bEdit );
        // me.setToolMode('#toolFormView', !(bRef && perms['change'] ));

    },

    //  --------------------------------------------------------------------------

    onEditAction : function(ev, obj, head, btn) {

        function doDelete(btn) {
            if (btn === 'yes') {
                me.myGrid.deleteCurrentRecord();
            }
        }

        if (!this.formController) {
            this.formController = Ext.create('ProtoUL.UI.FormController', {
                myMeta : this.myMeta
            });
        }

        this.myGrid.fireStartEdition(btn.itemId);

        // 'toolFormAdd', 'toolFormUpd', 'toolFormView', 'toolRowAdd', 'toolRowCopy', 'toolRowDel',
        switch( btn.itemId ) {
            case 'toolFormAdd' :

                this.formController.openNewForm(this.myGrid.store);
                break;

            case 'toolFormUpd' :
                if (_SM.validaSelected(this.myGrid )) {
                    this.formController.openLinkedForm(this.myGrid.selected);
                }
                break;

            case 'toolFormView' :
                if (_SM.validaSelected(this.myGrid )) {
                    this.formController.openLinkedForm(this.myGrid.selected, true);
                }
                break;
                
			case 'toolDiagramEdit' :
				if (_SM.validaSelected(this.myGrid)) {
					Ext.getBody().mask('Loading...', 'loading');
					scriptLibrary = [];
					createJSFilesLibrary();
					var selectedItem = this.myGrid.rowData;
					loadJsFilesSequentially(scriptLibrary, 0, function(){
						var win = Ext.create('ProtoUL.view.diagram.DiagramMainView');
						if (selectedItem.project_id) {
							win.setDiagramID(selectedItem.id);
							win.setProjectID(selectedItem.project_id);
						} else {
							win.setProjectID(selectedItem.id);
						}
						win.show();
						Ext.getBody().unmask();
						win.maximize();
					});
				}
				break;
            case 'toolRowCopy' :
                this.myGrid.duplicateRecord();
                break;

            case 'toolRowDel' :
                var me = this;
                Ext.MessageBox.confirm(_SM.__language.Title_Msg_Confirm_Delete, _SM.__language.Msg_Confirm_Delete_Operation, doDelete);
                break;
        }

        // Dont delete mask load ( form preview with mask?? )
        //function showLoadingMask()
        // {
        // loadText = 'Loading...';
        // //Use the mask function on the Ext.getBody() element to mask the body element during Ajax calls
        //	Ext.getBody().mask(loadText, 'loading');
        //	Ext.Ajax.on('requestcomplete',Ext.getBody().unmask ,Ext.getBody());
        //	Ext.Ajax.on('requestexception', Ext.getBody().unmask , Ext.getBody());
        // }
    }
});

_SM.validaSelected = function(  myGrid ) {

    var myReg = myGrid.selected; 

    if (!myReg) {
        _SM.errorMessage(_SM.__language.Title_Form_Panel, _SM.__language.GridAction_NoRecord);
        return false;
    }

    if ( ! myReg.store ) {
        myReg.store = myGrid.store; 
    }

    return true;
};
/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.UI.GridSheetController', {
    extend: 'Ext.Base',

    // Parametros de entrada
    myGrid: null,

    constructor: function(config) {
        Ext.apply(this, config || {});

    },

    getSheetConfig: function() {

        var me = this.myGrid, myMeta = me.myMeta, ix, sType;

        // Verifia q al menos una hoja sea visible en la grilla
        var hideSheet = true;
        for (ix in myMeta.sheetConfig  ) {
            sType = myMeta.sheetConfig[ix].sheetType;
            if (sType == 'gridOnly') {
                continue;
            }
            hideSheet = false;
            break;
        }
        if (hideSheet) {
            myMeta.gridConfig.hideSheet = true;
        }

        // Los zooms ( initialConfig ) no deben manejar sheets
        if (!(me.initialConfig.hideSheet || myMeta.gridConfig.hideSheet )) {
            me.IdeSheet = Ext.id();

            // Ojeto dinamicamente creada con las pSheetProps segun cada plantilla
            // Indice  el sheetName y el indice segun se requieren
            this.pSheetsProps = {};

            return {
                region: 'east',
                id: me.IdeSheet,
                collapsible: true,
                collapsed: true,
                split: true,
                flex: 1,
                layout: 'fit',
                minSize: 50,
                autoScroll: true,
                border: false
            };
        }

    },

	prepareSheet: function() {
    	
        // @formatter:off
        var me = this.myGrid, 
            myMeta = me.myMeta;
        // @formatter:on

        // Los zooms ( initialConfig ) no deben manejar sheets
        if (me.initialConfig.hideSheet || myMeta.gridConfig.hideSheet) {
            return;
		}

        // Si no tiene datos
        if (!me.rowData) {
            renderSheet('', '');
            return;
        }
        
        //@formatter:off
        var pSheets = myMeta.sheetConfig, 
            pSheetSelector = myMeta.sheetSelector || '', 
            pSheetCriteria = me.rowData[pSheetSelector], 
            pSheet = undefined, 
            ix;
        //@formatter:on

        for (ix in pSheets  ) {
            if (pSheets[ix].sheetType == 'printerOnly') {
                continue;
            }

            pSheet = pSheets[ix];
            if (pSheet.name == pSheetCriteria) {
                break;
            }
        }

        if (pSheet === undefined) {
            return;
        }

        // Contruye las pSheetProps a medida q las necesita
        var pTemplate = pSheet.template || '';
        var pSheetProps = this.pSheetsProps[pSheet.name];
        if (!pSheetProps) {
            pSheetProps = [];
            for (ix in myMeta.fields  ) {
                var fName = myMeta.fields[ix].name;
                if (pTemplate.indexOf('{{' + fName + '}}') > -1) {
                    pSheetProps.push(fName);
                }
            }
            this.pSheetsProps[pSheet.name] = pSheetProps;
        }

        for (ix in pSheetProps) {
            var vFld = pSheetProps[ix];

            var pKey = '{{' + vFld + '}}';
            var pValue = me.rowData[vFld];

            if (vFld == 'metaDefinition') {
                pValue = _SM.FormatJsonStr(pValue);
            }

            /*FIX IE compatibility */
            pTemplate = pTemplate.split(pKey).join(pValue);
            // pTemplate = pTemplate.replace( new RegExp(pKey, 'g') , pValue  );

        }

        renderSheet(pSheet.title, pTemplate);

        function renderSheet(title, pTempalte) {

            var sheet = Ext.getCmp(me.IdeSheet);
            sheet.setTitle(title);
            sheet.update(pTemplate);

            // Expone el template
            me.sheetHtml = pTemplate;

        }

    }

});
/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.UI.MDActionsController', {
    extend: 'Ext.Base',
    myMeta: null,
    constructor: function(config) {
        Ext.apply(this, config || {});
        this.getProtoActionsBar();
    },

    getProtoActionsBar: function() {

        var perms = _SM._UserInfo.perms[this.myMeta.viewCode];
        if (!(perms['add'] || perms['change'] || perms['delete'])) {
            return;
        }
        // if ( ! _SM._UserInfo.isStaff ) return

        // @formatter:off
        var me = this, ix, pProtoAction,
            myProtoActions = [],  
            __MasterDetail = this.__MasterDetail;
        // @formatter:on

        if (this.myMeta.WFlowActions) {
            for (ix in this.myMeta.WFlowActions ) {
                pProtoAction = this.myMeta.WFlowActions[ix];

                pProtoAction.menuText = pProtoAction.menuText || pProtoAction.name;
                pProtoAction.actionType = 'wflow';
                pProtoAction.selectionMode = 'multiple';
                pProtoAction.refreshOnComplete = true;

                if (pProtoAction.admMessagePropmt) {
                    pProtoAction.actionParams = [{
                        'name': 'admMessage',
                        'tooltip': pProtoAction.description,
                        'fieldLabel': pProtoAction.admMessagePropmt,
                        'type': 'string',
                        'required': true
                    }];

                } else {
                    pProtoAction.actionParams = [];
                }

                myProtoActions.push(new Ext.Action({
                    text: pProtoAction.menuText,
                    actionName: pProtoAction.name,
                    iconCls: pProtoAction.viewIcon,
                    tooltip: pProtoAction.description,
                    actionDef: pProtoAction,
                    scope: me,
                    handler: onClickDoAction
                }));
            };

        }

        for ( ix in this.myMeta.actions  ) {
            pProtoAction = this.myMeta.actions[ix];
            pProtoAction.menuText = pProtoAction.menuText || pProtoAction.name;
            myProtoActions.push(new Ext.Action({
                text: pProtoAction.menuText,
                actionName: pProtoAction.name,
                iconCls: pProtoAction.viewIcon,
                tooltip: pProtoAction.description,
                actionDef: pProtoAction,
                scope: me,
                handler: onClickDoAction
            }));
        };

        if (myProtoActions.length > 0) {

            __MasterDetail.tbProtoActions = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden: true,
                enableOverflow: true,
                items: [{
                    xtype: 'tbtext',
                    text: '<strong>Actions :</strong>'
                }]
            });

            __MasterDetail.tbProtoActions.add(myProtoActions);
            __MasterDetail.myProtoActions = myProtoActions;
            __MasterDetail.protoMasterGrid.addDocked(__MasterDetail.tbProtoActions);

        };

        function onClickDoAction(btn) {

            var pGrid = __MasterDetail.protoMasterGrid;
            var selectedKeys = pGrid.getSelectedIds();
            var pAction = btn.actionDef;
            var myOptions, myWin;
            var detKeys = {};

            // "selectionMode",
            if ((pAction.selectionMode == "single"  ) && (selectedKeys.length != 1 )) {
                _SM.__StBar.showMessage('TITLE_ACTION_SELECTION_SINLGLE', btn.actionName, 3000);
                return;

            } else if ((pAction.selectionMode == "multiple"  ) && (selectedKeys.length < 1 )) {
                _SM.__StBar.showMessage('TITLE_ACTION_SELECTION_MULTI', btn.actionName, 3000);
                return;

            } else if (pAction.selectionMode == "details"  ) {

                for (ix in this.__MasterDetail.protoTabs.items.items ) {
                    pdetGrid = this.__MasterDetail.protoTabs.items.items[ix];
                    detKeys[ pdetGrid.detailDefinition.detailName ]  = pdetGrid.getSelectedIds();
                }
            }

            // actionParams
            pAction.actionParams = _SM.verifyList(pAction.actionParams);
            if (pAction.executeJS){
            	eval(pAction.jsCode);
            } else {
                if (pAction.actionParams.length == 0) {
                	this.doAction(me, pGrid.viewCode, btn.actionDef, selectedKeys, [], detKeys);
            	} else {
                	myOptions = {
                    	scope: me,
                    	acceptFn: function(parameters) {
                        	this.doAction(me, pGrid.viewCode, btn.actionDef, selectedKeys, parameters, detKeys);
                    	}

                	};

                    myWin = Ext.create('ProtoUL.ux.parameterWin', {
                        parameters: pAction.actionParams,
                        title: btn.actionName + ' - ' + pGrid.rowData['__str__'],
                        options: myOptions
                    });

                    myWin.show();

                };
            }
        };

    },

    doAction: function(me, viewCode, actionDef, selectedKeys, parameters, detKeys) {

        var options = {
            scope: me,
            success: function(result, request) {
                var myResult = Ext.decode(result.responseText);
                _SM.__StBar.showMessage(actionDef.name + ' ' + myResult.message, 'MDActionsController', 3000);

                if (myResult.success && actionDef.refreshOnComplete) {
                    this.__MasterDetail.mdGridReload();
                }

                if (myResult.fileName) {
                    _SM.getFile(myResult.fileName, true);
                }

            },
            failure: function(result, request) {
                _SM.__StBar.showError(actionDef.name + ' ' + result.statusText, 'MDActionsController');

            }

        };

        _SM.__StBar.showMessage('executing  ' + actionDef.name + '...', 'MDActionsController');
        _SM.doProtoActions(viewCode, actionDef.name, selectedKeys, detKeys, parameters, actionDef, options);

    }

});
/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.UI.MDDetailsController', {
    extend: 'Ext.Base',
    myMeta: null,

    constructor: function(config) {

        Ext.apply(this, config || {});
        this.getDetailsTBar();

    },

    getDetailsTBar: function() {

        // @formatter:off
        var me = this,
            myMasterDetail = me.__MasterDetail,
            myDetails = [], 
            myAction, vDet, pDetail ;
        // @formatter:on

        // Recorre y agrega los detalles al menu
        for (vDet in myMasterDetail.myMeta.detailsConfig) {

            pDetail = myMasterDetail.myMeta.detailsConfig[vDet];
            if (pDetail.menuText === undefined) {
                continue;
            }

            myAction = new Ext.Action({
                text: pDetail.menuText,
                hidden: true,
                // enableToggle: true,
                scope: me,
                handler: onActionSelectDetail,
                detailKey: pDetail.conceptDetail,
                detailDefinition: pDetail
            });

            myDetails.push(myAction);
            loadDetailDefinition(myAction.initialConfig, myAction);

        }

        if (myDetails.length > 0) {

            // toolBar de base para los items
            myMasterDetail.tbDetails = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'bottom',
                border: true,
                enableOverflow: true,
                items: [{
                    text: '<strong>' + _SM.__language.Grid_Detail_Title + ':</strong>',
                    iconCls: 'icon-panelDown',
                    enableToggle: false,
                    scope: myMasterDetail,
                    handler: myMasterDetail.hideDetailPanel
                }]
            });

            myMasterDetail.myDetails = myDetails;
            myMasterDetail.tbDetails.add(myDetails);
            myMasterDetail.protoMasterGrid.addDocked(myMasterDetail.tbDetails, 0);
            // myMasterDetail.protoMasterGrid.ownerCt.addDocked( myMasterDetail.tbDetails )
        }

        function loadDetailDefinition(item, myAction) {

            // Opciones del llamado AJAX para precargar los detalles
            var options = {
                scope: me,
                success: function(obj, result, request) {
                    createDetailGrid(item, myAction);
                },
                failure: function(obj, result, request) {
                    createDummyPanel(item, myAction);
                }

            };

            // PreCarga los detalles
            if (_SM.loadPci(item.detailDefinition.conceptDetail, true, options)) {
                // El modelo ya ha sido cargado ( la cll meta es global )
                createDetailGrid(item, myAction);
            }

        }

        function createDummyPanel(item, myAction) {
            // Si hubo error en la creacion del detalle
            // El panel debe crearse para poder manejar la secuencia en la barra
            myMasterDetail.protoTabs.add({
                html: _SM.__language.Grid_Detail_Error + ' :' + item.detailKey,
                ixDetail: myMasterDetail.protoTabs.items.length
            });
            // myAction.show();   ( Debug Only )
        }

        function createDetailGrid(item, myAction) {

            function setActionPrp(prp, meth, value) {
                myAction.initialConfig[prp] = value;
                myAction.callEach(meth, [value]);
            }

            //
            var pDetail = item.detailDefinition, detailGrid, myMeta;

            // Definicion grilla Detail
            detailGrid = Ext.create('ProtoUL.view.ProtoGrid', {
                border: false,
                viewCode: pDetail.conceptDetail,
                protoIsDetailGrid: true,
                detailDefinition: pDetail,
                autoLoad: false,
                isDetail: true,

                // Para saber de q linea del maestro  depende
                _MasterDetail: myMasterDetail
            });

            // guarda el store con el indice apropiado
            detailGrid.store.detailDefinition = pDetail;

            // Asigna el Ix
            item.ixDetail = myMasterDetail.protoTabs.items.length;
            myMasterDetail.protoTabs.add(detailGrid);

            //Definicion del detalle TODO: pasarlo a una clase

            detailGrid.ixDetail = item.ixDetail;

            // Asigna el store y lo agrega a los tabs
            myMasterDetail.cllStoreDet[item.ixDetail] = detailGrid.store;

            // Configura el panel
            myMeta = detailGrid.myMeta;

            // setActionPrp('text', 'setText',  myMeta.shortTitle );
            // setActionPrp('tooltip', 'setTooltip', myMeta.description );
            setActionPrp('tooltip', 'setTooltip', pDetail.menuText);

            setActionPrp('iconCls', 'setIconCls', myMeta.viewIcon);
            //setActionPrp('iconAlign', 'setIconAlign', 'top');
            setActionPrp('width', 'setWidth', 100);
            myAction.show();

        }

        function onActionSelectDetail(item) {
            //          fix : Toolbar overflow
            //          myMasterDetail.ixActiveDetail = item.baseAction.initialConfig.ixDetail ;
            myMasterDetail.ixActiveDetail = item.initialConfig.ixDetail;

            // Si se carga directamente el Card Layout en el BorderLayout no permite el activeItem
            myMasterDetail.protoTabs.getLayout().setActiveItem(myMasterDetail.ixActiveDetail);

            myMasterDetail.linkDetail();
            myMasterDetail.showDetailPanel();

            if (item.hasOwnProperty('toggle')) {
                item.toggle(true);
            }
        }

    }

});

Ext.define('ProtoUL.UI.MDPrintOptsController', {
    extend: 'Ext.Base',
    myMeta: null,
    constructor: function(config) {
        Ext.apply(this, config || {});
        this.getPrinterOptsBar();
    },

    getPrinterOptsBar: function() {

        var me = this;
        var myPrinterOpts = [];
        var __MasterDetail = this.__MasterDetail;

        if (this.myMeta.gridConfig.exportCsv) {

            myPrinterOpts.push(new Ext.Action({
                text: _SM.__language.Grid_ExportCSV,
                iconCls: 'icon-printGrid',
                tooltip: _SM.__language.Grid_ExportCSV_Ttip,
                scope: me,
                handler: onClickExportCsv
            }));

        }

        if (!this.myMeta.gridConfig.denyAutoPrint) {

            myPrinterOpts.push(new Ext.Action({
                text: _SM.__language.Text_Grid,
                iconCls: 'icon-printGrid',
                scope: me,
                handler: onClickPrintGrid
            }));

            if (__MasterDetail.protoMasterGrid.IdeSheet != undefined) {
                myPrinterOpts.push(new Ext.Action({
                    text: 'Fiche',
                    iconCls: 'icon-printSheet',
                    scope: me,
                    handler: onClickPrintSheet
                }));
            }
        }

        // Los diferentes formatos definidos para cada grilla, definiria impresion en maestro deltalle usando templates y las relaciones definidas.
        if (this.myMeta.sheetConfig.length > 0) {

            for (var ix in this.myMeta.sheetConfig  ) {
                var pPrinterOpts = this.myMeta.sheetConfig[ix];
                if (pPrinterOpts.sheetStyle == 'gridOnly') {
                    continue;
                }

                myPrinterOpts.push(new Ext.Action({
                    text: pPrinterOpts.name,
                    sheetName: pPrinterOpts.name,
                    iconCls: pPrinterOpts.viewIcon || 'icon-printSheet',
                    tooltip: pPrinterOpts.title,
                    scope: me,
                    handler: onClickPrintSheetRep
                }));
            }

        }

        // Modificacion del entorno
        if (myPrinterOpts.length > 0) {

            __MasterDetail.tbPrinterOpts = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden: true,
                enableOverflow: true,
                items: [{
                    xtype: 'tbtext',
                    text: '<strong>' + _SM.__language.Text_Print + ':</strong>'
                }]
            });

            __MasterDetail.tbPrinterOpts.add(myPrinterOpts);
            __MasterDetail.myPrinterOpts = myPrinterOpts;
            __MasterDetail.protoMasterGrid.addDocked(__MasterDetail.tbPrinterOpts);

        }

        function onClickProtoPrinterOpt(btn) {
        }

        function onClickPrintGrid(btn) {
            var prn = ProtoUL.ux.Printer;
            prn.gridPrint(__MasterDetail.protoMasterGrid._extGrid);
        }

        function onClickPrintSheet(btn) {
            var prn = ProtoUL.ux.Printer, pGrid = __MasterDetail.protoMasterGrid;

            if ((!pGrid) || (!pGrid.sheetHtml )) {
                _SM.__StBar.showWarning(_SM.__language.GridAction_NoRecord, 'MdPrintOptsController');
                return;
            }

            me.openHtmlWin(pGrid.sheetHtml);

        }

        function onClickPrintSheetRep(btn) {
            var prn = ProtoUL.ux.Printer, pGrid = __MasterDetail.protoMasterGrid;

            var win = window.open('', 'printgrid');
            var selectedKeys = pGrid.getSelectedIds();

            var options = {
                scope: me,
                success: function(result, request) {
                    prn.reportPrint(win, result.responseText);
                }
            };

            _SM.getSheeReport(pGrid.viewCode, btn.sheetName, selectedKeys, options);

        }

        function onClickExportCsv(btn) {

            var pGrid = __MasterDetail.protoMasterGrid;

            Ext.Ajax.request({
                method: 'POST',
                url: _SM._PConfig.urlGetProtoCsv,
                params: pGrid.store.proxy.extraParams,
                success: function(result, request) {
                    var myResult = Ext.decode(result.responseText);
                    _SM.getFile(myResult.message, false);
                },
                failure: function(result, request) {
                    _SM.errorMessage(_SM.__language.Grid_ExportCSV_Err, result.status + ' ' + result.statusText);
                },
                scope: this,
                timeout: 60000
            });

        }

    },

    openHtmlWin: function(sHtml) {
        //open up a new printing window, write to it, print it and close
        var win = window.open('', 'printgrid');
        win.document.write(sHtml);

        if (this.printAutomatically) {
            win.print();
        }
    }
});

_SM.getFile = function(fName, newWindow) {
    //  contentType = 'octet-stream'
    var dataURL = 'getFile/' + fName;

    // Not useful for application/octet-stream type
    if (newWindow) {
        window.open(dataURL);
        // To open in a new tab/window
    } else {
        window.location = dataURL;
    }

}; 
/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */
/*global ProtoUL */

Ext.define('ProtoUL.UI.MDSetFiltersController', {
    extend : 'Ext.Base',
    myMeta : null,

    constructor : function(config) {
        Ext.apply(this, config || {});
        this.getCustomOptsBar();
    },

    getCustomOptsBar : function() {

        var myFilters = [], 
            nFiltre, vDet, tmpF1, pFilters, 
            __MasterDetail = this.__MasterDetail, 
            tmpFilters = this.myMeta.gridSets.filtersSet.concat(this.myMeta.custom.filtersSet);

        // Si no hay filtros definidos pero existe un filterAlph,
        if ((tmpFilters.length === 0) && this.myMeta.gridConfig.filterSetABC) {

            for (nFiltre in _SM.objConv(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'])) {
                tmpF1 = {};
                tmpF1['property'] = this.myMeta.gridConfig.filterSetABC;
                tmpF1['filterStmt'] = '^' + nFiltre;
                tmpFilters.push({
                    name : nFiltre,
                    filter : [tmpF1]
                });
            }
            tmpFilters.push({
                name : ' *',
                filter : {}
            });

        }

        for (vDet in tmpFilters ) {
            pFilters = tmpFilters[vDet];
            myFilters.push(new Ext.Action({
                name : pFilters.name,
                text : pFilters.menuText || pFilters.name,
                iconCls : pFilters.icon,
                maxWidth : 100,
                protoFilter : pFilters.customFilter,
                scope : this,
                handler : onClickProtoFilter
            }));

        }

        if (myFilters.length > 0) {

            __MasterDetail.tbFilters = Ext.create('Ext.toolbar.Toolbar', {
                dock : 'top',
                hidden : true,
                enableOverflow : true,
                items : [{
                    xtype : 'tbtext',
                    text : '<strong>Filtrer par :</strong>'
                }]
            });

            __MasterDetail.tbFilters.add(myFilters);
            __MasterDetail.myFilters = myFilters;
            __MasterDetail.protoMasterGrid.addDocked(__MasterDetail.tbFilters);

        };

        function onClickProtoFilter(btn) {
            __MasterDetail.protoMasterGrid.filterTitle = ' " ' + btn.text + ' "';
            __MasterDetail.protoMasterGrid.setGridTitle(__MasterDetail.protoMasterGrid);
            __MasterDetail.mdGridLoadData(btn.protoFilter);
        };

    }
}); 
Ext.define('ProtoUL.UI.MDSetSortersController', {
    extend: 'Ext.Base',
    myMeta: null,
    constructor: function(config) {
        Ext.apply(this, config || {});
        this.getCustomOptsBar();
    },

    getCustomOptsBar: function() {

        // @formatter:off        
        var mySortersSet = [],  
            __MasterDetail = this.__MasterDetail, 
            tmpSorters = this.myMeta.gridSets.sortersSet.concat( this.myMeta.custom.sortersSet );
        // @formatter:on

        if (this.myMeta.gridConfig.initialSort && (tmpSorters.length > 0  )) {
            addSorters([{
                'name': 'Initial',
                'icon': 'soterIcon',
                'customSort': this.myMeta.gridConfig.initialSort
            }]);

            addSorters(tmpSorters);
        }

        if (mySortersSet.length > 0) {

            __MasterDetail.tbSortersSet = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden: true,
                enableOverflow: true,
                items: [{
                    xtype: 'tbtext',
                    text: '<strong>Sorters :</strong>'
                }]
            });

            __MasterDetail.tbSortersSet.add(mySortersSet);
            __MasterDetail.mySortersSet = mySortersSet;
            __MasterDetail.protoMasterGrid.addDocked(__MasterDetail.tbSortersSet);

        };

        function onClickSorter(btn) {
            __MasterDetail.protoMasterStore.sort(btn.sorter);
        }

        function addSorters(tmpSorters) {
            var Sorter;
            for (var vDet in tmpSorters ) {
                Sorter = tmpSorters[vDet];
                mySortersSet.push(new Ext.Action({
                    maxWidth: 100,
                    text: Sorter.name,
                    iconCls: Sorter.icon,
                    sorter: Sorter.customSort,
                    scope: this,
                    handler: onClickSorter
                }));
            };
        }

    }

});
Ext.define('ProtoUL.UI.MDSetTabsController', {
    extend: 'Ext.Base',
    myMeta: null,
    constructor: function(config) {
        Ext.apply(this, config || {});
        this.getCustomOptsBar();
    },

    getCustomOptsBar: function() {

        // @formatter:off
        var myTabs = [],  
            __MasterDetail = this.__MasterDetail,
            tmpTabs = this.myMeta.gridSets.listDisplaySet.concat( this.myMeta.custom.listDisplaySet );
        // @formatter:on

        if (tmpTabs.length > 0) {
            var tabConfig = _SM.defineTabConfig(this.myMeta.gridConfig);
            addTabs([tabConfig]);
            addTabs(tmpTabs);
        }

        if (myTabs.length > 0) {

            __MasterDetail.tbTabs = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden: true,
                enableOverflow: true,
                items: [{
                    xtype: 'tbtext',
                    text: '<strong>Tabs :</strong>'
                }]
            });

            __MasterDetail.tbTabs.add(myTabs);
            __MasterDetail.myTabs = myTabs;
            __MasterDetail.protoMasterGrid.addDocked(__MasterDetail.tbTabs);

        };

        function onClickTab(btn) {
            __MasterDetail.protoMasterGrid.configureColumns(btn.tabConfig);
        }

        function addTabs(tmpTabs) {
            var Tab;
            for (var vDet in tmpTabs ) {
                Tab = tmpTabs[vDet];

                var tabConfig = {
                    name: Tab.name,
                    listDisplay: Tab.listDisplay,
                    hideRowNumbers: Tab.hideRowNumbers || false
                };

                myTabs.push(new Ext.Action({
                    text: Tab.name,
                    iconCls: Tab.icon,
                    maxWidth: 100,
                    tabConfig: tabConfig,
                    scope: this,
                    handler: onClickTab
                }));
            };
        }

    }

});

_SM.defineTabConfig = function(gridConfig) {
    // define un tab a partir de la conf de la grilla
    return {
        name: 'Default',
        icon: 'colSetIcon',
        listDisplay: gridConfig.listDisplay,
        hideRowNumbers: gridConfig.hideRowNumbers || false
    };

};
Ext.define('ProtoUL.UI.MDTbSortByController', {
    extend: 'Ext.Base',
    myMeta: null,
    constructor: function(config) {
        Ext.apply(this, config || {});
        this.getSortersBar();
    },

    getSortersBar: function() {

        // @formatter:off
        var me = this,
            mySortCols = [],
            __MasterDetail = me.__MasterDetail;

        me.myFieldDict = __MasterDetail.protoMasterGrid.myFieldDict;

        // REcorre los q llegan y genera el obj  header, name
        for (var ix in me.myMeta.gridConfig.sortFields ) {
            var name = me.myMeta.gridConfig.sortFields[ix];
            var c = me.myFieldDict[name];
            if (!c) { 
                c = {
                    name: name,
                    header: name
                };
                }
            mySortCols.push({
                name: c.name,
                header: c.header
            });
        }

        // getAllSort

        // Crea la tabla
        if (mySortCols.length > 0) {

            // Reorder obj
            var reorderer = Ext.create('Ext.ux.BoxReorderer', {
                listeners: {
                    scope: me,
                    Drop: function(r, c, button) {//update sort direction when button is dropped
                        changeSortDirection(button, false);
                    }

                }
            });

            __MasterDetail.tbSorters = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden: true,
                items: [{
                    iconCls: 'sort',
                    xtype: 'tbtext',
                    text: '<strong>' + _SM.__language.Grid_Sort_Title + ':</strong>',
                    reorderable: false
                }],
                plugins: [reorderer]
            });

            for (var ix in mySortCols ) {

                // Verifica si la col existe
                var c = mySortCols[ix];
                var col = me.myFieldDict[name];
                if (!col) {
                    continue;
                }

                // Agrega el sort
                __MasterDetail.tbSorters.add(createSorterButtonConfig({
                    text: c.header,
                    tooltip: c.header,
                    maxWidth: 100,
                    sortData: {
                        property: c.name,
                        direction: 'ASC'
                    }
                }));
            }

            __MasterDetail.protoMasterGrid.addDocked(__MasterDetail.tbSorters);
            this.mySortCols = mySortCols;

        }

        /**
         * Convenience function for creating Toolbar Buttons that are tied to sorters
         * @param {Object} config Optional config object
         * @return {Object} The new Button configuration
         */
        function createSorterButtonConfig(config) {
            config = config || {};
            Ext.applyIf(config, {
                listeners: {
                    click: function(button, e) {
                        changeSortDirection(button, true);
                    }

                },
                iconCls: 'sort-' + config.sortData.direction.toLowerCase(),
                reorderable: true,
                xtype: 'button'
            });
            return config;
        }

        /**
         * Callback handler used when a sorter button is clicked or reordered
         * @param {Ext.Button} button The button that was clicked
         * @param {Boolean} changeDirection True to change direction (default). Set to false for reorder
         * operations as we wish to preserve ordering there
         */
        function changeSortDirection(button, changeDirection) {
            var sortData = button.sortData, iconCls = button.iconCls;

            if (sortData) {
                if (changeDirection !== false) {
                    button.sortData.direction = Ext.String.toggle(button.sortData.direction, "ASC", "DESC");
                    button.setIconCls(Ext.String.toggle(iconCls, "sort-asc", "sort-desc"));
                }
                doSort();
            }
        }

        function doSort() {
            __MasterDetail.protoMasterStore.myLoadData(null, getSorters());
        }

        /**
         * Returns an array of sortData from the sorter buttons
         * @return {Array} Ordered sort data from each of the sorter buttons
         */
        function getSorters() {

            var sorters = [];
            Ext.each(__MasterDetail.tbSorters.query('button'), function(button) {
                sorters.push(button.sortData);
            }, me);

            // Solo orderna por los 4 primeros criterios
            return sorters.slice(0, 3);
        }

    }

});
/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.UI.TbMasterDetail', {
    extend: 'Ext.Toolbar',
    alias: 'widget.tbMasterDetail',

    // isToolbar: true,
    // baseCls  : Ext.baseCSSPrefix + 'toolbar',

    autoEdit: true,

    initComponent: function() {

        var me = this, 
            myMeta = this.protoMeta, 
            __MasterDetail = this.__MasterDetail;

        //--------------------------------------------------------

        this.searchBG = Ext.create('ProtoUL.ux.ProtoSearchBG', {
            myMeta: myMeta
        });

        // La edicion se hara sobre el master si los detalles estan apagados,
        // si los detalles estan abiertos,  se bloqua el master y se editan detalles

        Ext.apply(this, {
            dock: 'top',
            defaults: {
                scope: me
            },
            items: [this.searchBG, {
                iconCls: 'icon-edit',
                itemId: 'edit',
                tooltip: _SM.__language.Grid_Edit_Ttip,
                text: _SM.__language.Grid_Edit_Title,
                hidden: true,
                handler: editOpts
            }, {
                text: _SM.__language.Text_Clasify_Button,
                tooltip: _SM.__language.Tooltip_Clasify_Button,
                iconCls: 'icon-order',
                itemId: 'sorters',
                hidden: true,
                enableToggle: true,
                handler: toogleTb2
            }, {
                xtype: 'splitbutton',
                text: _SM.__language.Text_Actions_Button,
                tooltip: _SM.__language.Tooltip_Actions_Button,
                iconCls: 'icon-action',
                itemId: 'protoActions',
                hidden: true,
                enableToggle: true,
                handler: toogleTb2,
                menu: Ext.create('Ext.menu.Menu', {})

            }, {
                xtype: 'splitbutton',
                text: _SM.__language.Grid_Detail_Title,
                tooltip: _SM.__language.Tooltip_Details_Button,
                iconCls: 'icon-details',
                itemId: 'details',
                hidden: true,
                enableToggle: true,
                handler: toogleTb2,
                menu: Ext.create('Ext.menu.Menu', {})
            }, {
                xtype: 'splitbutton',
                text: _SM.__language.Text_Filters_Button,
                tooltip: _SM.__language.Tooltip_Filters_Button,
                iconCls: 'icon-filters',
                itemId: 'filterSet',
                hidden: true,
                enableToggle: true,
                handler: toogleTb2,
                menu: Ext.create('Ext.menu.Menu', {})

            }, {
                xtype: 'splitbutton',
                text: _SM.__language.Text_Tabs_Button,
                tooltip: _SM.__language.Tooltip_Tabs_Button,
                iconCls: 'icon-tabs',
                itemId: 'tabSet',
                hidden: true,
                enableToggle: true,
                handler: toogleTb2,
                menu: Ext.create('Ext.menu.Menu', {})

            }, {
                xtype: 'splitbutton',
                text: _SM.__language.Text_Sorters_Button,
                tooltip: _SM.__language.Tooltip_Sorters_Button,
                iconCls: 'icon-sorters',
                itemId: 'sorterSet',
                hidden: true,
                enableToggle: true,
                handler: toogleTb2,
                menu: Ext.create('Ext.menu.Menu', {})

            }, {
                xtype: 'splitbutton',
                text: _SM.__language.Text_Print,
                tooltip: _SM.__language.Tooltip_Printing_Options,
                iconCls: 'icon-print',
                itemId: 'printerOpts',
                hidden: true,
                enableToggle: true,
                handler: toogleTb2,
                menu: Ext.create('Ext.menu.Menu', {})

            }, {
                xtype: 'splitbutton',
                text: _SM.__language.Text_Config,
                tooltip: _SM.__language.Tooltip_Config_Button,
                iconCls: 'icon-config',
                itemId: 'configOpts',
                hidden: true,
                enableToggle: true,
                handler: toogleTb2,
                menu: Ext.create('Ext.menu.Menu', {})

            }, '->', {
                iconCls: 'icon-editoff',
                itemId: 'editOff',
                text: _SM.__language.Text_Exit_Edit_Mode_Button,
                tooltip: _SM.__language.Tooltip_Exit_Edit_Mode_Button,
                hidden: true,
                handler: editOpts

            }, {
                xtype: 'splitbutton',
                iconCls: 'icon-help',
                handler: toogleTb2,
                itemId: 'tbHelp'
            }]

        });

        this.callParent();

        // Guarda los permisos
        me.perms = _SM._UserInfo.perms[this.protoMeta.viewCode];

        this.setEditMode(this.autoEdit);

        // permite la edicion
        // if ( _SM._UserInfo.isStaff ) {
        if (!me.autoEdit && (me.perms['add'] || me.perms['change'] || me.perms['delete'])) {
            this.getComponent('edit').setVisible(true);
        }

        //--------------------------------------------------------

        this.searchBG.on({
            qbeLoadData: {
                fn: function(tbar, sFilter, sTitle, sorter) {
                    __MasterDetail.mdGridLoadData(sFilter, sorter);
                    __MasterDetail.protoMasterGrid.filterTitle = sTitle;
                    __MasterDetail.protoMasterGrid.setGridTitle(__MasterDetail.protoMasterGrid);
                },
                scope: this
            }
        });

        // -----------------------------------------------------------

        function toogleTb2(but) {
            // 'details', 'printerOpts', 'sorters', 'tbHelp', 'filterSet',

            if (but.itemId === 'sorters') {
                if (__MasterDetail.tbSorters) {
                    __MasterDetail.tbSorters.setVisible(but.pressed);
                }

            } else if (but.itemId === 'filterSet') {
                if (__MasterDetail.tbFilters) {
                    __MasterDetail.tbFilters.setVisible(but.pressed);
                }

            } else if (but.itemId === 'tabSet') {
                if (__MasterDetail.tbTabs) {
                    __MasterDetail.tbTabs.setVisible(but.pressed);
                }

            } else if (but.itemId === 'sorterSet') {
                if (__MasterDetail.tbSortersSet) {
                    __MasterDetail.tbSortersSet.setVisible(but.pressed);
                }

            } else if (but.itemId === 'printerOpts') {
                if (__MasterDetail.tbPrinterOpts) {
                    __MasterDetail.tbPrinterOpts.setVisible(but.pressed);
                }

            } else if (but.itemId === 'configOpts') {
                if (__MasterDetail.tbConfigOpts) {
                    __MasterDetail.tbConfigOpts.setVisible(but.pressed);
                }

            } else if (but.itemId === 'details') {
                if (__MasterDetail.tbDetails) {
                    __MasterDetail.showDetailPanel(!but.pressed);
                }

            } else if (but.itemId === 'protoActions') {
                if (__MasterDetail.tbProtoActions) {
                    __MasterDetail.tbProtoActions.setVisible(but.pressed);
                }

                // } else if ( but.itemId == 'config' ) {
                // this.configCtrl.showMetaConfig()

            } else if (but.itemId === 'tbHelp') {
                window.open(_SM._HELPpath, 'protoHelp', 'left=50,top=20,width=1000,height=600,resizable=0,scrollbars=yes');
            }

        }

        // ------------------------------------------------------------------------------------------------

        function editOpts(but) {
            // 'edit', 'autoSync','editOff','save',

            if (but.itemId == 'edit') {
                // Evitar la edicion en detalles si no hay un registro seleccioando
                // if ( ! __MasterDetail.isDetailCollapsed() )
                // if ( ! _SM.validaSelected( __MasterDetail.protoMasterGrid.selected )) return

                me.setEditMode(true);

            } else if (but.itemId == 'editOff') {
                // __MasterDetail.cancelChanges()
                me.setEditMode(false);

                // } else if ( but.itemId == 'save' ) {
                // __MasterDetail.saveChanges()
                // me.setEditMode( false  )
                // } else if ( but.itemId == 'saveDraft' ) {
                // __MasterDetail.saveChanges()
                // } else if ( but.itemId == 'autoSync' ) {
                // __MasterDetail.saveChanges()
                // me.setAutoSync( but.pressed )
            }
        }

    },

    setAutoSync: function(autoSync) {
        // this.getComponent('saveDraft').setDisabled( autoSync );
        // this.getComponent('autoSync').toggle( autoSync, true  );
        // this.__MasterDetail.setAutoSync ( autoSync );
    },

    setEditMode: function(bEdit) {

        // if ( ! _SM._UserInfo.isStaff  ) return
        var me = this;
        if (!(me.perms['add'] || me.perms['change'] || me.perms['delete'] )) {
            return;
        }

        // En modoEdicion los botones de accion son desactivados y los  edicion son apagados
        Ext.suspendLayouts();

        // 'edit', 'editOff', 'save', 'autoSync'
        if (!this.autoEdit) {

        this.getComponent('edit').setVisible(!bEdit);
        this.getComponent('editOff').setVisible(bEdit);

        this.searchBG.setVisible(!bEdit);

        // --------------------- 'details', 'printerOpts', 'sorters', 'tbHelp', 'filterSet',
        setMdButton(this, 'printerOpts', bEdit);
        setMdButton(this, 'configOpts', bEdit);
        setMdButton(this, 'sorters', bEdit);
        setMdButton(this, 'filterSet', bEdit);
        setMdButton(this, 'protoActions', bEdit);
        setMdButton(this, 'sorterSet', bEdit);

        }

        // DGT 1303 Con el autosync, se permite la edicion en todos los objetos
        // this.setAutoSync( this.__MasterDetail.autoSync )
        // setMdButton( this, 'tabSet', bEdit );
        // setMdButton( this, 'details', bEdit );

        var autoSync = this.__MasterDetail.autoSync;
        this.__MasterDetail.setEditMode(bEdit);

        function setMdButton(me, btId, bEdit) {
            var bt = me.getComponent(btId);
            bt.setVisible((!bEdit ) && (bt.protoEnable ));
        }

        Ext.resumeLayouts(true);

    },

    addActions: function() {

        // Permite agregar las acciones despues de haber configurado el MD
        // bt.protoEnable  indica si el boton es valido en esta instancia

        if (this.__MasterDetail.myDetails) {
            var bt = this.getComponent('details');
            bt.menu.add(this.__MasterDetail.myDetails);
            bt.protoEnable = true;
            bt.show();
        }

        if (this.__MasterDetail.myFilters) {
            var bt = this.getComponent('filterSet');
            bt.menu.add(this.__MasterDetail.myFilters);
            bt.protoEnable = true;
            bt.show();
        }

        if (this.__MasterDetail.myPrinterOpts) {
            var bt = this.getComponent('printerOpts');
            bt.menu.add(this.__MasterDetail.myPrinterOpts);
            bt.protoEnable = true;
            bt.show();
        }

        if (this.__MasterDetail.myConfigOpts) {
            var bt = this.getComponent('configOpts');
            bt.menu.add(this.__MasterDetail.myConfigOpts);
            bt.protoEnable = true;
            bt.show();
        }

        if (this.__MasterDetail.myProtoActions) {
            var bt = this.getComponent('protoActions');
            bt.menu.add(this.__MasterDetail.myProtoActions);
            bt.protoEnable = true;
            bt.show();
        }

        if (this.__MasterDetail.tbSorters) {
            var bt = this.getComponent('sorters');
            bt.protoEnable = true;
            bt.show();
        }

        if (this.__MasterDetail.myTabs) {
            var bt = this.getComponent('tabSet');
            bt.menu.add(this.__MasterDetail.myTabs);
            bt.protoEnable = true;
            bt.show();
        }

        if (this.__MasterDetail.mySortersSet) {
            var bt = this.getComponent('sorterSet');
            bt.menu.add(this.__MasterDetail.mySortersSet);
            bt.protoEnable = true;
            bt.show();
        }
    }
}); 

/*
 * Author: Dario Gomez . CERTAE - ULaval
 * Copyright 2012,
 *
 License: This source is licensed under the terms of the Open Source LGPL 3.0 license.
 Commercial use is permitted to the extent that the code/component(s) do NOT become
 part of another Open Source or Commercially licensed development library or toolkit
 without explicit permission.Full text: http://www.opensource.org/licenses/lgpl-3.0.html

 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext, _SM  */
/*global Meta2Tree, Tree2Meta */


Ext.define('ProtoUL.proto.ProtoDesigner', {
    // extend: 'Ext.panel.Panel',
    extend : 'Ext.container.Container',
    alias : 'widget.protoDesigner',

    //@myMeta
    myMeta : null,

    initComponent : function() {

        var me = this;

        Ext.apply(this, {
            layout : 'border',
            defaults : {
                lauyout : 'fit'
            },
            items : this.getPanelItems()
        });

        me.callParent(arguments);

        // Opciones del llamado AJAX
        myObj = _SM.DesignerPanels;

        // Defincion de los objetos del designer
        this.doFormatLayout(myObj);

        // Definicion del arbol basado en la meta
        this.updateFormTree();

    },

    updateFormTree : function() {
        // Genera el arbol a partir de la meta
        var treeData = Meta2Tree(this.myMeta.formConfig, 'formConfig', 'formConfig');
        treeData.expanded = true;

        this.formTree.getStore().setRootNode(treeData);

    },

    onClickRedraw : function(myObj) {

        var formMeta, myForm;

        this.formPreview.removeAll(true);

        formMeta = Tree2Meta(this.formTree.store.getRootNode());
        this.myMeta.formConfig = formMeta;
        this.formController.myMeta.formConfig = formMeta;

        myForm = this.formController.newProtoForm();
        myForm.setFormReadOnly(true);
        this.formPreview.add(myForm);

    },

    doFormatLayout : function(myObj) {

        var me = this, ix, myForm, vNod, propsGrid;

        this.toolsPanel = me.down('#toolsPanel');
        this.toolsTabs = me.down('#toolsTabs');
        this.formTree = me.down('#formTree');
        this.formPreview = me.down('#formPreview');

        this.formController = Ext.create('ProtoUL.UI.FormController', {
            myMeta : me.myMeta
        });

        myForm = this.formController.newProtoForm();

        //      -------------  Nested functions
        function getTreeNodeByText(treeData, textKey) {
            // recupera un nodo del arbol segun su texto, para los fields y los details
            for (ix in treeData ) {
                vNod = treeData[ix];
                if (vNod.text == textKey) {
                    return vNod;
                }
            }
            // No deberia nunca llegar aqui
            return {};
        }

        //      --------------- function body

        myForm.setFormReadOnly(true);
        this.formPreview.add(myForm);

        this.tBar = this.toolsPanel.addDocked({
        xtype : 'toolbar',
        dock : 'top',
        items : myObj.tbar
        })[0];

        this.toolsTabs.add(myObj.toolsTabs);
        this.toolsTree = this.toolsTabs.down('#toolsTree');

        // *******************   Properties

        var propsGrid = Ext.create('ProtoUL.ux.ProtoProperty', {});
        this.properties = this.toolsTabs.down('#properties');
        this.properties.add(propsGrid);
        this.properties = propsGrid;

        propsGrid.on({
            'edit' : function(editor, e, eOpts) {

                if (e.value == e.originalValue) {
                    return;
                }

                var oData = me.treeRecord.data.__ptConfig, prpName = e.record.data.name;

                // ****  Solo llegan objetos, los Array se manejan en otro lado
                if (_SM.typeOf(oData) == "object") {
                    oData[prpName] = e.value;
                }

                me.onClickRedraw();
            },
            scope : me
        });

        /* Se podrian cargar directamente desde el json, dejando un hook en el store y asignandolo
         * antes de crear el componente.
         */

        _SM.defineProtoPclTreeModel();

        var treeData, treeNodAux, treeNodAuxData, ptConfig, vFld;

        treeData = _SM.clone(myObj.toolsTree);
        
        // Agrega los campos de la pci particular
        treeNodAux = getTreeNodeByText(treeData, 'Fields');
        for (ix in this.myMeta.fields ) {
            vFld = this.myMeta.fields[ix];
            ptConfig = _SM.getFormFieldDefinition(vFld);
            ptConfig['name'] = vFld.name;
            treeNodAuxData = {
                "text" : vFld.name,
                "qtip" : vFld.cellToolTip,
                "__ptType" : "formField",
                "leaf" : true,
                "__ptConfig" : ptConfig
            };
            treeNodAux.children.push(treeNodAuxData);
        };

        // FutureUse : Dont delete  ( dgt )
        // "masterField" : vFld.masterField,
        // "detailField" : vFld.detailField,
        // "detailTitleLbl" : vFld.detailTitleLbl,
        // "detailTitleField" : vFld.detailTitleField,
        // "masterTitleField" : vFld.masterTitleField,

        // Agrega los detalles
        treeNodAux = getTreeNodeByText(treeData, 'Details');
        for (ix in this.myMeta.detailsConfig ) {
            vFld = this.myMeta.detailsConfig[ix];
            treeNodAuxData = {
                "text" : vFld.menuText,
                "qtip" : vFld.toolTip,
                "__ptType" : "protoGrid",
                "leaf" : true,
                "__ptConfig" : {
                    "menuText" : vFld.menuText,
                    "viewCode" : vFld.conceptDetail,
                    "xtype" : "protoGrid",
                    "__ptType" : "protoGrid"
                }
            };
            treeNodAux.children.push(treeNodAuxData);
        }

        treeNodAux = getTreeNodeByText(treeData, 'DetailsButtons');
        for (ix in this.myMeta.detailsConfig ) {
            vFld = this.myMeta.detailsConfig[ix];
            treeNodAuxData = {
                "text" : vFld.menuText,
                "qtip" : vFld.toolTip,
                "__ptType" : "detailButton",
                "leaf" : true,
                "__ptConfig" : {
                    "text" : vFld.menuText,
                    "viewCode" : vFld.conceptDetail,
                    "xtype" : "detailButton",
                    "__ptType" : "detailButton"
                }
            };
            treeNodAux.children.push(treeNodAuxData);
        }

        //  -----------------------------------
        // Crea el store
        var treeStore, toolsTree, formTree, formTreeView;

        treeStore = Ext.create('Ext.data.TreeStore', {
            model : 'Proto.PclTreeNode',
            root : {
                expanded : true,
                children : treeData
            }
        });

        toolsTree = Ext.create('Ext.tree.Panel', {
            layout : 'fit',
            itemId : 'baseTree',
            store : treeStore,
            // autoScroll : true,
            rootVisible : false,
            viewConfig : {
                plugins : {
                    ptype : 'treeviewdragdrop',
                    enableDrop : false
                }
            }
        });

        this.toolsTree.add(toolsTree);
        this.toolsTree = toolsTree;

        // ------------------------------------------------

        treeStore = Ext.create('Ext.data.TreeStore', {
            model : 'Proto.PclTreeNode',
            root : {
                expanded : true,
                text : _SM.__language.Title_Main_Panel,
                children : []
            }
        });

        formTree = Ext.create('Ext.tree.Panel', {
            layout : 'fit',
            store : treeStore,
            autoScroll : true,
            rootVisible : true,
            viewConfig : {
                plugins : {
                    ptype : 'treeviewdragdrop'
                }
            }
        });

        this.formTree.add(formTree);
        this.formTree = formTree;

        // ------------------------------------------------
        var rec, ptType, nParent, nIndex, tNode;

        formTreeView = this.formTree.getView();
        this.formTreeViewId = formTreeView.id;

        formTreeView.on({
            'beforedrop' : {
                fn : function(node, data, overModel, dropPosition, dropHandler, eOpts) {

                    // Verifica q el objeto sea valido ( no puede copiar las categorias ni los items  )
                    if (data.view.id != this.formTreeViewId) {
                        rec = data.records[0];
                        ptType = rec.get('text');
                        if ( ptType in _SM.objConv(['Fields', 'Containers', 'Grids'])) {
                            return false;
                        }

                        if ( ptType in _SM.objConv(['htmlset', 'fieldset'])) {

                            // Obtiene el padre y el ix
                            nParent = overModel.store.getById(overModel.data.parentId);
                            nIndex = overModel.data.index;

                            if (!nParent) {
                                nParent = overModel;
                            }

                            if (dropPosition == 'after') {
                                nIndex += 1;
                            }

                            dropHandler.cancelDrop();

                            // Crea un nodo
                            tNode = getNodeBase(ptType, ptType, {
                                '__ptType' : ptType
                            });
                            nParent.insertChild(nIndex, tNode);

                        }

                        // El drop genera una copia del mismo registro siempre
                        data.copy = true;
                    }

                }
            },
            'drop' : {
                fn : function() {
                    this.onClickRedraw();
                }
            },

            scope : this
        });

        this.formTree.on({
            'select' : function(rowModel, record, rowIndex, eOpts) {
                // Guarda el registro actico, para actualizarlo mas tarde
                me.treeRecord = record;

                // prepara las propiedades corresponidnetes,
                // debe cpia las props por defecto de la pcl
                prepareProperties(record, me.myMeta, me.properties);
            },
            scope : me
        });

        // Para manejar los botones dinamicamente addListener

        // EL wizzard utiliza Ext.element.loader para cargar dinamicamenta la definicion a partir de una URL
        // la URL ya probe q puede ser un archivo json,

        // revisar en el ejemplo como usar  jsonForm y jsonPropertyGrid   codepress
        var btRedraw = this.tBar.down('#redraw');
        btRedraw.on('click', function(btn, event, eOpts) {
            this.onClickRedraw()
        }, me);

        var btSave = this.tBar.down('#save');
        btSave.on('click', function(btn, event, eOpts) {

            var formMeta = Tree2Meta(this.formTree.store.getRootNode());
            this.myMeta.formConfig = formMeta;

            _SM.savePclCache(this.myMeta.viewCode, this.myMeta, true);
            _SM.savePci(this.myMeta);
        }, me);

        var btDel = this.tBar.down('#delete');
        btDel.on('click', function(btn, event, eOpts) {
            // var ptType = me.treeRecord.data.__ptType
            me.treeRecord.remove();
        }, me);

    },

    //  ==============================================================================

    getPanelItems : function() {

        // this.myForm = Ext.widget('protoform', {
        // myMeta : this.myMeta
        // });

        return [{
            region : 'center',
            layout : 'fit',
            itemId : 'formPreview',
            // items : this.myForm,
            // autoScroll : true,
            flex : 2,
            minSize : 200
        }, {
            region : 'west',
            collapsible : true,
            split : true,
            flex : 1,
            title : _SM.__language.Title_Form_Panel,
            itemId : 'toolsPanel',
            layout : 'border',
            defaults : {
                lauyout : 'fit'
            },
            items : [{
                region : 'center',
                layout : 'fit',
                itemId : 'formTree',
                autoScroll : true,
                minHeight : 150
            }, {
                region : 'south',
                layout : 'fit',
                itemId : 'toolsTabs',
                collapsible : true,
                split : true,
                flex : 1,
                title : _SM.__language.Title_Panel_Tools
            }]
        }]; 

    }
});

/*
 * ProtoDetailSelector,  Selecciona los detalles posibles
 *
 * 1.  presentar el arbol de campos para seleccionar los detalles
 *
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */


Ext.define('ProtoUL.proto.ProtoDetailSelector', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.detailsSelector',

// Contenedor para probar el arbol de detalles

// @viewCode   Required
    viewCode : null,

 // @myMeta   Required
    myMeta : null,

    initComponent: function() {

        var me = this;
        var tBar =  Ext.create( 'ProtoUL.proto.ProtoToolBar', {dock : 'top'})

        var elemTree = Ext.create('ProtoUL.proto.ProtoDetailTree', {
            viewCode : me.viewCode,
            myMeta : me.myMeta
           })


        var elemList = Ext.create('ProtoUL.ux.ProtoList', {
            checkStyle : false,
            idTitle: 'SelectedDetails'
        })


        // ----------------------------------------------------------------------------

        elemTree.on({
            'loadComplete': function (  treeStore, records,  successful,  eOpts ) {
                configureCurrentDetails()
            },
            'checkModif': function (  node,  checked,  eOpts ) {
                var idx = node.get( 'id' )
                elemList.addOrRemove ( idx, checked  )
            },
            scope: me }
        );


        tBar.on({
            'preview': function () {
                savePreview()
            },
            'save': function () {
                savePreview();
                _SM.savePclCache( me.myMeta.viewCode, me.myMeta, true )
                _SM.savePci( me.myMeta )
            },
            scope: me }
        );


        // ----------------------------------------------------------------------------

        var panelItems = getSelectorsPanels( elemTree, elemList  )

        Ext.apply(this, {
            layout: 'border',
            items: panelItems,
            dockedItems: [ tBar ]
        });

        this.callParent(arguments);

        function configureCurrentDetails() {

            // Crea los campos activos en la grilla
            for (var ix in me.myMeta.detailsConfig ) {
                var vFld  =  me.myMeta.detailsConfig[ix];
                elemList.addDataItem ( vFld.menuText, true  )
            }
        }


        function savePreview() {

            var names = elemList.getList(),
                detail = {},
                details = []

            for (var ix in names  ) {

                detail = getExistingDetail( names[ix] )
                if ( ! detail ) {
                    detail = getDefaultDetail( names[ix] )
                }
                if ( detail ) {
                    details.push( detail )
                } else {
                    /* console.log( "Detalle no encontrado", names[ix]  ) */
                }

            }

            // Actualiza los nuevos detalles
            me.myMeta.detailsConfig = details

            function getExistingDetail( name  ) {
                for (var ix in me.myMeta.detailsConfig ) {
                    var vFld  =  me.myMeta.detailsConfig[ix];
                    if ( vFld.menuText == name ) {
                        return vFld
                        break ;
                    }
                }
            }

            function getDefaultDetail( name  ) {

                var rec =  elemTree.treeStore.getNodeById( name );
                return  {
                    menuText : rec.get( 'id' ),
                    conceptDetail :  rec.get( 'conceptDetail' ),
                    masterField :  "pk" ,
                    detailField :  rec.get( 'detailField' )
                    // detailTitleLbl :   rec.get( 'detailTitleLbl' ),
                    // detailTitlePattern :  rec.get( 'detailTitlePattern' )
                }
            }
        }
    }


});


/*
 * Lectura del arbol de detalles
 *
 */

Ext.define('ProtoUL.proto.ProtoDetailTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.detailDefTree',


 // @viewCode   Required
    viewCode : null,

//  @myMeta   Required
    myMeta : null,

    initComponent: function() {

        var me = this;
        me.addEvents('checkModif', 'loadComplete');

        definieDetailsConfigTreeModel( me.viewCode, me.myMeta.protoEntityId  );

        this.treeStore = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            model: 'Proto.DetailsTreeModel',
            root: {
                text: _SM.__language.Grid_Detail_Title,
                expanded: true
            },

            listeners: {
                load: function ( treeStore, records,  successful,  eOpts ) {
                    configureCurrentDetails()
                    me.fireEvent('loadComplete', treeStore, records,  successful,  eOpts );
                }
            }

        });

        var tree = Ext.apply(this, {
            store: this.treeStore,
            useArrows: true,
            rootVisible: false ,
            minWidth: 400,

            columns: [{
                xtype: 'treecolumn', //this is so we know which column will show the tree
                text: _SM.__language.Tree_Concept_Details_Text,
                flex: 2,
                sortable: true,
                minWidth: 200,
                dataIndex: 'id'
            },{
                text: _SM.__language.Tree_Concept_Details_Detail,
                dataIndex: 'conceptDetail'
            },{
                flex: 2,
                text: _SM.__language.Tree_Details_Field,
                dataIndex: 'detailField'
            }]

        })

        tree.on({
            'checkchange': {fn: function (  node,  checked,  eOpts ) {
                me.fireEvent('checkModif', node,  checked,  eOpts );
            }}, scope: me }
        );

        me.callParent(arguments);

        function configureCurrentDetails() {


            // Recorre el store y marca los campos activos
            // me.getView().getStore().each(function(record){
            me.getRootNode().cascadeBy(function(record){

                var lRec = {
                    'conceptDetail'  : record.get('conceptDetail' ),
                    'detailField' : record.get('detailField' )
                    }

                // Evita iterar en el root
                if ( lRec.conceptDetail )  {

                    // Marca los campos activos en la grilla
                    for (var ix in me.myMeta.detailsConfig ) {
                        var vFld  =  me.myMeta.detailsConfig[ix];

                        if (( vFld.conceptDetail == lRec.conceptDetail ) && ( vFld.detailField == lRec.detailField )) {
                            record.set( 'checked', true )

                            // Agrega los campos personalisados
                            record.set( 'id', vFld.menuText )
                            // record.set( 'detailTitleLbl', vFld.detailTitleLbl )
                            // record.set( 'detailTitlePattern', vFld.detailTitlePattern )

                            break;
                        }
                    }
                }
             })
        }

        function definieDetailsConfigTreeModel( viewCode , protoEntityId) {
            // Modelo usado en la lista de campos con la jerarquia completa de los de zoom ( detalle de fk )

            Ext.define('Proto.DetailsTreeModel', {
                extend: 'Ext.data.Model',
                proxy: {
                    type: 'ajax',
                    url: _SM._PConfig.urlGetDetailsTree ,
                    actionMethods: { read : 'POST' },
                    extraParams : {
                        viewCode : viewCode,
                        protoEntityId : protoEntityId
                    }
                },

                fields: [
                    {name: 'id', type: 'string'},
                    {name: 'menuText', type: 'string'},
                    {name: 'masterField', type: 'string'},
                    {name: 'detailField', type: 'string'},
                    {name: 'conceptDetail', type: 'string'},

                    {name: 'checked', type: 'boolean'},
                    {name: 'leaf', type: 'boolean'}
                ]

            });

        }
    }

});




/*
 * ProtoFieldSelector,  Primer paso para crear la pcl, seleccionar loscampos
 *
 * 1.  presentar el arbol de campos para seleccionar los fields  ( Solo en la configuracion de fields )
 * 2.  presentar los campos disponibles como una lista de campos a seleccionar, por ejemplo, en listDiplay, order by,  etc,
 *
 * Los campos UDP se agregan directamente a la lista(2).
 *
 */

Ext.define('ProtoUL.proto.ProtoFieldSelector', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.protoFieldSelector',

 // @viewCode   Required
    viewCode : null,

 // @myMeta   Required
    myMeta : null,

    initComponent: function() {

        me = this;

        var tBar =  Ext.create( 'ProtoUL.proto.ProtoToolBar', {dock : 'top'})
        tBar.setButton( 'add', true, true, 'add UDP' )


        var elemTree = Ext.create('ProtoUL.proto.ProtoFieldTree', {
            viewCode : me.viewCode,
            myMeta : me.myMeta
           })

        var elemList = Ext.create('ProtoUL.ux.ProtoList', {
            checkStyle : false,
            idTitle: 'SelectedFields'
        })


//      --------------------------------------------------

        elemTree.on({
            'loadComplete': function (  treeStore, records,  successful,  eOpts ) {
                configureCurrentFields();
            },
            'checkModif': function (  node,  checked,  eOpts ) {
                var idx = node.get( 'id' );
                elemList.addOrRemove ( idx, checked  );
            },
            scope: me }
        );


        tBar.on({
            'preview': function () {
                savePreview();
            },
            'save': function () {
                savePreview();

                _SM.savePclCache( me.myMeta.viewCode, me.myMeta, true );
                _SM.savePci( me.myMeta );
            },
            'add': function () {

                var msg = _SM.__language.Msg_Window_New_Folder;
                Ext.Msg.prompt(_SM.__language.MetaConfig_Add_Fields, msg, function (btn, pName) {
                    if (btn != 'ok') {
                        return;
                    }
                    elemTree.addUdpField( {'name' : pName , 'checked' : false } );

                }, me, false , 'udp__');

            },
            scope: me }
        );



//      ----------------------------------------------------

        var panelItems = getSelectorsPanels( elemTree, elemList  );

        Ext.apply(this, {
            layout: 'border',
            items: panelItems,
            dockedItems: [ tBar ]
        });

        this.callParent(arguments);


        function configureCurrentFields() {

            // Crea los campos activos en la grilla
            for (var ix in me.myMeta.fields ) {
                var vFld  =  me.myMeta.fields[ix];

                elemList.addDataItem ( vFld.name, true  );

                // Lo marca o lo adiciona como UDP
                var vNode =  elemTree.treeStore.getNodeById( vFld.name );
                if ( vNode ) {
                    vNode.set( 'checked', true );
                } else {
                    vFld.checked = true;
                    elemTree.addUdpField( vFld );
                }
            }
        }


        function savePreview() {

            var myFieldDict = _SM.getFieldDict( me.myMeta ), 
                names = elemList.getList(),
                field = {},
                fields = [];

            for (var ix in names  ) {

                field = myFieldDict[names[ix]];
                if ( ! field ) {
                    field = getDefaultField( names[ix] );
                }
                if ( field ) {
                    fields.push( _SM.clearProps( field ));
//                  console.log( "Field no encontrado", names[ix]  )
                }
            }

            // Actualiza los nuevos campos
            me.myMeta.fields = fields;

            function getDefaultField( name  ) {

                var rec =  elemTree.treeStore.getNodeById( name );
                return  {
                    name : rec.get( 'id' ),

                    type :  rec.get( 'type' ),
                    readOnly :  rec.get( 'readOnly' ),
                    required :  rec.get( 'required' ),
                    tooltip :  rec.get( 'tooltip' ),
                    header :  rec.get( 'header' ),

                    cpFromZoom :  rec.get( 'cpFromZoom' ),
                    cpFromField :  rec.get( 'cpFromField' ),

                    zoomModel :  rec.get( 'zoomModel' ),
                    fkField :  rec.get( 'fkField' ),
                    fkId :  rec.get( 'fkId' ),
                    vType :  rec.get( 'vType' ),
                    prpDefault :  rec.get( 'prpDefault' ),
                    choices :  rec.get( 'choices' )
                };
            }
        }
    }

});


/*
 * Lectura del arbol de campos ( todos los lockup )
 *
 */

Ext.define('ProtoUL.proto.ProtoFieldTree', {
    extend :  'Ext.tree.Panel',
    alias:    'widget.protoFieldTree',


 // @viewCode   Required
    viewCode : null,

//  @myMeta   Required
    myMeta : null,

    initComponent: function() {

        me = this;
        me.addEvents('checkModif', 'loadComplete');

        definieProtoFieldSelctionModel( me.viewCode, me.myMeta.protoEntityId )

        this.treeStore = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            folderSort: false,
            sorters: [{ property: 'text', direction: 'ASC' }],

            model: 'Proto.FieldSelectionModel',
            root: {
                text: _SM.__language.Protofield_Fields,
                expanded: true
            },

            listeners: {
                load: function ( treeStore, records,  successful,  eOpts ) {
                    me.fireEvent('loadComplete', treeStore, records,  successful,  eOpts );
                }
            }

        });

        var tree = Ext.apply(this, {
            store: this.treeStore,
            useArrows: true,
            rootVisible: false ,
            minWidth: 400,

            columns: [{
                xtype: 'treecolumn', //this is so we know which column will show the tree
                text: _SM.__language.Protofield_Text,
                flex: 2,
                sortable: true,
                minWidth: 200,
                dataIndex: 'text'
            },{
                xtype: 'booleancolumn',
                trueText: 'req',
                falseText: '',
                width: 50,
                text: _SM.__language.Protofield_Req,
                dataIndex: 'required'
            },{
                xtype: 'booleancolumn',
                trueText: 'rOnly',
                width: 50,
                falseText: '',
                text: _SM.__language.Protofield_ROnly,
                dataIndex: 'readOnly'
            },{
                text: _SM.__language.Protofield_Field_Type,
                dataIndex: 'type'
            },{
                text: _SM.__language.Protofield_Zoom_Model,
                dataIndex: 'zoomModel'
            },{
                text: _SM.__language.Protofield_fk_Field,
                dataIndex: 'fkField'
            },{
                text: _SM.__language.Protofield_fk_Id,
                dataIndex: 'fkId'
            },{
                flex: 2,
                text: _SM.__language.Protofield_Ix,
                dataIndex: 'id'

            },{
                flex: 2,
                text: 'cpFromZoom',
                dataIndex: 'cpFromZoom'
            },{
                flex: 2,
                text: 'cpFromField',
                dataIndex: 'cpFromField'

            },{
                hidden : true,
                text: _SM.__language.Protofield_Header,
                dataIndex: 'header'
            },{
                hidden : true,
                text: _SM.__language.Protofield_Tooltip,
                dataIndex: 'tooltip'
            },{
                hidden : true,
                text: _SM.__language.Protofield_Default_Value,
                dataIndex: 'prpDefault'
            },{
                hidden : true,
                text: _SM.__language.Protofield_vType,
                dataIndex: 'vType'
            },{
                hidden : true,
                text: _SM.__language.Protofield_choices,
                dataIndex: 'choices'
            }]

        })

        tree.on({
            'checkchange': {fn: function (  node,  checked,  eOpts ) {
                me.fireEvent('checkModif', node,  checked,  eOpts );
            }}, scope: me }
        );

        me.callParent(arguments);


        function definieProtoFieldSelctionModel( viewCode, protoEntityId ) {

            // Modelo usado en la lista de campos con la jerarquia completa de los de zoom ( detalle de fk )

            Ext.define('Proto.FieldSelectionModel', {
                extend: 'Ext.data.Model',
                proxy: {
                    type: 'ajax',
                    url: _SM._PConfig.urlGetFieldTree ,
                    actionMethods: { read : 'POST' },
                    extraParams : {
                        viewCode : viewCode,
                        protoEntityId : protoEntityId
                    }
                },

                fields: [
        //         Contiene el nombre en notacion objeto ( django )
                    {name: 'id', type: 'string'},

        //         Contiene el nombre del campo dentro del modelo
                    {name: 'text', type: 'string'},
                    {name: 'type', type: 'string'},

                    {name: 'readOnly', type: 'boolean'},
                    {name: 'required', type: 'boolean'},
                    {name: 'tooltip', type: 'string'},
                    {name: 'header', type: 'string'},

                    {name: 'zoomModel', type: 'string'},
                    {name: 'fkField', type: 'string'},
                    {name: 'fkId', type: 'string'},
                    {name: 'vType', type: 'string'},
                    {name: 'prpDefault', type: 'string'},
                    {name: 'choices', type: 'string'},

                    {name: 'cpFromZoom', type: 'string'},
                    {name: 'cpFromField', type: 'string'},

                    {name: 'checked', type: 'boolean'},
                    {name: 'leaf', type: 'boolean'}
                ]

            });

        }

    },


    addUdpField:  function( vFld ) {

          // No lo encontro, lo agrega
        tNode = {
            'id'         : vFld.name,
            'text'       : vFld.name,
            'type'       : 'udp',
            'checked'    : vFld.checked,
            'required'   : false,
            'leaf'       : true
        }

        this.getRootNode().appendChild( tNode )

    }


    // getCheckedList: function () {
        // var records = this.getView().getChecked(),
            // names = [];
        // Ext.Array.each(records, function(rec){
            // names.push(rec.get('id'));
        // });
        // return names
    // }


});
/*
 *  Proto Code Library    ( PCL )
 *
 *  Edicion de la plc
 *  Esta forma sera invocada desde la pcl o desde el respositorio de pcls ( ProtoLib.ProtoDefinition )
 *    Por lo tanto la Pcl ya viene dada,
 *
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.proto.ProtoPcl', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.protoPcl',
    /*
     * @Required
     * myMeta  : Metadata
     */
    myMeta: null,
    myFieldDict: null,

    /*
     * editable : False is ReadOnly
     */
    editable: true,

    initComponent: function() {

        var me = this, tBar, sbar, treeData, treeGridStore, treeGrid;

        if (!this.myMeta) {
            _SM.__StBar.showError('not loaded???', 'protoPcl.init');
            return;
        }

        this.myFieldDict = _SM.getFieldDict(this.myMeta);

        // Guarda el viewCode Oritginal ( asegura una copia )
        me.decodeViewName(me);

        _SM.defineProtoPclTreeModel();

        tBar = Ext.create('ProtoUL.proto.ProtoToolBar', {
            dock: 'top'
        });
        sbar = Ext.create('Ext.form.Label', {
            text: _SM.__language.ProtoPcl_Edition_Tool
        });

        treeData = getTreeData(me);
        treeGridStore = Ext.create('Ext.data.TreeStore', {
            model: 'Proto.PclTreeNode',
            root: treeData
        });

        this.treeGridStore = treeGridStore;

        treeGrid = Ext.create('Ext.tree.Panel', {
            store: treeGridStore,
            sortableColumns: false,
            useArrows: true,
            rootVisible: true,
            multiSelect: false,
            singleExpand: true,
            stripeRows: true,
            rowLines: true,

            columns: [{
                xtype: 'treecolumn', //this is so we know which column will show the tree
                text: 'text',
                flex: 3,
                dataIndex: 'text'
                // },{
                // text: 'Ix',
                // dataIndex: 'id'
            }, {
                text: '__ptType',
                dataIndex: '__ptType'
            }],
            listeners: {
                'itemmouseenter': function(view, record, item) {
                    Ext.fly(item).set({
                        'data-qtip': getAttrMsg(record.data.text),
                        'data-qtitle': record.data.text
                    });
                },
                scope: me
            }

        });

        this.treeGrid = treeGrid;

        var propsGrid, fieldList, jsonText, panelItems;

        propsGrid = Ext.create('ProtoUL.ux.ProtoProperty', {
            source: {
                name: ''
            }
        });
        fieldList = Ext.create('ProtoUL.ux.ProtoList', {
            idTitle: 'SelectedFields'
        });

        jsonText = Ext.create('Ext.form.TextArea', {
            autoScroll: true,
            labelAlign: 'top'
        });

        //  ================================================================================================

        panelItems = [{
            region: 'center',
            flex: 3,
            layout: 'fit',
            minSize: 50,
            items: treeGrid,
            border: false
        }, {
            region: 'east',
            collapsible: false,
            split: true,
            flex: 2,
            layout: 'fit',
            minSize: 200,
            items: [propsGrid, fieldList, jsonText],
            border: false
        }];

        Ext.apply(this, {
            layout: 'border',
            items: panelItems,
            dockedItems: [tBar],
            bbar: [sbar]
        });

        this.callParent(arguments);

        fieldList.hide();
        jsonText.hide();

        // ----------------------------------------------------------------------------------------------

        tBar.on({
            'save': function() {
                me.save(me);
            },
            'reload': function() {
                me.cancelChanges();
            },
            'cancel': function() {
                me.cancelChanges();
            },
            'show1': function() {
                _SM.showConfig('Meta', me.myMeta);
            },
            'add': function(record) {
                addTreeNode(record);
            },
            'del': function(record) {
                delTreeNode(record);
            },
            scope: this
        });

        treeGrid.on({
            'select': function(rowModel, record, rowIndex, eOpts) {

                saveJsonText();
                saveFieldList();

                me.treeRecord = record;
                preparePropertiesPCL(record);
            },
            scope: me
        });

        propsGrid.on({
            'beforeedit': {
                fn: function(editor, e, eOpts) {
                    if (me.editable === false) {
                        return false;
                    }

                }

            },

            // Fires after a editing. ...
            'edit': {
                fn: function(editor, e, eOpts) {
                    if (e.value === e.originalValue) {
                        return;
                    }

                    var oData, prpName;
                    oData = me.treeRecord.data.__ptConfig;
                    prpName = e.record.data.name;

                    // ****  Solo llegan objetos, los Array deben tener un __ptConfig aidcional
                    if (_SM.typeOf(oData) != "object") {

                        if (!oData.__ptConfig) {
                            oData.__ptConfig = {};
                        }
                        oData.__ptConfig[prpName] = e.value;

                    } else {

                        // Asigna el valor a la propiedad
                        oData[prpName] = e.value;
                    }
                }

            },
            scope: me
        });

        fieldList.on({
            'checked': {
                fn: function(record, recordIndex, checked) {
                    saveFieldList();
                }

            },
            'reorder': {
                fn: function() {
                    saveFieldList();
                }

            },
            scope: me
        });

        // ----------------------------------------------------------------------------------------------

        function getTreeData(me) {

            var treeData = {}, ix, vFld, tmpData, myCustom;

            if (me.custom) {
                if (me.metaConfig) {
                    // If I write the copy on the target list | Display to make it easier
                    myCustom = {
                        listDisplay: me.myMeta.gridConfig.listDisplay
                    };
                    myCustom = Ext.apply(myCustom, me.myMeta.gridSets);
                    treeData = Meta2Tree(myCustom, 'custom', 'custom');
                } else {
                    // Aqui solmanete  manejara el custom
                    treeData = Meta2Tree(me.myMeta.custom, 'custom', 'custom');
                }
            } else {

                // Prepara la PCL
                // delete me.myMeta.fields
                tmpMeta = _SM.clone(me.myMeta, 0, ['fields']);
                tmpMeta.fieldsBase = tmpMeta.fieldsBase.sort(_SM.sortObjByName);
                tmpMeta.fieldsAdm = tmpMeta.fieldsAdm.sort(_SM.sortObjByName);

                treeData = Meta2Tree(tmpMeta, 'pcl', 'pcl');
                for (ix in treeData.children ) {
                    vFld = treeData.children[ix];
                    if (vFld.text === 'fields') {
                        treeData.children.splice(ix, 1);
                        break;
                    }
                }
            }

            treeData.expanded = true;

            // Para guardar las dos definiciones ( la data se modifica al generar el store )
            me.treeData = _SM.clone(treeData);

            return treeData;
        }

        function addTreeNode(record) {

            // verifica el tipo de datos
            var ptType = record.data.__ptType, __ptConfig, nodeDef, nodeName, tNode, childDef, pName, template, newObj;
            if (!ptType) {
                return;
            }

            // Carga el __ptConfig es el obj de referencia q viaja
            __ptConfig = record.data.__ptConfig || {};

            // Obtiene la definicion del nodo hijo
            nodeDef = _MetaObjects[ptType];
            childDef = _MetaObjects[nodeDef.listOf] || {};

            // Pregunta el nombre del nuevo nodo
            pName = _SM.ptPrompt(nodeDef.listOf, childDef.addPrompt);
            if (!pName) {
                return;
            }

            // Propiedad q llevara el nombre del nodo
            nodeName = childDef.nodeName || 'name';

            // Crea el nodo base
            tNode = getNodeBase(pName, nodeDef.listOf, {
                '__ptType': nodeDef.listOf
            });

            // asigna el nombre del nodo
            tNode.__ptConfig[nodeName] = pName;

            if (childDef.__ptStyle == 'jsonText') {

                template = childDef.addTemplate.replace('@name', pName);
                tNode.__ptConfig.__ptValue = template;

            } else if (childDef.__ptStyle == 'colList') {
            } else {

                // Tipo objeto, debe recrear el objeto pues existen listas y otras
                newObj = verifyMeta({}, nodeDef.listOf, tNode);
            }

            record.appendChild(tNode);

        }

        function delTreeNode(record) {

            var ptType = record.data.__ptType, pBase, view;

            pBase = record.parentNode;

            record.remove();
            resetPanelInterface();

            if (pBase) {
                view = me.treeGrid.getView();
                view.select(pBase);
            }
        }

        // ----------------------------------------------------------------------------------------------

        function getAttrMsg(attrName) {
            var msg = _MetaObjects[attrName] || {};
            return msg.description || '';
        }

        // jsonText.on({'deactivate': function ( obj ,  eOpts ) {
        function saveJsonText() {
            if (jsonText.isVisible()) {
                jsonText.__ptConfig.__ptValue = jsonText.getRawValue();
            }
        }

        function saveFieldList() {
            if (fieldList.isVisible()) {
                // __ptConfig guarda la ref al obj de base
                fieldList.__ptConfig.__ptList = Ext.encode(fieldList.getChecked());
            }
        }

        // ----------------------------------------------------------------------------------------------

        function resetPanelInterface() {
            jsonText.hide();
            propsGrid.hide();
            fieldList.hide();
            resetButtons();
        }

        function resetButtons() {
            tBar.setButton('add', bVisible = false, true);
            tBar.setButton('del', bVisible = false, true);
        }

        function preparePropertiesPCL(record) {

            var oData, ptType, __ptConfig, template, sMsg;
            oData = record.data;
            ptType = oData.__ptType;
            __ptConfig = oData.__ptConfig || {};

            template = _MetaObjects[ptType] || {};

            // Status Bar
            sMsg = getAttrMsg(record.data.text);
            if (sMsg) {
                sMsg = '<strong>' + record.data.text + '</strong> : ' + sMsg;
            } else {
                sMsg = '<strong>' + ptType + '</strong>  [ ' + record.data.text + ' ]';
            }
            sbar.setText(sMsg, false);

            // Clear
            resetPanelInterface();

            if (template.__ptStyle == "jsonText") {
                jsonText.__ptConfig = __ptConfig;
                jsonText.setRawValue(__ptConfig.__ptValue);
                jsonText.setFieldLabel(oData.text);
                jsonText.show();

            } else if (template.__ptStyle == "colList") {
                fieldList.show();
                fieldList.__ptConfig = __ptConfig;
                prepareColList(oData);

            } else {
                propsGrid.show();
                prepareProperties(record, me.myMeta, propsGrid);
            }

            // Prepara el menu
            var nodeDef = _MetaObjects[ptType] || {};
            if (nodeDef.allowAdd) {

                tBar.setButton('add', true, true, _SM.__language.ProtoPcl_Add_Instance + ptType, record);
            }

            if (nodeDef.allowDel) {
                tBar.setButton('del', true, true, _SM.__language.ProtoPcl_Del_Current + ptType + ' [' + oData.text + ']', record);

            }

        };

        var fList;
        function prepareColList(oData) {

            var ix, vFld;
            if (!fList) {
                // Crea los campos del store
                fList = [];
                for (ix in me.myMeta.fieldsBase ) {
                    vFld = me.myMeta.fieldsBase[ix];
                    fList.push(vFld.name);
                }
            }

            // Copia solo los campos contenidos en fields
            var tmpList, fSelected, ix, vFld;

            tmpList = Ext.decode(oData.__ptConfig.__ptList);
            fSelected = [];
            for (ix in tmpList  ) {
                vFld = tmpList[ix];
                if (me.myFieldDict[vFld]) {
                    fSelected.push(vFld);
                }
            }

            fieldList.removeAll();
            fieldList.addDataSet(fSelected, true);
            fieldList.addDataSet(fList);
        }

    },

    save: function(me) {

        var myCustom, saveAs = false, winTitle;

        myCustom = Tree2Meta(me.treeGridStore.getRootNode());
        if (me.custom) {

            if (me.metaConfig) {
                // Si escribe sobre la meta copia el list|Display para hacerlo mas facil
                me.myMeta.gridConfig.listDisplay = myCustom.listDisplay;
                delete myCustom.listDisplay;
                me.myMeta.gridSets = myCustom;

            } else {
                // Aqui solmanete  manejara el custom
                me.myMeta.custom = myCustom;
            }

        } else {
            // Pcl completa ( forza el metaConfig y reconstruye fields )
            myCustom.fields = myCustom.fieldsBase.concat(myCustom.fieldsAdm);

            me.metaConfig = true;
            me.myMeta = myCustom;
        }

        me.encodeViewName(me);
        winTitle = ' [ ' + me.myMeta.viewCode + ' ]';

        // If the name was changed, is a saveAs
        if (me.myViewCode && me.myViewCode !== me.myMeta.viewCode) {
            saveAs = true;
            winTitle = winTitle + '*';
            _SM.CloseProtoTab(me.myMeta.viewCode);
            delete (_SM._cllPCI[me.myMeta.viewCode] );

        } else {
            _SM.savePclCache(me.myMeta.viewCode, me.myMeta, true);
        }

        me.up('window').setTitle(winTitle);
        me.myMeta.metaVersion = _versionMeta;

        if (me.metaConfig) {// La meta modificada
            _SM.savePci(me.myMeta);

        } else {
            // Solo el custom, empaqueta el objeto para poder agregarle info de control
            myCustom = {
                viewCode: '_custom.' + me.myMeta.viewCode,
                metaVersion: _versionMeta,
                custom: myCustom
            };
            _SM.savePci(myCustom);
        }

    },

    cancelChanges: function() {
        //TODO: Verificar si hace un reload
        // this.treeGridStore.getRootNode().removeAll();
        // this.treeGridStore.setRootNode( this.treeData )
    },

    decodeViewName: function(me) {
        // Eliminates viewEntity name to facilitate the user edition

        // view code must be not null 
        if ( ( ! me.myMeta.viewCode ) || (  me.myMeta.viewCode.length == 0  )) { 
            me.myMeta.viewCode = me.myMeta.viewEntity;
        }

        // Save Original ViewCode 
        if ( ! me.myViewCode )  {
            if ( me.myMeta.viewCode.substring(0, me.myMeta.viewEntity.length) == me.myMeta.viewEntity ) {
                me.myViewCode = me.myMeta.viewCode.toString();
            } else {
                me.myViewCode = me.myMeta.viewEntity + '.' + me.myMeta.viewCode;    
            }
        }

        // Strip prefix 
        if ( me.myMeta.viewCode.substring(0, me.myMeta.viewEntity.length) == me.myMeta.viewEntity ) {
            me.myMeta.viewCode = me.myViewCode.substring(me.myMeta.viewEntity.length + 1);
        }


    },

    encodeViewName: function(me) {
        // Recode viewEntity. Only one prefx 
        if ( ! me.myMeta.viewCode ) {
            me.myMeta.viewCode = me.myMeta.viewEntity

        } else if ( me.myMeta.viewCode.substring(0, me.myMeta.viewEntity.length) !== me.myMeta.viewEntity ) {
            me.myMeta.viewCode = me.myMeta.viewEntity + '.' + me.myMeta.viewCode;
        }

    }

});
/*
 * Dario Gomez  1206
 *
 * Debe prepara las propiedades con los valores por defeco adecuados, y
 * presentarlos en el panel de propiedades ( q permite manejra el edito de combos )
 *
 */


function prepareProperties( record , myMeta,  propPanel  ){
    /* Pepara la tabla de propiedades
     * retorna propPanel
     */

    var template = {};

    // var parentType = ''
    // if ( record.parentNode ) parentType  =  record.parentNode.data.text

    // La data configurada
    var __ptConfig  =  _SM.clone( record.data.__ptConfig ),
        __ptType = record.data.__ptType,
        __ptText = record.data.text, 
        myFieldDict = _SM.getFieldDict( myMeta );

    if ( __ptType  in _SM.objConv( [ 'field', 'formField' ]) ) {

        // Default Data ( aplica los defaults a la pcl y luego a la definicion del campo )
        template = getTemplate( __ptType, false, myFieldDict[ __ptText  ] );
        __ptConfig[ 'name' ]  = __ptText;

    // } else if ( __ptType  in _SM.objConv( [ 'detailDef', 'sheetConfig' ]) ) {
        // template = getTemplate( __ptType, false  )

    }  else {
        // Default Data ( El nombre del nodo es el tipo de datos real )
        template = getTemplate( __ptType , false  );
    }

    // Default Data ( aplica los defaults a la definicion del campo )
    __ptConfig = Ext.apply(  template.__ptConfig, __ptConfig   );

    // Solo maneja las propiedades propias de la version
    __ptConfig = clearPhantonProps( __ptConfig,  __ptType );

    propPanel.setSource( __ptConfig );
    propPanel.setCombos( template.__ppChoices );
    propPanel.setTypes( template.__ppTypes );

    propPanel.readOnlyProps = ['__ptType', 'name'].concat ( template.__roProperties );
    propPanel.sourceInfo = template.__ptHelp;

};




function getTemplate( ptType, forForm,  metaField  )  {
    // TODO:  agregar en la definicion del campo un colList para hacer un combo automatico con los nombres de campo
    //@forForm boolean for Form Definition

    var prps = {}, qtips = {}, choices = {}, ppTypes = {};
    var prpName, prpValue, prpHelp, prpChoices, prpDict, prpType;

    // Lee la plantilla de la variable publica
    var objConfig = _MetaObjects[ ptType ] || {};

    // Recorre el vector de propieades
    // puede ser solo el nombre o la tupla name, value
    // [ 'x' , { 'name' : 'xxx' , 'value' : '' }]
    for (var ix in objConfig.properties  ) {
        var prp  = objConfig.properties[ ix ];

        // Trae los valores directamente
        if ( _SM.typeOf( prp ) == 'object' ) {
            prpName = prp.name;
            prpValue = prp.value;
        } else {
            prpName = prp;
            prpValue =  _MetaProperties[ prpName ] || null;
        }


        prpHelp =  _MetaProperties[ prpName + '.help'];
        prpChoices =  _MetaProperties[ prpName + '.choices'];
        prpType =  _MetaProperties[ prpName + '.type'];

        // Para presentacion en la forma o en las propiedades
        if (forForm) {
            if ( prpValue )  prps[ prpName ] = prpValue;

        } else {
            prps[ prpName ] = prpValue || '';
            qtips[ prpName ] = prpHelp;
            if ( prpChoices )   choices[ prpName ] = prpChoices;
            if ( prpType )   ppTypes[ prpName ] = prpType;
        }


    }

    // Si es un campo obtiene los defaults de fields
    if ( metaField ) {
        prpDict = _SM.getFormFieldDefinition( metaField );
        prps = Ext.apply( prps, prpDict   );
    }

    // Garantiza q no venga una definicion generica ( solo para los formFields )
    if ( forForm && ( ! prps.xtype  )) prps.xtype = ptType;
    if ( ( prps.xtype == 'formField' ) &&  ( ptType == 'formField' )) prps.xtype = 'textfield';


    return {'__ptConfig' : prps,
            '__ptHelp' : qtips,
            '__ppChoices' : choices,
            '__ppTypes' : ppTypes,
            '__roProperties' : objConfig.roProperties || []
            };

}





// function getObjs( prItems ) {
    // //recorrido geenerico de objetos
    // var key, obj, prop, owns = Object.prototype.hasOwnProperty;
    // for (key in prItems ) {
        // if (owns.call(prItems, key)) {
            // obj = prItems[key];
            // for (prop in obj ) {
                // // using obj.hasOwnProperty might cause you headache if there is
                // // obj.hasOwnProperty = function(){return false;}
                // // but owns will always work
                // if (owns.call(obj, prop)) {
                    // console.log(prop, "=", obj[prop]);
                // }
            // }
        // }
    // }
// }

/*
 * Author: Dario Gomez . CERTAE - ULaval

 */

/*global Ext, _SM  */

Ext.define('ProtoUL.proto.ProtoToolBar', {
    extend: 'Ext.Toolbar',
    alias: 'widget.protoToolBar',

    initComponent: function() {

        var me = this
        me.addEvents('save', 'preview', 'add', 'del', 'help', 'show1');

        Ext.apply(this, {
            items: [{
                tooltip: _SM.__language.ProtoToolbar_Upd_Def,
                iconCls: "icon-save",
                itemId: "save",
                scope: this,
                handler: function() {
                    me.fireEvent('save')
                }

            // }, " ", {
            //     tooltip: _SM.__language.ProtoToolbar_Save_As,
            //     iconCls: "icon-saveas",
            //     hidden: true,
            //     itemId: "saveas",
            //     scope: this,
            //     handler: function() {
            //         me.fireEvent('saveas');
            //     }

            }, " ", {
                tooltip: _SM.__language.ProtoToolbar_Add_Node,
                iconCls: "icon-nodeInsert",
                hidden: true,
                itemId: "add",
                scope: this,
                handler: function(btn) {
                    me.fireEvent('add', btn.oData)
                }

            }, {
                tooltip: _SM.__language.ProtoToolbar_Del_Current_Node,
                iconCls: "icon-nodeDelete",
                hidden: true,
                itemId: "del",
                scope: this,
                handler: function(btn) {
                    me.fireEvent('del', btn.oData)
                }

                //            },"-",{
                //                tooltip: _SM.__language.ProtoToolbar_Show_Current_Meta,
                //                iconCls : "icon-script_gear",
                //                itemId  : "show1",
                //                scope   : this,
                //                handler : function() {
                //                    me.fireEvent('show1')
                //                    }
                //            },"->",{
                //                iconCls : "icon-help",
                //                itemId  : "help",
                //                tooltip: _SM.__language.ProtoToolbar_Show_Help,
                //                scope   : this,
                //                handler : function() {
                //                    me.fireEvent('help')
                //                    }
            }]

        });

        me.callParent(arguments);

    },

    setButton: function(key, bVisible, bEnabled, toolTip, oData) {

        var btn = this.getComponent(key)

        btn.setVisible(bVisible)
        btn.setDisabled(!bEnabled)
        btn.setTooltip(toolTip)
        btn.oData = oData

    }

});

function getSelectorsPanels(elemTree, fieldList) {

    return [{
        region: 'center',
        layout: 'fit',
        minSize: 200,
        items: elemTree,
        border: false,
        flex: 5
    }, {
        region: 'east',
        collapsible: true,
        collapsed: false,
        split: true,
        layout: 'fit',
        minSize: 200,
        items: fieldList,
        border: false,
        flex: 2
    }]

}

/*global Ext, _SM, _MetaObjects  */
/*global Meta2Tree, Tree2Meta */

function Meta2Tree(oData, pName, ptType) {
    /* Convierte la meta en treeStore ( Arbol )
    *
    * Input    ---------------------------------
    * @oData     : Data a convertir
    * @pName     : property Name ( iteraction en el objeto padre, en el caso de las formas )
    * @ptType    : property Type ( Tipo del padre en caso de ser un array  )
    *
    * Return   -------------------------------
    * @tData   treeData
    *
    */

    //    Initial validation  --------------------------------------------

    var nodeDef = _MetaObjects[ptType];
    if (!nodeDef) {
        return;
    }

    //    Embeded functions --------------------------------------------

    function doFinalFormat(tData) {
        tData.text = oData.name || oData.menuText || oData.property || oData.viewEntity || ptType;
        return tData;
    }

    function formContainer2Tree(items) {
        // Aqui solo llegan los contenedores de la forma,  ( hideItems : true )

        var tItems = [];
        for (var sKey in items ) {

            var oData = items[sKey], t2Data;

            var __ptConfig = getSimpleProperties(oData, ptType);
            var ptType = __ptConfig.__ptType;

            //  contenedores de la forma
            if ( ptType in _SM.objConv(['htmlset', 'fieldset', 'tabpanel', 'accordeon', 'panel'])) {
                var cName = ptType; 
                if (ptType == 'fieldset' ) {
                    cName += ' - ' + __ptConfig.title 
                }
                t2Data = getNodeBase( cName, ptType, __ptConfig);
                t2Data['children'] = formContainer2Tree(oData.items);
                tItems.push(t2Data);

            } else if ( ptType in _SM.objConv(['formField', 'protoGrid', 'detailButton'])) {

                if (ptType == 'protoGrid' ) {
                    t2Data = getNodeBase(__ptConfig.menuText, ptType, __ptConfig);

                } else if ( ptType == 'detailButton') {
                    t2Data = getNodeBase(__ptConfig.text, ptType, __ptConfig);

                } else {
                    t2Data = getNodeBase(__ptConfig.name, ptType, __ptConfig);
                }
                t2Data['leaf'] = true;
                tItems.push(t2Data);

                // } else {
                // console.log( "Error formContainer2Tree", oData )
            }
        }
        return tItems;
    }

    function getSpecialNodes(nodeDef, treeData, objData) {
        // Recibe el treeData y lo configura en caso de nodos especiales
        // retorna true si fue configurado

        // Form ( debe manejar el raiz sin el marco de items )
        if (nodeDef.hideItems) {
            if (objData.items) {
                treeData['children'] = formContainer2Tree(objData.items);
            } else {
                treeData['children'] = formContainer2Tree(objData);
            }
            return true;
        }

        // Los tipos codificados
        if (nodeDef.__ptStyle == 'jsonText') {
            if (objData.name) {
                treeData.__ptConfig.name = objData.name;
            }
            treeData.__ptConfig.__ptValue = Ext.encode(objData);
            return true;
        }
        if (nodeDef.__ptStyle == 'colList') {
            treeData.__ptConfig.__ptList = Ext.encode(objData);
            return true;
        }

    }

    function Array2Tree(oList, ptType, tNode) {
        // REcibe un array y genera los hijos,
        // @tNode   referencia al nodo base
        // @ptType  tipo de nodo hijo
        // @oList    objeto lista de la meta
        var nodeDef = _MetaObjects[ptType];

        for (var sKey in oList ) {
            var oData = oList[sKey];

            var tChild = Meta2Tree(oData, pName, ptType);
            tNode['children'].push(tChild);
        }
    }

    function verifyNodeDef(nodeDef) {
        // Verifica las listas y objetos

        var ix, sKey;

        if (nodeDef.lists) {
            if (_SM.typeOf(nodeDef.lists) != 'array') {
                // console.log( 'pciObjects definicion errada de listas para ' + ptType )
                nodeDef.lists = [];
            } else {
                for (var ix in nodeDef.lists  ) {
                    var sKey = nodeDef.lists[ix];
                    if ( typeof (sKey) != 'string') {
                        // console.log( 'pciObjects definicion errada en listas ' + ptType + ' key ' , sKey  )
                        delete nodeDef.lists[ix];
                        continue;
                    }
                    var childConf = _MetaObjects[sKey];
                    if (childConf.__ptStyle == 'colList' || childConf.__ptStyle == 'jsonText') {
                        continue;
                    }
                    if (!childConf.listOf) {
                        // console.log( 'pciObjects no se encontro listOf para ' + sKey  )
                        continue;
                    }
                }
            }
        }

        if (nodeDef.objects) {

            if (_SM.typeOf(nodeDef.objects) != 'array') {
                // console.log( 'pciObjects definicion errada de objects para ' + ptType )
                nodeDef.lists = [];
            } else {
                for (ix in nodeDef.objects  ) {
                    sKey = nodeDef.objects[ix];
                    if ( typeof (sKey) != 'string') {
                        // console.log( 'pciObjects definicion errada en objects ' + ptType + ' key ' , sKey  )
                        continue;
                    }
                }
            }
        }
    }

    //   Function body  --------------------------------------------

    var __ptConfig = getSimpleProperties(oData, ptType);
    var tData = getNodeBase(ptType, ptType, __ptConfig);

    if (getSpecialNodes(nodeDef, tData, oData)) {
        return doFinalFormat(tData);
    }

    // es una lista  lista, se hace el mismo recorrido ( solo en caso de una lista de listas )
    if (nodeDef.listOf) {
        Array2Tree(oData, ptType, tData);
    }

    // Verifica q la definicion este bien hecha
    verifyNodeDef(nodeDef);

    // Recorre las listas
    for (var ix in nodeDef.lists  ) {
        var sKey = nodeDef.lists[ix];
        var childConf = _MetaObjects[sKey], tChild;

        tChild = getNodeBase(sKey, sKey, {
            '__ptType' : sKey
        });

        if (! getSpecialNodes(childConf, tChild, oData[sKey])) {
            Array2Tree(oData[sKey], childConf.listOf, tChild);
        }

        //  agrega la base de la lista
        tData['children'].push(tChild);

    }

    // Recorre los objetos
    for (var ix in nodeDef.objects  ) {
        // Obtiene el objeto de la meta, lo convierte y lo genera
        var sKey = nodeDef.objects[ix], tChild = Meta2Tree(oData[sKey], sKey, sKey);
        tData['children'].push(tChild);
    }

    // Asigna el nombre al nodo en caso de objetos

    return doFinalFormat(tData);

}

function Tree2Meta(tNode) {
    // Dada la informacion del arbol genera la meta correspondiente

    // Obtiene la info del nodo
    var tData, mData, myObj = getNodeInfo(tNode);

    if (!myObj.__ptConfig) {
        // console.log( 'Nodo sin configuracion ', tNode )
        return;
    }

    // Obtiene la informacion base del nodo
    var nodeConf = _MetaObjects[myObj.__ptType];
    if (nodeConf.listOf) {
        mData = [];
        getChilds(myObj.tChilds, mData, 'array');

    } else if (nodeConf.__ptStyle in _SM.objConv(["colList", "jsonText"])) {
        mData = getSimpleProperties(myObj.__ptConfig, myObj.__ptType);

    } else if (nodeConf.properties || nodeConf.lists || nodeConf.objects) {
        mData = getSimpleProperties(myObj.__ptConfig, myObj.__ptType);
        if (myObj.tChilds.length > 0) {
            if (nodeConf.hideItems) {
                mData.items = [];
                getChilds(myObj.tChilds, mData.items, 'array');
            } else {
                getChilds(myObj.tChilds, mData, 'object');
            }
        }

        // } else {
        // console.log( 'tre2meta no considera esta conf ', nodeConf,  tNode )
    }

    return mData;

    function getChilds(tChilds, mData, sType) {
        var ix, lNode, nChildData;

        // Recorre los hijos para crear los objetos segun su tipo
        for (ix in tChilds ) {
            lNode = tChilds[ix];
            nChildData = Tree2Meta(lNode);

            if (sType == 'object') {
                mData[ getPtType(lNode)] = nChildData;
            } else {
                mData.push(nChildData);
            }
        }
    }

    function getNodeInfo(tNode) {
        var tData, myObj = {};
        if (tNode.data) {
            tData = tNode.data;
            myObj.tChilds = tNode.childNodes;
        } else {
            tData = tNode;
            myObj.tChilds = tNode.children;
        }

        myObj.__ptType = tData.__ptType;
        if (!tData.__ptConfig) {
            // console.log( 'getNodeInfo: __ptConfig ni encotrado ', tNode )
            myObj.__ptConfig = {};
            return myObj;
        }
        myObj.__ptConfig = clearPhantonProps(tData.__ptConfig, myObj.__ptType);
        return myObj;
    }

    function getPtType(lNode) {
        if (lNode.__ptType) {
            return lNode.__ptType;
        } else if (lNode.data && lNode.data.__ptType) {
            return lNode.data.__ptType;
        }
        // console.log ( 'getPtType: Tipo de dato no encontrado' , lNode )
    }

};

//

function getNodeBase(pName, ptType, __ptConfig) {
    // Obtiene un Id y genera  una referencia cruzada de la pcl con el arbol
    // El modelo debe crear la referencia a la data o se perdera en el treeStore

    return {
        'id' : Ext.id(),
        'text' : pName,
        '__ptType' : ptType,
        '__ptConfig' : __ptConfig,
        'children' : []
    };

}

/*

Control que recoje todos los plugins necesarios para el htmleditor 

*/


Ext.define('ProtoUL.ux.FieldHtmlEditor', {
    extend: 'Ext.form.HtmlEditor',
    alias: 'widget.htmlfield',

    initComponent: function() {
        
        Ext.apply(this, {
            plugins  : getPlugins()
        });
        this.callParent();



        function getPlugins(){
            return [
                new ProtoUL.ux.HtmlEditor.Word(),
                new ProtoUL.ux.HtmlEditor.Table(),
                new ProtoUL.ux.HtmlEditor.HR(),
                new ProtoUL.ux.HtmlEditor.SpecialCharacters(),
                new ProtoUL.ux.HtmlEditor.MidasFormat()
            ];
        };

    }, 
    
    setReadOnly: function (readOnly) {
		var me = this;
        if ( me.initialized && readOnly != undefined ) {
            var tb = me.getToolbar();
            tb.setVisible(! readOnly );
        }
        me.superclass.setReadOnly( readOnly );  
    }

});




/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class ProtoUL.ux.HtmlEditor.HR
 * @extends Ext.util.Observable
 * <p>A plugin that creates a button on the HtmlEditor for inserting a horizontal rule.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('ProtoUL.ux.HtmlEditor.HR', {
    extend: 'Ext.util.Observable',

    // HR language text
    langTitle   : 'Horizontal Rule',
    langToolTip : 'Insert horizontal rule with configurable lenght',
    langHelp    : 'Enter the width of the Rule in percentage<br/> followed by the % sign at the end, or to<br/> set a fixed width ommit the % symbol.',
    langInsert  : 'Insert',
    langCancel  : 'Cancel',
    langWidth   : 'Width',

    // defaults
    defaultHRWidth: '100%',

    // private
    cmd: 'hr',

    // private
    init: function(cmp){
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
    },

    // private
    onRender: function(){
        var btn = this.cmp.getToolbar().add('-',{
            iconCls : 'x-edit-hr',
            handler : showHTWin,
            scope   : this,
            tooltip : {
                title: this.langTitle, 
                text: this.langToolTip
            },
            overflowText: this.langTitle
        });
        
        function showHTWin(){
            if (!this.hrWindow) {
                this.hrWindow = Ext.create('Ext.window.Window',{
                    title       : this.langTitle,
                    width       : 250,
                    closeAction : 'hide',
                    items       : [{
                        xtype       : 'form',
                        itemId      : 'insert-hr',
                        border      : false,
                        plain       : true,
                        bodyStyle   : 'padding: 10px;',
                        labelWidth  : 60,
                        labelAlign  : 'right',
                        items       : [{
                            xtype   : 'label',
                            html    : this.langHelp + '<br/>&nbsp;'
                        }, {
                            xtype       : 'textfield',
                            maskRe      : /[0-9]|%/,
                            regex       : /^[1-9][0-9%]{1,3}/,
                            fieldLabel  : this.langWidth,
                            name        : 'hrwidth',
                            anchor      : '-20px;',
                            value       : this.defaultHRWidth,
                            listeners   : {
                                specialkey: function(f, e){
                                    if ((e.getKey() == e.ENTER || e.getKey() == e.RETURN) && f.isValid()) {
                                        this.doInsertHR();
                                    }
                                },
                                scope: this
                            }
                        }]
                    }],
                    buttons: [{
                        text    : this.langInsert,
                        handler : function(){
                            var frm = this.hrWindow.getComponent('insert-hr').getForm();
                            if (frm.isValid()) {
                                this.doInsertHR();
                            } else {
                                frm.findField('hrwidth').getEl().frame();
                            }
                        },
                        scope   : this
                    }, {
                        text    : this.langCancel,
                        handler : function(){
                            this.hrWindow.hide();
                        },
                        scope   : this
                    }],
                    listeners   : {
                        render  : (Ext.isGecko) ? this.focusHRLong : this.focusHR,
                        show    : this.focusHR,
                        move    : this.focusHR,
                        scope   : this
                    }
                });
            }
            this.hrWindow.show();
        }
    },
    // private
    focusHRLong: function(w){
        this.focus(w, 600);
    },
    // private
    focusHR: function(w){
        this.focus(w, 100);
    },
    /**
     * This method is just for focusing the text field use for entering the width of the HR.
     * It's extra messy because Firefox seems to take a while longer to render the window than other browsers,
     * particularly when Firbug is enabled, which is all the time if your like me.
     * Had to crank up the delay for focusing on render to 600ms for Firefox, and 100ms for all other focusing.
     * Other browsers seem to work fine in all cases with as little as 50ms delay. Compromise bleh!
     * @param {Object} win the window to focus
     * @param {Integer} delay the delay in milliseconds before focusing
     */
    focus: function(win, delay){
        win.getComponent('insert-hr').getForm().findField('hrwidth').focus(true, delay);
    },
    // private
    doInsertHR: function(){
        var frm = this.hrWindow.getComponent('insert-hr').getForm();
        if (frm.isValid()) {
            var hrwidth = frm.findField('hrwidth').getValue();
            if (hrwidth) {
                this.insertHR(hrwidth);
            } else {
                this.insertHR(this.defaultHRWidth);
            }
            frm.reset();
            this.hrWindow.hide();
        }
    },
    /**
     * Insert a horizontal rule into the document.
     * @param w String The width of the horizontal rule as the <tt>width</tt> attribute of the HR tag expects. ie: '100%' or '400' (pixels).
     */
    insertHR: function(w){
        this.cmp.insertAtCursor('<hr width="' + w + '">');
    }
});


/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class ProtoUL.ux.HtmlEditor.SpecialCharacters
 * @extends Ext.util.Observable
 * <p>A plugin that creates a button on the HtmlEditor for inserting special characters.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('ProtoUL.ux.HtmlEditor.SpecialCharacters', {
    extend: 'Ext.util.Observable',

    // SpecialCharacters language text
    langTitle   : 'Insert Special Character',
    langToolTip : 'Insert special languaje character ',
    langInsert  : 'Insert',
    langCancel  : 'Cancel',

    /**
     * @cfg {Array} specialChars
     * An array of additional characters to display for user selection.  Uses numeric portion of the ASCII HTML Character Code only. For example, to use the Copyright symbol, which is &#169; we would just specify <tt>169</tt> (ie: <tt>specialChars:[169]</tt>).
     */
    specialChars: [153],

    /**
     * @cfg {Array} charRange
     * Two numbers specifying a range of ASCII HTML Characters to display for user selection. Defaults to <tt>[160, 256]</tt>.
     */
    charRange   : [160, 256],

    // private
    chars: [],

    // private
    init: function(cmp){
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
    },

    // private
    onRender: function(){
        var btn = this.cmp.getToolbar().add({
            iconCls: 'x-edit-char',
            handler: showEspeciaCharTable,
            scope: this,
            tooltip: {
                title: this.langTitle, 
                text: this.langToolTip
            },
            overflowText: this.langTitle
        });
        function showEspeciaCharTable(){
            if (!this.chars.length) {
                if (this.specialChars.length) {
                    Ext.each(this.specialChars, function(c, i){
                        this.chars[i] = ['&#' + c + ';'];
                    }, this);
                }
                for (var i = this.charRange[0]; i < this.charRange[1]; i++) {
                    this.chars.push(['&#' + i + ';']);
                }
            }
            var charStore = Ext.create('Ext.data.ArrayStore',{
                fields  : ['char'],
                data    : this.chars
            });
            this.charWindow = Ext.create('Ext.window.Window',{
                title       : this.langTitle,
                width       : 436,
                height      : 245,
                layout      : 'fit',
                plain       : true,
                items       : [{
                    xtype       : 'dataview',
                    store       : charStore,
                    itemId      : 'charView',
                    autoHeight  : true,
                    multiSelect : true,
                    tpl         : new Ext.XTemplate('<tpl for="."><div class="char-item">{char}</div></tpl><div class="x-clear"></div>'),
                    overItemCls : 'char-over',
                    itemSelector: 'div.char-item',
                    trackOver   : true,
                    listeners: {
                        itemdblclick: function(view, record, item, index, e, ePpts){
                            this.insertChar(record.get('char'));
                            this.charWindow.close();
                        },
                        scope: this
                    }
                }],
                buttons: [{
                    text: this.langInsert,
                    handler: function(){
                        var dv = this.charWindow.down('#charView');
                        Ext.each(dv.getSelectedNodes(), function(node){
                            var c = dv.getRecord(node).get('char');
                              this.insertChar(c);
                        }, this);
                        this.charWindow.close();
                    },
                    scope: this
                }, {
                    text: this.langCancel,
                    handler: function(){
                        this.charWindow.close();
                    },
                    scope: this
                }]
            });
            this.charWindow.show();
        }
    },
    /**
     * Insert a single special character into the document.
     * @param c String The special character to insert (not just the numeric code, but the entire ASCII HTML entity).
     */
    insertChar: function(c){
        if (c) {
            this.cmp.insertAtCursor(c);
        }
    }
});

/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class ProtoUL.ux.HtmlEditor.Table
 * @extends Ext.util.Observable
 * <p>A plugin that creates a button on the HtmlEditor for making simple tables.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('ProtoUL.ux.HtmlEditor.Table', {
    extend: 'Ext.util.Observable',

    // Table language text
    langTitle       : 'Insert Table',
    langToolTip     : 'Insert table de NxN with configurable border',
    langInsert      : 'Insert',
    langCancel      : 'Cancel',
    langRows        : 'Rows',
    langColumns     : 'Columns',
    langBorder      : 'Border',
    langCellLabel   : 'Label Cells',

    // private
    cmd             : 'table',
    /**
     * @cfg {Boolean} showCellLocationText
     * Set true to display row and column informational text inside of newly created table cells.
     */
    showCellLocationText: true,
    /**
     * @cfg {String} cellLocationText
     * The string to display inside of newly created table cells.
     */
    cellLocationText: '{0}&nbsp;-&nbsp;{1}',
    /**
     * @cfg {Array} tableBorderOptions
     * A nested array of value/display options to present to the user for table border style. Defaults to a simple list of 5 varrying border types.
     *  
     */
    tableBorderOptions: [['1px dotted #000', 'Dotted'],['1px solid #000', 'Sold Thin'], ['2px solid #000', 'Solid Thick']],
//    ['none', 'None'], ['1px dashed #000', 'Dashed'],

    // private
    init: function(cmp){
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
    },

    // private
    onRender: function(){
        var btn = this.cmp.getToolbar().add('-', {
            iconCls: 'x-edit-table',
            handler: showTableIns,
            scope   : this,
            tooltip : {
                title: this.langTitle,
                text: this.langToolTip
            },
            overflowText: this.langTitle
        });
        
        function showTableIns(){
            if (!this.tableWindow){
                this.tableWindow = Ext.create('Ext.window.Window',{
                    title       : this.langTitle,
                    closeAction : 'hide',
                    width       : 300,
                    items       : [{
                        itemId      : 'insert-table',
                        xtype       : 'form',
                        border      : false,
                        plain       : true,
                        bodyStyle   : 'padding: 10px;',
                        labelWidth  : 65,
                        labelAlign  : 'right',
                        items       : [{
                            xtype           : 'numberfield',
                            allowBlank      : false,
                            allowDecimals   : false,
                            fieldLabel      : this.langRows,
                            name            : 'row',
                            width           : 150,
                            minValue        : 1,
                            value           : 1
                        }, {
                            xtype           : 'numberfield',
                            allowBlank      : false,
                            allowDecimals   : false,
                            fieldLabel      : this.langColumns,
                            name            : 'col',
                            width           : 150,
                            minValue        : 1,
                            value           : 1
                        }, {
                            xtype           : 'combo',
                            fieldLabel      : this.langBorder,
                            name            : 'border',
                            forceSelection  : true,
                            mode            : 'local',
                            store           : Ext.create('Ext.data.ArrayStore',{
                                autoDestroy : true,
                                fields      : ['spec', 'val'],
                                data        : this.tableBorderOptions
                            }),
                            triggerAction   : 'all',
                            value           : '1px dotted #000',
                            displayField    : 'val',
                            valueField      : 'spec',
                            anchor          : '-15',
                            editable        : false

                        }]
                    }],
                    buttons: [{
                        text    : this.langInsert,
                        handler : function(){
                            var frm = this.tableWindow.getComponent('insert-table').getForm();
                            if (frm.isValid()) {
                                var border = frm.findField('border').getValue();
                                var rowcol = [frm.findField('row').getValue(), frm.findField('col').getValue()];
                                if (rowcol.length == 2 && rowcol[0] > 0 && rowcol[1] > 0) {
                                    var colwidth = Math.floor(100/rowcol[1]);
                                    var html = "<table style='border-collapse: collapse'>";
                                    var cellText = '&nbsp;';
                                    for (var row = 0; row < rowcol[0]; row++) {
                                        html += "<tr>";
                                        for (var col = 0; col < rowcol[1]; col++) {
											html += "<td width='" + colwidth + "%' style='border: " + border + ";'>";
                                            html += cellText; 
                                            html += "</td>";
                                        }
                                        html += "</tr>";
                                    }
                                    html += "</table>";
                                    this.cmp.insertAtCursor(html);
                                }
                                this.tableWindow.hide();
                            }else{
                                if (!frm.findField('row').isValid()){
                                    frm.findField('row').getEl().frame();
                                }else if (!frm.findField('col').isValid()){
                                    frm.findField('col').getEl().frame();
                                }
                            }
                        },
                        scope: this
                    }, {
                        text    : this.langCancel,
                        handler : function(){
                            this.tableWindow.hide();
                        },
                        scope   : this
                    }]
                });
            }
            this.tableWindow.show();
        };
    }
});


/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class ProtoUL.ux.HtmlEditor.Word
 * @extends Ext.util.Observable
 * <p>A plugin that creates a button on the HtmlEditor for pasting text from Word without all the jibberish html.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('ProtoUL.ux.HtmlEditor.Word', {
    extend: 'Ext.util.Observable',

    // Word language text
    langTitle: 'Word Paste',
    langToolTip: 'Cleanse text pasted from Word or other Rich Text applications',
    wordPasteEnabled: true,

    // private
    curLength: 0,
    lastLength: 0,
    lastValue: '',

    // private
    init: function(cmp){

        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
		this.cmp.on('initialize', this.onInit, this, {
			delay : 100,
			single : true
		});

    },
    // private
    onInit: function(){

        Ext.EventManager.on(this.cmp.getDoc(), {
            'keyup': this.checkIfPaste,
            scope: this
        });
        this.lastValue = this.cmp.getValue();
        this.curLength = this.lastValue.length;
        this.lastLength = this.lastValue.length;

    },
    // private
    checkIfPaste: function(e){

        var diffAt = 0;
        this.curLength = this.cmp.getValue().length;

        if (e.V == e.getKey() && e.ctrlKey && this.wordPasteEnabled){

            this.cmp.suspendEvents();

            diffAt = this.findValueDiffAt(this.cmp.getValue());
            var parts = [
                this.cmp.getValue().substr(0, diffAt),
                this.fixWordPaste(this.cmp.getValue().substr(diffAt, (this.curLength - this.lastLength))),
                this.cmp.getValue().substr((this.curLength - this.lastLength)+diffAt, this.curLength)
            ];
            this.cmp.setValue(parts.join(''));

            this.cmp.resumeEvents();
        }

        this.lastLength = this.cmp.getValue().length;
        this.lastValue = this.cmp.getValue();

    },
    // private
    findValueDiffAt: function(val){

        for ( var i=0;i<this.curLength;i++){
            if (this.lastValue[i] != val[i]){
                return i;
            }
        }

    },
    /**
     * Cleans up the jubberish html from Word pasted text.
     * @param wordPaste String The text that needs to be cleansed of Word jibberish html.
     * @return {String} The passed in text with all Word jibberish html removed.
     */
    fixWordPaste: function(wordPaste) {

		var removals = [/&nbsp;/ig, /[\r\n]/g, /<(xml|style)[^>]*>.*?<\/\1>/ig, /<\/?(meta|object|span)[^>]*>/ig, /<\/?[A-Z0-9]*:[A-Z]*[^>]*>/ig, /(lang|class|type|href|name|title|id|clear)=\"[^\"]*\"/ig, /style=(\'\'|\"\")/ig, /<![\[-].*?-*>/g, /MsoNormal/g, /<\\?\?xml[^>]*>/g, /<\/?o:p[^>]*>/g, /<\/?v:[^>]*>/g, /<\/?o:[^>]*>/g, /<\/?st1:[^>]*>/g, /&nbsp;/g, /<\/?SPAN[^>]*>/g, /<\/?FONT[^>]*>/g, /<\/?STRONG[^>]*>/g, /<\/?H1[^>]*>/g, /<\/?H2[^>]*>/g, /<\/?H3[^>]*>/g, /<\/?H4[^>]*>/g, /<\/?H5[^>]*>/g, /<\/?H6[^>]*>/g, /<\/?P[^>]*><\/P>/g, /<!--(.*)-->/g, /<!--(.*)>/g, /<!(.*)-->/g, /<\\?\?xml[^>]*>/g, /<\/?o:p[^>]*>/g, /<\/?v:[^>]*>/g, /<\/?o:[^>]*>/g, /<\/?st1:[^>]*>/g, /style=\"[^\"]*\"/g, /style=\'[^\"]*\'/g, /lang=\"[^\"]*\"/g, /lang=\'[^\"]*\'/g, /class=\"[^\"]*\"/g, /class=\'[^\"]*\'/g, /type=\"[^\"]*\"/g, /type=\'[^\"]*\'/g, /href=\'#[^\"]*\'/g, /href=\"#[^\"]*\"/g, /name=\"[^\"]*\"/g, /name=\'[^\"]*\'/g, / clear=\"all\"/g, /id=\"[^\"]*\"/g, /title=\"[^\"]*\"/g, /<span[^>]*>/g, /<\/?span[^>]*>/g, /<title>(.*)<\/title>/g, /class=/g, /<meta[^>]*>/g, /<link[^>]*>/g, /<style>(.*)<\/style>/g, /<w:[^>]*>(.*)<\/w:[^>]*>/g];

        Ext.each(removals, function(s){
            wordPaste = wordPaste.replace(s, "");
        });

        // keep the divs in paragraphs
        wordPaste = wordPaste.replace(/<div[^>]*>/g, "<p>");
        wordPaste = wordPaste.replace(/<\/?div[^>]*>/g, "</p>");
        return wordPaste;

    },

    // private
    onRender: function() {

        this.cmp.getToolbar().add( '-', {
            iconCls: 'x-edit-wordpaste',
            pressed: true,
            handler: function(t){
                t.toggle(!t.pressed);
                this.wordPasteEnabled = !this.wordPasteEnabled;
            },
            scope: this,
            tooltip: {
                text: this.langToolTip, 
                title: this.langTitle 
            },
            overflowText: this.langTitle
        });

    }
});


/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class ProtoUL.ux.HtmlEditor.MidasCommand
 * @extends Ext.util.Observable
 * <p>A base plugin for extending to create standard Midas command buttons.</p>
 * http://msdn.microsoft.com/en-us/library/ms533049%28v=VS.85%29.aspx
 * http://www.mozilla.org/editor/midas-spec.html
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */

Ext.define('ProtoUL.ux.HtmlEditor.MidasCommand', {
    extend: 'Ext.util.Observable',
    // private
    init: function(cmp){
        this.cmp = cmp;
        this.btns = [];
        this.cmp.on('render', this.onRender, this);
        this.cmp.on('initialize', this.onInit, this, {
            delay: 100,
            single: true
        });
    },
    // private
    onInit: function(){
        Ext.EventManager.on(this.cmp.getDoc(), {
            'mousedown': this.onEditorEvent,
            'dblclick': this.onEditorEvent,
            'click': this.onEditorEvent,
            'keyup': this.onEditorEvent,
            buffer: 100,
            scope: this
        });
    },
    // private
    onRender: function(){
        var midasCmdButton, tb = this.cmp.getToolbar(), btn, iconCls;
        Ext.each(this.midasBtns, function(b){
            if (Ext.isObject(b)) {
                iconCls = (b.iconCls) ? b.iconCls : 'x-edit-' + b.cmd;
				if (b.value) {
					iconCls = iconCls + '-' + b.value.replace(/[<>\/]/g, '');
				}
                midasCmdButton = {
                    iconCls: iconCls,
                    handler: function(){
                        this.cmp.relayCmd(b.cmd, b.value);
                    },
                    scope: this,
					tooltip : b.tooltip || {
                        title: b.title
                    },
                    overflowText: b.overflowText || b.title
                };
            } else {
                midasCmdButton = Ext.create('Ext.toolbar.Separator');
            }
            btn = tb.add(midasCmdButton);
            if (b.enableOnSelection) {
                btn.disable();
            }
            this.btns.push(btn);
        }, this);
    },
    // private
    onEditorEvent: function(){
        var doc = this.cmp.getDoc();
        Ext.each(this.btns, function(b, i){
            if (this.midasBtns[i].enableOnSelection || this.midasBtns[i].disableOnSelection) {
                if (doc.getSelection) {
                    if ((this.midasBtns[i].enableOnSelection && doc.getSelection() !== '') || (this.midasBtns[i].disableOnSelection && doc.getSelection() === '')) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else if (doc.selection) {
                    if ((this.midasBtns[i].enableOnSelection && doc.selection.createRange().text !== '') || (this.midasBtns[i].disableOnSelection && doc.selection.createRange().text === '')) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                }
            }
            if (this.midasBtns[i].monitorCmdState) {
                b.toggle(doc.queryCommandState(this.midasBtns[i].cmd));
            }
        }, this);
    }
});



/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class ProtoUL.ux.HtmlEditor.IndentOutdent
 * @extends ProtoUL.ux.HtmlEditor.MidasCommand
 * <p>A plugin that creates two buttons on the HtmlEditor for indenting and outdenting of selected text.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('ProtoUL.ux.HtmlEditor.MidasFormat', {
    extend: 'ProtoUL.ux.HtmlEditor.MidasCommand',

    // private
    midasBtns: ['|', {
        enableOnSelection: true,
        cmd: 'removeFormat',
        tooltip: {
            text: 'Remove Formatting'
        },
        overflowText: 'Remove Formatting'
    }]
});
/**
 * @class Ext.ux.CheckColumn
 * @extends Ext.grid.column.Column
 * A Header subclass which renders a checkbox in each column cell which toggles the truthiness of the associated data field on click.
 */

Ext.define('ProtoUL.ux.CheckColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.mycheckcolumn',

    /**
     * @cfg {Boolean} [stopSelection=true]
     * Prevent grid selection upon mousedown.
     */
    stopSelection: true,

    tdCls: Ext.baseCSSPrefix + 'grid-cell-checkcolumn',

    constructor: function() {
        this.addEvents(
            /**
             * @event beforecheckchange
             * Fires when before checked state of a row changes.
             * The change may be vetoed by returning `false` from a listener.
             * @param {Ext.ux.CheckColumn} this CheckColumn
             * @param {Number} rowIndex The row index
             * @param {Boolean} checked True if the box is to be checked
             */
            'beforecheckchange',
            /**
             * @event checkchange
             * Fires when the checked state of a row changes
             * @param {Ext.ux.CheckColumn} this CheckColumn
             * @param {Number} rowIndex The row index
             * @param {Boolean} checked True if the box is now checked
             */
            'checkchange'
        );
        this.callParent(arguments);
    },

    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
        var me = this,
            key = type === 'keydown' && e.getKey(),
            mousedown = type == 'mousedown';
        
        if (mousedown || (key == e.ENTER || key == e.SPACE)) {
            
            // grid readOnly property 
            if ( this.readOnly ) {  return false;  }
            if ( this.inGrid ) { 
                if ( ! this.ownerCt.ownerCt.ownerCt.editable  ) { return false; } 
            }
            
            
            var record = view.panel.store.getAt(recordIndex),
                dataIndex = me.dataIndex,
                checked = !record.get(dataIndex);

            // Allow apps to hook beforecheckchange
            if (me.fireEvent('beforecheckchange', record, recordIndex, checked) !== false) {
                record.set(dataIndex, checked);
                me.fireEvent('checkchange', record, recordIndex, checked);

                // Mousedown on the now nonexistent cell causes the view to blur, so stop it continuing.
                if (mousedown) {
                    e.stopEvent();
                }

                // Selection will not proceed after this because of the DOM update caused by the record modification
                // Invoke the SelectionModel unless configured not to do so
                if (!me.stopSelection) {
                    view.selModel.selectByPosition({
                        row: recordIndex,
                        column: cellIndex
                    });
                }

                // Prevent the view from propagating the event to the selection model - we have done that job.
                return false;
            } else {
                // Prevent the view from propagating the event to the selection model if configured to do so.
                return !me.stopSelection;
            }
        } else {
            return me.callParent(arguments);
        }
    },

    // Note: class names are not placed on the prototype bc renderer scope
    // is not in the header.
    renderer : function(value){
        var cssPrefix = Ext.baseCSSPrefix,
            cls = [cssPrefix + 'grid-checkheader'];

        if (value) {
            cls.push(cssPrefix + 'grid-checkheader-checked');
        }
        return '<div class="' + cls.join(' ') + '">&#160;</div>';
    }
});
/**
 * Original Information 
 * @class Ext.ux.grid.HeaderToolTip
 * @namespace Ext.ux.grid
 *
 *  Text tooltips should be stored in the grid column definition
 *  
 *  Sencha forum url: 
 *  http://www.sencha.com/forum/showthread.php?132637-Ext.ux.grid.HeaderToolTip
 * 
 * Forked for ProtoExt  12/03  Dario 
 */
Ext.define('ProtoUL.ux.GridHeaderToolTip', {
    alias: 'plugin.headertooltip',
    init : function(grid) {
        var headerCt = grid.headerCt;
        
		// If any column is locked ( rowNuber ) the header returns null
		if (!headerCt) {
			return;
		}
        
        grid.headerCt.on("afterrender", function(g) {
            grid.tip = Ext.create('Ext.tip.ToolTip', {
                target: headerCt.el,
                delegate: ".x-column-header",
                trackMouse: true,
                renderTo: Ext.getBody(),
                listeners: {
                    beforeshow: function(tip) {
                        var c = headerCt.down('gridcolumn[id=' + tip.triggerElement.id  +']');
						if (c && c.tooltip) {
                            tip.update(c.tooltip);
						} else {
                            return false;
                    }
                }
				}
            });
        });
    }
});

// toolTips Menu

Ext.define('ProtoUL.ux.protoMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.protoMenu',

    afterRender: function() {
        this.superclass.afterRender.apply(this, arguments);

        var menu = this;
        this.tip = new Ext.ToolTip({
            target: this.getEl().getAttribute('id'),
            renderTo: document.body,
            trackMouse: true,
            delegate: '.x-menu-item',
            title: '',
            listeners: {
                beforeshow: function(tip) {
                    var c = menu.activeItem.initialConfig; 
                    if ( c  && c.qtip) {
                        tip.setTitle(c.text);
                        tip.update(c.qtip);
                    } else {
                        tip.update(c.text);
                    }
                    
                }
            }
        });
    }
});
﻿Ext.define('Ext.ux.HelpQbe', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.HelpQbe',

    triggerCls: Ext.baseCSSPrefix + 'form-search-trigger',
    autoWidth: true,
    isLoaded: false,

    initComponent: function() {

        var me = this;
        me.myMeta = _SM._cllPCI[me.viewCode];
        me.createHelpWindow(me);
        this.callParent(arguments);

        this.on('specialkey', function(f, e) {
            if (e.getKey() == e.ENTER) {

                this.enterKey();
            }
        }, this);

    },

    createHelpWindow: function(me) {

        Ext.define('Model_' + me.fieldLabel, {
            extend: 'Ext.data.Model',
            fields: ['' + me.name]

        });

        this.myStore = Ext.create('Ext.data.Store', {
            model: 'Model_' + me.fieldLabel,
            proxy: {
                type: 'ajax',
                url: _SM._PConfig.urlHelpQbe,
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'totalCount'
                },
                actionMethods: {
                    read: 'POST'
                },
                extraParams: {
                    query: me.myMeta.sql,
                    field: me.name
                }
            },
            autoLoad: false
        });

        var HelpGrid = Ext.create('Ext.grid.Panel', {
            region: 'center',
            store: this.myStore,
            columns: [{
                text: me.fieldLabel,
                dataIndex: me.name,
                flex: 1
            }],
            height: 400,
            width: 400,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.myStore,
                displayInfo: true,
                displayMsg: _SM.__language.HelpQBE_GridNav_DisplayMsg,
                emptyMsg: _SM.__language.HelpQBE_GridNav_EmptyMsg
            })
        });

        HelpGrid.on({
            itemdblclick: {
                fn: function(el, record, item, index, e, eOpts) {
					me.selectValue();
                },
                scope: me
            }
        });

        me.win = Ext.widget('window', {
            title: _SM.__language.HelpQBE_Window_Title + ' : ',
            closeAction: 'hide',
            modal: true,
            width: 400,
            minWidth: 400,
            height: 400,
            minHeight: 400,
            resizable: true,
            layout: {
                type: 'border'

            },

            items: [{
                xtype: 'toolbar',
                items: [{
                    height: 25,
                    xtype: 'textfield',
                    flex: 1,
                    validator: function(value) {
                        if (value == "") {
                            this.up('toolbar').down('container[name=_TOOLS_]').disable();
                        } else {
                            this.up('toolbar').down('container[name=_TOOLS_]').enable();
                        }
                        return true;
                    }

                }, {
                    xtype: 'container',
                    name: '_TOOLS_',
                    disabled: true,
                    items: [{
                        xtype: 'button',
                        width: 25,
                        text: '>',
                        tooltip: _SM.__language.HelpQBE_Tooltip_PlusThan_Button,
                        handler: function() {
							this.up('window').addText(this);
                        }

                    }, {
                        xtype: 'button',
                        width: 25,
                        text: '<',
                        tooltip: _SM.__language.HelpQBE_Tooltip_LessThan_Button,
                        handler: function() {
							this.up('window').addText(this);
                        }

                    }, {
                        xtype: 'button',
                        width: 25,
                        text: '>=',
                        tooltip: _SM.__language.HelpQBE_Tooltip_PlusEqualThan_Button,
                        handler: function() {
							this.up('window').addText(this);
                        }

                    }, {
                        xtype: 'button',
                        width: 25,
                        text: '<=',
                        tooltip: _SM.__language.HelpQBE_Tooltip_LessEqualThan_Button,
                        handler: function() {
							this.up('window').addText(this);
                        }

                    }, {
                        xtype: 'button',
                        width: 25,
                        text: '<>',
                        tooltip: _SM.__language.HelpQBE_Tooltip_Different_Button,
                        handler: function() {
							this.up('window').addText(this);
                        }

                    }, {
                        xtype: 'button',
                        width: 25,
                        text: ':',
                        tooltip: _SM.__language.HelpQBE_Tooltip_Between_Button,
                        handler: function() {
							this.up('window').addText(this);
                        }

                    }, {
                        xtype: 'button',
                        width: 25,
                        text: '*',
                        tooltip: _SM.__language.HelpQBE_Tooltip_Containing_Button,
                        handler: function() {
							this.up('window').addText(this);
                        }

                    }]
                }],
                region: 'north'
            }, HelpGrid],

            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                defaults: {
                    minWidth: 75
                },
                items: [{
                    xtype: 'tbtext',
                    text: '',
                    id: me.idStBar
                }, {
                    xtype: 'component',
                    flex: 1
                }, {
                    xtype: 'button',
                    text: _SM.__language.Text_Accept_Button,
                    scope: me,
                    handler: me.doReturn,
                    iconCls: 'icon-accept'
                }, {
                    xtype: 'button',
                    text: _SM.__language.Text_Cancel_Button,
                    scope: me,
                    handler: doCancel,
                    iconCls: 'icon-cancel'
				}]
            }],

            addText: function(el) {
                var text = this.down('textfield').getValue();
                var text2 = "";
				for (var i = 0; i < text.length; i++) {
                    var c = text.substring(i, i + 1);
                    if (!(c == '>' || c == '<' || c == '=' || c == '*')) {
                        if (c == ':') {
                            break;
                        } else {
                            text2 = text2 + c;
                        }

                    }

                }
                switch (el.text) {
                    case ':':

                        this.down('textfield').setValue(text2 + "" + el.text);
                        break;
                    case '*':

                        this.down('textfield').setValue(el.text + "" + text2 + "" + el.text);
                        break;

                    default:

                        this.down('textfield').setValue(el.text + "" + text2);

                }

            }

        });

        me.isLoaded = true;

        function doCancel() {
			me.win.hide();
        }

    },

    onTriggerClick: function() {

        this.showHelpForm(this);
    },

    showHelpForm: function(me) {
		if (!me.isLoaded) {
            return me.win.show();
		}
        me.win.down('textfield').setValue(me.getValue());
        me.myStore.load();
    },

    selectValue: function() {

        var records = this.win.down('gridpanel').getSelectionModel().getSelection();

        var record = records[0];

        var text = this.win.down('textfield').getValue();

		var op = text.substring(text.length - 1, text.length);
        if (op == ':') {
            this.win.down('textfield').setValue(text + record.data[this.name]);
        } else {
            this.win.down('textfield').setValue(record.data[this.name]);
        }

    },

    doReturn: function() {

        this.setValue(this.win.down('textfield').getValue());
		this.win.hide();
    }
 });
// Html Panel Objects, html editing many fields makes way too heavy

Ext.define('ProtoUL.ux.HtmlSet', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.htmlset',
    border : false, 

    layout: {
		type : 'vbox',
        align: 'stretch' 
    },

    htlmFields : [],  
    htmlPanels : {},

    height : 200,
    flex  : 1,
     
    initComponent: function () {
		var me = this, myItems = [], myConfig = this.myConfig;

		if (this.title) {
			me.setTitle(this.title);
		}
        
        for (var ix in this.htlmFields ) {
			var vFld = this.htlmFields[ix];
            var newPanel = Ext.create('Ext.panel.Panel', {
                __ptConfig : vFld, 
				layout : {
					padding : 5
				},
                autoScroll: true,
                html: '',
                title: vFld.fieldLabel || vFld.name ,
                tools: [{
                    type: 'formUpd',
                    itemId : 'edithtml', 
                    tooltip: _SM.__language.Tooltip_Open_HtmlEditor,
                    scope : this,  
                    handler: function(event, target, owner, tool ){
						var myPanel = owner.ownerCt;
						openHtmlEditorWin(myPanel);
                    }
                }],                 
                collapsible : true, 
                flex : 1, 
                
                setReadOnly: function( bReadOnly ) {
					// FIXME: if not visible does not recognize the child
					var obj = this.getHeader();
					if (obj) {
						obj = obj.child('#edithtml');
					}
					if (obj) {
						obj.setVisible(!bReadOnly);
					}
                }
            }); 

            myItems.push(  newPanel ) ;
            this.htmlPanels[ vFld.name ] = newPanel;
        }

        Ext.apply(this, {
            items: myItems
        });

        this.callParent(arguments);
    }    
});


function openHtmlEditorWin( myPanel   )  {

    var myHtmlField = Ext.create( 'ProtoUL.ux.FieldHtmlEditor', { 
            value : myPanel.rawHtml, 
            border: false
	});

    var myWin = Ext.create('Ext.window.Window', {
        title: myPanel.title,
        height: 300,
        width: 720,
        modal : true, 
        layout: 'fit',

        minHeight: 200,
        minWidth: 300,
        resizable: true,
        
        items: myHtmlField ,
        dockedItems : [{
            xtype : 'toolbar',
            dock : 'bottom',
            ui : 'footer',
            items : ['->', {
                iconCls : 'icon-save',
                itemId : 'save',
                text:   _SM.__language.Text_Save_Button,
                scope : this,
                handler : onSave
            }, {
                iconCls : 'icon-reset',
                text:   _SM.__language.Text_Return_Button,
                scope : this,
                handler : onReset
            }]
        }] 
	});
    
    function onSave() {
		var sHtml = myHtmlField.getValue();
		myPanel.update(sHtml);
		myPanel.rawHtml = sHtml;
		myWin.close();
    }

    function onReset() {
		myWin.close();
    }
    
    myWin.show();    
}
/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.ux.Login', {
    extend: 'Ext.form.Panel',
    alias: 'widget.protoLogin',
    bodyStyle: "padding:10px",
    labelWidth: 120,
    labelAlign: 'right',
    redirectUrl: false,
    username: '',

    defaults: {
        xtype: "textfield",
        anchor: "100%",
        enableKeyEvents: true
    },

    initComponent: function() {

        this.submitButton = new Ext.Button({
            text: _SM.__language.Text_Validate_Login_Button,
            iconCls: "st-user-go",
            scope: this,
            handler: this.submitLogin
        });

        this.resetButton = new Ext.Button({
            itemId: 'resetPWDButton',
            text: _SM.__language.Text_Forgotten_Password,
            iconCls: "st-user-who",
            scope: this,
            handler: this.resetPassword
        });

        // If we decide to use a button to change pws using a single page.
        this.changeButton = new Ext.Button({
            text: _SM.__language.Text_change_Password_Button,
            iconCls: "st-key-go",
            scope: this,
            handler: this.changePassword
        });

        Ext.apply(this, {
            items: [{
                fieldLabel: _SM.__language.Textfield_User_Login,
                itemId: 'loginField',
                name: "login",
                value: this.username,
                listeners: {
                    scope: this,
                    keydown: this.onKeyEnter
                }
            }, {
                fieldLabel: _SM.__language.Textfield_Password_Login,
                inputType: "password",
                name: "password",
                listeners: {
                    scope: this,
                    keydown: this.onKeyEnter
                }
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: [{
                    xtype: 'tbtext',
                    flex: 1,
                    itemId: 'stLogin'
                }, this.submitButton, this.resetButton, this.changeButton]
            }]

        });

        this.callParent(arguments);
        this.stLogin = this.dockedItems.items[0].getComponent('stLogin');

        this.on('afterlayout', function() {
            if (this.username == '') {
                this.getForm().findField('login').focus();
            } else {
                this.getForm().findField('password').focus();
            }
        });

    },

    onKeyEnter: function(me, e) {
        if (e.getKey() == e.ENTER) {
            this.submitLogin();
        }
    },

    submitLogin: function(btn) {
        if (!btn) {
            btn = this.submitButton;
        }
        btn.disable();

        var form = this.getForm(), me = this;

        Ext.applyIf(this.options, {
            scope: this,
            success: Ext.emptyFn,
            failure: Ext.emptyFn
        });

        if (form.isValid()) {
            btn.setIconCls("st-loading");
            form.submit({
                method: 'POST',
                url: _SM._PConfig.urlGetUserRights,
                scope: me,

                // waitTitle:'Connecting',
                // waitMsg:'Sending data...',
                // success: this.submitLoginCallback,
                // failure: this.submitLoginCallback,
                success: function(result, request) {
                    _SM._UserInfo = request.result.userInfo;
                    _SM.__language = request.result.language;

                    // Incializa los permisos
                    _SM._UserInfo.perms = {};

                    me.options.success.call(me.options.scope, result, request);
                },
                failure: function(result, request) {
                    try {
                        me.showFormError(request.result.message);
                    } catch(e) {
                        me.showFormError(request.response.responseText);
                    }
                    me.options.failure.call(me.options.scope, result, request);
                }
            });
        } else {
            btn.enable();
        }
    },

    showFormError: function(errMsg) {
        var tip = window.Ext.create('Ext.tip.ToolTip', {
            html: errMsg,
            autoShow: true,
            autoScroll: true,
            focusOnToFront: true,
            autoHide: true,
            stateful: false,
            getTargetXY: function() {
                var resetButton = Ext.ComponentQuery.query('button[itemId=resetPWDButton]')[0];
                var x = resetButton.getPosition()[0];
                var y = resetButton.getPosition()[1];
                return [x, y];
            },
            listeners: {
                hide: function() {
                    tip.destroy();
                    tip = null;
                }
            }
        });
        tip.show();

        this.submitButton.enable();
        this.submitButton.setIconCls("st-user-go");
        this.getForm().findField('login').focus();
    },

    resetPassword: function(btn) {
        var resetForm = Ext.create('ProtoUL.view.password.ForgotPasswordForm');
        resetForm.show();
    },
    
    changePassword: function(btn) {
        Ext.create('ProtoUL.view.password.PasswordReset').show();
    }
});

/* Dgt 1302
 * Generic window that receive a series of typed parameters and return a object with user response
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.ux.parameterWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.parameterWin',

    parameters: [],
    isUpload: false,
    width: 400,
    minWidth: 300,

    title: 'Parameters form',
    layout: 'fit',

    acceptText: 'Accept',
    cancelText: 'Cancel',

    options: {
        acceptFn: null,
        cancelFn: null
    },

    initComponent: function() {
        var ix, myField, me = this, myFields = [];

        for (ix in this.parameters ) {
            myField = _SM.getFormFieldDefinition(this.parameters[ix]);
            myFields.push(myField);
            if (myField.xtype === "filefield"){
                me.isUpload = true;
            }
        }

        Ext.applyIf(this.options, {
            scope: this,
            acceptFn: Ext.emptyFn,
            cancelFn: Ext.emptyFn
        });

        var fnHandler = Ext.emptyFn;
        if (me.isUpload) {
        	fnHandler = me.doUploadAction;
        } else {
        	fnHandler = me.accept;
        }
        var actionButtons = [{
            text: this.cancelText,
            iconCls: "icon-cancel",
            scope: this,
            handler: this.cancel
        }, {
            text: this.acceptText,
            iconCls: "icon-accept",
            scope: this,
            handler: fnHandler,
            disabled: true,
            formBind: true
        }];

        Ext.apply(this, {
            items: [{
                xtype: 'form',
                autoScroll: true,
                monitorValid: true,
                items: [{
                    xtype: 'fieldset',
                    defaultType: 'textfield',
                    layout: "column",
                    defaults: {
                        padding: "2 2",
                        columnWidth: 1
                    },
                    fieldDefaults: {
                        labelAlign: 'left',
                        labelWidth: 150,
                        msgTarget: 'side'
                    },
                    items: myFields
                }],
                buttons: actionButtons
            }]
        });

        me.callParent(arguments);
    },

    accept: function() {

        var form, myFields, myField, myReponse, ix;

        form = this.down('form').getForm();
        if (form.isValid()) {

            myFields = form.getFields().items;
            myReponse = [];

            for (ix in myFields ) {
                myField = myFields[ix];
                myReponse.push({
                    parameter: myField.getName(),
                    value: myField.getValue()
                });
            }
            this.options.acceptFn.call(this.options.scope, myReponse);
            this.close();
        }
    },

    cancel: function() {
        this.options.cancelFn.call(this.options.scope);
        this.close();
    },

    doUploadAction: function() {
        var me = this;
        var form = me.down('form').getForm();
        if (form.isValid()) {
            form.submit({
                url: _SM._PConfig.urlLoadFile,
                method: 'POST',
                waitMsg: 'Uploading your file...',
                success: function(f, a) {
                    var result = a.result, data = result.data;
                    me.close();
                },
                failure: function(f, a) {
                    Ext.Msg.alert('Failure', a.failureType);
                }
            });
        }
    }

});

/**
 * @class ProtoUL.ux.Printer
 * @author  Dario Gomez ,  basado en el Ext.ux.Printer / Ed Spencer (edward@domine.co.uk)

 * Helper class to easily print the contents of a grid. Will open a new window with a table where the first row
 * contains the headings from your column model, and with a row for each item in your grid's store. When formatted
 * with appropriate CSS it should look very similar to a default grid. If renderers are specified in your column
 * model, they will be used in creating the table. Override headerTpl and bodyTpl to change how the markup is generated
 */
Ext.define("ProtoUL.ux.Printer", {
    
    requires: 'Ext.XTemplate',

    statics: {
        /**
         * Prints the passed grid. Reflects on the grid's column model to build a table, and fills it using the store
         * @param {Ext.grid.Panel} grid The grid to print
         */
        gridPrint: function(grid) {
            //We generate an XTemplate here by using 2 intermediary XTemplates - one to create the header,
            //the other to create the body (see the escaped {} below)

            // Filtrar las columas de index y check en caso de q las halla
            var columns = this.getGridColumns( grid ) ;
    
            //build a useable array of store data for the XTemplate
            var data = this.getGridData( grid,  columns) ;
            
            //use the headerTpl and bodyTpl markups to create the main XTemplate below
            var headings = Ext.create('Ext.XTemplate', this.headerTpl).apply(columns);

            var body     = Ext.create('Ext.XTemplate', this.bodyTpl).apply(columns);
            body = Ext.create('Ext.XTemplate', '<tpl for=".">' + body + '</tpl>').apply(data); 
            
            var html1 = this.htmlTpl.toString();
            html1 = html1.replace( /@gridTitle@/g, grid.title );
            html1 = html1.replace( /@siteTitle@/g, _SM._siteTitle );
            html1 = html1.replace( '@headings@', headings );
            html1 = html1.replace( '@body@', body );

            //open up a new printing window, write to it, print it and close
            var win = window.open('', 'printgrid');
            win.document.write(html1);

            if (this.printAutomatically){
				win.document.close();
				win.focus();
                win.print();
                // win.close();
            }
        },

		// This function is used in the app 
        sheetPrint: function(grid, sheetHtml ) {
            //We generate an XTemplate here by using 2 intermediary XTemplates - one to create the header,
            //the other to create the body (see the escaped {} below)

            //use the headerTpl and bodyTpl markups to create the main XTemplate below
			var body = '<hr>' + sheetHtml;
            
            var html1 = this.htmlTpl.toString();
            html1 = html1.replace( /@gridTitle@/g, grid.title );
            html1 = html1.replace( /@siteTitle@/g, _SM._siteTitle );
            html1 = html1.replace( '@headings@', '' );
            html1 = html1.replace( '@body@', body );

            //open up a new printing window, write to it, print it and close
            var win = window.open('', 'printgrid');
            win.document.write(html1);

            if (this.printAutomatically){
                win.print();
            }
        },

        reportPrint: function( win, sheetHtml ) {

            //open up a new printing window, write to it, print it and close
            win.document.write( sheetHtml );
			win.document.close();
			win.focus();
            win.print();

        },



        getGridData: function(grid, columns ) {


            var data = [];
            grid.store.data.each(function(item) {
                var convertedData = [];

                //apply renderers from column model
                for (var key in item.data) {
                    var value = item.data[key];

                    Ext.each(columns, function(column) {
                        if (column.dataIndex == key) {
                            convertedData[key] = column.renderer ? column.renderer(value) : value;
                        }
                    }, this);
                }

                data.push(convertedData);
            });
            
            return data; 
        },  

        getGridColumns: function(grid  ) {

            var columns = [];
    
            // DGT** Creacion de columnas  
            for (var ix in grid.columns ) {
                var col  =  grid.columns[ix];
                if ( col.dataIndex  ) {
                    columns.push(col);          
                   }
			}
            
			return columns;
        },  

        /**
         * @property printAutomatically
         * @type Boolean
         * True to open the print dialog automatically and close the window after printing. False to simply open the print version
         * of the grid (defaults to true)
         */
        printAutomatically: true,
        
        /**
         * @property headerTpl
         * @type {Object/Array} values
         * The markup used to create the headings row. By default this just uses <th> elements, override to provide your own
         */
		headerTpl : ['<tr>', '<tpl for=".">', '<th>{text}</th>', '</tpl>', '</tr>', '</thead>'],

        /**
         * @property bodyTpl
         * @type {Object/Array} values
         * The XTemplate used to create each row. This is used inside the 'print' function to build another XTemplate, to which the data
         * are then applied (see the escaped dataIndex attribute here - this ends up as "{dataIndex}")
         */
		bodyTpl : ['<tr>', '<tpl for=".">', '<td>\{{dataIndex}\}</td>', '</tpl>', '</tr>'],
        
        /**
         * @property htmlTpl  template
         * @type {Object/Array} vars  
         *      @gridTitle@
         *      @siteTitle@
         *      @headings@
         *      @body@
         */
		htmlTpl : '<!DOCTYPE html>' + '<html>' + '<head>' + '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />' + '<link href="/static/css/print.css" rel="stylesheet" type="text/css" media="screen,print" />' + '<title>@gridTitle@</title>' + '</head>' + '<body>' + '<h1>@siteTitle@</h1>' + '<h2>@gridTitle@</h2>' + '<table>' + '<thead>@headings@</thead>' + '<tbody>@body@</tbody>' + '</table>' + '</body>' + '</html>'

    }
});
/*
 *  @Author : Dario Gomez T.  /  Certae Universite Laval Quebec  
 *   
 * Lista ordenable y seleccionable 
 * 
 *      Por ahora solo trabaja con un campo Id, 
 *      V+:  Ampliar con varias columnas 
 */

Ext.define('ProtoUL.ux.ProtoList' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.protoList',

    // @columnList : { dataIndex: ,  hidden : ,  text : [title]  },  Si no viene ninguna por defecto 'data'  
    columnList : ['data'], 

    // @idColumn : Llave unica del registro, ( id )
    idColumn : 'id',       

    // @myList : Lista con los datos iniciales
    // [ 'x', 'y']  o [ [ 'x1', 'y1'], [ 'x2', 'y2'] ]   
    dataList : [], 

    // @dataSelected : Campos seleccionados ( solo la llave )     
    dataSelected : [], 

    // @idTitle
    idTitle : '', 
    
    checkStyle : true, 

    initComponent: function() {

        var me = this ;
        me.addEvents('checked', 'reorder');

        var myColumns = [ '__Checked' ];
        for (var ix in this.columnList ) {
            var vFld = this.columnList[ix] ;
            if ( _SM.typeOf( vFld ) == 'string' ) {
                myColumns.push( vFld );
            }  else if ( vFld.dataIndex ) {
                myColumns.push( vFld.dataIndex );
            }       
        } 
                
        // Se sirve de la definicion de columnas para el store 
        this.gridStore = Ext.create('Ext.data.Store', {
            fields: myColumns,
            idProperty : this.idColumn, 
            data: [] 
        });

        // Inicializac con el checkBox
        var myGridColumns = [];
        if ( me.checkStyle ) {
            myGridColumns = [{
                xtype: 'mycheckcolumn',
                dataIndex: '__Checked', 
                menuDisabled : true, 
                width: 33,  
                listeners: {
                    'checkchange': function( record, recordIndex, checked ){
                        me.fireEvent('checked', record, recordIndex, checked );
                    } 
				},
				scope : me
            }];
        }   

        // DGT** Copia las columnas   
        for (var ix in this.columnList ) {
            var vFld = this.columnList[ix];
            if ( _SM.typeOf( vFld ) == 'string' ) {
                var col = {
					menuDisabled : true,
					flex : 1,
					text : this.idTitle,
                    dataIndex: vFld 
                    };
            }  else if ( vFld.dataIndex ) {
				var col = Ext.apply(vFld, {
					menuDisabled : true
				});
            }
            myGridColumns.push( col  );
            
        }


        var grid = Ext.apply(this, {
            store : this.gridStore,
            stripeRows: true ,
            columns : myGridColumns,
  
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    ddGroup : Ext.id(), 
                    dragText: _SM.__language.ProtoList_DD_Text
                },

                listeners: {
                    drop: function(node, data, overModel, dropPosition,  eOpts) {
                        me.fireEvent('reorder' );
					},
					scope : me
                }                
                 
            }
        }); 

        this.callParent(arguments);

        grid.on({
            sortchange : function (  ct,  column,  direction,  eOpts ) {
                 me.fireEvent('reorder' );
			},
			scope : me
		});
            
        // -----------------
        // Agrega los campos seleccionados 
        this.addDataSet( this.dataList, false );
        this.addDataSet( this.dataSelected, true );
    }, 
    
    addDataSet:  function( dataSet, checked  ) {
        // Selecciona los registros de una lista dada  
        for (var ix in dataSet ) {
            var data  =  dataSet[ix];
            this.addDataItem( data, checked );
        } 
        
    }, 

    addDataItem:  function ( data,  checked  ) {
        // TODO: Por ahora solo maneja un campo Verificar el modelo, por q no se definio con modelo  
        // var rec = new this.gridStore.model()
        // rec.data[id] = data
    
		var dataIx = 'data', dataValue = data, dataRec = {};

        // Take the positional Id (the first is)
        if ( _SM.typeOf( data ) == 'array' ) {
            dataValue = data[0];
        
            // Check the 1st item should be the Id
            vFld = this.columnList[0];
            if ( _SM.typeOf( vFld ) == 'string' ) {
                dataIx = vFld; 
            }  else if ( vFld.dataIndex ) {
                dataIx = vFld.dataIndex;
			} else {
				return;
			}
        }


        var vNode =  _SM.getRecordByDataIx( this.gridStore, dataIx, dataValue  ); 
        if ( ! vNode ) {
            
            if ( _SM.typeOf( data ) == 'string' ) {
				dataRec = {
					'data' : data
				};
            } else {

                for (var ix in this.columnList ) {
                    var vFld = this.columnList[ix]; 
                    if ( _SM.typeOf( vFld ) == 'string' ) {
                        dataRec[ vFld ] = data[ ix ]; 
                    }  else if ( vFld.dataIndex ) {
                        dataRec[ vFld.dataIndex ] = data[ ix ];
                    }       
                } 
            }
            
			if (checked == true || checked == false) {
				dataRec['__Checked'] = checked;
			}
            this.gridStore.add( dataRec );
            
        }  else if ( checked ){
            vNode.set( '__Checked', checked );
        }        

    }, 

    removeAll:  function () {
        this.gridStore.removeAll(  );
    }, 


    getList: function () {

        var myList = [];
        this.gridStore.each(function(record){
          myList.push( record.get( 'data' ));
         });
        return myList;
    }, 
    
    getChecked: function () {

        var chkList = [];
        this.gridStore.each(function(record){
			if (record.get('__Checked')) {
              chkList.push( record.get( 'data' ));
			}
         });
        
        return chkList;
    }, 

    setChecked: function ( data, checked  ) {
        // Cambia el estado de seleccion de un registro
        // Que hace si no existe y es check? Lo crea por q es posible q se inserten dos colecciones base y selected   

        var vNode =  _SM.getRecordByDataIx( this.gridStore, 'data', data  ); 
        if ( vNode ) {
            vNode.set( '__Checked', checked );
        } else { 
			this.gridStore.add({
				'data' : data,
				'__Checked' : checked
			});
        } 
    }, 

    addOrRemove: function( data, checked ) {
        // Permite agregar o elimar un registro dependiendo del estado   
        if ( checked )  {
            this.setChecked(  data,  true  );
        } else {
            var vNode =  _SM.getRecordByDataIx( this.gridStore, 'data', data  ); 
            if (  vNode  )   {
                this.gridStore.remove( vNode );
            }
        }
    }
});

/*
 *  @Author : Dario Gomez T.  /  Certae Universite Laval Quebec
 *
 *  Enhanced PopertyGrid,
 *      comboProperties
 *      editable   ( True/ False )
 *      QTips
 *      Types
 *
 *  TODO:  OnKey Delete  borrar el valor de la propiedad
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.ux.ProtoProperty', {
    extend : 'Ext.grid.property.Grid',
    alias : 'widget.protoProperty',
    itemId: 'protoProperty',
    source : {},
    readOnlyProps : [],
    editable : true,
    sourceInfo : {},
    sourceConfig : {},

    initComponent : function() {
        var me = this;

        Ext.apply(this, {
            stripeRows : true,
            clicksToEdit : 2,
            source : this.source,
            listeners : {
                'beforeedit' : function(editor, e, eOpts) {
                    if ((!me.editable ) || e.record.data.name in _SM.objConv(me.readOnlyProps)) {
                        return false;
                    }
                },
                'itemmouseenter' : function(view, record, item) {
                    var prpName = record.get('name'), msg = me.sourceInfo[prpName];
                    if (prpName && prpName in _SM.objConv(me.readOnlyProps)) {
                        prpName += ' [RO]';
                    }
                    if (msg) {
                        Ext.fly(item).set({
                            'data-qtip' : msg,
                            'data-qtitle' : prpName
                        });
                    }
                },
                scope : me
            }
        });

        this.callParent(arguments);
    },

    setCombos : function(__ptCombos) {
        var prp, l1, cbStore, cbEditor, cbField = 'cbValue', stData;

        if (!__ptCombos) {
            return;
        }

        // Recorre los objetos y busca la definicion de combos
        for (prp in __ptCombos ) {

            l1 = __ptCombos[prp];
            stData = [];
            for ( i = 0; i < l1.length; i++) {
                stData.push({
                    'cbValue' : l1[i]
                });
            }

            // Si ya existe continua ( los objetos no deben tener el mismo nombre )
            if (this.sourceConfig[prp] || _SM.typeOf(l1) !== 'array') {
                continue;
            }

            cbStore = Ext.create('Ext.data.Store', {
                fields : [cbField],
                data : stData
            });

            // Create the combo box, attached to the states data store
            cbEditor = Ext.create('Ext.form.ComboBox', {
                store : cbStore,
                editable : false,
                queryMode : 'local',
                displayField : cbField,
                valueField : cbField
            });

            this.sourceConfig[prp] = {
                editor : cbEditor
            };

        }

    },

    setTypes : function(__ptTypes) {
        var prp, myType, myEditor;
        if (!__ptTypes) {
            return;
        }

        // La idea es generar un customEditor para los campos definidos,
        // copiando el editor que define por defecto el objeto
        // Debe definirse despues de los combos pues la definicion de combo resetea customEditor

        // Recorre los objetos y busca la definicion de typo
        for (prp in __ptTypes ) {

            // Si ya existe continua
            if (this.sourceConfig[prp]) {
                continue;
            }
            // Los tipos definidos son :  'date','string', 'number', 'boolean'
            myType = __ptTypes[prp];
            myEditor = this.editors[myType];
            if (myEditor) {
                this.sourceConfig[prp] = myEditor;
            }
        }
    }
});
Ext.define('Ext.ux.protoQBE', {
    extend: 'Ext.window.Window',
    alias: 'widget.protoqbe',
    iconCls: 'icon-filter',

    viewCode: null,
    defaultType: 'textfield',
    autoHeigth: true,

    resizable: false,
    plain: true,
    modal: true,

    titulo: '',
    campos: {},

    aceptar: function() {
    },
    cancelPress: function() {
    },

    initComponent: function() {
        me = this;

        var fields = new Array();

        if (me.titulo !== '')
            me.titulo = '-' + me.titulo;

        var resp = me.campos;
        for ( i = 0; i < resp.length; i += 1) {
            var nom = '';
            if (resp[i].required == true) {
                var req = _SM._requiredField;
                nom = '<strong>' + resp[i].name + '</strong>';
            } else {
                nom = resp[i].name;
                var req = "";
            }

            fields.push({
                fieldLabel: Ext.util.Format.capitalize(nom),
                afterLabelTextTpl: req,
                name: resp[i].name,
                allowBlank: !resp[i].required,
                width: 300,
                viewCode: me.viewCode,
                editable: true,
                xtype: "HelpQbe",
                hideTrigger: !resp[i].qbeHelp,
                enterKey: this.accept
            });

        }

        Ext.applyIf(me, {

            title: me.viewCode + me.titulo,

            items: [{
                xtype: 'form',
                items: fields,
                autoScroll: true,
                labelWidth: 150,
                autoHeigth: true,
                maxHeight: 400,
                width: 350,
                flex: 1,

                monitorValid: true,
                frame: true,
                bodyStyle: 'padding:5px 10px 0',
                buttons: [{
                    xtype: 'button',
                    width: 10,
                    text: _SM.__language.Text_Accept_Button,
                    formBind: true,
                    iconCls: "icon-accept",
                    handler: this.accept

                }, {
                    xtype: 'button',
                    text: _SM.__language.Text_Cancel_Button,
                    iconCls: "icon-cancel",
                    width: 10,
                    handler: this.cancel
                }]

            }]

        });


        me.callParent(arguments);
    },

    accept: function() {
        var form = me.down('form').getForm();
        if (form.isValid()) {
            var campos = me.down('form').items.items;
            arrFilterQbe = new Array();
            var qbe = '';
            for ( i = 0; i < campos.length; i++) {
                if (campos[i].getValue().trim() !== '') {
                    var t = {
                        property: campos[i].getName(),
                        filterStmt: campos[i].getValue()
                    };
                    arrFilterQbe.push(t);
                }
            }

            me.aceptar(arrFilterQbe);
            me.close();
        }

    },

    cancel: function() {
        me.cancelPress();
        me.close();
    }
});
/*
 * Barra de busqueda 
 */


Ext.define('ProtoUL.ux.ProtoSearchBG', {
    extend : 'Ext.toolbar.Toolbar',
    alias :  'widget.protoSearch',

    /**
     * @private
     * MetaData  initialization
     */
    myMeta: null, 

    /**
     * @private
     * Component initialization override:  ToolBar setup
     */
    initComponent : function() {

        var me = this;
        var myMeta = this.myMeta; 

        
        // Load Data button 
        var searchBtn = new Ext.button.Button({
            tooltip: _SM.__language.Tooltip_Filter_Grid_Button,
            iconCls: 'icon-filter', 
            handler: onClickSearchBtn
        });

        // var QBEBtn = new Ext.button.Button({
            // tooltip: _SM.__language.Text_Toolbar_Advanced_Filter,
            // iconCls: 'icon-filterqbe',
            // handler: onClickViewQBE
        // });

        var clearBtn = new Ext.button.Button({
            tooltip: _SM.__language.Text_Toolbar_Remove_Filters,
            handler: onClickClearFilter,
            iconCls: 'icon-filterdelete'
        });
        
        // Criteria 
        var searchCr = new Ext.form.TextField({
            emptyText: _SM.__language.Text_Toolbar_Search_Field,
            enableKeyEvents : true,  
            width: 200, 
            listeners: {
                keydown: function( me, e ) { 
                    if (e.getKey() == e.ENTER ) {
                        onClickSearchBtn ( searchBtn  );
                       }
                }}
        });

        me.protoEnable =  ( me.myMeta.gridConfig.searchFields.length > 0  ) ;

        Ext.apply(me, {
            border : false,
            disabled : ! me.protoEnable,
            items:  [  
                searchCr,
                searchBtn,
                // QBEBtn,
                clearBtn 
            ]
        });


        me.addEvents('qbeLoadData');
        me.callParent();
        
        // Inicializa Combos 
        clearCombos();     

        function onClickSearchBtn ( btn ) { 
            var sFilter = searchCr.getValue();
            var sTitle = '" ' + searchCr.getValue() + ' "';
            
            me.fireEvent('qbeLoadData', me, [{ 'property' :  '_allCols' , 'filterStmt' : sFilter }], sTitle );
        }
    
        //BG 
        function onClickClearFilter (item ){
            // resetea los fitros tambien 
            clearCombos();
            me.fireEvent('qbeLoadData', me, [], '' , [] );
        }

        function onClickViewQBE(item) {
            data = me.myMeta;
            resp = data.fields;
            
            var QBE = Ext.create('Ext.ux.protoQBE', {
                
                campos: data.fields,
                viewCode: data.viewCode,
                titulo: data.shortTitle,
                aceptar: function (qbe) {
                    console.log('ok');
                    // TODO: preparar el titulo del qbe, con campo y valor 
                    me.fireEvent('qbeLoadData', me, qbe, '** qbe' );
                }
            }).show();
               
        }

        //BG
        function clearCombos ( ){
            // comboCols.setValue('');
            // comboOp.setValue(''); 
            searchCr.setValue(''); 
        } 
    
    } 

});


/**
 * @class ProtoUL.ux.ProtoZoom
 * @extends Ext.form.field.Trigger
 * <p>Field with search fk model</p>
 * @author Dario Gomez 
 */

/* 
 * Para cargar la info en los campos relacionados en la grilla disparar un evento desde aqui,  al momento de aceptar 
 * Cambiar el text del campo, 
 * 
 * 
 * En la definicion del editor con el protozoom definir una coleccion de id's a los objetos zoom,  y seguir los eventos 
 * 
 * De esta forma en la grilla puedo saber el registro q se esta editando antes del commit y modificar los cmpos necesarios 
 * directamente en el store ( record ) de la grilla 
 * 
 * 
 * Otra posivble soluicion es guardar el Id y asociar la descripcion para luego renderizarla
 * 
 * Verificar si dinamicamente puedo pegar el registro del zoom en el campo para q pueda ser recuperado por el evento beforecommit 
 *  
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */
 
Ext.define('ProtoUL.ux.protoZoom', {
    extend : 'Ext.form.field.Trigger',
    alias : 'widget.protoZoom',
    
    // * Zoom initialization
    zoomModel: null, 
    zoomGrid : null, 
    zoomRecord: null, 

    zoomRecords: null, 
    zoomMultiple : false, 

    //trigger button cls 
    triggerCls : Ext.baseCSSPrefix + 'form-search-trigger',
    // readOnlyCls : 'protoLink', 

    /**
     * @private
     * Indica si todos los atributos de configuracion fueron cargados, permitiria reutilizar la forma solo cambiando el filtro 
     */
    isLoaded : false,
    handleMouseEvents: true,

    /*  Formato de Link
    fieldStyle: 'color: -webkit-link !important;text-decoration: underline !important;cursor: auto !important;', 
    fieldCls: 'protoLink',
     */

    initComponent : function() {
        var me = this; 
        this.callParent(arguments);
        
        // Para activar el evento con ENTER 
        this.on(
            'specialkey', function(f, e) {
                if (e.getKey() == e.ENTER) {
                    this.onTriggerClick( );
                }
            }, 
        this);
    },
    
    listeners: {
        'render': function( cmp1 ) { 
            cmp1.getEl().on('click', this.onClickLink, this );}
    }, 

    onClickLink: function ( ev, nd ) {
        // La funcion Link solo se activa si es readOly 
        if ( ! this.readOnly  ) { return; } 
        if ( nd.nodeName == "LABEL" ) { return; } 

        this._loadZoom( this.doClickLink  ); 
    }, 

    _loadZoom: function( fnBase, opts  ) {
        var me = this,  
            options =  {
                scope: me, 
                success: function ( obj, result, request ) {
                    me.createZoomWindow( me );
                    fnBase.call( me, me, opts );
                },
                failure: function ( obj, result, request) { 
                    return ;  
                }
            };

        if (  _SM.loadPci( me.zoomModel , true, options ) ) {
            me.createZoomWindow( me ); 
            fnBase.call( me, me, opts );
        }   
 
    }, 
    

    doClickLink: function ( me ) {
        
        var formController = Ext.create('ProtoUL.UI.FormController', {});
        formController.openProtoForm.call( formController, me.zoomModel, me.fkIdValue , false   ); 
        
    }, 
    
    createZoomWindow:  function ( me  ){
        // @ZoomRaise 

        function doCancel() {
            me.resetZoom();
            me.win.hide();
        }

        // function doNew() {
            // var formController = Ext.create('ProtoUL.UI.FormController', { myMeta : me.myMeta });
            // formController.openNewForm ( this.zoomGrid.store  );
        // }
        // function doEdit() {
            // if ( ! this.zoomGrid.selected ) {
                // _SM.errorMessage(_SM.__language.Title_Form_Panel, _SM.__language.GridAction_NoRecord);
                // return; 
            // }
            // var formController = Ext.create('ProtoUL.UI.FormController', { 
                // myMeta : me.myMeta
             // });
            // formController.openLinkedForm ( this.zoomGrid.selected    );
        // }
        
        if ( me.isLoaded ) { return; } 

        me.myMeta = _SM._cllPCI[ me.zoomModel ] ; 

        // Para identificar el StatusBar 
        me.idStBar = Ext.id();

        var selMode = 'single';
        if ( me.zoomMultiple && me.newForm ) { selMode = 'multi'; }
        
        // Crea la grilla 
        this.zoomGrid = Ext.create('ProtoUL.view.ProtoGrid', { 
            gridSelectionMode : selMode,  
            viewCode  : me.zoomModel,
            // initialFilter : [{ 'property' : 'pk', 'filterStmt' :  -1 }], 
            initialFilter : [], 
            
            hideSheet    : true,  
            listDisplay  : '__str__'   
         }) ; 
             
             
        var searchBG = Ext.create('ProtoUL.ux.ProtoSearchBG', { myMeta: me.myMeta });

        this.zoomGrid.on({
            selectionChange: {fn: function ( selModel, record, rowIndex,  eOpts ) {
                me.setSelected( rowIndex, record, selModel );
            }, scope: this }
        });

        this.zoomGrid.on({
            rowDblClick: {fn: function ( record, rowIndex ) {
                me.setSelected( rowIndex, record );
                me.doReturn();
            }, scope: me }
        });

        searchBG.on({
            qbeLoadData: {fn: function ( searchBG , sFilter, sTitle , sorter ) {
                me.resetZoom();
                this.zoomGrid.gridLoadData( this.zoomGrid, sFilter, sorter );
            }, scope: this }
        });                 

        //@@ Verificar los permisos de usuario 
        var perms = _SM._UserInfo.perms[ me.myMeta.viewCode ], 
            zoomBtns = [
                    { xtype: 'tbtext', text: '', id: me.idStBar , flex: 1, readOnly : true  },
                    { xtype: 'button', text: _SM.__language.Text_Cancel_Button, scope: me, handler: doCancel   }, 
                    { xtype: 'button', text: 'Ok', scope: me, handler: me.doReturn } 
                ]; 

        // if ( perms['change'] ) {
            // zoomBtns.push( { xtype: 'button', text: 'Edit', scope: me, handler: doEdit } )
        // }
        // if ( perms['add'] ) {
            // zoomBtns.push( { xtype: 'button', text: 'New', scope: me, handler: doNew  } )
        // }
        
        // referencia a la ventana modal
        me.win  = Ext.widget('window', {
            title : 'Zoom : ' + me.myMeta.shortTitle,
            constrainHeader : true,
            iconCls: me.myMeta.viewIcon , 
            closeAction : 'hide',
            layout : 'fit',
            modal : true,
            width     : 800,     minWidth  : 400,
            height  : 600,  minHeight : 400, 
            resizable : true,
            tbar :  searchBG, 
            items : this.zoomGrid,

            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                defaults: {minWidth: 75},
                items: zoomBtns
            }]            

        });

        me.isLoaded = true;
        this.zoomGrid.setEditMode( true );
        
    }, 
    
    onTriggerClick : function (  ) {
        this._loadZoom( this.doTriggerClick ) ;
    }, 
    
    doTriggerClick : function( me ) {

        me.showZoomForm( me );
    },
    
    showZoomForm : function(me) {
        if ( ! me.isLoaded  ) { return; }
        
        // TODO: verifica el zoomFilter 
        var myZoomFilter = getFilter();
        if ( myZoomFilter) { if ( myZoomFilter.length > 0 ) {
            this.zoomGrid.store.mySetBaseFilter( myZoomFilter );
        }} 

        me.win.show();
        
        function getFilter() {

            /*  zoomFilter = "field1 : condition ; 
             *                field2 : [refCampoBase]; campo : 'vr'; 
             *                field3 = @functionX( [refCampoBase], [refCampoBase] ); .. "
             *  Ej:          "model_id : @getEntityModel( [entity_id]) "
            */ 
            var myFilter = me.zoomFilter;
            
            if (!me.zoomFilter) {
                return myFilter;
            }
            if (!me.idProtoGrid) {
                return myFilter;
            }  
                        
            // Obtiene los parametros ( campos en el registro base )
            // var lFilters = me.zoomFilter.match(/[^[\]]+(?=])/g)
            var lFilters =    me.zoomFilter.match(/\(([^()]+)\)/g);
            
            if ( lFilters ) if  ( lFilters.length > 0 ) { 

                //obtiene la meta 
                var myGridBase = Ext.getCmp( me.idProtoGrid ); 
                
                // Remplaza en el filtro 
                for ( var i in lFilters ) {
                    var fStmt = lFilters[i].replace('(', '').replace(')', '').split(',');
                    for ( var ix in fStmt ) {
                        var fName = fStmt[ix], 
						    fVal = getValueOrDefault(  myGridBase, fName );
                        
                        myFilter = myFilter.replace( '{0}'.format( fName ),  '{0}'.format( fVal)  );
                     }
                }
            } 

            // Separa el filtro para generar el array 
            myFilter = myFilter.split( ';'); 
            for ( i = 0; i < myFilter.length; i++) {
                var lFilter =  myFilter[i].split(':'); 
                myFilter[i] = { 'property' : lFilter[0].trim(), 'filterStmt' : lFilter[1].trim() };   
            }
            return myFilter;
        }
        
        function getValueOrDefault( myGridBase, fName ) {
         	var fVal;
         	try {
	            if ( myGridBase.rowData ) { 
	                fVal =  myGridBase.rowData[ fName.trim() ];
	        	} else {
	        		fVal  = myGridBase.myFieldDict[ fName.trim() ]['prpDefault'];
	    		}
	    	} catch(e)  { fVal = '-1'; } 
 
			return fVal; 
        }
        
    }, 
    
    setSelected: function  ( rowIndex, record, selModel) {
        // @ZoomSelection 
        
        var stBar = Ext.getCmp( this.idStBar ),
            me = this,  
            ix ;

        function getZoomReturn( record ) {
            var recStr; 
            if (! record  )  return ;
            if ( me.myMeta.returnField ) {
                recStr = record.get( me.myMeta.returnField );
            } else {
                recStr = record.get( '__str__' ) || me.myMeta.viewCode + '.str?';
            }
            return { 'name' : me.name, 'fkId' : me.fkId, 'recId' : record.get( 'id') , 'recStr' : recStr }; 
        };
        
        if ( me.zoomMultiple && me.newForm && selModel ) {
            me.zoomRecords =[];
            var cllSelection = selModel.getSelection();  
            for ( ix in cllSelection ) {
                me.zoomRecords.push(  getZoomReturn( cllSelection[ix] ) );
            } 
            
            var strAux = '';
            for ( ix in me.zoomRecords ) {
                strAux += me.zoomRecords[ix].recStr + ';'; 
            }
            stBar.setText( strAux );
            me.retField = strAux; 
            
        } else if ( record ) {
            var zoomRet = getZoomReturn( record );   
            
            me.zoomRecord = record;
            me.retField = zoomRet.recStr; 
            
            stBar.setText( '[' + zoomRet.recId.toString() + ']  ' + zoomRet.recStr );
            
        } else  {
            me.zoomRecord = null; 
            me.zoomRecords =null;
            stBar.setText('');    
        } 
        
    }, 
    
    doReturn: function() {
        // @ZoomReturn 
        // Asigna el returnField al text de base  
        this.setValue( this.retField ); 
        this.win.hide();
    }, 
    
    resetZoom: function() {
        this.setSelected( );
    }
    
    // setReadOnly: function(readOnly) {
        // if (readOnly != this.readOnly) {
            // this.setReadOnly( true ); 
            // // this.readOnly = readOnly;
            // // if ( readOnly ) {
                // // this.fieldCls = 'protoLink'
                // // this.addCls( 'protoLink' ) 
            // // } else if ( hasCls( 'protoLink' )) {
                // // this.removeCls( 'protoLink' ) 
            // // }
            // // this.updateLayout();
        // }
    // }

});


// String format function if not exist 
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

// _SM.trim = function ( str ) { 
    // return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
// }
/*
 * Basada en  Examples.Ux.statusBar
 *
 * Modif :
 *
 *      showBusy  -->  showBusyI  ( internal )
 *      showBusy ( text ,  clearTemp  ) para autolimpiar el status
 *
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.ux.StatusBar', {
    extend: 'Ext.toolbar.Toolbar',
    alternateClassName: 'Ext.ux.StatusBar',
    alias: 'widget.statusbar',
    requires: ['Ext.toolbar.TextItem'],
    cls: 'x-statusbar',

    busyIconCls: 'x-status-busy',
    busyText: _SM.__language.StatusBar_Message_Loading,
    autoClear: 5000,
    emptyText: '&#160;',
    activeThreadId: 0,

    // defaults to use when the status is cleared:
    defaultText: '',
    // defaultIconCls: 'x-status-valid',

    // values to set initially:
    text: _SM.__language.StatusBar_Message_Ready,
    iconCls: 'ready-icon',

    // Para manejar las cargas de datos del servidor
    busyCount: 0,

    initComponent: function() {

        var right = this.statusAlign === 'right';
        this.callParent(arguments);
        this.currIconCls = this.iconCls || this.defaultIconCls;
        this.statusEl = Ext.create('Ext.toolbar.TextItem', {
            cls: 'x-status-text ' + (this.currIconCls || ''),
            text: this.text || this.defaultText || ''
        });
        if (right) {
            this.cls += ' x-status-right';
            this.add('->');
            this.add(this.statusEl);
        } else {
            this.insert(0, this.statusEl);
            this.insert(1, '->');
        }

        // any standard Toolbar items:
        this.add([{
            itemId: 'btClearCache',
            xtype: 'button',
            text: _SM.__language.StatusBar_Text_Clean_Button + ' cache',
            tooltip: _SM.__language.StatusBar_Tooltip_Clean_Button,
            iconCls: 'comment_delete',
            handler: function() {
                this.tooltip = '';
                this.ownerCt.clearStatus({
                    useDefaults: true
                });
                _SM.__TabContainer.closeAllTabs();
                _SM._cllPCI = {};
            }
        }, {
            itemId: 'openTaskForm',
            xtype: 'button',
            text: _SM.__language.StatusBar_Text_Task_Button,
            hidden: true,
            scope: this,
            iconCls: 'taskManager',
            handler: this.openTaskForm

        }, '-', {

            xtype: 'splitbutton',
            text: _SM._UserInfo.fullName || _SM._UserInfo.userName,
            iconCls: 'icon-user',
            menu: new Ext.menu.Menu({
                items: [{
                    text: _SM.__language.StatusBar_Text_Close_Session,
                    handler: this.closeSession,
                    iconCls: 'icon-logout'
                }]
            })
        }]);

        // TODO: Boton q permita clear del sb y guarde en el tooltip la informacion de errores
        this.errBt = this.getComponent('btClearCache');

    },

    command: function() {
        Ext.MessageBox.prompt('Comando', 'Digite El Comando', function(btn, nemo) {
            if (btn == 'ok') {

            }
        }, this, false, ValorPrompt);
    },

    closeSession: function() {
        Ext.Ajax.request({
            url: _SM._PConfig.urlLogOut,
            success: function(response) {
                location.reload(true);
            },
            failure: function() {
                location.reload(true);
            }
        });
    },

    clearErrCount: function() {
        // this.errBt.hide()

        this.errBt.tooltip = '';
        this.busyCount = 0;
        this.clearStatus({
            useDefaults: true
        });
    },

    setStatus: function(o) {
        var me = this;
        o = o || {};

        var a = me.isLayoutSuspended();

        Ext.suspendLayouts();

        if (Ext.isString(o)) {
            o = {
                text: o
            };
        }
        if (o.text !== undefined) {
            me.setText(o.text);
        }
        if (o.iconCls !== undefined) {
            me.setIcon(o.iconCls);
        }
        if (o.clear) {
            var c = o.clear, wait = me.autoClear, defaults = {
                useDefaults: true,
                anim: true
            };
            if (Ext.isObject(c)) {
                c = Ext.applyIf(c, defaults);
                if (c.wait) {
                    wait = c.wait;
                }
            } else if (Ext.isNumber(c)) {
                wait = c;
                c = defaults;
            } else if (Ext.isBoolean(c)) {
                c = defaults;
            }
            c.threadId = this.activeThreadId;
            Ext.defer(me.clearStatus, wait, me, [c]);
        }
        Ext.resumeLayouts(true);
        return me;
    },

    clearStatus: function(o) {
        o = o || {};
        var me = this, statusEl = me.statusEl;
        if (o.threadId && o.threadId !== me.activeThreadId) {
            return me;
        }
        var text = o.useDefaults ? me.defaultText : me.emptyText, iconCls = o.useDefaults ? (me.defaultIconCls ? me.defaultIconCls : '') : '';
        if (o.anim) {
            statusEl.el.puff({
                remove: false,
                useDisplay: true,
                callback: function() {
                    statusEl.el.show();
                    me.setStatus({
                        text: text,
                        iconCls: iconCls
                    });
                }
            });
        } else {
            me.setStatus({
                text: text,
                iconCls: iconCls
            });
        }
        return me;
    },

    setText: function(text) {
        var me = this;
        me.activeThreadId++;
        me.text = text || '';
        if (me.rendered) {
            me.statusEl.setText(me.text);
        }
        return me;
    },

    getText: function() {
        return this.text;
    },

    setIcon: function(cls) {
        var me = this;
        me.activeThreadId++;
        cls = cls || '';
        if (me.rendered) {
            if (me.currIconCls) {
                me.statusEl.removeCls(me.currIconCls);
                me.currIconCls = null;
            }
            if (cls.length > 0) {
                me.statusEl.addCls(cls);
                me.currIconCls = cls;
            }
        } else {
            me.currIconCls = cls;
        }
        return me;
    },

    showBusyI: function(o) {
        if (Ext.isString(o)) {
            o = {
                text: o
            };
        }
        o = Ext.applyIf(o || {}, {
            text: this.busyText,
            iconCls: this.busyIconCls
        });
        return this.setStatus(o);
    },

    showBusy: function(text, origin, clear) {

        this.showBusyI(text);

        if (clear) {
            Ext.defer(function() {
                this.clearStatus({
                    useDefaults: true
                });
            }, clear, this);
        } else {
            // console.log( 'busy: ' + origin,  text, this.busyCount )
            this.busyCount++;
        }
    },

    showMessage: function(text, origin, clear) {

        var o = {
            text: origin + ' ' + text,
            iconCls: this.iconCls
        };

        if (clear) {
            Ext.defer(function() {
                this.clearStatus({
                    useDefaults: true
                });
            }, clear, this);
        }

        return this.setStatus(o)

    },

    showError: function(text, origin) {

        // console.log( 'error :' + origin  ,  text )
        this.setStatus({
            text: 'Oops! ' + text,
            iconCls: 'x-status-error',
            clear: true
        });

    },

    showWarning: function(text, origin) {

        // console.log( 'warning :' + origin, text )

        this.setStatus({
            text: text,
            iconCls: 'x-status-warning',
            clear: true
        });

    },

    clear: function(text, origin) {

        // console.log( 'clear:' + origin,  text, this.busyCount );
        this.busyCount--;
        if (this.busyCount <= 0) {
            this.busyCount = 0;
            this.clearStatus({
                useDefaults: true
            })
        }

    },

    openTaskForm: function() {

        var taskCont = Ext.create('ProtoUL.protoOrg.tasks.TaskController')
        taskCont.openTaskForm()

    }
}); 
/**
 * Plugin for adding a close context menu to tabs. Note that the menu respects
 * the closable configuration on the tab. As such, commands like remove others
 * and remove all will not remove items that are not closable.
 * 
 * TODO:  Implementar, viene de  http://docs.sencha.com/ext-js/4-1/extjs-build/examples/tabs/tabs-adv.js
 * 
 */
Ext.define('Ext.ux.TabCloseMenu', {
    alias: 'plugin.tabclosemenu',

    mixins: {
        observable: 'Ext.util.Observable'
    }, 

    /**
     * @cfg {String} closeTabText
     * The text for closing the current tab.
     */
    closeTabText: _SM.__language.Text_Close_Tab,

    /**
     * @cfg {Boolean} showCloseOthers
     * Indicates whether to show the 'Close Others' option.
     */
    showCloseOthers: true,

    /**
     * @cfg {String} closeOtherTabsText
     * The text for closing all tabs except the current one.
     */
    closeOthersTabsText: _SM.__language.Text_Close_Other_Tabs,

    /**
     * @cfg {Boolean} showCloseAll
     * Indicates whether to show the 'Close All' option.
     */
    showCloseAll: true,

    /**
     * @cfg {String} closeAllTabsText
     * <p>The text for closing all tabs.
     */
    closeAllTabsText: _SM.__language.Text_Close_All_Tabs,

    /**
     * @cfg {Array} extraItemsHead
     * An array of additional context menu items to add to the front of the context menu.
     */
    extraItemsHead: null,

    /**
     * @cfg {Array} extraItemsTail
     * An array of additional context menu items to add to the end of the context menu.
     */
    extraItemsTail: null,

    //public
    constructor: function (config) {
        this.addEvents(
            'aftermenu',
            'beforemenu');

        this.mixins.observable.constructor.call(this, config);
    },

    init : function(tabpanel){
        this.tabPanel = tabpanel;
        this.tabBar = tabpanel.down("tabbar");

        this.mon(this.tabPanel, {
            scope: this,
            afterlayout: this.onAfterLayout,
            single: true
        });
    },

    onAfterLayout: function() {
        this.mon(this.tabBar.el, {
            scope: this,
            contextmenu: this.onContextMenu,
            delegate: 'div.x-tab'
        });
    },

    onBeforeDestroy : function(){
        Ext.destroy(this.menu);
        this.callParent(arguments);
    },

    // private
    onContextMenu : function(event, target){
        var me = this,
            menu = me.createMenu(),
            disableAll = true,
            disableOthers = true,
            tab = me.tabBar.getChildByElement(target),
            index = me.tabBar.items.indexOf(tab);

        me.item = me.tabPanel.getComponent(index);
        menu.child('*[text="' + me.closeTabText + '"]').setDisabled(!me.item.closable);

        if (me.showCloseAll || me.showCloseOthers) {
            me.tabPanel.items.each(function(item) {
                if (item.closable) {
                    disableAll = false;
                    if (item != me.item) {
                        disableOthers = false;
                        return false;
                    }
                }
                return true;
            });

            if (me.showCloseAll) {
                menu.child('*[text="' + me.closeAllTabsText + '"]').setDisabled(disableAll);
            }

            if (me.showCloseOthers) {
                menu.child('*[text="' + me.closeOthersTabsText + '"]').setDisabled(disableOthers);
            }
        }

        event.preventDefault();
        me.fireEvent('beforemenu', menu, me.item, me);

        menu.showAt(event.getXY());
    },

    createMenu : function() {
        var me = this;

        if (!me.menu) {
            var items = [{
                text: me.closeTabText,
                scope: me,
                handler: me.onClose
            }];

            if (me.showCloseAll || me.showCloseOthers) {
                items.push('-');
            }

            if (me.showCloseOthers) {
                items.push({
                    text: me.closeOthersTabsText,
                    scope: me,
                    handler: me.onCloseOthers
                });
            }

            if (me.showCloseAll) {
                items.push({
                    text: me.closeAllTabsText,
                    scope: me,
                    handler: me.onCloseAll
                });
            }

            if (me.extraItemsHead) {
                items = me.extraItemsHead.concat(items);
            }

            if (me.extraItemsTail) {
                items = items.concat(me.extraItemsTail);
            }

            me.menu = Ext.create('Ext.menu.Menu', {
                items: items,
                listeners: {
                    hide: me.onHideMenu,
                    scope: me
                }
            });
        }

        return me.menu;
    },

    onHideMenu: function () {
        var me = this;

        me.item = null;
        me.fireEvent('aftermenu', me.menu, me);
    },

    onClose : function(){
        this.tabPanel.remove(this.item);
    },

    onCloseOthers : function(){
        this.doClose(true);
    },

    onCloseAll : function(){
        this.doClose(false);
    },

    doClose : function(excludeActive){
        var items = [];

        this.tabPanel.items.each(function(item){
            if(item.closable){
                if(!excludeActive || item != this.item){
                    items.push(item);
                }
            }
        }, this);

        Ext.each(items, function(item){
            this.tabPanel.remove(item);
        }, this);
    }
});

/**
 * @class Ext.ux.TabScrollerMenu
 * @extends Object
 * Plugin (ptype = 'tabscrollermenu') for adding a tab menu to a TabBar is the Tabs overflow.
 * @constructor
 * @param {Object} config Configuration options
 * @ptype tabscrollermenu

 * TODO:  Implementar, viene de  http://docs.sencha.com/ext-js/4-1/extjs-build/examples/tabs/tab-scroller-menu.html    

 */
Ext.define('Ext.ux.TabScrollerMenu', {
    alias: 'plugin.tabscrollermenu',

    uses: ['Ext.menu.Menu'],

    /**
     * @cfg {Number} pageSize How many items to allow per submenu.
     */
    pageSize: 10,
    /**
     * @cfg {Number} maxText How long should the title of each {@link Ext.menu.Item} be.
     */
    maxText: 15,
    /**
     * @cfg {String} menuPrefixText Text to prefix the submenus.
     */
    menuPrefixText: 'Items',
    constructor: function(config) {
        config = config || {};
        Ext.apply(this, config);
    },
    //private
    init: function(tabPanel) {
        var me = this;

        Ext.apply(tabPanel, me.parentOverrides);
        me.tabPanel = tabPanel;

        tabPanel.on({
            render: function() {
                me.tabBar = tabPanel.tabBar;
                me.layout = me.tabBar.layout;
                me.layout.overflowHandler.handleOverflow = Ext.Function.bind(me.showButton, me);
                me.layout.overflowHandler.clearOverflow = Ext.Function.createSequence(me.layout.overflowHandler.clearOverflow, me.hideButton, me);
            },
            single: true
        });
    },

    showButton: function() {
        var me = this,
            result = Ext.getClass(me.layout.overflowHandler).prototype.handleOverflow.apply(me.layout.overflowHandler, arguments);

        if (!me.menuButton) {
            me.menuButton = me.tabBar.body.createChild({
                cls: Ext.baseCSSPrefix + 'tab-tabmenu-right'
            }, me.tabBar.body.child('.' + Ext.baseCSSPrefix + 'box-scroller-right'));
            me.menuButton.addClsOnOver(Ext.baseCSSPrefix + 'tab-tabmenu-over');
            me.menuButton.on('click', me.showTabsMenu, me);
        }
        me.menuButton.show();
        result.reservedSpace += me.menuButton.getWidth();
        return result;
    },

    hideButton: function() {
        var me = this;
        if (me.menuButton) {
            me.menuButton.hide();
        }
    },

    /**
     * Returns an the current page size (this.pageSize);
     * @return {Number} this.pageSize The current page size.
     */
    getPageSize: function() {
        return this.pageSize;
    },
    /**
     * Sets the number of menu items per submenu "page size".
     * @param {Number} pageSize The page size
     */
    setPageSize: function(pageSize) {
        this.pageSize = pageSize;
    },
    /**
     * Returns the current maxText length;
     * @return {Number} this.maxText The current max text length.
     */
    getMaxText: function() {
        return this.maxText;
    },
    /**
     * Sets the maximum text size for each menu item.
     * @param {Number} t The max text per each menu item.
     */
    setMaxText: function(t) {
        this.maxText = t;
    },
    /**
     * Returns the current menu prefix text String.;
     * @return {String} this.menuPrefixText The current menu prefix text.
     */
    getMenuPrefixText: function() {
        return this.menuPrefixText;
    },
    /**
     * Sets the menu prefix text String.
     * @param {String} t The menu prefix text.
     */
    setMenuPrefixText: function(t) {
        this.menuPrefixText = t;
    },

    showTabsMenu: function(e) {
        var me = this;

        if (me.tabsMenu) {
            me.tabsMenu.removeAll();
        } else {
            me.tabsMenu = Ext.create('Ext.menu.Menu');
            me.tabPanel.on('destroy', me.tabsMenu.destroy, me.tabsMenu);
        }

        me.generateTabMenuItems();

        var target = Ext.get(e.getTarget());
        var xy = target.getXY();

        //Y param + 24 pixels
        xy[1] += 24;

        me.tabsMenu.showAt(xy);
    },

    // private
    generateTabMenuItems: function() {
        var me = this,
            tabPanel = me.tabPanel,
            curActive = tabPanel.getActiveTab(),
            totalItems = tabPanel.items.getCount(),
            pageSize = me.getPageSize(),
            numSubMenus = Math.floor(totalItems / pageSize),
            remainder = totalItems % pageSize,
            i, curPage, menuItems, x, item, start, index;

        if (totalItems > pageSize) {

            // Loop through all of the items and create submenus in chunks of 10
            for (i = 0; i < numSubMenus; i++) {
                curPage = (i + 1) * pageSize;
                menuItems = [];

                for (x = 0; x < pageSize; x++) {
                    index = x + curPage - pageSize;
                    item = tabPanel.items.get(index);
                    menuItems.push(me.autoGenMenuItem(item));
                }

                me.tabsMenu.add({
                    text: me.getMenuPrefixText() + ' ' + (curPage - pageSize + 1) + ' - ' + curPage,
                    menu: menuItems
                });
            }
            // remaining items
            if (remainder > 0) {
                start = numSubMenus * pageSize;
                menuItems = [];
                for (i = start; i < totalItems; i++) {
                    item = tabPanel.items.get(i);
                    menuItems.push(me.autoGenMenuItem(item));
                }

                me.tabsMenu.add({
                    text: me.menuPrefixText + ' ' + (start + 1) + ' - ' + (start + menuItems.length),
                    menu: menuItems
                });

            }
        }
        else {
            tabPanel.items.each(function(item) {
                if (item.id != curActive.id && !item.hidden) {
                    me.tabsMenu.add(me.autoGenMenuItem(item));
                }
            });
        }
    },

    // private
    autoGenMenuItem: function(item) {
        var maxText = this.getMaxText(),
            text = Ext.util.Format.ellipsis(item.title, maxText);

        return {
            text: text,
            handler: this.showTabFromMenu,
            scope: this,
            disabled: item.disabled,
            tabToShow: item,
            iconCls: item.iconCls
        };
    },

    // private
    showTabFromMenu: function(menuItem) {
        this.tabPanel.setActiveTab(menuItem.tabToShow);
    }
});

/**  TODO:  Verificar y poner en funcionamiento con la forma 
 * A {@link Ext.ux.statusbar.StatusBar} plugin that provides automatic error
 * notification when the associated form contains validation errors.
 */
Ext.define('Ext.ux.statusbar.ValidationStatus', {
    extend: 'Ext.Component', 
    requires: ['Ext.util.MixedCollection'],
    /**
     * @cfg {String} errorIconCls
     * The {@link Ext.ux.statusbar.StatusBar#iconCls iconCls} value to be applied
     * to the status message when there is a validation error.
     */
    errorIconCls : 'x-status-error',
    /**
     * @cfg {String} errorListCls
     * The css class to be used for the error list when there are validation errors.
     */
    errorListCls : 'x-status-error-list',
    /**
     * @cfg {String} validIconCls
     * The {@link Ext.ux.statusbar.StatusBar#iconCls iconCls} value to be applied
     * to the status message when the form validates.
     */
    validIconCls : 'x-status-valid',
    
    /**
     * @cfg {String} showText
     * The {@link Ext.ux.statusbar.StatusBar#text text} value to be applied when
     * there is a form validation error.
     */
    showText: _SM.__language.Text_Validation_Form,
    /**
     * @cfg {String} hideText
     * The {@link Ext.ux.statusbar.StatusBar#text text} value to display when
     * the error list is displayed.
     */
    hideText: _SM.__language.Text_Hide_Errors_Validation_Form,
    /**
     * @cfg {String} submitText
     * The {@link Ext.ux.statusbar.StatusBar#text text} value to be applied when
     * the form is being submitted.
     */
    submitText: _SM.__language.Text_Submit_Validation_Form,
    
    // private
    init : function(sb){
        sb.on('render', function(){
            this.statusBar = sb;
            this.monitor = true;
            this.errors = Ext.create('Ext.util.MixedCollection');
            this.listAlign = (sb.statusAlign === 'right' ? 'br-tr?' : 'bl-tl?');
            
            if (this.form) {
                this.formPanel = Ext.getCmp(this.form);
                this.basicForm = this.formPanel.getForm();
                this.startMonitoring();
                this.basicForm.on('beforeaction', function(f, action){
                    if(action.type === 'submit'){
                        // Ignore monitoring while submitting otherwise the field validation
                        // events cause the status message to reset too early
                        this.monitor = false;
                    }
                }, this);
                var startMonitor = function(){
                    this.monitor = true;
                };
                this.basicForm.on('actioncomplete', startMonitor, this);
                this.basicForm.on('actionfailed', startMonitor, this);
            }
        }, this, {single:true});
        sb.on({
            scope: this,
            afterlayout:{
                single: true,
                fn: function(){
                    // Grab the statusEl after the first layout.
                    sb.statusEl.getEl().on('click', this.onStatusClick, this, {buffer:200});
                } 
            }, 
            beforedestroy:{
                single: true,
                fn: this.onDestroy
            } 
        });
    },
    
    // private
    startMonitoring : function() {
        this.basicForm.getFields().each(function(f){
            f.on('validitychange', this.onFieldValidation, this);
        }, this);
    },
    
    // private
    stopMonitoring : function(){
        this.basicForm.getFields().each(function(f){
            f.un('validitychange', this.onFieldValidation, this);
        }, this);
    },
    
    // private
    onDestroy : function(){
        this.stopMonitoring();
        this.statusBar.statusEl.un('click', this.onStatusClick, this);
        this.callParent(arguments);
    },
    
    // private
    onFieldValidation : function(f, isValid){
        if (!this.monitor) {
            return false;
        }
        var msg = f.getErrors()[0];
        if (msg) {
            this.errors.add(f.id, {field:f, msg:msg});
        } else {
            this.errors.removeAtKey(f.id);
        }
        this.updateErrorList();
        if(this.errors.getCount() > 0) {
            if(this.statusBar.getText() !== this.showText){
                this.statusBar.setStatus({text:this.showText, iconCls:this.errorIconCls});
            }
        }else{
            this.statusBar.clearStatus().setIcon(this.validIconCls);
        }
    },
    
    // private
    updateErrorList : function(){
        if(this.errors.getCount() > 0){
         var msg = '<ul>';
         this.errors.each(function(err){
             msg += ('<li id="x-err-'+ err.field.id +'"><a href="#">' + err.msg + '</a></li>');
         }, this);
         this.getMsgEl().update(msg+'</ul>');
        }else{
            this.getMsgEl().update('');
        }
        // reset msgEl size
        this.getMsgEl().setSize('auto', 'auto');
    },
    
    // private
    getMsgEl : function(){
        if(!this.msgEl){
            this.msgEl = Ext.DomHelper.append(Ext.getBody(), {
                cls: this.errorListCls
            }, true);
            this.msgEl.hide();
            this.msgEl.on('click', function(e){
                var t = e.getTarget('li', 10, true);
                if(t){
                    Ext.getCmp(t.id.split('x-err-')[1]).focus();
                    this.hideErrors();
                }
            }, this, {stopEvent:true}); // prevent anchor click navigation
        }
        return this.msgEl;
    },
    
    // private
    showErrors : function(){
        this.updateErrorList();
        this.getMsgEl().alignTo(this.statusBar.getEl(), this.listAlign).slideIn('b', {duration: 300, easing:'easeOut'});
        this.statusBar.setText(this.hideText);
        this.formPanel.el.on('click', this.hideErrors, this, {single:true}); // hide if the user clicks directly into the form
    },
    
    // private
    hideErrors : function(){
        var el = this.getMsgEl();
        if(el.isVisible()){
         el.slideOut('b', {duration: 300, easing:'easeIn'});
         this.statusBar.setText(this.showText);
        }
        this.formPanel.el.un('click', this.hideErrors, this);
    },
    
    // private
    onStatusClick : function(){
        if(this.getMsgEl().isVisible()){
            this.hideErrors();
        }else if(this.errors.getCount() > 0){
            this.showErrors();
        }
    }
});
/**
 * Base class from Ext.ux.TabReorderer.
 */
Ext.define('Ext.ux.BoxReorderer', {
    mixins: {
        observable: 'Ext.util.Observable'
    },

    /**
     * @cfg {String} itemSelector
     * A {@link Ext.DomQuery DomQuery} selector which identifies the encapsulating elements of child
     * Components which participate in reordering.
     */
    itemSelector: '.x-box-item',

    /**
     * @cfg {Mixed} animate
     * If truthy, child reordering is animated so that moved boxes slide smoothly into position.
     * If this option is numeric, it is used as the animation duration in milliseconds.
     */
    animate: 100,

    constructor: function() {
        this.addEvents(
            /**
             * @event StartDrag
             * Fires when dragging of a child Component begins.
             * @param {Ext.ux.BoxReorderer} this
             * @param {Ext.container.Container} container The owning Container
             * @param {Ext.Component} dragCmp The Component being dragged
             * @param {Number} idx The start index of the Component being dragged.
             */
             'StartDrag',
            /**
             * @event Drag
             * Fires during dragging of a child Component.
             * @param {Ext.ux.BoxReorderer} this
             * @param {Ext.container.Container} container The owning Container
             * @param {Ext.Component} dragCmp The Component being dragged
             * @param {Number} startIdx The index position from which the Component was initially dragged.
             * @param {Number} idx The current closest index to which the Component would drop.
             */
             'Drag',
            /**
             * @event ChangeIndex
             * Fires when dragging of a child Component causes its drop index to change.
             * @param {Ext.ux.BoxReorderer} this
             * @param {Ext.container.Container} container The owning Container
             * @param {Ext.Component} dragCmp The Component being dragged
             * @param {Number} startIdx The index position from which the Component was initially dragged.
             * @param {Number} idx The current closest index to which the Component would drop.
             */
             'ChangeIndex',
            /**
             * @event Drop
             * Fires when a child Component is dropped at a new index position.
             * @param {Ext.ux.BoxReorderer} this
             * @param {Ext.container.Container} container The owning Container
             * @param {Ext.Component} dragCmp The Component being dropped
             * @param {Number} startIdx The index position from which the Component was initially dragged.
             * @param {Number} idx The index at which the Component is being dropped.
             */
             'Drop'
        );
        this.mixins.observable.constructor.apply(this, arguments);
    },

    init: function(container) {
        var me = this;
 
        me.container = container;
 
        // Set our animatePolicy to animate the start position (ie x for HBox, y for VBox)
        me.animatePolicy = {};
        me.animatePolicy[container.getLayout().names.x] = true;
        
        

        // Initialize the DD on first layout, when the innerCt has been created.
        me.container.on({
            scope: me,
            boxready: me.afterFirstLayout,
            beforedestroy: me.onContainerDestroy
        });
    },

    /**
     * @private Clear up on Container destroy
     */
    onContainerDestroy: function() {
        var dd = this.dd;
        if (dd) {
            dd.unreg();
            this.dd = null;
        }
    },

    afterFirstLayout: function() {
        var me = this,
            layout = me.container.getLayout(),
            names = layout.names,
            dd;
            
        // Create a DD instance. Poke the handlers in.
        // TODO: Ext5's DD classes should apply config to themselves.
        // TODO: Ext5's DD classes should not use init internally because it collides with use as a plugin
        // TODO: Ext5's DD classes should be Observable.
        // TODO: When all the above are trus, this plugin should extend the DD class.
        dd = me.dd = Ext.create('Ext.dd.DD', layout.innerCt, me.container.id + '-reorderer');
        Ext.apply(dd, {
            animate: me.animate,
            reorderer: me,
            container: me.container,
            getDragCmp: this.getDragCmp,
            clickValidator: Ext.Function.createInterceptor(dd.clickValidator, me.clickValidator, me, false),
            onMouseDown: me.onMouseDown,
            startDrag: me.startDrag,
            onDrag: me.onDrag,
            endDrag: me.endDrag,
            getNewIndex: me.getNewIndex,
            doSwap: me.doSwap,
            findReorderable: me.findReorderable
        });

        // Decide which dimension we are measuring, and which measurement metric defines
        // the *start* of the box depending upon orientation.
        dd.dim = names.width;
        dd.startAttr = names.beforeX;
        dd.endAttr = names.afterX;
    },

    getDragCmp: function(e) {
        return this.container.getChildByElement(e.getTarget(this.itemSelector, 10));
    },

    // check if the clicked component is reorderable
    clickValidator: function(e) {
        var cmp = this.getDragCmp(e);

        // If cmp is null, this expression MUST be coerced to boolean so that createInterceptor is able to test it against false
        return !!(cmp && cmp.reorderable !== false);
    },

    onMouseDown: function(e) {
        var me = this,
            container = me.container,
            containerBox,
            cmpEl,
            cmpBox;

        // Ascertain which child Component is being mousedowned
        me.dragCmp = me.getDragCmp(e);
        if (me.dragCmp) {
            cmpEl = me.dragCmp.getEl();
            me.startIndex = me.curIndex = container.items.indexOf(me.dragCmp);

            // Start position of dragged Component
            cmpBox = cmpEl.getBox();

            // Last tracked start position
            me.lastPos = cmpBox[this.startAttr];

            // Calculate constraints depending upon orientation
            // Calculate offset from mouse to dragEl position
            containerBox = container.el.getBox();
            if (me.dim === 'width') {
                me.minX = containerBox.left;
                me.maxX = containerBox.right - cmpBox.width;
                me.minY = me.maxY = cmpBox.top;
                me.deltaX = e.getPageX() - cmpBox.left;
            } else {
                me.minY = containerBox.top;
                me.maxY = containerBox.bottom - cmpBox.height;
                me.minX = me.maxX = cmpBox.left;
                me.deltaY = e.getPageY() - cmpBox.top;
            }
            me.constrainY = me.constrainX = true;
        }
    },

    startDrag: function() {
        var me = this,
            dragCmp = me.dragCmp;
            
        if (dragCmp) {
            // For the entire duration of dragging the *Element*, defeat any positioning and animation of the dragged *Component*
            dragCmp.setPosition = Ext.emptyFn;
            dragCmp.animate = false;

            // Animate the BoxLayout just for the duration of the drag operation.
            if (me.animate) {
                me.container.getLayout().animatePolicy = me.reorderer.animatePolicy;
            }
            // We drag the Component element
            me.dragElId = dragCmp.getEl().id;
            me.reorderer.fireEvent('StartDrag', me, me.container, dragCmp, me.curIndex);
            // Suspend events, and set the disabled flag so that the mousedown and mouseup events
            // that are going to take place do not cause any other UI interaction.
            dragCmp.suspendEvents();
            dragCmp.disabled = true;
            dragCmp.el.setStyle('zIndex', 100);
        } else {
            me.dragElId = null;
        }
    },

    /**
     * @private
     * Find next or previous reorderable component index.
     * @param {Number} newIndex The initial drop index.
     * @return {Number} The index of the reorderable component.
     */
    findReorderable: function(newIndex) {
        var me = this,
            items = me.container.items,
            newItem;

        if (items.getAt(newIndex).reorderable === false) {
            newItem = items.getAt(newIndex);
            if (newIndex > me.startIndex) {
                 while(newItem && newItem.reorderable === false) {
                    newIndex++;
                    newItem = items.getAt(newIndex);
                }
            } else {
                while(newItem && newItem.reorderable === false) {
                    newIndex--;
                    newItem = items.getAt(newIndex);
                }
            }
        }

        newIndex = Math.min(Math.max(newIndex, 0), items.getCount() - 1);

        if (items.getAt(newIndex).reorderable === false) {
            return -1;
        }
        return newIndex;
    },

    /**
     * @private
     * Swap 2 components.
     * @param {Number} newIndex The initial drop index.
     */
    doSwap: function(newIndex) {
        var me = this,
            items = me.container.items,
            container = me.container,
            wasRoot = me.container._isLayoutRoot,
            orig, dest, tmpIndex, temp;

        newIndex = me.findReorderable(newIndex);

        if (newIndex === -1) {
            return;
        }

        me.reorderer.fireEvent('ChangeIndex', me, container, me.dragCmp, me.startIndex, newIndex);
        orig = items.getAt(me.curIndex);
        dest = items.getAt(newIndex);
        items.remove(orig);
        tmpIndex = Math.min(Math.max(newIndex, 0), items.getCount() - 1);
        items.insert(tmpIndex, orig);
        items.remove(dest);
        items.insert(me.curIndex, dest);

        // Make the Box Container the topmost layout participant during the layout.
        container._isLayoutRoot = true;
        container.updateLayout();
        container._isLayoutRoot = wasRoot;
        me.curIndex = newIndex;
    },

    onDrag: function(e) {
        var me = this,
            newIndex;

        newIndex = me.getNewIndex(e.getPoint());
        if ((newIndex !== undefined)) {
            me.reorderer.fireEvent('Drag', me, me.container, me.dragCmp, me.startIndex, me.curIndex);
            me.doSwap(newIndex);
        }

    },

    endDrag: function(e) {
        if (e) {
            e.stopEvent();
        }
        var me = this,
            layout = me.container.getLayout(),
            temp;

        if (me.dragCmp) {
            delete me.dragElId;

            // Reinstate the Component's positioning method after mouseup, and allow the layout system to animate it.
            delete me.dragCmp.setPosition;
            me.dragCmp.animate = true;
            
            // Ensure the lastBox is correct for the animation system to restore to when it creates the "from" animation frame
            me.dragCmp.lastBox[layout.names.x] = me.dragCmp.getPosition(true)[layout.names.widthIndex];

            // Make the Box Container the topmost layout participant during the layout.
            me.container._isLayoutRoot = true;
            me.container.updateLayout();
            me.container._isLayoutRoot = undefined;
            
            // Attempt to hook into the afteranimate event of the drag Component to call the cleanup
            temp = Ext.fx.Manager.getFxQueue(me.dragCmp.el.id)[0];
            if (temp) {
                temp.on({
                    afteranimate: me.reorderer.afterBoxReflow,
                    scope: me
                });
            } 
            // If not animated, clean up after the mouseup has happened so that we don't click the thing being dragged
            else {
                Ext.Function.defer(me.reorderer.afterBoxReflow, 1, me);
            }

            if (me.animate) {
                delete layout.animatePolicy;
            }
            me.reorderer.fireEvent('drop', me, me.container, me.dragCmp, me.startIndex, me.curIndex);
        }
    },

    /**
     * @private
     * Called after the boxes have been reflowed after the drop.
     * Re-enabled the dragged Component.
     */
    afterBoxReflow: function() {
        var me = this;
        me.dragCmp.el.setStyle('zIndex', '');
        me.dragCmp.disabled = false;
        me.dragCmp.resumeEvents();
    },

    /**
     * @private
     * Calculate drop index based upon the dragEl's position.
     */
    getNewIndex: function(pointerPos) {
        var me = this,
            dragEl = me.getDragEl(),
            dragBox = Ext.fly(dragEl).getBox(),
            targetEl,
            targetBox,
            targetMidpoint,
            i,
            it = me.container.items.items,
            ln = it.length,
            lastPos = me.lastPos;

        me.lastPos = dragBox[me.startAttr];

        for (i = 0; i < ln; i++) {
            targetEl = it[i].getEl();

            // Only look for a drop point if this found item is an item according to our selector
            if (targetEl.is(me.reorderer.itemSelector)) {
                targetBox = targetEl.getBox();
                targetMidpoint = targetBox[me.startAttr] + (targetBox[me.dim] >> 1);
                if (i < me.curIndex) {
                    if ((dragBox[me.startAttr] < lastPos) && (dragBox[me.startAttr] < (targetMidpoint - 5))) {
                        return i;
                    }
                } else if (i > me.curIndex) {
                    if ((dragBox[me.startAttr] > lastPos) && (dragBox[me.endAttr] > (targetMidpoint + 5))) {
                        return i;
                    }
                }
            }
        }
    }
});

/**
 * Plugin which allows items to be dropped onto a toolbar and be turned into new Toolbar items.
 * To use the plugin, you just need to provide a createItem implementation that takes the drop
 * data as an argument and returns an object that can be placed onto the toolbar. Example:
 * <pre>
 * Ext.create('Ext.ux.ToolbarDroppable', {
 *   createItem: function(data) {
 *     return Ext.create('Ext.Button', {text: data.text});
 *   }
 * });
 * </pre>
 * The afterLayout function can also be overridden, and is called after a new item has been
 * created and inserted into the Toolbar. Use this for any logic that needs to be run after
 * the item has been created.
 */
 Ext.define('Ext.ux.ToolbarDroppable', {

    /**
     * Creates new ToolbarDroppable.
     * @param {Object} config Config options.
     */
    constructor: function(config) {
      Ext.apply(this, config);
    },

    /**
     * Initializes the plugin and saves a reference to the toolbar
     * @param {Ext.toolbar.Toolbar} toolbar The toolbar instance
     */
    init: function(toolbar) {
      /**
       * @property toolbar
       * @type Ext.toolbar.Toolbar
       * The toolbar instance that this plugin is tied to
       */
      this.toolbar = toolbar;

      this.toolbar.on({
          scope : this,
          render: this.createDropTarget
      });
    },

    /**
     * Creates a drop target on the toolbar
     */
    createDropTarget: function() {
        /**
         * @property dropTarget
         * @type Ext.dd.DropTarget
         * The drop target attached to the toolbar instance
         */
        this.dropTarget = Ext.create('Ext.dd.DropTarget', this.toolbar.getEl(), {
            notifyOver: Ext.Function.bind(this.notifyOver, this),
            notifyDrop: Ext.Function.bind(this.notifyDrop, this)
        });
    },

    /**
     * Adds the given DD Group to the drop target
     * @param {String} ddGroup The DD Group
     */
    addDDGroup: function(ddGroup) {
        this.dropTarget.addToGroup(ddGroup);
    },

    /**
     * Calculates the location on the toolbar to create the new sorter button based on the XY of the
     * drag event
     * @param {Ext.EventObject} e The event object
     * @return {Number} The index at which to insert the new button
     */    
    calculateEntryIndex: function(e) {
        var entryIndex = 0,
            toolbar = this.toolbar,
            items = toolbar.items.items,
            count = items.length,
            xHover = e.getXY()[0],
            el, xTotal, width, midpoint;
 
        for (index = 0; index < count; index++) {
            el = items[index].getEl();
            xTotal = el.getXY()[0];
            width = el.getWidth();
            midpoint = xTotal + width / 2;
 
            if (xHover < midpoint) {
                entryIndex = index; 
                break;
            } else {
                entryIndex = index + 1;
            }
       }
       return entryIndex;
    },

    /**
     * Returns true if the drop is allowed on the drop target. This function can be overridden
     * and defaults to simply return true
     * @param {Object} data Arbitrary data from the drag source
     * @return {Boolean} True if the drop is allowed
     */
    canDrop: function(data) {
        return true;
    },

    /**
     * Custom notifyOver method which will be used in the plugin's internal DropTarget
     * @return {String} The CSS class to add
     */
    notifyOver: function(dragSource, event, data) {
        return this.canDrop.apply(this, arguments) ? this.dropTarget.dropAllowed : this.dropTarget.dropNotAllowed;
    },

    /**
     * Called when the drop has been made. Creates the new toolbar item, places it at the correct location
     * and calls the afterLayout callback.
     */
    notifyDrop: function(dragSource, event, data) {
        var canAdd = this.canDrop(dragSource, event, data),
            tbar   = this.toolbar;

        if (canAdd) {
            var entryIndex = this.calculateEntryIndex(event);

            tbar.insert(entryIndex, this.createItem(data));
            tbar.doLayout();

            this.afterLayout();
        }

        return canAdd;
    },

    /**
     * Creates the new toolbar item based on drop data. This method must be implemented by the plugin instance
     * @param {Object} data Arbitrary data from the drop
     * @return {Mixed} An item that can be added to a toolbar
     */
    createItem: function(data) {
        Ext.Error.raise("The createItem method must be implemented in the ToolbarDroppable plugin");
    },

    /**
     * Called after a new button has been created and added to the toolbar. Add any required cleanup logic here
     */
    afterLayout: Ext.emptyFn
});

Ext.define('ProtoUL.view.MenuTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.menuTree',

    viewConfig: {
        plugins: {
            // El dragText no puede reemplazarse por una variable, impide el drag
            ptype: 'treeviewdragdrop',
            dragText: 'Drag to reorder',
            ddGroup: 'menu'
        }
    },

    rootVisible: false,
    lines: true,
    minWidth: 200,

    initComponent: function() {

        Ext.define('Proto.MenuModel', {
            extend: 'Ext.data.Model',
            proxy: {
                type: 'ajax',
                url: _SM._PConfig.urlMenu,
                extraParams: {
                    forceDefault: 0
                },
                actionMethods: {
                    read: 'POST'
                }
            },

            fields: [{
                name: 'id',
                type: 'string'
            }, {
                name: 'viewCode',
                type: 'string'
            }, {
                name: 'text',
                type: 'string'
            }, {
                name: 'leaf',
                type: 'boolean'
            }]

        });

        this.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            model: 'Proto.MenuModel',
            root: {
                text: 'menu',
                expanded: true
            },
            listeners: {
                'datachanged': function(store, eOpts) {
                    this.treeRecord = undefined;
                }

            }

        });

        if (_SM._UserInfo.isStaff) {

            Ext.apply(this, {
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [{
                        id: 'newFolder',
                        scope: this,
                        handler: this.newFolder,
                        iconCls: 'menu_new_folder',
                        tooltip: _SM.__language.Tooltip_New_Folder
                    }, {
                        // Solo para los admins
                        id: 'newOption',
                        hidden: true,
                        scope: this,
                        handler: this.newOption,
                        iconCls: 'menu_new_option',
                        tooltip: _SM.__language.Tooltip_New_Option
                    }, {
                        id: 'editNode',
                        scope: this,
                        handler: this.editNode,
                        iconCls: 'icon-nodeEdit',
                        tooltip: _SM.__language.Tooltip_Edit_Node
                    }, {
                        id: 'deleteNode',
                        scope: this,
                        handler: this.deleteNode,
                        iconCls: 'icon-nodeDelete',
                        tooltip: _SM.__language.Tooltip_Del_Node
                    }, '->', {
                        id: 'saveMenu',
                        scope: this,
                        handler: this.saveMenu,
                        iconCls: 'menu_save',
                        tooltip: _SM.__language.Tooltip_Save_Menu
                    }, {
                        id: 'reloadMenu',
                        scope: this,
                        handler: this.reloadMenu,
                        iconCls: 'menu_reload',
                        tooltip: _SM.__language.Tooltip_Reload_Menu
                    }, {
                        id: 'resetMenu',
                        scope: this,
                        handler: this.resetMenu,
                        iconCls: 'menu_reset',
                        tooltip: _SM.__language.Tooltip_Reset_Menu
                    }]
                }]
            });
        }

        this.callParent(arguments);
        this.addEvents('menuSelect');

        if (_SM._UserInfo.isSuperUser)
            Ext.getCmp('newOption').show();

    },

    listeners: {

        // .view.View , .data.Model record, HTMLElement item, Number index, .EventObject e, Object eOpts
        'itemclick': function(view, rec, item, index, evObj, eOpts) {
            this.treeRecord = rec;
        },
        'itemdblclick': function(view, rec, item, index, evObj, eOpts) {
            this.treeRecord = rec;
            if (rec.get('leaf')) {
                var viewCode = rec.data.viewCode || rec.data.id;
                this.fireEvent('menuSelect', this, viewCode);
                this.ownerCt.loadPciFromMenu(viewCode);
            }
        }

    },

    editNode: function(btn) {
        // Verifica si hay un item activo y lo edita
        if (this.treeRecord) {
            var me = this, msg = _SM.__language.Msg_Window_New_Folder;

            Ext.Msg.prompt(_SM.__language.Title_Window_New_Folder, msg, function(btn, pName) {
                if ((btn != 'ok') || (!pName ) || (pName.length == 0)) {
                    return;
                }
                me.treeRecord.set('text', pName);
            }, me, false, me.treeRecord.get('text'));

        }
    },

    deleteNode: function(btn) {
        // Verifica si hay un item activo, confirma y lo borra
        if (this.treeRecord) {
            this.treeRecord.remove();
            this.treeRecord = undefined;
        }
    },

    newFolder: function(btn) {
        // prompt por el nombre del menu y lo crea en el arbol
        var me = this, msg = _SM.__language.Msg_Window_New_Folder;

        Ext.Msg.prompt(_SM.__language.Title_Window_New_Folder, msg, function(btn, pName) {
            if (btn != 'ok') {
                return;
            }

            var tNode = {
                'text': pName,
                'children': []
            }, record;

            if (me.treeRecord && (! me.treeRecord.get('leaf'))) {
                record = me.treeRecord;
            } else {
                record = me.store.getRootNode();
            }

            record.appendChild(tNode);
        }, me, false);

    },

    newOption: function(btn) {
        // abre forma para creacion de opcion, la forma se encarga de la creacion
        if (!this.treeRecord || this.treeRecord.get('leaf')) {
            _SM.errorMessage('AddMenuOption', _SM.__language.Msg_Select_Folder);
            return;
        }
        var myWin = Ext.widget('menuOption', {
            treeRecord: this.treeRecord,
            title: _SM.__language.Title_Window_Add_Option
        });
        myWin.show();
    },

    reloadMenu: function(btn) {
        // recarga el menu guardado
        this.store.getProxy().extraParams.forceDefault = 0;
        this.store.load();
    },

    resetMenu: function(btn) {
        // borra el menu guardado y recarga el menu default basado en modelos
        this.store.getProxy().extraParams.forceDefault = 1;
        this.store.load();
    },
    saveMenu: function(btn) {
        // guarda el menu actual
        var sMeta = Ext.encode(Tree2Menu(this.store.getRootNode()));
        _SM.saveProtoObj('__menu', sMeta);

        function Tree2Menu(tNode) {
            // Para poder leer de la treeData o del TreeStore ( requiere data )
            var tData = tNode.data, tChilds = tNode.childNodes, mData = {};
            if (tData.root) {
                mData = getMenuChilds(tChilds);
            } else {
                mData = {
                    "text": tData.text,
                    "qtip": tData.qtip,
                    "qtitle": tData.qtitle,
                    "iconCls": tData.iconCls,
                    "id": 'protoMenu-' + Ext.id(),
                    "index": tData.index
                };
                // Es un menu
                if (tChilds.length > 0) {
                    mData.expanded = tData.expanded;
                    mData.children = getMenuChilds(tChilds);
                    mData.leaf = false;
                    mData.viewCode = tData.viewCode || tData.id;
                } else {
                    mData.expanded = false;
                    mData.children = [];
                    mData.leaf = tData.leaf;
                    mData.viewCode = tData.viewCode || tData.id;
                }
            }
            if (!mData.text || mData.text.length == 0) {
                mData.text = 'null';
            }

            return mData;

            function getMenuChilds(tChilds) {
                var mChilds = [];
                for (var ix in tChilds ) {
                    var lNode = tChilds[ix];
                    var nChildData = Tree2Menu(lNode);
                    mChilds.push(nChildData);
                }
                return mChilds;
            }

        }

    }

});

Ext.define('ProtoUL.view.form.MenuOption', {
    extend: 'Ext.window.Window',
    alias: 'widget.menuOption',

    constructor: function(config) {

        var formPanelCfg = {
            xtype: 'form',
            frame: true,
            constrain: true,
            bodyPadding: '5 5 0',
            width: 400,

            fieldDefaults: {
                msgTarget: 'side',
                labelWidth: 75
            },
            defaults: {
                anchor: '100%'
            },

            items: [{
                xtype: 'fieldset',
                title: _SM.__language.MenuTree_Title_Fieldset,
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                    fieldLabel: 'text',
                    afterLabelTextTpl: _SM._requiredField,
                    name: 'text',
                    allowBlank: false
                }, {
                    fieldLabel: 'option',
                    afterLabelTextTpl: _SM._requiredField,
                    name: 'viewCode',
                    allowBlank: false,

                    __ptType: "formField",
                    editable: true,
                    xtype: "protoZoom",
                    zoomModel: "protoLib.ProtoDefinition"
                }]
            }, {
                xtype: 'fieldset',
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                    fieldLabel: 'iconCls',
                    name: 'iconCls'
                }, {
                    fieldLabel: 'qtip',
                    name: 'qtip'
                }, {
                    fieldLabel: 'qtitle',
                    name: 'qtitle'
                }]
            }],

            buttons: [{
                text: _SM.__language.Text_Cancel_Button,
                scope: this,
                handler: this.onCancel
            }, {
                text: _SM.__language.Text_Save_Button,
                scope: this,
                handler: this.onSave
            }]
        };

        this.callParent([Ext.apply({
            titleTextAdd: _SM.__language.MenuTree_Text_Add_Event,
            titleTextEdit: _SM.__language.MenuTree_Text_Edit_Event,
            width: 600,
            autocreate: true,
            border: true,
            closeAction: 'hide',
            modal: false,
            resizable: false,
            buttonAlign: 'left',
            savingMessage: _SM.__language.Msg_Saved,
            deletingMessage: _SM.__language.Msg_Deleted_Event,
            layout: 'fit',
            items: formPanelCfg
        }, config)]);
    },

    initComponent: function() {
        this.callParent();
        this.formPanel = this.items.items[0];
    },

    onCancel: function() {
        this.close();
    },

    onSave: function() {
        if (!this.formPanel.form.isValid()) {
            return;
        }
        var tNode = this.formPanel.getForm().getValues();
        tNode.leaf = true;
        this.treeRecord.appendChild(tNode);
        this.close();
    }

});
/*  ---  ProtoForm

 Se llama genericamente forma, y corresponde a un panel que puede ser adosado a una ventana
 o a un contenedor cualquiera,

 La forma se divide en secciones,  las secciones son de un tipo particular correspondiente
 a los diferentes contenedores,  las secciones por defecto son simplemente fieldset

 El el arbol solo se encontraran

 Secciones  ...
 ....
 fieldset
 Campos

 no deberia mezclarse en el diseno campos y secciones dentro del mismo contenedor
 los field set son los contenedores de campos, los demas solo pueden contener otros contenedores

 renderer: this.formatDate,
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.view.ProtoForm', {
    extend : 'Ext.form.Panel',
    alias : 'widget.protoform',

    requires : ['Ext.form.field.Text', 'Ext.form.*', 'Ext.data.*', 'Ext.tip.QuickTipManager'],

    //@myMeta   Base Definition
    myMeta : null,
    newForm : false,

    //@formConfig  Objeto correspondiente a la forma en la meta ( forma parte de la meta )
    formConfig : null,

    //@prFormLayout  :  Componentes de la forma ( Itmems del arbol )
    prFormLayout : [],

    // Mantiene el IdMaster para las operaciones maestro detalle
    idMaster : -1,
    masterRecord : null,

    linkDetails : false,
    isReadOnly : false,

    //@ Store asociado al registro de entrada linked o independiente
    store : null,

    // Coleccion de campos html definidos en htmlSet
    cllDetGrids : [],
    htmlPanels : {},

    // Defne como manejar  maneja los campos heredados de los zoom
    zoomReturnDef : null,

    // Coleccion con los retornos
    zoomMultiReturn : [],

    initComponent : function() {
        this.addEvents('create', 'close', 'hide');

        var me = this, myMeta = this.myMeta, _pForm = this;

        this.btSave = Ext.create('Ext.Button', {
            // id : this.idSaveBt,
            iconCls : 'icon-saveMs',
            text : _SM.__language.Text_SaveMs_Button,
            scope : this,
            handler : this.onSave
        });

        this.btSaveDet = Ext.create('Ext.Button', {
            // id :  this.idSaveBtDt,
            iconCls : 'icon-saveDt',
            text : _SM.__language.Text_SaveDt_Button,
            hidden : true,
            disabled : true,
            scope : this,
            handler : this.onSaveDet
        });

        this.btCancelFormEdt = Ext.create('Ext.Button', {
            // id :  this.idSCancel,
            iconCls : 'icon-close',
            text : _SM.__language.Text_Close_Button,
            scope : this,
            handler : this.onReset
        });

        this.stMsg = Ext.create('Ext.toolbar.TextItem');

        Ext.apply(this, {
            frame : true,
            autoScroll : true,

            bodyStyle : 'padding:5px 5px',
            bodyPadding : 10,
            masterRecord : null,
            items : this.prFormLayout,

            dockedItems : [{
                xtype : 'toolbar',
                dock : 'bottom',
                ui : 'footer',
                items : [this.stMsg, '->', this.btSave, this.btSaveDet, this.btCancelFormEdt]
            }]

        });

        this.callParent();

        this.linkController = Ext.create('ProtoUL.UI.MDLinkController', {});
        this.getHtmlPanels();

        // Obtiene los botones de detalle
        this.cllBtDetails = getBtDetails(me.items.items, me);
        if (this.cllBtDetails.length > 0) {
            this.linkDetails = true;
            asignaDetailDefinition(me, me.cllBtDetails);
        }

        // Obtiene los store de las grillas dependientes y asigna el listener startEdition
        this.cllDetGrids = getDetails(me.items.items, me);
        if (this.cllDetGrids.length > 0) {
            this.linkDetails = true;
            this.btSaveDet.show();
            asignaDetailDefinition(me, me.cllDetGrids);
        }

        // Lo genera de nuevo, quedaban componentes mal ubicados
        this.doLayout();

        function getDetails(prItems, me) {
            // Obtiene los store de las grillas recursivamente
            var cllDetGrids = [], lGrid, ixV;
            for (ixV in prItems ) {
                lGrid = prItems[ixV];
                if (lGrid.__ptType == "protoGrid") {
                    if (lGrid.myMeta) {
                        cllDetGrids.push(lGrid);
                    };
                } else if (lGrid.items && lGrid.items.items) {
                    cllDetGrids = cllDetGrids.concat(getDetails(lGrid.items.items, me));
                }
            }
            return cllDetGrids;
        }

        function getBtDetails(prItems, me) {
            // Obtiene los botones de detalle recursivamente
            var cllBtDetails = [], ixV, lObj;
            for (ixV in prItems ) {
                lObj = prItems[ixV];
                if (lObj.__ptType === "detailButton") {
                    cllBtDetails.push(lObj);
                } else if (lObj.items && lObj.items.items) {
                    cllBtDetails = cllBtDetails.concat(getBtDetails(lObj.items.items, me));
                }
            }
            return cllBtDetails;
        }

        function asignaDetailDefinition(me, cllDets) {
            // Indexa los stores y/o loas botones con la info de los detalles copiando la info del detalle
            var lObj, lDet, ix, ixD;
            for (ix in cllDets ) {
                lObj = cllDets[ix];

                lObj.linkController = me.linkController;
                lObj.detailDefinition = _SM.getDetailDefinition(me.myMeta, lObj.viewCode);
            }
        }

    },

    setDetailsTilte : function() {
        var ix, lGrid;
        for (ix in this.cllDetGrids ) {
            lGrid = this.cllDetGrids[ix];
            lGrid.embededGrid = true;
            lGrid.setGridTitle(lGrid);
        }
    },

    showProtoForm : function() {
        _SM.showConfig('Form Config', this.myMeta.formConfig);
    },

    showLayoutConfig : function() {
        _SM.showConfig('LayoutConfig', this.prFormLayout);
    },

    updateHtmlPanels : function(record) {
        var sHtml, ix, obj;
        for (ix in this.htmlPanels  ) {
            obj = this.htmlPanels[ix];
            if (record) {
                sHtml = record.get(ix);
            } else {
                sHtml = '';
            }
            obj.update(sHtml);
            obj.rawHtml = sHtml;
        }
    },

    readHtmlPanels : function(record) {
        var ix, obj;
        for (ix in this.htmlPanels  ) {
            obj = this.htmlPanels[ix];
            record.set(ix, obj.rawHtml);
        }
    },

    setText : function(sText) {
        this.stMsg.setText(sText);
    },

    onReset : function() {
        // this.setActiveRecord(null);
        // this.getForm().reset();
        this.idMaster = null;
        this.fireEvent('close', this);
    },

    updateZoomIds : function() {

        // La info del zoom permanece en el campo fk, es necesario actualizar el registro
        // antes de guardarlo, TODO: esto se podria hacer en el zoomReturn ( cpFromField ) para actualzar
        // otros campos derivados del zoom.

        var me = this, lFields = me.getForm().getFields().items, ix, zoomField;

        // inicializa me.zoomMultiReturn
        me.zoomMultiReturn = null;

        // Manejo del retorno del zoom
        for (ix in lFields  ) {
            zoomField = lFields[ix];
            if (!zoomField.zoomModel) {
                continue;
            }

            // Verifica los campos multizoom
            if (zoomField.zoomMultiple && me.newForm) {

                if (!me.zoomMultiReturn) {
                    me.zoomMultiReturn = [];
                }
                me.zoomMultiReturn.push(zoomField.zoomRecords);

            } else if (zoomField.zoomRecord) {
                // Actualiza el IdValue en el zoom para hacer los vinculos
                zoomField.fkIdValue = this.masterRecord.get(zoomField.fkId);

                // Actualiza el Id con el dato proveniente del zoom
                me.updateFormField(zoomField.fkId, zoomField.zoomRecord.data.id);
            }
            // Actualiza los valores de retorno
            // this.updateZoomReturn( zoomField  )
        }

    },

    updateFormField : function(fldName, fldValue) {
        var lRec = {};
        lRec[fldName] = fldValue;
        this.getForm().setValues(lRec);

        lRec = this.masterRecord;
        lRec.data[fldName] = fldValue;
        if (!lRec.modified[fldName]) {
            lRec.modified[fldName] = lRec.data[fldName];
        }
    },

    onCreate : function() {
        var form = this.getForm();

        if (form.isValid()) {
            this.fireEvent('create', this, form.getValues());
            form.reset();
        }

    },

    setFormReadOnly : function(bReadOnly) {

        // por defecto viene editable
        this.isReadOnly = bReadOnly;

        // desactiva el boton save
        this.btSave.setDisabled(bReadOnly);
        this.btSaveDet.setDisabled(bReadOnly);
        this.btCancelFormEdt.setDisabled(bReadOnly);

        this.setReadOnlyFields(bReadOnly);
        this.setDetailsReadOnly(bReadOnly);

        if ( this.linkController ) {
            this.linkController.isReadOnly = this.isReadOnly;
        }
                        

    },

    setDetailsReadOnly : function(bReadOnly) {
        var lObj, ix;
        for (ix in this.cllDetGrids  ) {
            lObj = this.cllDetGrids[ix];
            lObj.setEditMode(!bReadOnly);
        }
    },

    setReadOnlyFields : function(bReadOnly, readOnlyFields) {
        /*
        * @bReadOnly indica q toda la forma es readOnly, podria servir para prender y apagar el readOnly
        * FIX: Una mascara seria mejor
        */

        // var readOnlyCls = 'protofield-readonly'
        var myFields = this.getForm().getFields(), obj, ix, fDef;
        for (ix in myFields.items   ) {
            obj = myFields.items[ix];
            if (obj.readOnly) {
                obj.setReadOnly(true);
            } else if (!readOnlyFields || (obj.name in _SM.objConv(readOnlyFields)  )) {
                // El obj no es readOnly pero la forma si, se podria poner una mascara, pero q pasa con el zoom
                obj.setReadOnly(bReadOnly);
            }
        }

        // Recorre los htmlPanels
        for (ix in this.htmlPanels  ) {
            obj = this.htmlPanels[ix];
            fDef = obj.__ptConfig;

            if (fDef.readOnly) {
                obj.setReadOnly(true);
            } else if (!readOnlyFields || (fDef.name in _SM.objConv(readOnlyFields)  )) {
                obj.setReadOnly(bReadOnly);
            }
        }
    },

    getHtmlPanels : function() {
        // Busca si tiene htmlSets podria agregarse los paneles como campos,
        // los paneles al interior deberian heredar de  'Ext.form.field.Base' y mezclar Ext.form.Basic
        // setear propiedad  isFormField : true
        // implementar por lo menos los metodos : valueToRaw, setRawValue

        getHtmlPanelDefinition(this.items.items, this);

        function getHtmlPanelDefinition(formItems, me) {
            var vFld, ix;
            for (ix in formItems   ) {
                vFld = formItems[ix];

                if (vFld.xtype === "htmlset") {
                    Ext.apply(me.htmlPanels, vFld.htmlPanels);
                } else if (vFld.xtype === "fieldset") {
                    getHtmlPanelDefinition(vFld.items.items, me);
                }
            }
        }

    },

    setActiveRecord : function(record) {
        var me = this;
        this.masterRecord = record;
        this.store = record.store;
        if (record && !record.phantom) {
            this.idMaster = record.get('id');
        }

        if (record) {
            this.getForm().loadRecord(record);

            // 1312:  No hay necesidad de actulizar los zoomsId pues vienen del registro
            // this.loadN2N( record );
            // this.updateZoomIds();
        } else {
            this.getForm().reset();
        }

        this.linkDetail(record);
        this.updateHtmlPanels(record);

        // -------------------------------------------------- --------  evento del store
        this.store.on({
            update : function(store, record, operation, eOpts) {
                if (record && this.linkDetails) {
                    this.idMaster = record.get('id');
                    this.myFormController.newForm = false;
                    this.linkDetail(record);
                    this.setDetailsReadOnly(false);
                }
            },
            scope : me
        });
    },

    linkDetail : function(record) {
        if (!this.linkDetails) {
            return;
        }

        var me = this, lGrid, lObj, detailLink, ixDet;
        me.linkController.setMasterData(record.data);

        for (ixDet in me.cllDetGrids ) {
            
            me.linkController.isReadOnly = me.isReadOnly; 
            lGrid = me.cllDetGrids[ixDet];
            detailLink = me.linkController.getDetailLink(lGrid.detailDefinition);
            lGrid.store.myLoadData(detailLink.detFilter, null, me.idMaster);

            if (me.idMaster >= 0 && (!me.isReadOnly )) {
                lGrid.setEditMode(!me.isReadOnly);
                me.linkController.setDetailDefaults(lGrid.detailDefinition, lGrid.myFieldDict);
            }
        }

        // activa los botones
        if (me.idMaster >= 0 && (!me.isReadOnly )) {
            for (ixDet in me.cllBtDetails  ) {
                lObj = me.cllBtDetails[ixDet];
                lObj.setButtonsReadOnly(false);
            }
        }
    },

    _doSyncMasterStore : function() {
        this.store.sync({
            success : function(result, request) {
                var myReponse = result.operations[0].response, myResult = Ext.decode(myReponse.responseText);
                if (myResult.message) {
                    _SM.errorMessage(_SM.__language.Msg_Error_Save_Form, myResult.message);
                }
                // else { me.fireEvent('close', me );}
            },
            failure : function(result, request) {
                _SM.errorMessage(_SM.__language.Msg_Error_Save_Form, _SM.__language.Msg_Failed_Operation);
            }
        });
    },

    onSaveDet : function() {
        /*  El guardado se hace en varios ciclos.
         - Se requiere tener un maestro,
         si es upd, el maestro ya existe los defectos se sinclronizan
         si es nuevo, se deshabilita el boton de guardar detalles hasta q exista un idMaster y un activeRecord

         - en upd
         se guarda el maestro y se actualiza el idMaster, y masterRecord
         se habilita la edicion de las grillas
         se puede esperar un evento "editComplete"  para esto generado por el store;
         antes de iniciar la edicion la grilla lanza un before edit q puede ser cancelado si no hay idMaster
         */

        this.onSave();
        this.fireEvent('close', this);

    },

    onSave : function() {

        var me = this, tmpAutoSync, form, lProduct, lBase, lRec, lZRet, ix, iz;

        tmpAutoSync = me.store.autoSync;
        form = me.getForm();
        me.updateZoomIds();

        if (! form.isValid()) {
            me.setText(_SM.__language.Msg_Invalid_Form);
            return;
        }
        if (!me.masterRecord) {
            return;
        }

        form.updateRecord(me.masterRecord);
        me.readHtmlPanels(me.masterRecord);

        // Try to improve performance...
        // me.store.suspendEvents();

        // Si es nuevo
        if (me.myFormController.newForm) {

            if (!me.zoomMultiReturn) {
                me.store.add(me.masterRecord);

            } else {

                // La carga de multiples zooms siempre se debe hacer en una unica llamada.
                me.store.autoSync = false;

                // Variable para alojar los retornos multiples
                lProduct = _SM.Product(me.zoomMultiReturn);
                for (ix in lProduct ) {

                    // Producto Cartersiano de multiReturn
                    lBase = lProduct[ix];
                    lRec = me.masterRecord.copy();

                    for (iz in lBase   ) {
                        lZRet = lBase[iz];
                        lRec.data[lZRet.name] = lZRet.recStr;
                        lRec.data[lZRet.fkId] = lZRet.recId;
                    }
                    me.store.add(lRec);

                }

            }
        }

        // DGT: Esto deberia ser parametrizado; la version actual maneja autosync = true
        if (me.store.autoSync !== true) {
            me._doSyncMasterStore();
        }

        // me.store.resumeEvents();
        // Restaura el autosync
        me.store.autoSync = tmpAutoSync;

        if (me.cllDetGrids.length > 0) {
            me.btSave.setDisabled(true);
            me.btSaveDet.setDisabled(false);
        } else {
            me.fireEvent('close', me);
        }

    },

    setZoomEditMode : function(me) {
        // Para determinar el comportamiento del zoom de seleccion multiple

        var lFields = me.getForm().getFields().items, ix;

        // Manejo del retorno del zoom
        for (ix in lFields  ) {
            if (lFields[ix].xtype === 'protoZoom') {
                lFields[ix].newForm = me.newForm;
            }
        }
    }
});

/*
 DOnt delete !!!
 updateZoomReturn: function (  zoomFld  ) {
 // El problema es en q momento se dispara,
 // hay q capturar un evento para cerrar la ventana de zoom
 // verifica si esta definido y lo define a necesidad
 if ( ! this.zoomReturnDef  ) {
 // mantiene una lista con la definicion de los cpFromField
 this.zoomReturnDef = []
 // Crea la coleccion de campos q deben heredarse
 for (var ix in this.myMeta.fields ) {
 var vFld = this.myMeta.fields[ix]
 if ( ! vFld.cpFromZoom ) continue;
 var cpFrom = {
 "name"    : vFld.fName,
 "cpFromZoom" : vFld.cpFromZoom,
 "cpFromField" : vFld.cpFromField
 }
 }
 }

 // Verifica si hay elementos a heredar
 if ( this.zoomReturnDef.length  == 0 ) { return }

 // Recorre las propiedades a heredar
 for (var ix in this.zoomReturnDef ) {
 var cpFrom = this.zoomReturnDef[ix]
 if ( cpForm.cpFromZoom == zoomFld.name   ) {
 this.updateFormField(  zoomFld.name , zoomFld[ cpForm.cpFromField ] )
 }
 }
 },
 */
/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.view.ProtoGrid', {
    extend: 'Ext.Panel',
    alias: 'widget.protoGrid',
    requires: ['Ext.grid.*', 'Ext.data.*', 'Ext.util.*', 'Ext.state.*', 'Ext.form.*', 'Ext.selection.CheckboxModel', 'Ext.toolbar.TextItem'],
    // iconCls: 'icon-grid',

    height: 200,
    viewCode: null,

    // Internals
    myMeta: null,

    // Selection model
    selModel: null,
    rowData: null,

    // Navegacion
    isDetail: false,
    isPromoted: false,
    mdFilter: [],
    initialFilter: null,
    embededGrid: false,

    // Para guardar la definicion de cols al cambiar de tabs
    colDictDefinition: {},
    colSetName: '',
    colSetDefinition: [],
    colSetCache: {},

    autoEdit: true,
    editable: true,

    initComponent: function() {

        var me = this;

        if (! _SM.loadPci(this.viewCode, false)) {
            Ext.apply(this, {
                title: this.viewCode + ' Not found!'
            });
            this.callParent(arguments);
            _SM.errorMessage('initGrid', this.viewCode + ' not found!!');
            return;
        }

        // Recupera la clase para obtener la meta ------------------------------------------
        var myMeta = _SM.clone(_SM._cllPCI[this.viewCode]);

        this.myMeta = myMeta;
        this.myMeta.idProtoGrid = this.id;
        this.myFieldDict = _SM.getFieldDict(myMeta);

        // VErifica si el store viene como parametro ( Detail )
        var baseFilter = [], myFilter = [], storeDefinition;

        if (this.isDetail) {
            // Inicialmente la grilla esta en blanco hasta q linkDetail le entrega un maestro valido.
            baseFilter = myMeta.gridConfig.baseFilter;
            myFilter = [{
                "property": this.detailDefinition.detailField,
                "filterStmt": -1
            }];

        } else if (this.isPromoted) {
            // El filtro base de una grilla promovida ( sacar detalle ) es el filtro base + la llave del maestro
            baseFilter = myMeta.gridConfig.baseFilter;
            baseFilter = baseFilter.concat(this.mdFilter);

        } else {
            // La grilla normal tiene los parametros estandar definidos
            baseFilter = myMeta.gridConfig.baseFilter;
            myFilter = this.initialFilter || myMeta.gridConfig.initialFilter;
        }

        storeDefinition = {
            viewCode: this.viewCode,
            autoLoad: this.autoLoad || true,

            pageSize: myMeta.pageSize || _SM._PAGESIZE,
            localSort: myMeta.localSort,
            groupCol : myMeta.gridConfig.groupCol, 

            // proxy.extraParams, siempre deben ser string
            baseFilter: baseFilter,
            protoFilter: myFilter,
            sorters: myMeta.gridConfig.initialSort,
            sProtoMeta: _SM.getSafeMeta(myMeta)
        };

        // ---------------------------------------------------------

        // Start Row Editing PlugIn
        // me.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        // clicksToMoveEditor: 1,
        // autoCancel: false
        // });

        // Si es un detalle, aqui viene la especificacion de conexion ( detailDef )
        if (me.detailDefinition) {

            // El estilo de los detalles es siemrpe grid
            myMeta.pciStyle = 'grid';

            // Columnas heredadas en caso de ser un detalle
            var nDetId = me.detailDefinition.detailField.replace(/__pk$/, '_id');
            var vFld = me.myFieldDict[nDetId];

            // Asigna el titulo
            var nDetTitle = nDetId;
            if (vFld) {
                nDetTitle = me.detailDefinition.masterTitleField || vFld.fkField;
            }
        }

        createColDictionary();

        // gridColumns: Es un subconjuto para poder manejar diferentes conf de columnas
        // tiene en cuenta siel usuario  definio su vist por defecto la carga
        var gridColumns, tabConfig;

        tabConfig = _SM.defineTabConfig(myMeta.gridConfig);
        if (myMeta.custom.listDisplay.length > 0) {
            tabConfig.listDisplay = myMeta.custom.listDisplay;
        }
        gridColumns = this.getViewColumns(tabConfig);

        // Manejo de seleccion multiple
        if (!this.gridSelectionMode) {
            this.gridSelectionMode = myMeta.gridConfig.gridSelectionMode || 'multi';
        }
        var checkCtrl = 'last';

        if (this.gridSelectionMode != 'multi') {
            checkCtrl = false;
        }

        this.selModel = Ext.create('Ext.selection.CheckboxModel', {
            injectCheckbox: checkCtrl,
            mode: this.gridSelectionMode
        });

        this.editable = this.autoEdit;

        // Grouping 
        var lFeatures = [], lField, sHeader, lGroup ; 
        if ( myMeta.gridConfig.groupCol  ) {
            if ( this.myFieldDict[ myMeta.gridConfig.groupCol ] ) { 
                sHeader = '{name}'
                lGroup = Ext.create('Ext.grid.feature.Grouping',{ groupHeaderTpl: sHeader }); 
                lFeatures.push( lGroup  ); 
            }
        }

        // Definie el grid
        var grid;
        if (myMeta.pciStyle == 'tree') {
            // me.store = _SM.getTreeStoreDefinition( storeDefinition )
            // grid = Ext.create('Ext.tree.Panel', {border:false,region:'center',flex:1,layout:'fit',minSize:50,stripeRows:true,tools:[],useArrows:true,rootVisible:false,multiSelect:false,singleExpand:true,stripeRows:true,rowLines:true,store:me.store,columns:[{xtype:'treecolumn',text:myMeta.shortTitle,flex:3,dataIndex:'__str__'},{text:'model',dataIndex:'model'},{text:'id',dataIndex:'id'}]});
        } else {

            me.store = _SM.getStoreDefinition(storeDefinition);

            grid = Ext.create('Ext.grid.Panel', {
                border: false,
                region: 'center',
                flex: 1,
                layout: 'fit',
                minSize: 50,

                plugins: [
                    'headertooltip'
                  // this.rowEditing 

                ],

                features: lFeatures,

                selModel: this.selModel,
                columns: gridColumns,
                store: this.store,
                stripeRows: true,

                // Tools  ( necesario para AddTools )
                tools: [],

                viewConfig: {
                    // Manejo de rows y cells

                    listeners: {

                        cellclick: function(view, cell, cellIndex, record, row, rowIndex, e) {
                            // Esto maneja los vinculos en los campos
                            var linkClicked = (e.target.tagName == 'A');
                            var clickedDataIndex = view.panel.headerCt.getHeaderAtIndex(cellIndex).dataIndex;
                            if (linkClicked && clickedDataIndex) {

                                var myZField = me.myFieldDict[clickedDataIndex];
                                if (!myZField) {
                                    return;
                                }
                                if (myZField.zoomModel && myZField.fkId) {

                                    if ((myZField.zoomModel == me.myMeta.viewEntity ) && (myZField.fkId = me.myMeta.idProperty )) {
                                        // Si es el mismo registro lo llama como un upd
                                        // xxx.call Redefine el scope
                                        var formController = Ext.create('ProtoUL.UI.FormController', {
                                            myMeta: me.myMeta
                                        });

                                        if (_SM.validaSelected( me )) {
                                            formController.openLinkedForm.call(formController, me.selected, !me.editable);
                                        } 

                                    } else {
                                        // es un vinculo a otro objeto
                                        var formController = Ext.create('ProtoUL.UI.FormController', {});
                                        formController.openProtoForm.call(formController, myZField.zoomModel, record.get(myZField.fkId), false);
                                    }

                                } else if (myZField.zoomModel == '@cellValue') {
                                    // Podria usarse con @FieldName para indicar de donde tomar el modelo o la funcion

                                    var pModel = record.get(myZField.name);
                                    _SM._mainWin.loadPciFromMenu(pModel);

                                } else {
                                    _SM.errorMessage('LinkedForm definition error : ' + clickedDataIndex, 'zoomModel : ' + myZField.zoomModel + '<br>' + 'fkId : ' + myZField.fkId);
                                }
                            }
                        }

                    },

                    getRowClass: function(record, rowIndex, rowParams, store) {
                        //    Esto permite marcar los registros despues de la actualizacion
                        var stRec = record.get('_ptStatus');
                        if (stRec) {
                            if (stRec === _SM._ROW_ST.NEWROW) {
                                return stRec;
                            } else if (stRec === _SM._ROW_ST.REFONLY) {
                                // No cambia el color
                                return '';
                            } else {
                                return _SM._ROW_ST.ERROR;
                            }
                        } else {
                            return '';
                        }
                    }

                }

            });

        }

        this._extGrid = grid;
        this.setGridTitle(this);

        // ---- GridControllers

        if (this.gridController) {
            this.gridController.myGrid = this;
            this.gridController.store = this.store;
        } else {
            this.gridController = Ext.create('ProtoUL.UI.GridController', {
                myMeta: myMeta,
                myGrid: this,
                store: this.store
            });
        }
        this.gridController.addGridTools(this.autoEdit);

        this.sheetCrl = Ext.create('ProtoUL.UI.GridSheetController', {
            myGrid: this
        });

        // ---

        var myItems = [grid];
        var mySheet = this.sheetCrl.getSheetConfig();
        if (mySheet) {
            myItems.push(mySheet);
        }

        Ext.apply(this, {
            layout: 'border',
            border: false,
            defaults: {
                collapsible: false,
                split: false
            },
            items: myItems
        });

        this.addEvents('selectionChange', 'rowDblClick', 'promoteDetail', 'startEdition');

        this.callParent(arguments);
        this.gridController.addNavigationPanel();

        grid.on({
            // select: {fn: function ( rowModel , record,  rowIndex,  eOpts ) {
            // me.fireSelectionChange( rowModel , record,  rowIndex,  eOpts   );
            // }, scope: this },

            selectionchange: {
                fn: function(selModel, selected, eOpts) {
                    // Expone la fila seleccionada.
                    this.selected = selected[0] || null;

                    if (this.selected) {
                        me.rowData = this.selected.data;
                        me.currentId = me.selected.get('id');

                        me.fireSelectionChange(selModel, this.selected, this.selected.index + 1, eOpts);
                    } else {
                        me.rowData = null;
                        me.currentId = -1;
                        me.fireSelectionChange(selModel, null, null, eOpts);
                    }

                    // Si hay botones o eltos de la interface a modificar
                    // grid4.down('#removeButton').setDisabled(selections.length == 0);
                },
                scope: this
            },

            itemmouseenter: {
                fn: function(view, record, item) {
                    // Esto maneja los tooltip en las las filas
                    var msg = record.get('_ptStatus');
                    if (msg == _SM._ROW_ST.NEWROW || msg == _SM._ROW_ST.REFONLY) {
                        msg = '';
                    }

                    // Asigna un tooltip a la fila, pero respeta los de cada celda y los de los Actiosn
                    Ext.fly(item).set({
                        'data-qtip': msg
                    });

                    // Dgt :  Este tooltip evita las actions columns
                    // Ext.fly(item).select('.x-grid-cell:not(.x-action-col-cell)').set({'data-qtip': 'My tooltip: ' + record.get('name')});
                },
                scope: this
            },

            // Para manejar aciones por teclas, ie  ^I Insertar, etc ....
            // processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
            // if ( type == 'keydown' ) {
            // console.log( view, cell, recordIndex, cellIndex, e )
            // }
            // },

            celldblclick: {
                fn: function(tbl, el, cellIndex, record, tr, rowIndex, e, eOpts) {
                    // para seleccionar en el zoom
                    // Si esta en modo edicion no dispara nada para permitir entrar al editor
                    if (me.editable) {
                        return;
                    }

                    //Evento SM (Hmaury)..........................
                    //ejemplo:
                    //{ "dblClick":"{ fn: function(){ Ext.Msg.alert('','hola') } } " ,"Prueba" : ""  }
                    //para cargar un js desde el codigo del evento:
                    // var scrpt = document.createElement('script'); scrpt.src='../../static/aplications/GIS/factura_dblclick.js'; document.head.appendChild(scrpt);
                    // eval(me.myMeta.businessRulesText["dblClick"]);
                    // var event = Ext.decode(me.myMeta.businessRulesText["dblClick"]);
                    // event.fn();

                    me.fireEvent('rowDblClick', record, rowIndex);
                },
                scope: me
            }

            //   E D I C I O N  directa en la GRILLA   --------------------------------------------
            // beforeedit: {fn: function ( edPlugin, e, eOpts) {
            // if ( ! this.editable )  return false;
            // var perms = _SM._UserInfo.perms[ this.myMeta.viewCode ]
            // if ( ! perms['change'] ) return false
            // // Resetea el zoom
            // for (var ix in e.grid.columns ) {
            // var vFld = e.grid.columns[ix]
            // var initialConf = vFld.initialConfig
            // if (! initialConf.editor ) continue;
            // if (  initialConf.editor.xtype != 'protoZoom' ) continue;
            // var zoom = vFld.getEditor()
            // zoom.resetZoom()
            // }
            // }, scope: me },

            // canceledit :  function(editor, e, eOpts) {
            // Fires when the user started editing but then cancelled the edit. ...

            // validateedit: {fn:  function(editor, e, eOpts) {
            // // Fires after editing, but before the value is set in the record. ...
            // // Resetea el status despues de la edicion
            // if ( ! e.record.getId() ) {
            // e.record.phantom = true;
            // e.record.data._ptStatus = _SM._ROW_ST.NEWROW
            // } else {
            // e.record.data._ptStatus = ''
            // }
            // e.record.dirty = true;
            // // Manejo del retorno del zoom
            // for (var ix in e.grid.columns ) {
            // var vFld = e.grid.columns[ix]
            // var initialConf = vFld.initialConfig
            // if (! initialConf.editor ) continue;
            // if (  initialConf.editor.xtype != 'protoZoom' ) continue;
            // var zoom = vFld.getEditor()
            // var idIndex = initialConf.editor.fkId
            // if ( ! zoom.zoomRecord ) continue;
            // // Actualiza el Id con el dato proveniente del zoom
            // // fix: Agrega el modificado en caso de q no se encuentre
            // if ( ! e.record.modified[ idIndex ]  ) {
            // e.record.modified[ idIndex ] = e.record.data[ idIndex ]
            // }
            // e.record.data[ idIndex ] = zoom.zoomRecord.data.id
            // }
            // }, scope: me },

            // afterrender: {fn: function( grid, eOpts) {
            // me.setChekSelection( me   )
            // }, scope: me }

        });

        function createColDictionary() {
            // Crea el diccionario de columnas
            var gCol, ix, vFld;
            for (ix in myMeta.fields ) {
                vFld = myMeta.fields[ix];
                if (vFld.crudType == 'storeOnly') {
                    continue;
                }

                // lee las props p
                gCol = _SM.getColDefinition(vFld);

                // Oculta los campos provenientes del maestroo en los detalles
                if (gCol.dataIndex in _SM.objConv([nDetId, nDetTitle])) {
                    gCol['readOnly'] = true;
                    delete gCol['editor'];
                }

                // DGT: No se necesita, la definicion viene automatica
                // if (( myMeta.pciStyle == 'tree' ) && ( gCol.dataIndex  == '__str__' )) { gCol.xtype = 'treecolumn' };
                me.colDictDefinition[gCol.dataIndex] = gCol;

            }

            // Crea el rowNumber
            gCol = {
                xtype: 'rownumberer',
                width: 37,
                draggable: false,
                sortable: false
            };
            // locked: true, lockable: false }
            me.colDictDefinition['___numberCol'] = gCol;

        }

    },

    fireSelectionChange: function(rowModel, record, rowIndex, eOpts) {
        this.fireEvent('selectionChange', rowModel, record, rowIndex, eOpts);

        // Condicionar los botones de edicion segun los permisos ( refAllow )
        var perms = _SM._UserInfo.perms[this.myMeta.viewCode];
        if (this.editable && record && perms['refallow']) {
            this.verifyEdition(record, perms)
        }

        // Presenta la hoja de informacion en caso de q exista
        if (this.IdeSheet) {
            this.sheetCrl.prepareSheet();
        }
    },

    verifyEdition: function(record, perms) {
        var me = this, stRec = record.get('_ptStatus'), editRestr = (stRec && stRec === _SM._ROW_ST.REFONLY);

        me.gridController.setEditToolBar(me.editable, !editRestr, perms);

    },

    fireStartEdition: function(editAction) {
        // this.fireEvent('startEdition', this , editAction );
    },

    getSelectedIds: function() {
        // Lista de registros seleccionados ( id )

        var selectedIds = [], ix, cllSelection;

        if (!this.selected) {
            return selectedIds;
        }
        if (!this.selModel) {
            return [this.selected.get('id')];
        }

        cllSelection = this.selModel.getSelection();

        for (ix in cllSelection ) {
            selectedIds.push(cllSelection[ix].get('id'));
        }

        return selectedIds;
    },

    getViewColumns: function(tabConfig) {

        // guarda la confAnterior
        if (this.colSetName == tabConfig.name) {
            return this.colSetDefinition;
        }

        // Lo inicia para volver a crearlo
        this.colSetName = tabConfig.name;
        this.colSetDefinition = [];

        var gCol, dataIndex, ixV;

        // Adding RowNumberer
        if (!tabConfig.hideRowNumbers) {
            gCol = this.colDictDefinition['___numberCol'];
            this.colSetDefinition.push(gCol);
        }

        for (ixV in tabConfig.listDisplay  ) {
            dataIndex = tabConfig.listDisplay[ixV];
            gCol = this.colDictDefinition[dataIndex];
            if (gCol) {
                this.colSetDefinition.push(gCol);
            }
        }

        return this.colSetDefinition;
    },

    configureColumns: function(tabConfig) {

        // guarda la confAnterior
        if (this.colSetName == tabConfig.name) {
            return this.colSetDefinition;
        }

        var vColumns = this.getViewColumns(tabConfig);

        // para corregir un error ( foros Ext )
        this._extGrid.view.refresh();

        // Configurar columnas de la grilla
        // Primero se borran todos exepto el check ( en vez de removeAll() )

        var hCt = this._extGrid.headerCt, removeItems = hCt.items.items.slice(), len0 = removeItems.length - 1, item, i;

        this.suspendLayouts();
        for ( i = 0; i < len0; i++) {
            item = removeItems[i];
            hCt.remove(item, true);
        }

        hCt.add(0, vColumns);

        // this.setChekSelection( this  );
        this.resumeLayouts(true);
        this._extGrid.view.refresh();

    },

    // setChekSelection : function( me  ) {
    // // Hace visible o no checkColumn ( siempre es la ultima )
    // var hCt = me._extGrid.headerCt,
    // ix = hCt.items.items.length -1;
    // if ( !! me.hideCheckSelect ) {
    // hCt.items.items[ix].hide();
    // } else { hCt.items.items[ix].show(); }
    // },

    setGridTitle: function(me) {
        var gridTitle = '';

        if (me.detailTitle) {
            gridTitle = '" ' + me.detailTitle + ' "';
        } else if (me.mdFilter !== undefined) {
            gridTitle = Ext.encode(me.mdFilter);
        }

        // Titulos cuando son filtros predefinidos
        if (me.filterTitle) {
            if (gridTitle) {
                gridTitle += ' ; ';
            }
            gridTitle += me.filterTitle;
        }

        if (gridTitle) {
            gridTitle = '; filtrage par ' + gridTitle + '';
        }
        if (me.embededGrid) {
            gridTitle = '';
        }

        gridTitle = me.myMeta.shortTitle + gridTitle;

        me._extGrid.setTitle(gridTitle);
    },

    addNewRecord: function(zoomForm) {
        if (!(this.editable || zoomForm )) {
            return;
        }
        this.insertNewRecord(_SM.getNewRecord(this.myMeta, this.store));
    },

    duplicateRecord: function() {
        if ((!this._extGrid ) || (!this.editable )) {
            return;
        }

        var rec = this.selected;
        if (rec) {
            this.insertNewRecord(rec.copy());
        }
    },

    insertNewRecord: function(rec) {

        rec.data._ptStatus = _SM._ROW_ST.NEWROW;
        rec.data._ptId = rec.get('id');
        rec.data.id = undefined;
        rec.phantom = true;
        this.store.insert(0, rec);

        // Selecciona el registro adicionado
        var sm = this._extGrid.getSelectionModel();
        sm.select(0);
    },

    getRowIndex: function() {

        var sm = this._extGrid.getSelectionModel(), rowIndex = this.store.indexOf(sm.getSelection()[0]);

        if (rowIndex < 0) {
            rowIndex = 0;
        }
        return rowIndex;

    },

    deleteCurrentRecord: function() {
        if ((!this._extGrid ) || (!this.editable )) {
            return;
        }
        // if ( this.rowEditing ) { this.rowEditing.cancelEdit(); }

        var rowIndex = this.getRowIndex();

        var sm = this._extGrid.getSelectionModel();
        this.store.remove(sm.getSelection());

        // this.grid.store.indexOf( this.selections.itemAt(0) );
        if (this.store.getCount() <= rowIndex)
            rowIndex = 0;
        if (this.store.getCount() > 0) {
            sm.select(rowIndex);
        }

    },

    setEditMode: function(bEdit) {
        // Deshabilita cualquier operacion al server
        this.store.editMode = bEdit;
        this.gridController.setEditMode(bEdit);
    },

    saveChanges: function(autoSync) {
        this.store.sync();
        if (autoSync !== undefined) {
            this.store.autoSync = autoSync;
        }
    },

    reload: function() {
        this.store.load();
    },

    cancelChanges: function() {
        this.store.load();
    },

    gridLoadData: function(grid, sFilter, sorter) {
        grid.store.myLoadData(sFilter, sorter);

        // Para evitar q al filtrar se quede en una pagina vacia
        if (grid.store.currentPage != 1) {
            grid.store.loadPage(1);
        }
    },

    // Grid toolbar editing controls
    addTools: function(myTools) {
        if ( typeof myTools != 'undefined') {
            this._extGrid.addTool(myTools);
        }
    }

}); 
/*
 *  TabContainer
 *  -   MasterDetail
 *  -   -   Grid
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.view.ProtoMasterDetail', {
    extend: 'Ext.Panel',
    alias: 'widget.protoMasterDetail',
    requires: ['ProtoUL.view.ProtoGrid', 'ProtoUL.UI.TbMasterDetail'],

    // Estados iniciales
    editable: false,
    autoSync: true,
    autoEdit: true,

    // @es definido solamente cuando es una grilla dependiente  ( detalle o promoted )
    isPromoted: false,
    mdFilter: [],

    initComponent: function() {

        // Recupera la meta   ------------------------------------------------------------
        this.myMeta = _SM._cllPCI[this.viewCode];
        var me = this, tb;

        // Marca si viene de un detalle
        if (this.mdFilter) {
            this.isPromoted = true;
        }

        _SM.__StBar.showBusy('loading ' + this.viewCode + '...', 'prMD.init', 2000);

        // Master Grid    ==========================================================
        // y la Guarda el store para efectos de eventos y referencias
        this.protoMasterGrid = Ext.create('ProtoUL.view.ProtoGrid', {
            border: false,
            viewCode: this.viewCode,
            mdFilter: this.mdFilter,
            detailTitle: this.detailTitle,
            isPromoted: this.isPromoted,

            region: 'center',
            flex: 1,
            layout: 'fit',
            collapsible: false
        });

        //
        this.protoMasterStore = this.protoMasterGrid.store;

        // Manejo de arbol
        this.pciStyle = this.protoMasterGrid.myMeta.pciStyle || 'grid';

        // Barra MD
        tb = Ext.create('ProtoUL.UI.TbMasterDetail', {
            protoMeta: this.myMeta,
            __MasterDetail: me
        });

        // Asigna el tab de control a la grilla y el panel de detalles
        this.protoMasterGrid._toolBar = tb;
        this.protoTabs = Ext.create('Ext.panel.Panel', {
            layout: 'card'
        });

        this.IDdetailPanel = Ext.id();
        Ext.apply(this, {
            layout: 'border',
            border: false,
            defaults: {
                collapsible: true,
                border: false,
                split: true
            },
            tbar: tb,
            items: [this.protoMasterGrid, {

                // Extjs 4.1.1 Genera error al mezclar layout "region"  &  "card",
                // }, this.protoTabs ]

                id: this.IDdetailPanel,
                collapseMode: 'mini',
                hideCollapseTool: true,
                region: 'south',
                header: false,
                border: false,
                flex: 1,
                collapsed: true,
                layout: 'fit',
                minSize: 75,
                defaults: {
                    border: false
                },
                items: this.protoTabs
            }]
        });

        // coleccion con los store de los detalles  y su indice  =============================================
        this.ixActiveDetail = -1;
        this.idMasterGrid = -1;
        this.cllStoreDet = [];

        this.callParent();

        // Controllers
        Ext.create('ProtoUL.UI.MDDetailsController', {
            __MasterDetail: me
        });
        Ext.create('ProtoUL.UI.MDTbSortByController', {
            myMeta: this.myMeta,
            __MasterDetail: me
        });
        Ext.create('ProtoUL.UI.MDPrintOptsController', {
            myMeta: this.myMeta,
            __MasterDetail: me
        });
        Ext.create('ProtoUL.UI.MDActionsController', {
            myMeta: this.myMeta,
            __MasterDetail: me
        });

        Ext.create('ProtoUL.UI.MDSetFiltersController', {
            myMeta: this.myMeta,
            __MasterDetail: me
        });
        Ext.create('ProtoUL.UI.MDSetSortersController', {
            myMeta: this.myMeta,
            __MasterDetail: me
        });
        Ext.create('ProtoUL.UI.MDSetTabsController', {
            myMeta: this.myMeta,
            __MasterDetail: me
        });

        Ext.create('ProtoUL.UI.ConfigController', {
            myMeta: this.myMeta,
            __MasterDetail: me
        });

        //
        this.linkController = Ext.create('ProtoUL.UI.MDLinkController', {});

        // Agrega los botones de actions
        tb.addActions();

        //  ****************************************************************
        //  Eventos de los objetos internos para el manejo Master-Detail

        this.protoMasterGrid.on({
            selectionChange: {
                fn: function(rowModel, rowData, rowIndex, eOpts) {
                    this.idMasterGrid = this.protoMasterGrid.currentId;
                    this.linkDetail();
                },
                scope: me
            }
        });

    },

    linkDetail: function() {
        // Refresca las grillas de detalle
        var me = this, detailLink, myDetStore, pDetail, myDetGrid;

        // Verifica q halla un tab activo y q no hallan sido borrados
        if (me.ixActiveDetail < 0) {
            return;
        }
        if (me.protoTabs.items.length === 0) {
            return;
        }

        // carga el store
        myDetStore = me.cllStoreDet[me.ixActiveDetail];
        pDetail = myDetStore.detailDefinition;

        // Verifica si la llave cambio
        if (myDetStore.protoMasterId === me.idMasterGrid) {
            return;
        }

        // Navegacion por llaves del maestro, si rowData is null no hay registro seleccionado
        me.linkController.setMasterData(me.protoMasterGrid.rowData);
        detailLink = me.linkController.getDetailLink(pDetail);
        myDetStore.myLoadData(detailLink.detFilter, null, me.idMasterGrid);

        // Obtiene la grilla y le da un titulo
        myDetGrid = me.protoTabs.items.items[me.ixActiveDetail];
        myDetGrid.detailTitle = detailLink.detTitle;
        myDetGrid.setGridTitle(myDetGrid);
        myDetGrid.mdFilter = detailLink.detFilter; 

        // Asigna los vr por defecto
        me.linkController.setDetailDefaults(pDetail, myDetGrid.myFieldDict);

    },

    mdGridReload: function() {
        this.protoMasterGrid.reload();
    },

    mdGridLoadData: function(sFilter, sorter) {
        // Refresh
        this.protoMasterGrid.gridLoadData(this.protoMasterGrid, sFilter, sorter);
    },

    showDetailPanel: function(bHide) {
        var detailPanel = Ext.getCmp(this.IDdetailPanel);
        if (bHide) {
            this.ixInactiveDetail = this.ixActiveDetail;
            this.ixActiveDetail = -1;
            detailPanel.collapse();

        } else if (detailPanel.collapsed) {
            if (this.ixActiveDetail < 0) {
                this.ixActiveDetail = this.ixInactiveDetail || 0;
            }
            this.linkDetail();
            detailPanel.expand();
        }
    },

    hideDetailPanel: function(btn) {
        this.showDetailPanel(true);
    },

    isDetailCollapsed: function() {

        var detailPanel = Ext.getCmp(this.IDdetailPanel);
        if (!detailPanel) {
            return true;
        }
        return (detailPanel.collapsed  );

    },

    setEditMode: function(bEdit) {

        var me = this, detGrids = null, myDetGrid, ix;

        // Apagar las barras ( hacen parte de la grilla menos tbTabs y tbDetails )
        // setDisabled( me.tbTabs )

        if (!me.autoEdit) {
        setDisabled(me.tbFilters);
        setDisabled(me.tbPrinterOpts);
        setDisabled(me.tbConfigOpts);
        setDisabled(me.tbSorters);
        setDisabled(me.tbSortersSet);
        setDisabled(me.tbProtoActions);
        } else {
            bEdit = me.autoEdit;
        }


        // Cambia el control de las grillas correspondientes
        // Con el autosync se permite la edicion en todos los controles
        // if ( ! this.isDetailCollapsed()  ) {
        // Solo es la grilla lo q tengo q desabilitar
        // me.protoMasterGrid._extGrid.setDisabled( bEdit )
        // } else {

        // Si los detalles estan activos puedo cambiar de detalle sin cambiar el maestro
        // setDisabled( me.tbDetails, false  )
        me.protoMasterGrid.setEditMode(bEdit);
        // setDisabled( me.tbDetails )

        //Recorrer las grillas, cambiar el modo, TODO: heredados ( Default,  RO )
        try {
            detGrids = me.protoTabs.items.items;
        } catch(e) {
        }

        if (detGrids) {
            for (ix in detGrids ) {
                myDetGrid = detGrids[ix];
                if (!myDetGrid.detailDefinition) {
                    continue;
                }
                myDetGrid.setEditMode(bEdit);
            }
        }

        // }

        function setDisabled(tbar, bDisable) {
            // Por defecto es el edit mode
            if (bDisable === undefined) {
                bDisable = bEdit;
            }
            if (tbar) {
                tbar.setDisabled(bDisable);
            }
        }

    },

    setAutoSync: function(bMode) {
        this.autoSync = bMode;
    },

    saveChanges: function(autoSync) {
        var me = this, ix, detGrids, myDetGrid;

        if (this.isDetailCollapsed()) {
            me.protoMasterGrid.saveChanges(autoSync);
        } else {
            detGrids = me.protoTabs.items.items;
            for (ix in detGrids ) {
                myDetGrid = detGrids[ix];
                myDetGrid.saveChanges(autoSync);
            }
        }
    },

    cancelChanges: function() {
        var me = this, detGrids, ix, myDetGrid;
        if (this.isDetailCollapsed()) {
            me.protoMasterGrid.cancelChanges();
        } else {
            detGrids = me.protoTabs.items.items;
            for (ix in detGrids ) {
                myDetGrid = detGrids[ix];
                myDetGrid.cancelChanges();
            }
        }
    }

}); 
// Contiene  los tabs para crear las pcls

Ext.define('ProtoUL.view.ProtoTabContainer', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.protoTabContainer',
    // requires: ['ProtoUL.view.ProtoMasterDetail' ],
    // listeners: {
        // //DGT: Para arreglar un error reportado en ExtJs 4.0.7
        // 'tabchange': function(tabs, tab) { tab.down('gridpanel').view.refresh(); },
        // scope: this
    // },
    border : false,

    initComponent: function() {

        /*
         * @loCale
         * __TabContainer : Referencia al objeto padre de la interface
         */
        _SM.__TabContainer = this;
        this.callParent();
    },

    addTabPanel: function( viewCode, mdFilter , detailTitle  ){
        /*
         * FIx Ext.suspendLayouts();
         */

        var myMeta = _SM._cllPCI[ viewCode ] ;
        var title = myMeta.shortTitle ;
        if ( mdFilter ) { title = '*' + title ;}

        var tab = this.add({
            title: title ,
            viewCode : viewCode,
            border : false,
            tabConfig: {
                tooltip : title,
                width : 120
            },
            iconCls: myMeta.viewIcon ,
            closable: true,
            layout: 'fit',
            items: [ this.createProtoMasterDetail( viewCode, mdFilter , detailTitle ) ]
        });

        this.setActiveTab( tab );

        Ext.resumeLayouts(true);

    },

    createProtoMasterDetail: function( viewCode, mdFilter, detailTitle ){

        var MDPanel = Ext.create('widget.protoMasterDetail', {
            viewCode : viewCode,
            mdFilter    : mdFilter,
            detailTitle : detailTitle
        });
        return MDPanel;
    },


    closeProtoTab : function( viewCode  ){

        for (var ix = this.items.items.length;ix--;){
            var xTab = this.items.items[ix];
            if ( xTab.viewCode == viewCode  ){
              this.remove( xTab, true );
            }
        }

    },

    closeAllTabs : function(){
        for (var ix = this.items.items.length;ix--;){
          var xTab = this.items.items[ix];
          this.remove( xTab, true );
        }

        Ext.destroy(  Ext.ComponentQuery.query('protoZoom') );
        Ext.destroy(  Ext.ComponentQuery.query('protoForm') );
        Ext.destroy(  Ext.ComponentQuery.query('protoGrid') );
        Ext.destroy(  Ext.ComponentQuery.query('protoMasterDetail') );

        Ext.destroy( Ext.ComponentQuery.query('protoLogin') );
        Ext.destroy( Ext.ComponentQuery.query('protoSearch') );

    }


});

_SM.closeTabListener = function() {

    var x = 'TODO:  liberar la memoria';
    //_SM.__TabContainer.on
    // Ext.destroy(  Ext.ComponentQuery.query('protoZoom') )
    // Ext.destroy(  Ext.ComponentQuery.query('protoGrid') )

};

/*
 *
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.view.Viewport', {
    extend: 'Ext.Viewport',
    layout: 'fit',

    initComponent: function() {

        Ext.apply(this, {
            layout: 'border',
            autoRender: true,
            padding: 5,
            defaults: {
                split: true
            },
            items: [this.createHeaderPanel(), this.createMenuPanel(), this.createProtoTabContainer(), this.createFooterPanel()]

        });

        this.callParent(arguments);

    },

    createFooterPanel: function() {

        // StatusBar Global
        _SM.__StBar = Ext.create('Ext.ux.StatusBar', {
            region: 'south',
            split: false,
            collapsible: false
        });
        if (_SM.showFooterExtraContent) {
            var panelContent = Ext.create('Ext.panel.Panel', {
                html: _SM.footerExtraContent,
                margins: '0 0 0 0',
                border: false,
                align: 'middle',
                collapsible: true,
                split: true
            });
            var vbox = Ext.create('Ext.panel.Panel', {
                region: 'south',
                header: false,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    bodyStyle: 'padding:15px',
                    split: true
                },
                items: [_SM.__StBar, panelContent]
            });
            return vbox;
        } else {
            return _SM.__StBar;
        }

    },

    afterRender: function() {
        this.callParent(arguments);

        _SM.__StBar.showBusy('loading ... ', 'vPort', 3000);

        // Load PCI
        // TODO: This could be configured by user
        for (var autoPci in _SM._AUTOLOAD_PCI) {
            this.loadPciFromMenu(_SM._AUTOLOAD_PCI[autoPci]);
        }

        _SM._mainWin = this;

    },

    createHeaderPanel: function() {
        var content = Ext.create('Ext.panel.Panel', {
            html: _SM._siteTitle,
            margins: '0 0 0 0',
            border: false,
            align: 'middle',
            split: true
        });
        var headerPanel = Ext.create('Ext.panel.Panel', {
            region: 'north',
            header: false,
            collapsible: true,
            collapseMode: 'mini',
            collapsed: _SM._siteTitleCollapsed,
            height: 90,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                bodyStyle: 'padding:5px',
                split: true
            },
            items: [content]
        });
        return headerPanel;
    },

    createMenuPanel: function() {

        if (_SM._MENU_COLLAPSED == undefined) {
            _SM._MENU_COLLAPSED = false;
        }

        this.menuPanel = {
            region: 'west',
            width: 300,
            title: _SM.__language.Title_Main_Menu,
            collapsible: true,
            collapsed: _SM._MENU_COLLAPSED,

            xtype: 'menuTree'
        };

        return this.menuPanel;
    },

    loadPciFromMenu: function(menuOpt) {

        var viewCode = menuOpt;
        var me = this;

        var options = {
            scope: this,
            success: function(obj, result, request) {

                me.openProtoOption(viewCode);

            },
            failure: function(obj, result, request) {
                return;
            }
        };

        if (_SM.loadPci(viewCode, true, options)) {
            me.openProtoOption(viewCode);

        }

    },

    openProtoOption: function(viewCode) {

        var me = this;
        var myMeta = _SM._cllPCI[viewCode];

        if (myMeta.pciStyle == 'form') {
            var formController = Ext.create('ProtoUL.UI.FormController', {});
            formController.openProtoForm.call(formController, viewCode, -1, true);
        } else {
            me.protoTabContainer.addTabPanel(viewCode);
        }

    },

    createProtoTabContainer: function() {
        this.protoTabContainer = Ext.create('widget.protoTabContainer', {
            region: 'center',
            border: false,
            minWidth: 300
        });
        return this.protoTabContainer;
    }
});

/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.view.ComboBoxPrompt', {
    extend: 'Ext.window.Window',
    alias: 'widget.comboboxprompt',

	requires: [
        'Ext.toolbar.Toolbar',
        'Ext.form.field.Display',
        'Ext.form.field.ComboBox',
        'Ext.button.Button',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.HBox',
        'Ext.ProgressBar'
    ],
    
     /**
     * @property
     * Button config that displays a single OK button
     */
    OK : 1,
    /**
     * @property
     * Button config that displays a single Yes button
     */
    YES : 2,
    /**
     * @property
     * Button config that displays a single No button
     */
    NO : 4,
    /**
     * @property
     * Button config that displays a single Cancel button
     */
    CANCEL : 8,
    /**
     * @property
     * Button config that displays OK and Cancel buttons
     */
    OKCANCEL : 9,
    QUESTION : Ext.baseCSSPrefix + 'message-box-question',

    // hide it by offsets. Windows are hidden on render by default.
    hideMode: 'offsets',
    closeAction: 'hide',
    resizable: false,
    title: '&#160;',

    defaultMinWidth: 250,
    defaultMaxWidth: 600,
    defaultMinHeight: 110,
    defaultMaxHeight: 500,
    
    // Forcibly set these to null on the prototype to override anything set higher in
    // the hierarchy
    minWidth: null,
    maxWidth: null,
    minHeight: null,
    maxHeight: null,
    constrain: true,

    cls: [Ext.baseCSSPrefix + 'message-box', Ext.baseCSSPrefix + 'hide-offsets'],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    // We want to shrinkWrap around all docked items
    shrinkWrapDock: true,

    /**
     * @property
     * The minimum width in pixels of the message box if it is a progress-style dialog.  This is useful
     * for setting a different minimum width than text-only dialogs may need.
     */
    minProgressWidth : 250,
    /**
     * @property
     * The minimum width in pixels of the message box if it is a prompt dialog.  This is useful
     * for setting a different minimum width than text-only dialogs may need.
     */
    minPromptWidth: 250,
    //<locale type="object">
    /**
     * @property
     * An object containing the default button text strings that can be overriden for localized language support.
     * Supported properties are: ok, cancel, yes and no.  Generally you should include a locale-specific
     * resource file for handling language support across the framework.
     * Customize the default text like so:
     *
     *     Ext.window.MessageBox.buttonText.yes = "oui"; //french
     */
    buttonText: {
        ok: 'OK',
        yes: 'Yes',
        no: 'No',
        cancel: 'Cancel'
    },
    //</locale>

    buttonIds: [
        'ok', 'yes', 'no', 'cancel'
    ],

    //<locale type="object">
    titleText: {
        confirm: 'Confirm',
        prompt: 'Prompt',
        wait: 'Loading...',
        alert: 'Attention'
    },
    //</locale>

    iconHeight: 35,
    iconWidth: 50,
    
    ariaRole: 'alertdialog',

    makeButton: function(btnIdx) {
        var btnId = this.buttonIds[btnIdx];
        return new Ext.button.Button({
            handler: this.btnCallback,
            itemId: btnId,
            scope: this,
            text: this.buttonText[btnId],
            minWidth: 75
        });
    },

    btnCallback: function(btn) {
        var me = this,
            value,
            field;

        field = me.comboBox;
        value = field.getValue();
        field.reset();
        // if (me.cfg.prompt || me.cfg.multiline) {
            // if (me.cfg.multiline) {
            // } else {
                // field = me.textField;
            // }
        // }

        // Component.onHide blurs the active element if the Component contains the active element
        me.hide();
        me.userCallback(btn.itemId, value, me.cfg);
    },

    hide: function() {
        var me = this,
            cls = me.cfg.cls;

        me.progressBar.reset();
        if (cls) {
            me.removeCls(cls);
        }
        me.callParent(arguments);
    },

    constructor: function(cfg) {
        var me = this;

        me.callParent(arguments);

        // set the default min/max/Width/Height to the initially configured min/max/Width/Height
        // so that it will be used as the default when reconfiguring.
        me.minWidth = me.defaultMinWidth = (me.minWidth || me.defaultMinWidth);
        me.maxWidth = me.defaultMaxWidth = (me.maxWidth || me.defaultMaxWidth);
        me.minHeight = me.defaultMinHeight = (me.minHeight || me.defaultMinHeight);
        me.maxHeight = me.defaultMaxHeight = (me.maxHeight || me.defaultMaxHeight);
    },

    initComponent: function(cfg) {
        var me = this,
            baseId = me.id,
            i, button;

        me.title = '&#160;';

        me.topContainer = new Ext.container.Container({
            layout: 'hbox',
            padding: 5,
            style: {
                overflow: 'hidden'
            },
            items: [
                me.iconComponent = new Ext.Component({
                    width: me.iconWidth,
                    height: me.iconHeight
                }),
                me.promptContainer = new Ext.container.Container({
                    flex: 1,
                    layout: 'anchor',
                    items: [
                    	me.msg = new Ext.form.field.Display({
                            id: baseId + '-displayfield',
                            cls: me.baseCls + '-text'
                        }),
                        me.comboBox = new Ext.form.field.ComboBox({
                            id: baseId + '-combo',
                            anchor: '100%',
                            enableKeyEvents: true,
                            displayField: 'description',
                            valueField: 'id',
                            queryMode: 'local',
				            selectOnFocus: true,
				            triggerAction: 'all',
			                allowBlank: false,
                            listeners: {
                                keydown: me.onPromptKey,
                                scope: me
                            }
                        })
                    ]
                })
            ]
        });
        me.progressBar = new Ext.ProgressBar({
            id: baseId + '-progressbar',
            margin: '0 10 10 10'
        });

        me.items = [me.topContainer, me.progressBar];

        // Create the buttons based upon passed bitwise config
        me.msgButtons = [];
        for (i = 0; i < 4; i++) {
            button = me.makeButton(i);
            me.msgButtons[button.itemId] = button;
            me.msgButtons.push(button);
        }
        me.bottomTb = new Ext.toolbar.Toolbar({
            id: baseId + '-toolbar',
            ui: 'footer',
            dock: 'bottom',
            layout: {
                pack: 'center'
            },
            items: [
                me.msgButtons[0],
                me.msgButtons[1],
                me.msgButtons[2],
                me.msgButtons[3]
            ]
        });
        me.dockedItems = [me.bottomTb];
        me.on('close', me.onClose, me);
        me.callParent();
    },

    onClose: function(){
        var btn = this.header.child('[type=close]');
        // Give a temporary itemId so it can act like the cancel button
        btn.itemId = 'cancel';
        this.btnCallback(btn);
        delete btn.itemId;
    },

    onPromptKey: function(textField, e) {
        var me = this;

        if (e.keyCode === e.RETURN || e.keyCode === 10) {
            if (me.msgButtons.ok.isVisible()) {
                me.msgButtons.ok.handler.call(me, me.msgButtons.ok);
            } else if (me.msgButtons.yes.isVisible()) {
                me.msgButtons.yes.handler.call(me, me.msgButtons.yes);
            }
        }
    },

    reconfigure: function(cfg) {
        var me = this,
            buttons = 0,
            hideToolbar = true,
            oldButtonText = me.buttonText,
            resizer = me.resizer,
            resizeTracker, width, height, i, comboBox, textField,
            msg, progressBar, msgButtons;

        // Restore default buttonText before reconfiguring.
        me.updateButtonText();

        cfg = cfg || {};
        me.cfg = cfg;
        if (cfg.width) {
            width = cfg.width;
        }

        if (cfg.height) {
            height = cfg.height;
        }

        me.minWidth = cfg.minWidth || me.defaultMinWidth;
        me.maxWidth = cfg.maxWidth || me.defaultMaxWidth;
        me.minHeight = cfg.minHeight || me.defaultMinHeight;
        me.maxHeight = cfg.maxHeight || me.defaultMaxHeight;

        if (resizer) {
            resizeTracker = resizer.resizeTracker;
            resizer.minWidth = resizeTracker.minWidth = me.minWidth;
            resizer.maxWidth = resizeTracker.maxWidth = me.maxWidth;
            resizer.minHeight = resizeTracker.minHeight = me.minHeight;
            resizer.maxHeight = resizeTracker.maxHeight = me.maxHeight;
        }

        // Default to allowing the Window to take focus.
        delete me.defaultFocus;
        if (cfg.defaultFocus) {
            me.defaultFocus = cfg.defaultFocus;
        }

        // clear any old animateTarget
        me.animateTarget = cfg.animateTarget || undefined;

        // Defaults to modal
        me.modal = cfg.modal !== false;

        // Show the title/icon
        me.setTitle(cfg.title || '');
        me.setIconCls(cfg.iconCls || '');

        // Extract button configs
        if (Ext.isObject(cfg.buttons)) {
            me.buttonText = cfg.buttons;
            buttons = 0;
        } else {
            me.buttonText = cfg.buttonText || me.buttonText;
            buttons = Ext.isNumber(cfg.buttons) ? cfg.buttons : 0;
        }

        // Apply custom-configured buttonText
        // Infer additional buttons from the specified property names in the buttonText object
        buttons = buttons | me.updateButtonText();

        // Restore buttonText. Next run of reconfigure will restore to prototype's buttonText
        me.buttonText = oldButtonText;

        // During the on render, or size resetting layouts, and in subsequent hiding and showing, we need to
        // suspend layouts, and flush at the end when the Window's children are at their final visibility.
        Ext.suspendLayouts();
        delete me.width;
        delete me.height;
        if (width || height) {
            if (width) {
                me.setWidth(width);
            }

            if (height) {
                me.setHeight(height);
            }
        }
        me.hidden = false;
        if (!me.rendered) {
            me.render(Ext.getBody());
        }

        // Hide or show the close tool
        me.closable = cfg.closable !== false && !cfg.wait;
        me.header.child('[type=close]').setVisible(me.closable);

        // Hide or show the header
        if (!cfg.title && !me.closable && !cfg.iconCls) {
            me.header.hide();
        } else {
            me.header.show();
        }

        // Default to dynamic drag: drag the window, not a ghost
        me.liveDrag = !cfg.proxyDrag;

        // wrap the user callback
        me.userCallback = Ext.Function.bind(cfg.callback ||cfg.fn || Ext.emptyFn, cfg.scope || Ext.global);

        // Hide or show the icon Component
        me.setIcon(cfg.icon, cfg.iconWidth, cfg.iconHeight);

        // Hide or show the message area
        msg = me.msg;
        if (cfg.msg) {
            msg.setValue(cfg.msg);
            msg.show();
        } else {
            msg.hide();
        }

        comboBox = me.comboBox;
    	comboBox.bindStore(cfg.store);
    	comboBox.setValue(cfg.store.getAt('0').get('id'));
        comboBox.show();
        
        me.defaultFocus = comboBox;

        // Hide or show the progress bar
        progressBar = me.progressBar;
        if (cfg.progress || cfg.wait) {
            progressBar.show();
            me.updateProgress(0, cfg.progressText);
            if(cfg.wait === true){
                progressBar.wait(cfg.waitConfig);
            }
        } else {
            progressBar.hide();
        }

        // Hide or show buttons depending on flag value sent.
        msgButtons = me.msgButtons;
        for (i = 0; i < 4; i++) {
            if (buttons & Math.pow(2, i)) {

                // Default to focus on the first visible button if focus not already set
                if (!me.defaultFocus) {
                    me.defaultFocus = msgButtons[i];
                }
                msgButtons[i].show();
                hideToolbar = false;
            } else {
                msgButtons[i].hide();
            }
        }

        // Hide toolbar if no buttons to show
        if (hideToolbar) {
            me.bottomTb.hide();
        } else {
            me.bottomTb.show();
        }
        Ext.resumeLayouts(true);
    },

    /**
     * @private
     * Set button text according to current buttonText property object
     * @return {Number} The buttons bitwise flag based upon the button IDs specified in the buttonText property.
     */
    updateButtonText: function() {
        var me = this,
            buttonText = me.buttonText,
            buttons = 0,
            btnId,
            btn;

        for (btnId in buttonText) {
            if (buttonText.hasOwnProperty(btnId)) {
                btn = me.msgButtons[btnId];
                if (btn) {
                    if (me.cfg && me.cfg.buttonText) {
                        buttons = buttons | Math.pow(2, Ext.Array.indexOf(me.buttonIds, btnId));
                    }
                    if (btn.text != buttonText[btnId]) {
                        btn.setText(buttonText[btnId]);
                    }
                }
            }
        }
        return buttons;
    },

    show: function(cfg) {
        var me = this,
            visibleFocusables;

        // If called during global layout suspension, make the call after layout resumption
        if (Ext.AbstractComponent.layoutSuspendCount) {
            Ext.on({
                resumelayouts: function() {
                    me.show(cfg);
                },
                single: true
            });
            return me;
        }

        me.reconfigure(cfg);
        if (cfg.cls) {
            me.addCls(cfg.cls);
        }

        // Do not steal focus from anything that may be focused if the MessageBox has no visible focusable
        // items. For example, a "wait" message box should not get focus.
        visibleFocusables = me.query('combo:not([hidden]),button:not([hidden])');
        me.preventFocusOnActivate = !visibleFocusables.length;

        // Set the flag, so that the parent show method performs the show procedure that we need.
        // ie: animation from animTarget, onShow processing and focusing.
        me.hidden = true;
        me.callParent();
        return me;
    },

    onShow: function() {
        this.callParent(arguments);
        this.center();
    },

    updateText: function(text) {
        this.msg.setValue(text);
    },

    /**
     * Adds the specified icon to the dialog.  By default, the class 'x-messagebox-icon' is applied for default
     * styling, and the class passed in is expected to supply the background image url. Pass in empty string ('')
     * to clear any existing icon. This method must be called before the MessageBox is shown.
     * The following built-in icon classes are supported, but you can also pass in a custom class name:
     *
     *     Ext.window.MessageBox.INFO
     *     Ext.window.MessageBox.WARNING
     *     Ext.window.MessageBox.QUESTION
     *     Ext.window.MessageBox.ERROR
     *
     * @param {String} icon A CSS classname specifying the icon's background image url, or empty string to clear the icon
     * @param {Number} [width] The width of the icon. If not specified, the default is used
     * @param {Number} [height] The height of the icon. If not specified, the default is used
     * @return {Ext.window.MessageBox} this
     */
    setIcon : function(icon, width, height) {
        var me = this,
            iconCmp = me.iconComponent,
            cls = me.messageIconCls;

        if (cls) {
            iconCmp.removeCls(cls);
        }

        if (icon) {
            iconCmp.show();
            iconCmp.setSize(width || me.iconWidth, height || me.iconHeight);
            iconCmp.addCls(Ext.baseCSSPrefix + 'dlg-icon');
            iconCmp.addCls(me.messageIconCls = icon);
        } else {
            iconCmp.removeCls(Ext.baseCSSPrefix + 'dlg-icon');
            iconCmp.hide();
        }
        return me;
    },

    /**
     * Updates a progress-style message box's text and progress bar. Only relevant on message boxes
     * initiated via {@link Ext.window.MessageBox#progress} or {@link Ext.window.MessageBox#wait},
     * or by calling {@link Ext.window.MessageBox#method-show} with progress: true.
     *
     * @param {Number} [value=0] Any number between 0 and 1 (e.g., .5)
     * @param {String} [progressText=''] The progress text to display inside the progress bar.
     * @param {String} [msg] The message box's body text is replaced with the specified string (defaults to undefined
     * so that any existing body text will not get overwritten by default unless a new value is passed in)
     * @return {Ext.window.MessageBox} this
     */
    updateProgress : function(value, progressText, msg){
        this.progressBar.updateProgress(value, progressText);
        if (msg){
            this.updateText(msg);
        }
        return this;
    },

    onEsc: function() {
        if (this.closable !== false) {
            this.callParent(arguments);
        }
    },

    /**
     * Displays a message box with OK and Cancel buttons prompting the user to enter some text (comparable to JavaScript's prompt).
     * The prompt can be a single-line or multi-line textbox.  If a callback function is passed it will be called after the user
     * clicks either button, and the id of the button that was clicked (could also be the top-right
     * close button, which will always report as "cancel") and the text that was entered will be passed as the two parameters to the callback.
     *
     * @param {String} title The title bar text
     * @param {Object} options
     * @param {Function} [fn] The callback function invoked after the message box is closed.
     * See {@link #method-show} method for details.
     * @param {Object} [scope=window] The scope (`this` reference) in which the callback is executed.
     * property, or the height in pixels to create the textbox/
     * @param {String} [value=''] Default value of the text input element
     * @return {ProtoUL.view.ComboBoxPrompt} this
     */
    prompt : function(cfg, opt, fn, scope, value){
        if (Ext.isString(cfg)) {
            cfg = {
                prompt: true,
                title: cfg,
                minWidth: this.minPromptWidth,
                msg: opt.label,
                buttons: this.OKCANCEL,
                callback: fn,
                scope: scope,
                store: opt.store,
                value: value,
                userData: opt.userData
            };
        }
        return this.show(cfg);
    },

    /**
     * Displays a message box with a progress bar.
     *
     * You are responsible for updating the progress bar as needed via {@link Ext.window.MessageBox#updateProgress}
     * and closing the message box when the process is complete.
     *
     * @param {String} title The title bar text
     * @param {String} msg The message box body text
     * @param {String} [progressText=''] The text to display inside the progress bar
     * @return {Ext.window.MessageBox} this
     */
    progress : function(cfg, msg, progressText){
        if (Ext.isString(cfg)) {
            cfg = {
                title: cfg,
                msg: msg,
                progress: true,
                progressText: progressText
            };
        }
        return this.show(cfg);
    }
}, function() {
    /**
     * @class _SM.ComboBoxPrompt
     * @alternateClassName _SM.ComboPrompt
     * @extends ProtoUL.view.ComboBoxPrompt
     * @singleton
     * Singleton instance of {@link ProtoUL.view.ComboBoxPrompt}.
     */
    _SM.ComboBoxPrompt = _SM.ComboPrompt = new this();
});

Ext.define('ProtoUL.view.password.ForgotPasswordForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.forgotPasswordForm',

    requires: ['Ext.form.Panel', 'Ext.form.field.Text'],

    title: _SM.__language.Title_Window_Email_Request,
    height: 160,
    width: 400,
    layout: 'fit',
    closable: true,
    initComponent: function() {
        this.items = [{
            xtype: 'form',
            bodyPadding: 25,
            centered: true,

            fieldDefaults: {
                anchor: '100%',
                labelAlign: 'left',
                allowBlank: false,
                combineErrors: true,
                msgTarget: 'side',
                labelWidth: 80
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: _SM.__language.Textfield_User_Login,
                name: 'login',
                allowBlank: false,
                flex: 1,
                listeners: {
                    afterrender: function(field) {
                        field.focus(false, 500);
                    },
                    blur: function() {
                        this.setValue(Ext.String.trim(this.getValue()));
                    }
                }
            }, {
                xtype: 'textfield',
                fieldLabel: _SM.__language.Textfield_User_Email,
                name: 'email',
                vtype: 'email',
                allowBlank: false,
                flex: 1,
                listeners: {
                    specialkey: function(f, e) {
                        if (e.getKey() == e.ENTER) {
                            var submitButton = Ext.ComponentQuery.query('button[itemId=btForgotPWDForm]')[0];
                            submitButton.fireEvent('click', submitButton);
                        }
                    }
                }
            }]
        }];
        
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: ['->', {
                text: _SM.__language.Text_Send_Button,
		        itemId: 'btForgotPWDForm',
		        iconCls: "st-key-go",
		        action: 'forgotpassword',
            }]
        }];
 
        this.callParent(arguments);
    }
});

/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.view.password.PasswordReset', {
    extend: 'Ext.form.Panel',
    alias: 'widget.passwordForm',

    title: _SM.__language.Title_Window_Password_Change,
    floating: true,
    centered: true,
    closable: true,
    modal: true,
    width: 400,
    height: 200,
    bodyPadding: 5,
    labelWidth: 140,

    // Fields will be arranged vertically, stretched to full width
    layout: 'anchor',
    defaults: {
        anchor: '100%',
        enableKeyEvents: true
    },

    // The fields
    username: '',
    defaultType: 'textfield',
    items: [{
        fieldLabel: _SM.__language.Textfield_User_Login,
        name: "login",
        value: this.username,
        listeners: {
            afterrender: function(field) {
                field.focus(false, 500);
            }
        }
    }, {
        xtype: 'textfield',
        fieldLabel: _SM.__language.Textfield_Password_Login,
        inputType: 'password',
        name: 'current',
        width: 120
    }, {
        fieldLabel: _SM.__language.Textfield_New_Password,
        name: 'newPassword1',
        inputType: 'password',
        allowBlank: false
    }, {
        fieldLabel: _SM.__language.Textfield_Confirm_Password,
        name: 'newPassword2',
        inputType: 'password',
        allowBlank: false,
        listeners: {
            // this is used to fire the click event, so the PasswordManager is able to capture the form.
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    var changeButton = Ext.ComponentQuery.query('button[itemId=btChangePWD]')[0];
                    changeButton.fireEvent('click', changeButton);
                }
            }
        }
    }],

    // Reset and Submit buttons
    buttons: [{
        text: _SM.__language.Text_change_Password_Button,
        itemId: 'btChangePWD',
        iconCls: 'st-key-go',
        formBind: true,
        disabled: true,
        action: 'changepassword'
    }],
    listeners: {
        afterlayout: function() {
            if (window.isPasswordReseted === 'True') {
                setTimeout(function() {
                    Ext.Msg.show({
                        title: _SM.__language.Message_Success,
                        msg: _SM.__language.Message_Email_New_Password,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }, 1000);
            }
        }
    },
    renderTo: Ext.getBody()
});

Ext.define('ProtoUL.model.EntityAttributesModel', {
    extend: 'Ext.data.Model',

    requires: ['Ext.data.Field'],

    fields: [{
        name: 'text'
    }, {
        name: 'id'
    }, {
        name: 'inputPort'
    }, {
        name: 'datatype'
    }, {
        name: 'pk'
    }, {
        name: 'fk'
    }, {
        name: 'isRequired'
    }, {
        name: 'isNullable'
    }]
}); 
/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.model.Diagram', {
    extend: 'Ext.data.Model',
    fields: ['projectID','id', 'code', 'smUUID']
});

Ext.define('ProtoUL.store.EntityAttributeStore', {
    extend: 'Ext.data.Store',

    requires: [
        'ProtoUL.model.EntityAttributesModel',
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'ProtoUL.model.EntityAttributesModel',
            storeId: 'EntityAttributeStore',
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});
Ext.define('ProtoUL.store.DBTypesStore', {
    extend: 'Ext.data.Store',

    requires: ['Ext.data.proxy.Memory', 'Ext.data.reader.Json'],
    data: [{
        typeID: 'string',
        typeName: 'string'
    }, {
        typeID: 'text',
        typeName: 'text'
    }, {
        typeID: 'bool',
        typeName: 'bool'
    }, {
        typeID: 'int',
        typeName: 'int'
    }, {
        typeID: 'decimal',
        typeName: 'decimal'
    }, {
        typeID: 'sequence',
        typeName: 'sequence'
    }, {
        typeID: 'money',
        typeName: 'money'
    }, {
        typeID: 'combo',
        typeName: 'combo'
    }, {
        typeID: 'date',
        typeName: 'date'
    }, {
        typeID: 'datetime',
        typeName: 'datetime'
    }, {
        typeID: 'time',
        typeName: 'time'
    }],
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: Ext.define('DBTypes', {
            	extend: 'Ext.data.Model',
                fields: [{
                    name: 'typeID',
                    type: 'string'
                }, {
                    name: 'typeName',
                    type: 'string'
                }]
            }),
            storeId: 'storeDBTypes',
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
}); 
/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.store.DiagramModelStore', {
    extend: 'Ext.data.JsonStore',
    storeId: 'diagramModelStore',
    fields: [{
        name: 'id', mapping: 'id'
    }, {
        name: 'tableName'
    }]
}); 
Ext.define('ProtoUL.store.Diagrams', {
    extend: 'Ext.data.Store',
    model: 'ProtoUL.model.Diagram',
    autoLoad: false,
 
    proxy: {
        type: 'ajax',
        api: {
            create: _SM._PConfig.createDiagram,
            read: _SM._PConfig.listDiagrams,
            update: _SM._PConfig.updateDiagram,
            destroy: _SM._PConfig.deleteDiagram,
        },
        reader: {
            type: 'json',
            root: 'diagrams',
            successProperty: 'success'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            encode: true,
            root: 'diagrams'
        },
        pageParam:  false,
        startParam: false,
      	limitParam: false
    }
});
/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.store.PortPositions', {
    extend: 'Ext.data.Store',

    fields: ['id', 'description'],
    data: [
        {"id": "left","description": "Gauche"},
        {"id": "right","description": "Droite"},
        {"id": "top","description": "Haut"},
        {"id": "bottom","description": "Bas"}
    ]
}); 
Ext.define('ProtoUL.view.diagram.DiagramMenu', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.diagramMenu',

    requires: ['Ext.menu.Menu', 'Ext.menu.Item', 'Ext.button.Button'],

    itemId: 'menuPanel',
    width: 190,
    layout: 'accordion',
    collapseDirection: 'left',
    collapsible: true,
    title: 'Menu',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                xtype: 'panel',
                collapsible: true,
                title: 'Toolbox',
                html: '<div data-shape="dbModel.shape.DBTable" class="palette_node_element draw2d_droppable table_div">Table</div>',
                items: [{
                    xtype: 'menu',
                    floating: false,
                    itemId: 'DatabaseMenu',
                    items: [{
                        xtype: 'menuitem',
                        itemId: 'getAllTables',
                        iconCls: 'find-table',
                        text: _SM.__language.Menu_Search_Table,
                    }]
                }]
            }, {
                xtype: 'panel',
                title: _SM.__language.Menu_Database_Title,
                items: [{
                    xtype: 'databasemenu'
                }]
            }]
        });

        me.callParent(arguments);
    }
}); 
var countFigure = 0;

Ext.define('ProtoUL.view.diagram.DiagramToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.diagramtoolbar',

    requires: [
        'Ext.button.Button',
        'Ext.container.ButtonGroup'
    ],

    itemId: 'diagramtoolbar',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'button',
                    itemId: 'btUndo',
                    border: 1,
                    disabled: true,
                    text: _SM.__language.Text_Undo_Button
                },
                {
                    xtype: 'button',
                    itemId: 'btRedo',
                    disabled: true,
                    text: _SM.__language.Text_Redo_Button
                },
                {
                    xtype: 'tbspacer',
					width: 10
                },
                {
                    xtype: 'button',
                    itemId: 'btDelete',
					disabled: true,
                    text: _SM.__language.Text_Delete_Button
                },
                {
                    xtype: 'tbspacer'
                },
                {
                    xtype: 'buttongroup',
                    itemId: 'zoomGroup',
                    header: false,
                    columns: 3,
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'btZoomIn',
                            text: _SM.__language.Text_ZoomIn_Button
                        },
                        {
                            xtype: 'button',
                            itemId: 'btZoomNormal',
                            text: '1:1'
                        },
						{
                            xtype: 'button',
                            itemId: 'btZoomOut',
                            text: _SM.__language.Text_ZoomOut_Button
                        }
                    ]
                },
                {
                	xtype: 'tbspacer'
                },
                {
                	xtype: 'button',
                	iconCls: 'save-diagram',
                    itemId: 'btSaveDiagram',
                    text: _SM.__language.Text_Save_Diagram_Button
                },
                {
                	xtype: 'button',
                	iconCls: 'send-to-DB',
                    itemId: 'btSyncToDB',
                    disabled: true,
                    text: _SM.__language.Text_Commit_Changes_Button
                },
                {
                	xtype: 'button',
                	iconCls: 'icon-print',
                	itemId: 'btExportDiagram',
                	text: _SM.__language.Text_Export_Image
                }
            ]
        });

        me.callParent(arguments);
    },
    
    /**
	 * @method
	 * Called if the selection in the cnavas has been changed. You must register this
	 * class on the canvas to receive this event.
	 * 
	 * @param {draw2d.Figure} figure
	 */
	onSelectionChanged : function(figure){
		var btnDelete = this.getComponent('btDelete');
		if (figure !== null && countFigure === 0) {
			countFigure += 1;
			btnDelete.setDisabled(false);
		} else if (figure !== null && countFigure > 0) {
			btnDelete.setDisabled(false);
		} else if (figure === null && countFigure > 0) {
			countFigure -= 1;
		} else if (figure === null && countFigure === 0) {
			btnDelete.setDisabled(true);
		}
	},
	
	/**
	 * @method
	 * Sent when an event occurs on the command stack. draw2d.command.CommandStackEvent.getDetail() 
	 * can be used to identify the type of event which has occurred.
	 * 
	 * @template
	 * 
	 * @param {draw2d.command.CommandStackEvent} event
	 **/
	stackChanged:function(event)
	{
		var btnUndo = this.getComponent('btUndo');
		var btnRedo = this.getComponent('btRedo');
		var btnSaveAll = this.getComponent('btSaveDiagram');
		if (event.getStack().canUndo()){
			btnUndo.setDisabled(false);
			btnSaveAll.setDisabled(false);
			btnRedo.setDisabled(true);
		}
		if (event.getStack().canRedo()){
			btnRedo.setDisabled(false);
		}
	}

});
(function() {
    // Get a reference to the original function.
    var origHide = Ext.menu.Menu.prototype.hide;

    // That's beyond ugly, but I had to write this to get the menu working on IE.
    Ext.override(Ext.menu.Menu, {
        hide: function() {
            origHide.apply(this, arguments);
        }
    });
})();

Ext.define('ProtoUL.view.diagram.DiagramCanvas', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.canvas',

    requires: ['ProtoUL.view.diagram.DiagramToolbar', 'Ext.toolbar.Toolbar'],

    itemId: 'contentPanel',
    autoScroll: true,
    header: false,
    listeners: {
        afterrender: function() {
            this.view = new dbModel.View('canvas');
            this.reload();
        }
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                xtype: 'panel',
                baseCls: 'container',
                bodyCls: 'canvas',
                html: '<div id="canvas" class="" style="width:1500px; height:1500px;-webkit-tap-highlight-color: rgba(0,0,0,0); "></div>'
            }],
            dockedItems: [{
                xtype: 'diagramtoolbar',
                dock: 'top'
            }]
        });
        me.callParent(arguments);
    },

    reload: function() {
        var me = this;
        me.view.clear();

        var reader = new draw2d.io.json.Reader();
        reader.unmarshal(me.getView(), jsonDocument);

        var toolbar = me.getComponent('diagramtoolbar');
        me.view.addSelectionListener(toolbar);
        me.view.getCommandStack().addEventListener(toolbar);

        var controller = ProtoUL.app.getController('DiagramController');
        me.view.addSelectionListener(controller);

        me.view.figures.each(function(i, figure) {
            figure.addContextMenuListener(me);
            figure.addOnDropConnectionListener(controller);
        });

        // TODO add listener.
        // me.view.lines.each(function(i, connection) {
        // });
    },

    getView: function() {
        return this.view;
    },

    onContextMenu: function(figure, x, y) {
        var me = this;
        if ( typeof figure.sourcePort === "undefined") {
            var tableContextMenu = Ext.create('ProtoUL.view.diagram.TableContextMenu', {
                figure: figure
            });
            if ( typeof window.event !== "undefined") {
                tableContextMenu.showAt(window.event.clientX, window.event.clientY);
            } else {
                tableContextMenu.showAt(x, y);
            }
        } else {
            // TODO add listener.
            console.log("Connection");
        }
    }
});

Ext.define('ProtoUL.view.diagram.EntityAttributes', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.entityattributes',

    requires: ['Ext.grid.column.CheckColumn', 'Ext.grid.column.Boolean', 'Ext.grid.View'],
    itemId: 'entityattributes',
    title: _SM.__language.Title_Attributes,
    store: 'EntityAttributeStore',

    initComponent: function() {
        var me = this;

        me.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });

        me.plugins = [me.rowEditing];

        var storeDBTypes = Ext.create('ProtoUL.store.DBTypesStore');

        Ext.applyIf(me, {
            columns: [{
                xtype: 'gridcolumn',
                dataIndex: 'text',
                text: _SM.__language.GridColumn_Name,
                editor: {
                    allowBlank: false
                }
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'datatype',
                text: _SM.__language.GridColumn_Datatype,
                width: 90,
                editor: {
                    xtype: 'combo',
                    store: storeDBTypes,
                    displayField: 'typeName',
                    valueField: 'typeID',
                    queryMode: 'local',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    allowBlank: false
                }
            }, {
                xtype: 'checkcolumn',
                width: 30,
                dataIndex: 'pk',
                text: 'PK',
                editor: {
                    xtype: 'checkbox',
                    cls: 'x-grid-checkheader-editor'
                },
                listeners: {
                    checkchange: function(column, recordIndex, checked) {
                        this.up('grid').checkChanged(column, recordIndex, checked);
                    }
                }

            }, {
                xtype: 'checkcolumn',
                width: 30,
                dataIndex: 'fk',
                text: 'FK',
                editor: {
                    xtype: 'checkbox',
                    cls: 'x-grid-checkheader-editor'
                },
                listeners: {
                    checkchange: function(column, recordIndex, checked) {
                        this.up('grid').checkChanged(column, recordIndex, checked);
                    }
                }
            }, {
                xtype: 'checkcolumn',
                width: 50,
                dataIndex: 'isRequired',
                text: _SM.__language.GridColumn_Required,
                editor: {
                    xtype: 'checkbox',
                    cls: 'x-grid-checkheader-editor'
                },
                listeners: {
                    checkchange: function(column, recordIndex, checked) {
                        this.up('grid').checkChanged(column, recordIndex, checked);
                    }
                }
            }, {
                xtype: 'checkcolumn',
                width: 35,
                dataIndex: 'isNullable',
                text: 'Null',
                editor: {
                    xtype: 'checkbox',
                    cls: 'x-grid-checkheader-editor'
                },
                listeners: {
                    checkchange: function(column, recordIndex, checked) {
                        this.up('grid').checkChanged(column, recordIndex, checked);
                    }
                }
            }]
        });

        me.dockedItems = [{
            xtype: 'toolbar',
            items: [{
                iconCls: 'icon-tableAdd',
                itemId: 'btAddAttribute',
                text: _SM.__language.Text_Add_Button,
                action: 'addattribute'
            }, {
                iconCls: 'icon-tableDelete',
                itemId: 'btDeleteAttribute',
                text: _SM.__language.Text_Delete_Button,
                action: 'deleteattribute'
            }, '->', {
                iconCls: 'icon-panelDown',
                itemId: 'btMoveDown',
                handler: function(btn, event) {
                    var grid = btn.up('grid');
                    grid.moveSelectedRow(grid, -1);
                },
                disabled: true
            }, {
                iconCls: 'icon-panelUp',
                itemId: 'btMoveUp',
                handler: function(btn, event) {
                    var grid = btn.up('grid');
                    grid.moveSelectedRow(grid, 1);
                },
                disabled: true
            }]
        }];

        me.callParent(arguments);

        me.on('edit', function(editor, e) {
            e.record.commit();
            var form = this.ownerCt;
            var btSaveTable = form.getDockedItems('toolbar[dock="top"]')[0].getComponent('btSaveTable');
            btSaveTable.fireEvent('click');
        });
    },

    listeners: {
        select: {
            fn: function() {
                var btMoveDown = this.down('button[itemId=btMoveDown]');
                btMoveDown.setDisabled(false);
                var btMoveUp = this.down('button[itemId=btMoveUp]');
                btMoveUp.setDisabled(false);
            }
        }
    },

    moveSelectedRow: function(grid, direction) {
        var record = grid.getSelectionModel().getSelection();
        if (!record) {
            return;
        }
        var store = grid.getStore();
        var index = grid.getStore().indexOfId(record[0].internalId);
        if (direction > 0) {
            index--;
            if (index < 0) {
                return;
            }
        } else {
            index++;
            if (index >= grid.getStore().getCount()) {
                return;
            }
        }
        grid.getStore().remove(record);
        grid.getStore().insert(index, record);
        grid.getSelectionModel().select(record);
        
		var btSaveTable = grid.ownerCt.getDockedItems('toolbar[dock="top"]')[0].getComponent('btSaveTable');
        btSaveTable.fireEvent('click');
    },

    checkChanged: function(column, recordIndex, checked) {
        // force selection of the clicked row
        var grid = this;
        grid.getSelectionModel().select(recordIndex);
        // construct Event Object, could not find any method to retrieve it at this point
        e = {
            grid: grid,
            record: grid.getSelectionModel().getSelection()[0],
            field: 'visible',
            value: checked,
            rowIdx: recordIndex,
            colIdx: column.getIndex()
        };
        grid.rowEditing.fireEvent('edit', this, e);
    }
});

Ext.define('ProtoUL.view.diagram.EntityEditor', {
    extend: 'Ext.form.Panel',
    alias: 'widget.entityeditor',

    requires: ['ProtoUL.view.diagram.EntityAttributes', 'Ext.form.FieldSet', 'Ext.form.field.Text', 'Ext.grid.Panel'],

    itemId: 'entityeditor',
    width: 370,
    bodyPadding: 10,
    title: 'Detail',
    autoScroll: true,

    initComponent: function() {
        var me = this;

		if (!me.fieldPicker) {
	        me.fieldPicker = Ext.create('Ext.form.field.Picker', {
	            id: 'colorpicker',
	            createPicker: function() {
	                return Ext.create('Ext.picker.Color', {
	                    resizable: true,
	                    floating: true,
	                    select: function(selColor) {
	                        var editor = Ext.getCmp('colorpicker');
	                        editor.setValue("#" + selColor);
	                        editor.setFieldStyle('background-color:' + editor.getValue() + ' ;background-image: none;');
	                        editor.collapse();
	                    }
	                });
	            },
				listeners: {
					focus: function(obj, event, eOpts) {
						obj.setFieldStyle('background-color:' + obj.getValue() + ' ;background-image: none;');
					}
				}
	        });
		}
        Ext.applyIf(me, {
            items: [{
                xtype: 'propertygrid',
                itemId: 'protoProperty',
                sourceConfig: {
                    tableName: {
                        displayName: '<strong>' + _SM.__language.Label_Table_Name + '</strong>'
                    },
                    isPrimary: {
                        displayName: _SM.__language.Label_Dependency
                    },
                    name: {
                        displayName: '<strong>' + _SM.__language.Label_Connector_Name + '</strong>'
                    },
                    color: {
                        displayName: 'Couleur', //Couleur de la bordure
                        editor: me.fieldPicker
                    },
                    alpha: {
                    	displayName: 'Transparence'
                    }
                },
                listeners: {
                    propertychange: function(source, recordId, value, oldValue, eOpts) {
                        var form = this.up('form');
                        var btSaveTable = form.getDockedItems('toolbar[dock="top"]')[0].getComponent('btSaveTable');
                        btSaveTable.fireEvent('click');
                    }
                }
            }, {
                xtype: 'fieldset'
            }, {
                xtype: 'entityattributes',
                title: _SM.__language.Title_Attributes,
                height: 280
            }]
        });

        this.dockedItems = [{
            xtype: 'toolbar',
            hidden: true,
            items: [{
                iconCls: 'menu_reload',
                itemId: 'btSaveTable',
                text: _SM.__language.Text_UpdateDiagram_Button,
                action: 'savetable'
            }]
        }];

        me.callParent(arguments);
    }
});

/**
 * @author Giovanni Victorette
 */

Ext.define('ProtoUL.view.diagram.TableContextMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.tablecontextmenu',

    figure: null,

    itemId: 'tablecontextmenu',
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                text: _SM.__language.Menu_Add_Recursive_Association,
                iconCls: 'table-relationship',
                itemId: 'btAddConnectorRecursive'
            }, {
                text: _SM.__language.Menu_Add_Input_Port,
                iconCls: 'icon-nodeInput',
                itemId: 'btAddInputPort'
            }, {
            	text: _SM.__language.Menu_Add_Output_Port,
            	iconCls: 'icon-nodeInsert',
                itemId: 'btAddOutputPort'
            }, {
                text: _SM.__language.Menu_Remove_Unused_Ports,
                iconCls: 'icon-nodeDelete',
                itemId: 'btRemoveUnusedPorts'
            }]
        });
        me.callParent(arguments);
    },

    getFigure: function() {
        return this.figure;
    }
});

Ext.define('ProtoUL.view.diagram.DatabaseMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.databasemenu',

    requires: [
        'Ext.menu.Item'
    ],

    floating: false,
    itemId: 'DatabaseMenu',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'menuitem',
                	itemId: 'syncDiagramFromDB',
                	iconCls: 'get-from-DB',
                    text: _SM.__language.Menu_Update_Diagram,
                },
                {
                	xtype: 'menuseparator'
                },
                {
                    xtype: 'menuitem',
                    itemId: 'menuManageDiagram',
                    iconCls: 'icon-model',
                    text: _SM.__language.Menu_Manage_Diagrams,
                }
            ]
        });

        me.callParent(arguments);
    }

});
Ext.define('ProtoUL.view.diagram.DiagramMainView', {
    extend: 'Ext.window.Window',
    alias: 'widget.diagramMainView',

    requires: ['ProtoUL.view.diagram.DiagramMenu', 'ProtoUL.view.diagram.DiagramCanvas', 'ProtoUL.view.diagram.EntityEditor', 'Ext.panel.Panel'],

    itemId: 'diagramMainView',
    layout: 'border',
    maximizable: true,
    modal: true,
    height: 600,
    width: 1200,
	
	projectID: null,
	diagramID: null,
	
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                xtype: 'diagramMenu',
                region: 'west',
                split: true,
                collapsible: true
            }, {
                xtype: 'canvas',
                flex: 1,
                region: 'center'
            }, {
                xtype: 'entityeditor',
                region: 'east',
                split: true,
                collapsed: true,
                collapsible: true
            }]
        });
    	me.addEvents(
            'opendiagram'
        );
    	me.on('beforeshow', function(){
    		this.fireEvent('opendiagram');
		});
		
        me.callParent(arguments);
    },
		
    setProjectID: function(id) {
    	this.projectID = id;
    },
    
    getProjectID: function() {
    	return this.projectID;
    },
		
    setDiagramID: function(id) {
    	this.diagramID = id;
    },
    
    getDiagramID: function() {
    	return this.diagramID;
    }
});
/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.view.diagram.base.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.diagramgrid',

    requires: ['Ext.toolbar.Paging'],

    iconCls: 'icon-grid',
    itemId: 'diagramgrid',

    store: 'Diagrams',
    header: false,

    columns: [{
        header: "ID",
        width: 20,
        dataIndex: 'id'
    }, {
        header: _SM.__language.GridColumn_Name,
        flex: 1,
        dataIndex: 'code'
    }],
    
    listeners: {
        select: {
            fn: function(){ 
                var btOpenDiagram = this.down('button[itemId=btOpenDiagram]');
                btOpenDiagram.setDisabled(false);
            }
        }
    },

    initComponent: function() {
        this.dockedItems = [{
            xtype: 'toolbar',
            items: [{
                iconCls: 'icon-save',
                text: _SM.__language.Text_Add_Button,
                action: 'add'
            }, {
                iconCls: 'icon-delete',
                text: _SM.__language.Text_Delete_Button,
                action: 'delete'
            }, {
                iconCls: 'open-file',
                text: _SM.__language.Text_OpenDiagram_Button,
                action: 'openselecteddiagram',
                itemId: 'btOpenDiagram',
                disabled: true
            }]
        }, {
            xtype: 'pagingtoolbar',
            dock: 'top',
            store: 'Diagrams',
            displayInfo: true,
            displayMsg: 'Showing Diagrams {0} - {1} of {2}',
            emptyMsg: "No diagram found.",
            listeners: {
                afterrender : function() {
                    this.child('#refresh').hide();
                }
            }
        }];
        this.callParent(arguments);
    }
}); 
/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.view.diagram.base.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.diagramform',

    requires: ['Ext.form.Panel', 'Ext.form.field.Text'],

    title: 'Edit/Create Diagram',
    layout: 'fit',
    autoShow: true,
    width: 280,
    itemId: 'diagramform',

    iconCls: 'icon-pclDetails',

    initComponent: function() {
        this.items = [{
            xtype: 'form',
            padding: '5 5 0 5',
            border: false,
            style: 'background-color: #fff;',

            fieldDefaults: {
                anchor: '100%',
                labelAlign: 'left',
                combineErrors: true,
                msgTarget: 'side'
            },

            items: [{
                xtype: 'textfield',
                name: 'id',
                fieldLabel: 'id',
                hidden: true
            }, {
            	xtype: 'textfield',
                name: 'projectID',
                fieldLabel: 'projectID',
                hidden: true
            }, {
                xtype: 'textfield',
                name: 'code',
                allowBlank: false,
                fieldLabel: _SM.__language.GridColumn_Name,
                validator: function(val) {
                    if (!Ext.isEmpty(Ext.String.trim(val))) {
                        return true;
                    } else {
                        return "Value cannot be empty";
                    }
                }
            }, {
                xtype: 'textfield',
                name: 'smUUID',
                readOnly: true,
                fieldLabel: 'UUID',
                hidden: true
            }]
        }];

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            id: 'buttons',
            ui: 'footer',
            items: ['->', {
                iconCls: 'icon-save',
                text: _SM.__language.Text_Save_Button,
                action: 'save'
            }, {
                iconCls: 'icon-reset',
                text: _SM.__language.Text_Cancel_Button,
                scope: this,
                handler: this.close
            }]
        }];

        this.callParent(arguments);
    }
}); 
/**
 * @class ProtoUL.view.searchmodel.LiveSearchGridPanel
 * @extends Ext.grid.Panel
 * <p>A GridPanel class with live search support.</p>
 * @author Giovanni Victorette
 *  Based on Nicolas Ferrero LiveSearchGridPanel
 */
Ext.define('ProtoUL.view.searchmodel.LiveSearchGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.livesearchgrid',
    requires: [
        'Ext.toolbar.TextItem',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Text'
    ],
    
    itemId: 'livesearchgrid',
    /**
     * @private
     * search value initialization
     */
    searchValue: null,
    
    /**
     * @private
     * The row indexes where matching strings are found. (used by previous and next buttons)
     */
    indexes: [],
    
    /**
     * @private
     * The row index of the first search, it could change if next or previous buttons are used.
     */
    currentIndex: null,
    
    /**
     * @private
     * The generated regular expression used for searching.
     */
    searchRegExp: null,
    
    /**
     * @private
     * Case sensitive mode.
     */
    caseSensitive: false,
    
    /**
     * @private
     * Regular expression mode.
     */
    regExpMode: false,
    
    /**
     * @cfg {String} matchCls
     * The matched string css classe.
     */
    matchCls: 'x-livesearch-match',
    
    defaultStatusText: 'Nothing Found',
    
    // Component initialization override: adds the top and bottom toolbars and setup headers renderer.
    initComponent: function() {
        var me = this;
        me.tbar = ['Search',{
                 xtype: 'textfield',
                 name: 'searchField',
                 hideLabel: true,
                 width: 200,
                 listeners: {
                     change: {
                         fn: me.onTextFieldChange,
                         scope: this,
                         buffer: 100
                     }
                 }
            }, {
                xtype: 'button',
                text: '<',
                tooltip: 'Find Previous Row',
                handler: me.onPreviousClick,
                scope: me
            },{
                xtype: 'button',
                text: '>',
                tooltip: 'Find Next Row',
                handler: me.onNextClick,
                scope: me
            }, '-', {
                xtype: 'checkbox',
                hideLabel: true,
                margin: '0 0 0 4px',
                handler: me.regExpToggle,
                scope: me                
            }, 'Regular expression', {
                xtype: 'checkbox',
                hideLabel: true,
                margin: '0 0 0 4px',
                handler: me.caseSensitiveToggle,
                scope: me
            }, 'Case sensitive'];

        me.bbar = {
        	xtype: 'searchgridbbar'
        };
        
        me.callParent(arguments);
    },
    
    // afterRender override: it adds textfield and statusbar reference and start monitoring keydown events in textfield input 
    afterRender: function() {
        var me = this;
        me.callParent(arguments);
        me.textField = me.down('textfield[name=searchField]');
        me.statusBar = Ext.ComponentQuery.query('#bbarDefaultText')[0];
        me.statusBar.setText(me.defaultStatusText);
        
    },
    // detects html tag
    tagsRe: /<[^>]*>/gm,
    
    // DEL ASCII code
    tagsProtect: '\x0f',
    
    // detects regexp reserved word
    regExpProtect: /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm,
    
    /**
     * In normal mode it returns the value with protected regexp characters.
     * In regular expression mode it returns the raw value except if the regexp is invalid.
     * @return {String} The value to process or null if the textfield value is blank or invalid.
     * @private
     */
    getSearchValue: function() {
        var me = this,
            value = me.textField.getValue();
            
        if (value === '') {
            return null;
        }
        if (!me.regExpMode) {
            value = value.replace(me.regExpProtect, function(m) {
                return '\\' + m;
            });
        } else {
            try {
                new RegExp(value);
            } catch (error) {
            	me.statusBar.setText(error.message);
                return null;
            }
            // this is stupid
            if (value === '^' || value === '$') {
                return null;
            }
        }
        
        var length = value.length,
            resultArray = [me.tagsProtect + '*'],
            i = 0,
            c;
            
        for(; i < length; i++) {
            c = value.charAt(i);
            resultArray.push(c);
            if (c !== '\\') {
                resultArray.push(me.tagsProtect + '*');
            } 
        }
        return resultArray.join('');
    },
    
    /**
     * Finds all strings that matches the searched value in each grid cells.
     * @private
     */
     onTextFieldChange: function() {
         var me = this,
             count = 0;

         me.view.refresh();
         // reset the statusbar
         me.statusBar.setText(me.defaultStatusText);

         me.searchValue = me.getSearchValue();
         me.indexes = [];
         me.currentIndex = null;

         if (me.searchValue !== null) {
             me.searchRegExp = new RegExp(me.searchValue, 'g' + (me.caseSensitive ? '' : 'i'));
             
             
             me.store.each(function(record, idx) {
                 var td = Ext.fly(me.view.getNode(idx)).down('td'),
                     cell, matches, cellHTML;
                 while(td) {
                     cell = td.down('.x-grid-cell-inner');
                     matches = cell.dom.innerHTML.match(me.tagsRe);
                     cellHTML = cell.dom.innerHTML.replace(me.tagsRe, me.tagsProtect);
                     
                     // populate indexes array, set currentIndex, and replace wrap matched string in a span
                     cellHTML = cellHTML.replace(me.searchRegExp, function(m) {
                        count += 1;
                        if (Ext.Array.indexOf(me.indexes, idx) === -1) {
                            me.indexes.push(idx);
                        }
                        if (me.currentIndex === null) {
                            me.currentIndex = idx;
                        }
                        return '<span class="' + me.matchCls + '">' + m + '</span>';
                     });
                     // restore protected tags
                     Ext.each(matches, function(match) {
                        cellHTML = cellHTML.replace(me.tagsProtect, match); 
                     });
                     // update cell html
                     cell.dom.innerHTML = cellHTML;
                     td = td.next();
                 }
             }, me);

             // results found
             if (me.currentIndex !== null) {
                 me.getSelectionModel().select(me.currentIndex);
                 me.statusBar.setText(count + ' matche(s) found.');
             }
         }

         // no results found
         if (me.currentIndex === null) {
             me.getSelectionModel().deselectAll();
         }

         // force textfield focus
         me.textField.focus();
     },
    
    /**
     * Selects the previous row containing a match.
     * @private
     */   
    onPreviousClick: function() {
        var me = this,
            idx;
            
        if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
            me.currentIndex = me.indexes[idx - 1] || me.indexes[me.indexes.length - 1];
            me.getSelectionModel().select(me.currentIndex);
         }
    },
    
    /**
     * Selects the next row containing a match.
     * @private
     */    
    onNextClick: function() {
         var me = this,
             idx;
             
         if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
            me.currentIndex = me.indexes[idx + 1] || me.indexes[0];
            me.getSelectionModel().select(me.currentIndex);
         }
    },
    
    /**
     * Switch to case sensitive mode.
     * @private
     */    
    caseSensitiveToggle: function(checkbox, checked) {
        this.caseSensitive = checked;
        this.onTextFieldChange();
    },
    
    /**
     * Switch to regular expression mode
     * @private
     */
    regExpToggle: function(checkbox, checked) {
        this.regExpMode = checked;
        this.onTextFieldChange();
    }
});
Ext.define('ProtoUL.view.searchmodel.SearchBottomBar', {
	extend: 'Ext.toolbar.Toolbar',
	alias: 'widget.searchgridbbar',
    items: [
        {
            xtype: 'tbtext', 
            text: '',
            itemId: 'bbarDefaultText'
        },
        '->',
        { 
        	xtype: 'button', 
        	text: 'Add', 
        	itemId: 'btAddTableFromSearchBar',
			iconCls: 'icon-add'
        }, 
        { 
        	xtype: 'button', 
        	text: 'Cancel', 
        	itemId: 'btCancelSearchBar',
        	iconCls: 'icon-close'
        } 
    ]
});
/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.controller.PasswordManager', {
    extend: 'Ext.app.Controller',

    views: ['password.PasswordReset', 'password.ForgotPasswordForm'],

    init: function() {
        this.control({
            'passwordForm button[action=changepassword]': {
                click: this.changepassword
            },
            'forgotPasswordForm button[action=forgotpassword]': {
                click: this.forgotpassword
            },
        });
    },

    changepassword: function(button) {
        var form = button.up('form').getForm();
        if (form.isValid()) {
        	button.setIconCls("st-loading");
            form.submit({
                url: _SM._PConfig.urlSubmitChangePassword,
                method: 'POST',
                scope: this,
                success: function(form, action) {
                    Ext.Msg.alert("Success", _SM.__language.Message_Success_Password_Change, function(btn) {
                        if (btn == 'ok') {
                            Ext.destroy(Ext.ComponentQuery.query('passwordForm'));
                            Ext.Ajax.request({
                                url: 'protoExt',
                                success: function() {
                                    window.location = 'protoExt';
                                }
                            });
                        }
                    });
                },
                failure: function(form, action) {
                    Ext.Msg.alert('Failed', action.result.message);
                    button.setIconCls("st-key-go");
                }
            });
        }
    },

    forgotpassword: function(button) {
        var win = button.up('window'), form = win.down('form').getForm();
        if (form.isValid()) {
            button.setIconCls("st-loading");
            form.submit({
                url: _SM._PConfig.urlGetPasswordRecovery,
                method: 'POST',
                scope: this,
                success: function(form, action) {
                    Ext.Msg.alert(_SM.__language.Message_Success, _SM.__language.Message_Email_Forgotten_Password, function(btn) {
                        if (btn == 'ok') {
                            Ext.destroy(Ext.ComponentQuery.query('forgotPasswordForm'));
                        }
                    });
                    button.setIconCls("st-key-go");
                },
                failure: function(form, action) {
                    Ext.Msg.show({
                        title: _SM.__language.Message_Error,
                        msg: action.response.statusText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                    button.setIconCls("st-key-go");
                }
            });
        }
    }
}); 
/**
 * @class DiagramController
 *
 * This controller is used to capture events from diagram toolbar and diagram detail.
 *
 * @author Giovanni Victorette
 * @extend Ext.app.Controller
 */
Ext.define('ProtoUL.controller.DiagramController', {
    extend: 'Ext.app.Controller',

    stores: ['PortPositions'],

    refs: [{
        ref: 'diagramCanvas',
        selector: '#contentPanel'
    }, {
        ref: 'diagramToolbar',
        selector: '#diagramtoolbar'
    }, {
        ref: 'entityAttributes',
        selector: '#entityattributes'
    }, {
        ref: 'entityEditor',
        selector: '#entityeditor'
    }, {
        ref: 'diagramMainView',
        selector: '#diagramMainView'
    }, {
        ref: 'tableContextMenu',
        selector: '#tablecontextmenu'
    }],

    showProgressBar: function(msg, progressText) {
        Ext.MessageBox.show({
            msg: msg,
            progressText: progressText,
            width: 300,
            wait: true,
            waitConfig: {
                interval: 200
            }
        });
    },

    updateJsonDocument: function() {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(this.getDiagramCanvas().getView(), function(json) {
            jsonDocument = json;
        });
    },

    undoAction: function(button, e, eOpts) {
        this.getDiagramCanvas().getView().getCommandStack().undo();
    },

    redoAction: function(button, e, eOpts) {
        this.getDiagramCanvas().getView().getCommandStack().redo();
    },

    getAttributeFromTagetTable: function(connection) {
        var attribute = null;
        connection.targetPort.getParent().getChildren().each(function(i, w) {
            if (connection.id === w.id) {
                attribute = w;
            }
        });
        return attribute;
    },

    deleteObject: function(button, e, eOpts) {
        var node = this.getDiagramCanvas().getView().getCurrentSelection();
        if (node.targetPort) {
            var attribute = this.getAttributeFromTagetTable(node);
            node.targetPort.getParent().removeFigure(attribute);
            this.getDiagramCanvas().getView().removeFigure(node);
        } else {
	        var command = new draw2d.command.CommandDelete(node);
	        this.getDiagramCanvas().getView().getCommandStack().execute(command);
        }

        var gridDetail = this.getEntityAttributes();
        var entityEditor = this.getEntityEditor();
        var masterRecord = entityEditor.getComponent('protoProperty');
        gridDetail.hide();
        masterRecord.setSource(null);
    },

    zoomIn: function(button, e, eOpts) {
        this.getDiagramCanvas().getView().setZoom(this.getDiagramCanvas().getView().getZoom() * 0.7, true);
    },

    zoomNormal: function(button, e, eOpts) {
        this.getDiagramCanvas().getView().setZoom(1.0, true);
    },

    zoomOut: function(button, e, eOpts) {
        this.getDiagramCanvas().getView().setZoom(this.getDiagramCanvas().getView().getZoom() * 1.3, true);
    },

    enableToolbarButton: function(button) {
        var toolbarButton = this.getDiagramToolbar().getComponent(button);
        toolbarButton.setDisabled(false);
    },

    createEntityAttribute: function(text, id, pk, fk, datatype) {
        return Ext.create('ProtoUL.model.EntityAttributesModel', {
            text: text,
            id: id,
            inputPort: '',
            datatype: 'string',
            unique: false,
            pk: pk,
            fk: fk,
            isRequired: false,
            isNullable: false
        });
    },

    createAjaxRequest: function(url, method, params, jsonData, successFunction, failureFunction) {
        Ext.Ajax.request({
            url: url,
            method: method,
            params: params,
            jsonData: jsonData,
            success: successFunction,
            failure: failureFunction
        });
    },
    addAttribute: function(button, e, eOpts) {
        var entityEditor = this.getEntityEditor();
        var gridDetail = this.getEntityAttributes();
        gridDetail.rowEditing.cancelEdit();
        var attribute = this.createEntityAttribute('new attribute' + gridDetail.getStore().data.length, draw2d.util.UUID.create(), false, false, 'string');
        gridDetail.getStore().insert(gridDetail.getStore().data.length, attribute);
        entityEditor.figure.addAttribute(0, attribute);
        entityEditor.figure.setDimension(1, 1);
    },

    deleteAttribute: function(button, e, eOpts) {
        var gridDetail = this.getEntityAttributes();
        var sm = gridDetail.getSelectionModel();
        var attribute = sm.getSelection()[0];
        var figure = gridDetail.ownerCt.figure;
        if (attribute.data.fk) {
            var canvas = this.getDiagramCanvas().getView();
            figure.getConnections().each(function(index, connection) {
                if (attribute.data.id === connection.id) {
                    canvas.removeFigure(connection);
                }
            });
        }

        gridDetail.rowEditing.cancelEdit();
        gridDetail.getStore().remove(sm.getSelection());
        if (gridDetail.getStore().getCount() > 0) {
            sm.select(0);
        }
        figure.getChildren().each(function(index, label) {
            if (attribute.data.id === label.id) {
                figure.removeFigure(label);
            }
        });
    },

    addOrUpdateJSONDocument: function(data) {
        var isAdd = true;
        for (var i = 0; i < jsonDocument.length; i++) {
            if (jsonDocument[i].id === data.id) {
                jsonDocument[i] = data;
                isAdd = false;
            }
        }
        if (isAdd) {
            jsonDocument.push(data);
        }
    },

    saveTable: function(button, e, eOpts) {
        var entityEditor = this.getEntityEditor();
        var propertySource = entityEditor.getComponent('protoProperty').source;
        var gridDetailStore = this.getEntityAttributes().getStore();

        if ( typeof propertySource.attributes !== "undefined") {
            var sm = this.getEntityAttributes().getSelectionModel();
            var attribute = sm.getSelection()[0];
            if (attribute) {
                if (attribute.data.fk) {
                    entityEditor.figure.getConnections().each(function(index, connection) {
                        if (attribute.data.id === connection.id) {
                            var memento = connection.getPersistentAttributes();
                            memento.name = attribute.data.text;
                            memento.userData.isPrimary = attribute.data.pk;
                            connection.setPersistentAttributes(memento);
                        }
                    });
                }

            }
            propertySource.attributes.splice(0, propertySource.attributes.length);
            gridDetailStore.each(function(record) {
                propertySource.attributes.push(record.data);
            });
            for (var i = entityEditor.figure.attributes.size - 1; i >= 0; i--) {
                entityEditor.figure.removeFigure(entityEditor.figure.attributes.get(i));
            }
            entityEditor.figure.setColor(propertySource.color);
            entityEditor.figure.setAlpha(propertySource.alpha);
            entityEditor.figure.updateHeader(propertySource);
            entityEditor.figure.updateAttributes(propertySource);
            entityEditor.figure.setDimension(1, 1);
        } else if ( typeof propertySource.router !== "undefined") {
            propertySource.userData.isPrimary = propertySource.isPrimary;
            var attribute = this.getAttributeFromTagetTable(entityEditor.figure);
            attribute.pk = propertySource.isPrimary;
            attribute.setText(propertySource.name);
            attribute.setBold(attribute.pk);
            if (attribute.pk) {
                attribute.setCssClass('primary_key');
            } else {
                attribute.setCssClass('draw2d_shape_basic_Label');
            }
            entityEditor.figure.setPersistentAttributes(propertySource);
        }
    },

    saveDiagram: function(button, e, eOpts) {
        this.showProgressBar(_SM.__language.Message_Saving_Data, _SM.__language.Text_Submit_Validation_Form);
        this.updateJsonDocument();

        var controller = this;
        params = {
            projectID: controller.getDiagramMainView().getProjectID(),
            diagramID: controller.getDiagramMainView().getDiagramID()
        };
        successFunction = function(response) {
            setTimeout(function() {
                Ext.MessageBox.close();
            }, 1000);
        };
        failureFunction = function(response) {
            Ext.MessageBox.close();
            console.log('Failure: saveDiagram');
        };
        this.createAjaxRequest(_SM._PConfig.saveDiagram, "POST", params, Ext.JSON.encode(jsonDocument), successFunction, failureFunction);

        this.enableToolbarButton('btSyncToDB');
    },

    updateJSONFromData: function(index, data) {
        if (data.type === 'dbModel.shape.DBTable') {
            jsonDocument[index].tableName = data.tableName;
            jsonDocument[index].attributes = data.attributes;
        }
    },

    synchronizeJSONDocument: function(data) {
        for (var i = 0; i < jsonDocument.length; i++) {
            if (jsonDocument[i].id === data.id) {
                this.updateJSONFromData(i, data);
            }
        }
    },

    synchDBFromDiagram: function(button, e, eOpts) {
        var controller = this;
        controller.showProgressBar(_SM.__language.Message_Creating_Objects, _SM.__language.Text_Submit_Validation_Form);
        params = {
            projectID: controller.getDiagramMainView().getProjectID()
        };
        successFunction = function(response) {
            var text = response.responseText;
            var outcome = Ext.JSON.decode(text);
            for (var i = 0; i < outcome.tables.length; i += 1) {
                controller.synchronizeJSONDocument(outcome.tables[i]);
            }
            controller.getDiagramCanvas().reload();
            controller.updateJsonDocument();
            Ext.MessageBox.close();
        };
        failureFunction = function(response) {
            Ext.MessageBox.close();
            console.log('Failure: synchDBFromDiagram');
        };
        this.createAjaxRequest(_SM._PConfig.synchDBFromDiagram, "POST", params, jsonDocument, successFunction, failureFunction);
        button.setDisabled(true);
    },

    runAjaxOpenDiagram: function(controller, url, projectID, diagramID) {
        Ext.Ajax.request({
            url: url,
            method: "GET",
            params: {
                projectID: projectID,
                diagramID: diagramID
            },
            success: function(response) {
                var text = response.responseText;
                var outcome = Ext.JSON.decode(text);

                if (outcome.diagram === "{}") {
                    jsonDocument = [];
                } else {
                    jsonDocument = Ext.JSON.decode(outcome.diagram).objects;
                }
                controller.getDiagramMainView().setTitle(_SM.__language.Title_Work_Diagram + outcome.diagramCode);
                controller.getDiagramMainView().setDiagramID(outcome.diagramID);
                controller.getDiagramCanvas().reload();
            },
            failure: function(response) {
                console.log('Failure: openDiagram');
            }
        });
    },

    openDiagram: function(button, e, eOpts) {
        var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
        var diagramID = controller.getDiagramMainView().getDiagramID();
        if (diagramID === null) {
            controller.runAjaxOpenDiagram(controller, _SM._PConfig.getDefaultDiagram, projectID, null);
        } else {
            controller.runAjaxOpenDiagram(controller, _SM._PConfig.openDiagram, projectID, diagramID);
        }
    },

    exportDiagramToPNG: function updatePreview() {
        // convert the canvas into a PNG image source string
        var canvas = this.getDiagramCanvas().getView();
        var xCoords = [], yCoords = [];
        canvas.getFigures().each(function(i, f) {
            var b = f.getBoundingBox();
            xCoords.push(b.x, b.x + b.w);
            yCoords.push(b.y, b.y + b.h);
        });
        var minX = 0, minY = 0;
        var width = Math.max.apply(Math, xCoords) - minX;
        var height = Math.max.apply(Math, yCoords) - minY;
        var writer = new draw2d.io.png.Writer();
        var image = null;
        writer.marshal(canvas, function(png) {
            image = png;
        }, new draw2d.geo.Rectangle(minX, minY, width, height));

        var printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write('<html><head>');
        printWindow.document.write('<title>' + 'Print diagram' + '</title>');
        printWindow.document.write('<link rel="Stylesheet" type="text/css" href="http://dev.sencha.com/deploy/ext-4.0.1/resources/css/ext-all.css" />');
        printWindow.document.write('<script type="text/javascript" src="http://dev.sencha.com/deploy/ext-4.0.1/bootstrap.js"></script>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<img class="shadow" ' + 'src=' + image + ' id="preview" style="border-radius:1px;overflow:auto; top:10px; right:10px; border:0px solid gray;"/>');
        printWindow.document.write('</body></html>');
        printWindow.print();

    },

    hidePropertyGridAttributes: function(masterRecord) {
        masterRecord.getView().getRowClass = function(row, index) {
            if (row.data.name !== 'isPrimary' && row.data.name !== 'name' && row.data.name !== 'tableName' && row.data.name !== 'color' && row.data.name !== 'alpha') {
                return 'hide-this-row';
            } else {
                return '';
            }
        };
    },

    // dbModel listeners
    onSelectionChanged: function(figure) {
        var controller = this;
        if (figure !== null) {
            var gridDetail = controller.getEntityAttributes();
            var entityEditor = controller.getEntityEditor();
            var masterRecord = entityEditor.getComponent('protoProperty');
            entityEditor.figure = figure;

            var myObj = figure.getPersistentAttributes();
            if (figure.cssClass === 'dbModel_shape_DBTable' || figure.cssClass === 'DBTable') {
                gridDetail.show();

                if ( typeof myObj !== 'undefined') {
                    masterRecord.setSource(myObj);
                    controller.hidePropertyGridAttributes(masterRecord);
                    gridDetail.getStore().loadRawData(myObj.attributes);
                }
            } else {
                gridDetail.hide();

                myObj.isPrimary = myObj.userData.isPrimary;
                if ( typeof myObj !== 'undefined') {
                    masterRecord.setSource(myObj);
                    controller.hidePropertyGridAttributes(masterRecord);
                }
            }
        }
    },

    // Used to synchonize connector and attribute
    onDropConnection: function(connection, figure) {
        var me = this;
        me.onSelectionChanged(figure);

        if (connection !== null) {
            var gridDetail = me.getEntityAttributes();
            var entityEditor = me.getEntityEditor();
            gridDetail.rowEditing.cancelEdit();
            var attribute = this.createEntityAttribute(connection.getConnectionName(), connection.getId(), false, true, 'string');

            gridDetail.getStore().insert(gridDetail.getStore().data.length, attribute);
            var label = entityEditor.figure.addAttribute(0, attribute.data);
            label.setId(attribute.data.id);
            label.datatype = attribute.data.datatype;
            label.pk = attribute.data.pk;
            label.fk = attribute.data.fk;
            label.isRequired = attribute.data.isRequired;
            label.isNullable = attribute.data.isNullable;
            entityEditor.figure.setDimension(1, 1);
        }
    },

    init: function(application) {
        this.control({
            "#btUndo": {
                click: this.undoAction
            },
            "#btRedo": {
                click: this.redoAction
            },
            "#btDelete": {
                click: this.deleteObject
            },
            "#btZoomIn": {
                click: this.zoomIn
            },
            "#btZoomNormal": {
                click: this.zoomNormal
            },
            "#btZoomOut": {
                click: this.zoomOut
            },
            "#btSaveDiagram": {
                click: this.saveDiagram
            },
            "#btSyncToDB": {
                click: this.synchDBFromDiagram
            },
            "#btExportDiagram": {
                click: this.exportDiagramToPNG
            },
            "#btAddAttribute": {
                click: this.addAttribute
            },
            "#btDeleteAttribute": {
                click: this.deleteAttribute
            },
            "#btSaveTable": {
                click: this.saveTable
            },
            'panel': {
                opendiagram: this.openDiagram
            }
        });
    }
});

Ext.define('ProtoUL.controller.DiagramMenuController', {
    extend: 'Ext.app.Controller',

    stores: ['Diagrams'],

    models: ['Diagram'],

    views: ['diagram.base.Form', 'diagram.base.Grid'],

    refs: [{
        ref: 'diagramCanvas',
        selector: '#contentPanel'
    }, {
        ref: 'diagramToolbar',
        selector: '#diagramtoolbar'
    }, {
        ref: 'diagramMainView',
        selector: '#diagramMainView'
    }, {
        ref: 'liveGridSearch',
        selector: '#livesearchgrid'
    }, {
        ref: 'diagramForm',
        selector: '#diagramform'
    }, {
        ref: 'diagramGrid',
        selector: '#diagramgrid'
    }],

    updateJsonDocument: function() {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(this.getDiagramCanvas().getView(), function(json) {
            jsonDocument = json;
        });
    },

    updateJSONFromData: function(index, data) {
        if (data.type === 'dbModel.shape.DBTable') {
            jsonDocument[index].tableName = data.tableName;
            jsonDocument[index].attributes = data.attributes;
            jsonDocument[index].tablePorts = data.tablePorts;
        } else {
            jsonDocument[index].name = data.name;
            jsonDocument[index].source = data.source;
            jsonDocument[index].target = data.target;
        }
    },

    addOrUpdateJSONDocument: function(data) {
        var canvas = this.getDiagramCanvas().getView();
        if (data.type === 'dbModel.shape.DBTable') {
			var table = canvas.getFigure(data.id);
			if (table){
				canvas.removeFigure(table);
			}
			table = new dbModel.shape.DBTable();
			table.setPersistentAttributes(data);
			table.addContextMenuListener(this.getDiagramCanvas());
            table.addOnDropConnectionListener(this.application.controllers.get('DiagramController'));
			canvas.addFigure(table);
        } else {
			var connection = canvas.getFigure(data.id);
			if (!connection){
				connection = new dbModel.shape.TableConnection();
				connection.setPersistentAttributes(data);
				
				var sourceTable = canvas.getFigure(data.source.node);
				var targetTable = canvas.getFigure(data.target.node);
				if (sourceTable && targetTable) {
					var sourcePort = sourceTable.getPort(data.source.port);
					if (!sourcePort) {
						sourcePort = sourceTable.createCustomizedPort("draw2d_OutputPort",data.source.port ,'right');
					}

					var targetPort = targetTable.getPort(data.target.port);
					if (!targetPort) {
						targetPort = targetTable.createCustomizedPort("draw2d_InputPort",data.target.port ,'left');
					}

					connection.setSource(sourcePort);
					connection.setTarget(targetPort);
					connection._routingMetaData.routedByUserInteraction = false;
					canvas.addFigure(connection);
				}
			}
        }
    },

    synchronizeJSONDocument: function(data) {
        for (var i = 0; i < jsonDocument.length; i++) {
            if (jsonDocument[i].id === data.id) {
                this.updateJSONFromData(i, data);
            }
        }
    },

    enableToolbarButton: function(button) {
        var toolbarButton = this.getDiagramToolbar().getComponent(button);
        toolbarButton.setDisabled(false);
    },

    getAllTablesFromDB: function() {
        var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
        Ext.Ajax.request({
            url: _SM._PConfig.urlGetEntitiesJSONDiagram,
            params: {
                projectID: projectID
            },
            success: function(response) {
                var text = response.responseText;
                var outcome = Ext.JSON.decode(text);

                var store = Ext.create('ProtoUL.store.DiagramModelStore', {
                    data: outcome.tables
                });
                var statusText = outcome.tables.length + ' item(s) found';
                var win = new Ext.Window({
                    width: 540,
                    height: 300,
                    layout: 'fit',
                    items: {
                        xtype: 'livesearchgrid',
                        store: store,
                        selModel: Ext.create('Ext.selection.CheckboxModel'),
                        columns: [{
                            text: "Table",
                            flex: 1,
                            dataIndex: 'tableName',
                            sortable: true
                        }],
                        width: 540,
                        height: 200
                    }
                });
				var searchGrid = win.down('grid');
				searchGrid.getView().getRowClass = function(record, rowIndex, rowParams, store) {
					controller = ProtoUL.app.getController('DiagramController');
					var canvas = controller.getDiagramCanvas().getView();
					var figure = canvas.getFigure(record.internalId);
					if (figure){
						return 'table-in-diagram';
					}
					return '';
				};
				var statusBar = searchGrid.query('#bbarDefaultText')[0];
				win.show();
				statusBar.setText(statusText);
            }
        });
    },

	syncDiagramFromDB: function() {
		var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
		function doUpdate(btn) {
            if (btn === 'yes') {
                Ext.Ajax.request({
					url: _SM._PConfig.synchDiagramFromDB,
					params: {
						projectID: projectID
					},
					success: function(response) {
						var text = response.responseText;
						var outcome = Ext.JSON.decode(text);
						for (var i = 0; i < outcome.tables.length; i += 1) {
						   controller.synchronizeJSONDocument(outcome.tables[i]);
						}
						for (var i = 0; i < outcome.connectors.length; i += 1) {
						   controller.synchronizeJSONDocument(outcome.connectors[i]);
						}
						controller.getDiagramCanvas().reload();
						controller.updateJsonDocument();
						Ext.Msg.alert('Success', _SM.__language.Message_Diagram_Synchronized);
					},
					failure: function(response) {
						Ext.Msg.alert('Failure', _SM.__language.Message_Error_Diagram_Synchronized);
					}
				});
            }
        }
		Ext.MessageBox.confirm('Confirmation', _SM.__language.Msg_Confirm_Delete_Operation + ' les configurations personnalisées seront perdues!', doUpdate);
		
	},
	
    menuManageDiagram: function() {
    	var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
        var operation = new Ext.data.Operation({
		    action: 'read',
			params: {"projectID": projectID}
		});
        var win = Ext.create('Ext.window.Window', {
            width: 500,
            title: _SM.__language.Title_Diagrams,
            layout: 'fit',
            items: {
                xtype: 'diagramgrid',
            }
        });
        var grid = win.down();
		grid.getStore().load(operation);
        win.show();
    },

    onSearchMenuClick: function(menu, item, e, opt) {
        var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
        switch(item.itemId) {
            case 'getAllTables':
                controller.getAllTablesFromDB();
                break;
            case 'syncDiagramFromDB':
            	controller.syncDiagramFromDB();
                break;
            case 'menuManageDiagram':
                controller.menuManageDiagram();
                break;
            default:
                alert('Function to be implementated in future versions!');
                break;
        }
    },

    closeSearchBar: function(button, e, eOpts) {
        Ext.destroy(this.getLiveGridSearch().ownerCt);
    },

    addTableFromSearchGrid: function(button, e, eOpts) {
        var controller = this;
        var liveGrid = this.getLiveGridSearch();
        var tables = liveGrid.getSelectionModel().getSelection();
        var diagramController = controller.application.controllers.get('DiagramController');
        diagramController.showProgressBar(_SM.__language.Message_Add_Table_Canvas,'Processing...');

        var jsonRequest = [];
        for (var i = 0; i < tables.length; i += 1) {
            jsonRequest.push(tables[i].data);
        }
        Ext.Ajax.request({
            url: _SM._PConfig.getElementsDiagramFromSelectedTables,
            jsonData: jsonRequest,
            success: function(response) {
                var text = response.responseText;
                var outcome = Ext.JSON.decode(text);
                for (var i = 0; i < outcome.tables.length; i += 1) {
                    controller.addOrUpdateJSONDocument(outcome.tables[i]);
                }
                for (var i = 0; i < outcome.connectors.length; i += 1) {
                    controller.addOrUpdateJSONDocument(outcome.connectors[i]);
                }
                Ext.MessageBox.close();
            },
            failure: function(response) {
            	Ext.MessageBox.close();
                Ext.Msg.alert('Failure', 'Failed to get tables from database, please try again later!');
            }
        });
    },

	// Diagram management
    editDiagram: function(grid, record) {
        var edit = Ext.create('ProtoUL.view.diagram.base.Form').show();

        if (record.id) {
            edit.down('form').loadRecord(record);
        }
    },

    updateDiagram: function(button) {
    	var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
        var operation = new Ext.data.Operation({
		    action: 'read',
			params: {"projectID": projectID}
		});
		
        var win = button.up('window'), form = win.down('form'), record = form.getRecord(), values = form.getValues();

        var newDiagram = false;
        if (form.getForm().isValid()) {
            if (values.id > 0) {
                record.set(values);
            } else {
                record = Ext.create('ProtoUL.model.Diagram');
                values.projectID = projectID;
                record.set(values);
                controller.getDiagramsStore().add(record);
                newDiagram = true;
            }

            var store = controller.getDiagramsStore();
            store.sync({
                success: function(batch, options) {
                	controller.getDiagramsStore().load(operation);
                    win.close();
                },
                failure: function(batch, options) {
                    Ext.Msg.alert('Error','Failed to create diagram');
                },
                scope: this
            });

            if (newDiagram) {//reload for update
                controller.getDiagramsStore().load(operation);
            }
        }
    },

    deleteDiagram: function(button) {
		var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
        var operation = new Ext.data.Operation({
		    action: 'read',
			params: {"projectID": projectID}
		});
		
        var grid = controller.getDiagramGrid(), record = grid.getSelectionModel().getSelection(), store = controller.getDiagramsStore();
		var openedDiagramID = controller.getDiagramMainView().getDiagramID();
		
		if (openedDiagramID !== record[0].data.id){
	        store.remove(record);
	        store.sync({
	        	success: function(batch, options) {
	                controller.getDiagramsStore().load(operation);
	            },
	            failure: function(batch, options) {
	                Ext.Msg.alert('Failed', batch.proxy.getReader().jsonData.message);
	            },
	            scope: this
	        });
	        store.load(operation);
		} else {
			Ext.Msg.alert('Warning', _SM.__language.Warning_Delete_Active_Diagram);
		}
    },
    
    openSelectedDiagram: function(button, event) {
    	var controller = this;
		var projectID = controller.getDiagramMainView().getProjectID();
		
		var grid = button.up('grid[itemId=diagramgrid]');
		var record = grid.getSelectionModel().getSelection();
		var diagramID = record[0].data.id;
		
		var openedDiagramID = controller.getDiagramMainView().getDiagramID();
		
		var diagramController = controller.application.controllers.get('DiagramController');
		if (openedDiagramID !== diagramID){
	        diagramController.runAjaxOpenDiagram(controller, _SM._PConfig.openDiagram, projectID, diagramID);
		} else {
			Ext.Msg.alert('Warning', _SM.__language.Warning_Diagram_Already_Open);
		}
    },

    init: function(application) {
        this.control({
            '#DatabaseMenu': {
                click: this.onSearchMenuClick
            },
            '#btCancelSearchBar': {
                click: this.closeSearchBar
            },
            '#btAddTableFromSearchBar': {
                click: this.addTableFromSearchGrid
            },
            'diagramgrid dataview': {
                itemdblclick: this.editDiagram
            },
            'diagramgrid button[action=add]': {
                click: this.editDiagram
            },
            'diagramgrid button[action=delete]': {
                click: this.deleteDiagram
            },
            'diagramgrid button[action=openselecteddiagram]': {
                click: this.openSelectedDiagram
            },
            'diagramform button[action=save]': {
                click: this.updateDiagram
            }
        });
    }
});

Ext.define('ProtoUL.controller.DiagramContextMenuController', {
    extend: 'Ext.app.Controller',

	
    refs: [{
        ref: 'diagramCanvas',
        selector: '#contentPanel'
    }, {
        ref: 'tableContextMenu',
        selector: '#tablecontextmenu'
    }],

    getTableFromContextMenu: function(button) {
        var tableContextMenu = button.ownerCt;
        var table;
        if (tableContextMenu.figure.getParent().getCssClass() === "draw2d_shape_layout_VerticalLayout") {
            table = tableContextMenu.figure.getParent().getParent();
        } else {
            table = tableContextMenu.figure.getParent();
        }
        tableContextMenu.close();

        return table;
    },

    createPort: function(type, position) {
        var newPort = null;
        switch(type) {
            case "draw2d_InputPort":
                newPort = new draw2d.InputPort();
                break;
            case "draw2d_OutputPort":
                newPort = new draw2d.OutputPort();
                break;
            case "draw2d_HybridPort":
                newPort = new draw2d.HybridPort();
                break;
            default:
                throw "Unknown type [" + type + "] of port requested";
        }
        var userData = [];
        userData.push({
            position: position
        });
        newPort.setUserData(userData);

        return newPort;
    },
    
    addConnectorRecursive: function(button, e, eOpts) {
        var table = this.getTableFromContextMenu(button);
        if (table.hybridPorts.getSize() === 0) {
            var newPort = this.createPort('draw2d_HybridPort', 'bottom');
            newPort.setName("hybrid" + table.hybridPorts.getSize());
            table.addPort(newPort, new draw2d.layout.locator.BottomLocator(table));

            var inputPort = this.createPort('draw2d_InputPort', 'left');
            inputPort.setName("input" + table.inputPorts.getSize());
            table.addPort(inputPort, new dbModel.locator.PortLeftLocator(table));
            table.layoutPorts();

            var conn = new dbModel.shape.TableConnection();
            conn.setSource(newPort);
            conn.setTarget(inputPort);
            
            var diagramController = this.application.controllers.get('DiagramController');
            diagramController.onDropConnection(conn, table);

            table.getCanvas().addFigure(conn);

            this.application.controllers.get('DiagramController').enableToolbarButton('btSaveDiagram');
        }
    },

    addInputPort: function(button, e, eOpts) {
        var table = this.getTableFromContextMenu(button);
        var diagramController = this.application.controllers.get('DiagramController');

        var positions = Ext.create('ProtoUL.store.PortPositions');
        var options = {
            label: 'Position du port',
            store: positions,
            userData: {controller: diagramController, table: table}
        };
        _SM.ComboBoxPrompt.prompt('Nouveau port', options, function(btn, text, cfg) {
            if (btn == 'ok') {
            	controller = cfg.userData.controller;
				table = cfg.userData.table;
				
				name = "input" + table.inputPorts.getSize();
				table.createCustomizedPort('draw2d_InputPort', name, text);

				controller.enableToolbarButton('btSaveDiagram');
            }
        });
    },

    addOutputPort: function(button, e, eOpts) {
        var table = this.getTableFromContextMenu(button);
        var diagramController = this.application.controllers.get('DiagramController');
		
		var positions = Ext.create('ProtoUL.store.PortPositions');
        var options = {
            label: 'Position du port',
            store: positions,
            userData: {controller: diagramController, table: table}
        };
        _SM.ComboBoxPrompt.prompt('Nouveau port', options, function(btn, text, cfg) {
            if (btn == 'ok') {
            	controller = cfg.userData.controller;
				table = cfg.userData.table;
				
				name = "output" + table.outputPorts.getSize();
				table.createCustomizedPort('draw2d_OutputPort', name, text);

				controller.enableToolbarButton('btSaveDiagram');
            }
        });
    },

    removeUnusedPorts: function(button, e, eOpts) {
        var table = this.getTableFromContextMenu(button);
        table.getPorts().each(function(i, port) {
            if (port.getConnections().size < 1) {
                table.removePort(port);
            }
        });
        table.layoutPorts();
        table.cachedPorts = null;

        this.application.controllers.get('DiagramController').enableToolbarButton('btSaveDiagram');
    },

    init: function(application) {
        this.control({
            "#btAddConnectorRecursive": {
                click: this.addConnectorRecursive
            },
            "#btAddInputPort": {
                click: this.addInputPort
            },
            "#btAddOutputPort": {
                click: this.addOutputPort
            },
            "#btRemoveUnusedPorts": {
                click: this.removeUnusedPorts
            }
        });
    }
});

/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.Application', {
    name: 'ProtoUL',
	
    extend: 'Ext.app.Application',
	paths: {
        'ProtoUL': 'static/js'
    },
    
    requires: [
    	'Ext.window.MessageBox', 
    	'Ext.toolbar.Paging', 
    	'Ext.layout.container.Border', 
    	'Ext.util.Cookies', 
    	'Ext.Ajax', 
    	'ProtoUL.view.MenuTree', 
    	'ProtoUL.view.ProtoTabContainer', 
    	'ProtoUL.view.Viewport', 
    	'ProtoUL.view.password.PasswordReset', 
    	'ProtoUL.ux.Printer', 
    	'ProtoUL.ux.GridHeaderToolTip', 
    	'ProtoUL.ux.CheckColumn'
    ],
	models: [
        'EntityAttributesModel'
    ],
    stores: [
        'EntityAttributeStore',
        'DBTypesStore',
        'DiagramModelStore'
    ],
	views: [
        'diagram.DiagramMainView',
        'diagram.DiagramMenu',
        'diagram.DiagramCanvas',
        'diagram.DiagramToolbar',
        'diagram.EntityEditor',
        'diagram.EntityAttributes',
        'diagram.TableContextMenu',
        'diagram.DatabaseMenu',
        'searchmodel.LiveSearchGridPanel',
        'searchmodel.SearchBottomBar',
        'ComboBoxPrompt'
    ],
	controllers: [
		'PasswordManager',
		'DiagramController',
		'DiagramMenuController',
		'DiagramContextMenuController'
	],
	
});
