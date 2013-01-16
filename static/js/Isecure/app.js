

Ext.Loader.setConfig({ enabled: true });

Ext.application({
    name: 'Isecure',
    path: 'app',
    appFolder: 'static/js/Isecure',
    controllers: ['ConPrincipal','Core.ConLogin'],
    launch: function () {
        //lo siguiente es para arrglar problemas con el idioma de los messageBox
        Ext.MessageBox.buttonText.ok = "Aceptar";
        Ext.MessageBox.buttonText.cancel = "Cancelar";
        Ext.MessageBox.buttonText.yes = "S&#237;";
        Ext.MessageBox.buttonText.no = "No";
        
       
    }
});


   
