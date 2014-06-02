/**
 * @author Giovanni Victorette
 */

Ext.define('ProtoUL.store.ElementsDonneeRightGrid', {
    extend: 'Ext.data.Store',

    requires: [
        'ProtoUL.model.ElementDonnee',
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json'
    ],
	
    sorters: ['attributeName', 'entityName'],
    groupField: 'entityName',
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'ProtoUL.model.ElementDonnee',
            storeId: 'ElementsDonneeRGStore',
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});