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

        'ProtoUL.ux.ToolbarDroppable',
        'ProtoUL.ux.BoxReorderer'
    ],

    // controllers: [
        // 'Contacts'
    // ],

    // autoCreateViewport: true
    launch: function () {

        Ext.QuickTips.init();
        var app = new ProtoUL.view.Viewport();
        
    }
    
    
});