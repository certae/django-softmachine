// Contiene  los tabs para crear las pcls

Ext.define('ProtoUL.view.ProtoTabContainer', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.protoTabContainer',
    // requires: ['ProtoUL.view.ProtoMasterDetail' ],
    // listeners: {
        // //DGT: Para arreglar un error reportado en ExtJs 4.0.7
        // 'tabchange': function(tabs, tab) { tab.down('gridpanel').view.refresh(); },
        // scope: this
    // },
    border : false,

    initComponent: function() {

        /*
         * @loCale
         * __TabContainer : Referencia al objeto padre de la interface
         */
        _SM.__TabContainer = this;
        this.callParent();
    },

    addTabPanel: function( viewCode, mdFilter , detailTitle  ){
        /*
         * FIx Ext.suspendLayouts();
         */

        var myMeta = _SM._cllPCI[ viewCode ] ;
        var title = myMeta.shortTitle ;
        if ( mdFilter ) { title = '*' + title ;}

        var tab = this.add({
            title: title ,
            viewCode : viewCode,
            border : false,
            tabConfig: {
                tooltip : title,
                width : 120
            },
            iconCls: myMeta.viewIcon ,
            closable: true,
            layout: 'fit',
            items: [ this.createProtoMasterDetail( viewCode, mdFilter , detailTitle ) ]
        });

        this.setActiveTab( tab );

        Ext.resumeLayouts(true);

    },

    createProtoMasterDetail: function( viewCode, mdFilter, detailTitle ){

        var MDPanel = Ext.create('widget.protoMasterDetail', {
            viewCode : viewCode,
            mdFilter    : mdFilter,
            detailTitle : detailTitle
        });
        return MDPanel;
    },


    closeProtoTab : function( viewCode  ){

        for (var ix = this.items.items.length;ix--;){
            var xTab = this.items.items[ix];
            if ( xTab.viewCode == viewCode  ){
              this.remove( xTab, true );
            }
        }

    },

    closeAllTabs : function(){
        for (var ix = this.items.items.length;ix--;){
          var xTab = this.items.items[ix];
          this.remove( xTab, true );
        }

        Ext.destroy(  Ext.ComponentQuery.query('protoZoom') );
        Ext.destroy(  Ext.ComponentQuery.query('protoForm') );
        Ext.destroy(  Ext.ComponentQuery.query('protoGrid') );
        Ext.destroy(  Ext.ComponentQuery.query('protoMasterDetail') );

        Ext.destroy( Ext.ComponentQuery.query('protoLogin') );
        Ext.destroy( Ext.ComponentQuery.query('protoSearch') );

    }


});

_SM.closeTabListener = function() {

    var x = 'TODO:  liberar la memoria';
    //_SM.__TabContainer.on
    // Ext.destroy(  Ext.ComponentQuery.query('protoZoom') )
    // Ext.destroy(  Ext.ComponentQuery.query('protoGrid') )

};
