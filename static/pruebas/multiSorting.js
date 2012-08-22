Ext.define('Ext.ux.grid.feature.MultiSorting', {
            extend : 'Ext.grid.feature.Feature',
            alias : 'feature.multisorting',
            removeText : 'Remove Sort',
            removeCls : '',
            attachEvents : function() {
                var me, headerCt;

                me = this;
                headerCt = me.view.headerCt;

                me.injectMultiSorting(headerCt.query('>gridcolumn[hideable]'));
                me.injectRemoveSortBtnInHeaderMenu();
                me.initSort();

                headerCt.on('sortchange', me.onRemoveSort, me);
            },
            injectMultiSorting : function(headers) {
                var me = this;
                Ext.Array.each(headers, function(header, index) {
                            header = Ext.apply(header, {
                                        possibleSortStates : ['ASC', 'DESC',
                                                null],
                                        triStateSort : true,
                                        doSort : Ext.Function.bind(me.doSort,
                                                me, [header], true)
                                    });
                        }, me);
            },
            injectRemoveSortBtnInHeaderMenu : function() {
                var me, headerCt, headerMenu, insertIndex;

                me = this;
                headerCt = me.view.headerCt;
                headerMenu = headerCt.getMenu();
                insertIndex = headerMenu.items.indexOf(headerMenu
                        .down('#descItem'))
                        + 1;

                headerMenu.insert(insertIndex, Ext.create('Ext.menu.Item', {
                                    text : me.removeText,
                                    itemId : 'removeSort',
                                    cls : me.removeCls,
                                    handler : me.onRemoveSortClick,
                                    scope : me
                                }));
            },
            doSort : function(state, header) {
                var ds = header.up('[store]').store;

                if (state == null) {
                    ds.sorters.removeAtKey(header.getSortParam());
                    ds.load();
                } else {
                    ds.sort({
                                property : header.getSortParam(),
                                direction : state
                            }, 'append');
                }
            },
            initSort : function() {
                var me, headerCt, store, sorters, sorter;

                me = this;
                headerCt = me.view.headerCt;
                store = me.view.store;
                sorters = store.sorters;

                headerCt.items.each(function(header) {
                            if (sorters.containsKey(header.getSortParam())) {
                                sorter = sorters
                                        .getByKey(header.getSortParam());
                                header.setSortState(sorter.direction, false,
                                        true);
                            }
                        }, me);
            },
            onRemoveSort : function(ownerHeaderCt, header, state) {
                if (state === null) {
                    this.doSort(state, header);
                }
            },
            onRemoveSortClick : function(item, e) {
                item.parentMenu.activeHeader.setSortState(null);
            }
        });


    Ext.QuickTips.init();

    var myData = [['3m Co', 100, '11/1 12:00am'],
            ['Alcoa Inc', 100, '10/1 12:00am'],
            ['Altria Group Inc', 103, '9/1 12:00am'],
            ['American Express Company', 103, '11/1 12:00am'],
            ['American International Group, Inc.', 103, '2/1 12:00am'],
            ['AT&T Inc.', 0, '2/1 12:00am'], ['Boeing Co.', 0, '10/1 12:00am']];

    var store = Ext.create('Ext.data.ArrayStore', {
                fields : [{
                            name : 'company'
                        }, {
                            name : 'price',
                            type : 'float'
                        }, {
                            name : 'lastChange',
                            type : 'date',
                            dateFormat : 'n/j h:ia'
                        }],
                data : myData
            });

    var grid = Ext.create('Ext.grid.Panel', {
                store : store,
                columns : [{
                            text : 'Company',
                            flex : 1,
                            sortable : true,
                            dataIndex : 'company'
                        }, {
                            text : 'Price',
                            width : 75,
                            sortable : true,
                            dataIndex : 'price'
                        }, {
                            text : 'Last Updated',
                            width : 85,
                            sortable : true,
                            renderer : Ext.util.Format.dateRenderer('m/d/Y'),
                            dataIndex : 'lastChange'
                        }],
                height : 350,
                width : 600,
                title : 'Array Grid',
                renderTo: Ext.getBody(),
                viewConfig : {
                    stripeRows : true
                },
                features : [Ext.create('Ext.ux.grid.feature.MultiSorting')]
            });
​