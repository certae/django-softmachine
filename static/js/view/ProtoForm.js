/*  ---  ProtoForm  
 
    Se llama genericamente forma, y corresponde a un panel que puede ser adosado a una ventana 
    o a un contenedor cualquiera,
 
    Forma dinamica,  puede ser alimentada con los datos de la meta,  
    y produce un arbol de componentes que puede ser representado graficamente 
    
    El arbol de componentes tambien puede ser actualizado, generando una actualizacion 
    en la meta que debe representarse en la forma 
    
    
    La forma se divide en secciones,  las secciones son de un tipo particular correspondiente 
    a los diferentes contenedores,  las secciones por defecto son simplemente fieldset
    
    El el arbol solo se encontraran 
    
        Secciones 
            Secciones 
                .... 
                    Campos  

    no deberia mezclarse en el diseno campos y secciones dentro del mismo contenedor   
    ** dos tipos de secciones, las q manejan campos y las q manejan subsecciones ( contenedores )


        Definicion de formFields        ------------------------------------------
        if (!vFld.header || vFld.storeOnly) {continue;}
        allowBlank : false,
        hidden : vFld.hidden
        width: vFld.width ,
        minWidth: vFld.minWidth
        renderer: this.formatDate,
 
             // defaultType : 'textfield',
            // bodyPadding : 5,
            // fieldDefaults : {
                // anchor : '100%',
                // xtype : 'textfield',
                // labelAlign : 'right'
            // },

 
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

        for ( var ixV in myMeta.protoForm) {
            var lObj = myMeta.protoForm[ixV];
            
            // Envia el contenedor y el objeto   
            var prItem = this.defineProtoFormItem({
                __ptType : 'panel'
            }, lObj )
            
            this.prFormLayout.push(prItem);
        }


        Ext.apply(this, {
            frame      : true,
            autoScroll : true,
            bodyStyle: 'padding:5px 5px 0',
            // bodyPadding: 10,
            defaults : {
                anchor : '100%'
            },
            activeRecord : null,
            
            items : this.prFormLayout,
            dockedItems : this.getDockedItems()

            // tools: [{
                // type: 'gear',
                // scope: this,
                // handler: this.showLayoutConfig,
                // tooltip: 'LayoutConfig ... '
            // }]
            
        });
        this.callParent();
    },
    

    defineProtoFormItem : function(parent, protoObj, protoIx) {

        var prLayout = {}

        var sDataType = typeOf(protoObj);
        if (sDataType == "object" ) { 

            // Configura el objeto
            // TODO : cambiar el __ptConfig por ____ptConfig 
            // TODO : Hacer el __str__  readOnly y hidden  
            if ( ! protoObj.__ptConfig )  protoObj.__ptConfig = {}
            if ( protoIx ) protoObj.__ptConfig.name = protoIx 
            
            var __ptConfig = Ext.applyIf( protoObj.__ptConfig , getExtConfig ( protoObj.__ptType ) ) 

            if ( protoObj.__ptType == 'formField'  ) {
                
                prLayout =  Ext.applyIf( this.defineProtoFormField( protoObj, protoIx ), __ptConfig ) 
                
            } else {
                  
                prLayout =  __ptConfig 
    
                // Agrega los items 
                prLayout.items = []
                for(var ix in protoObj ) {
                    if ( ix.indexOf( "__pt" )  == 0 ) continue 

                    var prVar = protoObj[ix];
                    var prFld = this.defineProtoFormItem( protoObj, prVar, ix )
                    if(prFld) prLayout.items.push(prFld);
                }
            }
        
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
    }, 
    


    
    //@defineProtoFormField  Private,  
    defineProtoFormField : function(prVar, protoIx ) {
        /*  ----------------------------------------------------------------------------------
         * Define la creacion de campos,  
         * utiliza los valores por defecto,  
         * crea agrupaciones fieldContainer 
         * --------------------------------------------------------------------------------- */

        // Indicador de campo requerido 
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
         
        var _labelWidth = 150;
        var prFld = {}

        if( typeof (prVar) == 'string') {

            var vFld = this.getProtoField ( this.myMeta, prVar )

            prFld = getFormFieldDefinition ( vFld ) ;
            if ( ! prFld ) prFld = { readOnly : true }
            prFld.name = prVar;

        } else if(typeOf(prVar) == 'object') {
            // if ( !prVar.name ) console.log( prVar ) 

            var vFld = this.getProtoField ( this.myMeta, protoIx  )

            prFld = getFormFieldDefinition ( vFld ) ;
            if ( ! prFld ) prFld = { readOnly : true }

            prFld = Ext.applyIf( prFld, prVar.__ptConfig  ) ;
            
            // if(prVar.width) prFld.width = prVar.width;
            // if(prVar.anchor) prFld.anchor = prVar.anchor;
            // if(prVar.flex)     prFld.flex = prVar.flex;
            // if(prVar.labelWidth) prFld.labelWidth = pVar.labelWidth;

        } else if(typeOf(prVar) == 'array') {

            // El fieldContainer requiere!!  el defaultType 
            prFld.xtype = 'fieldcontainer';
            prFld.defaultType = 'textfield'
            prFld.combineErrors = true;
            prFld.layout = 'hbox';
            prFld.margins = 0;
            prFld.pad = 0;
            prFld.frame = false;
            prFld.defaults = {
                flex : 1
            };
            prFld.items = [];

            for(var ix in prVar) {
                var prVar2 = prVar[ix];
                var prFld2 = this.defineProtoFormField(prVar2, ix)
                if(prFld2) {
                    if(ix < (prVar.length - 1)) {
                        prFld2.margins = '0 10 0 0'
                    } else
                        prFld2.margins = '0 0 0 0'
                    prFld2.frame = false;
                    prFld.items.push(prFld2);
                }
            }

        } else {
            return
        }

        //Todo: Verificar la propiedad required para agregar el indicador 
         // afterLabelTextTpl: required,
                
        return prFld;
    },
    
    getProtoField : function(myMeta, fldName) {
        var __ptDict = myMeta.__ptDict; 
        if ( ! __ptDict[fldName] ) __ptDict[fldName] = {}     
        return __ptDict[fldName]
    },
    

    showLayoutConfig: function () {
            var safeConf =  clone( this.prFormLayout  )
            this._showConfig( 'LayoutConfig' , safeConf   )
       },
        
    _showConfig: function ( title , myConf ) {

            Ext.Msg.show({
               title: title,
               multiline : true,   
               width : 500, 
               value: Ext.encode( myConf ) 
               });

       },
    
    setActiveRecord : function(record) {
        this.activeRecord = record;
        if(record) {
            this.down('#save').enable();
            this.getForm().loadRecord(record);
        } else {
            this.down('#save').disable();
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
        this.setActiveRecord(null);
        this.getForm().reset();
    },
        

  setReadOnly: function( bReadOnly , readOnlyFields ){
      
      var readOnlyCls = '.x-protofield-readonly'
      var myFields = this.getForm().getFields();


    Ext.Array.forEach( myFields.items , function( obj ) {

        if ( ! readOnlyFields  || ( obj.name in oc( readOnlyFields )  )  ) {

            obj.setReadOnly( bReadOnly );
            // obj[bReadOnly ? 'addCls' : 'removeCls']( readOnlyCls );
            if ( obj.xtype != 'htmlfield' ) obj.setDisabled( bReadOnly );
            
        }

    });
      
    // Ext.Array.forEach(this.query('textfield'), function( obj ) {
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
