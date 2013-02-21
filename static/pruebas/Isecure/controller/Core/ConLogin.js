Ext.define('Isecure.controller.Core.ConLogin', {
    extend: 'Ext.app.Controller',

    init: function () {


        this.control({
            'visautorizacion button[action=clickIniciarSesion]': {
                click: this.IniciarsSesion
            },

            'vislogin button[action=clickLogin]': {
                click: this.CargarAplicacionesUsuarioClick
            },

            'vislogin textfield[name=usuario]': {
                //specialkey: this.CargarAplicacionesUsuario
            },

            'vislogin textfield[name=contrasena]': {
                specialkey: this.CargarAplicacionesUsuario
            },

            'visautorizacion gridpanel[name=cmbAplicacion]': {
                select: this.SeleccionarAplicacion
            }

        })
    },

    IniciarsSesion: function () {



        //Main.IniciarVariables(sesion, params);
        
        var usuario = WorkSpace.Vistas.Vislogin.down('textfield[name=usuario]').getValue();
        var sele = WorkSpace.Vistas.VisAutorizacion.down('gridpanel[name=cmbAplicacion]').getSelectionModel().getSelection();
        var idaplicacion = sele[0].data.idaplicacion;
        // var idaplicacion = WorkSpace.Vistas.Vislogin.down('gridpanel[name=cmbAplicacion]').getValue();
        var sele = WorkSpace.Vistas.VisAutorizacion.down('gridpanel[name=cmbEntorno]').getSelectionModel().getSelection();
        var codentorno = sele[0].data.CodEntorno;
        //var codentorno = WorkSpace.Vistas.Vislogin.down('combobox[name=cmbEntorno]').getValue();
        var clave = WorkSpace.Vistas.Vislogin.down('textfield[name=contrasena]').getValue();
        
        /*var usuario = 'edme115';
        var idaplicacion = 10020;
        var codentorno = 3;
        var clave = '';*/
        
        myMask = new Ext.LoadMask(WorkSpace.Vistas.Vislogin, { msg: _SM.__language.StatusBar_Message_Loading });
        myMask.show();
        Ext.Ajax.request({
            url: '/Login/Login',
            params: {
                usuario: usuario,
                idaplicacion: idaplicacion,
                codentorno: codentorno,
                clave: clave
            },
            success: function (response) {

                var resp = Ext.decode(response.responseText);
                myMask.hide();
                if (resp.success) {
                    
                  /*  WorkSpace.Vistas.Vislogin.down('textfield[name=usuario]').setReadOnly(true);

                    WorkSpace.Vistas.Vislogin.down('textfield[name=contrasena]').hide();


                    WorkSpace.Vistas.Vislogin.down('combobox[name=cmbAplicacion]').setReadOnly(true);
                    WorkSpace.Vistas.Vislogin.down('combobox[name=cmbEntorno]').setReadOnly(true);

                    WorkSpace.Vistas.Vislogin.down('button[action=clickIniciarSesion]').hide();
                    WorkSpace.Vistas.Vislogin.down('button[action=clickCerrarSesion]').show();
                    */
                    document.location = '/Home';

                 
                } else {
                    WorkSpace.Vistas.Vislogin.show();
                    WorkSpace.Vistas['VisAutorizacion'].hide();
                    Ext.Msg.alert('Error', resp.error);
                }
            },
            failure: function () {
                myMask.hide();
            }
        });


    },



    CargarAplicacionesUsuario: function (textfield, evento, opciones) {

        var txtUsuario = WorkSpace.Vistas.Vislogin.down('textfield[name=usuario]');
        if (evento.getKey() == evento.ENTER) {
            if (Main.getController('Core.ConLogin').ValidarUsuario()) {
                Main.getController('Core.ConLogin').TraerAplicaciones(txtUsuario.getValue());
            } else {
                Ext.Msg.alert(_SM.__language.Message_Error, _SM.__language.Text_Enter_User_Login);
            }
        }




    },

    CargarAplicacionesUsuarioClick: function (textfield, evento, opciones) {

        var txtUsuario = WorkSpace.Vistas.Vislogin.down('textfield[name=usuario]');
            if (Main.getController('Core.ConLogin').ValidarUsuario()) {
                Main.getController('Core.ConLogin').TraerAplicaciones(txtUsuario.getValue());
            } else {
                Ext.Msg.alert(_SM.__language.Message_Error, _SM.__language.Text_Enter_User_Login);
            }
        

    },

    TraerAplicaciones: function (usuario) {

        WorkSpace.Vistas['VisAutorizacion'] = Ext.widget('visautorizacion');

      
        var me = this;
        var txtusuario = WorkSpace.Vistas.Vislogin.down('textfield[name=usuario]');
        var txtpass = WorkSpace.Vistas.Vislogin.down('textfield[name=contrasena]');
        var comboApp = WorkSpace.Vistas['VisAutorizacion'].down('gridpanel[name=cmbAplicacion]');
        var comboEntorno = WorkSpace.Vistas['VisAutorizacion'].down('gridpanel[name=cmbEntorno]');
      /*
        comboApp.store.removeAll();
        comboEntorno.store.removeAll();*/
        comboApp.store.proxy.extraParams.usuario = usuario;
        myMask = new Ext.LoadMask(WorkSpace.Vistas.Vislogin, { msg: _SM.__language.Text_Validating_Info_User });
        myMask.show();
        comboApp.store.load(function (records, operation, success) {

          
            if (success == true) {
                if (comboApp.store.getCount() > 0) {
                    myMask.hide();
                    WorkSpace.Vistas['VisAutorizacion'].show();
                    comboApp.getSelectionModel().select(comboApp.store.first());
                    var sele = comboApp.getSelectionModel().getSelection();
                    sele = sele[0];
                    me.TraerEntornos(usuario, sele.data.idaplicacion);
                   

                } else {
                    myMask.hide();
                    Ext.Msg.alert(_SM.__language.Text_General_Information, _SM.__language.Text_No_Aplications);
                }
            } else {
                myMask.hide();
                Ext.Msg.alert(_SM.__language.Text_General_Information, _SM.__language.Text_Error_In_Action);
            }
           
        });
    },

    TraerEntornos: function (usuario, aplicacion) {

        var combo = WorkSpace.Vistas['VisAutorizacion'].down('gridpanel[name=cmbEntorno]');
        combo.store.removeAll();
        combo.store.proxy.extraParams.usuario = usuario;
        combo.store.proxy.extraParams.idaplicacion = aplicacion;
        combo.store.load(function (records, operation, success) {
           myMask.hide();
            if (susccess = true) {
                combo.getSelectionModel().select(combo.store.first());
                WorkSpace.Vistas.Vislogin.hide();
                WorkSpace.Vistas['VisAutorizacion'].show();
            } else {
                Ext.Msg.alert('Informacion', 'La accion no fue posible');
            }
            
        });
    },

    Login: function (textfield, evento, opciones) {
        if (evento.getKey() == evento.ENTER) {
            if (this.ValidarUsuario()) {
                this.IniciarsSesion();
            } else {
                Ext.Msg.alert('Error', 'Debe ingresar un usuario');
            }
        }
    },

    SeleccionarAplicacion: function () {

        if (Main.getController('Core.ConLogin').ValidarUsuario()) {
            var txtUsuario = WorkSpace.Vistas.Vislogin.down('textfield[name=usuario]');
            var comboApp = WorkSpace.Vistas.VisAutorizacion.down('gridpanel[name=cmbAplicacion]');
            var sele = comboApp.getSelectionModel().getSelection();
            sele = sele[0];
            Main.getController('Core.ConLogin').TraerEntornos(txtUsuario.getValue(), sele.data.idaplicacion);
        } else {
            Ext.Msg.alert('Error', 'Debe ingresar un usuario');
        }


    },

    ValidarUsuario: function () {


        var txtUsuario = WorkSpace.Vistas.Vislogin.down('textfield[name=usuario]');
        if (txtUsuario.getValue() != '') {
            return true;
        } else {
            return false;
        }
    }



});