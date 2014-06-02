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

    loadDataToGridPanel: function(grid, model) {
        grid.setTitle(model.modelName);
        grid.getStore().loadData(model.attributes);
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

                if (outcome.models[2]) {
                    var listRaccordement = controller.getMainWindow().getComponent('listRaccordementGrid');
                    listRaccordement.setModelRaccordement(outcome.models[2].nomModele);
                    listRaccordement.getStore().loadData(outcome.models[2].raccordements);
                }
            }
        };
        failureFunction = function(response) {
            console.log('');
        };
        this.createAjaxRequest('rai/getModeleRaccordement/', "GET", params, null, successFunction, failureFunction);
    },

    createRaccordementAttribute: function(modelName, sourceName, targetName) {
        return Ext.create('ProtoUL.model.Raccordement', {
            sourceName: sourceName,
            targetName: targetName,
            modelName: modelName
        });
    },

    raccorderElements: function(button, e, eOpts) {
        var controller = this;
        var listRaccordement = controller.getMainWindow().getComponent('listRaccordementGrid');
        var gridPanel = controller.getMainWindow().down('panel');
        var leftGrid = gridPanel.getComponent('gridLeft');
        var rightGrid = gridPanel.getComponent('gridRight');

        var leftSelection = leftGrid.getSelectionModel().getSelection();
        var rightSelection = rightGrid.getSelectionModel().getSelection();

        var raccordementsJSON = [];
        for (var i = 0; i < leftSelection.length; i++) {
            for (var j = 0; j < rightSelection.length; j++) {
                var attribute = controller.createRaccordementAttribute(listRaccordement.getModelRaccordement(), leftSelection[i].data.attributeName, rightSelection[j].data.attributeName);
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
	                listRaccordement.getStore().insert(listRaccordement.getStore().data.length, attribute);
                }
            }
        }
		// TODO finir le save...
        // url = 'rai/createRaccordement/'
    },

    init: function(application) {
        this.control({
            'window': {
                openModeleRaccordement: this.openModeleRaccordement
            },
            "#btRaccorderElements": {
                click: this.raccorderElements
            }
        });
    }
});
