/*
 *  @Author : Dario Gomez T.  /  Certae Universite Laval Quebec  
 *   
 * Lista ordenable y seleccionable 
 * 
 *      Por ahora solo trabaja con un campo Id, 
 *      TODO:  Ampliar con varias columnas 
 */

Ext.define('ProtoUL.ux.ProtoList' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.protoList',

    // @columnList : Header de las columnas,  Si no viene ninguna por defecto 'id'  
    columnList : ['data'], 

    // @idColumn : Llave unica del registro, ( id )
    // idColumn : 'id',       

    // @myList : Lista con los datos iniciales
    // [ 'x', 'y']  o [ [ 'x1', 'y1'], [ 'x2', 'y2'] ]   
    dataList : [], 

    // @dataSelected : Campos seleccionados ( solo la llave )     
    dataSelected : [], 

    // @idTitle
    idTitle : '', 
    
    checkStyle : true, 

    initComponent: function() {

        var me = this 
        me.addEvents('checked', 'reorder');

        var myColumns = clone( this.columnList )
        myColumns.push( '__Checked' )
                
        // Se sirve de la definicion de columnas para el store 
        // TODO: El modelo automatico tomar el idProperty ?? 
        this.gridStore = Ext.create('Ext.data.Store', {
            fields: myColumns,
            idProperty : this.idColumn, 
            data: [] 
        });

        // Inicializac con el checkBox
        var myGridColumns = []
        if ( me.checkStyle ) {
            myGridColumns = [ {
                    xtype: 'checkcolumn',
                    dataIndex: '__Checked', 
                    menuDisabled : true, 
                    width: 33,  
                    listeners: {
                        'checkchange': function( record, recordIndex, checked ){
                            me.fireEvent('checked', record, recordIndex, checked );
                        } 
                    }, scope : me
                }
            ];
        }   

        // DGT** Copia las columnas   
        for (var ix in this.columnList ) {
            var vFld = this.columnList[ix] 
            var col = {
                menuDisabled : true, flex : 1, text : this.idTitle,   
                dataIndex: vFld 
                };
            myGridColumns.push( col  );
            
        }


        var grid = Ext.apply(this, {
            store : this.gridStore,
            stripeRows: true ,
            columns : myGridColumns,
  
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    ddGroup : Ext.id(), 
                    dragText: 'Drag and drop to reorganize'
                },

                listeners: {
                    drop: function(node, data, overModel, dropPosition,  eOpts) {
                        me.fireEvent('reorder' );
                    }, scope : me
                }                
                 
            }
        }); 

     

        this.callParent(arguments);

        grid.on({
            sortchange : function (  ct,  column,  direction,  eOpts ) {
                 me.fireEvent('reorder' );
            },scope : me}
        );
            
        // -----------------
        // Agrega los campos seleccionados 
        this.addDataSet( this.dataList, false )                     
        this.addDataSet( this.dataSelected, true )                     

        
    }, 
    
    
    addDataSet:  function( dataSet, checked  ) {
        // Selecciona los registros de una lista dada  
        
        for (var ix in dataSet ) {
            var data  =  dataSet[ix];
            this.addDataItem( data, checked )
        } 
        
    }, 

    
    addDataItem:  function ( data,  checked  ) {
        // TODO: Por ahora solo maneja un campo Verificar el modelo, por q no se definio con modelo  
        // var rec = new this.gridStore.model()
        // rec.data[id] = data

        var vNode =  this.gridStore.findRecord( 'data', data  ) 
        if ( ! vNode ) {
            if ( checked == true || checked == false  ) {
                this.gridStore.add( { 'data': data, '__Checked': checked } );
            } else {
                this.gridStore.add( { 'data': data  } );
            }
        }  else if ( checked ){
            vNode.set( '__Checked', checked )
        }        

    }, 

    removeAll:  function () {
        this.gridStore.removeAll(  );
    }, 


    getList: function () {

        var myList = []
        this.gridStore.each(function(record){
          myList.push( record.get( 'data' ))
         })
        
        return myList
    }, 
    
    getChecked: function () {

        var chkList = []
        this.gridStore.each(function(record){
            if ( record.get('__Checked')  )  
              chkList.push( record.get( 'data' ))
         })
        
        return chkList
    }, 

    setChecked: function ( data, checked  ) {
        // Cambia el estado de seleccion de un registro
        // Que hace si no existe y es check? Lo crea por q es posible q se inserten dos colecciones base y selected   

        var vNode =  this.gridStore.findRecord( 'data', data  ) 
        if ( vNode ) {
            vNode.set( '__Checked', checked )
        } else { 
            this.gridStore.add( { 'data': data, '__Checked': checked } );
        } 
    }, 

    addOrRemove: function( data, checked ) {
        // Permite agregar o elimar un registro dependiendo del estado   
        
        if ( checked )  {
            this.setChecked(  data,  true  )
        } else {
            var vNode = this.gridStore.findRecord( 'data', data  )
            if (  vNode  )   {
                this.gridStore.remove( vNode )
            }
        }
    }
    

});
