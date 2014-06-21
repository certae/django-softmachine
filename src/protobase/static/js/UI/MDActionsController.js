/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.UI.MDActionsController', {
    extend: 'Ext.Base',
    myMeta: null,
    constructor: function(config) {
        Ext.apply(this, config || {});
        this.getProtoActionsBar();
    },

    getProtoActionsBar: function() {

        var perms = _SM._UserInfo.perms[this.myMeta.viewCode];
        if (!(perms['add'] || perms['change'] || perms['delete'])) {
            return;
        }
        // if ( ! _SM._UserInfo.isStaff ) return

        // @formatter:off
        var me = this, ix, pProtoAction,
            myProtoActions = [],  
            __MasterDetail = this.__MasterDetail;
        // @formatter:on

        if (this.myMeta.WFlowActions) {
            for (ix in this.myMeta.WFlowActions ) {
                pProtoAction = this.myMeta.WFlowActions[ix];

                pProtoAction.menuText = pProtoAction.menuText || pProtoAction.name;
                pProtoAction.actionType = 'wflow';
                pProtoAction.selectionMode = 'multiple';
                pProtoAction.refreshOnComplete = true;

                if (pProtoAction.admMessagePropmt) {
                    pProtoAction.actionParams = [{
                        'name': 'admMessage',
                        'tooltip': pProtoAction.description,
                        'fieldLabel': pProtoAction.admMessagePropmt,
                        'type': 'string',
                        'required': true
                    }];

                } else {
                    pProtoAction.actionParams = [];
                }

                myProtoActions.push(new Ext.Action({
                    text: pProtoAction.menuText,
                    actionName: pProtoAction.name,
                    iconCls: pProtoAction.viewIcon,
                    tooltip: pProtoAction.description,
                    actionDef: pProtoAction,
                    scope: me,
                    handler: onClickDoAction
                }));
            };

        }

        for ( ix in this.myMeta.actions  ) {
            pProtoAction = this.myMeta.actions[ix];
            pProtoAction.menuText = pProtoAction.menuText || pProtoAction.name;
            myProtoActions.push(new Ext.Action({
                text: pProtoAction.menuText,
                actionName: pProtoAction.name,
                iconCls: pProtoAction.viewIcon,
                tooltip: pProtoAction.description,
                actionDef: pProtoAction,
                scope: me,
                handler: onClickDoAction
            }));
        };

        if (myProtoActions.length > 0) {

            __MasterDetail.tbProtoActions = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden: true,
                enableOverflow: true,
                items: [{
                    xtype: 'tbtext',
                    text: '<strong>Actions :</strong>'
                }]
            });

            __MasterDetail.tbProtoActions.add(myProtoActions);
            __MasterDetail.myProtoActions = myProtoActions;
            __MasterDetail.protoMasterGrid.addDocked(__MasterDetail.tbProtoActions);

        };

        function onClickDoAction(btn) {

            var pGrid = __MasterDetail.protoMasterGrid;
            var selectedKeys = pGrid.getSelectedIds();
            var pAction = btn.actionDef;
            var myOptions, myWin;
            var detKeys = {};

            // "selectionMode",
            if ((pAction.selectionMode == "single"  ) && (selectedKeys.length != 1 )) {
                _SM.__StBar.showMessage('TITLE_ACTION_SELECTION_SINLGLE', btn.actionName, 3000);
                return;

            } else if ((pAction.selectionMode == "multiple"  ) && (selectedKeys.length < 1 )) {
                _SM.__StBar.showMessage('TITLE_ACTION_SELECTION_MULTI', btn.actionName, 3000);
                return;

            } else if (pAction.selectionMode == "details"  ) {

                for (ix in this.__MasterDetail.protoTabs.items.items ) {
                    pdetGrid = this.__MasterDetail.protoTabs.items.items[ix];
                    detKeys[ pdetGrid.detailDefinition.detailName ]  = pdetGrid.getSelectedIds();
                }
            }

            // actionParams
            pAction.actionParams = _SM.verifyList(pAction.actionParams);
            if (pAction.executeJS){
            	eval(pAction.jsCode);
            } else {
                if (pAction.actionParams.length == 0) {
                	this.doAction(me, pGrid.viewCode, btn.actionDef, selectedKeys, [], detKeys);
            	} else {
                	myOptions = {
                    	scope: me,
                    	acceptFn: function(parameters) {
                        	this.doAction(me, pGrid.viewCode, btn.actionDef, selectedKeys, parameters, detKeys);
                    	}

                	};

                    myWin = Ext.create('ProtoUL.ux.parameterWin', {
                        parameters: pAction.actionParams,
                        title: btn.actionName,
                        options: myOptions
                    });

                    myWin.show();

                };
            }
        };

    },

    doAction: function(me, viewCode, actionDef, selectedKeys, parameters, detKeys) {

        var options = {
            scope: me,
            success: function(result, request) {
                var myResult = Ext.decode(result.responseText);
                _SM.__StBar.showMessage(actionDef.name + ' ' + myResult.message, 'MDActionsController', 3000);

                if (myResult.success && actionDef.refreshOnComplete) {
                    this.__MasterDetail.mdGridReload();
                }

                if (myResult.fileName) {
                    _SM.getFile(myResult.fileName, true);
                }

            },
            failure: function(result, request) {
                _SM.__StBar.showError(actionDef.name + ' ' + result.statusText, 'MDActionsController');

            }

        };

        _SM.__StBar.showMessage('executing  ' + actionDef.name + '...', 'MDActionsController');
        _SM.doProtoActions(viewCode, actionDef.name, selectedKeys, detKeys, parameters, actionDef, options);

    }

});