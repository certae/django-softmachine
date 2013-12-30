/*  ---  ProtoForm

    Se llama genericamente forma, y corresponde a un panel que puede ser adosado a una ventana
    o a un contenedor cualquiera,

    La forma se divide en secciones,  las secciones son de un tipo particular correspondiente
    a los diferentes contenedores,  las secciones por defecto son simplemente fieldset

    El el arbol solo se encontraran

        Secciones  ...
            ....
                fieldset
                    Campos

    no deberia mezclarse en el diseno campos y secciones dentro del mismo contenedor
    los field set son los contenedores de campos, los demas solo pueden contener otros contenedores

    renderer: this.formatDate,
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */


Ext.define('ProtoUL.view.ProtoForm', {
    extend : 'Ext.form.Panel',
    alias : 'widget.protoform',

    requires : ['Ext.form.field.Text', 'Ext.form.*', 'Ext.data.*', 'Ext.tip.QuickTipManager'],

    //@myMeta   Base Definition
    myMeta : null,

    // Default value
    newForm : false,

    //@formConfig  Objeto correspondiente a la forma en la meta ( forma parte de la meta )
    formConfig : null,

    //@prFormLayout  :  Componentes de la forma ( Itmems del arbol )
    prFormLayout : [],


    // Mantiene el IdMaster para las operaciones maestro detalle
    idMaster : -1,
    masterRecord : null,
    masterDetail : false,
    isReadOnly : false,

    //@ Store asociado al registro de entrada linked o independiente
    store : null,

    // Coleccion de campos html definidos en htmlSet
    cllDetails : [],
    htmlPanels : {},

    // Defne como manejar  maneja los campos heredados de los zoom
    zoomReturnDef : null,

    // Coleccion con los retornos
    zoomMultiReturn : [],


    initComponent : function() {
        this.addEvents('create', 'close', 'hide');

        var me = this;

        // Recupera la clase para obtener la meta ------------------------------------------
        var myMeta = this.myMeta;
        var _pForm = this;

        this.btSave = Ext.create( 'Ext.Button', {
//          id : this.idSaveBt,
            iconCls : 'icon-saveMs',
            text: _SM.__language.Text_SaveMs_Button,
            scope : this,
            handler : this.onSave
        });

        this.btSaveDet = Ext.create( 'Ext.Button', {
//            id :  this.idSaveBtDt,
            iconCls : 'icon-saveDt',
            text: _SM.__language.Text_SaveDt_Button,
            hidden : true,
            disabled : true,
            scope : this,
            handler : this.onSaveDet
        });

        this.btCancelFormEdt = Ext.create( 'Ext.Button', {
//            id :  this.idSCancel,
                iconCls : 'icon-cancel',
                text: _SM.__language.Text_Cancel_Button,
                scope : this,
                handler : this.onReset
        });

        this.stMsg = Ext.create('Ext.toolbar.TextItem');

        Ext.apply(this, {
            frame      : true,
            autoScroll : true,

            bodyStyle: 'padding:5px 5px',
            bodyPadding: 10,
            masterRecord : null,
            items : this.prFormLayout,

            dockedItems : [{
                xtype : 'toolbar',
                dock : 'bottom',
                ui : 'footer',
                items : [ this.stMsg, '->',  this.btSave , this.btSaveDet, this.btCancelFormEdt ]
            }]

        });

        this.callParent();

        // obtiene la coleccion de panles html para su manipulacion
        this.getHtmlPanels();

        // Obtiene los store de las grillas dependientes y asigna el listener startEdition
        this.cllDetails = getDetails( this.items.items , me );
        if ( this.cllDetails.length > 0 ) {
            this.masterDetail = true ;
            this.btSaveDet.show() ;
            asignaDetailDefinition( me );
        }

        // Lo genera de nuevo, quedaban componentes mal ubicados
        this.doLayout();

        function getDetails( prItems , me  ) {
            // Obtiene los store de las grillas recursivamente
            var cllDetails = [];
            for ( var ixV in prItems ) {
                var lGrid = prItems[ixV];
                if ( lGrid.__ptType == "protoGrid"  ) {
                    if ( lGrid.myMeta ) cllDetails.push(  lGrid  );
                } else  if ( lGrid.items &&  lGrid.items.items ) {
                    cllDetails = cllDetails.concat( getDetails( lGrid.items.items, me ) );
                }
            }
            return cllDetails;
        };

        function asignaDetailDefinition( me) {
            // Indexa los stores con la info de los detalles copiando la info del detalle
            for ( var ix in me.cllDetails ) {
                var lObj = me.cllDetails[ix];
                for ( var ixD in me.myMeta.detailsConfig ) {
                    var lDet = me.myMeta.detailsConfig[ ixD ];
                    if ( lObj.viewCode == lDet.conceptDetail ) {
                        lObj.detailDefinition = lDet;
                    }
                }
            };
        }
    },

    setDetailsTilte : function () {
        for ( var ix in this.cllDetails ) {
            var lGrid = this.cllDetails[ix];
            lGrid.embededGrid = true;
            lGrid.setGridTitle( lGrid );
        };
    },

    showProtoForm: function () {
        _SM.showConfig( 'Form Config' , this.myMeta.formConfig   );
    },

    showLayoutConfig: function () {
        _SM.showConfig( 'LayoutConfig' , this.prFormLayout   );
    },

    updateHtmlPanels: function( record ) {
        var sHtml;
        for (var ix in this.htmlPanels  ) {
            var obj = this.htmlPanels[ix];
            if (record) { sHtml = record.get( ix );
            } else { sHtml = ''; }
            obj.update( sHtml );
            obj.rawHtml = sHtml;
        }
    },

    readHtmlPanels: function( record ) {
        for (var ix in this.htmlPanels  ) {
            var obj = this.htmlPanels[ix];
            record.set( ix, obj.rawHtml  );
        }
    },


    loadN2N: function( record ) {
        // var myN2N = this.myFormController.N2Nfields;
        // if ( ! myN2N )  { return; }
        // for ( var ixV in myN2N ) {
            // var lObj = myN2N[ixV];
            // var prList = Ext.getCmp( lObj.id );
            // if ( ! prList )  { continue; }
            // prList.addDataSet( record.get(  lObj.name  ) );
        // }
    },


    setText : function ( sText ) {
         this.stMsg.setText( sText );
    },

    onReset : function() {
        // this.setActiveRecord(null);
        // this.getForm().reset();
        this.idMaster = null;
        this.fireEvent('close', this );
    },


    updateZoomIds:  function() {

        // La info del zoom permanece en el campo fk, es necesario actualizar el registro
        // antes de guardarlo, TODO: esto se podria hacer en el zoomReturn ( cpFromField ) para actualzar
        // otros campos derivados del zoom.

        var me = this,
            lFields = me.getForm().getFields().items;


        // inicializa me.zoomMultiReturn
        me.zoomMultiReturn = null;

        // Manejo del retorno del zoom
        for (var ix in lFields  ) {
            var zoomField = lFields[ix];
            if ( zoomField.xtype != 'protoZoom' ) continue;

            // Verifica los campos multizoom
            if ( zoomField.zoomMultiple && me.newForm ) {

                if (! me.zoomMultiReturn ) { me.zoomMultiReturn = [];}
                me.zoomMultiReturn.push( zoomField.zoomRecords );

            } else if (  zoomField.zoomRecord ) {

                // Actualiza el IdValue en el zoom para hacer los vinculos
                zoomField.fkIdValue  = this.masterRecord.get( zoomField.fkId );

                // Actualiza el Id con el dato proveniente del zoom
                me.updateFormField(  zoomField.fkId, zoomField.zoomRecord.data.id );

            }
            // Actualiza los valores de retorno
            // this.updateZoomReturn( zoomField  )
        }

    },


    updateFormField: function (  fldName, fldValue ) {
        var lRec = {};
        lRec[ fldName ] = fldValue;
        this.getForm().setValues( lRec );

        var lRec = this.masterRecord ;
        lRec.data[ fldName ] = fldValue;
        if ( ! lRec.modified[ fldName ]  ) {
            lRec.modified[ fldName ] = lRec.data[ fldName ];
        }
    },


    onCreate : function() {
        var form = this.getForm();

        if(form.isValid()) {
            this.fireEvent('create', this, form.getValues());
            form.reset();
        }

    },

/*
    updateZoomReturn: function (  zoomFld  ) {
        // El problema es en q momento se dispara,
        // hay q capturar un evento para cerrar la ventana de zoom
        // verifica si esta definido y lo define a necesidad
        if ( ! this.zoomReturnDef  ) {
            // mantiene una lista con la definicion de los cpFromField
            this.zoomReturnDef = []
            // Crea la coleccion de campos q deben heredarse
            for (var ix in this.myMeta.fields ) {
                var vFld = this.myMeta.fields[ix]
                if ( ! vFld.cpFromZoom ) continue;
                var cpFrom = {
                    "name"    : vFld.fName,
                    "cpFromZoom" : vFld.cpFromZoom,
                    "cpFromField" : vFld.cpFromField
                }
            }
        }

        // Verifica si hay elementos a heredar
        if ( this.zoomReturnDef.length  == 0 ) { return }

        // Recorre las propiedades a heredar
        for (var ix in this.zoomReturnDef ) {
            var cpFrom = this.zoomReturnDef[ix]
            if ( cpForm.cpFromZoom == zoomFld.name   ) {
                this.updateFormField(  zoomFld.name , zoomFld[ cpForm.cpFromField ] )
            }
        }

    },
*/


    setFormReadOnly: function( bReadOnly ){

        // por defecto viene editable
        this.isReadOnly = bReadOnly;

        // desactiva el boton save
        this.btSave.setDisabled( bReadOnly );
        this.btSaveDet.setDisabled( bReadOnly );
        this.btCancelFormEdt.setDisabled( bReadOnly );

        this.setReadOnlyFields( bReadOnly );
        this.setDetailsReadOnly( bReadOnly  );

    },

    setDetailsReadOnly: function( bReadOnly ) {
        for (var ix in this.cllDetails  ) {
            var lGrid = this.cllDetails[ix];
            lGrid.setEditMode( ! bReadOnly );
        }
    },

    setReadOnlyFields: function( bReadOnly , readOnlyFields ){
        /*
         * @bReadOnly indica q toda la forma es readOnly, podria servir para prender y apagar el readOnly
         * FIX: Una mascara seria mejor
         */

        // var readOnlyCls = 'protofield-readonly'
        var myFields = this.getForm().getFields();

        for (var ix in myFields.items   ) {
            var obj = myFields.items[ix];
            if ( obj.readOnly ) {
                obj.setReadOnly( true );
            } else if ( ! readOnlyFields  || ( obj.name in _SM.objConv( readOnlyFields )  )  ) {
                // El obj no es readOnly pero la forma si, se podria poner una mascara, pero q pasa con el zoom
                obj.setReadOnly( bReadOnly );
            };
        };

        // Recorre los htmlPanels
        for (var ix in this.htmlPanels  ) {
            var obj = this.htmlPanels[ix];
            var fDef = obj.__ptConfig ;

            if ( fDef.readOnly ) {
                obj.setReadOnly( true );
            } else if ( ! readOnlyFields  || ( fDef.name in _SM.objConv( readOnlyFields )  )  ) {
                obj.setReadOnly( bReadOnly );
            };
        }
    },

    getHtmlPanels: function () {
        // Busca si tiene htmlSets podria agregarse los paneles como campos,
        // los paneles al interior deberian heredar de  'Ext.form.field.Base' y mezclar Ext.form.Basic
        // setear propiedad  isFormField : true
        // implementar por lo menos los metodos : valueToRaw, setRawValue

        getHtmlPanelDefinition( this.items.items , this );

        function getHtmlPanelDefinition( formItems, me ) {
            for (var ix in formItems   ) {
                var vFld = formItems[ix];

                if ( vFld.xtype ==  "htmlset" ) {
                    Ext.apply(  me.htmlPanels, vFld.htmlPanels  );
                } else if ( vFld.xtype ==  "fieldset" ) {
                    getHtmlPanelDefinition( vFld.items.items, me );
                }
            }
        }
    },

    setActiveRecord : function(record) {
        var me = this;
        this.masterRecord = record;
        this.store = record.store;
        if ( record && !record.phantom )  this.idMaster = record.get('id' ) ;

        if(record) {
            this.getForm().loadRecord(record);

            // 1312:  No hay necesidad de actulizar los zoomsId pues vienen del registro
            // this.loadN2N( record );
            // this.updateZoomIds();
        } else {
            this.getForm().reset();
        }

        this.linkDetail( record );
        this.updateHtmlPanels( record );

        // -------------------------------------------------- --------  evento del store
        this.store.on({
        update: function( store, record, operation, eOpts ) {
            // console.log ( record , this.masterDetail  )
            if ( record && this.masterDetail ){
                this.idMaster = record.get('id' ) ;
                this.myFormController.newForm = false;
                this.linkDetail( record );
                this.setDetailsReadOnly( false );
            }
        }, scope: me });
    },

    linkDetail: function( record ) {
        if ( ! this.masterDetail ) { return; }

        for ( var ixDet in this.cllDetails ) {
            var lGrid = this.cllDetails[ixDet];
            var detField = lGrid.detailDefinition.detailField,
                myFilter = {};

            var protoFilter = [{ "property" :  detField , "filterStmt" : this.idMaster  }];
            lGrid.store.myLoadData( protoFilter, null,  this.idMaster );

            if ( this.idMaster >= 0 && ( ! this.isReadOnly ))  {
                lGrid.setEditMode( ! this.isReadOnly );
                setDetDefaults( this, lGrid, record );
            }
        }

        function setDetDefaults( me, myDetGrid, record  ) {
            var pDetail = myDetGrid.detailDefinition;
            var nField = pDetail.detailField.replace( /__pk$/, '_id' );

            // Obtiene el campo de filtro ( heredado ), Si no hereda la llave, cancela la edicion
            var myDetField = myDetGrid.myFieldDict[ nField ];
            if ( ! myDetField ) {
                _SM.__StBar.showError('parent key not found: ' + nField, 'MasterDetail');
                myDetGrid.setEditMode( false );
                return;
            }
            myDetField['prpDefault'] = me.idMaster;

            // Obtiene el titulo del filtro para heredarlo
            nField = pDetail.masterTitleField || nField.replace( /_id$/, '' );
            var myTitleField = myDetGrid.myFieldDict[ nField ];
            if ( myTitleField && record ) {
                var masterTitleField = pDetail.masterTitleField || '__str__';
                myTitleField['prpDefault'] = record.get( masterTitleField );
                myTitleField['readOnly'] = true;

                myDetGrid.detailTitle = myTitleField['prpDefault'];
                myDetGrid.setGridTitle( myDetGrid );
            }
        }
    },

    _doSyncMasterStore: function() {
        this.store.sync({
            success: function(result, request ) {
                var myReponse = result.operations[0].response;
                var myResult = Ext.decode( myReponse.responseText );
                if( myResult.message ) {
                    _SM.errorMessage(_SM.__language.Msg_Error_Save_Form, myResult.message);
                } else {
                    // me.fireEvent('close', me );
                }
            },
            failure: function(result, request) {
                _SM.errorMessage(_SM.__language.Msg_Error_Save_Form, _SM.__language.Msg_Failed_Operation);
            }
        });
    },

    onSaveDet : function() {
    /*  El guardado se hace en varios ciclos.
        - Se requiere tener un maestro,
            si es upd, el maestro ya existe los defectos se sinclronizan
            si es nuevo, se deshabilita el boton de guardar detalles hasta q exista un idMaster y un activeRecord

        - en upd
            se guarda el maestro y se actualiza el idMaster, y masterRecord
            se habilita la edicion de las grillas
            se puede esperar un evento "editComplete"  para esto generado por el store;
            antes de iniciar la edicion la grilla lanza un before edit q puede ser cancelado si no hay idMaster
     */

        this.onSave();
        this.fireEvent('close', this );

    },

    onSave : function() {

        var me = this,
            tmpAutoSync =  me.store.autoSync,
            form = me.getForm();

        me.updateZoomIds();

        if( ! form.isValid()) {
            me.setText(_SM.__language.Msg_Invalid_Form);
            return;
        }
        if (!me.masterRecord ) {return;}

        form.updateRecord( me.masterRecord );
        me.readHtmlPanels( me.masterRecord );


        // Si es nuevo
        if ( me.myFormController.newForm )  {

            if ( ! me.zoomMultiReturn ) {
                me.store.add( me.masterRecord );

            } else {

                // La carga de multiples zooms siempre se debe hacer en una unica llamada.
                me.store.autoSync = false;

                // Variable para alojar los retornos multiples
                var lProduct =  _SM.Product( me.zoomMultiReturn ) ;
                for ( var ix in lProduct ){

                    // Producto Cartersiano de multiReturn
                    var lBase = lProduct[ix],
                        lRec = me.masterRecord.copy();

                    for ( var iz in lBase   ){
                        var    lZRet = lBase[ iz ];
                        lRec.data[ lZRet.name ] = lZRet.recStr;
                        lRec.data[ lZRet.fkId   ] = lZRet.recId;
                    }
                    me.store.add( lRec  );

                }

            }
        }

        // DGT: Esto deberia ser parametrizado; la version actual maneja autosync = true
        if ( me.store.autoSync !== true   ) {
            me._doSyncMasterStore();
        }

        // Restaura el autosync
        me.store.autoSync = tmpAutoSync;

        if ( me.masterDetail )  {
            me.btSave.setDisabled( true );
            me.btSaveDet.setDisabled( false );
        } else {
            me.fireEvent('close', me );
        }

    }, 
    
    setZoomEditMode:  function( me ) {
        // Para determinar el comportamiento del zoom de seleccion multiple 
        
        var lFields = me.getForm().getFields().items;

        // Manejo del retorno del zoom
        for (var ix in lFields  ) {
            if ( lFields[ix].xtype = 'protoZoom' ) {
                lFields[ix].newForm = me.newForm; 
            }
        }
    }

});


