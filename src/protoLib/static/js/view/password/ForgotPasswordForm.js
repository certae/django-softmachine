Ext.define('ProtoUL.view.password.ForgotPasswordForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.forgotPasswordForm',

    requires: ['Ext.form.Panel', 'Ext.form.field.Text'],

    title: _SM.__language.Title_Window_Email_Request,
    height: 160,
    width: 400,
    layout: 'fit',
    closable: true,
    initComponent: function() {
        this.items = [{
            xtype: 'form',
            bodyPadding: 25,
            centered: true,

            fieldDefaults: {
                anchor: '100%',
                labelAlign: 'left',
                allowBlank: false,
                combineErrors: true,
                msgTarget: 'side',
                labelWidth: 80
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
                        this.setValue(Ext.String.trim(this.getValue()));
                    }
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
                            submitButton.fireEvent('click', submitButton);
                        }
                    }
                }
            }]
        }];
        
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: ['->', {
                text: _SM.__language.Text_Send_Button,
		        itemId: 'btForgotPWDForm',
		        iconCls: "st-key-go",
		        action: 'forgotpassword',
            }]
        }];
 
        this.callParent(arguments);
    }
});
