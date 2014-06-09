/**
 * @author Giovanni Victorette
 */
Ext.define('RAI.view.raccordement.MainWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.raccordementMainWindow',
    itemId: 'raccordementMainWindow',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    selectedModel: null,
    maximizable: true,
    modal: true,
    height: 600,
    width: 800,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                xtype: 'raccordementGridPanel',
                flex: 1
            }, {
                xtype: 'listRaccordementGrid',
                selModel: Ext.create('Ext.selection.CheckboxModel', {
                    injectCheckbox: 'last'
                }),
                flex: 1
            }]
        });

        me.addEvents('openModeleRaccordement');
        me.on('beforeshow', function() {
            this.fireEvent('openModeleRaccordement', me);
        });

        me.callParent(arguments);
    },

    getActiveModel: function() {
        return this.selectedModel[0];
    }
});
