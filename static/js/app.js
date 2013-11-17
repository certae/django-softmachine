/**
 * 
 * @author Dario Gomez 
 * http://

 */

// Ext.require('Ext.toolbar.Paging');
// Ext.require('Ext.layout.container.Border');

//borrar el body:  ( para quitar la mascara ) 
//document.getElementById('Idbody').innerHTML = "";

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
        'ProtoUL.ux.CheckColumn' 
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

/*
       Ext.Ajax.request({
            method: 'POST',
            // waitTitle:'Connecting', 
            // waitMsg:'Sending data...',
            url: _SM._PConfig.urlGetUserRights,
            
            // success: this.submitLoginCallback,
            // failure: this.submitLoginCallback, 
            success: function (result) {
                resp = Ext.decode(result.responseText);
                _SM._UserInfo = resp.userInfo
                //me.options.success.call(me.options.scope, result, request);
                var app = new ProtoUL.view.Viewport();
            },
            failure: function (result, request) {
                //pendiente hmaury
                //_SM._UserInfo = request.result.userInfo
                //me.showFormError(request.result.message);
                //me.options.failure.call(me.options.scope, result, request);
            }
        });

*/
        
        // var app = new ProtoUL.view.Viewport();
        
    }, 
    
    showLogin: function(  ) {

        var me = this 

        var options = {
            scope: me, 
            success: function ( obj, result, request ) {
                myWin.hide()
                
                // Globally changing the text of Cancel and Save buttons;
                Ext.grid.RowEditor.prototype.saveBtnText = _SM.__language.Text_Save_Button;
                Ext.grid.RowEditor.prototype.cancelBtnText = _SM.__language.Text_Cancel_Button;
                
                var app = new ProtoUL.view.Viewport();
                
                // destruye el login 
                Ext.destroy( Ext.ComponentQuery.query('protoLogin') )     

            }
            // failure: function ( obj, result, request) { 
                // _SM.errorMessage( 'ProtoDefinition Error :', myZoomModel + ': protoDefinition not found')
            // }
        }
        
        var myWin  = Ext.widget('window', {
            constrain: true, 
            iconCls: 'st-user-who',
            title: 'ART - Identification',
            layout: 'fit',
            
            width: 420,
            height: 135,
            // frame: true,
            
            modal: true,
            items: [ { xtype: 'protoLogin', options : options  }]
        });
        
        myWin.show()

    }, 
    
    
    
});


