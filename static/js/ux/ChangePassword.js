/**
 * @author Giovanni Victorette
 */
Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', 'static/extjs-4.1.x/examples/ux');

Ext.application({
    name: 'ProtoPWD',   
    appFolder: 'static/js/app',
    autoCreateViewport: false,
    
    requires: [
        'Ext.util.Cookies', 
        'Ext.Ajax'
    ],
    
    controllers: ['PasswordManager'],
    
    launch: function() {
    	// Add csrf token to every ajax request
        var token = Ext.util.Cookies.get('csrftoken');
        if(!token) {
            Ext.Error.raise("Missing csrftoken cookie");
        } else {
            Ext.Ajax.defaultHeaders = Ext.apply(Ext.Ajax.defaultHeaders || {}, {
                'X-CSRFToken' : token
            });
        }
        
    	Ext.create('Ext.container.Viewport', {
    		id: 'viewport',
            layout: 'border',
            items: [{
            	region: 'center',
            	border: false,
            	autoScroll: true,
            	items: [{
                    xtype: 'passwordForm',
                }]
            }]
        });
    }
});