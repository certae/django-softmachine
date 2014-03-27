/*
 *  TabContainer
 *  -   MasterDetail
 *  -   -   Grid
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.view.ProtoMasterDetail', {
    extend: 'Ext.Panel',
    alias: 'widget.protoMasterDetail',
    requires: ['ProtoUL.view.ProtoGrid', 'ProtoUL.UI.TbMasterDetail'],

    // Estados iniciales
    editable: false,
    autoSync: true,
    autoEdit: true,

    // @es definido solamente cuando es una grilla dependiente  ( detalle o promoted )
    isPromoted: false,
    mdFilter: [],

    initComponent: function() {

        // Recupera la meta   ------------------------------------------------------------
        this.myMeta = _SM._cllPCI[this.viewCode];
        var me = this, tb;

        // Marca si viene de un detalle
        if (this.mdFilter) {
            this.isPromoted = true;
        }

        _SM.__StBar.showBusy('loading ' + this.viewCode + '...', 'prMD.init', 2000);

        // Master Grid    ==========================================================
        // y la Guarda el store para efectos de eventos y referencias
        this.protoMasterGrid = Ext.create('ProtoUL.view.ProtoGrid', {
            border: false,
            viewCode: this.viewCode,
            mdFilter: this.mdFilter,
            detailTitle: this.detailTitle,
            isPromoted: this.isPromoted,

            region: 'center',
            flex: 1,
            layout: 'fit',
            collapsible: false
        });

        //
        this.protoMasterStore = this.protoMasterGrid.store;

        // Manejo de arbol
        this.pciStyle = this.protoMasterGrid.myMeta.pciStyle || 'grid';

        // Barra MD
        tb = Ext.create('ProtoUL.UI.TbMasterDetail', {
            protoMeta: this.myMeta,
            __MasterDetail: me
        });

        // Asigna el tab de control a la grilla y el panel de detalles
        this.protoMasterGrid._toolBar = tb;
        this.protoTabs = Ext.create('Ext.panel.Panel', {
            layout: 'card'
        });

        this.IDdetailPanel = Ext.id();
        Ext.apply(this, {
            layout: 'border',
            border: false,
            defaults: {
                collapsible: true,
                border: false,
                split: true
            },
            tbar: tb,
            items: [this.protoMasterGrid, {

                // Extjs 4.1.1 Genera error al mezclar layout "region"  &  "card",
                // }, this.protoTabs ]

                id: this.IDdetailPanel,
                collapseMode: 'mini',
                hideCollapseTool: true,
                region: 'south',
                header: false,
                border: false,
                flex: 1,
                collapsed: true,
                layout: 'fit',
                minSize: 75,
                defaults: {
                    border: false
                },
                items: this.protoTabs
            }]
        });

        // coleccion con los store de los detalles  y su indice  =============================================
        this.ixActiveDetail = -1;
        this.idMasterGrid = -1;
        this.cllStoreDet = [];

        this.callParent();

        // Controllers
        Ext.create('ProtoUL.UI.MDDetailsController', {
            __MasterDetail: me
        });
        Ext.create('ProtoUL.UI.MDTbSortByController', {
            myMeta: this.myMeta,
            __MasterDetail: me
        });
        Ext.create('ProtoUL.UI.MDPrintOptsController', {
            myMeta: this.myMeta,
            __MasterDetail: me
        });
        Ext.create('ProtoUL.UI.MDActionsController', {
            myMeta: this.myMeta,
            __MasterDetail: me
        });

        Ext.create('ProtoUL.UI.MDSetFiltersController', {
            myMeta: this.myMeta,
            __MasterDetail: me
        });
        Ext.create('ProtoUL.UI.MDSetSortersController', {
            myMeta: this.myMeta,
            __MasterDetail: me
        });
        Ext.create('ProtoUL.UI.MDSetTabsController', {
            myMeta: this.myMeta,
            __MasterDetail: me
        });

        Ext.create('ProtoUL.UI.ConfigController', {
            myMeta: this.myMeta,
            __MasterDetail: me
        });

        //
        this.linkController = Ext.create('ProtoUL.UI.MDLinkController', {});

        // Agrega los botones de actions
        tb.addActions();

        //  ****************************************************************
        //  Eventos de los objetos internos para el manejo Master-Detail

        this.protoMasterGrid.on({
            selectionChange: {
                fn: function(rowModel, rowData, rowIndex, eOpts) {
                    this.idMasterGrid = this.protoMasterGrid.currentId;
                    this.linkDetail();
                },
                scope: me
            }
        });

    },

    linkDetail: function() {
        // Refresca las grillas de detalle
        var me = this, detailLink, myDetStore, pDetail, myDetGrid;

        // Verifica q halla un tab activo y q no hallan sido borrados
        if (me.ixActiveDetail < 0) {
            return;
        }
        if (me.protoTabs.items.length === 0) {
            return;
        }

        // carga el store
        myDetStore = me.cllStoreDet[me.ixActiveDetail];
        pDetail = myDetStore.detailDefinition;

        // Verifica si la llave cambio
        if (myDetStore.protoMasterId === me.idMasterGrid) {
            return;
        }

        // Navegacion por llaves del maestro, si rowData is null no hay registro seleccionado
        me.linkController.setMasterData(me.protoMasterGrid.rowData);
        detailLink = me.linkController.getDetailLink(pDetail);
        myDetStore.myLoadData(detailLink.detFilter, null, me.idMasterGrid);

        // Obtiene la grilla y le da un titulo
        myDetGrid = me.protoTabs.items.items[me.ixActiveDetail];
        myDetGrid.detailTitle = detailLink.detTitle;
        myDetGrid.setGridTitle(myDetGrid);
        myDetGrid.mdFilter = detailLink.detFilter; 

        // Asigna los vr por defecto
        me.linkController.setDetailDefaults(pDetail, myDetGrid.myFieldDict);

    },

    mdGridReload: function() {
        this.protoMasterGrid.reload();
    },

    mdGridLoadData: function(sFilter, sorter) {
        // Refresh
        this.protoMasterGrid.gridLoadData(this.protoMasterGrid, sFilter, sorter);
    },

    showDetailPanel: function(bHide) {
        var detailPanel = Ext.getCmp(this.IDdetailPanel);
        if (bHide) {
            this.ixInactiveDetail = this.ixActiveDetail;
            this.ixActiveDetail = -1;
            detailPanel.collapse();

        } else if (detailPanel.collapsed) {
            if (this.ixActiveDetail < 0) {
                this.ixActiveDetail = this.ixInactiveDetail || 0;
            }
            this.linkDetail();
            detailPanel.expand();
        }
    },

    hideDetailPanel: function(btn) {
        this.showDetailPanel(true);
    },

    isDetailCollapsed: function() {

        var detailPanel = Ext.getCmp(this.IDdetailPanel);
        if (!detailPanel) {
            return true;
        }
        return (detailPanel.collapsed  );

    },

    setEditMode: function(bEdit) {

        var me = this, detGrids = null, myDetGrid, ix;

        // Apagar las barras ( hacen parte de la grilla menos tbTabs y tbDetails )
        // setDisabled( me.tbTabs )

        if (!me.autoEdit) {
        setDisabled(me.tbFilters);
        setDisabled(me.tbPrinterOpts);
        setDisabled(me.tbConfigOpts);
        setDisabled(me.tbSorters);
        setDisabled(me.tbSortersSet);
        setDisabled(me.tbProtoActions);
        } else {
            bEdit = me.autoEdit;
        }


        // Cambia el control de las grillas correspondientes
        // Con el autosync se permite la edicion en todos los controles
        // if ( ! this.isDetailCollapsed()  ) {
        // Solo es la grilla lo q tengo q desabilitar
        // me.protoMasterGrid._extGrid.setDisabled( bEdit )
        // } else {

        // Si los detalles estan activos puedo cambiar de detalle sin cambiar el maestro
        // setDisabled( me.tbDetails, false  )
        me.protoMasterGrid.setEditMode(bEdit);
        // setDisabled( me.tbDetails )

        //Recorrer las grillas, cambiar el modo, TODO: heredados ( Default,  RO )
        try {
            detGrids = me.protoTabs.items.items;
        } catch(e) {
        }

        if (detGrids) {
            for (ix in detGrids ) {
                myDetGrid = detGrids[ix];
                if (!myDetGrid.detailDefinition) {
                    continue;
                }
                myDetGrid.setEditMode(bEdit);
            }
        }

        // }

        function setDisabled(tbar, bDisable) {
            // Por defecto es el edit mode
            if (bDisable === undefined) {
                bDisable = bEdit;
            }
            if (tbar) {
                tbar.setDisabled(bDisable);
            }
        }

    },

    setAutoSync: function(bMode) {
        this.autoSync = bMode;
    },

    saveChanges: function(autoSync) {
        var me = this, ix, detGrids, myDetGrid;

        if (this.isDetailCollapsed()) {
            me.protoMasterGrid.saveChanges(autoSync);
        } else {
            detGrids = me.protoTabs.items.items;
            for (ix in detGrids ) {
                myDetGrid = detGrids[ix];
                myDetGrid.saveChanges(autoSync);
            }
        }
    },

    cancelChanges: function() {
        var me = this, detGrids, ix, myDetGrid;
        if (this.isDetailCollapsed()) {
            me.protoMasterGrid.cancelChanges();
        } else {
            detGrids = me.protoTabs.items.items;
            for (ix in detGrids ) {
                myDetGrid = detGrids[ix];
                myDetGrid.cancelChanges();
            }
        }
    }

}); 