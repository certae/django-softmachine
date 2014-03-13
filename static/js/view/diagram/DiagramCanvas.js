
Ext.define('ProtoUL.view.diagram.DiagramCanvas', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.canvas',
	
	requires: [
        'ProtoUL.view.diagram.DiagramToolbar',
        'Ext.toolbar.Toolbar'
    ],
    
    itemId: 'contentPanel',
    autoScroll: true,
    baseCls: 'container',
    bodyCls: 'canvas',
    html: '<div id="canvas" class="" style="width:1500px; height:1500px;-webkit-tap-highlight-color: rgba(0,0,0,0); "></div>',
    header: false,
 	listeners: {
        afterrender: function() {

			this.view = new dbModel.View('canvas');
            // unmarshal the JSON document into the canvas
            // (load)
            var reader = new draw2d.io.json.Reader();
            reader.unmarshal(this.view, jsonDocument);

			this.view.addSelectionListener(this.dockedItems.items[0]);
			this.view.getCommandStack().addEventListener(this.dockedItems.items[0]);
            // display the JSON document in the preview DIV
            //
            //displayJSON(app.getView());

            // add an event listener to the Canvas for change notifications.
            // We just dump the current canvas document into the DIV
            //
            // app.getView().getCommandStack().addEventListener(function(e) {
                // if (e.isPostChangeEvent()) {
                    // displayJSON(app.getView());
                // }
            // });
        }
    },
    initComponent: function() {
        var me = this;
        
		Ext.applyIf(me, {
            dockedItems: [
                {
                    xtype: 'diagramtoolbar',
                    dock: 'top'
                }
            ]
        });

        me.callParent(arguments);
    }

});