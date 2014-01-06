/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.controller.PasswordManager', {
    extend: 'Ext.app.Controller',
    
    views : ['password.PasswordReset'],
 
    init: function() {
        this.control({
            'passwordForm button[action=changepassword]': {click: this.changepassword}
        });
    },
 
    changepassword: function(button) {
        var form = button.up('form').getForm();
        if (form.isValid()) {
            form.submit({
            	url: _SM._PConfig.urlSubmitChangePassword,
                method: 'POST',
                scope: this,
                success: function(form, action) {
                	// fr : Le mot de passe a été changé avec succès
                	Ext.Msg.alert("Success", _SM.__language.Message_Success_Password_Change , function(btn) {
                		if (btn == 'ok') {
	                    	Ext.Ajax.request({
								url: '/protoExt', 
								success : function() {
									window.location = '/protoExt'; 
								}
							});
					    }
                	});
                },
                failure: function(form, action) {
                    Ext.Msg.alert('Failed', action.result.message);
                }
            });
        }
    }
});