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
            // TODO: "actionType",  filtrar solo user  
            var pProtoAction = this.myMeta.actions[ ix ]
            myProtoActions.push (
                new Ext.Action({
                    text:           pProtoAction.menuText || pProtoAction.name,
                    actionName:     pProtoAction.name,
                    iconCls :       pProtoAction.protoIcon, 
                    tooltip:        pProtoAction.description,
                    actionDef :     pProtoAction,
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
            var pAction = btn.actionDef

            // "selectionMode", 
            if (( pAction.selectionMode == "single"  ) && ( selectedKeys.length != 1 )) {
                __StBar.showMessage(  btn.actionName + 'TITLE_ACTION_SELECTION_SINLGLE' )
                return 
            } else if (( pAction.selectionMode == "multiple"  ) && ( selectedKeys.length < 1 )) {
                __StBar.showMessage(  btn.actionName + 'TITLE_ACTION_SELECTION_MULTI' )
                return 
            }  


            // actionParams
            if ( pAction.actionParams > 0 ) {
                @@@
            }                    
            

            var options = {
                scope : me,
                success : function(result, request) {
                    var myResult = Ext.decode( result.responseText );
                    __StBar.showMessage( btn.actionName + ' ' +  myResult.message , 'MDActionsController', 3000 )

                    //TODO: "refreshOnComplete"

                }, 
                failure: function(result, request) {
                    __StBar.showError( btn.actionName + ' ' +  result.statusText , 'MDActionsController' )

                }
            }
            
            __StBar.showMessage( 'executing  ' + btn.actionName + '...', 'MDActionsController' )
            doProtoActions( pGrid.protoOption, btn.actionName , selectedKeys , options  )
            
        };
        
    } 
    
    
}) 
