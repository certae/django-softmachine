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
            ref: 'entityAttributes',
            selector: '#entityattributes'
        },
        {
        	ref: 'entityEditor',
        	selector: '#entityeditor'
        }
    ],

	updateJsonDocument: function() {
		var writer = new draw2d.io.json.Writer();
		writer.marshal(this.getDiagramCanvas().getView(), function(json){
			jsonDocument = json;
		});
	},
	
    undoAction: function(button, e, eOpts) {
		this.getDiagramCanvas().getView().getCommandStack().undo();
    },

    redoAction: function(button, e, eOpts) {
		this.getDiagramCanvas().getView().getCommandStack().redo();
    },

    deleteObject: function(button, e, eOpts) {
    	var node = this.getDiagramCanvas().getView().getCurrentSelection();
		var command= new draw2d.command.CommandDelete(node);
		this.getDiagramCanvas().getView().getCommandStack().execute(command);
		this.getEntityEditor().collapse();
    },

    zoomIn: function(button, e, eOpts) {
    	this.getDiagramCanvas().getView().setZoom(this.getDiagramCanvas().getView().getZoom()*0.7,true);
    },

    zoomNormal: function(button, e, eOpts) {
		this.getDiagramCanvas().getView().setZoom(1.0, true);
    },

    zoomOut: function(button, e, eOpts) {
		this.getDiagramCanvas().getView().setZoom(this.getDiagramCanvas().getView().getZoom()*1.3, true);
    },

	addAttribute: function(button,e ,eOpts){
		var gridDetail = this.getEntityAttributes();
		gridDetail.rowEditing.cancelEdit();
		var label = new draw2d.shape.basic.Label('new attribute');
		var attribute = Ext.create('ProtoUL.model.EntityAttributesModel', {
            text: 'new attribute',
            id: label.id,
            inputPort: '',
            datatype: 'CharField',
            unique: false,
            pk: false,
        });
		gridDetail.getStore().insert(0,attribute);
		gridDetail.rowEditing.startEdit(0,0);
	},
	
	deleteAttribute: function(button,e ,eOpts) {
		var gridDetail = this.getEntityAttributes();
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
		var entityEditor = this.getEntityEditor();
		var propertySource = entityEditor.getComponent('protoProperty').source;
		var gridDetailStore = this.getEntityAttributes().getStore();
		
		propertySource.entities.splice(0,propertySource.entities.length);
		gridDetailStore.each(function (record) {
			propertySource.entities.push(record.data);
		});
		
		this.updateJsonDocument();
		this.addOrUpdateJSONDocument(propertySource);
		
		this.getDiagramCanvas().reload();
		entityEditor.collapse();
	},
	
	saveDiagram: function(button,e ,eOpts) {
		this.updateJsonDocument();
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
            "#btSaveAll": {
            	click: this.saveDiagram
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
    }
    
});
