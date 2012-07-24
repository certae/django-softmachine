/*  ---  ProtoForm  
 
    Se llama genericamente forma, y corresponde a un panel que puede ser adosado a una ventana 
    o a un contenedor cualquiera,
 
    La forma se divide en secciones,  las secciones son de un tipo particular correspondiente 
    a los diferentes contenedores,  las secciones por defecto son simplemente fieldset
    
    El el arbol solo se encontraran 
    
        Secciones 
            Secciones 
                ....
                    fieldset  
                        Campos  

    no deberia mezclarse en el diseno campos y secciones dentro del mismo contenedor
    los field set son los contenedores de campos, los demas solo pueden contener otros contenedores    

    renderer: this.formatDate,
 */

Ext.define('ProtoUL.view.ProtoForm', {
    extend : 'Ext.form.Panel',
    alias : 'widget.protoform',

    requires : ['Ext.form.field.Text', 'Ext.form.*', 'Ext.data.*', 'Ext.tip.QuickTipManager'],
    
    //@myMeta   Base Definition  
    myMeta : null, 

    //@protoForm  Objeto correspondiente a la forma en la meta ( forma parte de la meta ) 
    protoForm : null, 

    //@prFormLayout  :  Componentes de la forma ( Itmems del arbol )   
    prFormLayout : [], 


    initComponent : function() {
        this.addEvents('create');

        // Recupera la clase para obtener la meta ------------------------------------------
        var myMeta = this.myMeta;
        var _pForm = this;

        this.prFormLayout = [];

        var myFormDefinition = clone( myMeta.protoForm )

        for ( var ixV in myFormDefinition) {
            var lObj = myFormDefinition[ixV];
            
            // Envia el contenedor y el objeto   
            var prItem = this.defineProtoFormItem({
                __ptType : 'panel'
            }, lObj )
            
            this.prFormLayout.push(prItem);
        }


        Ext.apply(this, {
            frame      : true,
            autoScroll : true,
            
            bodyStyle: 'padding:5px 5px',
            bodyPadding: 10,
            activeRecord : null,
            
            items : this.prFormLayout,
            dockedItems : this.getDockedItems(), 

            tools: [{
                type: 'gear',
                scope: this,
                handler: this.showFormConfig,
                tooltip: 'Form Config ... ' }
            , { 
                type: 'gear',
                scope: this,
                handler: this.showLayoutConfig,
                tooltip: 'LayoutConfig ... '                    
            }]
            
        });
        this.callParent();
    },
    

    defineProtoFormItem : function( parent, protoObj, protoIx ) {

        var prLayout , template, __ptType 
        var sDataType = typeOf(protoObj);

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
                
                var myFld =  this.myMeta.__ptDict[ protoIx ] 
                if ( ! myFld ) {
                    console.log( 'formField sans name :' , protoObj )
                    // myFld =  this.myMeta.__ptDict[ protoObj.__ptConfig.name  ]   
                }
                
                template = getTemplate( __ptType, true,  myFld  )
                prLayout = Ext.apply( template.__ptConfig , protoObj.__ptConfig  )

                // ReadOnlyCls
                prLayout[ 'readOnlyCls' ] = 'protofield-readonly'


            } else if ( __ptType == 'protoGrid'  ) {
                
                template = getTemplate( __ptType  , true  )
                prLayout = Ext.apply( template.__ptConfig , protoObj.__ptConfig  ) 

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
                    var prFld = this.defineProtoFormItem( protoObj, prVar, ix )
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
                var prFld = this.defineProtoFormItem( parent, prVar , ix)
                if(prFld) prLayout.push(prFld);
            }
    
        }

        return prLayout 
        
        function setFieldDefaults(  prLayout, key ) {
            // Asigna los fieldDefaults q vienen en los contenedores 
            var saux = prLayout[ key ]
            if  ( saux  ) 
                prLayout.fieldDefaults[ key ] = sAux
            
        }
                
    }, 
    

    showFormConfig: function () {
            var safeConf =  clone( this.myMeta.protoForm )
            showConfig( 'Form Config' , safeConf   )
       },

    showLayoutConfig: function () {
            var safeConf =  clone( this.prFormLayout  )
            showConfig( 'LayoutConfig' , safeConf   )
       },
        
    
    setActiveRecord : function(record) {
        this.activeRecord = record;
        if(record) {
            // this.down('#save').enable();
            this.getForm().loadRecord(record);
        } else {
            // this.down('#save').disable();
            this.getForm().reset();
        }
    },
    
    onSave : function() {
        var active = this.activeRecord
        var form = this.getForm();

        if(!active) {
            return;
        }
        if(form.isValid()) {
            form.updateRecord(active);
            this.onReset();
        }
    },
    onCreate : function() {
        var form = this.getForm();

        if(form.isValid()) {
            this.fireEvent('create', this, form.getValues());
            form.reset();
        }

    },
    onReset : function() {
        
        /**
         *      this.activeRecord  es la copia de mi registro, 
         *      
         *      this.getForm().getValues()  Obtiene una copia de los campos presentes en la forma, 
         *          para actualizarlos en el registro se deben recorrer uno a uno,  
         *          es una coleccion estandar

         *      this.getForm().setValues()  permite mostrar valores sobre los campos presentes
         *          si el campo no existe, no hace nada 
         *   
         *      La actualizacion de campos debe hacerse sobre el activeRecord y con setValues, 
         *      de esta forma no hay necesidad de incluir campos ocultos, al momento de guardar la forma 
         *      se traeran los campos visibles  (  getValues  ) y se actualizan uno a uno, sobre activeRecord  
         *      se guarda siempre el activeRecord 
         * 
         *      La actualizacion BackEnd se puede hacer con  submit ( action.submit )
         *      o trabajando directamente con el modelo mediante  updateRecord 
         */
        
        
        console.log ( this.activeRecord  ) 
        // this.setActiveRecord(null);
        // this.getForm().reset();
    },
        

    setFormReadOnly: function( bDisable ){
        
        // Fix : Error ExtJs ??? dice q el obj no tiene metodo isXType 
        // this.setDisabled( bDisable )
        
        this.setReadOnlyFields( bDisable )
    }, 


    setReadOnlyFields: function( bReadOnly , readOnlyFields ){
          
        // var readOnlyCls = 'protofield-readonly'
        var myFields = this.getForm().getFields();
    
        Ext.Array.forEach( myFields.items , function( obj ) {
        
            if ( obj.readOnly ) {
                obj.setReadOnly( true );
                // obj[bReadOnly ? 'addCls' : 'removeCls']( readOnlyCls );
                // if ( obj.xtype != 'htmlfield' ) obj.setDisabled( true  );
                
            } else if ( ! readOnlyFields  || ( obj.name in oc( readOnlyFields )  )  ) {
                obj.setReadOnly( bReadOnly );
                
            }; 
        
        });
          
      },
       
    getDockedItems: function() {
      
      return     [{
        xtype : 'toolbar',
        dock : 'bottom',
        ui : 'footer',
        items : ['->', {
            iconCls : 'icon-save',
            itemId : 'save',
            text : 'Save',
            disabled : true,
            scope : this,
            handler : this.onSave
        }, {
            iconCls : 'icon-reset',
            text : 'Reset',
            scope : this,
            handler : this.onReset
        }]
    }]
 
  } 
    
    
    
});


//TODO:  Agregar tooltip a los campos 

/* 
{
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
