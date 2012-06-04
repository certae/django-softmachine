

function FormatMETA( oData, pName, pType   ) {
    /* -----------------   FORMAT META ( for tree view ) 
     * 
     * Convierte una estructurea 
     *  
     * @oData     : Data a convertir
     * @pName     : property Name ( iteraction en el objeto padre )
     * @pType     : property Type ( Tipo del padre en caso de ser un array  )
     *  
     * @oBase    : Objeto padre 
     * @tBase    : Objeto resultado hasta el momento  
     * 
     * @tData   treeData
     */

    var tData = {}
    var sDataType = typeOf(oData);

    // TODO: Id's para los objetos mas importantes 
    var idFields  = Ext.id();


    // Solo deben entrar objetos o arrays 
    if (sDataType == "object"  ||  sDataType == "array")  {

        if ( ! pType  ) pType = sDataType
        
        
        // La pcl debe abrirse 
        if ( pName == 'pcl' ) {
            tData['expanded'] = true                     
        } 
        
        
        tData['ptProperty']  =  pName    
        tData['ptType'] =  pType 
        tData['children'] =  [] 

        // Obtiene un Id y genera  una referencia cruzada de la pcl con el arbol 
        // El modelo debe crear la referencia a la data o se perdera en el treeStore 
        var IxTree = Ext.id()
        tData['id'] = IxTree
        
        // me.refDict[ IxTree ] = oData
        tData[ 'refBase' ] = oData
        
        if ( sDataType == "object" ) {
            // Si es un objeto hay una propiedad q servira de titulo 
            if ( oData['protoOption'] ) {
                tData['ptValue']  = oData.protoOption  
            }
        } 

        // Recorre las propiedades     
        for (var sKey in oData) {
            var vValue = oData[ sKey  ]
            var typeItem = typeOf(vValue);

            // PRegunta es por el objeto padre para enviar el tipo en los arrays      
            if ( sDataType == "object" ) {

                if ( sKey == 'dict' ) continue;  

                tData['children'].push(  FormatMETA(vValue, sKey  ) ) 

            } else if ( sDataType == "array" ) {
                
                var oTitle = pName + '.' + sKey 
                
                if ( pName == 'fields'  && vValue.name ) {
                    oTitle = vValue.name  
                } else if ( pName == 'protoForm' ) {
                    oTitle = vValue.style
                }

                tData['children'].push(  FormatMETA(vValue, oTitle , pName   ) ) 

            }  
        }
        
    } else { 
        
        // Enmascara tags HTML
        if (sDataType == "string" ) { 
            oData =  oData.replace( '<', '&lt;').replace( '>', '&gt;').replace( '"', '\"')   
        }

        tData['ptProperty']  =  pName    
        tData['ptType'] =  sDataType  
        tData['leaf'] =  true  
        tData['ptValue'] =  oData.toString()  

        var IxTree = Ext.id()
        tData['id'] = IxTree

    }

    return tData 

} 