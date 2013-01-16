Ext.define('Isecure.view.Core.VisPrincipal', {
    extend: 'Ext.container.Viewport',
    autoRender: true,
    alias: 'widget.visprincipal',
    layout: {
        type: 'border'
    },

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                
                {
                    xtype: 'panel',
                    bodyCls: "background-SM",
                    region: 'center'
                   

                }

            ]
        });

        me.callParent(arguments);
    }

});