Ext.define('ProtoUL.store.DBTypesStore', {
    extend: 'Ext.data.Store',

    requires: ['Ext.data.proxy.Memory', 'Ext.data.reader.Json'],
    data: [{
        typeID: 'string',
        typeName: 'string'
    }, {
        typeID: 'text',
        typeName: 'text'
    }, {
        typeID: 'bool',
        typeName: 'bool'
    }, {
        typeID: 'int',
        typeName: 'int'
    }, {
        typeID: 'decimal',
        typeName: 'decimal'
    }, {
        typeID: 'sequence',
        typeName: 'sequence'
    }, {
        typeID: 'money',
        typeName: 'money'
    }, {
        typeID: 'combo',
        typeName: 'combo'
    }, {
        typeID: 'date',
        typeName: 'date'
    }, {
        typeID: 'datetime',
        typeName: 'datetime'
    }, {
        typeID: 'time',
        typeName: 'time'
    }],
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: Ext.define('DBTypes', {
            	extend: 'Ext.data.Model',
                fields: [{
                    name: 'typeID',
                    type: 'string'
                }, {
                    name: 'typeName',
                    type: 'string'
                }]
            }),
            storeId: 'storeDBTypes',
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
}); 