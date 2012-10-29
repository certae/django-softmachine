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

    var template = {} 
    
    // var parentType = '' 
    // if ( record.parentNode ) parentType  =  record.parentNode.data.text 

    // La data configurada
    var __ptConfig  =  clone( record.data.__ptConfig ) 
    var __ptType = record.data.__ptType   
    var __ptText = record.data.text

    var myFieldDict = getFieldDict( myMeta )
 
    if ( __ptType  in oc( [ 'field', 'formField' ]) ) {

        // Default Data ( aplica los defaults a la pcl y luego a la definicion del campo )
        template = getTemplate( __ptType, false, myFieldDict[ __ptText  ] )
        __ptConfig[ 'name' ]  = __ptText 

    // } else if ( __ptType  in oc( [ 'protoDetail', 'protoSheet' ]) ) {
        // template = getTemplate( __ptType, false  )

    }  else {
        // Default Data ( El nombre del nodo es el tipo de datos real ) 
        template = getTemplate( __ptType , false  )
    } 
 
    // Default Data ( aplica los defaults a la definicion del campo )
    __ptConfig = Ext.apply(  template.__ptConfig, __ptConfig   ) 

    // Solo maneja las propiedades propias de la version 
    __ptConfig = clearPhantonProps( __ptConfig,  __ptType )

    propPanel.setSource( __ptConfig )
    propPanel.setCombos( template.__ppChoices )
    propPanel.setTypes( template.__ppTypes )
    
    propPanel.readOnlyProps = ['__ptType', 'name'].concat ( template.__roProperties )         
    propPanel.sourceInfo = template.__ptHelp

};

function clearPhantonProps( __ptConfig ,  __ptType ) {
    /* Borra las propieades q no hacen parte de la config de base 
     */ 
    var objConfig = DesignerObjects[ __ptType ] || {}
    for (var ix in __ptConfig ) {   
        if ( !( ix  in oc( objConfig.properties.concat ( ['name' ] )))) {
            // console.log( ix )            delete __ptConfig[ ix ]
            
        }
    } 
    return __ptConfig 
}; 


function getTemplate( ptType, forForm,  metaDict  )  {
    //@forForm boolean for Form Definition 
    
    var prps = {}, qtips = {}, choices = {}, ppTypes = {}
    var prpName, prpValue, prpHelp, prpChoices, prpDict, prpType

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
        prpType =  DesignerProperties[ prpName + '.type']          

        // Para presentacion en la forma o en las propiedades 
        if (forForm) {
            if ( prpValue )  prps[ prpName ] = prpValue
            
        } else {
            prps[ prpName ] = prpValue || ''
            qtips[ prpName ] = prpHelp
            if ( prpChoices )   choices[ prpName ] = prpChoices
            if ( prpType )   ppTypes[ prpName ] = prpType
        } 
        
    
    }

    // Si es un campo obtiene los defaults de fields 
    if ( metaDict ) {
        prpDict = getFormFieldDefinition( metaDict )
        prps = Ext.apply( prps, prpDict   )
    }

    // Garantiza q no venga una definicion generica ( solo para los formFields ) 
    if ( forForm && ( ! prps.xtype  )) prps.xtype = ptType 
    if ( ( prps.xtype == 'formField' ) &&  ( ptType == 'formField' )) prps.xtype = 'textfield' 
 

    return {'__ptConfig' : prps, 
            '__ptHelp' : qtips, 
            '__ppChoices' : choices, 
            '__ppTypes' : ppTypes, 
            '__roProperties' : objConfig.roProperties || []  }     
    
}; 



function getStoreDet( prItems  ) {
    // Obtiene los store de las grillas dependientes 
    
    var cllStoreDet = []
    
    for ( var ixV in prItems ) {
        var lObj = prItems[ixV];
        
        if ( lObj.items ) {
            cllStoreDet = cllStoreDet.concat( getStoreDet( lObj.items ) );         
        }

        if ( lObj.__ptType == "protoGrid" ) {
            
            cllStoreDet.push(  lObj.store )
        }

    }

    return cllStoreDet 
    
}

