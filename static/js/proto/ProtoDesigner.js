/*
 * Author: Dario Gomez . CERTAE - ULaval
 * Copyright 2012,
 *
 License: This source is licensed under the terms of the Open Source LGPL 3.0 license.
 Commercial use is permitted to the extent that the code/component(s) do NOT become
 part of another Open Source or Commercially licensed development library or toolkit
 without explicit permission.Full text: http://www.opensource.org/licenses/lgpl-3.0.html

 */


Ext.define('ProtoUL.proto.ProtoDesigner', {
    // extend: 'Ext.panel.Panel',
    extend : 'Ext.container.Container',
    alias : 'widget.protoDesigner',

    //@myMeta
    myMeta : null,   

    initComponent : function() {

        var me = this

        Ext.apply(this, {
            layout : 'border',
            defaults : {
                lauyout : 'fit'
            },
            items : this.getPanelItems()
        });

        me.callParent(arguments);

        this.toolsPanel = me.down('#toolsPanel')
        this.toolsTabs = me.down('#toolsTabs')
        this.formTree = me.down('#formTree')
        this.formPreview = me.down('#formPreview')

        // Opciones del llamado AJAX
        var options = {
            scope : me,
            success : function(result, request) {
                var myObj = Ext.decode(result.responseText);
                
                // Defincion de los objetos del designer 
                this.doFormatLayout(myObj);

                // Definicion del arbol basado en la meta 
                this.updateFormTree()
                
 
            }
        }
        loadJsonConfig('json/Designer.panels.json', options)


        function onClickRedraw(myObj) {
            console.log( 'this') 
        } 


    },

    updateFormTree : function() {
        // Genera el arbol a partir de la meta 
        
        var treeData = FormatMETA( this.myMeta.protoForm, 'protoForm', 'protoForm'  )

        this.formTree.getStore().setRootNode( treeData ) 

    }, 

    onClickRedraw : function(myObj) {
        console.log( 'this') 
    }, 
    
    doFormatLayout : function(myObj) {

        this.tBar =  this.toolsPanel.addDocked({
            xtype : 'toolbar',
            dock : 'top',
            items : myObj.tbar
        })[0];

        this.toolsTabs.add(myObj.toolsTabs);
        this.toolsTree = this.toolsTabs.down('#toolsTree')

        /* Se podrian cargar directamente desde el json, dejando un hook en el store y asignandolo
         * antes de crear el componente. 
         */

        defineProtoPclTreeModel()

        var treeStore = Ext.create('Ext.data.TreeStore', {
            model : 'Proto.PclTreeNode', 
            root : {
                expanded : true,
                children : myObj.toolsTree
            }
        });

        var toolsTree = Ext.create('Ext.tree.Panel', {
            layout : 'fit',
            itemId : 'baseTree',
            store : treeStore,
            // autoScroll : true,
            rootVisible : false,
            viewConfig : {
                plugins : {
                    ptype : 'treeviewdragdrop',
                    enableDrop : false
                }
            }
        });

        this.toolsTree.add(toolsTree);
        this.toolsTree = toolsTree;


        this.toolsTree.on({
            'select': {fn: function ( rowModel , record,  rowIndex,  eOpts ) {
                var a = 1
                } , scope: this }}
        );

        // ------------------------------------------------

        var treeStore = Ext.create('Ext.data.TreeStore', {
            model : 'Proto.PclTreeNode', 
            root : {
                expanded : true,
                text : 'RootPanel',
                children : []
            }
        });

        var formTree = Ext.create('Ext.tree.Panel', {
            layout : 'fit',
            store : treeStore,
            autoScroll : true,
            rootVisible : true,
            viewConfig : {
                plugins : {
                    ptype : 'treeviewdragdrop'
                }
            }
        });

        this.formTree.add( formTree );
        this.formTree = formTree;


        // ------------------------------------------------

        var treeView = this.formTree.getView()
        this.formTreeViewId = treeView.id

        treeView.on({
            'beforedrop' : {
                fn : function(node, data, overModel, dropPosition, dropHandler, eOpts) {
                    if(data.view.id != this.formTreeViewId) {
                        var rec = data.records[0]
                        if(rec.get('text') in  oc(['Fields', 'Containers', 'Grids']))
                            return false
                        data.copy = true
                    }

                }
            },
            scope : this
        });


        this.formTree.on({
            'select': {fn: function ( rowModel , record,  rowIndex,  eOpts ) {
                var a = 1
                // _pGrid.treeRecord  = record;
                // prepareProperties( _pGrid  );
                } , scope: this },

            'beforeedit': {fn: function ( editor, e, eOpts) {
                // console.log( 'beforeEdit')            
                }},

            'validateedit': {fn: function ( editor, e, eOpts) {
                // console.log( 'validateEdit')                 
                }},

            'edit': {fn: function ( editor, e, eOpts) {

            }}, scope: this }
        );


        // Para manejar los botones dinamicamente addListener 
        
        // EL wizzard utiliza Ext.element.loader para cargar dinamicamenta la definicion a partir de una URL
        // la URL ya probe q puede ser un archivo json,  
        
        // revisar en el ejemplo como usar  jsonForm y jsonPropertyGrid   codepress  
        var btRedraw = this.tBar.down( '#redraw');
        btRedraw.on(
            'click',
            function(  btn , event,  eOpts) {
                console.log('abc');
            },this  );


    },
    
    
    //  ==============================================================================
    
    
    getPanelItems: function() {

        this.myForm = Ext.widget('protoform', {
            myMeta : this.myMeta  
        });  

        return  [{
            region : 'center',
            layout : 'fit',
            itemId : 'formPreview',
            items : this.myForm, 
            flex : 2,
            autoScroll : true,
            minSize : 200
        }, {
            region : 'west',
            collapsible : true,
            split : true,
            flex : 1,
            title : 'Tools',
            itemId : 'toolsPanel',
            layout : 'border',
            defaults : {
                lauyout : 'fit'
            },
            items : [{
                region : 'center',
                layout : 'fit',
                itemId : 'formTree',
                autoScroll : true,
                minHeight : 150
            }, {
                region : 'south',
                layout : 'fit',
                itemId : 'toolsTabs',
                collapsible : true,
                split : true,
                flex : 1,
                title : 'Form'
            }]
        }]
            
    }
});
