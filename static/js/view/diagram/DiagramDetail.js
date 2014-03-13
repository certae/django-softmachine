
Ext.define('ProtoUL.view.diagram.DiagramDetail', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.diagramDetail',

    width: 200,
    collapsed: true,
    collapsible: true,
    title: 'Detail',

    initComponent: function() {
        var me = this;

        me.callParent(arguments);
    }

});