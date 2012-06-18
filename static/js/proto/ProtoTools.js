

function Meta2Tree( oData, pName, ptType   ) {
    /* -----------------   FORMAT META ( for tree view ) 
     * 
     * Convierte una estructurea 
     *  
     * @oData     : Data a convertir
     * @pName     : property Name ( iteraction en el objeto padre )
     * @ptType    : property Type ( Tipo del padre en caso de ser un array  )
     *  
     * @oBase    : Objeto padre 
     * @tBase    : Objeto resultado hasta el momento  
     * 
     * @tData   treeData
     */

    var tData = {}, __ptConfig 
    var sDataType = typeOf(oData);

    // Solo deben entrar objetos o arrays 
    if (sDataType == "object"  ||  sDataType == "array")  {
        
        __ptConfig = get_ptConfig( oData )

        if ( __ptConfig.__ptType ) ptType = __ptConfig.__ptType
        if ( ! ptType  )  ptType = sDataType    
        
        if (  ptType  == "fields" )   ptType = 'field' 
        if (  ptType  in oc([ 'pcl', 'gridConfig']) )   ptType = pName 

        if ((  ptType == 'filtersSet') && ( pName != ptType ))  ptType = 'filterDef'                        
        if ((  ptType == 'listDisplaySet') && ( pName != ptType ))  ptType = 'listDisplay'                        
             
        // Obtiene un Id y genera  una referencia cruzada de la pcl con el arbol 
        // El modelo debe crear la referencia a la data o se perdera en el treeStore 
        var IxTree = Ext.id()
        tData['id'] = IxTree
        tData['text']  =  pName    
        tData['__ptType'] =  ptType 
        tData['__ptConfig' ] = __ptConfig
        
        // Ramas que no deben abrirse 
        if ( (sDataType == "object" ) && ( ptType in oc([ 'field', 'formField' ]) ))  {
            tData['leaf'] =  true  
            return tData 
        }


        // Los tipos q son presentados en text 
        if ( ptType in oc([ 'baseFilter','initialFilter','initialSort','filterDef'])) {
            tData['__ptConfig' ] = { '__ptValue' :  Ext.encode( oData  ) }
            tData['children'] =  [] 
            return tData 
        }   

        // Los tipos q son presentados en listas 
        if ( ptType in oc([ 'listDisplay','hiddenFields','readOnlyFields','searchFields', 'sortFields'])) {
            tData['__ptConfig' ] = { '__ptList' :  Ext.encode( oData  ) }
            tData['children'] =  [] 
            return tData 
        }   


        tData['children'] =  [] 
        
        // Recorre las propiedades     
        for (var sKey in oData) {
            var vValue = oData[ sKey  ]
            var typeItem = typeOf(vValue);

            // PRegunta es por el objeto padre para enviar el tipo en los arrays      
            if ( sDataType == "object" ) {
                if ( sKey.indexOf( "__pt" ) == 0 ) continue
                                
                if ( !( typeItem in oc( [ 'boolean', 'number', 'string' ]) )) {

                    var nBase = pName
                    if ( ptType == 'protoForm' ) {
                        nBase = ptType    
                        if ( vValue.__ptType && ( vValue.__ptType  == 'formField' )) {
                            nBase = 'formField'                             
                        } 
                    }
                    tData['children'].push(  Meta2Tree(vValue, sKey , nBase ) ) 
                    
                } 

            } else if ( sDataType == "array" ) {
                
                var oTitle = null  

                if ( vValue.__ptType ) {
                    oTitle = vValue.__ptType

                } else if ( vValue.__ptConfig ) {
                    oTitle = vValue.__ptConfig.__ptType

                } else if ( vValue.name ) {
                    oTitle = vValue.name

                } else if ( vValue.menuText ) {
                    oTitle = vValue.menuText


                } else if ( typeItem == 'string' ) {
                    
                    oTitle = vValue
                    var nData = {
                        'text' : oTitle,  
                        'leaf':  true,  
                        'id' : Ext.id(), 
                        '__ptConfig' : { '__ptType' : pName }
                    }
                    
                    tData['children'].push(  nData  )
                    continue
                    
                } else {
                    // TODO Verificar por q llegan objetos sin config                     
                    console.log( 'El objeto no tiene config?? ', vValue )
                }
                    
                


                tData['children'].push(  Meta2Tree(vValue, oTitle , pName   ) ) 

            }  
        }
        
    } else { 
        
        // TODO m2t objeto plano???  Conversion de
        console.log (  'TODO FIX :  m2t objeto plano???  Aqui no dbee llegar nunca ')
        
        // Enmascara tags HTML
        if (sDataType == "string" ) { 
            oData =  oData.replace( '<', '&lt;').replace( '>', '&gt;').replace( '"', '\"')   
        }

        try {
            var ptValue = oData.toString()   
        } catch(e) {}


        tData['text']  =  pName    
        tData['__ptType'] =  sDataType  
        tData['leaf'] =  true  
        tData['ptValue'] =  ptValue  

        var IxTree = Ext.id()
        tData['id'] = IxTree

    }

    return tData 

} ; 



function Tree2Meta( tNode  ) {

    // Dada la informacion del arbol genera la meta correspondiente 
    // console.log( 't2meta' , tNode  )


    // Para poder leer de la treeData o del TreeStore ( requiere data )   
    // En la data solo necesito el __ptType,  text  y el __ptConfig
    if (  tNode.data ) {
        var tData = tNode.data 
        var tChilds =  tNode.childNodes
    }  else {
        var tData = tNode 
        var tChilds =  tNode.children
    }

    var __ptConfig, __ptType, sType, mData  
    var __ptText   = tData.text
    
    if  ( tData.__ptConfig )  __ptConfig = tData.__ptConfig 
    // if  ( tData.__ptType )    __ptType   = tData.__ptType  

    if ( __ptConfig )  { 

        sType = typeOf( __ptConfig )
          
        if ( sType == 'object' ) {

            // El __ptConfig corresponde a la conf basica del node
            mData = { '__ptConfig' : get_ptConfig( __ptConfig  ) }
            if ( ! mData.__ptConfig.name ) mData.__ptConfig.name = __ptText    
            
        } else if ( sType == 'array' )  {
            // Si es un array, el objeto de base es un array  
            mData =  []  

        } else  {
            console.log ('t2m Error de tipo', sType  )
            return {}

        }
        
        // Lo necesita por q  es leida del child   
        mData.__ptText = __ptText  

    }; 

    // Agrega los childs dependiendo de q sea el objeto 

    for (var ix in tChilds ) {
        var nChildData = Tree2Meta( tChilds[ ix ]  )
        var sText = nChildData.__ptText

        delete nChildData.__ptText 

        if ( sType == 'object' ) {
            mData[ sText  ] = nChildData 

        } else if ( sType == 'array' )  {

            // si solo viene  nombre del campo lo crea como un objeto 
            if ( Ext.encode( nChildData ) === Ext.encode({}) ) nChildData = sText 
            mData.push( nChildData )
        }

    }

    return mData 
    
}

function get_ptConfig( oData   ) {
    
    if ( typeOf( oData )  == 'array' ) {
        return []

    } else if ( oData.__ptConfig )  {
        return oData.__ptConfig 

    } else {  
        
        var cData = {}
        for (var lKey in oData ) {
            var cValue = oData[ lKey  ]
    
            // Los objetos o arrays son la imagen del arbol y no deben ser tenidos en cuenta, 
            // generarian recursividad infinita                 
            if  ( typeOf( cValue  ) in oc([ 'object', 'array' ])) continue   
            cData[ lKey  ] = cValue  
        }
        return cData 
    }
}             
