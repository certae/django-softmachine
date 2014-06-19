/*
 * Author: Dario Gomez . CERTAE - ULaval

 */

/*global Ext, _SM  */

Ext.define('ProtoUL.proto.ProtoToolBar', {
    extend: 'Ext.Toolbar',
    alias: 'widget.protoToolBar',

    initComponent: function() {

        var me = this
        me.addEvents('save', 'preview', 'add', 'del', 'help', 'show1');

        Ext.apply(this, {
            items: [{
                tooltip: _SM.__language.ProtoToolbar_Upd_Def,
                iconCls: "icon-save",
                itemId: "save",
                scope: this,
                handler: function() {
                    me.fireEvent('save')
                }

            // }, " ", {
            //     tooltip: _SM.__language.ProtoToolbar_Save_As,
            //     iconCls: "icon-saveas",
            //     hidden: true,
            //     itemId: "saveas",
            //     scope: this,
            //     handler: function() {
            //         me.fireEvent('saveas');
            //     }

            }, " ", {
                tooltip: _SM.__language.ProtoToolbar_Add_Node,
                iconCls: "icon-nodeInsert",
                hidden: true,
                itemId: "add",
                scope: this,
                handler: function(btn) {
                    me.fireEvent('add', btn.oData)
                }

            }, {
                tooltip: _SM.__language.ProtoToolbar_Del_Current_Node,
                iconCls: "icon-nodeDelete",
                hidden: true,
                itemId: "del",
                scope: this,
                handler: function(btn) {
                    me.fireEvent('del', btn.oData)
                }

                //            },"-",{
                //                tooltip: _SM.__language.ProtoToolbar_Show_Current_Meta,
                //                iconCls : "icon-script_gear",
                //                itemId  : "show1",
                //                scope   : this,
                //                handler : function() {
                //                    me.fireEvent('show1')
                //                    }
                //            },"->",{
                //                iconCls : "icon-help",
                //                itemId  : "help",
                //                tooltip: _SM.__language.ProtoToolbar_Show_Help,
                //                scope   : this,
                //                handler : function() {
                //                    me.fireEvent('help')
                //                    }
            }]

        });

        me.callParent(arguments);

    },

    setButton: function(key, bVisible, bEnabled, toolTip, oData) {

        var btn = this.getComponent(key)

        btn.setVisible(bVisible)
        btn.setDisabled(!bEnabled)
        btn.setTooltip(toolTip)
        btn.oData = oData

    }

});

function getSelectorsPanels(elemTree, fieldList) {

    return [{
        region: 'center',
        layout: 'fit',
        minSize: 200,
        items: elemTree,
        border: false,
        flex: 5
    }, {
        region: 'east',
        collapsible: true,
        collapsed: false,
        split: true,
        layout: 'fit',
        minSize: 200,
        items: fieldList,
        border: false,
        flex: 2
    }]

}
