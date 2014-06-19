/*
 *  @Author : Dario Gomez T.  /  Certae Universite Laval Quebec  
 *   
 * Lista ordenable y seleccionable 
 * 
 *      Por ahora solo trabaja con un campo Id, 
 *      V+:  Ampliar con varias columnas 
 */

Ext.define('ProtoUL.ux.ProtoList' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.protoList',

    // @columnList : { dataIndex: ,  hidden : ,  text : [title]  },  Si no viene ninguna por defecto 'data'  
    columnList : ['data'], 

    // @idColumn : Llave unica del registro, ( id )
    idColumn : 'id',       

    // @myList : Lista con los datos iniciales
    // [ 'x', 'y']  o [ [ 'x1', 'y1'], [ 'x2', 'y2'] ]   
    dataList : [], 

    // @dataSelected : Campos seleccionados ( solo la llave )     
    dataSelected : [], 

    // @idTitle
    idTitle : '', 
    
    checkStyle : true, 

    initComponent: function() {

        var me = this ;
        me.addEvents('checked', 'reorder');

        var myColumns = [ '__Checked' ];
        for (var ix in this.columnList ) {
            var vFld = this.columnList[ix] ;
            if ( _SM.typeOf( vFld ) == 'string' ) {
                myColumns.push( vFld );
            }  else if ( vFld.dataIndex ) {
                myColumns.push( vFld.dataIndex );
            }       
        } 
                
        // Se sirve de la definicion de columnas para el store 
        this.gridStore = Ext.create('Ext.data.Store', {
            fields: myColumns,
            idProperty : this.idColumn, 
            data: [] 
        });

        // Inicializac con el checkBox
        var myGridColumns = [];
        if ( me.checkStyle ) {
            myGridColumns = [{
                xtype: 'mycheckcolumn',
                dataIndex: '__Checked', 
                menuDisabled : true, 
                width: 33,  
                listeners: {
                    'checkchange': function( record, recordIndex, checked ){
                        me.fireEvent('checked', record, recordIndex, checked );
                    } 
				},
				scope : me
            }];
        }   

        // DGT** Copia las columnas   
        for (var ix in this.columnList ) {
            var vFld = this.columnList[ix];
            if ( _SM.typeOf( vFld ) == 'string' ) {
                var col = {
					menuDisabled : true,
					flex : 1,
					text : this.idTitle,
                    dataIndex: vFld 
                    };
            }  else if ( vFld.dataIndex ) {
				var col = Ext.apply(vFld, {
					menuDisabled : true
				});
            }
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
                    dragText: _SM.__language.ProtoList_DD_Text
                },

                listeners: {
                    drop: function(node, data, overModel, dropPosition,  eOpts) {
                        me.fireEvent('reorder' );
					},
					scope : me
                }                
                 
            }
        }); 

        this.callParent(arguments);

        grid.on({
            sortchange : function (  ct,  column,  direction,  eOpts ) {
                 me.fireEvent('reorder' );
			},
			scope : me
		});
            
        // -----------------
        // Agrega los campos seleccionados 
        this.addDataSet( this.dataList, false );
        this.addDataSet( this.dataSelected, true );
    }, 
    
    addDataSet:  function( dataSet, checked  ) {
        // Selecciona los registros de una lista dada  
        for (var ix in dataSet ) {
            var data  =  dataSet[ix];
            this.addDataItem( data, checked );
        } 
        
    }, 

    addDataItem:  function ( data,  checked  ) {
        // TODO: Por ahora solo maneja un campo Verificar el modelo, por q no se definio con modelo  
        // var rec = new this.gridStore.model()
        // rec.data[id] = data
    
		var dataIx = 'data', dataValue = data, dataRec = {};

        // Take the positional Id (the first is)
        if ( _SM.typeOf( data ) == 'array' ) {
            dataValue = data[0];
        
            // Check the 1st item should be the Id
            vFld = this.columnList[0];
            if ( _SM.typeOf( vFld ) == 'string' ) {
                dataIx = vFld; 
            }  else if ( vFld.dataIndex ) {
                dataIx = vFld.dataIndex;
			} else {
				return;
			}
        }


        var vNode =  _SM.getRecordByDataIx( this.gridStore, dataIx, dataValue  ); 
        if ( ! vNode ) {
            
            if ( _SM.typeOf( data ) == 'string' ) {
				dataRec = {
					'data' : data
				};
            } else {

                for (var ix in this.columnList ) {
                    var vFld = this.columnList[ix]; 
                    if ( _SM.typeOf( vFld ) == 'string' ) {
                        dataRec[ vFld ] = data[ ix ]; 
                    }  else if ( vFld.dataIndex ) {
                        dataRec[ vFld.dataIndex ] = data[ ix ];
                    }       
                } 
            }
            
			if (checked == true || checked == false) {
				dataRec['__Checked'] = checked;
			}
            this.gridStore.add( dataRec );
            
        }  else if ( checked ){
            vNode.set( '__Checked', checked );
        }        

    }, 

    removeAll:  function () {
        this.gridStore.removeAll(  );
    }, 


    getList: function () {

        var myList = [];
        this.gridStore.each(function(record){
          myList.push( record.get( 'data' ));
         });
        return myList;
    }, 
    
    getChecked: function () {

        var chkList = [];
        this.gridStore.each(function(record){
			if (record.get('__Checked')) {
              chkList.push( record.get( 'data' ));
			}
         });
        
        return chkList;
    }, 

    setChecked: function ( data, checked  ) {
        // Cambia el estado de seleccion de un registro
        // Que hace si no existe y es check? Lo crea por q es posible q se inserten dos colecciones base y selected   

        var vNode =  _SM.getRecordByDataIx( this.gridStore, 'data', data  ); 
        if ( vNode ) {
            vNode.set( '__Checked', checked );
        } else { 
			this.gridStore.add({
				'data' : data,
				'__Checked' : checked
			});
        } 
    }, 

    addOrRemove: function( data, checked ) {
        // Permite agregar o elimar un registro dependiendo del estado   
        if ( checked )  {
            this.setChecked(  data,  true  );
        } else {
            var vNode =  _SM.getRecordByDataIx( this.gridStore, 'data', data  ); 
            if (  vNode  )   {
                this.gridStore.remove( vNode );
            }
        }
    }
});
