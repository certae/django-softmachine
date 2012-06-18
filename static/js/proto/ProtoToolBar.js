/*
 * Author: Dario Gomez . CERTAE - ULaval

 */


Ext.define('ProtoUL.proto.ProtoToolBar', {
    extend  : 'Ext.Toolbar',
    alias   : 'widget.protoToolBar',

    initComponent : function() {

        var me = this
        me.addEvents('save', 'cancel', 'add', 'del');

        Ext.apply(this, {
            items : [{
                tooltip : "Update definition",
                iconCls : "icon-save", 
                itemId : "save", 
                scope   : this,
                handler : function() {  
                    me.fireEvent('save') 
                    }
            }," ",{
                tooltip : "Cancel updata",
                iconCls : "icon-cancel", 
                itemId  : "cancel"
            },"-",{
                tooltip : "Add field ( Udp's )",
                iconCls : "icon-nodeInsert",
                hidden : true, 
                itemId  : "add",
                scope   : this,
                handler : function( btn ) {  
                    me.fireEvent('add', btn.oData ) 
                    }
            }," ",{
                tooltip : "Delet current field",
                iconCls : "icon-nodeDelete",
                hidden : true, 
                itemId  : "del", 
                scope   : this,
                handler : function( btn ) {  
                    me.fireEvent('del', btn.oData ) 
                    }
                
            },"-",{
                tooltip : "Show Meta (JSON)",
                iconCls : "icon-script_gear",
                itemId  : "showMeta"
            },"->",{
                "iconCls" : "icon-help",
                "itemId"  : "help",
                "tooltip" : "Show help"
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
