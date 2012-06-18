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

        this.treeGrid = treeGrid 


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
            'save': function ( rowModel , record,  rowIndex,  eOpts ) {

            }, 
            'showMeta': function ( rowModel , record,  rowIndex,  eOpts ) {

            }, 
            'add': function ( record ) {
                addTreeNode ( record )
            }, 
            'del': function ( record ) {
                delTreeNode ( record )
            }, 
            'cancel': function (  ) {
            }, 
            scope : this
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


// ---------------------------------------------------------------------------------------------- 

                
        function addTreeNode ( record ) {

            var ptType = record.data.__ptType
            var __ptConfig = record.data.__ptConfig || {}

            if (  ptType == 'filtersSet' ) {
                
                Ext.Msg.prompt('filterSet', 'Please enter the name for your filter::', function(btn, pName){
                    if (btn != 'ok') return 

                    var pJText = "{\"filter\":{},\"name\": \"" + pName + "\"}" 
                    var tNode = {'text' :  pName,     '__ptType' :  'filterDef'   }
                    tNode['__ptConfig'] =  { __ptValue : pJText }  
                    tNode['children'] =  []  
                    
                    record.appendChild( tNode )
                });
                
            } 

        }

        function delTreeNode ( record ) {

            var ptType = record.data.__ptType
            if (  ptType == 'filterDef' ) {
                var parent = record.parentNode 
                record.remove( )
                
                resetPanelInterface()
                if ( parent ) {
                    var view = me.treeGrid.getView();
                    view.select( parent );
                }  
 
            }
            
        }

// ---------------------------------------------------------------------------------------------- 


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

        function resetPanelInterface() {
            jsonText.hide()
            propsGrid.hide()
            fieldList.hide()
            resetButtons()
        }

        function resetButtons() {
            tBar.setButton( 'add', bVisible = false, true )
            tBar.setButton( 'del', bVisible = false, true )
        }

        function preparePropertiesPCL( record ){

            var oData      = record.data
            var ptType = oData.__ptType
            var __ptConfig = oData.__ptConfig || {}

    	    var template = DesignerObjects[ ptType ] || {}

            resetPanelInterface()

            if ( template.__ptType == "jsonText") {
                jsonText.setRawValue( __ptConfig.__ptValue )
                jsonText.__ptConfig = __ptConfig
                jsonText.setFieldLabel( oData.text ) 
                jsonText.show()

            } else if ( template.__ptType == "colList") {
                fieldList.show()
                fieldList.__ptConfig = __ptConfig
                prepareColList( oData )

            } else {
                propsGrid.show()
                prepareProperties( record , me.myMeta,  propsGrid  )
            } 
        
            // Prepara el menu 
            if ( ptType in oc( [ 'filtersSet'] )) {

                //  .setButton( key  , show, enbl, toolTip , def  )
                tBar.setButton( 'add', true, true, 'Add  filterDef', record  )
                

            } else if ( ptType in oc( [ 'filterDef'] )) {

                tBar.setButton( 'del', true, true, 'Delete current filterDef [' + oData.text + ']', record  )
                
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
