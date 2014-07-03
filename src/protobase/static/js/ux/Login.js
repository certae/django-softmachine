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

    initComponent: function() {

        this.submitButton = new Ext.Button({
            text: _SM.__language.Text_Validate_Login_Button,
            iconCls: "st-user-go",
            scope: this,
            handler: this.submitLogin
        });

        this.resetButton = new Ext.Button({
            itemId: 'resetPWDButton',
            text: _SM.__language.Text_Forgotten_Password,
            iconCls: "st-user-who",
            scope: this,
            handler: this.resetPassword
        });

        // If we decide to use a button to change pws using a single page.
        this.changeButton = new Ext.Button({
            text: _SM.__language.Text_change_Password_Button,
            iconCls: "st-key-go",
            scope: this,
            handler: this.changePassword
        });

        Ext.apply(this, {
            items: [{
                fieldLabel: _SM.__language.Textfield_User_Login,
                itemId: 'loginField',
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
                items: [{
                    xtype: 'tbtext',
                    flex: 1,
                    itemId: 'stLogin'
                }, this.submitButton, this.resetButton, this.changeButton]
            }]

        });

        this.callParent(arguments);
        this.stLogin = this.dockedItems.items[0].getComponent('stLogin');

        this.on('afterlayout', function() {
            if (this.username == '') {
                this.getForm().findField('login').focus();
            } else {
                this.getForm().findField('password').focus();
            }
        });

    },

    onKeyEnter: function(me, e) {
        if (e.getKey() == e.ENTER) {
            this.submitLogin();
        }
    },

    submitLogin: function(btn) {
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
                url: _SM._PConfig.urlGetUserRights,
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

                    me.options.success.call(me.options.scope, result, request);
                },
                failure: function(result, request) {
                    try {
                        me.showFormError(request.result.message);
                    } catch(e) {
                        me.showFormError(request.response.responseText);
                    }
                    me.options.failure.call(me.options.scope, result, request);
                }
            });
        } else {
            btn.enable();
        }
    },

    showFormError: function(errMsg) {
        var tip = window.Ext.create('Ext.tip.ToolTip', {
            html: errMsg,
            autoShow: true,
            autoScroll: true,
            focusOnToFront: true,
            autoHide: true,
            stateful: false,
            bodyStyle: 'background:#ffc;',
            getTargetXY: function() {
                var resetButton = Ext.ComponentQuery.query('button[itemId=resetPWDButton]')[0];
                var x = resetButton.getPosition()[0];
                var y = resetButton.getPosition()[1];
                return [x, y];
            },
            listeners: {
                hide: function() {
                    tip.destroy();
                    tip = null;
                }
            }
        });
        tip.show();

        this.submitButton.enable();
        this.submitButton.setIconCls("st-user-go");
        this.getForm().findField('login').focus();
    },

    resetPassword: function(btn) {
        var resetForm = Ext.create('ProtoUL.view.password.ForgotPasswordForm');
        resetForm.show();
    },
    
    changePassword: function(btn) {
        Ext.create('ProtoUL.view.password.PasswordReset').show();
    }
});
