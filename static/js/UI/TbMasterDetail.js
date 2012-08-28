/*
 * 
 */

// Ext.Loader.setConfig({enabled: true});


Ext.define('ProtoUL.UI.TbMasterDetail', {
    extend: 'Ext.Toolbar',
    alias: 'widget.tbMasterDetail',
    
    // isToolbar: true,
    // baseCls  : Ext.baseCSSPrefix + 'toolbar',

    initComponent: function() {

        var me = this; 

        // Asigna una referencia al objeto 
        var myMeta = this.protoMeta; 
        var __MasterDetail = this.__MasterDetail; 

        // Estados iniciales 
        me.autoSync = false; 
        me.editable = false; 


        //--------------------------------------------------------

        this.searchBG = Ext.create('ProtoUL.ux.ProtoSearchBG', { myMeta: myMeta })


        Ext.apply(this, {
            dock: 'top',
            // defaults: { scale: 'medium' }, 
            items: [
                this.searchBG, { 

                // La edicion se hara sobre el master si los detalles estan apagados, 
                // si los detalles estan abiertos,  se bloqua el master y se editan detalles 
                tooltip: 'Editer',
                iconCls: 'icon-edit24',
                itemId : 'edit', 

                enableToggle: true,
                toggleGroup: 'tb1' , 
                handler: toogleTb2 

            },{

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
            },  { 
                iconCls : 'icon-tableCancel', 
                itemId:     'cancel',
                text:       'Cancel',
                scope:        this,
                handler:    onClickTableCancelEdit,
                disabled:     ! this.editable  
            }, '|',  {
                iconCls : 'icon-tableAutoSync', 
                itemId:     'autoSync',
                text:       'AutoSync',
                enableToggle: true, 
                pressed:    this.autoSync,   
                scope:        this,
                toggleHandler: onClickTableAutoSync,
                disabled:     ! (this.editable )  

                
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
                iconCls: 'icon-config24'
            }]
        
        });

        this.callParent();
        
        //--------------------------------------------------------
        
        
        this.searchBG.on({
            loadData: {fn: function ( tbar , sFilter, sTitle ) {
                
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
                
            } else if ( but.itemId == 'edit' ) {
                // Entra en modo edicion 
                me.toggleEditMode( true )
                editTBar.show();
                // orderTbar.hide();
                tbar2.hide();
                
            }             
        } 


// ------------------------------------------------------------------------------------------------




        function onClickTableAutoSync( btn, pressed ){

            this.autoSync = pressed ;             
            btn.ownerCt.getComponent('save').setDisabled(  this.autoSync  );
            
            if ( pressed ) __MasterDetail.protoMasterGrid.saveChanges()
            __MasterDetail.protoMasterGrid.store.autoSync = pressed;
            
        }; 


//  --------------------------------------------------------------------------

        function initFormController(){
            var formController = Ext.create('ProtoUL.UI.FormController', { myMeta: myMeta}); 
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


// ------------------------------------------------------------------------------------------------
// 
        // var tbViews = Ext.getCmp( ideTbViews )
        // tbViews.add({
            // xtype: 'tbtext',
            // iconCls : 'icon-views', 
            // text: '<b>Group de colonnes :<b>'
            // // },{  xtype: 'menuseparator'
        // });
// 
        // function configurelistDisplaySet(){
// 
            // var bHide = true; 
// 
            // // Agrega la vista por defecto 
            // var myDefaultCols = myMeta.gridConfig.listDisplay;
            // if ( myDefaultCols.length > 0 ) {
                // tbViews.add({
                    // text:       _defaultViewText,
                    // protoView:  myDefaultCols ,
                    // handler:    onClickChangeView
                // });
            // }
//             
            // var pViews = myMeta.gridConfig.listDisplaySet;
            // for (var vDet in pViews) {         
                // tbViews.add({
                    // text:       vDet ,
                    // protoView:  pViews[vDet] ,
                    // handler:    onClickChangeView
                // });
                // bHide = false; 
            // }
//             
            // // if ( bHide) {
                // // var btViews = Ext.getCmp( ideBtViews );
                // // btViews.hidden = true
            // // }
        // }
//     
        // configurelistDisplaySet(); 

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
            var bt = this.getComponent('details')
            bt.menu.add(  this.__MasterDetail.myDetails )
            bt.show()            
        }

        if ( this.__MasterDetail.myFilters ) {
            var bt = this.getComponent('favorites')
            bt.menu.add(  this.__MasterDetail.myFilters )
            bt.show()            
        }

        if ( this.__MasterDetail.myPrinterOpts ) {
            var bt = this.getComponent('printerOpts')
            bt.menu.add(  this.__MasterDetail.myPrinterOpts )
            bt.show()            
        }

        if ( this.__MasterDetail.tbSorters ) {
            var bt = this.getComponent('sorters')
            bt.show()            
        }
        
    }
  

}); 