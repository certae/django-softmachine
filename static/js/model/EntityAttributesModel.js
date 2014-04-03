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
        name: 'pk'
    }, {
        name: 'fk'
    }, {
        name: 'isRequired'
    }, {
        name: 'isNullable'
    }]
}); 