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

        //--------------------------------------------------------

        this.searchBG = Ext.create('ProtoUL.ux.ProtoSearchBG', { myMeta: myMeta })

        // La edicion se hara sobre el master si los detalles estan apagados, 
        // si los detalles estan abiertos,  se bloqua el master y se editan detalles 

        Ext.apply(this, {
            dock: 'top',
            defaults : { scope: me }, 
            items: [
                this.searchBG, 
            { 
                iconCls: 'icon-edit',
                itemId : 'edit', 
                tooltip: 'Changer à mode edition',
                text:    'Editer',
                handler:    editOpts
                
            }, {
                iconCls : 'icon-tableSave', 
                itemId:     'save',
                text:       'Save',
                tooltip:    'Save',
                handler:    editOpts,
                hidden:     true  
            },{
                text: 'Classer',
                tooltip: 'Options de classement',
                iconCls: 'icon-order',
                itemId : 'sorters', 
                hidden : true,
                enableToggle: true,
                handler: toogleTb2 

            },{
                xtype: 'splitbutton', 
                text   : 'Imprimer',
                tooltip: "Options d'impression",
                iconCls: 'icon-print',
                itemId : 'printerOpts', 
                hidden : true,
                enableToggle: true,
                handler: toogleTb2,  
                menu :  Ext.create( 'Ext.menu.Menu', {}) 

            }, {
                xtype: 'splitbutton', 
                text : 'Détails',
                tooltip: 'Voir détails',
                iconCls: 'icon-details', 
                itemId : 'details', 
                hidden : true,
                enableToggle: true,
                handler: toogleTb2,  
                menu :  Ext.create( 'Ext.menu.Menu', {}) 

            },'->',{
                iconCls : 'icon-tableCancel', 
                itemId:     'cancel',
                text:       'Cancel',
                tooltip:    'Cancel EditMode',
                hidden : true,
                handler:    editOpts

            },  {
                iconCls : 'icon-tableAutoSync', 
                itemId:     'autoSync',
                text:       'AutoSync',
                enableToggle: true, 
                handler:      editOpts, 
                hidden : true
            },  { 

                xtype: 'splitbutton', 
                tooltip: 'Personalisatios',
                iconCls: 'icon-custom',
                itemId : 'custom', 
                // hidden : true,
                enableToggle: true,
                handler: toogleTb2,  
                menu :  Ext.create( 'Ext.menu.Menu', {}) 
            }, {
                // text: 'Aide',
                iconCls: 'icon-help',
                handler: toogleTb2,
                itemId : 'tbHelp'
            },{
                // text : 'Config',
                xtype: 'splitbutton', 
                menu :  this.configCtrl.getActions(),
                handler:    toogleTb2,
                iconCls: 'icon-config'
            }]
        
        });

        this.callParent();
        

        //--------------------------------------------------------
        
        
        this.searchBG.on({
            loadData: {fn: function ( tbar , sFilter, sTitle ) {
                __MasterDetail.onClickLoadData( sFilter );
                __MasterDetail.protoMasterGrid.protoLocalFilter = sTitle; 
                __MasterDetail.protoMasterGrid.setGridTitle( __MasterDetail.protoMasterGrid ) 
                }, scope: this }
        });                 
            
        // -----------------------------------------------------------
        


        function toogleTb2( but, pressed ) {
            // 'details', 'printerOpts', 'sorters', 'tbHelp', 'custom',  

            if ( but.itemId == 'sorters' ) {
                if ( __MasterDetail.tbSorters ) {
                    __MasterDetail.tbSorters.setVisible( but.pressed  )
                }

            } else if ( but.itemId == 'custom' ) {
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
            } else if ( but.itemId == 'tbHelp' ) {
                window.open( __HELPpath ,'protoHelp','left=50,top=20,width=1000,height=600,resizable=0')
            }
            
        } 


// ------------------------------------------------------------------------------------------------

        function editOpts( but, pressed ) {
            // 'edit', 'autoSync','cancel','save',

            var editable = __MasterDetail.editable
            var autoSync = __MasterDetail.autoSync

            if ( but.itemId == 'edit' ) {
                setEditMode( true )

            } else if ( but.itemId == 'autoSync' ) {

                __MasterDetail.autoSync = pressed ;             

                btn.ownerCt.getComponent('save').setDisabled(  pressed  );
                if ( pressed ) {
                    __MasterDetail.saveChanges()
                }   
                
            } else if ( but.itemId == 'save' ) {

                __MasterDetail.saveChanges()

            } else if ( but.itemId == 'cancel' ) {

                __MasterDetail.cancelChanges()

            }
            
            function setEditMode() {

                this.__MasterDetail.setEditMode( true    )

                editable = __MasterDetail.editable
                autoSync = __MasterDetail.autoSync

                this.editTBar.getComponent('edit').setVisible ( ! this.editable );
                this.editTBar.getComponent('cancel').setVisible( this.editable );
                 
                this.editTBar.getComponent('save').setVisible( this.editable  );
                this.editTBar.getComponent('save').setDisabled( this.autoSync || (!this.editable ));
    
                this.editTBar.getComponent('autoSync').setDisabled( ! this.editable );
            } 
             
        } 
    }, 
    
    
    addActions:  function () {
        // Permite agregar las acciones despues de haber configurado el MD 
     
        if ( this.__MasterDetail.myDetails ) {
            var bt = this.getComponent('details')
            bt.menu.add(  this.__MasterDetail.myDetails )
            bt.show()            
        }

        if ( this.__MasterDetail.myFilters ) {
            var bt = this.getComponent('custom')
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