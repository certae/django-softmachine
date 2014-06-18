/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.view.diagram.base.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.diagramgrid',

    requires: ['Ext.toolbar.Paging'],

    iconCls: 'icon-grid',
    itemId: 'diagramgrid',

    store: 'Diagrams',
    header: false,

    columns: [{
        header: "ID",
        width: 20,
        dataIndex: 'id'
    }, {
        header: _SM.__language.GridColumn_Name,
        flex: 1,
        dataIndex: 'code'
    }],
    
    listeners: {
        select: {
            fn: function(){ 
                var btOpenDiagram = this.down('button[itemId=btOpenDiagram]');
                btOpenDiagram.setDisabled(false);
            }
        }
    },

    initComponent: function() {
        this.dockedItems = [{
            xtype: 'toolbar',
            items: [{
                iconCls: 'icon-save',
                text: _SM.__language.Text_Add_Button,
                action: 'add'
            }, {
                iconCls: 'icon-delete',
                text: _SM.__language.Text_Delete_Button,
                action: 'delete'
            }, {
                iconCls: 'open-file',
                text: _SM.__language.Text_OpenDiagram_Button,
                action: 'openselecteddiagram',
                itemId: 'btOpenDiagram',
                disabled: true
            }]
        }, {
            xtype: 'pagingtoolbar',
            dock: 'top',
            store: 'Diagrams',
            displayInfo: true,
            displayMsg: 'Showing Diagrams {0} - {1} of {2}',
            emptyMsg: "No diagram found.",
            listeners: {
                afterrender : function() {
                    this.child('#refresh').hide();
                }
            }
        }];
        this.callParent(arguments);
    }
}); 