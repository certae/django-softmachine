/**
 * @class ProtoUl.controler.MenuPanel
 * @extends Ext.panel.Panel
 *
 * Shows a list of available ProtoConcepts  ( ProtoConceptInterface  PCI )  
 *
 * @constructor
 * Create a Menu Panel
 * @param {Object} config The config object
 */

Ext.define('ProtoUl.controler.MenuPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.menupanel',

    layout: 'fit',
    title: 'Menus',

    initComponent: function(){
        Ext.apply(this, {
            items: this.createView(),
            // dockedItems: this.createToolbar()
        });
        
        this.createMenu();
        this.addEvents(
            /**
             * @event menuremove Fired when a menu is removed
             * @param {MenuPanel} this
             * @param {String} title The title of the menu
             * @param {String} url The url of the menu
             */
            'menuremove',

            /**
             * @event menuselect Fired when a menu is selected
             * @param {MenuPanel} this
             * @param {String} title The title of the menu
             * @param {String} url The url of the menu
             */
            'menuselect'
        );

        this.callParent(arguments);
    },

    /**
     * Create the DataView to be used for the menu list.
     * @private
     * @return {Ext.view.View}
     */
    createView: function(){
        this.view = Ext.create('widget.dataview', {
            store: Ext.create('Ext.data.Store', {
                model: 'Menu',
                data: this.menus
            }),
            selModel: {
                mode: 'SINGLE',
                listeners: {
                    scope: this,
                    selectionchange: this.onSelectionChange
                }
            },
            listeners: {
                scope: this,
                contextmenu: this.onContextMenu,
                viewready: this.onViewReady
            },
            trackOver: true,
            cls: 'menu-list',
            itemSelector: '.menu-list-item',
            overItemCls: 'menu-list-item-hover',
            tpl: '<tpl for="."><div class="menu-list-item">{title}</div></tpl>'
        });
        return this.view;
    },

    onViewReady: function(){
        this.view.getSelectionModel().select(this.view.store.first());
    },


    /**
     * Creates the toolbar to be used for controlling menus.
     * @private
     * @return {Ext.toolbar.Toolbar}
     */
    createToolbar: function(){
        this.createActions();
        this.toolbar = Ext.create('widget.toolbar', {
            items: [this.addAction, this.removeAction]
        });
        return this.toolbar;
    },

    /**
     * Create actions to share between toolbar and menu
     * @private
     */
    createActions: function(){
        this.addAction = Ext.create('Ext.Action', {
            scope: this,
            handler: this.onAddMenuClick,
            text: 'Add menu',
            iconCls: 'menu-add'
        });

        this.removeAction = Ext.create('Ext.Action', {
            itemId: 'remove',
            scope: this,
            handler: this.onRemoveMenuClick,
            text: 'Remove menu',
            iconCls: 'menu-remove'
        });
    },

    /**
     * Create the context menu
     * @private
     */
    createMenu: function(){
        this.menu = Ext.create('widget.menu', {
            items: [{
                scope: this,
                handler: this.onLoadClick,
                text: 'Load menu',
                iconCls: 'menu-load'
            }, this.removeAction, '-', this.addAction],
            listeners: {
                hide: function(c){
                    c.activeMenu = null;
                }
            }
        });
    },

    /**
     * Used when view selection changes so we can disable toolbar buttons.
     * @private
     */
    onSelectionChange: function(){
        var selected = this.getSelectedItem();
        this.toolbar.getComponent('remove').setDisabled(!selected);
        this.loadMenu(selected);
    },

    /**
     * React to the load PCI menu click.
     * @private
     */
    onLoadClick: function(){
        this.loadMenu(this.menu.activeMenu);
    },

    /**
     * Loads PCI.
     * @private
     * @param {Ext.data.Model} rec The menu
     */
    loadMenu: function(rec){
        if (rec) {
            this.fireEvent('menuselect', this, rec.get('title'), rec.get('url'));
        }
    },

    /**
     * Gets the currently selected record in the view.
     * @private
     * @return {Ext.data.Model} Returns the selected model. false if nothing is selected.
     */
    getSelectedItem: function(){
        return this.view.getSelectionModel().getSelection()[0] || false;
    },

    /**
     * Listens for the context menu event on the view
     * @private
     */
    onContextMenu: function(view, index, el, event){
        var menu = this.menu;

        event.stopEvent();
        menu.activeMenu = view.store.getAt(index);
        menu.showAt(event.getXY());
    },

    /**
     * React to a menu being removed
     * @private
     */
    onRemoveMenuClick: function(){
        var active = this.menu.activeMenu || this.getSelectedItem();


        this.animateNode(this.view.getNode(active), 1, 0, {
            scope: this,
            afteranimate: function(){
                this.view.store.remove(active);
            }
        });
        this.fireEvent('menuremove', this, active.get('title'), active.get('url'));

    },

    /**
     * React to a menu attempting to be added
     * @private
     */
    onAddMenuClick: function(){
        var win = Ext.create('widget.menuwindow', {
            listeners: {
                scope: this,
                menuvalid: this.onMenuValid
            }
        });
        win.show();
    },

    /**
     * React to a validation on a menu passing
     * @private
     * @param {MenuViewer.MenuWindow} win
     * @param {String} title The title of the menu
     * @param {String} url The url of the menu
     */
    onMenuValid: function(win, title, url){
        var view = this.view,
            store = view.store,
            rec;

        rec = store.add({
            url: url,
            title: title
        })[0];
        this.animateNode(view.getNode(rec), 0, 1);
    },


    // Inherit docs
    onDestroy: function(){
        this.callParent(arguments);
        this.menu.destroy();
    }
});

