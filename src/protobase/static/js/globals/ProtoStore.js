/*
 * Clase generica para el manejo del Store

 Ext.define('ProtoUL.core.ProtoStore', {
 extend: 'Ext.data.Store',

 * El manejo de la clase tiene un problema interno:
 * en grid.store.data  mantiene la definicion del primer store cargado,
 * mientras q en grid.store.raw tiene los datos correctos,
 *
 * solucion: una funcion q retorne el store definido
 *
 */

/*
 "use strict";
 */
/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */
/*global ProtoUL */
/*global verifyMeta */

_SM.getStoreDefinition = function(stDef) {

    var myStore = Ext.create('Ext.data.Store', {
        viewCode : stDef.viewCode,

        model : _SM.getModelName(stDef.viewCode),
        autoLoad : stDef.autoLoad,
        pageSize : stDef.pageSize,

        remoteSort : !(stDef.localSort || false),
        sorters : stDef.sorters,
        defaultSortDirection : 'ASC',
        groupField : stDef.groupCol || '',

        sortOnLoad : true,
        autoSync : true,

        proxy : _SM.getProxyDefinition(stDef),
        storeDefinition : stDef,

        // Redefinicion de metodos
        // sort: function ( sorters ) {
        // Redefine el metodo, siempre pasa por aqui
        // },

        myLoadData : function(myFilter, mySorter, myMasterId) {
            // Centraliza  los llamados para refrescar la grilla

            // Para la navegacion md
            if (myMasterId) {
                this.protoMasterId = myMasterId;
            }

            if (myFilter) {
                this.clearFilter();
                this.getProxy().extraParams.protoFilter = _SM.obj2tx(myFilter);
                this.load();

            } else if (mySorter) {
                this.sort(mySorter);
            }

        },

        mySetBaseFilter : function(myFilter) {
            // Desde el zoom, para agregar el zoomFilter que debe ser parte de la base
            // pues no debe modeficarse con el filtro de usuario
            // recibe el filtro y lo mezcla con el baseFilter ( por ejemplo un estado )

            this.clearFilter();
            this.getProxy().extraParams.protoFilter = _SM.obj2tx([]);
            this.getProxy().extraParams.baseFilter = _SM.obj2tx(myFilter.concat(this.storeDefinition.baseFilter));
            this.load();

        },

        listeners : {

            // Fires before a request is made for a new data object. ...
            beforeload : function(store, operation, eOpts) {
                _SM.__StBar.showBusy(_SM.__language.StatusBar_Message_Loading + store.viewCode, 'beforeLoad');
            },

            // Fired before a call to sync is executed. Return false from any listener to cancel the sync
            beforesync : function(options, eOpts) {
                _SM.__StBar.showBusy(_SM.__language.StatusBar_Message_Sync + this.viewCode, 'beforeSync');
            },

            // Fires whenever the records in the Store have changed in some way - this could include adding or removing records, or ...
            datachanged : function(store, eOpts) {
                _SM.__StBar.clear(store.viewCode, 'dataChanged');

                // Guarda la info de sort
                try {
                    var mySort = _SM.clone(store.getSorters(), 0, [], ['property', 'direction']);
                    store.proxy.extraParams.sort = Ext.encode(mySort);
                } catch (e) {
                }

            },

            // Fired when a Model instance has been added to this Store ...
            // add: function ( store, records,  index,  eOpts ) {

            //  Fires before a prefetch occurs. Return false to cancel.
            // beforeprefetch: function ( store, operation, eOpts ) {

            // Fires whenever records have been prefetched
            // prefetch: function ( store, records, successful, operation,  eOpts ) {

            // Fired after the removeAll method is called. ...
            // clear: function ( store,  eOpts ) {

            // Fires whenever the store reads data from a remote data source. ...
            // load: function ( store, records,  successful,  eOpts ) {

            // Fired when a Model instance has been removed from this Store ...
            // remove: function (  store,  record,  index,  eOpts ) {

            // Fires when a Model instance has been updated ...\
            // update: function ( store,  record,  sOperation,  eOpts ) {

            // Fires whenever a successful write has been made via the configured Proxy
            write : function(store, operation, eOpts) {

                var ix;
                for (ix in operation.records) {
                    var recResult = operation.resultSet.records[ix], recOrigin = operation.records[ix];

                    // Si existe un resultSet
                    if (recResult) {

                        if (operation.action == 'create') {
                            //Cuando son varios inserts, Extjs no es capaz hacer la actualizacion de los registros en la grilla.

                            // Copia la data resultado sobre la data de base
                            // Tengo un campo para mandar el Id, para efectos de control, podria ser elimiando en la prox version
                            recOrigin.data = recResult.data;

                        }// End create
                        else if (operation.action == 'destroy') {
                            //Dgt:  Restaura los registros q no pudieron ser borrados, ie Integridad referencial
                            if (recResult.data._ptStatus !== '') {
                                store.insert(0, recResult);
                            }

                        }
                        // En Delete

                    }

                    // Marca los registros segun el estado
                    var stRec = recOrigin.get('_ptStatus');
                    if (stRec) {
                        recOrigin.dirty = true;
                        if (!recOrigin.getId()) {
                            recOrigin.phantom = true;
                        }
                    }
                }
            }
        }
    });

    return myStore;

};

