
/*
  * Author: Dario Gomez . CERTAE - ULaval
  * Copyright 2012, 
  *
  License: This source is licensed under the terms of the Open Source LGPL 3.0 license.
  Commercial use is permitted to the extent that the code/component(s) do NOT become
  part of another Open Source or Commercially licensed development library or toolkit
  without explicit permission.Full text: http://www.opensource.org/licenses/lgpl-3.0.html

  */


Ext.define('ProtoUL.ux.ProtoDesigner', {
    // extend: 'Ext.panel.Panel',
    extend: 'Ext.container.Container',
    alias: 'widget.protoDesigner',

    initComponent: function() {

        // Opciones del llamado AJAX 
        var options = {
            scope: this, 
            success: function (  result, request ) {
                var myResult = Ext.decode( result.responseText );

                Ext.apply(this, {
                    layout: 'border',
                    items: panelItems 
                });
                this.callParent(arguments);
        
                var toolsTree  = this.down('#toolsTree')                   
                var formTree  = this.down('#formTree')                   

            }
        }
        
        loadJsonConfig( 'json/Designer.mainPanel.json' , options ) 

        // });
    }, 
    
    
    
    getToolBar: function() {


        
        var toolBarConf =   [{
            tooltip : 'Clear designarea',
            iconCls:'icon-reset',
            // handler: function(){}
          },'-',{
            tooltip : 'Copy JSON to clipboard',
            iconCls :'icon-designcopy',
            // hidden  : !scope.enableCopy || (!window.clipboardData && !window.netscape),

          },{
            tooltip : 'Edit the generated JSON',
            iconCls:'icon-editEl',
          },{
            iconCls : 'icon-show',
            tooltip : 'Show design in window',

          },'-',{
            iconCls : 'icon-undo',
            tooltip : "Undo last change",
            disabled: true
          },{
            iconCls : 'icon-redo',
            tooltip : "Redo last change",
            // id      : scope.redoBtnId,
            // handler : function(){scope.redo();},
            disabled: true
          },{
            iconCls : 'icon-update',
            tooltip : 'Redraw',
            // handler : function(){scope.refresh();}
          },'->',{
            iconCls : 'icon-error',
            tooltip : 'Show or hide(clear) error tab',
            // id      : scope.ErrorId,
            // errorText : new Ext.form.Label(),
            hidden  : true,
            enableToggle : true,
            errors  : [],
            errorCount : 0,
            maxErrors : 60,

          },{
            iconCls : 'icon-options',
            tooltip : 'Show options'
          },{
            iconCls : 'icon-help',
            tooltip : 'Show help'
          }
          ]

        return toolBarConf
    },


    getToolsTree: function() {
        

        var  toolsPanel =  [{
          text : "Fields",
          children : [{
                  text : "Field Set",
                  qtip : "A Fieldset, containing other form elements",
                  leaf : true,  
                  config : {
                    xtype : "fieldset",
                    title : "Legend",
                    autoHeight : true
                      }
                },{
                  text : "Text Area",
                  qtip : "A Text Area",
                  leaf : true, 
                  config : {
                    xtype : "textarea",
                    fieldLabel : "Text",
                    name : "textarea"
                  }, 
                },{
                  text : "Text Label",
                  qtip : "A textlabel",
                  leaf : true, 
                  config : {
                    xtype : "label",
                    text : "Label"
                  }
                },{
                  text : "Button",
                  qtip : "A button",
                  leaf : true, 
                  config : {
                    xtype : "button",
                    text : "Ok"
                  }
                }]
            },{
              text : "Containers",
              cls : "folder",
              children : [{
                  text : "Panel",
                  qtip : "A simple panel with default layout",
                  config : {
                    xtype : "panel",
                    title : "Panel"
                  }
                },{
                  text : "Tab Panel",
                  qtip : "A panel with many tabs",
                  wizard : 'wizard/tabpanel-wiz.json',
                  config : {
                    layout : "card",
                    title : "CardLayout Container",
                    activeItem : 0
                  }
                },{
                  text : "Absolute Layout",
                  qtip : "Layout containing many elements, absolutely positionned with x/y values",
                  config : {
                    layout : "absolute",
                    title : "AbsoluteLayout Container"
                  }
                },{
                  text : "Accordion Panel",
                  qtip : "Layout as accordion",
                  wizard: "wizard/accordion-wiz.json"
                },{
                  text : "Column Layout",
                  qtip : "Layout of columns",
                  wizard : "wizard/column-wiz.json"
                },{
                  text : "Border Layout",
                  qtip : "Layout with regions",
                  wizard : "wizard/border-wiz.json"
                }]
            },{
              text : "Grids",
              children : [{
                  text : "Grid",
                  qtip : "A grid",
                  config : {
                    xtype : "grid",
                    border : false,
                    viewConfig : {
                      forceFit : true
                    },
                    __JSON__ds : "new Ext.data.Store({reader: new Ext.data.ArrayReader({}, [{name: 'comment'}]),data: [['Please set CM and DS properties']]})",
                    __JSON__cm : "new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),{header: 'Comment', width: 120, sortable: true, dataIndex: 'comment'}])"
                  },
                  leaf : true 
                }]
            }]
            
        
        var treeStore  = Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: true,
                children: toolsPanel
            }
        });

        var toolsTree = Ext.create('Ext.tree.Panel', {
            // id: 'tree2',
            store: treeStore,
            rootVisible: false,
            viewConfig: {
                plugins: {
                    ptype: 'treeviewdragdrop', 
                    enableDrop : false 
                    // appendOnly: true
                }
            },
            listeners: {
                drop: function(){ alert("drop") },
                beforedrop: function(){ alert("beforedrop") }
            }
        });

        toolsTree.on({
            'beforeitemmove' : {fn: function ( tree, oldParent, newParent, index,  eOpts ) {
                // return false 
            }},
            scope: this }
        );
        

        return toolsTree 
    }, 

    getFormTree: function() {

        var treeStore  = Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: true,
                text: 'RootPanel', 
                children: []
            }
        });
    
        var formTree = Ext.create('Ext.tree.Panel', {
            // id: 'tree2',
            store: treeStore,
            rootVisible: true,
            viewConfig: {
                plugins: {
                    ptype: 'treeviewdragdrop', 
                    // enableDrag : false 
                    // appendOnly: true
                }
            } 
        });

        var treeView = formTree.getView()
        this.formTreeViewId = treeView.id 
        
        treeView.on({
            'beforedrop' : {fn: function (  node,  data,  overModel,  dropPosition,  dropHandler,  eOpts ) {
                
                if ( data.view.id != this.formTreeViewId ) {
                    var rec =  data.records[0]
                    if ( rec.get('text') in oc(['Fields', 'Containers', 'Grids' ])) return false  
                    data.copy = true
                } 
                      
            }},
            scope: this }
        );
        
        return formTree 
        
    }

});

