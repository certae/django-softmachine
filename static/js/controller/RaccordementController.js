/**
 * @author Giovanni Victorette
 */
/**
 * @class RaccordementController
 *
 * This controller is used to capture events from raccordement.
 *
 * @author Giovanni Victorette
 * @extend Ext.app.Controller
 */
Ext.define('ProtoUL.controller.RaccordementController', {
    extend: 'Ext.app.Controller',

    stores: ['ElementsDonneeRightGrid', 'ElementsDonneeLeftGrid', 'Raccordements'],

    refs: [{
        ref: 'mainWindow',
        selector: '#raccordementMainWindow'
    }],

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

	getReadRaccordementOperation: function() {
        var operation = new Ext.data.Operation({
            action: 'read',
            params: {
                "modelId": this.getMainWindow().getActiveModel()
            }
        });
        return operation;
    },
    
    syncListRaccordement: function(listRaccordement) {
        var controller = this;

        listRaccordement.getStore().sync({
            success: function(batch, options) {
                listRaccordement.getStore().load(controller.getReadRaccordementOperation());
            },
            failure: function(batch, options) {
                Ext.Msg.alert('Error', 'Failed to create raccordement');
            },
            scope: this
        });
    },

    loadDataToGridPanel: function(grid, model) {
        grid.setTitle(model.modelName);
        grid.getStore().loadData(model.attributes);
    },

	removeMask: function(gridPanel) {
        gridPanel.getComponent('gridLeft').setLoading(false);
        gridPanel.getComponent('gridRight').setLoading(false);
    },
    
    openModeleRaccordement: function(win) {
        var controller = this;
        var model = win.getActiveModel();

        params = {
            modelID: model
        };
        successFunction = function(response) {
            var text = response.responseText;
            var outcome = Ext.JSON.decode(text);
            if (outcome.models) {
                var gridPanel = controller.getMainWindow().down('panel');
                controller.loadDataToGridPanel(gridPanel.getComponent('gridLeft'), outcome.models[0]);
                controller.loadDataToGridPanel(gridPanel.getComponent('gridRight'), outcome.models[1]);
                controller.removeMask(gridPanel);

                if (outcome.models[2]) {
                    var listRaccordement = controller.getMainWindow().getComponent('listRaccordementGrid');
                    listRaccordement.setModelRaccordement(outcome.models[2].nomModele);
                    listRaccordement.getStore().loadData(outcome.models[2].raccordements);
                }
            }
        };
        failureFunction = function(response) {
        	controller.removeMask(controller.getMainWindow().down('panel'));
            console.log('Error on openModeleRaccordement method');
        };
        this.createAjaxRequest('rai/getModeleRaccordement/', "GET", params, null, successFunction, failureFunction);
    },

    createRaccordementAttribute: function(modelName, modelId, source, target) {
        return Ext.create('ProtoUL.model.Raccordement', {
            sourceId: source.id,
            sourceName: source.attributeName,
            targetId: target.id,
            targetName: target.attributeName,
            modelId: modelId,
            modelName: modelName
        });
    },

    raccorderElements: function(button, e, eOpts) {
        var controller = this;
        var listRaccordement = controller.getMainWindow().getComponent('listRaccordementGrid');
        var gridPanel = controller.getMainWindow().down('panel');

        var leftSelection = gridPanel.getComponent('gridLeft').getSelectionModel().getSelection();
        var rightSelection = gridPanel.getComponent('gridRight').getSelectionModel().getSelection();

        var raccordementsJSON = [];
        var shouldSyncStore = false;
        for (var i = 0; i < leftSelection.length; i++) {
            for (var j = 0; j < rightSelection.length; j++) {
                var attribute = controller.createRaccordementAttribute(listRaccordement.getModelRaccordement(), controller.getMainWindow().getActiveModel(), leftSelection[i].data, rightSelection[j].data);
                var recordIndex = listRaccordement.getStore().findBy(function(record, id) {
                    if (record.get('modelName') === listRaccordement.getModelRaccordement() && record.get('sourceName') === attribute.data.sourceName && record.get('targetName') === attribute.data.targetName) {
                        return true;
                    }
                    return false;
                });
                if (recordIndex === -1) {
                    raccordementsJSON.push({
                        'model': controller.getMainWindow().getActiveModel(),
                        'source': leftSelection[i].data,
                        'target': rightSelection[j].data
                    });
                    listRaccordement.getStore().insert(0, attribute);
                    shouldSyncStore = true;
                }
            }
        }

        if (shouldSyncStore) {
        	controller.syncListRaccordement(listRaccordement);
        }
    },

    deleteRaccordement: function(button) {
        var controller = this;
        var listRaccordement = controller.getMainWindow().getComponent('listRaccordementGrid');
        var selection = listRaccordement.getSelectionModel().getSelection();

        listRaccordement.getStore().remove(selection);
        controller.syncListRaccordement(listRaccordement);
    },

    init: function(application) {
        this.control({
            'window': {
                openModeleRaccordement: this.openModeleRaccordement
            },
            "#btRaccorderElements": {
                click: this.raccorderElements
            },
            'listRaccordementGrid button[action=delete]': {
                click: this.deleteRaccordement
            }
        });
    }
});