_SM.getProxyDefinition = function(stDef) {

    return {
        type : 'ajax',
        batchActions : true,
        batchOrder : "create,update,destroy",
        api : {
            read : 'protoLib/protoList/',
            create : 'protoLib/protoAdd/',
            update : 'protoLib/protoUpd/',
            destroy : 'protoLib/protoDel/'
        },
        actionMethods : {
            create : 'POST',
            read : 'POST',
            update : 'POST',
            destroy : 'POST'
        },
        reader : {
            type : 'json',
            root : 'rows',
            successProperty : 'success',
            totalProperty : 'totalCount',
            messageProperty : 'message'
        },

        writer : {
            type : 'json',
            root : 'rows',
            allowSingle : false,
            writeAllFields : true,
            // Incluye los parametros en el post ( por defecto en el get )
            encode : true,
            messageProperty : 'message'
        },

        // Parametros String para la conexion al backEnd
        extraParams : {
            viewCode : stDef.viewCode,
            protoFilter : _SM.obj2tx(stDef.protoFilter),
            baseFilter : _SM.obj2tx(stDef.baseFilter),
            protoMeta : _SM.obj2tx(stDef.sProtoMeta)
        },

        listeners : {

            // 'load' :  function(store,records,options) { this.loaded = true }
            'exception' : function(proxy, response, operation) {
                // var msg = operation.request.scope.reader.jsonData["message"] ;
                var msg, myErr = operation.getError();
                if ( typeof (myErr ) == 'string') {
                    msg = myErr;
                } else {
                    msg = 'REMOTE EXCEPTION: (' + myErr.status + ') ' + myErr.statusText;
                }
                _SM.__StBar.showError(msg, 'storeException');
            }
        }

        // afterRequest: function( request, success ){
        // var title = 'afterRequest :' + request.method + '.' + request.action, msg = ''
        // try {
        // if ( request.operation.response.status != 200 ) {
        // if ( 'jsonData' in request.scope.reader ) {
        // var jsData = request.scope.reader.jsonData;
        // msg = request.scope.reader.getMessage()
        // }
        // }
        // } catch(e) {
        // msg = e.message
        // }
        // }

    };

};

