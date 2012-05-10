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
    
    addTabPanel: function( protoConcept, protoFilterBase , detailTitle  ){

    	var myMeta = _cllPCI[ protoConcept ] ;
    	var title = myMeta.shortTitle ; 
    	if ( protoFilterBase ) { title = '*' + title }

        var tab = this.add({
            title: title ,
            iconCls: myMeta.protoIcon , 
            closable: true, 
            layout: 'fit',
            items: [
                this.createProtoMasterDetail( protoConcept, protoFilterBase , detailTitle )
                ]
        });

        this.setActiveTab( tab )
    },

    createProtoMasterDetail: function( protoConcept, protoFilterBase, detailTitle ){

        var MDPanel = Ext.create('widget.protoMasterDetail', {
            protoConcept : protoConcept,
            protoFilterBase : protoFilterBase, 
            detailTitle : detailTitle 
        });
        return MDPanel;
    }
    

});

