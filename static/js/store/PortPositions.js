/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.store.PortPositions', {
    extend: 'Ext.data.Store',

    fields: ['id', 'description'],
    data: [
        // {"id": "default","description": "Default"}, 
        {"id": "right","description": "Right"}, 
        {"id": "left","description": "Left"}, 
        {"id": "top","description": "Top"}, 
        {"id": "bottom","description": "Bottom"}
    ]
}); 