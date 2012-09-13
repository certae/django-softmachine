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

    // Entry point if zoom 
    protoOption : null, 

    // if ReadOnly 
    isReadOnly : false, 

    // Si la forma fue cargada correctamente  
    formLoaded : false, 
    
    // Win dimension 
    myWidth : 620, 
    myHeight : 460, 

    // initComponent: function() {
        // this.callParent(arguments);
    // }, 

    constructor: function (config) {
        Ext.apply(this, config || {});
    },
    
    newProtoForm: function () {

        this.defineFormLayout()
        this.myForm = Ext.widget('protoform', {
            myMeta : this.myMeta, 
            myFormController : this, 
            prFormLayout : this.prFormLayout 
        });  

        return this.myForm

    },
    
    newWindow: function ( me ) {

        me.newProtoForm()
        updateWinPosition( me.myWidth, me.myHeight )
        
        me.myWin  = Ext.widget('window', {
            // constrain: true, 
            title : me.myMeta.description,
            closeAction: 'hide',
            width: me.myWidth,
            height: me.myHeight,
            x : _winX, 
            y : _winY, 
            minHeight: 400,
            minWidth: 400,
            layout: 'fit',
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

    },

    openNewForm: function (  myStore )   {
        
        this.isReadOnly  = false 
        this.newForm = true    

        var myRecord = getNewRecord( this.myMeta, myStore );

        // // Agrega los datos de control para la grilla 
        // myRecord.data._ptStatus = _ROW_ST.NEWROW 
        // myRecord.data._ptId = myRecord.internalId  
        // myRecord.data.id = undefined 
        // // Lo marca como nuevo 
        // myRecord.phantom = true 
        
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
            errorMessage( 'Form Error', 'no se definio registrode entrada')
            return 
        }

        this.newWindow( this ); 
        this.myForm.setActiveRecord( myRecord );
        this.myForm.store = myRecord.store 
        
        if ( this.isReadOnly ) {
            this.myForm.setFormReadOnly( true );
            
            this.myWin.tools = [{
                type: 'readOnly',
                tooltip: 'readOnly' 
            }] 
            this.myWin.addTools()
            
        } else {
            this.myForm.setReadOnlyFields( true, this.myMeta.gridConfig.readOnlyFields );            
        }
        
        this.myWin.show();
        
    }, 
    

    openZoomForm: function ( myZoomModel, myRecordId  )   {

        this.protoOption = myZoomModel

        if ( ! myRecordId ) {
            errorMessage( 'LinkedForm Error : ' +  myZoomModel, 'not fkId field definition found' )
            return 
        }

        // Obtiene la meta ( async )
        this._getFormDefinition( myRecordId) 
        
    }, 

    
    _getFormDefinition: function (  myRecordId ) {
        
        // Opciones del llamado AJAX 
        var options = {
            scope: this, 
            success: function ( obj, result, request ) {
                this.myMeta = _cllPCI[ this.protoOption ] ;
                this.formLoaded = true;
                this._loadFormData( myRecordId )
            },
            failure: function ( obj, result, request) { 
                errorMessage( 'ProtoDefinition Error :', myZoomModel + ': protoDefinition not found')
            }
        }

        if (  loadPci( this.protoOption , true, options ) ) {
                this.myMeta = _cllPCI[ this.protoOption ] ;
                this.formLoaded = true; 
                this._loadFormData( myRecordId )
        }

    }, 

        
    _loadFormData: function ( myRecordId ) {

        if ( ! this.formLoaded ) {
            console.log( 'FormController:  Form is not ready')
        }  

        if ( myRecordId ) {

            // Filter 
            var myFilter = '{"pk" : ' +  myRecordId + ',}'
    
            var storeDefinition =  {
                protoOption : this.protoOption, 
                autoLoad: true, 
                baseFilter: myFilter, 
                sProtoMeta  : getSafeMeta( this.myMeta )    
            };
    
            var myStore = getStoreDefinition( storeDefinition )
            myStore.load();
            
            myStore.on({
                'load' :  function(store,records, successful, options) {
    
                    // Fix:  Esta entrando dos veces  porq????
                    if ( this.myWin ) return 
    
                    // The form is now linked to  store  
                    this.openLinkedForm( records[0], true  )
                }, 
                scope: this }
            )

        } else  {
             // SetDefaults 
        } 
         
    }, 
    

    defineFormLayout: function( ){
        
        var me = this
        var myFormDefinition = clone( this.myMeta.protoForm )
        var myMeta = this.myMeta
        
        me.prFormLayout = [];
        me.N2Nfields = []

        for ( var ixV in myFormDefinition) {
            var lObj = myFormDefinition[ixV];
            
            // Envia el contenedor y el objeto   
            var prItem = defineProtoFormItem( {__ptType : 'panel'}, lObj )
            me.prFormLayout.push(prItem);
        }
        
        function defineProtoFormItem ( parent, protoObj, protoIx ) {
        
            var prLayout , template, __ptType 
            var sDataType = typeOf(protoObj);
            var myFieldDict = getFieldDict( myMeta )
        
            if (sDataType == "object" ) { 
        
                // Configura el objeto
                if ( ! protoObj.__ptConfig )  
                    protoObj.__ptConfig = get_ptConfig( protoObj )
                    
                if ( ! protoObj.__ptConfig.name ) 
                    protoObj.__ptConfig.name = protoIx 
                
                
                __ptType = protoObj.__ptConfig.__ptType || protoObj.__ptType
                
                if ( ! __ptType   ) {
                    console.log( 'El objeto no tiene tipo definido' , protoObj )
                    return {}

                } else if ( __ptType == 'formField'  ) {
        
                    // protoIx es el field Name, si no viene debe buscarlo en __ptConfig [ name ]
                    protoIx = protoObj.name || protoObj.__ptConfig.name 
                    
                    var myFld =  myFieldDict[ protoIx ] 
                    if ( myFld ) {
        
                        template = getTemplate( __ptType, true,  myFld  )
                        prLayout = Ext.apply( template.__ptConfig , protoObj.__ptConfig  )
        
                        // ReadOnlyCls
                        prLayout[ 'readOnlyCls' ] = 'protofield-readonly'
        
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
                    
                    template = getTemplate( __ptType  , true  )
                    prLayout = Ext.apply( template.__ptConfig , protoObj.__ptConfig  ) 
                    
                    // Inicia la grilla sin datos 
                    prLayout.initialFilter = { 'pk': -1 }
        
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
                var saux = prLayout[ key ]
                if  ( saux  )  prLayout.fieldDefaults[ key ] = sAux
            }
        } 
    
    } 


      
})
