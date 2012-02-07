/*
 * 
 */

// Ext.Loader.setConfig({enabled: true});


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
        var ideTbPrint = Ext.id();

        // Barra principal 
        var ideBtOrder = Ext.id();
        var ideBtDetails = Ext.id();
        var ideBtFilter = Ext.id();
        var ideBtViews = Ext.id();

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
                text: 'Rechercher',
                iconCls: 'icon-search24',
                idTb2  : ideTbSearch
            },'-',{
                text: 'Ordonner',
                iconCls: 'icon-order24',
                idTb2  : ideTbOrder, 
                id     : ideBtOrder 
            },'-',{
                text: 'Filtrer',
                iconCls: 'icon-filter24',
                idTb2  : ideTbFilter, 
                id     : ideBtFilter 
            },'-',{
                text: 'Imprimer',
                iconCls: 'icon-print24',
                idTb2  : ideTbPrint
            },'-',{
                text: 'Voir détails',
                iconCls: 'icon-details24',
                idTb2  : ideTbDetails,
                id     : ideBtDetails
            },'-',{
                text: 'Group de colonnes',
                iconCls: 'icon-views24',
                idTb2  : ideTbViews,
                id     : ideBtViews
            }]
        
        });
        
        var tbar2 = Ext.create('Ext.Toolbar', {
            dock: 'top',
            defaults: { scale: 'small', hidden : true },
            items: [{
                    id : ideTbSearch , 
                    xtype: 'buttongroup',
                    hidden : false 
                },{
                    id : ideTbFilter, 
                    xtype: 'buttongroup'
                },{
                    id : ideTbPrint, 
                    xtype: 'buttongroup'
                },{
                    id : ideTbDetails, 
                    xtype: 'buttongroup'
                },{
                    id : ideTbViews, 
                    xtype: 'buttongroup'
                }]
            });

        function toogleTb2( but  ) {

            if ( but.idTb2 != ideTbOrder ) {
                Ext.each(tbar2.query('buttongroup'), function(button) {
                    button.hide();
                }, this);
                
                var tb2 = Ext.getCmp(but.idTb2);
                tb2.show();
                
                orderTbar.hide();
                tbar2.show();
                
            } else {
                orderTbar.show();
                tbar2.hide();
            }             
        } 

        //--------------------------------------------------------

        // Asigna una referencia al objeto 
        var myMeta = this.protoMeta; 
        var __MasterDetail = this.objMasterDet; 



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
            emptyText: 'dans ...',
            selectOnFocus: true,
            typeAhead: true
        });


        // combo - operation 
        opStore = new Ext.data.ArrayStore({ 
        	fields: ['code', 'operation'], 
        	data: _ComboFilterOp 
    	}); 
        
        var comboOp = new Ext.form.ComboBox({
            emptyText: _ComboFilterOp[1][1] ,
            store: opStore,
            width: 150,
            mode: 'local',
            triggerAction: 'all',  
            displayField: 'operation',
            valueField: 'code',
            forceSelection: true,
            editable: false
        });

        // Load Data button 
        var searchBtn = new Ext.button.Split({
            text: 'Rechercher',
            handler: onClickLoadData,
            iconCls: 'icon-search',
            menu: {
                items: [{
                    text: '<b>Clear filter<b>',
                    handler: onClickClearFilter 
                // }, {
                    // text: 'add filter',
                    // handler: __MasterDetail.onClickFilter
                }]
            }
        });

        // Criteria 
        var searchCr = new Ext.form.TextField({
            emptyText: 'mots-clés recherchés ..',
            enableKeyEvents : true,  
            width: 200, 
            listeners: {
                keydown: function( me, e ) { 
                    if (e.getKey() == e.ENTER ) {
                        onClickLoadData ( searchBtn  )
                       }
                }}
        });

        

        var tbSearch = Ext.getCmp( ideTbSearch );
        tbSearch.add( [
            searchBtn,    
            searchCr,
            comboOp,
            comboCols
            ] );

        // Inicializa Combos 
        clearCombos();     

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
                text: '<b>Ordonner par :</b>',
                reorderable: false 
                }],  
            plugins: [reorderer],
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
            }
        } 

//      Boton no sort         
//        var ideBtNoSort = Ext.id();
//        orderTbar.add({
//            xtype: 'tbtext',
//            id : ideBtNoSort, 
//            text: '<b>No Sort:</b>',
//            iconCls : 'stop', 
//            reorderable: true,
//            handler: doSort()
//        });
        
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
                tbar1,  orderTbar, tbar2 
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
            }
            
            return colData ; 
        }; 

//      -------------------------------------------------------------------------------
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
            
            __MasterDetail.onClickLoadData(sFilter);
    
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

//            // tiene en cuenta la posicion de: ideBtNoSort
//            var ixBt = -1;  
//            for (var ix in orderTbar.items.items) {
//                if ( orderTbar.items.items[ix].id  ==  ideBtNoSort ) { break; }
//                ixBt ++;  
//            }
//            if ( ixBt <= 0 ) { return sorters  };  
            
            Ext.each(orderTbar.query('button'), function(button) {
                sorters.push(button.sortData);
            }, this);

