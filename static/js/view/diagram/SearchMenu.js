Ext.define('ProtoUL.view.diagram.SearchMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.searchmenu',

    requires: [
        'Ext.menu.Item'
    ],

    floating: false,
    itemId: 'SearchMenu',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'menuitem',
                	itemId: 'syncDiagramFromDB',
                	iconCls: 'get-from-DB',
                    text: 'Synchronyze diagram',
                },
                {
                    xtype: 'menuitem',
                    itemId: 'getAllTables',
                    iconCls: 'find-table',
                    text: 'Add table from DB',
                },
                {
                	xtype: 'menuseparator'
                },
                {
                    xtype: 'menuitem',
                    itemId: 'menuCreateDiagram',
                    iconCls: 'icon-pclDetails',
                    text: 'New diagram',
                },
                {
                    xtype: 'menuitem',
                    itemId: 'menuOpenDiagram',
                    iconCls: 'open-file',
                    text: 'Open diagram',
                }
            ]
        });

        me.callParent(arguments);
    }

});