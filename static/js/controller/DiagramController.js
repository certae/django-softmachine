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
        },
        {
            ref: 'entityattributes',
            selector: '#entityattributes'
        },
        {
        	ref: 'entityeditor',
        	selector: '#entityeditor'
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
		this.getEntityeditor().collapse();
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

	addAttribute: function(button,e ,eOpts){
		var gridDetail = button.up('#entityattributes');
		gridDetail.rowEditing.cancelEdit();
		var label = new draw2d.shape.basic.Label('new attribute');
		var attribute = Ext.create('ProtoUL.model.EntityAttributesModel', {
            text: 'new attribute',
            id: label.id,
            inputPort: '',
            datatype: 'string',
            unique: false,
            pk: false,
        });
		gridDetail.getStore().insert(0,attribute);
		gridDetail.rowEditing.startEdit(0,0);
	},
	
	deleteAttribute: function(button,e ,eOpts) {
		var gridDetail = button.up('#entityattributes');
		var sm = gridDetail.getSelectionModel();
        gridDetail.rowEditing.cancelEdit();
        gridDetail.getStore().remove(sm.getSelection());
        if (gridDetail.getStore().getCount() > 0) {
            sm.select(0);
        }
	},
	
	addOrUpdateJSONDocument : function(data) {
		var isAdd = true;
		for (var i = 0; i < jsonDocument.length; i++) {
			if (jsonDocument[i].id === data.id) {
				jsonDocument[i] = data;
				isAdd = false;
			}
		}
		if (isAdd) {
			jsonDocument.push(data);
		}
	},
	
	saveTable: function(button,e ,eOpts) {
		var entityEditor = button.up('#entityeditor');
		var propertySource = entityEditor.getComponent('protoProperty').source;
		var gridDetailStore = entityEditor.getComponent('entityattributes').getStore();
		propertySource.entities.splice(0,propertySource.entities.length);
		gridDetailStore.each(function (record) {
			propertySource.entities.push(record.data);
		});
		var test = jsonDocument;
		var writer = new draw2d.io.json.Writer();
		var canvas = entityEditor.ownerCt.getComponent('contentPanel');
		writer.marshal(canvas.view, function(json){
			jsonDocument = json;
		});
		this.addOrUpdateJSONDocument(propertySource);
		
		canvas.reload();
		entityEditor.collapse();
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
            },
            "#btAddAttribute": {
            	click: this.addAttribute
            },
            "#btDeleteAttribute": {
            	click: this.deleteAttribute
            },
            "#btSaveTable": {
            	click: this.saveTable
            }
        });
    },
    
    defineLocalVariables: function(element){
    	this.toolbar = element.ownerCt;
    	this.canvas = this.toolbar.ownerCt;
    	this.view = this.canvas.view;
    }

});
