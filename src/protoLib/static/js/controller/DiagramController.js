/**
 * @class DiagramController
 *
 * This controller is used to capture events from diagram toolbar and diagram detail.
 *
 * @author Giovanni Victorette
 * @extend Ext.app.Controller
 */
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

    getAttributeFromTagetTable: function(connection) {
        var attribute = null;
        connection.targetPort.getParent().getChildren().each(function(i, w) {
            if (connection.id === w.id) {
                attribute = w;
            }
        });
        return attribute;
    },

    deleteObject: function(button, e, eOpts) {
        var node = this.getDiagramCanvas().getView().getCurrentSelection();
        if (node.targetPort) {
            var attribute = this.getAttributeFromTagetTable(node);
            node.targetPort.getParent().removeFigure(attribute);
            this.getDiagramCanvas().getView().removeFigure(node);
        } else {
	        var command = new draw2d.command.CommandDelete(node);
	        this.getDiagramCanvas().getView().getCommandStack().execute(command);
        }

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

    createEntityAttribute: function(text, id, pk, fk, datatype) {
        return Ext.create('ProtoUL.model.EntityAttributesModel', {
            text: text,
            id: id,
            inputPort: '',
            datatype: 'string',
            unique: false,
            pk: pk,
            fk: fk,
            isRequired: false,
            isNullable: false
        });
    },

    createAjaxRequest: function(url, method, params, jsonData, successFunction, failureFunction) {
        Ext.Ajax.request({
            url: url,
            method: method,
            params: params,
            jsonData: jsonData,
            success: successFunction,
            failure: failureFunction
        });
    },
    addAttribute: function(button, e, eOpts) {
        var entityEditor = this.getEntityEditor();
        var gridDetail = this.getEntityAttributes();
        gridDetail.rowEditing.cancelEdit();
        var attribute = this.createEntityAttribute('new attribute' + gridDetail.getStore().data.length, draw2d.util.UUID.create(), false, false, 'string');
        gridDetail.getStore().insert(gridDetail.getStore().data.length, attribute);
        entityEditor.figure.addAttribute(0, attribute);
        entityEditor.figure.setDimension(1, 1);
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
            var sm = this.getEntityAttributes().getSelectionModel();
            var attribute = sm.getSelection()[0];
            if (attribute) {
                if (attribute.data.fk) {
                    entityEditor.figure.getConnections().each(function(index, connection) {
                        if (attribute.data.id === connection.id) {
                            var memento = connection.getPersistentAttributes();
                            memento.name = attribute.data.text;
                            memento.userData.isPrimary = attribute.data.pk;
                            connection.setPersistentAttributes(memento);
                        }
                    });
                }

            }
            propertySource.attributes.splice(0, propertySource.attributes.length);
            gridDetailStore.each(function(record) {
                propertySource.attributes.push(record.data);
            });
            for (var i = entityEditor.figure.attributes.size - 1; i >= 0; i--) {
                entityEditor.figure.removeFigure(entityEditor.figure.attributes.get(i));
            }
            entityEditor.figure.setColor(propertySource.color);
            entityEditor.figure.setAlpha(propertySource.alpha);
            entityEditor.figure.updateHeader(propertySource);
            entityEditor.figure.updateAttributes(propertySource);
            entityEditor.figure.setDimension(1, 1);
        } else if ( typeof propertySource.router !== "undefined") {
            propertySource.userData.isPrimary = propertySource.isPrimary;
            var attribute = this.getAttributeFromTagetTable(entityEditor.figure);
            attribute.pk = propertySource.isPrimary;
            attribute.setText(propertySource.name);
            attribute.setBold(attribute.pk);
            if (attribute.pk) {
                attribute.setCssClass('primary_key');
            } else {
                attribute.setCssClass('draw2d_shape_basic_Label');
            }
            entityEditor.figure.setPersistentAttributes(propertySource);
        }
    },

    saveDiagram: function(button, e, eOpts) {
        this.showProgressBar(_SM.__language.Message_Saving_Data, _SM.__language.Text_Submit_Validation_Form);
        this.updateJsonDocument();

        var controller = this;
        params = {
            projectID: controller.getDiagramMainView().getProjectID(),
            diagramID: controller.getDiagramMainView().getDiagramID()
        };
        successFunction = function(response) {
            setTimeout(function() {
                Ext.MessageBox.close();
            }, 1000);
        };
        failureFunction = function(response) {
            Ext.MessageBox.close();
            console.log('Failure: saveDiagram');
        };
        this.createAjaxRequest(_SM._PConfig.saveDiagram, "POST", params, Ext.JSON.encode(jsonDocument), successFunction, failureFunction);

        this.enableToolbarButton('btSyncToDB');
    },

    updateJSONFromData: function(index, data) {
        if (data.type === 'dbModel.shape.DBTable') {
            jsonDocument[index].tableName = data.tableName;
            jsonDocument[index].attributes = data.attributes;
        }
    },

    synchronizeJSONDocument: function(data) {
        for (var i = 0; i < jsonDocument.length; i++) {
            if (jsonDocument[i].id === data.id) {
                this.updateJSONFromData(i, data);
            }
        }
    },

    synchDBFromDiagram: function(button, e, eOpts) {
        var controller = this;
        controller.showProgressBar(_SM.__language.Message_Creating_Objects, _SM.__language.Text_Submit_Validation_Form);
        params = {
            projectID: controller.getDiagramMainView().getProjectID()
        };
        successFunction = function(response) {
            var text = response.responseText;
            var outcome = Ext.JSON.decode(text);
            for (var i = 0; i < outcome.tables.length; i += 1) {
                controller.synchronizeJSONDocument(outcome.tables[i]);
            }
            controller.getDiagramCanvas().reload();
            controller.updateJsonDocument();
            Ext.MessageBox.close();
        };
        failureFunction = function(response) {
            Ext.MessageBox.close();
            console.log('Failure: synchDBFromDiagram');
        };
        this.createAjaxRequest(_SM._PConfig.synchDBFromDiagram, "POST", params, jsonDocument, successFunction, failureFunction);
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
            if (row.data.name !== 'isPrimary' && row.data.name !== 'name' && row.data.name !== 'tableName' && row.data.name !== 'color' && row.data.name !== 'alpha') {
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

    // Used to synchonize connector and attribute
    onDropConnection: function(connection, figure) {
        var me = this;
        me.onSelectionChanged(figure);

        if (connection !== null) {
            var gridDetail = me.getEntityAttributes();
            var entityEditor = me.getEntityEditor();
            gridDetail.rowEditing.cancelEdit();
            var attribute = this.createEntityAttribute(connection.getConnectionName(), connection.getId(), false, true, 'string');

            gridDetail.getStore().insert(gridDetail.getStore().data.length, attribute);
            var label = entityEditor.figure.addAttribute(0, attribute.data);
            label.setId(attribute.data.id);
            label.datatype = attribute.data.datatype;
            label.pk = attribute.data.pk;
            label.fk = attribute.data.fk;
            label.isRequired = attribute.data.isRequired;
            label.isNullable = attribute.data.isNullable;
            entityEditor.figure.setDimension(1, 1);
        }
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
