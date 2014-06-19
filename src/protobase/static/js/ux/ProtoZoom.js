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

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */
 
Ext.define('ProtoUL.ux.protoZoom', {
    extend : 'Ext.form.field.Trigger',
    alias : 'widget.protoZoom',
    
    // * Zoom initialization
    zoomModel: null, 
    zoomGrid : null, 
    zoomRecord: null, 

    zoomRecords: null, 
    zoomMultiple : false, 

    //trigger button cls 
    triggerCls : Ext.baseCSSPrefix + 'form-search-trigger',
    // readOnlyCls : 'protoLink', 

    /**
     * @private
     * Indica si todos los atributos de configuracion fueron cargados, permitiria reutilizar la forma solo cambiando el filtro 
     */
    isLoaded : false,
    handleMouseEvents: true,

    /*  Formato de Link
    fieldStyle: 'color: -webkit-link !important;text-decoration: underline !important;cursor: auto !important;', 
    fieldCls: 'protoLink',
     */

    initComponent : function() {
        var me = this; 
        this.callParent(arguments);
        
        // Para activar el evento con ENTER 
        this.on(
            'specialkey', function(f, e) {
                if (e.getKey() == e.ENTER) {
                    this.onTriggerClick( );
                }
            }, 
        this);
    },
    
    listeners: {
        'render': function( cmp1 ) { 
            cmp1.getEl().on('click', this.onClickLink, this );}
    }, 

    onClickLink: function ( ev, nd ) {
        // La funcion Link solo se activa si es readOly 
        if ( ! this.readOnly  ) { return; } 
        if ( nd.nodeName == "LABEL" ) { return; } 

        this._loadZoom( this.doClickLink  ); 
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
    

    doClickLink: function ( me ) {
        
        var formController = Ext.create('ProtoUL.UI.FormController', {});
        formController.openProtoForm.call( formController, me.zoomModel, me.fkIdValue , false   ); 
        
    }, 
    
    createZoomWindow:  function ( me  ){
        // @ZoomRaise 

        function doCancel() {
            me.resetZoom();
            me.win.hide();
        }

        // function doNew() {
            // var formController = Ext.create('ProtoUL.UI.FormController', { myMeta : me.myMeta });
            // formController.openNewForm ( this.zoomGrid.store  );
        // }
        // function doEdit() {
            // if ( ! this.zoomGrid.selected ) {
                // _SM.errorMessage(_SM.__language.Title_Form_Panel, _SM.__language.GridAction_NoRecord);
                // return; 
            // }
            // var formController = Ext.create('ProtoUL.UI.FormController', { 
                // myMeta : me.myMeta
             // });
            // formController.openLinkedForm ( this.zoomGrid.selected    );
        // }
        
        if ( me.isLoaded ) { return; } 

        me.myMeta = _SM._cllPCI[ me.zoomModel ] ; 

        // Para identificar el StatusBar 
        me.idStBar = Ext.id();

        var selMode = 'single';
        if ( me.zoomMultiple && me.newForm ) { selMode = 'multi'; }
        
        // Crea la grilla 
        this.zoomGrid = Ext.create('ProtoUL.view.ProtoGrid', { 
            gridSelectionMode : selMode,  
            viewCode  : me.zoomModel,
            // initialFilter : [{ 'property' : 'pk', 'filterStmt' :  -1 }], 
            initialFilter : [], 
            
            hideSheet    : true,  
            listDisplay  : '__str__'   
         }) ; 
             
             
        var searchBG = Ext.create('ProtoUL.ux.ProtoSearchBG', { myMeta: me.myMeta });

        this.zoomGrid.on({
            selectionChange: {fn: function ( selModel, record, rowIndex,  eOpts ) {
                me.setSelected( rowIndex, record, selModel );
            }, scope: this }
        });

        this.zoomGrid.on({
            rowDblClick: {fn: function ( record, rowIndex ) {
                me.setSelected( rowIndex, record );
                me.doReturn();
            }, scope: me }
        });

        searchBG.on({
            qbeLoadData: {fn: function ( searchBG , sFilter, sTitle , sorter ) {
                me.resetZoom();
                this.zoomGrid.gridLoadData( this.zoomGrid, sFilter, sorter );
            }, scope: this }
        });                 

        //@@ Verificar los permisos de usuario 
        var perms = _SM._UserInfo.perms[ me.myMeta.viewCode ], 
            zoomBtns = [
                    { xtype: 'tbtext', text: '', id: me.idStBar , flex: 1, readOnly : true  },
                    { xtype: 'button', text: _SM.__language.Text_Cancel_Button, scope: me, handler: doCancel   }, 
                    { xtype: 'button', text: 'Ok', scope: me, handler: me.doReturn } 
                ]; 

        // if ( perms['change'] ) {
            // zoomBtns.push( { xtype: 'button', text: 'Edit', scope: me, handler: doEdit } )
        // }
        // if ( perms['add'] ) {
            // zoomBtns.push( { xtype: 'button', text: 'New', scope: me, handler: doNew  } )
        // }
        
        // referencia a la ventana modal
        me.win  = Ext.widget('window', {
            title : 'Zoom : ' + me.myMeta.shortTitle,
            constrainHeader : true,
            iconCls: me.myMeta.viewIcon , 
            closeAction : 'hide',
            layout : 'fit',
            modal : true,
            width     : 800,     minWidth  : 400,
            height  : 600,  minHeight : 400, 
            resizable : true,
            tbar :  searchBG, 
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
    
    onTriggerClick : function (  ) {
        this._loadZoom( this.doTriggerClick ) ;
    }, 
    
    doTriggerClick : function( me ) {

        me.showZoomForm( me );
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
        
    }, 
    
    setSelected: function  ( rowIndex, record, selModel) {
        // @ZoomSelection 
        
        var stBar = Ext.getCmp( this.idStBar ),
            me = this,  
            ix ;

        function getZoomReturn( record ) {
            var recStr; 
            if (! record  )  return ;
            if ( me.myMeta.returnField ) {
                recStr = record.get( me.myMeta.returnField );
            } else {
                recStr = record.get( '__str__' ) || me.myMeta.viewCode + '.str?';
            }
            return { 'name' : me.name, 'fkId' : me.fkId, 'recId' : record.get( 'id') , 'recStr' : recStr }; 
        };
        
        if ( me.zoomMultiple && me.newForm && selModel ) {
            me.zoomRecords =[];
            var cllSelection = selModel.getSelection();  
            for ( ix in cllSelection ) {
                me.zoomRecords.push(  getZoomReturn( cllSelection[ix] ) );
            } 
            
            var strAux = '';
            for ( ix in me.zoomRecords ) {
                strAux += me.zoomRecords[ix].recStr + ';'; 
            }
            stBar.setText( strAux );
            me.retField = strAux; 
            
        } else if ( record ) {
            var zoomRet = getZoomReturn( record );   
            
            me.zoomRecord = record;
            me.retField = zoomRet.recStr; 
            
            stBar.setText( '[' + zoomRet.recId.toString() + ']  ' + zoomRet.recStr );
            
        } else  {
            me.zoomRecord = null; 
            me.zoomRecords =null;
            stBar.setText('');    
        } 
        
    }, 
    
    doReturn: function() {
        // @ZoomReturn 
        // Asigna el returnField al text de base  
        this.setValue( this.retField ); 
        this.win.hide();
    }, 
    
    resetZoom: function() {
        this.setSelected( );
    }
    
    // setReadOnly: function(readOnly) {
        // if (readOnly != this.readOnly) {
            // this.setReadOnly( true ); 
            // // this.readOnly = readOnly;
            // // if ( readOnly ) {
                // // this.fieldCls = 'protoLink'
                // // this.addCls( 'protoLink' ) 
            // // } else if ( hasCls( 'protoLink' )) {
                // // this.removeCls( 'protoLink' ) 
            // // }
            // // this.updateLayout();
        // }
    // }

});


// String format function if not exist 
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

// _SM.trim = function ( str ) { 
    // return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
// }