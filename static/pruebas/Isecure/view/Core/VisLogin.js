Ext.define("Isecure.view.Core.VisLogin", {
    extend: 'Ext.window.Window',
    alias: 'widget.vislogin',
    region:'center',
    border: 0,
    autoHeight: true,
    width:300,
    title: _SM.__language.Title_Login_View,
    closable:false,
    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                        {
                            xtype: 'form',
                            
                            frame:true,
                            items: [

                                   
                                    {
                                        xtype: 'textfield',
                                        width: 255,
                                        padding:10,
                                        labelWidth: 60,
                                        name: 'usuario',
                                        //emptyText: 'Usuario',
                                        fieldLabel: _SM.__language.Textfield_User_Login,
                                        labelWidth: 70
                                    },
                                    {
                                        xtype: 'textfield',
                                        inputType: 'password',
                                        padding: 10,
                                        width: 255,
                                        name: 'contrasena',
                                        //emptyText: 'Clave',
                                        fieldLabel: _SM.__language.Textfield_Password_Login,
                                        labelWidth: 70
                                    },

                                    
                                    {
                                        xtype: 'combobox',
                                        labelWidth: 70,
                                        name: 'cmbAplicacion',
                                        width: 255,
                                        padding: 10,
                                        fieldLabel: _SM.__language.Text_Combo_App,
                                        store: 'stoAplicacion',
                                        displayField: 'Aplicacion',
                                        valueField: 'idaplicacion',
                                        hidden: true,
                                        queryMode: 'local'
                                    },
                                    {
                                        xtype: 'combobox',
                                        labelWidth: 70,
                                        name: 'cmbEntorno',
                                        width: 255,
                                        padding: 10,
                                        fieldLabel: _SM.__language.Text_Combo_Env,
                                        store: 'stoEntorno',
                                        displayField: 'Descripcion',
                                        valueField: 'CodEntorno',
                                        hidden: true,
                                        queryMode: 'local'

                                    }
                                     
                                    


                            ],
                            buttons: [
                                {
                                    xtype: 'button',
                                    text: _SM.__language.Text_Accept_Button,
                                    action: 'clickLogin',
                                    iconCls: 'icon-login'
                                    
                                },
                                 {
                                     xtype: 'button',
                                     text: _SM.__language.Text_Button_Load_App,
                                     action: 'clickIniciarSesion',
                                     iconCls: 'icon-login',
                                     hidden: true
                                 },{
                                     xtype: 'button',
                                     text: _SM.__language.Text_Button_Close_Session,
                                     action: 'clickCerrarSesion',
                                     iconCls: 'icon-logout',
                                     hidden: true
                                 }

                            ]

                        }

            ]


        });

        me.callParent(arguments);
    }

});