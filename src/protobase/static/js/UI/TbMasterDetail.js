/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.UI.TbMasterDetail', {
    extend: 'Ext.Toolbar',
    alias: 'widget.tbMasterDetail',

    // isToolbar: true,
    // baseCls  : Ext.baseCSSPrefix + 'toolbar',

    autoEdit: true,

    initComponent: function() {

        var me = this, 
            myMeta = this.protoMeta, 
            __MasterDetail = this.__MasterDetail;

        //--------------------------------------------------------

        this.searchBG = Ext.create('ProtoUL.ux.ProtoSearchBG', {
            myMeta: myMeta
        });

        // La edicion se hara sobre el master si los detalles estan apagados,
        // si los detalles estan abiertos,  se bloqua el master y se editan detalles

        Ext.apply(this, {
            dock: 'top',
            defaults: {
                scope: me
            },
            items: [this.searchBG, {
                iconCls: 'icon-edit',
                itemId: 'edit',
                tooltip: _SM.__language.Grid_Edit_Ttip,
                text: _SM.__language.Grid_Edit_Title,
                hidden: true,
                handler: editOpts
            }, {
                text: _SM.__language.Text_Clasify_Button,
                tooltip: _SM.__language.Tooltip_Clasify_Button,
                iconCls: 'icon-order',
                itemId: 'sorters',
                hidden: true,
                enableToggle: true,
                handler: toogleTb2
            }, {
                xtype: 'splitbutton',
                text: _SM.__language.Text_Actions_Button,
                tooltip: _SM.__language.Tooltip_Actions_Button,
                iconCls: 'icon-action',
                itemId: 'protoActions',
                hidden: true,
                enableToggle: true,
                handler: toogleTb2,
                menu: Ext.create('Ext.menu.Menu', {})

            }, {
                xtype: 'splitbutton',
                text: _SM.__language.Grid_Detail_Title,
                tooltip: _SM.__language.Tooltip_Details_Button,
                iconCls: 'icon-details',
                itemId: 'details',
                hidden: true,
                enableToggle: true,
                handler: toogleTb2,
                menu: Ext.create('Ext.menu.Menu', {})
            }, {
                xtype: 'splitbutton',
                text: _SM.__language.Text_Filters_Button,
                tooltip: _SM.__language.Tooltip_Filters_Button,
                iconCls: 'icon-filters',
                itemId: 'filterSet',
                hidden: true,
                enableToggle: true,
                handler: toogleTb2,
                menu: Ext.create('Ext.menu.Menu', {})

            }, {
                xtype: 'splitbutton',
                text: _SM.__language.Text_Tabs_Button,
                tooltip: _SM.__language.Tooltip_Tabs_Button,
                iconCls: 'icon-tabs',
                itemId: 'tabSet',
                hidden: true,
                enableToggle: true,
                handler: toogleTb2,
                menu: Ext.create('Ext.menu.Menu', {})

            }, {
                xtype: 'splitbutton',
                text: _SM.__language.Text_Sorters_Button,
                tooltip: _SM.__language.Tooltip_Sorters_Button,
                iconCls: 'icon-sorters',
                itemId: 'sorterSet',
                hidden: true,
                enableToggle: true,
                handler: toogleTb2,
                menu: Ext.create('Ext.menu.Menu', {})

            }, {
                xtype: 'splitbutton',
                text: _SM.__language.Text_Print,
                tooltip: _SM.__language.Tooltip_Printing_Options,
                iconCls: 'icon-print',
                itemId: 'printerOpts',
                hidden: true,
                enableToggle: true,
                handler: toogleTb2,
                menu: Ext.create('Ext.menu.Menu', {})

            }, {
                xtype: 'splitbutton',
                text: _SM.__language.Text_Config,
                tooltip: _SM.__language.Tooltip_Config_Button,
                iconCls: 'icon-config',
                itemId: 'configOpts',
                hidden: true,
                enableToggle: true,
                handler: toogleTb2,
                menu: Ext.create('Ext.menu.Menu', {})

            }, '->', {
                iconCls: 'icon-editoff',
                itemId: 'editOff',
                text: _SM.__language.Text_Exit_Edit_Mode_Button,
                tooltip: _SM.__language.Tooltip_Exit_Edit_Mode_Button,
                hidden: true,
                handler: editOpts

            }, {
                xtype: 'button',
                iconCls: 'icon-help',
                text: _SM.__language.Text_Help_Button,
                handler: toogleTb2,
                itemId: 'tbHelp'
            }]

        });

        this.callParent();

        // Guarda los permisos
        me.perms = _SM._UserInfo.perms[this.protoMeta.viewCode];

        this.setEditMode(this.autoEdit);

        // permite la edicion
        // if ( _SM._UserInfo.isStaff ) {
        if (!me.autoEdit && (me.perms['add'] || me.perms['change'] || me.perms['delete'])) {
            this.getComponent('edit').setVisible(true);
        }

        //--------------------------------------------------------

        this.searchBG.on({
            qbeLoadData: {
                fn: function(tbar, sFilter, sTitle, sorter) {
                    __MasterDetail.mdGridLoadData(sFilter, sorter);
                    __MasterDetail.protoMasterGrid.filterTitle = sTitle;
                    __MasterDetail.protoMasterGrid.setGridTitle(__MasterDetail.protoMasterGrid);
                },
                scope: this
            }
        });

        // -----------------------------------------------------------

        function toogleTb2(but) {
            // 'details', 'printerOpts', 'sorters', 'tbHelp', 'filterSet',

            if (but.itemId === 'sorters') {
                if (__MasterDetail.tbSorters) {
                    __MasterDetail.tbSorters.setVisible(but.pressed);
                }

            } else if (but.itemId === 'filterSet') {
                if (__MasterDetail.tbFilters) {
                    __MasterDetail.tbFilters.setVisible(but.pressed);
                }

            } else if (but.itemId === 'tabSet') {
                if (__MasterDetail.tbTabs) {
                    __MasterDetail.tbTabs.setVisible(but.pressed);
                }

            } else if (but.itemId === 'sorterSet') {
                if (__MasterDetail.tbSortersSet) {
                    __MasterDetail.tbSortersSet.setVisible(but.pressed);
                }

            } else if (but.itemId === 'printerOpts') {
                if (__MasterDetail.tbPrinterOpts) {
                    __MasterDetail.tbPrinterOpts.setVisible(but.pressed);
                }

            } else if (but.itemId === 'configOpts') {
                if (__MasterDetail.tbConfigOpts) {
                    __MasterDetail.tbConfigOpts.setVisible(but.pressed);
                }

            } else if (but.itemId === 'details') {
                if (__MasterDetail.tbDetails) {
                    __MasterDetail.showDetailPanel(!but.pressed);
                }

            } else if (but.itemId === 'protoActions') {
                if (__MasterDetail.tbProtoActions) {
                    __MasterDetail.tbProtoActions.setVisible(but.pressed);
                }

                // } else if ( but.itemId == 'config' ) {
                // this.configCtrl.showMetaConfig()

            } else if (but.itemId === 'tbHelp') {
                window.open(_SM._HELPpath, 'protoHelp', 'left=50,top=20,width=1000,height=600,resizable=0,scrollbars=yes');
            }

        }

        // ------------------------------------------------------------------------------------------------

        function editOpts(but) {
            // 'edit', 'autoSync','editOff','save',

            if (but.itemId == 'edit') {
                // Evitar la edicion en detalles si no hay un registro seleccioando
                // if ( ! __MasterDetail.isDetailCollapsed() )
                // if ( ! _SM.validaSelected( __MasterDetail.protoMasterGrid.selected )) return

                me.setEditMode(true);

            } else if (but.itemId == 'editOff') {
                // __MasterDetail.cancelChanges()
                me.setEditMode(false);

                // } else if ( but.itemId == 'save' ) {
                // __MasterDetail.saveChanges()
                // me.setEditMode( false  )
                // } else if ( but.itemId == 'saveDraft' ) {
                // __MasterDetail.saveChanges()
                // } else if ( but.itemId == 'autoSync' ) {
                // __MasterDetail.saveChanges()
                // me.setAutoSync( but.pressed )
            }
        }

    },

    setAutoSync: function(autoSync) {
        // this.getComponent('saveDraft').setDisabled( autoSync );
        // this.getComponent('autoSync').toggle( autoSync, true  );
        // this.__MasterDetail.setAutoSync ( autoSync );
    },

    setEditMode: function(bEdit) {

        // if ( ! _SM._UserInfo.isStaff  ) return
        var me = this;
        if (!(me.perms['add'] || me.perms['change'] || me.perms['delete'] )) {
            return;
        }

        // En modoEdicion los botones de accion son desactivados y los  edicion son apagados
        Ext.suspendLayouts();

        // 'edit', 'editOff', 'save', 'autoSync'
        if (!this.autoEdit) {

        this.getComponent('edit').setVisible(!bEdit);
        this.getComponent('editOff').setVisible(bEdit);

        this.searchBG.setVisible(!bEdit);

        // --------------------- 'details', 'printerOpts', 'sorters', 'tbHelp', 'filterSet',
        setMdButton(this, 'printerOpts', bEdit);
        setMdButton(this, 'configOpts', bEdit);
        setMdButton(this, 'sorters', bEdit);
        setMdButton(this, 'filterSet', bEdit);
        setMdButton(this, 'protoActions', bEdit);
        setMdButton(this, 'sorterSet', bEdit);

        }

        // DGT 1303 Con el autosync, se permite la edicion en todos los objetos
        // this.setAutoSync( this.__MasterDetail.autoSync )
        // setMdButton( this, 'tabSet', bEdit );
        // setMdButton( this, 'details', bEdit );

        var autoSync = this.__MasterDetail.autoSync;
        this.__MasterDetail.setEditMode(bEdit);

        function setMdButton(me, btId, bEdit) {
            var bt = me.getComponent(btId);
            bt.setVisible((!bEdit ) && (bt.protoEnable ));
        }

        Ext.resumeLayouts(true);

    },

    addActions: function() {

        // Permite agregar las acciones despues de haber configurado el MD
        // bt.protoEnable  indica si el boton es valido en esta instancia

        if (this.__MasterDetail.myDetails) {
            var bt = this.getComponent('details');
            bt.menu.add(this.__MasterDetail.myDetails);
            bt.protoEnable = true;
            bt.show();
        }

        if (this.__MasterDetail.myFilters) {
            var bt = this.getComponent('filterSet');
            bt.menu.add(this.__MasterDetail.myFilters);
            bt.protoEnable = true;
            bt.show();
        }

        if (this.__MasterDetail.myPrinterOpts) {
            var bt = this.getComponent('printerOpts');
            bt.menu.add(this.__MasterDetail.myPrinterOpts);
            bt.protoEnable = true;
            bt.show();
        }

        if (this.__MasterDetail.myConfigOpts) {
            var bt = this.getComponent('configOpts');
            bt.menu.add(this.__MasterDetail.myConfigOpts);
            bt.protoEnable = true;
            bt.show();
        }

        if (this.__MasterDetail.myProtoActions) {
            var bt = this.getComponent('protoActions');
            bt.menu.add(this.__MasterDetail.myProtoActions);
            bt.protoEnable = true;
            bt.show();
        }

        if (this.__MasterDetail.tbSorters) {
            var bt = this.getComponent('sorters');
            bt.protoEnable = true;
            bt.show();
        }

        if (this.__MasterDetail.myTabs) {
            var bt = this.getComponent('tabSet');
            bt.menu.add(this.__MasterDetail.myTabs);
            bt.protoEnable = true;
            bt.show();
        }

        if (this.__MasterDetail.mySortersSet) {
            var bt = this.getComponent('sorterSet');
            bt.menu.add(this.__MasterDetail.mySortersSet);
            bt.protoEnable = true;
            bt.show();
        }
    }
}); 
