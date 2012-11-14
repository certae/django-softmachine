Ext.define('ProtoUL.UI.MDPrintOptsController', {
    extend: 'Ext.Base',
    myMeta : null, 
    constructor: function (config) {
        Ext.apply(this, config || {});
        this.getPrinterOptsBar()
    }, 

    getPrinterOptsBar: function() {

        var me = this; 
        var myPrinterOpts = []  
        var __MasterDetail = this.__MasterDetail


        if (  this.myMeta.exportCsv  ) {
            
            myPrinterOpts.push (
                new Ext.Action({
                    text:       'Export CSV',
                    iconCls :   'icon-printGrid', 
                    tooltip:    'export en format csv',
                    scope:      me,                     
                    handler:    onClickExportCsv
                }));

        } 


        if ( ! this.myMeta.gridConfig.denyAutoPrint  ) {
            
            myPrinterOpts.push (
                new Ext.Action({
                    text:       'Grille',
                    iconCls :   'icon-printGrid', 
                    scope:      me,                     
                    handler:    onClickPrintGrid
                }));

            if ( __MasterDetail.protoMasterGrid.IdeSheet != undefined ) {
                myPrinterOpts.push (
                    new Ext.Action({
                        text    : 'Fiche',
                        iconCls : 'icon-printSheet', 
                        scope   :  me,                     
                        handler :  onClickPrintSheet
                    }));
            };
        } 

        // Los diferentes formatos definidos para cada grilla, definiria impresion en maestro deltalle usando templates y las relaciones definidas.
        if ( this.myMeta.protoSheets.length > 0 ) {
            
            for (var ix in this.myMeta.protoSheets  ) {       
                var pPrinterOpts = this.myMeta.protoSheets[ ix ]
                if ( pPrinterOpts.sheetStyle == 'gridOnly' ) continue; 
                
                myPrinterOpts.push (
                    new Ext.Action({
                        text:           pPrinterOpts.name,
                        sheetName :     pPrinterOpts.name, 
                        iconCls :       pPrinterOpts.protoIcon || 'icon-printSheet', 
                        tooltip:        pPrinterOpts.title,
                        scope:          me,                     
                        handler:        onClickPrintSheetRep
                    }));
            };
     
        } 

        if ( myPrinterOpts.length > 0  ) {

            __MasterDetail.tbPrinterOpts = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden : true,
                enableOverflow : true, 
                items: [{
                    xtype   : 'tbtext',
                    text: '<b>Imprimer :<b>'
                }]
            });

            __MasterDetail.tbPrinterOpts.add ( myPrinterOpts )
            __MasterDetail.myPrinterOpts = myPrinterOpts
            __MasterDetail.protoMasterGrid.addDocked( __MasterDetail.tbPrinterOpts )

        }; 
        
        function onClickProtoPrinterOpt( btn ){
        };

        function onClickPrintGrid( btn ){
            var prn = ProtoUL.ux.Printer
            prn.gridPrint( __MasterDetail.protoMasterGrid._extGrid )
        };

        function onClickPrintSheet( btn ){
            var prn = ProtoUL.ux.Printer, 
                pGrid = __MasterDetail.protoMasterGrid ;
            
            if ( (! pGrid) || (! pGrid.sheetHtml )) {
                __StBar.showWarning( 'no record selected', 'MdPrintOptsController')
                return 
            }
            
            // prn.sheetPrint( pGrid._extGrid, pGrid.sheetHtml  )
           me.openHtmlWin( pGrid.sheetHtml )

        };


        function onClickPrintSheetRep( btn ){
            var prn = ProtoUL.ux.Printer, 
                pGrid = __MasterDetail.protoMasterGrid ;

            var win = window.open('', 'printgrid');
            var selectedKeys = pGrid.getSelectedIds()

            var options = {
                scope : me,
                success : function(result, request) {
                    // prn.sheetPrint( pGrid._extGrid, result.responseText  )
                    prn.reportPrint( win , result.responseText  )
                    // me.openHtmlWin( result.responseText )
                }
            }
            
            getSheeReport( pGrid.protoOption, btn.sheetName , selectedKeys , options  )
            
        };

        function onClickExportCsv( btn ){
            
            var pGrid = __MasterDetail.protoMasterGrid ;

            // extraParams : {
                // protoOption : stDef.protoOption,
                // protoFilter : stDef.protoFilter,
                // baseFilter: stDef.baseFilter, 
                // protoMeta  : stDef.sProtoMeta    // String 
            // },    

            Ext.Ajax.request({
                method: 'POST',
                url: _PConfig.urlGetProtoCsv  ,
                params : pGrid.store.proxy.extraParams,
                success: function(result, request) {
                    errorMessage( 'export Csv  Ok' )  
                },
                failure: function(result, request) {
                    errorMessage( 'export Csv Failed', result.status + ' ' + result.statusText )
                },
                scope: this,
                timeout: 60000
            })

        };

        
    }, 
    
    openHtmlWin : function(  sHtml  ) { 
    
    
        //open up a new printing window, write to it, print it and close
        var win = window.open('', 'printgrid');
        win.document.write( sHtml );
        
        if (this.printAutomatically){
            win.print();
            // win.close();
        }

        
    } 
    
    
}) 


