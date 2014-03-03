import json
# Definicion de las propiedades, 
# las propiedades tienen 
#      help         : description 
#      type    
#      choices      : lista de valores en caso de ser string 
#      required     : 
# 
#  EL nombre de la propiedad contiene el prpDefault q solo se aplcia 
#  si no existe y es requerida  


# La defincion de tipos es   xxx.type = [ 'boolean' | 'date' | 'string' | 'number' ] 



_MetaProperties =  {

    "metaVersion.help" : "Internal meta version", 
    "userVersion.help" : "Application version",
     
    "exportCsv.help"   : "Csv export enabled?",   
    "exportCsv.type" : bool, 

    "localSort.help" : "local sort?, (n/a for prototypes)", 
    "localSorttype" : bool,
     
    "pageSize,help" : "Page size", 
    "pageSize.type": int, 

#QBE    
    "qbeHelp.type": bool,
    "qbeHelp.help": "visible trigger for select distinct (interne)",

#  Types
    "required.type" : bool, 
    "readOnly.type"  : bool,
    "primary.type" : bool, 
    
# PCI
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

    "denyAutoprint.type" : bool, 
    "denyAutoprint.help" : "deny auto print (future use)", 

# Detalles 
    "masterField" : "pk",

    "menuText.help"         : "Menu title ( toolbar )", 
    "detailName.help"       : "Detail key (for report detail)", 
    
    "conceptDetail.help"    : "Detail concept ( [App.]Model o [App.]Model.View )",
    "masterField.help"      : "Master field for MD navigation (normaly Pk)",
    "detailField.help"      : "Detail field for filter (normaly conceptName)", 
    "detailTitleLbl.help"   : "Detail title for filter", 

    "masterTitleField.help" : "Master field title (filter name)", 
    "detailTitleField.help" : "Master field title (copy from master title in detail edition)", 

#  Udps 
    "propertyPrefix" : "udp", 
    "propertyPrefix.help" : "udp prefix (upd__xxxxx)", 
    "propertyName.help" : "udp property name",
    "propertyValue.help" : "udp property value",

    "propertyRef.help" : "udp concept ref",    
    "keyField.help" : "udp source<br>** Only for non MD udp (internal use)",
    "udpTable.help" : "udp concept name , <strong>** if direct link then related_name, normaly udpTable</strong>", 

# sheets
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

#  Fields
    "physicalName.help" : "phisical name or function  @str( f1,f2 )", 
    "required": False,
    "required.help": "Required field",
    "allowDecimals.help": "Dont use!!! : allow decimal (internal use)",
    "autoscroll": True,
    "autoscroll.help": "t/f",

    "choices.help": "comma separed values for combo selection",
    
    "collapsed": False,
    "collapsed.help": "t/f collapsed",
    "collapsed.type": bool,

    "zoomMultiple": False, 
    "zoomMultiple.type": bool, 
    "zoomMultiple.help": "Multiple selection on add",

    "collapsible": False,
    "collapsible.help": "t/f",
    "collapsible.type": bool,

    "cellToolTip.help": "Use this field form line tooltip",
    "cellToolTip.type": bool,

    "cellLink.help": "Is a cellLink?",
    "cellLink.type": bool,

    "xtype.help" : "frontend widget (use vType also)",
    "xtype.choices": ["", "textfield", "combobox", "checkbox", "numberfield", "textarea", "datefield" ],
    
    "prpScale": 0,
    "prpScale.help": "Decimal scale ( 0 int, 2 dec )",
    "prpDefault.help": "Default value",
    
    "fieldLabel.help": "Field label (in form)",
    "format.help": "input mask (automatic for date, time and numbers) (future use)",
    "fsLayout": "fluid",
    "fsLayout.choices": ["fluid", "1col", "2col", "3col" ],
    "fsLayout.help": "Automatic layout distribution",

    "header.help" : "Column header (grid)  default for fieldLabel" ,

    "height.type": int,
    "height.help": "The height value in pixels",
    "helpPath.help": "/help/xxxx.html  real: /static/help",
    
    "hidden.help": "Hiden field (future use)",
    "hidden.type": bool,

    "hideLabel.help": "Hide label? (ex: firstName, lastName)",
    "hideSheet.help" : "Hide sheet?", 
    
    "hideRowNumbers.help" : "Hide row numbers?", 
    "hideRowNumbers.type"  : bool,
    
    "hideCheckSelect.type"  : bool,
    "hideCheckSelect.help" : "Hide check select?", 

    "filterSetABC.help" : "Auto alphabetic filter", 

    "labelAlign": "left",
    "labelAlign.choices": ["left", "top"],
    "labelAlign.help": "Label align (left, top)",

    "labelWidth.help": "Label width",

    "maxHeight.help": "The max value in pixels",
    "maxWidth.help": "The max value in pixels",

    "maxHeight.type": int,
    "maxWidth.type": int,

    "minHeight.help": "The minimum value in pixels",
    "minWidth.help": "The minimum value in pixels", 

    "minHeight.type": int,
    "minWidth.type": int, 

    "height.type": int,
    "width.type": int, 

    "flex.type": int, 
    "flex.help": "Flex width eqivalence", 

    "readOnly": False,
    "readOnly.help": "ReadOnly field?",
    "title.help": "Title",
    "tooltip.help": "Microhelp",
 
    "sortable.help": "Sortable?",
    "sortable.type": bool,

    "searchable.help": "Searchable?",
    "searchable.type": "bool",

    "type.help" : "Field type", 
    "type.choices" : [ "", "string", "text", "bool", "int", "decimal", "combo", "date",  "datetime", "time", "autofield", "html", "foreignid",  "foreigntext"  ],             

    "vType.help" : "Validation type", 
    "vType.choices" : [ "", "email", "ip4", "ip6", "tel", "postalCodeCA", "postalCodeUSA"  ],             
    
    "width.help": "The width value in pixels",
    
    "wordWrap.type": bool,
    "wordWrap.help": "Auto wordWrap (more than one line)", 

    "sheetType.help" : "Sheet type (Grid, Report)", 
    "sheetType.choices" : [ "", "printerOnly", "gridOnly"], 
    
    "detailName.help" : "Detail name (used in MD definition)",              

    "actionType.help" : "Action type (backend function)", 
    # Solo las acciones de tipo "user" son presentadas  en el menu
    # los triggers pueden ser escritos directamente en el modelo y no pasar por protoExt 
    "actionType.choices" : [ "user", "insTrigger", "updTrigger", "delTrigger", "wflow"], 
    "refreshOnComplete.type": bool,
    
    "paramType.help" : "Parameter type", 
    "paramType.choices" : [ "", "string", "bool", "number"], 

    "cpFromField.help" : "Derived by copy",  
    "cpFromZoom.help" : "Derived form zoom (fk property)? ", 
    
    "crudType.help" : "Crud type", 
    # editable      : es un campo estandar de la Db ( default )  
    # screenOnly    : ninguna iteraccion con la db, funciones calculadas en el frontEnd, o campos de procesamiento intermedio para generar otros campos     
    # storeOnly     : leido de la Db,  no se despliega en el frontEnd, se usa como resultado de campos calculados, usado para manejar subSets ( implica definir baseFilter, vrDefault  )
    # insertOnly    : campos invariables ( ej: nro documento, )      
    # updateOnly    : nulo al inicio, requerido en modificacion       
        
    # linked        : no es editable, no se guarda en la Db, requiere cpFromField,  cpFromZoom* ( *para prototipos, o zooms no relacionales )  
    # copied        : toma el vr por defecto de cpFromField o cpFromZoom ( similar a linked + editable )      
    "crudType.choices" : [ "", "editable", "screenOnly", "storeOnly", "insertOnly", "updateOnly", "linked", "copied" ], 
    
    "selectionMode.help" : "Grid selection mode for actions",
    # none : Envia la accion sin QSet 
    # single : Exige un unico reg 
    # multiple : Exige al menos un reg       
    "selectionMode.choices" : [ "none", "single", "multiple" ] 

};

