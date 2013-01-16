Ext.define('Isecure.controller.ConPrincipal', {
    extend: 'Ext.app.Controller',
    
    views: ['Core.VisLogin', 'Core.VisPrincipal', 'Core.VisAutorizacion'],
    stores: ['stoEntorno','stoAplicacion'],

    init: function () {
        //document.getElementById('Idbody').innerHTML="";
        //la siguiete intruccion deshabilitar el menu contextual del navegador:
       
        Ext.getBody().on("contextmenu", Ext.emptyFn, null, { preventDefault: true });

        Main = this;
        //se cargan las utilidades:
       // Ext.require('Isecure.utilidades.UtiOpciones');
       
        this.IniciarVariables();

    

        
        
        this.control({
           /* 'vislogin button[action=clickIniciarSesion]': {
                click:this.IniciarSesion
            }*/

    })
    },

    IniciarVariables: function (sesion,params) {
        
       document.getElementById('Idbody').innerHTML = "";
       WorkSpace = {};
       WorkSpace['Vistas'] = {}
       WorkSpace['Vistas']['VisPrincipal'] = Ext.widget('visprincipal');
       WorkSpace['Vistas']['Vislogin'] = Ext.widget('vislogin');
        //WorkSpace.Vistas.VisPrincipal.add(WorkSpace.Vistas.Vislogin);
       WorkSpace.Vistas.Vislogin.show();
    }

  

   


});