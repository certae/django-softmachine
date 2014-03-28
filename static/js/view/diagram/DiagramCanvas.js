
Ext.define('ProtoUL.view.diagram.DiagramCanvas', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.canvas',
	
	requires: [
        'ProtoUL.view.diagram.DiagramToolbar',
        'Ext.toolbar.Toolbar'
    ],
    
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
			items: [
				{
					xtype: 'panel',
				    baseCls: 'container',
				    bodyCls: 'canvas',
					html: '<div id="canvas" class="" style="width:1500px; height:1500px;-webkit-tap-highlight-color: rgba(0,0,0,0); "></div>'
				}
			],
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
    	var me = this;
    	me.view.clear();
    	
    	var reader = new draw2d.io.json.Reader();
        reader.unmarshal(me.getView(), jsonDocument);
        
        var toolbar = me.getComponent('diagramtoolbar');
		me.view.addSelectionListener(toolbar);
		me.view.getCommandStack().addEventListener(toolbar);
		
		var editPanel = me.ownerCt.getComponent('entityeditor');
		me.view.addSelectionListener(editPanel);
		
		me.view.getCommandStack().addEventListener(editPanel);
		
		me.view.figures.each(function(i, figure) {
			figure.addContextMenuListener(me);
		});
		
		me.view.lines.each(function(i, connection) {
			// TODO add listener.
		});
    },
    
    getView: function() {
    	return this.view;
    },
    
    onContextMenu: function(figure, x, y) {
    	var me = this;
    	if (typeof figure.sourcePort === "undefined") {
			var tableContextMenu = Ext.create('ProtoUL.view.diagram.TableContextMenu', {
            	figure: figure
        	});
        	tableContextMenu.showAt(x + me.getEl().getX(),y + me.getEl().getY());
		} else {
			console.log("Connection");
		}
    },

});