def verifyPrpType(lKey, cValue) :
    # Verifica los tipos de las  propiedades
    # recibe el valor y el tipo y verifica si 
    # corresponden entre si
    # Intenta la conversion, sin no regresa nulo  

    pType = _MetaProperties.get(lKey + '.type')    
    if(not pType):
        if (type(cValue) == str):
            return cValue.replace('~+$', '')
        
        else :
            return cValue 

    
    if (pType == type(cValue)) :
        return cValue  
    
    elif(pType == bool):
        if((type( cValue ) == int) or (type( cValue ) == float)) :
            cValue = str(cValue)
             
        if((type( cValue ) == str) ) :
            if (cValue[0:2].lower() in [ 'y', 's', '1','o', 't' ]):
                return True
            else :
                return False
                 
        else :
            return False
        
    elif(pType == int ):
        return int(cValue)
    
    elif(pType == float):
        return float(cValue)
    
    elif(pType == None):
        return None
    
    else :
        return cValue;



def getSimpleProperties(oData, ptType) :
    # Retorna los valores simples, verificando los tipos de cada propiedad

    # Solo deben llegar objetos, si llega un array no hay props q mostrar
    if(type(oData) == list) :
        return [];

    # Inicializa con el type
    cData = {}
    if(ptType) :
        cData['__ptType'] = ptType;

    for lKey in oData :
        cValue = oData[lKey];
 
        # Los objetos o arrays son la imagen del arbol y no deben ser tenidos en cuenta, generarian recursividad infinita
        if (type(cValue) in [dict, list]) :
            continue

        # Si son valores codificados, los decodifica y los agrega
        if (lKey in ['__ptValue', '__ptList']) :
            try :

                cData = json.loads(cValue)
                        
            except :

                #print( "Error de encodage", cValue )
                pass
                    
        else :
            cValue = verifyPrpType(lKey, cValue);
            if (cValue) :
                if (type(cData)== dict):
                    cData[lKey] = cValue
                else :
                    cData += {lKey : cValue}
                        
    return cData 
