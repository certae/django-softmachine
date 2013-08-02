/**
 * @class ProtoUL.ux.FormController
 * @author  Dario Gomez

 * Helper class for intancing ProtoForm

 */

Ext.define('ProtoUL.UI.FormController', {
    extend: 'Ext.Base',

    // requires: [ 'ProtoUL.view.ProtoForm' ],
    // Required if linked,  retrived if zoom
    myMeta : null,

	// metaDict : contiene las metas de los detalles
	myMetaDict : null,

    // Entry point if zoom
    viewCode : null,

    // if ReadOnly
    isReadOnly : false,

    // Si la forma fue cargada correctamente
    formLoaded : false,

    // Win dimension
    myWidth : 620,
    myHeight : 460,


    constructor: function (config) {
        Ext.apply(this, config || {});
        this.myMetaDict = {}
    },



    _loadFormDefinition: function () {
        // antes de cargar la forma, requiere la carga de detalles
        // llama a waitForDetails q llama a newProtoForm

        // lo marca como cargado
		this.myMetaDict[ this.myMeta.viewCode  ] = false

		// Carga el dictionario de detalles
		var me = this,
		    detConfig = me.myMeta.detailsConfig

        for ( var ixV in detConfig  ) {
            var pDetail = detConfig[ixV];
			this.myMetaDict[ pDetail.conceptDetail ] = false
        }

        // ahora carga las definiciones
        me.loaded = false
        for ( var detCode in me.myMetaDict  ) {
            if ( detCode in _SM._cllPCI ) {
                me.myMetaDict[ detCode ] = true
            } else { loadDetailDefinition( me, detCode  ) }
        }

        // si np esta cargada la manda en nulo para forzar la carga
        if ( ! me.loaded  )   me._waitForDetails( me )


        function loadDetailDefinition( me, detCode ) {

            // Opciones del llamado AJAX para precargar los detalles
	        var options = {
	            scope: me,
	            success: function ( obj, result, request ) {
	                me._waitForDetails( me, detCode )
	            },
	            failure: function ( obj, result, request) {
	                me._waitForDetails( me, detCode )
	                _SM.errorMessage( 'ProtoDefinition Error :', detCode  + ': protoDefinition not found')
	            }
	        }

            // PreCarga los detalles
            if (  _SM.loadPci( detCode , true, options ) )  me._waitForDetails( me, detCode  )

        };


    },

	_waitForDetails: function( me, detCode ) {

        if ( detCode ) me.myMetaDict[ detCode ] = true

		// espera todas las definiciones
        for ( var detCode in me.myMetaDict  ) {
            if ( ! me.myMetaDict[ detCode ] )  return
        }

        if (  me.loaded  )  return

        me.loaded = true
		me.newProtoForm.call( me )

        // ---------------

        me.myForm.setActiveRecord( this.myRecordBase  );
        me.myForm.store = this.myRecordBase.store

        // Si la forma es visible no salen los tools
        // if ( me.isReadOnly ) {me.myWin.tools = [{type: 'readOnly', tooltip: 'readOnly'}, {type: 'gear', scope: me.myForm, handler: me.myForm.showProtoForm }] me.myWin.addTools() };

        // Si la forma no esta visible no puede desactivar los headers
        if ( me.isReadOnly ) {
            me.myForm.setFormReadOnly( true );
        } else {
            me.myForm.setReadOnlyFields( true, me.myMeta.gridConfig.readOnlyFields );
        }

        me.newWindowLoad.call( me, me )
        me.myWin.show();
        me.myForm.setDetailsTilte()


	},

    newProtoForm: function () {
    	// llamado tambien desde formConfig  (protoDesigner)

        this.defineFormLayout()
        this.myForm = Ext.widget('protoform', {
            myMeta : this.myMeta,
            myFormController : this,
            prFormLayout : this.prFormLayout
        });

        return this.myForm

    },

    newWindow: function ( me ) {

        me._loadFormDefinition( )
    },

    newWindowLoad: function ( me ) {

        _SM.updateWinPosition( me.myWidth, me.myHeight )

        me.myWin  = Ext.widget('window', {
            // constrain: true,
            title : me.myMeta.viewCode,
            closeAction: 'hide',
            width: me.myWidth,
            height: me.myHeight,
            x : _SM._winX,
            y : _SM._winY,
            minHeight: 400,
            minWidth: 400,
            layout: 'fit',

            maximizable: true,
            resizable: true,
            modal: true,

            items: me.myForm
        });

        // Los eventos controlan la ventana
        me.myForm.on({
            'close' :  function() { me.myWin.close() },
            'hide' :  function() { me.myWin.hide() },
            scope: me }
        );

        // Tools this.myWin.tools = [{type: 'readOnly', tooltip: 'readOnly'}] this.myWin.addTools(

    },

    openNewForm: function (  myStore )   {

        this.isReadOnly  = false
        this.newForm = true

        var myRecord = _SM.getNewRecord( this.myMeta, myStore );
        this.openForm( myRecord )
    },

    openLinkedForm: function ( myRecord, isReadOnly )   {
        this.newForm = false
        this.isReadOnly  = isReadOnly
        this.openForm( myRecord )
    },


    openForm: function ( myRecord )   {


        // Verifica la edicion
        if ( ! myRecord   ) {
            _SM.errorMessage( 'Form Error', 'no se definio registrode entrada')
            return
        }

        this.myRecordBase = myRecord
        this.newWindow( this );

    },


    openProtoForm: function ( myZoomModel, myRecordId , bEditable )   {

        this.viewCode = myZoomModel
        this.isReadOnly  = ! bEditable

        if ( ! myRecordId ) {
            _SM.errorMessage( 'LinkedForm Error : ' +  myZoomModel, 'not fkId field definition found' )
            return
        }

        // Obtiene la meta ( async )
        this._getFormDefinition( myRecordId )

    },


    _getFormDefinition: function (  myRecordId  ) {

        // Opciones del llamado AJAX
        var options = {
            scope: this,
            success: function ( obj, result, request ) {
                this._openAndLoad( this.viewCode, myRecordId )
            },
            failure: function ( obj, result, request) {
                _SM.errorMessage( 'ProtoDefinition Error :', myZoomModel + ': protoDefinition not found')
            }
        }
        if (  _SM.loadPci( this.viewCode , true, options ) ) {
                this._openAndLoad( this.viewCode, myRecordId )
        }

    },



    _openAndLoad: function( viewCode, myRecordId ) {

        this.myMeta = _SM._cllPCI[ viewCode ] ;

        this.formLoaded = true;
        this._loadFormData( myRecordId )

    },


    _loadFormData: function( myRecordId ) {

        if ( ! this.formLoaded ) {
            // console.log( 'FormController:  Form is not ready')
            return
        }

        // Filter
        var myFilter = [{ "property" : "pk", "filterStmt" : myRecordId }]
        var storeDefinition =  {
            viewCode : this.viewCode,
            autoLoad: true,
            baseFilter: myFilter,
            sProtoMeta  : _SM.getSafeMeta( this.myMeta )
        };

        var myStore = _SM.getStoreDefinition( storeDefinition )

        if ( myRecordId >= 0  ) {
            myStore.load();
            myStore.on({
                'load' :  function(store,records, successful, options) {

                    // Fix:  Esta entrando dos veces  porq????
                    if ( this.myWin ) return

                    // The form is now linked to  store
                    this.openLinkedForm( records[0], this.isReadOnly   )
                },
                scope: this }
            )
        } else  {
            var myRecord = _SM.getNewRecord( this.myMeta, myStore );
            this.openForm( myRecord )
        }
    },


    defineFormLayout: function( ){

        var me = this
        var myFormDefinition = _SM.clone( this.myMeta.formConfig )

        var myMeta = this.myMeta

        // Verifricar si existe  la referencia a la meta de base
        var myFieldDict = _SM.getFieldDict( myMeta )

        me.prFormLayout = [];
        me.N2Nfields = []

        //FIx : Compatibilidad con la version vieja,  debe eliminarse  ---
        // if ( ! myFormDefinition.items  ) {
            // myFormDefinition = { 'items': myFormDefinition }
        // }
        //FIx : Compatibilidad con la version vieja,  debe eliminarse ---/

        for ( var ixV in myFormDefinition.items) {
            var lObj = myFormDefinition.items[ixV];

            // Envia el contenedor y el objeto
            var prItem = defineProtoFormItem( {__ptType : 'panel'}, lObj )
            me.prFormLayout.push(prItem);
        }


        function defineProtoFormItem ( parent, protoObj, protoIx ) {

            var prLayout , template, __ptType
            var sDataType = _SM.typeOf(protoObj);

            if (sDataType == "object" ) {

                // Configura el objeto
                if ( ! protoObj.__ptConfig )
                    protoObj.__ptConfig = getSimpleProperties( protoObj )

                if ( ! protoObj.__ptConfig.name )
                    protoObj.__ptConfig.name = protoIx


                __ptType = protoObj.__ptConfig.__ptType || protoObj.__ptType

                if ( ! __ptType   ) {
                    // console.log( 'El objeto no tiene tipo definido' , protoObj )
                    return {}

                } else if ( __ptType == 'formField'  ) {

                    // protoIx es el field Name, si no viene debe buscarlo en __ptConfig [ name ]
                    protoIx = protoObj.name || protoObj.__ptConfig.name

                    var myFld =  myFieldDict[ protoIx ]
                    if ( myFld ) {

                        template = getTemplate( __ptType, true,  myFld  )
                        prLayout = Ext.apply( template.__ptConfig , protoObj.__ptConfig  )

                        // ReadOnlyCls
                        if (  prLayout[ 'xtype' ] == 'protoZoom' ) {
                            prLayout[ 'readOnlyCls' ] = 'protoLink'
                        } else if (  prLayout[ 'xtype' ] == 'checkbox' ) {
                        } else {
                            prLayout[ 'readOnlyCls' ] = 'protofield-readonly'
                        }

                        // N2N
                        if ( myFld.type == 'protoN2N') {
                            prLayout[ 'id' ] = Ext.id()
                            me.N2Nfields.push( {
                                name : myFld.name,
                                id: prLayout[ 'id' ]
                            } )
                        }

                    }  else {

                        // El campo no existe en la definicion:  es un label
                        // Incluso los campos calculados deben existir en la definicion
                        // console.log( 'invalid formField,name  :' , protoObj )
                        prLayout =   {
                            text:   protoIx,
                            xtype: 'label', margin: '4', padding: '4', border: 1,
                            tooltip : 'field definition not found',
                            style: {
                                borderColor: 'red',
                                borderStyle: 'solid',
                                bodyStyle:';border-right:none;border-left:none;border-top:none;'
                            }
                        }
                    }


                } else if ( __ptType == 'protoGrid'  ) {
                    if ( _SM.loadPci( protoObj.viewCode, false ) ) {

                        template = getTemplate( __ptType  , true  )
                        prLayout = Ext.apply( template.__ptConfig , protoObj.__ptConfig  )

                        if (( ! prLayout.minWidth ) || ( prLayout.minWidth < 100 )) prLayout.minWidth = 250

                        // Inicia la grilla sin datos
                        prLayout.initialFilter = [{ 'property' : 'pk', 'filterStmt' :  -1 }]
                        delete protoObj.__ptConfig.name
                    } else {
                        prLayout =   {
                            xtype: 'label', margin: '4', padding: '4', border: 1,
                            text : 'ERROR: grid definition not found ' + protoObj.viewCode ,
                            style: {
                                borderColor: 'red',
                                borderStyle: 'solid',
                                bodyStyle:';border-right:none;border-left:none;border-top:none;'
                            }
                        }
                        _SM.errorMessage( 'defineProtoFormItem', protoObj.viewCode + ' not found!!' )
                    }
                } else if ( __ptType == 'htmlset'  ) {

                    template = getTemplate( __ptType  , true  )
                    prLayout = Ext.apply( template.__ptConfig , protoObj.__ptConfig  )

                    prLayout.htlmFields = protoObj.items

                    delete protoObj.__ptConfig.name

                } else {

                    template = getTemplate( __ptType  , true  )
                    prLayout = Ext.apply( template.__ptConfig , protoObj.__ptConfig  )

                    // Agrega los items
                    prLayout.items = []
                    var prItems = protoObj.items
                    for(var ix in prItems ) {
                        if ( ix.indexOf( "__pt" )  == 0 ) continue

                        var prVar = prItems[ix];
                        var prFld = defineProtoFormItem(  protoObj, prVar, ix )
                        if(prFld) prLayout.items.push(prFld);
                    }

                }


                // Establece el layout  ( Columns )
                var sAux= prLayout[ 'fsLayout' ]
                if ( sAux ) {

                    prLayout.defaultType = 'textfield'
                    prLayout.layout =  'column'
                    prLayout.defaults = { padding: '2 2' }

                    if ( sAux == "1col"  )
                        prLayout.defaults.columnWidth = 1
                    else if ( sAux == "2col"  )
                        prLayout.defaults.columnWidth = 0.5
                    else if ( sAux == "3col"  )
                        prLayout.defaults.columnWidth = 0.33

                    delete prLayout.fsLayout

                    // Parametros de labels
                    prLayout.fieldDefaults = {}
                    setFieldDefaults(  prLayout, 'labelAlign' )
                    setFieldDefaults(  prLayout, 'labelWidth' )
                    setFieldDefaults(  prLayout, 'hideLabel' )

                }


                // Tooltip
                if ( prLayout[ 'tooltip' ]) {

                    prLayout['listeners'] = {
                        render: function(c) {
                            Ext.create('Ext.tip.ToolTip', {
                            target: c.getEl(),
                            trackMouse: true,
                            html: prLayout[ 'tooltip' ]
                          });
                        }
                    }

                }

                // El fieldContainer requiere!!  el defaultType
                // prFld.xtype = 'fieldcontainer';
                // prFld.defaultType = 'textfield'
                // prFld.combineErrors = true;
                // prFld.layout = 'hbox';
                // prFld.margins = 0;
                // prFld.pad = 0;
                // prFld.frame = false;
                // prFld.defaults = {flex : 1}


            } else if ( sDataType == "array")  {

                prLayout = []
                for(var ix in protoObj ) {
                    var prVar = protoObj[ix];

                    // Si es un array el padre es ../..
                    var prFld = defineProtoFormItem(  parent, prVar , ix)
                    if(prFld) prLayout.push(prFld);
                }

            }

            return prLayout

            function setFieldDefaults(  prLayout, key ) {
                // Asigna los fieldDefaults q vienen en los contenedores
                var sAux = prLayout[ key ]
                if  ( sAux  )  prLayout.fieldDefaults[ key ] = sAux
            }
        }

        /*
        {
            //TODO:  Agregar tooltip a los campos
              fieldLabel: 'test label'
              allowBlank: false,
              listeners: {
                render: function(c) {
                  Ext.QuickTips.register({
                    target: c.getEl(),
                    text: 'this is a test message'
                  });
                }
              }
            }
         */

    }

})
