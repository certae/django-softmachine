/**
 * @class ProtoUL.ux.FormController
 * @author  Dario Gomez

 * Helper class for instancing ProtoForm

 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */
/*global ProtoUL */
/*global getSimpleProperties */

Ext.define('ProtoUL.UI.FormController', {
    extend : 'Ext.Base',

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

    newForm : false,

    constructor : function(config) {
        Ext.apply(this, config || {});
        this.myMetaDict = {};
    },

    _loadFormDefinition : function() {
        // antes de cargar la forma, requiere la carga de detalles
        // llama a waitForDetails q llama a newProtoForm

        function loadDetailDefinition(me, detCode) {

            // Opciones del llamado AJAX para precargar los detalles
            var options = {
                scope : me,
                success : function(obj, result, request) {
                    me._waitForDetails(me, detCode);
                },
                failure : function(obj, result, request) {
                    me._waitForDetails(me, detCode);
                    _SM.errorMessage('ProtoDefinition Error :', detCode + ': protoDefinition not found');
                }
            };

            // PreCarga los detalles
            if (_SM.loadPci(detCode, true, options)) {
                me._waitForDetails(me, detCode);
            }

        }

        // This increase performance.
        Ext.suspendLayouts();

        // lo marca como cargado
        this.myMetaDict[this.myMeta.viewCode] = false;

        // Carga el dictionario de detalles
        var me = this, detConfig = me.myMeta.detailsConfig, ixV, pDetail, detCode;

        for (ixV in detConfig  ) {
            pDetail = detConfig[ixV];
            this.myMetaDict[pDetail.conceptDetail] = false;
        }

        // ahora carga las definiciones
        me.loaded = false;
        for (detCode in me.myMetaDict  ) {
            if ( detCode in _SM._cllPCI) {
                me.myMetaDict[detCode] = true;
            } else {
                loadDetailDefinition(me, detCode);
            }
        }

        // si np esta cargada la manda en nulo para forzar la carga
        if (!me.loaded) {
            me._waitForDetails(me);
        }
        Ext.resumeLayouts(true);
    },

    _waitForDetails : function(me, detCode) {

        if (detCode) {
            me.myMetaDict[detCode] = true;
        }

        // espera todas las definiciones
        for (detCode in me.myMetaDict  ) {
            if (!me.myMetaDict[detCode]) {
                return;
            }
        }

        if (me.loaded) {
            return;
        }

        me.loaded = true;
        me.newProtoForm.call(me);

        // ---------------

        me.myForm.setActiveRecord(this.myRecordBase);
        me.myForm.store = this.myRecordBase.store;

        // Si la forma es visible no salen los tools
        // if ( me.isReadOnly ) {me.myWin.tools = [{type: 'readOnly', tooltip: 'readOnly'}, {type: 'gear', scope: me.myForm, handler: me.myForm.showProtoForm }] me.myWin.addTools() };

        // Si la forma no esta visible no puede desactivar los headers
        if (me.isReadOnly) {
            me.myForm.setFormReadOnly(true);
        } else {
            me.myForm.setReadOnlyFields(true, me.myMeta.gridConfig.readOnlyFields);
        }

        me.newWindowLoad.call(me, me);
        me.myWin.show();
        me.myForm.setDetailsTilte();
    },

    newProtoForm : function() {
        // llamado tambien desde formConfig  (protoDesigner)

        var me = this;
        if (!me.myFieldDict) {
            me.myFieldDict = _SM.getFieldDict(me.myMeta);
        }

        this.defineFormLayout();
        this.myForm = Ext.widget('protoform', {
            myMeta : this.myMeta,
            newForm : this.newForm,
            myFormController : this,
            prFormLayout : this.prFormLayout
        });

        return this.myForm;

    },

    newWindow : function(me) {
        me._loadFormDefinition();
    },

    newWindowLoad : function(me) {

        _SM.updateWinPosition(me.myWidth, me.myHeight);

        var strEditing = '';
        if (me.newForm) {
            strEditing = ' *';
        }

        me.myForm.setZoomEditMode(me.myForm);

        me.myWin = Ext.widget('window', {
            title : me.myMeta.viewCode + strEditing,
            closeAction : 'hide',
            width : me.myWidth,
            height : me.myHeight,
            style : 'z-index: -1;',
            x : _SM._winX,
            y : _SM._winY,
            minHeight : 400,
            minWidth : 400,
            layout : 'fit',

            constrainHeader : true,
            maximizable : true,
            resizable : true,
            modal : true,

            items : me.myForm
        });

        // Los eventos controlan la ventana
        me.myForm.on({
            'close' : function() {
                me.myWin.close();

                // if ( me.newForm ) {
                // function doAgain( btn ){
                // if(btn == 'yes') { me.openNewForm( me.myStore );}}
                // Ext.MessageBox.confirm('AddRecord', 'Add another?', doAgain  );
                // }
            },
            'hide' : function() {
                me.myWin.hide();
            },
            scope : me
        });

        // Tools this.myWin.tools = [{type: 'readOnly', tooltip: 'readOnly'}] this.myWin.addTools(

    },

    openNewForm : function(myStore) {

        this.isReadOnly = false;
        this.newForm = true;
        this.myStore = myStore;

        var myRecord = _SM.getNewRecord(this.myMeta, myStore);
        this.openForm(myRecord);
    },

    openLinkedForm : function(myRecord, isReadOnly) {
        this.newForm = false;
        this.isReadOnly = isReadOnly;
        this.openForm(myRecord);
    },

    openForm : function(myRecord) {

        // Verifica la edicion
        if (!myRecord) {
            _SM.errorMessage('Form Error', 'Undefined input record');
            return;
        }

        this.myRecordBase = myRecord;
        this.newWindow(this);

    },

    openProtoForm : function(myZoomModel, myRecordId, bEditable) {

        this.viewCode = myZoomModel;
        this.isReadOnly = !bEditable;

        if (!myRecordId) {
            _SM.errorMessage('LinkedForm Error : ' + myZoomModel, 'not fkId field definition found');
            return;
        }

        // Obtiene la meta ( async )
        this._getFormDefinition(myRecordId);

    },

    _getFormDefinition : function(myRecordId) {

        // Opciones del llamado AJAX
        var options = {
            scope : this,
            success : function(obj, result, request) {
                this._openAndLoad(this.viewCode, myRecordId);
            },
            failure : function(obj, result, request) {
                _SM.errorMessage('ProtoDefinition Error :', this.viewCode + ': protoDefinition not found');
            }
        };
        if (_SM.loadPci(this.viewCode, true, options)) {
            this._openAndLoad(this.viewCode, myRecordId);
        }

    },

    _openAndLoad : function(viewCode, myRecordId) {

        this.myMeta = _SM.clone(_SM._cllPCI[viewCode]);

        this.formLoaded = true;
        this._loadFormData(myRecordId);
    },

    _loadFormData : function(myRecordId) {

        var me = this, myFilter, storeDefinition, myStore, myRecord;

        // Form is not ready
        if (!me.formLoaded) {
            return;
        }

        // TODO: LinkFilter
        myFilter = [{
            "property" : "pk",
            "filterStmt" : myRecordId
        }];
        storeDefinition = {
            viewCode : this.viewCode,
            autoLoad : true,
            baseFilter : myFilter,
            sProtoMeta : _SM.getSafeMeta(this.myMeta)
        };
        myStore = _SM.getStoreDefinition(storeDefinition);

        if (myRecordId !== -1) {
            myStore.load();
            myStore.on({
                'load' : function(store, records, successful, options) {

                    // Fix:  Esta entrando dos veces  porq????
                    if (this.myWin) {
                        return;
                    }

                    // The form is now linked to  store
                    this.openLinkedForm(records[0], this.isReadOnly);
                },
                scope : this
            });

        } else {

            this.newForm = true;
            me.myFieldDict = _SM.getFieldDict(me.myMeta);

            if (me.linkController) {
                me.detailLink = me.linkController.getDetailLink(me.detailDefinition);
                me.linkController.setDetailDefaults(me.detailDefinition, me.myFieldDict);
                me.baseFilter = me.detailLink.detFilter;
                me.detailTitle = me.detailLink.detTitle;
            }

            myRecord = _SM.getNewRecord(this.myMeta, myStore);
            this.openForm(myRecord);
        }
    },

    defineFormLayout : function() {

        function setFieldDefaults(prLayout, key) {
            // Asigna los fieldDefaults q vienen en los contenedores
            var sAux = prLayout[key];
            if (sAux) {
                prLayout.fieldDefaults[key] = sAux;
            }
        }

        function defineProtoFormItem(me, parent, protoObj, protoIx) {

            var myFld, prLayout, template, __ptType, sDataType = _SM.typeOf(protoObj);

            if (sDataType === "object") {

                // Configura el objeto
                if (!protoObj.__ptConfig) {
                    protoObj.__ptConfig = getSimpleProperties(protoObj);
                }
                if (!protoObj.__ptConfig.name) {
                    protoObj.__ptConfig.name = protoIx;
                }

                __ptType = protoObj.__ptConfig.__ptType || protoObj.__ptType;

                if (!__ptType) {
                    // console.log( 'El objeto no tiene tipo definido' , protoObj )
                    return {};

                } else if (__ptType === 'formField') {

                    // protoIx es el field Name, si no viene debe buscarlo en __ptConfig [ name ]
                    protoIx = protoObj.name || protoObj.__ptConfig.name;

                    myFld = me.myFieldDict[protoIx];
                    if (myFld) {
                        template = getTemplate(__ptType, true, myFld);

                        if (myFld.required && !myFld.fkId && me.newForm) {
	                        template.__ptConfig.listeners.render = function(field) {
		                        Ext.Ajax.request({
			                        url : _SM._PConfig.urlGetNextIncrement,
			                        method : 'GET',
			                        params : {
				                        fieldName : myFld.name,
				                        viewEntity : me.myMeta.viewEntity
			                        },
			                        success : function(result, request) {
				                        var jsonData = Ext.decode(result.responseText);
				                        if (jsonData.increment) {
				                        	field.setValue(jsonData.increment);
				                        }
			                        },
			                        failure : function() {
			                        	console.log('failure on get increment');
			                        }
		                        });
	                        };
                        }

                        prLayout = Ext.apply(template.__ptConfig, protoObj.__ptConfig);

                        // ReadOnlyCls
                        if (prLayout['xtype'] === 'protoZoom') {
                            prLayout['readOnlyCls'] = 'protoLink';
                        } else if (prLayout['xtype'] !== 'checkbox') {
                            prLayout['readOnlyCls'] = 'protofield-readonly';
                        }

                    } else {

                        // El campo no existe en la definicion:  es un label
                        // Incluso los campos calculados deben existir en la definicion
                        // console.log( 'invalid formField,name  :' , protoObj )
                        prLayout = {
                            text : protoIx,
                            xtype : 'label',
                            margin : '4',
                            padding : '4',
                            border : 1,
                            tooltip : 'field definition not found',
                            style : {
                                borderColor : 'red',
                                borderStyle : 'solid',
                                bodyStyle : ';border-right:none;border-left:none;border-top:none;'
                            }
                        };
                    };

                } else if (__ptType == 'protoGrid') {

                    if (_SM.loadPci(protoObj.viewCode, false)) {

                        template = getTemplate(__ptType, true);
                        prLayout = Ext.apply(template.__ptConfig, protoObj.__ptConfig);

                        if ((!prLayout.minWidth) || (prLayout.minWidth < 100)) {
                            prLayout.minWidth = 250;
                        }
                        // Inicia la grilla sin datos
                        prLayout.initialFilter = [{
                            'property' : 'pk',
                            'filterStmt' : -1
                        }];
                        delete protoObj.__ptConfig.name;
                    } else {
                        prLayout = {
                            xtype : 'label',
                            margin : '4',
                            padding : '4',
                            border : 1,
                            text : 'ERROR: grid definition not found ' + protoObj.viewCode,
                            style : {
                                borderColor : 'red',
                                borderStyle : 'solid',
                                bodyStyle : ';border-right:none;border-left:none;border-top:none;'
                            }
                        };
                        _SM.errorMessage('defineProtoFormItem', protoObj.viewCode + ' not found!!');
                    }
                } else if (__ptType == 'htmlset') {

                    template = getTemplate(__ptType, true);
                    prLayout = Ext.apply(template.__ptConfig, protoObj.__ptConfig);

                    prLayout.htlmFields = protoObj.items;
                    delete protoObj.__ptConfig.name;

                } else if (__ptType == 'detailButton') {

                    template = getTemplate(__ptType, true);
                    prLayout = Ext.apply(template.__ptConfig, protoObj.__ptConfig);
                    prLayout.minWidth = 100;

                } else {

                    template = getTemplate(__ptType, true);
                    prLayout = Ext.apply(template.__ptConfig, protoObj.__ptConfig);

                    // Agrega los items
                    prLayout.items = [];
                    var prItems, ix, prVar, prFld;
                    prItems = protoObj.items;

                    for (ix in prItems ) {
                        if (ix.indexOf("__pt") == 0) {
                            continue;
                        }

                        prVar = prItems[ix];
                        prFld = defineProtoFormItem(me, protoObj, prVar, ix);
                        if (prFld) {
                            prLayout.items.push(prFld);
                        }

                    }

                }

                // Establece el layout  ( Columns )
                var sAux, ix;
                sAux = prLayout['fsLayout'];
                if (sAux) {

                    prLayout.defaultType = 'textfield';
                    prLayout.layout = 'column';
                    prLayout.defaults = {
                        padding : '2 2'
                    };

                    if (sAux == "1col") {
                        prLayout.defaults.columnWidth = 1;
                    } else if (sAux == "2col") {
                        prLayout.defaults.columnWidth = 0.5;
                    } else if (sAux == "3col") {
                        prLayout.defaults.columnWidth = 0.33;
                    }
                    delete prLayout.fsLayout;

                    // Parametros de labels
                    prLayout.fieldDefaults = {};
                    setFieldDefaults(prLayout, 'labelAlign');
                    setFieldDefaults(prLayout, 'labelWidth');
                    setFieldDefaults(prLayout, 'hideLabel');

                }

                // Tooltip
                if (prLayout['tooltip']) {

                    prLayout['listeners'] = {
                        render : function(c) {
                            Ext.create('Ext.tip.ToolTip', {
                                target : c.getEl(),
                                trackMouse : true,
                                html : prLayout['tooltip']
                            });
                        }
                    };

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

            } else if (sDataType == "array") {
                var prVar, prFld;
                prLayout = [];
                for (ix in protoObj ) {
                    prVar = protoObj[ix];

                    // Si es un array el padre es ../..
                    prFld = defineProtoFormItem(me, parent, prVar, ix);
                    if (prFld) {
                        prLayout.push(prFld);
                    }
                }

            }

            return prLayout;

        }

        // @formatter:off
        var me = this, myFormDefinition, myMeta, ixV, lObj, prItem;
        // @formatter:on

        myFormDefinition = _SM.clone(this.myMeta.formConfig);
        myMeta = this.myMeta;

        me.prFormLayout = [];

        for (ixV in myFormDefinition.items) {
            lObj = myFormDefinition.items[ixV];

            // Envia el contenedor y el objeto
            prItem = defineProtoFormItem(me, {
                __ptType : 'panel'
            }, lObj);
            me.prFormLayout.push(prItem);
        }

    }
});