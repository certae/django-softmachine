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
                    text: _SM.__language.Menu_Update_Diagram,
                },
                {
                	xtype: 'menuseparator'
                },
                {
                    xtype: 'menuitem',
                    itemId: 'menuManageDiagram',
                    iconCls: 'icon-model',
                    text: _SM.__language.Menu_Manage_Diagrams,
                }
            ]
        });

        me.callParent(arguments);
    }

});