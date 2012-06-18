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
    extend: 'Ext.panel.Panel',
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

        var me = this;         
        if ( ! this.myMeta  ) {
            Ext.Msg.show({ value: 'ERROR Pcl  not loaded'});
            return; 
        }

        defineProtoPclTreeModel()

        var tBar =  Ext.create('ProtoUL.proto.ProtoToolBar', {dock : 'top'})
        var sbar = Ext.create('Ext.form.Label', { text : 'Meta edition tool'})        
        
        var safeConf =  clone( this.myMeta , 0, exclude =['__ptDict', 'protoViews'] )
        var treeData = Meta2Tree( safeConf, 'pcl', 'pcl' )
        treeData.expanded = true

        var treeGridStore = Ext.create('Ext.data.TreeStore', { 
            folderSort: true, 
            sorters: [{ property: 'text', direction: 'ASC' }], 
            model: 'Proto.PclTreeNode',
            root: treeData 
        });

        
        var treeGrid = Ext.create('Ext.tree.Panel', {
            store: treeGridStore,
            
            useArrows: true,
            rootVisible: true,
            multiSelect: false,
            singleExpand: true,
            stripeRows: true, 
            rowLines : true, 

            columns: [{
                xtype: 'treecolumn', //this is so we know which column will show the tree
                text: 'text',
                flex: 3,
                sortable: true,
                dataIndex: 'text'
            // },{
                // text: 'Ix',
                // dataIndex: 'id'
            },{
                text: '__ptType',
                dataIndex: '__ptType'
            }], 
            listeners: {
                'itemmouseenter': function(view, record, item) {
                    Ext.fly(item).set({'data-qtip': getAttrMsg( record.data.text ), 'data-qtitle': record.data.text }); 
              }, scope : me 
            }
            
            
            
        }); 

        me._extGrid = treeGrid;

        var propsGrid = Ext.create('ProtoUL.ux.ProtoProperty', {
            source : { name : '' }
        });
        var fieldList = Ext.create('ProtoUL.ux.ProtoList', {
            idTitle: 'SelectedFields' 
        })

        var jsonText = Ext.create('Ext.form.TextArea', {
            autoScroll : true, 
            labelAlign : 'top'
        })        

//  ================================================================================================

        var panelItems =   [{
                region: 'center',
                flex: 3,
                layout: 'fit',
                minSize: 50,
                items: treeGrid,  
                border: false
            }, {
                region: 'east',
                collapsible: false,
                split: true,
                flex: 2,
                layout: 'fit',
                minSize: 200,
                items : [propsGrid, fieldList, jsonText], 
                border: false
        }];


        Ext.apply(this, {
            layout: 'border',
            items: panelItems, 
            dockedItems: [ tBar ], 
            bbar: [ sbar ]
        });

        
        this.callParent(arguments);

        fieldList.hide()
        jsonText.hide()

// ---------------------------------------------------------------------------------------------- 

        tBar.on({
            'cancel': function ( rowModel , record,  rowIndex,  eOpts ) {
                // handler: this.cancelChanges
            }, 
            'save': function ( rowModel , record,  rowIndex,  eOpts ) {
                // handler: this.saveChanges
            }, 
            'showMeta': function ( rowModel , record,  rowIndex,  eOpts ) {
                // handler: showMetaConfig,
            }, 
            'addNode': function ( rowModel , record,  rowIndex,  eOpts ) {
                // var node = store.getNodeById('node-2');
                // var n = node.appendChild({
                    // task:'New Node ', //  + i++,
                    // leaf: true,
                    // checked: true
                    // })  
            }, 
            
        })

        treeGrid.on({
            'select': function ( rowModel , record,  rowIndex,  eOpts ) {
                sbar.setText( '<B>' + record.data.text + '</B> : ' +  getAttrMsg( record.data.text ), false )
                 
                saveJsonText()
                saveFieldList()
                
                me.treeRecord  = record;
                preparePropertiesPCL( record );
            }, scope: me }
        );


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
                if ( typeOf(oData) !=  "object") { console.log( 'Error onEdit', oData  ); return }

                // Asigna el valor a la propiedad 
                oData[ prpName ]  = e.value 
                
            }}, 
            scope: me }
        );


        function getAttrMsg( attrName ) {
            var msg =  DesignerObjects[ attrName ] || {}
            return msg.description || ''
        }

        // jsonText.on({'deactivate': function ( obj ,  eOpts ) {
        function saveJsonText() {
            if ( jsonText.isVisible()) {
                jsonText.__ptConfig.__ptValue  = jsonText.getRawValue()
            }
        }

        function saveFieldList() {
            if ( fieldList.isVisible()) {
                fieldList.__ptConfig.__ptList  = Ext.encode( fieldList.getChecked() ) 
            }
        }

// ---------------------------------------------------------------------------------------------- 


        function preparePropertiesPCL( record ){

            var oData      = me.treeRecord.data
            var __ptConfig = oData.__ptConfig || {}

    	    var template = DesignerObjects[ oData.__ptType ] || {}

            if ( template.__ptType == "jsonText") {
                propsGrid.hide()
                fieldList.hide()
                
                jsonText.setRawValue( __ptConfig.__ptValue )
                jsonText.__ptConfig = __ptConfig
                
                jsonText.setFieldLabel( oData.text ) 
                jsonText.show()

            } else if ( template.__ptType == "colList") {
                jsonText.hide()
                propsGrid.hide()
                fieldList.show()
                
                fieldList.__ptConfig = __ptConfig
                prepareColList( oData )

            } else {

                jsonText.hide()
                propsGrid.show()
                fieldList.hide()

                prepareProperties( record , me.myMeta,  propsGrid  )
                
            } 
        	 
            
        };
        
        var fList
        function prepareColList( oData ) {
            
            if ( ! fList )  {
                // Crea los campos del store
                fList= []
                for (var ix in me.myMeta.fields ) {
                    var vFld  =  me.myMeta.fields[ix];
                    fList.push( vFld.name ) 
                } 
            }                        

            var fSelected = Ext.decode( oData.__ptConfig.__ptList )

            fieldList.removeAll()
            fieldList.addDataSet( fSelected, true  )
            fieldList.addDataSet( fList )
        } 
        

        
        function showMetaConfig() {
            showConfig( 'MetaConfig', me.myMeta )
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


    
    saveChanges: function(){
        savePci( this.myMeta )         
    }, 
    
    cancelChanges: function() {
        //TODO: Verificar si hace un reload 
        this.store.load(); 
    } 
    
});
