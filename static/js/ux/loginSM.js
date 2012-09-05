Ext.onReady(function(){
    Ext.QuickTips.init();
    
    appCombo=new Ext.data.JsonStore({
        url: 'archivos/login/getApp.php',
        fields: ['id', 'app']
    });
    
    entCombo=new Ext.data.JsonStore({
        url: 'archivos/login/getEnt.php',
        fields: ['id', 'ent']
    });
 
 
    // Create a variable to hold our EXT Form Panel.
    // Assign various config options as seen.
    var login = new Ext.FormPanel({ 
        labelWidth:80,
        url:'Archivos/login/login.php', 
        frame:true, 
        title:'Autenticaci&oacute;n', 
        defaultType:'textfield',
        monitorValid:true,
        // Specific attributes for the text fields for username / password.
        // The "name" attribute defines the name of variables sent to the server.
        items:[
        {
            fieldLabel:'Usuario',
            name:'usuario',
            allowBlank:false,
            id:'usuario',
            listeners: {
                specialkey: function(field,e){
                    if(e.getKey()==Ext.EventObject.ENTER || e.getKey()==Ext.EventObject.TAB)this.pierdeFoco();
                }
            },
            pierdeFoco:function(){
                if(this.getValue()!=''){
                    login.getComponent('Aplic').enable();
                    login.getComponent('Aplic').focus(false,50);
                }
                }
        },
        {
            xtype : 'combo',
            fieldLabel:'Aplicaci&oacute;n',
            disabled:true,
            hiddenName:'aplicacion',
            id:'Aplic',
            store:appCombo,
            allowBlank:false,
            displayField:'app',
            valueField:'id',
            //forceSelection : true,
            triggerAction: 'all',
            editable : false,
            emptyText:'seleccione una aplicacion...',
            listeners: {
                focus: function(){
                    appCombo.load({
                        params:{
                            usuario:login.getComponent('usuario').getValue()
                            }
                        });
                },
                select :function(){
                    login.getComponent('Ent').enable();
                    login.getComponent('Ent').focus(false,50);
                    login.buttons[0].enable();
                } ,
                beforequery:function(){
                    appCombo.load({
                        params:{
                            usuario:login.getComponent('usuario').getValue()
                            }
                        });
                }
            }
        },{
            xtype : 'combo',
            fieldLabel:'entorno',
            disabled:true,
            triggerAction: 'all',
            hiddenName:'entorno',
            id:'Ent',
            allowBlank:false,
            store:entCombo,
            displayField:'ent',
            //forceSelection : true,
            valueField:'id',
            editable : false,
            emptyText:'seleccione un entorno...',
            listeners: {
                focus: function(){
                    entCombo.load({
                        params:{
                            aplicacion:login.getComponent('Aplic').getValue()
                            }
                        });
                },
                select:function(){
                    login.getComponent('clave').enable();
                    login.getComponent('clave').focus(false,50);
                },
                beforequery:function(){
                    entCombo.load({
                        params:{
                            aplicacion:login.getComponent('Aplic').getValue()
                            }
                        });
                }
            }
        },{
            fieldLabel:'Contrase&ntilde;a',
            name:'clave',
            inputType:'password',
            id:'clave',
            disabled:true,
            listeners: {
                specialkey: function(field,e){
                    if(e.getKey()==Ext.EventObject.ENTER)login.buttons[0].handler();
                }
            }
        }],

        buttons:[{ 
            text:'Login',
            id:'aceptar',
            disabled:true,
            // Function that fires when user clicks the button
            handler:function(){
                login.getForm().submit({
                    method:'POST',
                    waitTitle:'Autenticando',
                    waitMsg:'Enviando Datos...',
 
                    success:function(form,action){
                        var usuario=action.result.idusuario;
                        var sesion=action.result.sesion;
                        var ky=action.result.llave;
                        var aplicacion=login.getComponent('Aplic').getValue();
                        var entorno=login.getComponent('Ent').getValue();
                        var ulogin=login.getComponent('usuario').getValue();
                        var Nusuario=action.result.nombreUsuario;
                        var a=appCombo.query('id',login.getComponent('Aplic').getValue());
                        var date=new Date(action.result.fecha);
                        SMIni(usuario,aplicacion,entorno,Nusuario,a.first().get('app'),sesion,ky,date,ulogin);
                        win.close();
                    },
                    failure:function(form,action){
                        switch (action.failureType) {
                            case Ext.form.Action.CLIENT_INVALID:
                                Ext.Msg.alert("Error", "Por Favor Digite Valores Validos");
                                break;
                            case Ext.form.Action.CONNECT_FAILURE:
                                Ext.Msg.alert("Error", "El Servidor No Responde");
                                break;
                            default:
                                Ext.Msg.alert("error", "error de autenticacion,motivo:"+action.result.motivo);
                        }
                        login.getForm().reset();
                    }
                });
            }
        }]
    });
 
 
    // This just creates a window to wrap the login form.
    // The login object is passed to the items collection.
    var win = new Ext.Window({
        layout:'fit',
        width:300,
        height:200,
        closable: false,
        resizable: false,
        plain: true,
        border: false,
        items: [login]
    });
    win.show();

    win.getEl().fadeOut({
        endOpacity:0.25
    });
    window.setTimeout(function() {
        win.getEl().fadeIn();
    }, 300);
    login.getComponent('usuario').focus(false,50);

});