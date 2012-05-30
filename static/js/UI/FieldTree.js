/* 
 * 
 */

Ext.define('ProtoUL.UI.FieldTree', {
    extend: 'Ext.container.Container',
    alias: 'widget.fieldTree',
    
/* 
 * @protoOption   Required 
 */

	protoOption : null, 


/* 
 * @myMeta   Required 
 */

	myMeta : null, 

    initComponent: function() {
        
        me = this; 
        
        Ext.define('ProtoUL.FieldModel', {
            extend: 'Ext.data.Model',
            proxy: {
                type: 'ajax',
                method: 'GET',
                url: _PConfig.urlGetFieldTree , 
                
                extraParams : {
                    protoOption : me.protoOption
                },    
                
            }, 
        
            fields: [
                {name: 'id', type: 'string'},
                {name: 'text', type: 'string'},  
                {name: 'fieldType', type: 'string'},  
                {name: 'checked', type: 'boolean'},
                {name: 'leaf', type: 'boolean'}
            ]
            
        });
                
        
		var gridStore = Ext.create('Ext.data.Store', {
		    // storeId:'fieldStore',
		    fields:['id', 'Added','Removed'],
		    data: []
		});        

        ///
        
        
        this.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            model: 'ProtoUL.FieldModel',
            root: {
                text:'fields',
                expanded: true 
            }, 

        	listeners: {
	            // Fires whenever the store reads data from a remote data source. ...
	            load: function ( store, records,  successful,  eOpts ) {
	            	
				    for (var ix in me.myMeta.fields ) {
				        var vFld  =  me.myMeta.fields[ix];
				        var vNode =  me.store.getNodeById( vFld.name ) 

						// El string no es un campos configurable
				        if ( vFld.name == '__str__' )  continue 

						// Lo inserta en la grilla 
	        	    	var idx = gridStore.getCount() + 1;
				        insertNewRecord ( idx, vFld.name, null  ) 

						// Lo marca									        
				        if ( vNode ) vNode.set( 'checked', true ) 

					} 
	            	
	            }
        	}
             
        });
        
    	var tree = Ext.create('Ext.tree.Panel', {
	        store: this.store,
	        useArrows: true,
	        // frame: true,
		    rootVisible: false ,
		    lines: false,
		    minWidth: 200
		   }
		   )


		tree.on({
		    'checkchange': {fn: function (  node,  checked,  eOpts ) {
				var idx = node.get( 'id' )
				addOrRemove( idx, checked )
		    }}, scope: me }
		);

        
        var grid = Ext.create('Ext.grid.Panel', {
            store : gridStore,
            stripeRows: true , 
            columns : [
            	{header: 'fieldName',	dataIndex: 'id', flex : 1  },
                {header: 'added',	dataIndex: 'added', xtype: 'checkcolumnreadonly'},
                {header: 'removed',	dataIndex: 'removed', xtype: 'checkcolumnreadonly'}
                ]
   			}) 
        

        var panelItems =   [{
                region: 'center',
                flex: 1,
                layout: 'fit',
                minSize: 200,
                items: tree 
            }, {
				region: 'east',
			    collapsible: false,
			    collapsed: false ,
			    split: true,
			    flex: 1,
                layout: 'fit',
                minSize: 200,
                items: grid 
			}]
			
        Ext.apply(this, {
            layout: 'border',
            items: panelItems 
        });
			
                
        this.callParent(arguments);
        this.addEvents('menuSelect');
        
        
	    function insertNewRecord( idx, fieldName,  added  ) {
	    	/* 
	    	 * Solo marca como insertados los nuevos registros 
	    	 */
	        var rec = new gridStore.model()
	        rec.data.id = fieldName  
	        rec.data.added = added 

	        gridStore.insert(idx, rec );
	    };
	    
	    function addOrRemove( idx, checked ) {
	    	/* 
	    	 * Marca los registros como adicionados o removidos, 
	    	 * los registros de base no se deben remover, solo se marcan 
	    	 */
	    
	    	var rec = gridStore.getById( idx  )
	    	if ( ! rec  )  {
	    		insertNewRecord( 0, idx,  true  )
	    	} else {
	    		if ( checked && rec.get( 'added') ) 
    				rec.set( 'removed', false   )
    			else rec.set( 'removed', ! checked   )
	    	}
	    	
	    }
        
    }, 


});