_SM.getTreeStoreDefinition = function(stDef) {

    var myStore = Ext.create('Ext.data.TreeStore', {
        viewCode : stDef.viewCode,
        model : _SM.getModelName(stDef.viewCode),
        autoLoad : stDef.autoLoad,
        pageSize : stDef.pageSize,
        sorters : stDef.sorters,
        proxy : _SM.getProxyDefinition(stDef),

        remoteSort : true,
        autoSync : true,

        root : {
            // text:'details',
            expanded : true
        }

        // listeners: {
        // // Fires before a request is made for a new data object. ...
        // beforeload: function(  store,  operation,  eOpts ) {
        // _SM.__StBar.showBusy( 'loading ..' + store.viewCode, 'beforeLoad' );
        // },
        // // Fired before a call to sync is executed. Return false from any listener to cancel the sync
        // beforesync: function ( options, eOpts ) {
        // _SM.__StBar.showBusy( 'sync ..' + this.viewCode, 'beforeSync'  );
        // },
        // // Fires whenever the records in the Store have changed in some way - this could include adding or removing records, or ...
        // datachanged: function( store,  eOpts ) {
        // _SM.__StBar.clear( store.viewCode , 'dataChanged' );
        // }
        // }

    });

    return myStore;

};

_SM.getNewRecord = function(myMeta, myStore) {

    function setDefaults() {

        var vDefault = {}, ix, vFld;

        for (ix in myMeta.fields ) {
            vFld = myMeta.fields[ix];
            if (!vFld.prpDefault) {
                continue;
            }
            vDefault[vFld.name] = vFld.prpDefault;
        }
        return vDefault;
    }

    var myRecord = new myStore.model(setDefaults());

    // Lo asocia al store
    myRecord.store = myStore;
    return myRecord;

};

_SM.getRecordByDataIx = function(myStore, fieldName, value) {
    var ix = myStore.findExact(fieldName, value);
    if (ix === -1) {
        return;
    }
    return myStore.getAt(ix);
};

_SM.IsAdmField = function(vFld, myMeta) {

    // Oculta las llaves de zooms
    if (/_id$/.test(vFld.name)) {
        return true;
    }

    // Oculta el jsonField
    if (myMeta.jsonField == vFld.name) {
        return true;
    }

    // prototipos
    if (myMeta.protoEntityId) {

        // 'smOwningUser','smOwningTeam', 'smModifiedOn',
        if (vFld.name in _SM.objConv(['smCreatedBy', 'smModifiedBy', 'smCreatedOn', 'smWflowStatus', 'smRegStatus'])) {
            return true;
        }

        if (vFld.name == 'id') {
            return true;
        }
        if (vFld.name == 'entity') {
            return true;
        }

    }

    return false;
};

_SM.DefineProtoModel = function(myMeta) {

    // dateFormat: 'Y-m-d'
    // type: 'date', 'float', 'int', 'number'

    // useNull : vFld.allowNull,  ( solo para numeros, si no puede hacer la conversion )
    // prpDefault: vFld.prpDefault,
    // persist: vFld.editPolicy,        ( falso = NoUpdate )

    // type: 'hasMany',
    // autoLoad: true
    // convert :  Campo Virtual calculado,  Apunta a una funcion q  genera el valor

    // Verifica la conf del objeto de base
    myMeta = verifyMeta(myMeta, 'pcl');

    var myModelFields = [];
    // model Fields

    // Separacion de campos para facilidad del administrador
    var fieldsBase = [], fieldsAdm = [], mField = {};

    for (var ix in myMeta.fields ) {
        var vFld = myMeta.fields[ix];

        if (_SM.IsAdmField(vFld, myMeta)) {
            fieldsAdm.push(vFld);
        } else {
            fieldsBase.push(vFld);
        }

        if (!vFld.type) {
            vFld.type = 'string';
        }

        // modelField
        mField = {
            name : vFld.name,
            type : vFld.type
            //TODO:  useNull : true / false    ( NullAllowed, IsNull,  NotNull )
        };

        // Tipos validos
        if (!vFld.type in _SM.objConv(['string', 'text', 'html', 'bool', 'int', 'decimal', 'combo', 'date', 'datetime', 'time', 'protoN2N', 'autofield', 'foreignid', 'foreigntext'])) {

            vFld.type = 'string';
            mField.type = 'string';
            mField.readOnly = true;
        }

        //
        if (vFld.name in _SM.objConv(myMeta.gridConfig.hiddenFields)) {
            mField.hidden = true;
            vFld.hidden = true;
        }

        if (vFld.name in _SM.objConv(myMeta.gridConfig.readOnlyFields)) {
            mField.readOnly = true;
            vFld.readOnly = true;
        }

        if (vFld.name in _SM.objConv(myMeta.gridConfig.sortFields)) {
            vFld.sortable = true;
        }

        // Determina el xType y otros parametros
        switch( vFld.type ) {
            case 'decimal':
                mField.type = 'number';
                break;

            case 'jsonfield':
                mField.readOnly = true;
                mField.type = 'json';
                break;

            case 'date':
                mField.type = 'date';
                mField.dateFormat = 'Y-m-d';
                break;

            case 'datetime':
                mField.type = 'string';
                // DGT: ISO Format  ( utilsBase.py  JsonEncoder datetime)
                // mField.type = 'date';
                // mField.dateFormat = 'Y-m-d\\TH:i:sP';
                break;
            case 'time':
                mField.type = 'string';
                // DGT 
                // mField.type = 'date';
                // mField.dateFormat = 'H:i:s';
                break;

        }

        // Asigna el modelo y el diccionario
        myModelFields.push(mField);

    }

    // Agrega el status y el interna ID
    mField = {
        name : '_ptStatus',
        type : 'string'
    };
    myModelFields.push(mField);

    mField = {
        name : '_ptId',
        type : 'string'
    };
    myModelFields.push(mField);

    // myModelFields = [{"name":"id","type":"int","useNull":true},{"name":"first","type":"string"}]
    Ext.define(_SM.getModelName(myMeta.viewCode), {
        extend : 'Ext.data.Model',
        fields : myModelFields

        //TODO: Validation, Validaciones
        //    validations: [{ type: 'length', field: 'name', min: 1 }]

    });

    // Adiciona las dos colecciones
    myMeta.fieldsBase = fieldsBase;
    myMeta.fieldsAdm = fieldsAdm;

};

