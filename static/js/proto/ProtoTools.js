


function FormatMETA( oData, pName, ptType   ) {
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

    var tData = {}
    var sDataType = typeOf(oData);

    // Solo deben entrar objetos o arrays 
    if (sDataType == "object"  ||  sDataType == "array")  {

        if ( ! ptType  ) ptType = sDataType
        
        // Obtiene un Id y genera  una referencia cruzada de la pcl con el arbol 
        // El modelo debe crear la referencia a la data o se perdera en el treeStore 
        var IxTree = Ext.id()
        tData['id'] = IxTree
        tData['text']  =  pName    
        tData['__ptType'] =  ptType 
        tData[ '__ptConfig' ] = oData

        if ( ptType == 'fields' ||  ptType  == 'formFields' )  {
            // Los fields no deben abrirse 
            tData['leaf'] =  true  
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
                    // Todos los contenedores del protoForm son manejados como protoForm 
                    if ( ptType == 'protoForm' ) {
                        nBase = ptType    
                        if ( vValue.__ptType && ( vValue.__ptType  == 'formField' )) {
                            nBase = 'formFields'                             
                        } 
                    }
                    tData['children'].push(  FormatMETA(vValue, sKey , nBase ) ) 
                    
                } 

            } else if ( sDataType == "array" ) {
                
                var oTitle = pName + '.' + sKey 

                if ( vValue.__ptType && vValue.title ) {
                    oTitle = vValue.__ptType + ' [' +  vValue.title + ']'

                } else if ( vValue.__ptType && vValue.name ) {
                    oTitle = vValue.__ptType + ' [' +  vValue.name + ']'
                
                } else if ( vValue.name ) {
                    oTitle = vValue.name
                      
                } else if ( vValue.__ptType ) {
                    oTitle = vValue.__ptType
                    
                } else if ( typeItem == 'string' ) {
                    
                    oTitle = vValue
                    var nData = {
                        '__ptType' : pName, 
                        'text' : oTitle,  
                        'leaf':  true,  
                        'id' : Ext.id(), 
                        '__ptConfig' : {}
                    }
                    
                    tData['children'].push(  nData  )
                    continue
                }


                tData['children'].push(  FormatMETA(vValue, oTitle , pName   ) ) 

            }  
        }
        
    } else { 
        
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


/* 
 * Genera la configuracion por defecto para el tipo de campo 
 * TODO:  esto debe venir de un json, q deberia ser cargado al iniciar, y luego mantenido en una coleccion publica 
 * 
 * @ptType  : tipo de objeto 
 */
function  getExtConfig(  ptType ) {

    var __ptConfig = {}
    var extType = ptType
    if ( ptType == 'formField' ) {
        extType = 'textfield'
        
    } else if ( extType = 'fieldset' ) {
        __ptConfig.defaults = {anchor: '100%'},
        __ptConfig.layout = 'anchor'
    }

    __ptConfig.xtype = extType
           
    return  __ptConfig 
    
}
