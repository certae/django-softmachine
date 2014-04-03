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
                    itemId: 'getJSONTable',
                    text: 'Add table from DB',
                },
                {
                    xtype: 'menuitem',
                    itemId: 'getAllTables',
                    text: 'Add all tables from Project',
                }
            ]
        });

        me.callParent(arguments);
    }

});