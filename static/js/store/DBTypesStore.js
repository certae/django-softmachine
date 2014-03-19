Ext.define('ProtoUL.store.DBTypesStore', {
    extend: 'Ext.data.Store',

    requires: ['Ext.data.proxy.Memory', 'Ext.data.reader.Json'],
    data: [{
        typeID: 1,
        typeName: 'CharField'
    }, {
        typeID: 2,
        typeName: 'TextField'
    }, {
        typeID: 3,
        typeName: 'BooleanField'
    }, {
        typeID: 4,
        typeName: 'IntegerField'
    }, {
        typeID: 5,
        typeName: 'DateField'
    }, {
        typeID: 6,
        typeName: 'DecimalField'
    }],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: Ext.define('DBTypes', {
            	extend: 'Ext.data.Model',
                fields: [{
                    name: 'typeID',
                    type: 'int'
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