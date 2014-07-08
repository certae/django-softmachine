/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.controller.PasswordManager', {
    extend: 'Ext.app.Controller',

    views: ['password.PasswordReset', 'password.ForgotPasswordForm'],

    init: function() {
        this.control({
            'passwordForm button[action=changepassword]': {
                click: this.changepassword
            },
            'forgotPasswordForm button[action=forgotpassword]': {
                click: this.forgotpassword
            },
        });
    },

    changepassword: function(button) {
        var form = button.up('form').getForm();
        if (form.isValid()) {
        	button.setIconCls("st-loading");
            form.submit({
                url: _SM._PConfig.urlSubmitChangePassword,
                method: 'POST',
                scope: this,
                success: function(form, action) {
                    Ext.Msg.alert("Success", _SM.__language.Message_Success_Password_Change, function(btn) {
                        if (btn == 'ok') {
                            Ext.destroy(Ext.ComponentQuery.query('passwordForm'));
                            Ext.Ajax.request({
                                url: 'protoExt',
                                success: function() {
                                    window.location = 'protoExt';
                                }
                            });
                        }
                    });
                },
                failure: function(form, action) {
                    Ext.Msg.alert('Failed', action.result.message);
                    button.setIconCls("st-key-go");
                }
            });
        }
    },

    forgotpassword: function(button) {
        var win = button.up('window'), form = win.down('form').getForm();
        if (form.isValid()) {
            button.setIconCls("st-loading");
            form.submit({
                url: _SM._PConfig.urlGetPasswordRecovery,
                method: 'POST',
                scope: this,
                success: function(form, action) {
                    Ext.Msg.alert(_SM.__language.Message_Success, _SM.__language.Message_Email_Forgotten_Password, function(btn) {
                        if (btn == 'ok') {
                            Ext.destroy(Ext.ComponentQuery.query('forgotPasswordForm'));
                        }
                    });
                    button.setIconCls("st-key-go");
                },
                failure: function(form, action) {
                    Ext.Msg.show({
                        title: _SM.__language.Message_Error,
                        msg: "La connexion au serveur a été interrompue. Si ce problème persiste, contactez l'administrateur du serveur ou le fournisseur de services Internet.",
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                    button.setIconCls("st-key-go");
                }
            });
        }
    }
}); 