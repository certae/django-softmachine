/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.store.DiagramModelStore', {
    extend: 'Ext.data.JsonStore',
    storeId: 'diagramModelStore',
    fields: [{
        name: 'id', mapping: 'id'
    }, {
        name: 'tableName'
    }]
}); 