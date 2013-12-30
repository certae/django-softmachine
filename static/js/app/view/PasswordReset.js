/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoPWD.view.PasswordReset', {
	extend : 'Ext.form.Panel',
	alias : 'widget.passwordForm',

	title : _SM.__language.Title_Window_Password_Change,
	floating : true,
	centered : true,
	closable : true,
	modal : true,
	width : 400,
	height : 180,
	bodyPadding : 5,
	labelWidth : 120,

	// Fields will be arranged vertically, stretched to full width
	layout : 'anchor',
	defaults : {
		anchor : '100%',
		enableKeyEvents : true
	},

	// The fields
	username : '',
	defaultType : 'textfield',
	items : [{
		fieldLabel : _SM.__language.Textfield_User_Login,
		name : "login",
		value : this.username
	}, {
		xtype : 'textfield',
		fieldLabel : _SM.__language.Textfield_Password_Login,
		inputType : 'password',
		name : 'current',
		width : 120
	}, {
		fieldLabel : _SM.__language.Textfield_New_Password,
		name : 'newPassword1',
		inputType : 'password',
		allowBlank : false
	}, {
		fieldLabel : _SM.__language.Textfield_Confirm_Password,
		name : 'newPassword2',
		inputType : 'password',
		allowBlank : false,
		listeners : {
			// this is used to fire the click event, so the PasswordManager is able to capture the form.
			specialkey : function(f, e) {
				if (e.getKey() == e.ENTER) {
					var changeButton = Ext.getCmp('btChangePWD');
					changeButton.fireEvent('click', changeButton);
				}
			}
		}
	}],

	// Reset and Submit buttons
	buttons : [{
		text : 'Reset',
		handler : function() {
			this.up('form').getForm().reset();
		}
	}, {
		text : _SM.__language.Text_change_Password_Button,
		id : 'btChangePWD',
		iconCls : 'st-key-go',
		formBind : true,
		disabled : true,
		action : 'changepassword'
	}],
	listeners : {
		afterlayout : function() {
			var isPasswordReseted = Ext.util.Cookies.get('isPasswordReseted');
			console.log(isPasswordReseted);
			if (isPasswordReseted) {
				Ext.Msg.show({
					title : _SM.__language.Message_Success,
					msg : _SM.__language.Message_Email_New_Password,
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.INFO
				});
			}
			Ext.util.Cookies.clear('isPasswordReseted');
		}
	},
	renderTo : Ext.getBody()
});
