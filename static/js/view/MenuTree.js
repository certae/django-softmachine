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
                url: _PConfig.urlMenu , 
                extraParams : { forceDefault : 0 }
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
            }, 
            listeners: {
                'datachanged': function( store,  eOpts ) {
                    this.treeRecord  = undefined;
                } 
                
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
                            id: 'editNode',
                            scope: this,
                            handler: this.editNode,
                            iconCls: 'icon-nodeEdit',
                            tooltip: 'Edit node'
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
            this.treeRecord  = rec;
            if ( rec.get('leaf') ) {
                var protoOption = rec.data.protoOption || rec.data.id
                this.fireEvent('menuSelect', this, protoOption );
                this.ownerCt.loadPciFromMenu( protoOption );
            }
        } 
        
    }, 

    editNode: function( btn ) {
        // Verifica si hay un item activo y lo edita
        if ( this.treeRecord ) {
            var me = this,
                msg = 'Please enter the folder name'
            Ext.Msg.prompt( 'Add menu', msg, function(btn, pName){
                if (btn != 'ok') return 
                me.treeRecord.set( 'text' ,  pName ) 
            }, me, false , me.treeRecord.get( 'text' ));

        }  
    }, 

    deleteNode: function( btn ) {
        // Verifica si hay un item activo, confirma y lo borra
        if ( this.treeRecord ) {
            this.treeRecord.remove( )
            this.treeRecord  = undefined;
        }  
    }, 

    newFolder: function( btn ) {
        // prompt por el nombre del menu y lo crea en el arbol 
        if ( this.treeRecord && this.treeRecord.get( 'leaf' )  ) {
            errorMessage( 'AddMenuOption', 'Not selected folder' )
            return 
        }
            
        var me = this,
            msg = 'Please enter the folder name'
        Ext.Msg.prompt( 'Add menu', msg, function(btn, pName){
            if (btn != 'ok') return 
            var record = me.treeRecord || me.store.getRootNode()
            var tNode = {'text' :  pName, 'children': [] }
            record.appendChild( tNode )
        }, me, false );

        
    }, 
    newOption: function( btn ) {
        // abre forma para creacion de opcion, la forma se encarga de la creacion 
        if ( ! this.treeRecord || this.treeRecord.get( 'leaf' )  ) {
            errorMessage( 'AddMenuOption', 'Not selected folder' )
            return 
        }

        var myWin  = Ext.widget('menuOption', {
            treeRecord : this.treeRecord, 
            title: 'Add menu option'
        });
        myWin.show()
        
    }, 
    
    reloadMenu: function( btn ) {
        // recarga el menu guardado 
        this.store.getProxy().extraParams.forceDefault = 0 ;
        this.store.load()
    }, 

    resetMenu: function( btn ) {
        // borra el menu guardado y recarga el menu default basado en modelos  
        this.store.getProxy().extraParams.forceDefault = 1 ;
        this.store.load()
    }, 
    saveMenu: function( btn ) {
        // guarda el menu actual
        var sMeta = Ext.encode(   Tree2Menu( this.store.getRootNode() ) )
        saveProtoObj( '__menu' , sMeta )
        

        function Tree2Menu( tNode  ) {
            // Para poder leer de la treeData o del TreeStore ( requiere data )
            var tData = tNode.data,  
                tChilds =  tNode.childNodes, 
                mData = {}
            if ( tData.root ) {
                mData = getMenuChilds(  tChilds  )
            } else { 
                mData = {
                        "text": tData.text ,
                        "qtip": tData.qtip, 
                        "qtitle": tData.qtitle, 
                        "iconCls": tData.iconCls ,
                        "id":  'protoMenu-' + Ext.id() ,
                        "index": tData.index, 
                    }
                // Es un menu 
                if ( tChilds.length > 0 ) {
                     mData.expanded = tData.expanded
                     mData.children = getMenuChilds(  tChilds  )
                } else {
                     mData.leaf = true 
                     mData.protoOption =  tData.protoOption ||  tData.id 
                }
            } 
            return mData 
        
            function getMenuChilds( tChilds  ) {
                var mChilds = []    
                for (var ix in tChilds ) {
                    var lNode = tChilds[ ix ]
                    var nChildData = Tree2Menu( lNode   ) 
                    mChilds.push( nChildData )
                }
                return mChilds
            }
        }                
    } 

});


Ext.define('ProtoUL.view.form.MenuOption', {
    extend: 'Ext.window.Window',
    alias: 'widget.menuOption',

    constructor: function (config) {

        var formPanelCfg = {
            xtype: 'form',
            frame: true,
            constrain: true, 
            bodyPadding: '5 5 0',
            width: 400,

            fieldDefaults: {
                msgTarget: 'side',
                labelWidth: 75
            },
            defaults: {
                anchor: '100%'
            },
    
            items: [{
                xtype:'fieldset',
                title: 'Basic Information',
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items :[{
                    fieldLabel: 'text',
                    afterLabelTextTpl: _requiredField,
                    name: 'text',
                    allowBlank:false
                },{
                    fieldLabel: 'option',
                    afterLabelTextTpl: _requiredField,
                    name: 'protoOption', 
                    allowBlank:false, 
                    
                    __ptType: "formField",
                    editable: true, 
                    xtype: "protoZoom", 
                    zoomModel: "protoLib.ProtoDefinition"                    
                }]
            },{
                xtype:'fieldset',
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items :[{
                    fieldLabel: 'iconCls',
                    name: 'iconCls'
                }, {
                    fieldLabel: 'qtip',
                    name: 'qtip'
                }, {
                    fieldLabel: 'qtitle',
                    name: 'qtitle'
                }]
            }],
    
            buttons: [{
                text: 'Cancel', 
                scope : this, 
                handler : this.onCancel 
            },{
                text: 'Save', 
                scope : this, 
                handler : this.onSave 
            }]
        };
        
        this.callParent([Ext.apply({
            titleTextAdd: 'Add Event',
            titleTextEdit: 'Edit Event',
            width: 600,
            autocreate: true,
            border: true,
            closeAction: 'hide',
            modal: false,
            resizable: false,
            buttonAlign: 'left',
            savingMessage: 'Saving changes...',
            deletingMessage: 'Deleting event...',
            layout: 'fit',
            items: formPanelCfg
        }, config)]);
    },

    initComponent: function () {
        this.callParent();
        this.formPanel = this.items.items[0];
    },

    onCancel: function () {
        this.close() 
    },


    onSave: function () {
        if (!this.formPanel.form.isValid()) { return; }
        var tNode = this.formPanel.getForm().getValues()
        tNode.leaf = true
        this.treeRecord.appendChild( tNode )
        this.close() 
    }

});

