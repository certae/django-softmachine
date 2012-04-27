
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


function DefineProtoModel ( myMeta , modelClassName ){
        
//    console.log ( 'Loading ' + modelClassName + '...' );

    // dateFormat: 'Y-m-d'
    // type: 'date', 'float', 'int', 'number'

    // useNull : vFld.allowNull,  ( solo para numeros, si no puede hacer la conversion )
    // defaultValue: vFld.defaultValue,
    // persist: vFld.editPolicy,		( falso = NoUpdate )
    
    // type: 'hasMany',
    // autoLoad: true
    // convert :  Campo Virtual calculado,  Apunta a una funcion q  genera el valor 
    
    var myFields = [];   		// model Fields 
	var dict = {};		 		// For indexing fields

    for (var ix in myMeta.fields ) {

        var vFld  =  myMeta.fields[ix];
		if (!vFld.type )  vFld.type = 'string'
        
        // modelField  
        var mField = {
            name: vFld.name,
            type: vFld.type 
        };


		// Determina el xType y otros parametros 
		switch( vFld.type )
		{
		case 'decimal':
			mField.type = 'number';	        
		  	break;
		case 'date':
			mField.dateFormat ='Y-m-d' 
		  	break;
		case 'datetime':
			mField.type = 'date';	        
			mField.dateFormat ='Y-m-d H:i:s'  // 'timestamp' 
		  	break;
		}

		// Asigna el modelo y el diccionario 
        myFields.push(mField);
		dict[vFld.name] = vFld
		
    }
    
    
    // Asigna un diccionario con las llaves como clave  
	myMeta.dict = dict
	
    // myFields = [{"name":"id","type":"int","useNull":true},{"name":"first","type":"string"},{"name":"last","type":"String"},{"name":"email","type":"string"}]
    Ext.define(modelClassName, {
        extend: 'Ext.data.Model',
            fields: myFields 

        });
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


function getColDefinition( vFld ) {
	//TODO:  Cargar las propiedades del modelo 

    if (!vFld.header ) vFld.header = vFld.name
	colDefinition = {
            dataIndex: vFld.name,
            text: vFld.header 
	}

	var lstProps = ['flex', 'hidden', 'width', 'minWidth', 'sortable',  
					'xtype', 'editMode', 'readOnly', 'hidden', 
					'render', 'align', 'format', 'tooltip'
					]

	colDefinition = copyProps ( colDefinition,  vFld, true, lstProps )
    if ( vFld.wordWrap == true ) colDefinition.renderer = columnWrap
	
	// Copia las propiedades de base 
	var lstProps = [
		'defaultValue', 
	
		// string 
		'allowBlank', 'readOnly', 
		'minLength', 'minLengthText', 
		'maxLength', 'maxLengthText', 
		
		// int, decimal
        'step', 

		// int, decimal, date, datime, time  
        'minValue', 'minText', 
        'maxValue', 'maxText',  

		// date, datime 
        'disabledDays', 'disabledDaysText'  	// [0, 6]
		]
    editor = copyProps ( {},  vFld, true, lstProps )


	// Determina el xType y otros parametros 
	if ( ! vFld.type )  vFld.type = 'string'
	switch( vFld.type )
	{
	case 'string':
        // editor.vtype = 'email'
	  	break;

	case 'text':
		colDefinition.renderer = columnWrap
	  	break;

	case 'int':
        colDefinition['xtype'] = 'numbercolumn'
		colDefinition['align'] = 'right'
		colDefinition['format'] = '0,000'

		editor.xtype = 'numberfield'
		editor.format = colDefinition['format']
		editor.allowDecimals = false
	  	break;

	case 'decimal':
        colDefinition['xtype'] = 'numbercolumn'
		colDefinition['align'] = 'right'
		colDefinition['format'] = '0,000.00'
        // vFld['renderer'] = 'usMoney'

		editor.xtype = 'numberfield'
		editor.format = colDefinition['format']
		editor.allowDecimals = true
        editor.decimalPrecision = 2
	  	break;

	
	case 'date':
        colDefinition['xtype'] = 'datecolumn' 
        colDefinition['format'] = 'Y/m/d'

		editor.xtype = 'datefield'
		editor.format = colDefinition['format']
	  	break;

	case 'datetime':
        colDefinition['xtype'] = 'datecolumn' 
        colDefinition['format'] = 'Y/m/d H:i:s'

		editor.xtype = 'datefield'
		editor.format = 'Y/m/d'
        editor.timeFormat = 'H:i'
	  	break;

	case 'time':
		//TODO:  En la edicion de grilla, al regresar cambia el formato 
        colDefinition['format'] = 'H:i'  //  'H:i:s'

		editor.xtype = 'timefield'
		editor.format = colDefinition['format']  	
	  	break;
	  	
	  	
	case 'bool':
		colDefinition['xtype'] = 'checkcolumn'      
        colDefinition['editMode'] = false 

        editor.xtype = 'checkbox'
        editor.cls = 'x-grid-checkheader-editor'
	  	break;
	  	
	case 'combo':
        editor.xtype = 'combobox'
        editor.typeAhead = true
        editor.triggerAction = 'all'
        editor.selectOnTab = true
        editor.store = vFld.choices
        editor.lazyRender = true
        editor.listClass = 'x-combo-list-small'
	  	break;

	case 'foreigntext': 
		// El zoom se divide en 2 cols el texto ( _unicode ) y el ID ( foreignid )
        editor.xtype = 'protoZoom'
	  	break;

	case 'foreignid': 
       	colDefinition['hidden']= true

        editor.xtype = 'numbercolumn'
        editor.hidden = true
	  	break;
	}


	// Asigna las coleccoiones de presentacion 
	if (( vFld.type != 'autofield' ) &&  ! vFld.readOnly ) 
    	colDefinition['editor'] = editor; 

	return colDefinition; 

	//  
  function columnWrap(value){
        return '<div style="white-space:normal; text-align:justify !important";>' + value + "</div>";
  };


}

function getFormFieldDefinition( vFld ) {

	var colDefinition = getColDefinition( vFld );
	
	if ( colDefinition.editor ) var formEditor = colDefinition.editor;
	else var formEditor = { readOnly : true  }
	  
    formEditor.fieldLabel =  vFld.fieldLabel || vFld.header || vFld.name 
	
	switch( vFld.type )
	{
	case 'text':
		formEditor.xtype = 'htmlfield'
		formEditor.height = 200
		formEditor.labelAlign = 'top'
	  	break;
	}

	return formEditor; 
	
}

