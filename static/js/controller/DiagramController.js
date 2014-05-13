Ext.define('ProtoUL.controller.DiagramController', {
    extend: 'Ext.app.Controller',

    stores: ['PortPositions'],

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

    showProgressBar: function(msg, progressText) {
        Ext.MessageBox.show({
            msg: msg,
            progressText: progressText,
            width: 300,
            wait: true,
            waitConfig: {
                interval: 200
            }
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
        if (node.targetPort) {
            var attribute = null;
            var table = node.targetPort.getParent();
            table.getChildren().each(function(i, w) {
                if (node.id === w.id) {
                    attribute = w;
                }
            });
            table.removeFigure(attribute);
        }
        var command = new draw2d.command.CommandDelete(node);
        this.getDiagramCanvas().getView().getCommandStack().execute(command);

        var gridDetail = this.getEntityAttributes();
        var entityEditor = this.getEntityEditor();
        var masterRecord = entityEditor.getComponent('protoProperty');
        gridDetail.hide();
        masterRecord.setSource(null);
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

	createEntityAttribute: function(text, id) {
		return Ext.create('ProtoUL.model.EntityAttributesModel', {
            text: text,
            id: id,
            inputPort: '',
            datatype: 'string',
            unique: false,
            pk: false
        });
	},
	
    addAttribute: function(button, e, eOpts) {
        var entityEditor = this.getEntityEditor();
        var gridDetail = this.getEntityAttributes();
        gridDetail.rowEditing.cancelEdit();
        var attribute = this.createEntityAttribute('new attribute' + gridDetail.getStore().data.length, draw2d.util.UUID.create());
        gridDetail.getStore().insert(gridDetail.getStore().data.length, attribute);
        entityEditor.figure.addAttribute(0, attribute);
        // gridDetail.rowEditing.startEdit(gridDetail.getStore().data.length - 1, 0);
        entityEditor.figure.setDimension(1, 1);
        // this.saveTable();
    },

    deleteAttribute: function(button, e, eOpts) {
        var gridDetail = this.getEntityAttributes();
        var sm = gridDetail.getSelectionModel();
        var attribute = sm.getSelection()[0];
        var figure = gridDetail.ownerCt.figure;
        if (attribute.data.fk) {
            var canvas = this.getDiagramCanvas().getView();
            figure.getConnections().each(function(index, connection) {
                if (attribute.data.id === connection.id) {
                    canvas.removeFigure(connection);
                }
            });
        }

        gridDetail.rowEditing.cancelEdit();
        gridDetail.getStore().remove(sm.getSelection());
        if (gridDetail.getStore().getCount() > 0) {
            sm.select(0);
        }
        figure.getChildren().each(function(index, label) {
            if (attribute.data.id === label.id) {
                figure.removeFigure(label);
            }
        });
        // this.saveTable();
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
            propertySource.userData.isPrimary = propertySource.isPrimary;
            this.addOrUpdateJSONDocument(propertySource);

            this.getDiagramCanvas().reload();
        }
        this.enableToolbarButton('btSaveDiagram');
    },

    saveDiagram: function(button, e, eOpts) {
        this.showProgressBar(_SM.__language.Message_Saving_Data, _SM.__language.Text_Submit_Validation_Form);
        this.updateJsonDocument();

        var controller = this;
        var projectID = controller.getDiagramMainView().getProjectID();
        var diagramID = controller.getDiagramMainView().getDiagramID();

        Ext.Ajax.request({
            url: _SM._PConfig.saveDiagram,
            method: "POST",
            params: {
                projectID: projectID,
                diagramID: diagramID
            },
            jsonData: Ext.JSON.encode(jsonDocument),
            success: function(response) {
                setTimeout(function() {
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

    synchDBFromDiagram: function(button, e, eOpts) {
        var controller = this;
        controller.showProgressBar(_SM.__language.Message_Creating_Objects, _SM.__language.Text_Submit_Validation_Form);
        var menuController = this.application.controllers.get('DiagramMenuController');
        var projectID = menuController.getDiagramMainView().getProjectID();
        Ext.Ajax.request({
            url: _SM._PConfig.synchDBFromDiagram,
            method: "POST",
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

    runAjaxOpenDiagram: function(controller, url, projectID, diagramID) {
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
                controller.getDiagramMainView().setTitle(_SM.__language.Title_Work_Diagram + outcome.diagramCode);
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
        var diagramID = controller.getDiagramMainView().getDiagramID();
        if (diagramID === null) {
            controller.runAjaxOpenDiagram(controller, _SM._PConfig.getDefaultDiagram, projectID, null);
        } else {
            controller.runAjaxOpenDiagram(controller, _SM._PConfig.openDiagram, projectID, diagramID);
        }
    },

    exportDiagramToPNG: function updatePreview() {
        // convert the canvas into a PNG image source string
        var canvas = this.getDiagramCanvas().getView();
        var xCoords = [], yCoords = [];
        canvas.getFigures().each(function(i, f) {
            var b = f.getBoundingBox();
            xCoords.push(b.x, b.x + b.w);
            yCoords.push(b.y, b.y + b.h);
        });
        var minX = 0, minY = 0;
        var width = Math.max.apply(Math, xCoords) - minX;
        var height = Math.max.apply(Math, yCoords) - minY;
        var writer = new draw2d.io.png.Writer();
        var image = null;
        writer.marshal(canvas, function(png) {
            image = png;
        }, new draw2d.geo.Rectangle(minX, minY, width, height));

        var printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write('<html><head>');
        printWindow.document.write('<title>' + 'Print diagram' + '</title>');
        printWindow.document.write('<link rel="Stylesheet" type="text/css" href="http://dev.sencha.com/deploy/ext-4.0.1/resources/css/ext-all.css" />');
        printWindow.document.write('<script type="text/javascript" src="http://dev.sencha.com/deploy/ext-4.0.1/bootstrap.js"></script>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<img class="shadow" ' + 'src=' + image + ' id="preview" style="border-radius:1px;overflow:auto; top:10px; right:10px; border:0px solid gray;"/>');
        printWindow.document.write('</body></html>');
        printWindow.print();

    },

    hidePropertyGridAttributes: function(masterRecord) {
        masterRecord.getView().getRowClass = function(row, index) {
            if (row.data.name !== 'isPrimary' && row.data.name !== 'name' && row.data.name !== 'tableName') {
                return 'hide-this-row';
            } else {
                return '';
            }
        };
    },

    // dbModel listeners
    onSelectionChanged: function(figure) {
        var controller = this;
        if (figure !== null) {
            var gridDetail = controller.getEntityAttributes();
            var entityEditor = controller.getEntityEditor();
            var masterRecord = entityEditor.getComponent('protoProperty');
            entityEditor.figure = figure;

            var myObj = figure.getPersistentAttributes();
            if (figure.cssClass === 'dbModel_shape_DBTable' || figure.cssClass === 'DBTable') {
                gridDetail.show();

                if ( typeof myObj !== 'undefined') {
                    masterRecord.setSource(myObj);
                    controller.hidePropertyGridAttributes(masterRecord);
                    gridDetail.getStore().loadRawData(myObj.attributes);
                }
            } else {
                gridDetail.hide();

                myObj.isPrimary = myObj.userData.isPrimary;
                if ( typeof myObj !== 'undefined') {
                    masterRecord.setSource(myObj);
                    controller.hidePropertyGridAttributes(masterRecord);
                }
            }
        }
    },

    onDropConnection: function(connection, figure) {
        var me = this;
        me.onSelectionChanged(figure);

        var gridDetail = me.getEntityAttributes();
        var entityEditor = me.getEntityEditor();
        gridDetail.rowEditing.cancelEdit();
        var attribute = this.createEntityAttribute(connection.getConnectionName(), connection.getId());

        gridDetail.getStore().insert(gridDetail.getStore().data.length, attribute);
        entityEditor.figure.addAttribute(0, attribute);
        entityEditor.figure.setDimension(1, 1);
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
            "#btExportDiagram": {
                click: this.exportDiagramToPNG
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
            'panel': {
                opendiagram: this.openDiagram
            }
        });
    }
});
