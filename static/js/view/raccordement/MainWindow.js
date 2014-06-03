/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.view.raccordement.MainWindow', {
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
            items: [
            {
                xtype: 'raccordementGridPanel',
                flex: 1
            }, {
                xtype: 'listRaccordementGrid',
                selModel: Ext.create('Ext.selection.CheckboxModel'),
                flex: 1
                // layout: 'fit'
            }]
        });
        
        me.addEvents(
            'openModeleRaccordement'
        );
    	me.on('beforeshow', function(){
    		this.fireEvent('openModeleRaccordement', me);
		});

        me.callParent(arguments);
    },
    
    getActiveModel: function() {
    	return this.selectedModel[0];
    }
});
