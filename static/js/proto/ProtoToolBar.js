/*
 * Author: Dario Gomez . CERTAE - ULaval

 */


Ext.define('ProtoUL.proto.ProtoToolBar', {
    extend  : 'Ext.Toolbar',
    alias   : 'widget.protoToolBar',

    initComponent : function() {

        var me = this
        me.addEvents('save', 'preview', 'add', 'del', 'help', 'show1');

        Ext.apply(this, {
            items : [{
                tooltip : "Save preview",
                iconCls : "icon-configPreview", 
                itemId  : "preview", 
                scope   : this,
                handler : function() {  
                    me.fireEvent('preview') 
                    }
            }," ",{
                tooltip : "Update definition",
                iconCls : "icon-save", 
                itemId : "save", 
                scope   : this,
                handler : function() {  
                    me.fireEvent('save') 
                    }
            }," ",{
                tooltip : "reload",
                iconCls : "icon-configReload", 
                itemId : "reload", 
                scope   : this,
                handler : function() {  
                    me.fireEvent('reload') 
                    }
            },"-",{
                tooltip : "Add node ",
                iconCls : "icon-nodeInsert",
                hidden : true, 
                itemId  : "add",
                scope   : this,
                handler : function( btn ) {  
                    me.fireEvent('add', btn.oData ) 
                    }
            },{
                tooltip : "Delet current node",
                iconCls : "icon-nodeDelete",
                hidden : true, 
                itemId  : "del", 
                scope   : this,
                handler : function( btn ) {  
                    me.fireEvent('del', btn.oData ) 
                    }
            },"-",{
                tooltip : "Show current Meta",
                iconCls : "icon-script_gear",
                itemId  : "show1", 
                scope   : this,
                handler : function() {  
                    me.fireEvent('show1') 
                    }
            },"->",{
                iconCls : "icon-help",
                itemId  : "help",
                tooltip : "Show help", 
                scope   : this,
                handler : function() {  
                    me.fireEvent('help') 
                    }
                
            }],
 
        });

        me.callParent(arguments);

    },

  setButton: function( key, bVisible, bEnabled, toolTip , oData ) {
     
    var btn = this.getComponent( key )
    
    btn.setVisible( bVisible )
    btn.setDisabled( ! bEnabled  )
    btn.setTooltip( toolTip  )
    btn.oData = oData 
      
  }   
    
});


function  getSelectorsPanels( elemTree, fieldList  ) {
    
    return   [{
            region: 'center',
            layout: 'fit',
            minSize: 200,
            items: elemTree, 
            border: false,
            flex: 5
        }, {
            region: 'east',
            collapsible: true,
            collapsed: false ,
            split: true,
            layout: 'fit',
            minSize: 200,
            items: fieldList, 
            border: false,
            flex: 2
        }]
    
}
