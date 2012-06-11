/* 
 * Dario Gomez  1206 
 * 
 * Debe prepara las propiedades con los valores por defeco adecuados, y
 * presentarlos en el panel de propiedades ( q permite manejra el edito de combos ) 
 * 
 */


function prepareProperties( record , myMeta,  propPanel  ){
    // Pepara la tabla de propiedades 

    var prp = {}, 
        parentType = '', 
        prpTitle = '', 
        prpBase = ''

    var oData        =  record.data.__ptConfig 
    
    if ( record.parentNode )   parentType  =  record.parentNode.data.__ptType 
                
    if ( oData[ '__ptType'] == 'pcl' ) {

        prpTitle = 'pcl'
        prp = {
            "shortTitle"    : oData.shortTitle,
            "description"    : oData.description,
            "protoIcon"        : oData.protoIcon ,
            "helpPath"        : oData.helpPath
        }

    } else if ( oData[ '__ptType'] == 'formField' ) {
        
        prpBase = oData[ 'text']
        prpTitle = 'field.' + prpBase

        var vrDefault = oData.defaultValue

        if ( oData.type ==  'bool' ) {
            vrDefault = vrDefault || false 
        } else     if ( oData.type in oc( [ 'int', 'decimal', 'float'])  ) {
            vrDefault = vrDefault || 0                     
        } else {
            vrDefault = vrDefault || ''
                }
 
                
        prp = {
                    
            "allowBlank": oData.allowBlank || true,
            "readOnly": oData.readOnly || false ,
            "storeOnly": oData.storeOnly || false ,
            "hidden": oData.hidden || false ,

            "header": oData.header || '',
            "fieldLabel": oData.fieldLabel || '',
            "tooltip": oData.tooltip || '',
            "defaultValue": vrDefault ,

            "type":  oData.type,
            "subType":  oData.subType,
            
            "flex": oData.flex || 0,
            "width": oData.width || 0,
            "minWidth": oData.minWidth || 0,
            "wordWrap": oData.wordWrap || false,
            "cellToolTip": oData.cellToolTip || false,

            "format": oData.format || '',
            "allowDecimals": oData.allowDecimals,
            "decimalPrecision": oData.decimalPrecision,

            "choices": oData.choices ,

            // TODO: BackEnd, Grid, No 
            "sortable": oData.sortable || false

            // FIX:  Q es esto por q 3 propiedades q pueden ser las misma vaina  readOnly, editable   
            // "editable": false,
            // "editMode": false,
            
            // "name": oData.name ,
            // "align": "right",
            // "draggable": false,

            // "fromModel": oData.fromModel,
            // "zoomModel": oData.zoomModel 
            // "cellLink": oData.cellLink ,
            // "fkField":  oData.fkField, 
            // "fkId": oData.fkId,
                }

            } 
 
             
            // panelPrps.setTitle( prpTitle )
            propPanel.setSource( prp )
            

};