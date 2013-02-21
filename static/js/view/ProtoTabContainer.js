// Contiene  los tabs para crear las pcls 

Ext.define('ProtoUL.view.ProtoTabContainer', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.protoTabContainer',
//    requires: ['ProtoUL.view.ProtoMasterDetail' ],
    
    // listeners: {
        // //DGT: Para arreglar un error reportado en ExtJs 4.0.7
        // 'tabchange': function(tabs, tab) { tab.down('gridpanel').view.refresh(); },
        // scope: this 
    // }, 
    border : false, 
    
    initComponent: function() {
        
        /*
         * @gloale 
         * __TabContainer : Referencia al objeto padre de la interface 
         */ 
        __TabContainer = this; 
        this.callParent();
    },
    
    addTabPanel: function( protoOption, mdFilter , detailTitle  ){

        // FIX: Ext.suspendLayouts();        
        var myMeta = _SM._cllPCI[ protoOption ] ;
        var title = myMeta.shortTitle ; 
        if ( mdFilter ) { title = '*' + title }

        var tab = this.add({
            title: title ,
            border : false, 
            tabConfig: {
                tooltip : title, 
                width : 120 
            },
            iconCls: myMeta.protoIcon , 
            closable: true, 
            layout: 'fit',
            items: [ this.createProtoMasterDetail( protoOption, mdFilter , detailTitle ) ]
        });

        this.setActiveTab( tab )
        
        Ext.resumeLayouts(true);

    },

    createProtoMasterDetail: function( protoOption, mdFilter, detailTitle ){

        var MDPanel = Ext.create('widget.protoMasterDetail', {
            protoOption : protoOption,
            mdFilter    : mdFilter, 
            detailTitle : detailTitle 
        });
        return MDPanel;
    }
    

});

