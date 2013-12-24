/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoPWD.controller.PasswordManager', {
    extend: 'Ext.app.Controller',
 	// TODO incomplete...I need to use the controller...
    //models: [''],
    //stores: [''],
    views : ['PasswordReset',],
 
    init: function() {
        this.control({
            'passwordForm button[action=changepassword]': {click: this.changepassword},
            'passwordForm button[action=deletar]': {click: this.deletar},
        });
    },
 
    changepassword: function(button) {
        confirm('Tem certeza?');
        //button.up('grid').getStore().insert(0, this.getModel('Pessoa').create());
    },
 
    deletar: function(button) {
        var grid = button.up('grid'),
            store = grid.getStore(),
            record = grid.getSelectionModel().getSelection()[0];
 
        if (record) {
            if (confirm('Tem certeza?')) {
                store.remove(record);
            }
        }
    }
});