/*
 * ProtoFieldSelector,  Primer paso para crear la pcl, seleccionar loscampos
 *
 * 1.  presentar el arbol de campos para seleccionar los fields  ( Solo en la configuracion de fields )
 * 2.  presentar los campos disponibles como una lista de campos a seleccionar, por ejemplo, en listDiplay, order by,  etc,
 *
 * Los campos UDP se agregan directamente a la lista(2).
 *
 */

Ext.define('ProtoUL.proto.ProtoFieldSelector', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.protoFieldSelector',

 // @viewCode   Required
    viewCode : null,

 // @myMeta   Required
    myMeta : null,

    initComponent: function() {

        me = this;

        var tBar =  Ext.create( 'ProtoUL.proto.ProtoToolBar', {dock : 'top'})
        tBar.setButton( 'add', true, true, 'add UDP' )


        var elemTree = Ext.create('ProtoUL.proto.ProtoFieldTree', {
            viewCode : me.viewCode,
            myMeta : me.myMeta
           })

        var elemList = Ext.create('ProtoUL.ux.ProtoList', {
            checkStyle : false,
            idTitle: 'SelectedFields'
        })


//      --------------------------------------------------

        elemTree.on({
            'loadComplete': function (  treeStore, records,  successful,  eOpts ) {
                configureCurrentFields();
            },
            'checkModif': function (  node,  checked,  eOpts ) {
                var idx = node.get( 'id' );
                elemList.addOrRemove ( idx, checked  );
            },
            scope: me }
        );


        tBar.on({
            'preview': function () {
                savePreview();
            },
            'save': function () {
                savePreview();

                _SM.savePclCache( me.myMeta.viewCode, me.myMeta, true );
                _SM.savePci( me.myMeta );
            },
            'add': function () {

                var msg = _SM.__language.Msg_Window_New_Folder;
                Ext.Msg.prompt(_SM.__language.MetaConfig_Add_Fields, msg, function (btn, pName) {
                    if (btn != 'ok') {
                        return;
                    }
                    elemTree.addUdpField( {'name' : pName , 'checked' : false } );

                }, me, false , 'udp__');

            },
            scope: me }
        );



//      ----------------------------------------------------

        var panelItems = getSelectorsPanels( elemTree, elemList  );

        Ext.apply(this, {
            layout: 'border',
            items: panelItems,
            dockedItems: [ tBar ]
        });

        this.callParent(arguments);


        function configureCurrentFields() {

            // Crea los campos activos en la grilla
            for (var ix in me.myMeta.fields ) {
                var vFld  =  me.myMeta.fields[ix];

                elemList.addDataItem ( vFld.name, true  );

                // Lo marca o lo adiciona como UDP
                var vNode =  elemTree.treeStore.getNodeById( vFld.name );
                if ( vNode ) {
                    vNode.set( 'checked', true );
                } else {
                    vFld.checked = true;
                    elemTree.addUdpField( vFld );
                }
            }
        }


        function savePreview() {

            var myFieldDict = _SM.getFieldDict( me.myMeta ), 
                names = elemList.getList(),
                field = {},
                fields = [];

            for (var ix in names  ) {

                field = myFieldDict[names[ix]];
                if ( ! field ) {
                    field = getDefaultField( names[ix] );
                }
                if ( field ) {
                    fields.push( _SM.clearProps( field ));
//                  console.log( "Field no encontrado", names[ix]  )
                }
            }

            // Actualiza los nuevos campos
            me.myMeta.fields = fields;

            function getDefaultField( name  ) {

                var rec =  elemTree.treeStore.getNodeById( name );
                return  {
                    name : rec.get( 'id' ),

                    type :  rec.get( 'type' ),
                    readOnly :  rec.get( 'readOnly' ),
                    required :  rec.get( 'required' ),
                    tooltip :  rec.get( 'tooltip' ),
                    header :  rec.get( 'header' ),

                    cpFromZoom :  rec.get( 'cpFromZoom' ),
                    cpFromField :  rec.get( 'cpFromField' ),

                    zoomModel :  rec.get( 'zoomModel' ),
                    fkField :  rec.get( 'fkField' ),
                    fkId :  rec.get( 'fkId' ),
                    vType :  rec.get( 'vType' ),
                    prpDefault :  rec.get( 'prpDefault' ),
                    choices :  rec.get( 'choices' )
                };
            }
        }
    }

});


/*
 * Lectura del arbol de campos ( todos los lockup )
 *
 */

