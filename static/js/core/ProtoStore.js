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


function getProxyDefinition( stDef )  {

    return {
            type: 'ajax',
            batchActions : true, 
            batchOrder : "create,update,destroy", 
            api: {
                 read :   'protoLib/protoList/',
                 create:  'protoLib/protoAdd/',
                 update:  'protoLib/protoUpd/',
                 destroy: 'protoLib/protoDel/'
            },
            actionMethods: {
                    create : 'POST',
                    read   : 'POST',
                    update : 'POST',
                    destroy: 'POST'
            },    
            reader: {
                type: 'json',
                root: 'rows',
                successProperty: 'success',
                totalProperty: 'totalCount',
                messageProperty: 'message'
            },

            writer: {
                type: 'json',
                root: 'rows', 
                allowSingle: false, 
                writeAllFields: true,
                encode: true,            // Dgt:  Incluye los parametros en el post ( por defecto en el get )
                messageProperty: 'message'
            },

            extraParams : {
                protoOption : stDef.protoOption,
                protoFilter : stDef.protoFilter,
                baseFilter: stDef.baseFilter, 
                protoMeta  : stDef.sProtoMeta    // String 
            },    

            listeners: {

                // 'load' :  function(store,records,options) { this.loaded = true }
                'exception': function(proxy, response, operation){
                    // var msg = operation.request.scope.reader.jsonData["message"] ;
                    var msg = 'REMOTE EXCEPTION: ' + operation.getError();
                    __StBar.showError( msg , 'storeException'); 
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
            
        }    
    
}; 

function getStoreDefinition(  stDef  ){ 

    // En la definicion como clase 
    // initComponent: function() {
        // this.sorters = stDef.sorters || [{ property: 'xx', direction: 'ASC' }]
        // this.idProperty = 
        // stDef.fields = 
        // this.callParent(arguments);
    // }, 

    var myStore = Ext.create('Ext.data.Store', {
        // model : stDef.model,

        protoOption : stDef.protoOption,

        model: getModelName( stDef.protoOption  ),  
        autoLoad: stDef.autoLoad,
        pageSize: stDef.pageSize,
        sorters: stDef.sorters,    

        remoteSort: true,
        autoSync: true, 

        proxy: getProxyDefinition( stDef ), 
        
        // Redefinicion de metodos 
        
        // sort: function ( sorters ) {
            // Redefine el metodo, siempre pasa por aqui 
        // }, 


        listeners: {

            // Fires before a request is made for a new data object. ...
            beforeload: function(  store,  operation,  eOpts ) {
                __StBar.showBusy( 'loading ..' + store.protoOption, 'beforeLoad' ); 
            },
     
            // Fired before a call to sync is executed. Return false from any listener to cancel the sync
            beforesync: function ( options, eOpts ) {
                __StBar.showBusy( 'sync ..' + this.protoOption, 'beforeSync'  );
            },  
    
            // Fires whenever the records in the Store have changed in some way - this could include adding or removing records, or ...
            datachanged: function( store,  eOpts ) {
                __StBar.clear( store.protoOption , 'dataChanged' ); 
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
            write: function(store, operation, eOpts ){

                for ( var ix in operation.records ) {
                    var recResult = operation.resultSet.records[ix]
                    var recOrigin = operation.records[ix]
    
                    // Si existe un resultSet 
                    if ( recResult ) {

                        if (operation.action == 'create') {
                            //Cuando son varios inserts, Extjs no es capaz hacer la actualizacion de los registros en la grilla.
                        
                            // Copia la data resultado sobre la data de base 
                            // Tengo un campo para mandar el Id, para efectos de control, podria ser elimiando en la prox version  
                            recOrigin.data = recResult.data 
    
                        } // End create  
                    
                        else if  (operation.action == 'destroy') {
                            //Dgt:  Restaura los registros q no pudieron ser borrados, ie Integridad referencial    
                            if ( recResult.data._ptStatus != '' ) store.insert(0, recResult);
                        } // En Delete
                                        
                    } 
                
                    // Marca los registros segun el estado 
                    var stRec = recOrigin.get('_ptStatus');
                    if ( stRec ) { 
                        recOrigin.dirty = true;
                        if ( ! recOrigin.getId()  ) recOrigin.phantom = true;
                    }                           

                } 
    
            }  
        }

    })
        
    return myStore

}



function getTreeStoreDefinition(  stDef  ){ 


    var myStore = Ext.create('Ext.data.TreeStore', {
        protoOption : stDef.protoOption,
        model: getModelName( stDef.protoOption  ),  
        autoLoad: stDef.autoLoad,
        pageSize: stDef.pageSize,
        sorters: stDef.sorters,    
        proxy: getProxyDefinition( stDef ), 

        remoteSort: true,
        autoSync: true, 

        root : {
            // text:'details', 
            expanded : true
        } 

        // listeners: {
            // // Fires before a request is made for a new data object. ...
            // beforeload: function(  store,  operation,  eOpts ) {
                // __StBar.showBusy( 'loading ..' + store.protoOption, 'beforeLoad' ); 
            // },
            // // Fired before a call to sync is executed. Return false from any listener to cancel the sync
            // beforesync: function ( options, eOpts ) {
                // __StBar.showBusy( 'sync ..' + this.protoOption, 'beforeSync'  );
            // },  
            // // Fires whenever the records in the Store have changed in some way - this could include adding or removing records, or ...
            // datachanged: function( store,  eOpts ) {
                // __StBar.clear( store.protoOption , 'dataChanged' ); 
            // } 
        // }

    })
        
    return myStore

}; 


function getNewRecord( myMeta, myStore )  { 

    var myRecord = new myStore.model( setDefaults()  ) 
    
    // Lo asocia al store 
    myRecord.store = myStore
    
    return myRecord 

    function setDefaults()  {

        var vDefault = {};
        for (var ix in myMeta.fields ) {
            var vFld = myMeta.fields[ix]; 
            if ( ! vFld.defaultValue  ) { 
                continue ; 
            }
            vDefault[ vFld.name  ]  = vFld.defaultValue ;
        }
        return vDefault; 
    } 

} 

        
        

function getRecordByDataIx( myStore, fieldName, value  )  {
    var ix =  myStore.findExact( fieldName, value  )
    if ( ix == -1 ) return 
    
    return myStore.getAt( ix  ) 
    
}; 


    
function DefineProtoModel ( myMeta , modelClassName ){
        
    // dateFormat: 'Y-m-d'
    // type: 'date', 'float', 'int', 'number'

    // useNull : vFld.allowNull,  ( solo para numeros, si no puede hacer la conversion )
    // defaultValue: vFld.defaultValue,
    // persist: vFld.editPolicy,        ( falso = NoUpdate )
    
    // type: 'hasMany',
    // autoLoad: true
    // convert :  Campo Virtual calculado,  Apunta a una funcion q  genera el valor 
    
    var myFields = [];           // model Fields 
    for (var ix in myMeta.fields ) {

        var vFld  =  myMeta.fields[ix];
        
        if ( !vFld.type )  vFld.type = 'string'
        
        // modelField  
        var mField = {
            name: vFld.name,
            type: vFld.type 
            
            //TODO:  useNull : true / false    ( NullAllowed, IsNull,  NotNull )
        };


        // Tipos validos   
        if ( ! vFld.type  in oc( [ 
            'string', 'text',  'bool', 'int', 'decimal', 'combo',  
            'date',  'datetime', 'time', 
            'autofield', 'foreignid',  'foreigntext', 'protoN2N', 'html'  ] )) {
                vFld.type = 'string'
        }; 


        // 
        if ( vFld.name in oc( myMeta.gridConfig.hiddenFields )) {
            mField.hidden = true ;
            vFld.hidden = true ;
        }

        if ( vFld.name in oc( myMeta.gridConfig.readOnlyFields )) {
            mField.readOnly = true ;
            vFld.readOnly = true ;
        }


        // Determina el xType y otros parametros 
        switch( vFld.type )
        {
        case 'decimal':
            mField.type = 'number';            
            break;
        case 'protoN2N':
            mField.readOnly = true;            
            mField.type = 'list';            
            break;
        case 'date':
            mField.type = 'date';            
            mField.dateFormat ='Y-m-d' 
            break;
        case 'datetime':
            mField.type = 'date';            
            mField.dateFormat ='Y-m-d H:i:s'  // 'timestamp' 
            break;
        case 'time':
            mField.type = 'date';            
            mField.dateFormat ='H:i:s'  
            break;
        }

        // Asigna el modelo y el diccionario 
        myFields.push(mField);

    }
    
    // Agrega el status y el interna ID 
    var mField = { name: '_ptStatus', type: 'string' };
    myFields.push(mField);

    var mField = { name: '_ptId', type: 'string' };
    myFields.push(mField);

    // myFields = [{"name":"id","type":"int","useNull":true},{"name":"first","type":"string"}]
    Ext.define(modelClassName, {
        extend: 'Ext.data.Model',
        fields: myFields 
            
        //TODO: Validation, Validaciones             
        //    validations: [{
        //        type: 'length',
        //        field: 'name',
        //        min: 1
        //    }]

        });
        
}


function getFieldDict( myMeta ) {
    // For indexing fields    
    var ptDict = {};                 
    for (var ix in myMeta.fields ) {
        var vFld = myMeta.fields[ix]
        ptDict[vFld.name] = vFld;
    }
    return ptDict
}
    

function getColDefinition( vFld ) {

    if (!vFld.header ) vFld.header = vFld.name
    
    var colDefinition = {
            dataIndex: vFld.name,
            text: vFld.header 
    }

    // TODO: La propiedad EditMode debe ser reemplazada por readOnly ( negado )
    var lstProps = ['flex',  'width', 'minWidth', 'sortable',
                    'hidden',  
                    'xtype',  'readOnly', 
                    'render', 'align', 'format', 'tooltip'
                    ]

    colDefinition = copyProps ( colDefinition,  vFld, true, lstProps )


    
    // Copia las propiedades de base 
    var lstProps = [
        'defaultValue', 
    
        // string 
        'allowBlank', 'readOnly', 
        'minLength', 'minLengthText', 
        'maxLength', 'maxLengthText', 
        
        // int, decimal
        'step', 

        // int, decimal, date, datime, time  
        'minValue', 'minText', 
        'maxValue', 'maxText',  

        // date, datime 
        'disabledDays', 'disabledDaysText',       // [0, 6]
        
        /*@zoomModel : Contiene el modelo del FK, se carga automaticamente,
         * puede ser modificado para cargar una vista particular, 
         * una buena practica es dejar los modelos de base para los zooms y generar vistas 
         * para las opciones de trabajo 
         */  
        'zoomModel', 
        
        //@fkId : Llave correspondiente al zoom          
        'fkId', 

        //@zoomFilter : TODO: Filtro de base fijo para el zoom ( puede venir definido en zoomView )
        'zoomFilter', 

        //@zoomReturn : TODO: Campos q sera heredados a la entidad base  
        'zoomReturn'
        ]
    var editor = copyProps ( {},  vFld, true, lstProps )

    //TODO: vType ( eMail, IpAdress, etc ... )
    // editor.vtype = 'email'


    // Determina el xType y otros parametros 
    if ( ! vFld.type )  vFld.type = 'string'
    switch( vFld.type )
    {
    case 'string':
        if ( ! colDefinition.flex  ) colDefinition.flex = 1 
          break;

    case 'text':
        if ( ! colDefinition.flex  ) colDefinition.flex = 2 
        colDefinition.renderer = columnWrap
        break;

    case 'int':
        colDefinition['xtype'] = 'numbercolumn'
        colDefinition['align'] = 'right'
        colDefinition['format'] = '0,000'

        editor.xtype = 'numberfield'
        editor.format = colDefinition['format']
        editor.allowDecimals = false
        break;

    case 'decimal':
        colDefinition['xtype'] = 'numbercolumn'
        colDefinition['align'] = 'right'
        colDefinition['format'] = '0,000.00'
        // vFld['renderer'] = 'usMoney'

        editor.xtype = 'numberfield'
        editor.format = colDefinition['format']
        editor.allowDecimals = true
        editor.decimalPrecision = 2
        break;

    
    case 'date':
        colDefinition['xtype'] = 'datecolumn' 
        colDefinition['format'] = 'Y/m/d'

        editor.xtype = 'datefield'
        editor.format = colDefinition['format']
          break;

    case 'datetime':
        colDefinition['xtype'] = 'datecolumn' 
        colDefinition['format'] = 'Y/m/d H:i:s'

        editor.xtype = 'datefield'
        editor.format = 'Y/m/d'
        editor.timeFormat = 'H:i'
        break;

    case 'time':
        //TODO:  En la edicion de grilla, al regresar cambia el formato 
        colDefinition['xtype'] = 'datecolumn' 
        colDefinition['format'] = 'H:i'  //  'H:i:s'

        editor.xtype = 'timefield'
        editor.format = colDefinition['format']      
        break;
          
    case 'bool':
        colDefinition['xtype'] = 'checkcolumnreadonly'      
        colDefinition['editable'] = false 

        editor.xtype = 'checkbox'
        // editor.cls = 'x-grid-checkheader-editor'
        break;
          
    case 'combo':
        editor.xtype = 'combobox'
        editor.typeAhead = true
        editor.triggerAction = 'all'
        editor.selectOnTab = true
        editor.store = vFld.choices
        editor.lazyRender = true
        editor.listClass = 'x-combo-list-small'
        break;

    case 'foreigntext': 
        // El zoom se divide en 2 cols el texto ( _unicode ) y el ID ( foreignid )
        if ( ! colDefinition.flex  ) colDefinition.flex = 1 

        vFld.cellLink = true
        editor.xtype = 'protoZoom'
        editor.editable  = false 
        break;

    case 'foreignid':
        // El zoom id debe estar oculto  
           // colDefinition['hidden']= true
          editor.xtype = 'numberfield'
          editor.hidden  = true
          break;

    case 'autofield':
          break;

    }


    // Ancho minimo 
    if ( ! colDefinition.minWidth  ) { colDefinition.minWidth = 100 }
    
    
    // verificacion de xtype  
    switch( colDefinition.xtype  ){
    case 'checkcolumnreadonly':
    case 'datecolumn':
    case 'numbercolumn' : 
        break; 
    case 'checkbox': 
        colDefinition.xtype = 'checkcolumnreadonly'
        break; 
    case 'datefield':  
        colDefinition.xtype = 'datecolumn'
        break; 
    case 'numberfield': 
        colDefinition.xtype ='numbercolumn'
        break 
    default: 
        delete colDefinition.xtype
    }
         

    // Asigna las coleccoiones de presentacion
    // El foreignid puede ser editable directamente, 
    if (  vFld.type in oc([ 'autofield' ]) || vFld.readOnly  ) 
         colDefinition.renderer = cellReadOnly
    else  colDefinition['editor'] = editor; 

    // WordWrap
    if ( vFld.wordWrap == true ) colDefinition.renderer = columnWrap
    
    // Agrega un tool tip con el contenido de la celda
    if ( vFld.cellToolTip ) colDefinition.renderer = cellToolTip

    // Formatea el contenido como un hiperLink, TODO: la logica debe estar en otra propiedad
    if ( vFld.cellLink ) colDefinition.renderer = cellLink

    // Maneja los subtipos 
    if ( vFld.vType ) {
        // vType stopLigth  Maneja el codigo de colores para un semaforo con 3 indicadores, 2 limites Red-Yellow; Yellow-Green   
        if ( vFld.vType == 'stopLight' ) colDefinition.renderer = cellStopLight

    } 

    // sortable  ( se requiere para q no se ordenen las udps y otras )
    if ( !('sortable' in colDefinition)) { 
        colDefinition['sortable']  = vFld['fromModel'] || false 
    }


    return colDefinition; 

    //  
    function columnWrap(value){
        return '<div style="white-space:normal; text-align:justify !important";>' + value + "</div>";
    };

    function cellToolTip(value, metaData, record, rowIndex, colIndex, store, view ){
        metaData.tdAttr = 'data-qtip="' + value + '"';
        return value;
    }; 

    function cellReadOnly(value, metaData, record, rowIndex, colIndex, store, view ){
        return '<span style="color:grey;">' + value + '</span>';
    }; 

    function cellLink(value  ){
        return '<a href="#">'+value+'</a>';      
    };

    function cellStopLight(value, metaData, record, rowIndex, colIndex, store, view ){
    //TODO: Leer las propiedades stopLightRY y  stopLightYG  para comparar,  

    // vType stopLigth  Maneja el codigo de colores para un semaforo con 3 indicadores, 
    // stopLightRY : valor limite  de Rojo a Amarillo
    // stopLightYG : valor limite  de Amarillo a Verde
    // si el valor RY > YG se asume una secuencia inversa. 
    // los valores son comparados estrictamente mayor  X > RY -->  Y   

    //
        var cssPrefix = Ext.baseCSSPrefix
        var cls = [];

        if (value > 66 ) {
            cls.push(cssPrefix + 'grid-stopligth-green');
        } else if (value > 33 ) {
            cls.push(cssPrefix + 'grid-stopligth-yellow');
        } else if (value > 0 ) {
            cls.push(cssPrefix + 'grid-stopligth-red');
        }  
      
        //TODO: Probar <span>  en vez de <div> 
        // return '<span style="color:green;">' + val + '</span>';
        
        return '<div class="' + cls.join(' ')  + '">&#160;' +  value + '</div>';
      }



}

function getFormFieldDefinition( vFld ) {

    var colDefinition = getColDefinition( vFld );
    
    // Se inicializa ro, en caso de q no se encuentre en el dict  
    var formEditor = {  readOnly : true  }
    
    if ( colDefinition.editor )  formEditor = colDefinition.editor;
      
    formEditor.fieldLabel =  vFld.fieldLabel || vFld.header || vFld.name 

    // Todo: Verificar la propiedad required para agregar el indicador 
    // var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
    // afterLabelTextTpl: required,
    
    switch( vFld.type )
    {
    case 'text':
        formEditor.xtype = 'textarea'        formEditor.height = 100
        formEditor.labelAlign = 'top'
        break;

    case 'html':
        formEditor.xtype = 'textarea'
        formEditor.height = 100
        formEditor.labelAlign = 'top'
        break;
        
    case 'protoN2N':
        formEditor.xtype = 'protoList'
        formEditor.checkStyle = false
        formEditor.columnList = [ 
            { dataIndex : 'id' , hidden : false }, 
            { dataIndex : 'data', text : formEditor.fieldLabel , flex : 1 } 
            ] 
        formEditor.height = 100
        // formEditor.labelAlign = 'top'
        break;
    }

    // Inicializa los tipos 
    formEditor.__ptType = 'formField'
    if ( ! formEditor.xtype )  formEditor.xtype = 'textfield'

    
    return formEditor; 
    
}

// *********************************************************


function loadPci( protoOption, loadIfNot, options) {

        options = options || {};
        
        // Verificar si la opcion esta creada 
        var myMeta = _cllPCI[ protoOption ]
        
                
        // Verifica modelo 
        if  ( myMeta && Ext.ClassManager.isCreated(  getModelName( protoOption )  )){

            // Asigna la llave, pues si se hace una copia seguiria trayendo la misma protoOption de base 
            myMeta.protoOption = protoOption 
            return true

        } else { 
            
            // Solo retorna algo cuando se usa para evaluar 
            if ( ! loadIfNot ) return false 

            // DGT: reemplaza las funciones en caso de no existir  
            Ext.applyIf(options, {
                scope: this,
                success: Ext.emptyFn,
                failure: Ext.emptyFn
            });
        
        
            Ext.Ajax.request({
                method: 'GET',
                url: _PConfig.urlGetPCI  ,
                params : { 
                    protoOption : protoOption 
                    },
                scope: this,
                success: function(result, request) {
                    
                    var myResult = Ext.decode( result.responseText );
                    savePclCache( protoOption, myResult.protoMeta )

                    options.success.call( options.scope, result, request);

                },
                failure: function(result, request) {
                    options.failure.call(options.scope, result, request);
                }
            })
            
            return false 
            
        }  

}


function savePci( protoMeta,  options) {

    var protoOption = protoMeta.protoOption
    var sMeta = Ext.encode(  protoMeta )

    saveProtoObj( protoOption, sMeta ,  options)
        
}


function saveProtoObj( protoOption, sMeta ,  options) {

        options = options || {};
                    
        // DGT: reemplaza las funciones en caso de no existir  
        Ext.applyIf(options, {
            scope: this,
            success: Ext.emptyFn,
            failure: Ext.emptyFn
        });
    
    
        Ext.Ajax.request({
            method: 'POST',
            url: _PConfig.urlSavePCI  ,
            params : { 
                protoOption : protoOption,  
                protoMeta : sMeta  
                },
            
            success: function(result, request) {
                var myResult = Ext.decode( result.responseText );
                if(myResult.success) {
                    options.success.call( options.scope, result, request);
                } else {
                    options.failure.call(options.scope, result, request);
                    errorMessage ( 'SavePCI Failed', myResult.message  )
                }
            },
            failure: function(result, request) {
                errorMessage ( 'SavePCI Failed', result.status + ' ' + result.statusText )
                options.failure.call(options.scope, result, request);
            },
            scope: this,
            timeout: 30000
        })
        
}


function loadJsonConfig( fileName, options) {

    options = options || {};
    
    // DGT: reemplaza las funciones en caso de no existir  
    Ext.applyIf(options, {
        scope: this,
        success: Ext.emptyFn,
        failure: Ext.emptyFn
    });
    
    Ext.Ajax.request({
        method: 'GET',
        url: '/resources/' + fileName ,
        scope: options.scope,
        success: function(result, request) {
            options.success.call( options.scope, result, request);
        },
        failure: function(result, request) {
            errorMessage ( 'LoadJsonConfig', result.status + ' ' + result.statusText )
            options.failure.call(options.scope, result, request);
        }
        
    })
    
}


function defineProtoPclTreeModel() {
// Definicion del modelo para los arboles de la PCL 

    Ext.define('Proto.PclTreeNode', {
        extend: 'Ext.data.Model',
        fields: [
            {name: '__ptType',  type: 'string'},
            {name: 'text', type: 'string'},
            {name: 'id',  type: 'string'},
            // {name: 'iconCls', type: 'string', defaultValue: null, persist: false }, 
            // {name: 'ptValue', type: 'string'}, 
            
            // Referencia al modelo de base 
            {name: '__ptConfig' }
        ]
    });
    
}


function definieProtoFieldSelctionModel( protoOption ) {
    // Modelo usado en la lista de campos con la jerarquia completa de los de zoom ( detalle de fk ) 
    
    Ext.define('Proto.FieldSelectionModel', {
        extend: 'Ext.data.Model',
        proxy: {
            type: 'ajax',
            method: 'GET',
            url: _PConfig.urlGetFieldTree , 
            extraParams : {
                protoOption : protoOption 
            },    
            
        }, 
    
        fields: [
//         Contiene el nombre en notacion objeto ( django )
            {name: 'id', type: 'string'},
            
//         Contiene el nombre del campo dentro del modelo 
            {name: 'text', type: 'string'},  
            {name: 'type', type: 'string'},  

            {name: 'readOnly', type: 'boolean'},
            {name: 'allowBlank', type: 'boolean'},
            {name: 'tooltip', type: 'string'},  
            {name: 'header', type: 'string'},  

            {name: 'zoomModel', type: 'string'},  
            {name: 'fkField', type: 'string'},  
            {name: 'fkId', type: 'string'},  
            {name: 'vType', type: 'string'},  
            {name: 'defaultValue', type: 'string'},  
            {name: 'choices', type: 'string'},  

            {name: 'checked', type: 'boolean'},
            {name: 'leaf', type: 'boolean'}
        ]
        
    });
            
    
}




function getUserRights( usr, pwd , options ) {

        options = options || {};
        
        // DGT: reemplaza las funciones en caso de no existir  
        Ext.applyIf(options, {
            scope: this,
            success: Ext.emptyFn,
            failure: Ext.emptyFn
        });

    
        Ext.Ajax.request({
            method: 'POST',
            url: _PConfig.urlGetUserRights  ,
            params : { user : usr,  pwd : pwd },
            scope: this,
            success: function(result, request) {
                
                var myResult = Ext.decode( result.responseText );
                savePclCache( protoOption, myResult.protoMeta )

                options.success.call( options.scope, result, request);

            },
            failure: function(result, request) {
                options.failure.call(options.scope, result, request);
            }
        })
            
        
}

