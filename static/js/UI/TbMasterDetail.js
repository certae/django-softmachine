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
        me.editable = false; 

        // Asigna una referencia al objeto 
        var myMeta = this.protoMeta; 
        var __MasterDetail = this.__MasterDetail; 

        // Barras internas 
        var ideTbSearch = Ext.id();
        var ideTbOrder = Ext.id();
        var ideTbViews = Ext.id();
        var ideTbPrint = Ext.id();
        var ideTbEdit = Ext.id();
        var ideTbConfig = Ext.id();

        // Id en la Barra principal 
        // var ideBtOrder = Ext.id();
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


        this.tbar1 = Ext.create('Ext.Toolbar', {
            dock: 'top',
            defaults: { scale: 'medium' }, 
            items: [{
                pressed: true,
                text: 'Rechercher',
                iconCls: 'icon-search24',
                idTb2  : ideTbSearch, 

                enableToggle: true,
                toggleGroup: 'tb1' , 
                handler: toogleTb2 
            },'-',{
                text: 'Classer',
                iconCls: 'icon-order24',
                idTb2  : ideTbOrder, 

                enableToggle: true,
                toggleGroup: 'tb1' , 
                handler: toogleTb2 

            },'-',{
                text: 'Editer',
                iconCls: 'icon-edit24',
                idTb2  : ideTbEdit, 

                enableToggle: true,
                toggleGroup: 'tb1' , 
                handler: toogleTb2 

            },'-',{
                text: 'Group de colonnes',
                iconCls: 'icon-views24',
                idTb2  : ideTbViews,
                id     : ideBtViews, 

                enableToggle: true,
                toggleGroup: 'tb1' , 
                handler: toogleTb2 
                
            },'-',{
                text: 'Imprimer',
                iconCls: 'icon-print24',
                idTb2  : ideTbPrint, 
                
                enableToggle: true,
                toggleGroup: 'tb1' , 
                handler: toogleTb2 
                
            },'-',{
                xtype: 'splitbutton', 
                text: 'Filtrer',
                iconCls: 'icon-filter24',
                hidden : true,
                itemId : 'filters', 
                menu :  Ext.create( 'Ext.menu.Menu', {}) 

            },'-',{
                xtype: 'splitbutton', 
                text: 'Voir détails',
                iconCls: 'icon-details24', 
                hidden : true,
                itemId : 'details', 
                menu :  Ext.create( 'Ext.menu.Menu', {}) 

            },'-',{
                text: 'Config',
                iconCls: 'icon-config24',
                idTb2  : ideTbConfig,
                id     : ideBtConfig, 

                enableToggle: true,
                toggleGroup: 'tb1' , 
                handler: toogleTb2 
            },'->',{
                text: 'Aide',
                iconCls: 'icon-help24',
                handler: tbHelp,  
                itemId : 'tbHelp'
            }]
        
        });
        
        //--------------------------------------------------------
        
        var searchBG = Ext.create('ProtoUL.ux.ProtoSearchBG', {
                    id          : ideTbSearch , 
                    protoMeta: myMeta
                   })
        
        // LA barra q contiene los grupos 
        var tbar2 = Ext.create('Ext.Toolbar', {
            dock: 'top',
            defaults: { scale: 'small', hidden : true },
            items: [ 
                searchBG, {
                    id : ideTbEdit, 
                    xtype: 'buttongroup'
                },{
                    id : ideTbPrint, 
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
        	window.open( __HELPpath ,'protoHelp',
        	'left=50,top=20,width=1000,height=600,resizable=0')
        	
        }
       

        function toogleTb2( but  ) {

            if ( but.idTb2 == ideTbOrder ) {
                orderTbar.show();
                editTBar.hide();
                tbar2.hide();
                
            } else if ( but.idTb2 == ideTbEdit ) {
                // Entra en modo edicion 
                me.toggleEditMode( true )
                                
                editTBar.show();
                orderTbar.hide();
                tbar2.hide();
                
            } else {
                Ext.each(tbar2.query('buttongroup'), function(buttonGr) {
                    buttonGr.hide();
                }, this);
                
                var tb2 = Ext.getCmp(but.idTb2);
                tb2.show();
                tbar2.show();
                editTBar.hide();
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


        var editTBar = Ext.create('Ext.toolbar.Toolbar', {
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
                hidden:     this.editable  
            }, {
                iconCls : 'icon-tableSave', 
                itemId:     'save',
                text:       'Save',
                handler:    onClickTableSave,
                hidden:     ! this.editable  
            }, {
                iconCls : 'icon-tableAdd', 
                itemId:     'add',
                text:       'Add',
                handler:    onClickTableAdd,
                disabled:     ! this.editable  
            }, {
                iconCls : 'icon-tableDuplicate', 
                itemId:     'copy',
                text:       'Duplicate',
                handler:    onClickTableDuplicate,
                disabled:     ! this.editable  
            }, {
                iconCls : 'icon-tableDelete', 
                itemId:     'delete',
                text:       'Delete',
                handler:    onClickTableDelete,
                disabled:     ! this.editable  
            },  { 
                iconCls : 'icon-tableCancel', 
                itemId:     'cancel',
                text:       'Cancel',
                scope:        this,
                handler:    onClickTableCancelEdit,
                disabled:     ! this.editable  
            }, '|',  {
                xtype   : 'tbtext',
                text: '<b>Form :<b>'
            }, {
                iconCls : 'icon-formAdd', 
                text:       'Add',
                tooltip:     'Form Add Record',
                handler:    onClickFormAdd
            }, {
                iconCls : 'icon-formEdit', 
                text:       'Edit',
                tooltip:     'Form Edit  Record',
                handler:    onClickFormEdit
            }, {
                iconCls : 'icon-formView', 
                text:       'View',
                tooltip:     'Form View Read Only Mode',
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
                disabled:     ! (this.editable )  
            }],  
            hidden : true
        });

        this.editTBar = editTBar; 

        function onClickTableAutoSync( btn, pressed ){

            this.autoSync = pressed ;             
            btn.ownerCt.getComponent('save').setDisabled(  this.autoSync  );
            
            if ( pressed ) __MasterDetail.protoMasterGrid.saveChanges()
            __MasterDetail.protoMasterGrid.store.autoSync = pressed;
            
        }; 


//  --------------------------------------------------------------------------

        function initFormController(){

            var formController = Ext.create('ProtoUL.UI.FormControler', { myMeta: myMeta}); 
            // formController.myMeta = myMeta 
            
            return formController

        }

        function onClickFormAdd( btn ){
            onClickTableAdd()
            onClickFormEdit()
            // var formController = initFormController()
            // formController.openLinkedForm ()
        }; 
        
        function onClickFormEdit( btn ){
            var formController = initFormController()
            if ( validaSelected( __MasterDetail.protoMasterGrid.selected )) {
                 formController.openLinkedForm ( __MasterDetail.protoMasterGrid.selected    )
            } 
                
        }; 

        function onClickFormView( btn ){
            var formController = initFormController()
            if ( validaSelected( __MasterDetail.protoMasterGrid.selected )) {
                 formController.openLinkedForm ( __MasterDetail.protoMasterGrid.selected , true   )
            } 
        }; 

        function validaSelected( myReg )  {
            
            if ( myReg ) {
                return true 
            } else {
                errorMessage( 'Form', 'No record selected')
                return false 
            }
            
        }

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
                this.tbar1,  orderTbar, editTBar, tbar2 
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
                    protoView:  myDefaultCols ,
                    handler:    onClickChangeView
                });
            }
            
            var pViews = myMeta.gridConfig.listDisplaySet;
            for (var vDet in pViews) {         
                tbViews.add({
                    text:       vDet ,
                    protoView:  pViews[vDet] ,
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
        }, {
            iconCls : 'icon-configDetails', 
            text:       'Details',
            handler:    onClickConfigDetails
        }, {
            iconCls : 'icon-configReset', 
            text:       'Reset',
            handler:    onClickConfigReset 
        }); 


        function onClickConfigMeta( btn ){
    
              __MasterDetail.protoMasterGrid.showMetaConfig();
            
        };

        function onClickConfigForm( btn ){

              __MasterDetail.protoMasterGrid.showProtoDesigner();
    
        };

        function onClickConfigFields( btn ){

              __MasterDetail.protoMasterGrid.showFieldTree();
              
        }; 
        
        function onClickConfigDetails( btn ){

              __MasterDetail.protoMasterGrid.showDetailsTree();
              
    
        }
        
        function onClickConfigReset( btn ){

            // TODO: La verificacion se hace contra la creacion de modelos, verificar esto. 
            _cllPCI = [];
    
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


      }, 

    toggleEditMode: function ( forceEdit, tbOnly ) {
        // tbOnly : is internal event fired from grid 
        
        if ( forceEdit ) this.editable = forceEdit;  
        else this.editable = ! this.editable ;             
        
        if ( (!tbOnly ) && ( this.__MasterDetail ))  {
            this.__MasterDetail.protoMasterGrid.setEditMode( this.editable )
        } 
        
        if ( this.editTBar ) {

            this.editTBar.getComponent('edit').setVisible ( ! this.editable );
            this.editTBar.getComponent('save').setVisible( this.editable  );

//            this.editTBar.getComponent('cancel').setVisible( this.editable ); 
            this.editTBar.getComponent('save').setDisabled( this.autoSync || (!this.editable ));

            this.editTBar.getComponent('add').setDisabled ( ! this.editable );
            this.editTBar.getComponent('copy').setDisabled ( ! this.editable );
            this.editTBar.getComponent('delete').setDisabled ( ! this.editable );
            this.editTBar.getComponent('cancel').setDisabled ( ! this.editable );
            
            this.editTBar.getComponent('autoSync').setDisabled( ! this.editable );
        }; 
        
    }, 
    
    
    addActions:  function () {
     
        if ( this.__MasterDetail.myDetails ) {

            var bt = this.tbar1.getComponent('details')
            bt.menu.add(  this.__MasterDetail.myDetails )
            bt.show()            
        }

        if ( this.__MasterDetail.myFilters ) {

            var bt = this.tbar1.getComponent('filters')
            bt.menu.add(  this.__MasterDetail.myFilters )
            bt.show()            
            
        }
        
    }
  

}); 