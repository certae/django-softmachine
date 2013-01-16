Ext.define('Isecure.store.stoIconPanel', {
    extend:'Ext.data.Store',
    model: 'Isecure.model.ModIconPanel',
    autoLoad:true,
    proxy: {
        type: 'ajax',
        url: '/Menu/PanelControl',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});