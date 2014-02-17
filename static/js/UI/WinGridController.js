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
    gridModel: null,

    // * Grid initialization
    isLoaded: false,
    myMeta: null,
    myGrid: null,
    store: null,

    constructor: function(config) {
        Ext.apply(this, config || {});
    },

    onTriggerClick: function() {
        this._loadGrid(this.showGridForm);
    },

    _loadGrid: function(fnBase, opts) {
        // Async Call
        var me = this, options = {
            scope: me,
            success: function(obj, result, request) {
                me.createGridWindow(me);
                fnBase.call(me, me, opts);
            },
            failure: function(obj, result, request) {
                return;
            }
        };

        if (_SM.loadPci(me.gridModel, true, options)) {
            me.createGridWindow(me);
            fnBase.call(me, me, opts);
        }

    },

    showGridForm: function(me) {
        if (!me.isLoaded) {
            return;
        }

        var myGridFilter = getFilter();
        if (myGridFilter) {
            if (myGridFilter.length > 0) {
                this.myGrid.store.mySetBaseFilter(myGridFilter);
            }
        }

        me.win.show();

    }, 

    createGridWindow: function(me) {
        // @GridRaise

        function doAcept() {
            me.resetGrid();
            me.win.hide();
        }

        if (me.isLoaded) {
            return;
        }

        me.myMeta = _SM._cllPCI[me.gridModel];

        // Crea la grilla
        this.myGrid = Ext.create('ProtoUL.view.ProtoGrid', {
            viewCode: me.gridModel,
            // initialFilter : [{ 'property' : 'pk', 'filterStmt' :  -1 }],
            initialFilter: [],
            hideSheet: true
        });

        // Para identificar el StatusBar
        me.idStBar = Ext.id();

        var perms = _SM._UserInfo.perms[me.myMeta.viewCode], gridBtns = [{
            xtype: 'tbtext',
            text: '',
            id: me.idStBar,
            flex: 1,
            readOnly: true
        }, {
            xtype: 'button',
            text: 'Ok',
            scope: me,
            handler: doAcept
        }];

        // referencia a la ventana modal
        me.win = Ext.widget('window', {
            title: 'Grid : ' + me.myMeta.shortTitle,

            iconCls: me.myMeta.viewIcon,
            closeAction: 'hide',
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

        me.isLoaded = true;
        this.myGrid.setEditMode(true);

    }


});

