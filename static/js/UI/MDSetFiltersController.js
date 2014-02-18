/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */
/*global ProtoUL */

Ext.define('ProtoUL.UI.MDSetFiltersController', {
    extend : 'Ext.Base',
    myMeta : null,

    constructor : function(config) {
        Ext.apply(this, config || {});
        this.getCustomOptsBar();
    },

    getCustomOptsBar : function() {

        var myFilters = [], 
            nFiltre, vDet, tmpF1, pFilters, 
            __MasterDetail = this.__MasterDetail, 
            tmpFilters = this.myMeta.gridSets.filtersSet.concat(this.myMeta.custom.filtersSet);

        // Si no hay filtros definidos pero existe un filterAlph,
        if ((tmpFilters.length === 0) && this.myMeta.gridConfig.filterSetABC) {

            for (nFiltre in _SM.objConv(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'])) {
                tmpF1 = {};
                tmpF1['property'] = this.myMeta.gridConfig.filterSetABC;
                tmpF1['filterStmt'] = '^' + nFiltre;
                tmpFilters.push({
                    name : nFiltre,
                    filter : [tmpF1]
                });
            }
            tmpFilters.push({
                name : ' *',
                filter : {}
            });

        }

        for (vDet in tmpFilters ) {
            pFilters = tmpFilters[vDet];
            myFilters.push(new Ext.Action({
                name : pFilters.name,
                text : pFilters.menuText || pFilters.name,
                iconCls : pFilters.icon,
                maxWidth : 100,
                protoFilter : pFilters.customFilter,
                scope : this,
                handler : onClickProtoFilter
            }));

        }

        if (myFilters.length > 0) {

            __MasterDetail.tbFilters = Ext.create('Ext.toolbar.Toolbar', {
                dock : 'top',
                hidden : true,
                enableOverflow : true,
                items : [{
                    xtype : 'tbtext',
                    text : '<strong>Filtrer par :</strong>'
                }]
            });

            __MasterDetail.tbFilters.add(myFilters);
            __MasterDetail.myFilters = myFilters;
            __MasterDetail.protoMasterGrid.addDocked(__MasterDetail.tbFilters);

        };

        function onClickProtoFilter(btn) {
            __MasterDetail.protoMasterGrid.filterTitle = ' " ' + btn.text + ' "';
            __MasterDetail.protoMasterGrid.setGridTitle(__MasterDetail.protoMasterGrid);
            __MasterDetail.mdGridLoadData(btn.protoFilter);
        };

    }
}); 