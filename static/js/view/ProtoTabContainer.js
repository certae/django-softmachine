// Contiene  los tabs para crear las pcls 

Ext.define('ProtoUL.view.ProtoTabContainer', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.protoTabContainer',
    requires: ['ProtoUL.view.ProtoMasterDetail' ],
    
    listeners: {
        'tabchange': function(tabs, tab) {
        	//DGT: Para arreglar un error reportado en ExtJs 4.0.7
        	//  http://www.sencha.com/forum/showthread.php?41280-GridPanel-in-RowExpander-and-Vertical-Scrollbar
        	tab.down('gridpanel').view.refresh();
        },
        scope: this 
    }, 
    
    initComponent: function() {
        
        __TabContainer = this; 
        this.callParent();
    },
    
    addTabPanel: function( protoConcept, protoFilterBase  ){

        var myMeta = _cllPCI[ protoConcept ] ;
                                 
        var tab = this.add({
            title: myMeta.shortTitle  ,
            iconCls: myMeta.protoIcon , 
            closable: true, 
            layout: 'fit',
            items: [
                this.createProtoMasterDetail( protoConcept, protoFilterBase )
                ]
        });

        this.setActiveTab(tab)
    },

    createProtoMasterDetail: function( protoConcept, protoFilterBase   ){

        var MDPanel = Ext.create('widget.protoMasterDetail', {
            protoConcept : protoConcept,
            protoFilterBase : protoFilterBase
        });
        return MDPanel;
    }
    

});

