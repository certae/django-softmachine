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

//        console.log ( this.protoOption , ' masterPanel def'  ); 
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



        // Necesaria para poder agregar cosas dinamicamente   --------------------------------------------------
        var tb = Ext.create('ProtoUL.UI.TbMasterDetail', {
            protoMeta : this.myMeta, 
            __MasterDetail : me  
        });
        tb.doLayout();
        
        // Asigna el tab de control a la grilla 
        this.protoMasterGrid._toolBar = tb 
        
        
        // Panel de detalles ==================================================================================
        var IDprotoTabs = Ext.id();
        this.protoTabs = Ext.create('Ext.panel.Panel', {
            layout: 'card',
            id: IDprotoTabs 
        });

        
        this.IDdetailPanel = Ext.id();
        Ext.apply(this, {
            layout: 'border',
            defaults: {
                collapsible: true,
                border : false, 
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
        this.getDetailsTBar()
        this.getFilterSetBar()
        
        this.callParent();

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
        this.protoMasterGrid.loadData( this.protoMasterGrid,  sFilter  )
    },
    
    showDetailPanel: function( bHide ) {
        var detailPanel = Ext.getCmp( this.IDdetailPanel);
        if ( bHide ) { 
            detailPanel.collapse(); 
        }  else if ( detailPanel.collapsed  ) { 
            detailPanel.expand(); 
        }
    }, 

    hideDetailPanel: function( btn ) {
        this.showDetailPanel( true ) 
    },
    
    getDetailsTBar: function() {
        
        var me = this; 
        var myDetails = []                  // Cll para guardar la definicion de detalles q luego se agregara al tBar  

        for (var vDet in this.myMeta.protoDetails) {        // Recorre y agrega los detalles al menu 

            var pDetails = this.myMeta.protoDetails[ vDet ]
            if ( pDetails.menuText === undefined ) continue; 

            var myAction = new Ext.Action({
                text: pDetails.menuText,
                hidden : true, 
                enableToggle: true,
                toggleGroup: 'detail',   

                scope:    me,                     
                handler:  onActionSelectDetail,

                detailKey: pDetails.conceptDetail,
                detailField: pDetails.detailField,
                masterField: pDetails.masterField,
                
                detailTitleLbl: pDetails.detailTitleLbl,
                detailTitlePattern: pDetails.detailTitlePattern,
                
                // El numero secuencia para marcar los detalles,   es asigngado dinamicamente al carga el item 
                // ixDetail: ixDetail        
            })
            
            myDetails.push ( myAction  );
            loadDetailDefinition( myAction.initialConfig , myAction  )                
            
        };

        if ( myDetails.length > 0  ) {

            // toolBar de base para los items 
            this.tbDetails = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'bottom',
                enableOverflow : true, 
                items: [
                    {
                    text    : '<b>Détails :<b>', 
                    iconCls : 'icon-panelDown',  
                    scope   :  me,                     
                    enableToggle : false ,
                    handler:  me.hideDetailPanel 
                    }
                ]
            });
         
            this.myDetails = myDetails
            this.tbDetails.add ( myDetails )
            this.protoMasterGrid.addDocked( this.tbDetails )
        } 
        
        
        function loadDetailDefinition( item , myAction ) {

            // Opciones del llamado AJAX para precargar los detalles  
            var options = {
                scope: this, 
                success: function ( obj, result, request ) {
                    createDetailGrid( item , myAction  );
                },
                failure: function ( obj, result, request) { 
                    createDummyPanel( item , myAction  );
                }
            }
                
            // PreCarga los detalles  
            if (  loadPci( pDetails.conceptDetail, true, options ) ) {
                // El modelo ya ha sido cargado ( la cll meta es global )     
                createDetailGrid(  item , myAction );
            }         
                  
        };
        

        function createDummyPanel(  item , myAction  ) {
            // Si hubo error en la creacion del detalle 
            me.protoTabs.add( { html: 'Error loading :'  + item.detailKey, ixDetail : me.protoTabs.items.length } )
            myAction.show()
        }
    

        function createDetailGrid (  item , myAction ) {
    
            // Definicion grilla Detail 
            var detailGrid = Ext.create('ProtoUL.view.ProtoGrid', {
                border : false, 
                protoOption : item.detailKey,  
                protoIsDetailGrid : true, 
                autoLoad : false, 
                baseFilter : '{"' + item.detailField + '" : -1}',
    
                // Para saber de q linea del maestro  depende  
                _MasterDetail: me 
            }) ; 
    
            // guarda el store con el indice apropiado   
            detailGrid.store.detailField = item.detailField;
            detailGrid.store.masterField = item.masterField;
            detailGrid.store.protoOption = item.detailKey;

            // Asigna el Ix 
            item.ixDetail = me.protoTabs.items.length
            me.protoTabs.add( detailGrid )
    
            //Titulos del detalle 
            detailGrid.ixDetail = item.ixDetail;
            detailGrid.detailTitleLbl = item.detailTitleLbl;
            detailGrid.detailTitlePattern = item.detailTitlePattern;
            
            // Asigna el store y lo agrega a los tabs 
            me.cllStoreDet[item.ixDetail] = detailGrid.store ;
            
            // Configura el panel 
            var myMeta = detailGrid.myMeta
            
            setActionPrp('text', 'setText',  myMeta.shortTitle );
            setActionPrp('tooltip', 'setTooltip', myMeta.description );
            setActionPrp('iconCls', 'setIconCls', myMeta.protoIcon );
            setActionPrp('width', 'setWidth', 100 );

            myAction.show()
            
            function setActionPrp( prp, meth , value ) {
                myAction.initialConfig[ prp ] = value 
                myAction.callEach( meth, [ value ] )
            }
             
        };   

        function onActionSelectDetail( item ) {
            this.ixActiveDetail = item.baseAction.initialConfig.ixDetail ;
    
            this.protoTabs.getLayout().setActiveItem( this.ixActiveDetail );
            this.linkDetail();        
            this.showDetailPanel()
            
            item.toggle( true )            
        }

        
    }, 
    
    getFilterSetBar: function() {
        
        var me = this; 
        var myFilters = []  
        var tmpFilters = [] 

        // Si no hay filtros definidos pero existe un filterAlph, 
        if ((this.myMeta.gridConfig.filtersSet.length == 0)  &&  this.myMeta.gridConfig.filterSetABC  ) {

            for (var nFiltre in oc(['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'])) {
                var tmpF1 = {}
                tmpF1[ this.myMeta.gridConfig.filterSetABC + '__istartswith' ] =  nFiltre 
                tmpFilters.push ({ name: nFiltre,  filter: tmpF1 }) 
            }
            tmpFilters.push ({ name: ' *', filter: {} })
             
        } else {
          tmpFilters = this.myMeta.gridConfig.filtersSet  
        }  

        for (var vDet in tmpFilters ) {       

            var pFilters = tmpFilters[ vDet ]
            myFilters.push (
                new Ext.Action({
                    text:           pFilters.name,
                    iconCls :       pFilters.icon, 
                    protoFilter:    Ext.encode( pFilters.filter ),
                    scope:          me,                     
                    handler:        onClickProtoFilter
                }));

        };


        if ( myFilters.length > 0  ) {

            this.tbFilters = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                enableOverflow : true, 
                defaults : { witdth : 100, maxWidth : 100  }, 
                items: [
                    {
                    xtype   : 'tbtext',
                    text: '<b>Filtrer par :<b>'
                    }
                ]
            });

            this.tbFilters.add ( myFilters )
            this.myFilters = myFilters
            this.protoMasterGrid.addDocked( this.tbFilters )
        } else {

            return false 
        }; 
        
        function onClickProtoFilter( btn ){
            this.protoMasterGrid.protoLocalFilter = ' " ' +  btn.text + ' "'; 
            this.protoMasterGrid.setGridTitle( this.protoMasterGrid ) 
            this.onClickLoadData( btn.protoFilter );
        }
    } 
    

});