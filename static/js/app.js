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
        'Ext.window.MessageBox',
        'Ext.toolbar.Paging', 
        'Ext.layout.container.Border',
        
        'Ext.ux.ToolbarDroppable',
        'Ext.ux.BoxReorderer',
        
        'Ext.util.Cookies', 
        'Ext.Ajax',
        
        'ProtoUL.view.MenuTree', 
        'ProtoUL.view.ProtoTabContainer',          'ProtoUL.view.Viewport',

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

        var me = this 

        var options = {
            scope: me, 
            success: function ( obj, result, request ) {
                this.formLoaded = true;
                myWin.hide()
                var app = new ProtoUL.view.Viewport();
            }
            // failure: function ( obj, result, request) { 
                // errorMessage( 'ProtoDefinition Error :', myZoomModel + ': protoDefinition not found')
            // }
        }
        
        var myWin  = Ext.widget('window', {
            constrain: true, 
            iconCls: 'st-user-who',
            title: 'ART - Identification',
            layout: 'fit',
            
            width: 360,
            height: 135,
            // frame: true,
            
            modal: true,
            items: [ { xtype: 'protoLogin', options : options  }]
        });
        
        myWin.show()

    }, 
    
    
    
});


