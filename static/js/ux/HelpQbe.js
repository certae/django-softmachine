﻿Ext.define('Ext.ux.HelpQbe', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.HelpQbe',

    triggerCls: Ext.baseCSSPrefix + 'form-search-trigger',
    autoWidth: true,
    isLoaded: false,

    initComponent: function() {

        var me = this;
        me.myMeta = _SM._cllPCI[me.viewCode];
        me.createHelpWindow(me);
        this.callParent(arguments);

        this.on('specialkey', function(f, e) {
            if (e.getKey() == e.ENTER) {

                this.enterKey();
            }
        }, this);

    },

    createHelpWindow: function(me) {

        Ext.define('Model_' + me.fieldLabel, {
            extend: 'Ext.data.Model',
            fields: ['' + me.name]

        });

        this.myStore = Ext.create('Ext.data.Store', {
            model: 'Model_' + me.fieldLabel,
            proxy: {
                type: 'ajax',
                url: _SM._PConfig.urlHelpQbe,
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'totalCount'
                },
                actionMethods: {
                    read: 'POST'
                },
                extraParams: {
                    query: me.myMeta.sql,
                    field: me.name
                }
            },
            autoLoad: false
        });

        var HelpGrid = Ext.create('Ext.grid.Panel', {
            region: 'center',
            store: this.myStore,
            columns: [{
                text: me.fieldLabel,
                dataIndex: me.name,
                flex: 1
            }],
            height: 400,
            width: 400,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.myStore,
                displayInfo: true,
                displayMsg: _SM.__language.HelpQBE_GridNav_DisplayMsg,
                emptyMsg: _SM.__language.HelpQBE_GridNav_EmptyMsg
            })
        });

        HelpGrid.on({
            itemdblclick: {
                fn: function(el, record, item, index, e, eOpts) {
					me.selectValue();
                },
                scope: me
            }
        });

        me.win = Ext.widget('window', {
            title: _SM.__language.HelpQBE_Window_Title + ' : ',
            closeAction: 'hide',
            modal: true,
            width: 400,
            minWidth: 400,
            height: 400,
            minHeight: 400,
            resizable: true,
            layout: {
                type: 'border'

            },

            items: [{
                xtype: 'toolbar',
                items: [{
                    height: 25,
                    xtype: 'textfield',
                    flex: 1,
                    validator: function(value) {
                        if (value == "") {
                            this.up('toolbar').down('container[name=_TOOLS_]').disable();
                        } else {
                            this.up('toolbar').down('container[name=_TOOLS_]').enable();
                        }
                        return true;
                    }

                }, {
                    xtype: 'container',
                    name: '_TOOLS_',
                    disabled: true,
                    items: [{
                        xtype: 'button',
                        width: 25,
                        text: '>',
                        tooltip: _SM.__language.HelpQBE_Tooltip_PlusThan_Button,
                        handler: function() {
							this.up('window').addText(this);
                        }

                    }, {
                        xtype: 'button',
                        width: 25,
                        text: '<',
                        tooltip: _SM.__language.HelpQBE_Tooltip_LessThan_Button,
                        handler: function() {
							this.up('window').addText(this);
                        }

                    }, {
                        xtype: 'button',
                        width: 25,
                        text: '>=',
                        tooltip: _SM.__language.HelpQBE_Tooltip_PlusEqualThan_Button,
                        handler: function() {
							this.up('window').addText(this);
                        }

                    }, {
                        xtype: 'button',
                        width: 25,
                        text: '<=',
                        tooltip: _SM.__language.HelpQBE_Tooltip_LessEqualThan_Button,
                        handler: function() {
							this.up('window').addText(this);
                        }

                    }, {
                        xtype: 'button',
                        width: 25,
                        text: '<>',
                        tooltip: _SM.__language.HelpQBE_Tooltip_Different_Button,
                        handler: function() {
							this.up('window').addText(this);
                        }

                    }, {
                        xtype: 'button',
                        width: 25,
                        text: ':',
                        tooltip: _SM.__language.HelpQBE_Tooltip_Between_Button,
                        handler: function() {
							this.up('window').addText(this);
                        }

                    }, {
                        xtype: 'button',
                        width: 25,
                        text: '*',
                        tooltip: _SM.__language.HelpQBE_Tooltip_Containing_Button,
                        handler: function() {
							this.up('window').addText(this);
                        }

                    }]
                }],
                region: 'north'
            }, HelpGrid],

            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                defaults: {
                    minWidth: 75
                },
                items: [{
                    xtype: 'tbtext',
                    text: '',
                    id: me.idStBar
                }, {
                    xtype: 'component',
                    flex: 1
                }, {
                    xtype: 'button',
                    text: _SM.__language.Text_Accept_Button,
                    scope: me,
                    handler: me.doReturn,
                    iconCls: 'icon-accept'
                }, {
                    xtype: 'button',
                    text: _SM.__language.Text_Cancel_Button,
                    scope: me,
                    handler: doCancel,
                    iconCls: 'icon-cancel'
				}]
            }],

            addText: function(el) {
                var text = this.down('textfield').getValue();
                var text2 = "";
				for (var i = 0; i < text.length; i++) {
                    var c = text.substring(i, i + 1);
                    if (!(c == '>' || c == '<' || c == '=' || c == '*')) {
                        if (c == ':') {
                            break;
                        } else {
                            text2 = text2 + c;
                        }

                    }

                }
                switch (el.text) {
                    case ':':

                        this.down('textfield').setValue(text2 + "" + el.text);
                        break;
                    case '*':

                        this.down('textfield').setValue(el.text + "" + text2 + "" + el.text);
                        break;

                    default:

                        this.down('textfield').setValue(el.text + "" + text2);

                }

            }

        });

        me.isLoaded = true;

        function doCancel() {
			me.win.hide();
        }

    },

    onTriggerClick: function() {

        this.showHelpForm(this);
    },

    showHelpForm: function(me) {
		if (!me.isLoaded) {
            return me.win.show();
		}
        me.win.down('textfield').setValue(me.getValue());
        me.myStore.load();
    },

    selectValue: function() {

        var records = this.win.down('gridpanel').getSelectionModel().getSelection();

        var record = records[0];

        var text = this.win.down('textfield').getValue();

		var op = text.substring(text.length - 1, text.length);
        if (op == ':') {
            this.win.down('textfield').setValue(text + record.data[this.name]);
        } else {
            this.win.down('textfield').setValue(record.data[this.name]);
        }

    },

    doReturn: function() {

        this.setValue(this.win.down('textfield').getValue());
		this.win.hide();
    }
 });