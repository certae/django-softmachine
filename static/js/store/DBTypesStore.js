Ext.define('ProtoUL.store.DBTypesStore', {
    extend: 'Ext.data.Store',

    requires: ['Ext.data.proxy.Memory', 'Ext.data.reader.Json'],
    data: [{
        typeID: 'string',
        typeName: 'CharField'
    }, {
        typeID: 'text',
        typeName: 'TextField'
    }, {
        typeID: 'bool',
        typeName: 'BooleanField'
    }, {
        typeID: 'int',
        typeName: 'IntegerField'
    }, {
        typeID: 'decimal',
        typeName: 'DecimalField'
    }, {
        typeID: 'sequence',
        typeName: 'SequenceField'
    }, {
        typeID: 'money',
        typeName: 'CurrencyField'
    }, {
        typeID: 'combo',
        typeName: 'ComboField'
    }, {
        typeID: 'date',
        typeName: 'DateField'
    }, {
        typeID: 'datetime',
        typeName: 'DateTimeField'
    }, {
        typeID: 'time',
        typeName: 'TimeField'
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