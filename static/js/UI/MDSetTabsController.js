Ext.define('ProtoUL.UI.MDSetTabsController', {
    extend: 'Ext.Base',
    myMeta : null, 
    constructor: function (config) {
        Ext.apply(this, config || {});
        this.getCustomOptsBar()
    }, 

    getCustomOptsBar: function() {
        
        var myTabs = []  
        var __MasterDetail = this.__MasterDetail

        var tmpTabs = this.myMeta.gridSets.listDisplaySet.concat( this.myMeta.custom.listDisplaySet ) 

        if ( tmpTabs.length > 0 ) {
            addTabs( [ {
                'name' : 'Default', 
                'icon' : 'colSetIcon', 
                'listDisplay' :  this.myMeta.gridConfig.listDisplay
                } ] )
                
            addTabs( tmpTabs )                
        }


        if ( myTabs.length > 0  ) {

            __MasterDetail.tbTabs = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden : true,
                enableOverflow : true, 
                items: [
                    {
                    xtype   : 'tbtext',
                    text: '<b>Tabs :<b>'
                    }
                ]
            });

            __MasterDetail.tbTabs.add ( myTabs )
            __MasterDetail.myTabs = myTabs
            __MasterDetail.protoMasterGrid.addDocked( __MasterDetail.tbTabs )

        }; 
        
        function onClickTab( btn ){
            __MasterDetail.protoMasterGrid.configureColumns( btn.listDisplay , btn.text );
        }
        
        function addTabs( tmpTabs ){
            var Tab
            for (var vDet in tmpTabs ) {       
                Tab = tmpTabs[ vDet ]
                myTabs.push (
                    new Ext.Action({
                        text:           Tab.name,
                        iconCls :       Tab.icon, 
                        maxWidth :      100, 
                        listDisplay:    Tab.listDisplay,
                        scope:          this,                     
                        handler:        onClickTab
                    }));
            };
        }
    }
    
}) 


