Ext.define('ProtoUL.view.diagram.DiagramMainView', {
    extend: 'Ext.window.Window',
    alias: 'widget.diagramMainView',

    requires: ['ProtoUL.view.diagram.DiagramMenu', 'ProtoUL.view.diagram.DiagramCanvas', 'ProtoUL.view.diagram.DiagramDetail', 'Ext.panel.Panel'],

    itemId: 'diagramMainView',
    layout: 'border',
    maximizable: true,
    height: 600,
    width: 1200,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                xtype: 'diagramMenu',
                region: 'west',
                split: true,
                collapsible: true
            }, {
                xtype: 'canvas',
                flex: 1,
                region: 'center'
            }, {
                xtype: 'diagramDetail',
                region: 'east',
                split: true,
                collapsible: true
            }]
        });

        me.callParent(arguments);
    }
});