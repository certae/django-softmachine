/* Clase generica para el manejo del Store 
 * 
 */

Ext.define('ProtoUL.core.ProtoStore', {
    extend: 'Ext.data.Store',
    remoteSort: true,
    autoSync: false, 

    model: modelClassName, 
    autoLoad: {start: 0, limit: 35},
    autoLoad: lAutoLoad,
    pageSize: _PAGESIZE,
    sorters: pSorters,   // [{ property: 'xx', direction: 'ASC' },],

    initComponent: function() {
        var me = this
        me.sorters = me.sorters || [{
            property: calendarData.CalendarMappings.Title.name,
            direction: 'ASC'
        }];
        // me.idProperty = me.idProperty || calendarData.CalendarMappings.CalendarId.name || 'id';
        // me.fields = calendarData.CalendarModel.prototype.fields.getRange();
        me.callParent(arguments);
    }, 

    proxy: {
        type: 'ajax',
        batchActions : true, 
        batchOrder : "create,update,destroy", 
        url : 'protoExt/protoList/', 
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
            writeAllFields: false,
            encode: false
        },
        
        extraParams : {
            protoConcept : this.protoConcept,
            protoFilter : myFilter,
            protoFilterBase: this.protoFilterBase, 
            storeFields  : myMeta.storeFields.toString()
        },

        listeners: {
            'load' :  function(store,records,options) {
                this.loaded = true;
            },

            'exception': function(proxy, response, operation){
//				var msg = operation.request.scope.reader.jsonData["message"] ;
            	var msg = operation.getError();
				var title =   'REMOTE EXCEPTION'            	
            	Ext.outils.msg( title ,  msg ); 
            } 
             
        },

        afterRequest:function( request, success ){
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

            /* Ver de q se trata este pedazo
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
    
    
});