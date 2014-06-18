Ext.define('ProtoUL.view.searchmodel.SearchBottomBar', {
	extend: 'Ext.toolbar.Toolbar',
	alias: 'widget.searchgridbbar',
    items: [
        {
            xtype: 'tbtext', 
            text: '',
            itemId: 'bbarDefaultText'
        },
        '->',
        { 
        	xtype: 'button', 
        	text: 'Add', 
        	itemId: 'btAddTableFromSearchBar',
			iconCls: 'icon-add'
        }, 
        { 
        	xtype: 'button', 
        	text: 'Cancel', 
        	itemId: 'btCancelSearchBar',
        	iconCls: 'icon-close'
        } 
    ]
});