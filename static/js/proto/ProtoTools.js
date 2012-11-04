

function Meta2Tree( oData, pName, ptType   ) {
    /* Convierte la meta en treeStore ( Arbol )   
     * 
     * Input    --------------------------------- 
     * @oData     : Data a convertir
     * @pName     : property Name ( iteraction en el objeto padre, en el caso de las formas )
     * @ptType    : property Type ( Tipo del padre en caso de ser un array  )
     *  
     * Return   -------------------------------
     * @tData   treeData
     * 
     */

    var nodeDef     =   _MetaObjects[ ptType ]
    if ( ! nodeDef ) { console.log( 'Meta2Tree: definicion no encontrada para ' + ptType ) }
    
    var __ptConfig  =   getSimpleProperties( oData, ptType )  
    var tData       =   getNodeBase(  ptType, ptType, __ptConfig )    


    // Form ( debe manejar el raiz sin el marco de items )
    if ( nodeDef.hideItems ) {
        if ( oData.items ) {
            tData['children'] = formContainer2Tree( oData.items )    
        } else {
            tData['children'] = formContainer2Tree( oData  )}
        return tData 
    }  


    // Los tipos q son presentados en text 
    if ( nodeDef.__ptStyle == 'jsonText' ) {
        tData.__ptConfig.__ptValue =  Ext.encode( oData  )
        return tData 
    }   

    // Los tipos q son presentados en listas 
    if ( nodeDef.__ptStyle == 'colList' ) {
        tData.__ptConfig.__ptList =  Ext.encode( oData  )
        return tData 
    }   

    // es una lista  lista, se hace el mismo recorrido ( solo en caso de una lista de listas ) 
    if ( nodeDef.listOf ) {
        Array2Tree( oData, ptType, tData    ) 
    }

        
    // Verifica q la definicion este bien hecha         
    verifyNodeDef( nodeDef )

    // Recorre las listas
    for ( var ix in nodeDef.lists  ) {
        var sKey = nodeDef.lists[ix]
        var childConf = _MetaObjects[ sKey ]

        // Obtiene y agrega la base de la lista 
        var tChild = getNodeBase(  sKey, sKey, { '__ptType' : sKey } )    
        tData['children'].push(  tChild   ) 
        
        // Si la lista tiene un tipo de presentacion particular sale 
        if ( childConf.__ptStyle  == 'colList' || childConf.__ptStyle  == 'jsonText' ) continue;

        // Recorre las instancias de la lista           
        Array2Tree( oData[ sKey ],  childConf.listOf  , tChild  ) 
    }

    // Recorre los objetos 
    for ( var ix in nodeDef.objects  ) {
        var sKey = nodeDef.objects[ix]

        // Obtiene el objeto de la meta, lo convierte y lo genera 
        var tChild = Meta2Tree( oData[ sKey  ], sKey, sKey   ) 
        tData['children'].push(  tChild   ) 
    }
    
    // Asigna el nombre al nodo en caso de objetos 
    tData.text = oData.name || oData.menuText ||  ptType

    return tData 


    // ---------------------------------------
    function Array2Tree( oList, ptType, tNode    ) {
        // REcibe un array y genera los hijos, 
        // @tNode   referencia al nodo base
        // @ptType  tipo de nodo hijo 
        // @oList    objeto lista de la meta   
        var nodeDef =   _MetaObjects[ ptType ]
        
        for (var sKey in oList ) {
            var oData = oList[ sKey  ]

            var tChild = Meta2Tree( oData, pName, ptType   ) 
            tNode['children'].push(  tChild   ) 
        }
    }; 

    function verifyNodeDef( nodeDef ) {
        // Verifica las listas y objetos  
        if ( nodeDef.lists ) { 
            if ( typeOf( nodeDef.lists ) != 'array' ) {
                console.log( 'pciObjects definicion errada de listas para ' + ptType )
                nodeDef.lists = []
            } else { 
                for ( var ix in nodeDef.lists  ) {
                    var sKey = nodeDef.lists[ix]
                    if ( typeof( sKey)  !=  'string' ) {
                        console.log( 'pciObjects definicion errada en listas ' + ptType + ' key ' , sKey  )
                        delete nodeDef.lists[ix]
                        continue } 
                    var childConf = _MetaObjects[ sKey ]
                    if ( childConf.__ptStyle  == 'colList' || childConf.__ptStyle  == 'jsonText' ) continue;
                    if ( ! childConf.listOf ) {
                        console.log( 'pciObjects no se encontro listOf para ' + sKey  )
                        nodeDef.lists[ix]
                        continue } 
                }
            }  
        }
                       
        if (  nodeDef.objects ) { 
            if  ( typeOf( nodeDef.objects ) != 'array' ) {
                console.log( 'pciObjects definicion errada de objects para ' + ptType )
                nodeDef.lists = [] 
            } else {
                for ( var ix in nodeDef.objects  ) {
                    var sKey = nodeDef.objects[ix]
                    if ( typeof( sKey)  !=  'string' ) {
                        console.log( 'pciObjects definicion errada en objects ' + ptType + ' key ' , sKey  )
                        nodeDef.lists[ix]
                        continue } 
                }
            }  
        }    
    }
    // ---------------------------------------


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
    
    __ptType  = getPtType( tData ) 
    if ( __ptType in oc( [ 'field', 'formField'])) {   
        __ptConfig = clearPhantonProps( __ptConfig,  __ptType ) }  
    // if ( __ptType in oc( [ 'filtersSet', 'filterDef'])) {console.log( 'filtersSet') }  
    if ( __ptConfig )  { 

        sType = typeOf( __ptConfig )
        if ( sType == 'object' ) {

            // El __ptConfig corresponde a la conf basica del node
            mData =  getSimpleProperties( __ptConfig  ) 
            if ( ! mData.__ptType ) mData.__ptType = __ptType    
            // if ( ! mData.name ) mData.name = __ptText    
            getChilds( tData, tChilds , mData , sType)
            
        } else if ( sType == 'array' )  {
            // Si es un array, el objeto de base es un array
            
            // Es una rama con conf de base e items 
            if ( __ptConfig.__ptConfig )  { 

                mData =  __ptConfig.__ptConfig
                mData.items = []
                getChilds( tData, tChilds , mData, 'items' )

            } else { 
                mData =  []  
                getChilds( tData, tChilds , mData , sType)
            } 

        } else  {
            console.log ('t2m Error de tipo', sType  )
            return {}
        }
        // Lo necesita por q  es leida del child   
        // mData.__ptText = __ptText  

    } else {

        console.log ('t2m Error ptConfig no definido', tNode  )
        return {}
        
    }


    // Borra el __ptType 
    if ( mData.__ptType  ) { 
        if ( !( mData.__ptType in oc([ 'protoForm','htmlset', 'fieldset','tabpanel','accordeon','panel', 'formField']))) {
            delete mData.__ptType 
        }
    } 

    return mData 
    

    // -----------------------------------------------------------------------------

    function getChilds( tData, tChilds, mData , sType) {
    
        
        // If protoForm then add items ( Se eliminaron en el arbol para facilidad de usuario )            
        if ( mData.__ptType in oc([ 'protoForm','htmlset', 'fieldset','tabpanel','accordeon','panel'])) {
            mData['items']  = []
            sType = 'items'
        }           
        for (var ix in tChilds ) {
            var lNode = tChilds[ ix ]
            var __ptType = getPtType( lNode  )
    
            var nChildData = Tree2Meta( lNode   )
            // delete nChildData.__ptText 
    
            if ( sType == 'object' ) {
                mData[ __ptType  ] = nChildData 
    
            } else if ( sType == 'array' )  {
                // si solo viene  nombre del campo lo crea como un objeto 
                if ( Ext.encode( nChildData ) === Ext.encode({}) ) nChildData = {} 
                mData.push( nChildData )

            } else if ( sType == 'items' )  {

                mData.items.push( nChildData )

            }
    
        }
        
    }
    
    function getPtType( lNode  ) {
    
        if  ( lNode.__ptType ) {
            return lNode.__ptType  
        } else if ( lNode.data && lNode.data.__ptType ) {
            return lNode.data.__ptType  
        }     
    
        console.log ( 'Tipo de dato??' , lNode )                
        
    }


}

