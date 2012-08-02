/**
 * @class ProtoUL.ux.ProtoZoom
 * @extends Ext.form.field.Trigger
 * <p>Field with search fk model</p>
 * @author Dario Gomez 
 */

/* 
 * Para cargar la info en los campos relacionados en la grilla disparar un evento desde aqui,  al momento de aceptar 
 * Cambiar el text del campo, 
 * 
 * 
 * En la definicion del editor con el protozoom definir una coleccion de id's a los objetos zoom,  y seguir los eventos 
 * 
 * De esta forma en la grilla puedo saber el registro q se esta editando antes del commit y modificar los cmpos necesarios 
 * directamente en el store ( record ) de la grilla 
 * 
 * 
 * Otra posivble soluicion es guardar el Id y asociar la descripcion para luego renderizarla
 * 
 * Verificar si dinamicamente puedo pegar el registro del zoom en el campo para q pueda ser recuperado por el evento beforecommit 
 *  
 */
 
Ext.define('Ext.ux.protoZoom', {
    extend : 'Ext.form.field.Trigger',
    alias : 'widget.protoZoom',
    
    /**
     * Zoom initialization
     */
    zoomModel: null, 


    /**
     * Zoom Record
     */
    zoomRecord: null, 

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

        // Para identificar el StatusBar 
        me.idStBar = Ext.id();

        // Crea la grilla 
        var zoomGrid = Ext.create('ProtoUL.view.ProtoGrid', { protoOption : me.zoomModel }) ; 
        var searchBG = Ext.create('ProtoUL.ux.ProtoSearchBG', { protoMeta: me.myMeta })

        zoomGrid.on({
            rowClick: {fn: function ( rowModel, record, rowIndex,  eOpts ) {
                me.setStatusBar( rowIndex, record )
            }, scope: this }
        });

        zoomGrid.on({
            rowDblClick: {fn: function ( record, rowIndex ) {
                me.setStatusBar( rowIndex, record )
                me.doReturn()
            }, scope: me }
        });

        searchBG.on({
            loadData: {fn: function ( searchBG , sFilter, sTitle ) {
                me.resetZoom()                
                zoomGrid.loadData( zoomGrid, sFilter, sTitle );
            }, scope: this }
        });                 
        

        // referencia a la ventana modal
        me.win  = Ext.widget('window', {
            title : 'Zoom : ' + me.myMeta.shortTitle,
            iconCls: me.myMeta.protoIcon , 
            closeAction : 'hide',
            layout : 'fit',
            modal : true,
            width     : 800,     minWidth  : 400,
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
                    { xtype: 'tbtext', text: '', id: me.idStBar },
                    { xtype: 'component', flex: 1 },
                    { xtype: 'button', text: 'Cancel', scope: me, handler: doCancel   }, 
                    { xtype: 'button', text: 'Ok', scope: me, handler: me.doReturn }
                ]
            }]            

        });

        me.isLoaded = true; 
        
        function doCancel() {
            me.resetZoom() 
            me.win.hide()
        }
        
    }, 
    
    onTriggerClick : function( obj ) {

        this.showZoomForm( this );
    },
    
    showZoomForm : function(me) {
        if ( ! me.isLoaded  ) return 
        me.win.show();
    }, 
    
    setStatusBar: function  ( rowIndex, record ) {
        var stBar = Ext.getCmp( this.idStBar )
        
        if ( record ) {
            this.zoomRecord = record 
            stBar.setText( '[' + rowIndex.toString() + ']  ' + record.data.__str__ )
        }     else  {
            this.zoomRecord = null 
            stBar.setText('')   
        } 
        
    }, 
    
    doReturn: function() {
        if ( this.zoomRecord )  {
            this.setValue( this.zoomRecord.data.__str__ || this.myMeta.protoOption + '.__str__ not found' ) 
        }
        this.win.hide()
    }, 
    
    resetZoom: function() {

        this.setStatusBar( )
        
    }

});