//            return sorters.slice(0, ixBt );
            return sorters
        }
        // doSort();

// ------------------------------------------------------------------------------------------------

        var tbViews = Ext.getCmp( ideTbViews )
        tbViews.add({
            xtype: 'tbtext',
            iconCls : 'icon-views', 
            text: '<b>Group de colonnes :<b>'
            // },{  xtype: 'menuseparator'
        });

        function configureProtoViews(){

            var bHide = true; 
            var pViews = myMeta.protoViews;
            for (var vDet in pViews) {         
                tbViews.add({
                    text:       pViews[vDet].viewName,
                    iconCls :   pViews[vDet].icon, 
                    protoView:  pViews[vDet].viewFields,
                    handler:    onClickChangeView
                });
                bHide = false; 
            }
            
            if ( bHide) {
                var btViews = Ext.getCmp( ideBtViews );
                btViews.hidden = true
            }
        }
    
        configureProtoViews(); 

        function onClickChangeView( btn ){

              __MasterDetail.protoMasterGrid.configureColumns(btn.protoView);
            
        }


// ------------------------------------------------------------------------------------------------


        var tbPrint = Ext.getCmp( ideTbPrint )
        tbPrint.add({
            xtype   : 'tbtext',
            text: '<b>Imprimer :<b>'
        }, {
            iconCls : 'icon-printGrid', 
            text:       'Grille',
            handler:    onClickPrintGrid
        }); 

        if ( __MasterDetail.protoMasterGrid.IdeSheet != undefined ) {
            tbPrint.add({
                iconCls : 'icon-printSheet', 
                text:       'Fiche',
                handler:    onClickPrintSheet
                }
            );
        };

        function onClickPrintGrid( btn ){
    
            var prn = ProtoUL.ux.Printer
            prn.gridPrint( __MasterDetail.protoMasterGrid._extGrid )
            
        };

        function onClickPrintSheet( btn ){
    
            var prn = ProtoUL.ux.Printer ;
            var pGrid = __MasterDetail.protoMasterGrid ;
            prn.sheetPrint( pGrid._extGrid, pGrid.sheetHtml  )
            
        }

// ------------------------------------------------------------------------------------------------

        // Menu Detail 
        var menuDetail = Ext.getCmp( ideTbDetails );
        menuDetail.add({
            xtype   : 'tbtext',
            iconCls : 'icon-details', 
            text: '<b>Détails :<b>'
        });
        
        function configureMenuDetail(  ){
            
            var pDetails = myMeta.protoDetails;
            var ixTabC = 0;                     // Agrega un numero secuencia para marcar los tabs
            var bDetails = false;               // Indica si tiene o no detalles
            for (var vDet in pDetails) {        // Recorre y agrega los detalles al menu 
                // console.log( pDetails[vTab] + " ");

                // TODO: Undefined 
                if (pDetails[vDet].menuText === undefined ) {
                    continue; 
                } 

                if (pDetails[vDet].menuText == '-') { 
                    var item = menuDetail.add({ xtype: 'menuseparator' });
                    continue;
                }
                
                var item = menuDetail.add({
                    text: pDetails[vDet].menuText,
                    detail: pDetails[vDet].conceptDetail,
                    detailField: pDetails[vDet].detailField,
                    masterField: pDetails[vDet].masterField,
                    ixTab: ixTabC
                });
                
                // Agrego el handler q activara el tab a partir del menu
                // item.on('click', onMenuSelectDetail);
                bDetails = true;
                item.on({
                    click: { fn: __MasterDetail.onMenuSelectDetail,scope: __MasterDetail  }
                });                 
                ixTabC += 1;
            };

            if ( ! bDetails) {
                var btAux = Ext.getCmp( ideBtDetails );
                btAux.hidden = true
            }

    
        };
        
        configureMenuDetail(); 


// ------------------------------------------------------------------------------------------------


        var tbFilter = Ext.getCmp( ideTbFilter )
        tbFilter.add({
            xtype: 'tbtext',
            iconCls : 'icon-filter', 
            text: '<b>Filtrer par :<b>'
            // },{  xtype: 'menuseparator'
        });

        function configureProtoFilter(){

            var bHide = true; 
            var pFilters = myMeta.protoFilters;
            for (var vDet in pFilters) {         
                tbFilter.add({
                    text:           pFilters[vDet].filterName,
                    iconCls :       pFilters[vDet].icon, 
                    protoFilter:    Ext.encode( pFilters[vDet].filter ),
                    handler: onClickProtoFilter
                }); 
                
                bHide = false;
            };

            if ( bHide) {
                var btAux = Ext.getCmp( ideBtFilter );
                btAux.hidden = true
            }
            
        };
        
        function onClickProtoFilter( btn ){
              
              __MasterDetail.onClickLoadData (btn.protoFilter);

        }
              
        configureProtoFilter(); 


    } 

}); 