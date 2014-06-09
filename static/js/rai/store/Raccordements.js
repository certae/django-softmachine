/**
 * @author Giovanni Victorette
 */

Ext.define('RAI.store.Raccordements', {
    extend: 'Ext.data.Store',

    requires: ['RAI.model.Raccordement', 'Ext.data.proxy.Memory', 'Ext.data.reader.Json'],
    autoLoad: false,

    sorters: ['sourceName', 'targetName', 'modelName'],
    groupField: 'modelName',
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'RAI.model.Raccordement',
            storeId: 'RaccordementStore',
            proxy: {
                type: 'ajax',
                api: {
                    read: 'rai/listRaccordement/',
                    create: 'rai/createRaccordement/',
                    destroy: 'rai/deleteRaccordement/'
                },
                reader: {
                    type: 'json',
                    root: 'raccordements',
                    successProperty: 'success'
                },
                pageParam: false,
                startParam: false,
                limitParam: false
            }
        }, cfg)]);
    }
});
