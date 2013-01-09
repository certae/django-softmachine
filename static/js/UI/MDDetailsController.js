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

            var pDetail = mDet.myMeta.protoDetails[ vDet ]
            if ( pDetail.menuText === undefined ) continue; 

            var myAction = new Ext.Action({
                text: pDetail.menuText,
                hidden : true, 
                // enableToggle: true,
                scope:    me,                     
                handler:  onActionSelectDetail,
                detailKey: pDetail.conceptDetail,
                detailDefinition : pDetail

            })
            
            myDetails.push ( myAction  );
            loadDetailDefinition( myAction.initialConfig , myAction  )                
            
        };

        if ( myDetails.length > 0  ) {

            // toolBar de base para los items 
            mDet.tbDetails = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'bottom',
                border : true, 
                enableOverflow : true, 
                items: [
                    {
                        text: '<b>'+ __language.Text_Toolbar_Detail_Button + ':<b>',
                    iconCls : 'icon-panelDown',  
                    enableToggle : false ,
                    scope   :  mDet,                     
                    handler:  mDet.hideDetailPanel 
                    }
                ]
            });
         
            mDet.myDetails = myDetails
            mDet.tbDetails.add ( myDetails )
            mDet.protoMasterGrid.addDocked( mDet.tbDetails, 0 )
            // mDet.protoMasterGrid.ownerCt.addDocked( mDet.tbDetails )
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
            if (  loadPci( item.detailDefinition.conceptDetail, true, options ) ) {
                // El modelo ya ha sido cargado ( la cll meta es global )     
                createDetailGrid(  item , myAction );
            }         
                  
        };
        

        function createDummyPanel(  item , myAction  ) {
            // Si hubo error en la creacion del detalle 
            mDet.protoTabs.add( { 
                html: __language.Error_Loading_Detail_Button+' :'  + item.detailKey, 
                ixDetail : mDet.protoTabs.items.length 
            } )
            myAction.show()
        }
    

        function createDetailGrid (  item , myAction ) {
    
            //
            var pDetail = item.detailDefinition 
    
            // Definicion grilla Detail 
            var detailGrid = Ext.create('ProtoUL.view.ProtoGrid', {
                border : false, 
                protoOption : pDetail.conceptDetail,  
                protoIsDetailGrid : true,
                detailDefinition : pDetail,  
                autoLoad : false, 
                baseFilter : '[{ "property":"' + pDetail.detailField + '", "filterStmt": -1}]',
    
                // Para saber de q linea del maestro  depende  
                _MasterDetail: mDet 
            }) ; 
    
            // guarda el store con el indice apropiado   
            detailGrid.store.detailDefinition = pDetail

            // Asigna el Ix 
            item.ixDetail = mDet.protoTabs.items.length
            mDet.protoTabs.add( detailGrid )
    
            //Definicion del detalle TODO: pasarlo a una clase 

            detailGrid.ixDetail = item.ixDetail;
                
            // Asigna el store y lo agrega a los tabs 
            mDet.cllStoreDet[item.ixDetail] = detailGrid.store ;
            
            // Configura el panel 
            var myMeta = detailGrid.myMeta
            
            // setActionPrp('text', 'setText',  myMeta.shortTitle );
            // setActionPrp('tooltip', 'setTooltip', myMeta.description );
            setActionPrp('tooltip', 'setTooltip', pDetail.menuText  );

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

            // Si se carga directamente el Card Layout en el BorderLayout no permite el activeItem     
            mDet.protoTabs.getLayout().setActiveItem( mDet.ixActiveDetail );
            
            mDet.linkDetail();        
            mDet.showDetailPanel()
            
            if ( item.hasOwnProperty( 'toggle' ) ) item.toggle( true )            
        }

        
    }
})
