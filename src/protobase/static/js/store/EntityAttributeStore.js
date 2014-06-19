
Ext.define('ProtoUL.store.EntityAttributeStore', {
    extend: 'Ext.data.Store',

    requires: [
        'ProtoUL.model.EntityAttributesModel',
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'ProtoUL.model.EntityAttributesModel',
            storeId: 'EntityAttributeStore',
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});