
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

            var reader = new draw2d.io.json.Reader();
            reader.unmarshal(this.view, jsonDocument);

			var toolbar = this.getComponent('diagramtoolbar');
			this.view.addSelectionListener(toolbar);
			this.view.getCommandStack().addEventListener(toolbar);
			
			var editPanel = this.ownerCt.getComponent('entityeditor');
			this.view.addSelectionListener(editPanel);
			
			this.view.getCommandStack().addEventListener(editPanel);
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
    },
    
    reload: function() {
    	this.view.clear();
    	
    	var reader = new draw2d.io.json.Reader();
        reader.unmarshal(this.view, jsonDocument);
    },
    
    getView: function() {
    	return this.view;
    }

});