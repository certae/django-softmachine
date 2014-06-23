/*
 *
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.view.Viewport', {
    extend: 'Ext.Viewport',
    layout: 'fit',

    initComponent: function() {

        Ext.apply(this, {
            layout: 'border',
            autoRender: true,
            padding: 5,
            defaults: {
                split: true
            },
            items: [this.createHeaderPanel(), this.createMenuPanel(), this.createProtoTabContainer(), this.createFooterPanel()]

        });

        this.callParent(arguments);

    },

    createFooterPanel: function() {

        // StatusBar Global
        _SM.__StBar = Ext.create('Ext.ux.StatusBar', {
            region: 'south',
            split: false,
            collapsible: false
        });
        if (_SM.showFooterExtraContent) {
            var panelContent = Ext.create('Ext.panel.Panel', {
                html: _SM.footerExtraContent,
                margins: '0 0 0 0',
                border: false,
                align: 'middle',
                collapsible: true,
                split: true
            });
            var vbox = Ext.create('Ext.panel.Panel', {
                region: 'south',
                header: false,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    bodyStyle: 'padding:15px',
                    split: true
                },
                items: [_SM.__StBar, panelContent]
            });
            return vbox;
        } else {
            return _SM.__StBar;
        }

    },

    afterRender: function() {
        this.callParent(arguments);

        _SM.__StBar.showBusy('loading ... ', 'vPort', 3000);

        // Load PCI
        // TODO: This could be configured by user
        for (var autoPci in _SM._AUTOLOAD_PCI) {
            this.loadPciFromMenu(_SM._AUTOLOAD_PCI[autoPci]);
        }

        _SM._mainWin = this;

    },

    createHeaderPanel: function() {
        var content = Ext.create('Ext.panel.Panel', {
            html: _SM._siteTitle,
            margins: '0 0 0 0',
            border: false,
            align: 'middle',
            split: true
        });
        var headerPanel = Ext.create('Ext.panel.Panel', {
            region: 'north',
            header: false,
            collapsible: true,
            collapseMode: 'mini',
            collapsed: _SM._siteTitleCollapsed,
            height: 90,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                bodyStyle: 'padding:5px',
                split: true
            },
            items: [content]
        });
        return headerPanel;
    },

    createMenuPanel: function() {

        if (_SM._MENU_COLLAPSED == undefined) {
            _SM._MENU_COLLAPSED = false;
        }

        this.menuPanel = {
            region: 'west',
            width: 300,
            title: _SM.__language.Title_Main_Menu,
            collapsible: true,
            collapsed: _SM._MENU_COLLAPSED,

            xtype: 'menuTree'

            // ---------------------  Do not delete 
            // layout: 'accordion',
            // items: [{
                // // title: 'Menu',
                // layout: 'fit',
                // xtype: 'menuTree'
                // // xtype: 'treepanel',
            // }, {
                // title: 'Favorits',
                // hidden: true,
            // }]
        };
        // );

        // listeners: {
            // scope: this,
            // feedselect: this.onFeedSelect
        // };

        return this.menuPanel;
    },

    loadPciFromMenu: function(menuOpt) {

        var viewCode = menuOpt;
        var me = this;

        var options = {
            scope: this,
            success: function(obj, result, request) {

                me.openProtoOption(viewCode);

            },
            failure: function(obj, result, request) {
                return;
            }
        };

        if (_SM.loadPci(viewCode, true, options)) {
            me.openProtoOption(viewCode);

        }

    },

    openProtoOption: function(viewCode) {

        var me = this;
        var myMeta = _SM._cllPCI[viewCode];

        if (myMeta.pciStyle == 'form') {
            var formController = Ext.create('ProtoUL.UI.FormController', {});
            formController.openProtoForm.call(formController, viewCode, -1, true);
        } else {
            me.protoTabContainer.addTabPanel(viewCode);
        }

    },

    createProtoTabContainer: function() {
        this.protoTabContainer = Ext.create('widget.protoTabContainer', {
            region: 'center',
            border: false,
            minWidth: 300
        });
        return this.protoTabContainer;
    }
});
