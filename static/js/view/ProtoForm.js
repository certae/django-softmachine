Ext.define('ProtoUL.view.ProtoForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.protoform',

	requires : ['Ext.form.field.Text', 'Ext.form.*', 'Ext.data.*', 'Ext.tip.QuickTipManager'],

	initComponent : function() {
		this.addEvents('create');

		// Recupera la clase para obtener la meta ------------------------------------------
		var myMeta = this.myMeta;
		var _pForm = this;

		// Definicion de Fields        ------------------------------------------
		// if (!vFld.header || vFld.storeOnly) {continue;}
		// allowBlank : false,
		// hidden : vFld.hidden
		// width: vFld.width ,
		// minWidth: vFld.minWidth
		// renderer: this.formatDate,


	    var prFormLayout = [];
	    
	    for ( var ixV in myMeta.protoFieldSet) {
	        var section = myMeta.protoFieldSet[ixV];
	        
	        var prItem = this.defineProtoFormItem({
	            style : 'panel'
	        }, section)
	        
	        prFormLayout.push(prItem);
	    }


		this.prFormLayout = prFormLayout;

		Ext.apply(this, {

	        frame : true,
	        autoScroll : true,
	        // bodyPadding: 10,
	        xtype : 'container',
	        layout : 'fit',
	        defaults : {
	            anchor : '100%'
	        },
			activeRecord : null,
			iconCls : 'icon-user',
			
			// defaultType : 'textfield',
			// bodyPadding : 5,
			// fieldDefaults : {
				// anchor : '100%',
				// xtype : 'textfield',
				// labelAlign : 'right'
			// },
			items : prFormLayout,
			dockedItems : [{
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
					iconCls : 'icon-user-add',
					text : 'Create',
					scope : this,
					handler : this.onCreate
				}, {
					iconCls : 'icon-reset',
					text : 'Reset',
					scope : this,
					handler : this.onReset
				}]
			}],

		    tools: [{
		        type: 'gear',
				scope: this,
		        handler: this.showMetaConfig,
		        tooltip: 'Meta Config ... '
		     },{
		        type: 'gear',
				scope: this,
		        handler: this.showColsConfig,
		        tooltip: 'LayoutConfig ... '
		    }]
			
		});
		this.callParent();
	},
	
	showMetaConfig: function () {
    	var safeConf =  clone( this.myMeta  );
    	delete safeConf.dict 
    	this._showConfig( 'MetaConfig', safeConf )
       },

    showColsConfig: function () {
        	var safeConf =  clone( this.prFormLayout  )
        	this._showConfig( 'ColsConfig' , safeConf   )
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
	
	
	defineProtoFormField : function(prVar) {
		/*  ----------------------------------------------------------------------------------
		 * Define la creacion de campos,  
		 * utiliza los valores por defecto,  
		 * crea agrupaciones fieldContainer 
		 * --------------------------------------------------------------------------------- */

		var _labelWidth = 150;
		var prFld = {}

		if( typeof (prVar) == 'string') {

			var vFld = this.getProtoField ( this.myMeta, prVar )

			prFld = getFormFieldDefinition ( vFld ) ;
			if ( ! prFld ) prFld = { readOnly : true }
			prFld.name = prVar;

		} else if(typeOf(prVar) == 'object') {
			// if ( !prVar.name ) console.log( prVar ) 

			var vFld = this.getProtoField ( this.myMeta, prVar.name  )

			prFld = getFormFieldDefinition ( vFld ) ;
			if ( ! prFld ) prFld = { readOnly : true }

			prFld = copyProps( prFld, prVar, false ) ;
			
			// if(prVar.width) prFld.width = prVar.width;
			// if(prVar.anchor) prFld.anchor = prVar.anchor;
			// if(prVar.flex) 	prFld.flex = prVar.flex;
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
				var prFld2 = this.defineProtoFormField(prVar2)
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

				
		return prFld;
	},
	
	getProtoField : function(myMeta, fldName) {
		var dict = myMeta.dict; 
		if ( ! dict[fldName] ) dict[fldName] = {} 	
		return dict[fldName]
	},
	
	
	defineProtoFormItem : function(parent, prSection) {
		/* ---------------------------------------------------------------------
		 * Se asegura de un tipo de section valida, La section es la unica que tiene
		 * campos definidos Las cajas solo pueden contener otras sectiones
		 * -----------------------------------------------------------------		 */

		var prLayout = {
			items : []
		};

		if(!(prSection.style in oc(['Section', 'HBox', 'Tab', 'VBox', 'Accordion', 'Grid']))) {
			prSection.style = 'Section'
			if(prSection.items)
				prSection.style = 'HBox'
		}

		if(parent.style == 'HBox') {
			// Las cajas al interior de un box no pueden estar collapsadas
			if(prSection.collapsed)
				prSection.collapsed = undefined;
		};

		// Define los campos
		if(prSection.style == 'Section') {

			prLayout.xtype = 'container';
			prLayout.frame = true;
			// prLayout.border = 10;
			prLayout.margins = '10 10 0';
			prLayout.layout = 'anchor';
			prLayout.defaultType = 'textfield';
			prLayout.anchor = '100%';
			prLayout.defaults = {
				flex : 1,
				anchor : '100%', 
				xtype : 'textfield', 
				msgTarget : 'side',
				margins: '10 10 0', 
				allowBlank : false,
				readOnly : false
			};
			prLayout.fieldDefaults = {
				labelAlign: 'left',
			    labelWidth: 100
				// labelStyle: 'font-weight:bold;padding:0',
				// hideLabel: true
			};
 
			if(prSection.title || prSection.collapsible || prSection.frame) {
				prLayout.xtype = 'fieldset';
				prLayout.padding = 5;

				if(prSection.title)
					prLayout.title = prSection.title;
				if(prSection.collapsible)
					prLayout.collapsible = prSection.collapsible;
				if(prSection.collapsed)
					prLayout.collapsed = prSection.collapsed;
				if(prSection.checkField)
					prLayout.checkboxToggle = true;
			}

			if(parent.style == 'Accordion') {
				prLayout.xtype = 'panel';
				prLayout.margins = '2';
				prLayout.frame = true;
				prLayout.bodyBorder = true;
			}

			if(prSection.autoScroll) {
				prLayout.autoScroll = true;
				prLayout.xtype = 'panel';
			}

			// TRBL, TB RL, T RL B
			// if(prSection.margins)
				// prLayout.defaults.margins = prSection.margins;
			// if(prSection.padding)
				// prLayout.defaults.padding = prSection.padding;

			prLayout.fieldDefaults = {};
			if(prSection.labelAlign)
				prLayout.fieldDefaults.labelAlign = prSection.labelAlign;
			if(prSection.labelWidth)
				prLayout.fieldDefaults.labelWidth = prSection.labelWidth;
			if(prSection.labelStyle)
				prLayout.fieldDefaults.labelStyle = prSection.labelStyle;

			for(var ix in prSection.fields) {
				var prVar = prSection.fields[ix];
				prFld = this.defineProtoFormField(prVar)
				if(prFld)
					prLayout.items.push(prFld);
			}

		} else if(prSection.style == 'VBox') {

			// Se requiere un contenedor para poder incluir secciones en Tabs o Accordions
			prLayout.xtype = 'container';
			prLayout.layout = 'anchor';
			prLayout.anchor = '100%';
			prLayout.defaults = {
				anchor : '100%'
			}

			if(prSection.height)
				prLayout.height = prSection.height;
			if(prSection.frame)
				prLayout.frame = prSection.frame;

			if(prSection.title || prSection.collapsible) {
				prLayout.xtype = 'panel';
				if(prSection.title)
					prLayout.title = prSection.title;
				if(prSection.collapsible)
					prLayout.collapsible = prSection.collapsible;
				if(prSection.collaped)
					prLayout.collapsed = prSection.collapsed;
			}

			for(var ix in prSection.items) {
				var section = prSection.items[ix];
				prBox = this.defineProtoFormItem(prSection, section);
				if(prBox) {
					prLayout.items.push(prBox);
				}
			}
			if(parent.style in                     oc(['Tab', 'Accordion'])) {
				prLayout.xtype = 'panel';
				prLayout.autoScroll = true;
			}

		} else if(prSection.style == 'HBox') {

			prLayout.xtype = 'container';
			prLayout.layout = 'hbox';
			prLayout.defaultType = 'textfield';
			prLayout.anchor = '100%';

			if(prSection.height)
				prLayout.height = prSection.height;

			if(prSection.title || prSection.collapsible) {
				prLayout.xtype = 'fieldset';
				if(prSection.title)
					prLayout.title = prSection.title;
				if(prSection.collapsible)
					prLayout.collapsible = prSection.collapsible;
				if(prSection.collaped)
					prLayout.collapsed = prSection.collapsed;
			}

			for(var ix in prSection.items) {
				var section = prSection.items[ix];
				prBox = this.defineProtoFormItem(prSection, section);
				if(prBox) {
					prBox.flex = 1;
					if(ix < (prSection.items.length - 1)) {
						prBox.margins = '0 5 0 0'
					} else
						prBox.margins = '0 0 0 0'
					prLayout.items.push(prBox);

				}
			}

		} else if(prSection.style in oc(['Tab', 'Accordion'])) {

			if(prSection.height)
				prLayout.height = prSection.height;

			for(var ix in prSection.items) {
				var section = prSection.items[ix];
				prBox = this.defineProtoFormItem(prSection, section);
				if(prBox) {
					prBox.title = section.title;
					if(prSection.style == 'Accordion')
						prBox.title = '<b>' + section.title + '<b>';
					prBox.autoScroll = true;
					prLayout.items.push(prBox);
				}
			}

			if(prSection.style == 'Tab') {
				prLayout.xtype = 'tabpanel';
				prLayout.activeTab = 0;
			}
			if(prSection.style == 'Accordion') {
				prLayout.layout = 'accordion';
				if(!prSection.height)
					prLayout.height = 200;

				if(parent.style == 'HBox') {
					// Contenedor q soporte el box
					var prAux = {
						xtype : 'panel',
						margins : '0'
					}
					prAux.items = [prLayout];
					prLayout = prAux;
				}
			}

		}
		return prLayout;

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
    // Ext.Array.forEach(this.query('htmlfield'), function( obj ) {
    // Ext.Array.forEach(this.query('combobox'), function( obj ) {
        
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
