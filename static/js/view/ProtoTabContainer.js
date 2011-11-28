// Contiene  los tabs para crear las pcls 

Ext.define('ProtoUL.view.ProtoTabContainer', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.protoTabContainer',
    requires: ['ProtoUL.view.ProtoMasterDetail', ],

    initComponent: function() {
        this.tabBar = {
            border: false
        };
        
        
        __TabContainer = this; 
        
        this.callParent();
    },
    
    addTabPanel: function( protoConcept, protoFilterBase  ){

        var myMeta = _cllPCI[ protoConcept ] ;
                                 
        var tab = this.add({
            title: myMeta.shortTitle  ,
            closable: true, 
            layout: 'fit',
            items: [
                this.createProtoMasterDetail( protoConcept, protoFilterBase ),
                ], 
        });

        this.setActiveTab(tab)
    },

    createProtoMasterDetail: function( protoConcept, protoFilterBase   ){

        var MDPanel = Ext.create('widget.protoMasterDetail', {
            protoConcept : protoConcept,
            protoFilterBase : protoFilterBase,
        });
        return MDPanel;
    },
    

});

