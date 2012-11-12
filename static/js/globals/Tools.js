
// Definicion del modelo, 

// TODO:  Traer aqui  manejo de la carga de la PCI 


// Object converter: Para testear si un elto hace parte de un array se convierte el array en objeto 
function oc( a )
{
  var o = {};
  if ( ! a ) {
      console.log( 'oc : no list!!! ')
      return o ;
  }
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
function clone(obj, auxRec, exclude, include  ) {
    
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
            copy[i] = clone(obj[i], auxRec, exclude , include );
        }
        return copy;
    }
    else if ( obj.$class ) {
        // Si es una clase, solo copia el initialConfig y un nombre de clase 
        var copy = {};
        if (obj.hasOwnProperty('initialConfig')) {
            copy.initialConfig = clone( obj.initialConfig, auxRec, exclude , include )
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
            if (( include ) && ! ( attr in oc( include ))) continue; 

            if (obj.hasOwnProperty(attr)) {
                // console.log ( auxRec,  obj, attr, obj[attr] )
                copy[attr] = clone(obj[attr], auxRec, exclude, include);
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
    // Indenta un string JSON no formateado
    // Tools.FormatJSon  CERTAE U. Laval 2012/02  
    // @oData    :  Unformated JSon string 
    // @sIndent  :  Optional spaces string  or  [&nbsp;  ]
    // sIndent = ' '  encode text  
    
    var sIndentStyle = "&nbsp; &nbsp; ";
    var BR = "<br>"; 
    
    if (! sIndent ){ sIndent = "" }
    else if ( sIndent  == ' ') { sIndentStyle = ''; BR = '' }
    
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
            sHTML += (BR + sIndent + sIndentStyle);
        } else {
            sHTML += (BR + sIndent + sIndentStyle + "\"" + sKey + "\"" + ": ");
        }

        // display relevant data type
        switch (typeOf(vValue)) {
            case "array":
            case "object":
                sHTML += FormatJSON(vValue, (sIndent + sIndentStyle));
                break;
            case "boolean":
                if ( vValue ) { sHTML += "True" } else { sHTML += "False" }
                break;   
            case "number":
                sHTML += vValue.toString();
                break;
            case "null":
                sHTML += "None";
                break;
            case "string":
                vValue = vValue.replace( /'/g, '\\\'').replace( /"/g, '\\"')
                if ( sIndent  != ' ') {
                    vValue = vValue.replace( /</g, '&lt;').replace( />/g, '&gt;')    
                }
                
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
        sHTML += (BR + sIndent + "]");
    } else {
        sHTML += (BR + sIndent + "}");
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

    // Verifica q no venga vacio 
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

    // Asigna la llave, pues si se hace una copia seguiria trayendo la misma protoOption de base 
    protoMeta.protoOption = protoOption 

    verifyMetaVersion( protoMeta )
    DefineProtoModel( protoMeta , getModelName( protoOption  )  );

    // Guarda el cache de  pcl's 
    _cllPCI[ protoOption ]  = protoMeta;  

}


function verifyMetaVersion( protoMeta ) {
    
    // 121108  Se relocaliza protoSheets,  protoSheetProperties se crean dinamicamente.  
    if ( protoMeta.sheetConfig )  { 
        sheetConfig = protoMeta.sheetConfig; 
        protoMeta.protoSheetSelector = sheetConfig.protoSheetSelector;
        if ( sheetConfig.protoSheets ) {
            protoMeta.protoSheets = sheetConfig.protoSheets;    
        }
        delete protoMeta.sheetConfig 
    }

}


function getModelName( protoOption  ) {
    // En principio traia un modelo de base q servia para todas las vistas construidas 
    // con el nuevo esquema de creacion dinamica, es mejor q el modelo corresponda a la 
    // opcion, pues las definiciones pueden ser totalmente diferentes. 

    if ( ! protoOption ) {
        console.log( 'undefined model??')
    }

    var modelName = protoOption; 
    
    // Cuenta los "."
    // if ( charCount( protoOption, ".")  > 2  ) {
        // var n = protoOption.split(".", 2)         
        // modelName = n[0] + '.' + n[1]
    // }

    return _PConfig.clsBaseModel + modelName 

}



function getSafeMeta( myMeta ) {
    
    // prepara la meta q retorna al BackEnd 
    var safeMeta = { 
        "pciStyle" : myMeta.pciStyle, 
        "protoOption" : myMeta.protoOption,      
        "protoConcept" : myMeta.protoConcept,      
        "gridConfig": {
            "searchFields": clone( myMeta.gridConfig.searchFields  )
        },
        "fields": clone( myMeta.fields, 0, [],  [ 'name', 'type', 'fromField'] ),
        "protoUdp": clone( myMeta.protoUdp )  
    } 
        
    return Ext.encode( safeMeta )
    
}

function getGridColumn( myGrid, dataIndex  ) {
    for ( var ix in myGrid.myColumns ) {
        var myCol = myGrid.myColumns[ix]
        if ( myCol.dataIndex == dataIndex )  return myCol    
    }
}


function showConfig( title , myConf ) {

        var msgBox =  Ext.create('Ext.window.MessageBox', {
            minHeight: 200,
            maxHeight: 500,
            defaultMinHeight: 200,
            defaultMaxHeight: 500,
            defaultTextHeight : 250, 
            styleHtmlContent : true
        });
    
        // msgBox.maxHeight = 600
        // msgBox.minHeight = 200
        
        var sValue = FormatJSON( myConf , ' ')
        
        msgBox.show({
           width : 800, 
           multiline : true,   
           // msg va arriba de la caja de texto y se estila html y el html no sirve de nada 
           // msg: sValue, 
           // html: sValue,
           value: sValue, 
           title: title
        })
    }
    
function getCurrentTime(){
    return Ext.Date.format( new Date() , "Y-m-d H:i:s" )
}


function verifyList ( myList , defList ){

    // verifica el default 
    if (( ! defList ) || ( typeOf( defList ) != 'array' )) { defList = [] }
    
    // Verifica q sea una lista 
    if ( typeOf( myList ) != 'array' ) { 
        myList = defList }
    else if ( myList.length  == 0 ) { 
        myList  = defList }
        
    return myList 
}

function verifyObj ( myObj , defObj ){

    // verifica el default 
    if (( ! defObj ) || ( typeOf( defObj ) != 'object' )) { defObj = {} }
    
    // Verifica q sea un objeto  
    if ( typeOf( myObj ) != 'object' )   { 
        myObj = defObj }
        
    else  { 
        // Aplica el objeto real sobre el vr por defecto 
        myObj  = Ext.apply( defObj, myObj ) }
        
    return myObj 
}


function ptPrompt( title, msg )  {
     
    return prompt( msg )     
    // Ext.Msg.prompt(title, msg, function(btn, pName){
        // if (btn != 'ok') return '' 
        // return pName  
    // })
} 

