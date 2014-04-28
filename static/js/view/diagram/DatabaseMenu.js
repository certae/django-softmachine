Ext.define('ProtoUL.view.diagram.DatabaseMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.databasemenu',

    requires: [
        'Ext.menu.Item'
    ],

    floating: false,
    itemId: 'DatabaseMenu',

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
                    itemId: 'menuManageDiagram',
                    iconCls: 'icon-model',
                    text: 'Manage diagrams',
                }
            ]
        });

        me.callParent(arguments);
    }

});