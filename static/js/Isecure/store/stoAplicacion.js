Ext.define('Isecure.store.stoAplicacion', {
    extend: 'Ext.data.Store',
    model: 'Isecure.model.ModAplicacion',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        method: 'POST',
        url: 'Login/TraerAplicaciones',
        reader: {
            type: 'json',
            root: 'aplicaciones'
        }
    }
});