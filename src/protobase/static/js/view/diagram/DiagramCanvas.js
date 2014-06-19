(function() {
    // Get a reference to the original function.
    var origHide = Ext.menu.Menu.prototype.hide;

    // That's beyond ugly, but I had to write this to get the menu working on IE.
    Ext.override(Ext.menu.Menu, {
        hide: function() {
            origHide.apply(this, arguments);
        }
    });
})();

Ext.define('ProtoUL.view.diagram.DiagramCanvas', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.canvas',

    requires: ['ProtoUL.view.diagram.DiagramToolbar', 'Ext.toolbar.Toolbar'],

    itemId: 'contentPanel',
    autoScroll: true,
    header: false,
    listeners: {
        afterrender: function() {
            this.view = new dbModel.View('canvas');
            this.reload();
        }
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                xtype: 'panel',
                baseCls: 'container',
                bodyCls: 'canvas',
                html: '<div id="canvas" class="" style="width:1500px; height:1500px;-webkit-tap-highlight-color: rgba(0,0,0,0); "></div>'
            }],
            dockedItems: [{
                xtype: 'diagramtoolbar',
                dock: 'top'
            }]
        });
        me.callParent(arguments);
    },

    reload: function() {
        var me = this;
        me.view.clear();

        var reader = new draw2d.io.json.Reader();
        reader.unmarshal(me.getView(), jsonDocument);

        var toolbar = me.getComponent('diagramtoolbar');
        me.view.addSelectionListener(toolbar);
        me.view.getCommandStack().addEventListener(toolbar);

        var controller = ProtoUL.app.getController('DiagramController');
        me.view.addSelectionListener(controller);

        me.view.figures.each(function(i, figure) {
            figure.addContextMenuListener(me);
            figure.addOnDropConnectionListener(controller);
        });

        // TODO add listener.
        // me.view.lines.each(function(i, connection) {
        // });
    },

    getView: function() {
        return this.view;
    },

    onContextMenu: function(figure, x, y) {
        var me = this;
        if ( typeof figure.sourcePort === "undefined") {
            var tableContextMenu = Ext.create('ProtoUL.view.diagram.TableContextMenu', {
                figure: figure
            });
            if ( typeof window.event !== "undefined") {
                tableContextMenu.showAt(window.event.clientX, window.event.clientY);
            } else {
                tableContextMenu.showAt(x, y);
            }
        } else {
            // TODO add listener.
            console.log("Connection");
        }
    }
});
