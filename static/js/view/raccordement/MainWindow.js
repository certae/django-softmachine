/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.view.raccordement.MainWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.raccordementMainWindow',
	itemId: 'raccordementMainWindow',
	
    layout: {
        type: 'vbox'
    },
    selectedModel: null,
    
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
            {
                xtype: 'raccordementGridPanel'
            }, {
                xtype: 'listRaccordementGrid',
                layout: 'fit'
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
