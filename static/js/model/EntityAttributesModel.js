Ext.define('ProtoUL.model.EntityAttributesModel', {
    extend: 'Ext.data.Model',

    requires: ['Ext.data.Field'],

    fields: [{
        name: 'text'
    }, {
        name: 'id'
    }, {
        name: 'inputPort'
    }, {
        name: 'datatype'
    }, {
        name: 'unique'
    }, {
        name: 'pk'
    }]
}); 