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
        var ideTbViews = Ext.id();
        var ideTbPrint = Ext.id();
        var ideTbEdit = Ext.id();
        var ideTbConfig = Ext.id();

        // Id en la Barra principal 
        var ideBtConfig = Ext.id();


        //--------------------------------------------------------


        this.tbar1 = Ext.create('Ext.Toolbar', {
            dock: 'top',
            defaults: { scale: 'medium' }, 
            items: [{
                pressed: true,
                tooltip: 'Filtrer',
                iconCls: 'icon-search24',
                idTb2  : ideTbSearch, 

                enableToggle: true,
                toggleGroup: 'tb1' , 
                handler: toogleTb2 
            },'-',{
                
                // La edicion se hara sobre el master si los detalles estan apagados, 
                // si los detalles estan abiertos,  se bloqua el master y se editan detalles 
                
                tooltip: 'Editer',
                iconCls: 'icon-edit24',
                idTb2  : ideTbEdit, 

                enableToggle: true,
                toggleGroup: 'tb1' , 
                handler: toogleTb2 

                
            },{
                tooltip: 'Classer',
                iconCls: 'icon-order24',
                itemId : 'sorters', 
                hidden : true,
                enableToggle: true,
                handler: toogleTb2 

            },{
                xtype: 'splitbutton', 
                tooltip: 'Imprimer',
                iconCls: 'icon-print24',
                itemId : 'printerOpts', 
                hidden : true,
                enableToggle: true,
                handler: toogleTb2,  
                menu :  Ext.create( 'Ext.menu.Menu', {}) 

            }, {
                xtype: 'splitbutton', 
                tooltip: 'Voir détails',
                iconCls: 'icon-details24', 
                itemId : 'details', 
                hidden : true,
                enableToggle: true,
                handler: toogleTb2,  
                menu :  Ext.create( 'Ext.menu.Menu', {}) 

            },'->',{
                xtype: 'splitbutton', 
                tooltip: 'Favorites',
                iconCls: 'icon-star24',
                itemId : 'favorites', 
                hidden : true,
                enableToggle: true,
                handler: toogleTb2,  
                menu :  Ext.create( 'Ext.menu.Menu', {}) 
            }, {
                // text: 'Aide',
                iconCls: 'icon-help24',
                handler: tbHelp,  
                itemId : 'tbHelp'
            },{
                // text : 'Config',
                xtype: 'splitbutton', 
                menu :  this.configCtrl.getActions(),
                iconCls: 'icon-config24',
                id     : ideBtConfig 
                // handler: toogleTb2 
            }]
        
        });
        
        //--------------------------------------------------------
        
        var searchBG = Ext.create('ProtoUL.ux.ProtoSearchBG', {
                    id    : ideTbSearch , 
                    myMeta: myMeta
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

            if ( but.itemId == 'sorters' ) {
                if ( __MasterDetail.tbSorters ) {
                    __MasterDetail.tbSorters.setVisible( but.pressed  )
                }

            } else if ( but.itemId == 'favorites' ) {
                if ( __MasterDetail.tbFilters ) {
                    __MasterDetail.tbFilters.setVisible( but.pressed  )
                }

            } else if ( but.itemId == 'printerOpts' ) {
                if ( __MasterDetail.tbPrinterOpts ) {
                    __MasterDetail.tbPrinterOpts.setVisible( but.pressed  )
                }


            } else if ( but.itemId == 'details' ) {
                if ( __MasterDetail.tbDetails ) {
                    __MasterDetail.showDetailPanel( ! but.pressed )
                }
                
            } else if ( but.idTb2 == ideTbEdit ) {
                // Entra en modo edicion 
                me.toggleEditMode( true )
                editTBar.show();
                // orderTbar.hide();
                tbar2.hide();
                
            } else {
                Ext.each(tbar2.query('buttongroup'), function(buttonGr) {
                    buttonGr.hide();
                }, this);
                
                var tb2 = Ext.getCmp(but.idTb2);
                tb2.show();
                tbar2.show();
                editTBar.hide();
                // orderTbar.hide();
            }             
        } 






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

            var formController = Ext.create('ProtoUL.UI.FormController', { myMeta: myMeta}); 
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
                // this.tbar1,  orderTbar, editTBar, tbar2 
                this.tbar1,  editTBar, tbar2 
            ]
        });
        // panel.add(tool1);  ...
        
        this.callParent();


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
            
            // if ( bHide) {
                // var btViews = Ext.getCmp( ideBtViews );
                // btViews.hidden = true
            // }
        }
    
        configurelistDisplaySet(); 

        function onClickChangeView( btn ){

              __MasterDetail.protoMasterGrid.configureColumns(btn.protoView);
            
        }

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
            var bt = this.tbar1.getComponent('favorites')
            bt.menu.add(  this.__MasterDetail.myFilters )
            bt.show()            
        }

        if ( this.__MasterDetail.myPrinterOpts ) {
            var bt = this.tbar1.getComponent('printerOpts')
            bt.menu.add(  this.__MasterDetail.myPrinterOpts )
            bt.show()            
        }

        if ( this.__MasterDetail.tbSorters ) {
            var bt = this.tbar1.getComponent('sorters')
            bt.show()            
        }
        
    }
  

}); 