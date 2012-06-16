/* 
 * Dario Gomez  1206 
 * 
 * Debe prepara las propiedades con los valores por defeco adecuados, y
 * presentarlos en el panel de propiedades ( q permite manejra el edito de combos ) 
 * 
 */


function prepareProperties( record , myMeta,  propPanel  ){
    // Pepara la tabla de propiedades 

    var template = {} 
    
    // var parentType = '' 
    // if ( record.parentNode ) parentType  =  record.parentNode.data.text 

    // La data configurada
    var __ptConfig  =  clone( record.data.__ptConfig ) 
    var __ptType = record.data.__ptType   
    var __ptText = record.data.text


    if ( __ptType  in oc( [ 'field', 'formField' ]) ) {

        // Default Data ( aplica los defaults a la pcl y luego a la definicion del campo )
        template = getTemplate( __ptType, false, myMeta.__ptDict[ __ptText  ] )
        __ptConfig[ 'name' ]  = __ptText 

    }  else {


        // Default Data ( El nombre del nodo es el tipo de datos real ) 
        template = getTemplate( __ptText , false  )
    } 
 
    // Default Data ( aplica los defaults a la definicion del campo )
    __ptConfig = Ext.apply(  template.__ptConfig, __ptConfig   ) 

    propPanel.setSource( __ptConfig )
    propPanel.setCombos( template.__ptChoices )
    propPanel.readOnlyProps = ['__ptType', 'xtype', 'name'].concat ( template.__roProperties )         
    propPanel.sourceInfo = template.__ptHelp

};


function getTemplate( ptType, forForm,  metaDict  )  {
    //@forForm boolean for Form Definition 
    
    var prps = {}, qtips = {}, choices = {}
    var prpName, prpValue, prpHelp, prpChoices, prpDict

    // Lee la plantilla de la variable publica 
    var objConfig = DesignerObjects[ ptType ] || {}

    // Recorre el vector de propieades    
    // puede ser solo el nombre o la tupla name, value 
    // [ 'x' , { 'name' : 'xxx' , 'value' : '' }]  
    for (var ix in objConfig.properties  ) {
        var prp  = objConfig.properties[ ix ]
        
        // Trae los valores directamente   
        if ( typeOf( prp ) == 'object' ) {
            prpName = prp.name       
            prpValue = prp.value       
        } else {
            prpName = prp       
            prpValue =  DesignerProperties[ prpName ] || null             
        }


        prpHelp =  DesignerProperties[ prpName + '.help']             
        prpChoices =  DesignerProperties[ prpName + '.choices']          

        if (forForm) {
            if ( prpValue )  prps[ prpName ] = prpValue
            
        } else {
            prps[ prpName ] = prpValue || ''
            qtips[ prpName ] = prpHelp
            if ( prpChoices )   choices[ prpName ] = prpChoices
        } 
        
    
    }

    // Si es un campo obtiene los defaults de fields 
    if ( metaDict ) {
        prpDict = getFormFieldDefinition( metaDict )
        prps = Ext.apply( prps, prpDict   )
    }

    // Garantiza q no venga una definicion generica 
    if ( prps.xtype == 'formField' ) prps.xtype = 'textfield' 
 

    return {'__ptConfig' : prps, 
            '__ptHelp' : qtips, 
            '__ptChoices' : choices, 
            '__roProperties' : objConfig.roProperties || []  }     
    
}


