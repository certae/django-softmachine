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

        // Opciones del llamado AJAX
        var options = {
            scope : me,
            success : function(result, request) {
                var myObj = Ext.decode(result.responseText);
                this.doFormatLayout(myObj)
            }
        }
        loadJsonConfig('json/Designer.panels.json', options)

    },
    
    doFormatLayout : function(myObj) {

        this.toolsPanel.addDocked({
            xtype : 'toolbar',
            dock : 'top',
            items : myObj.tbar
        });

        this.toolsTabs.add(myObj.toolsTabs);
        this.toolsTree = this.toolsTabs.down('#toolsTree')

        /* Se podrian cargar directamente desde el json, dejando un hook en el store y asignandolo
         * antes de crear el componente. 
         */

        Ext.define('MetaDesigner', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'text', type: 'string'},
                {name: 'pType',  type: 'string'},
                {name: 'config'}
            ]
        });


        var treeStore = Ext.create('Ext.data.TreeStore', {
            model : 'MetaDesigner', 
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


        toolsTree.on({
            'select': {fn: function ( rowModel , record,  rowIndex,  eOpts ) {
                var a = 1
                } , scope: this }}
        );


        // ------------------------------------------------

        var treeStore = Ext.create('Ext.data.TreeStore', {
            model : 'MetaDesigner', 
            root : {
                expanded : true,
                text : 'RootPanel',
                children : []
            }
        });

        var formTree = Ext.create('Ext.tree.Panel', {
            layout : 'fit',
            itemId : 'formTree',
            store : treeStore,
            autoScroll : true,
            rootVisible : true,
            viewConfig : {
                plugins : {
                    ptype : 'treeviewdragdrop'
                }
            }
        });

        this.formTree.add([formTree]);

        // ------------------------------------------------

        var treeView = formTree.getView()
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


        formTree.on({
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

    },
    
    getPanelItems: function() {

            return  [{
                region : 'center',
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
                    itemId : 'toolsTabs',
                    layout : 'fit',
                    autoScroll : true,
                    minHeight : 150
                }, {
                    region : 'south',
                    layout : 'fit',
                    itemId : 'formTree',
                    collapsible : true,
                    split : true,
                    flex : 1,
                    title : 'Form'
                }]
            }]
            
    }
});
