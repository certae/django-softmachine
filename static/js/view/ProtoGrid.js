/*
 *  grid
 * -  store  ( proxy )   
 * -  - model ( reader )  *** 
 */

//TODO: Revizar Allow Null, Listo el Blank en la grilla, falta la forma, falta en el modelo
//TODO: agregar __str__ 

Ext.define('ProtoUL.view.ProtoGrid' ,{
    extend: 'Ext.container.Container',
    alias : 'widget.protoGrid',
    requires: [
	    'Ext.grid.*',
	    'Ext.data.*',
	    'Ext.util.*',
	    'Ext.state.*',
	    'Ext.form.*',
        'Ext.toolbar.TextItem' 
     // 'Ext.selection.CheckboxModel',
    ],
    // iconCls: 'icon-grid',

    initComponent: function() {
        //console.log ( this.protoConcept + '  grid init'  ); 

        // Recupera la clase para obtener la meta ------------------------------------------
        var myMeta = _cllPCI[ this.protoConcept ] ; 
        this.myMeta = myMeta;

        var _pGrid = this; 

        var modelClassName = _PConfig.clsBaseModel + this.protoConcept ; 
        if  (! Ext.ClassManager.isCreated( modelClassName )){
            //console.log ( this.protoConcept, ' ERROR Pci  not loaded ' );
            return; 
        }

        // VErifica si el store viene como parametro ( Detail )
        var myFilter = '';
        if (typeof this.protoFilterBase == 'undefined') {
            // DGT: Agregar parametro Autoload  -  '{"pk" : 0,}'            
            myFilter = myMeta.initialFilter;
            myFilter = Ext.encode(myFilter);
        }   
        
        //console.log (  this.protoConcept, ' Loading store ...  '  ); 

/* */

		var storeDefinition =  {
            model : modelClassName, 
            autoLoad: this.autoLoad || true, 
            pageSize: _PAGESIZE,
            sorters: myMeta.initialSort, 

        	//  proxy.extraParams = {
            protoConcept : this.protoConcept,
            protoFilter : myFilter,
            protoFilterBase: this.protoFilterBase, 
            storeFields  : myMeta.storeFields.toString()
        };

        this.store = getStoreDefinition( storeDefinition )


		// Start Row Editing PlugIn
	    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
	        clicksToMoveEditor: 1,
	        autoCancel: false
	    });


        // Definicion de Columnas y Fields        ------------------------------------------
        var myColumns = [];

        // DGT adding RowNumberer  
        if ( ! myMeta.hideRowNumbers ) {
        	// myColumns.push(Ext.create('Ext.grid.RowNumberer',{"width":37, "draggable":false}));
        	myColumns.push( this._getRowNumberDefinition() )
        }
       
        // DGT** Copia las columnas   
        for (var ix in myMeta.fields ) {
			var vFld = myMeta.fields[ix] 
            if ( vFld.storeOnly ) continue;

            var col = getColDefinition( vFld  );
            myColumns.push( col  );
        }
        
        this.myColumns = myColumns; 
        
        //   gridColumns: Es un subconjuto para poder manejar diferentes conf de columnas  
        var gridColumns =  myColumns;
        
        // Vista por defecto
        var myDefaultCols = myMeta.gridColumns;
        if ( myDefaultCols.length > 0 ) {
            try {  gridColumns = this.getViewColumns( myDefaultCols ); 
            } catch(e) {}
        }
        
        // var selModel = Ext.create('Ext.selection.CheckboxModel', {
            // listeners: { selectionchange: function(sm, selections) {} }
        // });

		this.editMode = false; 
        
        var grid = Ext.create('Ext.grid.Panel', {
			plugins: ['headertooltip',
  			        	rowEditing
  					],            
			// selModel: selModel,
            columns : gridColumns,   
            store : this.store,  
            stripeRows: true, 
            
            listeners: {
                scope: this,
                selectionchange: function(selModel, selected) {
                	// Expone la fila seleccionada. 
                	this.selected = selected[0] || null;
                	
                	// Si hay botones o eltos de la interface a modificar 
                    // grid4.down('#removeButton').setDisabled(selections.length == 0);
                }, 
                

	        itemmouseenter: function(view, record, item) {
	        	// Esto maneja los tooltip en las las filas
	        	//TODO: crear la columna _ptStatus para poder manejar l'interaction con el BackEnd.  
	        	var msg = record.get('_ptStatus')
				switch (msg)
				{
					case _ROW_ST.EXIST:
					case _ROW_ST.NOEXIST:
					case _ROW_ST.ADD:
					case _ROW_ST.UPD:
					case _ROW_ST.DEL:
					  break;
					default:
					  msg = ''	
				}        	
	        	// Asigna un tooltip a la fila, pero respeta los de cada celda y los de los Actiosn
	        	Ext.fly(item).set({'data-qtip': msg });
	            
	            // Dgt :  Este tooltip evita las actions columns 
		        // Ext.fly(item).select('.x-grid-cell:not(.x-action-col-cell)').set({'data-qtip': 'My tooltip: ' + record.get('name')});
	        	}
                
            }, 
            
		    tools: [{
		        itemId: 'toolCancelEdit',
		        type: 'close',
		        hidden: true,
				scope: this,
		        handler: this.cancelChanges 
		     },{
		        itemId: 'toolSave',
		        type: 'save',
		        hidden: true,
				scope: this,
		        handler: this.saveChanges 
		     },{
		        type: 'gear',
		        handler: showMetaConfig,
		        tooltip: 'Meta Config ... '
		     },{
		        type: 'gear',
		        handler: showColsConfig,
		        tooltip: 'ColsConfig ... '
		    }], 
		    
 
		   viewConfig: {
			   
                listeners: {
                    cellclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
                    	// Esto maneja los vinculos en los campos 
                        var linkClicked = (e.target.tagName == 'A');
                        var clickedDataIndex = view.panel.headerCt.getHeaderAtIndex(cellIndex).dataIndex;
                        if (linkClicked && clickedDataIndex ) {
                            alert(record.get('id'));
                        }
                    }
                }, 			   
			   
		        getRowClass: function(record, rowIndex, rowParams, store){
                	//	Esto permite marcar los registros despues de la actualizacion 
		        	var stRec = record.get('_ptStatus');
		        	
					switch (stRec)
					{
					case _ROW_ST.EXIST:
					case _ROW_ST.ADD:
						record.dirty = true;
						if ( record.getId() == 0 ) {
							record.phantom = true;   		        		
						}
					  	break;
					  	
					case _ROW_ST.NOEXIST:
					  	break;

					case _ROW_ST.UPD:
						record.dirty = true;
					  	break;

					case _ROW_ST.DEL:
					case _ROW_ST.NEWROW:
					  	break;

					default:
						stRec = ''
					  	break;
					}        	
		        	
		            return stRec;
		        }
		   },
           		    
            
        }); 

        this._extGrid = grid;
        this.setGridTitle( this ) ;

