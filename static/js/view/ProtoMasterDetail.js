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
        'ProtoUL.UI.TbMasterDetail',
    ],

    initComponent: function() {

        console.log ( this.protoConcept , ' masterPanel def'  ); 


        // Recupera la meta   ------------------------------------------------------------ 
        var myMeta = _cllPCI[ this.protoConcept ] ;                         
        var _masterDetail  = this ;         
        
        // Master Grid    ========================================================== 
        // y la Guarda el store para efectos de eventos y referencias 
        var masterGrid = Ext.create('ProtoUL.view.ProtoGrid', {
            protoConcept : this.protoConcept,  
            protoFilterBase : this.protoFilterBase,
        }) ; 
        
        this.protoMasterStore = masterGrid.store  


        // Necesaria para poder agregar cosas dinamicamente   --------------------------------------------------
        var tb = Ext.create('ProtoUL.UI.TbMasterDetail', {
            protoMeta : myMeta, 
            objMasterDet : this,  
        });
        tb.doLayout();
        
        // Panel de detalles ==================================================================================
        var detailEI = Ext.id();
        var protoTabs = new Ext.TabPanel({
            id: detailEI
        });
        
        Ext.apply(this, {
            layout: 'border',
            defaults: {
                collapsible: true,
                split: true
            },
            items: [{
                tbar: tb,
                region: 'center',
                layout: 'fit',
                collapsible: false,
                items: masterGrid
            }, {
                title: 'Details',
                region: 'south',
                collapsed: false,
                layout: 'fit',
                height: 180,
                minSize: 75,
                defaults: {
                    border: false,
                    activeTab: 0
                },
                items: protoTabs,
            }]
        });


        // Variables del enclosure 
        var ixActiveTab = -1;
        var idMasterGrid = 0; 
        var cllStoreDet = [];  

        // coleccion con los store de los detalles  y su indice  =============================================  
        this.ixActiveTab = ixActiveTab;
        this.idMasterGrid = idMasterGrid; 

        this.cllStoreDet = cllStoreDet ;
        this.ixCllStoreDet = 0;
        this.protoTabs = protoTabs;

        this.callParent();

        //  ****************************************************************
        //  Eventos de los objetos internos para el manejo Master-Detail   
                
        masterGrid.on({
            itemClick: {fn: function (g, rowIndex, e) {
                
                idMasterGrid = rowIndex.internalId
                this.idMasterGrid = idMasterGrid;
                 
                linkDetail( );
                }, 
            scope: _masterDetail },
        });                 

    
        protoTabs.on({
            tabchange: { fn: function (tabPanel, tab) {
                ixActiveTab = tab.ixTab;
                this.ixActiveTab = ixActiveTab;
                
                linkDetail( );
                }, 
            scope: _masterDetail },
        });                 
    
    
        // Refresca las grillas de detalle 
        function linkDetail() {
    
            ixActiveTab =  _masterDetail.ixActiveTab
            console.log( '_ LinkDetail tab', ixActiveTab,  _masterDetail.ixActiveTab, ' idM', idMasterGrid,  _masterDetail.idMasterGrid )
            
            // Verifica q halla un tab activo 
            if (ixActiveTab < 0) { return; }
    
            // carga el store 
            var tmpStore = cllStoreDet[ixActiveTab]
    
            // Verifica si la llave cambio
            if (tmpStore.protoMasterId == idMasterGrid ) { return; };
    
            tmpStore.clearFilter();
            tmpStore.getProxy().extraParams.protoFilterBase = '{"' + tmpStore.detailField + '" : ' + idMasterGrid + ',}';
            tmpStore.protoMasterId = idMasterGrid;
            tmpStore.load();
            
        };


    },
    
    onMenuSelectDetail: function (item) {

        var _masterDetail  = this ;         
        
        var protoConcept = item.detail;
        var protoTabs = this.protoTabs;
        var cllStoreDet = this.cllStoreDet;  

        var ixActiveTab = this.ixActiveTab;
        var idMasterGrid = this.idMasterGrid;

        console.log( 'MenuSelect tab', ixActiveTab, ' idM', idMasterGrid, _masterDetail.idMasterGrid )

        var tab = protoTabs.items.findBy(function (i) {
            return i.title === protoConcept;
        });
        if (!tab) {
        
//          Sacar en una funcion comun con el view port  ( segun feedMvc/lib )   ***********************************
            var modelClassName = _PConfig.clsBaseModel + protoConcept ; 
            
            if  (! Ext.ClassManager.isCreated( modelClassName )){
                console.log ( protoConcept, ' Loading  Pci ...  ' ); 
    
                Ext.Ajax.request({
                    method: 'GET',
                    url: _PConfig.urlProtoDefinition  ,
                    params : { 
                        protoConcept : protoConcept 
                        },
                    success: function ( result, request ) { 
                        
                        console.log( protoConcept, ' Pci loaded ');
                        var myResult = Ext.decode( result.responseText )
    
                        // Colleccion de PCI, 
                        _cllPCI[protoConcept]  = myResult.metaData  
                        DefineProtoModel( myResult.metaData , modelClassName  );
                    
                        createDetailGrid();
    
                    },
                    failure: function ( result, request) { 
                        // Se aborta la ejecucion 
                        console.log('Failed', result.responseText);
                        return ;  
                    },
                });

            }  else {
    
                // El modelo ya ha sido cargado ( la cll meta es global )     
                createDetailGrid();
        
            };

        } else {

            //  Marca el tab activo     
            setActiveDetail( tab , item.ixTab );

        };

//      Sacar en una funcion comun con el view port  ( segun feedMvc/lib )   ***********************************
        function createDetailGrid() {
            
            console.log( '> createDetailGrid tab', ixActiveTab, ' idM', idMasterGrid )

            // Definicion grilla Detail  ============================================================================= 
            var detailGrid = Ext.create('ProtoUL.view.ProtoGrid', {
                protoConcept : protoConcept,  
                protoFilterBase : '{"' + item.detailField + '" : ' +  idMasterGrid + ',}',

                // Para saber de q linea del maestro  depende  
                protoMasterId: idMasterGrid,
            }) ; 

            // guarda el store con el indice apropiado   
            detailGrid.store.detailField = item.detailField;
            detailGrid.store.masterField = item.masterField;
            detailGrid.store.protoConcept = protoConcept;
            
            cllStoreDet[item.ixTab] = detailGrid.store ;

            var tab = protoTabs.add({
                title: item.text ,
                layout: 'fit',
                items: detailGrid,
                ixTab: item.ixTab
            });

            setActiveDetail( tab , item.ixTab );

        };  
        
        function setActiveDetail (tab, ixTab ) {

            ixActiveTab = item.ixTab;
            protoTabs.setActiveTab(tab);
    
            console.log( '< setActiveDetail', ixActiveTab, _masterDetail.ixActiveTab  )
            _masterDetail.ixActiveTab = ixActiveTab;
    
        };
    
      
        
    },

    onClickLoadData: function ( sFilter ) { 

        this.protoMasterStore.clearFilter();
        this.protoMasterStore.getProxy().extraParams.protoFilter = sFilter;
        this.protoMasterStore.load();

    }, 
    
    toggleDetail: function(show){
        var detail = this.child('#detail');
        if (show) {
            detail.show();
        } else {
            detail.hide();
        }
    },



});