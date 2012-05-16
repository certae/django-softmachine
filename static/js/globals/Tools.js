
// Definicion del modelo, 

// TODO:  Traer aqui  manejo de la carga de la PCI 


// Object converter: Para testear si un elto hace parte de un array se convierte el array en objeto 
function oc(a)
{
  var o = {};
  for(var i=0;i<a.length;i++)
  {
    o[a[i]]='';
  }
  return o;
}



// TODO: Los templates de las finchas deberian ser leidos de un archivo 
function OpenFile( fileName  ) {
    // fh = window.open( fileName , 0);     // Open the file for reading 
    // if(fh!=-1)                          // If the file has been successfully opened 
    // { 
        // length = flength(fh);           // Get the length of the file     
        // str = fread(fh, length);        // Read in the entire file 
        // fclose(fh);                     // Close the file 
    // }
    // return str     
}


function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (Object.prototype.toString.call(value) == '[object Array]') {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}

/*
 * @oBase 		: Base objet ( source )
 * @oRef 		: Ref object ( source )
 * @overWrite	: Overwrite Base with Ref 
 * @lstProps 	: Properties to copy 
 */
function copyProps(oBase, oRef, overWrite, lstProps )
{
	
	if ( !overWrite ) overWrite = true; 

	oResult = clone( oBase ); 	
	for(var i in oRef)
	{
		if (  overWrite ||  ! oBase[i]  ) {
			if ( !lstProps ||  i in oc(lstProps) ) {
				oResult[i] = oRef[i];
			} 
		}
	}
	return oResult;
}


