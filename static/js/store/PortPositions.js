/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.store.PortPositions', {
    extend: 'Ext.data.Store',

    fields: ['id', 'description'],
    data: [
        {"id": "left","description": "Left"}, 
        {"id": "right","description": "Right"}, 
        {"id": "top","description": "Top"}, 
        {"id": "bottom","description": "Bottom"}
    ]
}); 