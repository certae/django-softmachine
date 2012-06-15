/* 
 * ProtoFieldSelector,  Primer paso para crear la pcl, seleccionar loscampos 
 *    
 * 1.  presentar el arbol de campos para seleccionar los fields  ( Solo en la configuracion de fields )
 * 
 * 2.  presentar los campos disponibles como una lista de campos a seleccionar, por ejemplo, en listDiplay, order by,  etc, 
 * 
 * Los campos UDP se agregan directamente a la lista(2).  
 *  
 */

Ext.define('ProtoUL.proto.ProtoFieldSelector', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.protoFieldSelector',
    
 // @protoOption   Required 
    protoOption : null, 

 // @myMeta   Required 
    myMeta : null, 

    initComponent: function() {
        
        me = this; 
        
        var tree = Ext.create('ProtoUL.proto.ProtoFieldTree', {
            protoOption : me.protoOption, 
            myMeta : me.myMeta 
           })

        var grid = Ext.create('ProtoUL.ux.ProtoList', {
            checkStyle : false, 
            idTitle: 'SelectedFields' 
        })

        tree.on({
            'loadComplete': function (  treeStore, records,  successful,  eOpts ) {
                configureCurrentFields()
            }, 
            'checkModif': function (  node,  checked,  eOpts ) {
                var idx = node.get( 'id' )
                grid.addOrRemove ( idx, checked  ) 
            }, 
            scope: me }
        );

        var tBar =  Ext.create( 'ProtoUL.proto.ProtoToolBar', {dock : 'top'})

        var panelItems =   [{
                region: 'center',
                layout: 'fit',
                minSize: 200,
                items: tree, 
                flex: 3
            }, {
                region: 'east',
                // collapsible: true,
                collapsed: false ,
                split: true,
                layout: 'fit',
                minSize: 200,
                items: grid, 
                flex: 1
            }]
            
        Ext.apply(this, {
            layout: 'border',
            items: panelItems, 
            dockedItems: [ tBar ] 
        });
          
                
  
        this.addDocked                         
                
        this.callParent(arguments);
        
        
        function configureCurrentFields() {

            // Crea los campos activos en la grilla 
            for (var ix in me.myMeta.fields ) {
                var vFld  =  me.myMeta.fields[ix];

                // El string no es un campos configurable
                if ( vFld.name == '__str__' )  continue 

                // Lo inserta en la grilla 
                grid.addData ( vFld.name, true  ) 

            } 
        }
        
    } 


});