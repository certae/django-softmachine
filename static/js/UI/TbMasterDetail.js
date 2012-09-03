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
                tooltip:    'Save and exit edition mode',
                handler:    editOpts,
                hidden:     true  
            }, {
                iconCls : 'icon-saveDraft', 
                itemId:     'saveDraft',
                text:       'Continue',
                tooltip:    'Save and continue',
                handler:    editOpts,
                hidden:     true   
            },  {
                iconCls : 'icon-tableAutoSync', 
                itemId:     'autoSync',
                text:       'AutoSync',
                enableToggle: true, 
                handler:      editOpts, 
                hidden : true
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
                iconCls: 'icon-config', 
                itemId : 'config'
            }]
        
        });

        this.callParent();
        this.setEditMode( false ); 

        //--------------------------------------------------------
        
        
        this.searchBG.on({
            loadData: {fn: function ( tbar , sFilter, sTitle ) {
                __MasterDetail.onClickLoadData( sFilter );
                __MasterDetail.protoMasterGrid.protoLocalFilter = sTitle; 
                __MasterDetail.protoMasterGrid.setGridTitle( __MasterDetail.protoMasterGrid ) 
                }, scope: this }
        });                 
            
        // -----------------------------------------------------------
        


        function toogleTb2( but ) {
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

        function editOpts( but  ) {
            // 'edit', 'autoSync','cancel','save',

            if ( but.itemId == 'edit' ) {
                me.setEditMode( true )

            } else if ( but.itemId == 'save' ) {
                __MasterDetail.saveChanges()
                me.setEditMode( false  )

            } else if ( but.itemId == 'saveDraft' ) {
                __MasterDetail.saveChanges()

            } else if ( but.itemId == 'cancel' ) {
                __MasterDetail.cancelChanges()
                me.setEditMode( false  )

            } else if ( but.itemId == 'autoSync' ) {
                __MasterDetail.saveChanges()
                me.setAutoSync( but.pressed )
            }
        } 
    }, 
    

    setAutoSync: function( autoSync ) {
        this.getComponent('saveDraft').setDisabled( autoSync );
        this.getComponent('autoSync').toggle( autoSync, true  );
        this.__MasterDetail.setAutoSync ( autoSync );
    }, 

    setEditMode: function( bEdit ) {
        
        // En modoEdicion los botones de accion son desactivados 
        // En modoAction los botones de edicion son apagados 

        Ext.suspendLayouts();
    
        // 'edit', 'cancel', 'save', 'autoSync'
        this.getComponent('edit').setVisible ( ! bEdit );
        this.getComponent('cancel').setVisible( bEdit );
        this.getComponent('save').setVisible( bEdit  );
        this.getComponent('saveDraft').setVisible( bEdit  );
        this.getComponent('autoSync').setVisible( bEdit );
        this.getComponent('config').setVisible( !bEdit );

        this.searchBG.setVisible( ! bEdit )
        this.setAutoSync( this.__MasterDetail.autoSync )

        // 'details', 'printerOpts', 'sorters', 'tbHelp', 'custom',
        setEditMode( this, 'details', bEdit );
        setEditMode( this, 'printerOpts', bEdit );
        setEditMode( this, 'sorters', bEdit  );
        setEditMode( this, 'custom', bEdit );

        var autoSync = this.__MasterDetail.autoSync
        this.__MasterDetail.setEditMode(  bEdit   )

        
        function setEditMode( me, btId, bEdit ) {
            var bt = me.getComponent( btId )
            bt.setVisible ( (! bEdit ) && ( bt.protoEnable ));
        }; 

        Ext.resumeLayouts(true);

    },  
    
    addActions:  function () {

        // Permite agregar las acciones despues de haber configurado el MD
        // bt.protoEnable  indica si el boton es valido en esta instancia 
     
        if ( this.__MasterDetail.myDetails ) {
            var bt = this.getComponent('details')
            bt.menu.add(  this.__MasterDetail.myDetails )
            bt.protoEnable = true 
            bt.show()            
        }

        if ( this.__MasterDetail.myFilters ) {
            var bt = this.getComponent('custom')
            bt.menu.add(  this.__MasterDetail.myFilters )
            bt.protoEnable = true 
            bt.show()            
        }

        if ( this.__MasterDetail.myPrinterOpts ) {
            var bt = this.getComponent('printerOpts')
            bt.menu.add(  this.__MasterDetail.myPrinterOpts )
            bt.protoEnable = true 
            bt.show()            
        }

        if ( this.__MasterDetail.tbSorters ) {
            var bt = this.getComponent('sorters')
            bt.protoEnable = true 
            bt.show()            
        }
        
    }
  

}); 