/* 
 * Dario Gomez  1206 
 * 
 * Debe prepara las propiedades con los valores por defeco adecuados, y
 * presentarlos en el panel de propiedades ( q permite manejra el edito de combos ) 
 * 
 */


function prepareProperties( record , myMeta,  propPanel  ){
    // Pepara la tabla de propiedades 

    var prp = {}, template = {}, parentType = '' 
    if ( record.parentNode )   parentType  =  record.parentNode.data.__ptType 

    // La data configurada
    var __ptConfig    =  clone( record.data.__ptConfig ) 
    var __ptType = record.data.__ptType   
    var __ptText = record.data.text


    if ( __ptType  == 'formFields' ) {

        // Default Data ( aplica los defaults a la pcl y luego a la definicion del campo )
        template = getTemplate( __ptType, DesignerObjects[ __ptType ] , myMeta.__ptDict[ __ptText  ] )
        template[ '__ptParent' ]  = parentType 

    }  else {

        // Default Data ( El nombre del nodo es el tipo de datos real ) 
        template = getTemplate( __ptText, DesignerObjects[ __ptText ] )
        
    } 
 
    // Default Data ( aplica los defaults a la definicion del campo )
    prp = Ext.applyIf( __ptConfig, template.__ptConfig   ) 

    propPanel.setSource( prp )
    propPanel.setCombos( template.__ptChoices )
    propPanel.readOnlyProps = [ '__ptType', '__ptParent' ]        
    propPanel.sourceInfo = template.__ptHelp

};


function getTemplate( ptType, objConfig , metaDict  )  {
    
    var prps = { '__ptType' : ptType }, qtips = {}, choices = {}
    var prpName, prpValue, prpHelp, prpChoices, prpDict

    // Recorre el vector de propieades    
    // puede ser solo el nombre o la tupla name, value 
    // [ 'x' , { 'name' : 'xxx' , 'value' : '' }]  
    for (var ix in objConfig.properties  ) {
        var prp  = objConfig.properties[ix]
        
        // Trae los valores directamente   
        if ( typeOf( prp ) == 'object' ) {
            prpName = prp.name       
            prpValue = prp.value       
        } else {
            prpName = prp       
            prpValue =  DesignerProperties[ prpName ] || null             
        }


        prpHelp =  DesignerProperties[ prpName + '.help'] || null             
        prpChoices =  DesignerProperties[ prpName + '.choices'] || null             

        prps[ prpName ] = prpValue || ''
        qtips[ prpName ] = prpHelp
        if ( prpChoices )   choices[ prpName ] = prpChoices
    
    }

    // Si es un campo obtiene los defaults de fields 
    if ( metaDict ) {
        prpDict = getFormFieldDefinition( metaDict )
        prps = Ext.apply( prps, prpDict   ) 
    }





    return { '__ptConfig' : prps, '__ptHelp' : qtips, '__ptChoices' : choices  }     
    
}


