

        function updTData( treeRecord , prpName, prpValue ) {
                // ProtoPcl 
                // Para actualizar el valor cuando se mostraban las propiedades de base en el arbol 
                // tData = updTData( me.treeRecord, prpName, e.value )
                // if ( me.treeRecord.isExpanded() ) treeGrid.getView().refresh();

            // TODO ???         
            var tNode = {}, ixNode;
            for ( ixNode in treeRecord.childNodes ) {
                
                tNode = treeRecord.childNodes[ ixNode  ]
                if ( tNode.data.text == prpName ) {
                    tNode.data.ptValue = prpValue 
                    return;  
                }  
            }

            // No lo encontro, lo agrega
            tNode = {}
            tNode['text']  =  prpName    
            tNode['ptValue'] =  prpValue  
            tNode['__ptType'] =  _SM.typeOf( prpValue )  
            tNode['leaf'] =  true  
            
            treeRecord.appendChild( tNode )
        }


function _SM.getComboChoices(  l1 ) {
    // Los valores vienen como una lista simple, el combo necesita una lista doble  ( ya no !! )
    
    var l2 = []
    for (var ix in l1) {
        var vlr = l1[ix]
        l2.push( [ vlr , vlr ])
    }
    
    return l2     
    
}
