
/* Button features:
     BOTON CON POP DE CONFIRMACION
 * - observe selection changes to enable/disable the button using enableFn()
 * - pop up confirmation dialog using confirmMsg()
  */
Ext.define('PVE.button.Button', {
    extend: 'Ext.button.Button',
    alias: 'widget.pveButton',

    // the selection model to observe
    selModel: undefined,

    // if 'false' handler will not be called (button disabled)
    enableFn: function (record) {},

    // function(record) or text
    confirmMsg: false,

    // take special care in confirm box (select no as default).
    dangerous: false, 

    initComponent: function () {
        /*jslint confusion: true */

        var me = this;

        if (me.handler) {
            me.realHandler = me.handler;

            me.handler = function (button, event) {
                var rec, msg;
                if (me.selModel) {
                    rec = me.selModel.getSelection()[0];
                    if (!rec || (me.enableFn(rec) === false)) {
                        return;
                    }
                }

                if (me.confirmMsg) {
                    msg = me.confirmMsg;
                    if (Ext.isFunction(me.confirmMsg)) {
                        msg = me.confirmMsg(rec);
                    }
                    Ext.MessageBox.defaultButton = me.dangerous ? 2 : 1;
                    Ext.Msg.show({
                        title: gettext('Confirm'),
                        icon: me.dangerous ? Ext.Msg.WARNING : Ext.Msg.QUESTION,
                        msg: msg,
                        buttons: Ext.Msg.YESNO,
                        callback: function (btn) {
                            if (btn !== 'yes') {
                                return;
                            }
                            me.realHandler(button, event, rec);
                        }
                    });
                } else {
                    me.realHandler(button, event, rec);
                }
            };
        }

        me.callParent();

        if (me.selModel) {

            me.mon(me.selModel, "selectionchange", function () {
                var rec = me.selModel.getSelection()[0];
                if (!rec || (me.enableFn(rec) === false)) {
                    me.setDisabled(true);
                } else {
                    me.setDisabled(false);
                }
            });
        }
    }
});


//  -------------------------------------------------------------------------------------------

Ext.define('PVE.qemu.SendKeyMenu', {
    extend: 'Ext.button.Button',
    alias: ['widget.pveQemuSendKeyMenu'],

    initComponent: function () {
        var me = this;

        if (!me.nodename) {
            throw "no node name specified";
        }

        if (!me.vmid) {
            throw "no VM ID specified";
        }

        var sendKey = function (key) {
            PVE.Utils.API2Request({
                params: {
                    key: key
                },
                url: '/nodes/' + me.nodename + '/qemu/' + me.vmid + "/sendkey",
                method: 'PUT',
                waitMsgTarget: me,
                failure: function (response, opts) {
                    Ext.Msg.alert('Error', response.htmlStatus);
                }
            });
        };

        Ext.apply(me, {
            text: 'SendKey',
            menu: new Ext.menu.Menu({
                height: 200,
                items: [{
                    text: 'Tab',
                    handler: function () {
                        sendKey('tab');
                    }
                }, {
                    text: 'Ctrl-Alt-Delete',
                    handler: function () {
                        sendKey('ctrl-alt-delete');
                    }
                }, {
                    text: 'Ctrl-Alt-Backspace',
                    handler: function () {
                        sendKey('ctrl-alt-backspace');
                    }
                }, {
                    text: 'Ctrl-Alt-F1',
                    handler: function () {
                        sendKey('ctrl-alt-f1');
                    }
                }, {
                    text: 'Ctrl-Alt-F2',
                    handler: function () {
                        sendKey('ctrl-alt-f2');
                    }
                }, {
                    text: 'Ctrl-Alt-F3',
                    handler: function () {
                        sendKey('ctrl-alt-f3');
                    }
                }, {
                    text: 'Ctrl-Alt-F4',
                    handler: function () {
                        sendKey('ctrl-alt-f4');
                    }
                }, {
                    text: 'Ctrl-Alt-F5',
                    handler: function () {
                        sendKey('ctrl-alt-f5');
                    }
                }, {
                    text: 'Ctrl-Alt-F6',
                    handler: function () {
                        sendKey('ctrl-alt-f6');
                    }
                }, {
                    text: 'Ctrl-Alt-F7',
                    handler: function () {
                        sendKey('ctrl-alt-f7');
                    }
                }, {
                    text: 'Ctrl-Alt-F8',
                    handler: function () {
                        sendKey('ctrl-alt-f8');
                    }
                }, {
                    text: 'Ctrl-Alt-F9',
                    handler: function () {
                        sendKey('ctrl-alt-f9');
                    }
                }, {
                    text: 'Ctrl-Alt-F10',
                    handler: function () {
                        sendKey('ctrl-alt-f10');
                    }
                }, {
                    text: 'Ctrl-Alt-F11',
                    handler: function () {
                        sendKey('ctrl-alt-f11');
                    }
                }, {
                    text: 'Ctrl-Alt-F12',
                    handler: function () {
                        sendKey('ctrl-alt-f12');
                    }
                }]
            })
        });

        me.callParent();
    }
});
