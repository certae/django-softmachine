/*
 * Author: Dario Gomez . CERTAE - ULaval

 */


Ext.define('ProtoUL.proto.ProtoToolBar', {
    extend  : 'Ext.Toolbar',
    alias   : 'widget.protoToolBar',

    initComponent : function() {

        var me = this
        me.addEvents('save', 'cancel', 'addField');

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
                iconCls : "icon-tableAdd",
                itemId  : "addField"
            },"-",{
                tooltip : "Delet current field",
                iconCls : "icon-tableDelete",
                itemId  : "deleteField"
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

    
});
