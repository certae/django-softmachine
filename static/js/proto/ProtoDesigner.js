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
        _SM.loadJsonConfig('json/Designer.panels.json', options)


        function onClickRedraw(myObj) {
            // console.log( 'this')         } 


    },

    updateFormTree : function() {
        // Genera el arbol a partir de la meta 
        var treeData = Meta2Tree( this.myMeta.protoForm, 'protoForm', 'protoForm'  )
        treeData.expanded = true

        this.formTree.getStore().setRootNode( treeData ) 

    }, 

    onClickRedraw : function(myObj) {
        // console.log( 'this')     }, 
    
    doFormatLayout : function(myObj) {

        var me = this

        this.toolsPanel = me.down('#toolsPanel')
        this.toolsTabs = me.down('#toolsTabs')
        this.formTree = me.down('#formTree')
        this.formPreview = me.down('#formPreview')
        
        this.formController = Ext.create('ProtoUL.UI.FormController', { myMeta : me.myMeta });
        this.formPreview.add( this.formController.newProtoForm() )  

        this.tBar =  this.toolsPanel.addDocked({
            xtype : 'toolbar',
            dock : 'top',
            items : myObj.tbar
        })[0];

        this.toolsTabs.add(myObj.toolsTabs);
        this.toolsTree = this.toolsTabs.down('#toolsTree')
        

        // *******************   Properties 
                
        var propsGrid = Ext.create('ProtoUL.ux.ProtoProperty', {});
        this.properties = this.toolsTabs.down('#properties')
        this.properties.add( propsGrid ) 
        this.properties = propsGrid


        propsGrid.on({
            'edit': function ( editor, e, eOpts) {

                if ( e.value == e.originalValue ) return; 

                var oData = me.treeRecord.data.__ptConfig 
                var prpName = e.record.data.name

                // ****  Solo llegan objetos, los Array se manejan en otro lado
                if ( _SM.typeOf(oData) ==  "object") 
                    oData[ prpName ]  = e.value 

            }, 
            scope: me }
        );


        /* Se podrian cargar directamente desde el json, dejando un hook en el store y asignandolo
         * antes de crear el componente. 
         */

        _SM.defineProtoPclTreeModel()
        
        var treeData = _SM.clone ( myObj.toolsTree )


        function getTreeNodeByText( treeData, textKey ) {
            // recupera un nodo del arbol segun su texto, para los fields y los details  
            for (var ix in treeData ) {
                var vNod  =  treeData[ix];
                if ( vNod.text == textKey ) return vNod 
            }
            // No deberia nunca llegar aqui 
            return {}
        }

        // Agrega los campos de la pci particular 
        var treeNodAux = getTreeNodeByText( treeData,  'Fields' )  
        for (var ix in this.myMeta.fields ) {
            var vFld  =  this.myMeta.fields[ix];
            var ptConfig =  _SM.getFormFieldDefinition( vFld )
            ptConfig['name']  = vFld.name
            var treeNodAuxData = {
                "text": vFld.name ,
                "qtip": vFld.cellToolTip,
                "__ptType": "formField",
                "leaf": true, 
                "__ptConfig": ptConfig 
            }
            treeNodAux.children.push( treeNodAuxData )
        }

        // Agrega los detalles 
        var treeNodAux = getTreeNodeByText( treeData,  'Details' )  
        for (var ix in this.myMeta.protoDetails ) {
            var vFld  =  this.myMeta.protoDetails[ix];
            var treeNodAuxData = {
                "text": vFld.menuText ,
                "qtip": vFld.toolTip,
                "__ptType": "protoGrid",
                "leaf": true, 
                "__ptConfig": {
                    "menuText" : vFld.menuText, 
                    "protoOption" : vFld.conceptDetail ,
                    "masterField" : vFld.masterField,
                    "detailField" : vFld.detailField, 
                    "detailTitleLbl" : vFld.detailTitleLbl, 
                    "detailTitleField" : vFld.detailTitleField, 
                    "masterTitleField" : vFld.masterTitleField, 
                    "xtype": "protoGrid",
                    "__ptType": "protoGrid"
                }
            }
            treeNodAux.children.push( treeNodAuxData )
        }


        //  -----------------------------------
        // Crea el store 
        var treeStore = Ext.create('Ext.data.TreeStore', {
            model : 'Proto.PclTreeNode', 
            root : {
                expanded : true,
                children : treeData
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


        // ------------------------------------------------

        var treeStore = Ext.create('Ext.data.TreeStore', {
            model : 'Proto.PclTreeNode', 
            root : {
                expanded : true,
                text: _SM.__language.Title_Main_Panel,
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

        var formTreeView = this.formTree.getView()
        this.formTreeViewId = formTreeView.id

        formTreeView.on({
            'beforedrop' : {
                fn : function(node, data, overModel, dropPosition, dropHandler, eOpts) {
                    
                    // Verifica q el objeto sea valido ( no puede copiar las categorias ni los items  )
                    if(data.view.id != this.formTreeViewId) {
                        var rec = data.records[0]
                        var ptType = rec.get('text') 
                        if ( ptType in  _SM.objConv(['Fields', 'Containers', 'Grids']))
                            return false

                        if ( ptType in _SM.objConv( ['htmlset', 'fieldset'])) {

                            // Obtiene el padre y el ix
                            var nParent = overModel.store.getById( overModel.data.parentId )
                            var nIndex = overModel.data.index

                            if ( !nParent ) nParent = overModel 
                            if ( dropPosition == 'after' ) nIndex += 1 
                            
                            dropHandler.cancelDrop()

                            // Crea un nodo 
                            var tNode = getNodeBase( ptType, ptType, { '__ptType' : ptType } )
                            nParent.insertChild( nIndex, tNode )                            
                            
                        }

                        // El drop genera una copia del mismo registro siempre                             
                        data.copy = true
                    }

                }
            },
            scope : this
        });


        this.formTree.on({
            'select': function ( rowModel , record,  rowIndex,  eOpts ) {
                    // Guarda el registro actico, para actualizarlo mas tarde 
                    me.treeRecord  = record;
                    
                    // prepara las propiedades corresponidnetes, 
                    // debe cpia las props por defecto de la pcl 
                    prepareProperties( record , me.myMeta,  me.properties  );
                } , scope: me }
        );


        // Para manejar los botones dinamicamente addListener 
        
        // EL wizzard utiliza Ext.element.loader para cargar dinamicamenta la definicion a partir de una URL
        // la URL ya probe q puede ser un archivo json,  
        
        // revisar en el ejemplo como usar  jsonForm y jsonPropertyGrid   codepress  
        var btRedraw = this.tBar.down( '#redraw');
        btRedraw.on('click',
            function(  btn , event,  eOpts) {
                
                this.formPreview.removeAll( true )
                
                var formMeta =  Tree2Meta( this.formTree.store.getRootNode() )
                this.myMeta.protoForm = formMeta
                this.formController.myMeta.protoForm = formMeta  
                 
                this.formPreview.add( this.formController.newProtoForm()  )
                
            },me   );


        var btSave = this.tBar.down( '#save');
        btSave.on('click',
            function(  btn , event,  eOpts) {

                var formMeta =  Tree2Meta( this.formTree.store.getRootNode() )
                this.myMeta.protoForm = formMeta

                _SM.savePclCache( this.myMeta.protoOption, this.myMeta )
                _SM.savePci( this.myMeta )         
            },me   );


        var btDel = this.tBar.down( '#delete');
        btDel.on('click',
            function(  btn , event,  eOpts) {
                // var ptType = me.treeRecord.data.__ptType
                me.treeRecord.remove( )
            },me   );

    },
    
    
    //  ==============================================================================
    
    
    getPanelItems: function() {

        // this.myForm = Ext.widget('protoform', {
            // myMeta : this.myMeta  
        // });  

        return  [{
            region : 'center',
            layout : 'fit',
            itemId : 'formPreview',
            // items : this.myForm, 
            // autoScroll : true,
            flex : 2,
            minSize : 200
        }, {
            region : 'west',
            collapsible : true,
            split : true,
            flex : 1,
            title: _SM.__language.Title_Form_Panel,
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
                title: _SM.__language.Title_Panel_Tools
            }]
        }]
            
    }
    
    
});
