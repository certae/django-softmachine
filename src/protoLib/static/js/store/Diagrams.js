Ext.define('ProtoUL.store.Diagrams', {
    extend: 'Ext.data.Store',
    model: 'ProtoUL.model.Diagram',
    autoLoad: false,
 
    proxy: {
        type: 'ajax',
        api: {
            create: _SM._PConfig.createDiagram,
            read: _SM._PConfig.listDiagrams,
            update: _SM._PConfig.updateDiagram,
            destroy: _SM._PConfig.deleteDiagram,
        },
        reader: {
            type: 'json',
            root: 'diagrams',
            successProperty: 'success'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            encode: true,
            root: 'diagrams'
        },
        pageParam:  false,
        startParam: false,
      	limitParam: false
    }
});