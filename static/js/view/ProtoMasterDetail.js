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
        
        // Master Grid    ========================================================== 
        // y la Guarda el store para efectos de eventos y referencias 
        this.protoMasterGrid = Ext.create('ProtoUL.view.ProtoGrid', {
            border : false, 
            protoOption : this.protoOption,  
            baseFilter : this.baseFilter, 
            detailTitle : this.detailTitle 
        }) ; 
        
        this.protoMasterStore = this.protoMasterGrid.store ;  


        // config Controller 
        var configCtrl = Ext.create('ProtoUL.UI.ConfigController', {
            myMeta : this.myMeta, 
            __MasterDetail : me  
        });


        // Barra MD 
        var tb = Ext.create('ProtoUL.UI.TbMasterDetail', {
            protoMeta : this.myMeta,
            configCtrl : configCtrl,  
            __MasterDetail : me  
        });
        
        // Asigna el tab de control a la grilla y el panel de detalles  
        this.protoMasterGrid._toolBar = tb 
        this.protoTabs = Ext.create('Ext.panel.Panel', { layout: 'card' });

        
        this.IDdetailPanel = Ext.id();
        Ext.apply(this, {
            layout: 'border',
            defaults: {
                collapsible: true,
                border : false, 
                split: true
            },
            tbar: tb,
            items: [{
                region: 'center',
                flex: 1,
                layout: 'fit',
                collapsible: false,
                items: this.protoMasterGrid 
            }, {
                id: this.IDdetailPanel, 
                // title: 'Détails',
                collapseMode : 'mini', 
                hideCollapseTool :  true, 
                region: 'south',
                header : false, 
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


        // 
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
                this.idMasterGrid = record.internalId;
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

        // Verifica si la llave cambio
        if ( me.idMasterGrid === 0  ) { tmpStore.protoMasterId = me.idMasterGrid; return; } 
        if (tmpStore.protoMasterId == me.idMasterGrid ) { return; }

        // El filtro del detalle debe tner en cuenta el filtro predefinido para la grilla???
        // TODO: En el vinculo debe existir un filtro predefinido,  no es necesariamente cierto q siempre deba ser 
        // el filtro de consulta de la grilla o q se deba siempre eliminar. 
        tmpStore.clearFilter();
        tmpStore.getProxy().extraParams.baseFilter = '{"' + tmpStore.detailField + '" : ' + me.idMasterGrid + ',}';
        tmpStore.protoMasterId = me.idMasterGrid;
        tmpStore.load();
        
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

        var detailPanel = Ext.getCmp( this.IDdetailPanel);
        
        // Apagar las barras 
        setTbMode( this.tbDetails )
        setTbMode( this.tbFilters )
        setTbMode( this.tbPrinterOpts )
        setTbMode( this.tbSorters )

        
        if ( detailPanel.collapsed  ) {
 
            setGridEditMode( this.protoMasterGrid, bEdit )

        } else {
            
            
            //TODO: Recorrer las grillas y cambiar el modo
            // deshabilitar master ( iluminar row?? ) 
        }
        
        function setGridEditMode( myGrid, bEdit ) {
            // Deshabilita cualquier operacion al server
            myGrid.store.editMode = bEdit 
            myGrid.gridController.setEditMode( bEdit )
        } 

        function setTbMode( tbar ) {
            if ( tbar ) tbar.setDisabled( bEdit )
        }
        
    }, 
    
    setAutoSync: function( bMode ) {
        this.autoSync = bMode 
        // if ( bMode )  __MasterDetail.saveChanges()

    }, 
    
    saveChanges: function() {
        // TODO: 
    }

});