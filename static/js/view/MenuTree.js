Ext.define('ProtoUL.view.MenuTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.menuTree',

    viewConfig: {
            plugins: {
                ptype: 'treeviewdragdrop',
                dragText: 'Drag to reorder',
                ddGroup: 'menu'
            }
    },    


    rootVisible: false,
    lines: false,
    minWidth: 200,

    initComponent: function() {
        
        
        Ext.define('Proto.MenuModel', {
            extend: 'Ext.data.Model',
            proxy: {
                method: 'GET',
                type: 'ajax',
                url: _PConfig.urlMenu  
            }, 
        
            fields: [
                {name: 'id', type: 'string'},
                {name: 'protoOption', type: 'string'},
                {name: 'text', type: 'string'},
                {name: 'leaf', type: 'boolean'}
            ]
            
            
            
        });
                
        
        this.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            model: 'Proto.MenuModel',
            root: {
                text:'menu',
                expanded: true 
            }            
        });

        Ext.apply(this, {
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {
                            id: 'newFolder',
                            scope: this,
                            handler: this.newFolder,
                            iconCls: 'menu_new_folder',
                            tooltip: 'New folder' 
                        },
                        {
                            id: 'newOption',
                            scope: this,
                            handler: this.newOption,
                            iconCls: 'menu_new_option',
                            tooltip: 'New option'
                        },
                        {
                            id: 'deleteNode',
                            scope: this,
                            handler: this.deleteNode,
                            iconCls: 'icon-nodeDelete',
                            tooltip: 'Delete node'
                        }, '->', 
                        {
                            id: 'saveMenu',
                            scope: this,
                            handler: this.saveMenu,
                            iconCls: 'menu_save',
                            tooltip: 'Save menu'
                        }, 
                        {
                            id: 'reloadMenu',
                            scope: this,
                            handler: this.reloadMenu,
                            iconCls: 'menu_reload',
                            tooltip: 'Reload menu'
                        }, 
                        {
                            id: 'resetMenu',
                            scope: this,
                            handler: this.resetMenu,
                            iconCls: 'menu_reset',
                            tooltip: 'Reset menu'
                        }
                    ]
                }
            ]
        });


        
        this.callParent(arguments);
        this.addEvents('menuSelect');


    }, 

    listeners: {
        
        // .view.View , .data.Model record, HTMLElement item, Number index, .EventObject e, Object eOpts
        'itemclick': function( view, rec, item, index, evObj , eOpts ) {
            if ( rec.get('leaf') ) {
                var protoOption = rec.data.protoOption || rec.data.id
                this.fireEvent('menuSelect', this, protoOption );
                this.ownerCt.loadPciFromMenu( protoOption );
            }
        }
        
    }, 

    deleteNode: function( btn ) {
        // Verifica si hay un item activo, confirma y lo borra 
    }, 
    newFolder: function( btn ) {
        // prompt por el nombre del menu y lo crea en el arbol 
    }, 
    newOption: function( btn ) {
        // abre forma para creacion de opcion, la forma se encarga de la creacion 
    }, 
    
    reloadMenu: function( btn ) {
        // recarga el menu guardado 
        this.store.load()
    }, 
    resetMenu: function( btn ) {
        // borra el menu guardado y recarga el menu default basado en modelos  
    }, 
    saveMenu: function( btn ) {
        // guarda el menu actual
        var sMeta = Ext.encode(   Tree2Menu( this.store.getRootNode() ) )
        saveProtoObj( '__menu' , sMeta )
    } 

});