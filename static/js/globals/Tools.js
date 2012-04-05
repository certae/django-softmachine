
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
    
    var myFields = [];
	var dict = {};

    for (var ix in myMeta.fields ) {

        var vFld  =  myMeta.fields[ix]; 
        var mField = {
            name: vFld.name,
            type: 'string' 
        };

		// DGT:  traer esto directamente del modelo 
        editor = {
            allowBlank: false,
            readOnly: false, 
            fieldLabel:  vFld.fieldLabel || vFld.header || vFld.name 
		}; 
		
		// Determina el xType y otros parametros 
		if ( ! vFld.type )  vFld.type = 'string'
		switch( vFld.type )
		{
		case 'string':
			editor.minLength = 2
			editor.minLengthText = 'Cannot ...'
	        // editor.vtype = 'email'
		  	break;

		case 'text':
			editor.xtype = 'fieldhtmleditor'
			editor.height = 200
			editor.labelAlign = 'top'
		  	break;

		case 'string':
			editor.minLength = 2
			editor.minLengthText = 'Cannot ...'
	        // editor.vtype = 'email'
		  	break;
		
		case 'int':
			mField.type = 'int';	        

	        vFld['xtype'] = 'numbercolumn'
			vFld['align'] = 'right'
			vFld['format'] = '0,000'

			editor.xtype = 'numberfield'
			editor.format = '0,000'
			editor.allowDecimals = false
            editor.step = 1

            editor.minValue = 0
            editor.minText = 'Cannot ...'

            editor.maxValue = 1000000
            editor.maxText = 'Cannot  ...'
		  	break;

		case 'decimal':
			mField.type = 'number';	        

	        vFld['xtype'] = 'numbercolumn'
			vFld['align'] = 'right'
			vFld['format'] = '0,000.00'
            // vFld['renderer'] = 'usMoney'

			editor.xtype = 'numberfield'
			editor.format = '0,000'
			editor.allowDecimals = true
            editor.decimalPrecision = 2
            editor.step = 0.5

            editor.minValue = 0
            editor.minText = 'Cannot ...'

            editor.maxValue = 1000000
            editor.maxText = 'Cannot  ...'
		  	break;

		
		case 'date':
			mField.type = 'date';	        
			mField.dateFormat ='Y-m-D' 

	        vFld['xtype'] = 'datecolumn' 
	        vFld['format'] = 'Y-m-d'

			editor.xtype = 'datefield'
			editor.format = 'y/m/d'

            editor.minValue = '1900/01/01'
            editor.minText = 'Cannot ...'
            editor.maxValue = Ext.Date.format(new Date(), 'Y/m/d')
            editor.maxText = 'Cannot ...'
            editor.disabledDays = [0, 6]
            editor.disabledDaysText = 'Plants are not available on the weekends'
		  	break;

		case 'datetime':
			mField.type = 'date';	        
			mField.dateFormat ='Y-m-D'  // 'timestamp' 

	        vFld['xtype'] = 'datecolumn' 
	        vFld['format'] = 'Y-m-d H:i:s'


			editor.xtype = 'datefield'
			editor.format = 'm/d/y'
	        editor.timeFormat = 'H:i'

            editor.minValue = '01/01/06'
            editor.minText = 'Cannot have a start date before .......!'
            editor.maxValue = Ext.Date.format(new Date(), 'm/d/Y')
            editor.maxText = 'Cannot have a start date after ..........!'
            editor.disabledDays = [0, 6]
            editor.disabledDaysText = 'Not available on the weekends '
            
		  	break;

		case 'time':
			mField.type = 'time';	        

	        vFld['format'] = 'H:i:s'  //  'H:i'

			editor.xtype = 'timefield'
			editor.format = vFld['format']  	

            editor.minValue = '6:00 AM'
            editor.maxValue = '8:00 PM'
            editor.minText = 'Cannot ...'
            editor.maxText = 'Cannot ..'
            
		  	break;
		  	
		  	
		case 'bool':
			mField.type = 'bool';
			vFld['xtype'] = 'checkcolumn'      
            vFld['editMode'] = false 

            editor.xtype = 'checkbox'
            editor.cls = 'x-grid-checkheader-editor'
		  	break;
		  	
		case 'choise':
			// mField.type = 'string';	        
	        // vFld['xtype'] = 'textcolumn'
		
            editor.xtype = 'combobox'
            editor.typeAhead = true
            editor.triggerAction = 'all'
            editor.selectOnTab = true
            editor.store = vFld.choises
            editor.lazyRender = true
            editor.listClass = 'x-combo-list-small'
		  	break;

		case 'foreigntext': 
            editor.xtype = 'protoZoom'
		  	break;

		case 'foreignid': 
            editor.xtype = 'numbercolumn'
           	vFld['hidden']= true

		  	break;
		}

		// Asigna el editor 
        vFld['editor'] = editor; 
		
        myFields.push(mField);
		dict[vFld.name] = vFld
		
    }
    
    
    // Asigna un diccionario con las llaves como clave. 
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
	
	for(var i in oRef)
	{
		if (  overWrite ||  ! oBase[i]  ) {
			if ( !lstProps ||  i in oc(lstProps) ) {
				oBase[i] = oRef[i];
			} 
		}
	}
	return oBase;
}

