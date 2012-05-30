
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

		var cPanel = [{
		      region:"center",
		      xtype : 'tabpanel',
		      activeTab : 0,
		      border:false,
		      minHeight : 150,
  	          collapsed:false,
		      items:[{
		         title:"Tools",
		         tooltip : "Design your ui by selecting elements from this tab", 
            	 layout: 'fit',
	             items	: this.getToolsTree()		         
		       },{
		         title:"Properties",
		         tooltip : "Propiedades del elto seleccionado", 
		         xtype : 'propertygrid',
		         border  : false,
		         source: {
		            "type": "??",
		            "subType": "??",
		            "enabled": true,
		            "field": ""
		         }
		       },{
		         xtype : "panel",
		         title:"Fields",
		         tooltip : "Seleccione los campos a partir del modelo"
		       }]
		      },{
		         region: 'south',
            	 layout: 'fit',
		         items : this.getFormTree(), 
		         title: "Form",
		         tooltip : "Tab with Components tree", 
		         split: true,
		         minHeight : 150,
		         height: 170
		   }]

        var panelItems =   [{
                region: 'center',
                flex: 1,
                layout: 'fit',
                minSize: 200,
            }, {
				region: 'east',
			    collapsible: false,
			    collapsed: false ,
			    split: true,
			    flex: 1,
                layout: 'border',
                minSize: 200,
  	          	tbar : this.getToolBar(), 
                items : cPanel 
			}]
			
        Ext.apply(this, {
            layout: 'border',
            items: panelItems 
        });

        this.callParent(arguments);


// 
        // });
	}, 
	
	
	
	getToolBar: function() {
		
		return  [{
            tooltip : 'Clear designarea',
            iconCls:'icon-reset',
            handler: function(){
              // scope.newConfig();
            }
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
            errorText : new Ext.form.Label(),
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
			  text : "Panels",
			  cls : "folder",
			  children : [{
			      text : "Panel",
			      qtip : "A simple panel with default layout",
			      config : {
			        xtype : "panel",
			        title : "Panel"
			      },
			      leaf : true 
			    },{
			      text : "Tab Panel",
			      qtip : "A panel with many tabs",
			      wizard : 'wizard/tabpanel-wiz.json',
			      leaf : true 
			    }]
			},{
			  text : "Layouts",
			  cls : "folder",
			  children : [{
			      text : "Tab Panel",
			      qtip : "Layout containing many elements, only one can be displayed at a time",
			      config : {
			        layout : "card",
			        title : "CardLayout Container",
			        activeItem : 0
			      },
			      leaf : true 
			    },{
			      text : "Absolute Layout",
			      qtip : "Layout containing many elements, absolutely positionned with x/y values",
			      config : {
			        layout : "absolute",
			        title : "AbsoluteLayout Container"
			      },
			      leaf : true 
			    },{
			      text : "Accordion Panel",
			      qtip : "Layout as accordion",
			      wizard: "wizard/accordion-wiz.json",
			      leaf : true 
			    },{
			      text : "Column Layout",
			      qtip : "Layout of columns",
			      wizard : "wizard/column-wiz.json",
			      leaf : true 
			    },{
			      text : "Border Layout",
			      qtip : "Layout with regions",
			      wizard : "wizard/border-wiz.json",
			      leaf : true 
			    }]
			},{
			  text : "Advanced",
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
            rootVisible: true,
            lines: false,
            useArrows: false,
	        viewConfig: {
	            plugins: {
	                ptype: 'treeviewdragdrop'
	                // appendOnly: true
	            }
	        }
	    });


    	return toolsTree 
    }, 

	getFormTree: function() {

		var treeStore  = Ext.create('Ext.data.TreeStore', {
		    root: {
		        expanded: true,
		        children: []
		    }
		});
	
	    var formTree = Ext.create('Ext.tree.Panel', {
	        // id: 'tree2',
	        store: treeStore,
            rootVisible: true,
	        viewConfig: {
	            plugins: {
	                ptype: 'treeviewdragdrop'
	                // appendOnly: true
	            }
	        }
	    });
		
    	return formTree 
		
	}

});