//----------


        var comboPageSize = new Ext.form.ComboBox({
          name : 'perpage',
          width: 60,
          store: new Ext.data.ArrayStore({
            fields: ['id'],
            data  : _ComboPageSize
          }),
          mode : 'local',
          value: '50',

          listWidth     : 60,
          triggerAction : 'all',
          displayField  : 'id',
          valueField    : 'id',
          editable      : false,
          forceSelection: true
        });
        
        
        //         ---------------------------------------------------

        var itemDetail = ['-']; 

        if ( this.protoIsDetailGrid ) {
            itemDetail.push ({
                    text: _detailViewNewTab,
                    iconCls : 'icon-promote',
                    handler : onMenuPromoteDetail
                })  
        } 

        itemDetail.push( comboPageSize, _gridBbPerPage );
        
//-----------

        var panelItems =   [{
                region: 'center',
                flex: 1,
                layout: 'fit',
                minSize: 50,
                items: grid 
            }, {
                xtype: 'pagingtoolbar',
                region: 'south',
                store: this.store,
                displayInfo: true,
                items: itemDetail,
                afterPageText : _gridBbOf  + ' {0}',
                beforePageText : _gridBbPage,  
                displayMsg: _gridBbShow + ' : {0} - {1} ' + _gridBbOf +' {2}'
                // emptyMsg: "No register to display"
            }
            ];


        comboPageSize.on('select', function(combo, record) {
            this.store.pageSize = parseInt( combo.getValue(), 10);
            this.store.load(); 
        }, this);            
        

