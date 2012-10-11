
Ext.define('ProtoUL.view.ProtoGrid' ,{
    extend: 'Ext.Panel',                                
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

    protoOption: null,
    
    // Internals 
    myMeta : null,  
    initialFilter : null, 
    
    initComponent: function() {

        var me = this;         

        if ( ! loadPci( this.protoOption, false ) ) {
            Ext.Msg.show({
               title: this.protoOption ,
               value: 'ERROR Pci  not loaded' 
            });
            return; 
        }

        // Recupera la clase para obtener la meta ------------------------------------------
        var myMeta = clone( _cllPCI[ this.protoOption ] );
        this.myMeta = myMeta;
        this.myFieldDict = getFieldDict( myMeta )            

        // VErifica si el store viene como parametro ( Detail )
        var myFilter = '';
        
        // Agrega  filtro nulo si la grilla es detalle 
        if ( this.initialFilter ) {
            myMeta.gridConfig.initialFilter = this.initialFilter 
        }
        
        if ( ! this.baseFilter ) {
            myFilter = myMeta.gridConfig.initialFilter;
            myFilter = Ext.encode(myFilter);
        }   
        
        var storeDefinition =  {
            protoOption : this.protoOption, 
            autoLoad: this.autoLoad || true, 
            pageSize: _PAGESIZE,
            sorters: myMeta.gridConfig.initialSort , 

            // proxy.extraParams = {
            protoFilter : myFilter,
            baseFilter: this.baseFilter, 
            sProtoMeta  : getSafeMeta( myMeta )    
        };

    

        // Start Row Editing PlugIn
        me.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });


        // Definicion de Columnas y Fields        ------------------------------------------
        var myColumns = [];

        // DGT adding RowNumberer  
        if (( ! myMeta.gridConfig.hideRowNumbers ) && ( myMeta.pciStyle == 'grid' )) {
            myColumns.push( this._getRowNumberDefinition() ); 
        }


        if ( me.detailDefinition ) {

            // El estilo de los detalles es siemrpe grid             
            myMeta.pciStyle = 'grid';             
            
            // Columnas heredadas en caso de ser un detalle 
            var nDetId = me.detailDefinition.detailField.replace( /__pk$/, '_id' ); 
            var vFld = me.myFieldDict[ nDetId ];
            
            // Asigna el titulo 
            var nDetTitle =  nDetId;
            if ( vFld ) { nDetTitle = me.detailDefinition.masterTitleField || vFld.fkField; }  
        } 


        if ( myMeta.pciStyle == 'tree' ) {
            me.store = getTreeStoreDefinition( storeDefinition )
        } else { 
            me.store = getStoreDefinition( storeDefinition )
        }

        
        // DGT** Copia las columnas   
        for (var ix in myMeta.fields ) {
            var vFld = myMeta.fields[ix] 
            if ( vFld.storeOnly ) continue;

            var col = getColDefinition( vFld  );
            if ( col.dataIndex in oc([nDetId , nDetTitle])  ) { 
                col['readOnly'] = true  
                delete col['editor']
            }

            if ( vFld.storeOnly ) continue;
            
            if (( myMeta.pciStyle == 'tree' ) && ( vFld.treeColumn == vFld.name  )) {
                col.xtype = 'treecolumn'
            };  

            myColumns.push( col  );
        }
        
        this.myColumns = myColumns; 
        
        //   gridColumns: Es un subconjuto para poder manejar diferentes conf de columnas  
        var grid, 
            gridColumns =  myColumns, 
            myDefaultCols = myMeta.gridConfig.listDisplay;
            
        if ( myDefaultCols.length > 0 ) {
            try {  gridColumns = this.getViewColumns( myDefaultCols ); 
            } catch(e) {}
        }
        
        // var selModel = Ext.create('Ext.selection.CheckboxModel', {
            // listeners: { selectionchange: function(sm, selections) {} }
        // });

        this.editable = false; 

        if ( myMeta.pciStyle == 'tree' ) {

            grid = Ext.create('Ext.tree.Panel', {
                border : false, 
                region: 'center',
                flex: 1,
                layout: 'fit',
                minSize: 50,
                // plugins: [ 'headertooltip'],                            columns : gridColumns,   
                store : this.store,  
                stripeRows: true, 
                
                 // Tools  ( necesario para AddTools )
                tools: [], 
                
                listeners: {
                    scope: this,
                    selectionchange: function(selModel, selected) {
                        // Expone la fila seleccionada. 
                        this.selected = selected[0] || null;
                    } 
                    
                }, 
    
                viewConfig: {
                    // Manejo de rows y cells  
                   
                    listeners: {
                        cellclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
                            // Esto maneja los vinculos en los campos 
                            var linkClicked = (e.target.tagName == 'A');
                            var clickedDataIndex = view.panel.headerCt.getHeaderAtIndex(cellIndex).dataIndex;
                            if (linkClicked && clickedDataIndex ) {
                                
                                var myZField = me.myFieldDict[ clickedDataIndex ] 
                                if ( myZField &&  myZField.zoomModel && myZField.fkId ) {
                                    var formController = Ext.create('ProtoUL.UI.FormController', {});
                                    
                                    // Redefine el scope  
                                    formController.openProtoForm.call( formController, myZField.zoomModel , record.get( myZField.fkId ) )
    
                                } else if ( myZField &&  ( myZField.zoomModel == '@cellValue')) {
                                    // Podria usarse con @FieldName para indicar de donde tomar el modelo o la funcion  
    
                                    var pModel  =  record.get( myZField.name ) 
                                    mainVP.loadPciFromMenu( pModel ) 
    
                                } else {
                                    errorMessage( 'LinkedForm definition error : ' +  clickedDataIndex, 
                                                  'zoomModel : ' + myZField.zoomModel + '<br>' +
                                                  'fkId : ' + myZField.fkId  
                                                   )
                                }; 
                                
                            }
                        }, 
                        
                    }
               }
                
            }); 


        } else { 
                
            grid = Ext.create('Ext.grid.Panel', {
                border : false, 
                region: 'center',
                flex: 1,
                layout: 'fit',
                minSize: 50,
                
                
                plugins: [    'headertooltip', this.rowEditing ],            
                // selModel: selModel,
                columns : gridColumns,   
                store : this.store,  
                stripeRows: true, 
                
                 // Tools  ( necesario para AddTools )
                tools: [], 
                
                listeners: {
                    scope: this,
                    selectionchange: function(selModel, selected) {
                        // Expone la fila seleccionada. 
                        this.selected = selected[0] || null;
                        
                        // Si hay botones o eltos de la interface a modificar 
                        // grid4.down('#removeButton').setDisabled(selections.length == 0);
    
                    }, 
                    
                    keydown: function(a,b,c,d,e,f) {
                        console.log(a,b,c,d,e,f) 
                    }, 
                    
                    itemmouseenter: function(view, record, item) {
                        // Esto maneja los tooltip en las las filas
                        var msg = record.get('_ptStatus')
                        if ( msg == _ROW_ST.NEWROW  ) msg = '';
        
                        // Asigna un tooltip a la fila, pero respeta los de cada celda y los de los Actiosn
                        Ext.fly(item).set({'data-qtip': msg });
                        
                        // Dgt :  Este tooltip evita las actions columns 
                        // Ext.fly(item).select('.x-grid-cell:not(.x-action-col-cell)').set({'data-qtip': 'My tooltip: ' + record.get('name')});
                    }
                    
                }, 
    
                // processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
                    // if ( type == 'keydown' ) { 
                        // console.log( view, cell, recordIndex, cellIndex, e )
                    // } 
                // }, 
     
                viewConfig: {
                    // Manejo de rows y cells  
                   
                    listeners: {
                        cellclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
                            // Esto maneja los vinculos en los campos 
                            var linkClicked = (e.target.tagName == 'A');
                            var clickedDataIndex = view.panel.headerCt.getHeaderAtIndex(cellIndex).dataIndex;
                            if (linkClicked && clickedDataIndex ) {
                                
                                var myZField = me.myFieldDict[ clickedDataIndex ] 
                                if ( myZField &&  myZField.zoomModel && myZField.fkId ) {
                                    var formController = Ext.create('ProtoUL.UI.FormController', {});
                                    
                                    // Redefine el scope  
                                    formController.openProtoForm.call( formController, myZField.zoomModel , record.get( myZField.fkId ) )
    
                                } else if ( myZField &&  ( myZField.zoomModel == '@cellValue')) {
                                    // Podria usarse con @FieldName para indicar de donde tomar el modelo o la funcion  
    
                                    var pModel  =  record.get( myZField.name ) 
                                    mainVP.loadPciFromMenu( pModel ) 
    
                                } else {
                                    errorMessage( 'LinkedForm definition error : ' +  clickedDataIndex, 
                                                  'zoomModel : ' + myZField.zoomModel + '<br>' +
                                                  'fkId : ' + myZField.fkId  
                                                   )
                                }; 
                                
                            }
                        }, 
                        
                    },                
                   
                    getRowClass: function(record, rowIndex, rowParams, store){
                        //    Esto permite marcar los registros despues de la actualizacion 
                        var stRec = record.get('_ptStatus');
                        if ( stRec ) { 
                            if ( stRec == _ROW_ST.NEWROW ) { return stRec; } 
                            else { return _ROW_ST.ERROR; }
                        } else { return '' }
                        
                    }
               }
                
            }); 

        }

        this._extGrid = grid;
        this.setGridTitle( this ) ;


