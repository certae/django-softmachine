Ext.define('ProtoUL.controller.DiagramController', {
    extend: 'Ext.app.Controller',

    refs: [
        {
            ref: 'diagramCanvas',
            selector: '#contentPanel'
        },
        {
            ref: 'diagramToolbar',
            selector: '#diagramtoolbar'
        }
    ],

    undoAction: function(button, e, eOpts) {
    	this.defineLocalVariables(button);
		this.view.getCommandStack().undo();
    },

    redoAction: function(button, e, eOpts) {
    	this.defineLocalVariables(button);
		this.view.getCommandStack().redo();
    },

    deleteObject: function(button, e, eOpts) {
    	this.defineLocalVariables(button);
    	var node = this.view.getCurrentSelection();
		var command= new draw2d.command.CommandDelete(node);
		this.view.getCommandStack().execute(command);
    },

    zoomIn: function(button, e, eOpts) {
    	this.defineLocalVariables(button.ownerCt);
    	this.view.setZoom(this.view.getZoom()*0.7,true);
    },

    zoomNormal: function(button, e, eOpts) {
		this.defineLocalVariables(button.ownerCt);
		this.view.setZoom(1.0, true);
    },

    zoomOut: function(button, e, eOpts) {
		this.defineLocalVariables(button.ownerCt);
		this.view.setZoom(this.view.getZoom()*1.3, true);
    },

    init: function(application) {
        this.control({
            "#btUndo": {
                click: this.undoAction
            },
            "#btRedo": {
                click: this.redoAction
            },
            "#btDelete": {
                click: this.deleteObject
            },
            "#btZoomIn": {
                click: this.zoomIn
            },
            "#btZoomNormal": {
                click: this.zoomNormal
            },
            "#btZoomOut": {
                click: this.zoomOut
            }
        });
    },
    
    defineLocalVariables: function(element){
    	this.toolbar = element.ownerCt;
    	this.canvas = this.toolbar.ownerCt;
    	this.view = this.canvas.view;
    }

});
