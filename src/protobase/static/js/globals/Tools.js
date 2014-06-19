// Definicion del modelo,

/*global Ext */
/*global _SM */
/*global ProtoUL */

_SM.typeOf=function (value) {
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
};

_SM.objConv=function ( a ){
    // Object converter: Para testear si un elto hace parte de un array se convierte el array en objeto
  var o = {};
  if ( ! a ) {
      // console.log( '_SM.objConv : no list!!! ')
      return o ;
  }
  for(var i=0;i<a.length;i++)
  {
    o[a[i]]='';
  }
  return o;
};

_SM.OpenFile = function (fileName) {

    // TODO: Los templates de las finchas deberian ser leidos de un archivo
    // fh = window.open( fileName , 0);     // Open the file for reading
    // if(fh!=-1)                          // If the file has been successfully opened
    // {
        // length = flength(fh);           // Get the length of the file
        // str = fread(fh, length);        // Read in the entire file
        // fclose(fh);                     // Close the file
    // }
    // return str
};

_SM.copyProps = function (oBase, oRef, overWrite, lstInclude, lstExclude ){

    if ( !overWrite ) overWrite = true;

    var oResult = _SM.clone(oBase, 0, lstExclude);
    for(var i in oRef)
    {
        if (  overWrite ||  ! oBase[i]  ) {
            if ( !lstInclude ||  i in _SM.objConv(lstInclude) ) {
                oResult[i] = oRef[i];
            }
        }
    }
    return oResult;
};

_SM.clone = function (obj, auxRec, exclude, include) {
    /*
 * @obj     : obj to _SM.clone
 * @auxRec  : Control de recursividad  ( no debe pasar de un max de nivles ie 5 )
 * @exclude : permite excluir propiedades de un diccionario
 */

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
            copy[i] = _SM.clone(obj[i], auxRec, exclude , include );
        }
        return copy;
    }
    else if ( obj.$class ) {
        // Si es una clase, solo copia el initialConfig y un nombre de clase
        var copy = {};
        if (obj.hasOwnProperty('initialConfig')) {
            copy.initialConfig = _SM.clone( obj.initialConfig, auxRec, exclude , include )
        }
        // if (obj.__proto__.$className ) {copy.className = obj.__proto__.$className}
        return copy;
    }

    else if (obj instanceof Object) {
        // Si es un objeto recorre las propiedades y las clona una a una
        var copy = {};
        for (var attr in obj) {
            if ( attr in _SM.objConv( ['events', 'renderer'] )) continue;
            if (( exclude ) && ( attr in _SM.objConv( exclude ))) continue;
            if (( include ) && ! ( attr in _SM.objConv( include ))) continue;

            if (obj.hasOwnProperty(attr)) {
                // console.log ( auxRec,  obj, attr, obj[attr] )
                copy[attr] = _SM.clone(obj[attr], auxRec, exclude, include);
            }
        }
        return copy;
    }
    else  {
        // console.log ( 'N/A')
        // var copy = obj.constructor();
        // for (var attr in obj) {
            // if (obj.hasOwnProperty(attr))  copy[attr] = obj[attr];
            // else copy[attr] = _SM.clone( obj[attr] );
        // }
        // return copy;
    }
};