// --------------------------------------------------------------------------------

        var pSheetProps = myMeta.protoSheetProperties;
        if (pSheetProps.length != 0 ) {
            
            this.IdeSheet = Ext.id();
            panelItems.push( {
                    region: 'east',
                    id: this.IdeSheet, 
//                  title: pSheetProps.title ,
                    collapsible: true,
                    collapsed: false ,
                    split: true,
                    flex: 1,
                    layout: 'fit',
                    minSize: 50,
                    xtype: 'panel',
                    autoScroll: true,
                    border: false
            });
        } 
        
//-----------        

        Ext.apply(this, {
            layout: 'border',
            defaults: {
                collapsible: false,
                split: false
            },
            items: panelItems 
        });


//------        
        this.addEvents(
            'rowClick', 'promoteDetail', 'selectionChange'
        );

        
        this.callParent(arguments);

        //  Datos en el Store this.store.getAt(index)
        // var data = grid_company.getSelectionModel().selected.items[0].data;
        
        grid.on({
            itemClick: {fn: function (g, rowIndex, e) {
                _pGrid.rowData = rowIndex.data;

                this.fireEvent('rowClick', g, rowIndex, e);
                prepareSheet();

            	}, scope: this }
            	
        });                 

        grid.on({
            beforeedit: {fn: function ( edPlugin, e, eOpts) {
				if ( ! this.editMode )  return false; 
            	}, scope: this }
            	
        });                 

		// grid.on('beforeedit', function( edPlugin, e, eOpts  ) {
			// if ( ! this.editMode )  return false; 
			// /* DGT: Manejo de edicion condicional segun datos
				// Puede ser una coleccion 
					// CampoCriterio, Condicion, Lista de campos habilidatos 
// 					
			    // if (e.record.get('status') == "0")
			        // grid.getPlugin('rowEditing').editor.form.findField('xx').disable();
			    // else
			        // grid.getPlugin('rowEditing').editor.form.findField('xx').enable();
			 // */ 
		// });


        function showMetaConfig() {
        	var safeConf =  clone( myMeta , 0, exclude =['dict','gridDefinition', 'formDefinition'] )
        	showConfig( 'MetaConfig', safeConf )
        }

        function showColsConfig() {
        	var safeConf =  clone( myColumns )
        	showConfig( 'ColsConfig' , safeConf  )
        }
        
        function showConfig( title , myConf ) {

        	Ext.Msg.show({
               title: title,
               multiline : true,   
               width : 500, 
               value: Ext.encode( myConf ) 
               });

        }
        

        function prepareSheet( ){

            var pSheetProps = myMeta.protoSheetProperties;
            if (pSheetProps.length == 0 ) {
              return;  
            }

            var pSheets = myMeta.protoSheets;
            
            var pSheetSelector = myMeta.protoSheetSelector;
            var pSheetCriteria = _pGrid.rowData[ pSheetSelector ] 
            var pSheet = undefined;  
            
            for (var ix in pSheets  ) {
            	
            	if ( ix == 'DEFAULT' ) {
                	pSheet =  pSheets[ix]  
            	}; 
            	
            	if ( ix == pSheetCriteria ) { 
            		pSheet =  pSheets[ix];
            		break; 
                }
            };

           if (  pSheet == undefined ) { return }; 
            
           var pTemplate = pSheet.template ; 

           for (var ix in pSheetProps) {
                var vFld  =  pSheetProps[ix]; 

                var pKey = '{{' + vFld + '}}';
                var pValue =  _pGrid.rowData[ vFld ];
                pTemplate = pTemplate.replace( pKey , pValue  ); 

            }

            var sheet = Ext.getCmp( _pGrid.IdeSheet );
            sheet.setTitle( pSheet.title );
            sheet.update( pTemplate );

            // Expone el template 
            _pGrid.sheetHtml = pTemplate ;             

        };
        
        function onMenuPromoteDetail() {

            if ( _pGrid.detailTitlePattern ) {
	            var detailSubTitle =  _pGrid._masterDetail.protoMasterGrid.rowData[ _pGrid.detailTitlePattern ];
	            detailSubTitle = _pGrid.detailTitleLbl + ' ' + detailSubTitle
            }
        	
            __TabContainer.addTabPanel(
                   _pGrid.store.protoConcept , 
                   _pGrid.store.getProxy().extraParams.protoFilterBase, 
                   detailSubTitle 
               ); 
            
        };
        
    },

	_getRowNumberDefinition: function () {

		//FIX:  Cuando la columna es locked,  el headerCT va nulo y no puede asignar el tooltip 
		
		// var rowNumberCol = Ext.create('Ext.grid.RowNumberer',{"width":37, "draggable":false , "sortable": false})
		var rowNumberCol = { xtype: 'rownumberer', width:37, draggable:false,  sortable: false } // locked: true, lockable: false }
    	return 	rowNumberCol
      },
    
