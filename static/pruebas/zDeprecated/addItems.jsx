

        //  -----------------------------------
        // Agrega los itemps en los contenedores 
        var nodChildren = { 
                "text": "items" ,
                "qtip": "Items in the container",
                "__ptType": "items",
                "children": [] 
        }

        for (var ix in treeData ) {
            var vNod  =  treeData[ix];
            if ( vNod.text == "Containers"  ) {
                for (var ix1 in vNod.children ) {
                    var vNod1  =  vNod.children[ix1];
                    vNod1.children.push( clone( nodChildren ))
                }
                break;
            } 
        }
