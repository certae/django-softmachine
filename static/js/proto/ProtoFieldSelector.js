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
                savePreview()
            }, 
            'save': function () {
                savePreview(); 
                savePci( me.myMeta )         
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

                elemList.addDataItem ( vFld.name, true  ) 

                // Lo marca o lo adiciona como UDP                                             
                var vNode =  elemTree.treeStore.getNodeById( vFld.name ) 
                if ( vNode ) {
                    vNode.set( 'checked', true )
                } else {
                    elemTree.addUdpField( vFld )
                }

            } 
        }; 
        
        
        function savePreview() {
            
            var names = elemList.getList(),
                field = {},  
                fields = []
                
            for (var ix in names  ) {
                
                field = getExistingField( names[ix] )
                if ( ! field ) {
                    field = getDefaultField( names[ix] )
                }
                if ( field ) {
                    fields.push( field )   
                } else { 
                    console.log( "Field no encontrado", names[ix]  )
                } 
                
            } 
            
            // Actualiza los nuevos detalles 
            me.myMeta.fields = fields 
            
            function getExistingField( name  ) {
                for (var ix in me.myMeta.fields ) {
                    var vFld  =  me.myMeta.fields[ix];
                    if ( vFld.menuText == name ) {
                        return vFld 
                        break ; 
                    }
                } 
            }
            
            function getDefaultField( name  ) {
                
                var rec =  elemTree.treeStore.getNodeById( name ) 
                return  {
                    menuText : rec.get( 'id' ), 
                    conceptField :  rec.get( 'conceptField' ), 
                    masterField :  "pk" ,
                    fieldField :  rec.get( 'fieldField' )
                }  
            }
            
        }; 
        
        
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
                text: 'zoomModel',
                dataIndex: 'zoomModel'
            },{
                text: 'fkField',
                dataIndex: 'fkField'
            },{
                text: 'fkId',
                dataIndex: 'fkId'
            },{
                flex: 2,
                hidden : true, 
                text: 'Ix',
                dataIndex: 'id'
            },{
                hidden : true, 
                text: 'header',
                dataIndex: 'header'
            },{
                hidden : true, 
                text: 'tooltip',
                dataIndex: 'tooltip'
            },{
                hidden : true, 
                text: 'defaultValue',
                dataIndex: 'defaultValue'
            },{
                hidden : true, 
                text: 'vType',
                dataIndex: 'vType'
            },{
                hidden : true, 
                text: 'choices',
                dataIndex: 'choices'
            }] 
             
        })

        tree.on({
            'checkchange': {fn: function (  node,  checked,  eOpts ) {
                me.fireEvent('checkModif', node,  checked,  eOpts );
            }}, scope: me }
        );

        me.callParent(arguments);
        
    }, 
    
    
    addUdpField:  function( vFld ) {
        
          // No lo encontro, lo agrega
        tNode = {
            'id'         : vFld.name, 
            'text'       : vFld.name, 
            'fieldType'  : 'udp', 
            'checked'    : true, 
            'allowBlank' : true, 
            'leaf'       : true 
        }
        
        this.getRootNode().appendChild( tNode )

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