_SM.getFieldDict = function(myMeta) {
    // For indexing fields
    var ptDict = {};
    for (var ix in myMeta.fields ) {
        var vFld = myMeta.fields[ix];

        // Lo marca con la grilla de donde viene
        vFld.idProtoGrid = myMeta.idProtoGrid;

        ptDict[vFld.name] = vFld;
    }
    return ptDict;
};

_SM.getColDefinition = function(vFld) {

    if (!vFld.header) {
        vFld.header = vFld.name;
    }

    var colDefinition, lstProps, editor;

    colDefinition = {
        dataIndex : vFld.name,
        text : vFld.header
    };

    // Propiedades q seran copiadas a las columnas de la grilla
    lstProps = ['flex', 'width', 'minWidth', 'sortable', 'hidden', 'xtype', 'readOnly', 'render', 'align', 'format', 'tooltip', 'idProtoGrid'];

    colDefinition = _SM.copyProps(colDefinition, vFld, true, lstProps);

    // Copia las propiedades de base al editor
    lstProps = ['prpDefault',

    // string
    'required', 'readOnly', 'minLength', 'minLengthText', 'maxLength', 'maxLengthText',

    // int, decimal
    'step',

    // int, decimal, date, datime, time
    'minValue', 'minText', 'maxValue', 'maxText',

    // date, datime
    'disabledDays', 'disabledDaysText', // [0, 6]

    /*@zoomModel : Contiene el modelo del FK, se carga automaticamente,
     * puede ser modificado para cargar una vista particular,
     * una buena practica es dejar los modelos de base para los zooms y generar vistas
     * para las opciones de trabajo
     */
    'zoomModel', 'zoomMultiple',

    //@fkId : Llave correspondiente al zoom
    'fkId',

    //@zoomFilter : Filtro de base fijo para el zoom ( puede venir definido en zoomView )
    'zoomFilter',

    //@fromField :  Campos q sera heredados a la entidad base
    'cpFromField', 'cpFromZoom', 'idProtoGrid'];
    editor = _SM.copyProps({}, vFld, true, lstProps);

    // Requerido
    if (vFld.required === true) {
        colDefinition.allowBlank = false;
        editor.allowBlank = false;

        colDefinition.allowOnlyWhitespace = false;
        editor.allowOnlyWhitespace = false;

    }

    //TODO: vType ( eMail, IpAdress, etc ... )
    // editor.vtype = 'email'

    // Determina el xType y otros parametros
    if (!vFld.type) {
        vFld.type = 'string';
    }
    if (vFld.choices && vFld.choices.split(",").length > 1) {
        vFld.type = 'combo';
    }

    switch( vFld.type ) {
        case 'string':
            if (!colDefinition.flex) {
                colDefinition.flex = 1;
            }
            break;

        case 'text':
            if (!colDefinition.flex) {
                colDefinition.flex = 2;
            }
            colDefinition.renderer = columnWrap;
            break;

        case 'int':
        case 'secuence':
            colDefinition['xtype'] = 'numbercolumn';
            colDefinition['align'] = 'right';
            colDefinition['format'] = '0,000';

            editor.xtype = 'numberfield';
            editor.format = colDefinition['format'];
            editor.align = 'right';
            editor.allowDecimals = false;
            break;

        case 'decimal':
        case 'money':
            colDefinition['xtype'] = 'numbercolumn';
            colDefinition['align'] = 'right';
            colDefinition['format'] = '0,000.00';
            // vFld['renderer'] = 'usMoney'

            editor.xtype = 'numberfield';
            editor.format = colDefinition['format'];
            editor.align = 'right';
            editor.allowDecimals = true;
            editor.decimalPrecision = 2;
            break;

        case 'date':
            colDefinition['xtype'] = 'datecolumn';
            colDefinition['format'] = 'Y/m/d';

            editor.xtype = 'datefield';
            editor.format = colDefinition['format'];
            break;

        case 'datetime':
            // colDefinition['xtype'] = 'datecolumn'
            // colDefinition['format'] = 'Y/m/d H:i:s'
            // editor.xtype = 'datefield'
            // editor.format = 'Y/m/d'
            // editor.timeFormat = 'H:i'
            break;

        case 'time':
            //TODO:  En la edicion de grilla, al regresar cambia el formato
            colDefinition['xtype'] = 'datecolumn';
            colDefinition['format'] = 'H:i';
            //  'H:i:s'

            editor.xtype = 'timefield';
            editor.format = colDefinition['format'];
            break;

        case 'bool':
            colDefinition['xtype'] = 'mycheckcolumn';
            colDefinition['editable'] = false;
            colDefinition['inGrid'] = true;

            editor.xtype = 'checkbox';
            // editor.cls = 'x-grid-checkheader-editor'
            break;

        case 'combo':
            editor.xtype = 'combobox';
            editor.typeAhead = true;
            editor.triggerAction = 'all';
            editor.selectOnTab = true;

            // Lo normal es q venga como una lista de opciones ( string )
            var cbChoices = vFld.choices;
            if (_SM.typeOf(cbChoices) == 'string') {
                cbChoices = cbChoices.split(",");
            } else {
                cbChoices = [];
            }

            editor.store = cbChoices;
            editor.lazyRender = true;
            editor.listClass = 'x-combo-list-small';
            break;

        case 'foreigntext':
            // El zoom se divide en 2 cols el texto ( _unicode ) y el ID ( foreignid )
            if (!colDefinition.flex) {
                colDefinition.flex = 1;
            }

            vFld.cellLink = true;
            editor.xtype = 'protoZoom';
            editor.editable = false;
            break;

        case 'foreignid':
            // El zoom id debe estar oculto
            // colDefinition['hidden']= true
            editor.xtype = 'numberfield';
            editor.hidden = true;
            break;

        case 'autofield':
            break;

    }

    // Ancho minimo
    if (!colDefinition.minWidth) {
        colDefinition.minWidth = 70;
    }

    // verificacion de xtype
    switch( colDefinition.xtype  ) {
        case 'mycheckcolumn':
        case 'datecolumn':
        case 'numbercolumn' :
            break;
        case 'checkbox':
            colDefinition.xtype = 'mycheckcolumn';
            break;
        case 'datefield':
            colDefinition.xtype = 'datecolumn';
            break;
        case 'numberfield':
            colDefinition.xtype = 'numbercolumn';
            break;
        default:
            delete colDefinition.xtype;
    };

    // Asigna las coleccoiones de presentacion
    // El foreignid puede ser editable directamente,
    if (((vFld.type == 'autofield' ) || vFld.readOnly  ) && (vFld.type != 'bool'  )) {
        colDefinition.renderer = cellReadOnly;
    } else {
        colDefinition['editor'] = editor;
    }

    // WordWrap
    if (vFld.wordWrap === true) {
        colDefinition.renderer = columnWrap;
    }

    // Agrega un tool tip con el contenido de la celda
    if (vFld.cellToolTip) {
        colDefinition.renderer = cellToolTip;
    }

    // Formatea el contenido como un hiperLink, TODO: la logica debe estar en otra propiedad
    if (vFld.cellLink) {
        colDefinition.renderer = cellLink;
    }

    // Maneja los subtipos
    if (vFld.vType) {
        // vType stopLigth  Maneja el codigo de colores para un semaforo con 3 indicadores, 2 limites Red-Yellow; Yellow-Green
        if (vFld.vType == 'stopLight') {
            colDefinition.renderer = cellStopLight;
        }
    }

    // sortable por defecto
    if (!colDefinition.sortable) {
        colDefinition['sortable'] = false;
    }

    return colDefinition;

    //
    function columnWrap(value) {
        return '<div style="white-space:normal; text-align:justify !important";>' + value + "</div>";
    }

    function cellToolTip(value, metaData, record, rowIndex, colIndex, store, view) {
        metaData.tdAttr = 'data-qtip="' + value + '"';
        return value;
    }

    function cellReadOnly(value, metaData, record, rowIndex, colIndex, store, view) {
        return '<span style="color:grey;">' + value + '</span>';
    };

    function cellLink(value) {
        return '<a href="#">' + value + '</a>';
    };

    function cellStopLight(value, metaData, record, rowIndex, colIndex, store, view) {
        /*
         TODO: Leer las propiedades stopLightRY y  stopLightYG  para comparar,

         vType stopLigth  Maneja el codigo de colores para un semaforo con 3 indicadores,
         stopLightRY : valor limite  de Rojo a Amarillo
         stopLightYG : valor limite  de Amarillo a Verde
         si el valor RY > YG se asume una secuencia inversa.
         los valores son comparados estrictamente mayor  X > RY -->  Y

         */

        var cssPrefix = Ext.baseCSSPrefix, cls = [];

        if (value > 66) {
            cls.push(cssPrefix + 'grid-stopligth-green');
        } else if (value > 33) {
            cls.push(cssPrefix + 'grid-stopligth-yellow');
        } else if (value > 0) {
            cls.push(cssPrefix + 'grid-stopligth-red');
        }

        //TODO: Probar <span>  en vez de <div>
        // return '<span style="color:green;">' + val + '</span>';

        return '<div class="' + cls.join(' ') + '">&#160;' + value + '</div>';
    }

};

