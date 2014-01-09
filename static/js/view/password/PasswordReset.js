/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.view.password.PasswordReset', {
    extend: 'Ext.form.Panel',
    alias: 'widget.passwordForm',

    title: _SM.__language.Title_Window_Password_Change,
    floating: true,
    centered: true,
    closable: true,
    modal: true,
    width: 400,
    height: 200,
    bodyPadding: 5,
    labelWidth: 140,

    // Fields will be arranged vertically, stretched to full width
    layout: 'anchor',
    defaults: {
        anchor: '100%',
        enableKeyEvents: true
    },

    // The fields
    username: '',
    defaultType: 'textfield',
    items: [{
        fieldLabel: _SM.__language.Textfield_User_Login,
        name: "login",
        value: this.username,
        listeners: {
            afterrender: function(field) {
                field.focus(false, 500);
            }
        }
    }, {
        xtype: 'textfield',
        fieldLabel: _SM.__language.Textfield_Password_Login,
        inputType: 'password',
        name: 'current',
        width: 120
    }, {
        fieldLabel: _SM.__language.Textfield_New_Password,
        name: 'newPassword1',
        inputType: 'password',
        allowBlank: false
    }, {
        fieldLabel: _SM.__language.Textfield_Confirm_Password,
        name: 'newPassword2',
        inputType: 'password',
        allowBlank: false,
        listeners: {
            // this is used to fire the click event, so the PasswordManager is able to capture the form.
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    var changeButton = Ext.ComponentQuery.query('button[itemId=btChangePWD]')[0];
                    changeButton.fireEvent('click', changeButton);
                }
            }
        }
    }],

    // Reset and Submit buttons
    buttons: [{
        text: _SM.__language.Text_change_Password_Button,
        itemId: 'btChangePWD',
        iconCls: 'st-key-go',
        formBind: true,
        disabled: true,
        action: 'changepassword'
    }],
    listeners: {
        afterlayout: function() {
            if (window.isPasswordReseted === 'True') {
                setTimeout(function() {
                    Ext.Msg.show({
                        title: _SM.__language.Message_Success,
                        msg: _SM.__language.Message_Email_New_Password,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }, 1000);
            }
        }
    },
    renderTo: Ext.getBody()
});
