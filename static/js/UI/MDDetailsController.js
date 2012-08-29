Ext.define('ProtoUL.UI.MDDetailsController', {
    extend: 'Ext.Base',
    myMeta : null, 
    constructor: function (config) {

        Ext.apply(this, config || {});
        this.getDetailsTBar()

    }, 
    
    getDetailsTBar: function() {
        
        var me = this; 
        var mDet = me.__MasterDetail
        
        var myDetails = []                  

        for (var vDet in mDet.myMeta.protoDetails) {        // Recorre y agrega los detalles al menu 

            var pDetails = mDet.myMeta.protoDetails[ vDet ]
            if ( pDetails.menuText === undefined ) continue; 

            var myAction = new Ext.Action({
                text: pDetails.menuText,
                hidden : true, 
                // enableToggle: true,
                // toggleGroup: 'detail',   
                scope:    me,                     
                handler:  onActionSelectDetail,

                detailKey: pDetails.conceptDetail,
                detailField: pDetails.detailField,
                masterField: pDetails.masterField,
                detailTitleLbl: pDetails.detailTitleLbl,
                detailTitlePattern: pDetails.detailTitlePattern
            })
            
            myDetails.push ( myAction  );
            loadDetailDefinition( myAction.initialConfig , myAction  )                
            
        };

        if ( myDetails.length > 0  ) {

            // toolBar de base para los items 
            mDet.tbDetails = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'bottom',
                enableOverflow : true, 
                items: [
                    {
                    text    : '<b>Détails :<b>', 
                    iconCls : 'icon-panelDown',  
                    enableToggle : false ,
                    scope   :  mDet,                     
                    handler:  mDet.hideDetailPanel 
                    }
                ]
            });
         
            mDet.myDetails = myDetails
            mDet.tbDetails.add ( myDetails )
            mDet.protoMasterGrid.addDocked( mDet.tbDetails )
        } 
        
        
        function loadDetailDefinition( item , myAction ) {

            // Opciones del llamado AJAX para precargar los detalles  
            var options = {
                scope: me, 
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
            mDet.protoTabs.add( { 
                html: 'Error loading :'  + item.detailKey, 
                ixDetail : mDet.protoTabs.items.length 
            } )
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
                _MasterDetail: mDet 
            }) ; 
    
            // guarda el store con el indice apropiado   
            detailGrid.store.detailField = item.detailField;
            detailGrid.store.masterField = item.masterField;
            detailGrid.store.protoOption = item.detailKey;

            // Asigna el Ix 
            item.ixDetail = mDet.protoTabs.items.length
            mDet.protoTabs.add( detailGrid )
    
            //Titulos del detalle 
            detailGrid.ixDetail = item.ixDetail;
            detailGrid.detailTitleLbl = item.detailTitleLbl;
            detailGrid.detailTitlePattern = item.detailTitlePattern;
            
            // Asigna el store y lo agrega a los tabs 
            mDet.cllStoreDet[item.ixDetail] = detailGrid.store ;
            
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
            mDet.ixActiveDetail = item.baseAction.initialConfig.ixDetail ;
    
            mDet.protoTabs.getLayout().setActiveItem( mDet.ixActiveDetail );
            mDet.linkDetail();        
            mDet.showDetailPanel()
            
            if ( item.hasOwnProperty( 'toggle' ) ) item.toggle( true )            
        }

        
    }
})
