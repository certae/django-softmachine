/*
 *  grid
 * -  store  ( proxy )   
 * -  - model ( reader )  *** 
 */
Ext.define('ProtoUL.view.ProtoGrid' ,{
    extend: 'Ext.container.Container',
    alias : 'widget.protoGrid',
    requires: [
	    'Ext.grid.*',
	    'Ext.data.*',
	    'Ext.util.*',
	    'Ext.state.*',
	    'Ext.form.*',

        // 'Ext.selection.CheckboxModel', 
        'Ext.toolbar.TextItem'
    ],
    // iconCls: 'icon-grid',

    initComponent: function() {
        //console.log ( this.protoConcept + '  grid init'  ); 

        // Recupera la clase para obtener la meta ------------------------------------------
        var myMeta = _cllPCI[ this.protoConcept ] ; 
        var _pGrid = this; 

        // por defecto AutoLoad
        var lAutoLoad = this.autoLoad || true; 
        
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
        
        // Sorters 
        pSorters = myMeta.initialSort; 
        
        //console.log (  this.protoConcept, ' Loading store ...  '  ); 
        this.store = Ext.create('Ext.data.Store', {
            model : modelClassName, 
            autoLoad: lAutoLoad,
            pageSize: _PAGESIZE,
            remoteSort: true,
            sorters: pSorters,   // [{ property: 'xx', direction: 'ASC' },],
            proxy : {
                type: 'ajax',
                url : 'protoExt/protoList/', 
                reader : {
                    type: 'json',
                    root: 'rows',
                    successProperty: 'success',
                    totalProperty: 'totalCount'
                },
                extraParams : {
                    protoConcept : this.protoConcept,
                    protoFilter : myFilter,
                    protoFilterBase: this.protoFilterBase, 
                    storeFields  : myMeta.storeFields.toString()
                }
            },
            listeners: {
                'load' :  function(store,records,options) {
                    this.loaded = true;
                }
            } 
        });

        this.store.proxy.actionMethods.read = 'POST';


		// Start Row Editing PlugIn
	    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
	        clicksToMoveEditor: 1,
	        autoCancel: false
	    });


        // Definicion de Columnas y Fields        ------------------------------------------
        var myColumns = [];

        // DGT adding RowNumberer  
        if ( ! myMeta.hideRowNumbers ) {
        	myColumns.push(Ext.create('Ext.grid.RowNumberer',{"width":37, "draggable":false }));	
        }

        // DGT** Creacion de columnas  
        for (var ix in myMeta.fields ) {
            var vFld  =  myMeta.fields[ix];

            if (!vFld.header || vFld.storeOnly) {continue;}
            
        	var col = {
                dataIndex: vFld.name,
                text: vFld.header 
    		}

			var lstProps = ['flex', 'hidden', 'width', 'minWidth', 'sortable',  
							'xtype', 'editMode',
							'editor', 'render', 'align', 'format'
							]
        
        	col = copyProps ( col,  vFld, true, lstProps )
            if ( vFld.wordWrap == true ) {
                col.renderer = columnWrap
                }

            myColumns.push(col);

        }
        
        this.myColumns = myColumns; 
        var gridColumns =  myColumns;
        // [{"xtype":"rownumberer","width":30},{"text":"ID","sortable":true,"dataIndex":"id","hidden":true},{"text":"First Name","sortable":true,"dataIndex":"first","editor":{"xtype":"textfield"}},{"text":"Last Name","sortable":true,"dataIndex":"last","editor":{"xtype":null}},{"text":"Email","sortable":true,"dataIndex":"email","editor":{"xtype":"textfield"}}];
        
        // Vista por defecto 
        var pViews = myMeta.protoViews;
        if (pViews !== undefined) {
            try {
                gridColumns = this.getViewColumns( pViews[0].viewFields ); 
            } catch(e) {}
        }; 
        
        
        // var selModel = Ext.create('Ext.selection.CheckboxModel', {
            // listeners: { selectionchange: function(sm, selections) {} }
        // });

		this.editMode = false; 
        this.myMeta = myMeta;
        
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
                	this.selected = selected[0] || null;
                    // grid4.down('#removeButton').setDisabled(selections.length == 0);
                 }
            }, 
            
		    tools: [{
		        itemId: 'toolRefresh',
		        type: 'refresh',
		        hidden: true,
				scope: this,
		        handler: function (){ 
		        	this.setEditionOff( false )
		        }
		     },{
		        itemId: 'toolSave',
		        type: 'save',
		        hidden: true,
				scope: this,
		        handler: function (){ 
		        	this.setEditionOff( true )
		        }
		    }]
            
            
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

        itemDetail = ['-']; 

        if ( this.protoIsDetailGrid ) {
            itemDetail.push ({
                    text: _detailViewNewTab,
                    iconCls : 'icon-promote',
                    handler : onMenuPromoteDetail
                })  
        } 

        itemDetail.push( comboPageSize, _gridBbPerPage );
        
//-----------

        panelItems =   [{
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



        function columnWrap(value){
            return '<div style="white-space:normal; text-align:justify !important";>' + value + "</div>";
        };

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
    
//    onItemClick: function (g, rowIndex, e) {
//        this.rowData = rowIndex.data;
//        prepareSheet();
//        this.fireEvent('rowClick', g, rowIndex, e);
//    },  

    getViewColumns: function (  viewCols  ) {
        
        vColumns = [];
        vColumns.push(Ext.create('Ext.grid.RowNumberer',{"width":37 }));
        
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
			this._extGrid.down('#toolRefresh').show();
		} else {
			this._extGrid.down('#toolSave').hide();
			this._extGrid.down('#toolRefresh').hide();
		}
		
   },

	setEditionOff: function( doSave ) {
		
			if ((! this._extGrid ) || ( ! this.editMode )) return; 
			 
			// Invocada desde el tool, debe cancelar la edicion y retroalimentar el toolbar 
			this.setEditMode( false ) 
			
			// Reconfigura el toolBar 
			if ( this._toolBar ) {
				this._toolBar.toggleEditMode( false, true )
			};   

	}
    
    
    
});
