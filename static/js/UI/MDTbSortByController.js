Ext.define('ProtoUL.UI.MDTbSortByController', {
    extend: 'Ext.Base',
    myMeta: null,
    constructor: function(config) {
        Ext.apply(this, config || {});
        this.getSortersBar();
    },

    getSortersBar: function() {

        // @formatter:off
        var me = this,
            mySortCols = [],
            __MasterDetail = me.__MasterDetail;

        me.myFieldDict = __MasterDetail.protoMasterGrid.myFieldDict;

        // REcorre los q llegan y genera el obj  header, name
        for (var ix in me.myMeta.gridConfig.sortFields ) {
            var name = me.myMeta.gridConfig.sortFields[ix];
            var c = me.myFieldDict[name];
            if (!c) { 
                c = {
                    name: name,
                    header: name
                };
                }
            mySortCols.push({
                name: c.name,
                header: c.header
            });
        }

        // getAllSort

        // Crea la tabla
        if (mySortCols.length > 0) {

            // Reorder obj
            var reorderer = Ext.create('Ext.ux.BoxReorderer', {
                listeners: {
                    scope: me,
                    Drop: function(r, c, button) {//update sort direction when button is dropped
                        changeSortDirection(button, false);
                    }

                }
            });

            __MasterDetail.tbSorters = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden: true,
                items: [{
                    iconCls: 'sort',
                    xtype: 'tbtext',
                    text: '<strong>' + _SM.__language.Grid_Sort_Title + ':</strong>',
                    reorderable: false
                }],
                plugins: [reorderer]
            });

            for (var ix in mySortCols ) {

                // Verifica si la col existe
                var c = mySortCols[ix];
                var col = me.myFieldDict[name];
                if (!col) {
                    continue;
                }

                // Agrega el sort
                __MasterDetail.tbSorters.add(createSorterButtonConfig({
                    text: c.header,
                    tooltip: c.header,
                    maxWidth: 100,
                    sortData: {
                        property: c.name,
                        direction: 'ASC'
                    }
                }));
            }

            __MasterDetail.protoMasterGrid.addDocked(__MasterDetail.tbSorters);
            this.mySortCols = mySortCols;

        }

        /**
         * Convenience function for creating Toolbar Buttons that are tied to sorters
         * @param {Object} config Optional config object
         * @return {Object} The new Button configuration
         */
        function createSorterButtonConfig(config) {
            config = config || {};
            Ext.applyIf(config, {
                listeners: {
                    click: function(button, e) {
                        changeSortDirection(button, true);
                    }

                },
                iconCls: 'sort-' + config.sortData.direction.toLowerCase(),
                reorderable: true,
                xtype: 'button'
            });
            return config;
        }

        /**
         * Callback handler used when a sorter button is clicked or reordered
         * @param {Ext.Button} button The button that was clicked
         * @param {Boolean} changeDirection True to change direction (default). Set to false for reorder
         * operations as we wish to preserve ordering there
         */
        function changeSortDirection(button, changeDirection) {
            var sortData = button.sortData, iconCls = button.iconCls;

            if (sortData) {
                if (changeDirection !== false) {
                    button.sortData.direction = Ext.String.toggle(button.sortData.direction, "ASC", "DESC");
                    button.setIconCls(Ext.String.toggle(iconCls, "sort-asc", "sort-desc"));
                }
                doSort();
            }
        }

        function doSort() {
            __MasterDetail.protoMasterStore.myLoadData(null, getSorters());
        }

        /**
         * Returns an array of sortData from the sorter buttons
         * @return {Array} Ordered sort data from each of the sorter buttons
         */
        function getSorters() {

            var sorters = [];
            Ext.each(__MasterDetail.tbSorters.query('button'), function(button) {
                sorters.push(button.sortData);
            }, me);

            // Solo orderna por los 4 primeros criterios
            return sorters.slice(0, 3);
        }

    }

});