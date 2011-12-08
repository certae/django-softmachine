/*
 * 
 */


Ext.define('ProtoUL.UI.TbMasterDetail', {
    // extend: 'Ext.Toolbar',
    // extend: 'Ext.container.Container',
    extend: 'Ext.Panel',
    alias: 'widget.tbMasterDetail',
    
    // isToolbar: true,
    // baseCls  : Ext.baseCSSPrefix + 'toolbar',
    // ariaRole : 'toolbar',
    // vertical: false,    

    initComponent: function() {

        // Barras internas 
        var ideTbSearch = Ext.id();
        var ideTbDetails = Ext.id();
        var ideTbOrder = Ext.id();
        var ideTbFilter = Ext.id();
        var ideTbViews = Ext.id();


        // Reorder obj 
        var reorderer = Ext.create('ProtoUL.ux.BoxReorderer', {
            listeners: {
                scope: this,
                Drop: function(r, c, button) { //update sort direction when button is dropped
                    changeSortDirection(button, false);
                }
            }
        });
    

        //--------------------------------------------------------


        var tbar1 = Ext.create('Ext.Toolbar', {
            dock: 'top',
            defaults: { 
                    scale: 'medium',
                    enableToggle: true,
                    toggleGroup: 'tb1' , 
                    handler: toogleTb2 
                },
            items: [{
                pressed: true,
                text: 'Search',
                iconCls: 'icon-search',
                idTb2  : ideTbSearch
            },'-',{
                text: 'Details',
                iconCls: 'icon-details',
                idTb2  : ideTbDetails
            },'-',{
                text: 'Order',
                iconCls: 'icon-order',
                idTb2  : ideTbOrder
            },'-',{
                text: 'Filter',
                iconCls: 'icon-filter',
                idTb2  : ideTbFilter
            },'-',{
                text: 'Views',
                iconCls: 'icon-views',
                idTb2  : ideTbViews
            }]
        
        });
        
        var tbar2 = Ext.create('Ext.Toolbar', {
            dock: 'top',
            defaults: { scale: 'small', hidden : true },
            items: [{
                    id : ideTbSearch , 
                    xtype: 'buttongroup',
                    hidden : false, 
                },{
                    id : ideTbDetails, 
                    xtype: 'buttongroup',
                },{
                    id : ideTbFilter, 
                    xtype: 'buttongroup',
                },{
                    id : ideTbViews, 
                    xtype: 'buttongroup',
                }]
            });

        function toogleTb2( but  ) {

            if ( but.idTb2 != ideTbOrder ) {
                Ext.each(tbar2.query('buttongroup'), function(button) {
                    button.hide();
                }, this);
                
                var tb2 = Ext.getCmp ( but.idTb2  )
                tb2.show()
                
                orderTbar.hide()
                tbar2.show()
            } else {
                orderTbar.show()
                tbar2.hide()
            }             
        }; 

        //--------------------------------------------------------

        // Asigna una referencia al objeto 
        var myMeta = this.protoMeta; 
        var __MasterDetail = this.objMasterDet; 


        // Menu Detail 
        // var menuDetail = new Ext.menu.Menu({ hidden:true  });
        var menuDetail = Ext.getCmp( ideTbDetails );
        var menuPromDetail = Ext.id();
        menuDetail.add({
            iconCls : 'icon-page_white_get', 
            text: '<b>Promote Detail<b>',
            id: menuPromDetail,
            disabled: true,
            handler:  onMenuPromoteDetail
        // },{  xtype: 'menuseparator'
        });
        configureMenuDetail( ); 


        //--------------------------------------------------------


        // Combo Columnas  
        var colStore = new Ext.data.ArrayStore({
            fields: ['colPhysique', 'colName'],
            data: configureComboColumns()
        });
    
        var comboCols = new Ext.form.ComboBox({
            store: colStore,
            width: 135,
            mode: 'local',
            triggerAction: 'all',
            displayField: 'colName',
            valueField: 'colPhysique',
            forceSelection: true,
            emptyText: 'Select a column ...',
            selectOnFocus: true,
            typeAhead: true,
        });


        // combo - operation 
        var comboOp = new Ext.form.ComboBox({
            store: new Ext.data.ArrayStore({ fields: ['code', 'operation'], data: _ComboFilterOp }),
            width: 50,
            mode: 'local',
            triggerAction: 'all',  
            displayField: 'operation',
            valueField: 'code',
            forceSelection: true,
            editable: false,
        });

        // Criteria 
        var searchCr = new Ext.form.TextField({
            emptyText: 'search criteria ..',
            width: 200
        })

        // Load Data button 
        var searchBtn = new Ext.button.Split({
            text: 'Load data',
            handler: onClickLoadData,
            iconCls: 'icon-search',
            menu: {
                items: [{
                    text: '<b>Clear filter<b>',
                    handler: onClickClearFilter, 
                // }, {
                    // text: 'add filter',
                    // handler: __MasterDetail.onClickFilter
                }]
            }
        })
        

        var tbSearch = Ext.getCmp( ideTbSearch );
        tbSearch.add( [
            searchBtn,    
            searchCr,
            comboOp,
            comboCols,
            ] )

        // Inicializa Combos 
        clearCombos()     

// ----------------------------------------------------------------------------------

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


        // var orderTbar = Ext.getCmp( ideTbOrder );
        var orderTbar = Ext.create('Ext.toolbar.Toolbar', {
            id : ideTbOrder, 
            items  : [{
                iconCls : 'sort', 
                xtype: 'tbtext',
                text: '<b>Sorting order:</b>',
                reorderable: false 
                }],  
            plugins: [reorderer,  ],
            hidden : true
        });

        function configureOrderTab (  ){
            for (var i = 0, len = myMeta.fields.length; i < len; i++) {
                var c = myMeta.fields[i];
                if ( c.name in oc( myMeta.sortFields)  ) { 

                    orderTbar.add(createSorterButtonConfig({
                        text: c.header,
                        reorderable: true, 
                        sortData: {
                            property: c.name,
                            direction: 'ASC'
                        }
                    }));
                }    
            };
        }; 

        var ideBtNoSort = Ext.id();
        orderTbar.add({
            xtype: 'tbtext',
            id : ideBtNoSort, 
            text: '<b>No Sort:</b>',
            iconCls : 'stop', 
            reorderable: true,
            handler: doSort()
        });
        
        configureOrderTab(); 
        // orderTbar.doLayout()

// ----------------------------------------------------------------------------------

        Ext.apply(this, {
            layout: {
                type: 'vbox',
                border: false, 
                align: 'stretchmax'
            },
            dockedItems: [
                tbar1,  orderTbar, tbar2, 
            ]
        });
        // panel.add(tool1);  ...
        
        this.callParent();

        function configureComboColumns ( tb ){
            // Columnas para el Query del tipo :  newColData = [['idx', 'Id Reg'],['code', 'Code Reg']];
            var colData = [];
            colData[0] = ['', ''];
            j = 1;

            for (var i = 0, len = myMeta.fields.length; i < len; i++) {
                var c = myMeta.fields[i];
                if ( c.name in oc( myMeta.searchFields)  ) { 
                    colData[j] = [c.name, c.header];
                    j += 1;
                }    
            };
            
            return colData ; 
        }; 

        function configureMenuDetail(  ){
            
            var pDetails = myMeta.protoDetails;
            var ixTabC = 0                      // Agrega un numero secuencia para marcar los tabs
            var bDetails = false;               // Indica si tiene o no detalles
            for (var vDet in pDetails) {        // Recorre y agrega los detalles al menu 
                // console.log( pDetails[vTab] + " ");
                bDetails = true;
                
                if (pDetails[vDet].menuText == '-') { 
                    var item = menuDetail.add({ xtype: 'menuseparator' });
                    continue
                }
                
                var item = menuDetail.add({
                    text: pDetails[vDet].menuText,
                    detail: pDetails[vDet].conceptDetail,
                    detailField: pDetails[vDet].detailField,
                    masterField: pDetails[vDet].masterField,
                    ixTab: ixTabC,
                });
                
                // Agrego el handler q activara el tab a partir del menu
                // item.on('click', onMenuSelectDetail);
                item.on({
                    click: { fn: __MasterDetail.onMenuSelectDetail,scope: __MasterDetail  },
                });                 
                ixTabC += 1;
            };
    
            // activa el boton de promover detalles 
            if (bDetails == true) {
                menuDetail.items.get( menuPromDetail ).enable();
            };
        };


        function onClickLoadData ( btn ) { 
    
            var sFilter = '';
            var sCols = comboCols.getValue() || '' 
            var sOps  = comboOp.getValue() || 'icontains' 
        
            if (searchCr.getValue() == '' ) {
                sFilter = '';

            } else if ((sCols  == '') && (searchCr.getValue() != '' )) {
                sFilter = searchCr.getValue();

            } else {
                sFilter = '{"' + comboCols.getValue() + '__' + comboOp.getValue() + '" : "' + searchCr.getValue() + '",}';
            }
            
            __MasterDetail.onClickLoadData ( sFilter  );
    
        }; 

        function onClickClearFilter (item ){
            // TODO: Manejara los filtros compuestos ( QBE )
            clearCombos()
            onClickLoadData( {} );
    
        } 


        function clearCombos ( ){
            comboCols.setValue('');
            comboOp.setValue(''); 
            searchCr.setValue(''); 
        }; 


        function onMenuPromoteDetail  (item) {
    
            // Verifica q halla un tab activo 
            if (__MasterDetail.ixActiveTab < 0) { return; }
    
            // carga el store 
            var tmpStore = __MasterDetail.cllStoreDet[__MasterDetail.ixActiveTab]
    
    
            __TabContainer.addTabPanel ( 
                   tmpStore.protoConcept , 
                   tmpStore.getProxy().extraParams.protoFilterBase 
               ); 
            
        };

// ------------------------------------------------------------------------------------------------


        /**
         * Callback handler used when a sorter button is clicked or reordered
         * @param {Ext.Button} button The button that was clicked
         * @param {Boolean} changeDirection True to change direction (default). Set to false for reorder
         * operations as we wish to preserve ordering there
         */
        function changeSortDirection(button, changeDirection) {
            var sortData = button.sortData,
                iconCls  = button.iconCls;
            
            if (sortData) {
                if (changeDirection !== false) {
                    button.sortData.direction = Ext.String.toggle(button.sortData.direction, "ASC", "DESC");
                    button.setIconCls(Ext.String.toggle(iconCls, "sort-asc", "sort-desc"));
                }
                __MasterDetail.protoMasterStore.clearFilter();
                doSort();
            }
        }
    
        function doSort() {
            __MasterDetail.protoMasterStore.sort( getSorters() );
        }
    
        /**
         * Returns an array of sortData from the sorter buttons
         * @return {Array} Ordered sort data from each of the sorter buttons
         */
        function getSorters() {

            var sorters = [];

            // tiene en cuenta la posicion de: ideBtNoSort
            var ixBt = -1;  
            for (var ix in orderTbar.items.items) {
                if ( orderTbar.items.items[ix].id  ==  ideBtNoSort ) { break; }
                ixBt ++;  
            }
            if ( ixBt <= 0 ) { return sorters  };  
            
            Ext.each(orderTbar.query('button'), function(button) {
                sorters.push(button.sortData);
            }, this);

            return sorters.slice(0, ixBt );
        }
    
        doSort();

// ------------------------------------------------------------------------------------------------



    }, 
    

}); 