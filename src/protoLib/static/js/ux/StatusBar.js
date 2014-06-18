/*
 * Basada en  Examples.Ux.statusBar
 *
 * Modif :
 *
 *      showBusy  -->  showBusyI  ( internal )
 *      showBusy ( text ,  clearTemp  ) para autolimpiar el status
 *
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.ux.StatusBar', {
    extend: 'Ext.toolbar.Toolbar',
    alternateClassName: 'Ext.ux.StatusBar',
    alias: 'widget.statusbar',
    requires: ['Ext.toolbar.TextItem'],
    cls: 'x-statusbar',

    busyIconCls: 'x-status-busy',
    busyText: _SM.__language.StatusBar_Message_Loading,
    autoClear: 5000,
    emptyText: '&#160;',
    activeThreadId: 0,

    // defaults to use when the status is cleared:
    defaultText: '',
    // defaultIconCls: 'x-status-valid',

    // values to set initially:
    text: _SM.__language.StatusBar_Message_Ready,
    iconCls: 'ready-icon',

    // Para manejar las cargas de datos del servidor
    busyCount: 0,

    initComponent: function() {

        var right = this.statusAlign === 'right';
        this.callParent(arguments);
        this.currIconCls = this.iconCls || this.defaultIconCls;
        this.statusEl = Ext.create('Ext.toolbar.TextItem', {
            cls: 'x-status-text ' + (this.currIconCls || ''),
            text: this.text || this.defaultText || ''
        });
        if (right) {
            this.cls += ' x-status-right';
            this.add('->');
            this.add(this.statusEl);
        } else {
            this.insert(0, this.statusEl);
            this.insert(1, '->');
        }

        // any standard Toolbar items:
        this.add([{
            itemId: 'btClearCache',
            xtype: 'button',
            text: _SM.__language.StatusBar_Text_Clean_Button + ' cache',
            tooltip: _SM.__language.StatusBar_Tooltip_Clean_Button,
            iconCls: 'comment_delete',
            handler: function() {
                this.tooltip = '';
                this.ownerCt.clearStatus({
                    useDefaults: true
                });
                _SM.__TabContainer.closeAllTabs();
                _SM._cllPCI = {};
            }
        }, {
            itemId: 'openTaskForm',
            xtype: 'button',
            text: _SM.__language.StatusBar_Text_Task_Button,
            hidden: true,
            scope: this,
            iconCls: 'taskManager',
            handler: this.openTaskForm

        }, '-', {

            xtype: 'splitbutton',
            text: _SM._UserInfo.fullName || _SM._UserInfo.userName,
            iconCls: 'icon-user',
            menu: new Ext.menu.Menu({
                items: [{
                    text: _SM.__language.StatusBar_Text_Close_Session,
                    handler: this.closeSession,
                    iconCls: 'icon-logout'
                }]
            })
        }]);

        // TODO: Boton q permita clear del sb y guarde en el tooltip la informacion de errores
        this.errBt = this.getComponent('btClearCache');

    },

    command: function() {
        Ext.MessageBox.prompt('Comando', 'Digite El Comando', function(btn, nemo) {
            if (btn == 'ok') {

            }
        }, this, false, ValorPrompt);
    },

    closeSession: function() {
        Ext.Ajax.request({
            url: _SM._PConfig.urlLogOut,
            success: function(response) {
                location.reload(true);
            },
            failure: function() {
                location.reload(true);
            }
        });
    },

    clearErrCount: function() {
        // this.errBt.hide()

        this.errBt.tooltip = '';
        this.busyCount = 0;
        this.clearStatus({
            useDefaults: true
        });
    },

    setStatus: function(o) {
        var me = this;
        o = o || {};

        var a = me.isLayoutSuspended();

        Ext.suspendLayouts();

        if (Ext.isString(o)) {
            o = {
                text: o
            };
        }
        if (o.text !== undefined) {
            me.setText(o.text);
        }
        if (o.iconCls !== undefined) {
            me.setIcon(o.iconCls);
        }
        if (o.clear) {
            var c = o.clear, wait = me.autoClear, defaults = {
                useDefaults: true,
                anim: true
            };
            if (Ext.isObject(c)) {
                c = Ext.applyIf(c, defaults);
                if (c.wait) {
                    wait = c.wait;
                }
            } else if (Ext.isNumber(c)) {
                wait = c;
                c = defaults;
            } else if (Ext.isBoolean(c)) {
                c = defaults;
            }
            c.threadId = this.activeThreadId;
            Ext.defer(me.clearStatus, wait, me, [c]);
        }
        Ext.resumeLayouts(true);
        return me;
    },

    clearStatus: function(o) {
        o = o || {};
        var me = this, statusEl = me.statusEl;
        if (o.threadId && o.threadId !== me.activeThreadId) {
            return me;
        }
        var text = o.useDefaults ? me.defaultText : me.emptyText, iconCls = o.useDefaults ? (me.defaultIconCls ? me.defaultIconCls : '') : '';
        if (o.anim) {
            statusEl.el.puff({
                remove: false,
                useDisplay: true,
                callback: function() {
                    statusEl.el.show();
                    me.setStatus({
                        text: text,
                        iconCls: iconCls
                    });
                }
            });
        } else {
            me.setStatus({
                text: text,
                iconCls: iconCls
            });
        }
        return me;
    },

    setText: function(text) {
        var me = this;
        me.activeThreadId++;
        me.text = text || '';
        if (me.rendered) {
            me.statusEl.setText(me.text);
        }
        return me;
    },

    getText: function() {
        return this.text;
    },

    setIcon: function(cls) {
        var me = this;
        me.activeThreadId++;
        cls = cls || '';
        if (me.rendered) {
            if (me.currIconCls) {
                me.statusEl.removeCls(me.currIconCls);
                me.currIconCls = null;
            }
            if (cls.length > 0) {
                me.statusEl.addCls(cls);
                me.currIconCls = cls;
            }
        } else {
            me.currIconCls = cls;
        }
        return me;
    },

    showBusyI: function(o) {
        if (Ext.isString(o)) {
            o = {
                text: o
            };
        }
        o = Ext.applyIf(o || {}, {
            text: this.busyText,
            iconCls: this.busyIconCls
        });
        return this.setStatus(o);
    },

    showBusy: function(text, origin, clear) {

        this.showBusyI(text);

        if (clear) {
            Ext.defer(function() {
                this.clearStatus({
                    useDefaults: true
                });
            }, clear, this);
        } else {
            // console.log( 'busy: ' + origin,  text, this.busyCount )
            this.busyCount++;
        }
    },

    showMessage: function(text, origin, clear) {

        var o = {
            text: origin + ' ' + text,
            iconCls: this.iconCls
        };

        if (clear) {
            Ext.defer(function() {
                this.clearStatus({
                    useDefaults: true
                });
            }, clear, this);
        }

        return this.setStatus(o)

    },

    showError: function(text, origin) {

        // console.log( 'error :' + origin  ,  text )
        this.setStatus({
            text: 'Oops! ' + text,
            iconCls: 'x-status-error',
            clear: true
        });

    },

    showWarning: function(text, origin) {

        // console.log( 'warning :' + origin, text )

        this.setStatus({
            text: text,
            iconCls: 'x-status-warning',
            clear: true
        });

    },

    clear: function(text, origin) {

        // console.log( 'clear:' + origin,  text, this.busyCount );
        this.busyCount--;
        if (this.busyCount <= 0) {
            this.busyCount = 0;
            this.clearStatus({
                useDefaults: true
            })
        }

    },

    openTaskForm: function() {

        var taskCont = Ext.create('ProtoUL.protoOrg.tasks.TaskController')
        taskCont.openTaskForm()

    }
}); 