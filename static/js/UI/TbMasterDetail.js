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
                tooltip: __language.Tooltip_Switch_Edit_Mode,
                text:    __language.Toolbar_Text_Edit_Button,
                hidden : true,
                handler:    editOpts
                
            }, {
                iconCls : 'icon-tableSave', 
                itemId:     'save',
                text:       __language.Title_Save_Button,
                tooltip:    __language.Tooltip_Save_Exit_Edition_Button,
                handler:    editOpts,
                hidden:     true  
            }, {
                iconCls : 'icon-saveDraft', 
                itemId:     'saveDraft',
                text:       __language.Text_Continue_Button,
                tooltip:    __language.Tooltip_Save_Continue_Edition_Button,
                handler:    editOpts,
                hidden:     true   
            },  {
                iconCls : 'icon-tableAutoSync', 
                itemId:     'autoSync',
                text:      __language.Text_AutoSync,
                enableToggle: true, 
                handler:      editOpts, 
                hidden : true
            },{
                text:    __language.Text_Clasify_Button,
                tooltip: __language.Tooltip_Clasify_Button,
                iconCls: 'icon-order',
                itemId : 'sorters', 
                hidden : true,
                enableToggle: true,
                handler: toogleTb2 

            },{
                xtype: 'splitbutton', 
                text:    __language.Text_Print,
                tooltip: __language.Tooltip_Printing_Options,
                iconCls: 'icon-print',
                itemId : 'printerOpts', 
                hidden : true,
                enableToggle: true,
                handler: toogleTb2,  
                menu :  Ext.create( 'Ext.menu.Menu', {}) 

            },{
                xtype: 'splitbutton', 
                text:    __language.Text_Actions_Button,
                tooltip: __language.Tooltip_Actions_Button,
                iconCls: 'icon-action',
                itemId : 'protoActions', 
                hidden : true,
                enableToggle: true,
                handler: toogleTb2,  
                menu :  Ext.create( 'Ext.menu.Menu', {}) 

            }, {
                xtype: 'splitbutton', 
                text:   __language.Text_Toolbar_Detail_Button,
                tooltip: __language.Tooltip_Details_Button,
                iconCls: 'icon-details', 
                itemId : 'details', 
                hidden : true,
                enableToggle: true,
                handler: toogleTb2,  
                menu :  Ext.create( 'Ext.menu.Menu', {}) 
            },  { 
                xtype: 'splitbutton', 
                text:    __language.Text_Filters_Button,
                tooltip: __language.Tooltip_Filters_Button,
                iconCls: 'icon-custom',
                itemId : 'custom', 
                // hidden : true,
                enableToggle: true,
                handler: toogleTb2,  
                menu :  Ext.create( 'Ext.menu.Menu', {}) 

            },'->',{
                iconCls : 'door_out', 
                itemId:     'cancel',
                text:    __language.Text_Close_Button,
                tooltip: __language.Tooltip_Exit_Edit_Mode_Button,
                hidden : true,
                handler:    editOpts

            }, {
                // text: 'Aide',
                xtype: 'splitbutton', 
                menu :  this.configCtrl.getActions(),
                iconCls: 'icon-help',
                handler: toogleTb2,
                itemId : 'tbHelp'
            // },{
                // handler:    toogleTb2,
                // iconCls: 'icon-config', 
                // itemId : 'config'
            }]
        
        });

        this.callParent();
        this.setEditMode( false ); 


        // permite la edicion 
        if ( _UserInfo.isStaff ) { 
            this.getComponent('edit').setVisible ( true  );
        }

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

            } else if ( but.itemId == 'protoActions' ) {
                if ( __MasterDetail.tbProtoActions ) {
                    __MasterDetail.tbProtoActions.setVisible( but.pressed  )
                }


            // } else if ( but.itemId == 'config' ) {
                // this.configCtrl.showMetaConfig()

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

        if ( ! _UserInfo.isStaff  ) return 

                
        // En modoEdicion los botones de accion son desactivados y los  edicion son apagados 
        Ext.suspendLayouts();
    
        // 'edit', 'cancel', 'save', 'autoSync'
        this.getComponent('edit').setVisible ( ! bEdit );
        this.getComponent('cancel').setVisible( bEdit );
        this.getComponent('save').setVisible( bEdit  );
        this.getComponent('saveDraft').setVisible( bEdit  );
        this.getComponent('autoSync').setVisible( bEdit );
        // this.getComponent('config').setVisible( !bEdit );

        this.searchBG.setVisible( ! bEdit )
        this.setAutoSync( this.__MasterDetail.autoSync )

        // 'details', 'printerOpts', 'sorters', 'tbHelp', 'custom',
        setEditMode( this, 'details', bEdit );
        setEditMode( this, 'printerOpts', bEdit );
        setEditMode( this, 'sorters', bEdit  );
        setEditMode( this, 'custom', bEdit );
        setEditMode( this, 'protoActions', bEdit );

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

        if ( this.__MasterDetail.myProtoActions ) {
            var bt = this.getComponent('protoActions')
            bt.menu.add(  this.__MasterDetail.myProtoActions )
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