_SM.FormatJSON = function (oData, sIndent) {
    // Indenta un string JSON no formateado
    // Tools.FormatJSon  CERTAE U. Laval 2012/02
    // @oData    :  Unformated JSon string
    // @sIndent  :  Optional spaces string  or  [&nbsp;  ]
    // sIndent = ' '  encode text

    var sIndentStyle = "&nbsp; &nbsp; ";
    var BR = "<br>";

    if (! sIndent ){ sIndent = "" }
    else if ( sIndent  == ' ') { sIndentStyle = ''; BR = '' }

    var sDataType = _SM.typeOf(oData);

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
        switch (_SM.typeOf(vValue)) {
            case "array":
            case "object":
                sHTML += _SM.FormatJSON(vValue, (sIndent + sIndentStyle));
                break;
            case "boolean":
                if ( vValue ) { sHTML += "true" } else { sHTML += "false" }
                break;
            case "number":
                sHTML += vValue.toString();
                break;
            case "null":
                 sHTML += "null";  //  None
                break;
            case "string":
                vValue = vValue.replace( /'/g, '\\\'').replace( /"/g, '\\"')
                if ( sIndent  != ' ') {
                    vValue = vValue.replace( /</g, '&lt;').replace( />/g, '&gt;')
                }

                sHTML += ("\"" + vValue + "\"");
                break;
            default:
                sHTML += ("TYPEOF: " + _SM.typeOf(vValue));
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
};

_SM.VerifyLast = function (sAux, sChar) {

    // Elimina condicionalmente el  ultima caracter
    if ( ! sChar ) sChar = ',';
    if ( sAux[sAux.length - 1] == sChar ) {
         sAux = sAux.substring(0, sAux.length-1);
    }
    return sAux;
};

_SM.FormatJsonStr = function (sData) {
    var oData = {};

    // Verifica q no venga vacio
    if ( ! sData ) return oData;

    // Separado para debuguer
    try {
        oData = Ext.decode( sData );
    } catch(e) {}

    var sAux  = _SM.FormatJSON( oData );
    return     sAux;
};

_SM.charCount = function (sData, sChar) {
    // Cuenta las ocurrencias de un caracter en una cadena
    if ( sData ) {
        return sData.split(sChar).length;
    }  else { return 0; }
};


_SM.clearProps = function (obj) {
    // Borra las propiedades con valores nulos no definidos o blancos

    for (var ix in obj) {
        if ( ! obj[ix] &&  obj[ix] != false) {
            delete obj[ix];
        } else if ( _SM.typeOf(obj[ix])  == 'string'  && obj[ix].trim() == '' ) {
            delete obj[ix];
        }
    }

    return obj;
};

_SM.errorMessage = function (errTitle, errMsg) {

    // TODO: Log de errores, ya sea en stBar o en un panel del menu, habilitar un clear .
    _SM.__StBar.showError( errMsg , errTitle );

    // Ext.MessageBox.show({
        // title: errTitle,
        // msg: errMsg,
        // icon: Ext.Msg.ERROR,
        // buttons: Ext.Msg.OK
    // });
};

_SM.updateWinPosition = function (myWidth, myHeight) {

    _SM._winX += 40; _SM._winY += 20;
    if ((_SM._winX + myWidth) > _SM._mainWin.width || (_SM._winY + myHeight) > _SM._mainWin.height) {
        _SM._winX = 10; _SM._winY = 10;
    }
};

_SM.savePclCache = function (viewCode, protoMeta, reOpen ) {

   // Asigna la llave, pues si se hace una copia seguiria trayendo la misma viewCode de base
   // console.log(protoMeta);
    if ( viewCode.substring(0, protoMeta.viewEntity.length ) !== protoMeta.viewEntity ) {
        viewCode =  protoMeta.viewEntity + '.' + protoMeta.viewCode;
    }

    protoMeta.viewCode = viewCode

    _SM.DefineProtoModel(protoMeta );

    // Guarda el cache de  pcl's
    _SM._cllPCI[viewCode] = protoMeta;

    // Cierra todas las instancias de esta pcl
    if ( reOpen ) {
        _SM.CloseProtoTab( viewCode );
        _SM._mainWin.loadPciFromMenu( viewCode );
    }

};

_SM.getModelName = function (viewCode) {
    // En principio traia un modelo de base q servia para todas las vistas construidas
    // con el nuevo esquema de creacion dinamica, es mejor q el modelo corresponda a la
    // opcion, pues las definiciones pueden ser totalmente diferentes.


    // var modelName = viewCode;
    // Cuenta los "."
    // if ( _SM.charCount( viewCode, ".")  > 2  ) {
        // var n = viewCode.split(".", 2)
        // modelName = n[0] + '.' + n[1]
    // }


    return _SM._PConfig.clsBaseModel + viewCode;
};

_SM.getSafeMeta = function (myMeta) {

    // prepara la meta q retorna al BackEnd
    var safeMeta = {
        "viewCode"  : myMeta.viewCode,
        "viewEntity" : myMeta.viewEntity,
        "localSort" :  myMeta.localSort || false,
        "protoEntityId": myMeta.protoEntityId,
        "jsonField"    : myMeta.jsonField || ''  ,
        // "pciStyle"     : myMeta.pciStyle,
        // "sql"          : myMeta.sql,
        "idProperty"   : myMeta.idProperty,
        "gridConfig"   : {
            "searchFields": _SM.clone( myMeta.gridConfig.searchFields  )
        },
        "fields": _SM.clone( myMeta.fields, 0, [],  [
            'name', 'type',
            'zoomModel', 'fkId',
            'crudType', 'cpFromField', 'cpFromZoom', 'physicalName'
            ] ),
        "usrDefProps": _SM.clone( myMeta.usrDefProps )
    } ;

    return Ext.encode( safeMeta );
};

_SM.getGridColumn = function (myGrid, dataIndex) {
    for ( var ix in myGrid.myColumns ) {
        var myCol = myGrid.myColumns[ix];
        if ( myCol.dataIndex == dataIndex )  return myCol;
    }
};

_SM.showConfig = function (title, myConf) {

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

        var sValue = _SM.FormatJSON( myConf , ' ');

        msgBox.show({
           width : 800,
           multiline : true,
           // msg va arriba de la caja de texto y se estila html y el html no sirve de nada
           // msg: sValue,
           // html: sValue,
           value: sValue,
           title: title
        });
};

_SM.getCurrentTime = function () {
    return Ext.Date.format( new Date() , "Y-m-d H:i:s" );
};

_SM.verifyList = function (myList, defList) {

    // verifica el default
    if (( ! defList ) || ( _SM.typeOf( defList ) != 'array' )) { defList = []; }

    // Verifica q sea una lista
    if ( _SM.typeOf( myList ) != 'array' ) {
        myList = defList; }
    else if ( myList.length  == 0 ) {
        myList  = defList; }

    return myList;
};

_SM.verifyObj = function (myObj, defObj) {

    // verifica el default
    if (( ! defObj ) || ( _SM.typeOf( defObj ) != 'object' )) { defObj = {}; }

    // Verifica q sea un objeto
    if ( _SM.typeOf( myObj ) != 'object' )   {
        myObj = defObj; }

    else  {
        // Aplica el objeto real sobre el vr por defecto
        myObj  = Ext.apply( defObj, myObj ); }

    return myObj;
};

_SM.obj2tx = function( myObj ) {
    // recibe un obj y garantiza q retorne un texto ( con un array )
    var sAux = typeof myObj;
    if ( sAux == 'string' ) { sAux = myObj; }
    else{ try { sAux  = Ext.encode( myObj );
        } catch(e) {sAux = '[]'; }
    }
    return sAux;
};


_SM.ptPrompt = function (title, msg) {

    return prompt( msg )
    // Ext.Msg.prompt(title, msg, function(btn, pName){
        // if (btn != 'ok') return ''
        // return pName
    // })
};

//Eventos :

_SM.openScript = function (url) {
    //permite cargar script de un archivo
    //'../../static/aplications/GIS/factura_dblclick.js'
    var scrpt = document.createElement('script');
    scrpt.src = url;
    document.head.appendChild(scrpt);
};

_SM.fireEvent = function (type, myMeta, eventData, scope, fn) {
    me = scope;
    var code = myMeta.businessRules[type] || null;
    // console.log(code + "-->" + type);
    eventData.type = type;
    _SM.eventData = eventData;
    _SM.eventData.cancel = false;
    if (code != null) {

        if (type == "DblClick" || type == "default") {

            _SM.eventData.HDataField = scope._extGrid.columns[_SM.eventData.cellIndex].dataIndex;
        }
        eval(code);
        if (!_SM.eventData.cancel) {
            fn();
        }
    } else {
        fn();
    }

};

_SM.GetRowValue = function (cellName) {
    try {
        var data = _SM.eventData.record.get(cellName);
        return data;
    } catch (e) {
        return null;
    }

};


_SM.CloseProtoTab = function( name  ) {

    // Cierra las instancias de una pcl
    _SM.__TabContainer.closeProtoTab( name );

};

_SM.Product  = function (list) {
    var first = list[0];
    var rest = list.slice(1);

    if (first) {
        var output = [];

        if (rest.length > 0) {
            var prod_rest = _SM.Product(rest);

            for (var i = 0; i < prod_rest.length; i++) {
                for (var j = 0; j < first.length; j++) {
                    output.push([first[j]].concat(prod_rest[i]));
                }
            }
        } else {
            for (var j = 0; j < first.length; j++) {
                output.push([first[j]]);
            }
        }

        return output;
    } else {
        return [];
    }
};


// DIAGRAM DESIGNER
var dbModel = {
    shape: {},
	locator: {}
};
var jsonDocument = [];


function loadJsFilesSequentially(scriptsCollection, startIndex, librariesLoadedCallback) {
    if (scriptsCollection[startIndex]) {
    	if (filesadded.indexOf("[" + scriptsCollection[startIndex] + "]") === -1){
	        var fileref = document.createElement('script');
	        fileref.setAttribute("type", "text/javascript");
	        fileref.setAttribute("src", scriptsCollection[startIndex]);
	        fileref.onload = function() {
	            startIndex = startIndex + 1;
	            loadJsFilesSequentially(scriptsCollection, startIndex, librariesLoadedCallback);
	        };
	
	        document.getElementsByTagName("head")[0].appendChild(fileref);
	        filesadded += "[" + scriptsCollection[startIndex] + "]";
    	} else {
    		startIndex = startIndex + 1;
	        loadJsFilesSequentially(scriptsCollection, startIndex, librariesLoadedCallback);
    	}
    } else {
        librariesLoadedCallback();
    }
}

// An array of scripts you want to load in order
var scriptLibrary = [];
//list of files already added
var filesadded = "";

function displayJSON(canvas) {
    var writer = new draw2d.io.json.Writer();
    writer.marshal(canvas, function(json) {
        $("#json").text(JSON.stringify(json, null, 2));
    });
}

function createJSFilesLibrary() {
    scriptLibrary.push("static/js2db/lib/jquery-1.10.2.min.js");
    scriptLibrary.push("static/js2db/lib/jquery.autoresize.js");
    scriptLibrary.push("static/js2db/lib/jquery-touch_punch.js");
    scriptLibrary.push("static/js2db/lib/jquery.contextmenu.js");

    scriptLibrary.push("static/js2db/lib/shifty.js");

    scriptLibrary.push("static/js2db/lib/raphael.js");
    scriptLibrary.push("static/js2db/lib/rgbcolor.js");
    scriptLibrary.push("static/js2db/lib/canvg.js");

    scriptLibrary.push("static/js2db/lib/Class.js");

    scriptLibrary.push("static/js2db/lib/json2.js");

    scriptLibrary.push("static/js2db/lib/pathfinding-browser.min.js");
	
	scriptLibrary.push("static/js2db/draw2d/src/draw2d-all.js");
	
    scriptLibrary.push("static/js2db/lib/jquery.browser.js");
    scriptLibrary.push("static/js2db/lib/jquery-ui-1.8.23.custom.min.js");
    scriptLibrary.push("static/js2db/lib/jquery.layout.js");

    scriptLibrary.push("static/js2db/dbModel/View.js");
    scriptLibrary.push("static/js2db/dbModel/locator/PortRightLocator.js");
    scriptLibrary.push("static/js2db/dbModel/locator/PortLeftLocator.js");
    scriptLibrary.push("static/js2db/dbModel/shape/DBTable.js");
    scriptLibrary.push("static/js2db/dbModel/shape/ManhattanRightConnectionLocator.js");
    scriptLibrary.push("static/js2db/dbModel/shape/ManhattanLeftConnectionLocator.js");
    scriptLibrary.push("static/js2db/dbModel/shape/TableConnection.js");
    scriptLibrary.push("static/js2db/dbModel/shape/CustomLabel.js");

}
