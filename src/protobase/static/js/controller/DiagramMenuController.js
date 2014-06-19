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
        var canvas = this.getDiagramCanvas().getView();
        if (data.type === 'dbModel.shape.DBTable') {
			var table = canvas.getFigure(data.id);
			if (table){
				canvas.removeFigure(table);
			}
			table = new dbModel.shape.DBTable();
			table.setPersistentAttributes(data);
			table.addContextMenuListener(this.getDiagramCanvas());
            table.addOnDropConnectionListener(this.application.controllers.get('DiagramController'));
			canvas.addFigure(table);
        } else {
			var connection = canvas.getFigure(data.id);
			if (!connection){
				connection = new dbModel.shape.TableConnection();
				connection.setPersistentAttributes(data);
				
				var sourceTable = canvas.getFigure(data.source.node);
				var targetTable = canvas.getFigure(data.target.node);
				if (sourceTable && targetTable) {
					var sourcePort = sourceTable.getPort(data.source.port);
					if (!sourcePort) {
						sourcePort = sourceTable.createCustomizedPort("draw2d_OutputPort",data.source.port ,'right');
					}

					var targetPort = targetTable.getPort(data.target.port);
					if (!targetPort) {
						targetPort = targetTable.createCustomizedPort("draw2d_InputPort",data.target.port ,'left');
					}

					connection.setSource(sourcePort);
					connection.setTarget(targetPort);
					connection._routingMetaData.routedByUserInteraction = false;
					canvas.addFigure(connection);
				}
			}
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
                var statusText = outcome.tables.length + ' item(s) found';
                var win = new Ext.Window({
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
                });
				var searchGrid = win.down('grid');
				searchGrid.getView().getRowClass = function(record, rowIndex, rowParams, store) {
					controller = ProtoUL.app.getController('DiagramController');
					var canvas = controller.getDiagramCanvas().getView();
					var figure = canvas.getFigure(record.internalId);
					if (figure){
						return 'table-in-diagram';
					}
					return '';
				};
				var statusBar = searchGrid.query('#bbarDefaultText')[0];
				win.show();
				statusBar.setText(statusText);
            }
        });
    },

	syncDiagramFromDB: function() {
		var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
		function doUpdate(btn) {
            if (btn === 'yes') {
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
						Ext.Msg.alert('Success', _SM.__language.Message_Diagram_Synchronized);
					},
					failure: function(response) {
						Ext.Msg.alert('Failure', _SM.__language.Message_Error_Diagram_Synchronized);
					}
				});
            }
        }
		Ext.MessageBox.confirm('Confirmation', _SM.__language.Msg_Confirm_Delete_Operation + ' les configurations personnalisées seront perdues!', doUpdate);
		
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
            title: _SM.__language.Title_Diagrams,
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
        var diagramController = controller.application.controllers.get('DiagramController');
        diagramController.showProgressBar(_SM.__language.Message_Add_Table_Canvas,'Processing...');

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
                Ext.MessageBox.close();
            },
            failure: function(response) {
            	Ext.MessageBox.close();
                Ext.Msg.alert('Failure', 'Failed to get tables from database, please try again later!');
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
                	controller.getDiagramsStore().load(operation);
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
		var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
        var operation = new Ext.data.Operation({
		    action: 'read',
			params: {"projectID": projectID}
		});
		
        var grid = controller.getDiagramGrid(), record = grid.getSelectionModel().getSelection(), store = controller.getDiagramsStore();
		var openedDiagramID = controller.getDiagramMainView().getDiagramID();
		
		if (openedDiagramID !== record[0].data.id){
	        store.remove(record);
	        store.sync({
	        	success: function(batch, options) {
	                controller.getDiagramsStore().load(operation);
	            },
	            failure: function(batch, options) {
	                Ext.Msg.alert('Failed', batch.proxy.getReader().jsonData.message);
	            },
	            scope: this
	        });
	        store.load(operation);
		} else {
			Ext.Msg.alert('Warning', _SM.__language.Warning_Delete_Active_Diagram);
		}
    },
    
    openSelectedDiagram: function(button, event) {
    	var controller = this;
		var projectID = controller.getDiagramMainView().getProjectID();
		
		var grid = button.up('grid[itemId=diagramgrid]');
		var record = grid.getSelectionModel().getSelection();
		var diagramID = record[0].data.id;
		
		var openedDiagramID = controller.getDiagramMainView().getDiagramID();
		
		var diagramController = controller.application.controllers.get('DiagramController');
		if (openedDiagramID !== diagramID){
	        diagramController.runAjaxOpenDiagram(controller, _SM._PConfig.openDiagram, projectID, diagramID);
		} else {
			Ext.Msg.alert('Warning', _SM.__language.Warning_Diagram_Already_Open);
		}
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
            'diagramgrid button[action=openselecteddiagram]': {
                click: this.openSelectedDiagram
            },
            'diagramform button[action=save]': {
                click: this.updateDiagram
            }
        });
    }
});
