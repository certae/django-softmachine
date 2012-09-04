        date = Ext.Date.format(new Date(), 'n/d/Y')
        
        clock = Ext.Date.format(new Date(), 'g:i:s A')

            // Kick off the clock timer that updates the clock el every second:
         Ext.TaskManager.start({
             run: function(){
                 Ext.fly(clock.getEl()).update(Ext.Date.format(new Date(), 'g:i:s A'));
             },
             interval: 1000
         });



Ext.require([
  'Ext.ux.statusbar.StatusBar',
  'Ext.ux.statusbar.ValidationStatus'
]);



    var fp = Ext.create('Ext.FormPanel', {
    })


    if(fp.getForm().isValid()){
        var sb = Ext.getCmp('form-statusbar');
        sb.showBusy('Saving form...');
        fp.getEl().mask();
        fp.getForm().submit({
            url: 'fake.php',
            success: function(){
                sb.setStatus({
                    text:'Form saved!',
                    iconCls:'',
                    clear: true
                });
                fp.getEl().unmask();
            }
        });
    }


    Ext.create('Ext.ux.StatusBar', {
        dock: 'bottom',
        id: 'form-statusbar',
        defaultText: 'Ready',
        plugins: Ext.create('Ext.ux.statusbar.ValidationStatus', 
            {form:'status-form'})
    })