Ext.define('ProtoUL.proto.ProtoFieldTree', {
    extend :  'Ext.tree.Panel',
    alias:    'widget.protoFieldTree',


 // @viewCode   Required
    viewCode : null,

//  @myMeta   Required
    myMeta : null,

    initComponent: function() {

        me = this;
        me.addEvents('checkModif', 'loadComplete');

        definieProtoFieldSelctionModel( me.viewCode, me.myMeta.protoEntityId )

        this.treeStore = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            folderSort: false,
            sorters: [{ property: 'text', direction: 'ASC' }],

            model: 'Proto.FieldSelectionModel',
            root: {
                text: _SM.__language.Protofield_Fields,
                expanded: true
            },

            listeners: {
                load: function ( treeStore, records,  successful,  eOpts ) {
                    me.fireEvent('loadComplete', treeStore, records,  successful,  eOpts );
                }
            }

        });

        var tree = Ext.apply(this, {
            store: this.treeStore,
            useArrows: true,
            rootVisible: false ,
            minWidth: 400,

            columns: [{
                xtype: 'treecolumn', //this is so we know which column will show the tree
                text: _SM.__language.Protofield_Text,
                flex: 2,
                sortable: true,
                minWidth: 200,
                dataIndex: 'text'
            },{
                xtype: 'booleancolumn',
                trueText: 'req',
                falseText: '',
                width: 50,
                text: _SM.__language.Protofield_Req,
                dataIndex: 'required'
            },{
                xtype: 'booleancolumn',
                trueText: 'rOnly',
                width: 50,
                falseText: '',
                text: _SM.__language.Protofield_ROnly,
                dataIndex: 'readOnly'
            },{
                text: _SM.__language.Protofield_Field_Type,
                dataIndex: 'type'
            },{
                text: _SM.__language.Protofield_Zoom_Model,
                dataIndex: 'zoomModel'
            },{
                text: _SM.__language.Protofield_fk_Field,
                dataIndex: 'fkField'
            },{
                text: _SM.__language.Protofield_fk_Id,
                dataIndex: 'fkId'
            },{
                flex: 2,
                text: _SM.__language.Protofield_Ix,
                dataIndex: 'id'

            },{
                flex: 2,
                text: 'cpFromZoom',
                dataIndex: 'cpFromZoom'
            },{
                flex: 2,
                text: 'cpFromField',
                dataIndex: 'cpFromField'

            },{
                hidden : true,
                text: _SM.__language.Protofield_Header,
                dataIndex: 'header'
            },{
                hidden : true,
                text: _SM.__language.Protofield_Tooltip,
                dataIndex: 'tooltip'
            },{
                hidden : true,
                text: _SM.__language.Protofield_Default_Value,
                dataIndex: 'prpDefault'
            },{
                hidden : true,
                text: _SM.__language.Protofield_vType,
                dataIndex: 'vType'
            },{
                hidden : true,
                text: _SM.__language.Protofield_choices,
                dataIndex: 'choices'
            }]

        })

        tree.on({
            'checkchange': {fn: function (  node,  checked,  eOpts ) {
                me.fireEvent('checkModif', node,  checked,  eOpts );
            }}, scope: me }
        );

        me.callParent(arguments);


        function definieProtoFieldSelctionModel( viewCode, protoEntityId ) {

            // Modelo usado en la lista de campos con la jerarquia completa de los de zoom ( detalle de fk )

            Ext.define('Proto.FieldSelectionModel', {
                extend: 'Ext.data.Model',
                proxy: {
                    type: 'ajax',
                    url: _SM._PConfig.urlGetFieldTree ,
                    actionMethods: { read : 'POST' },
                    extraParams : {
                        viewCode : viewCode,
                        protoEntityId : protoEntityId
                    }
                },

                fields: [
        //         Contiene el nombre en notacion objeto ( django )
                    {name: 'id', type: 'string'},

        //         Contiene el nombre del campo dentro del modelo
                    {name: 'text', type: 'string'},
                    {name: 'type', type: 'string'},

                    {name: 'readOnly', type: 'boolean'},
                    {name: 'required', type: 'boolean'},
                    {name: 'tooltip', type: 'string'},
                    {name: 'header', type: 'string'},

                    {name: 'zoomModel', type: 'string'},
                    {name: 'fkField', type: 'string'},
                    {name: 'fkId', type: 'string'},
                    {name: 'vType', type: 'string'},
                    {name: 'prpDefault', type: 'string'},
                    {name: 'choices', type: 'string'},

                    {name: 'cpFromZoom', type: 'string'},
                    {name: 'cpFromField', type: 'string'},

                    {name: 'checked', type: 'boolean'},
                    {name: 'leaf', type: 'boolean'}
                ]

            });

        }

    },


    addUdpField:  function( vFld ) {

          // No lo encontro, lo agrega
        tNode = {
            'id'         : vFld.name,
            'text'       : vFld.name,
            'type'       : 'udp',
            'checked'    : vFld.checked,
            'required'   : false,
            'leaf'       : true
        }

        this.getRootNode().appendChild( tNode )

    }


    // getCheckedList: function () {
        // var records = this.getView().getChecked(),
            // names = [];
        // Ext.Array.each(records, function(rec){
            // names.push(rec.get('id'));
        // });
        // return names
    // }


});