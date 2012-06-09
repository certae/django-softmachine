/*
 *  grid
 * -  store  ( proxy )   
 * -  - model ( reader )  *** 
 */

//TODO: Revizar Allow Null, Listo el Blank en la grilla, falta la forma, falta en el modelo

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

    /* 
     * @Required 
     * protoOption : App.Model.View  
     */
    protoOption: null, 



    initComponent: function() {
        

        var me = this;         

        // Recupera la clase para obtener la meta ------------------------------------------
        var myMeta = _cllPCI[ this.protoOption ] ; 
        this.myMeta = myMeta;

        var _pGrid = this; 

        if ( ! loadPci( this.protoOption, false ) ) {
            Ext.Msg.show({
               title: this.protoOption ,
               value: 'ERROR Pci  not loaded' 
               });
            return; 
        }

        // VErifica si el store viene como parametro ( Detail )
        var myFilter = '';
        
        // if (typeof this.baseFilter == 'undefined') {
        // FIX: Verificar q si lo hace bien 
        if ( ! this.baseFilter ) {
            myFilter = myMeta.gridConfig.initialFilter;
            myFilter = Ext.encode(myFilter);
        }   
        
        //console.log (  this.protoOption, ' Loading store ...  '  ); 

        // prepara la meta 
        var excludeP = ['__ptDict', 'protoForm', 'sheetConfig', 'protoViews', 'protoDetails']
        var safeMeta =  clone( myMeta, 0, excludeP );
        
        var storeDefinition =  {
            protoOption : this.protoOption, 
            autoLoad: this.autoLoad || true, 
            pageSize: _PAGESIZE,
            sorters: clone(  myMeta.gridConfig.initialSort ), 

            // proxy.extraParams = {
            protoFilter : myFilter,
            baseFilter: this.baseFilter, 
            sProtoMeta  : Ext.encode( safeMeta )    
        };

        me.store = getStoreDefinition( storeDefinition )


        // Start Row Editing PlugIn
        me.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });



        // Definicion de Columnas y Fields        ------------------------------------------
        var myColumns = [];

        // DGT adding RowNumberer  
        if ( ! myMeta.gridConfig.hideRowNumbers ) {
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
        var myDefaultCols = myMeta.gridConfig.listDisplay;
        if ( myDefaultCols.length > 0 ) {
            try {  gridColumns = this.getViewColumns( myDefaultCols ); 
            } catch(e) {}
        }
        
        // var selModel = Ext.create('Ext.selection.CheckboxModel', {
            // listeners: { selectionchange: function(sm, selections) {} }
        // });

        this.editMode = false; 
        
        var grid = Ext.create('Ext.grid.Panel', {
            plugins: [    'headertooltip',
                        this.rowEditing
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
                var msg = record.get('_ptStatus')
                if ( msg == _ROW_ST.NEWROW  ) msg = '';

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
                scope: this,
                handler: showMetaConfig,
                tooltip: 'Meta Config ... '
             },{
                type: 'gear',
                scope: this,
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
                    //    Esto permite marcar los registros despues de la actualizacion 
                    var stRec = record.get('_ptStatus');
                    if ( stRec ) { 

                        if ( stRec == _ROW_ST.NEWROW ) {
                            return stRec;
                        } else {
                            return _ROW_ST.ERROR;
                        }
                    } else { return '' }
                    
                }
           }
            
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
                
                firstText : _gridFirstText, 
                nextText : _gridNextText, 
                prevText : _gridPrevText, 
                lastText : _gridLastText, 
                refreshText : _gridRefreshText,  

                displayMsg: _gridBbShow + ' : {0} - {1} ' + _gridBbOf +' {2}'
                // emptyMsg: "No register to display"
            }
            ];


        comboPageSize.on('select', function(combo, record) {
            this.store.pageSize = parseInt( combo.getValue(), 10);
            this.store.load(); 
            if ( this.store.currentPage != 1 ) {
            	this.store.loadPage(1);
            }

            
        }, this);            
        

// --------------------------------------------------------------------------------

        var pSheetProps = myMeta.sheetConfig.protoSheetProperties;
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

        // TODO: Agregar un evento para el reload ( verificar refresh  ) de la grilla y afectar MasterDetail,  ZoomSelected 
        this.addEvents(
            'rowClick', 'rowDblClick', 'promoteDetail', 'selectionChange'
        );

        
        this.callParent(arguments);

        //  Datos en el Store this.store.getAt(index)
        // var data = grid_company.getSelectionModel().selected.items[0].data;
        
        // grid.on({
            // itemClick: {fn: function ( gView, record, item, rowIndex,  e,  eOpts ) {
                // // Table.itemClick 
                // _pGrid.rowData = record.data;
                // this.fireEvent('rowClick', gView, record, item, rowIndex,  e,  eOpts );
                // prepareSheet();
                // }, scope: this }
        // });                 


        grid.on({
            select: {fn: function ( rowModel , record,  rowIndex,  eOpts ) {
                // SelectionModel.rowSelected 
                _pGrid.rowData = record.data;

                this.fireEvent('rowClick', rowModel, record, rowIndex,  eOpts );
                prepareSheet();

                }, scope: this }
        });                 

        grid.on({
            // Evento DblClick para seleccionar en el zoom         
            celldblclick: {fn: function ( tbl, el,  cellIndex, record, tr, rowIndex, e,  eOpts ) {
                // Si esta en modo edicion no dispara nada para permitir entrar al editor 
                if ( me.editMode ) return  
                me.fireEvent('rowDblClick', record, rowIndex  );
            }, scope: me }
        });                 

