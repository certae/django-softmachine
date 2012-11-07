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
        var tmpPrinterOpts = [] 
        var __MasterDetail = this.__MasterDetail

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

        // TODO: Los diferentes formatos definidos para cada grilla, definiria impresion en maestro deltalle usando templates y las relaciones definidas.  
        myPrinterOpts.push (
            new Ext.Action({
                text:       'Report',
                iconCls :   'icon-printGrid', 
                scope:      me,                     
                handler:    onClickPrintSheetRep
            }));


        // TODO: Los diferentes formatos definidos para cada grilla, definiria impresion en maestro deltalle usando templates y las relaciones definidas.  
        for (var vDet in tmpPrinterOpts ) {       
            var pPrinterOpts = tmpPrinterOpts[ vDet ]
            myPrinterOpts.push (
                new Ext.Action({
                    text:           pPrinterOpts.name,
                    iconCls :       pPrinterOpts.icon, 
                    maxWidth :      100, 
                    printerOpt:     Ext.encode( pPrinterOpts.filter ),
                    scope:          me,                     
                    handler:        onClickProtoPrinterOpt
                }));
        };


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

            var selectedKeys = []
            if ( __MasterDetail.idMasterGrid >= 0  )  {
                selectedKeys = [ __MasterDetail.idMasterGrid ]
            }


            var options = {
                scope : me,
                success : function(result, request) {
                    // prn.sheetPrint( pGrid._extGrid, result.responseText  )
                    prn.reportPrint( win , result.responseText  )
                    // me.openHtmlWin( result.responseText )
                }
            }
            
            getSheeReport( pGrid.protoOption, '', selectedKeys , options  )
            
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


