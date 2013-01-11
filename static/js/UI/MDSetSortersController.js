Ext.define('ProtoUL.UI.MDSetSortersController', {
    extend: 'Ext.Base',
    myMeta : null, 
    constructor: function (config) {
        Ext.apply(this, config || {});
        this.getCustomOptsBar()
    }, 

    getCustomOptsBar: function() {
        
        var mySortersSet = []  
        var __MasterDetail = this.__MasterDetail

        if ( this.myMeta.gridConfig.initialFilter && ( this.myMeta.gridConfig.others.sortersSet  || this.myMeta.custom.sortersSet )) {
            addSorters( [ {
                'name' : 'Initial', 
                'icon' : 'soterIcon', 
                'sorter' :  this.myMeta.gridConfig.initialFilter
                } ] )
        }

        if ( this.myMeta.gridConfig.others.sortersSet  ) {
            addSorters( this.myMeta.gridConfig.others.sortersSet )
        }

        if ( this.myMeta.custom.sortersSet ) {
            addSorters( this.myMeta.custom.sortersSet )
        }

        if ( mySortersSet.length > 0  ) {

            __MasterDetail.tbSortersSet = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden : true,
                enableOverflow : true, 
                items: [
                    {
                    xtype   : 'tbtext',
                    text: '<b>Sorters :<b>'
                    }
                ]
            });

            __MasterDetail.tbSortersSet.add ( mySortersSet )
            __MasterDetail.mySortersSet = mySortersSet
            __MasterDetail.protoMasterGrid.addDocked( __MasterDetail.tbSortersSet )

        }; 
        
        function onClickSorter( btn ){
            __MasterDetail.protoMasterStore.sort( btn.sorter );
        }
        
        function addSorters( tmpSorters ){
            var Sorter
            for (var vDet in tmpSorters ) {       
                Sorter = tmpSorters[ vDet ]
                mySortersSet.push (
                    new Ext.Action({
                        text:           Sorter.name,
                        iconCls :       Sorter.icon, 
                        maxWidth :      100, 
                        sorter:         Sorter.sorter,
                        scope:          this,                     
                        handler:        onClickSorter
                    }));
            };
        }
    }
    
}) 


