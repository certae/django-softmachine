/**
 * @class ProtoUL.ux.ProtoZoomGrid
 * @extends Ext.grid.Panel
 * <p>A GridPanel with search TB  </p>
 * @author Dario Gomez 
 */


Ext.define('ProtoUL.ux.ProtoZoomGrid', {
    extend: 'Ext.grid.Panel',
    requires: [],
    
    /**
     * @private
     * MetaData  initialization
     */
	protoMeta: null, 

    
    
    // Component initialization override: adds the top and bottom toolbars and setup headers renderer.
    initComponent: function() {
        var me = this;

        var searchBG = Ext.create('ProtoUL.ux.ProtoSearchBG', {
	                 protoMeta: _META
	               })
        
     	me.tbar = searchBG  
        me.callParent(arguments);
        
        searchBG.on({
            loadData: {fn: function ( searchBG , sFilter, sTitle ) {
				console.log ( sFilter, sTitle )             	
            	}, scope: this }
        });                 
        
    }
    

});