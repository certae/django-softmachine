Ext.define('ProtoUL.controller.DiagramMenuController', {
    extend: 'Ext.app.Controller',

    refs: [{
        ref: 'diagramCanvas',
        selector: '#contentPanel'
    }, {
        ref: 'diagramToolbar',
        selector: '#diagramtoolbar'
    }, {
        ref: 'liveGridSearch',
        selector: '#livesearchgrid'
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

    onSearchMenuClick: function(menu, item, e, opt) {
        var controller = this;
        switch(item.itemId) {
            case 'getAllTables':
                Ext.Ajax.request({
                    url: _SM._PConfig.urlGetEntitiesJSONDiagram,
                    params: {
                        // FIXME get value from selected row in Model View
                        modelID: 1
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
                                    text: "UUID",
                                    width: 100,
                                    dataIndex: 'id',
                                    sortable: true
                                }, {
                                    text: "Table",
                                    flex: 1,
                                    dataIndex: 'tableName',
                                    sortable: true
                                }],
                                width: 540,
                                height: 200
                            }
                        }).show();
                        // for(var i = 0; i < outcome.tables.length; i += 1) {
                        // controller.addOrUpdateJSONDocument(outcome.tables[i]);
                        // }
                        // for(var i = 0; i < outcome.connectors.length; i += 1) {
                        // controller.addOrUpdateJSONDocument(outcome.connectors[i]);
                        // }
                        // controller.getDiagramCanvas().reload();
                    }
                });
                break;
            case 'getJSONTable':
                Ext.Ajax.request({
                    url: _SM._PConfig.urlGetEntitiesJSONDiagram,
                    params: {
                        modelID: 1
                    },
                    success: function(response) {
                        var text = response.responseText;
                        var outcome = Ext.JSON.decode(text);
                    }
                });
                break;
            case 'syncDiagramFromDB':
                Ext.Ajax.request({
                    url: _SM._PConfig.urlGetEntitiesJSONDiagram,
                    params: {
                        modelID: 1
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
                break;
            default:
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
        // TODO replace for request...
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
                controller.getDiagramCanvas().reload();
                controller.updateJsonDocument();
            },
            failure: function(response) {
                console.log('Failure: synchDBFromDiagram');
            }
        });

        Ext.destroy(liveGrid.ownerCt);
    },

    init: function(application) {
        this.control({
            '#SearchMenu': {
                click: this.onSearchMenuClick
            },
            '#btCancelSearchBar': {
                click: this.closeSearchBar
            },
            '#btAddTableFromSearchBar': {
                click: this.addTableFromSearchGrid
            }
        });
    }
});
