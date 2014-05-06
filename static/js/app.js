/**
 * 
 * @author Dario Gomez 
 * http://

 */

Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    name: 'ProtoUL',
    appFolder: 'static/js',

    requires: ['Ext.window.MessageBox', 'Ext.toolbar.Paging', 'Ext.layout.container.Border', 'Ext.util.Cookies', 'Ext.Ajax', 'ProtoUL.view.MenuTree', 'ProtoUL.view.ProtoTabContainer', 'ProtoUL.view.Viewport', 'ProtoUL.view.password.PasswordReset', 'ProtoUL.ux.Printer', 'ProtoUL.ux.GridHeaderToolTip', 'ProtoUL.ux.CheckColumn'],
	models: [
        'EntityAttributesModel'
    ],
    stores: [
        'EntityAttributeStore',
        'DBTypesStore',
        'DiagramModelStore'
    ],
	views: [
        'diagram.DiagramMainView',
        'diagram.DiagramMenu',
        'diagram.DiagramCanvas',
        'diagram.DiagramToolbar',
        'diagram.EntityEditor',
        'diagram.EntityAttributes',
        'diagram.TableContextMenu',
        'diagram.DatabaseMenu',
        'searchmodel.LiveSearchGridPanel',
        'searchmodel.SearchBottomBar',
        'ComboBoxPrompt'
    ],
	controllers: [
		'PasswordManager',
		'DiagramController',
		'DiagramMenuController'
	],
	
    launch: function () {

        Ext.QuickTips.init();
        
        if (window.isPasswordReseted === 'True') {
			this.showResetPasswordForm();
        } else {
        	this.showLogin();
        }

    },
    showLogin: function() {

        var me = this;

        var options = {
            scope: me, 
            success: function ( obj, result, request ) {
                myWin.hide();
                
                // Globally changing the text of Cancel and Save buttons;
                Ext.grid.RowEditor.prototype.saveBtnText = _SM.__language.Text_Save_Button;
                Ext.grid.RowEditor.prototype.cancelBtnText = _SM.__language.Text_Cancel_Button;
                
                var app = new ProtoUL.view.Viewport();

                Ext.destroy(Ext.ComponentQuery.query('protoLogin'));

            }
        };
        
        var myWin  = Ext.widget('window', {
            constrain: true, 
            iconCls: 'st-user-who',
            title: 'ART - Identification',
            layout: 'fit',
            
            width: 450,
            height: 135,
            
            modal: true,
            items: [{
                xtype: 'protoLogin',
                options: options
            }]
        });
        
        myWin.show();
    },
    
    showResetPasswordForm: function() {
    	var resetForm = Ext.create('ProtoUL.view.password.PasswordReset');
        resetForm.show();
    }
});

// Add csrf token to every ajax request
Ext.Ajax.on('beforerequest', function(conn, options) {
    if ( typeof (options.headers) == "undefined") {
        options.headers = {
            'X-CSRFToken': Ext.util.Cookies.get('csrftoken')
        };
    } else {
        options.headers.extend({
            'X-CSRFToken': Ext.util.Cookies.get('csrftoken')
        });
    }
}, this); 