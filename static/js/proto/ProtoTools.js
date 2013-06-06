


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
    if ( ! nodeDef ) {
        // console.log( 'Meta2Tree: definicion no encontrada para ' + ptType , oData )
        return
     }

    var __ptConfig  =   getSimpleProperties( oData, ptType )
    var tData       =   getNodeBase(  ptType, ptType, __ptConfig )


    if ( getSpecialNodes( nodeDef, tData, oData )) {
        return doFinalFormat( tData )
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
        var childConf = _MetaObjects[ sKey ],
            tChild

        tChild = getNodeBase(  sKey, sKey, { '__ptType' : sKey } )

        if ( ! getSpecialNodes( childConf, tChild, oData[ sKey ] )) {
            Array2Tree( oData[ sKey ],  childConf.listOf  , tChild  )
        }

        //  agrega la base de la lista
        tData['children'].push(  tChild   )

    }

    // Recorre los objetos
    for ( var ix in nodeDef.objects  ) {
        var sKey = nodeDef.objects[ix]

        // Obtiene el objeto de la meta, lo convierte y lo genera
        var tChild = Meta2Tree( oData[ sKey  ], sKey, sKey   )
        tData['children'].push(  tChild   )
    }

    // Asigna el nombre al nodo en caso de objetos


    return doFinalFormat( tData )

    function doFinalFormat( tData ) {
        tData.text = oData.name || oData.menuText || oData.property ||  oData.viewEntity ||  ptType
        return tData
    }

    // ---------------------------------------
    function getSpecialNodes( nodeDef, treeData, objData ){
        // Recibe el treeData y lo configura en caso de nodos especiales
        // retorna true si fue configurado

        // Form ( debe manejar el raiz sin el marco de items )
        if ( nodeDef.hideItems ) {
            if ( objData.items ) {
                treeData['children'] = formContainer2Tree( objData.items )
            } else {
                treeData['children'] = formContainer2Tree( objData  )}
            return true
        }

        // Los tipos codificados
        if ( nodeDef.__ptStyle == 'jsonText' ) {
            if ( objData.name ) { treeData.__ptConfig.name = objData.name  }
            treeData.__ptConfig.__ptValue =  Ext.encode( objData  )
            return true
        }
        if ( nodeDef.__ptStyle == 'colList' ) {
            treeData.__ptConfig.__ptList =  Ext.encode( objData  )
            return true
        }

    }

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



    function formContainer2Tree( items ) {
        // Aqui solo llegan los contenedores de la forma,  ( hideItems : true )

        var tItems = []
        for (var sKey in items ) {

            var oData = items[ sKey  ],
                t2Data

            var __ptConfig = getSimpleProperties( oData , ptType )
            var ptType = __ptConfig.__ptType

            //  contenedores de la forma
            if ( ptType in _SM.objConv([ 'htmlset', 'fieldset','tabpanel','accordeon','panel'])) {

                t2Data = getNodeBase(  ptType, ptType, __ptConfig  )
                t2Data['children'] = formContainer2Tree( oData.items )
                tItems.push(  t2Data )

            }  else if ( ptType in _SM.objConv([ 'formField', 'protoGrid' ])) {

                if ( ptType == 'protoGrid' )  {
                    t2Data = getNodeBase(  __ptConfig.menuText, ptType, __ptConfig  )

                } else {
                    t2Data = getNodeBase(  __ptConfig.name, ptType, __ptConfig  )
                }
                t2Data['leaf'] =  true
                tItems.push(  t2Data )

            // } else {
                // console.log( "Error formContainer2Tree", oData )
            }
        }
        return tItems
    }


    function verifyNodeDef( nodeDef ) {
        // Verifica las listas y objetos
        if ( nodeDef.lists ) {
            if ( _SM.typeOf( nodeDef.lists ) != 'array' ) {
                // console.log( 'pciObjects definicion errada de listas para ' + ptType )
                nodeDef.lists = []
            } else {
                for ( var ix in nodeDef.lists  ) {
                    var sKey = nodeDef.lists[ix]
                    if ( typeof( sKey)  !=  'string' ) {
                        // console.log( 'pciObjects definicion errada en listas ' + ptType + ' key ' , sKey  )
                        delete nodeDef.lists[ix]
                        continue }
                    var childConf = _MetaObjects[ sKey ]
                    if ( childConf.__ptStyle  == 'colList' || childConf.__ptStyle  == 'jsonText' ) continue;
                    if ( ! childConf.listOf ) {
                        // console.log( 'pciObjects no se encontro listOf para ' + sKey  )
                        nodeDef.lists[ix]
                        continue }
                }
            }
        }

        if (  nodeDef.objects ) {
            if  ( _SM.typeOf( nodeDef.objects ) != 'array' ) {
                // console.log( 'pciObjects definicion errada de objects para ' + ptType )
                nodeDef.lists = []
            } else {
                for ( var ix in nodeDef.objects  ) {
                    var sKey = nodeDef.objects[ix]
                    if ( typeof( sKey)  !=  'string' ) {
                        // console.log( 'pciObjects definicion errada en objects ' + ptType + ' key ' , sKey  )
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

    var tData, mData

    // Obtiene la info del nodo
    var myObj = getNodeInfo( tNode  )

    if ( ! myObj.__ptConfig )  {
        // console.log( 'Nodo sin configuracion ', tNode )
        return
    }

    // Obtiene la informacion base del nodo
    var nodeConf = _MetaObjects[ myObj.__ptType  ]
    if (  nodeConf.listOf   ) {
        mData = []
        getChilds( myObj.tChilds, mData , 'array')

    } else if ( nodeConf.__ptStyle in _SM.objConv( [ "colList", "jsonText"] ) ) {
        mData =  getSimpleProperties( myObj.__ptConfig  , myObj.__ptType )

    } else if ( nodeConf.properties || nodeConf.lists || nodeConf.objects  ) {
        mData =  getSimpleProperties( myObj.__ptConfig  , myObj.__ptType )
        if ( myObj.tChilds.length > 0  ) {
            if (  nodeConf.hideItems  ) {
                mData.items = []
                getChilds( myObj.tChilds, mData.items , 'array')
            } else {
                getChilds( myObj.tChilds, mData , 'object')
            }
        }

    // } else {
        // console.log( 'tre2meta no considera esta conf ', nodeConf,  tNode )
    }

    return mData

    function getChilds( tChilds, mData , sType) {

        // Recorre los hijos para crear los objetos segun su tipo
        for (var ix in tChilds ) {
            var lNode = tChilds[ ix ]
            var nChildData = Tree2Meta( lNode   )

            if ( sType == 'object' ) {
                mData[ getPtType( lNode  )  ] = nChildData
            } else   {
                mData.push( nChildData )
            }
        }
    }

    function getNodeInfo( tNode  ) {
        var tData, myObj  = {}
        if (  tNode.data ) {
            tData = tNode.data
            myObj.tChilds =  tNode.childNodes
        }  else {
            tData = tNode
            myObj.tChilds =  tNode.children
        }

        myObj.__ptType =   tData.__ptType
        if ( !tData.__ptConfig ) {
            // console.log( 'getNodeInfo: __ptConfig ni encotrado ', tNode )
            myObj.__ptConfig = {}
            return myObj
        }
        myObj.__ptConfig = clearPhantonProps( tData.__ptConfig, myObj.__ptType )
        return myObj
    }

    function getPtType( lNode  ) {
        if  ( lNode.__ptType ) {
            return lNode.__ptType
        } else if ( lNode.data && lNode.data.__ptType ) {
            return lNode.data.__ptType
        }
        // console.log ( 'getPtType: Tipo de dato no encontrado' , lNode )
    }

}


function getSimpleProperties( oData, ptType   ) {
    // Retorna los valores simples, verificando los tipos de cada propiedad

    // Solo deben llegar objetos, si llega un array no hay props q mostrar
    if ( _SM.typeOf( oData )  == 'array' ) {
        // console.log( 'getSimpleProperties  array???', oData  )
        return []
    }

    // Inicializa con el type
    var cData = {}
    if ( ptType ) { cData.__ptType = ptType }


    for (var lKey in oData ) {
        var cValue = oData[ lKey  ]

        // Los objetos o arrays son la imagen del arbol y no deben ser tenidos en cuenta, generarian recursividad infinita
        if  ( _SM.typeOf( cValue  ) in _SM.objConv([ 'object', 'array' ])) continue

        // Si son valores codificados, los decodifica y los agrega
        if ( lKey in _SM.objConv( [ '__ptValue', '__ptList' ])  )  {
            try {
                cData = Ext.decode( cValue )
            } catch (e) {
                // console.log( "Error de encodage", cValue )
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
