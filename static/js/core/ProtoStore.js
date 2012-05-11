/* 
 * Clase generica para el manejo del Store

Ext.define('ProtoUL.core.ProtoStore', {
    extend: 'Ext.data.Store',

 * El manejo de la clase tiene un problema interno: 
 * en grid.store.data  mantiene la definicion del primer store cargado,
 * mientras q en grid.store.raw tiene los datos correctos,
 * 
 * solucion: una funcion q retorne el store definido   
 * 
 */

function getStoreDefinition(  storeDefinition  ){ 

	// En la definicion como clase 
    // initComponent: function() {
        // this.sorters = me.sorters || [{ property: 'xx', direction: 'ASC' }]
        // this.idProperty = 
        // me.fields = 
        // this.callParent(arguments);
    // }, 
	
	var me = storeDefinition;
	 
	var myStore = Ext.create('Ext.data.Store', {
        // model : me.model,
        model: _PConfig.clsBaseModel + me.modelName,  
        autoLoad: me.autoLoad,
	    pageSize: me.pageSize,
	    sorters: me.sorters,    

	    remoteSort: true,
	    autoSync: false, 

	    proxy: {
	        type: 'ajax',
	        batchActions : true, 
	        batchOrder : "create,update,destroy", 
	        api: {
	        	 read :   'protoExt/protoList/',
	             create:  'protoExt/protoAdd/',
	             update:  'protoExt/protoUpd/',
	             destroy: 'protoExt/protoDel/'
	         },
	
	        reader: {
	            type: 'json',
	            root: 'rows',
	            successProperty: 'success',
	            totalProperty: 'totalCount',
	            messageProperty: 'message'
	        },

	        writer: {
	            type: 'json',
	            root: 'rows', 
	            allowSingle: false, 
	            writeAllFields: true,
	            encode: false
	        },

            extraParams : {
                protoConcept : me.protoConcept,
                protoFilter : me.protoFilter,
                protoFilterBase: me.protoFilterBase, 
                storeFields  : me.storeFields
			},	

	        listeners: {
	            'load' :  function(store,records,options) {
	            	this.loaded = true
	            },
	            'exception': function(proxy, response, operation){
					var msg = operation.request.scope.reader.jsonData["message"] ;
	            	var msg = operation.getError();
					var title =   'REMOTE EXCEPTION'            	
	            	Ext.outils.msg( title ,  msg ); 
	            } 
	        },
	         
	        afterRequest: function( request, success ){
				var title =   'afterRequest ' +  success.toString();             	
				var msg = request.method + '.' + request.action ;
	    		var jsData = request.scope.reader.jsonData;
	        	if ( jsData["message"] ) {
	        		msg += '  :' + jsData["message"]
	        	}
	        	Ext.outils.msg( title ,  msg ); 
	        } 
	        
        }, 

    	listeners: {
    	
	 		// Fired when a Model instance has been added to this Store ...
			add: function ( store, records,  index,  eOpts ) {
				// var msg = 'add';
			}, 
	 
			// Fires before a request is made for a new data object. ...
			beforeload: function(  store,  operation,  eOpts ) {
				// var msg = 'beforeload';
			},
	 
			// Fired before a call to sync is executed. Return false from any listener to cancel the synv
			beforesync: function(  options,  eOpts ) {
				// var msg = 'beforesync';
			},
	
			//  Fires before a prefetch occurs. Return false to cancel.
			beforeprefetch: function ( store, operation, eOpts ) {
				// var msg = 'beforesync';
			}, 
			
			// Fires whenever records have been prefetched
			prefetch: function ( store, records, successful, operation,  eOpts ) {
				// var msg = 'beforesync';
			}, 
	
			// Fired after the removeAll method is called. ...
			clear: function ( store,  eOpts ) {
				// var msg = 'clear';
			},
	 
			// Fires whenever the records in the Store have changed in some way - this could include adding or removing records, or ...
			datachanged: function( store,  eOpts ) {
				// var msg = 'datachanged';
			},
			 
			// Fires whenever the store reads data from a remote data source. ...
			load: function ( store, records,  successful,  eOpts ) {
				// var msg = 'load';
			},
			 
			// Fired when a Model instance has been removed from this Store ...
			remove: function (  store,  record,  index,  eOpts ) {
				// var msg = 'remove';
			},
			 
			// Fires when a Model instance has been updated ...\    	
			update: function ( store,  record,  sOperation,  eOpts ) {
				// var msg = 'update';		 
			},  
	    	
	    	// Fires whenever a successful write has been made via the configured Proxy 
	        write: function(store, operation, eOpts ){

				for ( var ix in operation.records ) {
					var recResult = operation.resultSet.records[ix]
					var recOrigin = operation.records[ix]
	
					// Si existe un resultSet 
					if ( recResult ) {

						if (operation.action == 'create') {
			            	//Cuando son varios inserts, Extjs no es capaz hacer la actualizacion de los registros.
			            
			            	// Copia la data resultado sobre la data de base 
			            	// Tengo un campo para mandar el Id, para efectos de control, podria ser elimiando en la prox version  
							recOrigin.data = recResult.data 
	
						} // End create  
					
						else if  (operation.action == 'destroy') {
			            	//Dgt:  Restaura los registros q no pudieron ser borrados, ie Integridad referencial    
							if ( recResult.data._ptStatus != '' ) store.insert(0, recResult);
						} // En Delete
										
					} 
				
					// Marca los registros segun el estado 
	        		var stRec = recOrigin.get('_ptStatus');
					if ( stRec ) { 
						recOrigin.dirty = true;
						if ( ! recOrigin.getId()  ) recOrigin.phantom = true;
					}   		        		

				} // End for
	
	        } // End Event 
	    }

    })
        
    myStore.proxy.actionMethods.read = 'POST';
	return myStore

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
            
            //TODO:  useNull : true / false    ( NullAllowed, IsNull,  NotNull )
        };


		// Determina el xType y otros parametros 
		switch( vFld.type )
		{
		case 'decimal':
			mField.type = 'number';	        
		  	break;
		case 'date':
			mField.type = 'date';	        
			mField.dateFormat ='Y-m-d' 
		  	break;
		case 'datetime':
			mField.type = 'date';	        
			mField.dateFormat ='Y-m-d H:i:s'  // 'timestamp' 
		  	break;
		case 'time':
			mField.type = 'date';	        
			mField.dateFormat ='H:i:s'  
		  	break;
		}

		// Asigna el modelo y el diccionario 
        myFields.push(mField);
		dict[vFld.name] = vFld

    }
    
    
    // Asigna un diccionario con las llaves como clave  
	myMeta.dict = dict

	
	// Agrega el status y el interna ID 
    var mField = { name: '_ptStatus', type: 'string' };
    myFields.push(mField);

    var mField = { name: '_ptId', type: 'string' };
    myFields.push(mField);


    // myFields = [{"name":"id","type":"int","useNull":true},{"name":"first","type":"string"}]
    Ext.define(modelClassName, {
        extend: 'Ext.data.Model',
            fields: myFields 
            
		//TODO: Validation, Validaciones             
		//    validations: [{
		//        type: 'length',
		//        field: 'name',
		//        min: 1
		//    }]

        });
        
}


