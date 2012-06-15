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
        
        if ( ! this.myMeta  ) {
            Ext.Msg.show({ value: 'ERROR Pcl  not loaded'});
            return; 
        }

        var me = this;         
        var myMeta = this.myMeta;

        defineProtoPclTreeModel()

        var tBar =  Ext.create( 'ProtoUL.proto.ProtoToolBar', {dock : 'top'})

        var treeData = Meta2Tree( this.myMeta, 'pcl', 'pcl'  )
        treeData.expanded = true

        var treeGridStore = Ext.create('Ext.data.TreeStore', { 
            folderSort: true, 
            sorters: [{
                property: 'text',
                direction: 'ASC'
              }], 
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
            }]
        }); 

        me._extGrid = treeGrid;

        var propsGrid = Ext.create('ProtoUL.ux.ProtoProperty', {});
        var fieldList = Ext.create('ProtoUL.ux.ProtoList', {
            idTitle: 'SelectedFields' 
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
                items : [propsGrid, fieldList], 
                border: false
        }];


        Ext.apply(this, {
            layout: 'border',
            items: panelItems, 
            dockedItems: [ tBar ] 
        });

        
        this.callParent(arguments);


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
                // Asigna el current Record 
                me.treeRecord  = record;
                prepareProperties();
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


// ---------------------------------------------------------------------------------------------- 


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



        function prepareProperties( me ){
        };
        

        
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
