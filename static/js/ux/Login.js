
/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.ux.Login', {
    extend: 'Ext.form.Panel',
    alias: 'widget.protoLogin',
    bodyStyle: "padding:10px",
    labelWidth: 120,
    labelAlign: 'right',
    redirectUrl: false,
    username: '',

    defaults: {
        xtype: "textfield",
        anchor: "100%",
        enableKeyEvents: true
    },

    initComponent: function () {

        this.submitButton = new Ext.Button({
            text: _SM.__language.Text_Validate_Login_Button,
            iconCls: "st-user-go",
            scope: this,
            handler: this.submitLogin
        });

        this.resetButton = new Ext.Button({
            text: _SM.__language.Text_Forgotten_Password,
			iconCls : "st-user-who",
            scope: this,
            handler: this.resetPassword
        });

		// If we decide to use a button to change pws using a single page.
		this.changeButton = new Ext.Button({
			text : 'change password',
			iconCls : "st-key-go",
			scope : this,
			handler : this.changePassword
		});

        Ext.apply(this, {
            items: [{
                fieldLabel: _SM.__language.Textfield_User_Login,
                name: "login",
                value: this.username,
                listeners: {
                    scope: this,
                    keydown: this.onKeyEnter
                }
            }, {
                fieldLabel: _SM.__language.Textfield_Password_Login,
                inputType: "password",
                name: "password",
                listeners: {
                    scope: this,
                    keydown: this.onKeyEnter
                }
            }], 
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
				items : [{
					xtype : 'tbtext',
					flex : 1,
					itemId : 'stLogin'
				}, this.submitButton, this.resetButton]
            }]
            
        });

        this.callParent(arguments);
		this.stLogin = this.dockedItems.items[0].getComponent('stLogin');
        
        this.on('afterlayout', function () {
            if (this.username == '') {
                this.getForm().findField('login').focus();
            } else {
                this.getForm().findField('password').focus();
            }
		});

    },

    onKeyEnter: function (me, e) {
        if (e.getKey() == e.ENTER) {
			this.submitLogin();
        }
    },

    submitLogin: function (btn) {
		if (!btn) {
			btn = this.submitButton;
		}
        btn.disable();
        
		var form = this.getForm(), me = this;

        Ext.applyIf(this.options, {
            scope: this,
            success: Ext.emptyFn,
            failure: Ext.emptyFn
        });
        
        if (form.isValid()) {
            btn.setIconCls("st-loading");
            form.submit({
                method: 'POST',
                url: _SM._PConfig.urlGetUserRights ,
                scope: me,

                // waitTitle:'Connecting', 
                // waitMsg:'Sending data...',
                // success: this.submitLoginCallback,
                // failure: this.submitLoginCallback, 
                success: function(result, request) {
					_SM._UserInfo = request.result.userInfo;
					_SM.__language = request.result.language;

                    // Incializa los permisos 
					_SM._UserInfo.perms = {};
                    
                    me.options.success.call( me.options.scope, result, request);
                },
                failure: function(result, request) {
                    try {
                        me.showFormError( request.result.message );
                    } catch(e) {
                        me.showFormError( request.response.responseText );
                    }
                    me.options.failure.call( me.options.scope, result, request);
                }
            });
        } else {
           btn.enable();
        }
    },

    showFormError: function ( errMsg ) {
        this.stLogin.setText( errMsg  ); 
        this.submitButton.enable();
        this.submitButton.setIconCls("icon-ok");
        this.getForm().findField('login').focus();
    },

    resetPassword: function (btn) {
        Ext.Msg.prompt(_SM.__language.Title_Window_Email_Request, _SM.__language.Message_Enter_Email, function (btn, email) {
            if (btn == 'ok') {
                Ext.Ajax.request({
					url : _SM._PConfig.urlGetPasswordRecovery,
                    params: {
                        email: email
                    },
                    scope: this,
                    success: function (response) {
						json = Ext.decode(response.responseText);
                        if (json.success) {

                            Ext.Msg.show({
                                title: _SM.__language.Message_Success,
                                msg:   _SM.__language.Message_Email_Forgotten_Password,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO
                            });
                        } else {

                            Ext.Msg.show({
                                title: Message_Error,
                                msg: json.msg,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.WARNING
                            });
                        }
                    },
                    failure: function () {
                        Ext.Msg.show({
                            title: _SM.__language.Message_Error,
                            msg: _SM.__language.Message_Error_Login,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                    }
				});

            }

		}, this);
	},
	// TODO validate, delete if no needed
	changePassword : function(btn) {
		Ext.create('ProtoUL.ux.PasswordResetForm').show();
    }
});