Ext.define('ProtoUL.UI.FieldTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.fieldTree',
    
    rootVisible: true,
    lines: false,
    minWidth: 200,

    initComponent: function() {
    	
		Ext.define('ProtoUL.FieldModel', {
		    extend: 'Ext.data.Model',
		    proxy: {
		        method: 'POST',
		        type: 'ajax',
		        url: _PConfig.urlMenu  
		    }, 
		
		    fields: [
		        {name: 'id', type: 'string'},
		        {name: 'text', type: 'string'},
		        {name: 'leaf', type: 'boolean'}
		    ]
		    
		});
		    	
        
        this.store = Ext.create('Ext.data.TreeStore', {
    		autoLoad: true,
            model: 'ProtoUL.MenuModel',
            root: {
                text:'menu',
                expanded: true 
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
                this.ownerCt.loadPciFromMenu( rec.data.id );

            }
        }
        
    }


});