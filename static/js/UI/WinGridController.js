/**
 * @class ProtoUL.ux.WinGridController
 * @author  Dario Gomez

 * Helper class for instancing Independent windows grid

 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */
/*global ProtoUL */
/*global getSimpleProperties */

Ext.define('ProtoUL.UI.WinGridController', {
    extend: 'Ext.Base',

    // Parametros de entrada
    viewCode: null,
    detailDefinition: null,

    // * Grid initialization
    myMeta: null,
    myGrid: null,
    store: null,

    baseFilter: [],
    initialFilter: [],

    constructor: function(config) {
        Ext.apply(this, config || {});
    },

    createGridWindow: function(me) {
        // @GridRaise

        if (me.linkController) {
            me.detailLink = me.linkController.getDetailLink(me.detailDefinition);
            me.baseFilter = me.detailLink.detFilter;
        }

        // Crea la grilla
        me.myGrid = Ext.create('ProtoUL.view.ProtoGrid', {
            isPromoted: true,
            viewCode: me.viewCode,
            detailDefinition: me.detailDefinition,
            mdFilter: me.baseFilter,
            hideSheet: true
        });

        me.myMeta = me.myGrid.myMeta;

        if (me.linkController) {
            me.linkController.setDetailDefaults(me.detailDefinition, me.myGrid.myFieldDict);
            me.myGrid.detailTitle = me.detailLink.detTitle;
            me.myGrid.setGridTitle(me.myGrid);
            me.myGrid.setEditMode(!me.linkController.isReadOnly);
        }
        // Para identificar el StatusBar
        me.idStBar = Ext.id();

        var perms, gridBtns;
        perms = _SM._UserInfo.perms[me.viewCode];
        gridBtns = [{
            xtype: 'tbtext',
            text: '',
            id: me.idStBar,
            flex: 1,
            readOnly: true
        }, {
            xtype: 'button',
            text: 'Ok',
            scope: me,
            handler: me.doClose
        }];

        // referencia a la ventana modal
        me.myWin = Ext.widget('window', {
            title: 'Grid : ' + me.myMeta.shortTitle,
            constrainHeader: true,
            iconCls: me.myMeta.viewIcon,
            layout: 'fit',
            modal: true,
            width: 800,
            minWidth: 400,
            height: 600,
            minHeight: 400,
            resizable: true,
            items: this.myGrid,

            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                defaults: {
                    minWidth: 75
                },
                items: gridBtns
            }]

        });

        me.myWin.show();

    },

    doClose: function() {
        this.myWin.close();
    }

});