_SM.getFormFieldDefinition = function(vFld) {

    var colDefinition = _SM.getColDefinition(vFld), formEditor = {
        readOnly : true
    };

    // Se inicializa ro, en caso de q no se encuentre en el dict

    if (colDefinition.editor) {
        formEditor = colDefinition.editor;
    }

    // Field Label
    formEditor.name = vFld.name;
    formEditor.fieldLabel = vFld.fieldLabel || vFld.header || vFld.name;
    formEditor.fieldLabel = formEditor.fieldLabel.replace('<strong>', '').replace('</strong>', '');
    formEditor.fieldLabel = formEditor.fieldLabel.replace('<b>', '').replace('</b>', '');
    if (vFld.required) {
        formEditor.fieldLabel = '<strong>' + formEditor.fieldLabel + '</strong>';
    }
    if (vFld.primary) {
        formEditor.afterLabelTextTpl = _SM._requiredField;
    }
    formEditor.fieldLabel = Ext.util.Format.capitalize(formEditor.fieldLabel);

    // Add listener to avoid whitespaces
    // This works fine with ExtJS 4.2.2
    // Fix : error when  butoonDetail.addForm 
    if (vFld.required && !vFld.fkId) {
        formEditor.listeners = {
            // blur : function() {
                // this.setValue(Ext.String.trim(this.getValue()));
            // },
            render : function(field) {
            }
        };
    }
    
    // Casos especiales
    switch( vFld.type ) {
        case 'text':
            formEditor.xtype = 'textarea';
            formEditor.height = 100;
            formEditor.labelAlign = 'top';
            // grow, growMax, growMin
            break;

        case 'html':
            formEditor.xtype = 'textarea';
            formEditor.height = 100;
            formEditor.labelAlign = 'top';
            break;
		
		case 'filefield':
			formEditor.xtype = 'filefield';
            formEditor.buttonText = 'Select file...';
			break;
        // case 'protoN2N':
        // formEditor.xtype = 'protoList'
        // formEditor.checkStyle = false
        // formEditor.columnList = [
        // { dataIndex : 'id' , hidden : false },
        // { dataIndex : 'data', text : formEditor.fieldLabel , flex : 1 }
        // ]
        // formEditor.height = 100
        // // formEditor.labelAlign = 'top'
        // break;
    }

    // Inicializa los tipos
    formEditor.__ptType = 'formField';
    if (!formEditor.xtype) {
        formEditor.xtype = 'textfield';
    }
    return formEditor;

};

