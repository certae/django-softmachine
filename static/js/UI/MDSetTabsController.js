"use strict";
/*jslint nomen: true */
/*global Ext */
/*global _SM */
/*global ProtoUL */

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
            var tabConfig =  _SM.defineTabConfig( this.myMeta.gridConfig )

            addTabs( [ tabConfig ] )
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
            __MasterDetail.protoMasterGrid.configureColumns( btn.tabConfig );
        }

        function addTabs( tmpTabs ){
            var Tab
            for (var vDet in tmpTabs ) {
                Tab = tmpTabs[ vDet ]

                var tabConfig = {
                    name            : Tab.name,
                    listDisplay     : Tab.listDisplay,
                    hideRowNumbers  : Tab.hideRowNumbers || false ,
                    hideCheckSelect : Tab.hideCheckSelect || false
                }

                myTabs.push (
                    new Ext.Action({
                        text:           Tab.name,
                        iconCls :       Tab.icon,
                        maxWidth :      100,
                        tabConfig:      tabConfig ,
                        scope:          this,
                        handler:        onClickTab
                    }));
            };
        }
    }

});


_SM.defineTabConfig = function(  gridConfig  ) {
    // define un tab a partir de la conf de la grilla
    return {
        name : 'Default',
        icon : 'colSetIcon',
        listDisplay     : gridConfig.listDisplay,
        hideRowNumbers  : gridConfig.hideRowNumbers || false ,
        hideCheckSelect : gridConfig.hideCheckSelect || false
    }

}
