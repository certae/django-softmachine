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
            text: "vérifier",
            iconCls: "st-user-go",
            scope: this,
            handler: this.submitLogin
        });

        this.resetButton = new Ext.Button({
            text: "mot de passe perdu",
            iconCls: "st-key-go",
            scope: this,
            handler: this.resetPassword
        });

        // this.buttons = [this.submitButton, this.resetButton];


        Ext.apply(this, {
            items: [{
                fieldLabel: "utilisateur",
                name: "login",
                value: this.username,
                listeners: {
                    scope: this,
                    keydown: this.onKeyEnter
                }
            }, {
                fieldLabel: "mot de passe",
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
                items: [
                    { xtype: 'tbtext', flex: 1, itemId : 'stLogin' },
                    this.submitButton, this.resetButton
                ]
            }]
            
        });

        this.callParent(arguments);
        this.stLogin = this.dockedItems.items[0].getComponent( 'stLogin' ) 
        
        this.on('afterlayout', function () {
            if (this.username == '') {
                this.getForm().findField('login').focus();
            } else {
                this.getForm().findField('password').focus();
            }
        })

    },

    onKeyEnter: function (me, e) {
        if (e.getKey() == e.ENTER) {
            this.submitLogin()
        }
    },

    submitLogin: function (btn) {
        btn.disable();
        var form = this.getForm(), 
            me = this

        Ext.applyIf(this.options, {
            scope: this,
            success: Ext.emptyFn,
            failure: Ext.emptyFn
        });
        
        
        if (form.isValid()) {
            btn.setIconCls("st-loading");
            form.submit({
                method: 'POST',
                waitTitle:'Connecting', 
                waitMsg:'Sending data...',
             
                url: _PConfig.urlGetUserRights ,
                scope: me,
                // success: this.submitLoginCallback,
                // failure: this.submitLoginCallback, 
                success: function(result, request) {
                    me.options.success.call( me.options.scope, result, request);
                },
                failure: function(result, request) {
                    me.options.failure.call( me.options.scope, result, request);
                    me.error(result, request);
                }
            });
        } else {
           this.submitButton.enable();
        }
    },

    // submitLoginCallback: function (result, request) {
        // var json = Ext.decode(action.response.responseText);
        // // json.redirect = 'writer'
        // if (json.success === true) {
            // // window.location = json.redirect;
//             
        // }  else {
            // this.error(result, request);
        // } 
//             
    // },

    error: function (form, json) {
        // Ext.Msg.show({
            // buttons: Ext.Msg.OK,
            // animEl: 'elId',
            // title: 'erreur',
            // msg: 'Mauvais utilisateur ou mot de passe',
            // icon: Ext.MessageBox.ERROR
// 
        // });

        
        this.stLogin.setText( 'Error ... ' ); 
        this.submitButton.enable();
        this.submitButton.setIconCls("icon-ok");
        this.getForm().findField('login').focus();
    },

    resetPassword: function (btn) {
        Ext.Msg.prompt("votre email", "Saisissez votre email", function (btn, email) {
            if (btn == 'ok') {
                Ext.Ajax.request({
                    url: '/apps/login/lostpassword',
                    params: {
                        email: email
                    },
                    scope: this,
                    success: function (response) {
                        json = Ext.decode(response.responseText)
                        if (json.success) {

                            Ext.Msg.show({
                                title: 'Succès',
                                msg: 'Un email contenant les instructions vous a été envoyé',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO
                            });
                        } else {

                            Ext.Msg.show({
                                title: 'Erreur',
                                msg: json.msg,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.WARNING
                            });
                        }
                    },
                    failure: function () {
                        Ext.Msg.show({
                            title: 'Erreur',
                            msg: 'Impossible',
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                    }
                })

            }

        }, this)
    }


});


Ext.ux.ChangePass = Ext.extend(Ext.Panel, {
    // title: 'Change password'
    // ,iconCls: 'icon-key'
    border: false,
    initComponent: function () {

        this.form_change_pass = new Ext.FormPanel({
            waitMsgTarget: true,
            labelAlign: 'right',
            labelWidth: 150,
            disabled: false,
            border: false

            ,
            items: [{
                html: 'Changement de votre mot de passe',
                style: 'margin:20px',
                border: false
            },

            {
                xtype: 'textfield',
                fieldLabel: 'mot de passe actuel',
                inputType: 'password',
                name: 'current',
                width: 120
            }, {
                xtype: 'textfield',
                fieldLabel: 'nouveau mot de passe',
                inputType: 'password',
                name: 'new1',
                width: 120
            }, {
                xtype: 'textfield',
                fieldLabel: 'confirmation',
                inputType: 'password',
                name: 'new2',
                width: 120
            }, {
                xtype: 'button',
                text: 'changer le mot de passe',
                iconCls: 'icon-disk',
                style: 'margin-top:20px;margin-left:auto;margin-right:auto',
                listeners: {
                    scope: this,
                    'click': {
                        fn: function (button, e) {
                            var formpanel = button.findParentByType('form');
                            var form = formpanel.getForm();
                            form.el.mask('Loading...');
                            form.submit({
                                url: '/apps/login/changepassword',
                                method: 'POST',
                                scope: this,
                                success: function (form, action) {
                                    Ext.Msg.alert("Success", "Le mot de passe a été changé avec succès");
                                    console.log(this);
                                    this.fireEvent('submitSuccess');
                                },
                                failure: function (form, action) {
                                    form.el.unmask();
                                    Ext.Msg.alert("Failure", action.result.msg);
                                }
                            });
                        }
                    }
                }
            }]


        })
        this.form_change_pass
        this.items = this.form_change_pass;

        // Ext.apply(this, {
        // layout:'fit'
        // ,items:this.form_change_pass
        // })

        Ext.ux.ChangePass.superclass.initComponent.apply(this, arguments);

        this.addEvents(['submitSuccess']);
    }


});