// *********************************************************

_SM.loadPci = function(viewCode, loadIfNot, options) {
    // TODO: refactor,  ne pas besoin de retourner true/false; retourner toujour option.xx.call( )

    options = options || {};

    // Verificar si la opcion esta creada
    var myMeta = _SM._cllPCI[viewCode];

    // Verifica modelo
    if (myMeta && Ext.ClassManager.isCreated(_SM.getModelName(viewCode))) {

        // Asigna la llave, pues si se hace una copia seguiria trayendo la misma viewCode de base
        myMeta.viewCode = viewCode;
        return true;

    } else {

        // Solo retorna algo cuando se usa para evaluar
        if (!loadIfNot) {
            return false;
        }

        Ext.applyIf(options, {
            scope : this,
            success : Ext.emptyFn,
            failure : Ext.emptyFn
        });

        Ext.Ajax.request({
            method : 'POST',
            url : _SM._PConfig.urlGetPCI,
            params : {
                viewCode : viewCode
            },
            scope : this,
            success : function(result, request) {

                var myResult = Ext.decode(result.responseText);
                if (myResult.success) {
                    _SM.savePclCache(viewCode, myResult.protoMeta);
                    _SM._UserInfo.perms[viewCode] = myResult.permissions;
                    options.success.call(options.scope, result, request);
                } else {
                    _SM.errorMessage('loadPC', myResult.message);
                    options.failure.call(options.scope, result, request);
                }
            },
            failure : function(result, request) {
                _SM.errorMessage('loadPC', '');
                options.failure.call(options.scope, result, request);
            }
        });

        return false;

    }

};

