/* 
 * Dario Gomez  1206 
 * 
 * Debe prepara las propiedades con los valores por defeco adecuados, y
 * presentarlos en el panel de propiedades ( q permite manejra el edito de combos ) 
 * 
 */


function prepareProperties( record , myMeta,  propPanel  ){
    // Pepara la tabla de propiedades 

    var parentType = '' 
    if ( record.parentNode )   parentType  =  record.parentNode.data.__ptType 

    // La data configurada
    var __ptConfig    =  clone( record.data.__ptConfig ) 
    var __ptType = record.data.__ptType   
    var __ptText = record.data.text

    if ( __ptType  == 'formFields' ) {

        // Default Data ( aplica los defaults a la pcl y luego a la definicion del campo )
        var template = ( DesignerObjects[ __ptType ] || {} )
        var prp = Ext.applyIf( myMeta.__ptDict[ __ptText  ], template.__ptConfig     ) 
        if ( prp )  prp = Ext.applyIf( __ptConfig, prp  ) 

        // Para la conf automatica del layout dependiendo del contenedor 
        prp[ '__ptParent' ]  = parentType 
        // prp[ 'vrDefault' ]  = getDefault( __ptConfig.type ) 

    }  else {

        // Default Data ( aplica los defaults a la definicion del campo )
        var template = DesignerObjects[ __ptText ] || {} 
        var prp = Ext.applyIf( __ptConfig, template.__ptConfig   ) 
        
    } 
 
    // Se asegura q llegue 
    if ( ! prp.__ptType )    prp.__ptType = __ptType  
 
    propPanel.setSource( prp )
    propPanel.setCombos( template.__ptCombos )
    
            

};

function getDefault( type )  {
    
    // var vrDefault = __ptConfig.defaultValue
//     
    // if ( oData.type ==  'bool' ) {
        // vrDefault = vrDefault || false 
    // } else     if ( oData.type in oc( [ 'int', 'decimal', 'float'])  ) {
        // vrDefault = vrDefault || 0                     
    // } else {
        // vrDefault = vrDefault || ''
            // }

    return '' 
    
}
