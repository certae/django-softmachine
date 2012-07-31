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
     * editable : False is ReadOnly 
     */
    editable : true, 
    

    initComponent: function() {

        var me = this;         
        if ( ! this.myMeta  ) {
            Ext.Msg.show({ value: 'ERROR Pcl  not loaded'});
            return; 
        }

        defineProtoPclTreeModel();

        var tBar =  Ext.create('ProtoUL.proto.ProtoToolBar', {dock : 'top'});
        var sbar = Ext.create('Ext.form.Label', { text : 'Meta edition tool'});        
        
        var treeData = getTreeData( me );

        var treeGridStore = Ext.create('Ext.data.TreeStore', { 
            folderSort: true, 
            // sorters: [{ property: 'text', direction: 'ASC' }], 
            model: 'Proto.PclTreeNode',
            root: treeData 
        });

        this.treeGridStore = treeGridStore;
        
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
                // sortable: true,
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
            'preview': function ( ) {
                var newMeta =  Tree2Meta( me.treeGridStore.getRootNode() )
                savePclCache( newMeta.protoOption, newMeta )
            }, 
            'save': function ( ) {
                var newMeta =  Tree2Meta( me.treeGridStore.getRootNode() )
                savePclCache( newMeta.protoOption, newMeta )
                savePci( newMeta )         
            }, 
            'reload': function ( ) {

            }, 
            'cancel': function (  ) {
                me.cancelChanges()
            }, 
            'show1': function (  ) {

                var safeConf = clone( me.myMeta , 0, exclude =['__ptDict', 'protoViews'] )
                showConfig( 'Original' , safeConf  )
            }, 
            'show2': function (  ) {

                var safeConf =  me.treeGridStore.getRootNode()
                safeConf =  Tree2Meta( safeConf )
                showConfig( 'Edited' , safeConf  )

            }, 
            'add': function ( record ) {
                addTreeNode ( record )
            }, 
            'del': function ( record ) {
                delTreeNode ( record )
            }, 
            scope : this
        })

        treeGrid.on({
            'select': function ( rowModel , record,  rowIndex,  eOpts ) {
                 
                saveJsonText()
                saveFieldList()
                
                me.treeRecord  = record;
                preparePropertiesPCL( record );
            }, scope: me }
        );


        propsGrid.on({
            'beforeedit': {fn: function ( editor, e, eOpts) {
                if ( me.editable == false ) return false 
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


        fieldList.on({
            'checked' : {fn: function ( record, recordIndex, checked ) {
                saveFieldList()
            }}, 
            'reorder' : {fn: function () {
                saveFieldList()
            }}, 
            scope: me }
        );

// ---------------------------------------------------------------------------------------------- 

        function getTreeData( me ) {
          
            var safeConf =  clone( me.myMeta , 0, exclude =['__ptDict', 'protoViews'] );
            var treeData = Meta2Tree( safeConf, 'pcl', 'pcl' );
            treeData.expanded = true;
    
            // Para guardar las dos definiciones ( la data se modifica al generar el store )
            me.treeData = clone( treeData );

            return treeData 
        }
                
        function addTreeNode ( record ) {

            var ptType = record.data.__ptType
            var __ptConfig = record.data.__ptConfig || {}
            var msg = ''

            // TODO: Cambiar por un template y hacer rutina generica 
            if (  ptType == 'filtersSet' ) {

                msg = 'Please enter the name for your filter:'
                Ext.Msg.prompt(ptType, msg, function(btn, pName){
                    if (btn != 'ok') return 

                    var pJText = "{\"filter\":{},\"name\": \"" + pName + "\"}" 
                    var tNode = {'text' :  pName,     '__ptType' :  'filterDef'   }
                    tNode['__ptConfig'] =  { __ptValue : pJText }  

                    tNode['children'] =  []  
                    record.appendChild( tNode )
                });
                
            } else if (  ptType == 'listDisplaySet' ) {

                msg =  'Please enter the name for your alternative listDisplay:'
                Ext.Msg.prompt(ptType, msg, function(btn, pName){
                    if (btn != 'ok') return 

                    var tNode = {'text' :  pName , __ptType : 'listDisplay' }
                    tNode['__ptConfig'] =  { __ptType : 'listDisplay' }  

                    tNode['children'] =  []  
                    record.appendChild( tNode )
                });

            } else if (  ptType == 'protoDetails' ) {

                msg = 'Please enter the name for your detail:'
                Ext.Msg.prompt(ptType, msg, function(btn, pName){
                    if (btn != 'ok') return 

                    var tNode = {'text' :  pName , __ptType : 'protoDetail' }
                    tNode['__ptConfig'] =  { __ptType : 'protoDetail', 'menuText' :  pName }  

                    tNode['children'] =  []  
                    record.appendChild( tNode )
                });

            } else if (  ptType == 'protoSheets' ) {

                msg = 'Please enter the name for your sheet:'
                Ext.Msg.prompt(ptType, msg, function(btn, pName){
                    if (btn != 'ok') return 

                    var tNode = {'text' :  pName , __ptType : 'protoSheet' }
                    tNode['__ptConfig'] =  { __ptType : 'protoSheet', 'title' :  pName }  

                    tNode['children'] =  []  
                    record.appendChild( tNode )
                });

            }
 

        }

        function delTreeNode ( record ) {

            var ptType = record.data.__ptType
            var parent = record.parentNode 

            if (  ptType in oc( [ 'filterDef', 'listDisplay', 'protoDetail', 'protoSheet' ])  ) {
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
                // __ptConfig guarda la ref al obj de base 
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

            // Status Bar 
            var sMsg = getAttrMsg( record.data.text )
            if ( sMsg ) sMsg = '<B>' + record.data.text + '</B> : ' +  sMsg
            else  sMsg = '<B>' + ptType  + '</B>  [ ' +  record.data.text  + ' ]' 
            sbar.setText( sMsg , false )

            // Clear 
            resetPanelInterface()

            if ( template.__ptStyle == "jsonText") {
                jsonText.setRawValue( __ptConfig.__ptValue )
                jsonText.__ptConfig = __ptConfig
                jsonText.setFieldLabel( oData.text ) 
                jsonText.show()

            } else if ( template.__ptStyle == "colList") {
                fieldList.show()
                fieldList.__ptConfig = __ptConfig
                prepareColList( oData )

            } else {
                propsGrid.show()
                prepareProperties( record , me.myMeta,  propsGrid  )
            } 
        
            // Prepara el menu 
            //  .setButton( key  , show, enbl, toolTip , def  )

            if ( ptType in oc([ 'filtersSet', 'protoDetails', 'listDisplaySet', 'protoSheets'])  ) {
                tBar.setButton( 'add', true, true, 'Add instance of ' +  ptType, record  )

            } else if ( ptType in oc( [ 'filterDef', 'protoDetail', , 'protoSheet'] )) {
                tBar.setButton( 'del', true, true, 'Delete current ' + ptType + ' [' + oData.text + ']', record  )


            } else if ( ptType in oc( [ 'listDisplay'] )) {
                var parent = record.parentNode

                if ( parent && parent.data.__ptType == 'listDisplaySet' ) {
                    tBar.setButton( 'del', true, true, 'Delete alternative listDisplay [' + oData.text + ']', record  )    
                }

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

            // Copia solo los campos contenidos en fields  
            var tmpList = Ext.decode( oData.__ptConfig.__ptList  )
            var fSelected = []  
            for (var ix in tmpList  ) {
                var vFld  =  tmpList[ix];
                if ( vFld in oc( fList )) {
                   fSelected.push( vFld )    
                }
            } 

            
            fieldList.removeAll()
            fieldList.addDataSet( fSelected, true  )
            fieldList.addDataSet( fList )
        } 
        
        
    },


    cancelChanges: function() {
        //TODO: Verificar si hace un reload 
        // this.treeGridStore.getRootNode().removeAll();
        // this.treeGridStore.setRootNode( this.treeData ) 
    } 
    
});