_SM.savePci = function(protoMeta, options) {

    if (!protoMeta) {
        return;
    }

    var viewCode = protoMeta.viewCode;
    protoMeta.updateTime = _SM.getCurrentTime();

    if (protoMeta.fieldsBase) {
        // Excluye las colecciones auxiliares de campos
        protoMeta = _SM.clone(protoMeta);
        delete protoMeta.fieldsBase;
        delete protoMeta.fieldsAdm;
        delete protoMeta.custom;
    }

    var sMeta = Ext.encode(protoMeta);
    _SM.saveProtoObj(viewCode, sMeta, options);

};

_SM.saveProtoObj = function(viewCode, sMeta, options) {

    options = options || {};
    Ext.applyIf(options, {
        scope : this,
        success : Ext.emptyFn,
        failure : Ext.emptyFn
    });

    Ext.Ajax.request({
        method : 'POST',
        url : _SM._PConfig.urlSaveProtoObj,
        params : {
            viewCode : viewCode,
            protoMeta : sMeta
        },

        success : function(result, request) {
            var myResult = Ext.decode(result.responseText);
            if (myResult.success) {
                options.success.call(options.scope, result, request);
            } else {
                options.failure.call(options.scope, result, request);
                _SM.errorMessage(_SM.__language.Message_Error_SaveProtoObj, myResult.message);
            }
        },
        failure : function(result, request) {
            _SM.errorMessage(_SM.__language.Message_Error_SaveProtoObj, result.status + ' ' + result.statusText);
            options.failure.call(options.scope, result, request);
        },
        scope : this,
        timeout : 30000
    });

};

