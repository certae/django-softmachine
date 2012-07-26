/* 
 * ProtoFieldSelector,  Primer paso para crear la pcl, seleccionar loscampos 
 *    
 * 1.  presentar el arbol de campos para seleccionar los fields  ( Solo en la configuracion de fields )
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

        var tBar =  Ext.create( 'ProtoUL.proto.ProtoToolBar', {dock : 'top'})
        tBar.setButton( 'add', true, true, 'add UDP' ) 
        
        
        var elemTree = Ext.create('ProtoUL.proto.ProtoFieldTree', {
            protoOption : me.protoOption, 
            myMeta : me.myMeta 
           })

        var elemList = Ext.create('ProtoUL.ux.ProtoList', {
            checkStyle : false, 
            idTitle: 'SelectedFields' 
        })


//      --------------------------------------------------

        elemTree.on({
            'loadComplete': function (  treeStore, records,  successful,  eOpts ) {
                configureCurrentFields()
            }, 
            'checkModif': function (  node,  checked,  eOpts ) {
                var idx = node.get( 'id' )
                elemList.addOrRemove ( idx, checked  ) 
            }, 
            scope: me }
        );


        tBar.on({
            'preview': function () {
                var a 
            }, 
            'save': function () {
                var a 

            }, 
            'add': function () {
                var a 

            }, 
            scope: me }
        );



//      ----------------------------------------------------

        var panelItems = getSelectorsPanels( elemTree, elemList  )
            
        Ext.apply(this, {
            layout: 'border',
            items: panelItems, 
            dockedItems: [ tBar ] 
        });
          
        this.callParent(arguments);
        
        
        function configureCurrentFields() {

            // Crea los campos activos en la grilla 
            for (var ix in me.myMeta.fields ) {
                var vFld  =  me.myMeta.fields[ix];

                // El string no es un campos configurable
                if ( vFld.name == '__str__' )  continue 

                elemList.addDataItem ( vFld.name, true  ) 
            } 
        }
        
    } 


});


/* 
 * Lectura del arbol de campos ( todos los lockup )
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
        
        
    } 

    // getCheckedList: function () {
        // var records = this.getView().getChecked(),
            // names = [];
        // Ext.Array.each(records, function(rec){
            // names.push(rec.get('id'));
        // });
        // return names 
    // }


});