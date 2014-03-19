
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

		this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
	        clicksToMoveEditor: 1,
	        autoCancel: false
	    });
	    
    	this.plugins = [this.rowEditing];

		var storeDBTypes = Ext.create('ProtoUL.store.DBTypesStore');

        Ext.applyIf(me, {
            columns: [
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'text',
                    text: 'Name',
		            editor: {
		                allowBlank: false
		            }
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'datatype',
                    text: 'Datatype',
		            editor: {
		            	xtype: 'combo',
			            store: storeDBTypes,
			            displayField: 'typeName',
			            valueField: 'typeName',
			            mode: 'local',
			            selectOnFocus: true,
			            triggerAction: 'all',
		                allowBlank: false
		            }
                },
                {
                    xtype: 'checkcolumn',
                    width: 65,
                    dataIndex: 'unique',
                    text: 'Unique',
		            editor: {
		                xtype: 'checkbox',
		                cls: 'x-grid-checkheader-editor'
		            }
                },
                {
                    xtype: 'checkcolumn',
                    width: 40,
                    dataIndex: 'pk',
                    text: 'PK',
		            editor: {
		                xtype: 'checkbox',
		                cls: 'x-grid-checkheader-editor'
		            }
                }
            ]
        });

		this.dockedItems = [{
            xtype: 'toolbar',
            items: [{
                iconCls: 'icon-tableAdd',
                itemId: 'btAddAttribute',
                text: 'Add',
                action: 'addattribute'
            }, {
                iconCls: 'icon-tableDelete',
                itemId: 'btDeleteAttribute',
                text: 'Delete',
                action: 'deleteattribute'
            }]
        }];
        
        me.callParent(arguments);
    }

});