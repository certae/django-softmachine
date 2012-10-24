

function Meta2Tree( oData, pName, ptType   ) {
    /* Convierte la meta en Arbol  
     * 
     * Input    --------------------------------- 
     * @oData     : Data a convertir
     * @pName     : property Name ( iteraction en el objeto padre )
     * @ptType    : property Type ( Tipo del padre en caso de ser un array  )
     *  
     * Return   -------------------------------
     * @tData   treeData
     * 
     */

    var  __ptConfig 
    var sDataType = typeOf(oData);

    // Solo deben entrar objetos o arrays 
    if (sDataType == "object"  ||  sDataType == "array")  {
        
        __ptConfig = get_ptConfig( oData )
        
        // El __ptConfig puede redefinirlas 
        if ( __ptConfig.__ptType )  ptType = __ptConfig.__ptType
        if ( __ptConfig.name )      pName  = __ptConfig.name


        // Form ( debe manejar el raiz sin el marco de items )
        if ( pName == 'protoForm') { ptType = 'protoForm' }
        if ( ptType in oc([ 'protoForm', 'fieldset','tabpanel','accordeon','panel'])) {
            var tData = getNodeBase( pName, ptType, __ptConfig  )
            tData['children'] = formContainer2Tree( oData.items )
            return tData 
        }  

        // Details 
        if (( ptType == 'protoDetails') && ( pName != ptType )) {
            ptType = 'protoDetail'                        
            var tData = getNodeBase( pName, ptType, __ptConfig  )
            tData['leaf'] =  true  
            return tData 
        }  


        if ( ! ptType  )  ptType = sDataType    
        
        if (  ptType  == "fields" )   ptType = 'field' 
        if (  ptType  in oc([ 'pcl', 'gridConfig']) )   ptType = pName 

        if (( ptType == 'filtersSet') && ( pName != ptType ))  ptType = 'filterDef'                        
        if (( ptType == 'listDisplaySet') && ( pName != ptType ))  ptType = 'listDisplay'                        

        if (( ptType == 'protoSheets') && ( pName != ptType ))  ptType = 'protoSheet'     
                           

        // Nombre de tipos q se propagaron 
        if (( ptType == 'sheetConfig' ) 
            && ( pName in oc([ 'protoSheetProperties', 'protoSheets']))) {
                ptType = pName
        }

        // Genera la info del nodo base 
        var tData = getNodeBase( pName, ptType, __ptConfig  )
        
        // Ramas que no deben abrirse 
        if ( (sDataType == "object" ) && ( ptType in oc([ 'field',  'protoGrid'  ]) ))  {
            tData['leaf'] =  true  
            return tData 
        }


        // Los tipos q son presentados en text 
        if ( ptType in oc([ 'baseFilter','initialFilter','initialSort','filterDef'])) {
            tData['__ptConfig' ] = { '__ptValue' :  Ext.encode( oData  ) }
            return tData 
        }   

        // Los tipos q son presentados en listas 
        if ( ptType in oc([ 'listDisplay',
                        'readOnlyFields', 'hiddenFields',
                        'searchFields', 'sortFields', 
                        'protoSheetProperties'])) {
            tData['__ptConfig' ] = { '__ptList' :  Ext.encode( oData  ) }
            return tData 
        }   



        tData['children'] =  [] 
        
        // Recorre las propiedades     
        for (var sKey in oData) {
            var vValue = oData[ sKey  ]
            var typeItem = typeOf(vValue);

            if ( typeItem  ==  undefined ) continue  

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
        
        // TODO m2t objeto plano???  Conversion 
        console.log (  'TODO FIX :  m2t objeto plano???  Aqui no dbee llegar nunca', oData, pName, ptType)
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
    
    __ptType  = getPtType( tData ) 
    // if ( __ptType in oc([ 'protoForm', 'fieldset'])) {console.log( __ptType , tNode )}  

    if ( __ptConfig )  { 

        sType = typeOf( __ptConfig )
        if ( sType == 'object' ) {

            // El __ptConfig corresponde a la conf basica del node
            mData =  get_ptConfig( __ptConfig  ) 
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


    return mData 
    

    // -----------------------------------------------------------------------------

    function getChilds( tData, tChilds, mData , sType) {
    
        
        // If protoForm then add items ( Se eliminaron en el arbol para facilidad de usuario )            
        if ( mData.__ptType in oc([ 'protoForm','fieldset','tabpanel','accordeon','panel'])) {
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
                if ( Ext.encode( nChildData ) === Ext.encode({}) ) nChildData = sText 
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

function get_ptConfig( oData   ) {
    
    if ( typeOf( oData )  == 'array' ) {
        return []

    } else if ( oData.__ptConfig )  {
        return oData.__ptConfig 

    } else {  
        
        var cData = {}
        for (var lKey in oData ) {
            var cValue = oData[ lKey  ]

            // Los objetos o arrays son la imagen del arbol y no deben ser tenidos en cuenta, generarian recursividad infinita 
            if  ( typeOf( cValue  ) in oc([ 'object', 'array' ])) continue   

            // __ptValue es un encodage 
            if ( lKey in oc( [ '__ptValue', '__ptList' ])  )  {
                try {
                    cData = Ext.decode( cValue )    
                } catch (e) {  
                    console.log( "Error de encodage", cValue )
                }
            } else {
                cData[ lKey  ] = cValue  
            } 

        }
        return cData 
    }
}             




function formContainer2Tree( items ) {
    // Aqui solo llegan los contenedores de la forma,
    // se procesan los items en t2m y/o otros contenedores 

    var tItems = []

    for (var sKey in items ) {

        var oData = items[ sKey  ],  t2Data 
        var __ptConfig = get_ptConfig( oData )
        var ptType = __ptConfig.__ptType
        
        //  contenedores de la forma 
        if ( ptType in oc([ 'fieldset','tabpanel','accordeon','panel'])) {

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

function Tree2Menu( tNode  ) {

    // Para poder leer de la treeData o del TreeStore ( requiere data )
    var tData = tNode.data,  
        tChilds =  tNode.childNodes, 
        mData = {}

    if ( tData.root ) {
        mData = getMenuChilds(  tChilds  )
    } else { 

        mData = {
                "text": tData.text ,
                "qtip": tData.qtip, 
                "qtitle": tData.qtitle, 
                "iconCls": tData.iconCls ,
                "id":  'protoMenu-' + Ext.id() ,
                "index": tData.index, 
            }
   
        // Es un menu 
        if ( tChilds.length > 0 ) {
             mData.expanded = tData.expanded
             mData.children = getMenuChilds(  tChilds  )
        } else {
             mData.leaf = true 
             mData.protoOption =  tData.protoOption ||  tData.id 
        }
                   
    } 

    return mData 


    function getMenuChilds( tChilds  ) {

        var mChilds = []    
           
        for (var ix in tChilds ) {
            var lNode = tChilds[ ix ]
            var nChildData = Tree2Menu( lNode   ) 
    
            mChilds.push( nChildData )

        }
        
        return mChilds
        
    }
    
}

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
