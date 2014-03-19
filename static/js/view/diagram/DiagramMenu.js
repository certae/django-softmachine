
Ext.define('ProtoUL.view.diagram.DiagramMenu', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.diagramMenu',

    requires: [
        'Ext.menu.Menu',
        'Ext.menu.Item',
        'Ext.button.Button'
    ],

    itemId: 'menuPanel',
    width: 190,
    layout: 'accordion',
    collapseDirection: 'left',
    collapsible: true,
    title: 'Menu',

    initComponent: function() {
        var me = this;

		Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    collapsible: true,
                    title: 'Toolbox',
                    html: '<div data-shape="dbModel.shape.DBTable" class="palette_node_element draw2d_droppable table_div">Table</div>'
                },
                {
                    xtype: 'panel',
                    title: 'Search',
                    items: [
                        {
                            xtype: 'menu',
                            floating: false,
                            itemId: 'menu2',
                            items: [
                                {
                                    xtype: 'menuitem',
                                    text: 'Menu Item'
                                },
                                {
                                    xtype: 'menuitem',
                                    text: 'Menu Item'
                                },
                                {
                                    xtype: 'menuitem',
                                    text: 'Menu Item'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});