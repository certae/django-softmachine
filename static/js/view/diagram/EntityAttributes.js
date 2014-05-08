Ext.define('ProtoUL.view.diagram.EntityAttributes', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.entityattributes',

    requires: ['Ext.grid.column.CheckColumn', 'Ext.grid.column.Boolean', 'Ext.grid.View'],
    itemId: 'entityattributes',
    title: _SM.__language.Title_Attributes,
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
            columns: [{
                xtype: 'gridcolumn',
                dataIndex: 'text',
                text: _SM.__language.GridColumn_Name,
                editor: {
                    allowBlank: false
                }
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'datatype',
                text: _SM.__language.GridColumn_Datatype,
                width: 75,
                editor: {
                    xtype: 'combo',
                    store: storeDBTypes,
                    displayField: 'typeName',
                    valueField: 'typeID',
                    queryMode: 'local',
                    selectOnFocus: true,
                    triggerAction: 'all',
                    allowBlank: false
                }
            }, {
                xtype: 'checkcolumn',
                width: 35,
                dataIndex: 'pk',
                text: 'PK',
                editor: {
                    xtype: 'checkbox',
                    cls: 'x-grid-checkheader-editor'
                }
            }, {
                xtype: 'checkcolumn',
                width: 35,
                dataIndex: 'fk',
                text: 'FK',
                editor: {
                    xtype: 'checkbox',
                    cls: 'x-grid-checkheader-editor'
                }
            }, {
                xtype: 'checkcolumn',
                width: 55,
                dataIndex: 'isRequired',
                text: _SM.__language.GridColumn_Required,
                editor: {
                    xtype: 'checkbox',
                    cls: 'x-grid-checkheader-editor'
                }
            }, {
                xtype: 'checkcolumn',
                width: 35,
                dataIndex: 'isNullable',
                text: 'Null',
                editor: {
                    xtype: 'checkbox',
                    cls: 'x-grid-checkheader-editor'
                }
            }]
        });

        this.dockedItems = [{
            xtype: 'toolbar',
            items: [{
                iconCls: 'icon-tableAdd',
                itemId: 'btAddAttribute',
                text: _SM.__language.Text_Add_Button,
                action: 'addattribute'
            }, {
                iconCls: 'icon-tableDelete',
                itemId: 'btDeleteAttribute',
                text: _SM.__language.Text_Delete_Button,
                action: 'deleteattribute'
            }, '->', 
            {
            	iconCls: 'icon-panelDown',
            	itemId: 'btMoveDown',
            	handler: function(btn,event) {
                    var grid = btn.up('grid');
                    grid.moveSelectedRow(grid, -1);
               },
               disabled: true
            }, 
            {
            	iconCls: 'icon-panelUp',
            	itemId: 'btMoveUp',
            	handler: function(btn,event) {
                    var grid = btn.up('grid');
                    grid.moveSelectedRow(grid, 1);
               },
               disabled: true
            }]
        }];

        me.callParent(arguments);
    },
    
    listeners: {
        select: {
            fn: function(){ 
                var btMoveDown = this.down('button[itemId=btMoveDown]');
                btMoveDown.setDisabled(false);
                var btMoveUp = this.down('button[itemId=btMoveUp]');
                btMoveUp.setDisabled(false);
            }
        }
    },
    
    moveSelectedRow: function(grid, direction) {
        var record = grid.getSelectionModel().getSelection();
        if (!record) {
            return;
        }
        var store = grid.getStore();
        var index = grid.getStore().indexOfId(record[0].internalId);
        if (direction > 0) {
            index--;
            if (index < 0) {
                return;
            }
        } else {
            index++;
            if (index >= grid.getStore().getCount()) {
                return;
            }
        }
        grid.getStore().remove(record);
        grid.getStore().insert(index, record);
        grid.getSelectionModel().select(record);
    }
}); 