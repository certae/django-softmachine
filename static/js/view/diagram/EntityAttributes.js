
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
    // listeners: {
        // 'selectionchange': function(view, records) {
            // grid.down('#btDeleteAttribute').setDisabled(!records.length);
    	// }
	// },
    initComponent: function() {
        var me = this;

		this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
	        clicksToMoveEditor: 1,
	        autoCancel: false
	    });
	    
    	this.plugins = [this.rowEditing];
    	
        Ext.applyIf(me, {
            columns: [
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'text',
                    text: 'Name',
		            editor: {
		                // defaults to textfield if no xtype is supplied
		                allowBlank: false
		            }
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'datatype',
                    text: 'Datatype',
		            editor: {
		                allowBlank: false
		            }
                },
                {
                    xtype: 'checkcolumn',
                    width: 70,
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