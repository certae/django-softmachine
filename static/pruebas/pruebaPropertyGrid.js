
Ext.Loader.setConfig({enabled: true});

Ext.require([
    'Ext.data.*',
    'Ext.tree.*', 
    'Ext.grid.*',
    'Ext.grid.property.Grid'
]);

Ext.onReady(function() {


    Ext.QuickTips.init();

    //Ext.ux.tree.TreeGrid is no longer a Ux. You can simply use a tree.TreePanel
    var objPrueba = Ext.create('ProtoUL.ux.ProtoProperty', {
        renderTo: Ext.getBody(),

        width: 600,
        height: 600
        
    });

    objPrueba.setSource( {
            "title": "Legend",
            "layout" : "hbox", 
            "labelWidth" : 100,
            "labelAlign" : "left",
            "hideLabels" : false,
            "autoHeight": true
            }
        );
        
    objPrueba.readOnlyProps = [ 'title', 'autoHeight' ]        
        
    objPrueba.setCombos( {
            "layout" : [ "hbox" , "vbox" ],
            "labelAlign" : [ "top", "left"]
            }
        );

    objPrueba.sourceInfo = { "layout" : "Las opciones son Hbox, vBox" }


    objPrueba.on({
        'edit':  function ( editor, e, eOpts) {
            
            objPrueba.editMode = false; 
            console.log( 'EditMode --> false' )
            
        }, scope : this 
    }) 
    
    
});