// ---------------------------------------------------------------------------------------------- 


        // Fires before editing is triggered. ...
        grid.on({
            beforeedit: {fn: function ( edPlugin, e, eOpts) {
                if ( ! this.editMode )  return false;
                
                // Resetea el zoom 
                for (var ix in e.grid.columns ) {
                    var vFld = e.grid.columns[ix]
                    var initialConf = vFld.initialConfig 
                    if (! initialConf.editor ) continue;
                    if (  initialConf.editor.xtype != 'protoZoom' ) continue;
                    
                    var zoom = vFld.getEditor()
                    zoom.resetZoom()
                }
                
                
                // TODO: Manejo de edicion condicional segun datos
                // Parametros: una coleccion ( CampoCriterio, Condicion, Lista de campos habilidatos ) 
                // if (e.record.get('status') == "0")
                    // grid.getPlugin('rowEditing').editor.form.findField('xx').disable();
                // else 
                    // grid.getPlugin('rowEditing').editor.form.findField('xx').enable();
                
                 
                }, scope: this }
                
        });                 

        // Fires when the user started editing but then cancelled the edit. ...
        // grid.on('canceledit', function(editor, e, eOpts) {
            // console.log( 'canceledit' ) 
        // });


        // Fires after editing, but before the value is set in the record. ...
        grid.on('validateedit', function(editor, e, eOpts) {
            
            // e : Object 
            // grid - The grid
            // record - The record that was edited

            // originalValues - ( Validate ) The original values for the field, before the edit (only when using RowEditing)
            // record.data  
            // record.raw   
            
            // field - The field name that was edited
            // value - The value being set
            // row - The grid table row
            // column - The grid Column defining the column that was edited.
            // rowIdx - The row index that was edited
            // colIdx - The column index that was edited
            // cancel - Set this to true to cancel the edit or return false from your handler. 
            // newValues -         ( formated ) The new values being set (only when using RowEditing)
            // view - The grid view (only when using RowEditing)
            // store - The grid store (only when using RowEditing)
            
            // console.log( 'validateedit' ) 


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


        // Fires after a editing. ...
        // grid.on('edit', function(editor, e, eOpts) {
            // commit the changes right after editing finished
            // e.record.commit();
        // });

// ---------------------------------------------------------------------------------------------- 

        function showMetaConfig() {
            
            var safeConf =  clone( this.myMeta , 0, exclude =['__ptDict'] )
            showConfig( 'MetaConfig', safeConf )
            
        }
        

        function showColsConfig() {
            
            // var safeConf =  clone( myColumns )
            // var safeConf = { a : { a1 : 1, a2: 2}, b : [ 'b1', 'b2']}
            // var safeConf = { a : { a1 : ['1'], a2: []} }

            var safeConf =  clone( this.myMeta , 0, exclude =['__ptDict'] )

            safeConf = Meta2Tree( safeConf, 'pcl' , 'pcl' ) 
            safeConf = Tree2Meta( safeConf ) 

            showConfig( 'ColsConfig' , safeConf  )
        }
        
        function showConfig( title , myConf ) {

            Ext.Msg.show({
               title: title,
               multiline : true,   
               width : 600, 
               height : 400, 
               value: Ext.encode( myConf ) 
               });

        }
        

        function prepareSheet( ){

            var pSheetProps = myMeta.sheetConfig.protoSheetProperties;
            if (pSheetProps.length == 0 ) {
              return;  
            }

            var pSheets = myMeta.sheetConfig.protoSheets;
            
            var pSheetSelector = myMeta.sheetConfig.protoSheetSelector;
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
                
                if ( vFld == 'metaDefinition' ) {
                    pValue = FormatJsonStr( pValue )
                }
                
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
                   _pGrid.store.protoOption , 
                   _pGrid.store.getProxy().extraParams.baseFilter, 
                   detailSubTitle 
               ); 
            
        };
        
    },

    _getRowNumberDefinition: function () {

        //FIX:  Cuando la columna es locked,  el headerCT va nulo y no puede asignar el tooltip 
        
        // var rowNumberCol = Ext.create('Ext.grid.RowNumberer',{"width":37, "draggable":false , "sortable": false})
        var rowNumberCol = { xtype: 'rownumberer', width:37, draggable:false,  sortable: false } // locked: true, lockable: false }
        return     rowNumberCol
      },
    
