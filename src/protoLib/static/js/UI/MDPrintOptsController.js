Ext.define('ProtoUL.UI.MDPrintOptsController', {
    extend: 'Ext.Base',
    myMeta: null,
    constructor: function(config) {
        Ext.apply(this, config || {});
        this.getPrinterOptsBar();
    },

    getPrinterOptsBar: function() {

        var me = this;
        var myPrinterOpts = [];
        var __MasterDetail = this.__MasterDetail;

        if (this.myMeta.gridConfig.exportCsv) {

            myPrinterOpts.push(new Ext.Action({
                text: _SM.__language.Grid_ExportCSV,
                iconCls: 'icon-printGrid',
                tooltip: _SM.__language.Grid_ExportCSV_Ttip,
                scope: me,
                handler: onClickExportCsv
            }));

        }

        if (!this.myMeta.gridConfig.denyAutoPrint) {

            myPrinterOpts.push(new Ext.Action({
                text: _SM.__language.Text_Grid,
                iconCls: 'icon-printGrid',
                scope: me,
                handler: onClickPrintGrid
            }));

            if (__MasterDetail.protoMasterGrid.IdeSheet != undefined) {
                myPrinterOpts.push(new Ext.Action({
                    text: 'Fiche',
                    iconCls: 'icon-printSheet',
                    scope: me,
                    handler: onClickPrintSheet
                }));
            }
        }

        // Los diferentes formatos definidos para cada grilla, definiria impresion en maestro deltalle usando templates y las relaciones definidas.
        if (this.myMeta.sheetConfig.length > 0) {

            for (var ix in this.myMeta.sheetConfig  ) {
                var pPrinterOpts = this.myMeta.sheetConfig[ix];
                if (pPrinterOpts.sheetStyle == 'gridOnly') {
                    continue;
                }

                myPrinterOpts.push(new Ext.Action({
                    text: pPrinterOpts.name,
                    sheetName: pPrinterOpts.name,
                    iconCls: pPrinterOpts.viewIcon || 'icon-printSheet',
                    tooltip: pPrinterOpts.title,
                    scope: me,
                    handler: onClickPrintSheetRep
                }));
            }

        }

        // Modificacion del entorno
        if (myPrinterOpts.length > 0) {

            __MasterDetail.tbPrinterOpts = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden: true,
                enableOverflow: true,
                items: [{
                    xtype: 'tbtext',
                    text: '<strong>' + _SM.__language.Text_Print + ':</strong>'
                }]
            });

            __MasterDetail.tbPrinterOpts.add(myPrinterOpts);
            __MasterDetail.myPrinterOpts = myPrinterOpts;
            __MasterDetail.protoMasterGrid.addDocked(__MasterDetail.tbPrinterOpts);

        }

        function onClickProtoPrinterOpt(btn) {
        }

        function onClickPrintGrid(btn) {
            var prn = ProtoUL.ux.Printer;
            prn.gridPrint(__MasterDetail.protoMasterGrid._extGrid);
        }

        function onClickPrintSheet(btn) {
            var prn = ProtoUL.ux.Printer, pGrid = __MasterDetail.protoMasterGrid;

            if ((!pGrid) || (!pGrid.sheetHtml )) {
                _SM.__StBar.showWarning(_SM.__language.GridAction_NoRecord, 'MdPrintOptsController');
                return;
            }

            me.openHtmlWin(pGrid.sheetHtml);

        }

        function onClickPrintSheetRep(btn) {
            var prn = ProtoUL.ux.Printer, pGrid = __MasterDetail.protoMasterGrid;

            var win = window.open('', 'printgrid');
            var selectedKeys = pGrid.getSelectedIds();

            var options = {
                scope: me,
                success: function(result, request) {
                    prn.reportPrint(win, result.responseText);
                }
            };

            _SM.getSheeReport(pGrid.viewCode, btn.sheetName, selectedKeys, options);

        }

        function onClickExportCsv(btn) {

            var pGrid = __MasterDetail.protoMasterGrid;

            Ext.Ajax.request({
                method: 'POST',
                url: _SM._PConfig.urlGetProtoCsv,
                params: pGrid.store.proxy.extraParams,
                success: function(result, request) {
                    var myResult = Ext.decode(result.responseText);
                    _SM.getFile(myResult.message, false);
                },
                failure: function(result, request) {
                    _SM.errorMessage(_SM.__language.Grid_ExportCSV_Err, result.status + ' ' + result.statusText);
                },
                scope: this,
                timeout: 60000
            });

        }

    },

    openHtmlWin: function(sHtml) {
        //open up a new printing window, write to it, print it and close
        var win = window.open('', 'printgrid');
        win.document.write(sHtml);

        if (this.printAutomatically) {
            win.print();
        }
    }
});

_SM.getFile = function(fName, newWindow) {
    //  contentType = 'octet-stream'
    var dataURL = 'getFile/' + fName;

    // Not useful for application/octet-stream type
    if (newWindow) {
        window.open(dataURL);
        // To open in a new tab/window
    } else {
        window.location = dataURL;
    }

}; 