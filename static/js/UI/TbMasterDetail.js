/*
 * 
 */
Ext.define('ProtoUL.UI.TbMasterDetail', {
    extend: 'Ext.Toolbar',
    alias: 'widget.tbMasterDetail',

    initComponent: function() {


        // Asigna una referencia al objeto 
        var myMeta = this.protoMeta; 
        var __MasterDetail = this.objMasterDet; 


        // Menu Detail 
        var menuDetail = new Ext.menu.Menu();
        var menuPromDetail = Ext.id();
        menuDetail.add({
            text: '<b>Promote Detail<b>',
            id: menuPromDetail,
            disabled: true,
            handler:  onMenuPromoteDetail,
        },{
            xtype: 'menuseparator'
        });
        configureMenuDetail( ); 



        // Combo Columnas  
        var colStore = new Ext.data.ArrayStore({
            fields: ['colPhysique', 'colName'],
            data: configureComboColumns( ),
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
            width: 135
        })

        // Load Data button 
        var searchBtn = new Ext.button.Split({
            text: 'Load data',
            handler: onClickLoadData,
            // iconCls: 'blist',
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
        
        tbItems = [{
            text: 'Details',
            // iconCls: 'bmenu',    // <-- icon
            menu: menuDetail        // assign menu by instance
            }, 
            '->',
            comboCols,
            comboOp,
            searchCr,
            searchBtn    
            ];

        // Inicializa Combos 
        clearCombos()     
        
        // Objetos internos 
        this.items = tbItems;      
        this.callParent();

        function configureComboColumns ( tb ){
        
                // Columnas para el Query del tipo :  newColData = [['idx', 'Id Reg'],['code', 'Code Reg']];
            var colData = [];
            j = 0;
            for (var i = 0, len = myMeta.fields.length; i < len; i++) {
                var c = myMeta.fields[i];
    
                if (c.allowFilter == undefined) {
                    c.allowFilter = 1
                };
    
                if (c.queryCode == undefined) { 
                    c.queryCode =  c.name; 
                };
                
                if (c.allowFilter == 1) {
                    colData[j] = [c.queryCode, c.header];
                    j += 1;
    
                    // DGT: esta carga es directa al store, pienso q es mas costosa por q interactua cada vez con extjs
                    // colStore.add(new colStore.recordType({ colPhysique: c.name, colName: c.header }));
                }
            };
            
            return colData ; 
        }; 

        function configureMenuDetail(  ){
            
           // Configuracion de detalles    ------------------------------------------------------------------------ 
            var pDetails = myMeta.protoDetails;
    
            // Agrega un numero secuencia para marcar los tabs 
            var ixTabC = 0
            
            // Indica si tiene o no detalles 
            var bDetails = false;

            // Recorre y agrega los detalles al menu 
            for (var vDet in pDetails) {
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
        
            if ((comboCols.getValue() == '') && (comboOp.getValue() == '') && (searchCr.getValue() == '' )) {
                sFilter = '';
            } else if ((comboCols.getValue() == '') || (comboOp.getValue() == '') || (searchCr.getValue() == '' )) {
                Ext.Msg.alert('Status', 'Invalid criteria');
                return; 
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

        // function onMenuSelectDetail (item) {
            // __MasterDetail.onMenuSelectDetail( item  );
        // }

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




    }, 
    

}); 