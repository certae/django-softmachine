/**
 * @author Giovanni Victorette
 */

Ext.define('ProtoUL.view.diagram.TableContextMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.tablecontextmenu',

    figure: null,

    itemId: 'tablecontextmenu',
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                text: 'Add recursive association',
                iconCls: 'table-relationship',
                itemId: 'btAddConnectorRecursive'
            }, {
                text: 'Add input port',
                iconCls: 'input-port',
                itemId: 'btAddInputPort'
            }, {
            	text: 'Add output port',
            	iconCls: 'output-port',
                itemId: 'btAddOutputPort'
            }, {
                text: 'Remove unused ports',
                iconCls: 'icon-nodeDelete',
                itemId: 'btRemoveUnusedPorts'
            }]
        });
        me.callParent(arguments);
    },

    getFigure: function() {
        return this.figure;
    }
});
