
Ext.Loader.setConfig({enabled: true});

Ext.onReady(function() {

    var a = 0 
    var sbar = Ext.create('Ext.form.Label', { text : ''})        

    //Ext.ux.tree.TreeGrid is no longer a Ux. You can simply use a tree.TreePanel
    var myList = Ext.create('ProtoUL.ux.ProtoList', {
        renderTo: Ext.getBody(),

        width: 600,
        height: 600, 
        idTitle: 'xx', 

        dataSelected : ['B', 'D'], 
        dataList : ['A', 'B', 'C'], 
        tbar: [
         {  xtype: 'button', 
            text: 'Button 1',
            scope : this, 
            handler : function () {
          
                myList.removeAll()
                myList.addDataSet( ["code", "description", "active", "overWrite"], true )      
                myList.addDataSet( ["code", "description", "__str__", "metaDefinition", "active", "overWrite"]  )      

                a += 1
                sbar.setText( String( a ) )
            } 
          }], 
          
       // dockedItems: [{
                // xtype: 'toolbar',
                // dock: 'bottom',
                // ui: 'footer',
                // items: [sbar ]
            // }], 
            
       bbar: [ sbar ]
    });
    
    myList.on({
        'checked': function ( record, recordIndex, checked ) {
            console.log( 'checked', myList.getChecked() )
        },
        'reorder': function ( data, overModel, dropPosition,  eOpts ) {
            console.log( 'reorder', myList.getChecked() )
            
        }, scope : this 
    }) 
    
    
});
