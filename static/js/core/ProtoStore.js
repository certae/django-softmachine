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
	
	var me = storeDefinition;
	 
	var myStore = Ext.create('Ext.data.Store', {
        model : me.model, 
        autoLoad: me.autoLoad,
	    pageSize: me.pageSize,
	    sorters: me.sorters,    

	    remoteSort: true,
	    autoSync: false, 

	    proxy: {
	        type: 'ajax',
	        batchActions : true, 
	        batchOrder : "create,update,destroy", 
	        url : 'protoExt/protoList/', 
	
	        // api: {
	        	// read :   'protoExt/protoList/',
	            // create:  'protoExt/protoAdd/',
	            // update:  'protoExt/protoUpd/',
	            // destroy: 'protoExt/protoDel/'
	        // },
	
	        reader: {
	            type: 'json',
	            root: 'rows',
	            successProperty: 'success',
	            totalProperty: 'totalCount',
	            messageProperty: 'message'
	        },

            extraParams : {
                protoConcept : me.protoConcept,
                protoFilter : me.protoFilter,
                protoFilterBase: me.protoFilterBase, 
                storeFields  : me.storeFields
			},	

	        writer: {
	            type: 'json',
	            root: 'rows', 
	            allowSingle: false, 
	            writeAllFields: false,
	            encode: false
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
				var msg = 'add';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			}, 
	 
			// Fires before a request is made for a new data object. ...
			beforeload: function(  store,  operation,  eOpts ) {
				var msg = 'beforeload';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
	 
			// Fired before a call to sync is executed. Return false from any listener to cancel the synv
			beforesync: function(  options,  eOpts ) {
				var msg = 'beforesync';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
	
			// Fired after the removeAll method is called. ...
			clear: function ( store,  eOpts ) {
				var msg = 'clear';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
	 
			// Fires whenever the records in the Store have changed in some way - this could include adding or removing records, or ...
			datachanged: function( store,  eOpts ) {
				var msg = 'datachanged';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
			 
			// Fires whenever the store reads data from a remote data source. ...
			load: function ( store, records,  successful,  eOpts ) {
				var msg = 'load';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
			 
			// Fired when a Model instance has been removed from this Store ...
			remove: function (  store,  record,  index,  eOpts ) {
				var msg = 'remove';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},
			 
			// Fires when a Model instance has been updated ...\    	
			update: function ( store,  record,  sOperation,  eOpts ) {
				var msg = 'update';
				var title =   'Event: '            	
		    	Ext.outils.msg( title ,  msg ); 
			},  
	    	
	    	// Fires whenever a successful write has been made via the configured Proxy 
	        write: function(store, operation, eOpts ){
				var title =   'Event:';            	
				var msg = 'write ' + operation.action + ' ' + operation.resultSet.message ;   
	
	            /* Lee todos los registros 
				for ( var ix in operation.resultSet.records ) {
					var record = operation.resultSet.records[ix]
					
					if ((operation.action == 'destroy') && ( record.data._ptStatus != '' )) {
	        			// record = Ext.create('Writer.Person');
	        			// record.set(record.data);
	                    store.insert(0, record);
					};
					
		            msg = msg + ' - ' + Ext.String.format("Reg: {0}", record.getId()); 
				} */
	
	            var record = operation.records[0]
	            var op = Ext.String.capitalize(operation.action)
	                
	            msg = msg + ' - ' + Ext.String.format("{0} user: {1}", op, record.getId()); 
	            Ext.outils.msg(title, msg );
	        }
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




// En la definicion como clase 

    // initComponent: function() {
        // this.sorters = me.sorters || [{ property: 'xx', direction: 'ASC' }]
        // this.idProperty = 
        // me.fields = 
        // this.callParent(arguments);
    // }, 
