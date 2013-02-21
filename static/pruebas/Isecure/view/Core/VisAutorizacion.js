Ext.define("Isecure.view.Core.VisAutorizacion", {
    extend: 'Ext.window.Window',
    alias: 'widget.visautorizacion',
    region: 'center',
    border: 0,
    height: 400,
    width: 531,
    title: _SM.__language.Title_Aut_View,
    closable: false,
    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                        {
                            xtype: 'form',
                            layout:{
                                type:'hbox'
                            },
                            frame: true,
                            items: [




                                    {
                                        xtype: 'gridpanel',
                                        labelWidth: 70,
                                        name: 'cmbAplicacion',
                                        width: 255,
                                        height:330,
                                        padding: 10,
                                     //   fieldLabel: 'Aplicaci&oacute;n',
                                        store: 'stoAplicacion',
                                       // displayField: 'Aplicacion',
                                      //  valueField: 'idaplicacion',
                                     //   hidden: true,
                                        //  queryMode: 'local',
                                        columns: [
                                               {
                                                   xtype: 'gridcolumn',
                                                   text: _SM.__language.Header_Column_Grid_App,
                                                   dataIndex: 'Aplicacion',
                                                   flex:1
                                               },{
                                                    xtype: 'gridcolumn',
                                                    text: _SM.__language.Header_Column_Grid_App_Id,
                                                    dataIndex: 'IdAplicacion',
                                                    hidden:true,
                                                    flex:1
                                                }

                                        ]
                                    },
                                    {
                                        xtype: 'gridpanel',
                                        labelWidth: 70,
                                        name: 'cmbEntorno',
                                        width: 255,
                                        height: 330,
                                        padding: 10,
                                       // fieldLabel: 'Entorno',
                                        store: 'stoEntorno',
                                      //  displayField: 'Descripcion',
                                      //  valueField: 'CodEntorno',
                                      //  hidden: true,
                                        //   queryMode: 'local',
                                        columns: [
                                              {
                                                  xtype: 'gridcolumn',
                                                  text: _SM.__language.Header_Column_Grid_Env,
                                                  dataIndex: 'Descripcion',
                                                  flex: 1
                                              }, {
                                                  xtype: 'gridcolumn',
                                                  text: _SM.__language.Header_Column_Grid_Env_Id,
                                                  dataIndex: 'CodEntorno',
                                                  hidden: true,
                                                  flex: 1
                                              }

                                        ]

                                    }




                            ],
                            buttons: [
                               
                                 {
                                     xtype: 'button',
                                     text: _SM.__language.Text_Button_Load_App,
                                     action: 'clickIniciarSesion',
                                     iconCls: 'icon-login',
                                    
                                 }, {
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