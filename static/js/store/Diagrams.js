Ext.define('ProtoUL.store.Diagrams', {
    extend: 'Ext.data.Store',
    model: 'ProtoUL.model.Diagram',
    autoLoad: false,
 
    proxy: {
        type: 'ajax',
        api: {
            create: '/protoLib/createDiagram/',
            read: '/protoLib/listDiagrams/',
            update: '/protoLib/updateDiagram/',
            destroy: '/protoLib/deleteDiagram/',
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
        }
    }
});