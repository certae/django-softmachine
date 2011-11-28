/*
 *  Carga los datos del menu
 *  Dgt 11.11  
 */

Ext.define('ProtoUL.model.MenuModel', {
    extend: 'Ext.data.Model',
    alias: 'model.menuModel',
    proxy: {
        method: 'GET',
        type: 'ajax',
        url: _PConfig.urlMenu , 
    }, 

    fields: [
        {name: 'id', type: 'string'},
        {name: 'text', type: 'string'},
        {name: 'leaf', type: 'boolean'},
    ],
    
});
