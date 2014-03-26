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
        },
        {
        	ref: 'tableContextMenu',
        	selector: '#tablecontextmenu'
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
		
		propertySource.attributes.splice(0,propertySource.attributes.length);
		gridDetailStore.each(function (record) {
			propertySource.attributes.push(record.data);
		});
		
		this.updateJsonDocument();
		this.addOrUpdateJSONDocument(propertySource);
		
		this.getDiagramCanvas().reload();
		entityEditor.collapse();
	},
	
	saveDiagram: function(button,e ,eOpts) {
		this.updateJsonDocument();
	},
	
	enableToolbarButton: function(button) {
		var toolbarButton = this.getDiagramToolbar().getComponent(button);
		toolbarButton.setDisabled(false);
	},
	
	getTableFromContextMenu: function(button) {
		var tableContextMenu = button.ownerCt;
		var table;
		if (tableContextMenu.figure.getParent().getCssClass() === "draw2d_shape_layout_VerticalLayout") {
			table = tableContextMenu.figure.getParent().getParent();
		} else {
			table = tableContextMenu.figure.getParent();
		}
        tableContextMenu.close();
		
		return table;
	},
	
	createPort: function(type, position) {
		var newPort = null;
        switch(type) {
            case "draw2d_InputPort":
                newPort = new draw2d.InputPort();
                break;
            case "draw2d_OutputPort":
                newPort = new draw2d.OutputPort();
                break;
            case "draw2d_HybridPort":
                newPort = new draw2d.HybridPort();
                break;
            default:
                throw "Unknown type [" + type + "] of port requested";
        }
		var userData = [];
		userData.push({
			position: position
		});
		newPort.setUserData(userData);
		
		return newPort;
	},
	
	addConnectorRecursive: function(button,e ,eOpts) {
		var table = this.getTableFromContextMenu(button);
		if (table.hybridPorts.getSize() === 0) {
			var newPort = this.createPort('draw2d_HybridPort', 'bottom');
			newPort.setName("hybrid" + table.hybridPorts.getSize());
			table.addPort(newPort, new draw2d.layout.locator.BottomLocator(table));
			
			var inputPort = this.createPort('draw2d_InputPort', 'default');
			inputPort.setName("input" + table.inputPorts.getSize());
			table.addPort(inputPort);
			table.layoutPorts();
			
			var conn = new dbModel.shape.TableConnection();
			conn.setSource(newPort);
			conn.setTarget(inputPort);

			table.getCanvas().addFigure(conn);
			
			this.enableToolbarButton('btSaveAll');
		}
	},
	
	addInputPort: function(button,e ,eOpts) {
		var table = this.getTableFromContextMenu(button);
            
		var newPort = this.createPort('draw2d_InputPort', 'default');
		newPort.setName("input" + table.inputPorts.getSize());
		table.addPort(newPort);
		table.layoutPorts();
		
		this.enableToolbarButton('btSaveAll');
	},
	
	addOutputPort: function(button,e ,eOpts) {
		var table = this.getTableFromContextMenu(button);
            
		var newPort = this.createPort('draw2d_OutputPort', 'default');
		newPort.setName("output" + table.inputPorts.getSize());
		table.addPort(newPort);
		table.layoutPorts();
		
		this.enableToolbarButton('btSaveAll');
	},
	
	removeUnusedPorts: function(button,e ,eOpts) {
		var table = this.getTableFromContextMenu(button);
        table.getPorts().each(function(i, port) {
            if (port.getConnections().size < 1) {
                table.removePort(port);
            }
        });
        table.layoutPorts();
		table.cachedPorts = null;
		
		this.enableToolbarButton('btSaveAll');
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
            },
            "#btAddConnectorRecursive" :{
            	click: this.addConnectorRecursive
            },
            "#btAddInputPort": {
                click: this.addInputPort
            },
            "#btAddOutputPort": {
            	click: this.addOutputPort
            },
            "#btRemoveUnusedPorts": {
            	click: this.removeUnusedPorts
            }
        });
    }
    
});
