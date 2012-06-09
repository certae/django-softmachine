
Ext.Loader.setConfig({enabled: true});

Ext.onReady(function() {


    //Ext.ux.tree.TreeGrid is no longer a Ux. You can simply use a tree.TreePanel
    var tree = Ext.create('ProtoUL.ux.ProtoList', {
        renderTo: Ext.getBody(),

        width: 600,
        height: 600,
        idTitle: 'xx', 

        dataList : ['A', 'B', 'C'], 
        dataSelected : ['B', 'D']
    
    });
    
    tree.on({
        'checked': function ( record, recordIndex, checked ) {
            console.log( 'checked', tree.getChecked() )
        },
        'reorder': function ( data, overModel, dropPosition,  eOpts ) {
            console.log( 'reorder', tree.getChecked() )
            
        }, scope : this 
    }) 
    
    
});
