/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.view.raccordement.ListRaccordement', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.listRaccordementGrid',
    
    itemId: 'listRaccordementGrid',
    frame: true,
    store: 'Raccordements',
    width: 750,
    height: 300,
    title: 'Raccordement',
    modelRaccordement: null,
    // features: [groupingFeature],
    columns: [{
        text: 'Element raccordant',
        flex: 1,
        dataIndex: 'sourceName'
    }, {
        text: 'Element raccorde',
        flex: 1,
        dataIndex: 'targetName'
    }, {
        text: 'Modele de raccordement',
        flex: 1,
        dataIndex: 'modelName'
    }],
    
    getModelRaccordement: function() {
    	return this.modelRaccordement;
    },
    
    setModelRaccordement: function(model) {
    	this.modelRaccordement = model;
    }
}); 