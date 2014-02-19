/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.UI.MDDetailsController', {
    extend: 'Ext.Base',
    myMeta: null,

    constructor: function(config) {

        Ext.apply(this, config || {});
        this.getDetailsTBar();

    },

    getDetailsTBar: function() {

        // @formatter:off
        var me = this,
            myMasterDetail = me.__MasterDetail,
            myDetails = [], 
            myAction, vDet, pDetail ;
        // @formatter:on

        // Recorre y agrega los detalles al menu
        for (vDet in myMasterDetail.myMeta.detailsConfig) {

            pDetail = myMasterDetail.myMeta.detailsConfig[vDet];
            if (pDetail.menuText === undefined) {
                continue;
            }

            myAction = new Ext.Action({
                text: pDetail.menuText,
                hidden: true,
                // enableToggle: true,
                scope: me,
                handler: onActionSelectDetail,
                detailKey: pDetail.conceptDetail,
                detailDefinition: pDetail
            });

            myDetails.push(myAction);
            loadDetailDefinition(myAction.initialConfig, myAction);

        }

        if (myDetails.length > 0) {

            // toolBar de base para los items
            myMasterDetail.tbDetails = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'bottom',
                border: true,
                enableOverflow: true,
                items: [{
                    text: '<strong>' + _SM.__language.Grid_Detail_Title + ':</strong>',
                    iconCls: 'icon-panelDown',
                    enableToggle: false,
                    scope: myMasterDetail,
                    handler: myMasterDetail.hideDetailPanel
                }]
            });

            myMasterDetail.myDetails = myDetails;
            myMasterDetail.tbDetails.add(myDetails);
            myMasterDetail.protoMasterGrid.addDocked(myMasterDetail.tbDetails, 0);
            // myMasterDetail.protoMasterGrid.ownerCt.addDocked( myMasterDetail.tbDetails )
        }

        function loadDetailDefinition(item, myAction) {

            // Opciones del llamado AJAX para precargar los detalles
            var options = {
                scope: me,
                success: function(obj, result, request) {
                    createDetailGrid(item, myAction);
                },
                failure: function(obj, result, request) {
                    createDummyPanel(item, myAction);
                }

            };

            // PreCarga los detalles
            if (_SM.loadPci(item.detailDefinition.conceptDetail, true, options)) {
                // El modelo ya ha sido cargado ( la cll meta es global )
                createDetailGrid(item, myAction);
            }

        }

        function createDummyPanel(item, myAction) {
            // Si hubo error en la creacion del detalle
            // El panel debe crearse para poder manejar la secuencia en la barra
            myMasterDetail.protoTabs.add({
                html: _SM.__language.Grid_Detail_Error + ' :' + item.detailKey,
                ixDetail: myMasterDetail.protoTabs.items.length
            });
            // myAction.show();   ( Debug Only )
        }

        function createDetailGrid(item, myAction) {

            function setActionPrp(prp, meth, value) {
                myAction.initialConfig[prp] = value;
                myAction.callEach(meth, [value]);
            }

            //
            var pDetail = item.detailDefinition, detailGrid, myMeta;

            // Definicion grilla Detail
            detailGrid = Ext.create('ProtoUL.view.ProtoGrid', {
                border: false,
                viewCode: pDetail.conceptDetail,
                protoIsDetailGrid: true,
                detailDefinition: pDetail,
                autoLoad: false,
                isDetail: true,

                // Para saber de q linea del maestro  depende
                _MasterDetail: myMasterDetail
            });

            // guarda el store con el indice apropiado
            detailGrid.store.detailDefinition = pDetail;

            // Asigna el Ix
            item.ixDetail = myMasterDetail.protoTabs.items.length;
            myMasterDetail.protoTabs.add(detailGrid);

            //Definicion del detalle TODO: pasarlo a una clase

            detailGrid.ixDetail = item.ixDetail;

            // Asigna el store y lo agrega a los tabs
            myMasterDetail.cllStoreDet[item.ixDetail] = detailGrid.store;

            // Configura el panel
            myMeta = detailGrid.myMeta;

            // setActionPrp('text', 'setText',  myMeta.shortTitle );
            // setActionPrp('tooltip', 'setTooltip', myMeta.description );
            setActionPrp('tooltip', 'setTooltip', pDetail.menuText);

            setActionPrp('iconCls', 'setIconCls', myMeta.viewIcon);
            //setActionPrp('iconAlign', 'setIconAlign', 'top');
            setActionPrp('width', 'setWidth', 100);
            myAction.show();

        }

        function onActionSelectDetail(item) {
            //          fix : Toolbar overflow
            //          myMasterDetail.ixActiveDetail = item.baseAction.initialConfig.ixDetail ;
            myMasterDetail.ixActiveDetail = item.initialConfig.ixDetail;

            // Si se carga directamente el Card Layout en el BorderLayout no permite el activeItem
            myMasterDetail.protoTabs.getLayout().setActiveItem(myMasterDetail.ixActiveDetail);

            myMasterDetail.linkDetail();
            myMasterDetail.showDetailPanel();

            if (item.hasOwnProperty('toggle')) {
                item.toggle(true);
            }
        }

    }

});