function getColDefinition( vFld ) {
	//TODO:  Cargar las propiedades del modelo 

    if (!vFld.header ) vFld.header = vFld.name
	colDefinition = {
            dataIndex: vFld.name,
            text: vFld.header 
	}

	var lstProps = ['flex',  'width', 'minWidth', 'sortable',
					// 'hidden',  
					'xtype', 'editMode', 'readOnly', 
					'render', 'align', 'format', 'tooltip'
					]

	colDefinition = copyProps ( colDefinition,  vFld, true, lstProps )
    if ( vFld.wordWrap == true ) colDefinition.renderer = columnWrap
    
    
    // Agrega un tool tip con el contenido de la celda
    if ( vFld.cellToolTip ) colDefinition.renderer = cellToolTip

    // Formatea el contenido como un hiperLink, TODO: la logica debe estar en otra propiedad
    if ( vFld.cellLink ) colDefinition.renderer = cellLink

    // Maneja los subtipos 
    if ( vFld.subType ) {
    	// subType stopLigth  Maneja el codigo de colores para un semaforo con 3 indicadores, 2 limites Red-Yellow; Yellow-Green   
		if ( vFld.subType == 'stopLight' ) colDefinition.renderer = cellStopLight

    } 

	
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
        'disabledDays', 'disabledDaysText',   	// [0, 6]
        
        //@zoomModel : Contiene el modelo del FK, se carga automaticamente 
        'zoomModel', 
        
		//@fkId : Llave correspondiente al zoom          
        'fkId', 
        
         // @zoomView : TODO: Contiene un GridView ( app.model.gridView ) utilizado para los campos del zoom  
         // esto se pega al nombre la entidad para obtner la vista 
        'zoomView', 

        //@zoomFilter : TODO: Filtro de base fijo para el zoom ( puede venir definido en zoomView )
        'zoomFilter', 

        //@zoomReturn : TODO: Campos q sera heredados a la entidad base  
        'zoomReturn'
		]
    editor = copyProps ( {},  vFld, true, lstProps )

	//TODO: subType ( eMail, IpAdress, etc ... )
    // editor.vtype = 'email'


	// Determina el xType y otros parametros 
	if ( ! vFld.type )  vFld.type = 'string'
	switch( vFld.type )
	{
	case 'string':
        if ( ! colDefinition.flex  ) colDefinition.flex = 1 
	  	break;

	case 'text':
        if ( ! colDefinition.flex  ) colDefinition.flex = 2 
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
        colDefinition['xtype'] = 'datecolumn' 
        colDefinition['format'] = 'H:i'  //  'H:i:s'

		editor.xtype = 'timefield'
		editor.format = colDefinition['format']  	
	  	break;
	  	
	  	
	case 'bool':
		colDefinition['xtype'] = 'checkcolumnreadonly'      
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
        if ( ! colDefinition.flex  ) colDefinition.flex = 1 

		colDefinition.renderer = cellLink
        editor.xtype = 'protoZoom'
        editor.editable  = false 
	  	break;

	case 'foreignid':
		// El zoom id debe estar oculto  
       	colDefinition['hidden']= true
        editor.xtype = 'numberfield'
	  	break;

	}


	// Asigna las coleccoiones de presentacion
	// El foreignid puede ser editable directamente, 
	if (  vFld.type in oc([ 'autofield' ]) || vFld.readOnly  ) 
	 	colDefinition.renderer = cellReadOnly
	else  colDefinition['editor'] = editor; 

	return colDefinition; 

	//  
	function columnWrap(value){
        return '<div style="white-space:normal; text-align:justify !important";>' + value + "</div>";
  	};

  	function cellToolTip(value, metaData, record, rowIndex, colIndex, store, view ){
    	metaData.tdAttr = 'data-qtip="' + value + '"';
        return value;
	}; 

  	function cellReadOnly(value, metaData, record, rowIndex, colIndex, store, view ){
        return '<span style="color:grey;">' + value + '</span>';
	}; 

  	function cellLink(value, metaData, record, rowIndex, colIndex, store, view ){
        return '<a href="#">'+value+'</a>';  	
  	}

  	function cellStopLight(value, metaData, record, rowIndex, colIndex, store, view ){
	//TODO: Leer las propiedades stopLightRY y  stopLightYG  para comparar,  

    // subType stopLigth  Maneja el codigo de colores para un semaforo con 3 indicadores, 
    // stopLightRY : valor limite  de Rojo a Amarillo
    // stopLightYG : valor limite  de Amarillo a Verde
    // si el valor RY > YG se asume una secuencia inversa. 
    // los valores son comparados estrictamente mayor  X > RY -->  Y   

	//
        var cssPrefix = Ext.baseCSSPrefix
        var cls = [];

        if (value > 66 ) {
            cls.push(cssPrefix + 'grid-stopligth-green');
        } else if (value > 33 ) {
            cls.push(cssPrefix + 'grid-stopligth-yellow');
        } else if (value > 0 ) {
            cls.push(cssPrefix + 'grid-stopligth-red');
        }  
      
		//TODO: Probar <span>  en vez de <div> 
        // return '<span style="color:green;">' + val + '</span>';
        
        return '<div class="' + cls.join(' ')  + '">&#160;' +  value + '</div>';
  	}



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


function loadPci( modelName, loadIfNot, options) {

        options = options || {};
        
        var modelClassName = _PConfig.clsBaseModel + modelName ; 
        
        if  ( Ext.ClassManager.isCreated( modelClassName )){

			return true

		} else { 
			
			// Solo retorna algo cuando se usa para evaluar 
			if ( ! loadIfNot ) return false 

	        // DGT: reemplazar las funciones  
	        Ext.applyIf(options, {
	            scope: this,
	            success: Ext.emptyFn,
	            failure: Ext.emptyFn
	        });
        
        
	        Ext.Ajax.request({
                method: 'GET',
                url: _PConfig.urlProtoDefinition  ,
                params : { 
                    protoConcept : modelName 
                    },
	            scope: this,
	            success: function(result, request) {
	            	
	                var myResult = Ext.decode( result.responseText );
	                _cllPCI[ modelName ]  = myResult.metaData;  
	                DefineProtoModel( myResult.metaData , modelClassName  );

                    options.success.call( options.scope, result, request);
	            },
	            failure: function(result, request) {
	                options.failure.call(options.scope, result, request);
	            }
	        })
	        
	        // 
	        return false 
	        
        }  
        
}