function getSimpleProperties( oData, ptType   ) {
    // Retorna los valores simples, verificando los tipos de cada propiedad

    // Solo deben llegar objetos, si llega un array no hay props q mostrar     
    if ( typeOf( oData )  == 'array' ) {
        console.log( 'getSimpleProperties  array???', oData  )
        return []
    }   

    // Inicializa con el type 
    var cData = { '__ptType' : ptType }

    for (var lKey in oData ) {
        var cValue = oData[ lKey  ]

        // Los objetos o arrays son la imagen del arbol y no deben ser tenidos en cuenta, generarian recursividad infinita 
        if  ( typeOf( cValue  ) in oc([ 'object', 'array' ])) continue   

        // Si son valores codificados, los decodifica y los agrega  
        if ( lKey in oc( [ '__ptValue', '__ptList' ])  )  {
            try {
                cData = Ext.decode( cValue )    
            } catch (e) {  
                console.log( "Error de encodage", cValue )
            }
            
        } else {
            cValue = verifyPrpType(  lKey, cValue )
            if ( cValue ) { 
                cData[ lKey  ] = cValue  
            }
        } 
    }
    return cData 

}             


function formContainer2Tree( items ) {
    // Aqui solo llegan los contenedores de la forma,
    // se procesan los items en t2m y/o otros contenedores 

    var tItems = []

    for (var sKey in items ) {

        var oData = items[ sKey  ],  t2Data 
        var __ptConfig = getSimpleProperties( oData )
        var ptType = __ptConfig.__ptType
        
        //  contenedores de la forma 
        if ( ptType in oc([ 'htmlset', 'fieldset','tabpanel','accordeon','panel'])) {

            t2Data = getNodeBase(  ptType, ptType, __ptConfig  )
            t2Data['children'] = formContainer2Tree( oData.items )

                tItems.push(  t2Data ) 
 
            }  else if ( ptType in oc([ 'formField' ])) {  

            t2Data = getNodeBase(  __ptConfig.name, ptType, __ptConfig  )
            t2Data['leaf'] =  true
              
            tItems.push(  t2Data ) 

        } else {
            
            console.log( "Error formContainer2Tree", oData )
        } 

    
    }
    
    return tItems 
}

//


function getNodeBase( pName, ptType, __ptConfig  ) {
    // Obtiene un Id y genera  una referencia cruzada de la pcl con el arbol 
    // El modelo debe crear la referencia a la data o se perdera en el treeStore

    return  { 
        'id'            :  Ext.id(),
        'text'          :  pName, 
        '__ptType'      :  ptType, 
        '__ptConfig'    :  __ptConfig,
        'children'      :  [] 
    }

}
