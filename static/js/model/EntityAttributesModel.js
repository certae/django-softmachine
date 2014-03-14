
Ext.define('ProtoUL.model.EntityAttributesModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field'
    ],

    fields: [
        {
            name: 'name'
        },
        {
            name: 'datatype'
        },
        {
            name: 'unique'
        },
        {
            name: 'pk'
        }
    ]
});