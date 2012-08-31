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

    propPanel.setSource( __ptConfig )

    propPanel.setCombos( template.__ppChoices )
    propPanel.setTypes( template.__ppTypes )
    
    propPanel.readOnlyProps = ['__ptType', 'xtype', 'name'].concat ( template.__roProperties )         
    propPanel.sourceInfo = template.__ptHelp

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

    // Garantiza q no venga una definicion generica 
    if ( ! prps.xtype  ) prps.xtype = ptType 
    if ( prps.xtype == 'formField' ) prps.xtype = 'textfield' 
 

    return {'__ptConfig' : prps, 
            '__ptHelp' : qtips, 
            '__ppChoices' : choices, 
            '__ppTypes' : ppTypes, 
            '__roProperties' : objConfig.roProperties || []  }     
    
}; 


function defineProtoFormItem( myMeta, parent, protoObj, protoIx ) {

    var prLayout , template, __ptType 
    var sDataType = typeOf(protoObj);
    var myFieldDict = getFieldDict( myMeta )

    if (sDataType == "object" ) { 

        // Configura el objeto
        if ( ! protoObj.__ptConfig )  
            protoObj.__ptConfig = get_ptConfig( protoObj )
            
        if ( ! protoObj.__ptConfig.name ) 
            protoObj.__ptConfig.name = protoIx 
        
        
        __ptType = protoObj.__ptConfig.__ptType || protoObj.__ptType
        
        if ( ! __ptType   ) {
            
            console.log( 'El objeto no tiene tipo definido' , protoObj )
            return {}

        } else if ( __ptType == 'formField'  ) {

            // protoIx es el field Name, si no viene debe buscarlo en __ptConfig [ name ]
            protoIx = protoObj.name || protoObj.__ptConfig.name 
            
            var myFld =  myFieldDict[ protoIx ] 
            if ( myFld ) {

                template = getTemplate( __ptType, true,  myFld  )
                prLayout = Ext.apply( template.__ptConfig , protoObj.__ptConfig  )

                // ReadOnlyCls
                prLayout[ 'readOnlyCls' ] = 'protofield-readonly'

            }  else {

                // El campo no existe en la definicion:  es un label
                // Incluso los campos calculados deben existir en la definicion  
                // console.log( 'invalid formField,name  :' , protoObj )
                prLayout =   {
                    text:   protoIx,
                    xtype: 'label', margin: '4', padding: '4', border: 1,
                    tooltip : 'field definition not found', 
                    style: {
                        borderColor: 'red',
                        borderStyle: 'solid', 
                        bodyStyle:';border-right:none;border-left:none;border-top:none;'
                    }       
                }
                
            }
            


        } else if ( __ptType == 'protoGrid'  ) {
            
            template = getTemplate( __ptType  , true  )
            prLayout = Ext.apply( template.__ptConfig , protoObj.__ptConfig  ) 
            
            // Inicia la grilla sin datos 
            prLayout.initialFilter = { 'pk': -1 }

            delete protoObj.__ptConfig.name 
            
        } else {
              
            template = getTemplate( __ptType  , true  )
            prLayout = Ext.apply( template.__ptConfig , protoObj.__ptConfig  ) 

            // Agrega los items 
            prLayout.items = []
            var prItems = protoObj.items
            for(var ix in prItems ) {
                if ( ix.indexOf( "__pt" )  == 0 ) continue 

                var prVar = prItems[ix];
                var prFld = defineProtoFormItem( myMeta, protoObj, prVar, ix )
                if(prFld) prLayout.items.push(prFld);
            }
            
        }
        

        // Establece el layout  ( Columns )             
        var sAux= prLayout[ 'fsLayout' ]
        if ( sAux ) {

            prLayout.defaultType = 'textfield'
            prLayout.layout =  'column'
            prLayout.defaults = { padding: '2 2' }
            
            if ( sAux == "1col"  )  
                prLayout.defaults.columnWidth = 1
            else if ( sAux == "2col"  )  
                prLayout.defaults.columnWidth = 0.5
            else if ( sAux == "3col"  )  
                prLayout.defaults.columnWidth = 0.33

            delete prLayout.fsLayout 

            // Parametros de labels
            prLayout.fieldDefaults = {}
            setFieldDefaults(  prLayout, 'labelAlign' )
            setFieldDefaults(  prLayout, 'labelWidth' )
            setFieldDefaults(  prLayout, 'hideLabel' )

        }
        

        // Tooltip
        if ( prLayout[ 'tooltip' ]) {
            
            prLayout['listeners'] = {
                render: function(c) {
                    Ext.create('Ext.tip.ToolTip', {
                    target: c.getEl(),
                    trackMouse: true, 
                    html: prLayout[ 'tooltip' ]
                  });
                }
            }

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
        
        
    
    } else if ( sDataType == "array")  {

        prLayout = []
        for(var ix in protoObj ) {
            var prVar = protoObj[ix];
            
            // Si es un array el padre es ../..
            var prFld = defineProtoFormItem( myMeta, parent, prVar , ix)
            if(prFld) prLayout.push(prFld);
        }

    }

    return prLayout 
    
    function setFieldDefaults(  prLayout, key ) {
        // Asigna los fieldDefaults q vienen en los contenedores 
        var saux = prLayout[ key ]
        if  ( saux  ) 
            prLayout.fieldDefaults[ key ] = sAux
        
    }
            
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