function clone(obj, auxRec, exclude ) {
	// @exclude permite excluir propiedades de un diccionario 
	
	
	// Verificacion de nivel de recursividad en la copia de objetos 
	if ( auxRec ) 	{ 
		auxRec = auxRec + 1 
	} else { auxRec = 1 } 

    if (null == obj || "object" != typeof obj) 
    	// si es un tipo simple,
    	return obj;
    
    if (obj instanceof Date) {
    	// los objetos tipo date no son tipos de base 
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    else if (obj instanceof Array) {
    	// Los array son copiados elto by elto.
        var copy = [];
        var len = obj.length;
        for (var i = 0; i < len; ++i) {
            copy[i] = clone(obj[i], auxRec, exclude );
        }
        return copy;
    }
    else if ( obj.$class ) {
		// Si es una clase, solo copia el initialConfig y un nombre de clase 
        var copy = {};
        if (obj.hasOwnProperty('initialConfig')) {
        	copy.initialConfig = clone( obj.initialConfig )
    	} 
        if (obj.__proto__.$className ) {
        	copy.className = obj.__proto__.$className
    	} 
		return copy; 
	}
	
    else if (obj instanceof Object) {
    	// Si es un objeto recorre las propiedades y las clona una a una 
        var copy = {};
        for (var attr in obj) {
        	if ( attr in oc( ['events', 'renderer'] )) continue; 
        	if (( exclude ) && ( attr in oc( exclude ))) continue; 

            if (obj.hasOwnProperty(attr)) {
            	// console.log ( auxRec,  obj, attr, obj[attr] )
            	copy[attr] = clone(obj[attr], auxRec, exclude);
            } 
        }
        return copy;
    }
	else  {
		// console.log ( 'N/A')
	    // var copy = obj.constructor();
	    // for (var attr in obj) {
	        // if (obj.hasOwnProperty(attr))  copy[attr] = obj[attr];
			// else copy[attr] = clone( obj[attr] );
	    // }
	    // return copy;
	} 
    
}




Ext.outils = function(){
	// Mensajes Style ExtJs Fix: Render position  
    var msgCt;

    function createBox(t, s){
       return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
    }
    return {
        msg : function(title, format){},
        
        // Reemplazar msg por msg1   
        msg1 : function(title, format){
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            // console.log ( title, ' ---> ', format  )
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
            m.hide();
            m.slideIn('t').ghost("t", { delay: 1000, remove: true});
        },

    };
}();



function __FormatJSON___( oData, sIndent) {
    if (! sIndent ) sIndent = "";
    var sIndentStyle = "&nbsp; &nbsp; ";
    var sDataType = typeOf(oData);

    // open object
    if (sDataType == "array") {
        if (oData.length == 0) {
            return "[]";
        }
        var sHTML = "[";
    } else {
        var iCount = 0;
        for (var attr in oData) {
            iCount++;
            break;
        };
        if (iCount == 0) { // object is empty
            return "{}";
        }
        var sHTML = "{";
    }

    // loop through items
    var iCount = 0;

    for (var sKey in oData) {
    	var vValue = oData[ sKey  ]
        if (iCount > 0) {
            sHTML += ",";
        }
        if (sDataType == "array") {
            sHTML += ("<br>" + sIndent + sIndentStyle);
        } else {
            sHTML += ("<br>" + sIndent + sIndentStyle + "\"" + sKey + "\"" + ": ");
        }

        // display relevant data type
        switch (typeOf(vValue)) {
            case "array":
            case "object":
                sHTML += FormatJSON(vValue, (sIndent + sIndentStyle));
                break;
            case "boolean":
            case "number":
                sHTML += vValue.toString();
                break;
            case "null":
                sHTML += "null";
                break;
            case "string":
            	vValue = vValue.replace( '<', '&lt;')
            	vValue = vValue.replace( '>', '&gt;')
                sHTML += ("\"" + vValue + "\"");
                break;
            default:
                sHTML += ("TYPEOF: " + typeof(vValue));
        }

        // loop
        iCount++;
    };

    // close object
    if (sDataType == "array") {
        sHTML += ("<br>" + sIndent + "]");
    } else {
        sHTML += ("<br>" + sIndent + "}");
    }

    // return
    return sHTML;
}




function SortObject(oData) {
    var oNewData = {};
    var aSortArray = [];

    // sort keys
    $.each(oData, function(sKey) {
        aSortArray.push(sKey);
    });
    aSortArray.sort(SortLowerCase);

    // create new data object
    $.each(aSortArray, function(i) {
        if (RealTypeOf(oData[(aSortArray[i])]) == "object" ) {
            oData[(aSortArray[i])] = SortObject(oData[(aSortArray[i])]);
        }
        oNewData[(aSortArray[i])] = oData[(aSortArray[i])];
    });

    return oNewData;

    function SortLowerCase(a,b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    }
}

function FormatJsonStr( sData ) {

	var oData = Ext.decode( sData )
	var sAux  = FormatMETA( oData, '', 'meta'  ) 
	return 	VerifyColon( sAux )


}

function FormatMETA( oData,  sIndent, pName, pType  ) {
	// FORMAT META for tree view  xxxxxxxxxx

	var sHTML = ''
    var sDataType = typeOf(oData);
	var sI2 = sIndent + '' ;

	// Solo deben entrar objetos o arrays 
	if (! (sDataType == "object"  ||  sDataType == "array")) return ''

	// El tipo solo viene cuando el padre es un array 
	if (! pType )  pType = pName 

	// formate la salida
	sHTML += sIndent + "{" 
	sHTML += sIndent + '"ptProperty": "' + pName + '",'
	sHTML += sIndent + '"ptType": "' +  pType  + '",'

	
	if ( sDataType == "object" ) {

		// Si es un objeto hay una propiedad q servira de titulo 
		var pTitle = pName ; 
		if ( oData['protoOption'] ) {
			pTitle = oData.protoOption  
		}

		sHTML += sIndent + '"ptTitle": "' +  pTitle + '",'
		sHTML += sIndent + '"children": [' +  FormatMetaItem( oData, sI2 )  
		sHTML += sIndent + "]," 
	} 


	// Verifica si tiene hijos 
	var bChilds = false 
    for (var sKey in oData) {
	    var typeItem = typeOf(  oData[sKey] );
        if ( typeItem == "object"  || typeItem == "array" ) {
        	bChilds = true;  
        	break; 
        }
	}		

	// Genera los hijos o cierra el objeto 
	// Ya sean arrays u obejtos se deben manejar como hijos
	if ( ! bChilds ) { 

		// Es un array de eltos simples 		oData.toString()  oData.join(',')
		if ( sDataType == "array" ) {
			sHTML += sIndent + '"ptValue": "' +  oData.toString() + '",'  
			sHTML += sIndent + '"children": []' 
			
		} else {
			// sHTML += sIndent + '"leaf": true'
		}		
		
	} else {

		sHTML += sIndent + '"children" : ['


	    for (var sKey in oData) {
	    	var vValue = oData[ sKey  ]
		    var typeItem = typeOf(vValue);

			// Solo procesa objetos o arrays 
 			if (! (typeItem == "object"  ||  typeItem == "array")) continue 
 			
			// PRegunta es por el objeto padre para enviar el tipo en los arrays  	
	        if ( sDataType == "object" ) {

                sHTML += FormatMETA(vValue, sI2, sKey  );

	        } else if ( sDataType == "array" ) {
	        	
	        	var oTitle = pName + '.' + sKey 
	        	
	        	if ( pName == 'fields'  && vValue.name ) {
	        		oTitle = vValue.name  
        		} else if ( pName == 'protoFieldSet' ) {
        			oTitle = vValue.style
        		}
	        	
                sHTML += FormatMETA(vValue, sI2, oTitle, pName   );

	        }  
		}
	
		sHTML = VerifyColon( sHTML )
		sHTML += sIndent + "],"
		
	}

	sHTML = VerifyColon( sHTML )
	sHTML += sIndent + "}," 

    return sHTML;
}


function VerifyColon( sAux   ) {
	
	// Elimina la ultima coma en caso de existir
	if ( sAux[sAux.length - 1] == ',' ) {
 		sAux = sAux.substring(0, sAux.length-1);
	}
	return sAux 
}


function FormatMetaItem( oData , sIndent  ) {
	
	// Carga los valores de las propiedades basicas

	var sHTML = ''; 
	var sI2 = sIndent + '' ;
	
    for (var sKey in oData) {

    	var vValue = oData[ sKey  ]
	    var sDataType = typeOf(vValue);

        if (sDataType == "array"  || sDataType == "object" || sDataType == "null") continue 
        if ( sHTML )  { sHTML += ","; }

		sHTML += sIndent + "{"

        if (sDataType == "string" ) { 
        	vValue = '"' + vValue.replace( '<', '&lt;').replace( '>', '&gt;') + '"'  
        }

        sHTML +=  sI2 + '"ptProperty" :"' + sKey + '",' 
        sHTML +=  sI2 + '"ptType" :"' + sDataType + '",'
        sHTML +=  sI2 + '"ptValue" :' + vValue.toString() + ',' 
		sHTML +=  sI2 + '"leaf": true'

		sHTML += sIndent + "}"

    };

	return sHTML 
}
	

    // var iCount = 0;
    // for (var sKey in oData) {
// 
// 
    	// vValue = oData[ sKey  ]
        // if (iCount > 0) {
            // sHTML += ",";
        // }
        // if (sDataType == "array") {
            // sHTML += ("" +  sIndent);
//             
        // } else {
//         	
//         	
            // sHTML += ("" +  sIndent + "ptProperty :'" + sKey + "'" + ": ");
        // }
// 
        // // display relevant data ptType
        // switch (typeOf(vValue)) {
            // case "array":
            // case "object":
                // sHTML += FormatMETA(vValue, ( sIndent));
        // }
// 
        // // loop
        // iCount++;
    // };


    // open object
    // if (sDataType == "array") {
// 
// 
        // if (oData.length == 0) {
            // return "children : [ {} ]";
        // }
        // sHTML += "children : [";
//         
// 
    // } else   {    }
// 
// 
    // // loop through items
// 
    // // close object
    // if (sDataType == "array") {
        // sHTML += ("" +  "]");
    // } else {
        // sHTML += ("" +  "}");
    // }

    // return
