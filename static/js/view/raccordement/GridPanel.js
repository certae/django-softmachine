/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.view.raccordement.GridPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.raccordementGridPanel',
    itemId: 'raccordementGridPanel',

    width: 750,
    height: 300,
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

        // USED FOR TEST
        var groupingFeatureGrid1 = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: 'Entity: {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'
        });
        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: 'Entity: {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'
        });
        // END TEST

        Ext.applyIf(me, {
            items: [{
                xtype: 'gridpanel',
                store: 'ElementsDonneeLeftGrid',
                itemId: 'gridLeft',
                iconCls: 'icon-grid',
                frame: true,
                features: [groupingFeatureGrid1],
                selModel: Ext.create('Ext.selection.CheckboxModel'),
                columns: [{
                    text: 'Attribute',
                    flex: 1,
                    dataIndex: 'attributeName'
                }, {
                    text: 'Entity',
                    flex: 1,
                    dataIndex: 'entityName'
                }]
            }, {
                xtype: 'gridpanel',
                store: 'ElementsDonneeRightGrid',
                itemId: 'gridRight',
                iconCls: 'icon-grid',
                frame: true,
                features: [groupingFeature],
                selModel: Ext.create('Ext.selection.CheckboxModel'),
                columns: [{
                    text: 'Attribute',
                    flex: 1,
                    dataIndex: 'attributeName'
                }, {
                    text: 'Entity',
                    flex: 1,
                    dataIndex: 'entityName'
                }]
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