_SM.loadJsonConfig = function(fileName, options) {

    options = options || {};
    Ext.applyIf(options, {
        scope : this,
        success : Ext.emptyFn,
        failure : Ext.emptyFn
    });

    Ext.Ajax.request({
        method : 'POST',
        url : '/resources/' + fileName,
        scope : options.scope,
        success : function(result, request) {
            options.success.call(options.scope, result, request);
        },
        failure : function(result, request) {
            _SM.errorMessage('LoadJsonConfig', result.status + ' ' + result.statusText);
            options.failure.call(options.scope, result, request);
        }
    });

};

_SM.defineProtoPclTreeModel = function() {

    // Definicion del modelo para los arboles de la PCL

    Ext.define('Proto.PclTreeNode', {
        extend : 'Ext.data.Model',
        fields : [{
            name : '__ptType',
            type : 'string'
        }, {
            name : 'text',
            type : 'string'
        }, {
            name : 'id',
            type : 'string'
        },
        // {name: 'iconCls', type: 'string', prpDefault: null, persist: false },
        // {name: 'ptValue', type: 'string'},

        // Referencia al modelo de base
        {
            name : '__ptConfig'
        }]
    });

};

_SM.getSheeReport = function(viewCode, sheetName, selectedKeys, options) {

    options = options || {};
    Ext.applyIf(options, {
        scope : this,
        success : Ext.emptyFn,
        failure : Ext.emptyFn
    });

    Ext.Ajax.request({
        method : 'POST',
        url : _SM._PConfig.urlGetSheetReport,
        params : {
            viewCode : viewCode,
            sheetName : sheetName,
            selectedKeys : Ext.encode(selectedKeys)
        },

        success : function(result, request) {
            options.success.call(options.scope, result, request);
        },
        failure : function(result, request) {
            _SM.errorMessage(_SM.__language.Message_Error_Reporting, result.status + ' ' + result.statusText);
            options.failure.call(options.scope, result, request);
        },
        scope : this,
        timeout : 60000
    });
};

_SM.doProtoActions = function(viewCode, actionName, selectedKeys, detKeys, parameters, actionDef, options) {

    parameters = parameters || [];
    options = options || {};

    Ext.applyIf(options, {
        scope : this,
        success : Ext.emptyFn,
        failure : Ext.emptyFn
    });

    Ext.Ajax.request({
        method : 'POST',
        url : _SM._PConfig.urlDoAction,
        params : {
            viewCode : viewCode,
            actionName : actionName,
            parameters : Ext.encode(parameters),
            actionDef : Ext.encode(actionDef),
            selectedKeys : Ext.encode(selectedKeys), 
            detKeys : Ext.encode(detKeys)
        },

        success : function(result, request) {
            options.success.call(options.scope, result, request);
        },
        failure : function(result, request) {
            _SM.errorMessage('ActionReport Failed', result.status + ' ' + result.statusText);
            options.failure.call(options.scope, result, request);
        },
        scope : this,
        timeout : 60000
    });

};

_SM.sortObjByName = function(a, b) {
    var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
    //sort string ascending
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
    //default return value (no sorting)
};

_SM.getDetailDefinition = function(myMeta, viewCode) {
    var ixD, lDet;

    for (ixD in myMeta.detailsConfig ) {
        lDet = myMeta.detailsConfig[ixD];
        if (lDet.conceptDetail === viewCode) {
            return lDet;
        }
    }

    return {}; 

};