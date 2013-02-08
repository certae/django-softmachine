Ext.define('Isecure.store.stoEntorno', {
    extend: 'Ext.data.Store',
    model: 'Isecure.model.ModEntorno',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        method: 'POST',
        url: 'Login/TraerEntornos',
        reader: {
            type: 'json',
            root: 'entornos'
        }
    }
});