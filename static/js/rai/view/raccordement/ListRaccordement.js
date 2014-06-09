/**
 * @author Giovanni Victorette
 */
Ext.define('RAI.view.raccordement.ListRaccordement', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.listRaccordementGrid',

    itemId: 'listRaccordementGrid',
    frame: true,
    store: 'Raccordements',
    title: 'Raccordement',
    modelRaccordement: null,

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

    initComponent: function() {
        this.dockedItems = [{
            xtype: 'toolbar',
            items: ['->', {
                iconCls: 'x-tool-rowDel',
                text: _SM.__language.Text_Delete_Button,
                action: 'delete'
            }]
        }];
        this.callParent(arguments);
    },

    getModelRaccordement: function() {
        return this.modelRaccordement;
    },

    setModelRaccordement: function(model) {
        this.modelRaccordement = model;
    }
});
