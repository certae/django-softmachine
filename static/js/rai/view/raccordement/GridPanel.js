/**
 * @author Giovanni Victorette
 */
Ext.define('RAI.view.raccordement.GridPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.raccordementGridPanel',
    itemId: 'raccordementGridPanel',

    layout: {
        type: 'hbox',
        align: 'stretch',
        padding: 5
    },
    defaults: {
        flex: 1
    },
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                xtype: 'gridpanel',
                store: 'ElementsDonneeLeftGrid',
                itemId: 'gridLeft',
                iconCls: 'icon-grid',
                frame: true,
                features: [Ext.create('Ext.grid.feature.Grouping', {
                    groupHeaderTpl: 'Entity: {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'
                })],
                selModel: Ext.create('Ext.selection.CheckboxModel', {
                    injectCheckbox: 'last'
                }),
                columns: [{
                    text: 'Attribute',
                    flex: 1,
                    dataIndex: 'attributeName'
                }, {
                    text: 'Entity',
                    flex: 1,
                    dataIndex: 'entityName'
                }],
                listeners: {
                    afterrender: function() {
                        this.setLoading(true);
                    }
                }
            }, {
                xtype: 'gridpanel',
                store: 'ElementsDonneeRightGrid',
                itemId: 'gridRight',
                iconCls: 'icon-grid',
                frame: true,
                features: [Ext.create('Ext.grid.feature.Grouping', {
                    groupHeaderTpl: 'Entity: {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'
                })],
                selModel: Ext.create('Ext.selection.CheckboxModel', {
                    injectCheckbox: 'last'
                }),
                columns: [{
                    text: 'Attribute',
                    flex: 1,
                    dataIndex: 'attributeName'
                }, {
                    text: 'Entity',
                    flex: 1,
                    dataIndex: 'entityName'
                }],
                listeners: {
                    afterrender: function() {
                        this.setLoading(true);
                    }
                }
            }],
            fbar: [{
                type: 'button',
                text: 'Raccorder',
                itemId: 'btRaccorderElements'
            }]
        });

        me.callParent(arguments);
    }
});