//    onItemClick: function (g, rowIndex, e) {
//        this.rowData = rowIndex.data;
//        prepareSheet();
//        this.fireEvent('rowClick', g, rowIndex, e);
//    },  

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
        } else if ((me.protoIsDetailGrid != true ) && ( me.baseFilter != undefined ) ) { 
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

    /*
     * @private
     * setDefaults for insert row 
     */
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
        this.insertNewRecord ( rec  ) 
    }, 
    
    duplicateRecord: function() {
        if ((! this._extGrid ) || ( ! this.editMode )) return; 
        
        var rec =  this.selected
        if ( rec )  this.insertNewRecord ( rec.copy()  ) 
            
    }, 

    insertNewRecord: function( rec ) {
        rec.data._ptStatus = _ROW_ST.NEWROW 
        rec.data._ptId = rec.internalId  
        rec.data.id = undefined 
        rec.phantom = true 
        this.store.insert(0, rec );

    },


    getRowIndex: function() {
        
        var sm = this._extGrid.getSelectionModel();
        var rowIndex = this.store.indexOf( sm.getSelection()[0])
        if ( rowIndex < 0 ) rowIndex = 0  
        return rowIndex 
         
    }, 
    
    deleteCurrentRecord: function() {
        if ((! this._extGrid ) || ( ! this.editMode )) return; 

        var rowIndex = this.getRowIndex();  

        var sm = this._extGrid.getSelectionModel();
        this.rowEditing.cancelEdit();
        this.store.remove( sm.getSelection()  );

        // this.grid.store.indexOf( this.selections.itemAt(0) );
        if (this.store.getCount() <= rowIndex ) rowIndex = 0 
        if (this.store.getCount() > 0) {
            sm.select( rowIndex  );
        }        
        
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
    }, 
    
    loadData: function( grid,  sFilter, sTitle  ) {
         
        grid.store.clearFilter();
        grid.store.getProxy().extraParams.protoFilter = sFilter;
    
        // TODO: Cargar el sort, buscarlo en proxy.sorters o setear una var en la grilla 
        grid.store.load();
        
        if ( grid.store.currentPage != 1 ) {
            grid.store.loadPage(1);
        }
         
    },
    
    showMetaConfig: function() {


        var myPcl = Ext.widget('protoPcl', {
            myMeta : this.myMeta, 
            editMode : true  
        });

         var myWin  = Ext.widget('window', {
            constrain: true, 
            title : 'MetaDefinition [ ' + this.myMeta.protoOption + ' ]', 
            closeAction: 'hide',
            width: 800,
            height: 600,
            minHeight: 400,
            minWidth: 400,
            layout: 'fit',
            resizable: true,

            collapsible: true,
            // modal: true,
            items: myPcl
        });
        
        myWin.show()
        
    }, 


     
    showFieldTree: function() {


        var fieldsTree = Ext.widget('protoFieldTree', {
            protoOption : this.myMeta.protoOption, 
            myMeta : this.myMeta
        });

         var myWin  = Ext.widget('window', {
            constrain: true, 
            title : 'MetaDefinition [ ' + this.myMeta.protoOption + ' ]', 
            closeAction: 'hide',
            width: 800,
            height: 600,
            minHeight: 400,
            minWidth: 400,
            layout: 'fit',
            resizable: true,

            collapsible: true,
            // modal: true,
            items: fieldsTree 
 
            
        });
        
        myWin.show()
        
        // var safeConf =  clone( myMeta , 0, exclude =['__ptDict','gridDefinition', 'formDefinition'] )
        // showConfig( 'MetaConfig', safeConf )
    }, 
    
     

showProtoDesigner: function() {

        var protoDesigner = Ext.widget('protoDesigner', {
            myMeta  : this.myMeta,  
            protoOption : this.myMeta.protoOption 
        });

        // var protoDesigner = Ext.widget('jsonpanel', {
            // autoLoad:'/resources/json/pruebaWiz.json' 
        // });


         var myWin  = Ext.widget('window', {
            constrain: true, 
            title : 'ProtoDesigner [ ' + this.myMeta.protoOption + ' ]', 
            closeAction: 'hide',
            width: 1000,
            height: 600,
            minHeight: 400,
            minWidth: 400,
            layout: 'fit',
            resizable: true,

            collapsible: true,
            // modal: true,
            maximizable: true,
            
            items: protoDesigner 
            
        });
        
        myWin.show()
        
        // var safeConf =  clone( myMeta , 0, exclude =['__ptDict','gridDefinition', 'formDefinition'] )
        // showConfig( 'MetaConfig', safeConf )
    }

});
