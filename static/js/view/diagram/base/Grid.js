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
        header: "NAME",
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
                text: 'Add',
                action: 'add'
            }, {
                iconCls: 'icon-delete',
                text: 'Delete',
                action: 'delete'
            }, {
                iconCls: 'open-file',
                text: 'Open diagram',
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