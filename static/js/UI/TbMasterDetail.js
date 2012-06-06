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

    initComponent: function() {

        var me = this; 

        me.autoSync = false; 
        me.editMode = false; 

        // Asigna una referencia al objeto 
        var myMeta = this.protoMeta; 
        var __MasterDetail = this.__MasterDetail; 

        // Barras internas 
        var ideTbSearch = Ext.id();
        var ideTbDetails = Ext.id();
        var ideTbOrder = Ext.id();
        var ideTbFilter = Ext.id();
        var ideTbViews = Ext.id();
        var ideTbPrint = Ext.id();
        var ideTbEdit = Ext.id();
        var ideTbConfig = Ext.id();

        // Id en la Barra principal 
        // var ideBtOrder = Ext.id();
        var ideBtDetails = Ext.id();
        var ideBtFilter = Ext.id();
        var ideBtViews = Ext.id();
        var ideBtConfig = Ext.id();

        // Reorder obj 
        var reorderer = Ext.create('Ext.ux.BoxReorderer', {
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
                text: 'Classer',
                iconCls: 'icon-order24',
                idTb2  : ideTbOrder, 
                // id     : ideBtOrder 
            },'-',{
                text: 'Filtrer',
                iconCls: 'icon-filter24',
                idTb2  : ideTbFilter, 
                id     : ideBtFilter 
            },'-',{
                text: 'Editer',
                iconCls: 'icon-edit24',
                idTb2  : ideTbEdit
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
            },'-',{
                text: 'Config',
                iconCls: 'icon-config24',
                idTb2  : ideTbConfig,
                id     : ideBtConfig
            },'->',{
                text: 'Aide',
                iconCls: 'icon-help24',
                toggleGroup: 'tb2' , 
                handler: tbHelp,  
                itemId : 'tbHelp'
            }]
        
        });
        
        //--------------------------------------------------------
        
        var searchBG = Ext.create('ProtoUL.ux.ProtoSearchBG', {
                    id          : ideTbSearch , 
                    protoMeta: myMeta
                   })
        
        var tbar2 = Ext.create('Ext.Toolbar', {
            dock: 'top',
            defaults: { scale: 'small', hidden : true },
            items: [ 
                searchBG, {
                    id : ideTbFilter, 
                    xtype: 'buttongroup'
                },{
                    id : ideTbEdit, 
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
                },{
                    id : ideTbConfig, 
                    xtype: 'buttongroup'
                }]
            });

        searchBG.on({
            loadData: {fn: function ( searchBG , sFilter, sTitle ) {
                
                __MasterDetail.onClickLoadData(sFilter);
    
                __MasterDetail.protoMasterGrid.protoLocalFilter = sTitle; 
                __MasterDetail.protoMasterGrid.setGridTitle( __MasterDetail.protoMasterGrid ) 
                
                }, scope: this }
        });                 
            
        // -----------------------------------------------------------
        

        function tbHelp( but  ) {
        	window.open( _HELPURL ,'protoHelp',
        	'left=50,top=20,width=1000,height=600,resizable=0')
        	
        }
       

        function toogleTb2( but  ) {

            if ( but.idTb2 == ideTbOrder ) {
                orderTbar.show();
                configTbar.hide();
                tbar2.hide();
                
            } else if ( but.idTb2 == ideTbEdit ) {
                // Entra en modo edicion 
                me.toggleEditMode( true )
                                
                configTbar.show();
                orderTbar.hide();
                tbar2.hide();
                
            } else {
                Ext.each(tbar2.query('buttongroup'), function(buttonGr) {
                    buttonGr.hide();
                }, this);
                
                var tb2 = Ext.getCmp(but.idTb2);
                tb2.show();
                tbar2.show();
                configTbar.hide();
                orderTbar.hide();
            }             
        } 




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
            padding: '5 5 5 5',
            items  : [{
                iconCls : 'sort', 
                xtype: 'tbtext',
                text: '<b>Classer par :</b>',
                reorderable: false 
                }],  
            plugins: [reorderer],
            hidden : true
        });

        function configureOrderTab (  ){
            for (var i = 0, len = myMeta.fields.length; i < len; i++) {
                var c = myMeta.fields[i];
                if ( c.name in oc( myMeta.gridConfig.sortFields)  ) { 

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


// ------------------------------------------------------------------------------------------------


        var configTbar = Ext.create('Ext.toolbar.Toolbar', {
            id : ideTbEdit, 
               // margins:'5 5 5 5',
            padding: '5 5 5 5',
            items  : [{
                xtype   : 'tbtext',
                text: '<b>Table Edit:<b>'
            }, {
                iconCls : 'icon-tableEdit', 
                itemId:     'edit',
                text:       'Edit',
                scope:        this,
                handler:    toggleEditMode,
                hidden:     this.editMode  
            }, {
                iconCls : 'icon-tableSave', 
                itemId:     'save',
                text:       'Save',
                handler:    onClickTableSave,
                hidden:     ! this.editMode  
            }, {
                iconCls : 'icon-tableAdd', 
                itemId:     'add',
                text:       'Add',
                handler:    onClickTableAdd,
                disabled:     ! this.editMode  
            }, {
                iconCls : 'icon-tableDuplicate', 
                itemId:     'copy',
                text:       'Duplicate',
                handler:    onClickTableDuplicate,
                disabled:     ! this.editMode  
            }, {
                iconCls : 'icon-tableDelete', 
                itemId:     'delete',
                text:       'Delete',
                handler:    onClickTableDelete,
                disabled:     ! this.editMode  
            },  { 
                iconCls : 'icon-tableCancel', 
                itemId:     'cancel',
                text:       'Cancel',
                scope:        this,
                handler:    onClickTableCancelEdit,
                disabled:     ! this.editMode  
            }, '|',  {
                xtype   : 'tbtext',
                text: '<b>Form :<b>'
            }, {
                iconCls : 'icon-formAdd', 
                text:       'Add',
                toolBar:     'Form Add Record',
                handler:    onClickFormAdd
            }, {
                iconCls : 'icon-formEdit', 
                text:       'Edit',
                toolBar:     'Form Edit  Record',
                handler:    onClickFormEdit
            }, {
                iconCls : 'icon-formView', 
                text:       'View',
                toolBar:     'Form View Read Only Mode',
                handler:    onClickFormView
            }, {
                xtype: 'tbfill',                   //  ----------------------------------------------------
               }, { 
                iconCls : 'icon-tableAutoSync', 
                itemId:     'autoSync',
                text:       'AutoSync',
                enableToggle: true, 
                pressed:    this.autoSync,   
                scope:        this,
                toggleHandler: onClickTableAutoSync,
                disabled:     ! (this.editMode )  
            }],  
            hidden : true
        });

        this.configTbar = configTbar; 

        function onClickTableAutoSync( btn, pressed ){

            this.autoSync = pressed ;             
            btn.ownerCt.getComponent('save').setDisabled(  this.autoSync  );
            
            if ( pressed ) __MasterDetail.protoMasterGrid.saveChanges()
            __MasterDetail.protoMasterGrid.store.autoSync = pressed;
            
        }; 


//  --------------------------------------------------------------------------

        function initFormController(){

            var formController = Ext.create('ProtoUL.UI.FormControler', {
                myMeta : myMeta  
            });
            
            return formController

        }

        function onClickFormAdd( btn ){
            var formController = initFormController()
            formController.newEditionForm ()
        }; 
        
        function onClickFormEdit( btn ){
            var formController = initFormController()
            formController.newEditionForm ( __MasterDetail.protoMasterGrid.selected )
        }; 

        function onClickFormView( btn ){
            var formController = initFormController()
            formController.newEditionForm ( __MasterDetail.protoMasterGrid.selected, true  )
        }; 

//  --------------------------------------------------------------------------

        function toggleEditMode( forceEdit ){
            this.toggleEditMode( forceEdit )
        }

        
        function onClickTableAdd( btn ){
            if ( __MasterDetail )  {
                __MasterDetail.protoMasterGrid.addNewRecord()
            } 
        }; 
        
        function onClickTableDelete( btn ){
            if ( __MasterDetail )  {
                __MasterDetail.protoMasterGrid.deleteCurrentRecord()
            } 
        }; 

        function onClickTableDuplicate( btn ){
            if ( __MasterDetail )  {
                __MasterDetail.protoMasterGrid.duplicateRecord()
            } 
        }; 

        function onClickTableSave( btn ){
            if ( __MasterDetail )  {
                __MasterDetail.protoMasterGrid.saveChanges()
            } 
        }; 

        function onClickTableCancelEdit( btn ){
            if ( __MasterDetail )  {
                __MasterDetail.protoMasterGrid.cancelChanges()
            } 
        }; 

// ----------------------------------------------------------------------------------

        Ext.apply(this, {
            layout: {
                type: 'vbox',
                border: false, 
                align: 'stretchmax'
            },
            dockedItems: [
                tbar1,  orderTbar, configTbar, tbar2 
            ]
        });
        // panel.add(tool1);  ...
        
        this.callParent();



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

        function configurelistDisplaySet(){

            var bHide = true; 

            // Agrega la vista por defecto 
            var myDefaultCols = myMeta.gridConfig.listDisplay;
            if ( myDefaultCols.length > 0 ) {
                tbViews.add({
                    text:       _defaultViewText,
                    iconCls :   _defaultViewIcon, 
                    protoView:  myDefaultCols ,
                    handler:    onClickChangeView
                });
            }
            
            var pViews = myMeta.gridConfig.listDisplaySet;
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
    
        configurelistDisplaySet(); 

        function onClickChangeView( btn ){

              __MasterDetail.protoMasterGrid.configureColumns(btn.protoView);
            
        }

// ------------------------------------------------------------------------------------------------

        var tbConfig = Ext.getCmp( ideTbConfig )
        tbConfig.add({
            xtype: 'tbtext',
            iconCls : 'icon-config', 
            text: '<b>Config :<b>'
        }, {
            iconCls : 'icon-configMeta', 
            text:       'Meta',
            handler:    onClickConfigMeta
        }, {
            iconCls : 'icon-configForm', 
            text:       'Form',
            handler:    onClickConfigForm
        }, {
            iconCls : 'icon-configFields', 
            text:       'Fields',
            handler:    onClickConfigFields
        }); 


        function onClickConfigMeta( btn ){
    
              __MasterDetail.protoMasterGrid.showMetaConfig();
            
        };

        function onClickConfigForm( btn ){

              __MasterDetail.protoMasterGrid.showProtoDesigner();
    
        };

        function onClickConfigFields( btn ){

              __MasterDetail.protoMasterGrid.showFieldTree();
              
    
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
            text: '<b>Détails :<b>'
        });
        
        function configureMenuDetail(){
            
            var pDetails = myMeta.protoDetails;
            var detailCount = 0;                     // Agrega un numero secuencia para marcar los tabs
            var bDetails = false;               // Indica si tiene o no detalles
            for (var vDet in pDetails) {        // Recorre y agrega los detalles al menu 

                // console.log( pDetails[vTab] + " ");
                if (pDetails[vDet].menuText === undefined ) {
                    continue; 
                } 

                if (pDetails[vDet].menuText == '-') { 
                    var item = menuDetail.add({ xtype: 'menuseparator' });
                    continue;
                }
                
                var item = menuDetail.add({
                    text: pDetails[vDet].menuText,
                    detailKey: pDetails[vDet].conceptDetail,
                    detailField: pDetails[vDet].detailField,
                    masterField: pDetails[vDet].masterField,
                    
                    detailTitleLbl: pDetails[vDet].detailTitleLbl,
                    detailTitlePattern: pDetails[vDet].detailTitlePattern,
                    ixDetail: detailCount
                });
                
                // Agrego el handler q activara el tab a partir del menu
                bDetails = true;
                item.on({
                    click: { fn: __MasterDetail.onTbSelectDetail,scope: __MasterDetail  }
                });                 
                detailCount += 1;
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
            var pFilters = myMeta.gridConfig.filtersSet;
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
              
            __MasterDetail.protoMasterGrid.protoLocalFilter = ' " ' +  btn.text + ' "'; 
            __MasterDetail.protoMasterGrid.setGridTitle( __MasterDetail.protoMasterGrid ) 

            __MasterDetail.onClickLoadData( btn.protoFilter );
    

        }
              
        configureProtoFilter(); 


      }, 

    toggleEditMode: function ( forceEdit, tbOnly ) {
        // tbOnly : is internal event fired from grid 
        
        if ( forceEdit ) this.editMode = forceEdit;  
        else this.editMode = ! this.editMode ;             
        
        if ( (!tbOnly ) && ( this.__MasterDetail ))  {
            this.__MasterDetail.protoMasterGrid.setEditMode( this.editMode )
        } 
        
        if ( this.configTbar ) {

            this.configTbar.getComponent('edit').setVisible ( ! this.editMode );
            this.configTbar.getComponent('save').setVisible( this.editMode  );

//            this.configTbar.getComponent('cancel').setVisible( this.editMode ); 
            this.configTbar.getComponent('save').setDisabled( this.autoSync || (!this.editMode ));

            this.configTbar.getComponent('add').setDisabled ( ! this.editMode );
            this.configTbar.getComponent('copy').setDisabled ( ! this.editMode );
            this.configTbar.getComponent('delete').setDisabled ( ! this.editMode );
            this.configTbar.getComponent('cancel').setDisabled ( ! this.editMode );
            
            this.configTbar.getComponent('autoSync').setDisabled( ! this.editMode );
        }; 
        
    }
  

}); 