//    onItemClick: function (g, rowIndex, e) {
//        this.rowData = rowIndex.data;
//        prepareSheet();
//        this.fireEvent('rowClick', g, rowIndex, e);
//    },  

    getViewColumns: function (  viewCols  ) {
        
        vColumns = [];
        if ( ! this.myMeta.hideRowNumbers ) {
        	vColumns.push( this._getRowNumberDefinition());
        }; 
        
        for (var ixV in viewCols  ) {
            var vCol  =  viewCols[ixV];

            for (var ixC in this.myColumns  ) {
                var gCol  =  this.myColumns[ixC];
                if ( gCol.dataIndex == vCol ) {
                    vColumns.push( gCol );
                    break 
                }
            }            
        }
        
        return vColumns

    },
    
    configureColumns: function (  viewCols  ) {

        vColumns = this.getViewColumns( viewCols )

		//Fix: hay un error la primera vez q pasa por aqui??? 
        this._extGrid.view.refresh();

        // Configurar columnas de la grilla
        this._extGrid.headerCt.removeAll()
        this._extGrid.headerCt.add( vColumns );
        this._extGrid.view.refresh();
        

    }, 
    
    setGridTitle: function( me ){
    	var gridTitle = ''; 
    	
    	if ( me.detailTitle ) {
    		gridTitle = '" ' + me.detailTitle + ' "' 
    	} else if ((me.protoIsDetailGrid != true ) && ( me.protoFilterBase != undefined ) ) { 
    		gridTitle = me.protoFilterBase  
    	};
        
    	if ( me.protoLocalFilter ) {
    		if ( gridTitle ) { gridTitle += ' ; '  };
    		gridTitle +=  me.protoLocalFilter ; 
    	} 

		if ( gridTitle ) { gridTitle = ' filtrés par ' +  gridTitle + '' };
    	
    	var gridTitle = me.myMeta.shortTitle + gridTitle ; 
        me._extGrid.setTitle( gridTitle )  
    }, 
    

    setEditMode: function( editMode ){

		this.editMode = editMode ;    	

		if (editMode ) {
			this._extGrid.down('#toolSave').show();
			this._extGrid.down('#toolCancelEdit').show();
		} else {
			this._extGrid.down('#toolSave').hide();
			this._extGrid.down('#toolCancelEdit').hide();
		}
		
   },


	setDefaults: function() {

		var vDefault = {}
        for (var ix in this.myMeta.fields ) {
			var vFld = this.myMeta.fields[ix] 
            if ( ! vFld['defaultValue'] ) continue;
            vDefault[ vFld.name  ]  = vFld['defaultValue'] ;
        };
        return vDefault
	}, 
		
	
	addNewRecord: function() {
		if ((! this._extGrid ) || ( ! this.editMode )) return; 

        var rec = new this.store.model( this.setDefaults()  ) 
        this.store.insert(0, rec);
	}, 
	
	duplicateRecord: function() {
		if ((! this._extGrid ) || ( ! this.editMode )) return; 
		
        var rec =  this.selected
        if ( rec )  {
        	rec = rec.copy()
        	rec.data.id = undefined 
        	rec.phantom = true 
        	this.store.insert(0, rec );
        } 
        	
	}, 
	
	deleteCurrentRecord: function() {
		if ((! this._extGrid ) || ( ! this.editMode )) return; 

        // var rec = this._extGrid.getView().getSelectionModel().getSelection()[0];
        var rec =  this.selected
        if ( rec ) this.store.remove( rec );
	}, 

	setEditionOff: function() {
		
		if ((! this._extGrid ) || ( ! this.editMode )) return; 
		 
		// Invocada desde el tool, debe cancelar la edicion y retroalimentar el toolbar 
		this.setEditMode( false ) 
		
		// Reconfigura el toolBar 
		if ( this._toolBar ) {
			this._toolBar.toggleEditMode( false, true )
		};   

	}, 
    
    saveChanges: function(){
        this.store.sync();
    }, 
    
    cancelChanges: function() {
    	this.setEditionOff()
        this.store.load(); 
    } 
    
});
