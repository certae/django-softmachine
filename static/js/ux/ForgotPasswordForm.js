Ext.define('ProtoUL.ux.ForgotPasswordForm', {
	extend: 'Ext.window.Window',
	alias: 'widget.forgotPasswordForm',
	
	requires: ['Ext.form.Panel','Ext.form.field.Text'],
	
    title: _SM.__language.Title_Window_Email_Request,
    height: 160,
    width: 400,
    layout: 'fit',
    closable: true,
    items: [{
        xtype: 'form',
        frame: false,
        border: 0,
        layout: {
            type: 'hbox',
            align: 'middle'
        },
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 60
        },
        items: [{
            xtype: 'container',
            flex: 1,
            padding: 10,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: _SM.__language.Textfield_User_Login,
                name: 'login',
                allowBlank: false,
                flex: 1,
                listeners: {
                    afterrender: function(field) {
                        field.focus(false, 500);
                    },
                    blur: function() {
                        this.setValue(this.getValue().trim());
                    }
                },
                validator: function(value) {
					if (value === "") {
                        return "Empty field";
                    }
                    return true;
                }
            }, {
                xtype: 'textfield',
                fieldLabel: _SM.__language.Textfield_User_Email,
                name: 'email',
                vtype: 'email',
                allowBlank: false,
                flex: 1,
				listeners: {
					specialkey: function(f, e) {
						if (e.getKey() == e.ENTER) {
							var submitButton = Ext.ComponentQuery.query('button[itemId=btForgotPWDForm]')[0];
							submitButton.handler.call(submitButton);
						}
					}
				}
            }]
        }]
    }],
    buttons: [{
        text: 'Envoyer',
        itemId: 'btForgotPWDForm',
        iconCls: "st-key-go",
        handler: function(btn) {
            var resetButton = this;
            var form = this.up('.window').items.get(0).form;
            if (form.isValid()) {
                resetButton.setIconCls("st-loading");
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
                        resetButton.setIconCls("st-key-go");
                    },
                    failure: function(form, action) {
                        Ext.Msg.show({
                            title: _SM.__language.Message_Error,
                            msg: action.result.message,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                        resetButton.setIconCls("st-key-go");
                    }
                });
            }
        }
    }]
}); 