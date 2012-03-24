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
        'ProtoUL.ux.BoxReorderer',
        'ProtoUL.ux.Printer',
        'ProtoUL.ux.HeaderToolTip',
        'Ext.util.Cookies', 
        'Ext.Ajax'
    ],


    launch: function () {

        // Add csrf token to every ajax request
        var token = Ext.util.Cookies.get('csrftoken');
        if(!token) {
            Ext.Error.raise("Missing csrftoken cookie");
        } else {
            Ext.Ajax.defaultHeaders = Ext.apply(Ext.Ajax.defaultHeaders || {}, {
                'X-CSRFToken' : token
            });
        }

        // 
        Ext.QuickTips.init();
        var app = new ProtoUL.view.Viewport();
        
    }
    
    
});