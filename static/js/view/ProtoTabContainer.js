// Contiene  los tabs para crear las pcls 

Ext.define('ProtoUL.view.ProtoTabContainer', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.protoTabContainer',
//    requires: ['ProtoUL.view.ProtoMasterDetail' ],
    
    listeners: {
        'tabchange': function(tabs, tab) {
            //DGT: Para arreglar un error reportado en ExtJs 4.0.7
            tab.down('gridpanel').view.refresh();
        },
        scope: this 
    }, 
    
    initComponent: function() {
        
        /*
         * @gloale 
         * __TabContainer : Referencia al objeto padre de la interface 
         */ 
        __TabContainer = this; 
        this.callParent();
    },
    
    addTabPanel: function( protoOption, baseFilter , detailTitle  ){

        Ext.suspendLayouts();
        
        var myMeta = _cllPCI[ protoOption ] ;
        var title = myMeta.shortTitle ; 
        if ( baseFilter ) { title = '*' + title }

        var tab = this.add({
            title: title ,
            tabConfig: {
                tooltip : title, 
                width : 120 
            },
            iconCls: myMeta.protoIcon , 
            closable: true, 
            layout: 'fit',
            items: [
                this.createProtoMasterDetail( protoOption, baseFilter , detailTitle )
                ]
        });

        this.setActiveTab( tab )
        
        Ext.resumeLayouts(true);

    },

    createProtoMasterDetail: function( protoOption, baseFilter, detailTitle ){

        var MDPanel = Ext.create('widget.protoMasterDetail', {
            protoOption : protoOption,
            baseFilter : baseFilter, 
            detailTitle : detailTitle 
        });
        return MDPanel;
    }
    

});

