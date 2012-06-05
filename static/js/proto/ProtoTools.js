


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
        
        
        // La pcl debe abrirse 
        if ( pName == 'pcl' ) {
            tData['expanded'] = true                     
        } 
        
        
        tData['text']  =  pName    
        tData['__ptType'] =  ptType 
        tData['children'] =  [] 

        // Obtiene un Id y genera  una referencia cruzada de la pcl con el arbol 
        // El modelo debe crear la referencia a la data o se perdera en el treeStore 
        var IxTree = Ext.id()
        tData['id'] = IxTree
        
        // me.refDict[ IxTree ] = oData
        tData[ '__ptConfig' ] = oData
        
        // // Si es un objeto hay una propiedad q servira de titulo 
        // if ( sDataType == "object" ) {
            // if ( oData['protoOption'] ) {
                // tData['ptValue']  = oData.protoOption  
            // }
        // } 

        // Recorre las propiedades     
        for (var sKey in oData) {
            var vValue = oData[ sKey  ]
            var typeItem = typeOf(vValue);

            // PRegunta es por el objeto padre para enviar el tipo en los arrays      
            if ( sDataType == "object" ) {
                if ( sKey == 'dict' ) continue
                                
                if ( !( typeItem in oc( [ 'boolean', 'number', 'string' ]) )) {

                    var nBase = pName
                    // Todos los contenedores del protoForm son manejados como protoForm 
                    if ( ptType == 'protoForm' ) nBase = ptType    
                    
                    tData['children'].push(  FormatMETA(vValue, sKey , nBase ) ) 
                    
                } 

            } else if ( sDataType == "array" ) {
                
                var oTitle = pName + '.' + sKey 
                
                if ( pName == 'fields'  && vValue.name ) {
                    oTitle = vValue.name  
                } else if ( pName == 'protoForm' ) {
                   
                    oTitle = vValue.style
                   
                }

                if ( pName == 'formFields' && typeItem == 'string' )  {

                    var nData = {
                        '__ptType' : 'formField', 
                        'text' : vValue,  
                        'leaf':  true,  
                        'id' : Ext.id(), 
                        '__ptConfig' : {}
                    }
                    
                    tData['children'].push(  nData  )
                    
                } else {

                    tData['children'].push(  FormatMETA(vValue, oTitle , pName   ) ) 
                    
                }


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
