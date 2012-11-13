Ext.define('ProtoUL.UI.MDActionsController', {
    extend: 'Ext.Base',
    myMeta : null, 
    constructor: function (config) {
        Ext.apply(this, config || {});
        this.getProtoActionsBar()
    }, 

    getProtoActionsBar: function() {

        if ( ! _UserInfo.isStaff ) return  

        var me = this; 
        var myProtoActions = []  
        var __MasterDetail = this.__MasterDetail


        for (var ix in this.myMeta.actions  ) {       
            var pProtoActions = this.myMeta.actions[ ix ]
            myProtoActions.push (
                new Ext.Action({
                    text:           pProtoActions.menuText || pProtoActions.name,
                    actionName:     pProtoActions.name,
                    iconCls :       pProtoActions.protoIcon, 
                    tooltip:        pProtoActions.description,
                    scope:          me,                     
                    handler:        onClickDoAction
                }));
        };
     

        if ( myProtoActions.length > 0  ) {

            __MasterDetail.tbProtoActions = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden : true,
                enableOverflow : true, 
                items: [{
                    xtype   : 'tbtext',
                    text: '<b>Actions :<b>'
                }]
            });

            __MasterDetail.tbProtoActions.add ( myProtoActions )
            __MasterDetail.myProtoActions = myProtoActions
            __MasterDetail.protoMasterGrid.addDocked( __MasterDetail.tbProtoActions )

        }; 
        
        function onClickDoAction( btn ){
            var pGrid = __MasterDetail.protoMasterGrid ;
            var selectedKeys = pGrid.getSelectedIds()

            var options = {
                scope : me,
                success : function(result, request) {
                    console.log( '@@@@@@@' + result )
                }
            }
            
            doProtoActions( pGrid.protoOption, btn.actionName , selectedKeys , options  )
            
        };
        
    } 
    
    
}) 
