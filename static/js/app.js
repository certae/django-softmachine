/**
 * 
 * @author Dario Gomez 
 * http://

 */

// Ext.require('Ext.toolbar.Paging');
// Ext.require('Ext.layout.container.Border');

Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', 'static/extjs-4.1.x/examples/ux');

Ext.application({
    name: 'ProtoUL',
    appFolder: 'static/js',

    requires: [
        'Ext.toolbar.Paging', 
        'Ext.layout.container.Border',
        
        'Ext.ux.ToolbarDroppable',
        'Ext.ux.BoxReorderer',
        
        'Ext.util.Cookies', 
        'Ext.Ajax',
        
        'ProtoUL.view.Viewport',
        'ProtoUL.ux.Printer',
        'ProtoUL.ux.GridHeaderToolTip',
        'ProtoUL.ux.GridCheckColumn'
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
        
        this.showLogin()
        
        
        // var app = new ProtoUL.view.Viewport();
        
    }, 
    
    showLogin: function(  ) {
        
         var myWin  = Ext.widget('window', {
            constrain: true, 
            title : 'Login', 
            // closeAction: 'hide',
            width: 400,
            height: 200,
            layout: 'fit',
            // resizable: true,
            modal: true,
            items: [ { xtype: 'protoLogin' }]
        });
        
        
        myWin.show()

    }, 
    
    
    
});


