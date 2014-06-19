Ext.define('ProtoUL.view.diagram.DiagramMainView', {
    extend: 'Ext.window.Window',
    alias: 'widget.diagramMainView',

    requires: ['ProtoUL.view.diagram.DiagramMenu', 'ProtoUL.view.diagram.DiagramCanvas', 'ProtoUL.view.diagram.EntityEditor', 'Ext.panel.Panel'],

    itemId: 'diagramMainView',
    layout: 'border',
    maximizable: true,
    modal: true,
    height: 600,
    width: 1200,
	
	projectID: null,
	diagramID: null,
	
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
                xtype: 'entityeditor',
                region: 'east',
                split: true,
                collapsed: true,
                collapsible: true
            }]
        });
    	me.addEvents(
            'opendiagram'
        );
    	me.on('beforeshow', function(){
    		this.fireEvent('opendiagram');
		});
		
        me.callParent(arguments);
    },
		
    setProjectID: function(id) {
    	this.projectID = id;
    },
    
    getProjectID: function() {
    	return this.projectID;
    },
		
    setDiagramID: function(id) {
    	this.diagramID = id;
    },
    
    getDiagramID: function() {
    	return this.diagramID;
    }
});