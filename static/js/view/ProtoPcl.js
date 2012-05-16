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
	 * protoConcept : Base Model 
	 */
	myMeta : null, 


    initComponent: function() {
        

		if ( ! this.myMeta  ) {
        	Ext.Msg.show({ value: 'ERROR Pcl  not loaded'});
            return; 
        }

		var me = this;         
        var _pGrid = this; 
		var myMeta = this.myMeta; 
		
	    Ext.define('MetaPCL', {
	        extend: 'Ext.data.Model',
	        fields: [
	            {name: 'ptProperty', type: 'string'},
	            {name: 'ptType',  type: 'string'},
	            {name: 'ptValue', type: 'string'}
	        ]
	    });
	
		var treeData = FormatMETA( this.myMeta, 'pcl', 'pcl'  )
	    var myStore = Ext.create('Ext.data.TreeStore', { 
	        folderSort: true, 
	        model: 'MetaPCL',
	        root: treeData 
	    });


		// TODO: Start Cell Editing PlugIn
	    // me.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
	        // clicksToMoveEditor: 1,
	        // autoCancel: false
	    // });

		var grid = Ext.create('Ext.tree.Panel', {
	        store: myStore,
	        useArrows: true,
	        rootVisible: true,
	        multiSelect: false,
            stripeRows: true, 
	        singleExpand: true,
	        
	        rowLines : true, 
	        // columnLines : true, 

			// TODO: Actions to create o destroy eltos  
			tbar: [
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
	            text: 'ptType',
	            sortable: true,
	            dataIndex: 'ptType'
	        },{
	            text: 'ptValue',
	            flex: 2,
	            dataIndex: 'ptValue',
	            sortable: true
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
		        hidden: true,
				scope: this,
		        handler: this.cancelChanges 
		     },{
		        itemId: 'toolSave',
		        type: 'save',
		        hidden: true,
				scope: this,
		        handler: this.saveChanges 
		     },{
		        type: 'gear',
		        handler: showMetaConfig,
		        tooltip: 'Meta Config ... '
		    }] 
             
        }); 

        this._extGrid = grid;


//-----------

        var panelItems =   [{
                region: 'center',
                flex: 2,
                layout: 'fit',
                minSize: 50,
                items: grid 
            }
            ];


		// TODO: Cargar la grilla de propiedades 	
	    var propsGrid = Ext.create('Ext.grid.property.Grid', {
	    	// Asigna los titulos a las propiedades 
	        // propertyNames: { prop : 'title' }
	        
	        propertyNames: {
	            tested: 'QA',
	            borderWidth: 'Border Width'
	        },
	        source: {
	            "(name)": "Properties Grid",
	            "grouping": false,
	            "autoFitColumns": true,
	            "productionQuality": false,
	            "created": Ext.Date.parse('10/15/2006', 'm/d/Y'),
	            "tested": false,
	            "version": 0.01,
	            "borderWidth": 1
	        }
	        
	    });		
		
        function setSource(){

            propsGrid.setSource({
                '(name)': 'Property Grid',
                grouping: false,
                autoFitColumns: true,
                productionQuality: true,
                created: new Date(),
                tested: false,
                version: 0.8,
                borderWidth: 2
            });
        }
    
            
        this.IdeSheet = Ext.id();
        panelItems.push( {
                region: 'east',
                // id: this.IdeSheet, 
             	// title: pSheetProps.title ,
                collapsible: true,
                collapsed: true ,
                split: true,
                flex: 1,
                layout: 'fit',
                minSize: 200,
                items : propsGrid,
                // autoScroll: true,
                border: false
        });
        
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


        grid.on({
            select: {fn: function ( rowModel , record,  rowIndex,  eOpts ) {
            	// SelectionModel.rowSelected 
                _pGrid.rowData = record.data;

                // this.fireEvent('rowClick', rowModel, record, rowIndex,  eOpts );
                prepareSheet();

            	}, scope: this }
        });                 

        grid.on({
			// Evento DblClick para seleccionar en el zoom         
            celldblclick: {fn: function ( tbl, el,  cellIndex, record, tr, rowIndex, e,  eOpts ) {
            	// Si esta en modo edicion no dispara nada para permitir entrar al editor 
            	if ( me.editMode ) return  
            	// me.fireEvent('rowDblClick', record, rowIndex  );
            }, scope: me }
        });                 

// ---------------------------------------------------------------------------------------------- 


		// Fires before editing is triggered. ...
        grid.on({
        	beforeedit: {fn: function ( edPlugin, e, eOpts) {
				 
            	}, scope: this }
            	
        });                 

		// Fires after editing, but before the value is set in the record. ...
        grid.on('validateedit', function(editor, e, eOpts) {

        });

		// Fires after a editing. ...
        // grid.on('edit', function(editor, e, eOpts) {
			// commit the changes right after editing finished
    		// e.record.commit();
        // });

// ---------------------------------------------------------------------------------------------- 
        
        function showMetaConfig() {
        	var safeConf =  clone( myMeta , 0, exclude =['dict','gridDefinition', 'formDefinition'] )
        	showConfig( 'MetaConfig', safeConf )
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
        

        function prepareSheet( ){
        	// Pepara la tabla de propiedades 

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
				
				tData['ptProperty']  =  pName    
				tData['ptType'] =  pType 
				tData['children'] =  [] 

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
		        		} else if ( pName == 'protoFieldSet' ) {
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
		
			}
		
			return tData 
		
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

	setDefaults: function() {
	/*
	 * @private
     * setDefaults for insert row 
	 */

	}, 
		
	
	addNewRecord: function() {
		if ((! this._extGrid ) || ( ! this.editMode )) return; 

        var rec = new this.store.model( this.setDefaults()  )
        this.insertNewRecord ( rec  ) 
	}, 
	
	duplicateRecord: function() {
		if ((! this._extGrid ) || ( ! this.editMode )) return; 
		
        var rec =  this.selected
        if ( rec )  this.insertNewRecord ( rec.copy()  ) 
        	
	}, 

	insertNewRecord: function( rec ) {
    	rec.data._ptStatus = _ROW_ST.NEWROW 
    	rec.data._ptId = rec.internalId  
    	rec.data.id = undefined 
    	rec.phantom = true 
    	this.store.insert(0, rec );

	},

	
	deleteCurrentRecord: function() {
		if ((! this._extGrid ) || ( ! this.editMode )) return; 

	    var sm = this._extGrid.getSelectionModel();
	    this.rowEditing.cancelEdit();
        this.store.remove( sm.getSelection()  );

	}, 

	setEditionOff: function() {
		
		if ((! this._extGrid ) || ( ! this.editMode )) return; 
		 
		// Invocada desde el tool, debe cancelar la edicion y retroalimentar el toolbar 
		this.setEditMode( false ) 
		
		// Reconfigura el toolBar 
		if ( this._toolBar ) {
			this._toolBar.toggleEditMode( false, true )
		};   

	}, 
    
    saveChanges: function(){
        this.store.sync();
    }, 
    
    cancelChanges: function() {
    	this.setEditionOff()
        this.store.load(); 
    } 
    
});
