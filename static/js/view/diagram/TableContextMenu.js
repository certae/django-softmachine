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
                itemId: 'btAddConnectorRecursive'
            }, {
                text: 'Add input port',
                itemId: 'btAddInputPort'
            }, {
            	text: 'Add output port',
                itemId: 'btAddOutputPort'
            }, {
                text: 'Remove unused ports',
                itemId: 'btRemoveUnusedPorts'
            }]
        });
        me.callParent(arguments);
    },

    getFigure: function() {
        return this.figure;
    }
});
