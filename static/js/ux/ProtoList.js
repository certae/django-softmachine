/*
 *   Lista ordenable y seleccionable 
 */


Ext.define('ProtoUL.ux.ProtoList' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.protoList',

    // @columnList : Header de las columnas,  Si no viene ninguna por defecto 'id'  
    columnList : ['id'], 

    // @idColumn : Llave unica del registro, ( id )
    idColumn : 'id',       

    // @myList : Lista con los datos iniciales
    // [ 'x', 'y']  o [ [ 'x1', 'y1'], [ 'x2', 'y2'] ]   
    dataList : [], 

    // @dataSelected : Campos seleccionados ( solo la llave )     
    dataSelected : [], 


    initComponent: function() {

        var myColumns = clone( this.columnList )
        myColumns.push( '__Checked' )
                
        // Se sirve de la definicion de columnas para el store 
        this.gridStore = Ext.create('Ext.data.Store', {
            fields: myColumns,
            idProperty : this.idColumn, 
            data: this.dataList 
        });

        // Inicializac con el checkBox   
        var myGridColumns = [ {
                xtype: 'checkcolumn',
                dataIndex: '__Checked', 
                menuDisabled : true, 
                width: 33,  
                listeners: {
                    'checkchange': function( record, recordIndex, checked ){
                        onCheckChange( record, recordIndex, checked ) 
                        }
                    } 
                }
        ];

        // DGT** Copia las columnas   
        for (var ix in this.columnList ) {
            var vFld = this.columnList[ix] 

            var col = {
                menuDisabled : true, 
                header: vFld,    
                dataIndex: vFld 
                };
                
            myGridColumns.push( col  );
            
        }

        var myGrid = Ext.apply(this, {
            store : this.gridStore,
            stripeRows: true ,
            columns : myGridColumns,  
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    ddGroup : Ext.id(), 
                    dragText: 'Drag and drop to reorganize'
                }},
           }) 
     

        // TODO: Agregar  evento  check con el Id, checked  
        // TODO: Agregar  evento  drop reorder   
        this.addEvents(
            'rowClick', 'rowDblClick', 'promoteDetail', 'selectionChange'
        );

        
        this.callParent(arguments);


        grid.on({
            select: {fn: function ( rowModel , record,  rowIndex,  eOpts ) {

            }, scope: this }, 

            celldblclick: {fn: function ( tbl, el,  cellIndex, record, tr, rowIndex, e,  eOpts ) {

            }, scope: this }
                
        });
        
        function onCheckChange( record, recordIndex, checked ) {
            
        }
        
        // -----------------
        
        this.setSelected( this.dataSelected )                     
        
    }, 
    
    
    setSelected:  function( dSelected  ) {
        // Selecciona los registros de una lista dada  
        
        for (var ix in dSelected ) {
            var vFld  =  dSelected[ix];
            var vNode =  this.gridStore.getNodeById( vFld  ) 

            // Lo marca                                            
            if ( vNode ) vNode.set( '__Checked', true ) 

        } 
        
    }, 

    setChecked: function ( idRec, check  ) {
        // Cambia el estado de seleccion de un registro 
         
    },
    
    addOrRemove: function ( idRec, add  ) {
        // adiciona o lo remueve un registro especifico
        
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
        
        
    }

});
