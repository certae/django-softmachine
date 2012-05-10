/**
 * @class ProtoUL.ux.ProtoZoom
 * @extends Ext.form.field.Trigger
 * <p>Field with search fk model</p>
 * @author Dario Gomez 
 */

 
Ext.define('Ext.ux.protoZoom', {
    extend : 'Ext.form.field.Trigger',
    alias : 'widget.protoZoom',
    
    /**
     * Zoom initialization
     */
	zoomModel: null, 


    /**
     * @private
     * trigger button cls 
     */
    triggerCls : Ext.baseCSSPrefix + 'form-search-trigger',
    

    /**
     * @private
     * Indica si todos los atributos de configuracion fueron cargados 
     */
    isLoaded : false,
    
    /* 
     * 
     */
    initComponent : function() {

		var me = this; 
		
		// Opciones del llamado AJAX 
		var options = {
			scope: this, 
			success: function ( obj, result, request ) {
				me.createZoomWindow( me )
        	},
            failure: function ( obj, result, request) { 
                return ;  
            }
        }

        if (  loadPci( me.zoomModel , true, options ) ) {
			me.createZoomWindow( me )
        }   

        this.callParent(arguments);
        
        // Para activar el evento con ENTER 
        this.on('specialkey', function(f, e) {
            if (e.getKey() == e.ENTER) {
                this.onTriggerClick( );
            }
        }, this);

        
    },

	createZoomWindow:  function ( me  ){

        me.myMeta = _cllPCI[ me.zoomModel ] ; 

		var zoomGrid = Ext.create('ProtoUL.view.ProtoGrid', { protoConcept : me.zoomModel }) ; 

        zoomGrid.on({
            rowDblClick: {fn: function ( record, rowIndex ) {
            	console.log('rowDblClick', record, rowIndex  )
            }, scope: this }
        });

        zoomGrid.on({
            rowClick: {fn: function ( rowModel, record, rowIndex,  eOpts ) {
            	console.log('rowClick', record, rowIndex  )
            }, scope: this }
        });

        var searchBG = Ext.create('ProtoUL.ux.ProtoSearchBG', {
	                 protoMeta: me.myMeta
	               })
	               
        searchBG.on({
            loadData: {fn: function ( searchBG , sFilter, sTitle ) {
		        zoomGrid.loadData( zoomGrid, sFilter, sTitle );
            }, scope: this }
        });                 
        
        // referencia a la ventana modal
        me.win  = Ext.widget('window', {
            title : 'Zoom : ' + me.myMeta.shortTitle,
            closeAction : 'hide',
            layout : 'fit',
            modal : true,
            width 	: 800, 	minWidth  : 400,
            height  : 600,  minHeight : 400, 
            resizable : true,

			tbar :  searchBG, 
			items : zoomGrid, 

			dockedItems: [{
			    xtype: 'toolbar',
			    dock: 'bottom',
			    ui: 'footer',
			    defaults: {minWidth: 75},
			    items: [
			        { xtype: 'component', flex: 1 },
			        { xtype: 'button', text: 'Button 1' }
			    ]
			}]			

        });

		me.isLoaded = true; 
		
	}, 
    
    onTriggerClick : function( obj ) {
        this.showZoomForm( this );
    },
    
    showZoomForm : function(me) {
        me.win.show();
    }

});


