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
    initComponent: function() {

        // Recupera la meta   ------------------------------------------------------------ 
        this.myMeta = _cllPCI[ this.protoOption ] ;                         
        var me  = this ;         
        
        __StBar.showBusy( 'loading ' + this.protoOption + '...', 'prMD.init',  2000)
        
        // Master Grid    ========================================================== 
        // y la Guarda el store para efectos de eventos y referencias 
        this.protoMasterGrid = Ext.create('ProtoUL.view.ProtoGrid', {
            border : false, 
            protoOption : this.protoOption,  
            baseFilter : this.baseFilter, 
            // detFilter : this.detFilter, 
            detailTitle : this.detailTitle, 
            
            region: 'center',
            flex: 1,
            layout: 'fit',
            collapsible: false
        }) ; 
        
        this.protoMasterStore = this.protoMasterGrid.store ;  


        // config Controller 
        var configCtrl = Ext.create('ProtoUL.UI.ConfigController', { myMeta : this.myMeta });


        // Barra MD 
        var tb = Ext.create('ProtoUL.UI.TbMasterDetail', {
            protoMeta : this.myMeta,
            configCtrl : configCtrl,  
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

        
        Ext.create('ProtoUL.UI.MDDetailsController',   { __MasterDetail : me  });
        Ext.create('ProtoUL.UI.MDCstmOptsController',  { myMeta : this.myMeta, __MasterDetail : me });
        Ext.create('ProtoUL.UI.MDSortersController',   { myMeta : this.myMeta, __MasterDetail : me });
        Ext.create('ProtoUL.UI.MDPrintOptsController', { myMeta : this.myMeta, __MasterDetail : me });


        
        // Agrega los botones de actions 
        tb.addActions()

        //  ****************************************************************
        //  Eventos de los objetos internos para el manejo Master-Detail   
                
        this.protoMasterGrid.on({
            rowClick: {fn: function ( gView, record, item, rowIndex,  e,  eOpts ) {
                this.idMasterGrid = record.get('id') ;
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
        if ( me.idMasterGrid === 0  ) { tmpStore.protoMasterId = me.idMasterGrid; return; } 
        if (tmpStore.protoMasterId == me.idMasterGrid ) { return; }

        // Filtro de base 
        var baseFilter = '{"' + pDetail.detailField + '" : ' + me.idMasterGrid + ',}';
         
        // TODO: El filtro del detalle debe tner en cuenta el filtro predefinido para la grilla???
        // TODO: En el vinculo debe existir un filtro predefinido, no es necesariamente cierto q sea solo el Id 
        tmpStore.clearFilter();
        tmpStore.getProxy().extraParams.baseFilter = baseFilter 
        tmpStore.protoMasterId = me.idMasterGrid;
        tmpStore.load();

        // Obtiene la grilla y le da un titulo  
        var myDetGrid = me.protoTabs.items.items[ me.ixActiveDetail ]
        var masterTitleField = pDetail.masterTitleField || '__str__' 
        var rowData = me.protoMasterGrid.rowData
        
        if ( rowData )  myDetGrid.detailTitle = rowData[ masterTitleField ]
        myDetGrid.baseFilter = baseFilter 
        myDetGrid.setGridTitle( myDetGrid  )
        
    }, 
    

    onClickLoadData: function ( sFilter ) { 
        // Refresh 
        this.protoMasterGrid.loadData( this.protoMasterGrid,  sFilter  )
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
    

    setEditMode: function( bEdit ) {

        var me = this
        var detailPanel = Ext.getCmp( me.IDdetailPanel);

        // Solo el estado inicial 
        if ( ! detailPanel   )  return 
        
        // Apagar las barras 
        setDisabled( me.tbFilters )
        setDisabled( me.tbPrinterOpts )
        setDisabled( me.tbSorters )


        // Cambia el control de las grillas correspondientes 
        if ( detailPanel.collapsed  ) {
 
            me.protoMasterGrid.setEditMode(  bEdit )
            setDisabled( me.tbDetails )

        } else {
            
            setDisabled( me.protoMasterGrid  )
            setDisabled( me.tbDetails, false  )

            //Recorrer las grillas, cambiar el modo, TODO: heredados ( Default,  RO )
            var detGrids = me.protoTabs.items.items
            for (var ix in detGrids ) {
                var myDetGrid = detGrids[ix]
                myDetGrid.setEditMode( bEdit )
                if ( bEdit ) setDetDefaults( myDetGrid )
            }
            
        }
        
        function setDetDefaults( myDetGrid ) {
            var pDetail = myDetGrid.detailDefinition 
            var nField = pDetail.detailField.replace( /__pk$/, '_id' ) 
                 
            // Obtiene el campo de filtro ( heredado )                  
            var myDetField = myDetGrid.myFieldDict[ nField ]
            if ( ! myDetField ) {
                // Si no hereda la llave, cancela la edicion 
                myDetGrid.setEditMode( false )
                return 
            } 

            myDetField['defaultValue'] = me.idMasterGrid

            // Obtiene el titulo del filtro para heredarlo
            nField = pDetail.masterTitleField || myDetField.fkField 
            if ( nField ) var myTitleField = myDetGrid.myFieldDict[ nField ]
            if ( myTitleField ) { 
                var rowData = me.protoMasterGrid.rowData
                if ( rowData )  {
                    var masterTitleField = pDetail.masterTitleField || '__str__' 
                    myTitleField['defaultValue'] = rowData[ masterTitleField ]
                } 

            } 
        }
        

        function setDisabled( tbar, bDisable ) {
            // Por defecto es el edit mode
            if ( bDisable === undefined  ) bDisable = bEdit 
            if ( tbar ) tbar.setDisabled( bDisable )
        }
        
    }, 
    
    setAutoSync: function( bMode ) {
        this.autoSync = bMode 
    }, 
    
    saveChanges: function( autoSync ) {
        var me = this
        var detailPanel = Ext.getCmp( me.IDdetailPanel);
        
        if ( detailPanel.collapsed  ) {
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
        var detailPanel = Ext.getCmp( me.IDdetailPanel);
        
        if ( detailPanel.collapsed  ) {
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