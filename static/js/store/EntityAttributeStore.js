
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
            data: [
                {
                    name: 'id',
                    datatype: 'Integer',
                    unique: true,
                    pk: true
                },
                {
                    name: 'firstName',
                    datatype: 'string',
                    unique: false,
                    pk: false
                },
                {
                    name: 'lastName',
                    datatype: 'string',
                    unique: false,
                    pk: false
                },
                {
                    name: 'company_fk',
                    datatype: 'Integer',
                    unique: true,
                    pk: false
                }
            ],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});