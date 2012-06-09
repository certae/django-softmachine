/*
 *  Proto Code Library    ( PCL )
 * 
 *  Edicion de la plc
 *  Esta forma sera invocada desde la pcl o desde el respositorio de pcls ( ProtoLib.ProtoDefinition )
 *    Por lo tanto la Pcl ya viene dada,  
 * 
 * TODO:  Function  para guardar la pcl en la Db,  poner active = true   
 *     
 */


Ext.define('ProtoUL.proto.ProtoPcl' ,{
    extend: 'Ext.container.Container',
    alias : 'widget.protoPcl',
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
                 
        // Coleccion de referencia para relacionar myMeta con myStore ( treeStore )
        // me.refDict = {}
        
        defineProtoPclTreeModel()
        
        var treeData = Meta2Tree( this.myMeta, 'pcl', 'pcl'  )
        treeData.expanded = true
        
        var myStore = Ext.create('Ext.data.TreeStore', { 
            folderSort: true, 
            sorters: [{
                property: 'text',
                direction: 'ASC'
              }], 
            model: 'Proto.PclTreeNode',
            root: treeData 
        });


        // Start Cell Editing PlugIn
        var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        });



        //  --------------------------------------------------
        
        
        var treeGrid = Ext.create('Ext.tree.Panel', {
            store: myStore,
            title:  _pGrid.myMeta.shortTitle, 
            
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
                text: 'text',
                flex: 3,
                sortable: true,
                dataIndex: 'text'
            },{
                text: 'Ix',
                dataIndex: 'id'
            },{
                text: '__ptType',
                dataIndex: '__ptType'
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

        this._extGrid = treeGrid;


        var propsGrid = Ext.create('ProtoUL.ux.ProtoProperty', {});
        

//  ================================================================================================

        var IdeSheet = Ext.id();
        var panelItems =   [{
                region: 'center',
                flex: 3,
                layout: 'fit',
                minSize: 50,
                items: treeGrid 
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

        treeGrid.on({
            'select': function ( rowModel , record,  rowIndex,  eOpts ) {
                // Asigna el current Record 
                _pGrid.treeRecord  = record;
                prepareProperties( _pGrid  );
            }, scope: me }
        );


// ---------------------------------------------------------------------------------------------- 


        propsGrid.on({
            'beforeedit': {fn: function ( editor, e, eOpts) {
                if ( me.editMode == false ) return false 
            }},

            // Fires after a editing. ...
            'edit': {fn: function ( editor, e, eOpts) {

                if ( e.value == e.originalValue ) return; 

                var oData = me.treeRecord.data.__ptConfig 
                var prpName = e.record.data.name

                // ****  Solo llegan objetos, los Array se manejan en otro lado
                if ( typeOf(oData) !=  "object") {
                    console.log( 'Error de tipo' ); return 
                }

                // Asigna el valor a la propiedad 
                oData[ prpName ]  = e.value 
                tData = updTData( me.treeRecord, prpName, e.value )
                
                // Para actualizar el valor 
                if ( me.treeRecord.isExpanded() ) treeGrid.getView().refresh();

            }}, 
            scope: me }
        );


        function updTData( treeRecord , prpName, prpValue ) {
            // TODO ???         
            var tNode = {}, ixNode;
            for ( ixNode in treeRecord.childNodes ) {
                
                tNode = treeRecord.childNodes[ ixNode  ]
                if ( tNode.data.text == prpName ) {
                    tNode.data.ptValue = prpValue 
                    return;  
                }  
            }

            // No lo encontro, lo agrega
            tNode = {}
            tNode['text']  =  prpName    
            tNode['ptValue'] =  prpValue  
            tNode['__ptType'] =  typeOf( prpValue )  
            tNode['leaf'] =  true  
            
            treeRecord.appendChild( tNode )
        }

// ---------------------------------------------------------------------------------------------- 
        

        function prepareProperties( _pGrid ){
            // Pepara la tabla de propiedades 

            var prp = {}
            var prpTitle = ''
            var prpBase = ''

            var idTree     =     _pGrid.treeRecord.data.id
             
            // var oData     =     _pGrid.refDict[ idTree ] 
            var oData     =      _pGrid.treeRecord.data.__ptConfig 
                        
            if ( _pGrid.treeRecord.data[ '__ptType'] == 'pcl' ) {

                prpTitle = 'pcl'
                prp = {
                    "shortTitle"    : oData.shortTitle,
                    "description"    : oData.description,
                    "protoIcon"        : oData.protoIcon ,
                    "helpPath"        : oData.helpPath
                    
                    // "idProperty"    : oData.idProperty,
                    // "protoOption"    : oData.protoOption,
                    // "protoConcept"    : oData.protoConcept,
                }
            } else if ( _pGrid.treeRecord.data[ '__ptType'] == 'fields' ) {
                
                prpBase = _pGrid.treeRecord.data[ 'text']
                prpTitle = 'field.' + prpBase

                var vrDefault = oData.defaultValue

                if ( oData.type ==  'bool' ) {
                    vrDefault = vrDefault || false 
                } else     if ( oData.type in oc( [ 'int', 'decimal', 'float'])  ) {
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
        

        
        function showMetaConfig() {
            showConfig( 'MetaConfig', _pGrid.myMeta )
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
        
        savePci( this.myMeta )         
        // this.store.sync();
    }, 
    
    cancelChanges: function() {
        this.setEditionOff()
        this.store.load(); 
    } 
    
});
