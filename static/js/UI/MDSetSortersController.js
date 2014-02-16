Ext.define('ProtoUL.UI.MDSetSortersController', {
    extend: 'Ext.Base',
    myMeta: null,
    constructor: function(config) {
        Ext.apply(this, config || {});
        this.getCustomOptsBar();
    },

    getCustomOptsBar: function() {

        // @formatter:off        
        var mySortersSet = [],  
            __MasterDetail = this.__MasterDetail, 
            tmpSorters = this.myMeta.gridSets.sortersSet.concat( this.myMeta.custom.sortersSet );
        // @formatter:on

        if (this.myMeta.gridConfig.initialSort && (tmpSorters.length > 0  )) {
            addSorters([{
                'name': 'Initial',
                'icon': 'soterIcon',
                'customSort': this.myMeta.gridConfig.initialSort
            }]);

            addSorters(tmpSorters);
        }

        if (mySortersSet.length > 0) {

            __MasterDetail.tbSortersSet = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden: true,
                enableOverflow: true,
                items: [{
                    xtype: 'tbtext',
                    text: '<strong>Sorters :</strong>'
                }]
            });

            __MasterDetail.tbSortersSet.add(mySortersSet);
            __MasterDetail.mySortersSet = mySortersSet;
            __MasterDetail.protoMasterGrid.addDocked(__MasterDetail.tbSortersSet);

        };

        function onClickSorter(btn) {
            __MasterDetail.protoMasterStore.sort(btn.sorter);
        }

        function addSorters(tmpSorters) {
            var Sorter;
            for (var vDet in tmpSorters ) {
                Sorter = tmpSorters[vDet];
                mySortersSet.push(new Ext.Action({
                    maxWidth: 100,
                    text: Sorter.name,
                    iconCls: Sorter.icon,
                    sorter: Sorter.customSort,
                    scope: this,
                    handler: onClickSorter
                }));
            };
        }

    }

});