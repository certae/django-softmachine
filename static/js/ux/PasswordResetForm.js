/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.ux.PasswordResetForm', {
	extend: 'Ext.form.Panel',
	alias: 'widget.passwordResetForm',

	title: _SM.__language.Title_Window_Password_Change,
	floating: true,
	centered: true,
	closable: true,
	modal: true,
	width: 400,
	height: 200,
	bodyPadding: 5,
	labelWidth: 120,

	// Fields will be arranged vertically, stretched to full width
	layout: 'anchor',
	defaults: {
		anchor: '100%'
	},

	// The fields
	username: '',
	defaultType: 'textfield',
	items: [{
		fieldLabel: _SM.__language.Textfield_User_Login,
		name: "login",
		value: this.username
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
			specialkey: function(f, e) {
				if (e.getKey() == e.ENTER) {
					var changeButton = Ext.ComponentQuery.query('button[itemId=btChangePWD]')[0];
					changeButton.handler.call(changeButton);
				}
			}
		}
	}],

	// Reset and Submit buttons
	buttons: [{
		itemId: 'btChangePWD',
		text: _SM.__language.Text_change_Password_Button,
		iconCls: 'st-key-go',
		formBind: true,
		disabled: true,
		handler: function(btn) {
			var form = this.up('form').getForm();
			if (form.isValid()) {
				form.submit({
					url: '/protoLib/submitChangePassword/',
					method: 'POST',
					scope: this,
					success: function(form, action) {
						Ext.Msg.alert("Success", _SM.__language.Message_Success_Password_Change, function(btn) {
							if (btn == 'ok') {
								Ext.destroy(Ext.ComponentQuery.query('passwordResetForm'));
							}
						});
					},
					failure: function(form, action) {
						Ext.Msg.alert('Failed', action.result.message);
					}
				});
			}
		}
	}],
	renderTo: Ext.getBody()
}); 