// ---- GridControllers

        if ( this.gridController ) {
            this.gridController.myGrid = this
            this.gridController.store = this.store
        } else {
            this.gridController = Ext.create('ProtoUL.UI.GridController', {
                myMeta: myMeta, 
                myGrid : this, 
                store : this.store  
            }); 
        }
        this.gridController.addGridTools()

        var sheetCrl = Ext.create('ProtoUL.UI.GridSheetController', { myGrid : this }); 
        

// ---

        var myItems = [ grid ]
        var mySheet = sheetCrl.getSheetConfig()
        if ( mySheet ) myItems.push( mySheet )  

        Ext.apply(this, {
            layout: 'border',
            border : false, 
            defaults: { collapsible: false, split: false },
            items: myItems
        });

        this.addEvents(
            'rowClick', 'rowDblClick', 'promoteDetail', 'selectionChange'
        );

        this.callParent(arguments);
        this.gridController.addNavigationPanel(); 

        
        // Datos en el Store this.store.getAt(index)
        // var data = grid.getSelectionModel().selected.items[0].data;
        
        // grid.on({ itemClick: {fn: function ( gView, record, item, rowIndex,  e,  eOpts ) {

        grid.on({
            select: {fn: function ( rowModel , record,  rowIndex,  eOpts ) {
                // SelectionModel.rowSelected 
                me.rowData = record.data;
                this.fireEvent('rowClick', rowModel, record, rowIndex,  eOpts );
                if ( me.IdeSheet ) { sheetCrl.prepareSheet(); }
            }, scope: this }, 

            celldblclick: {fn: function ( tbl, el,  cellIndex, record, tr, rowIndex, e,  eOpts ) {
                // para seleccionar en el zoom         
                // Si esta en modo edicion no dispara nada para permitir entrar al editor 
                if ( me.editable ) return  
                me.fireEvent('rowDblClick', record, rowIndex  );
            }, scope: me }, 


            beforeedit: {fn: function ( edPlugin, e, eOpts) {
                if ( ! this.editable )  return false;
                // Resetea el zoom 
                for (var ix in e.grid.columns ) {
                    var vFld = e.grid.columns[ix]
                    var initialConf = vFld.initialConfig 
                    if (! initialConf.editor ) continue;
                    if (  initialConf.editor.xtype != 'protoZoom' ) continue;
                    
                    var zoom = vFld.getEditor()
                    zoom.resetZoom()
                }
            }, scope: me }
                
        });                 

        // Fires when the user started editing but then cancelled the edit. ...
        // grid.on('canceledit', function(editor, e, eOpts) {
            // console.log( 'canceledit' ) 
        // });


        // Fires after editing, but before the value is set in the record. ...
        grid.on('validateedit', function(editor, e, eOpts) {
            
            // Resetea el status despues de la edicion 
            if ( ! e.record.getId() ) {
                e.record.phantom = true;                           
                e.record.data._ptStatus = _ROW_ST.NEWROW 
            } else {
                e.record.data._ptStatus = '' 
            }
            e.record.dirty = true;

            // Manejo del retorno del zoom 
            for (var ix in e.grid.columns ) {
                var vFld = e.grid.columns[ix]
                var initialConf = vFld.initialConfig 
                if (! initialConf.editor ) continue;
                if (  initialConf.editor.xtype != 'protoZoom' ) continue;
                
                var zoom = vFld.getEditor()
                var idIndex = initialConf.editor.fkId 
                            
                if ( ! zoom.zoomRecord ) continue; 

                // console.log( e , zoom.zoomRecord.data.__str__ )
                // Actualiza el Id con el dato proveniente del zoom 

                // fix: Agrega el modificado en caso de q no se encuentre         
                if ( ! e.record.modified[ idIndex ]  ) {
                    e.record.modified[ idIndex ] = e.record.data[ idIndex ]  
                }         
                  
                e.record.data[ idIndex ] = zoom.zoomRecord.data.id

            }

        });


        
    },

    _getRowNumberDefinition: function () {
        var rowNumberCol = { xtype: 'rownumberer', width:37, draggable:false,  sortable: false } // locked: true, lockable: false }
        return rowNumberCol
      },
    
    getViewColumns: function (  viewCols  ) {
        
        var vColumns = [];
        if ( ! this.myMeta.gridConfig.hideRowNumbers ) {
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

        var vColumns = this.getViewColumns( viewCols )

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
        // } else if (( ! me.protoIsDetailGrid ) && ( me.baseFilter != undefined ) ) { 
        } else if ( me.baseFilter != undefined )  { 
            gridTitle = me.baseFilter  
        };
        
        if ( me.protoLocalFilter ) {
            if ( gridTitle ) { gridTitle += ' ; '  };
            gridTitle +=  me.protoLocalFilter ; 
        } 

        if ( gridTitle ) { gridTitle = ' filtrés par ' +  gridTitle + '' };
        
        var gridTitle = me.myMeta.shortTitle + gridTitle ; 
        me._extGrid.setTitle( gridTitle )  
    }, 
    
    
    addNewRecord: function( zoomForm ) {
        if ( !(  this.editable  ||  zoomForm )) return; 
        this.insertNewRecord ( getNewRecord( this.myMeta, this.store )  ) 
    }, 
    

    duplicateRecord: function() {
        if ((! this._extGrid ) || ( ! this.editable )) return; 
        
        var rec =  this.selected
        if ( rec )  this.insertNewRecord ( rec.copy()  ) 
    }, 

    insertNewRecord: function( rec ) {
        
        rec.data._ptStatus = _ROW_ST.NEWROW 
        rec.data._ptId = rec.get( 'id' )   
        rec.data.id = undefined 
        rec.phantom = true 
        this.store.insert(0, rec );
        
        // Selecciona el registro adicionado
        var sm = this._extGrid.getSelectionModel()
        sm.select( 0 )
    },


    getRowIndex: function() {
        
        var sm = this._extGrid.getSelectionModel();
        var rowIndex = this.store.indexOf( sm.getSelection()[0])
        if ( rowIndex < 0 ) rowIndex = 0  
        return rowIndex 
         
    }, 
    
    deleteCurrentRecord: function() {
        if ((! this._extGrid ) || ( ! this.editable )) return; 
        if ( this.rowEditing ) { this.rowEditing.cancelEdit(); }


        var rowIndex = this.getRowIndex();  

        var sm = this._extGrid.getSelectionModel();
        this.store.remove( sm.getSelection()  );

        // this.grid.store.indexOf( this.selections.itemAt(0) );
        if (this.store.getCount() <= rowIndex ) rowIndex = 0 
        if (this.store.getCount() > 0) {
            sm.select( rowIndex  );
        }        
        
    }, 

    setEditMode: function(  bEdit ) {
        // Deshabilita cualquier operacion al server
        this.store.editMode = bEdit 
        this.gridController.setEditMode( bEdit )
    },  

    saveChanges: function( autoSync ){
        this.store.sync();
        if ( autoSync != undefined )  this.store.autoSync = autoSync  
    }, 
    
    cancelChanges: function() {
        this.store.load(); 
    }, 
    
    loadData: function( grid,  sFilter, sTitle  ) {
        grid.store.clearFilter();
        grid.store.getProxy().extraParams.protoFilter = sFilter;
        grid.store.load();
        
        // Para evitar q al filtrar se quede en una pagina vacia 
        if ( grid.store.currentPage != 1 )  grid.store.loadPage(1);
    },
    
    addTools: function( myTools ) {
        // Controles de edicion en el panel de titulo de la grilla 
        this._extGrid.addTool( myTools )
    } 


});
