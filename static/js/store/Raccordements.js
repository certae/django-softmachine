/**
 * @author Giovanni Victorette
 */

Ext.define('ProtoUL.store.Raccordements', {
    extend: 'Ext.data.Store',

    requires: [
        'ProtoUL.model.Raccordement',
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json'
    ],
	
    sorters: ['sourceName', 'targetName', 'modelName'],
    groupField: 'modelName',
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'ProtoUL.model.Raccordement',
            storeId: 'RaccordementStore',
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});