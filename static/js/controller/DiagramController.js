Ext.define('ProtoUL.controller.DiagramController', {
    extend: 'Ext.app.Controller',

    refs: [{
        ref: 'diagramCanvas',
        selector: '#contentPanel'
    }, {
        ref: 'diagramToolbar',
        selector: '#diagramtoolbar'
    }, {
        ref: 'entityAttributes',
        selector: '#entityattributes'
    }, {
        ref: 'entityEditor',
        selector: '#entityeditor'
    }, {
        ref: 'diagramMainView',
        selector: '#diagramMainView'
    }, {
        ref: 'tableContextMenu',
        selector: '#tablecontextmenu'
    }],

	showProgressBar: function(msg,progressText) {
        Ext.MessageBox.show({
           msg: msg,
           progressText: progressText,
           width:300,
           wait:true,
           waitConfig: {interval:200}
       });    
    },
    
    updateJsonDocument: function() {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(this.getDiagramCanvas().getView(), function(json) {
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
        var command = new draw2d.command.CommandDelete(node);
        this.getDiagramCanvas().getView().getCommandStack().execute(command);
        this.getEntityEditor().collapse();
    },

    zoomIn: function(button, e, eOpts) {
        this.getDiagramCanvas().getView().setZoom(this.getDiagramCanvas().getView().getZoom() * 0.7, true);
    },

    zoomNormal: function(button, e, eOpts) {
        this.getDiagramCanvas().getView().setZoom(1.0, true);
    },

    zoomOut: function(button, e, eOpts) {
        this.getDiagramCanvas().getView().setZoom(this.getDiagramCanvas().getView().getZoom() * 1.3, true);
    },

    enableToolbarButton: function(button) {
        var toolbarButton = this.getDiagramToolbar().getComponent(button);
        toolbarButton.setDisabled(false);
    },

    addAttribute: function(button, e, eOpts) {
        var gridDetail = this.getEntityAttributes();
        gridDetail.rowEditing.cancelEdit();
        var label = new draw2d.shape.basic.Label('new attribute');
        var attribute = Ext.create('ProtoUL.model.EntityAttributesModel', {
            text: 'new attribute'+gridDetail.getStore().data.length,
            id: label.id,
            inputPort: '',
            datatype: 'string',
            unique: false,
            pk: false,
        });
        gridDetail.getStore().insert(gridDetail.getStore().data.length, attribute);
        gridDetail.rowEditing.startEdit(gridDetail.getStore().data.length-1, 0);
    },

    deleteAttribute: function(button, e, eOpts) {
        var gridDetail = this.getEntityAttributes();
        var sm = gridDetail.getSelectionModel();
        gridDetail.rowEditing.cancelEdit();
        gridDetail.getStore().remove(sm.getSelection());
        if (gridDetail.getStore().getCount() > 0) {
            sm.select(0);
        }
    },

    addOrUpdateJSONDocument: function(data) {
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

    saveTable: function(button, e, eOpts) {
        var entityEditor = this.getEntityEditor();
        var propertySource = entityEditor.getComponent('protoProperty').source;
        var gridDetailStore = this.getEntityAttributes().getStore();

        if ( typeof propertySource.attributes !== "undefined") {
            propertySource.attributes.splice(0, propertySource.attributes.length);
            gridDetailStore.each(function(record) {
                propertySource.attributes.push(record.data);
            });

            this.updateJsonDocument();
            this.addOrUpdateJSONDocument(propertySource);

            this.getDiagramCanvas().reload();
        } else if ( typeof propertySource.router !== "undefined") {
            this.updateJsonDocument();
            propertySource.userData.isRequired = propertySource.isRequired;
            this.addOrUpdateJSONDocument(propertySource);

            this.getDiagramCanvas().reload();
        }
        entityEditor.collapse();
        this.enableToolbarButton('btSaveDiagram');
    },

    saveDiagram: function(button, e, eOpts) {
    	this.showProgressBar('Saving your data, please wait...','Saving...');
        this.updateJsonDocument();

		var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
        var diagramID = controller.getDiagramMainView().getDiagramID();
        
        Ext.Ajax.request({
            url: _SM._PConfig.saveDiagram,
            params: {
                projectID: projectID,
                diagramID: diagramID
            },
            jsonData: Ext.JSON.encode(jsonDocument),
            success: function(response) {
                setTimeout(function(){
                	Ext.MessageBox.close();
		        }, 1000);
            },
            failure: function(response) {
            	Ext.MessageBox.close();
                console.log('Failure: saveDiagram');
            }
        });
        
        this.enableToolbarButton('btSyncToDB');
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

    addConnectorRecursive: function(button, e, eOpts) {
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

            this.enableToolbarButton('btSaveDiagram');
        }
    },

    addInputPort: function(button, e, eOpts) {
        var table = this.getTableFromContextMenu(button);

        var newPort = this.createPort('draw2d_InputPort', 'default');
        newPort.setName("input" + table.inputPorts.getSize());
        table.addPort(newPort);
        table.layoutPorts();

        this.enableToolbarButton('btSaveDiagram');
    },

    addOutputPort: function(button, e, eOpts) {
        var table = this.getTableFromContextMenu(button);

        var newPort = this.createPort('draw2d_OutputPort', 'default');
        newPort.setName("output" + table.inputPorts.getSize());
        table.addPort(newPort);
        table.layoutPorts();

        this.enableToolbarButton('btSaveDiagram');
    },

    removeUnusedPorts: function(button, e, eOpts) {
        var table = this.getTableFromContextMenu(button);
        table.getPorts().each(function(i, port) {
            if (port.getConnections().size < 1) {
                table.removePort(port);
            }
        });
        table.layoutPorts();
        table.cachedPorts = null;

        this.enableToolbarButton('btSaveDiagram');
    },

    synchDBFromDiagram: function(button, e, eOpts) {
        var controller = this;
        controller.showProgressBar('Creating objects in Database, please wait...','Saving...');
        var menuController = this.application.controllers.get('DiagramMenuController');
        var projectID = menuController.getDiagramMainView().getProjectID();
        Ext.Ajax.request({
            url: _SM._PConfig.synchDBFromDiagram,
            params: {
                projectID: projectID
            },
            jsonData: jsonDocument,
            success: function(response) {
                var text = response.responseText;
                var outcome = Ext.JSON.decode(text);
                for (var i = 0; i < outcome.tables.length; i += 1) {
                    menuController.synchronizeJSONDocument(outcome.tables[i]);
                }
                for (var i = 0; i < outcome.connectors.length; i += 1) {
                    menuController.synchronizeJSONDocument(outcome.connectors[i]);
                }
                controller.getDiagramCanvas().reload();
                controller.updateJsonDocument();
                Ext.MessageBox.close();
            },
            failure: function(response) {
            	Ext.MessageBox.close();
                console.log('Failure: synchDBFromDiagram');
            }
        });
        button.setDisabled(true);
    },

	runAjaxOpenDiagram: function(controller, url, projectID, diagramID){
		Ext.Ajax.request({
            url: url,
            method: "GET",
            params: {
                projectID: projectID,
                diagramID: diagramID
            },
            success: function(response) {
                var text = response.responseText;
                var outcome = Ext.JSON.decode(text);
                
                if (outcome.diagram === "{}") {
                	jsonDocument = [];
                } else {
                    jsonDocument = Ext.JSON.decode(outcome.diagram).objects;
                }
                controller.getDiagramMainView().setTitle('Diagram: ' + outcome.diagramCode);
                controller.getDiagramMainView().setDiagramID(outcome.diagramID);
                controller.getDiagramCanvas().reload();
            },
            failure: function(response) {
                console.log('Failure: openDiagram');
            }
        });
	},
	
	openDiagram: function(button, e, eOpts) {
        var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
        controller.runAjaxOpenDiagram(controller, _SM._PConfig.getDefaultDiagram, projectID, null);
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
            "#btSaveDiagram": {
                click: this.saveDiagram
            },
            "#btSyncToDB": {
                click: this.synchDBFromDiagram
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
            "#btAddConnectorRecursive": {
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
            },
            'panel': {
                opendiagram: this.openDiagram
            }
        });
    }
});
