/*
 *  TabContainer 
 *  -   MasterDetail
 *  -   -   Grid 
 */
Ext.define('ProtoUL.view.ProtoMasterDetail', {
    extend: 'Ext.container.Container',
    alias: 'widget.protoMasterDetail',
    requires: [
        'ProtoUL.view.ProtoGrid',
        'ProtoUL.UI.TbMasterDetail'
    ],

    /**
     * @private
     * search value initialization
     */

    initComponent: function() {

//        console.log ( this.protoConcept , ' masterPanel def'  ); 
        // Recupera la meta   ------------------------------------------------------------ 
        var myMeta = _cllPCI[ this.protoConcept ] ;                         
        var _masterDetail  = this ;         
        
        // Master Grid    ========================================================== 
        // y la Guarda el store para efectos de eventos y referencias 
        var masterGrid = Ext.create('ProtoUL.view.ProtoGrid', {
            protoConcept : this.protoConcept,  
            protoFilterBase : this.protoFilterBase, 
            detailTitle : this.detailTitle 
        }) ; 
        
        this.protoMasterGrid = masterGrid ; 
        this.protoMasterStore = masterGrid.store ;  


        // Necesaria para poder agregar cosas dinamicamente   --------------------------------------------------
        var tb = Ext.create('ProtoUL.UI.TbMasterDetail', {
            protoMeta : myMeta, 
            __MasterDetail : this  
        });
        tb.doLayout();
        
        // Asigna el tab de control a la grilla 
        masterGrid._toolBar = tb 
        
        
        // Panel de detalles ==================================================================================
        var IDprotoTabs = Ext.id();
        var protoTabs = new Ext.TabPanel({
            id: IDprotoTabs
        });
        
        this.IDdetailPanel = Ext.id();
        Ext.apply(this, {
            layout: 'border',
            defaults: {
                collapsible: true,
                split: true
            },
            items: [{
                region:'north',
                height: 70,
                collapsible: false,
                split: false,
                items: tb 
            
            }, {
                // tbar: tb,
                region: 'center',
                flex: 1,
                layout: 'fit',
                collapsible: false,
                items: masterGrid 
            }, {
                id: this.IDdetailPanel, 
                title: 'Détails',
                region: 'south',
                flex: 1,
                collapsed: true,
                layout: 'fit',
                minSize: 75,
                defaults: { border: false, activeTab: 0 },
                items: protoTabs 
            }]
        });


        // Variables del enclosure 
        var ixActiveDetail = -1;
        var idMasterGrid = 0; 
        var cllStoreDet = [];  
        var currentRow = [];

        // coleccion con los store de los detalles  y su indice  =============================================  
        this.ixActiveDetail = ixActiveDetail;
        this.idMasterGrid = idMasterGrid; 

        this.cllStoreDet = cllStoreDet ;
        this.protoTabs = protoTabs;

        this.callParent();

        //  ****************************************************************
        //  Eventos de los objetos internos para el manejo Master-Detail   
                
        masterGrid.on({
            rowClick: {fn: function ( gView, record, item, rowIndex,  e,  eOpts ) {
                
                idMasterGrid = record.internalId;
                this.idMasterGrid = idMasterGrid;
                linkDetail();
                }, 
            scope: _masterDetail }
        });                 

    
        protoTabs.on({
            tabchange: { fn: function (tabPanel, tab) {
                ixActiveDetail = tab.ixDetail;
                this.ixActiveDetail = ixActiveDetail;
                linkDetail();
            }, 
            scope: _masterDetail }
        });                 
    
    
        // Refresca las grillas de detalle 
        function linkDetail() {
    
            var ixActiveDetail =  _masterDetail.ixActiveDetail;
            //console.log( '_ LinkDetail tab', ixActiveDetail,  _masterDetail.ixActiveDetail, ' idM', idMasterGrid,  _masterDetail.idMasterGrid )
            
            // Verifica q halla un tab activo y q no hallan sido borrados  
            if (ixActiveDetail < 0) { return; }
            if (protoTabs.items.length === 0) { return; }
    
            // carga el store 
            var tmpStore = cllStoreDet[ixActiveDetail];
    
            // Verifica si la llave cambio
            if ( idMasterGrid === 0  ) { tmpStore.protoMasterId = idMasterGrid; return; } 
            if (tmpStore.protoMasterId == idMasterGrid ) { return; }
    
            tmpStore.clearFilter();
            tmpStore.getProxy().extraParams.protoFilterBase = '{"' + tmpStore.detailField + '" : ' + idMasterGrid + ',}';
            tmpStore.protoMasterId = idMasterGrid;
            tmpStore.load();
            
        }


    },

    getTab: function ( _masterDetail, detailKey) {
        var tab = _masterDetail.protoTabs.items.findBy(function (i) {
            return i.detailKey === detailKey;
        });
        return tab; 
    }, 
    
    onTbSelectDetail: function (item) {

        var _masterDetail  = this ;         
        var protoTabs = this.protoTabs;
        var cllStoreDet = this.cllStoreDet;  

        var ixActiveDetail = this.ixActiveDetail;
        var idMasterGrid = this.idMasterGrid;

//      console.log( 'TbSelectDetail', ixActiveDetail, ' idM', idMasterGrid, _masterDetail.idMasterGrid )
        var tab =  this.getTab(_masterDetail, item.detailKey); 
        if (!tab) {

			// Opciones del llamado AJAX 
			var options = {
				scope: this, 
				success: function ( obj, result, request ) {
	                _masterDetail.createDetailGrid( _masterDetail, item  );
            	},
                failure: function ( obj, result, request) { 
                    return ;  
                }
            }
                
	        if (  loadPci( item.detailKey, true, options ) ) {
                // El modelo ya ha sido cargado ( la cll meta es global )     
                _masterDetail.createDetailGrid( _masterDetail, item );
	        	
	        }   

        } else {

            //  Marca el tab activo ( es need hacerlo asi, pues el otro llamado es Async.   
    		_masterDetail.setActiveDetail( _masterDetail, item.detailKey );

        };
    },

//  Sacar en una funcion comun con el view port  ( segun feedMvc/lib )   ***********************************
    createDetailGrid: function( _masterDetail, item ) {
        
        var detailPanel = Ext.getCmp(_masterDetail.IDdetailPanel);
        if ( detailPanel.collapsed  ) { detailPanel.expand(); }

        // Definicion grilla Detail  ============================================================================= 
        var detailGrid = Ext.create('ProtoUL.view.ProtoGrid', {
            protoConcept : item.detailKey,  
            protoIsDetailGrid : true, 
            autoLoad : false, 
            protoFilterBase : '{"' + item.detailField + '" : ' +  _masterDetail.idMasterGrid + ',}',

            // Para saber de q linea del maestro  depende  
            _masterDetail: _masterDetail 
        }) ; 

        // guarda el store con el indice apropiado   
        detailGrid.store.detailField = item.detailField;
        detailGrid.store.masterField = item.masterField;
        detailGrid.store.protoConcept = item.detailKey;

        //DGT|:  Titulos del detalle 
        detailGrid.detailTitleLbl = item.detailTitleLbl;
        detailGrid.detailTitlePattern = item.detailTitlePattern;
        
        
        _masterDetail.cllStoreDet[item.ixDetail] = detailGrid.store ;

        var tab = _masterDetail.protoTabs.add({
            title: item.text ,
            detailKey : item.detailKey ,
            layout: 'fit',
            closable: true, 
            items: detailGrid,
            ixDetail: item.ixDetail
        });

		_masterDetail.setActiveDetail( _masterDetail, item.detailKey );
    },   

    setActiveDetail: function ( _masterDetail , detailKey ) {

    	//DGT  La idea es cambiat la llave de los detalles por el protoConcept y pasar solo el contexto del MD y la llave. 
    	//El titulo, verificar si es un detalle y navegar al padre para obtner el registro activo, y el titulo  
        var tab =  _masterDetail.getTab( _masterDetail, detailKey); 

        _masterDetail.ixActiveDetail = tab.ixDetail;
        _masterDetail.protoTabs.setActiveTab( tab );

        // console.log( '< stActiveDetail', ixActiveDetail, _masterDetail.ixActiveDetail, _masterDetail.IDdetailPanel  )
    }, 

    
    onClickLoadData: function ( sFilter ) { 

        this.protoMasterStore.clearFilter();
        this.protoMasterStore.getProxy().extraParams.protoFilter = sFilter;

        
        // TODO: Cargar el sort, buscarlo en proxy.sorters o setear una var en la grilla 
        this.protoMasterStore.load();
        
        if ( this.protoMasterStore.currentPage != 1 ) {
            this.protoMasterStore.loadPage(1);
        }

    } 
    

});