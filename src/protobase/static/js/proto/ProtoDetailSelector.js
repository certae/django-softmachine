/*
 * ProtoDetailSelector,  Selecciona los detalles posibles
 *
 * 1.  presentar el arbol de campos para seleccionar los detalles
 *
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */


Ext.define('ProtoUL.proto.ProtoDetailSelector', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.detailsSelector',

// Contenedor para probar el arbol de detalles

// @viewCode   Required
    viewCode : null,

 // @myMeta   Required
    myMeta : null,

    initComponent: function() {

        var me = this;
        var tBar =  Ext.create( 'ProtoUL.proto.ProtoToolBar', {dock : 'top'})

        var elemTree = Ext.create('ProtoUL.proto.ProtoDetailTree', {
            viewCode : me.viewCode,
            myMeta : me.myMeta
           })


        var elemList = Ext.create('ProtoUL.ux.ProtoList', {
            checkStyle : false,
            idTitle: 'SelectedDetails'
        })


        // ----------------------------------------------------------------------------

        elemTree.on({
            'loadComplete': function (  treeStore, records,  successful,  eOpts ) {
                configureCurrentDetails()
            },
            'checkModif': function (  node,  checked,  eOpts ) {
                var idx = node.get( 'id' )
                elemList.addOrRemove ( idx, checked  )
            },
            scope: me }
        );


        tBar.on({
            'preview': function () {
                savePreview()
            },
            'save': function () {
                savePreview();
                _SM.savePclCache( me.myMeta.viewCode, me.myMeta, true )
                _SM.savePci( me.myMeta )
            },
            scope: me }
        );


        // ----------------------------------------------------------------------------

        var panelItems = getSelectorsPanels( elemTree, elemList  )

        Ext.apply(this, {
            layout: 'border',
            items: panelItems,
            dockedItems: [ tBar ]
        });

        this.callParent(arguments);

        function configureCurrentDetails() {

            // Crea los campos activos en la grilla
            for (var ix in me.myMeta.detailsConfig ) {
                var vFld  =  me.myMeta.detailsConfig[ix];
                elemList.addDataItem ( vFld.menuText, true  )
            }
        }


        function savePreview() {

            var names = elemList.getList(),
                detail = {},
                details = []

            for (var ix in names  ) {

                detail = getExistingDetail( names[ix] )
                if ( ! detail ) {
                    detail = getDefaultDetail( names[ix] )
                }
                if ( detail ) {
                    details.push( detail )
                } else {
                    /* console.log( "Detalle no encontrado", names[ix]  ) */
                }

            }

            // Actualiza los nuevos detalles
            me.myMeta.detailsConfig = details

            function getExistingDetail( name  ) {
                for (var ix in me.myMeta.detailsConfig ) {
                    var vFld  =  me.myMeta.detailsConfig[ix];
                    if ( vFld.menuText == name ) {
                        return vFld
                        break ;
                    }
                }
            }

            function getDefaultDetail( name  ) {

                var rec =  elemTree.treeStore.getNodeById( name );
                return  {
                    menuText : rec.get( 'id' ),
                    conceptDetail :  rec.get( 'conceptDetail' ),
                    masterField :  "pk" ,
                    detailField :  rec.get( 'detailField' )
                    // detailTitleLbl :   rec.get( 'detailTitleLbl' ),
                    // detailTitlePattern :  rec.get( 'detailTitlePattern' )
                }
            }
        }
    }


});


/*
 * Lectura del arbol de detalles
 *
 */

Ext.define('ProtoUL.proto.ProtoDetailTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.detailDefTree',


 // @viewCode   Required
    viewCode : null,

//  @myMeta   Required
    myMeta : null,

    initComponent: function() {

        var me = this;
        me.addEvents('checkModif', 'loadComplete');

        definieDetailsConfigTreeModel( me.viewCode, me.myMeta.protoEntityId  );

        this.treeStore = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            model: 'Proto.DetailsTreeModel',
            root: {
                text: _SM.__language.Grid_Detail_Title,
                expanded: true
            },

            listeners: {
                load: function ( treeStore, records,  successful,  eOpts ) {
                    configureCurrentDetails()
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
                text: _SM.__language.Tree_Concept_Details_Text,
                flex: 2,
                sortable: true,
                minWidth: 200,
                dataIndex: 'id'
            },{
                text: _SM.__language.Tree_Concept_Details_Detail,
                dataIndex: 'conceptDetail'
            },{
                flex: 2,
                text: _SM.__language.Tree_Details_Field,
                dataIndex: 'detailField'
            }]

        })

        tree.on({
            'checkchange': {fn: function (  node,  checked,  eOpts ) {
                me.fireEvent('checkModif', node,  checked,  eOpts );
            }}, scope: me }
        );

        me.callParent(arguments);

        function configureCurrentDetails() {


            // Recorre el store y marca los campos activos
            // me.getView().getStore().each(function(record){
            me.getRootNode().cascadeBy(function(record){

                var lRec = {
                    'conceptDetail'  : record.get('conceptDetail' ),
                    'detailField' : record.get('detailField' )
                    }

                // Evita iterar en el root
                if ( lRec.conceptDetail )  {

                    // Marca los campos activos en la grilla
                    for (var ix in me.myMeta.detailsConfig ) {
                        var vFld  =  me.myMeta.detailsConfig[ix];

                        if (( vFld.conceptDetail == lRec.conceptDetail ) && ( vFld.detailField == lRec.detailField )) {
                            record.set( 'checked', true )

                            // Agrega los campos personalisados
                            record.set( 'id', vFld.menuText )
                            // record.set( 'detailTitleLbl', vFld.detailTitleLbl )
                            // record.set( 'detailTitlePattern', vFld.detailTitlePattern )

                            break;
                        }
                    }
                }
             })
        }

        function definieDetailsConfigTreeModel( viewCode , protoEntityId) {
            // Modelo usado en la lista de campos con la jerarquia completa de los de zoom ( detalle de fk )

            Ext.define('Proto.DetailsTreeModel', {
                extend: 'Ext.data.Model',
                proxy: {
                    type: 'ajax',
                    url: _SM._PConfig.urlGetDetailsTree ,
                    actionMethods: { read : 'POST' },
                    extraParams : {
                        viewCode : viewCode,
                        protoEntityId : protoEntityId
                    }
                },

                fields: [
                    {name: 'id', type: 'string'},
                    {name: 'menuText', type: 'string'},
                    {name: 'masterField', type: 'string'},
                    {name: 'detailField', type: 'string'},
                    {name: 'conceptDetail', type: 'string'},

                    {name: 'checked', type: 'boolean'},
                    {name: 'leaf', type: 'boolean'}
                ]

            });

        }
    }

});



