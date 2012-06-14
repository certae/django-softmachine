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
        me.addEvents('checkModif', 'loadComplete');
        
        definieProtoFieldSelctionModel( me.protoOption  )
        
        this.treeStore = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            model: 'Proto.FieldSelectionModel',
            root: {
                text:'fields',
                expanded: true 
            }, 

            listeners: {
                load: function ( treeStore, records,  successful,  eOpts ) {
                    configureCurrentFields()
                    me.fireEvent('loadComplete', treeStore, records,  successful,  eOpts );
                }
            }
             
        });

        var tree = Ext.apply(this, {
            store: this.treeStore,
            useArrows: true,
            rootVisible: false ,
            minWidth: 400, 

            columns: [{
                xtype: 'treecolumn', //this is so we know which column will show the tree
                text: 'text',
                flex: 2,
                sortable: true,
                minWidth: 200,
                dataIndex: 'text'
            // },{
                // text: 'header',
                // dataIndex: 'header'
            // },{
                // text: 'tooltip',
                // dataIndex: 'tooltip'
            },{
                xtype: 'booleancolumn', 
                trueText: '',
                falseText: 'req', 
                width: 50,
                text: 'req',
                dataIndex: 'allowBlank'
            },{
                xtype: 'booleancolumn', 
                trueText: 'rOnly',
                width: 50,
                falseText: '', 
                text: 'rOnly',
                dataIndex: 'readOnly'
            },{
                text: 'fieldType',
                dataIndex: 'fieldType'
            },{
                text: 'Ix',
                flex: 2,
                dataIndex: 'id'
            }] 
             
        })

        tree.on({
            'checkchange': {fn: function (  node,  checked,  eOpts ) {
                me.fireEvent('checkModif', node,  checked,  eOpts );
            }}, scope: me }
        );

        me.callParent(arguments);
        
        function configureCurrentFields() {
            // Crea los campos activos en la grilla 
            for (var ix in me.myMeta.fields ) {
                var vFld  =  me.myMeta.fields[ix];
                var vNode =  me.treeStore.getNodeById( vFld.name ) 

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