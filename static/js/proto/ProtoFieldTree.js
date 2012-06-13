/* 
 * Este objeto va a ser dual:
 *    
 * Arbol de campos para seleccionar los fields  ( Solo en la configuracion de fields )
 * 
 * Debera tener en cuenta si permite o no los campos UDP y las funciones ( por ejemplo __str__ ) 
 * pude ser un mensaje si se le da un parametro 
 * 
 */

Ext.define('ProtoUL.proto.ProtoFieldTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.protoFieldTree',
    

 // @protoOption   Required 
    protoOption : null, 

//  @myMeta   Required 
    myMeta : null, 

    initComponent: function() {
        
        me = this; 
        
        definieProtoFieldSelctionModel()
        
        this.treeStore = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            model: 'Proto.FieldSelectionModel',
            root: {
                text:'fields',
                expanded: true 
            }, 

            listeners: {
                load: function ( treeStore, records,  successful,  eOpts ) {
                    // Debe ser llamado aqui, para poder marcar los campos seleccionados 
                    configureCurrentFields()
                }
            }
             
        });

        var tree = Ext.apply(this, {
            store: this.treeStore,
            useArrows: true,
            rootVisible: false ,
            minWidth: 200 

/*          
            //-- Prueba para obtener los items              
            title : 'Fields', 
            dockedItems: [{
                xtype: 'toolbar',
                items: {
                    text: 'Get checked nodes',
                    scope : me, 
                    handler: function(){
                        var names = this.getCheckedList();
                        Ext.MessageBox.show({msg: names.join('<br />')});
                    }
                }
            }]
*/
        })


        this.callParent(arguments);
        
        function configureCurrentFields() {

            // Crea los campos activos en la grilla 
            for (var ix in me.myMeta.fields ) {
                var vFld  =  me.myMeta.fields[ix];
                var vNode =  me.treeStore.getNodeById( vFld.name ) 

                // El string no es un campos configurable
                if ( vFld.name == '__str__' )  continue 

                // Lo marca                                            
                if ( vNode ) vNode.set( 'checked', true ) 
            } 
        }
        
        
    }, 

    getCheckedList: function () {

        var records = this.getView().getChecked(),
            names = [];
        
        Ext.Array.each(records, function(rec){
            names.push(rec.get('id'));
        });
        
        return names 

    }


});