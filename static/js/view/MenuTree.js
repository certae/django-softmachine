Ext.define('ProtoUL.view.MenuTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.menuTree',
    requires: [
        'ProtoUL.model.MenuModel',
    ],
    
    rootVisible: false,
    lines: false,
    minWidth: 200,

    initComponent: function() {
        
        this.store = Ext.create('Ext.data.TreeStore', {
    		autoLoad: true,
            model: 'ProtoUL.model.MenuModel',
            root: {
                text:'menu',
                expanded: true,
            },            
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
                this.ownerCt.loadPci( rec.data.id );

            }
        }
        
    },


});