
Ext.define('ProtoUL.view.diagram.EntityAttributes', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.entityattributes',

    requires: [
        'Ext.grid.column.CheckColumn',
        'Ext.grid.column.Boolean',
        'Ext.grid.View'
    ],
	itemId: 'entityattributes',
    title: 'Attributes',
    store: 'EntityAttributeStore',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            columns: [
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'name',
                    text: 'Name'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'datatype',
                    text: 'Datatype'
                },
                {
                    xtype: 'checkcolumn',
                    width: 70,
                    dataIndex: 'unique',
                    text: 'Unique'
                },
                {
                    xtype: 'checkcolumn',
                    width: 40,
                    dataIndex: 'pk',
                    text: 'PK'
                }
            ]
        });

        me.callParent(arguments);
    }

});