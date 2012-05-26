Ext.define('ProtoUL.UI.FieldTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.fieldTree',
    
    rootVisible: false ,
    lines: false,
    minWidth: 200,

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
				        
				        if ( vNode ) vNode.set( 'checked', true ) 

					} 
	            	
	            }
        	}
             
        });
        
        this.callParent(arguments);
        this.addEvents('menuSelect');
    }, 

    listeners: {
        
        // .view.View , .data.Model record, HTMLElement item, Number index, .EventObject e, Object eOpts
        'itemclick': function( view, rec, item, index, evObj , eOpts ) {
            if ( rec.get('leaf') ) {
                // console.log( view, rec )
                this.fireEvent('menuSelect', this, rec.data.id);

            }
        }
        
    }

});