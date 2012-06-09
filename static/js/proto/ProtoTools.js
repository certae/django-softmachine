

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
        tData['__ptConfig' ] = get_ptConfig( oData ) 

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
                    tData['children'].push(  Meta2Tree(vValue, sKey , nBase ) ) 
                    
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


                tData['children'].push(  Meta2Tree(vValue, oTitle , pName   ) ) 

            }  
        }
        
    } else { 
        
        console.log (  'm2t objeto plano??? ')
        
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
        
    } else if ( extType == 'fieldset' ) {
        __ptConfig.defaults = {anchor: '100%'},
        __ptConfig.layout = 'anchor'
    }

    __ptConfig.xtype = extType
           
    return  __ptConfig 
    
}


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
            mData = Ext.apply ( {}, get_ptConfig( __ptConfig  ) )
            
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

            if ( Ext.encode( nChildData ) === Ext.encode({}) ) nChildData = sText 
            mData.push( nChildData )
        }

    }

    return mData 
    
}

function get_ptConfig( ptConfig   ) {
    
    if ( typeOf( ptConfig )  == 'array' ) {
        return []
    } else {  
        var cData = {}
        for (var lKey in ptConfig ) {
            var cValue = ptConfig[ lKey  ]
    
            // Los objetos o arrays son la imagen del arbol y no deben ser tenidos en cuenta, 
            // generarian recursividad infinita                 
            if  ( typeOf( cValue  ) in oc([ 'object', 'array' ])) continue   
            cData[ lKey  ] = cValue  
        }
        return cData 
    }
}             

