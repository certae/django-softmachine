/*
 * Author: Dario Gomez . CERTAE - ULaval

 */


Ext.define('ProtoUL.proto.ProtoToolBar', {
    extend  : 'Ext.Toolbar',
    alias   : 'widget.protoToolBar',

    initComponent : function() {

        var me = this
        me.addEvents('save', 'preview', 'add', 'del', 'help', 'show1', 'show2');

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
            }, {
                tooltip : "Show edited Meta",
                iconCls : "icon-script_edit",
                itemId  : "show2", 
                scope   : this,
                handler : function() {  
                    me.fireEvent('show2') 
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
