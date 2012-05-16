/* 
 * Formatear la meta para ser editada en un TreeGrid 
 * Dario Gomez May 15/2012
 */


function FormatMETA( oData, pName, pType, oBase, tBase  ) {

	/* -----------------   FORMAT META for tree view	
	 * @oData  	: Data a convertir
	 * @pName 	: property Name ( iteraction en el objeto padre )
	 * @pType 	: property Type ( Tipo del padre en caso de ser un array  )
	 *  
	 * @oBase	: Objeto padre 
	 * @tBase	: Objeto resultado hasta el momento  
	 * 
	 * @tData   treeData
	 */

	var tData = {}
    var sDataType = typeOf(oData);


	// Solo deben entrar objetos o arrays 
	if (sDataType == "object"  ||  sDataType == "array")  {

		if ( ! pType  ) pType = sDataType
		
		tData['ptProperty']  =  pName    
		tData['ptType'] =  pType 
		tData['children'] =  [] 

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

                tData['children'].push(  FormatMETA(vValue, sKey  ) ) 

	        } else if ( sDataType == "array" ) {
	        	
	        	var oTitle = pName + '.' + sKey 
	        	
	        	if ( pName == 'fields'  && vValue.name ) {
	        		oTitle = vValue.name  
        		} else if ( pName == 'protoFieldSet' ) {
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

	}

	return tData 

}


