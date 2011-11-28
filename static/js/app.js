/**
 * 
 * @author Dario Gomez 
 * http://

 */

// Ext.require('Ext.toolbar.Paging');
// Ext.require('Ext.layout.container.Border');

Ext.Loader.setConfig({enabled: true});

Ext.application({
    name: 'ProtoUL',
    appFolder: 'static/js',

    requires: [
        'Ext.toolbar.Paging', 
        'Ext.layout.container.Border',
        'ProtoUL.view.Viewport',
    ],

    // controllers: [
        // 'Contacts'
    // ],

    // autoCreateViewport: true
    launch: function() {

        var app = new ProtoUL.view.Viewport();
        
    }
    
    
});