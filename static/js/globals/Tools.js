
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
 * @oBase         : Base objet ( source )
 * @oRef         : Ref object ( source )
 * @overWrite    : Overwrite Base with Ref 
 * @lstInclude     : Properties to copy 
 */
function copyProps(oBase, oRef, overWrite, lstInclude, lstExclude )
{
    
    if ( !overWrite ) overWrite = true; 

    var oResult = clone( oBase , 0, lstExclude );     
    for(var i in oRef)
    {
        if (  overWrite ||  ! oBase[i]  ) {
            if ( !lstInclude ||  i in oc(lstInclude) ) {
                oResult[i] = oRef[i];
            } 
        }
    }
    return oResult;
}

/* 
 * @obj     : obj to clone 
 * @auxRec  : Control de recursividad  ( no debe pasar de un max de nivles ie 5 )
 * @exclude : permite excluir propiedades de un diccionario
 */
function clone(obj, auxRec, exclude ) {
    
    // Verificacion de nivel de recursividad en la copia de objetos 
    if ( auxRec )  {  auxRec = auxRec + 1 } else { auxRec = 1 } 
    if ( auxRec > 5 )  return obj  

    // si es un tipo simple,
    if (null == obj || "object" != typeof obj) 
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




function FormatJSON( oData, sIndent) {
    // Indenta un string JSON 
    
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
                vValue = vValue.replace( '<', '&lt;').replace( '>', '&gt;').replace( '"', '\'')
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


function VerifyLast( sAux , sChar   ) {
    
    // Elimina condicionalmente el  ultima caracter
    if ( ! sChar ) sChar = ','
    if ( sAux[sAux.length - 1] == sChar ) {
         sAux = sAux.substring(0, sAux.length-1);
    }
    return sAux 
}



function FormatJsonStr( sData ) {
    var oData = {}; 

    // Verifica q no venga vacion 
    if ( ! sData ) return oData
    
    // Separado para debuguer 
    try {
        oData = Ext.decode( sData )   
    } catch(e) {}
    
    var sAux  = FormatJSON( oData )
    return     sAux

}

function charCount(  sData,  sChar ) {
    // Cuenta las ocurrencias de un caracter en una cadena  
    if ( sData ) {
        return sData.split(sChar).length
    }  else { return 0 }  
    
}


function getComboChoices(  l1 ) {
    // Los valores vienen como una lista simple, el combo necesita una lista doble  ( ya no !! )
    
    var l2 = []
    for (var ix in l1) {
        var vlr = l1[ix]
        l2.push( [ vlr , vlr ])
    }
    
    return l2     
    
}


function clearProps(  obj ) {
    // Borra las propiedades con valores nulos no definidos o blancos 
    
    for (var ix in obj) {
        if ( ! obj[ix] &&  obj[ix] != false) {
            delete obj[ix]
        } else if ( typeOf(obj[ix])  == 'string'  && obj[ix].trim() == '' ) {
            delete obj[ix]
        }  
    }
    
    return obj     
    
}



function errorMessage(  errTitle,  errMsg ) {

    // TODO: Log de errores, ya sea en stBar o en un panel del menu, habilitar un clear . 
    __StBar.showError( errMsg , errTitle )
    
    // Ext.MessageBox.show({
        // title: errTitle,
        // msg: errMsg,
        // icon: Ext.Msg.ERROR,
        // buttons: Ext.Msg.OK
    // });
    
}


function updateWinPosition( myWidth, myHeight ) {

    _winX += 40; _winY += 20;
    if ( ( _winX + myWidth ) > _mainWin.width  || ( _winY + myHeight ) > _mainWin.height  ) {
        _winX = 10; _winY = 10;
    }    
    
}

// **********************************************************

function savePclCache( protoOption, protoMeta ) {
    // Guarda el cache de  pcl's 
    
    _cllPCI[ protoOption ]  = protoMeta;  
    DefineProtoModel( protoMeta , getModelName( protoOption  )  );

}


function getModelName( protoOption  ) {

    if ( ! protoOption ) {
        console.log( 'undefined model??')
    }

    var modelName = protoOption; 
    
    // Cuenta los "."
    if ( charCount( protoOption, ".")  > 2  ) {
        var n = protoOption.split(".", 2)         
        modelName = n[0] + '.' + n[1]
    }

    return _PConfig.clsBaseModel + modelName 

}



function getSafeMeta( myMeta ) {
    
    // prepara la meta 
    var excludeP = [ 'protoForm', 'sheetConfig', 'protoViews', 'protoDetails']
    var safeMeta =  clone( myMeta, 0, excludeP );
    
    return Ext.encode( safeMeta )
    
}

function getGridColumn( myGrid, dataIndex  ) {
    for ( var ix in myGrid.myColumns ) {
        var myCol = myGrid.myColumns[ix]
        if ( myCol.dataIndex == dataIndex )  return myCol    
    }
}

