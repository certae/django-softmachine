/**
 * @class ProtoUL.ux.WinGridController
 * @author  Dario Gomez

 * Helper class for instancing Independent windows grid 

 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */
/*global ProtoUL */
/*global getSimpleProperties */

Ext.define('ProtoUL.UI.WinGridController', {
    extend: 'Ext.Base',

    // Parametros de entrada
    myMeta: null,
    myGrid: null,
    store: null,

    // * Zoom initialization
    zoomModel: null, 
    zommFilter : '', 

    zoomGrid : null, 
    isLoaded : false,


    constructor: function(config) {
        Ext.apply(this, config || {});
    },    
    
    onTriggerClick : function (  ) {
        this._loadZoom( this.doTriggerClick ) ;
    }, 


    _loadZoom: function( fnBase, opts  ) {
        var me = this,  
            options =  {
                scope: me, 
                success: function ( obj, result, request ) {
                    me.createZoomWindow( me );
                    fnBase.call( me, me, opts );
                },
                failure: function ( obj, result, request) { 
                    return ;  
                }
            };

        if (  _SM.loadPci( me.zoomModel , true, options ) ) {
            me.createZoomWindow( me ); 
            fnBase.call( me, me, opts );
        }   
 
    }, 
    

    createZoomWindow:  function ( me  ){
        // @ZoomRaise 

        function doCancel() {
            me.resetZoom();
            me.win.hide();
        }

        if ( me.isLoaded ) { return; } 

        me.myMeta = _SM._cllPCI[ me.zoomModel ] ; 

        // Crea la grilla 
        this.zoomGrid = Ext.create('ProtoUL.view.ProtoGrid', { 
            viewCode  : me.zoomModel,
            // initialFilter : [{ 'property' : 'pk', 'filterStmt' :  -1 }], 
            initialFilter : [], 
            hideSheet    : true  
         }) ; 
             

        // Para identificar el StatusBar 
        me.idStBar = Ext.id();

        var perms = _SM._UserInfo.perms[ me.myMeta.viewCode ], 
            zoomBtns = [
                    { xtype: 'tbtext', text: '', id: me.idStBar , flex: 1, readOnly : true  },
                    { xtype: 'button', text: 'Ok', scope: me, handler: doCancel } 
                ]; 

        
        // referencia a la ventana modal
        me.win  = Ext.widget('window', {
            title : 'Zoom : ' + me.myMeta.shortTitle,
            
            iconCls: me.myMeta.viewIcon , 
            closeAction : 'hide',
            layout : 'fit',
            modal : true,
            width     : 800,     minWidth  : 400,
            height  : 600,  minHeight : 400, 
            resizable : true,
            items : this.zoomGrid,

            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                defaults: {minWidth: 75},
                items: zoomBtns
            }]            

        });

        me.isLoaded = true;
        this.zoomGrid.setEditMode( true );
        
    }, 
    
    showZoomForm : function(me) {
        if ( ! me.isLoaded  ) { return; }
        
        // TODO: verifica el zoomFilter 
        var myZoomFilter = getFilter();
        if ( myZoomFilter) { if ( myZoomFilter.length > 0 ) {
            this.zoomGrid.store.mySetBaseFilter( myZoomFilter );
        }} 

        me.win.show();
        
        function getFilter() {

            /*  zoomFilter = "field1 : condition ; 
             *                field2 : [refCampoBase]; campo : 'vr'; 
             *                field3 = @functionX( [refCampoBase], [refCampoBase] ); .. "
             *  Ej:          "model_id : @getEntityModel( [entity_id]) "
            */ 
            var myFilter = me.zoomFilter;
            
            if (!me.zoomFilter) {
                return myFilter;
            }
            if (!me.idProtoGrid) {
                return myFilter;
            }  
                        
            // Obtiene los parametros ( campos en el registro base )
            // var lFilters = me.zoomFilter.match(/[^[\]]+(?=])/g)
            var lFilters =    me.zoomFilter.match(/\(([^()]+)\)/g);
            
            if ( lFilters ) if  ( lFilters.length > 0 ) { 

                //obtiene la meta 
                var myGridBase = Ext.getCmp( me.idProtoGrid ); 
                
                // Remplaza en el filtro 
                for ( var i in lFilters ) {
                    var fStmt = lFilters[i].replace('(', '').replace(')', '').split(',');
                    for ( var ix in fStmt ) {
                        var fName = fStmt[ix], 
                            fVal = getValueOrDefault(  myGridBase, fName );
                        
                        myFilter = myFilter.replace( '{0}'.format( fName ),  '{0}'.format( fVal)  );
                     }
                }
            } 

            // Separa el filtro para generar el array 
            myFilter = myFilter.split( ';'); 
            for ( i = 0; i < myFilter.length; i++) {
                var lFilter =  myFilter[i].split(':'); 
                myFilter[i] = { 'property' : lFilter[0].trim(), 'filterStmt' : lFilter[1].trim() };   
            }
            return myFilter;
        }
        
        function getValueOrDefault( myGridBase, fName ) {
            var fVal;
            try {
                if ( myGridBase.rowData ) { 
                    fVal =  myGridBase.rowData[ fName.trim() ];
                } else {
                    fVal  = myGridBase.myFieldDict[ fName.trim() ]['prpDefault'];
                }
            } catch(e)  { fVal = '-1'; } 
 
            return fVal; 
        }
        
    } 
    
});


