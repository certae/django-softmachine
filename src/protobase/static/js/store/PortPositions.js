/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.store.PortPositions', {
    extend: 'Ext.data.Store',

    fields: ['id', 'description'],
    data: [
        {"id": "left","description": "Gauche"},
        {"id": "right","description": "Droite"},
        {"id": "top","description": "Haut"},
        {"id": "bottom","description": "Bas"}
    ]
}); 