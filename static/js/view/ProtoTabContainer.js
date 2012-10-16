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
    
    addTabPanel: function( protoOption, baseFilter , detailTitle  ){


        // FIX: Ext.suspendLayouts();
        
        var myMeta = _cllPCI[ protoOption ] ;
        var title = myMeta.shortTitle ; 
        if ( baseFilter ) { title = '*' + title }

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
            items: [
                // FIX: 
                  
                // this.createProtoMasterDetail( protoOption, baseFilter , detailTitle )
                this.protoMasterGrid = Ext.create('ProtoUL.view.ProtoGrid', {
                    border : false, 
                    protoOption : protoOption,  
                    baseFilter : baseFilter, 
                    // detFilter : this.detFilter, 
                    detailTitle : detailTitle, 
                    
                    region: 'center',
                    flex: 1,
                    layout: 'fit',
                    collapsible: false
                }) 
                
                
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

