/*
 *  TabContainer 
 *  -   MasterDetail
 *  -   -   Grid 
 */
Ext.define('ProtoUL.view.ProtoMasterDetail', {
    extend: 'Ext.Panel',                                
    alias: 'widget.protoMasterDetail',
    requires: [
        'ProtoUL.view.ProtoGrid',
        'ProtoUL.UI.TbMasterDetail'
    ],

    // Estados iniciales 
    editable : false, 
    autoSync : true, 
    
    // @es definido solamente cuando es una grilla dependiente  ( detalle o promoted ) 
    isPromoted : false, 
    mdFilter : [], 
    
    initComponent: function() {

        // Recupera la meta   ------------------------------------------------------------ 
        this.myMeta = _SM._cllPCI[ this.viewCode ] ;                         
        var me  = this ;         
        
        // Marca si viene de un detalle 
        if ( this.mdFilter ) {  this.isPromoted = true }
        
        _SM.__StBar.showBusy( 'loading ' + this.viewCode + '...', 'prMD.init',  2000)
        
        // Master Grid    ========================================================== 
        // y la Guarda el store para efectos de eventos y referencias 
        this.protoMasterGrid = Ext.create('ProtoUL.view.ProtoGrid', {
            border : false, 
            viewCode : this.viewCode,  
            mdFilter    : this.mdFilter, 
            detailTitle : this.detailTitle, 
            isPromoted  : this.isPromoted, 
            
            region: 'center',
            flex: 1,
            layout: 'fit',
            collapsible: false
        }) ; 
        
        // 
        this.protoMasterStore = this.protoMasterGrid.store ;  

        // Manejo de arbol 
        this.pciStyle = this.protoMasterGrid.myMeta.pciStyle || 'grid'; 

        // Barra MD 
        var tb = Ext.create('ProtoUL.UI.TbMasterDetail', {
            protoMeta : this.myMeta,
            __MasterDetail : me  
        });
        
        // Asigna el tab de control a la grilla y el panel de detalles  
        this.protoMasterGrid._toolBar = tb 
        this.protoTabs = Ext.create('Ext.panel.Panel', { 
            layout: 'card' 
        });

        
        this.IDdetailPanel = Ext.id();
        Ext.apply(this, {
            layout: 'border',
                border : false, 
                defaults: {
                collapsible: true,
                border : false, 
                split: true
            },
            tbar: tb,
            items: [  this.protoMasterGrid, {

            // Extjs 4.1.1 Genera error al mezclar layout "region"  &  "card",
            // }, this.protoTabs ]   
                
                id: this.IDdetailPanel, 
                collapseMode : 'mini', 
                hideCollapseTool :  true, 
                region: 'south',
                header : false, 
                border : false, 
                flex: 1,
                collapsed: true,
                layout: 'fit',
                minSize: 75,
                defaults: { border: false  },
                items: this.protoTabs 
            }]
        });


        // coleccion con los store de los detalles  y su indice  =============================================  
        this.ixActiveDetail = -1;
        this.idMasterGrid = -1; 
        this.cllStoreDet = [] ;

        this.callParent();


        // Controllers 
        Ext.create('ProtoUL.UI.MDDetailsController',   { __MasterDetail : me  });
        Ext.create('ProtoUL.UI.MDTbSortByController',   { myMeta : this.myMeta, __MasterDetail : me });
        Ext.create('ProtoUL.UI.MDPrintOptsController', { myMeta : this.myMeta, __MasterDetail : me });
        Ext.create('ProtoUL.UI.MDActionsController',   { myMeta : this.myMeta, __MasterDetail : me });

        Ext.create('ProtoUL.UI.MDSetFiltersController',  { myMeta : this.myMeta, __MasterDetail : me });
        Ext.create('ProtoUL.UI.MDSetSortersController',  { myMeta : this.myMeta, __MasterDetail : me });
        Ext.create('ProtoUL.UI.MDSetTabsController',  { myMeta : this.myMeta, __MasterDetail : me });

        Ext.create('ProtoUL.UI.ConfigController',     { myMeta : this.myMeta, __MasterDetail : me });
        
        // Agrega los botones de actions 
        tb.addActions()

        //  ****************************************************************
        //  Eventos de los objetos internos para el manejo Master-Detail   
                
        this.protoMasterGrid.on({
            selectionChange: {fn: function ( rowModel, record, rowIndex,  eOpts  ) {
                if ( record ) { this.idMasterGrid = record.get('id');    
                } else { this.idMasterGrid = -1 }
                this.linkDetail();
            }, 
            scope: me }
        });                 


    },
    
    
    linkDetail: function () {
        // Refresca las grillas de detalle 
        var me = this
        
        // Verifica q halla un tab activo y q no hallan sido borrados  
        if (me.ixActiveDetail < 0) { return; }
        if (me.protoTabs.items.length === 0) { return; }


        // carga el store 
        var tmpStore = me.cllStoreDet[ me.ixActiveDetail ];
        var pDetail = tmpStore.detailDefinition 

        // Verifica si la llave cambio
        if ( tmpStore.protoMasterId == me.idMasterGrid ) { return; }

        // DGT@@@ Navegacion por llaves del maestro, si rowData is null no hay registro seleccionado   
        var protoFilter   
        if ( ! me.protoMasterGrid.rowData )  { 
            protoFilter = [{ "property" :  pDetail.detailField , "filterStmt" : -1}];
        } else { 
            // En caso de q el master no sea el pk 
            var rowDataIx  = me.idMasterGrid
            if ( pDetail.masterField != 'pk' ) { rowDataIx  = me.protoMasterGrid.rowData[ pDetail.masterField ] }
            protoFilter = [{ "property" :  pDetail.detailField , "filterStmt" : rowDataIx }];
        }
        
        tmpStore.myLoadData( protoFilter, null, me.idMasterGrid )

        // Obtiene la grilla y le da un titulo  
        var myDetGrid = me.protoTabs.items.items[ me.ixActiveDetail ]
        var masterTitleField = pDetail.masterTitleField || '__str__' 
        
        var rowData = me.protoMasterGrid.rowData
        if ( rowData )  myDetGrid.detailTitle = rowData[ masterTitleField ]

        myDetGrid.protoFilter = protoFilter 
        myDetGrid.setGridTitle( myDetGrid  )
        
        // Asigna los vr por defecto 
        me.setDetDefaults( me, myDetGrid )
        
    }, 
    
    mdGridReload: function () { 
        this.protoMasterGrid.reload()
    },

    mdGridLoadData: function ( sFilter , sorter) { 
        // Refresh 
        this.protoMasterGrid.gridLoadData( this.protoMasterGrid,  sFilter,  sorter  )
    },
    
    showDetailPanel: function( bHide ) {
        var detailPanel = Ext.getCmp( this.IDdetailPanel);
        if ( bHide ) { 
            this.ixInactiveDetail = this.ixActiveDetail
            this.ixActiveDetail =  -1
            detailPanel.collapse(); 

        }  else if ( detailPanel.collapsed  ) { 
            if (this.ixActiveDetail < 0) { this.ixActiveDetail = this.ixInactiveDetail || 0; }
            this.linkDetail()
            detailPanel.expand(); 
        }
    }, 

    hideDetailPanel: function( btn ) {
        this.showDetailPanel( true ) 
    },
    

    isDetailCollapsed: function() { 

        var detailPanel = Ext.getCmp( this.IDdetailPanel);
        if ( ! detailPanel   )  return true  
        return ( detailPanel.collapsed  )

    }, 

    setEditMode: function( bEdit ) {

        var me = this
        
        // Apagar las barras ( hacen parte de la grilla menos tbTabs y tbDetails )
        // setDisabled( me.tbTabs )
        setDisabled( me.tbFilters )
        setDisabled( me.tbPrinterOpts )
        setDisabled( me.tbConfigOpts )
        setDisabled( me.tbSorters )
        setDisabled( me.tbSortersSet )
        setDisabled( me.tbProtoActions )

        // Cambia el control de las grillas correspondientes
        // Con el autosync se permite la edicion en todos los controles  
        // if ( this.isDetailCollapsed()  ) {
            me.protoMasterGrid.setEditMode(  bEdit )
            // setDisabled( me.tbDetails )

        // } else {
            
            // Solo es la grilla lo q tengo q desabilitar 
            // me.protoMasterGrid._extGrid.setDisabled( bEdit )

            // Si los detalles estan activos puedo cambiar de detalle sin cambiar el maestro
            // setDisabled( me.tbDetails, false  )

            //Recorrer las grillas, cambiar el modo, TODO: heredados ( Default,  RO )
            var detGrids = null 
            try { 
            	detGrids = me.protoTabs.items.items
            } 	catch(e) {}
            
            if ( detGrids )  { 
	            for (var ix in detGrids ) {
	                var myDetGrid = detGrids[ix]
	                myDetGrid.setEditMode( bEdit )
	                // if ( bEdit ) me.setDetDefaults( me, myDetGrid )
	            }
        	}
            
        // }
        
        function setDisabled( tbar, bDisable ) {
            // Por defecto es el edit mode
            if ( bDisable === undefined  ) bDisable = bEdit 
            if ( tbar ) tbar.setDisabled( bDisable )
        }
        
    }, 

    setDetDefaults : function( me, myDetGrid ) {
            var pDetail = myDetGrid.detailDefinition,  
                rowData = me.protoMasterGrid.rowData, 
                nField =  pDetail.detailField.replace( /__pk$/, '_id' ) 
                 
            // Obtiene el campo de filtro ( heredado ); Si no hereda la llave, cancela la edicion                  
            var myDetField = myDetGrid.myFieldDict[ nField ]
            if ( ! myDetField  || ! rowData  ) {
                // _SM.__StBar.showError('parent key not found: ' + nField, 'MasterDetail') 
                // myDetGrid.setEditMode( false );  
                return 
            } 

            myDetField['prpDefault'] = me.idMasterGrid

            // Obtiene el titulo del filtro para heredarlo
            nField = pDetail.masterTitleField || nField.replace( /_id$/, '' ) 
            var myTitleField = myDetGrid.myFieldDict[ nField ]
            if ( myTitleField ) { 
                var masterTitleField = pDetail.masterTitleField || '__str__' 
                myTitleField['prpDefault'] = rowData[ masterTitleField ]
                myTitleField['readOnly'] = true
            } 
  	}, 
    
    setAutoSync: function( bMode ) {
        this.autoSync = bMode 
    }, 
    
    saveChanges: function( autoSync ) {
        var me = this
        
        if ( this.isDetailCollapsed()  ) {
            me.protoMasterGrid.saveChanges( autoSync )
        } else {
            var detGrids = me.protoTabs.items.items
            for (var ix in detGrids ) {
                var myDetGrid = detGrids[ix]
                myDetGrid.saveChanges( autoSync )
            }
        }
    }, 
    
    cancelChanges: function() {
        var me = this
        if ( this.isDetailCollapsed()  ) {
            me.protoMasterGrid.cancelChanges()
        } else {
            var detGrids = me.protoTabs.items.items
            for (var ix in detGrids ) {
                var myDetGrid = detGrids[ix]
                myDetGrid.cancelChanges()
            }
        }
    }
});