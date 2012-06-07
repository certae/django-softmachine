/* 
 * Este objeto va a ser dual:
 *    
 * 1.  Puede presentar el arbol de campos para seleccionar los fields  ( Solo en la configuracion de fields )
 * 
 * 2.  Puede presentar los campos disponibles como una lista de campos a seleccionar, por ejemplo, en listDiplay, 
 *     order by,  etc, 
 * 
 * Debera tener en cuenta si permite o no los campos UDP y las funciones ( por ejemplo __str__ ) 
 * pude ser un mensaje si se le da un parametro 
 * 
 * Ok, Ocultar el control de sort y hide/show cols en los header,
 * TODO:  Separar el objeto  protoList, manejar eventos de seleccion y un metodo getSelected() manejar todo con arrays   
 *  
 */

Ext.define('ProtoUL.proto.ProtoFieldTree', {
    extend: 'Ext.container.Container',
    alias: 'widget.protoFieldTree',
    
/* 
 * @protoOption   Required 
 */
    protoOption : null, 


/* 
 * @myMeta   Required 
 */

    myMeta : null, 

    initComponent: function() {
        
        me = this; 
        
        Ext.define('ProtoUL.FieldModel', {
            extend: 'Ext.data.Model',
            proxy: {
                type: 'ajax',
                method: 'GET',
                url: _PConfig.urlGetFieldTree , 
                
                extraParams : {
                    protoOption : me.protoOption
                },    
                
            }, 
        
            fields: [
                {name: 'id', type: 'string'},
                {name: 'text', type: 'string'},  
                {name: 'fieldType', type: 'string'},  
                {name: 'checked', type: 'boolean'},
                {name: 'leaf', type: 'boolean'}
            ]
            
        });
                
        
        
        this.treeStore = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            model: 'ProtoUL.FieldModel',
            root: {
                text:'fields',
                expanded: true 
            }, 

            listeners: {
                // Fires whenever the treeStore reads data from a remote data source. ...
                load: function ( treeStore, records,  successful,  eOpts ) {

                    // Debe ser llamado aqui, para poder marcar los campos seleccionados 
                    configureCurrentFields()

                }
            }
             
        });


        
        var tree = Ext.create('Ext.tree.Panel', {
            store: this.treeStore,
            useArrows: true,
            // frame: true,
            rootVisible: false ,
            lines: false,
            minWidth: 200
           }
           )


        tree.on({
            'checkchange': {fn: function (  node,  checked,  eOpts ) {
                var idx = node.get( 'id' )
                addOrRemove( idx, checked )
            }}, scope: me }
        );


//  ----------------------------------------------------------------

        var gridStore = Ext.create('Ext.data.Store', {
            // fields:['id', 'fAdded','fRemoved', 'fChecked'],
            fields:['id',  'fChecked'],
            data: []
        });
 


        var grid = Ext.create('Ext.grid.Panel', {
            store : gridStore,
            stripeRows: true , 
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    ddGroup : Ext.id(), 
                    dragText: 'Drag and drop to reorganize'
                }
            },
            columns : [
                {menuDisabled : true, width: 33,  dataIndex: 'fChecked', xtype: 'checkcolumn',
                listeners: {
                    'checkchange': function( record, recordIndex, checked ){ 
                        var idx = record.get( 'id' )
                        }
                    } 
                },
                {menuDisabled : true, header: 'fieldName',    dataIndex: 'id', flex : 1  }
                // {menuDisabled : true, header: 'added',    dataIndex: 'fAdded', xtype: 'checkcolumnreadonly'},
                // {menuDisabled : true, header: 'removed',    dataIndex: 'fRemoved', xtype: 'checkcolumnreadonly'}
                ] 
               }) 


        var panelItems =   [{
                region: 'center',
                flex: 1,
                layout: 'fit',
                minSize: 200,
                items: tree 
            }, {
                region: 'east',
                collapsible: false,
                collapsed: false ,
                split: true,
                flex: 1,
                layout: 'fit',
                minSize: 200,
                items: grid 
            }]
            
        Ext.apply(this, {
            layout: 'border',
            items: panelItems 
        });
            
                
        this.callParent(arguments);
        this.addEvents('menuSelect');
        
        
        function configureCurrentFields() {

            // Crea los campos activos en la grilla 
            for (var ix in me.myMeta.fields ) {
                var vFld  =  me.myMeta.fields[ix];
                var vNode =  me.treeStore.getNodeById( vFld.name ) 

                // El string no es un campos configurable
                if ( vFld.name == '__str__' )  continue 

                // Lo inserta en la grilla 
                var idx = gridStore.getCount() + 1;
                insertGridRecord ( idx, vFld.name, null  ) 

                // Lo marca                                            
                if ( vNode ) vNode.set( 'checked', true ) 

            } 
        }
        
        function insertGridRecord( idx, fieldName,  added  ) {
            /* 
             * Solo marca como insertados los nuevos registros 
             */
            var rec = new gridStore.model()
            rec.data.id = fieldName  
            // rec.data.fAdded = added 

            gridStore.insert(idx, rec );
        };
        
        function addOrRemove( idx, checked ) {
            /* 
             * Marca los registros como adicionados o removidos, 
             * los registros de base no se deben remover, solo se marcan 
             */
        
            var rec = gridStore.getById( idx  )
            if ( ! rec  )  {
                insertGridRecord( 0, idx,  true  )
            } else {
                gridStore.remove( rec )
                // if ( checked && rec.get( 'added') ) 
                    // rec.set( 'fRemoved', false   )
                // else rec.set( 'fRemoved', ! checked   )
            }
            
        }
        
    }, 


});