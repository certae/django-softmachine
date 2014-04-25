Ext.define('ProtoUL.controller.DiagramMenuController', {
    extend: 'Ext.app.Controller',

    stores: ['Diagrams'],

    models: ['Diagram'],

    views: ['diagram.base.Form', 'diagram.base.Grid'],

    refs: [{
        ref: 'diagramCanvas',
        selector: '#contentPanel'
    }, {
        ref: 'diagramToolbar',
        selector: '#diagramtoolbar'
    }, {
        ref: 'diagramMainView',
        selector: '#diagramMainView'
    }, {
        ref: 'liveGridSearch',
        selector: '#livesearchgrid'
    }, {
        ref: 'diagramForm',
        selector: '#diagramform'
    }, {
        ref: 'diagramGrid',
        selector: '#diagramgrid'
    }],

    updateJsonDocument: function() {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(this.getDiagramCanvas().getView(), function(json) {
            jsonDocument = json;
        });
    },

    updateJSONFromData: function(index, data) {
        if (data.type === 'dbModel.shape.DBTable') {
            jsonDocument[index].tableName = data.tableName;
            jsonDocument[index].attributes = data.attributes;
            jsonDocument[index].tablePorts = data.tablePorts;
        } else {
            jsonDocument[index].name = data.name;
            jsonDocument[index].source = data.source;
            jsonDocument[index].target = data.target;
        }
    },

    addOrUpdateJSONDocument: function(data) {
        var isAdd = true;
        for (var i = 0; i < jsonDocument.length; i++) {
            if (jsonDocument[i].id === data.id) {
                this.updateJSONFromData(i, data);
                isAdd = false;
            }
        }
        if (isAdd) {
            jsonDocument.push(data);
        }
    },

    synchronizeJSONDocument: function(data) {
        for (var i = 0; i < jsonDocument.length; i++) {
            if (jsonDocument[i].id === data.id) {
                this.updateJSONFromData(i, data);
            }
        }
    },

    enableToolbarButton: function(button) {
        var toolbarButton = this.getDiagramToolbar().getComponent(button);
        toolbarButton.setDisabled(false);
    },

    getAllTablesFromDB: function() {
        var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
        Ext.Ajax.request({
            url: _SM._PConfig.urlGetEntitiesJSONDiagram,
            params: {
                projectID: projectID
            },
            success: function(response) {
                var text = response.responseText;
                var outcome = Ext.JSON.decode(text);

                var store = Ext.create('ProtoUL.store.DiagramModelStore', {
                    data: outcome.tables
                });
                new Ext.Window({
                    width: 540,
                    height: 300,
                    layout: 'fit',
                    items: {
                        xtype: 'livesearchgrid',
                        store: store,
                        selModel: Ext.create('Ext.selection.CheckboxModel'),
                        columns: [{
                            text: "Table",
                            flex: 1,
                            dataIndex: 'tableName',
                            sortable: true
                        }],
                        width: 540,
                        height: 200
                    }
                }).show();
            }
        });
    },

	syncDiagramFromDB: function() {
		var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
		Ext.Ajax.request({
            url: _SM._PConfig.synchDiagramFromDB,
            params: {
                projectID: projectID
            },
            success: function(response) {
                var text = response.responseText;
                var outcome = Ext.JSON.decode(text);
                for (var i = 0; i < outcome.tables.length; i += 1) {
                    controller.synchronizeJSONDocument(outcome.tables[i]);
                }
                for (var i = 0; i < outcome.connectors.length; i += 1) {
                    controller.synchronizeJSONDocument(outcome.connectors[i]);
                }
                controller.getDiagramCanvas().reload();
                controller.updateJsonDocument();
            }
        });
	},
	
    menuManageDiagram: function() {
    	var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
        var operation = new Ext.data.Operation({
		    action: 'read',
			params: {"projectID": projectID}
		});
        var win = Ext.create('Ext.window.Window', {
            width: 500,
            title: 'Diagrams',
            layout: 'fit',
            items: {
                xtype: 'diagramgrid',
            }
        });
        var grid = win.down();
		grid.getStore().load(operation);
        win.show();
    },

    onSearchMenuClick: function(menu, item, e, opt) {
        var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
        switch(item.itemId) {
            case 'getAllTables':
                controller.getAllTablesFromDB();
                break;
            case 'syncDiagramFromDB':
            	controller.syncDiagramFromDB();
                break;
            case 'menuManageDiagram':
                controller.menuManageDiagram();
                break;
            default:
                alert('Function to be implementated in future versions!');
                break;
        }
    },

    closeSearchBar: function(button, e, eOpts) {
        Ext.destroy(this.getLiveGridSearch().ownerCt);
    },

    addTableFromSearchGrid: function(button, e, eOpts) {
        var controller = this;
        var liveGrid = this.getLiveGridSearch();
        var tables = liveGrid.getSelectionModel().getSelection();

        var jsonRequest = [];
        for (var i = 0; i < tables.length; i += 1) {
            jsonRequest.push(tables[i].data);
        }
        Ext.Ajax.request({
            url: _SM._PConfig.getElementsDiagramFromSelectedTables,
            jsonData: jsonRequest,
            success: function(response) {
                var text = response.responseText;
                var outcome = Ext.JSON.decode(text);
                for (var i = 0; i < outcome.tables.length; i += 1) {
                    controller.addOrUpdateJSONDocument(outcome.tables[i]);
                }
                for (var i = 0; i < outcome.connectors.length; i += 1) {
                    controller.addOrUpdateJSONDocument(outcome.connectors[i]);
                }
                controller.getDiagramCanvas().reload();
                controller.updateJsonDocument();
            },
            failure: function(response) {
                console.log('Failure: getElementsDiagramFromSelectedTables');
            }
        });
    },

	// Diagram management
    editDiagram: function(grid, record) {
        var edit = Ext.create('ProtoUL.view.diagram.base.Form').show();

        if (record.id) {
            edit.down('form').loadRecord(record);
        }
    },

    updateDiagram: function(button) {
    	var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
        var operation = new Ext.data.Operation({
		    action: 'read',
			params: {"projectID": projectID}
		});
		
        var win = button.up('window'), form = win.down('form'), record = form.getRecord(), values = form.getValues();

        var newDiagram = false;
        if (form.getForm().isValid()) {
            if (values.id > 0) {
                record.set(values);
            } else {
                record = Ext.create('ProtoUL.model.Diagram');
                values.projectID = projectID;
                record.set(values);
                controller.getDiagramsStore().add(record);
                newDiagram = true;
            }

            var store = controller.getDiagramsStore();
            store.sync({
                success: function(batch, options) {
                    win.close();
                },
                failure: function(batch, options) {
                    Ext.Msg.alert('Error','Failed to create diagram');
                },
                scope: this
            });

            if (newDiagram) {//reload for update
                controller.getDiagramsStore().load(operation);
            }
        }
    },

    deleteDiagram: function(button) {

        var grid = this.getDiagramGrid(), record = grid.getSelectionModel().getSelection(), store = this.getDiagramsStore();

        store.remove(record);
        store.sync({
            failure: function(batch, options) {
                Ext.Msg.alert('Failed', batch.proxy.getReader().jsonData.message);
            },
            scope: this
        });
        store.load();

        //do update
        this.getDiagramsStore().load();
    },

    init: function(application) {
        this.control({
            '#DatabaseMenu': {
                click: this.onSearchMenuClick
            },
            '#btCancelSearchBar': {
                click: this.closeSearchBar
            },
            '#btAddTableFromSearchBar': {
                click: this.addTableFromSearchGrid
            },
            'diagramgrid dataview': {
                itemdblclick: this.editDiagram
            },
            'diagramgrid button[action=add]': {
                click: this.editDiagram
            },
            'diagramgrid button[action=delete]': {
                click: this.deleteDiagram
            },
            'diagramform button[action=save]': {
                click: this.updateDiagram
            }
        });
    }
});
