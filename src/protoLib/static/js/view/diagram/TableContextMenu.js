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
                text: _SM.__language.Menu_Add_Recursive_Association,
                iconCls: 'table-relationship',
                itemId: 'btAddConnectorRecursive'
            }, {
                text: _SM.__language.Menu_Add_Input_Port,
                iconCls: 'icon-nodeInput',
                itemId: 'btAddInputPort'
            }, {
            	text: _SM.__language.Menu_Add_Output_Port,
            	iconCls: 'icon-nodeInsert',
                itemId: 'btAddOutputPort'
            }, {
                text: _SM.__language.Menu_Remove_Unused_Ports,
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
