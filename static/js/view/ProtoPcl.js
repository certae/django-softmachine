/*
 *  Proto Code Library    ( PCL )
 * 
 * 	Edicion de la plc
 *  Esta forma sera invocada desde la pcl o desde el respositorio de pcls ( ProtoLib.ProtoDefinition )
 *	Por lo tanto la Pcl ya viene dada,  
 * 
 * TODO:  Function  para guardar la pcl en la Db,  poner active = true   
 * 	
 */

Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*'
]);

Ext.define('ProtoUL.view.ProtoPcl' ,{
    extend: 'Ext.container.Container',
    alias : 'widget.protoPcl',
    requires: [
	    'Ext.util.*',
	    'Ext.state.*',
	    'Ext.form.*',
        'Ext.toolbar.TextItem' 
    ],

	/* 
	 * @Required 
	 * myMeta  : Metadata   
	 */
	myMeta : null, 


	/*
	 * editMode : False is ReadOnly 
	 */
	editMode : true, 
	

    initComponent: function() {
        

		if ( ! this.myMeta  ) {
        	Ext.Msg.show({ value: 'ERROR Pcl  not loaded'});
            return; 
        }

		var me = this;         

        var _pGrid = this; 
		var myMeta = this.myMeta;         
    	this.safeMeta =  clone( myMeta, 0, [ 'dict' ] );

		// Coleccion de referencia para relacionar safeMeta con myStore ( treeStore )
		me.refDict = {}
		
		
	    Ext.define('MetaPCL', {
	        extend: 'Ext.data.Model',
	        fields: [
	            {name: 'ptProperty', type: 'string'},
	            {name: 'id',  type: 'string'},
	            {name: 'ptType',  type: 'string'},
	            {name: 'ptValue', type: 'string'}
	        ]
	    });
	
		var treeData = FormatMETA( this.safeMeta, 'pcl', 'pcl'  )
	    var myStore = Ext.create('Ext.data.TreeStore', { 
	        folderSort: true, 
            sorters: [{
		        property: 'ptProperty',
		        direction: 'ASC'
	      	}], 
	        model: 'MetaPCL',
	        root: treeData 
	    });


		// Start Cell Editing PlugIn
	    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	        clicksToEdit: 2
	    });



		//  --------------------------------------------------
		
		
		var grid = Ext.create('Ext.tree.Panel', {
	        store: myStore,
	        title:  _pGrid.safeMeta.shortTitle, 
	        
	        useArrows: true,
	        rootVisible: true,
	        multiSelect: false,
	        singleExpand: true,
            stripeRows: true, 
	        rowLines : true, 
	        // columnLines : true, 

			getCellEditor: function (record, column) {
				
				if ( ! me.editMode ) return ; 

			}, 	       
	        
	        // CellEditing 
       		plugins: [cellEditing], 	        

			// TODO: Actions to create o destroy eltos  
			bbar: [
			  { xtype: 'button', 
			  	text: 'NewNode',
	
	            handler:function(){
			        var node = store.getNodeById('node-2');
			        var n = node.appendChild({
			            task:'New Node ', //  + i++,
			            leaf: true,
			            checked: true
			        	})  
			  	 	}
			  	}
			], 
	
	        columns: [{
	            xtype: 'treecolumn', //this is so we know which column will show the tree
	            text: 'ptProperty',
	            flex: 3,
	            sortable: true,
	            dataIndex: 'ptProperty'
	        },{
	            text: 'Ix',
	            dataIndex: 'id'
	        },{
	            text: 'ptType',
	            dataIndex: 'ptType'
	        },{
	            text: 'ptValue',
	            flex: 2,
	            dataIndex: 'ptValue',
	            sortable: true, 
	            editor: {
		        	allowBlank: false
	            }
	        }], 


            listeners: {
                scope: this,
                selectionchange: function(selModel, selected) {
                	// Expone la fila seleccionada. 
                	this.selected = selected[0] || null;
            	}
            }, 
            
		    tools: [{
		        itemId: 'toolCancelEdit',
		        type: 'close',
		        hidden: false,
				scope: this,
		        handler: this.cancelChanges 
		     },{
		        itemId: 'toolSave',
		        type: 'save',
		        hidden: false,
				scope: this,
		        handler: this.saveChanges 
		     },{
		        type: 'gear',
		        handler: showMetaConfig,
		        tooltip: 'Meta Config ... '
		    }] 
             
        }); 

        this._extGrid = grid;


//----- Tipos de base 

        me.editors = {
            'date': new Ext.grid.CellEditor({
                field: new Ext.form.field.Date({
                    selectOnFocus: true
                })
            }),
            'string': new Ext.grid.CellEditor({
                field: new Ext.form.field.Text({
                    selectOnFocus: true
                })
            }),
            'number': new Ext.grid.CellEditor({
                field: new Ext.form.field.Number({
                    selectOnFocus: true
                })
            }),
            'boolean': new Ext.grid.CellEditor({
                field: new Ext.form.field.ComboBox({
                    editable: false,
                    store: [
                        [true, true],
                        [false, false]
                    ]
                })
            }), 

//------ 	Tipos extendidos
 
            'type': new Ext.grid.CellEditor({
                field: new Ext.form.field.ComboBox({
                    editable: false,
                    store: [
					    ["string", "string"],
					    ["int", "int"],
					    ["decimal", "decimal"],
					    ["bool", "bool"],
					    ["text", "text"],
					    ["date", "date"],
					    ["time", "time"],
					    ["datetime", "datetime"],
					    ["combo", "combo"],
                    ]
                })
            }), 


            
        };


		// ReadOnly Properties ( PCL )
		// var readOnlyPrpts= [ 'idProperty', 'protoOption', 'protoConcept'  ]

		// TODO: Cargar la grilla de propiedades 	
	    var propsGrid = Ext.create('Ext.grid.property.Grid', {
	    	// Asigna los titulos a las propiedades 
	        // propertyNames: { prop : 'title' }

			// source es obligatorio 
	        source : {}, 
			clicksToEdit : 2, 
	        
			getCellEditor: function (record, column) {
				
				if ( ! me.editMode ) return ; 
				
		        var pgrid = this
		        var propName = record.get(pgrid.nameField)
		        
		        // Simplemente no se incluyen 
				// if ( propName in oc( readOnlyPrpts )) return ; 

		        var val = record.get(pgrid.valueField)
				var editor; 

		        if (propName == 'type') {
		            editor = me.editors['type'];


		        } else if (Ext.isDate(val)) {
		            editor = me.editors.date;
		        } else if (Ext.isNumber(val)) {
		            editor = me.editors.number;
		        } else if (Ext.isBoolean(val)) {
		            editor = me.editors['boolean'];
		        } else {
		            editor = me.editors.string;
		        }
		        editor.editorId = propName;
		        return editor ;
	    	}
	    		        
	    });		
		
		
		
//  ================================================================================================

        var IdeSheet = Ext.id();
        var panelItems =   [{
                region: 'center',
                flex: 3,
                layout: 'fit',
                minSize: 50,
                items: grid 
            }, {
                region: 'east',
                id: IdeSheet, 
             	// title: pSheetProps.title ,
                collapsible: true,
                collapsed: false ,
                split: true,
                flex: 2,
                layout: 'fit',
                minSize: 200,
                items : propsGrid,
                border: false
        }];

//-----------        

        Ext.apply(this, {
            layout: 'border',
            defaults: {
                collapsible: false,
                split: false
            },
            items: panelItems 
        });

        
        this.callParent(arguments);


// ---------------------------------------------------------------------------------------------- 

        grid.on({
            'select': {fn: function ( rowModel , record,  rowIndex,  eOpts ) {
                _pGrid.treeRecord  = record;
                prepareProperties( _pGrid  );
				} , scope: _pGrid },

        	'beforeedit': {fn: function ( editor, e, eOpts) {
				// console.log( 'beforeEdit')			
				}},

        	'validateedit': {fn: function ( editor, e, eOpts) {
				// console.log( 'validateEdit')				 
				}},

        	'edit': {fn: function ( editor, e, eOpts) {

        	}}, scope: me }
        );


// ---------------------------------------------------------------------------------------------- 


        propsGrid.on({
			// Fires before editing is triggered. ...
        	'beforeedit': {fn: function ( editor, e, eOpts) {
				// console.log( 'beforeEdit')			
			}},

			// Fires after editing, but before the value is set in the record. ...
        	'validateedit': {fn: function ( editor, e, eOpts) {
				// console.log( 'validateEdit')				 
			}},

			// Fires after a editing. ...
        	'edit': {fn: function ( editor, e, eOpts) {

				if ( e.value == e.originalValue ) return; 

				var idTree = me.treeRecord.data.id 
				var oData = me.refDict[ idTree ] 
				var prpName = e.record.data.name

				// ****  Solo llegan objetos, los Array se manejan en otro lado
			    if ( typeOf(oData) !=  "object") {
			    	console.log( 'Error de tipo' ); return 
		    	}

				// Asigna el valor a la propiedad 
				oData[ prpName ]  = e.value 
				tData = updTData( me.treeRecord, prpName, e.value )
				
				// Para actualizar el valor 
				if ( me.treeRecord.isExpanded() ) grid.getView().refresh();

        	}}, 
        	scope: me }
        );


		function updTData( treeRecord , prpName, prpValue ) {
		
			var tNode = {}, ixNode;
			for ( ixNode in treeRecord.childNodes ) {
				
	    		tNode = treeRecord.childNodes[ ixNode  ]
	    		if ( tNode.data.ptProperty == prpName ) {
	    			tNode.data.ptValue = prpValue 
	    			return;  
    			}  
			}

			// No lo encontro, lo agrega
			tNode = {}
			tNode['ptProperty']  =  prpName    
	        tNode['ptValue'] =  prpValue  
			tNode['ptType'] =  typeOf( prpValue )  
			tNode['leaf'] =  true  
			
			treeRecord.appendChild( tNode )
		}

// ---------------------------------------------------------------------------------------------- 
        

        function prepareProperties( _pGrid ){
        	// Pepara la tabla de propiedades 

			var prp = {}
			var prpTitle = ''
			var prpBase = ''

			var idTree 	= 	_pGrid.treeRecord.data.id 
			var oData 	= 	_pGrid.refDict[ idTree ] 
			        	
        	if ( _pGrid.treeRecord.data[ 'ptType'] == 'pcl' ) {

        		prpTitle = 'pcl'
	            prp = {
					"shortTitle"	: oData.shortTitle,
					"description"	: oData.description,
					"protoIcon"		: oData.protoIcon ,
					"helpPath"		: oData.helpPath
					
					// "idProperty"	: oData.idProperty,
					// "protoOption"	: oData.protoOption,
					// "protoConcept"	: oData.protoConcept,
	            }
        	} else if ( _pGrid.treeRecord.data[ 'ptType'] == 'fields' ) {
        		
        		prpBase = _pGrid.treeRecord.data[ 'ptProperty']
        		prpTitle = 'field.' + prpBase

				var vrDefault = oData.defaultValue

				if ( oData.type ==  'bool' ) {
					vrDefault = vrDefault || false 
				} else 	if ( oData.type in oc( [ 'int', 'decimal', 'float'])  ) {
					vrDefault = vrDefault || 0 					
				} else {
					vrDefault = vrDefault || ''
				}
 
        		
	            prp = {
	            	
					"allowBlank": oData.allowBlank || true,
					"readOnly": oData.readOnly || false ,
					"storeOnly": oData.storeOnly || false ,
					"hidden": oData.hidden || false ,

					"header": oData.header || '',
					"fieldLabel": oData.fieldLabel || '',
					"tooltip": oData.tooltip || '',
					"defaultValue": vrDefault ,

					"type":  oData.type,
					"subType":  oData.subType,
					
					"flex": oData.flex || 0,
					"width": oData.width || 0,
					"minWidth": oData.minWidth || 0,
					"wordWrap": oData.wordWrap || false,
					"cellToolTip": oData.cellToolTip || false,

				    "format": oData.format || '',
				    "allowDecimals": oData.allowDecimals,
				    "decimalPrecision": oData.decimalPrecision,

					"choices": oData.choices ,

				    // TODO: BackEnd, Grid, No 
				    "sortable": oData.sortable || false
    
				    // FIX:  Q es esto por q 3 propiedades q pueden ser las misma vaina  readOnly, editable   
				    // "editable": false,
				    // "editMode": false,
				    
					// "name": oData.name ,
				    // "align": "right",
				    // "draggable": false,

					// "fromModel": oData.fromModel,
					// "zoomModel": oData.zoomModel 
					// "cellLink": oData.cellLink ,
					// "fkField":  oData.fkField, 
					// "fkId": oData.fkId,
	            }

        	} 
 
 			var panelPrps = Ext.getCmp( IdeSheet )
 			
			panelPrps.setTitle( prpTitle )
			propsGrid.setSource( prp )
			

        };
        
		function FormatMETA( oData, pName, pType   ) {
		
			/* -----------------   FORMAT META for tree view	
			 * @oData  	: Data a convertir
			 * @pName 	: property Name ( iteraction en el objeto padre )
			 * @pType 	: property Type ( Tipo del padre en caso de ser un array  )
			 *  
			 * @oBase	: Objeto padre 
			 * @tBase	: Objeto resultado hasta el momento  
			 * 
			 * @tData   treeData
			 */
		
			var tData = {}
		    var sDataType = typeOf(oData);

			// TODO: Id's para los objetos mas importantes 
        	var idFields  = Ext.id();
		
		
			// Solo deben entrar objetos o arrays 
			if (sDataType == "object"  ||  sDataType == "array")  {
		
				if ( ! pType  ) pType = sDataType
				
				
				// La pcl debe abrirse 
				if ( pName == 'pcl' ) {
					tData['expanded'] = true 					
				} 
				
				
				tData['ptProperty']  =  pName    
				tData['ptType'] =  pType 
				tData['children'] =  [] 

				// Obtiene un Id para hacer una referencia cruzada de la pcl con el arbol 
				var IxTree = Ext.id()
				tData['id'] = IxTree
				
				me.refDict[ IxTree ] = oData
				
				if ( sDataType == "object" ) {
					// Si es un objeto hay una propiedad q servira de titulo 
					if ( oData['protoOption'] ) {
						tData['ptValue']  = oData.protoOption  
					}
				} 
		
				// Recorre las propiedades 	
			    for (var sKey in oData) {
			    	var vValue = oData[ sKey  ]
				    var typeItem = typeOf(vValue);
		
					// PRegunta es por el objeto padre para enviar el tipo en los arrays  	
			        if ( sDataType == "object" ) {
		
		                tData['children'].push(  FormatMETA(vValue, sKey  ) ) 
		
			        } else if ( sDataType == "array" ) {
			        	
			        	var oTitle = pName + '.' + sKey 
			        	
			        	if ( pName == 'fields'  && vValue.name ) {
			        		oTitle = vValue.name  
		        		} else if ( pName == 'protoForm' ) {
		        			oTitle = vValue.style
		        		}
		
		                tData['children'].push(  FormatMETA(vValue, oTitle , pName   ) ) 
		
			        }  
				}
				
			} else { 
				
				// Enmascara tags HTML
		        if (sDataType == "string" ) { 
		        	oData =  oData.replace( '<', '&lt;').replace( '>', '&gt;').replace( '"', '\"')   
		        }
		
				tData['ptProperty']  =  pName    
				tData['ptType'] =  sDataType  
				tData['leaf'] =  true  
		        tData['ptValue'] =  oData.toString()  
		
				var IxTree = Ext.id()
				tData['id'] = IxTree
		
			}
		
			return tData 
		
		} 
		
        function showMetaConfig() {
        	showConfig( 'MetaConfig', _pGrid.safeMeta )
        }

        function showConfig( title , myConf ) {
        	Ext.Msg.show({
               title: title,
               multiline : true,   
               width : 600, 
               height : 400, 
               value: Ext.encode( myConf ) 
               });
        }
        
    },

    setEditMode: function( editMode ){

		this.editMode = editMode ;    	

		if (editMode ) {
			this._extGrid.down('#toolSave').show();
			this._extGrid.down('#toolCancelEdit').show();
		} else {
			this._extGrid.down('#toolSave').hide();
			this._extGrid.down('#toolCancelEdit').hide();
		}
		
   	},


	setEditionOff: function() {
		
		if ((! this._extGrid ) || ( ! this.editMode )) return; 
		 
		// Invocada desde el tool, debe cancelar la edicion y retroalimentar el toolbar 
		this.setEditMode( false ) 
		

	}, 
    
    saveChanges: function(){
    	
		savePclCache( this.safeMeta.protoOption, this.safeMeta )     	
        // this.store.sync();
    }, 
    
    cancelChanges: function() {
    	this.setEditionOff()
        this.store.load(); 
    } 
    
});
