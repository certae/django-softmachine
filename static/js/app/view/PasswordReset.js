/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoPWD.view.PasswordReset', {
    extend: 'Ext.form.Panel',
    alias: 'widget.passwordForm',
 	
 	title: 'Changement de votre mot de passe',
 	bodyPadding: 5,
    width: 350,
    
    // The form will submit an AJAX request to this URL when submitted
    //url: _SM._PConfig.urlSubmitChangePassword,
    
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
	    value: this.username,
	    // listeners: {
	        // scope: this,
	        // keydown: this.onKeyEnter
	    // }
    },{
        xtype: 'textfield',
        fieldLabel: 'mot de passe actuel',
        inputType: 'password',
        name: 'current',
        width: 120
    },
    {
        fieldLabel: 'Nouveau mot de passe',
        name: 'newPassword1',
        inputType: 'password',
        allowBlank: false
    },{
        fieldLabel: 'Confirmation',
        name: 'newPassword2',
        inputType: 'password',
        allowBlank: false
    }],
    
    // Reset and Submit buttons
    buttons: [{
        text: 'Reset',
        handler: function() {
            this.up('form').getForm().reset();
        }
    }, {
        text: 'Changer le mot de passe',
        iconCls:'st-key-go',
        formBind: true, //only enabled once the form is valid
        disabled: true,
        handler: function() {
            var form = this.up('form').getForm();
            if (form.isValid()) {
                form.submit({
                	//url: '/protoLib/protoGetUserRights/',
                	url: '/protoLib/submitChangePassword/',
                    method: 'POST',
                    scope: this,
                    success: function(form, action) {
                    	Ext.Msg.alert("Success", "Le mot de passe a été changé avec succès");
                       	//Ext.Msg.alert('Success', request.result.message);
                    },
                    failure: function(form, action) {
                        Ext.Msg.alert('Failed', action.result.msg);
                    }
                });
            }
        }
    }],
    renderTo: Ext.getBody()
});